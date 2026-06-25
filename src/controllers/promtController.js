class PromptController {
  constructor(promptService, prisma) {
    this.promptService = promptService;
    this.prisma = prisma;
  }

  // Create Prompt
  async createPrompt(req, res, next) {
    try {
      const result = await this.promptService.createPrompt(req.body);

      // Update creator stats
      const createdBy = req.body.createdBy;
      if (createdBy) {
        const prev = await this.prisma.creatorStat.upsert({
          where: { userId: createdBy },
          create: {
            userId: createdBy,
            promptCount: 1,
            totalLikes: 0,
            totalViews: 0,
            totalCopies: 0,
            score: 10,
          },
          update: { promptCount: { increment: 1 } },
        });

        if (!prev) {
          // just created, score already set to 100
        } else {
          const newScore =
            (prev.totalLikes || 0) * 10 +
            (prev.totalViews || 0) * 2 +
            ((prev.promptCount || 0) + 1) * 10;
          await this.prisma.creatorStat.update({
            where: { userId: createdBy },
            data: { score: newScore },
          });
        }
      }

      res.status(201).json({
        success: true,
        message: "Prompt created successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get All Prompts
async getAllPrompts(req, res, next) {
  try {
    const page = parseInt(req.query.page ) || 1;
    const size = parseInt(req.query.size) || 100;
    const platform = req.query.platform;
    const result = await this.promptService.getAllPrompts(page, size, platform);

    res.status(200).json({
      success: true,
      message: "Prompts fetched successfully",
      ...result, // data + meta
    });
  } catch (error) {
    next(error);
  }
}

// Get All Prompts without Category
async getAllPromptsByNull(req, res, next) {
  try {
    const page = parseInt(req.query.page ) || 1;
    const size = parseInt(req.query.size) || 100;
    const platform = req.query.platform;
    const result = await this.promptService.getAllPromptsByNullService(page, size, platform);

    res.status(200).json({
      success: true,
      message: "Prompts fetched successfully",
      ...result, // data + meta
    });
  } catch (error) {
    next(error);
  }
}


  // Get All Prompts by Category
async getAllPromptsByCategory(req, res, next) {
  try {
    const page = parseInt(req.query.page ) || 1;
    const size = parseInt(req.query.size) || 100;
    const categoryId = req.params.id;
    console.log(categoryId);
    const platform = req.query.platform;
    const result = await this.promptService.getAllPromptsByCategoryService(page, size, categoryId, platform);

    res.status(200).json({
      success: true,
      message: "Prompts fetched successfully by Category",
      ...result, // data + meta
    });
  } catch (error) {
    next(error);
  }
}

  // Get Prompt By ID
  async getPromptById(req, res, next) {
    try {
      const result = await this.promptService.getPromptById(req.params.id);
      if (!result) {
        return res.status(404).json({
          success: false,
          message: "Prompt not found",
        });
      }
      res.status(200).json({
        success: true,
        message: "Prompt fetched successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  // Update Prompt
  async updatePrompt(req, res, next) {
    try {
      const result = await this.promptService.updatePrompt(req.params.id, req.body);
      res.status(200).json({
        success: true,
        message: "Prompt updated successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  // Delete Prompt
  async deletePrompt(req, res, next) {
    try {
      await this.promptService.deletePrompt(req.params.id);
      res.status(200).json({
        success: true,
        message: "Prompt deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  async getPromptByUser(req,res,next){
  try {
     const result= await this.promptService.getPromptByUser(req.params.id);
      res.status(200).json({
        data:result,
        success: true,
        message: "Prompt get successfully",
      });
    
  } catch (error) {
    next(error)
  }
}

  // Update Visibility
  async updateVisibility(req, res, next) {
    try {
      const { id } = req.params;
      const { visibility } = req.body;

      if (!['PUBLIC', 'FOLLOWERS_ONLY'].includes(visibility)) {
        return res.status(400).json({
          success: false,
          message: 'Visibility must be PUBLIC or FOLLOWERS_ONLY',
        });
      }

      const prompt = await this.promptService.getPromptById(id);
      if (!prompt) {
        return res.status(404).json({
          success: false,
          message: 'Prompt not found',
        });
      }

      if (prompt.createdBy !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Only the owner can update visibility',
        });
      }

      const result = await this.promptService.updateVisibility(id, visibility);
      res.status(200).json({
        success: true,
        message: 'Visibility updated successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get Feed (visibility-filtered)
  async getFeed(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const size = parseInt(req.query.size) || 15;
      let currentUserId = null;

      const authHeader = req.headers.authorization;
      if (authHeader) {
        try {
          const token = authHeader.split(' ')[1];
          const jwt = require('jsonwebtoken');
          const decoded = jwt.verify(token, 'key123');
          currentUserId = decoded.id;
        } catch (e) {
          // ignore
        }
      }

      const platform = req.query.platform;
      const result = await this.promptService.getPublicFeed(page, size, currentUserId, platform);
      res.status(200).json({
        success: true,
        message: 'Feed fetched successfully',
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get User Prompts with visibility
  async getUserPrompts(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const size = parseInt(req.query.size) || 100;
      const userId = req.params.id;
      let currentUserId = null;

      const authHeader = req.headers.authorization;
      if (authHeader) {
        try {
          const token = authHeader.split(' ')[1];
          const jwt = require('jsonwebtoken');
          const decoded = jwt.verify(token, 'key123');
          currentUserId = decoded.id;
        } catch (e) {
          // ignore
        }
      }

      const platform = req.query.platform;
      const result = await this.promptService.getPromptsByUserWithVisibility(userId, currentUserId, page, size, platform);
      res.status(200).json({
        success: true,
        message: 'Prompts fetched successfully',
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }
}



module.exports = PromptController;
