class BrandService{
    constructor(prisma){
        this.prisma = prisma;
    }

    async create(data){
        return this.prisma.brand.create({
            data:data
        })
    }

    async getAll(){
        return this.prisma.brand.findMany();
    }
    async getById(id){
        return this.prisma.brand.findUnique({
        where:{
            id: id
        }
        })
    }

    async update(id,data){
        return this.prisma.brand.update({
            where:{
                id: id
            },
            data:data
        })
    }

    async delete (id){
        return this.prisma.brand.delete({
            where:{
                id: id
            }
        })
    }

}

module.exports = BrandService;