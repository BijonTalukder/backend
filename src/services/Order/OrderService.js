class OrderService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createOrder(postBody) {
        const order = await this.prisma.order.create({
            data: postBody
        })
        return order;

    }
    async getOrders() {
        const orders = await this.prisma.order.findMany();
        return orders;
    }
    async getOrderById(id) {
        const order = await this.prisma.order.findUnique({
            where: {
                id: parseInt(id)
            }
        })
        return order;
    }

    async updateOrder(id, postBody) {
        const order = await this.prisma.order.update({
            where: {
                id: parseInt(id)
            },
            data: postBody
        })
        return order;
    }
    async deleteOrder(id) {
        const order = await this.prisma.order.delete({
            where: {
                id: parseInt(id)
            }
        })
        return order;
    }
}

module.exports = OrderService;