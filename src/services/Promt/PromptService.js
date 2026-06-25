class PromptService {
  constructor(prismaClient) {
    this.prisma = prismaClient;
  }

  _buildPlatformWhere(platform) {
    if (!platform || platform === 'all') return {};
    if (platform === 'web') return { platform: { in: ['ALL', 'WEB'] } };
    if (platform === 'mobile') return { platform: { in: ['ALL', 'MOBILE'] } };
    return {};
  }

  // ─── Create ───────────────────────────────────────────────
  async createPrompt(data) {
    try {
      return await this.prisma.prompt.create({
        data: {
          ...data,
          title: data.title,
          text: data.text,
          images: data.images || [],
          aiPlatforms: data.aiPlatforms || [],
          categoryId: data.categoryId,
          visibility: data.visibility || 'PUBLIC',
          platform: data.platform || 'ALL',
        },
      });
    } catch (error) {
      console.log(error);
      throw new Error("Database error: Unable to create prompt", error);
    }
  }

  // ─── Get All Prompts ───────────────────────────────────────
  async getAllPrompts(page, limit, platform) {
    try {
      const skip = (page - 1) * limit;
      const platformWhere = this._buildPlatformWhere(platform);
      const where = { ...platformWhere };

      const [data, total] = await Promise.all([
        this.prisma.prompt.findMany({
          where,
          skip,
          take: limit,
          orderBy: [
            { viewCount: "desc" },
            { createdAt: "desc" }
          ],
        }),
        this.prisma.prompt.count({ where }),
      ]);

      const formattedData = data.map((p) => ({
        ...p,
        likes: p.likeCount,
        views: p.viewCount,
        usedCount: p.viewCount,
      }));

      return {
        data: formattedData,
        meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
      };
    } catch (error) {
      console.error(error);
      throw new Error("Database error: Unable to fetch prompts");
    }
  }

  // ─── Get Prompts by Category ───────────────────────────────
  async getAllPromptsByCategoryService(page, limit, categoryId, platform) {
    try {
      const skip = (page - 1) * limit;
      const platformWhere = this._buildPlatformWhere(platform);
      const where = { categoryId, ...platformWhere };

      const [data, total] = await Promise.all([
        this.prisma.prompt.findMany({ where, skip, take: limit, orderBy: [{ viewCount: "desc" }, { createdAt: "desc" }] }),
        this.prisma.prompt.count({ where }),
      ]);

      const formattedData = data.map((p) => ({
        ...p,
        likes: p.likeCount,
        views: p.viewCount,
        usedCount: p.viewCount,
      }));

      return {
        data: formattedData,
        meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
      };
    } catch (error) {
      console.error(error);
      throw new Error("Database error: Unable to fetch prompts");
    }
  }

  // ─── Get Uncategorized Prompts ─────────────────────────────
  async getAllPromptsByNullService(page, limit, platform) {
    try {
      const skip = (page - 1) * limit;
      const platformWhere = this._buildPlatformWhere(platform);
      const where = { categoryId: null, ...platformWhere };

      const [data, total] = await Promise.all([
        this.prisma.prompt.findMany({ where, skip, take: limit, orderBy: [{ viewCount: "desc" }, { createdAt: "desc" }] }),
        this.prisma.prompt.count({ where }),
      ]);

      const formattedData = data.map((p) => ({
        ...p,
        likes: p.likeCount,
        views: p.viewCount,
        usedCount: p.viewCount,
      }));

      return {
        data: formattedData,
        meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
      };
    } catch (error) {
      console.error(error);
      throw new Error("Database error: Unable to fetch prompts");
    }
  }

  // ─── Read One ──────────────────────────────────────────────
  async getPromptById(id) {
    try {
      return await this.prisma.prompt.findUnique({ where: { id } });
    } catch (error) {
      console.log(error);
      throw new Error("Database error: Unable to fetch prompt");
    }
  }

  // ─── Read by User ──────────────────────────────────────────
  async getPromptByUser(id) {
    try {
      const prompts = await this.prisma.prompt.findMany({
        where: { createdBy: id },
        orderBy: { createdAt: "desc" },
      });

      return prompts.map((p) => ({
        ...p,
        likes: p.likeCount,
        views: p.viewCount,
        usedCount: p.viewCount,
      }));
    } catch (error) {
      console.log(error);
      throw new Error("Database error: Unable to fetch prompt");
    }
  }

  // ─── Update ────────────────────────────────────────────────
  async updatePrompt(id, data) {
    try {
      const updateData = {};
      if (data.title !== undefined) updateData.title = data.title;
      if (data.text !== undefined) updateData.text = data.text;
      if (data.images !== undefined) updateData.images = data.images;
      if (data.aiPlatforms !== undefined) updateData.aiPlatforms = data.aiPlatforms;
      if (data.categoryId !== undefined) updateData.categoryId = data.categoryId;
      if (data.visibility !== undefined) updateData.visibility = data.visibility;
      if (data.platform !== undefined) updateData.platform = data.platform;

      return await this.prisma.prompt.update({
        where: { id },
        data: updateData,
      });
    } catch (error) {
      console.log(error);
      throw new Error("Database error: Unable to update prompt");
    }
  }

  // ─── Update Visibility ─────────────────────────────────────
  async updateVisibility(id, visibility) {
    try {
      return await this.prisma.prompt.update({
        where: { id },
        data: { visibility },
      });
    } catch (error) {
      console.log(error);
      throw new Error("Database error: Unable to update visibility");
    }
  }

  // ─── Public Feed (respects visibility + platform) ──────────
  async getPublicFeed(page, limit, currentUserId, platform) {
    try {
      const skip = (page - 1) * limit;

      let followingIds = [];
      if (currentUserId) {
        const following = await this.prisma.follow.findMany({
          where: { followerId: currentUserId },
          select: { followingId: true },
        });
        followingIds = following.map((f) => f.followingId);
      }

      const platformWhere = this._buildPlatformWhere(platform);

      const where = {
        ...platformWhere,
        OR: [
          { visibility: 'PUBLIC' },
          ...(followingIds.length > 0
            ? [{ visibility: 'FOLLOWERS_ONLY', createdBy: { in: followingIds } }]
            : []),
        ],
      };

      const [data, total] = await Promise.all([
        this.prisma.prompt.findMany({ where, skip, take: limit, orderBy: [{ viewCount: "desc" }, { createdAt: "desc" }] }),
        this.prisma.prompt.count({ where }),
      ]);

      const formattedData = data.map((p) => ({
        ...p,
        likes: p.likeCount,
        views: p.viewCount,
        usedCount: p.viewCount,
      }));

      return {
        data: formattedData,
        meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
      };
    } catch (error) {
      console.error(error);
      throw new Error("Database error: Unable to fetch feed");
    }
  }

  // ─── Get Prompts by User (respects visibility + platform) ──
  async getPromptsByUserWithVisibility(userId, currentUserId, page, limit, platform) {
    try {
      const skip = (page - 1) * limit;
      const isOwner = currentUserId === userId;

      let where;
      if (isOwner) {
        where = { createdBy: userId };
      } else {
        let isFollowing = false;
        if (currentUserId) {
          const follow = await this.prisma.follow.findUnique({
            where: {
              followerId_followingId: {
                followerId: currentUserId,
                followingId: userId,
              },
            },
          });
          isFollowing = !!follow;
        }

        where = {
          createdBy: userId,
          ...(isFollowing ? {} : { visibility: 'PUBLIC' }),
        };
      }

      const platformWhere = this._buildPlatformWhere(platform);
      where = { ...where, ...platformWhere };

      const [data, total] = await Promise.all([
        this.prisma.prompt.findMany({ where, skip, take: limit, orderBy: { createdAt: "desc" } }),
        this.prisma.prompt.count({ where }),
      ]);

      return {
        data: data.map((p) => ({
          ...p,
          likes: p.likeCount,
          views: p.viewCount,
          usedCount: p.viewCount,
        })),
        meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
      };
    } catch (error) {
      console.log(error);
      throw new Error("Database error: Unable to fetch prompt");
    }
  }

  // ─── Delete ────────────────────────────────────────────────
  async deletePrompt(id) {
    try {
      return await this.prisma.prompt.delete({ where: { id } });
    } catch (error) {
      console.log(error);
      throw new Error("Database error: Unable to delete prompt");
    }
  }
}

module.exports = PromptService;
