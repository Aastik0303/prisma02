import { afterEach, describe, expect, it, vi } from 'vitest';
import request from 'supertest';
import { buildApp } from '../src/app.js';

describe('catalog caching', () => {
  let app: any;

  afterEach(async () => {
    if (app) {
      await app.close();
    }
  });

  it('caches public catalog courses between requests', async () => {
    app = await buildApp();
    await app.ready();

    const findMany = vi.fn().mockResolvedValue([
      {
        id: 'course-1',
        slug: 'cached-course',
        title: 'Cached Course',
        subtitle: 'Fast reads',
        description: 'A published course used to verify cache behavior.',
        syllabus: ['Cache basics'],
        duration: '2 hours',
        rating: 4.8,
        modulesCount: 3,
        badge: null,
        accent: 'indigo',
        actionUrl: null,
        published: true,
        creatorId: 'admin-1',
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
        updatedAt: new Date('2026-01-01T00:00:00.000Z')
      }
    ]);
    app.prisma.catalogCourse.findMany = findMany;

    const firstResponse = await request(app.server).get('/api/v1/catalog/courses');
    const secondResponse = await request(app.server).get('/api/v1/catalog/courses');

    expect(firstResponse.status).toBe(200);
    expect(firstResponse.headers['cache-control']).toContain('s-maxage=300');
    expect(firstResponse.headers['x-cache']).toBe('MISS');
    expect(secondResponse.status).toBe(200);
    expect(secondResponse.headers['x-cache']).toBe('HIT');
    expect(secondResponse.body).toEqual(firstResponse.body);
    expect(findMany).toHaveBeenCalledTimes(1);
  });

  it('caches public catalog projects between requests', async () => {
    app = await buildApp();
    await app.ready();

    const findMany = vi.fn().mockResolvedValue([
      {
        id: 'project-1',
        slug: 'cached-project',
        title: 'Cached Project',
        category: 'backend',
        tier: 'Basic',
        description: 'A published project used to verify cache behavior.',
        price: 0,
        popular: false,
        free: true,
        actionUrl: null,
        published: true,
        creatorId: 'admin-1',
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
        updatedAt: new Date('2026-01-01T00:00:00.000Z')
      }
    ]);
    app.prisma.catalogProject.findMany = findMany;

    const firstResponse = await request(app.server).get('/api/v1/catalog/projects');
    const secondResponse = await request(app.server).get('/api/v1/catalog/projects');

    expect(firstResponse.status).toBe(200);
    expect(firstResponse.headers['cache-control']).toContain('s-maxage=300');
    expect(firstResponse.headers['x-cache']).toBe('MISS');
    expect(secondResponse.status).toBe(200);
    expect(secondResponse.headers['x-cache']).toBe('HIT');
    expect(secondResponse.body).toEqual(firstResponse.body);
    expect(findMany).toHaveBeenCalledTimes(1);
  });
});
