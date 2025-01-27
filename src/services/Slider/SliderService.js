class SliderService{
    constructor(prisma){
        this.prisma = prisma;

    }
    async createSlider(data){
        return await this.prisma.slider.create({
            data,
        });
    }
    async getSliders(){
        return await this.prisma.slider.findMany();
    }
    async getSliderById(id){
        return await this.prisma.slider.findUnique({
            where:{id},
        });
    }
    async updateSlider(id,data){
        return await this.prisma.slider.update({
            where:{id},
            data,
        });
    }
    async deleteSlider(id){
        return await this.prisma.slider.delete({
            where:{id},
        });
    }
}

module.exports = SliderService;