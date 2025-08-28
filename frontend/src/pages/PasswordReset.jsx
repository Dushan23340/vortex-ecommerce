import React, { useState, useEffect } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'

const PasswordReset = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [formData, setFormData] = useState({
    email: location.state?.email || '',
    code: '',
    password: '',
    confirmPassword: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [canResend, setCanResend] = useState(true)
  const [resendTimer, setResendTimer] = useState(0)

  // Set axios base URL for this component
  useEffect(() => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';
    axios.defaults.baseURL = `${backendUrl}/api`;
  }, [])

  // Resend timer effect
  useEffect(() => {
    let interval = null;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(resendTimer - 1);
      }, 1000);
    } else {
      setCanResend(true);
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [resendTimer]);

  // Password strength validation
  const isStrongPassword = (password) => {
    return password.length >= 8;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const validateForm = () => {
    if (!formData.email) {
      toast.error('Email is required')
      return false
    }
    
    if (!formData.code) {
      toast.error('Reset code is required')
      return false
    }
    
    if (formData.code.length !== 6) {
      toast.error('Reset code must be 6 digits')
      return false
    }
    
    if (!isStrongPassword(formData.password)) {
      toast.error('Password must be at least 8 characters long')
      return false
    }
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return false
    }
    
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    
    try {
      const response = await axios.post('/user/reset-password', {
        code: formData.code,
        password: formData.password
      })
      
      if (response.data.success) {
        toast.success('Password reset successfully!')
        navigate('/login')
      } else {
        toast.error(response.data.message || 'Failed to reset password')
      }
    } catch (error) {
      console.error('Reset password error:', error)
      toast.error('Failed to reset password. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendCode = async () => {
    if (!canResend || !formData.email) {
      if (!formData.email) {
        toast.error('Please enter your email address')
      }
      return
    }

    setIsLoading(true)
    
    try {
      const response = await axios.post('/user/forgot-password', {
        email: formData.email
      })
      
      if (response.data.success) {
        toast.success('New reset code sent to your email!')
        setCanResend(false)
        setResendTimer(60) // 60 seconds cooldown
      } else {
        toast.error(response.data.message || 'Failed to resend code')
      }
    } catch (error) {
      console.error('Resend code error:', error)
      toast.error('Failed to resend code. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Toggle password visibility functions
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  return (
    <form onSubmit={handleSubmit} className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800'>
      <div className='inline-flex items-center gap-2 mb-2 mt-10'>
        <p className='prata-regular text-3xl'>Reset Password</p>
        <hr className='border-none h-[1.5px] w-8 bg-gray-800' />
      </div>
      
      <p className='text-center text-gray-600 mb-4'>
        Enter the reset code sent to your email and create a new password.
      </p>
      
      {/* Email input */}
      <input 
        type="email"
        name="email"
        value={formData.email}
        onChange={handleInputChange}
        className='w-full px-3 py-2 border border-gray-800'
        placeholder="Email Address" 
        required
      />
      
      {/* Reset code input */}
      <input 
        type="text"
        name="code"
        value={formData.code}
        onChange={handleInputChange}
        className='w-full px-3 py-2 border border-gray-800 text-center text-lg tracking-widest'
        placeholder="000000"
        maxLength="6"
        pattern="[0-9]{6}"
        required
      />
      
      {/* New Password input with show/hide toggle */}
      <div className="relative w-full">
        <input 
          type={showPassword ? "text" : "password"}
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          className={`w-full px-3 py-2 pr-10 border ${formData.password && !isStrongPassword(formData.password) ? 'border-red-500' : 'border-gray-800'}`}
          placeholder="New Password" 
          required
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
        >
          {showPassword ? (
            // Eye slash icon (hide password)
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 11-4.243-4.243m4.242 4.242L9.88 9.88" />
            </svg>
          ) : (
            // Eye icon (show password)
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.639 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.639 0-8.573-3.007-9.963-7.178z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          )}
        </button>
      </div>
      
      {/* Password strength indicator */}
      {formData.password && (
        <div className={`w-full text-sm ${isStrongPassword(formData.password) ? 'text-green-600' : 'text-red-500'}`}>
          {isStrongPassword(formData.password) ? '✓ Password is strong' : '✗ Password must be at least 8 characters'}
        </div>
      )}
      
      {/* Confirm Password input with show/hide toggle */}
      <div className="relative w-full">
        <input 
          type={showConfirmPassword ? "text" : "password"}
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          className={`w-full px-3 py-2 pr-10 border ${formData.confirmPassword && formData.password !== formData.confirmPassword ? 'border-red-500' : 'border-gray-800'}`}
          placeholder="Confirm New Password" 
          required
        />
        <button
          type="button"
          onClick={toggleConfirmPasswordVisibility}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
        >
          {showConfirmPassword ? (
            // Eye slash icon (hide password)
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 11-4.243-4.243m4.242 4.242L9.88 9.88" />
            </svg>
          ) : (
            // Eye icon (show password)
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.639 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.639 0-8.573-3.007-9.963-7.178z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          )}
        </button>
      </div>
      
      {/* Password match indicator */}
      {formData.confirmPassword && (
        <div className={`w-full text-sm ${formData.password === formData.confirmPassword ? 'text-green-600' : 'text-red-500'}`}>
          {formData.password === formData.confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
        </div>
      )}
      
      {/* Submit button */}
      <button 
        type="submit"
        disabled={isLoading}
        className='bg-black text-white font-light px-8 py-2 mt-4 hover:bg-gray-800 disabled:opacity-50'
      >
        {isLoading ? 'Resetting...' : 'Reset Password'}
      </button>
      
      {/* Resend code section */}
      <div className='text-center mt-4'>
        <p className='text-sm text-gray-600 mb-2'>
          Didn't receive the code?
        </p>
        <button
          type="button"
          onClick={handleResendCode}
          disabled={!canResend || isLoading}
          className={`text-sm font-medium ${
            canResend && !isLoading
              ? 'text-black hover:underline'
              : 'text-gray-400 cursor-not-allowed'
          }`}
        >
          {!canResend ? `Resend in ${resendTimer}s` : 'Resend Code'}
        </button>
      </div>

      {/* Back to login link */}
      <div className='flex gap-4 mt-6'>
        <Link 
          to='/login'
          className='text-gray-600 hover:text-black text-sm'
        >
          Back to Login
        </Link>
      </div>
    </form>
  )
}

export default PasswordReset