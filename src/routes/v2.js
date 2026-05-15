const express = require('express');
const { PrismaClient } = require('@prisma/client');
const V2PromptService = require('../services/v2/PromptService');
const V2UserService = require('../services/v2/UserService');
const V2Controller = require('../controllers/V2Controller');
const CategoryService = require('../services/Category/CategoryService');
const CategoryController = require('../controllers/CategoryController');

const prisma = new PrismaClient();
const router = express.Router();

const promptService = new V2PromptService(prisma);
const userService = new V2UserService(prisma);
const ctrl = new V2Controller(promptService, userService);
const categoryService = new CategoryService(prisma);
const categoryCtrl = new CategoryController(categoryService);

// ── Prompts ────────────────────────────────────────────────
// GET /api/v2/prompts?page=1&size=15&sortBy=likes|copies|newest
router.get('/prompts', ctrl.getAllPrompts);

// GET /api/v2/prompts/recommended (based on IP/category history)
router.get('/prompts/recommended', ctrl.getRecommendedPrompts);

// GET /api/v2/prompts/category/:id?page=1&size=15&sortBy=likes|copies|newest
router.get('/prompts/category/:id', ctrl.getPromptsByCategory);

// GET /api/v2/prompts/user/:id
router.get('/prompts/user/:id', ctrl.getPromptsByUser);

// GET /api/v2/prompts/:id
router.get('/prompts/:id', ctrl.getPromptById);

// ── Categories ──────────────────────────────────────────────
router.get('/categories', (req, res, next) => categoryCtrl.getAllCategories(req, res, next));

// ── Top Creators ───────────────────────────────────────────
// GET /api/v2/top-creators?page=1&size=20
router.get('/top-creators', ctrl.getTopCreators);

// ── Profile ────────────────────────────────────────────────
// GET /api/v2/profile/:id
router.get('/profile/:id', ctrl.getProfile);

// ── User Category Preferences ──────────────────────────────
// GET /api/v2/users/:userId/category-preferences
router.get('/users/:userId/category-preferences', ctrl.getUserCategoryPreferences);

module.exports = router;
