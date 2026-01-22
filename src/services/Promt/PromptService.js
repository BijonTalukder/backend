class PromptService {
  constructor(prismaClient) {
    this.prisma = prismaClient;
  }

  // Create
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
      throw new Error("Database error: Unable to create prompt",error);
    }
  }

  // Read by Category
async getAllPromptsByCategoryService(page, limit, categoryid) {
  try {
    const skip = (page - 1) * limit;

    const [prompts, total] = await Promise.all([
      this.prisma.prompt.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        where: { categoryId: categoryid },
      }),
       this.prisma.prompt.count({
        where: { categoryId: categoryid }, // Count only the category-specific prompts
      }),
    ]);

    const promptIds = prompts.map((p) => p.id);

    const interactions = await this.prisma.promptInteraction.groupBy({
      by: ["promptId", "type"],
      where: { promptId: { in: promptIds } },
      _count: { _all: true },
    });

    const interactionMap = {};
    interactions.forEach((i) => {
      if (!interactionMap[i.promptId]) {
        interactionMap[i.promptId] = { likes: 0, views: 0 };
      }
      if (i.type === "like") interactionMap[i.promptId].likes = i._count._all;
      if (i.type === "view") interactionMap[i.promptId].views = i._count._all;
    });

    const promptsWithCounts = prompts.map((p) => ({
      ...p,
      likes: interactionMap[p.id]?.likes || 0,
      views: interactionMap[p.id]?.views || 0,
    }));

    return {
      data: promptsWithCounts,
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

 // Not Categorized Prompts
async getAllPromptsByNullService(page, limit) {
  try {
    const skip = (page - 1) * limit;

    const [prompts, total] = await Promise.all([
      this.prisma.prompt.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        where: { categoryId: null },
      }),
       this.prisma.prompt.count({
        where: { categoryId: null }, // Count only the category-specific prompts
      }),
    ]);

    const promptIds = prompts.map((p) => p.id);

    const interactions = await this.prisma.promptInteraction.groupBy({
      by: ["promptId", "type"],
      where: { promptId: { in: promptIds } },
      _count: { _all: true },
    });

    const interactionMap = {};
    interactions.forEach((i) => {
      if (!interactionMap[i.promptId]) {
        interactionMap[i.promptId] = { likes: 0, views: 0 };
      }
      if (i.type === "like") interactionMap[i.promptId].likes = i._count._all;
      if (i.type === "view") interactionMap[i.promptId].views = i._count._all;
    });

    const promptsWithCounts = prompts.map((p) => ({
      ...p,
      likes: interactionMap[p.id]?.likes || 0,
      views: interactionMap[p.id]?.views || 0,
    }));

    return {
      data: promptsWithCounts,
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


 // Read with categoryId
async getAllPrompts(page, limit) {
  try {
    const skip = (page - 1) * limit;

    const [prompts,total] = await Promise.all([
      this.prisma.prompt.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        
      }),
      this.prisma.prompt.count(),
    ]);

    const promptIds = prompts.map((p) => p.id);

    const interactions = await this.prisma.promptInteraction.groupBy({
      by: ["promptId", "type"],
      where: { promptId: { in: promptIds } },
      _count: { _all: true },
    });

    const interactionMap = {};
    interactions.forEach((i) => {
      if (!interactionMap[i.promptId]) {
        interactionMap[i.promptId] = { likes: 0, views: 0 };
      }
      if (i.type === "like") interactionMap[i.promptId].likes = i._count._all;
      if (i.type === "view") interactionMap[i.promptId].views = i._count._all;
    });

    let promptsWithCounts = prompts.map((p) => ({
      ...p,
      likes: interactionMap[p.id]?.likes || 0,
      views: interactionMap[p.id]?.views || 0,
    }));

    // promptsWithCounts = promptsWithCounts.sort((a,b) => b.views - a.views);
    const totalCount = promptsWithCounts.length;
    return {
      data: promptsWithCounts,
      meta: {
        total,
        totalCount,
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


  // Read One
  async getPromptById(id) {
    try {
      return await this.prisma.prompt.findUnique({
        where: { id: id },
      });
    } catch (error) {
      console.log(error);
      throw new Error("Database error: Unable to fetch prompt");
    }
  }

  async getPromptByUser(id)
  {
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
  // Update
  async updatePrompt(id, data) {
    try {
      return await this.prisma.prompt.update({
        where: { id: id },
        data: {
          title: data.title,
          text: data.text,
          images: data.images,
          aiPlatforms: data.aiPlatforms,
          categoryId: data.categoryId
        },
      });
    } catch (error) {
      console.log(error);
      throw new Error("Database error: Unable to update prompt");
    }
  }

  // Delete
  async deletePrompt(id) {
    try {
      return await this.prisma.prompt.delete({
        where: { id: id },
      });
    } catch (error) {
      console.log(error);
      throw new Error("Database error: Unable to delete prompt");
    }
  }

}

module.exports = PromptService;
