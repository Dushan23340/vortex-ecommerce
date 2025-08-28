import express from 'express';
import {loginUser, registerUser, adminLogin, updateCart, getCart, clearCart, getAdminStats, getUserProfile, updateUserProfile, forgotPassword, resetPassword, testEmail, addToWishlist, removeFromWishlist, getWishlist, clearWishlist, updateWishlist, verifyEmail, resendVerification } from '../controllers/userController.js';
import userAuth from '../middleware/userAuth.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/admin', adminLogin);

// Email verification endpoint - changed to POST
userRouter.post('/verify-email', verifyEmail);

// Resend verification code endpoint
userRouter.post('/resend-verification', resendVerification);

// Password reset endpoints
userRouter.post('/forgot-password', forgotPassword);
userRouter.post('/reset-password', resetPassword);

// Test email configuration (for development)
userRouter.get('/test-email', testEmail);

// Cart management endpoints (protected by userAuth)
userRouter.post('/cart/update', userAuth, updateCart);
userRouter.get('/cart', userAuth, getCart);
userRouter.delete('/cart', userAuth, clearCart);

// Profile management endpoints (protected by userAuth)
userRouter.get('/profile', userAuth, getUserProfile);
userRouter.put('/profile', userAuth, updateUserProfile);

// Wishlist management endpoints (protected by userAuth)
userRouter.post('/wishlist/add', userAuth, addToWishlist);
userRouter.post('/wishlist/remove', userAuth, removeFromWishlist);
userRouter.get('/wishlist', userAuth, getWishlist);
userRouter.delete('/wishlist', userAuth, clearWishlist);
userRouter.put('/wishlist', userAuth, updateWishlist);

// Admin endpoint for statistics
userRouter.get('/admin/stats', getAdminStats);

export default userRouter;