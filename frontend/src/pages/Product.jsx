import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/frontend_assets/assets';
import RelatedProducts from '../components/RelatedProducts';
import ReviewSection from '../components/ReviewSection';
import { useRecentlyViewed } from '../components/RecentlyViewed';
import { useProductComparison } from '../components/ProductComparison';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'react-toastify';

const Product = () => {

  const {productId} = useParams();
  const {products, currency, addToCart, getProductsData} = useContext(ShopContext);
  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState('');
  const [size, setSize] = useState('');
  const [loading, setLoading] = useState(true);
  
  const { addToRecentlyViewed } = useRecentlyViewed();
  const { addToCompare } = useProductComparison();


  const fetchProductData = async () => {
    setLoading(true);
    
    const foundProduct = products.find(item => item._id === productId);
    
    if (foundProduct) {
      console.log('Product data found:', foundProduct);
      console.log('Rating:', foundProduct.averageRating, 'Reviews:', foundProduct.reviewCount);
      setProductData(foundProduct);
      setImage(foundProduct.image[0]);
      
      // Add to recently viewed
      addToRecentlyViewed(foundProduct);
    } else {
      console.log('Product not found with ID:', productId);
    }
    
    setLoading(false);
  }

  useEffect(() => {
    fetchProductData();
  },[productId, products])

  const refreshProductData = async () => {
    if (getProductsData) {
      await getProductsData();
    }
  }

  if (loading) {
    return (
      <div className='min-h-[60vh] flex items-center justify-center'>
        <LoadingSpinner size="large" text="Loading product details..." />
      </div>
    )
  }

  return productData ? (
    <div className='border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100'>
      {/* Product Data */}
      <div className='flex gap-12 sm:gap-12 flex-col sm:flex-row'>

        {/* Product Images */}
        <div className='flex-1 flex flex-col-reverse gap-3 sm:flex-row'>
          <div className='flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full'>
            {
              productData.image.map((item,index)=>(
                <img onClick={() => setImage(item)}
                  src={item} 
                  key={index} 
                  className='w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer' 
                  alt="" 
                />
              ))
            }

          </div>
          <div className='w-full sm:w-[80%]'>
            <img className='w-full h-auto' src={image}  alt="" />

          </div>

        </div>
        {/* Product Details */}
        <div className='flex-1'>
          <h1 className='font-medium text-2xl mt-2'>{productData.name}</h1>
          
          {/* Stock Status Display */}
          <div className='mt-3'>
            {(() => {
              const stock = productData.stock || 0;
              const stockStatus = productData.stockStatus || (stock === 0 ? 'Out of Stock' : stock <= 10 ? 'Low Stock' : 'In Stock');
              const isOutOfStock = stock === 0 || stockStatus === 'Out of Stock';
              
              return (
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  isOutOfStock ? 'bg-red-100 text-red-800' :
                  stockStatus === 'Low Stock' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  <span className={`w-2 h-2 rounded-full mr-2 ${
                    isOutOfStock ? 'bg-red-500' :
                    stockStatus === 'Low Stock' ? 'bg-yellow-500' :
                    'bg-green-500'
                  }`}></span>
                  {stockStatus}
                  {!isOutOfStock && stock > 0 && ` (${stock} left)`}
                </div>
              );
            })()}
          </div>
          
          
          <div className='flex items-center gap-1 mt-2'>
            {/* Simple Star Display */}
            {[...Array(5)].map((_, index) => (
              <img 
                key={index}
                src={index < (productData.averageRating || 0) ? assets.star_icon : assets.star_dull_icon} 
                alt="" 
                className="w-3 h-3" 
              />
            ))}
            <p className='pl-2'>({productData.reviewCount || 0})</p>
          </div>
          <p className='mt-5 text-3xl font-medium'>{currency} {productData.price}</p>
          <p className='mt-5 text-gray-500 md:w-4/5'>{productData.description}</p>
          <div className='flex flex-col gap-4 my-8'>
            <p>Select Size</p>
            <div className='flex gap-2'>
              {productData.sizes.map((item,index)=>{
                const stock = productData.stock || 0;
                const isOutOfStock = stock === 0 || productData.stockStatus === 'Out of Stock';
                
                return (
                  <button 
                    key={index}
                    onClick={()=>!isOutOfStock && setSize(item)} 
                    disabled={isOutOfStock}
                    className={`border py-2 px-4 transition-all ${
                      isOutOfStock ? 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-50' :
                      item === size ? 'border-orange-500 bg-orange-50' : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
            
            {/* Out of Stock Notice */}
            {(() => {
              const stock = productData.stock || 0;
              const isOutOfStock = stock === 0 || productData.stockStatus === 'Out of Stock';
              
              if (isOutOfStock) {
                return (
                  <div className='bg-red-50 border border-red-200 rounded-lg p-4 mt-4'>
                    <div className='flex items-center'>
                      <svg className='w-5 h-5 text-red-400 mr-2' fill='currentColor' viewBox='0 0 20 20'>
                        <path fillRule='evenodd' d='M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z' clipRule='evenodd' />
                      </svg>
                      <div>
                        <h4 className='text-red-800 font-medium'>Currently Out of Stock</h4>
                        <p className='text-red-600 text-sm mt-1'>This product is temporarily unavailable. Please check back later.</p>
                      </div>
                    </div>
                  </div>
                );
              }
              return null;
            })()}
          </div>
          
          {/* Action Buttons */}
          <div className='flex flex-col sm:flex-row gap-3 mb-4'>
            {(() => {
              const stock = productData.stock || 0;
              const isOutOfStock = stock === 0 || productData.stockStatus === 'Out of Stock';
              
              return (
                <>
                  <button 
                    onClick={() => {
                      if (!isOutOfStock) {
                        if (!size) {
                          toast.error('Please select a size first');
                          return;
                        }
                        addToCart(productData._id, size);
                      }
                    }}
                    disabled={isOutOfStock}
                    className={`px-8 py-3 text-sm transition-colors flex-1 ${
                      isOutOfStock 
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                        : 'bg-black text-white hover:bg-gray-800 active:bg-gray-700'
                    }`}
                  >
                    {isOutOfStock ? 'OUT OF STOCK' : 'ADD TO CART'}
                  </button>
                  <button 
                    onClick={() => addToCompare(productData)} 
                    className='border border-gray-300 text-gray-700 px-6 py-3 text-sm hover:bg-gray-50 transition-colors'
                  >
                    Compare
                  </button>
                </>
              );
            })()}
          </div>
          <hr className='mt-8 sm:w-4/5'></hr>
          <div className='text-sm text-gray-500 mt-5 flex flex-col gap-1'>
            <p>100% Original Product.</p>
            <p>Cash on delivery available on this product.</p>
            <p>Easy return and exchange policy within 7 days.</p>

          </div>

        </div>
      </div>

      {/* Description Section */}
      <div className='mt-20'>
        <div className='flex'>
          <b className='border px-5 py-3 text-sm'>Description</b>
          <p className='border px-5 py-3 text-sm'>Reviews ({productData.reviewCount || 0})</p>
        </div>
        <div className='flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500'>
          <p>Discover the perfect blend of style and comfort with our premium collection. Designed with high-quality fabrics and modern tailoring, this piece is made to keep you looking sharp and feeling confident all day long. Whether you're dressing up for a special occasion or keeping it casual, it's a versatile addition to your wardrobe.</p>
          <p>With attention to detail in every stitch, this product offers both durability and elegance. Its lightweight, breathable material ensures all-day comfort, while the timeless design makes it easy to pair with your favorite accessories. Elevate your everyday look with a piece that never goes out of style.</p>
        </div>
      </div>

      {/* Review Section */}
      <div className='mt-8'>
        <ReviewSection 
          productId={productId} 
          productName={productData.name} 
          onReviewSubmitted={refreshProductData}
        />
      </div>

      {/* Display related Products */}
      <div className="text-xs text-gray-500 mb-4">
        Debug: Passing to RelatedProducts - Category: {productData.category}, SubCategory: {productData.subCategory}
      </div>

      <RelatedProducts category={productData.category} subCategory={productData.subCategory} />



    </div>
  ) : (
    <div className='min-h-[60vh] flex items-center justify-center'>
      <div className='text-center'>
        <h2 className='text-2xl font-semibold text-gray-600 mb-2'>Product Not Found</h2>
        <p className='text-gray-500'>The product you're looking for doesn't exist.</p>
      </div>
    </div>
  )
}

export default Product