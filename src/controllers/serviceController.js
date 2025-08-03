
const ServiceService = require("../services/Service/serviceService");

class ServiceController {
  constructor(prismaClient) {
    this.serviceService = new ServiceService(prismaClient);
  }

  async createService(req, res, next) {
    try {
      const serviceData = req.body;
      const createdService = await this.serviceService.createService(serviceData);
      res.status(201).json({
        success: true,
        message: 'Service created successfully',
        data: createdService,
      });
    } catch (error) {
      next(error);
    }
  }

  async getServiceById(req, res, next) {
    try {
      const serviceId = req.params.id;
      const service = await this.serviceService.getServiceById(serviceId);
      res.status(200).json({
        success: true,
        data: service,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllServices(req, res, next) {
    try {
      const services = await this.serviceService.getAllServices();
      res.status(200).json({
        success: true,
        data: services,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateService(req, res, next) {
    try {
      const serviceId = req.params.id;
      const updatedData = req.body;
      const updatedService = await this.serviceService.updateService(serviceId, updatedData);
      res.status(200).json({
        success: true,
        message: 'Service updated successfully',
        data: updatedService,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteService(req, res, next) {
    try {
      const serviceId = req.params.id;
      const deletedService = await this.serviceService.deleteService(serviceId);
      res.status(200).json({
        success: true,
        message: 'Service deleted successfully',
        data: deletedService,
      });
    } catch (error) {
      next(error);
    }
  }

  
}

module.exports = ServiceController;
