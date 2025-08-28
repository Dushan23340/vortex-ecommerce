import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Title from '../components/Title';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const paymentId = searchParams.get('payment_id');
    const orderId = searchParams.get('order_id');
    const status = searchParams.get('status_code');

    if (status === '2') {
      toast.success('Payment successful! Your order has been placed.');
      // You can redirect to orders page after a delay
      setTimeout(() => {
        navigate('/orders');
      }, 3000);
    } else {
      toast.error('Payment failed. Please try again.');
      navigate('/place-order');
    }

    setIsLoading(false);
  }, [searchParams, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-lg">Processing payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
            <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <Title text1="PAYMENT" text2="SUCCESSFUL" />
        </div>
        
        <p className="text-gray-600 mb-6">
          Thank you for your payment! Your order has been successfully placed and will be processed shortly.
        </p>
        
        <div className="space-y-3 text-sm text-gray-500">
          <p>Payment ID: {searchParams.get('payment_id')}</p>
          <p>Order ID: {searchParams.get('order_id')}</p>
          <p>Amount: LKR {searchParams.get('payhere_amount')}</p>
        </div>
        
        <div className="mt-8 space-y-3">
          <button
            onClick={() => navigate('/orders')}
            className="w-full bg-black text-white py-2 px-4 rounded hover:bg-gray-800 transition-colors"
          >
            View Orders
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;

