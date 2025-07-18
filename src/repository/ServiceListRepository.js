class ServiceListRepository {
    constructor(prismaClient) {
        console.log("ServiceListRepository initialized with Prisma Client", prismaClient);
        
        this.prisma = prismaClient;
    }

    async createServiceList(data) {
        return await this.prisma.serviceList.create({
            data: data,
        });
    }

    async getServiceListById(serviceListId) {
        return await this.prisma.serviceList.findUnique({
            where: {
                id: serviceListId,
            },
        });
    }

    async getAllServiceLists() {
        console.log(this.prisma);
        
        return await this.prisma.serviceList.findMany();
    }

    async updateServiceList(serviceListId, updatedData) {
        return await this.prisma.serviceList.update({
            where: {
                id: serviceListId,
            },
            data: updatedData,
        });
    }

    async deleteServiceList(serviceListId) {
        const existing = await this.prisma.serviceList.findUnique({
            where: { serviceId: serviceListId }
        });
        if (!existing) {
            throw new Error('ServiceList not found');
        }
        return await this.prisma.serviceList.delete({
            where: {
                serviceId: serviceListId,
            },
        });
    }
    async getAllServicesListByService(serviceId) {
        return await prisma.serviceList.findMany(
            {
                where: {
                    serviceId: serviceId
                }
            }
        )
    }
}

module.exports = ServiceListRepository;
