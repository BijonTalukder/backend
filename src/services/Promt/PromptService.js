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

  // ─── Helper: attach likes/views to prompts ─────────────────
  async _attachInteractionCounts(prompts) {
    if (prompts.length === 0) return prompts;

    const promptIds = prompts.map((p) => p.id);

    const interactions = await this.prisma.promptInteraction.groupBy({
      by: ["promptId", "type"],
      where: { promptId: { in: promptIds } },
      _count: { _all: true },
    });

    const interactionMap = {};
    interactions.forEach((i) => {
      if (!interactionMap[i.promptId])
        interactionMap[i.promptId] = { likes: 0, views: 0 };
      if (i.type === "like") interactionMap[i.promptId].likes = i._count._all;
      if (i.type === "view") interactionMap[i.promptId].views = i._count._all;
    });

    return prompts.map((p) => ({
      ...p,
      likes: interactionMap[p.id]?.likes || 0,
      views: interactionMap[p.id]?.views || 0,
    }));
  }

  // ─── Helper: get globally sorted IDs by view count ─────────
  // সব prompt IDs একবারে views দিয়ে sort করে নাও,
  // তারপর slice করে paginate — এতে page boundary তে data mix হয় না।
  async _getSortedIds(where = {}) {
    // Step 1: সব prompt ID গুলো নাও (createdAt desc = tiebreaker)
    const allPrompts = await this.prisma.prompt.findMany({
      where,
      select: { id: true },
      orderBy: { createdAt: "desc" },
    });
    const allIds = allPrompts.map((p) => p.id);

    if (allIds.length === 0) return [];

    // Step 2: view count groupBy করো
    const viewGroups = await this.prisma.promptInteraction.groupBy({
      by: ["promptId"],
      where: { promptId: { in: allIds }, type: "view" },
      _count: { _all: true },
    });

    // Step 3: JS এ sort করো (views desc)
    viewGroups.sort((a, b) => b._count._all - a._count._all);
    const sortedWithViews = viewGroups.map((g) => g.promptId);
    const sortedSet = new Set(sortedWithViews);

    // Step 4: 0 views যাদের, তারা শেষে আসবে (createdAt desc order maintain হবে)
    const zeroViewIds = allIds.filter((id) => !sortedSet.has(id));

    // Final order: most viewed → ... → 0 views (newest first)
    return [...sortedWithViews, ...zeroViewIds];
  }

  // ─── Helper: fetch prompts in exact ID order ────────────────
  async _fetchInOrder(pageIds) {
    if (pageIds.length === 0) return [];

    const prompts = await this.prisma.prompt.findMany({
      where: { id: { in: pageIds } },
    });

    // findMany with `in` doesn't guarantee order — re-sort manually
    const promptMap = new Map(prompts.map((p) => [p.id, p]));
    return pageIds.map((id) => promptMap.get(id)).filter(Boolean);
  }

  // ─── Get All Prompts ───────────────────────────────────────
  async getAllPrompts(page, limit) {
    try {
      const skip = (page - 1) * limit;

      const allSortedIds = await this._getSortedIds();
      const total = allSortedIds.length;

      const pageIds = allSortedIds.slice(skip, skip + limit);
      const ordered = await this._fetchInOrder(pageIds);
      const data = await this._attachInteractionCounts(ordered);

      return {
        data,
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
  async getAllPromptsByCategoryService(page, limit, categoryid) {
    try {
      const skip = (page - 1) * limit;

      const allSortedIds = await this._getSortedIds({ categoryId: categoryid });
      const total = allSortedIds.length;

      const pageIds = allSortedIds.slice(skip, skip + limit);
      const ordered = await this._fetchInOrder(pageIds);
      const data = await this._attachInteractionCounts(ordered);

      return {
        data,
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

      const allSortedIds = await this._getSortedIds({ categoryId: null });
      const total = allSortedIds.length;

      const pageIds = allSortedIds.slice(skip, skip + limit);
      const ordered = await this._fetchInOrder(pageIds);
      const data = await this._attachInteractionCounts(ordered);

      return {
        data,
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
      return await this.prisma.prompt.findMany({
        where: { createdBy: id },
        orderBy: { createdAt: "desc" },
      });
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
