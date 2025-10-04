const { GoogleGenerativeAI } = require("@google/generative-ai");
const multer = require("multer");

// Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINIAPI_KEY);

class GenerativeAiController {
  async generateImage(req, res, next) {
    try {
      const { promptId, prompt } = req.body;
      const fileBuffer = req.file?.buffer;

      let imagePart = null;
      if (fileBuffer) {
        imagePart = {
          inlineData: {
            data: fileBuffer.toString("base64"),
            mimeType: req.file.mimetype,
          },
        };
      }

      // Use Imagen (Google’s image model) instead of Gemini-text
      const model = genAI.getGenerativeModel({ model: "imagen-3.0" });

      const result = await model.generateContent(
        [
          { text: `Create an image based on this prompt: ${prompt}` },
          imagePart,
        ].filter(Boolean)
      );

      // Output as base64 image
      const base64Image =
        result.response.candidates[0].content.parts[0].inlineData.data;

      res.json({
        success: true,
        promptId,
        image: `data:image/png;base64,${base64Image}`,
      });
    } catch (error) {
      console.error("Image generation failed:", error);
      res
        .status(500)
        .json({ success: false, message: "Image generation failed" });
    }
  }
}

module.exports = GenerativeAiController;
