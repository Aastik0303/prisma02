import { FastifyInstance } from 'fastify';
import { requireAuth, requireRole } from '../auth/auth.middleware.js';
import {
  catalogIdSchema,
  createCatalogProjectSchema,
  createCourseSchema,
  updateCourseSchema
} from './catalog.schema.js';
import { defaultCatalogCourses } from './defaultCourses.js';
import { deleteJsonCache, getOrSetJsonCache, sharedCacheControl } from '../../utils/cache.js';

function slugify(title: string) {
  return `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 70)}-${Date.now().toString(36)}`;
}

const adminOnly = [requireAuth, requireRole('admin', 'super_admin')];
const CATALOG_COURSES_CACHE_KEY = 'cache:catalog:courses:published:v1';
const CATALOG_PROJECTS_CACHE_KEY = 'cache:catalog:projects:published:v1';
const CATALOG_CACHE_TTL_SECONDS = 300;
const CATALOG_HTTP_CACHE = sharedCacheControl(60, CATALOG_CACHE_TTL_SECONDS, 600);

const invalidateCatalogCache = (fastify: FastifyInstance, keys: string[]) => (
  deleteJsonCache(fastify.redis, keys)
);

async function ensureDefaultCatalogCourses(fastify: FastifyInstance, creatorId: string) {
  const courses = await fastify.prisma.catalogCourse.findMany();
  const existingSlugs = new Set(courses.map(course => course.slug));
  const missingCourses = defaultCatalogCourses.filter(course => !existingSlugs.has(course.slug));

  for (const course of missingCourses) {
    await fastify.prisma.catalogCourse.create({
      data: {
        ...course,
        creatorId
      }
    });
  }

  return missingCourses.length > 0;
}

export async function catalogRoutes(fastify: FastifyInstance) {
  fastify.get('/courses', async (_request, reply) => {
    const { value, status } = await getOrSetJsonCache(
      fastify.redis,
      CATALOG_COURSES_CACHE_KEY,
      CATALOG_CACHE_TTL_SECONDS,
      () => fastify.prisma.catalogCourse.findMany({
        where: { published: true },
        orderBy: { createdAt: 'desc' }
      })
    );

    return reply
      .header('Cache-Control', CATALOG_HTTP_CACHE)
      .header('X-Cache', status)
      .send({ courses: value });
  });

  fastify.get('/projects', async (_request, reply) => {
    const { value, status } = await getOrSetJsonCache(
      fastify.redis,
      CATALOG_PROJECTS_CACHE_KEY,
      CATALOG_CACHE_TTL_SECONDS,
      () => fastify.prisma.catalogProject.findMany({
        where: { published: true },
        orderBy: { createdAt: 'desc' }
      })
    );

    return reply
      .header('Cache-Control', CATALOG_HTTP_CACHE)
      .header('X-Cache', status)
      .send({ projects: value });
  });

  fastify.get('/admin', { preHandler: adminOnly }, async (_request, reply) => {
    const defaultsCreated = await ensureDefaultCatalogCourses(fastify, _request.user!.id);
    if (defaultsCreated) {
      await invalidateCatalogCache(fastify, [CATALOG_COURSES_CACHE_KEY]);
    }

    const [courses, projects] = await Promise.all([
      fastify.prisma.catalogCourse.findMany({ orderBy: { createdAt: 'desc' } }),
      fastify.prisma.catalogProject.findMany({ orderBy: { createdAt: 'desc' } })
    ]);
    return reply.header('Cache-Control', 'no-store').send({ courses, projects });
  });

  fastify.post('/courses', { preHandler: adminOnly }, async (request, reply) => {
    const body = createCourseSchema.parse(request.body);
    const course = await fastify.prisma.catalogCourse.create({
      data: {
        ...body,
        badge: body.badge || null,
        slug: slugify(body.title),
        creatorId: request.user!.id
      }
    });
    await invalidateCatalogCache(fastify, [CATALOG_COURSES_CACHE_KEY]);
    return reply.code(201).send({ course });
  });

  fastify.put('/courses/:id', { preHandler: adminOnly }, async (request, reply) => {
    const { id } = catalogIdSchema.parse(request.params);
    const body = updateCourseSchema.parse(request.body);
    const course = await fastify.prisma.catalogCourse.update({
      where: { id },
      data: {
        ...body,
        ...(body.badge !== undefined ? { badge: body.badge || null } : {}),
        ...(body.actionUrl !== undefined ? { actionUrl: body.actionUrl || null } : {})
      }
    });
    await invalidateCatalogCache(fastify, [CATALOG_COURSES_CACHE_KEY]);
    return reply.send({ course });
  });

  fastify.post('/projects', { preHandler: adminOnly }, async (request, reply) => {
    const body = createCatalogProjectSchema.parse(request.body);
    const project = await fastify.prisma.catalogProject.create({
      data: {
        ...body,
        free: body.free || body.price === 0,
        slug: slugify(body.title),
        creatorId: request.user!.id
      }
    });
    await invalidateCatalogCache(fastify, [CATALOG_PROJECTS_CACHE_KEY]);
    return reply.code(201).send({ project });
  });

  fastify.delete('/courses/:id', { preHandler: adminOnly }, async (request, reply) => {
    const { id } = catalogIdSchema.parse(request.params);
    await fastify.prisma.catalogCourse.delete({ where: { id } });
    await invalidateCatalogCache(fastify, [CATALOG_COURSES_CACHE_KEY]);
    return reply.code(204).send();
  });

  fastify.delete('/projects/:id', { preHandler: adminOnly }, async (request, reply) => {
    const { id } = catalogIdSchema.parse(request.params);
    await fastify.prisma.catalogProject.delete({ where: { id } });
    await invalidateCatalogCache(fastify, [CATALOG_PROJECTS_CACHE_KEY]);
    return reply.code(204).send();
  });
}
