import { describe, expect, it } from 'vitest';
import { copilotRagBodySchema } from '../src/modules/chat/copilot.rag.js';

const makeList = (count: number) => Array.from({ length: count }, (_, index) => index + 1);

describe('dashboard copilot schema', () => {
  it('trims oversized dashboard snapshots before validation', () => {
    const parsed = copilotRagBodySchema.parse({
      message: 'keywords',
      dashboard: {
        tracks: makeList(16).map(index => ({
          name: `Track ${index}`,
          completedNodes: index,
          totalNodes: 20
        })),
        projects: makeList(15).map(index => ({
          title: `Project ${index}`,
          status: 'In Progress',
          tags: makeList(10).map(tag => `tag-${tag}`)
        }))
      }
    });

    expect(parsed.dashboard.tracks).toHaveLength(12);
    expect(parsed.dashboard.projects).toHaveLength(12);
    expect(parsed.dashboard.projects?.[0].tags).toHaveLength(8);
  });
});
