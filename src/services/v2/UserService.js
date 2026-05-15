class V2UserService {
  constructor(prismaClient) {
    this.prisma = prismaClient;
  }

  async getTopCreators(page, limit) {
    const skip = (page - 1) * limit;

    const users = await this.prisma.user.findMany({
      where: { role: { not: 'admin' } },
      select: {
        id: true, name: true, email: true, avatar: true,
        profession: true, bio: true, location: true, createdAt: true,
      },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
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
          stats: {
            promptCount,
            totalLikes,
            totalViews,
            totalCopies,
          },
          score: totalLikes * 2 + totalViews + promptCount * 50,
        };
      }),
    );

    enriched.sort((a, b) => b.score - a.score);
    const ranked = enriched.map((u, i) => ({ ...u, rank: i + 1 }));

    return {
      data: ranked,
      meta: { total: ranked.length, page, limit, totalPages: Math.ceil(ranked.length / limit) },
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

    const prompts = await this.prisma.prompt.findMany({
      where: { createdBy: userId },
      select: { id: true, likeCount: true, viewCount: true },
    });

    const promptCount = prompts.length;
    const totalLikes = prompts.reduce((sum, p) => sum + (p.likeCount || 0), 0);
    const totalViews = prompts.reduce((sum, p) => sum + (p.viewCount || 0), 0);

    return {
      ...user,
      stats: {
        promptCount,
        totalLikes,
        totalViews,
        totalCopies: totalViews,
      },
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
}

module.exports = V2UserService;
