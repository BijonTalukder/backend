const express = require('express');
const { PrismaClient } = require('@prisma/client');
const FollowService = require('../services/Follow/FollowService');
const FollowController = require('../controllers/FollowController');
const auth = require('../utility/auth');

const prisma = new PrismaClient();
const router = express.Router();

const followService = new FollowService(prisma);
const followController = new FollowController(followService);

router.post('/:userId', auth, (req, res, next) => followController.follow(req, res, next));
router.delete('/:userId', auth, (req, res, next) => followController.unfollow(req, res, next));
router.get('/followers', auth, (req, res, next) => followController.getFollowers(req, res, next));
router.get('/following', auth, (req, res, next) => followController.getFollowing(req, res, next));
router.get('/status/:userId', auth, (req, res, next) => followController.getFollowStatus(req, res, next));
router.get('/counts/:userId', (req, res, next) => followController.getPublicCounts(req, res, next));

module.exports = router;
