class FollowService {
  constructor(prismaClient) {
    this.prisma = prismaClient;
  }

  async follow(followerId, followingId) {
    if (followerId === followingId) {
      throw new Error('Cannot follow yourself');
    }

    const existing = await this.prisma.follow.findUnique({
      where: {
        followerId_followingId: { followerId, followingId },
      },
    });

    if (existing) {
      throw new Error('Already following this user');
    }

    const follow = await this.prisma.follow.create({
      data: { followerId, followingId },
    });

    return follow;
  }

  async unfollow(followerId, followingId) {
    if (followerId === followingId) {
      throw new Error('Cannot unfollow yourself');
    }

    const existing = await this.prisma.follow.findUnique({
      where: {
        followerId_followingId: { followerId, followingId },
      },
    });

    if (!existing) {
      throw new Error('Not following this user');
    }

    await this.prisma.follow.delete({
      where: {
        followerId_followingId: { followerId, followingId },
      },
    });

    return { message: 'Unfollowed successfully' };
  }

  async getFollowers(userId, page, limit) {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.follow.findMany({
        where: { followingId: userId },
        skip,
        take: limit,
        include: {
          follower: {
            select: {
              id: true, name: true, email: true, avatar: true,
              profession: true, bio: true, location: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.follow.count({ where: { followingId: userId } }),
    ]);

    return {
      data: data.map((f) => ({
        id: f.follower.id,
        name: f.follower.name,
        email: f.follower.email,
        avatar: f.follower.avatar,
        profession: f.follower.profession,
        bio: f.follower.bio,
        location: f.follower.location,
        followedAt: f.createdAt,
      })),
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async getFollowing(userId, page, limit) {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.follow.findMany({
        where: { followerId: userId },
        skip,
        take: limit,
        include: {
          following: {
            select: {
              id: true, name: true, email: true, avatar: true,
              profession: true, bio: true, location: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.follow.count({ where: { followerId: userId } }),
    ]);

    return {
      data: data.map((f) => ({
        id: f.following.id,
        name: f.following.name,
        email: f.following.email,
        avatar: f.following.avatar,
        profession: f.following.profession,
        bio: f.following.bio,
        location: f.following.location,
        followedAt: f.createdAt,
      })),
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async getFollowStatus(currentUserId, targetUserId) {
    const [follow, followersCount, followingCount] = await Promise.all([
      this.prisma.follow.findUnique({
        where: {
          followerId_followingId: {
            followerId: currentUserId,
            followingId: targetUserId,
          },
        },
      }),
      this.prisma.follow.count({ where: { followingId: targetUserId } }),
      this.prisma.follow.count({ where: { followerId: targetUserId } }),
    ]);

    return {
      isFollowing: !!follow,
      followersCount,
      followingCount,
    };
  }

  async getPublicCounts(userId) {
    const [followersCount, followingCount] = await Promise.all([
      this.prisma.follow.count({ where: { followingId: userId } }),
      this.prisma.follow.count({ where: { followerId: userId } }),
    ]);

    return { followersCount, followingCount };
  }
}

module.exports = FollowService;
