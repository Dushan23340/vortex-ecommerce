import express from 'express';
import { createOrder, getUserOrders, getOrderById, getAllOrders, updateOrderStatus, updatePaymentStatus, sendOrderVerificationCode, verifyOrderCode, createOrderWithVerification } from '../controllers/orderController.js';
import userAuth from '../middleware/userAuth.js';

const orderRouter = express.Router();

// Order verification endpoints (protected by userAuth)
orderRouter.post('/send-verification', userAuth, sendOrderVerificationCode);
orderRouter.post('/verify-code', userAuth, verifyOrderCode);
orderRouter.post('/create-verified', userAuth, createOrderWithVerification);

// Order management endpoints (protected by userAuth)
orderRouter.post('/create', userAuth, createOrder);
orderRouter.post('/user', userAuth, getUserOrders); // Changed to POST /user to match frontend
orderRouter.get('/user-orders', userAuth, getUserOrders); // Keep old route for backward compatibility
orderRouter.get('/:orderId', userAuth, getOrderById);

// Admin endpoints (no auth required for now - you can add adminAuth middleware later)
orderRouter.get('/admin/all', getAllOrders);
orderRouter.put('/admin/status/:orderId', updateOrderStatus);
orderRouter.put('/admin/payment/:orderId', updatePaymentStatus);

export default orderRouter;
