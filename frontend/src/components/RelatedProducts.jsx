import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title';
import ProductItem from './ProductItem';

const RelatedProducts = ({category,subCategory}) => {

    const {products} = useContext(ShopContext);
    const [related,setRelated] = useState([]);

    useEffect(()=>{
        console.log('RelatedProducts useEffect triggered:', { products: products.length, category, subCategory });
        
        if(products.length > 0 && category && subCategory) {

            let productsCopy = products.slice();
            
            // Filter by category first
            productsCopy = productsCopy.filter((item) => item.category === category);
            console.log('After category filter:', productsCopy.length);
            
            // Filter by subCategory
            productsCopy = productsCopy.filter((item) => item.subCategory === subCategory);
            console.log('After subCategory filter:', productsCopy.length);
            
            // Exclude the current product (if we had the current product ID)
            // productsCopy = productsCopy.filter((item) => item._id !== currentProductId);
            
            setRelated(productsCopy.slice(0,5));

        } else {
            console.log('Missing required data:', { productsLength: products.length, category, subCategory });
            setRelated([]);
        }
    }, [products, category, subCategory])

  return (
    <div className='my-24'>
        <div className='text-center text-3xl py-2'>
            <Title text1={'RELATED'} text2={'PRODUCTS'} />
        </div>

        {/* Debug Info */}
        <div className="text-xs text-gray-500 mb-4 text-center">
          Debug: {products.length} total products, {related.length} related products
        </div>

        {related.length > 0 ? (
          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
              {related.map((item,index)=> (
                  <ProductItem 
                    key={index} 
                    id={item._id} 
                    name={item.name} 
                    price={item.price} 
                    image={item.image}
                    reviewCount={item.reviewCount || 0}
                    averageRating={item.averageRating || 0}
                    stock={item.stock || 0}
                    stockStatus={item.stockStatus}
                  />
              ))}
          </div>
        ) : (
          <div className='text-center py-8'>
            <p className='text-gray-500'>No related products found</p>
            <p className='text-sm text-gray-400 mt-2'>Category: {category} | SubCategory: {subCategory}</p>
            <p className='text-xs text-gray-300 mt-1'>Total products available: {products.length}</p>
          </div>
        )}

    </div>
  )
}

export default RelatedProducts