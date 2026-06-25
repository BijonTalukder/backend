const express = require('express');
const { PrismaClient } = require('@prisma/client');
const V2PromptService = require('../services/v2/PromptService');
const V2Controller = require('../controllers/V2Controller');

const prisma = new PrismaClient();
const router = express.Router();

const promptService = new V2PromptService(prisma);

// Override to match v1 behavior — no filters
promptService._buildPlatformWhere = () => ({});
promptService._buildVisibilityWhere = () => ({});

// Override getPromptsByUser to be fully public
promptService.getPromptsByUser = async function(userId) {
  const data = await this.prisma.prompt.findMany({
    where: { createdBy: userId },
    orderBy: { createdAt: 'desc' },
  });
  return this.attachCreators(data);
};

const ctrl = new V2Controller(promptService, null);

// Only prompt endpoints — apps use these
router.get('/prompts', ctrl.getAllPrompts);
router.get('/prompts/recommended', ctrl.getRecommendedPrompts);
router.get('/prompts/category/:id', ctrl.getPromptsByCategory);
router.get('/prompts/user/:id', ctrl.getPromptsByUser);
router.get('/prompts/:id', ctrl.getPromptById);

module.exports = router;
