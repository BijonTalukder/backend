class V2Controller {
  constructor(promptService, userService) {
    this.promptService = promptService;
    this.userService = userService;
  }

  // ── Prompts ──────────────────────────────────────────────

  getAllPrompts = async (req, res, next) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.size) || 15;
      const sortBy = req.query.sortBy || 'default';
      const result = await this.promptService.getAllPrompts(page, limit, sortBy);
      res.status(200).json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  };

  getPromptsByCategory = async (req, res, next) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.size) || 15;
      const sortBy = req.query.sortBy || 'default';
      const result = await this.promptService.getPromptsByCategory(page, limit, req.params.id, sortBy);
      res.status(200).json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  };

  getPromptById = async (req, res, next) => {
    try {
      const result = await this.promptService.getPromptById(req.params.id);
      if (!result) return res.status(404).json({ success: false, message: 'Prompt not found' });
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  getPromptsByUser = async (req, res, next) => {
    try {
      const data = await this.promptService.getPromptsByUser(req.params.id);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  };

  getRecommendedPrompts = async (req, res, next) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.size) || 15;
      const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip || 'unknown';
      const result = await this.promptService.getRecommendedPrompts(ip, page, limit);
      res.status(200).json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  };

  // ── Top Creators ─────────────────────────────────────────

  getTopCreators = async (req, res, next) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.size) || 20;
      const result = await this.userService.getTopCreators(page, limit);
      res.status(200).json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  };

  // ── Profile ──────────────────────────────────────────────

  getProfile = async (req, res, next) => {
    try {
      const result = await this.userService.getProfile(req.params.id);
      if (!result) return res.status(404).json({ success: false, message: 'User not found' });
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  // ── Category Preferences ─────────────────────────────────

  getUserCategoryPreferences = async (req, res, next) => {
    try {
      const result = await this.userService.getUserCategoryPreferences(req.params.userId);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = V2Controller;
