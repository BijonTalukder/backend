const ServiceAreaRepository = require("../../repository/ServiceAreaRepository");

class ServiceAreaService {
  constructor(prismaClient) {
    this.serviceAreaRepository = new ServiceAreaRepository(prismaClient);
  }

  async createServiceArea(data) {
    return await this.serviceAreaRepository.createServiceArea(data);
  }

  async getServiceAreaById(id) {
    const area = await this.serviceAreaRepository.getServiceAreaById(id);
    if (!area) {
      throw new Error("Service Area not found");
    }
    return area;
  }

  async getAllServiceAreas() {
    return await this.serviceAreaRepository.getAllServiceAreas();
  }

  async updateServiceArea(id, data) {
    return await this.serviceAreaRepository.updateServiceArea(id, data);
  }

  async deleteServiceArea(id) {
    return await this.serviceAreaRepository.deleteServiceArea(id);
  }
}

module.exports = ServiceAreaService;
