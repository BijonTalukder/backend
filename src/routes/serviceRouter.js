const express = require('express');
const ServiceController = require('../controllers/serviceController');
const { PrismaClient } = require('@prisma/client');
// const { PrismaClient } = require('@prisma/client/extension');
const prisma = new PrismaClient();
const serviceController = new ServiceController(prisma);

const serviceRouter = express.Router();
serviceRouter.post('/create', serviceController.createService.bind(serviceController));
serviceRouter.get('/', serviceController.getAllServices.bind(serviceController));
serviceRouter.get('/:id', serviceController.getServiceById.bind(serviceController));
serviceRouter.put('/:id', serviceController.updateService.bind(serviceController));
serviceRouter.delete('/:id', serviceController.deleteService.bind(serviceController));

module.exports = serviceRouter;