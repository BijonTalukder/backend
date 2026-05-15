class PromptInteractionService {
  constructor(prismaClient) {
    this.prisma = prismaClient;
  }

  // Record interaction and update prompt counts + creator stats
  async recordInteraction(data) {
    try {
      const interaction = await this.prisma.promptInteraction.create({
        data: {
          promptId: data.promptId,
          type: data.type,
          ip: data.ip,
        },
      });

      // Prepare count increments based on interaction type
      const updateData = {};
      if (data.type === 'view') {
        updateData.viewCount = { increment: 1 };
      } else if (data.type === 'like') {
        updateData.likeCount = { increment: 1 };
      } else if (data.type === 'share') {
        updateData.shareCount = { increment: 1 };
      }

      if (Object.keys(updateData).length) {
        await this.prisma.prompt.update({
          where: { id: data.promptId },
          data: updateData,
        });

        // Update creator stats
        const prompt = await this.prisma.prompt.findUnique({
          where: { id: data.promptId },
          select: { createdBy: true },
        });

        if (prompt?.createdBy) {
          const prev = await this.prisma.creatorStat.upsert({
            where: { userId: prompt.createdBy },
            create: {
              userId: prompt.createdBy,
              promptCount: 0,
              totalLikes: 0,
              totalViews: 0,
              totalCopies: 0,
              score: 0,
            },
            update: {},
          });

          const inc = {};
          if (data.type === 'view') { inc.totalViews = 1; inc.totalCopies = 1; }
          if (data.type === 'like') inc.totalLikes = 1;

          if (Object.keys(inc).length) {
            const next = {
              totalLikes: (prev.totalLikes || 0) + (inc.totalLikes || 0),
              totalViews: (prev.totalViews || 0) + (inc.totalViews || 0),
              totalCopies: (prev.totalCopies || 0) + (inc.totalCopies || 0),
            };
            const newScore =
              next.totalLikes * 10 +
              next.totalViews * 1 +
              (prev.promptCount || 0) * 100 +
              next.totalCopies * 2;

            await this.prisma.creatorStat.update({
              where: { userId: prompt.createdBy },
              data: { ...inc, score: newScore },
            });
          }
        }
      }

      return interaction;
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
        by: ["type", "createdAt"],
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
