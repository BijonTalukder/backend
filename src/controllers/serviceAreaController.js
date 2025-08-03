const ServiceAreaService = require("../services/ServiceArea/serviceAreaService");

class ServiceAreaController {
  constructor(prismaClient) {
    this.serviceAreaService = new ServiceAreaService(prismaClient);
  }

  // Create a new service area
  async createServiceArea(req, res, next) {
    try {
      const areaData = req.body;
      const createdArea = await this.serviceAreaService.createServiceArea(areaData);
      res.status(201).json({
        success: true,
        message: "Service Area created successfully",
        data: createdArea,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get all service areas
  async getAllServiceAreas(req, res, next) {
    try {
      const areas = await this.serviceAreaService.getAllServiceAreas();
      res.status(200).json({
        success: true,
        data: areas,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get a single service area by ID
  async getServiceAreaById(req, res, next) {
    try {
      const areaId = req.params.id;
      const area = await this.serviceAreaService.getServiceAreaById(areaId);
      res.status(200).json({
        success: true,
        data: area,
      });
    } catch (error) {
      next(error);
    }
  }

  // Update a service area
  async updateServiceArea(req, res, next) {
    try {
      const areaId = req.params.id;
      const updatedData = req.body;
      const updatedArea = await this.serviceAreaService.updateServiceArea(areaId, updatedData);
      res.status(200).json({
        success: true,
        message: "Service Area updated successfully",
        data: updatedArea,
      });
    } catch (error) {
      next(error);
    }
  }

  // Delete a service area
  async deleteServiceArea(req, res, next) {
    try {
      const areaId = req.params.id;
      const deletedArea = await this.serviceAreaService.deleteServiceArea(areaId);
      res.status(200).json({
        success: true,
        message: "Service Area deleted successfully",
        data: deletedArea,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ServiceAreaController;
