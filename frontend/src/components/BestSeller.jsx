import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title'
import ProductItem from './ProductItem'

const BestSeller = () => {

    const {products} = useContext(ShopContext);
    const [bestSeller, setBestSeller] = useState([]);

    useEffect(()=>{
        console.log('=== BESTSELLER COMPONENT ===');
        console.log('All products:', products);
        console.log('Products with bestseller field:', products.map(p => ({name: p.name, bestseller: p.bestseller, type: typeof p.bestseller})));
        
        const bestProduct = products.filter((item)=>(item.bestseller));
        console.log('Filtered bestseller products:', bestProduct);
        console.log('Filtered products length:', bestProduct.length);
        
        setBestSeller(bestProduct.slice(0,5))
    },[products])

  return (
    <div className='my-10'>
        <div className='text-center text-3xl py-8'>
            <Title text1={'BEST'} text2={'SELLERS'} />
            <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
            Discover our most-loved styles — the best-selling pieces that our customers can’t get enough of
            </p>
        </div>

        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
            {
                bestSeller.map((item,index)=>(
                    <ProductItem 
                        key={index} 
                        id={item._id} 
                        name={item.name} 
                        image={item.image} 
                        price={item.price}
                        reviewCount={item.reviewCount || 0}
                        averageRating={item.averageRating || 0}
                        stock={item.stock || 0}
                        stockStatus={item.stockStatus}
                    />

                ))
            }

        </div>

    </div>
  )
}

export default BestSeller