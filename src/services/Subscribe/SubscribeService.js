class SubscribeService {
    constructor(prisma) {
        this.prisma = prisma; // Assign prisma instance to the service
    }

    // Subscribe a user
    async subscribe(email) {
        const existingSubscription = await this.prisma.subscribe.findUnique({ where: { email } });
        if (existingSubscription) {
            throw new Error("Email is already subscribed.");
        }

        const newSubscription = await this.prisma.subscribe.create({
            data: {
                email,
                isSubscribed: true,
                subscribedAt: new Date(),
            },
        });

        return newSubscription;
    }

    // Unsubscribe a user
    async unsubscribe(email) {
        const subscription = await this.prisma.subscribe.findUnique({ where: { email } });

        if (!subscription) {
            throw new Error("Subscription not found.");
        }

        const updatedSubscription = await this.prisma.subscribe.update({
            where: { email },
            data: {
                isSubscribed: false,
                unsubscribedAt: new Date(),
            },
        });

        return updatedSubscription;
    }

    // Get all subscriptions
    async getAllSubscriptions() {
        return await this.prisma.subscribe.findMany();
    }

    // Get a subscription by email
    async getSubscriptionByEmail(email) {
        return await this.prisma.subscribe.findUnique({ where: { email } });
    }
}

module.exports = SubscribeService;
