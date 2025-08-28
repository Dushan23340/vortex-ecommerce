import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  // Set axios base URL for this component
  useEffect(() => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';
    axios.defaults.baseURL = `${backendUrl}/api`;
  }, [])

  // Email validation function
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!email.trim()) {
      toast.error('Email is required')
      return
    }
    
    if (!isValidEmail(email)) {
      toast.error('Please enter a valid email address')
      return
    }

    setIsLoading(true)
    
    try {
      const response = await axios.post('/user/forgot-password', { email })
      
      if (response.data.success) {
        toast.success('Password reset code sent to your email')
        // Navigate to password reset page with email
        navigate('/password-reset', { state: { email } })
      } else {
        toast.error(response.data.message || 'Failed to send reset email')
      }
    } catch (error) {
      console.error('Forgot password error:', error)
      toast.error('Failed to send reset email. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800'>
      <div className='inline-flex items-center gap-2 mb-2 mt-10'>
        <p className='prata-regular text-3xl'>Forgot Password</p>
        <hr className='border-none h-[1.5px] w-8 bg-gray-800' />
      </div>
      
      <p className='text-center text-gray-600 mb-4'>
        Enter your email address and we'll send you a reset code.
      </p>
      
      <input 
        type="email" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={`w-full px-3 py-2 border ${email && !isValidEmail(email) ? 'border-red-500' : 'border-gray-800'}`}
        placeholder="Enter your email address" 
        required
      />
      
      <button 
        type="submit"
        disabled={isLoading}
        className={`w-full bg-black text-white font-light px-8 py-2 mt-4 ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800'}`}
      >
        {isLoading ? 'Sending...' : 'Send Reset Code'}
      </button>
      
      <div className='w-full flex justify-center text-sm mt-4'>
        <Link 
          to='/login'
          className='cursor-pointer hover:text-gray-600'
        >
          Back to Login
        </Link>
      </div>
    </form>
  )
}

export default ForgotPassword