class V2UserService {
  constructor(prismaClient) {
    this.prisma = prismaClient;
  }

  async getTopCreators(page, limit) {
    const skip = (page - 1) * limit;

    // Check if CreatorStat has data
    const total = await this.prisma.creatorStat.count();

    // Fallback: aggregate on-the-fly if CreatorStat not yet synced
    if (total === 0) {
      return this._getTopCreatorsLegacy(page, limit);
    }

    const stats = await this.prisma.creatorStat.findMany({
      orderBy: { score: 'desc' },
      skip,
      take: limit,
    });

    const userIds = stats.map((s) => s.userId);
    const users = await this.prisma.user.findMany({
      where: { id: { in: userIds } },
      select: {
        id: true, name: true, email: true, avatar: true,
        profession: true, bio: true, location: true, createdAt: true,
      },
    });

    const userMap = {};
    users.forEach((u) => { userMap[u.id] = u; });

    const ranked = stats.map((s, i) => {
      const u = userMap[s.userId] || { name: 'Unknown' };
      return {
        id: s.userId,
        name: u.name,
        email: u.email,
        avatar: u.avatar,
        profession: u.profession,
        bio: u.bio,
        location: u.location,
        joinedAt: u.createdAt,
        stats: {
          promptCount: s.promptCount,
          totalLikes: s.totalLikes,
          totalViews: s.totalViews,
          totalCopies: s.totalCopies,
        },
        score: s.score,
        rank: skip + i + 1,
      };
    });

    return {
      data: ranked,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  // Fallback: aggregate from prompts directly (used before CreatorStat sync)
  async _getTopCreatorsLegacy(page, limit) {
    const skip = (page - 1) * limit;

    const users = await this.prisma.user.findMany({
      where: { role: { not: 'admin' } },
      select: {
        id: true, name: true, email: true, avatar: true,
        profession: true, bio: true, location: true, createdAt: true,
      },
    });

    const enriched = await Promise.all(
      users.map(async (u) => {
        const prompts = await this.prisma.prompt.findMany({
          where: { createdBy: u.id },
          select: { id: true, likeCount: true, viewCount: true },
        });

        const promptCount = prompts.length;
        const totalLikes = prompts.reduce((sum, p) => sum + (p.likeCount || 0), 0);
        const totalViews = prompts.reduce((sum, p) => sum + (p.viewCount || 0), 0);
        const totalCopies = totalViews;

        return {
          id: u.id,
          name: u.name,
          email: u.email,
          avatar: u.avatar,
          profession: u.profession,
          bio: u.bio,
          location: u.location,
          joinedAt: u.createdAt,
          stats: { promptCount, totalLikes, totalViews, totalCopies },
          score: totalLikes * 10 + totalViews * 1 + promptCount * 100 + totalCopies * 2,
        };
      }),
    );

    enriched.sort((a, b) => b.score - a.score);
    const allRanked = enriched.map((u, i) => ({ ...u, rank: i + 1 }));

    const ranked = allRanked.slice(skip, skip + limit);

    return {
      data: ranked,
      meta: { total: allRanked.length, page, limit, totalPages: Math.ceil(allRanked.length / limit) },
    };
  }

  async getProfile(userId) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true, name: true, email: true, avatar: true,
        profession: true, bio: true, location: true, whatsapp: true,
        createdAt: true,
      },
    });

    if (!user) return null;

    const stat = await this.prisma.creatorStat.findUnique({
      where: { userId },
    });

    return {
      ...user,
      stats: stat
        ? {
            promptCount: stat.promptCount,
            totalLikes: stat.totalLikes,
            totalViews: stat.totalViews,
            totalCopies: stat.totalCopies,
          }
        : { promptCount: 0, totalLikes: 0, totalViews: 0, totalCopies: 0 },
    };
  }

  async getUserCategoryPreferences(userId) {
    const prompts = await this.prisma.prompt.findMany({
      where: { createdBy: userId },
      select: { categoryId: true },
    });

    const catCount = {};
    for (const p of prompts) {
      if (p.categoryId) {
        catCount[p.categoryId] = (catCount[p.categoryId] || 0) + 1;
      }
    }

    const sorted = Object.entries(catCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([categoryId, count]) => ({ categoryId, count }));

    return sorted;
  }

  async syncCreatorStats() {
    const users = await this.prisma.user.findMany({
      where: { role: { not: 'admin' } },
      select: { id: true },
    });

    let synced = 0;
    for (const u of users) {
      const prompts = await this.prisma.prompt.findMany({
        where: { createdBy: u.id },
        select: { likeCount: true, viewCount: true },
      });

      const promptCount = prompts.length;
      const totalLikes = prompts.reduce((sum, p) => sum + (p.likeCount || 0), 0);
      const totalViews = prompts.reduce((sum, p) => sum + (p.viewCount || 0), 0);
      const totalCopies = totalViews;
      const score = totalLikes * 10 + totalViews * 1 + promptCount * 100 + totalCopies * 2;

      await this.prisma.creatorStat.upsert({
        where: { userId: u.id },
        create: { userId: u.id, promptCount, totalLikes, totalViews, totalCopies, score },
        update: { promptCount, totalLikes, totalViews, totalCopies, score },
      });
      synced++;
    }

    return { synced };
  }
}

module.exports = V2UserService;
