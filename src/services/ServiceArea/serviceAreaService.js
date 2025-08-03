class ServiceAreaService {
  constructor(prisma) {
    this.prisma = prisma;
  }

  // Create a new service area
  async createServiceArea(data) {
    return await this.prisma.serviceArea.create({
      data,
    });
  }

  // Get all service areas
  async getAllServiceAreas() {
    return await this.prisma.serviceArea.findMany();
  }

  // Get service area by ID
  async getServiceAreaById(id) {
    return await this.prisma.serviceArea.findUnique({
      where: { id },
    });
  }

  // Update service area
  async updateServiceArea(id, data) {
    return await this.prisma.serviceArea.update({
      where: { id },
      data,
    });
  }

  // Delete service area
  async deleteServiceArea(id) {
    return await this.prisma.serviceArea.delete({
      where: { id },
    });
  }
}

module.exports = ServiceAreaService;
