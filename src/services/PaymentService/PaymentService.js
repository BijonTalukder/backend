const OrderService = require("../Order/OrderService");
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const stripe = require("stripe")(process.env.STRIPE_SECRETE_KEY);

class PaymentService extends OrderService{
    super(){

    }
    // Create payment intent for checkout session
    async createPaymentIntent(order, transactionId,) {
        try {
            console.log(process.env.STRIPE_SECRETE_KEY)
            console.log(order)

            const lineItems = order.orderItems.map(item => ({
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: item.productName || "Unnamed Product",  // Use product name from order item, fallback to a default
                    },
                    unit_amount: Math.round(item.price * 100) || 0,  // Convert price to cents
                },
                quantity: item.quantity || 1,
            }));
            const paymentIntent = await stripe.checkout.sessions.create({
                client_reference_id: transactionId,
                line_items:
                    lineItems,
                mode: "payment",
                success_url: `http://localhost:5000/api/v1/success?sessionId={CHECKOUT_SESSION_ID}&&transactionId=${transactionId}`,
                cancel_url: `${process.env.CLIENT_URL}/cancel`,
            });
            return paymentIntent;
        } catch (error) {
            console.log(error);

            throw new Error("Payment Intent creation failed");
        }
    }

    async paymentSuccess(req, res) {
        try {
            console.log("req.query", req.query);
            
            // Retrieve the session from Stripe using the sessionId
            const session = await stripe.checkout.sessions.retrieve(req.query.sessionId);
            
            console.log("session", session, session.payment_status);
            
            // Check if the payment was successful
            if (session.payment_status === "paid") {
                const transactionId = req.query.transactionId;  // Extract transactionId from query
                
                if (!transactionId) {
                    return res.status(400).send("Transaction ID is missing");
                }
    
                // // Update the order status to "paid" using the transactionId
                // const updatedOrder = await prisma.order.update({
                //     where: {
                //         transactionId: transactionId,  // Use transactionId to find the order
                //     },
                //     data: {
                //         paymentStatus: "paid",  // Mark payment status as "paid"
                //     },
                // });
                console.log(session.client_reference_id);
                const orderData = await prisma.order.findUnique({
                    where:{
                        transactionId: transactionId,
                    }
                })
                console.log(orderData,"orderData");
                const updatedOrder = await prisma.order.update({
                    where: {
                        id: orderData.id,  
                    },
                    data: {
                        paymentStatus: "paid",
                    },
                });
    
                console.log(updatedOrder);
                
                // Redirect the user to the success page
                return res.redirect(`${process.env.CLIENT_URL}/success`);
            } else {
                // If the payment was not successful, redirect to the cancel page
                return res.redirect(`${process.env.CLIENT_URL}/cancel`);
            }
        } catch (error) {
            console.error("Error processing payment success:", error);
            return res.redirect(`${process.env.CLIENT_URL}/cancel`);
        }
    }
    async paymentCancel(req, res) {
        return res.redirect(`${process.env.CLIENT_URL}/cancel`);
    }

   
}

module.exports = PaymentService;
