const express = require("express");
const { PrismaClient } = require("@prisma/client");
const VideoPromptService = require("../services/VideoPrompt/VideoPromptService");
const VideoPromptController = require("../controllers/videoPromptController");
const auth = require("../utility/auth");

const router = express.Router();
const prisma = new PrismaClient();
const service = new VideoPromptService(prisma);
const controller = new VideoPromptController(service);

// Admin CRUD
router.post("/", auth, (req, res, next) => controller.create(req, res, next));
router.put("/:id", auth, (req, res, next) => controller.update(req, res, next));
router.delete("/:id", auth, (req, res, next) => controller.delete(req, res, next));

// Admin & Public read
router.get("/", (req, res, next) => controller.getAll(req, res, next));
router.get("/:id", (req, res, next) => controller.getById(req, res, next));

module.exports = router;
