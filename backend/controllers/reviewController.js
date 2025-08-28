import reviewModel from '../models/reviewModel.js';
import productModel from '../models/productModel.js';
import userModel from '../models/userModel.js';

// Add a new review
const addReview = async (req, res) => {
    try {
        const { productId, rating, comment } = req.body;
        const userId = req.user._id;

        // Validate required fields
        if (!productId || !rating || !comment) {
            return res.json({
                success: false,
                message: "Product ID, rating, and comment are required"
            });
        }

        // Validate rating range
        if (rating < 1 || rating > 5) {
            return res.json({
                success: false,
                message: "Rating must be between 1 and 5"
            });
        }

        // Check if product exists
        const product = await productModel.findById(productId);
        if (!product) {
            return res.json({
                success: false,
                message: "Product not found"
            });
        }

        // Check if user has already reviewed this product
        const existingReview = await reviewModel.findOne({ productId, userId });
        if (existingReview) {
            return res.json({
                success: false,
                message: "You have already reviewed this product"
            });
        }

        // Get user details
        const user = await userModel.findById(userId);
        if (!user) {
            return res.json({
                success: false,
                message: "User not found"
            });
        }

        // Create new review
        const newReview = new reviewModel({
            productId,
            userId,
            userName: user.name,
            userEmail: user.email,
            rating,
            comment,
            isApproved: true // Reviews are immediately visible
        });

        const savedReview = await newReview.save();

        // Update product's average rating and review count
        await updateProductRating(productId);

        res.json({
            success: true,
            message: "Review submitted successfully!",
            review: savedReview
        });

    } catch (error) {
        console.log('Add review error:', error);
        res.json({
            success: false,
            message: error.message
        });
    }
};

// Get reviews for a product (approved only for public)
const getProductReviews = async (req, res) => {
    try {
        const { productId } = req.params;

        let query = { productId };
        
        // Show all reviews (no approval filter needed)

        const reviews = await reviewModel.find(query)
            .sort({ createdAt: -1 })
            .populate('userId', 'name');

        res.json({
            success: true,
            reviews: reviews
        });

    } catch (error) {
        console.log('Get product reviews error:', error);
        res.json({
            success: false,
            message: error.message
        });
    }
};

// Get all reviews (admin function)
const getAllReviews = async (req, res) => {
    try {
        const { status, productId, page = 1, limit = 20 } = req.query;
        
        let query = {};
        
        if (status === 'pending') {
            query.isApproved = false;
        } else if (status === 'approved') {
            query.isApproved = true;
        }
        
        if (productId) {
            query.productId = productId;
        }

        const skip = (page - 1) * limit;
        
        const reviews = await reviewModel.find(query)
            .populate('productId', 'name')
            .populate('userId', 'name email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await reviewModel.countDocuments(query);

        res.json({
            success: true,
            reviews: reviews,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalReviews: total,
                hasNext: skip + reviews.length < total,
                hasPrev: page > 1
            }
        });

    } catch (error) {
        console.log('Get all reviews error:', error);
        res.json({
            success: false,
            message: error.message
        });
    }
};

// Approve/Reject review (admin function)
const updateReviewStatus = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const { isApproved, adminResponse } = req.body;

        const review = await reviewModel.findById(reviewId);
        if (!review) {
            return res.json({
                success: false,
                message: "Review not found"
            });
        }

        review.isApproved = isApproved;
        if (adminResponse) {
            review.adminResponse = adminResponse;
            review.isAdmin = true;
        }

        await review.save();

        // Update product rating if review status changed
        if (review.isApproved !== isApproved) {
            await updateProductRating(review.productId);
        }

        res.json({
            success: true,
            message: `Review ${isApproved ? 'approved' : 'rejected'} successfully`,
            review: review
        });

    } catch (error) {
        console.log('Update review status error:', error);
        res.json({
            success: false,
            message: error.message
        });
    }
};

// Delete review (admin function)
const deleteReview = async (req, res) => {
    try {
        const { reviewId } = req.params;

        const review = await reviewModel.findById(reviewId);
        if (!review) {
            return res.json({
                success: false,
                message: "Review not found"
            });
        }

        await reviewModel.findByIdAndDelete(reviewId);

        // Update product rating
        await updateProductRating(review.productId);

        res.json({
            success: true,
            message: "Review deleted successfully"
        });

    } catch (error) {
        console.log('Delete review error:', error);
        res.json({
            success: false,
            message: error.message
        });
    }
};

// Mark review as helpful
const markHelpful = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const userId = req.user._id;

        const review = await reviewModel.findById(reviewId);
        if (!review) {
            return res.json({
                success: false,
                message: "Review not found"
            });
        }

        const existingHelpful = review.helpful.find(h => h.userId.toString() === userId.toString());
        
        if (existingHelpful) {
            // Remove helpful mark
            review.helpful = review.helpful.filter(h => h.userId.toString() !== userId.toString());
        } else {
            // Add helpful mark
            review.helpful.push({ userId, helpful: true });
        }

        await review.save();

        res.json({
            success: true,
            message: existingHelpful ? "Helpful mark removed" : "Marked as helpful",
            helpfulCount: review.helpful.length
        });

    } catch (error) {
        console.log('Mark helpful error:', error);
        res.json({
            success: false,
            message: error.message
        });
    }
};

// Report review
const reportReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const { reason, description } = req.body;
        const userId = req.user._id;

        const review = await reviewModel.findById(reviewId);
        if (!review) {
            return res.json({
                success: false,
                message: "Review not found"
            });
        }

        // Check if user already reported this review
        const existingReport = review.reported.find(r => r.userId.toString() === userId.toString());
        if (existingReport) {
            return res.json({
                success: false,
                message: "You have already reported this review"
            });
        }

        review.reported.push({
            userId,
            reason,
            description
        });

        await review.save();

        res.json({
            success: true,
            message: "Review reported successfully"
        });

    } catch (error) {
        console.log('Report review error:', error);
        res.json({
            success: false,
            message: error.message
        });
    }
};

// Helper function to update product rating
const updateProductRating = async (productId) => {
    try {
        const allReviews = await reviewModel.find({ productId });

        if (allReviews.length > 0) {
            const totalRating = allReviews.reduce((sum, review) => sum + review.rating, 0);
            const averageRating = totalRating / allReviews.length;

            await productModel.findByIdAndUpdate(productId, {
                averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
                reviewCount: allReviews.length
            });
        } else {
            await productModel.findByIdAndUpdate(productId, {
                averageRating: 0,
                reviewCount: 0
            });
        }
    } catch (error) {
        console.log('Update product rating error:', error);
    }
};

export { 
    addReview, 
    getProductReviews, 
    getAllReviews, 
    updateReviewStatus, 
    deleteReview, 
    markHelpful, 
    reportReview 
};
