import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'

const Login = () => {
  const [currentState, setCurrentState] = useState('Sign up');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Add password visibility state
  
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Email validation function
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Password strength validation
  const isStrongPassword = (password) => {
    return password.length >= 8;
  };

  // Form validation
  const validateForm = () => {
    if (currentState === 'Sign up' && (!formData.name || formData.name.trim().length < 2)) {
      toast.error('Name must be at least 2 characters long');
      return false;
    }
    
    if (!isValidEmail(formData.email)) {
      toast.error('Please enter a valid email address');
      return false;
    }
    
    if (!isStrongPassword(formData.password)) {
      toast.error('Password must be at least 8 characters long');
      return false;
    }
    
    return true;
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      let result;
      
      if (currentState === 'Login') {
        result = await login(formData.email, formData.password);
        
        if (result.success) {
          // Redirect to home page after successful login
          navigate('/');
        } else if (result.needsVerification) {
          // Redirect to email verification page for login attempts
          navigate('/email-verification', { 
            state: { 
              email: result.email || formData.email,
              fromLogin: true // Flag to indicate this came from login attempt
            } 
          });
        }
      } else {
        result = await register(formData.name, formData.email, formData.password);
        
        if (result.success && result.needsVerification) {
          // Redirect to email verification page with email from registration
          navigate('/email-verification', { 
            state: { 
              email: result.email || formData.email,
              fromRegistration: true // Flag to indicate this came from registration
            } 
          });
        } else if (result.success) {
          // Redirect to home page after successful register without verification
          navigate('/');
        }
      }
    } catch (error) {
      console.error('Authentication error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleState = () => {
    setCurrentState(currentState === 'Login' ? 'Sign up' : 'Login');
    setFormData({ name: '', email: '', password: '' });
    setShowPassword(false); // Reset password visibility when switching forms
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800'>
      <div className='inline-flex items-center gap-2 mb-2 mt-10'>
        <p className='prata-regular text-3xl'>{currentState}</p>
        <hr className='border-none h-[1.5px] w-8 bg-gray-800' />
      </div>
      
      {currentState === 'Sign up' && (
        <input 
          type="text" 
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className='w-full px-3 py-2 border border-gray-800' 
          placeholder="Name" 
          required
        />
      )}
      
      <input 
        type="email" 
        name="email"
        value={formData.email}
        onChange={handleInputChange}
        className={`w-full px-3 py-2 border ${formData.email && !isValidEmail(formData.email) ? 'border-red-500' : 'border-gray-800'}`}
        placeholder="Email" 
        required
      />
      
      {/* Password input with show/hide toggle */}
      <div className="relative w-full">
        <input 
          type={showPassword ? "text" : "password"}
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          className={`w-full px-3 py-2 pr-10 border ${formData.password && !isStrongPassword(formData.password) ? 'border-red-500' : 'border-gray-800'}`}
          placeholder="Password" 
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
        <div className="w-full text-xs mt-[-8px]">
          <span className={isStrongPassword(formData.password) ? 'text-green-600' : 'text-red-500'}>
            {isStrongPassword(formData.password) ? 'Password meets requirements' : 'Password must be at least 8 characters'}
          </span>
        </div>
      )}

      <div className='w-full flex justify-between text-sm mt-[-8px]'>
        <Link 
          to='/forgot-password'
          className='cursor-pointer hover:text-gray-600'
        >
          Forgot Your Password?
        </Link>
        <p 
          onClick={toggleState}
          className='cursor-pointer hover:text-gray-600'
        >
          {currentState === 'Login' ? 'Create Account' : 'Login Here'}
        </p>
      </div>
      
      <button 
        type="submit"
        disabled={isLoading}
        className={`bg-black text-white font-light px-8 py-2 mt-4 ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800'}`}
      >
        {isLoading ? 'Processing...' : (currentState === 'Login' ? 'Sign In' : 'Sign Up')}
      </button>
    </form>
  )
}

export default Login