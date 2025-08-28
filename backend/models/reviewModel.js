import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    userEmail: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: true,
        maxlength: 500
    },
    isApproved: {
        type: Boolean,
        default: false
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    adminResponse: {
        type: String,
        maxlength: 500
    },
    helpful: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        },
        helpful: {
            type: Boolean,
            default: true
        }
    }],
    reported: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        },
        reason: {
            type: String,
            enum: ['spam', 'inappropriate', 'fake', 'other'],
            default: 'other'
        },
        description: String,
        reportedAt: {
            type: Date,
            default: Date.now
        }
    }]
}, { 
    timestamps: true 
});

// Index for better query performance
reviewSchema.index({ productId: 1, isApproved: 1 });
reviewSchema.index({ userId: 1 });

const reviewModel = mongoose.models.review || mongoose.model('review', reviewSchema);

export default reviewModel;

