import React, { useState, useEffect, useContext } from 'react'
import ProductItem from './ProductItem'
import Title from './Title'
import { ShopContext } from '../context/ShopContext'

const RecentlyViewed = () => {
  const [recentlyViewed, setRecentlyViewed] = useState([])
  const { products } = useContext(ShopContext)
  const { getProductsData } = useContext(ShopContext) // Add getProductsData

  useEffect(() => {
    // Load recently viewed products from localStorage
    const savedViewed = localStorage.getItem('recentlyViewed')
    if (savedViewed) {
      const viewedProducts = JSON.parse(savedViewed)
      
      // Sync with current product data to get updated stock information
      const updatedViewed = viewedProducts.map(viewedItem => {
        const currentProduct = products.find(p => p._id === viewedItem._id)
        if (currentProduct) {
          // Use current product data for stock info, but keep viewed timestamp
          return {
            ...currentProduct,
            viewedAt: viewedItem.viewedAt
          }
        }
        return viewedItem // Keep original if product not found in current products
      })
      
      setRecentlyViewed(updatedViewed)
    }
  }, [products]) // Re-run when products change

  // Clean up localStorage when products change
  useEffect(() => {
    if (products.length > 0 && recentlyViewed.length > 0) {
      const validViewed = recentlyViewed.filter(item => 
        products.some(product => product._id === item._id)
      );
      
      if (validViewed.length !== recentlyViewed.length) {
        setRecentlyViewed(validViewed);
        if (validViewed.length === 0) {
          localStorage.removeItem('recentlyViewed');
        } else {
          localStorage.setItem('recentlyViewed', JSON.stringify(validViewed));
        }
      }
    }
  }, [products]); // Run when products change

  // Function to add product to recently viewed (to be called from Product page)
  const addToRecentlyViewed = (product) => {
    if (!product || !product._id) return

    const productData = {
      _id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      reviewCount: product.reviewCount || 0,
      averageRating: product.averageRating || 0,
      stock: product.stock || 0,
      stockStatus: product.stockStatus,
      viewedAt: new Date().toISOString()
    }

    setRecentlyViewed(prev => {
      // Remove if already exists
      const filtered = prev.filter(item => item._id !== product._id)
      // Add to beginning
      const updated = [productData, ...filtered]
      // Keep only last 10 items
      const limited = updated.slice(0, 10)
      
      // Save to localStorage
      localStorage.setItem('recentlyViewed', JSON.stringify(limited))
      
      return limited
    })
  }

  // Clear recently viewed
  const clearRecentlyViewed = () => {
    setRecentlyViewed([])
    localStorage.removeItem('recentlyViewed')
  }

  // Don't render if no recently viewed products
  if (recentlyViewed.length === 0) {
    return (
      <div className='my-10 text-center'>
        <h3 className='text-xl py-4'>Recently Viewed Products</h3>
        <p className='text-gray-600'>No recently viewed products found</p>
        <p className='text-sm text-gray-500 mt-2'>Products you view will appear here</p>
        <div className='mt-4'>
          <button 
            onClick={getProductsData}
            className='text-xs text-blue-600 hover:text-blue-800 underline mx-2'>
            Refresh Products
          </button>
          <button 
            onClick={clearRecentlyViewed}
            className='text-xs text-red-600 hover:text-red-800 underline'>
            Clear History
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className='my-10'>
      <div className='text-center text-2xl py-8'>
        <Title text1={'RECENTLY'} text2={'VIEWED'} />
        <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600 mb-4'>
          Continue shopping from where you left off
        </p>
        <button 
          onClick={clearRecentlyViewed}
          className='text-xs text-red-600 hover:text-red-800 underline'
        >
          Clear History
        </button>
      </div>

      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
        {recentlyViewed.map((item, index) => {
          // Ensure we have current stock information
          const currentProduct = products.find(p => p._id === item._id)
          const stockInfo = currentProduct ? {
            stock: currentProduct.stock || 0,
            stockStatus: currentProduct.stockStatus
          } : {
            stock: item.stock || 0,
            stockStatus: item.stockStatus
          }
          
          return (
            <ProductItem 
              key={`${item._id}-${index}`}
              id={item._id} 
              image={item.image} 
              name={item.name} 
              price={item.price}
              reviewCount={item.reviewCount}
              averageRating={item.averageRating}
              stock={stockInfo.stock}
              stockStatus={stockInfo.stockStatus}
            />
          )
        })}
      </div>
    </div>
  )
}

// Export the hook to be used in Product page
export const useRecentlyViewed = () => {
  const addToRecentlyViewed = (product) => {
    if (!product || !product._id) return

    const productData = {
      _id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      reviewCount: product.reviewCount || 0,
      averageRating: product.averageRating || 0,
      stock: product.stock || 0,
      stockStatus: product.stockStatus,
      viewedAt: new Date().toISOString()
    }

    const saved = localStorage.getItem('recentlyViewed')
    const current = saved ? JSON.parse(saved) : []
    
    // Remove if already exists
    const filtered = current.filter(item => item._id !== product._id)
    // Add to beginning
    const updated = [productData, ...filtered]
    // Keep only last 10 items
    const limited = updated.slice(0, 10)
    
    // Save to localStorage
    localStorage.setItem('recentlyViewed', JSON.stringify(limited))
  }

  return { addToRecentlyViewed }
}

export default RecentlyViewed