class VideoPromptController {
  constructor(service) {
    this.service = service;
  }

  async create(req, res, next) {
    try {
      const result = await this.service.create(req.body);
      res.status(201).json({ success: true, message: "Video prompt created", data: result });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const size = parseInt(req.query.size) || 20;
      const filter = { category: req.query.category };
      const sort = { sortBy: req.query.sortBy || "createdAt", sortOrder: req.query.sortOrder || "desc" };
      const result = await this.service.getAll(page, size, filter, sort);
      res.status(200).json({ success: true, message: "Video prompts fetched", ...result });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const result = await this.service.getById(req.params.id);
      if (!result) return res.status(404).json({ success: false, message: "Video prompt not found" });
      res.status(200).json({ success: true, message: "Video prompt fetched", data: result });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const result = await this.service.update(req.params.id, req.body);
      res.status(200).json({ success: true, message: "Video prompt updated", data: result });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      await this.service.delete(req.params.id);
      res.status(200).json({ success: true, message: "Video prompt deleted" });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = VideoPromptController;
