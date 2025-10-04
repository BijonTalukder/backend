const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINIAPI_KEY);

class GenerativeAiController {
  async generateImage(req, res) {
    try {
      const { promptId, prompt } = req.body;
      const finalPrompt = prompt || "A beautiful landscape, digital art, vibrant colors";
      const fileBuffer = req.file?.buffer;

      console.log("Received prompt:", finalPrompt);
      console.log("Received file:", req.file ? req.file.originalname : "No file");

      const model = genAI.getGenerativeModel({ model: "models/generative-image-1" });

      const input = {
        imagePrompt: {
          text: finalPrompt,
        },
        size: "1024x1024",
      };

      if (fileBuffer) {
        input.imagePrompt.image = {
          data: fileBuffer.toString("base64"),
          mimeType: req.file.mimetype,
        };
      }

      const result = await model.generateContent({ input });

      const base64Image = result.response.candidates[0].content[0].image?.data;

      if (!base64Image) {
        throw new Error("No image returned from the model");
      }

      res.json({
        success: true,
        promptId,
        image: `data:image/png;base64,${base64Image}`,
      });
    } catch (error) {
      console.error("Image generation failed:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = GenerativeAiController;
