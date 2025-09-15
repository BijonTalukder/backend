const express = require("express");
const PromtRouter = express.Router();

const { PrismaClient } = require("@prisma/client");
const PromptService = require("../services/Promt/PromptService");
const PromptController = require("../controllers/promtController");
const prisma = new PrismaClient();


const promptService = new PromptService(prisma);
const promptController = new PromptController(promptService);

// Routes
PromtRouter.post("/create", (req, res, next) => promptController.createPrompt(req, res, next));
PromtRouter.get("/", (req, res, next) => promptController.getAllPrompts(req, res, next));
PromtRouter.get("/:id", (req, res, next) => promptController.getPromptById(req, res, next));
PromtRouter.put("/:id", (req, res, next) => promptController.updatePrompt(req, res, next));
PromtRouter.delete("/:id", (req, res, next) => promptController.deletePrompt(req, res, next));

module.exports = PromtRouter;