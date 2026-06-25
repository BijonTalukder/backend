class FollowController {
  constructor(followService) {
    this.followService = followService;
  }

  follow = async (req, res, next) => {
    try {
      const followerId = req.user.id;
      const { userId } = req.params;

      const result = await this.followService.follow(followerId, userId);
      res.status(201).json({
        success: true,
        message: 'Followed successfully',
        data: result,
      });
    } catch (error) {
      if (error.message === 'Cannot follow yourself') {
        return res.status(400).json({ success: false, message: error.message });
      }
      if (error.message === 'Already following this user') {
        return res.status(409).json({ success: false, message: error.message });
      }
      next(error);
    }
  };

  unfollow = async (req, res, next) => {
    try {
      const followerId = req.user.id;
      const { userId } = req.params;

      const result = await this.followService.unfollow(followerId, userId);
      res.status(200).json({
        success: true,
        message: 'Unfollowed successfully',
        data: result,
      });
    } catch (error) {
      if (error.message === 'Cannot unfollow yourself') {
        return res.status(400).json({ success: false, message: error.message });
      }
      if (error.message === 'Not following this user') {
        return res.status(404).json({ success: false, message: error.message });
      }
      next(error);
    }
  };

  getFollowers = async (req, res, next) => {
    try {
      const userId = req.user.id;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.size) || 20;

      const result = await this.followService.getFollowers(userId, page, limit);
      res.status(200).json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  };

  getFollowing = async (req, res, next) => {
    try {
      const userId = req.user.id;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.size) || 20;

      const result = await this.followService.getFollowing(userId, page, limit);
      res.status(200).json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  };

  getFollowStatus = async (req, res, next) => {
    try {
      const currentUserId = req.user.id;
      const { userId } = req.params;

      const result = await this.followService.getFollowStatus(currentUserId, userId);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  getPublicCounts = async (req, res, next) => {
    try {
      const { userId } = req.params;

      const result = await this.followService.getPublicCounts(userId);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = FollowController;
