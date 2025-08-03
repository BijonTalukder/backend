const express = require('express');

const { PrismaClient } = require('@prisma/client');
const ServiceAreaController = require('../controllers/serviceAreaController');
const prisma = new PrismaClient();

const serviceAreaController = new ServiceAreaController(prisma);

const serviceAreaRouter = express.Router();
serviceAreaRouter.post('/create', serviceAreaController.createServiceArea.bind(serviceAreaController));
serviceAreaRouter.get('/', serviceAreaController.getAllServiceAreas.bind(serviceAreaController));
serviceAreaRouter.get('/:id', serviceAreaController.getServiceAreaById.bind(serviceAreaController));
serviceAreaRouter.put('/:id', serviceAreaController.updateServiceArea.bind(serviceAreaController));
serviceAreaRouter.delete('/:id', serviceAreaController.deleteServiceArea.bind(serviceAreaController));

module.exports = serviceAreaRouter;