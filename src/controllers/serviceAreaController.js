const ServiceAreaService = require("../services/ServiceArea/serviceAreaService");

class ServiceAreaController {
  constructor(prismaClient) {
    this.serviceAreaService = new ServiceAreaService(prismaClient);
  }

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

  async getServiceAreaById(req, res, next) {
    try {
      const id = req.params.id;
      const area = await this.serviceAreaService.getServiceAreaById(id);
      res.status(200).json({
        success: true,
        data: area,
      });
    } catch (error) {
      next(error);
    }
  }

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

  async updateServiceArea(req, res, next) {
    try {
      const id = req.params.id;
      const updateData = req.body;
      const updated = await this.serviceAreaService.updateServiceArea(id, updateData);
      res.status(200).json({
        success: true,
        message: "Service Area updated successfully",
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteServiceArea(req, res, next) {
    try {
      const id = req.params.id;
      const deleted = await this.serviceAreaService.deleteServiceArea(id);
      res.status(200).json({
        success: true,
        message: "Service Area deleted successfully",
        data: deleted,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ServiceAreaController;
