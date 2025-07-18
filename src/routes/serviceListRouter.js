const express = require('express');

const { PrismaClient } = require('@prisma/client');
const ServiceListController = require('../controllers/serviceListController');
const prisma = new PrismaClient();

const serviceListController = new ServiceListController(prisma)

const serviceListRouter = express.Router();
serviceListRouter.post('/create', serviceListController.createServiceList.bind(serviceListController));
serviceListRouter.get('/', serviceListController.getAllServiceLists.bind(serviceListController));
serviceListRouter.get('/:id', serviceListController.getServiceListById.bind(serviceListController));
serviceListRouter.put('/:id', serviceListController.updateServiceList.bind(serviceListController));
serviceListRouter.delete('/:id', serviceListController.deleteServiceList.bind(serviceListController));
serviceListRouter.get('/services/:id', serviceListController.getAllServicesListByService.bind(serviceListController));

module.exports = serviceListRouter;