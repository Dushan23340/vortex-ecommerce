import React, { useState, useEffect } from 'react'
import { assets } from '../assets/frontend_assets/assets'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'

const ProductComparison = () => {
  const [compareList, setCompareList] = useState([])
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Load comparison list from localStorage
    const savedCompare = localStorage.getItem('compareList')
    if (savedCompare) {
      setCompareList(JSON.parse(savedCompare))
    }
  }, [])

  // Save to localStorage whenever compareList changes
  useEffect(() => {
    localStorage.setItem('compareList', JSON.stringify(compareList))
  }, [compareList])

  const addToCompare = (product) => {
    if (compareList.find(item => item._id === product._id)) {
      toast.info('Product already in comparison')
      return
    }

    if (compareList.length >= 4) {
      toast.error('You can compare maximum 4 products')
      return
    }

    const productData = {
      _id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      subCategory: product.subCategory,
      sizes: product.sizes || [],
      reviewCount: product.reviewCount || 0,
      averageRating: product.averageRating || 0
    }

    setCompareList(prev => [...prev, productData])
    toast.success('Product added to comparison')
  }

  const removeFromCompare = (productId) => {
    setCompareList(prev => prev.filter(item => item._id !== productId))
    toast.success('Product removed from comparison')
  }

  const clearCompare = () => {
    setCompareList([])
    localStorage.removeItem('compareList')
    toast.success('Comparison cleared')
  }

  const renderStars = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating)
    
    for (let i = 0; i < 5; i++) {
      stars.push(
        <img 
          key={i} 
          src={i < fullStars ? assets.star_icon : assets.star_dull_icon} 
          alt="" 
          className="w-3 h-3" 
        />
      )
    }
    return stars
  }

  if (compareList.length === 0) {
    return null
  }

  return (
    <>
      {/* Floating Compare Button */}
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors relative"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          {compareList.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {compareList.length}
            </span>
          )}
        </button>
      </div>

      {/* Comparison Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-auto">
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold">Product Comparison</h2>
              <div className="flex gap-2">
                <button
                  onClick={clearCompare}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Comparison Table */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {compareList.map((product) => (
                  <div key={product._id} className="border rounded-lg p-4 relative">
                    {/* Remove Button */}
                    <button
                      onClick={() => removeFromCompare(product._id)}
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>

                    {/* Product Image */}
                    <Link to={`/product/${product._id}`} onClick={() => setIsOpen(false)}>
                      <img
                        src={product.image[0]}
                        alt={product.name}
                        className="w-full h-48 object-cover rounded mb-4 hover:opacity-80 transition-opacity"
                      />
                    </Link>

                    {/* Product Details */}
                    <div className="space-y-3">
                      <h3 className="font-semibold text-lg line-clamp-2">{product.name}</h3>
                      
                      <p className="text-xl font-bold text-green-600">Rs.{product.price}</p>
                      
                      <div className="text-sm text-gray-600">
                        <p><span className="font-medium">Category:</span> {product.category}</p>
                        <p><span className="font-medium">Type:</span> {product.subCategory}</p>
                      </div>

                      <div className="flex items-center gap-1">
                        {renderStars(product.averageRating)}
                        <span className="text-sm text-gray-500 ml-1">
                          ({product.reviewCount} reviews)
                        </span>
                      </div>

                      <div>
                        <p className="text-sm font-medium mb-1">Available Sizes:</p>
                        <div className="flex flex-wrap gap-1">
                          {product.sizes.map((size, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 text-xs bg-gray-100 rounded"
                            >
                              {size}
                            </span>
                          ))}
                        </div>
                      </div>

                      <Link
                        to={`/product/${product._id}`}
                        onClick={() => setIsOpen(false)}
                        className="block w-full text-center bg-black text-white py-2 rounded hover:bg-gray-800 transition-colors"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// Export hook to be used in other components
export const useProductComparison = () => {
  const addToCompare = (product) => {
    const saved = localStorage.getItem('compareList')
    const current = saved ? JSON.parse(saved) : []

    if (current.find(item => item._id === product._id)) {
      toast.info('Product already in comparison')
      return
    }

    if (current.length >= 4) {
      toast.error('You can compare maximum 4 products')
      return
    }

    const productData = {
      _id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      subCategory: product.subCategory,
      sizes: product.sizes || [],
      reviewCount: product.reviewCount || 0,
      averageRating: product.averageRating || 0
    }

    const updated = [...current, productData]
    localStorage.setItem('compareList', JSON.stringify(updated))
    toast.success('Product added to comparison')
  }

  return { addToCompare }
}

export default ProductComparison