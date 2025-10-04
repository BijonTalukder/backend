const express = require("express");
const generativeAiRouter = express.Router();
const multer = require("multer");

const GenerativeAiController = require("../controllers/generativeAiController");
const generativeAiController = new GenerativeAiController();
// Routes
const upload = multer({ storage: multer.memoryStorage() });

generativeAiRouter.post("/generate-image",
upload.single("photo"),
    (req, res, next) => generativeAiController.generateImage(req, res, next)

)
module.exports = generativeAiRouter;