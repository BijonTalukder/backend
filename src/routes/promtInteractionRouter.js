 const express = require("express");
const PromtInteractionRouter = express.Router();
const { PrismaClient } = require("@prisma/client");
const PromptInteractionService = require("../services/PromtIteraction/PromptInteractionService");
const PromptInteractionController = require("../controllers/PromptInteractionController");
const prisma = new PrismaClient();


const interactionService = new PromptInteractionService(prisma);
const interactionController = new PromptInteractionController(interactionService);
 
PromtInteractionRouter.post("/record", (req, res, next) => interactionController.recordInteraction(req, res, next));
PromtInteractionRouter.get("/", (req, res, next) => interactionController.getInteractions(req, res, next));
PromtInteractionRouter.get("/analytics", (req, res, next) => interactionController.getAnalytics(req, res, next));

module.exports = PromtInteractionRouter;
