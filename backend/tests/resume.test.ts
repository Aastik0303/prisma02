import { describe, expect, it } from 'vitest';
import {
  extractResumeText,
  MAX_RESUME_BYTES,
  sanitizeResumeText
} from '../src/modules/resume/resume.extractor.js';

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
});
