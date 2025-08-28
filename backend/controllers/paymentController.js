import orderModel from '../models/orderModel.js';
import userModel from '../models/userModel.js';
import crypto from 'crypto';

// Create PayHere payment
const createPayHerePayment = async (req, res) => {
    try {
        const { orderData } = req.body;
        const userId = req.user.id;

        // Validate order data
        if (!orderData || !orderData.deliveryInfo || !orderData.totalAmount) {
            return res.json({ success: false, message: 'Invalid order data' });
        }

        // Generate unique order ID
        const orderId = `ORDER_${Date.now()}_${userId.slice(-6)}`;
        
        // PayHere configuration (use environment variables in production)
        const merchantId = process.env.PAYHERE_MERCHANT_ID || 'YOUR_MERCHANT_ID';
        const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET || 'YOUR_MERCHANT_SECRET';
        
        // Prepare PayHere payment data
        const payhereData = {
            merchant_id: merchantId,
            return_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment-success`,
            cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment-cancelled`,
            notify_url: `${process.env.BACKEND_URL || 'http://localhost:4000'}/api/payment/payhere-webhook`,
            order_id: orderId,
            items: `Order #${orderId}`,
            currency: 'LKR',
            amount: parseFloat(orderData.totalAmount).toFixed(2),
            first_name: orderData.deliveryInfo.firstName,
            last_name: orderData.deliveryInfo.lastName,
            email: orderData.deliveryInfo.email,
            phone: orderData.deliveryInfo.phone,
            address: `${orderData.deliveryInfo.street}, ${orderData.deliveryInfo.city}`,
            city: orderData.deliveryInfo.city,
            country: orderData.deliveryInfo.country,
            delivery_address: `${orderData.deliveryInfo.street}, ${orderData.deliveryInfo.city}, ${orderData.deliveryInfo.state} ${orderData.deliveryInfo.zipCode}`,
            delivery_city: orderData.deliveryInfo.city,
            delivery_country: orderData.deliveryInfo.country,
            custom_1: JSON.stringify({ ...orderData, userId }), // Store complete order data
            custom_2: userId
        };

        // Generate hash for PayHere (in production, implement proper hash generation)
        const hashString = `${merchantId}${orderId}${parseFloat(orderData.totalAmount).toFixed(2)}LKR`;
        if (merchantSecret && merchantSecret !== 'YOUR_MERCHANT_SECRET') {
            payhereData.hash = crypto.createHash('md5')
                .update(hashString + merchantSecret)
                .digest('hex')
                .toUpperCase();
        }

        console.log('PayHere payment data prepared:', {
            orderId,
            amount: payhereData.amount,
            currency: payhereData.currency,
            customer: `${payhereData.first_name} ${payhereData.last_name}`
        });

        res.json({
            success: true,
            payhereData,
            orderId,
            message: 'PayHere payment data prepared'
        });

    } catch (error) {
        console.error('Create PayHere payment error:', error);
        res.json({
            success: false,
            message: 'Failed to create payment. Please try again.'
        });
    }
};

// PayHere webhook handler
const handlePayHereWebhook = async (req, res) => {
    try {
        const {
            merchant_id,
            order_id,
            payment_id,
            payhere_amount,
            payhere_currency,
            status_code,
            md5sig,
            custom_1 // Contains our order data
        } = req.body;

        // Verify PayHere signature (for production, implement proper signature verification)
        // const calculatedSig = crypto.createHash('md5')
        //     .update(merchant_id + order_id + payhere_amount + payhere_currency + status_code + process.env.PAYHERE_SECRET)
        //     .digest('hex').toUpperCase();
        
        // Log webhook data for debugging
        console.log('PayHere Webhook Received:', {
            merchant_id,
            order_id,
            payment_id,
            payhere_amount,
            status_code,
            custom_1
        });

        // if (calculatedSig !== md5sig) {
        //     return res.status(400).json({ error: 'Invalid signature' });
        // }

        if (status_code === '2') { // Payment successful
            try {
                // Parse order data from custom_1
                const orderData = JSON.parse(custom_1);
                
                // Create order in database
                const newOrder = new orderModel({
                    userId: orderData.userId || 'temp', // Will be updated when user logs in
                    deliveryInfo: orderData.deliveryInfo,
                    orderItems: orderData.orderItems || {},
                    paymentMethod: 'mastercard',
                    paymentStatus: 'completed',
                    orderStatus: 'pending',
                    totalAmount: payhere_amount,
                    deliveryFee: orderData.deliveryFee || 0,
                    paymentDetails: {
                        payherePaymentId: payment_id,
                        payhereOrderId: order_id,
                        currency: payhere_currency
                    }
                });

                await newOrder.save();

                // Clear user's cart if user is logged in
                if (orderData.userId && orderData.userId !== 'temp') {
                    await userModel.findByIdAndUpdate(orderData.userId, { cartData: {} });
                }

                console.log('Order created successfully via PayHere webhook');
                res.json({ success: true, message: 'Payment processed successfully' });

            } catch (error) {
                console.error('Error creating order from webhook:', error);
                res.status(500).json({ error: 'Failed to create order' });
            }
        } else if (status_code === '0') { // Payment cancelled
            console.log('Payment cancelled by user');
            res.json({ success: true, message: 'Payment cancelled' });
        } else if (status_code === '-1') { // Payment failed
            console.log('Payment failed');
            res.json({ success: true, message: 'Payment failed' });
        } else {
            console.log('Unknown payment status:', status_code);
            res.json({ success: true, message: 'Unknown payment status' });
        }

    } catch (error) {
        console.error('PayHere webhook error:', error);
        res.status(500).json({ error: 'Webhook processing failed' });
    }
};

// Get payment status
const getPaymentStatus = async (req, res) => {
    try {
        const { paymentId } = req.params;
        
        // In a real implementation, you would query PayHere API
        // For now, return a mock response
        res.json({
            success: true,
            paymentStatus: 'completed',
            message: 'Payment processed successfully'
        });

    } catch (error) {
        console.error('Get payment status error:', error);
        res.json({ 
            success: false, 
            message: error.message 
        });
    }
};

export { createPayHerePayment, handlePayHereWebhook, getPaymentStatus };
