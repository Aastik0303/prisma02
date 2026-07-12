import type { ParsedResumeJson, TemplateConfig } from './resume.schema.js';
import puppeteer, { type Browser } from 'puppeteer';

const escapeHtml = (value = '') => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#039;');

const pushSection = (lines: string[], title: string, body: string[]) => {
  const cleanBody = body.map(line => line.trim()).filter(Boolean);
  if (!cleanBody.length) return;
  if (lines.length) lines.push('');
  lines.push(title.toUpperCase());
  lines.push(...cleanBody);
};

const px = (value: number) => `${Math.round(value * 100) / 100}px`;

export function resumeJsonToLines(data: ParsedResumeJson) {
  const lines: string[] = [];
  const personal = data.personal_info || {};
  if (personal.name) lines.push(personal.name);
  const contact = [personal.email, personal.phone, personal.location].filter(Boolean).join(' | ');
  if (contact) lines.push(contact);
  if (personal.links?.length) lines.push(personal.links.map(link => link.url).join(' | '));

  pushSection(lines, 'Summary', data.summary ? [data.summary] : []);
  pushSection(lines, 'Skills', data.skills?.length ? [data.skills.join(' | ')] : []);
  pushSection(lines, 'Experience', (data.experience || []).flatMap(item => [
    [item.title, item.company, [item.startDate, item.endDate].filter(Boolean).join(' - ')].filter(Boolean).join(' | '),
    ...(item.bullets || []).map(bullet => `- ${bullet}`)
  ]));
  pushSection(lines, 'Projects', (data.projects || []).flatMap(item => [
    [item.title, item.url].filter(Boolean).join(' | '),
    ...(item.bullets || []).map(bullet => `- ${bullet}`)
  ]));
  pushSection(lines, 'Education', (data.education || []).flatMap(item => [
    [item.degree, item.institution, [item.startDate, item.endDate].filter(Boolean).join(' - ')].filter(Boolean).join(' | '),
    ...(item.details || []).map(detail => `- ${detail}`)
  ]));

  return lines;
}

export function renderResumeHtml(input: {
  data: ParsedResumeJson;
  template: TemplateConfig;
  sourceText?: string;
}) {
  if (input.template.uploadedPdf?.blocks?.length) {
    return renderUploadedPdfHtml(input);
  }

  const { data, template } = input;
  const colors = {
    text: template.colors.text || '#0f172a',
    muted: template.colors.muted || '#475569',
    accent: template.colors.accent || '#4f46e5',
    background: template.colors.background || '#ffffff'
  };
  const font = template.fonts.body?.family || 'Inter, Arial, sans-serif';
  const page = template.page;
  const innerPadding = Math.max(8, Math.min(30, Math.round((page.margin || 48) * 0.352778)));

  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    @page { size: A4; margin: 0; }
    html, body {
      margin: 0;
      padding: 0;
      width: 210mm;
      min-height: 297mm;
      background: ${colors.background};
      color: ${colors.text};
      font-family: ${font};
      font-size: ${template.fonts.body?.size || 10}pt;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .page {
      width: 210mm;
      min-height: 297mm;
      padding: ${innerPadding}mm 20mm;
      background: ${colors.background};
      overflow: hidden;
    }
    h1 { margin: 0; font-size: ${template.fonts.name?.size || 24}pt; color: ${colors.text}; line-height: 1.05; }
    h2 { margin: 12pt 0 5pt; padding-bottom: 3pt; border-bottom: 1pt solid ${colors.accent}; font-size: ${template.fonts.heading?.size || 11}pt; color: ${colors.accent}; text-transform: uppercase; break-after: avoid; }
    p { margin: 0 0 4pt; line-height: 1.35; }
    ul { margin: 3pt 0 7pt 14pt; padding: 0; }
    li { margin: 0 0 3pt; line-height: 1.3; break-inside: avoid; }
    .muted { color: ${colors.muted}; }
    .row { display: flex; justify-content: space-between; gap: 14pt; }
    section { break-inside: avoid; }
  </style>
</head>
<body>
  <main class="page">
    <h1>${escapeHtml(data.personal_info?.name || 'Resume')}</h1>
    <p class="muted">${escapeHtml([data.personal_info?.email, data.personal_info?.phone, data.personal_info?.location].filter(Boolean).join(' | '))}</p>
    ${data.summary ? `<section><h2>Summary</h2><p>${escapeHtml(data.summary)}</p></section>` : ''}
    ${data.skills?.length ? `<section><h2>Skills</h2><p>${escapeHtml(data.skills.join(' | '))}</p></section>` : ''}
    ${data.experience?.length ? `<section><h2>Experience</h2>${data.experience.map(item => `<p><strong>${escapeHtml([item.title, item.company].filter(Boolean).join(', '))}</strong> <span class="muted">${escapeHtml([item.startDate, item.endDate].filter(Boolean).join(' - '))}</span></p><ul>${item.bullets.map(bullet => `<li>${escapeHtml(bullet)}</li>`).join('')}</ul>`).join('')}</section>` : ''}
    ${data.projects?.length ? `<section><h2>Projects</h2>${data.projects.map(item => `<p><strong>${escapeHtml(item.title)}</strong>${item.url ? ` <span class="muted">${escapeHtml(item.url)}</span>` : ''}</p><ul>${item.bullets.map(bullet => `<li>${escapeHtml(bullet)}</li>`).join('')}</ul>`).join('')}</section>` : ''}
    ${data.education?.length ? `<section><h2>Education</h2>${data.education.map(item => `<p><strong>${escapeHtml([item.degree, item.institution].filter(Boolean).join(', '))}</strong> <span class="muted">${escapeHtml([item.startDate, item.endDate].filter(Boolean).join(' - '))}</span></p>${item.details?.length ? `<ul>${item.details.map(detail => `<li>${escapeHtml(detail)}</li>`).join('')}</ul>` : ''}`).join('')}</section>` : ''}
  </main>
</body>
</html>`;
}

function renderUploadedPdfHtml(input: {
  data: ParsedResumeJson;
  template: TemplateConfig;
  sourceText?: string;
}) {
  const { template, sourceText } = input;
  const layout = template.uploadedPdf!;
  const colors = {
    text: template.colors.text || '#0f172a',
    background: template.colors.background || '#ffffff'
  };
  const lines = sourceText
    ? sourceText.replace(/\r\n/g, '\n').split('\n').map(line => line.trimEnd())
    : resumeJsonToLines(input.data);
  const blocks = [...layout.blocks].sort((a, b) => a.page - b.page || a.y - b.y || a.x - b.x);
  const pages = layout.pages.length
    ? layout.pages
    : [{ page: 1, width: template.page.width || 595, height: template.page.height || 842 }];
  const firstPage = pages[0];

  let lineIndex = 0;
  const pageHtml = pages.map(page => {
    const blocksHtml = blocks
      .filter(block => block.page === page.page)
      .map(block => {
        const text = lines[lineIndex] || '';
        lineIndex += 1;
        if (!text) return '';
        const isHeading = /^[A-Z][A-Z0-9 &/+-]{2,}$/.test(text);
        return `<div class="pdf-text ${isHeading ? 'heading' : ''}" style="left:${px(block.x)};top:${px(block.y)};width:${px(Math.max(block.width, 60))};min-height:${px(block.height)};font-size:${px(block.fontSize)};font-family:${escapeHtml(block.fontFamily)};">${escapeHtml(text)}</div>`;
      })
      .join('');

    return `<section class="pdf-page" style="width:${px(page.width)};height:${px(page.height)};">${blocksHtml}</section>`;
  }).join('');

  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    @page { size: ${px(firstPage.width)} ${px(firstPage.height)}; margin: 0; }
    html, body {
      margin: 0;
      padding: 0;
      background: ${colors.background};
      color: ${colors.text};
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .pdf-page {
      position: relative;
      overflow: hidden;
      page-break-after: always;
      background: ${colors.background};
    }
    .pdf-page:last-child { page-break-after: auto; }
    .pdf-text {
      position: absolute;
      white-space: pre-wrap;
      line-height: 1.16;
      overflow: hidden;
    }
    .pdf-text.heading {
      font-weight: 700;
      letter-spacing: .02em;
    }
  </style>
</head>
<body>
  ${pageHtml}
</body>
</html>`;
}

let browserPromise: Promise<Browser> | undefined;

const getBrowser = async () => {
  if (!browserPromise) {
    browserPromise = puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--font-render-hinting=none']
    });
  }
  return browserPromise;
};

export async function renderResumePdf(input: {
  data: ParsedResumeJson;
  template: TemplateConfig;
  sourceText?: string;
}) {
  const browser = await getBrowser();
  const page = await browser.newPage();

  try {
    await page.setContent(renderResumeHtml(input), { waitUntil: 'load' });
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: '0px', bottom: '0px', left: '0px', right: '0px' }
    });
    return Buffer.from(pdf);
  } finally {
    await page.close();
  }
}
