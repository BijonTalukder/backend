class CategoryService {
    constructor(prismaClient) {
        this.prisma = prismaClient;  // Initialize Prisma Client
    }

    // Create a new category
    async createCategory(postBody) {
        try {
            const category = await this.prisma.category.create({
                data: postBody,  // The data that will be inserted into the database
            });
            return category;  // Return the newly created category
        } catch (error) {
            console.error('Error creating category:', error);
            throw new Error('Category creation failed');
        }
    }

    // Get all categories
    async getCategories() {
        try {
            const categories = await this.prisma.category.findMany();
            return categories;  // Return all categories
        } catch (error) {
            console.error('Error fetching categories:', error);
            throw new Error('Failed to fetch categories');
        }
    }

    // Get a single category by ID
    async getCategoryById(id) {
        console.log(id,"this id");
        
        try {
            const category = await this.prisma.category.findUnique({
                where: {
                    id: id,  // Find category by its ID
                },
            });
            if (!category) {
                throw new Error('Category not found');
            }
            return category;  // Return the category found by its ID
        } catch (error) {
            console.error('Error fetching category by ID:', error);
            throw new Error('Category not found');
        }
    }

// Update an existing category by ID
async updateCategory(id, postBody) {
    try {
        const category = await this.prisma.category.update({
            where: {
                id: id,  // Ensure id is a string
            },
            data: postBody,  // New data to update the category
        });
        return category;  // Return the updated category
    } catch (error) {
        console.error('Error updating category:', error);
        throw new Error('Category update failed');
    }
}

// Delete a category by ID
async deleteCategory(id) {
    try {
        const category = await this.prisma.category.delete({
            where: {
                id: id,  // Ensure id is a string
            },
        });
        return category;  // Return the deleted category
    } catch (error) {
        console.error('Error deleting category:', error);
        throw new Error('Category deletion failed');
    }
}

}

module.exports = CategoryService;
