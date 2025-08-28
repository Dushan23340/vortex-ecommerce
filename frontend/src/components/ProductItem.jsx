import React, {useContext} from 'react'
import {ShopContext} from '../context/ShopContext'
import {Link} from 'react-router-dom'
import { assets } from '../assets/frontend_assets/assets'
import { useWishlist } from '../context/WishlistContext'
import LazyImage from './LazyImage'

const ProductItem = ({id, image, name, price, reviewCount = 0, averageRating = 0, stock = 0, stockStatus}) => {

    const {currency} = useContext(ShopContext);
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
    
    const productData = { _id: id, image, name, price, reviewCount, averageRating, stock, stockStatus };
    const inWishlist = isInWishlist(id);
    
    // Calculate stock status if not provided
    const calculateStockStatus = (stockAmount) => {
        if (stockAmount === 0) return 'Out of Stock';
        if (stockAmount <= 10) return 'Low Stock';
        return 'In Stock';
    };
    
    const currentStockStatus = stockStatus || calculateStockStatus(stock);
    const isOutOfStock = stock === 0 || currentStockStatus === 'Out of Stock';

    const handleWishlistClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (inWishlist) {
            removeFromWishlist(id);
        } else {
            addToWishlist(productData);
        }
    };

    // Function to render star rating
    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        
        // Add full stars
        for (let i = 0; i < fullStars; i++) {
            stars.push(
                <img key={`full-${i}`} src={assets.star_icon} alt="" className="w-3 h-3" />
            );
        }
        
        // Add half star if needed
        if (hasHalfStar && fullStars < 5) {
            stars.push(
                <div key="half" className="relative w-3 h-3">
                    <img src={assets.star_dull_icon} alt="" className="w-3 h-3 absolute" />
                    <div className="overflow-hidden w-1/2">
                        <img src={assets.star_icon} alt="" className="w-3 h-3" />
                    </div>
                </div>
            );
        }
        
        // Add empty stars
        const remainingStars = 5 - Math.ceil(rating);
        for (let i = 0; i < remainingStars; i++) {
            stars.push(
                <img key={`empty-${i}`} src={assets.star_dull_icon} alt="" className="w-3 h-3" />
            );
        }
        
        return stars;
    };

    return (
        <div className='relative text-gray-700 cursor-pointer group'>
            {/* Wishlist Heart Icon */}
            <button 
                onClick={handleWishlistClick}
                className='absolute top-2 right-2 z-10 p-2 rounded-full bg-white bg-opacity-80 hover:bg-opacity-100 transition-all duration-200 opacity-0 group-hover:opacity-100'
                aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            >
                <svg 
                    className={`w-5 h-5 transition-colors ${
                        inWishlist ? 'fill-red-500 text-red-500' : 'fill-none text-gray-600 hover:text-red-500'
                    }`} 
                    stroke='currentColor' 
                    viewBox='0 0 24 24'
                >
                    <path 
                        strokeLinecap='round' 
                        strokeLinejoin='round' 
                        strokeWidth={2} 
                        d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' 
                    />
                </svg>
            </button>
            
            <Link to={`/product/${id}`}>
                <div className='overflow-hidden rounded-t-lg relative'>
                    {/* Out of Stock Overlay */}
                    {isOutOfStock && (
                        <div className='absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10'>
                            <span className='text-white font-semibold text-lg bg-red-600 px-4 py-2 rounded-lg'>
                                OUT OF STOCK
                            </span>
                        </div>
                    )}
                    
                    {/* Stock Status Badge */}
                    {!isOutOfStock && currentStockStatus === 'Low Stock' && (
                        <div className='absolute top-2 left-2 z-10'>
                            <span className='bg-yellow-500 text-white text-xs font-semibold px-2 py-1 rounded'>
                                Low Stock
                            </span>
                        </div>
                    )}
                    
                    <LazyImage 
                        src={image[0]} 
                        alt={name}
                        className={`w-full h-64 object-cover transition-transform duration-300 ease-in-out ${
                            isOutOfStock ? 'opacity-75' : 'hover:scale-110'
                        }`}
                        placeholder={
                            <div className='w-full h-64 bg-gray-200 animate-pulse flex items-center justify-center'>
                                <span className='text-gray-400'>Loading...</span>
                            </div>
                        }
                    />
                </div>
                <div className='p-3'>
                    <p className='pb-1 text-sm font-medium line-clamp-2'>{name}</p>
                    <p className='text-lg font-bold text-gray-900'>{currency}{price}</p>
                    
                    {/* Stock Status */}
                    <div className='mt-1'>
                        <span className={`text-xs font-medium ${
                            isOutOfStock ? 'text-red-600' : 
                            currentStockStatus === 'Low Stock' ? 'text-yellow-600' : 'text-green-600'
                        }`}>
                            {currentStockStatus}
                            {!isOutOfStock && stock > 0 && ` (${stock} left)`}
                        </span>
                    </div>
                    
                    {/* Review Section */}
                    {reviewCount > 0 ? (
                        <div className='flex items-center gap-1 mt-2'>
                            <div className='flex items-center gap-0.5'>
                                {renderStars(averageRating)}
                            </div>
                            <span className='text-xs text-gray-500 ml-1'>
                                ({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})
                            </span>
                        </div>
                    ) : (
                        <div className='flex items-center gap-1 mt-2'>
                            <div className='flex items-center gap-0.5'>
                                {renderStars(0)}
                            </div>
                            <span className='text-xs text-gray-400 ml-1'>No reviews yet</span>
                        </div>
                    )}
                </div>
            </Link>
        </div>
    )
}

export default ProductItem