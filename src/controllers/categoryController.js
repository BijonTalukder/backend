class CategoryController {

constructor(categoryService) {
    this.categoryService = categoryService;
}

// Create a new category
async createCategory(req, res, next) {
    try {
        const categoryData = req.body; 
        const category = await this.categoryService.createCategory(categoryData);
        return res.status(201).json({
            message: 'Category created successfully',
            data: category
        });
    } catch (error) {  
        console.error('Error creating category:', error);
        return res.status(500).json({
            message: 'Category creation failed',
            error: error.message
        });
    }
}

// Get all categories
async getCategories(req, res, next) {
    try {
        const categories = await this.categoryService.getCategories();
        return res.status(200).json({
            message: 'Categories retrieved successfully',
            data: categories
        });
    } catch (error) {
        console.error('Error retrieving categories:', error);
        return res.status(500).json({
            message: 'Failed to retrieve categories',
            error: error.message
        });
    }
}

// Get a category by its ID
async getCategoryById(req, res, next) {
    try {
        const { id } = req.params;
        const category = await this.categoryService.getCategoryById(id);
        if (!category) {
            return res.status(404).json({
                message: 'Category not found'
            });
        }
        return res.status(200).json({
            message: 'Category retrieved successfully',
            data: category
        });
    } catch (error) {
        console.error('Error retrieving category:', error);
        return res.status(500).json({
            message: 'Failed to retrieve category',
            error: error.message
        });
    }
}

// Update a category by ID
async updateCategory(req, res, next) {
    try {
        const { id } = req.params;
        const categoryData = req.body; 
        const updatedCategory = await this.categoryService.updateCategory(id, categoryData);

        return res.status(200).json({
            message: 'Category updated successfully',
            data: updatedCategory
        });
    } catch (error) {
        console.error('Error updating category:', error);
        return res.status(500).json({
            message: 'Category update failed',
            error: error.message
        });
    }
}

// Delete a category by ID
async deleteCategory(req, res, next) {
    try {
        const { id } = req.params;
        const deletedCategory = await this.categoryService.deleteCategory(id);

        return res.status(200).json({
            message: 'Category deleted successfully',
            data: deletedCategory
        });
    } catch (error) {
        console.error('Error deleting category:', error);
        return res.status(500).json({
            message: 'Category deletion failed',
            error: error.message
        });
    }
}
}

module.exports = CategoryController;
