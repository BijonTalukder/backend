const ResponseHandler = require("../shared/response.handaler")

class AttributesController{
    constructor(attributesService){
        this.attributesService = attributesService
    }
    async createAttribute(req,res,next){
        try {
            const data = req.body
            const attribute = await this.attributesService.createAttribute(data)
            ResponseHandler.success(res,'Attribute created successfully',attribute,201)
        } catch (error) {
            ResponseHandler.error(res,'Error creating attribute',500,error)
            next(error)
        }
    }
    async getAllAttributes(req,res,next){
        try {
            const attributes = await this.attributesService.getAllAttributes()
            ResponseHandler.success(res,'Attributes fetched successfully',attributes)
        } catch (error) {
            ResponseHandler.error(res,'Error fetching attributes',500,error)
            next(error)
        }
    }
    async getAttributeById(req,res,next){
        try {
            const id = req.params.id
            const attribute = await this.attributesService.getAttributeById(id)
            ResponseHandler.success(res,'Attribute fetched successfully',attribute)
        } catch (error) {
            ResponseHandler.error(res,'Error fetching attribute',500,error)
            next(error)
        }
    }
    async updateAttribute(req,res,next){
        try {
            const id = req.params.id
            const data = req.body
            const attribute = await this.attributesService.updateAttribute(id,data)
            ResponseHandler.success(res,'Attribute updated successfully',attribute)
        } catch (error) {
            ResponseHandler.error(res,'Error updating attribute',500,error)
            next(error)
        }
    }
    async deleteAttribute(req,res,next){
        try {
            const id = req.params.id
            const attribute = await this.attributesService.deleteAttribute(id)
            ResponseHandler.success(res,'Attribute deleted successfully',attribute)
        } catch (error) {
            ResponseHandler.error(res,'Error deleting attribute',500,error)
            next(error)
        }
    }

}
module.exports = AttributesController