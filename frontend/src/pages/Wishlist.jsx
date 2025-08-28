import React, { useContext } from 'react'
import { useWishlist } from '../context/WishlistContext'
import { ShopContext } from '../context/ShopContext'
import ProductItem from '../components/ProductItem'
import Title from '../components/Title'
import { Link } from 'react-router-dom'

const Wishlist = () => {
  const { wishlistItems, clearWishlist, getWishlistCount } = useWishlist()
  const { products } = useContext(ShopContext)

  if (wishlistItems.length === 0) {
    return (
      <div className='min-h-[60vh] flex flex-col items-center justify-center text-center'>
        <div className='mb-8'>
          <svg className='w-24 h-24 mx-auto text-gray-300 mb-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1} d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' />
          </svg>
          <h2 className='text-2xl font-semibold text-gray-600 mb-2'>Your Wishlist is Empty</h2>
          <p className='text-gray-500 mb-6'>Save items you love to your wishlist and shop them later</p>
          <Link 
            to='/collection'
            className='bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors inline-block'
          >
            Start Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className='py-10'>
      <div className='text-center mb-8'>
        <Title text1={'MY'} text2={'WISHLIST'} />
        <p className='text-gray-600 mt-2'>
          You have {getWishlistCount()} item{getWishlistCount() !== 1 ? 's' : ''} in your wishlist
        </p>
      </div>

      {/* Wishlist Actions */}
      <div className='flex justify-between items-center mb-6'>
        <p className='text-lg font-medium'>
          {getWishlistCount()} Product{getWishlistCount() !== 1 ? 's' : ''}
        </p>
        <button
          onClick={clearWishlist}
          className='text-red-600 hover:text-red-800 text-sm font-medium transition-colors'
        >
          Clear Wishlist
        </button>
      </div>

      {/* Wishlist Items Grid */}
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
        {wishlistItems.map((item, index) => {
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
              reviewCount={item.reviewCount || 0}
              averageRating={item.averageRating || 0}
              stock={stockInfo.stock}
              stockStatus={stockInfo.stockStatus}
            />
          )
        })}
      </div>

      {/* Continue Shopping */}
      <div className='text-center mt-12'>
        <Link 
          to='/collection'
          className='bg-gray-100 text-gray-800 px-6 py-3 rounded-md hover:bg-gray-200 transition-colors inline-block'
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  )
}

export default Wishlist