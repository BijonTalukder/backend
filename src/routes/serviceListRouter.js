const express = require('express');

const { PrismaClient } = require('@prisma/client');
const ServiceListController = require('../controllers/serviceListController');
const prisma = new PrismaClient();

const serviceListController = new ServiceListController(prisma)
// const serviceListController = new ServiceController(prisma);

const serviceListRouter = express.Router();
serviceListRouter.post('/', serviceListController.createServiceList.bind(serviceListController));
serviceListRouter.get('/', serviceListController.getAllServiceLists.bind(serviceListController));
serviceListRouter.get('/:id', serviceListController.getServiceListById.bind(serviceListController));
serviceListRouter.put('/:id', serviceListController.updateServiceList.bind(serviceListController));
serviceListRouter.delete('/:id', serviceListController.deleteServiceList.bind(serviceListController));

module.exports = serviceListRouter;