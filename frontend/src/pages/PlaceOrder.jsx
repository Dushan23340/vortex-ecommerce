import React, { useContext, useState, useEffect } from 'react'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import DeliveryCalculator from '../components/DeliveryCalculator'
import { assets } from '../assets/frontend_assets/assets'
import { ShopContext } from '../context/ShopContext'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'
import axios from 'axios'
import { useLocation } from 'react-router-dom'
import OrderVerificationModal from '../components/OrderVerificationModal'

const PlaceOrder = () => {

   const [method, setMethod] = useState('cod');
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [showVerificationModal, setShowVerificationModal] = useState(false);
   const [pendingOrderData, setPendingOrderData] = useState(null);
   const [verificationId, setVerificationId] = useState(null);
   const [deliveryCalculation, setDeliveryCalculation] = useState(null);
   const [formData, setFormData] = useState({
     firstName: '',
     lastName: '',
     email: '',
     street: '',
     city: '',
     state: '',
     zipCode: '',
     country: 'Sri Lanka',
     phone: ''
   });

   const { navigate, clearCart, cartItems, getCartAmount, getDeliveryFee, backendUrl } = useContext(ShopContext);
   const { token, user } = useAuth();
   const location = useLocation();

   // Check if user returned from payment page
   useEffect(() => {
     const urlParams = new URLSearchParams(location.search);
     const returnedFromPayment = urlParams.get('returnedFromPayment');
     
     if (returnedFromPayment === 'true') {
       // Reset form and payment method when returning from payment
       setFormData({
         firstName: '',
         lastName: '',
         email: '',
         street: '',
         city: '',
         state: '',
         zipCode: '',
         country: '',
         phone: ''
       });
       setMethod('cod');
       setIsSubmitting(false);
       
       // Show message to user
       toast.info('Returned from payment page. You can try again or choose a different payment method.');
       
       // Clean up URL parameters
       const newUrl = window.location.pathname;
       window.history.replaceState({}, document.title, newUrl);
     }
   }, [location.search]);

   const handleInputChange = (e) => {
     const { name, value } = e.target;
     setFormData(prev => ({
       ...prev,
       [name]: value
     }));
   };

   // Handle delivery calculation updates
   const handleDeliveryChange = (deliveryData) => {
     setDeliveryCalculation(deliveryData.calculation);
     
     // Update form data with district if available
     if (deliveryData.district && deliveryData.district !== formData.state) {
       setFormData(prev => ({
         ...prev,
         state: deliveryData.district
       }));
     }
   };

   const validateForm = () => {
     const requiredFields = ['firstName', 'lastName', 'email', 'street', 'city', 'state', 'zipCode', 'phone'];
     
     for (const field of requiredFields) {
       if (!formData[field].trim()) {
         toast.error(`${field.charAt(0).toUpperCase() + field.slice(1)} is required`);
         return false;
       }
     }

     // Basic email validation
     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
     if (!emailRegex.test(formData.email)) {
       toast.error('Please enter a valid email address');
       return false;
     }

     // Basic phone validation
     if (formData.phone.length < 10) {
       toast.error('Please enter a valid phone number');
       return false;
     }

     // Delivery calculation validation
     if (!deliveryCalculation || !deliveryCalculation.success) {
       toast.error('Please select a valid delivery location and service');
       return false;
     }

     return true;
   };

   // Handle page visibility change (when user returns from payment page)
   useEffect(() => {
     const handleVisibilityChange = () => {
       if (document.visibilityState === 'visible' && isSubmitting) {
         // User returned to the page, check if they're still on payment
         const currentUrl = window.location.href;
         if (!currentUrl.includes('payhere.lk')) {
           // User is back on our site, reset form
           setIsSubmitting(false);
           toast.info('Returned from payment page. You can try again or choose a different payment method.');
         }
       }
     };

     // Handle browser back button and page refresh
     const handleBeforeUnload = (e) => {
       if (isSubmitting) {
         e.preventDefault();
         e.returnValue = '';
       }
     };

     const handlePopState = () => {
       if (isSubmitting) {
         setIsSubmitting(false);
         toast.info('Payment cancelled. You can try again.');
       }
     };

     document.addEventListener('visibilitychange', handleVisibilityChange);
     window.addEventListener('beforeunload', handleBeforeUnload);
     window.addEventListener('popstate', handlePopState);
     
     return () => {
       document.removeEventListener('visibilitychange', handleVisibilityChange);
       window.removeEventListener('beforeunload', handleBeforeUnload);
       window.removeEventListener('popstate', handlePopState);
     };
   }, [isSubmitting]);

   // PayHere MasterCard payment handler
   const handlePayHerePayment = async (orderData) => {
     try {
       console.log('Initiating PayHere payment...');
       
       // Call backend to prepare PayHere payment data
       const response = await axios.post(`${backendUrl}/api/payment/payhere/create`, 
         { orderData },
         { headers: { Authorization: `Bearer ${token}` } }
       );

       if (response.data.success) {
         const { payhereData } = response.data;
         
         console.log('PayHere data received:', payhereData);
         
         // Create PayHere form and submit
         createPayHereForm(payhereData);
         
       } else {
         toast.error(response.data.message || 'Failed to initialize payment');
         setIsSubmitting(false);
       }
     } catch (error) {
       console.error('PayHere payment error:', error);
       toast.error('Failed to initialize payment. Please try again.');
       setIsSubmitting(false);
     }
   };

   // Create and submit PayHere form
   const createPayHereForm = (payhereData) => {
     try {
       // Create form element
       const form = document.createElement('form');
       form.method = 'POST';
       // Use sandbox or production PayHere URL based on environment configuration
       const isPayHereSandbox = import.meta.env.VITE_PAYHERE_SANDBOX === 'true';
       form.action = isPayHereSandbox
         ? 'https://sandbox.payhere.lk/pay/checkout'
         : 'https://www.payhere.lk/pay/checkout';
       form.target = '_self';

       // Add all PayHere parameters as hidden inputs
       Object.keys(payhereData).forEach(key => {
         const input = document.createElement('input');
         input.type = 'hidden';
         input.name = key;
         input.value = payhereData[key];
         form.appendChild(input);
       });

       // Append form to body and submit
       document.body.appendChild(form);
       
       console.log('Submitting PayHere form...');
       toast.info('Redirecting to PayHere payment gateway...');
       
       // Small delay to show the toast message
       setTimeout(() => {
         form.submit();
       }, 1000);
       
     } catch (error) {
       console.error('Form creation error:', error);
       toast.error('Failed to redirect to payment gateway');
       setIsSubmitting(false);
     }
   };


   const handlePlaceOrder = async () => {
     // Check if cart has items
     const hasItems = Object.keys(cartItems).length > 0;
     
     if (!hasItems) {
       toast.error('Your cart is empty!');
       return;
     }

     if (!validateForm()) {
       return;
     }

     setIsSubmitting(true);

     try {
       // Calculate total amount with dynamic delivery fee
       const cartAmount = await getCartAmount();
       const deliveryFee = deliveryCalculation?.finalFee || getDeliveryFee();
       const totalAmount = cartAmount + deliveryFee;

       // Prepare order data for verification
       const orderData = {
         deliveryInfo: {
           ...formData,
           district: deliveryCalculation?.district || formData.state,
           deliveryService: deliveryCalculation?.serviceType || 'standard'
         },
         paymentMethod: method,
         totalAmount: totalAmount,
         deliveryFee: deliveryFee,
         deliveryCalculation
       };

       // Store order data and show verification modal
       setPendingOrderData(orderData);
       setShowVerificationModal(true);

     } catch (error) {
       console.error('Order preparation error:', error);
       toast.error('Failed to prepare order. Please try again.');
     } finally {
       setIsSubmitting(false);
     }
   };

   // Handle successful verification
   const handleVerificationSuccess = async (verificationId) => {
     setVerificationId(verificationId);
     
     try {
       setIsSubmitting(true);
       
       if (pendingOrderData.paymentMethod === 'cod') {
         // Cash on Delivery - Create verified order directly
         const response = await axios.post(`${backendUrl}/api/order/create-verified`, {
           verificationId
         }, {
           headers: { Authorization: `Bearer ${token}` }
         });

         if (response.data.success) {
           toast.success('Order placed successfully! Cash on delivery.');
           
           // Clear the cart
           clearCart();
           
           // Navigate to orders page
           navigate('/orders');
         } else {
           toast.error(response.data.message || 'Failed to place order');
         }
       } else if (pendingOrderData.paymentMethod === 'mastercard') {
         // For card payments, we'll need to integrate with the verification flow
         // For now, show a message that this feature is coming soon
         toast.info('Card payment with verification coming soon. Please use Cash on Delivery.');
       }

     } catch (error) {
       console.error('Verified order creation error:', error);
       toast.error('Failed to place order. Please try again.');
     } finally {
       setIsSubmitting(false);
     }
   };

  return (
    <div className='flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t'>
      {/* Order Verification Modal */}
      <OrderVerificationModal
        isOpen={showVerificationModal}
        onClose={() => setShowVerificationModal(false)}
        orderData={pendingOrderData}
        onVerificationSuccess={handleVerificationSuccess}
        backendUrl={backendUrl}
        token={token}
      />
      
      <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>

        <div className='text-xl sm:text-2xl my-3'>
          <Title text1={'DELIVERY'} text2={'INFORMATION'} />
        </div>
        
        <div className='flex gap-3'>
          <input 
            className='border border-gray-300 rounded py-1.5 px-3.5 w-full' 
            type='text' 
            placeholder='First name'
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            required
          />
          <input 
            className='border border-gray-300 rounded py-1.5 px-3.5 w-full' 
            type='text' 
            placeholder='Last name'
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <input 
          className='border border-gray-300 rounded py-1.5 px-3.5 w-full' 
          type='email' 
          placeholder='Email Address'
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
        
        <input 
          className='border border-gray-300 rounded py-1.5 px-3.5 w-full' 
          type='text' 
          placeholder='Street'
          name="street"
          value={formData.street}
          onChange={handleInputChange}
          required
        />
        
        <div className='flex gap-3'>
          <input 
            className='border border-gray-300 rounded py-1.5 px-3.5 w-full' 
            type='text' 
            placeholder='City'
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            required
          />
          <input 
            className='border border-gray-300 rounded py-1.5 px-3.5 w-full' 
            type='text' 
            placeholder='State'
            name="state"
            value={formData.state}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className='flex gap-3'>
          <input 
            className='border border-gray-300 rounded py-1.5 px-3.5 w-full' 
            type='text' 
            placeholder='Zip Code'
            name="zipCode"
            value={formData.zipCode}
            onChange={handleInputChange}
            required
          />
          <input 
            className='border border-gray-300 rounded py-1.5 px-3.5 w-full' 
            type='text' 
            placeholder='Country'
            name="country"
            value={formData.country}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <input 
          className='border border-gray-300 rounded py-1.5 px-3.5 w-full' 
          type='tel' 
          placeholder='Phone'
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          required
        />
        
        {/* Delivery Calculator */}
        <div className='mt-6'>
          <DeliveryCalculator 
            onDeliveryChange={handleDeliveryChange}
            selectedDistrict={formData.state}
            selectedCity={formData.city}
          />
        </div>
      </div>

      {/* Right Side */}
      <div className='mt-8'>
        <div className='mmt-8 min-w-80'>
          <CartTotal />

        </div>
        <div className='mt-12'>
          <Title text1={'PAYMENT'} text2={'METHOD'} />

          {/* Payment method Selection */}
          <div className='flex gap-3 flex-col lg:flex-row'>
                         <div 
               onClick={() => setMethod('mastercard')} 
               className={`flex items-center gap-3 border p-2 px-3 cursor-pointer hover:border-gray-400 ${
                 method === 'mastercard' ? 'border-blue-500 bg-blue-50' : ''
               }`}
             >
               <p className={`min-w-3.5 h-3.5 border rounded-full ${
                 method === 'mastercard' ? 'bg-blue-500' : 'bg-gray-300'
               }`}></p>
               <img className='h-5 mx-4' src={assets.masterCard_logo} alt="MasterCard" />
               <div className='flex flex-col'>
                 <span className='text-sm text-gray-700 font-medium'>MasterCard</span>
                 <span className='text-xs text-green-600'>via PayHere</span>
               </div>
             </div>
            
            <div 
              onClick={() => setMethod('cod')} 
              className={`flex items-center gap-3 border p-2 px-3 cursor-pointer hover:border-gray-400 ${
                method === 'cod' ? 'border-blue-500 bg-blue-50' : ''
              }`}
            >
              <p className={`min-w-3.5 h-3.5 border rounded-full ${
                method === 'cod' ? 'bg-blue-500' : 'bg-gray-300'
              }`}></p>
              <p className='text-gray-500 text-sm font-medium mx-4'>CASH ON DELIVERY</p>
            </div>
          </div>

          {/* Payment method info */}
          <div className='mt-4 p-3 bg-gray-50 rounded'>
            <div className='mb-2 text-sm text-blue-600 font-medium'>
              🔒 Email verification required for all orders
            </div>
            {method === 'cod' ? (
              <p className='text-sm text-gray-600'>
                💳 Pay with cash when your order is delivered. No additional fees.
              </p>
            ) : method === 'mastercard' ? (
              <div className='text-sm text-gray-600'>
                <p className='flex items-center gap-2 mb-2'>
                  <span>💳</span>
                  <span>Secure MasterCard payment via PayHere Gateway</span>
                </p>
                <p className='text-xs text-gray-500 pl-6'>
                  • SSL encrypted secure payment processing<br/>
                  • Supports all major MasterCard types<br/>
                  • Instant payment confirmation
                </p>
              </div>
            ) : null}
          </div>

          <div className='w-full text-end mt-8'>
            <button 
              onClick={handlePlaceOrder} 
              disabled={isSubmitting}
              className={`bg-black text-white px-16 py-3 text-sm ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800'
              }`}
            >
              {isSubmitting ? (
                <div className='flex items-center gap-2 justify-center'>
                  <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></div>
                  Processing...
                </div>
              ) : (
                'VERIFY EMAIL & PLACE ORDER'
              )}
            </button>
          </div>

        </div>

      </div>
     
      
    </div>
  )
}

export default PlaceOrder