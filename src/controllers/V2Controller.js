class V2Controller {
  constructor(promptService, userService) {
    this.promptService = promptService;
    this.userService = userService;
  }

  _getCurrentUserId(req) {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      try {
        const token = authHeader.split(' ')[1];
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, 'key123');
        return decoded.id;
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  // ── Prompts ──────────────────────────────────────────────

  getAllPrompts = async (req, res, next) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.size) || 15;
      const sortBy = req.query.sortBy || 'default';
      const currentUserId = this._getCurrentUserId(req);
      const platform = req.query.platform;
      const result = await this.promptService.getAllPrompts(page, limit, sortBy, currentUserId, platform);
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
      const currentUserId = this._getCurrentUserId(req);
      const platform = req.query.platform;
      const result = await this.promptService.getPromptsByCategory(page, limit, req.params.id, sortBy, currentUserId, platform);
      res.status(200).json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  };

  getPromptById = async (req, res, next) => {
    try {
      const currentUserId = this._getCurrentUserId(req);
      const result = await this.promptService.getPromptById(req.params.id, currentUserId);
      if (!result) return res.status(404).json({ success: false, message: 'Prompt not found' });
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  getPromptsByUser = async (req, res, next) => {
    try {
      const currentUserId = this._getCurrentUserId(req);
      const platform = req.query.platform;
      const data = await this.promptService.getPromptsByUser(req.params.id, currentUserId, platform);
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
      const currentUserId = this._getCurrentUserId(req);
      const platform = req.query.platform;
      const result = await this.promptService.getRecommendedPrompts(ip, page, limit, currentUserId, platform);
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
      let currentUserId = null;
      const authHeader = req.headers.authorization;
      if (authHeader) {
        try {
          const token = authHeader.split(' ')[1];
          const jwt = require('jsonwebtoken');
          const decoded = jwt.verify(token, 'key123');
          currentUserId = decoded.id;
        } catch (e) {
          // Token invalid or expired - still show public profile
        }
      }
      const result = await this.userService.getProfile(req.params.id, currentUserId);
      if (!result) return res.status(404).json({ success: false, message: 'User not found' });
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  // ── Follow / Unfollow ─────────────────────────────────────

  follow = async (req, res, next) => {
    try {
      const currentUserId = this._getCurrentUserId(req);
      if (!currentUserId) return res.status(401).json({ success: false, message: 'Authentication required' });
      const result = await this.userService.follow(currentUserId, req.params.userId);
      res.status(200).json({ success: true, message: result.alreadyFollowing ? 'Already following' : 'Followed successfully', data: result });
    } catch (error) {
      next(error);
    }
  };

  unfollow = async (req, res, next) => {
    try {
      const currentUserId = this._getCurrentUserId(req);
      if (!currentUserId) return res.status(401).json({ success: false, message: 'Authentication required' });
      await this.userService.unfollow(currentUserId, req.params.userId);
      res.status(200).json({ success: true, message: 'Unfollowed successfully' });
    } catch (error) {
      next(error);
    }
  };

  getFollowers = async (req, res, next) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.size) || 20;
      const currentUserId = this._getCurrentUserId(req);
      const result = await this.userService.getFollowers(req.params.userId, page, limit, currentUserId);
      res.status(200).json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  };

  getFollowing = async (req, res, next) => {
    try {
      const currentUserId = this._getCurrentUserId(req);
      if (!currentUserId) return res.status(401).json({ success: false, message: 'Authentication required' });
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.size) || 20;
      const result = await this.userService.getFollowing(req.params.userId, page, limit, currentUserId);
      res.status(200).json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  };

  // ── Sync Creator Stats ────────────────────────────────────

  syncCreatorStats = async (req, res, next) => {
    try {
      const result = await this.userService.syncCreatorStats();
      res.status(200).json({ success: true, message: 'Creator stats synced', data: result });
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
