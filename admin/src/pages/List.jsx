import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const List = () => {

  const [list,setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [removingId, setRemovingId] = useState(null);
  const navigate = useNavigate();

  const fetchList = async () => {
    try {
      setLoading(true);
      console.log('=== FETCH LIST START ===');
      console.log('Backend URL:', backendUrl);
      console.log('Full API URL:', backendUrl + '/api/product/list');
      console.log('Fetching products...');
      
      const response = await axios.get(backendUrl + '/api/product/list')
      console.log('Full response:', response);
      console.log('Response data:', response.data);
      console.log('Response success:', response.data.success);
      console.log('Products array:', response.data.products);
      console.log('Products length:', response.data.products?.length);
      
      if (response.data.success) {
        setList(response.data.products);
        console.log('Products set to state:', response.data.products);
      } else {
        console.log('API returned success: false');
        toast.error(response.data.message)
      }

    } catch (error) {
      console.log('=== ERROR FETCHING PRODUCTS ===');
      console.log('Error:', error);
      console.log('Error message:', error.message);
      console.log('Error response:', error.response);
      toast.error(error.message)
      
    } finally {
      setLoading(false);
      console.log('Loading set to false');
      console.log('=== FETCH LIST END ===');
    }

  }

  const removeProduct = async (id) => {
    try {
      // Add confirmation dialog
      const isConfirmed = window.confirm('Are you sure you want to delete this product? This action cannot be undone.');
      
      if (!isConfirmed) {
        console.log('Product deletion cancelled by user');
        return;
      }

      setRemovingId(id); // Set loading state for this specific product
      console.log('=== REMOVING PRODUCT ===');
      console.log('Product ID to remove:', id);
      
      const response = await axios.post(backendUrl + '/api/product/remove', {id}, {
        headers: {
          'token': localStorage.getItem('token')
        }
      });

      console.log('Remove response:', response.data);

      if (response.data.success) {
        toast.success(response.data.message);
        // Refresh the product list after successful removal
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
      
    } catch (error) {
      console.log('=== ERROR REMOVING PRODUCT ===');
      console.log('Error:', error);
      console.log('Error message:', error.message);
      toast.error('Error removing product: ' + error.message);
    } finally {
      setRemovingId(null); // Clear loading state
    }
  }

  useEffect(()=>{
    console.log('=== LIST COMPONENT MOUNTED ===');
    console.log('Initial list state:', list);
    console.log('Initial loading state:', loading);
    fetchList()
  }, [])

  useEffect(() => {
    console.log('=== LIST STATE CHANGED ===');
    console.log('New list state:', list);
    console.log('New list length:', list.length);
  }, [list])


  return (
    <>
    <div className='flex justify-between items-center mb-4'>
      <p className='text-xl font-semibold'>All Products List</p>
      <button 
        onClick={fetchList} 
        className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors'
        disabled={loading}
      >
        {loading ? 'Loading...' : 'Refresh'}
      </button>
    </div>
    

    {!loading && list.length > 0 && (
      <p className='text-sm text-gray-600 mb-3'>Total Products: {list.length}</p>
    )}
    
    {loading ? (
      <div className='text-center py-8'>
        <p>Loading products...</p>
      </div>
    ) : list.length === 0 ? (
      <div className='text-center py-8'>
        <p>No products found. Add some products first!</p>
      </div>
    ) : (
      <div className='flex flex-col gap-2'>
        {/* List Table Title */}
        <div className='hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm'>
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b className='text-center'>Stock</b>
          <b className='text-center'>Edit</b>
          <b className='text-center'>Delete</b>
        </div>

        {/* Product List */}
        {list.map((item, index) => {
          const stockStatus = item.stock > 10 ? 'In Stock' : item.stock > 0 ? 'Low Stock' : 'Out of Stock';
          const stockColor = item.stock > 10 ? 'text-green-600' : item.stock > 0 ? 'text-yellow-600' : 'text-red-600';
          
          return (
            <div className='grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 border text-sm' key={index} >
              <img className='w-12 h-12 object-cover rounded' src={item.image[0]} alt={item.name}/>
              <p className='font-medium'>{item.name}</p>
              <p className='capitalize'>{item.category}</p>
              <p>{currency}{item.price}</p>
              <div className='text-center'>
                <p className={`font-semibold ${stockColor}`}>{item.stock || 0}</p>
                <p className={`text-xs ${stockColor}`}>{stockStatus}</p>
              </div>
              <div 
                onClick={() => navigate(`/edit/${item._id}`)} 
                className='text-center cursor-pointer text-lg px-2 py-1 rounded transition-all duration-200 flex items-center justify-center hover:text-blue-500 hover:bg-blue-50'
                title="Edit product"
              >
                <span className='text-blue-600 hover:text-blue-800'>✏️</span>
              </div>
              <div 
                onClick={() => !removingId && removeProduct(item._id)} 
                className={`text-center cursor-pointer text-lg px-2 py-1 rounded transition-all duration-200 flex items-center justify-center ${
                  removingId === item._id 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'hover:text-red-500 hover:bg-red-50 cursor-pointer'
                }`}
                title={removingId === item._id ? "Removing..." : "Click to delete product"}
              >
                {removingId === item._id ? (
                  <span className='text-gray-400'>...</span>
                ) : (
                  <span className='text-red-600 hover:text-red-800 font-bold'>×</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    )}
        
    </>
  )
}

export default List