import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import Title from '../components/Title'
import axios from 'axios'
import { toast } from 'react-toastify'

const Profile = () => {
  const { user, token, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    }
  })
  
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    
    // Load profile data from API
    loadProfileData()
  }, [isAuthenticated, navigate])

  const loadProfileData = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/user/profile')
      
      if (response.data.success) {
        const userData = response.data.user
        setProfileData({
          name: userData.name || '',
          email: userData.email || '',
          phone: userData.phone || '',
          address: {
            street: userData.address?.street || '',
            city: userData.address?.city || '',
            state: userData.address?.state || '',
            zipCode: userData.address?.zipCode || '',
            country: userData.address?.country || ''
          }
        })
      } else {
        toast.error('Failed to load profile data')
      }
    } catch (error) {
      console.error('Load profile error:', error)
      toast.error('Failed to load profile data')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1]
      setProfileData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }))
    } else {
      setProfileData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleSave = async () => {
    try {
      setLoading(true)
      
      const response = await axios.put('/user/profile', {
        name: profileData.name,
        phone: profileData.phone,
        address: profileData.address
      })
      
      if (response.data.success) {
        toast.success('Profile updated successfully!')
        setIsEditing(false)
        // Update the user context with new data if needed
      } else {
        toast.error(response.data.message || 'Failed to update profile')
      }
      
    } catch (error) {
      console.error('Profile update error:', error)
      toast.error('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    // Reload profile data from API to reset any changes
    loadProfileData()
  }

  if (!isAuthenticated) {
    return null
  }

  if (loading && !isEditing) {
    return (
      <div className='border-t pt-16'>
        <div className='text-2xl mb-8'>
          <Title text1={'MY'} text2={'PROFILE'} />
        </div>
        <div className='flex items-center justify-center h-64'>
          <div className='text-center'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto'></div>
            <p className='mt-4 text-gray-600'>Loading profile...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='border-t pt-16'>
      <div className='text-2xl mb-8'>
        <Title text1={'MY'} text2={'PROFILE'} />
      </div>

      <div className='max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-sm border'>
        {/* Profile Header */}
        <div className='flex items-center justify-between mb-6'>
          <div className='flex items-center gap-4'>
            <div className='w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center'>
              <span className='text-2xl text-gray-600'>
                {profileData.name ? profileData.name.charAt(0).toUpperCase() : '👤'}
              </span>
            </div>
            <div>
              <h2 className='text-xl font-semibold text-gray-900'>
                {profileData.name || 'User'}
              </h2>
              <p className='text-gray-600'>{profileData.email}</p>
            </div>
          </div>
          
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className='bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors'
            >
              Edit Profile
            </button>
          )}
        </div>

        {/* Profile Form */}
        <div className='space-y-6'>
          {/* Personal Information */}
          <div>
            <h3 className='text-lg font-medium text-gray-900 mb-4'>Personal Information</h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Full Name
                </label>
                <input
                  type='text'
                  name='name'
                  value={profileData.name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent ${
                    !isEditing ? 'bg-gray-50' : ''
                  }`}
                  placeholder='Enter your full name'
                />
              </div>
              
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Email Address
                </label>
                <input
                  type='email'
                  name='email'
                  value={profileData.email}
                  onChange={handleInputChange}
                  disabled={true} // Email should typically not be editable
                  className='w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50'
                  placeholder='Enter your email'
                />
              </div>
              
              <div className='md:col-span-2'>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Phone Number
                </label>
                <input
                  type='tel'
                  name='phone'
                  value={profileData.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent ${
                    !isEditing ? 'bg-gray-50' : ''
                  }`}
                  placeholder='Enter your phone number'
                />
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div>
            <h3 className='text-lg font-medium text-gray-900 mb-4'>Address Information</h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='md:col-span-2'>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Street Address
                </label>
                <input
                  type='text'
                  name='address.street'
                  value={profileData.address.street}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent ${
                    !isEditing ? 'bg-gray-50' : ''
                  }`}
                  placeholder='Enter your street address'
                />
              </div>
              
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  City
                </label>
                <input
                  type='text'
                  name='address.city'
                  value={profileData.address.city}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent ${
                    !isEditing ? 'bg-gray-50' : ''
                  }`}
                  placeholder='Enter your city'
                />
              </div>
              
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  State/Province
                </label>
                <input
                  type='text'
                  name='address.state'
                  value={profileData.address.state}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent ${
                    !isEditing ? 'bg-gray-50' : ''
                  }`}
                  placeholder='Enter your state/province'
                />
              </div>
              
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  ZIP/Postal Code
                </label>
                <input
                  type='text'
                  name='address.zipCode'
                  value={profileData.address.zipCode}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent ${
                    !isEditing ? 'bg-gray-50' : ''
                  }`}
                  placeholder='Enter your ZIP/postal code'
                />
              </div>
              
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Country
                </label>
                <input
                  type='text'
                  name='address.country'
                  value={profileData.address.country}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent ${
                    !isEditing ? 'bg-gray-50' : ''
                  }`}
                  placeholder='Enter your country'
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {isEditing && (
            <div className='flex justify-end gap-4 pt-6 border-t'>
              <button
                onClick={handleCancel}
                disabled={loading}
                className='px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors'
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className='px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors disabled:opacity-50'
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className='mt-8 pt-6 border-t'>
          <h3 className='text-lg font-medium text-gray-900 mb-4'>Quick Actions</h3>
          <div className='flex flex-wrap gap-4'>
            <button
              onClick={() => navigate('/orders')}
              className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors'
            >
              View Orders
            </button>
            <button
              onClick={() => navigate('/cart')}
              className='px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors'
            >
              View Cart
            </button>
            <button
              onClick={logout}
              className='px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors'
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile