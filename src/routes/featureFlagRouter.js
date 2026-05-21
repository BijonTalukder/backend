const express = require('express');
const { PrismaClient } = require('@prisma/client');
const FeatureFlagController = require('../controllers/featureFlagController');
const auth = require('../utility/auth');

const prisma = new PrismaClient();
const controller = new FeatureFlagController(prisma);
const router = express.Router();

// Public - returns app config + enabled flags for Android app
router.get('/app-config', (req, res, next) => controller.getAppConfig(req, res, next));

// Admin routes
router.get('/', auth, (req, res, next) => controller.getAll(req, res, next));
router.get('/:key', auth, (req, res, next) => controller.getByKey(req, res, next));
router.post('/', auth, (req, res, next) => controller.create(req, res, next));

// App config update (admin) — must be before /:id
router.put('/app-config', auth, (req, res, next) => controller.updateAppConfig(req, res, next));

router.put('/:id', auth, (req, res, next) => controller.update(req, res, next));
router.delete('/:id', auth, (req, res, next) => controller.remove(req, res, next));

module.exports = router;
