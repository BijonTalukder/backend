class ServiceListRepository {
    constructor(prismaClient) {
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
        return await this.prisma.serviceList.delete({
            where: {
                id: serviceListId,
            },
        });
    }
}

module.exports = ServiceListRepository;
