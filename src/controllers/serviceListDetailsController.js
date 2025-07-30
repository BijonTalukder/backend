const ServiceListDetailsService = require("../services/ServiceListDetails/ServiceListDetailsService");

class ServiceListDetailsController {
    constructor(prismaClient) {

        this.serviceListDetailsService = new ServiceListDetailsService(prismaClient);
    }

    // Handler to create a new service list
    async createServiceList(req, res, next) {
        try {
            const serviceListData = req.body;
            const createdServiceList = await this.serviceListDetailsService.createServiceListDetails(serviceListData);
            return res.status(201).json({ data: createdServiceList });
        } catch (error) {
            next(error); // Pass error to error-handling middleware
        }
    }

    // Handler to get a service list by ID
    async getServiceListById(req, res, next) {
        try {
            const { id } = req.params;
            // console.log(id);
            
            const serviceList = await this.serviceListDetailsService.getServiceListDetailsById(id);
            return res.status(200).json({ data: serviceList });
        } catch (error) {
            next(error); // Pass error to error-handling middleware
        }
    }

    // Handler to get all service lists
    async getAllServiceLists(req, res, next) {
        try {
            const serviceLists = await this.serviceListDetailsService.getAllServiceListDetails();
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
            const updatedServiceList = await this.serviceListDetailsService.updateServiceListDetails(id, updatedData);
            return res.status(200).json({ data: updatedServiceList });
        } catch (error) {
            next(error); // Pass error to error-handling middleware
        }
    }

    // Handler to delete a service list
    async deleteServiceList(req, res, next) {
        try {
            const { id } = req.params;
            const deletedServiceList = await this.serviceListDetailsService.deleteServiceListDetails(id);
            return res.status(200).json({ message: "Service list deleted successfully", data: deletedServiceList });
        } catch (error) {
            next(error); // Pass error to error-handling middleware
        }
    }
   
}

module.exports = ServiceListDetailsController
