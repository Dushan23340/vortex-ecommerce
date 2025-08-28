import React, { useState, useEffect } from 'react'
import { backendUrl, currency } from '../App'
import axios from 'axios'
import { toast } from 'react-toastify'

const StockManagement = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [updatingStock, setUpdatingStock] = useState({})
  const [stockReport, setStockReport] = useState(null)
  const [filterStatus, setFilterStatus] = useState('all') // all, low, out
  
  // Load products
  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${backendUrl}/api/product/list`)
      
      if (response.data.success) {
        setProducts(response.data.products)
      } else {
        toast.error('Failed to load products')
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      toast.error('Error loading products')
    } finally {
      setLoading(false)
    }
  }
  
  // Load stock report
  const fetchStockReport = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/product/stock/report`, {
        headers: { token: localStorage.getItem('token') }
      })
      
      if (response.data.success) {
        setStockReport(response.data.report)
      }
    } catch (error) {
      console.error('Error fetching stock report:', error)
    }
  }
  
  // Update individual product stock
  const updateProductStock = async (productId, newStock, operation = 'set') => {
    try {
      setUpdatingStock(prev => ({ ...prev, [productId]: true }))
      
      const response = await axios.post(`${backendUrl}/api/product/stock/update`, {
        productId,
        quantity: newStock,
        operation
      }, {
        headers: { token: localStorage.getItem('token') }
      })
      
      if (response.data.success) {
        toast.success(response.data.message)
        await fetchProducts() // Refresh products
        await fetchStockReport() // Refresh report
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.error('Error updating stock:', error)
      toast.error('Error updating stock')
    } finally {
      setUpdatingStock(prev => ({ ...prev, [productId]: false }))
    }
  }
  
  // Handle stock input change
  const handleStockChange = (productId, newValue) => {
    if (newValue < 0) return
    updateProductStock(productId, newValue, 'set')
  }
  
  // Quick stock operations
  const quickStockOperation = (productId, currentStock, operation) => {
    let newValue
    switch (operation) {
      case 'add10':
        newValue = currentStock + 10
        break
      case 'add50':
        newValue = currentStock + 50
        break
      case 'sub10':
        newValue = Math.max(0, currentStock - 10)
        break
      case 'zero':
        newValue = 0
        break
      default:
        return
    }
    updateProductStock(productId, newValue, 'set')
  }
  
  // Filter products based on stock status
  const filteredProducts = products.filter(product => {
    const stock = product.stock || 0
    switch (filterStatus) {
      case 'low':
        return stock > 0 && stock <= 10
      case 'out':
        return stock === 0
      case 'in':
        return stock > 10
      default:
        return true
    }
  })
  
  useEffect(() => {
    fetchProducts()
    fetchStockReport()
  }, [])
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading stock data...</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Stock Management</h1>
        <button
          onClick={() => { fetchProducts(); fetchStockReport(); }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Refresh Data
        </button>
      </div>
      
      {/* Stock Report Summary */}
      {stockReport && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow border">
            <h3 className="text-sm font-medium text-gray-500">Total Products</h3>
            <p className="text-2xl font-bold text-gray-900">{stockReport.overview.totalProducts}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg shadow border border-green-200">
            <h3 className="text-sm font-medium text-green-600">In Stock</h3>
            <p className="text-2xl font-bold text-green-700">{stockReport.overview.inStockProducts}</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg shadow border border-yellow-200">
            <h3 className="text-sm font-medium text-yellow-600">Low Stock</h3>
            <p className="text-2xl font-bold text-yellow-700">{stockReport.overview.lowStockProducts}</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg shadow border border-red-200">
            <h3 className="text-sm font-medium text-red-600">Out of Stock</h3>
            <p className="text-2xl font-bold text-red-700">{stockReport.overview.outOfStockProducts}</p>
          </div>
        </div>
      )}
      
      {/* Filters */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setFilterStatus('all')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            filterStatus === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          All Products ({products.length})
        </button>
        <button
          onClick={() => setFilterStatus('in')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            filterStatus === 'in' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          In Stock
        </button>
        <button
          onClick={() => setFilterStatus('low')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            filterStatus === 'low' ? 'bg-yellow-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Low Stock
        </button>
        <button
          onClick={() => setFilterStatus('out')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            filterStatus === 'out' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Out of Stock
        </button>
      </div>
      
      {/* Products Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quick Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product) => {
                const stock = product.stock || 0
                const stockStatus = stock > 10 ? 'In Stock' : stock > 0 ? 'Low Stock' : 'Out of Stock'
                const statusColor = stock > 10 ? 'text-green-600 bg-green-100' : 
                                   stock > 0 ? 'text-yellow-600 bg-yellow-100' : 
                                   'text-red-600 bg-red-100'
                
                return (
                  <tr key={product._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-16 w-16">
                          <img 
                            className="h-16 w-16 rounded-lg object-cover" 
                            src={product.image[0]} 
                            alt={product.name}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {product.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {currency}{product.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="number"
                        min="0"
                        value={stock}
                        onChange={(e) => handleStockChange(product._id, parseInt(e.target.value) || 0)}
                        disabled={updatingStock[product._id]}
                        className="w-20 px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColor}`}>
                        {stockStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex gap-1">
                        <button
                          onClick={() => quickStockOperation(product._id, stock, 'add10')}
                          disabled={updatingStock[product._id]}
                          className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs hover:bg-green-200 disabled:opacity-50"
                        >
                          +10
                        </button>
                        <button
                          onClick={() => quickStockOperation(product._id, stock, 'add50')}
                          disabled={updatingStock[product._id]}
                          className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200 disabled:opacity-50"
                        >
                          +50
                        </button>
                        {stock > 0 && (
                          <button
                            onClick={() => quickStockOperation(product._id, stock, 'sub10')}
                            disabled={updatingStock[product._id]}
                            className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs hover:bg-yellow-200 disabled:opacity-50"
                          >
                            -10
                          </button>
                        )}
                        <button
                          onClick={() => quickStockOperation(product._id, stock, 'zero')}
                          disabled={updatingStock[product._id]}
                          className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs hover:bg-red-200 disabled:opacity-50"
                        >
                          Zero
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          
          {filteredProducts.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No products found for the selected filter.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default StockManagement