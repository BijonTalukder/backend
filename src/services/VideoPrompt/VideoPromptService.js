class VideoPromptService {
  constructor(prismaClient) {
    this.prisma = prismaClient;
  }

  async create(data) {
    return this.prisma.videoPrompt.create({ data });
  }

  async getAll(page, limit, filter = {}, sort = {}) {
    const skip = (page - 1) * limit;
    const where = {};

    if (filter.category) {
      where.category = filter.category;
    }

    const orderBy = [];
    if (sort.sortBy === "viewCount") {
      orderBy.push({ viewCount: sort.sortOrder === "asc" ? "asc" : "desc" });
    } else if (sort.sortBy === "likeCount") {
      orderBy.push({ likeCount: sort.sortOrder === "asc" ? "asc" : "desc" });
    } else {
      orderBy.push({ createdAt: sort.sortOrder === "asc" ? "asc" : "desc" });
    }

    const [data, total] = await Promise.all([
      this.prisma.videoPrompt.findMany({ where, skip, take: limit, orderBy }),
      this.prisma.videoPrompt.count({ where }),
    ]);

    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async getById(id) {
    return this.prisma.videoPrompt.findUnique({ where: { id } });
  }

  async update(id, data) {
    return this.prisma.videoPrompt.update({ where: { id }, data });
  }

  async delete(id) {
    return this.prisma.videoPrompt.delete({ where: { id } });
  }
}

module.exports = VideoPromptService;
