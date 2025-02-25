const ResponseHandler = require("../shared/response.handaler");

class BreakingNewsController {
    constructor(breakingNewsService) {
        this.breakingNewsService = breakingNewsService;
    }

    // ✅ Create Breaking News
    async createBreakingNews(req, res, next) {
        try {
            const data = req.body;
            if (!data.newsTitle || typeof data.newsTitle !== "string") {
                return ResponseHandler.error(res, "Invalid newsTitle", 400);
            }

            const result = await this.breakingNewsService.create(data);
            ResponseHandler.success(res, "Breaking news created successfully", result, 201);
        } catch (error) {
            next(error);
        }
    }

    // ✅ Get All Breaking News
    async getAllBreakingNews(req, res, next) {
        try {
            const newsList = await this.breakingNewsService.getAll();
            ResponseHandler.success(res, "Breaking news fetched successfully", newsList, 200);
        } catch (error) {
            next(error);
        }
    }

    // ✅ Get Single Breaking News by ID
    async getBreakingNewsById(req, res, next) {
        try {
            const { id } = req.params;
            const newsItem = await this.breakingNewsService.getById(id);
            if (!newsItem) {
                return ResponseHandler.error(res, "Breaking news not found", 404);
            }
            ResponseHandler.success(res, "Breaking news fetched successfully", newsItem, 200);
        } catch (error) {
            next(error);
        }
    }

    // ✅ Update Breaking News
    async updateBreakingNews(req, res, next) {
        try {
            const { id } = req.params;
            const data = req.body;
            
            const updatedNews = await this.breakingNewsService.update(id, data);
            if (!updatedNews) {
                return ResponseHandler.error(res, "Breaking news not found", 404);
            }

            ResponseHandler.success(res, "Breaking news updated successfully", updatedNews, 200);
        } catch (error) {
            next(error);
        }
    }

    // ✅ Delete Breaking News
    async deleteBreakingNews(req, res, next) {
        try {
            const { id } = req.params;
            const deleted = await this.breakingNewsService.delete(id);
            if (!deleted) {
                return ResponseHandler.error(res, "Breaking news not found", 404);
            }
            ResponseHandler.success(res, "Breaking news deleted successfully", {}, 200);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = BreakingNewsController;
