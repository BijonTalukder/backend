class ProductService {
    prisma
    constructor(prisma) {
        this.prisma = prisma;
    }

    buildWhereClause(filters, searchTerm) {
        const searchCondition = searchTerm
            ? {
                  OR: [
                      { name: { contains: searchTerm, mode: 'insensitive' } },
                      { description: { contains: searchTerm, mode: 'insensitive' } },
                      { productSubtitle : { contains: searchTerm, mode: 'insensitive' } }
                      
                    ],
              }
            : {};

        return {
            AND: [filters, searchCondition],
        };
    }

    async createProducts(data) {
        try {
            const { variants, ...productData } = data;

        console.log(productData);
        
            const product = await this.prisma.product.create({
              data: productData, 
            });
        
            console.log('Finding product with ID:', product.id); // Check the ID used for lookup

            if (variants && variants.length > 0) {
              const variantsData = variants.map((variant) => ({
                ...variant,
                productId: product.id, 
              }));
        
              
              await this.prisma.variant.createMany({
                data: variantsData,
              });
            }
            console.log('Finding product with ID:', product.id); // Check the ID used for lookup

            
            const fullProduct = await this.prisma.product.findUnique({
              where: { id: product.id },
              include: { variants: true }, 
            });
        
            return fullProduct;
        } catch (error) {
console.log(error);

        }


    }


    // Get all products with optional filtering
    async getProducts(filters = {}, searchTerm = null,page=1,limit=10) {
        try {
            const whereClause = this.buildWhereClause(filters, searchTerm);
            const skip = (page - 1) * limit;
            const products = await this.prisma.product.findMany({
                where: whereClause,
                skip,        
                take: limit, 
                include: {
                    // category: true,
                    variants: true,
                    // brand: true,
                },
            });

            // Count total products for pagination meta
            const totalProducts = await this.prisma.product.count({
                where: whereClause,
            });

            // Pagination metadata
            const meta = {
                totalItems: totalProducts,
                totalPages: Math.ceil(totalProducts / limit),
                currentPage: page,
                itemsPerPage: limit,
            };

            return { products, meta };
        } catch (error) {
            console.error("Error fetching products:", error);
            throw new Error("Failed to fetch products");
        }
    }

    // Get a single product by ID
    async getProductById(id) {
        try {
            const product = await this.prisma.product.findUnique({
                where: { id },
                include: {
                    // category: true,
                    variants: true,
                },
            });
            if (!product) throw new Error("Product not found");
            return product;
        } catch (error) {
            console.error("Error fetching product by ID:", error);
            throw new Error("Product not found");
        }
    }

    // Update a product by ID
    async updateProduct(id, data) {
        try {
            const product = await this.prisma.product.update({
                where: { id },
                data: {
                    name: data.name,
                    description: data.description,
                    price: data.price,
                    imageUrl: data.imageUrl,
                    categoryId: data.categoryId,
                    updatedAt: new Date(),
                    variants: {
                        deleteMany: {},
                        create: data.variants || [],
                    },
                },
                include: {
                    category: true,
                    variants: true,
                },
            });
            return product;
        } catch (error) {
            console.error("Error updating product:", error);
            throw new Error("Product update failed");
        }
    }

    // Delete a product by ID
    async deleteProduct(id) {
        try {
            const product = await this.prisma.product.delete({
                where: { id },
            });
            return product;
        } catch (error) {
            console.error("Error deleting product:", error);
            throw new Error("Product deletion failed");
        }
    }

}
module.exports = ProductService