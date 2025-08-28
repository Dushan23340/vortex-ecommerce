import React, { useState } from 'react'
import { assets } from '../assets/admin_assets/assets'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'

const Add = () => {

  const [image1, setImage1] = useState(null)
  const [image2, setImage2] = useState(null)
  const [image3, setImage3] = useState(null)
  const [image4, setImage4] = useState(null)

  const [name,setName] = useState('');
  const [description,setDescription] = useState('');
  const [price,setPrice] = useState('');
  const [category,setCategory] = useState('Men');
  const [subCategory,setSubCategory] = useState('Topwear');
  const [sizes,setSizes] = useState([]);
  const [bestseller,setBestseller] = useState(false);
  const [stock,setStock] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async (e) => {
      e.preventDefault();

      // Show loading toast
      const loadingToast = toast.loading('Validating product information...', {
        position: "top-center",
        autoClose: false,
        closeButton: false,
        draggable: false
      });

      // Validate required fields
      if (!name.trim()) {
        toast.dismiss(loadingToast);
        toast.error('❌ Product name is required', {
          position: "top-center",
          autoClose: 3000
        });
        return;
      }
      if (!description.trim()) {
        toast.dismiss(loadingToast);
        toast.error('❌ Product description is required', {
          position: "top-center",
          autoClose: 3000
        });
        return;
      }
      if (!price || price <= 0) {
        toast.dismiss(loadingToast);
        toast.error('❌ Valid product price is required', {
          position: "top-center",
          autoClose: 3000
        });
        return;
      }
      if (sizes.length === 0) {
        toast.dismiss(loadingToast);
        toast.error('❌ Please select at least one size', {
          position: "top-center",
          autoClose: 3000
        });
        return;
      }
      if (!stock || stock < 0) {
        toast.dismiss(loadingToast);
        toast.error('❌ Valid stock quantity is required', {
          position: "top-center",
          autoClose: 3000
        });
        return;
      }

      try {
        setLoading(true);
        
        // Update loading toast
        toast.update(loadingToast, {
          render: '📤 Uploading product to server...',
          type: 'info',
          isLoading: true
        });
        
        const formData = new FormData()

        formData.append("name", name)
        formData.append("description", description)
        formData.append("price", price)
        formData.append("category", category)
        formData.append("subCategory", subCategory)
        formData.append("bestseller", bestseller)
        formData.append("sizes", JSON.stringify(sizes))
        formData.append("stock", stock)

        image1 && formData.append("image1", image1)
        image2 && formData.append("image2", image2)
        image3 && formData.append("image3", image3)
        image4 && formData.append("image4", image4)

        const response = await axios.post(backendUrl + "/api/product/add", formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'token': localStorage.getItem('token')
          }
        })

        console.log(response.data);
        
        if (response.data.success) {
          // Dismiss loading toast
          toast.dismiss(loadingToast);
          
          // Show success message
          toast.success('✅ Product added successfully!', {
            position: "top-center",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            icon: "🎉"
          });
          
          // Reset form after successful submission
          setName('');
          setDescription('');
          setPrice('');
          setCategory('Men');
          setSubCategory('Topwear');
          setSizes([]);
          setBestseller(false);
          setStock('');
          setImage1(null);
          setImage2(null);
          setImage3(null);
          setImage4(null);
          
          

        } else {
          toast.dismiss(loadingToast);
          toast.error('❌ Failed to add product: ' + response.data.message, {
            position: "top-center",
            autoClose: 4000
          });
        }

      } catch (error) {
        console.error('Error adding product:', error);
        
        // Dismiss loading toast
        toast.dismiss(loadingToast);
        
        // Show detailed error message
        const errorMessage = error.response?.data?.message || error.message || 'Unknown error occurred';
        
        toast.error(`❌ Error adding product: ${errorMessage}`, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true
        });
        
        // Show additional error info if available
        if (error.response?.status) {
          toast.warning(`⚠️ HTTP Status: ${error.response.status}`, {
            position: "top-right",
            autoClose: 3000
          });
        }
      } finally {
        setLoading(false);
      }

  }






  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col w-full items-start gap-3'>
      <div>
        <p className='mb-2'>Upload Image</p>

        <div className='flex gap-2'>
          <label htmlFor="image1">
            <img className='w-20' src={!image1 ? assets.upload_area : URL.createObjectURL(image1)} alt="" />
            <input 
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setImage1(file);
              
                }
              }} 
              type="file" 
              id="image1" 
              accept="image/*"
              hidden
            />
          </label>
           <label htmlFor="image2">
            <img className='w-20' src={!image2 ? assets.upload_area : URL.createObjectURL(image2)} alt="" />
            <input 
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setImage2(file);
                 
                }
              }} 
              type="file" 
              id="image2" 
              accept="image/*"
              hidden
            />
          </label>
           <label htmlFor="image3">
            <img className='w-20' src={!image3 ? assets.upload_area : URL.createObjectURL(image3)} alt="" />
            <input 
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setImage3(file);
                 
                }
              }} 
              type="file" 
              id="image3" 
              accept="image/*"
              hidden
            />
          </label>
           <label htmlFor="image4">
            <img className='w-20' src={!image4 ? assets.upload_area : URL.createObjectURL(image4)} alt="" />
            <input 
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setImage4(file);
                
                }
              }} 
              type="file" 
              id="image4" 
              accept="image/*"
              hidden
            />
          </label>
        </div>
      </div>

      <div className='w-full'>
        <p className='mb-2'>Product Name</p>
        <input onChange={(e)=>setName(e.target.value)} value={name} className='w-full max-w-[500px] px-3 py-2'type="text" placeholder='Type here' required />
      </div>
       <div className='w-full'>
        <p className='mb-2'>Product Description</p>
        <textarea onChange={(e)=>setDescription(e.target.value)} value={description} className='w-full max-w-[500px] px-3 py-2'type="text" placeholder='Write content here' required />
      </div>

      <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8'>
        <div>
          <p className='mb-2'>Product Category</p>
          <select onChange={(e)=>setCategory(e.target.value)} className='w-full px-3 py-2'>
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Kids">Kids</option>
          </select>
        </div>
         <div>
          <p className='mb-2'>Sub Category</p>
          <select onChange={(e)=>setSubCategory(e.target.value)} className='w-full px-3 py-2'>
            <option value="Topwear">Topwear</option>
            <option value="Bottomwear">Bottomwear</option>
            <option value="Winterwear">Winterwear</option>
          </select>
        </div>

        <div>
          <p className='mb-2'>Product Price</p>
          <input onChange={(e)=>setPrice(e.target.value)} value={price} className='w-full px-3 py-2 sm:w-[120px]'type="Number" placeholder='25' />
        </div>

        <div>
          <p className='mb-2'>Stock Quantity</p>
          <input 
            onChange={(e)=>setStock(e.target.value)} 
            value={stock} 
            className='w-full px-3 py-2 sm:w-[120px]'
            type="Number" 
            placeholder='100' 
            min="0"
          />
        </div>
      </div>

      <div>
        <p className='mb-2'>Product Sizes</p>
        {subCategory === 'Bottomwear' ? (
          // Bottom wear sizes in inches
          <div className='flex gap-2 flex-wrap'>
            {['28', '30', '32', '34', '36', '38', '40', '42', '44'].map(size => (
              <div 
                key={size}
                onClick={() => {
                  const newSizes = sizes.includes(size) ? sizes.filter(item => item !== size) : [...sizes, size];
                  setSizes(newSizes);
                }}
              >
                <p className={`${
                  sizes.includes(size) ? "bg-pink-100 border-pink-300" : "bg-slate-200 border-gray-300"
                } px-3 py-1 cursor-pointer border rounded-md text-sm font-medium hover:bg-pink-50 transition-colors`}>
                  {size}"
                </p>
              </div>
            ))}
          </div>
        ) : (
          // Top wear and winter wear sizes (S, M, L, XL, XXL)
          <div className='flex gap-3'>
            {['S', 'M', 'L', 'XL', 'XXL'].map(size => (
              <div 
                key={size}
                onClick={() => {
                  const newSizes = sizes.includes(size) ? sizes.filter(item => item !== size) : [...sizes, size];
                  setSizes(newSizes);
                }}
              >
                <p className={`${
                  sizes.includes(size) ? "bg-pink-100" : "bg-slate-200"
                } px-3 py-1 cursor-pointer rounded transition-colors hover:bg-pink-50`}>
                  {size}
                </p>
              </div>
            ))}
          </div>
        )}
        
        {/* Selected sizes display */}
        {sizes.length > 0 && (
          <div className='mt-3'>
            <p className='text-sm text-gray-600 mb-1'>Selected sizes:</p>
            <div className='flex flex-wrap gap-1'>
              {sizes.map(size => (
                <span 
                  key={size} 
                  className='inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full'
                >
                  {subCategory === 'Bottomwear' ? `${size}"` : size}
                  <button
                    type='button'
                    onClick={() => {
                      const newSizes = sizes.filter(item => item !== size);
                      setSizes(newSizes);
                    }}
                    className='ml-1 text-blue-600 hover:text-blue-800'
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}
        
        {/* Size guide info */}
        <div className='mt-2 text-xs text-gray-500'>
          {subCategory === 'Bottomwear' ? (
            <p>💡 Sizes are in inches (waist measurement). Common sizes: 28"-44"</p>
          ) : (
            <p>💡 Standard clothing sizes: S (Small) to XXL (Extra Extra Large)</p>
          )}
        </div>
      </div>

      <div className='flex gap-2 mt-2'>
        <input 
          onChange={() => {
            const newValue = !bestseller;
            setBestseller(newValue);
           
          }} 
          checked={bestseller} 
          type="checkbox" 
          id='bestseller' 
        />
        <label className='cursor-pointer' htmlFor="bestseller" >Add to bestseller</label>
      </div>

      <button 
        type="submit" 
        className='w-28 py-3 mt-4 bg-black text-white rounded hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed' 
        disabled={loading}
      >
        {loading ? 'Adding...' : 'ADD'}
      </button>
        
    </form>
  )
}

export default Add