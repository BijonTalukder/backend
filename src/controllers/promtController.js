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
            score: 100,
          },
          update: { promptCount: { increment: 1 } },
        });

        if (!prev) {
          // just created, score already set to 100
        } else {
          const newScore =
            (prev.totalLikes || 0) * 10 +
            (prev.totalViews || 0) * 1 +
            ((prev.promptCount || 0) + 1) * 100 +
            (prev.totalCopies || 0) * 2;
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
    const result = await this.promptService.getAllPrompts(page, size);

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
    const result = await this.promptService.getAllPromptsByNullService(page, size);

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
    const result = await this.promptService.getAllPromptsByCategoryService(page, size, categoryId);

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
}



module.exports = PromptController;
