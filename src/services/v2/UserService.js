class V2UserService {
  constructor(prismaClient) {
    this.prisma = prismaClient;
  }

  async getTopCreators(page, limit) {
    return this._getTopCreatorsLegacy(page, limit);
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
          score: totalLikes * 10 + totalViews * 2 + promptCount * 10,
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

  async getProfile(userId, currentUserId) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true, name: true, email: true, avatar: true,
        profession: true, bio: true, location: true, whatsapp: true,
        createdAt: true,
      },
    });

    if (!user) return null;

    const [stat, followersCount, followingCount, isFollowing] = await Promise.all([
      this.prisma.creatorStat.findUnique({ where: { userId } }),
      this.prisma.follow.count({ where: { followingId: userId } }),
      this.prisma.follow.count({ where: { followerId: userId } }),
      currentUserId
        ? this.prisma.follow.findUnique({
            where: {
              followerId_followingId: {
                followerId: currentUserId,
                followingId: userId,
              },
            },
          })
        : Promise.resolve(null),
    ]);

    return {
      ...user,
      followersCount,
      followingCount,
      isFollowing: !!isFollowing,
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

  async follow(followerId, followingId) {
    if (followerId === followingId) throw new Error('Cannot follow yourself');
    const existing = await this.prisma.follow.findUnique({
      where: { followerId_followingId: { followerId, followingId } },
    });
    if (existing) return { alreadyFollowing: true };
    await this.prisma.follow.create({
      data: { followerId, followingId },
    });
    return { alreadyFollowing: false };
  }

  async unfollow(followerId, followingId) {
    try {
      await this.prisma.follow.delete({
        where: { followerId_followingId: { followerId, followingId } },
      });
    } catch (e) {
      throw new Error('Not following this user');
    }
  }

  async getFollowers(userId, page, limit, currentUserId) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.follow.findMany({
        where: { followingId: userId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          follower: {
            select: {
              id: true, name: true, email: true, avatar: true,
              profession: true, bio: true, location: true, createdAt: true,
            },
          },
        },
      }),
      this.prisma.follow.count({ where: { followingId: userId } }),
    ]);

    const followers = data.map((f) => ({
      ...f.follower,
      followedAt: f.createdAt,
    }));

    return {
      data: followers,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async getFollowing(userId, page, limit, currentUserId) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.follow.findMany({
        where: { followerId: userId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          following: {
            select: {
              id: true, name: true, email: true, avatar: true,
              profession: true, bio: true, location: true, createdAt: true,
            },
          },
        },
      }),
      this.prisma.follow.count({ where: { followerId: userId } }),
    ]);

    const following = data.map((f) => ({
      ...f.following,
      followedAt: f.createdAt,
    }));

    return {
      data: following,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
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
      const score = totalLikes * 10 + totalViews * 2 + promptCount * 10;

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
