// const ResponseHandler = require("../shared/response.handler");

const ResponseHandler = require("../shared/response.handaler");

class SubscribeController {
    constructor(subscribeService) {
        this.subscribeService = subscribeService;
    }

    // Subscribe a user
    async subscribe(req, res, next) {
        try {
            const { email } = req.body;
            const result = await this.subscribeService.subscribe(email);

            if (result) {
                ResponseHandler.success(res, "User subscribed successfully.", result);
            } else {
                ResponseHandler.error(res, "Subscription failed.");
            }
        } catch (error) {
            console.error(error);
            next(error);
        }
    }

    // Unsubscribe a user
    async unsubscribe(req, res, next) {
        try {
            const { email } = req.body;
            const result = await this.subscribeService.unsubscribe(email);

            if (result) {
                ResponseHandler.success(res, "User unsubscribed successfully.", result);
            } else {
                ResponseHandler.error(res, "Unsubscription failed. Email not found.");
            }
        } catch (error) {
            console.error(error);
            next(error);
        }
    }

    // Get all subscriptions
    async getSubscriptions(req, res, next) {
        try {
            const subscriptions = await this.subscribeService.getAllSubscriptions();
            ResponseHandler.success(res, "Subscriptions retrieved successfully.", subscriptions);
        } catch (error) {
            console.error(error);
            next(error);
        }
    }

    // Get a single subscription by email
    async getSubscriptionByEmail(req, res, next) {
        try {
            const { email } = req.params;
            const subscription = await this.subscribeService.getSubscriptionByEmail(email);

            if (subscription) {
                ResponseHandler.success(res, "Subscription retrieved successfully.", subscription);
            } else {
                ResponseHandler.error(res, "Subscription not found.");
            }
        } catch (error) {
            console.error(error);
            next(error);
        }
    }
}

module.exports = SubscribeController;
