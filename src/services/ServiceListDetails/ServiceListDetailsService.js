class ServiceListDetailsService {
    constructor(prismaClient) {
        this.prisma = prismaClient; 
    }

    

    async createServiceListDetails(postBody) {
        try {
            const ServiceListDetails = await this.prisma.serviceDetail.create({
                data: postBody,  
            });
            return ServiceListDetails;  
        } catch (error) {
            throw new Error('Error creating ServiceListDetails: ' + error.message);
        }
    }

    async getAllServiceListDetails() {
        try {
            const ServiceListDetails = await this.prisma.serviceDetail.findMany();
            return ServiceListDetails; 
        } catch (error) {
            throw new Error('Error fetching ServiceListDetails: ' + error.message);
        }
    }

   
    async getServiceListDetailsById(id) {
        try {
            console.log("Fetching ServiceListDetails by ID:", id);
            const ServiceListDetails = await this.prisma.serviceDetail.findUnique({
                where: {
                    id: id, 
                },
            });
            return ServiceListDetails; 
        } catch (error) {
            throw new Error('Error fetching ServiceListDetails by ID: ' + error.message);
        }
    }


    async updateServiceListDetails(id, updateData) {
        try {
        
            const ServiceListDetails = await this.prisma.serviceDetail.update({
                where: {
                    id: Number(id),
                },
                data: updateData, 
            });
            return ServiceListDetails;  
        } catch (error) {
            throw new Error('Error updating ServiceListDetails: ' + error.message);
        }
    }

    async deleteServiceListDetails(id) {
        try {
          
            const ServiceListDetails = await this.prisma.serviceDetail.delete({
                where: {
                    id: Number(id),
                },
            });
            return ServiceListDetails;  
        } catch (error) {
            throw new Error('Error deleting ServiceListDetails: ' + error.message);
        }
    }
}

module.exports = ServiceListDetailsService;
