import { FastifyInstance } from 'fastify';
import { requireAuth } from '../auth/auth.middleware.js';

const fallbackAvatar =
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?fit=facearea&facepad=2&w=256&h=256&q=80';

const cleanRole = (role?: string | null) => {
  const normalized = String(role || '').toLowerCase();
  if (!normalized || normalized.includes('admin') || normalized.includes('super')) {
    return 'Learner';
  }
  return normalized.replace(/_/g, ' ');
};

const formatAge = (date?: Date | string | null) => {
  if (!date) return 'now';
  const createdAt = new Date(date).getTime();
  const diff = Math.max(0, Date.now() - createdAt);
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'now';
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr`;
  const days = Math.floor(hours / 24);
  return `${days} d`;
};

const normalizeUser = (user: any) => ({
  id: user.id,
  fullName: user.fullName,
  name: user.fullName,
  email: user.email,
  role: cleanRole(user.role),
  avatarUrl: user.avatarUrl || fallbackAvatar,
  avatar: user.avatarUrl || fallbackAvatar
});

const normalizePost = (post: any) => ({
  id: post.id,
  authorId: post.authorId,
  author: post.author?.fullName || 'Learner',
  role: cleanRole(post.author?.role),
  avatar: post.author?.avatarUrl || fallbackAvatar,
  time: formatAge(post.createdAt),
  tag: post.tag || 'Discussion',
  content: post.content,
  image: post.imageUrl || null,
  stats: {
    likes: post.likesCount || 0,
    comments: post.commentsCount || 0,
    shares: post.sharesCount || 0
  },
  skills: Array.isArray(post.skills) && post.skills.length ? post.skills : ['Community', 'Learning'],
  featured: false,
  createdAt: post.createdAt
});

const metadataObject = (metadata: any) => (
  metadata && typeof metadata === 'object' && !Array.isArray(metadata) ? metadata : {}
);

const normalizeProject = (project: any, index: number) => ({
  id: project?.id || `project-${index}`,
  title: project?.title || 'Untitled project',
  desc: project?.desc || project?.description || 'Project details are being updated.',
  status: project?.status || 'In Progress',
  tags: Array.isArray(project?.tags) ? project.tags.slice(0, 6) : [],
  git: project?.git || '',
  live: project?.live || '',
  docs: project?.docs || '',
  image: project?.image || ''
});

const profileAchievements = (metadata: any, postsCount: number, projectsCount: number) => {
  const xp = Number(metadata.xp || 0);
  const streak = Number(metadata.streak || 0);
  const courseProgress = Number(metadata.courseProgress || metadata.courseProgressScore || 0);
  return [
    {
      title: 'Community Builder',
      detail: `${postsCount} public post${postsCount === 1 ? '' : 's'} shared`,
      unlocked: postsCount > 0
    },
    {
      title: 'Project Proof',
      detail: `${projectsCount} portfolio project${projectsCount === 1 ? '' : 's'} added`,
      unlocked: projectsCount > 0
    },
    {
      title: 'Learning Momentum',
      detail: `${Math.max(streak, 0)} day streak · ${Math.max(xp, 0)} XP`,
      unlocked: streak > 0 || xp > 0
    },
    {
      title: 'Course Progress',
      detail: `${Math.max(courseProgress, 0)}% course progress`,
      unlocked: courseProgress > 0
    }
  ];
};

const normalizeFollowRequest = (request: any, viewerId: string) => ({
  id: request.id,
  status: request.status,
  createdAt: request.createdAt,
  fromId: request.requesterId,
  toId: request.targetId,
  fromName: request.requester?.fullName || 'Learner',
  toName: request.target?.fullName || 'Learner',
  fromAvatar: request.requester?.avatarUrl || fallbackAvatar,
  toAvatar: request.target?.avatarUrl || fallbackAvatar,
  requester: request.requester ? normalizeUser(request.requester) : null,
  target: request.target ? normalizeUser(request.target) : null,
  direction: request.requesterId === viewerId ? 'outgoing' : 'incoming'
});

export async function communityRoutes(fastify: FastifyInstance) {
  fastify.get('/profiles/:id', {
    preHandler: [requireAuth]
  }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const viewerId = request.user!.id;

    const user = await fastify.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        avatarUrl: true,
        metadata: true,
        createdAt: true
      }
    });

    if (!user) {
      return reply.status(404).send({
        statusCode: 404,
        error: 'Not Found',
        code: 'PROFILE_NOT_FOUND',
        message: 'Profile not found.'
      });
    }

    const metadata = metadataObject(user.metadata);
    const projects = Array.isArray(metadata.projects)
      ? metadata.projects.map(normalizeProject).slice(0, 12)
      : [];
    const [posts, followersCount, followingCount, isFollowing, outgoingRequest, incomingRequest] = await Promise.all([
      fastify.prisma.communityPost.findMany({
        where: { authorId: id },
        orderBy: { createdAt: 'desc' },
        take: 20,
        include: {
          author: {
            select: {
              id: true,
              fullName: true,
              email: true,
              role: true,
              avatarUrl: true
            }
          }
        }
      }),
      fastify.prisma.follow.count({ where: { followingId: id } }),
      fastify.prisma.follow.count({ where: { followerId: id } }),
      fastify.prisma.follow.findFirst({ where: { followerId: viewerId, followingId: id } }),
      fastify.prisma.followRequest.findFirst({ where: { requesterId: viewerId, targetId: id, status: 'pending' } }),
      fastify.prisma.followRequest.findFirst({ where: { requesterId: id, targetId: viewerId, status: 'pending' } })
    ]);

    return reply.status(200).send({
      user: {
        ...normalizeUser(user),
        college: metadata.college || '',
        degree: metadata.degree || '',
        year: metadata.year || '',
        location: metadata.location || '',
        headline: metadata.bio || 'Building their learning profile.',
        joinedAt: user.createdAt
      },
      stats: {
        followersCount,
        followingCount,
        postsCount: posts.length,
        projectsCount: projects.length
      },
      relationship: {
        isSelf: viewerId === id,
        isFollowing: Boolean(isFollowing),
        outgoingRequestId: outgoingRequest?.id || null,
        incomingRequestId: incomingRequest?.id || null
      },
      posts: posts.map(normalizePost),
      projects,
      achievements: profileAchievements(metadata, posts.length, projects.length)
    });
  });

  fastify.get('/posts', {
    preHandler: [requireAuth]
  }, async (_request, reply) => {
    const posts = await fastify.prisma.communityPost.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: {
        author: {
          select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
            avatarUrl: true
          }
        }
      }
    });

    return reply.status(200).send(posts.map(normalizePost));
  });

  fastify.post('/posts', {
    preHandler: [requireAuth]
  }, async (request, reply) => {
    const body = request.body as {
      content?: string;
      tag?: string;
      imageUrl?: string;
      skills?: string[];
    };
    const content = body.content?.trim();

    if (!content || content.length < 2) {
      return reply.status(400).send({
        statusCode: 400,
        error: 'Bad Request',
        code: 'INVALID_POST',
        message: 'Post content is required.'
      });
    }

    const post = await fastify.prisma.communityPost.create({
      data: {
        authorId: request.user!.id,
        content: content.slice(0, 2000),
        tag: body.tag?.trim().slice(0, 40) || 'Discussion',
        imageUrl: body.imageUrl?.trim() || null,
        skills: Array.isArray(body.skills)
          ? body.skills.map(skill => String(skill).trim()).filter(Boolean).slice(0, 6)
          : ['Community', 'Learning']
      },
      include: {
        author: {
          select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
            avatarUrl: true
          }
        }
      }
    });

    return reply.status(201).send(normalizePost(post));
  });

  fastify.get('/social', {
    preHandler: [requireAuth]
  }, async (request, reply) => {
    const viewerId = request.user!.id;
    const [incomingRequests, outgoingRequests, followersCount, followingCount, followers, following] = await Promise.all([
      fastify.prisma.followRequest.findMany({
        where: { targetId: viewerId, status: 'pending' },
        orderBy: { createdAt: 'desc' },
        include: {
          requester: { select: { id: true, fullName: true, email: true, role: true, avatarUrl: true } },
          target: { select: { id: true, fullName: true, email: true, role: true, avatarUrl: true } }
        }
      }),
      fastify.prisma.followRequest.findMany({
        where: { requesterId: viewerId, status: 'pending' },
        orderBy: { createdAt: 'desc' },
        include: {
          requester: { select: { id: true, fullName: true, email: true, role: true, avatarUrl: true } },
          target: { select: { id: true, fullName: true, email: true, role: true, avatarUrl: true } }
        }
      }),
      fastify.prisma.follow.count({ where: { followingId: viewerId } }),
      fastify.prisma.follow.count({ where: { followerId: viewerId } }),
      fastify.prisma.follow.findMany({ where: { followingId: viewerId }, select: { followerId: true } }),
      fastify.prisma.follow.findMany({ where: { followerId: viewerId }, select: { followingId: true } })
    ]);

    return reply.status(200).send({
      incomingRequests: incomingRequests.map(requestItem => normalizeFollowRequest(requestItem, viewerId)),
      outgoingRequests: outgoingRequests.map(requestItem => normalizeFollowRequest(requestItem, viewerId)),
      followersCount,
      followingCount,
      followerIds: followers.map(item => item.followerId),
      followingIds: following.map(item => item.followingId)
    });
  });

  fastify.post('/follow-requests', {
    preHandler: [requireAuth]
  }, async (request, reply) => {
    const { targetUserId } = request.body as { targetUserId?: string };
    const requesterId = request.user!.id;

    if (!targetUserId || targetUserId === requesterId) {
      return reply.status(400).send({
        statusCode: 400,
        error: 'Bad Request',
        code: 'INVALID_FOLLOW_TARGET',
        message: 'Choose another learner to follow.'
      });
    }

    const [targetUser, existingFollow, existingRequest] = await Promise.all([
      fastify.prisma.user.findUnique({ where: { id: targetUserId }, select: { id: true } }),
      fastify.prisma.follow.findFirst({ where: { followerId: requesterId, followingId: targetUserId } }),
      fastify.prisma.followRequest.findFirst({ where: { requesterId, targetId: targetUserId } })
    ]);

    if (!targetUser) {
      return reply.status(404).send({
        statusCode: 404,
        error: 'Not Found',
        code: 'USER_NOT_FOUND',
        message: 'Learner not found.'
      });
    }

    if (existingFollow) {
      return reply.status(409).send({
        statusCode: 409,
        error: 'Conflict',
        code: 'ALREADY_FOLLOWING',
        message: 'You already follow this learner.'
      });
    }

    if (existingRequest) {
      const requestRecord = existingRequest.status === 'declined'
        ? await fastify.prisma.followRequest.update({
            where: { id: existingRequest.id },
            data: { status: 'pending', respondedAt: null }
          })
        : existingRequest;
      return reply.status(200).send(requestRecord);
    }

    const requestRecord = await fastify.prisma.followRequest.create({
      data: {
        requesterId,
        targetId: targetUserId,
        status: 'pending'
      }
    });

    return reply.status(201).send(requestRecord);
  });

  fastify.patch('/follow-requests/:id', {
    preHandler: [requireAuth]
  }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const { action } = request.body as { action?: string };
    const viewerId = request.user!.id;

    if (!['accept', 'decline'].includes(action || '')) {
      return reply.status(400).send({
        statusCode: 400,
        error: 'Bad Request',
        code: 'INVALID_FOLLOW_ACTION',
        message: 'Use accept or decline.'
      });
    }

    const followRequest = await fastify.prisma.followRequest.findUnique({ where: { id } });
    if (!followRequest || followRequest.targetId !== viewerId) {
      return reply.status(404).send({
        statusCode: 404,
        error: 'Not Found',
        code: 'FOLLOW_REQUEST_NOT_FOUND',
        message: 'Follow request not found.'
      });
    }

    if (action === 'decline') {
      const declined = await fastify.prisma.followRequest.update({
        where: { id },
        data: { status: 'declined', respondedAt: new Date() }
      });
      return reply.status(200).send(declined);
    }

    const existingFollow = await fastify.prisma.follow.findFirst({
      where: {
        followerId: followRequest.requesterId,
        followingId: followRequest.targetId
      }
    });

    if (!existingFollow) {
      await fastify.prisma.follow.create({
        data: {
          followerId: followRequest.requesterId,
          followingId: followRequest.targetId
        }
      });
    }

    const accepted = await fastify.prisma.followRequest.update({
      where: { id },
      data: { status: 'accepted', respondedAt: new Date() }
    });

    return reply.status(200).send(accepted);
  });
}
