const ServiceListRepository = require("../../repository/ServiceListRepository");

class ServiceListService {
  constructor(prismaClient) {
    this.serviceRepository = new ServiceListRepository(prismaClient);
  }

  // Method to create a new ServiceList
  async createServiceList(serviceListData) {
    const createdServiceList = await this.serviceRepository.createServiceList(serviceListData);
    return createdServiceList;
  }

  // Method to get a ServiceList by its ID
  async getServiceListById(serviceListId) {
    const serviceList = await this.serviceRepository.getServiceListById(serviceListId);
    if (!serviceList) {
      throw new Error('ServiceList not found');
    }
    return serviceList;
  }

  // Method to get all ServiceLists
  async getAllServiceLists() {
    const serviceLists = await this.serviceRepository.getAllServiceLists();
    return serviceLists;
  }

  // Method to update an existing ServiceList
  async updateServiceList(serviceListId, updatedData) {
    const updatedServiceList = await this.serviceRepository.updateServiceList(serviceListId, updatedData);
    return updatedServiceList;
  }

  // Method to delete a ServiceList
  async deleteServiceList(serviceListId) {
    console.log(serviceListId)
    const deletedServiceList = await this.serviceRepository.deleteServiceList(serviceListId);
    console.log(deletedServiceList);
    return deletedServiceList;
  }
  async getAllServicesListByService(serviceListId) {
    const deletedServiceList = await this.serviceRepository.getAllServicesListByService(serviceListId);
    return deletedServiceList;
  }
}

module.exports = ServiceListService;
