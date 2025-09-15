class PromptController {
  constructor(promptService) {
    this.promptService = promptService;
  }

  // Create Prompt
  async createPrompt(req, res, next) {
    try {
      const result = await this.promptService.createPrompt(req.body);
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
      const result = await this.promptService.getAllPrompts();
      res.status(200).json({
        success: true,
        message: "Prompts fetched successfully",
        data: result,
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
}

module.exports = PromptController;
