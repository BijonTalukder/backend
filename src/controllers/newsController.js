// const ResponseHandler = require("../shared/response.handler");

const ResponseHandler = require("../shared/response.handaler");

class NewsController {
    constructor(newsService) {
        this.newsService = newsService;
    }

    // Create News
    async createNews(req, res, _next) {
        try {
            const postBody = req.body;
            const createNews = await this.newsService.createNews(postBody);
            if (createNews) {
                ResponseHandler.success(res, 'News created successfully', createNews);
            } else {
                ResponseHandler.error(res, "News not created");
            }
        } catch (error) {
            _next(error);
        }
    }

    // Get All News
    async getAllNews(req, res, _next) {
        try {
            const result = await this.newsService.getAllNews();
            if (result) {
                ResponseHandler.success(res, "News fetched successfully", result);
            } else {
                ResponseHandler.error(res, "No news found");
            }
        } catch (error) {
            _next(error);
        }
    }

    // Get News by ID
    async getNewsById(req, res, _next) {
        try {
            const { id } = req.params;
            const result = await this.newsService.getNewsById(id);
            if (result) {
                ResponseHandler.success(res, "News fetched successfully", result);
            } else {
                ResponseHandler.error(res, "News not found");
            }
        } catch (error) {
            _next(error);
        }
    }

    // Update News by ID
    async updateNews(req, res, _next) {
        try {
            const { id } = req.params;
            const updateData = req.body;
            const updatedNews = await this.newsService.updateNews(id, updateData);
            if (updatedNews) {
                ResponseHandler.success(res, 'News updated successfully', updatedNews);
            } else {
                ResponseHandler.error(res, "News not updated");
            }
        } catch (error) {
            _next(error);
        }
    }

    // Delete News by ID
    async deleteNews(req, res, _next) {
        try {
            const { id } = req.params;
            const deletedNews = await this.newsService.deleteNews(id);
            if (deletedNews) {
                ResponseHandler.success(res, 'News deleted successfully', deletedNews);
            } else {
                ResponseHandler.error(res, "News not deleted");
            }
        } catch (error) {
            _next(error);
        }
    }
}

module.exports = NewsController;
