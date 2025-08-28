import React, { useContext, useState, useEffect } from 'react'
import { ShopContext } from '../context/ShopContext'
import { useAuth } from '../context/AuthContext'
import Title from '../components/Title'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const Orders = () => {
  console.log('🚀 Orders component starting to render...')
  
  const context = useContext(ShopContext)
  const { token, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  
  console.log('🔍 Context values:', { 
    hasContext: !!context, 
    hasToken: !!token, 
    isAuthenticated, 
    backendUrl: context?.backendUrl 
  })
  
  if (!context) {
    console.error('ShopContext is undefined!')
    return (
      <div className='border-t pt-16'>
        <div className='text-2xl'>
          <Title text1={'MY'} text2={'ORDERS'} />
        </div>
        <div className='text-center py-8'>
          <p className='text-red-500'>Error: ShopContext not available</p>
          <p className='text-sm text-gray-500 mt-2'>Please check if the app is properly configured</p>
        </div>
      </div>
    )
  }
  
  const { backendUrl, currency } = context
  
  if (!backendUrl) {
    console.error('Backend URL is undefined!')
    return (
      <div className='border-t pt-16'>
        <div className='text-2xl'>
          <Title text1={'MY'} text2={'ORDERS'} />
        </div>
        <div className='text-center py-8'>
          <p className='text-red-500'>Error: Backend URL not configured</p>
          <p className='text-sm text-gray-500 mt-2'>Please check your environment configuration</p>
        </div>
      </div>
    )
  }
  
  if (!isAuthenticated || !token) {
    console.log('🔒 User not authenticated or no token')
    return (
      <div className='border-t pt-16'>
        <div className='text-2xl'>
          <Title text1={'MY'} text2={'ORDERS'} />
        </div>
        <div className='text-center py-8'>
          <p>Please login to view your orders</p>
          <button 
            onClick={() => navigate('/login')}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }
  const [orderData, setOrderData] = useState([])
  const [loading, setLoading] = useState(false)
  const [trackingOrder, setTrackingOrder] = useState(null)
  const [showTrackingModal, setShowTrackingModal] = useState(false)
  
  // Debug logging
  console.log('🔍 Orders component loaded')
  console.log('🔑 Token available:', !!token)
  console.log('🌐 Backend URL:', backendUrl)
  console.log('🔒 Is authenticated:', isAuthenticated)

  const loadOrderData = async () => {
    try {
      if (!token) {
        console.log('❌ No token available')
        return
      }

      console.log('🔍 Loading orders with token:', token)
      console.log('🌐 Backend URL:', backendUrl)
      console.log('🔗 Full API URL:', backendUrl + '/api/order/user')
      
      setLoading(true)
      const response = await axios.post(backendUrl + '/api/order/user', {}, { headers: { Authorization: `Bearer ${token}` } })
      
      console.log('📡 API Response:', response.data)
      
      if (response.data.success) {
        console.log('✅ Orders loaded successfully:', response.data.orders)
        setOrderData(response.data.orders)
      } else {
        console.log('❌ API returned error:', response.data.message)
        toast.error(response.data.message || 'Failed to load orders')
      }
    } catch (error) {
      console.error('❌ Error loading orders:', error)
      console.error('❌ Error details:', error.response?.data || error.message)
      toast.error('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token && backendUrl) {
      loadOrderData()
    }
  }, [token, backendUrl])

  const formatDate = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Order Placed':
        return 'bg-blue-500'
      case 'Processing':
        return 'bg-yellow-500'
      case 'Shipped':
        return 'bg-purple-500'
      case 'Delivered':
        return 'bg-green-500'
      case 'Cancelled':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  const trackOrder = (order) => {
    setTrackingOrder(order)
    setShowTrackingModal(true)
  }

  const closeTrackingModal = () => {
    setShowTrackingModal(false)
    setTrackingOrder(null)
  }

  const handleModalClick = (e) => {
    if (e.target === e.currentTarget) {
      closeTrackingModal()
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading orders...</p>
        </div>
      </div>
    )
  }

  if (orderData.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📋</div>
          <Title text1="NO" text2="ORDERS" />
          <p className="text-gray-600 mt-4 mb-6">
            You haven't placed any orders yet. Start shopping to see your order history here!
          </p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            Start Shopping
          </button>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !token) {
    console.log('🔒 User not authenticated or no token')
    return (
      <div className='border-t pt-16'>
        <div className='text-2xl'>
          <Title text1={'MY'} text2={'ORDERS'} />
        </div>
        <div className='text-center py-8'>
          <p>Please login to view your orders</p>
        </div>
      </div>
    )
  }

  return (
    <div className='border-t pt-16'>
      <div className='text-2xl'>
        <Title text1={'MY'} text2={'ORDERS'} />
      </div>
      
      {orderData.length === 0 ? (
        <div className='text-center py-8'>
          <p className='text-gray-500'>No orders found</p>
        </div>
      ) : (
        <div className='space-y-4'>
          {orderData.map((order, orderIndex) => (
            <div key={order._id} className='border rounded-lg p-4'>
              <div className='flex justify-between items-center mb-4 pb-2 border-b'>
                <div>
                  <p className='font-medium'>Order #{order._id.slice(-6).toUpperCase()}</p>
                  <p className='text-sm text-gray-500'>Placed on {formatDate(order.date)}</p>
                </div>
                <div className='text-right'>
                  <p className='font-medium'>{currency} {order.amount}</p>
                  <p className='text-sm text-gray-500'>{order.paymentMethod?.toUpperCase()}</p>
                </div>
              </div>
              
              <div className='space-y-3'>
                {order.items.map((item, itemIndex) => {
                  return (
                    <div key={`${order._id}-${itemIndex}`} className='flex items-start gap-4 py-2'>
                      {item.image && item.image[0] ? (
                        <img className='w-16 h-16 object-cover rounded' src={item.image[0]} alt={item.name || 'Product'} />
                      ) : (
                        <div className='w-16 h-16 bg-gray-200 rounded flex items-center justify-center'>
                          <span className='text-gray-500 text-xs'>No Image</span>
                        </div>
                      )}
                      <div className='flex-1'>
                        <p className='font-medium'>{item.name || 'Unknown Product'}</p>
                        <div className='flex items-center gap-4 mt-1 text-sm text-gray-600'>
                          <span>Size: {item.size || 'N/A'}</span>
                          <span>Qty: {item.quantity || 'N/A'}</span>
                          <span>{currency} {item.price || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
              
              <div className='mt-4 pt-3 border-t flex justify-between items-center'>
                <div className='flex items-center gap-2'>
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(order.status)}`}></div>
                  <span className='text-sm font-medium'>{order.status}</span>
                </div>
                <button 
                  onClick={() => trackOrder(order)}
                  className='border px-4 py-2 text-sm font-medium rounded hover:bg-gray-50 transition-colors'
                >
                  Track Order
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tracking Modal */}
      {showTrackingModal && trackingOrder && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50' onClick={handleModalClick}>
          <div className='bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto'>
            <div className='flex justify-between items-center mb-4'>
              <h3 className='text-lg font-semibold'>Order Tracking</h3>
              <button 
                onClick={closeTrackingModal}
                className='text-gray-500 hover:text-gray-700 text-xl'
              >
                ×
              </button>
            </div>
            
            <div className='space-y-4'>
              <div className='text-center'>
                <p className='text-sm text-gray-600'>Order #{trackingOrder._id.slice(-6).toUpperCase()}</p>
                <p className='text-lg font-semibold mt-1'>{currency} {trackingOrder.amount}</p>
              </div>
              
              <div className='border-t pt-4'>
                <h4 className='font-medium mb-3'>Order Status</h4>
                <div className='space-y-3'>
                  {['Order Placed', 'Processing', 'Shipped', 'Delivered'].map((status, index) => {
                    const isActive = trackingOrder.status === status
                    const isCompleted = ['Order Placed', 'Processing', 'Shipped', 'Delivered'].indexOf(trackingOrder.status) >= index
                    
                    return (
                      <div key={status} className='flex items-center gap-3'>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                          isCompleted ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
                        }`}>
                          {isCompleted ? '✓' : index + 1}
                        </div>
                        <span className={`text-sm ${isActive ? 'font-medium text-green-600' : 'text-gray-500'}`}>
                          {status}
                        </span>
                        {isActive && (
                          <span className='text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full'>
                            Current
                          </span>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
              
              <div className='border-t pt-4'>
                <h4 className='font-medium mb-2'>Delivery Address</h4>
                <div className='text-sm text-gray-600'>
                  <p>{trackingOrder.address.firstName} {trackingOrder.address.lastName}</p>
                  <p>{trackingOrder.address.street}</p>
                  <p>{trackingOrder.address.city}, {trackingOrder.address.state} {trackingOrder.address.zipcode}</p>
                  <p>{trackingOrder.address.country}</p>
                  <p className='mt-1'>Phone: {trackingOrder.address.phone}</p>
                </div>
              </div>
              
              <div className='border-t pt-4'>
                <h4 className='font-medium mb-2'>Payment Details</h4>
                <div className='text-sm text-gray-600'>
                  <p>Method: {trackingOrder.paymentMethod?.toUpperCase() || 'N/A'}</p>
                  <p>Status: {trackingOrder.payment ? 'Paid' : 'Pending'}</p>
                  {trackingOrder.paymentId && (
                    <p>Payment ID: {trackingOrder.paymentId}</p>
                  )}
                </div>
              </div>
              
              <div className='border-t pt-4'>
                <h4 className='font-medium mb-2'>Order Items</h4>
                <div className='space-y-2'>
                  {trackingOrder.items.map((item, index) => (
                    <div key={index} className='flex items-center gap-3 text-sm'>
                      {item.image && item.image[0] ? (
                        <img className='w-10 h-10 object-cover rounded' src={item.image[0]} alt={item.name || 'Product'} />
                      ) : (
                        <div className='w-10 h-10 bg-gray-200 rounded flex items-center justify-center'>
                          <span className='text-gray-400 text-xs'>No Image</span>
                        </div>
                      )}
                      <div className='flex-1'>
                        <p className='font-medium'>{item.name || 'Unknown Product'}</p>
                        <p className='text-gray-500'>Size: {item.size || 'N/A'} | Qty: {item.quantity || 'N/A'}</p>
                      </div>
                      <p className='font-medium'>{currency} {item.price || 'N/A'}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className='mt-6 pt-4 border-t'>
              <button 
                onClick={closeTrackingModal}
                className='w-full bg-black text-white py-2 px-4 rounded hover:bg-gray-800 transition-colors'
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Orders