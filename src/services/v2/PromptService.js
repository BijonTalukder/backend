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

  async getAllPrompts(page, limit, sortBy) {
    const skip = (page - 1) * limit;
    let orderBy;
    switch (sortBy) {
      case 'likes': orderBy = { likeCount: 'desc' }; break;
      case 'copies': orderBy = { viewCount: 'desc' }; break;
      case 'newest': orderBy = { createdAt: 'desc' }; break;
      default: orderBy = [{ viewCount: 'desc' }, { createdAt: 'desc' }]; break;
    }

    const [data, total] = await Promise.all([
      this.prisma.prompt.findMany({ skip, take: limit, orderBy }),
      this.prisma.prompt.count(),
    ]);

    return {
      data: await this.attachCreators(data),
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async getPromptsByCategory(page, limit, categoryId, sortBy) {
    const skip = (page - 1) * limit;
    const where = { categoryId };
    let orderBy;
    switch (sortBy) {
      case 'likes': orderBy = { likeCount: 'desc' }; break;
      case 'copies': orderBy = { viewCount: 'desc' }; break;
      case 'newest': orderBy = { createdAt: 'desc' }; break;
      default: orderBy = [{ viewCount: 'desc' }, { createdAt: 'desc' }]; break;
    }

    const [data, total] = await Promise.all([
      this.prisma.prompt.findMany({ where, skip, take: limit, orderBy }),
      this.prisma.prompt.count({ where }),
    ]);

    return {
      data: await this.attachCreators(data),
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async getPromptById(id) {
    const p = await this.prisma.prompt.findUnique({ where: { id } });
    if (!p) return null;
    const results = await this.attachCreators([p]);
    return results[0];
  }

  async getPromptsByUser(userId) {
    const data = await this.prisma.prompt.findMany({
      where: { createdBy: userId },
      orderBy: { createdAt: 'desc' },
    });
    return this.attachCreators(data);
  }

  async getRecommendedPrompts(ip, page, limit) {
    const skip = (page - 1) * limit;

    const interactions = await this.prisma.promptInteraction.findMany({
      where: { ip },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    if (interactions.length === 0) {
      return this.getAllPrompts(page, limit, 'newest');
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
      return this.getAllPrompts(page, limit, 'newest');
    }

    const [data, total] = await Promise.all([
      this.prisma.prompt.findMany({
        where: { categoryId: { in: sortedCats } },
        skip,
        take: limit,
        orderBy: [{ viewCount: 'desc' }, { createdAt: 'desc' }],
      }),
      this.prisma.prompt.count({ where: { categoryId: { in: sortedCats } } }),
    ]);

    return {
      data: await this.attachCreators(data),
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }
}

module.exports = V2PromptService;
