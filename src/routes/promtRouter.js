const express = require("express");
const router = express.Router();

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// const PromptService = require("../services/PromptService");
const PromptController = require("../controllers/PromptController");

const promptService = new PromptService(prisma);
const promptController = new PromptController(promptService);

// Routes
router.post("/", (req, res, next) => promptController.createPrompt(req, res, next));
router.get("/", (req, res, next) => promptController.getAllPrompts(req, res, next));
router.get("/:id", (req, res, next) => promptController.getPromptById(req, res, next));
router.put("/:id", (req, res, next) => promptController.updatePrompt(req, res, next));
router.delete("/:id", (req, res, next) => promptController.deletePrompt(req, res, next));

module.exports = router;