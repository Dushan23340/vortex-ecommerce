import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title';

const CartTotal = () => {

    const { currency, getDeliveryFee, deliveryCalculation, getCartAmount } = useContext(ShopContext);

    const deliveryFee = getDeliveryFee();
    const cartAmount = getCartAmount();

  return (
    <div className='w-full'>
        <div className='text-2xl'>
            <Title text1={'CART'} text2={'TOTAL'} />
        </div>

        <div className='flex flex-col gap-2 mt-2 text-sm'>
            <div className='flex justify-between'>
                <p>Subtotal</p>
                <p>{currency}{cartAmount}.00</p>
            </div>
            <hr />
            <div className='flex justify-between'>
                <p>Shipping Fee</p>
                <p className='flex items-center gap-1'>
                    {deliveryCalculation?.isFreeDelivery ? (
                        <span className='text-green-600 font-semibold'>FREE</span>
                    ) : (
                        <span>{currency}{deliveryFee}.00</span>
                    )}
                    {deliveryCalculation?.serviceName && (
                        <span className='text-xs text-gray-500'>({deliveryCalculation.serviceName})</span>
                    )}
                </p>
            </div>
            {deliveryCalculation?.estimatedDays && (
                <div className='flex justify-between text-xs text-gray-500'>
                    <p>Estimated Delivery</p>
                    <p>{deliveryCalculation.estimatedDays.text}</p>
                </div>
            )}
            <hr />
            <div className='flex justify-between'>
                <b>Total</b>
                <b>{currency} {cartAmount === 0 ? 0 : cartAmount + deliveryFee}.00</b>
            </div>

            {deliveryCalculation?.isFreeDelivery && (
                <div className='text-xs text-green-600 mt-2 p-2 bg-green-50 rounded'>
                    🎉 You qualify for free delivery!
                </div>
            )}
            
            {deliveryCalculation && !deliveryCalculation.isFreeDelivery && cartAmount > 0 && (
                <div className='text-xs text-blue-600 mt-2 p-2 bg-blue-50 rounded'>
                    💡 Add {currency} {deliveryCalculation.freeDeliveryThreshold - cartAmount} more for free delivery!
                </div>
            )}
        </div>

    </div>
  )
}

export default CartTotal