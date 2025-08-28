import express from 'express';
import { handlePayHereWebhook, getPaymentStatus, createPayHerePayment } from '../controllers/paymentController.js';
import userAuth from '../middleware/userAuth.js';

const paymentRouter = express.Router();

// Payment creation endpoint (requires auth)
paymentRouter.post('/payhere/create', userAuth, createPayHerePayment);

// Payment webhook endpoints (no auth required for webhooks)
paymentRouter.post('/payhere-webhook', handlePayHereWebhook);
paymentRouter.get('/status/:paymentId', getPaymentStatus);

export default paymentRouter;

