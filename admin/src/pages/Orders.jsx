import React, { useState, useEffect } from 'react'
import { backendUrl, currency } from '../App'
import axios from 'axios'
import { toast } from 'react-toastify'

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showOrderModal, setShowOrderModal] = useState(false)
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  
  // Debug logging
  console.log('🔍 Admin Orders component loaded')
  console.log('🌐 Backend URL:', backendUrl)
  console.log('🔑 Token available:', !!token)

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    try {
      setLoading(true)
      console.log('🔍 Admin: Loading orders from:', `${backendUrl}/api/order/admin/all`)
      
      const response = await axios.get(`${backendUrl}/api/order/admin/all`)
      
      console.log('📡 Admin: API Response:', response.data)
      
      if (response.data.success) {
        console.log('✅ Admin: Orders loaded successfully:', response.data.orders.length, 'orders')
        setOrders(response.data.orders)
        toast.success(`Loaded ${response.data.orders.length} orders`)
      } else {
        console.log('❌ Admin: API returned error:', response.data.message)
        toast.error(response.data.message || 'Failed to load orders')
      }
    } catch (error) {
      console.error('❌ Admin: Error loading orders:', error)
      console.error('❌ Admin: Error details:', error.response?.data || error.message)
      toast.error('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500'
      case 'pending':
        return 'bg-yellow-500'
      case 'failed':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  const updatePaymentStatus = async (orderId, newPaymentStatus) => {
    try {
      const response = await axios.put(`${backendUrl}/api/order/admin/payment/${orderId}`, {
        paymentStatus: newPaymentStatus
      })
      
      if (response.data.success) {
        toast.success('Payment status updated successfully!')
        // Update the local state
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order._id === orderId 
              ? { ...order, paymentStatus: newPaymentStatus, status: response.data.order.orderStatus }
              : order
          )
        )
      } else {
        toast.error(response.data.message || 'Failed to update payment status')
      }
    } catch (error) {
      console.error('Error updating payment status:', error)
      toast.error('Failed to update payment status')
    }
  }

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await axios.put(`${backendUrl}/api/order/admin/status/${orderId}`, {
        status: newStatus
      })
      
      if (response.data.success) {
        toast.success('Order status updated successfully!')
        // Update the local state
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order._id === orderId 
              ? { ...order, status: newStatus }
              : order
          )
        )
      } else {
        toast.error(response.data.message || 'Failed to update order status')
      }
    } catch (error) {
      console.error('Error updating order status:', error)
      toast.error('Failed to update order status')
    }
  }

  const viewOrderDetails = (order) => {
    setSelectedOrder(order)
    setShowOrderModal(true)
  }

  const closeOrderModal = () => {
    setShowOrderModal(false)
    setSelectedOrder(null)
  }

  const filteredOrders = orders
    .filter(order => {
      if (statusFilter === 'all') return true
      if (statusFilter === 'cod-pending') {
        return order.paymentMethod === 'cod' && order.paymentStatus === 'pending'
      }
      return order.status === statusFilter
    })
    .filter(order => 
      searchTerm === '' || 
      order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order._id?.toLowerCase().includes(searchTerm.toLowerCase())
    )

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Orders Management</h1>
          <p className="text-gray-600 mt-2">Manage and track all customer orders</p>
        </div>
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
          />
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Orders</option>
            <option value="Order Placed">Order Placed</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
            <option value="cod-pending">COD - Payment Pending</option>
          </select>
          <button 
            onClick={loadOrders}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Total Orders</h3>
          <p className="text-3xl font-bold text-blue-600">{orders.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Pending</h3>
          <p className="text-3xl font-bold text-yellow-600">
            {orders.filter(o => o.status === 'Order Placed').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Processing</h3>
          <p className="text-3xl font-bold text-purple-600">
            {orders.filter(o => o.status === 'Processing').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Delivered</h3>
          <p className="text-3xl font-bold text-green-600">
            {orders.filter(o => o.status === 'Delivered').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-orange-500">
          <h3 className="text-lg font-semibold text-orange-700">COD Pending</h3>
          <p className="text-3xl font-bold text-orange-600">
            {orders.filter(o => o.paymentMethod === 'cod' && o.paymentStatus === 'pending').length}
          </p>
          <p className="text-xs text-orange-600 mt-1">Payments to confirm</p>
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Orders ({filteredOrders.length})
          </h2>
        </div>
        
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {orders.length === 0 ? 'No orders found' : 'No orders match your filters'}
            </p>
            {orders.length === 0 && (
              <button 
                onClick={loadOrders}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
              >
                Try Again
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        #{order.orderNumber}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.paymentMethod?.toUpperCase()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {order.customer?.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.customer?.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {order.items?.length || 0} items
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.items?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0} total qty
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {currency} {order.amount}
                      </div>
                      <div className="text-sm text-gray-500">
                        +{currency} {order.deliveryFee} delivery
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(order.status)} mr-2`}></div>
                        <span className="text-sm font-medium text-gray-900">
                          {order.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full ${getPaymentStatusColor(order.paymentStatus)} mr-2`}></div>
                        <span className="text-sm font-medium text-gray-900 capitalize">
                          {order.paymentStatus}
                        </span>
                      </div>
                      {/* Payment Status Actions for COD */}
                      {order.paymentMethod === 'cod' && order.paymentStatus === 'pending' && (
                        <div className="mt-1">
                          <button
                            onClick={() => updatePaymentStatus(order._id, 'completed')}
                            className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded hover:bg-green-200 transition-colors mr-1"
                            title="Mark payment as received"
                          >
                            Mark Paid
                          </button>
                          <button
                            onClick={() => updatePaymentStatus(order._id, 'failed')}
                            className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded hover:bg-red-200 transition-colors"
                            title="Mark payment as failed"
                          >
                            Mark Failed
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(order.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => viewOrderDetails(order)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        View Details
                      </button>
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                        className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="Order Placed">Order Placed</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                Order #{selectedOrder.orderNumber} Details
              </h3>
              <button 
                onClick={closeOrderModal}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Order Info */}
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Order Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Order ID:</span>
                      <span className="font-medium">{selectedOrder._id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span className="font-medium">{formatDate(selectedOrder.date)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className="font-medium">{selectedOrder.status}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Method:</span>
                      <span className="font-medium">{selectedOrder.paymentMethod?.toUpperCase()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Status:</span>
                      <span className={`font-medium capitalize ${
                        selectedOrder.paymentStatus === 'completed' ? 'text-green-600' :
                        selectedOrder.paymentStatus === 'pending' ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>{selectedOrder.paymentStatus}</span>
                    </div>
                    
                    {/* Payment Status Actions for COD */}
                    {selectedOrder.paymentMethod === 'cod' && selectedOrder.paymentStatus === 'pending' && (
                      <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <h5 className="text-sm font-medium text-yellow-800 mb-2">COD Payment Actions</h5>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              updatePaymentStatus(selectedOrder._id, 'completed')
                              setSelectedOrder(prev => ({ ...prev, paymentStatus: 'completed' }))
                            }}
                            className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
                          >
                            ✓ Payment Received
                          </button>
                          <button
                            onClick={() => {
                              updatePaymentStatus(selectedOrder._id, 'failed')
                              setSelectedOrder(prev => ({ ...prev, paymentStatus: 'failed' }))
                            }}
                            className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
                          >
                            ✗ Payment Failed
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Customer Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-medium">{selectedOrder.customer?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium">{selectedOrder.customer?.email}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Delivery Address</h4>
                  <div className="space-y-2 text-sm">
                    <p className="font-medium">
                      {selectedOrder.address?.firstName} {selectedOrder.address?.lastName}
                    </p>
                    <p className="text-gray-600">{selectedOrder.address?.street}</p>
                    <p className="text-gray-600">
                      {selectedOrder.address?.city}, {selectedOrder.address?.state} {selectedOrder.address?.zipcode}
                    </p>
                    <p className="text-gray-600">{selectedOrder.address?.country}</p>
                    <p className="text-gray-600">Phone: {selectedOrder.address?.phone}</p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-3">Order Items</h4>
                  <div className="space-y-3">
                    {selectedOrder.items && selectedOrder.items.length > 0 ? (
                      selectedOrder.items.map((item, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-white rounded border">
                          {item.image && item.image[0] ? (
                            <img 
                              className="w-16 h-16 object-cover rounded" 
                              src={item.image[0]} 
                              alt={item.name || 'Product'} 
                            />
                          ) : (
                            <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                              <span className="text-gray-500 text-xs">No Image</span>
                            </div>
                          )}
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{item.name || 'Unknown Product'}</p>
                            <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                              <span>Size: {item.size || 'N/A'}</span>
                              <span>Qty: {item.quantity || 0}</span>
                              <span className="font-medium">{currency} {item.price || 0}</span>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-gray-500">
                        No items found for this order
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Order Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="font-medium">{currency} {selectedOrder.amount - selectedOrder.deliveryFee}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Delivery Fee:</span>
                      <span className="font-medium">{currency} {selectedOrder.deliveryFee}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="font-semibold text-gray-900">Total:</span>
                      <span className="font-bold text-lg text-gray-900">{currency} {selectedOrder.amount}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t">
              <button 
                onClick={closeOrderModal}
                className="w-full bg-gray-800 text-white py-2 px-4 rounded hover:bg-gray-700 transition-colors"
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