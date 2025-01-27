class ServiceRepository {
    constructor(prismaClient) {
      this.prisma = prismaClient;
    }
  
    async createService(serviceData) {
      return await this.prisma.service.create({
        data: serviceData,
      });
    }
  
    async getServiceById(serviceId) {
      return await this.prisma.service.findUnique({
        where: {
          id: serviceId,
        },
      });
    }
  
    async getAllServices() {
      return await this.prisma.service.findMany();
    }
  
    async updateService(serviceId, updatedData) {
      return await this.prisma.service.update({
        where: {
          id: serviceId,
        },
        data: updatedData,
      });
    }
  
    async deleteService(serviceId) {
      return await this.prisma.service.delete({
        where: {
          id: serviceId,
        },
      });
    }
  }
  
  module.exports = ServiceRepository;