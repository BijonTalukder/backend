class NewsService {
    constructor(prismaClient) {
        this.prisma = prismaClient;  // Prisma client instance
    }

    // Create News
    async createNews(postBody) {
        try {
            // Create a new news entry in the database
            const news = await this.prisma.news.create({
                data: postBody,  // Post body contains the data for the new news
            });
            return news;  // Return the created news
        } catch (error) {
            throw new Error('Error creating news: ' + error.message);
        }
    }

    // Get All News
    async getAllNews() {
        try {
            // Fetch all news from the database
            const news = await this.prisma.news.findMany();
            return news;  // Return all news items
        } catch (error) {
            throw new Error('Error fetching news: ' + error.message);
        }
    }

    // Get News by ID
    async getNewsById(id) {
        try {
            // Fetch a single news entry by ID
            const news = await this.prisma.news.findUnique({
                where: {
                    id: Number(id),  // Ensure the id is a number
                },
            });
            return news;  // Return the fetched news
        } catch (error) {
            throw new Error('Error fetching news by ID: ' + error.message);
        }
    }

    // Update News by ID
    async updateNews(id, updateData) {
        try {
            // Find the news item by ID and update it
            const news = await this.prisma.news.update({
                where: {
                    id: Number(id),
                },
                data: updateData,  // The data that needs to be updated
            });
            return news;  // Return the updated news item
        } catch (error) {
            throw new Error('Error updating news: ' + error.message);
        }
    }

    // Delete News by ID
    async deleteNews(id) {
        try {
            // Find the news by ID and delete it
            const news = await this.prisma.news.delete({
                where: {
                    id: Number(id),
                },
            });
            return news;  // Return success message
        } catch (error) {
            throw new Error('Error deleting news: ' + error.message);
        }
    }
}

module.exports = NewsService;
