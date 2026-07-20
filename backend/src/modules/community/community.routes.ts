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
  avatar: user.avatarUrl || fallbackAvatar,
  username: metadataObject(user.metadata).communityUsername || ''
});

const normalizePost = (post: any) => ({
  id: post.id,
  authorId: post.authorId,
  author: post.author?.fullName || 'Learner',
  role: cleanRole(post.author?.role),
  avatar: post.author?.avatarUrl || fallbackAvatar,
  authorUsername: metadataObject(post.author?.metadata).communityUsername || '',
  time: formatAge(post.createdAt),
  tag: post.tag || 'Discussion',
  content: post.content,
  image: post.imageUrl || null,
  stats: {
    likes: post.likesCount || 0,
    comments: post.commentsCount || 0,
    shares: post.sharesCount || 0
  },
  liked: Array.isArray(post.likes) && post.likes.length > 0,
  comments: Array.isArray(post.comments) ? post.comments.map((comment: any) => ({
    id: comment.id,
    authorId: comment.authorId,
    text: comment.content,
    time: formatAge(comment.createdAt),
    author: comment.author ? normalizeUser(comment.author) : null
  })) : [],
  skills: Array.isArray(post.skills) && post.skills.length ? post.skills : ['Community', 'Learning'],
  featured: false,
  createdAt: post.createdAt
});

const metadataObject = (metadata: any) => (
  metadata && typeof metadata === 'object' && !Array.isArray(metadata) ? metadata : {}
);

const utcDayKey = (date = new Date()) => date.toISOString().slice(0, 10);

const previousUtcDayKey = (date = new Date()) => {
  const previous = new Date(date);
  previous.setUTCDate(previous.getUTCDate() - 1);
  return utcDayKey(previous);
};

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
  fastify.patch('/username', {
    preHandler: [requireAuth]
  }, async (request, reply) => {
    const rawUsername = (request.body as { username?: string })?.username;
    const username = String(rawUsername || '').trim().replace(/^@+/, '').toLowerCase();

    if (!/^[a-z0-9][a-z0-9._]{1,22}[a-z0-9]$/.test(username) || /[._]{2}/.test(username)) {
      return reply.status(400).send({
        statusCode: 400,
        error: 'Bad Request',
        code: 'INVALID_COMMUNITY_USERNAME',
        message: 'Username must be 3–24 characters using letters, numbers, dots, or underscores.'
      });
    }

    const existingOwner = await fastify.prisma.user.findFirst({
      where: {
        id: { not: request.user!.id },
        metadata: { path: ['communityUsername'], equals: username }
      },
      select: { id: true }
    });

    if (existingOwner) {
      return reply.status(409).send({
        statusCode: 409,
        error: 'Conflict',
        code: 'COMMUNITY_USERNAME_TAKEN',
        message: 'That username is already taken.'
      });
    }

    const currentUser = await fastify.prisma.user.findUnique({
      where: { id: request.user!.id },
      select: { metadata: true }
    });
    if (!currentUser) {
      return reply.status(404).send({ message: 'Profile not found.' });
    }

    const metadata = metadataObject(currentUser.metadata);
    await fastify.prisma.user.update({
      where: { id: request.user!.id },
      data: { metadata: { ...metadata, communityUsername: username } }
    });

    return reply.status(200).send({ username, handle: `@${username}` });
  });

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
    const [posts, postsCount, followersCount, followingCount, isFollowing, outgoingRequest, incomingRequest] = await Promise.all([
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
              avatarUrl: true,
              metadata: true
            }
          }
        }
      }),
      fastify.prisma.communityPost.count({ where: { authorId: id } }),
      fastify.prisma.follow.count({ where: { followingId: id } }),
      fastify.prisma.follow.count({ where: { followerId: id } }),
      fastify.prisma.follow.findFirst({ where: { followerId: viewerId, followingId: id } }),
      fastify.prisma.followRequest.findFirst({ where: { requesterId: viewerId, targetId: id, status: 'pending' } }),
      fastify.prisma.followRequest.findFirst({ where: { requesterId: id, targetId: viewerId, status: 'pending' } })
    ]);

    return reply.status(200).send({
      user: {
        ...normalizeUser(user),
        communityStreak: Math.max(0, Number(metadata.communityStreak || 0)),
        lastCommunityPostDate: metadata.lastCommunityPostDate || '',
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
        postsCount,
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
      achievements: profileAchievements(metadata, postsCount, projects.length)
    });
  });

  fastify.get('/posts', {
    preHandler: [requireAuth]
  }, async (request, reply) => {
    const posts = await fastify.prisma.communityPost.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
      include: {
        author: {
          select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
            avatarUrl: true,
            metadata: true
          }
        },
        likes: { where: { userId: request.user!.id }, select: { id: true } },
        comments: {
          orderBy: { createdAt: 'asc' },
          take: 10,
          include: { author: { select: { id: true, fullName: true, email: true, role: true, avatarUrl: true, metadata: true } } }
        }
      }
    });

    return reply.status(200).send(posts.map(normalizePost));
  });

  fastify.get('/posts/:id/likes', {
    preHandler: [requireAuth]
  }, async (request, reply) => {
    const { id: postId } = request.params as { id: string };
    const post = await fastify.prisma.communityPost.findUnique({
      where: { id: postId },
      select: { authorId: true }
    });

    if (!post) return reply.status(404).send({ message: 'Post not found.' });
    if (post.authorId !== request.user!.id) {
      return reply.status(403).send({ message: 'Only the post author can view who liked this post.' });
    }

    const likes = await fastify.prisma.communityLike.findMany({
      where: { postId },
      orderBy: { createdAt: 'desc' },
      select: {
        createdAt: true,
        user: {
          select: { id: true, fullName: true, email: true, role: true, avatarUrl: true, metadata: true }
        }
      }
    });

    return reply.status(200).send(likes.map(like => ({
      ...normalizeUser(like.user),
      likedAt: like.createdAt
    })));
  });

  fastify.post('/posts/:id/like', {
    preHandler: [requireAuth]
  }, async (request, reply) => {
    const { id: postId } = request.params as { id: string };
    const userId = request.user!.id;
    const post = await fastify.prisma.communityPost.findUnique({ where: { id: postId }, select: { id: true } });
    if (!post) return reply.status(404).send({ message: 'Post not found.' });

    const result = await fastify.prisma.$transaction(async prisma => {
      const existing = await prisma.communityLike.findUnique({ where: { postId_userId: { postId, userId } } });
      if (existing) await prisma.communityLike.delete({ where: { id: existing.id } });
      else await prisma.communityLike.create({ data: { postId, userId } });
      const likes = await prisma.communityLike.count({ where: { postId } });
      await prisma.communityPost.update({ where: { id: postId }, data: { likesCount: likes } });
      return { liked: !existing, likes };
    });
    return reply.status(200).send(result);
  });

  fastify.post('/posts/:id/share', {
    preHandler: [requireAuth]
  }, async (request, reply) => {
    const { id: postId } = request.params as { id: string };
    const post = await fastify.prisma.communityPost.findUnique({ where: { id: postId }, select: { id: true } });
    if (!post) return reply.status(404).send({ message: 'Post not found.' });

    const updated = await fastify.prisma.communityPost.update({
      where: { id: postId },
      data: { sharesCount: { increment: 1 } },
      select: { sharesCount: true }
    });
    return reply.status(200).send({ shares: updated.sharesCount });
  });

  fastify.post('/posts/:id/comments', {
    preHandler: [requireAuth]
  }, async (request, reply) => {
    const { id: postId } = request.params as { id: string };
    const content = String((request.body as { content?: string })?.content || '').trim();
    if (!content || content.length > 1000) return reply.status(400).send({ message: 'Comment must be between 1 and 1000 characters.' });
    const post = await fastify.prisma.communityPost.findUnique({ where: { id: postId }, select: { id: true } });
    if (!post) return reply.status(404).send({ message: 'Post not found.' });

    const comment = await fastify.prisma.$transaction(async prisma => {
      const created = await prisma.communityComment.create({
        data: { postId, authorId: request.user!.id, content },
        include: { author: { select: { id: true, fullName: true, email: true, role: true, avatarUrl: true, metadata: true } } }
      });
      const comments = await prisma.communityComment.count({ where: { postId } });
      await prisma.communityPost.update({ where: { id: postId }, data: { commentsCount: comments } });
      return created;
    });
    return reply.status(201).send({ id: comment.id, authorId: comment.authorId, text: comment.content, time: 'now', author: normalizeUser(comment.author) });
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

    const now = new Date();
    const today = utcDayKey(now);
    const yesterday = previousUtcDayKey(now);
    const result = await fastify.prisma.$transaction(async prisma => {
      const user = await prisma.user.findUniqueOrThrow({
        where: { id: request.user!.id },
        select: { metadata: true }
      });
      const metadata = metadataObject(user.metadata);
      const lastPostDate = String(metadata.lastCommunityPostDate || '');
      const currentStreak = Math.max(0, Number(metadata.communityStreak ?? 0));
      const nextStreak = lastPostDate === today
        ? currentStreak
        : lastPostDate === yesterday
          ? currentStreak + 1
          : 1;

      const post = await prisma.communityPost.create({
        data: {
          authorId: request.user!.id,
          content: content.slice(0, 2000),
          tag: body.tag?.trim().slice(0, 40) || 'Discussion',
          imageUrl: body.imageUrl?.trim() || null,
          skills: Array.isArray(body.skills)
            ? body.skills.map(skill => String(skill).trim()).filter(Boolean).slice(0, 6)
            : []
        },
        include: {
          author: { select: { id: true, fullName: true, email: true, role: true, avatarUrl: true, metadata: true } }
        }
      });

      await prisma.user.update({
        where: { id: request.user!.id },
        data: { metadata: { ...metadata, communityStreak: nextStreak, lastCommunityPostDate: today } }
      });
      return { post, nextStreak };
    });

    return reply.status(201).send({ ...normalizePost(result.post), authorStreak: result.nextStreak });
  });

  fastify.get('/social', {
    preHandler: [requireAuth]
  }, async (request, reply) => {
    const viewerId = request.user!.id;
    const [incomingRequests, outgoingRequests, followersCount, followingCount, followers, following, viewer, recentLikes, recentComments, recentFollowers] = await Promise.all([
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
      fastify.prisma.follow.findMany({ where: { followerId: viewerId }, select: { followingId: true } }),
      fastify.prisma.user.findUnique({ where: { id: viewerId }, select: { metadata: true } }),
      fastify.prisma.communityLike.findMany({
        where: { userId: { not: viewerId }, post: { authorId: viewerId } },
        orderBy: { createdAt: 'desc' },
        take: 20,
        include: {
          user: { select: { id: true, fullName: true, avatarUrl: true, role: true, email: true, metadata: true } },
          post: { select: { id: true, content: true } }
        }
      }),
      fastify.prisma.communityComment.findMany({
        where: { authorId: { not: viewerId }, post: { authorId: viewerId } },
        orderBy: { createdAt: 'desc' },
        take: 20,
        include: {
          author: { select: { id: true, fullName: true, avatarUrl: true, role: true, email: true, metadata: true } },
          post: { select: { id: true, content: true } }
        }
      }),
      fastify.prisma.follow.findMany({
        where: { followingId: viewerId },
        orderBy: { createdAt: 'desc' },
        take: 20,
        include: { follower: { select: { id: true, fullName: true, avatarUrl: true, role: true, email: true, metadata: true } } }
      })
    ]);

    const activities = [
      ...recentLikes.map((like: any) => ({ id: `like-${like.id}`, type: 'like', person: normalizeUser(like.user), text: 'liked your post', preview: like.post?.content || '', time: formatAge(like.createdAt), createdAt: like.createdAt })),
      ...recentComments.map((comment: any) => ({ id: `comment-${comment.id}`, type: 'comment', person: normalizeUser(comment.author), text: 'commented on your post', preview: comment.content, time: formatAge(comment.createdAt), createdAt: comment.createdAt })),
      ...recentFollowers.map((follow: any) => ({ id: `follow-${follow.id}`, type: 'follow', person: normalizeUser(follow.follower), text: 'started following you', preview: '', time: formatAge(follow.createdAt), createdAt: follow.createdAt }))
    ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 30);

    return reply.status(200).send({
      incomingRequests: incomingRequests.map(requestItem => normalizeFollowRequest(requestItem, viewerId)),
      outgoingRequests: outgoingRequests.map(requestItem => normalizeFollowRequest(requestItem, viewerId)),
      followersCount,
      followingCount,
      followerIds: followers.map(item => item.followerId),
      followingIds: following.map(item => item.followingId),
      activities,
      viewer: {
        username: metadataObject(viewer?.metadata).communityUsername || '',
        communityStreak: Math.max(0, Number(metadataObject(viewer?.metadata).communityStreak || 0))
      }
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
