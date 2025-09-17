class CategoryController {
  constructor(categoryService) {
    this.categoryService = categoryService;
  }

  // Create Category
  async createCategory(req, res, next) {
    try {
      const result = await this.categoryService.createCategory(req.body);
      res.status(201).json({
        success: true,
        message: "Category created successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get All Categories
  async getAllCategories(req, res, next) {
    try {
      const result = await this.categoryService.getCategories();
      res.status(200).json({
        success: true,
        message: "Categories fetched successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get Category By ID
  async getSingleCategory(req, res, next) {
    try {
      const categoryId = req.params.id;
      const result = await this.categoryService.getCategoryById(categoryId);
      res.status(200).json({
        success: true,
        message: `Category with ID ${categoryId} fetched successfully`,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  // Update Category
  async updateCategory(req, res, next) {
    try {
      const categoryId = req.params.id;
      const result = await this.categoryService.updateCategory(categoryId, req.body);
      res.status(200).json({
        success: true,
        message: `Category with ID ${categoryId} updated successfully`,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  // Delete Category
  async deleteCategory(req, res, next) {
    try {
      const categoryId = req.params.id;
      await this.categoryService.deleteCategory(categoryId);
      res.status(200).json({
        success: true,
        message: `Category with ID ${categoryId} deleted successfully`,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CategoryController;
