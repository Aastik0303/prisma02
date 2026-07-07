import mammoth from 'mammoth';
import { PDFParse } from 'pdf-parse';
import { AppError } from '../../app.js';

export const MAX_RESUME_BYTES = 5 * 1024 * 1024;
export const MAX_RESUME_TEXT_LENGTH = 50_000;

const PDF_MIME = 'application/pdf';
const DOCX_MIMES = new Set([
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/octet-stream'
]);

function hasPdfSignature(buffer: Buffer) {
  return buffer.subarray(0, 5).toString('ascii') === '%PDF-';
}

function hasZipSignature(buffer: Buffer) {
  const signature = buffer.subarray(0, 4).toString('hex');
  return signature === '504b0304' || signature === '504b0506' || signature === '504b0708';
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
  const extension = input.filename.toLowerCase().split('.').pop();

  if (input.buffer.length === 0 || input.buffer.length > MAX_RESUME_BYTES) {
    throw new AppError(400, 'INVALID_RESUME_SIZE', 'Resume must be between 1 byte and 5 MB.');
  }

  let rawText = '';

  try {
    if (extension === 'pdf' && input.mimetype === PDF_MIME && hasPdfSignature(input.buffer)) {
      const parser = new PDFParse({ data: new Uint8Array(input.buffer) });
      try {
        rawText = (await parser.getText()).text;
      } finally {
        await parser.destroy();
      }
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
      'The file contains too little readable text. Scanned PDFs require OCR before upload.'
    );
  }

  return text;
}

