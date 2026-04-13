class PromptService {
  constructor(prismaClient) {
    this.prisma = prismaClient;
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
        },
      });
    } catch (error) {
      console.log(error);
      throw new Error("Database error: Unable to create prompt", error);
    }
  }

  // ─── Get All Prompts ───────────────────────────────────────
  async getAllPrompts(page, limit) {
    try {
      const skip = (page - 1) * limit;

      const [data, total] = await Promise.all([
        this.prisma.prompt.findMany({
          skip,
          take: limit,
          orderBy: [
            { viewCount: "desc" },
            { createdAt: "desc" }
          ],
        }),
        this.prisma.prompt.count(),
      ]);

      // Map DB fields to what frontend expects if necessary
      const formattedData = data.map((p) => ({
        ...p,
        likes: p.likeCount,
        views: p.viewCount,
        usedCount: p.viewCount,
      }));

      return {
        data: formattedData,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      console.error(error);
      throw new Error("Database error: Unable to fetch prompts");
    }
  }

  // ─── Get Prompts by Category ───────────────────────────────
  async getAllPromptsByCategoryService(page, limit, categoryId) {
    try {
      const skip = (page - 1) * limit;
      const where = { categoryId };

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
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      console.error(error);
      throw new Error("Database error: Unable to fetch prompts");
    }
  }

  // ─── Get Uncategorized Prompts ─────────────────────────────
  async getAllPromptsByNullService(page, limit) {
    try {
      const skip = (page - 1) * limit;
      const where = { categoryId: null };

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
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
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
      return await this.prisma.prompt.update({
        where: { id },
        data: {
          title: data.title,
          text: data.text,
          images: data.images,
          aiPlatforms: data.aiPlatforms,
          categoryId: data.categoryId,
        },
      });
    } catch (error) {
      console.log(error);
      throw new Error("Database error: Unable to update prompt");
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
