const ResponseHandler = require("../shared/response.handaler");

class ProductController {
    constructor(productService) {
        this.productService = productService;
    }
    //filter
    extractFilters(query) {
        const { category, priceMin, priceMax, brand } = query;
        const filters = {};

        if (category) filters.categoryId = category;
        if (brand) filters.brandId = brand;
        if (priceMin || priceMax) {
            filters.price = {};
            if (priceMin) filters.price.gte = parseFloat(priceMin);
            if (priceMax) filters.price.lte = parseFloat(priceMax);
        }

        return filters;
    }
    // Create a new product along with variants
    async createProduct(req, res, next) {
        try {
            const result = await this.productService.createProducts(req.body);

            if (result)

                ResponseHandler.success(res, 'product created successfully', result)
            else {
                ResponseHandler.error(res, "product not created")
            }
        } catch (error) {
            console.error(error);
            next(error);
        }
    }

    // Get all products with optional filtering
    async getProducts(req, res, next) {
        try {
            const filters = this.extractFilters(req.query);
            const searchTerm = req.query.search ? req.query.search.trim() : null;

            // Pagination parameters
            const page = parseInt(req.query.page, 10) || 1; // Default to page 1
            const limit = parseInt(req.query.limit, 10) || 10;
            const result = await this.productService.getProducts(filters, searchTerm,page,limit);
            res.status(200).json(result);
        } catch (error) {
            console.error(error);
            next(error);
        }
    }

    // Get a single product by ID
    async getProductById(req, res, next) {
        try {
            const productId = req.params.id;
            const result = await this.productService.getProductById(productId);
            res.status(200).json(result);
        } catch (error) {
            console.error(error);
            next(error);
        }
    }

    // Update a product and its variants
    async updateProduct(req, res, next) {
        try {
            const productId = req.params.id;
            const result = await this.productService.updateProduct(productId, req.body);
            res.status(200).json(result);
        } catch (error) {
            console.error(error);
            next(error);
        }
    }

    // Delete a product by ID
    async deleteProduct(req, res, next) {
        try {
            const productId = req.params.id;
            const result = await this.productService.deleteProduct(productId);
            res.status(200).json({ message: 'Product deleted successfully', result });
        } catch (error) {
            console.error(error);
            next(error);
        }
    }
}

module.exports = ProductController;
