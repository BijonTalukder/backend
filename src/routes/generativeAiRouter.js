const express = require("express");
const generativeAiRouter = express.Router();

const GenerativeAiController = require("../controllers/generativeAiController");
const generativeAiController = new GenerativeAiController();
// Routes
generativeAiRouter.post("/generate-image",
    (req, res, next) => generativeAiController.generateImage(req, res, next)

)
module.exports = generativeAiRouter;