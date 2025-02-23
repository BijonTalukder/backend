class BreakingNewsService {
    constructor(prisma) {
        this.prisma = prisma;
    }

    // ✅ Create a Breaking News
    async create(data) {
        try {
            return await this.prisma.breakingNews.create({ data });
        } catch (error) {
            throw new Error("Error creating breaking news: " + error.message);
        }
    }

    // ✅ Get All Breaking News
    async getAll() {
        try {
            return await this.prisma.breakingNews.findMany({
                orderBy: { order: "asc" } // Optional: Order by `order` field
            });
        } catch (error) {
            throw new Error("Error fetching breaking news: " + error.message);
        }
    }

    // ✅ Get a Single Breaking News by ID
    async getById(id) {
        try {
            return await this.prisma.breakingNews.findUnique({
                where: { id }
            });
        } catch (error) {
            throw new Error("Error fetching breaking news by ID: " + error.message);
        }
    }

    // ✅ Update Breaking News by ID
    async update(id, data) {
        try {
            return await this.prisma.breakingNews.update({
                where: { id },
                data
            });
        } catch (error) {
            throw new Error("Error updating breaking news: " + error.message);
        }
    }

    // ✅ Delete Breaking News by ID
    async delete(id) {
        try {
            return await this.prisma.breakingNews.delete({
                where: { id }
            });
        } catch (error) {
            throw new Error("Error deleting breaking news: " + error.message);
        }
    }
}

module.exports = BreakingNewsService;
