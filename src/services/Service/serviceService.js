const ServiceRepository = require("../../repository/ServiceRepository");

class ServiceService {
    constructor(prismaClient) {
      this.prismaClient = prismaClient;
      this.serviceRepository = new ServiceRepository(prismaClient);
    }
  
    async createService(serviceData) {
     
      const createdService = await this.serviceRepository.createService(serviceData);
      return createdService;
    }
  
    async getServiceById(serviceId) {
      const service = await this.serviceRepository.getServiceById(serviceId);
      if (!service) {
        throw new Error('Service not found');
      }
      return service;
    }
  
    async getAllServices() {
      const services = await this.serviceRepository.getAllServices();
      return services;
    }
  
    async updateService(serviceId, updatedData) {
      // Add any business logic here if needed before updating the service
      const updatedService = await this.serviceRepository.updateService(serviceId, updatedData);
      return updatedService;
    }
  
    async deleteService(serviceId) {
      // Add any additional logic (e.g., checks) before deleting the service
      const deletedService = await this.serviceRepository.deleteService(serviceId);
      return deletedService;
    }

    async getServiceByServiceAreaId(serviceAreaId) {

      const data = await this.prismaClient.service.findMany({
        where: { serviceAreaId },
       
        
      })
      return data;
   
    }

  }
  
  module.exports = ServiceService;