import type { ParsedResumeJson, TemplateConfig } from './resume.schema.js';

const escapeHtml = (value = '') => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#039;');

const escapePdfText = (value = '') => String(value)
  .replace(/\\/g, '\\\\')
  .replace(/\(/g, '\\(')
  .replace(/\)/g, '\\)')
  .replace(/[^\x09\x0A\x0D\x20-\x7E]/g, '');

const pushSection = (lines: string[], title: string, body: string[]) => {
  const cleanBody = body.map(line => line.trim()).filter(Boolean);
  if (!cleanBody.length) return;
  if (lines.length) lines.push('');
  lines.push(title.toUpperCase());
  lines.push(...cleanBody);
};

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
}) {
  const { data, template } = input;
  const colors = {
    text: template.colors.text || '#0f172a',
    muted: template.colors.muted || '#475569',
    accent: template.colors.accent || '#4f46e5',
    background: template.colors.background || '#ffffff'
  };
  const font = template.fonts.body?.family || 'Inter, Arial, sans-serif';
  const page = template.page;

  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    @page { size: ${page.width}pt ${page.height}pt; margin: ${page.margin}pt; }
    body { margin: 0; background: ${colors.background}; color: ${colors.text}; font-family: ${font}; font-size: ${template.fonts.body?.size || 10}pt; }
    h1 { margin: 0; font-size: ${template.fonts.name?.size || 24}pt; color: ${colors.text}; }
    h2 { margin: 14pt 0 5pt; padding-bottom: 3pt; border-bottom: 1pt solid ${colors.accent}; font-size: ${template.fonts.heading?.size || 11}pt; color: ${colors.accent}; text-transform: uppercase; }
    p { margin: 0 0 4pt; line-height: 1.35; }
    ul { margin: 3pt 0 0 14pt; padding: 0; }
    li { margin: 0 0 3pt; line-height: 1.3; }
    .muted { color: ${colors.muted}; }
    .row { display: flex; justify-content: space-between; gap: 14pt; }
  </style>
</head>
<body>
  <h1>${escapeHtml(data.personal_info?.name || 'Resume')}</h1>
  <p class="muted">${escapeHtml([data.personal_info?.email, data.personal_info?.phone, data.personal_info?.location].filter(Boolean).join(' | '))}</p>
  ${data.summary ? `<h2>Summary</h2><p>${escapeHtml(data.summary)}</p>` : ''}
  ${data.skills?.length ? `<h2>Skills</h2><p>${escapeHtml(data.skills.join(' | '))}</p>` : ''}
  ${data.experience?.length ? `<h2>Experience</h2>${data.experience.map(item => `<p><strong>${escapeHtml([item.title, item.company].filter(Boolean).join(', '))}</strong> <span class="muted">${escapeHtml([item.startDate, item.endDate].filter(Boolean).join(' - '))}</span></p><ul>${item.bullets.map(bullet => `<li>${escapeHtml(bullet)}</li>`).join('')}</ul>`).join('')}` : ''}
  ${data.projects?.length ? `<h2>Projects</h2>${data.projects.map(item => `<p><strong>${escapeHtml(item.title)}</strong>${item.url ? ` <span class="muted">${escapeHtml(item.url)}</span>` : ''}</p><ul>${item.bullets.map(bullet => `<li>${escapeHtml(bullet)}</li>`).join('')}</ul>`).join('')}` : ''}
  ${data.education?.length ? `<h2>Education</h2>${data.education.map(item => `<p><strong>${escapeHtml([item.degree, item.institution].filter(Boolean).join(', '))}</strong> <span class="muted">${escapeHtml([item.startDate, item.endDate].filter(Boolean).join(' - '))}</span></p>${item.details?.length ? `<ul>${item.details.map(detail => `<li>${escapeHtml(detail)}</li>`).join('')}</ul>` : ''}`).join('')}` : ''}
</body>
</html>`;
}

export function renderResumePdf(input: {
  data: ParsedResumeJson;
  template: TemplateConfig;
}) {
  const { template } = input;
  const pageWidth = template.page.width;
  const pageHeight = template.page.height;
  const margin = template.page.margin;
  const fontSize = template.fonts.body?.size || 10;
  const lineHeight = Math.max(fontSize + 3, 12);
  const maxChars = Math.max(72, Math.floor((pageWidth - margin * 2) / (fontSize * 0.55)));
  const sourceLines = resumeJsonToLines(input.data).flatMap(line => {
    if (line.length <= maxChars) return [line];
    const words = line.split(/\s+/);
    const wrapped: string[] = [];
    let current = '';
    for (const word of words) {
      const next = current ? `${current} ${word}` : word;
      if (next.length > maxChars && current) {
        wrapped.push(current);
        current = word;
      } else {
        current = next;
      }
    }
    if (current) wrapped.push(current);
    return wrapped;
  });
  const linesPerPage = Math.max(1, Math.floor((pageHeight - margin * 2) / lineHeight));
  const pages: string[][] = [];
  for (let index = 0; index < sourceLines.length; index += linesPerPage) {
    pages.push(sourceLines.slice(index, index + linesPerPage));
  }
  if (!pages.length) pages.push(['']);

  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    `<< /Type /Pages /Kids [${pages.map((_, index) => `${3 + index * 2} 0 R`).join(' ')}] /Count ${pages.length} >>`
  ];

  pages.forEach((pageLines, pageIndex) => {
    const pageObjectId = 3 + pageIndex * 2;
    const contentObjectId = pageObjectId + 1;
    const commands = pageLines.map((line, lineIndex) => {
      const y = pageHeight - margin - lineIndex * lineHeight;
      return `BT /F1 ${fontSize} Tf ${margin} ${y} Td (${escapePdfText(line)}) Tj ET`;
    }).join('\n');
    objects.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /Font << /F1 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> >> >> /Contents ${contentObjectId} 0 R >>`);
    objects.push(`<< /Length ${commands.length} >>\nstream\n${commands}\nendstream`);
  });

  let pdf = '%PDF-1.4\n';
  const offsets = [0];
  objects.forEach((object, index) => {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });
  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.slice(1).forEach(offset => {
    pdf += `${String(offset).padStart(10, '0')} 00000 n \n`;
  });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  return Buffer.from(pdf, 'binary');
}
