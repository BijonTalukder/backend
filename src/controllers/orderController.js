const PaymentService = require("../services/PaymentService/PaymentService");
const ResponseHandler = require("../shared/response.handaler");
const stripe = require("stripe")(process.env.STRIPE_SECRETE_KEY)
const { v4: uuidv4 } = require("uuid");
class OrderCOntroller {
    constructor(orderService) {
        this.orderService = orderService;
        this.paymentService = new PaymentService()
    }
    async createOrder(req, res, next) {
        const postBody = req.body;
        try {
            const transactionId = uuidv4();
            const order = await this.orderService.createOrder({
                ...postBody,
                transactionId: transactionId,
            })
            const paymentIntent = await this.paymentService.createPaymentIntent(order,transactionId);
            console.log(paymentIntent.url)
            res.redirect(paymentIntent.url)
            // ResponseHandler.success(res, "order placed successfully", order, 201);
        } catch (error) {

            ResponseHandler.error(res, "order not placed", 500, error);
            next(error)

        }
    }
    async getOrders(req, res, next) {
        try {
            const orders = await this.orderService.getOrders();
            ResponseHandler.success(res, "orders fetched successfully", orders, 200);
        } catch (error) {
            ResponseHandler.error(res, "orders not fetched", 500, error);
            next(error)
        }
    }

    async getOrderById(req, res, next) {
        try {
            const id = req.params.id;
            const order = await this.orderService.getOrderById(id);
            ResponseHandler.success(res, "order fetched successfully", order, 200);
        } catch (error) {
            ResponseHandler.error(res, "order not fetched", 500, error);
            next(error)
        }
    }
    async updateOrder(req, res, next) {
        try {
            const id = req.params.id;
            const postBody = req.body;
            const order = await this.orderService.updateOrder(id, postBody);
            ResponseHandler.success(res, "order updated successfully", order, 200);
        } catch (error) {
            ResponseHandler.error(res, "order not updated", 500, error);
            next(error)
        }
    }
    async deleteOrder(req, res, next) {
        try {
            const id = req.params.id;
            const order = await this.orderService.deleteOrder(id);
            ResponseHandler.success(res, "order deleted successfully", order, 200);
        } catch (error) {
            ResponseHandler.error(res, "order not deleted", 500, error);
            next(error)
        }
    }
    async paymentSuccess(req, res,next) {
        try {
            const result = await this.paymentService.paymentSuccess(req, res);
            
        } catch (error) {
            ResponseHandler.error(res, "payment failed", 500, error);
            next(error)
            
        }

    }
}

module.exports = OrderCOntroller