class PromptInteractionController {
  constructor(interactionService) {
    this.interactionService = interactionService;
  }

  // Record a new interaction
 async recordInteraction(req, res, next) {
  try {
    const { promptId, type } = req.body;
    if (!promptId || !type)
      return res.status(400).json({ success: false, message: "Missing promptId or type" });

    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    const result = await this.interactionService.recordInteraction({ promptId, type, ip });
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

  // Get interactions by prompt
  async getInteractions(req, res, next) {
    try {
      const { promptId, type } = req.query;
      const result = await this.interactionService.getInteractionsByPrompt(promptId, type);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  // Get analytics for admin (time-wise)
  async getAnalytics(req, res, next) {
    try {
      const { promptId, type, fromDate, toDate } = req.query;
      const result = await this.interactionService.getAnalytics(
        promptId,
        type,
        fromDate ? new Date(fromDate) : undefined,
        toDate ? new Date(toDate) : undefined
      );
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = PromptInteractionController;
