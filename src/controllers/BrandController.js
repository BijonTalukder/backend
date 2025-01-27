const ResponseHandler = require("../shared/response.handaler");

class BrandController{
    constructor(brandService){
        this.brandService = brandService;
    }
    async create(req,res,next){
        const data = req.body;
        try {
            const brand = await this.brandService.create(data);
           ResponseHandler.success(res,"Brand created successfully",brand,201)
        } catch (error) {
            next(error)
        ResponseHandler.error(res,"Error while creating brand",500,error)
        }
    }

    async getAll(req,res,next){
        try {
            const brands = await this.brandService.getAll();
            ResponseHandler.success(res,"All brands",brands,200)
        } catch (error) {
            next(error)
            ResponseHandler.error(res,"Error while getting brands",500,error)
        }
    }
    async getSingle(req,res,next){
        const id = req.params.id;
        try {
            const brand = await this.brandService.getById(id);
            if(!brand){
                return ResponseHandler.error(res,"Brand not found",404)
            }
            ResponseHandler.success(res,"Single brand",brand,200)
        } catch (error) {
            next(error)
            ResponseHandler.error(res,"Error while getting brand",500,error)
        }
    }
    async update(req,res,next){
        const id = req.params.id;
        const data = req.body;
        try {
            const brand = await this.brandService.update(id,data);
            ResponseHandler.success(res,"Brand updated successfully",brand,200)
        } catch (error) {
            next(error)
            ResponseHandler.error(res,"Error while updating brand",500,error)
        }
    }
    async delete(req,res,next){
        const id = req.params.id;
        try {
            const brand = await this.brandService.delete(id);
            ResponseHandler.success(res,"Brand deleted successfully",brand,200)
        } catch (error) {
            next(error)
            ResponseHandler.error(res,"Error while deleting brand",500,error)
        }
    }
}
module.exports = BrandController