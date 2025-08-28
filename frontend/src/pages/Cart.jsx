import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title';
import { assets } from '../assets/frontend_assets/assets';
import CartTotal from '../components/CartTotal';

const Cart = () => {

  const {products, currency, cartItems, updateQuantity, removeFromCart, navigate, clearCart} = useContext(ShopContext);
  const [cartData,setCartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Wait for products to load before processing cart
    if (products.length === 0) {
      setLoading(true);
      return;
    }

    const tempData = [];
    for (const items in cartItems) {
        for ( const item in cartItems[items]){
          if (cartItems[items][item] > 0) {
            tempData.push({
              _id: items,
              size: item,
              quantity: cartItems[items][item]
            })
          }
        }
    }
    setCartData(tempData);
    setLoading(false);

  },[cartItems, products])

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      clearCart();
    }
  };

  return (
    <div className='border-t pt-14'>
      <div className='text-2xl mb-3 flex justify-between items-center'>
        <Title text1={'YOUR'} text2={'CART'} />
        {cartData.length > 0 && (
          <button 
            onClick={handleClearCart}
            className='text-sm text-red-600 hover:text-red-800 underline'
          >
            Clear Cart
          </button>
        )}
      </div>
      
      {loading ? (
        <div className='text-center py-20'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto'></div>
          <p className='mt-4 text-gray-600'>Loading cart...</p>
        </div>
      ) : cartData.length === 0 ? (
        <div className='text-center py-20'>
          <p className='text-gray-500 text-lg mb-4'>Your cart is empty</p>
          <button 
            onClick={() => navigate('/collection')} 
            className='bg-black text-white px-6 py-2 text-sm hover:bg-gray-800'
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <>
          <div>
            {
              cartData.map((item,index)=> {
                const productData = products.find((product)=> product._id === item._id);
                
                // Skip rendering if product data is not found
                if (!productData) {
                  console.warn(`Product with ID ${item._id} not found`);
                  return null;
                }
                
                return (
                  <div key={index} className='py-4 border-t text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4'>
                    <div className='flex items-start gap-6'>
                      <img 
                        className='w-16 sm:w-20'
                        src={productData.image && productData.image[0] ? productData.image[0] : '/placeholder-image.jpg'} 
                        alt={productData.name || 'Product'} 
                      />
                      <div>
                        <p className='text-xs sm:text-lg font-medium'>{productData.name || 'Unknown Product'}</p>
                        <div className='flex items-center gap-5 mt-2'> 
                          <p>{currency}{productData.price || 0}</p>
                          <p className='px-2 sm:px-3 sm:py-1 border bg-slate-50'>{item.size}</p>
                        </div>
                      </div>
                    </div>
                    <input 
                      onChange={(e)=> e.target.value === '' || e.target.value === '0' ? null : updateQuantity(item._id,item.size,Number(e.target.value))} 
                      className='border max-w-10 sm:max-w-20 px-1' 
                      type="number" 
                      min={1} 
                      defaultValue={item.quantity} 
                    />
                    <img 
                      onClick={()=>removeFromCart(item._id,item.size)} 
                      className='w-4 mr-4 sm;w-5 cursor-pointer' 
                      src={assets.bin_icon} 
                      alt="Remove" 
                    />
                  </div>
                )
              })
            }
          </div>
          <div className='flex justify-end mt-20' >
            <div className='w-full sm:w-[450px]'>
              <CartTotal />

              <div className='w-full text-end'>
                <button onClick={()=>navigate('/place-order')} className='bg-black text-white text-sm my-8 px-8 py-3'>PROCEED TO CHECKOUT</button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Cart