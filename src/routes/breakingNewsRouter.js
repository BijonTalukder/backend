const express = require('express');

const { PrismaClient } = require('@prisma/client');
const BreakingNewsService = require('../services/BreakingNews/breakingNewsService');
const BreakingNewsController = require('../controllers/breakingNewsController');

const prisma = new PrismaClient();

const breakingNewsRouter = express.Router();
const breakingNewsService = new BreakingNewsService(prisma);
const breakingNewsController = new BreakingNewsController(breakingNewsService);

breakingNewsRouter.post('/create', (req, res, next) => breakingNewsController.createBreakingNews(req, res, next));
breakingNewsRouter.get('/', (req, res, next) => breakingNewsController.getAllBreakingNews(req, res, next));
breakingNewsRouter.get('/:id', (req, res, next) => breakingNewsController.getBreakingNewsById(req, res, next));
breakingNewsRouter.put('/:id', (req, res, next) => breakingNewsController.updateBreakingNews(req, res, next));
breakingNewsRouter.delete('/:id', (req, res, next) => breakingNewsController.deleteBreakingNews(req, res, next));

module.exports = breakingNewsRouter;
