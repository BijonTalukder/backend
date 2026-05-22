const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class DeleteAccountService {
  async createRequest(email, reason) {
    return prisma.deleteAccountRequest.create({
      data: { email, reason },
    });
  }

  async getAllRequests(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      prisma.deleteAccountRequest.findMany({
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.deleteAccountRequest.count(),
    ]);
    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async updateStatus(id, status) {
    return prisma.deleteAccountRequest.update({
      where: { id },
      data: { status },
    });
  }
}

module.exports = DeleteAccountService;
