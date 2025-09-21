class PromptService {
  constructor(prismaClient) {
    this.prisma = prismaClient;
  }

  // Create
  async createPrompt(data) {
    try {
      return await this.prisma.prompt.create({
        data: {
          title: data.title,
          text: data.text,
          images: data.images || [],
          aiPlatforms: data.aiPlatforms || [],
        },
      });
    } catch (error) {
      console.log(error);
      throw new Error("Database error: Unable to create prompt");
    }
  }

  // Read All
async getAllPrompts(page, limit) {
  try {
    const skip = (page - 1) * limit;

    const [prompts, total] = await Promise.all([
      this.prisma.prompt.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.prompt.count(),
    ]);

    const promptsWithCounts = await Promise.all(
      prompts.map(async (p) => {
        const [likes, views] = await Promise.all([
          this.prisma.promptInteraction.count({
            where: { promptId: p.id, type: "like" },
          }),
          this.prisma.promptInteraction.count({
            where: { promptId: p.id, type: "view" },
          }),
        ]);

        return {
          ...p,
          likes,
          views,
        };
      })
    );

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
