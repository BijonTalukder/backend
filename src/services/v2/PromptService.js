class V2PromptService {
  constructor(prismaClient) {
    this.prisma = prismaClient;
  }

  formatPrompt(p, creator, promptCount) {
    return {
      id: p.id,
      title: p.title,
      text: p.text,
      images: p.images,
      aiPlatforms: p.aiPlatforms,
      categoryId: p.categoryId,
      tags: p.tags,
      visibility: p.visibility,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
      isLocked: p.isLocked,
      likes: p.likeCount || 0,
      views: p.viewCount || 0,
      copies: p.viewCount || 0,
      creator: creator
        ? {
            id: creator.id,
            name: creator.name,
            email: creator.email,
            avatar: creator.avatar,
            profession: creator.profession,
            bio: creator.bio,
            location: creator.location,
            whatsapp: creator.whatsapp,
            joinedAt: creator.createdAt,
            promptCount,
          }
        : null,
    };
  }

  async attachCreators(prompts) {
    const userIds = [...new Set(prompts.map(p => p.createdBy).filter(Boolean))];
    const users = userIds.length ? await this.prisma.user.findMany({
      where: { id: { in: userIds } },
      select: {
        id: true, name: true, email: true, avatar: true,
        profession: true, bio: true, location: true, whatsapp: true,
        createdAt: true,
      },
    }) : [];
    const userMap = {};
    users.forEach(u => { userMap[u.id] = u; });

    const promptCounts = {};
    if (userIds.length) {
      const counts = await this.prisma.prompt.groupBy({
        by: ['createdBy'],
        where: { createdBy: { in: userIds } },
        _count: { _all: true },
      });
      counts.forEach(c => { promptCounts[c.createdBy] = c._count._all; });
    }

    return prompts.map(p => {
      const creator = userMap[p.createdBy] || null;
      const promptCount = creator ? (promptCounts[p.createdBy] || 0) : 0;
      return this.formatPrompt(p, creator, promptCount);
    });
  }

  async _getFollowingIds(userId) {
    if (!userId) return [];
    const following = await this.prisma.follow.findMany({
      where: { followerId: userId },
      select: { followingId: true },
    });
    return following.map((f) => f.followingId);
  }

  _buildPlatformWhere(platform) {
    if (!platform || platform === 'all') return {};
    if (platform === 'web') return { platform: { in: ['ALL', 'WEB'] } };
    if (platform === 'mobile') return { platform: { in: ['ALL', 'MOBILE'] } };
    return {};
  }

  _buildVisibilityWhere(followingIds) {
    if (followingIds.length === 0) {
      return { visibility: 'PUBLIC' };
    }
    return {
      OR: [
        { visibility: 'PUBLIC' },
        { visibility: 'FOLLOWERS_ONLY', createdBy: { in: followingIds } },
      ],
    };
  }

  async getAllPrompts(page, limit, sortBy, currentUserId, platform) {
    const skip = (page - 1) * limit;
    let orderBy;
    switch (sortBy) {
      case 'likes': orderBy = { likeCount: 'desc' }; break;
      case 'copies': orderBy = { viewCount: 'desc' }; break;
      case 'newest': orderBy = { createdAt: 'desc' }; break;
      default: orderBy = [{ viewCount: 'desc' }, { createdAt: 'desc' }]; break;
    }

    const followingIds = await this._getFollowingIds(currentUserId);
    const visibilityWhere = this._buildVisibilityWhere(followingIds);
    const platformWhere = this._buildPlatformWhere(platform);
    const where = { ...visibilityWhere, ...platformWhere };

    console.log('DEBUG getAllPrompts where:', JSON.stringify(where));

    let data, total;
    try {
      [data, total] = await Promise.all([
        this.prisma.prompt.findMany({ where, skip, take: limit, orderBy }),
        this.prisma.prompt.count({ where }),
      ]);
    } catch (e) {
      console.log('DEBUG v2 ERROR:', e.message);
      throw e;
    }

    return {
      data: await this.attachCreators(data),
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async getPromptsByCategory(page, limit, categoryId, sortBy, currentUserId, platform) {
    const skip = (page - 1) * limit;
    let orderBy;
    switch (sortBy) {
      case 'likes': orderBy = { likeCount: 'desc' }; break;
      case 'copies': orderBy = { viewCount: 'desc' }; break;
      case 'newest': orderBy = { createdAt: 'desc' }; break;
      default: orderBy = [{ viewCount: 'desc' }, { createdAt: 'desc' }]; break;
    }

    const followingIds = await this._getFollowingIds(currentUserId);
    const visibilityWhere = this._buildVisibilityWhere(followingIds);
    const platformWhere = this._buildPlatformWhere(platform);
    const where = { ...visibilityWhere, categoryId, ...platformWhere };

    const [data, total] = await Promise.all([
      this.prisma.prompt.findMany({ where, skip, take: limit, orderBy }),
      this.prisma.prompt.count({ where }),
    ]);

    return {
      data: await this.attachCreators(data),
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async getPromptById(id, currentUserId) {
    const p = await this.prisma.prompt.findUnique({ where: { id } });
    if (!p) return null;

    if (p.visibility === 'FOLLOWERS_ONLY') {
      if (!currentUserId) return null;
      if (p.createdBy === currentUserId) {
        // owner can see
      } else {
        const followingIds = await this._getFollowingIds(currentUserId);
        if (!followingIds.includes(p.createdBy)) return null;
      }
    }

    const results = await this.attachCreators([p]);
    return results[0];
  }

  async getPromptsByUser(userId, currentUserId, platform) {
    const isOwner = currentUserId === userId;

    let where = { createdBy: userId };
    if (!isOwner) {
      const followingIds = await this._getFollowingIds(currentUserId);
      if (followingIds.includes(userId)) {
        // can see all
      } else {
        where.visibility = 'PUBLIC';
      }
    }

    const platformWhere = this._buildPlatformWhere(platform);
    where = { ...where, ...platformWhere };

    const data = await this.prisma.prompt.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
    return this.attachCreators(data);
  }

  async getRecommendedPrompts(ip, page, limit, currentUserId, platform) {
    const skip = (page - 1) * limit;

    const interactions = await this.prisma.promptInteraction.findMany({
      where: { ip },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    if (interactions.length === 0) {
      return this.getAllPrompts(page, limit, 'newest', currentUserId, platform);
    }

    const promptIds = [...new Set(interactions.map((i) => i.promptId))];
    const interactedPrompts = await this.prisma.prompt.findMany({
      where: { id: { in: promptIds } },
      select: { id: true, categoryId: true },
    });

    const categoryWeights = {};
    for (const p of interactedPrompts) {
      if (p.categoryId) {
        categoryWeights[p.categoryId] = (categoryWeights[p.categoryId] || 0) + 1;
      }
    }

    const sortedCats = Object.entries(categoryWeights)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([id]) => id);

    if (sortedCats.length === 0) {
      return this.getAllPrompts(page, limit, 'newest', currentUserId, platform);
    }

    const followingIds = await this._getFollowingIds(currentUserId);
    const visibilityWhere = this._buildVisibilityWhere(followingIds);
    const platformWhere = this._buildPlatformWhere(platform);
    const where = { ...visibilityWhere, categoryId: { in: sortedCats }, ...platformWhere };

    const [data, total] = await Promise.all([
      this.prisma.prompt.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ viewCount: 'desc' }, { createdAt: 'desc' }],
      }),
      this.prisma.prompt.count({ where }),
    ]);

    return {
      data: await this.attachCreators(data),
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }
}

module.exports = V2PromptService;
