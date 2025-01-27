// const ResponseHandler = require("../shared/response.handaler");

const ResponseHandler = require("../shared/response.handaler");

class SliderController {
    constructor(sliderService) {
        this.sliderService = sliderService;
    }

    // Create a new slider
    async createSlider(req, res, next) {
        try {
            const result = await this.sliderService.createSlider(req.body);

            if (result) {
                ResponseHandler.success(res, "Slider created successfully", result);
            } else {
                ResponseHandler.error(res, "Slider creation failed");
            }
        } catch (error) {
            console.error("Error creating slider:", error);
            next(error);
        }
    }

    // Get all sliders with optional filtering (e.g., by status or position)
    async getSliders(req, res, next) {
        try {


            const result = await this.sliderService.getSliders();
            ResponseHandler.success(res, "Sliders retrieved successfully", result);
        } catch (error) {
            console.error("Error fetching sliders:", error);
            next(error);
        }
    }

    // Get a single slider by ID
    async getSliderById(req, res, next) {
        try {
            const sliderId = req.params.id;
            const result = await this.sliderService.getSliderById(sliderId);

            if (result) {
                ResponseHandler.success(res, "Slider retrieved successfully", result);
            } else {
                ResponseHandler.error(res, "Slider not found", null, 404);
            }
        } catch (error) {
            console.error("Error fetching slider by ID:", error);
            next(error);
        }
    }

    // Update a slider
    async updateSlider(req, res, next) {
        try {
            const sliderId = req.params.id;
            const result = await this.sliderService.updateSlider(sliderId, req.body);

            if (result) {
                ResponseHandler.success(res, "Slider updated successfully", result);
            } else {
                ResponseHandler.error(res, "Slider update failed");
            }
        } catch (error) {
            console.error("Error updating slider:", error);
            next(error);
        }
    }

    // Delete a slider by ID
    async deleteSlider(req, res, next) {
        try {
            const sliderId = req.params.id;
            const result = await this.sliderService.deleteSlider(sliderId);

            if (result) {
                ResponseHandler.success(res, "Slider deleted successfully", result);
            } else {
                ResponseHandler.error(res, "Slider deletion failed");
            }
        } catch (error) {
            console.error("Error deleting slider:", error);
            next(error);
        }
    }
}

module.exports = SliderController;
