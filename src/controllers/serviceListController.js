const ServiceListService = require("../services/ServiceList/serviceListService");

class ServiceListController {
  constructor(prismaClient) {
    
    this.serviceListService = new ServiceListService(prismaClient);
  }

  // Handler to create a new service list
  async createServiceList(req, res, next) {
    try {
      const serviceListData = req.body;
      const createdServiceList = await this.serviceListService.createServiceList(serviceListData);
      return res.status(201).json({ data: createdServiceList });
    } catch (error) {
      next(error); 
    }
  }

  // Handler to get a service list by ID
  async getServiceListById(req, res, next) {
    try {
      const { id } = req.params;
      const serviceList = await this.serviceListService.getServiceListById(id);
      return res.status(200).json({ data: serviceList });
    } catch (error) {
      next(error); // Pass error to error-handling middleware
    }
  }

  // Handler to get all service lists
  async getAllServiceLists(req, res, next) {
    try {
      const serviceLists = await this.serviceListService.getAllServiceLists();
      return res.status(200).json({ data: serviceLists });
    } catch (error) {
      next(error); // Pass error to error-handling middleware
    }
  }

  // Handler to update a service list
  async updateServiceList(req, res, next) {
    try {
      const { id } = req.params;
      const updatedData = req.body;
      const updatedServiceList = await this.serviceListService.updateServiceList(id, updatedData);
      return res.status(200).json({ data: updatedServiceList });
    } catch (error) {
      next(error); // Pass error to error-handling middleware
    }
  }

  // Handler to delete a service list
  async deleteServiceList(req, res, next) {
    try {
      const { id } = req.params;
      const deletedServiceList = await this.serviceListService.deleteServiceList(id);
      return res.status(200).json({ message: "Service list deleted successfully", data: deletedServiceList });
    } catch (error) {
      next(error); // Pass error to error-handling middleware
    }
  }
  async getAllServicesListByService(req,res,next){
    try {
      const serviceId = req.params.id;
      const ServiceList = await this.serviceListService.getAllServicesListByService(serviceId);
      res.status(200).json({
        success: true,
        message: 'ServiceList Fetched successfully',
        data: ServiceList,
      });
    } catch (error) {
next(error)      
    }
  }

  async getAllTouristSpot(req, res, next) {
    try {
      const touristSpots = await this.serviceListService.getAllTouristSpotService();
      res.status(200).json({
        success: true,
        message: 'Tourist spots fetched successfully',
        data: touristSpots,
      });
    } catch (error) {
      next(error); 
    }
  }
}

module.exports = ServiceListController;
