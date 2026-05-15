class V2PromptService {
  constructor(prismaClient) {
    this.prisma = prismaClient;
  }

  async getCreator(userId) {
    if (!userId) return null;
    try {
      return await this.prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true, name: true, email: true, avatar: true,
          profession: true, bio: true, location: true, whatsapp: true,
          createdAt: true,
        },
      });
    } catch {
      return null;
    }
  }

  async getPromptCount(userId) {
    if (!userId) return 0;
    try {
      return await this.prisma.prompt.count({ where: { createdBy: userId } });
    } catch {
      return 0;
    }
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

    const prompts = await Promise.all(
      data.map(async (p) => {
        const creator = await this.getCreator(p.createdBy);
        const promptCount = creator ? await this.getPromptCount(p.createdBy) : 0;
        return this.formatPrompt(p, creator, promptCount);
      }),
    );

    return {
      data: prompts,
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

    const prompts = await Promise.all(
      data.map(async (p) => {
        const creator = await this.getCreator(p.createdBy);
        const promptCount = creator ? await this.getPromptCount(p.createdBy) : 0;
        return this.formatPrompt(p, creator, promptCount);
      }),
    );

    return {
      data: prompts,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async getPromptById(id) {
    const p = await this.prisma.prompt.findUnique({ where: { id } });
    if (!p) return null;
    const creator = await this.getCreator(p.createdBy);
    const promptCount = creator ? await this.getPromptCount(p.createdBy) : 0;
    return this.formatPrompt(p, creator, promptCount);
  }

  async getPromptsByUser(userId) {
    const data = await this.prisma.prompt.findMany({
      where: { createdBy: userId },
      orderBy: { createdAt: 'desc' },
    });
    const creator = await this.getCreator(userId);
    const promptCount = data.length;
    return data.map((p) => this.formatPrompt(p, creator, promptCount));
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

    const prompts = await Promise.all(
      data.map(async (p) => {
        const creator = await this.getCreator(p.createdBy);
        const promptCount = creator ? await this.getPromptCount(p.createdBy) : 0;
        return this.formatPrompt(p, creator, promptCount);
      }),
    );

    return {
      data: prompts,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }
}

module.exports = V2PromptService;
