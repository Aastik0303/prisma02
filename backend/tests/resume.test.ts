import { describe, expect, it } from 'vitest';
import {
  extractResumeText,
  MAX_RESUME_BYTES,
  sanitizeResumeText
} from '../src/modules/resume/resume.extractor.js';
import { renderResumeHtml } from '../src/modules/resume/resume.renderer.js';
import { analyzeResumeBodySchema } from '../src/modules/resume/resume.schema.js';

describe('resume upload security', () => {
  it('normalizes and removes unsafe control characters from extracted text', () => {
    const text = sanitizeResumeText('  Jane\u0000 Doe\u0007   \n\n\n\nEngineer  ');
    expect(text).toBe('Jane Doe\n\n\nEngineer');
  });

  it('rejects a file whose extension and content do not match', async () => {
    await expect(extractResumeText({
      buffer: Buffer.from('this is not a PDF'),
      filename: 'resume.pdf',
      mimetype: 'application/pdf'
    })).rejects.toMatchObject({ code: 'UNSUPPORTED_RESUME_FILE' });
  });

  it('rejects files over the upload limit before parsing', async () => {
    await expect(extractResumeText({
      buffer: Buffer.alloc(MAX_RESUME_BYTES + 1),
      filename: 'resume.pdf',
      mimetype: 'application/pdf'
    })).rejects.toMatchObject({ code: 'INVALID_RESUME_SIZE' });
  });

  it('renders improved text into uploaded layout blocks without changing the layout', () => {
    const html = renderResumeHtml({
      data: {
        personal_info: { name: 'Jane Doe', email: '', phone: '', location: '', links: [] },
        summary: '',
        skills: [],
        experience: [],
        education: [],
        projects: []
      },
      template: {
        templateId: 'uploaded-pdf-layout',
        page: { width: 612, height: 792, margin: 0 },
        fonts: {},
        colors: {},
        sections: [],
        uploadedPdf: {
          pages: [{ page: 1, width: 612, height: 792 }],
          blocks: [
            { page: 1, text: '', x: 20, y: 20, width: 200, height: 20, fontSize: 12, fontFamily: 'Arial' },
            { page: 1, text: '', x: 20, y: 60, width: 200, height: 20, fontSize: 12, fontFamily: 'Arial' }
          ]
        }
      },
      sourceText: 'Jane Doe\nSenior Frontend Engineer'
    });

    expect(html).toContain('Jane Doe');
    expect(html).toContain('Senior Frontend Engineer');
    expect(html).toContain('position: absolute');
  });

  it('accepts an optional job description for ATS matching', () => {
    const parsed = analyzeResumeBodySchema.parse({
      resumeText: 'Jane Doe\njane@example.com\n+1 555 123 4567\nSkills: React, TypeScript, Testing\nProjects: Built a dashboard for course progress tracking.',
      targetRole: 'Frontend Developer',
      jobDescription: 'Looking for React, TypeScript, accessibility, testing, and dashboard experience.'
    });

    expect(parsed.jobDescription).toContain('accessibility');
  });
});
