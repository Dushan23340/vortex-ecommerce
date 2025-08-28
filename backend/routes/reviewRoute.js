import express from 'express';
import { 
    addReview, 
    getProductReviews, 
    getAllReviews, 
    updateReviewStatus, 
    deleteReview, 
    markHelpful, 
    reportReview 
} from '../controllers/reviewController.js';
import userAuth from '../middleware/userAuth.js';

const reviewRouter = express.Router();

// Public routes (no auth required)
reviewRouter.get('/product/:productId', getProductReviews);

// Protected routes (require user authentication)
reviewRouter.post('/add', userAuth, addReview);
reviewRouter.post('/:reviewId/helpful', userAuth, markHelpful);
reviewRouter.post('/:reviewId/report', userAuth, reportReview);

// Admin routes (no auth required for now - you can add adminAuth middleware later)
reviewRouter.get('/admin/all', getAllReviews);
reviewRouter.put('/admin/status/:reviewId', updateReviewStatus);
reviewRouter.delete('/admin/:reviewId', deleteReview);

export default reviewRouter;

