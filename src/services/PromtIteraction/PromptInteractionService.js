class PromptInteractionService {
  constructor(prismaClient) {
    this.prisma = prismaClient;
  }

  // Record interaction
  async recordInteraction(data) {
    try {
      return await this.prisma.promptInteraction.create({
        data: {
          promptId: data.promptId,
          type: data.type,
          ip:data.ip
        },
      });
    } catch (error) {
      console.log(error);
      throw new Error("Database error: Unable to record interaction");
    }
  }

  // Get interactions by prompt ID (optionally filter by type)
  async getInteractionsByPrompt(promptId, type) {
    try {
      const where = { promptId };
      if (type) where.type = type;

      return await this.prisma.promptInteraction.findMany({
        where,
        orderBy: { createdAt: "desc" },
      });
    } catch (error) {
      console.log(error);
      throw new Error("Database error: Unable to fetch interactions");
    }
  }

  // Get analytics (time-wise)
  async getAnalytics(promptId, type, fromDate, toDate) {
    try {
      const where = { promptId };
      if (type) where.type = type;
      if (fromDate) where.createdAt = { gte: fromDate };
      if (toDate) where.createdAt = { ...where.createdAt, lte: toDate };

      return await this.prisma.promptInteraction.groupBy({
        by: ["type", "createdAt","ip"],
        _count: { _all: true },
        where,
        orderBy: { createdAt: "asc" },
      });
    } catch (error) {
      console.log(error);
      throw new Error("Database error: Unable to fetch analytics");
    }
  }
}

module.exports = PromptInteractionService;
