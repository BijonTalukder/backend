const express = require('express');

const { PrismaClient } = require('@prisma/client');
const NewsService = require('../services/News/NewsService');
const NewsController = require('../controllers/newsController');
const prisma = new PrismaClient();

const newsRouter = express.Router();
const newsService = new NewsService(prisma);
const newsController = new NewsController(newsService);


newsRouter.post('/create', (req, res, next) => newsController.createNews(req, res, next));
newsRouter.get('/', (req, res, next) => newsController.getAllNews(req, res, next));
newsRouter.get('/:id', (req, res, next) => newsController.getNewsById(req, res, next));
newsRouter.put('/:id', (req, res, next) => newsController.updateNews(req, res, next));
newsRouter.delete('/:id', (req, res, next) => newsController.deleteNews(req, res, next));



module.exports = newsRouter;
