import React, { useState, useEffect, useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const ReviewSection = ({ productId, productName, onReviewSubmitted }) => {
  const { backendUrl, products, setProducts, getProductsData } = useContext(ShopContext)
  const { token, isAuthenticated } = useAuth()
  
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: ''
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (productId) {
      loadReviews()
    }
  }, [productId])

  const loadReviews = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${backendUrl}/api/review/product/${productId}`)
      
      if (response.data.success) {
        setReviews(response.data.reviews)
      } else {
        console.error('Failed to load reviews:', response.data.message)
      }
    } catch (error) {
      console.error('Error loading reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitReview = async (e) => {
    e.preventDefault()
    
    if (!newReview.comment.trim()) {
      toast.error('Please enter a review comment')
      return
    }

    try {
      setSubmitting(true)
      const response = await axios.post(`${backendUrl}/api/review/add`, {
        productId,
        rating: newReview.rating,
        comment: newReview.comment.trim()
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.data.success) {
        toast.success('Review submitted successfully!')
        setNewReview({ rating: 5, comment: '' })
        setShowReviewForm(false)
        loadReviews() // Refresh reviews
        
        // Update product review count in the products list
        updateProductReviewCount()
        
        // Notify parent component to refresh product data
        if (onReviewSubmitted) {
          onReviewSubmitted()
        }
      } else {
        toast.error(response.data.message || 'Failed to submit review')
      }
    } catch (error) {
      console.error('Error submitting review:', error)
      toast.error('Failed to submit review. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const getRatingStars = (rating) => {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating)
  }

  const formatDate = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  // Update product review count in the products list
  const updateProductReviewCount = () => {
    if (setProducts && products) {
      const updatedProducts = products.map(product => {
        if (product._id === productId) {
          return {
            ...product,
            reviewCount: (product.reviewCount || 0) + 1
          }
        }
        return product
      })
      setProducts(updatedProducts)
      
      // Also refresh products from backend to get updated review counts
      if (getProductsData) {
        getProductsData()
      }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <p className="ml-2">Loading reviews...</p>
      </div>
    )
  }

  return (
    <div className="mt-8 border-t pt-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900">
          Customer Reviews ({reviews.length})
        </h3>
        {isAuthenticated && (
          <button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            {showReviewForm ? 'Cancel' : 'Write a Review'}
          </button>
        )}
      </div>

      {/* Review Form */}
      {showReviewForm && isAuthenticated && (
        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <h4 className="text-lg font-semibold mb-4">Write Your Review</h4>
          <form onSubmit={handleSubmitReview} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating
              </label>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewReview(prev => ({ ...prev, rating: star }))}
                    className={`text-2xl ${newReview.rating >= star ? 'text-yellow-400' : 'text-gray-300'} hover:text-yellow-400 transition-colors`}
                  >
                    ⭐
                  </button>
                ))}
                <span className="ml-2 text-sm text-gray-600">
                  {newReview.rating} out of 5
                </span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Review
              </label>
              <textarea
                value={newReview.comment}
                onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                placeholder="Share your experience with this product..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="4"
                maxLength="500"
                required
              />
              <div className="text-xs text-gray-500 mt-1">
                {newReview.comment.length}/500 characters
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
              <button
                type="button"
                onClick={() => setShowReviewForm(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-md transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">No reviews yet</p>
          <p className="text-gray-400 text-sm mt-2">Be the first to review this product!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review._id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h5 className="font-semibold text-gray-900">{review.userName}</h5>
                  <div className="text-lg text-yellow-400 mb-1">
                    {getRatingStars(review.rating)}
                  </div>
                </div>
                <span className="text-sm text-gray-500">
                  {formatDate(review.createdAt)}
                </span>
              </div>
              
              <p className="text-gray-700 mb-3">{review.comment}</p>
              
              {review.helpful && review.helpful.length > 0 && (
                <div className="text-sm text-gray-500">
                  {review.helpful.length} people found this helpful
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Login Prompt */}
      {!isAuthenticated && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
          <p className="text-blue-800 text-center">
            Please <span className="font-semibold">login</span> to write a review for this product.
          </p>
        </div>
      )}
    </div>
  )
}

export default ReviewSection
