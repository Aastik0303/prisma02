import mammoth from 'mammoth';
import { PDFParse } from 'pdf-parse';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';
import { AppError } from '../../app.js';

export const MAX_RESUME_BYTES = 5 * 1024 * 1024;
export const MAX_RESUME_TEXT_LENGTH = 50_000;

const PDF_MIME = 'application/pdf';
const DOCX_MIMES = new Set([
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/octet-stream'
]);

export type ExtractedPdfLayout = {
  pages: Array<{
    page: number;
    width: number;
    height: number;
  }>;
  blocks: Array<{
    page: number;
    text: string;
    x: number;
    y: number;
    width: number;
    height: number;
    fontSize: number;
    fontFamily: string;
  }>;
};

function hasPdfSignature(buffer: Buffer) {
  return buffer.subarray(0, 5).toString('ascii') === '%PDF-';
}

function hasZipSignature(buffer: Buffer) {
  const signature = buffer.subarray(0, 4).toString('hex');
  return signature === '504b0304' || signature === '504b0506' || signature === '504b0708';
}

function decodePdfString(value: string) {
  return value
    .replace(/\\([nrtbf()\\])/g, (_, char: string) => {
      switch (char) {
        case 'n': return '\n';
        case 'r': return '\r';
        case 't': return '\t';
        case 'b': return '\b';
        case 'f': return '\f';
        default: return char;
      }
    })
    .replace(/\\([0-7]{1,3})/g, (_, octal: string) => String.fromCharCode(parseInt(octal, 8)));
}

function decodePdfHexString(value: string) {
  const normalized = value.replace(/\s+/g, '');
  let text = '';
  for (let i = 0; i + 1 < normalized.length; i += 2) {
    const code = parseInt(normalized.slice(i, i + 2), 16);
    if (Number.isFinite(code) && code >= 9 && code !== 0) text += String.fromCharCode(code);
  }
  return text;
}

function extractRawPdfText(buffer: Buffer) {
  const source = buffer.toString('latin1');
  const parts: string[] = [];

  for (const match of source.matchAll(/\(((?:\\.|[^\\)]){2,})\)\s*Tj/g)) {
    parts.push(decodePdfString(match[1]));
  }

  for (const match of source.matchAll(/<([0-9a-fA-F\s]{4,})>\s*Tj/g)) {
    parts.push(decodePdfHexString(match[1]));
  }

  for (const match of source.matchAll(/\[((?:\s*(?:\((?:\\.|[^\\)])*\)|<[0-9a-fA-F\s]+>|-?\d+(?:\.\d+)?))+)\s*\]\s*TJ/g)) {
    const arrayBody = match[1];
    for (const stringMatch of arrayBody.matchAll(/\(((?:\\.|[^\\)])*)\)|<([0-9a-fA-F\s]+)>/g)) {
      parts.push(stringMatch[1] !== undefined
        ? decodePdfString(stringMatch[1])
        : decodePdfHexString(stringMatch[2]));
    }
    parts.push('\n');
  }

  return parts.join(' ');
}

async function extractPdfText(buffer: Buffer) {
  const parser = new PDFParse({ data: new Uint8Array(buffer) });
  try {
    const attempts = [
      () => parser.getText(),
      () => parser.getText({
        parseHyperlinks: true,
        includeMarkedContent: true,
        itemJoiner: ' ',
        cellSeparator: ' ',
        pageJoiner: '\n'
      }),
      () => parser.getText({
        disableNormalization: true,
        includeMarkedContent: true,
        itemJoiner: ' ',
        cellSeparator: ' ',
        pageJoiner: '\n'
      })
    ];

    let bestText = '';
    for (const attempt of attempts) {
      const text = sanitizeResumeText((await attempt()).text);
      if (text.length > bestText.length) bestText = text;
      if (bestText.length >= 50) return bestText;
    }

    const rawText = sanitizeResumeText(extractRawPdfText(buffer));
    return rawText.length > bestText.length ? rawText : bestText;
  } finally {
    await parser.destroy();
  }
}

function roundLayoutNumber(value: number) {
  return Math.round(value * 100) / 100;
}

function normalizePdfFont(fontName = '') {
  const clean = fontName.replace(/^[A-Z0-9]{6}\+/, '').replace(/[_-]+/g, ' ').trim();
  if (/times|serif/i.test(clean)) return 'Times New Roman, serif';
  if (/courier|mono/i.test(clean)) return 'Courier New, monospace';
  return 'Arial, sans-serif';
}

function mergePdfLineBlocks(blocks: ExtractedPdfLayout['blocks']) {
  const merged: ExtractedPdfLayout['blocks'] = [];
  const sorted = [...blocks].sort((a, b) => a.page - b.page || a.y - b.y || a.x - b.x);

  for (const block of sorted) {
    const previous = merged[merged.length - 1];
    const sameLine = previous
      && previous.page === block.page
      && Math.abs(previous.y - block.y) <= Math.max(3, previous.fontSize * 0.35);

    if (!sameLine) {
      merged.push({ ...block });
      continue;
    }

    const gap = block.x - (previous.x + previous.width);
    const joiner = gap > previous.fontSize * 0.3 ? ' ' : '';
    previous.text = `${previous.text}${joiner}${block.text}`.trim().slice(0, 2000);
    const right = Math.max(previous.x + previous.width, block.x + block.width);
    previous.x = roundLayoutNumber(Math.min(previous.x, block.x));
    previous.y = roundLayoutNumber(Math.min(previous.y, block.y));
    previous.width = roundLayoutNumber(right - previous.x);
    previous.height = roundLayoutNumber(Math.max(previous.height, block.height));
    previous.fontSize = roundLayoutNumber(Math.max(previous.fontSize, block.fontSize));
  }

  return merged;
}

async function extractPdfLayout(buffer: Buffer): Promise<ExtractedPdfLayout | undefined> {
  const loadingTask = getDocument({
    data: new Uint8Array(buffer),
    disableFontFace: true,
    isEvalSupported: false,
    useSystemFonts: true
  });

  const document = await loadingTask.promise;
  try {
    const pages: ExtractedPdfLayout['pages'] = [];
    const blocks: ExtractedPdfLayout['blocks'] = [];

    for (let pageNumber = 1; pageNumber <= Math.min(document.numPages, 10); pageNumber += 1) {
      const page = await document.getPage(pageNumber);
      const viewport = page.getViewport({ scale: 1 });
      pages.push({
        page: pageNumber,
        width: roundLayoutNumber(viewport.width),
        height: roundLayoutNumber(viewport.height)
      });

      const content = await page.getTextContent({ includeMarkedContent: false });
      for (const rawItem of content.items) {
        if (!('str' in rawItem)) continue;
        const text = sanitizeResumeText(String(rawItem.str || ''));
        if (!text) continue;

        const item = rawItem as typeof rawItem & {
          width?: number;
          height?: number;
          fontName?: string;
          transform?: number[];
        };
        const transform = item.transform || [1, 0, 0, 1, 0, 0];
        const fontSize = Math.max(6, Math.min(40, Math.hypot(transform[2] || 0, transform[3] || 0) || item.height || 10));
        const x = transform[4] || 0;
        const y = viewport.height - (transform[5] || 0) - fontSize;

        blocks.push({
          page: pageNumber,
          text: text.slice(0, 2000),
          x: roundLayoutNumber(Math.max(0, x)),
          y: roundLayoutNumber(Math.max(0, y)),
          width: roundLayoutNumber(Math.max(item.width || text.length * fontSize * 0.45, 2)),
          height: roundLayoutNumber(Math.max(item.height || fontSize * 1.2, fontSize)),
          fontSize: roundLayoutNumber(fontSize),
          fontFamily: normalizePdfFont(item.fontName)
        });
      }
    }

    const lineBlocks = mergePdfLineBlocks(blocks).filter(block => block.text.length >= 2);
    return lineBlocks.length ? { pages, blocks: lineBlocks.slice(0, 900) } : undefined;
  } finally {
    await document.destroy();
  }
}

export function sanitizeResumeText(value: string) {
  return value
    .normalize('NFKC')
    .replace(/\0/g, '')
    .replace(/[\u0001-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, ' ')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{4,}/g, '\n\n\n')
    .replace(/[ \t]{3,}/g, '  ')
    .trim()
    .slice(0, MAX_RESUME_TEXT_LENGTH);
}

export async function extractResumeText(input: {
  buffer: Buffer;
  filename: string;
  mimetype: string;
}) {
  return (await extractResumeDocument(input)).text;
}

export async function extractResumeDocument(input: {
  buffer: Buffer;
  filename: string;
  mimetype: string;
}) {
  const extension = input.filename.toLowerCase().split('.').pop();

  if (input.buffer.length === 0 || input.buffer.length > MAX_RESUME_BYTES) {
    throw new AppError(400, 'INVALID_RESUME_SIZE', 'Resume must be between 1 byte and 5 MB.');
  }

  let rawText = '';
  let uploadedPdfLayout: ExtractedPdfLayout | undefined;

  try {
    if (extension === 'pdf' && input.mimetype === PDF_MIME && hasPdfSignature(input.buffer)) {
      rawText = await extractPdfText(input.buffer);
      uploadedPdfLayout = await extractPdfLayout(input.buffer);
    } else if (extension === 'docx' && DOCX_MIMES.has(input.mimetype) && hasZipSignature(input.buffer)) {
      rawText = (await mammoth.extractRawText({ buffer: input.buffer })).value;
    } else {
      throw new AppError(400, 'UNSUPPORTED_RESUME_FILE', 'Only valid PDF and DOCX files are accepted.');
    }
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(422, 'RESUME_EXTRACTION_FAILED', 'The resume text could not be extracted.');
  }

  const text = sanitizeResumeText(rawText);
  if (text.length < 50) {
    throw new AppError(
      422,
      'INSUFFICIENT_RESUME_TEXT',
      'This PDF has too little selectable text for ATS scanning. If it was exported as an image, paste the resume text below or export it as DOCX/text first.'
    );
  }

  return {
    text,
    uploadedPdfLayout
  };
}
