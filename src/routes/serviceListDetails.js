const express = require('express');

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const ServiceListDetailsController = require('../controllers/serviceListDetailsController');

const serviceListDetailsController = new ServiceListDetailsController(prisma);

const serviceListDetailsRouter = express.Router();
serviceListDetailsRouter.post('/create', serviceListDetailsController.createServiceList.bind(serviceListDetailsController));
serviceListDetailsRouter.get('/', serviceListDetailsController.getAllServiceLists.bind(serviceListDetailsController));
serviceListDetailsRouter.get('/:id', serviceListDetailsController.getServiceListById.bind(serviceListDetailsController));
serviceListDetailsRouter.put('/:id', serviceListDetailsController.updateServiceList.bind(serviceListDetailsController));
serviceListDetailsRouter.delete('/:id', serviceListDetailsController.deleteServiceList.bind(serviceListDetailsController));

module.exports = serviceListDetailsRouter;