import React, { useState } from 'react'
import { assets } from '../assets/frontend_assets/assets'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'

const Footer = () => {
  const [email, setEmail] = useState('')
  const [isSubscribing, setIsSubscribing] = useState(false)

  const handleNewsletterSignup = async (e) => {
    e.preventDefault()
    if (!email) {
      toast.error('Please enter your email address')
      return
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address')
      return
    }

    setIsSubscribing(true)
    // Simulate API call
    setTimeout(() => {
      toast.success('Thank you for subscribing to our newsletter!')
      setEmail('')
      setIsSubscribing(false)
    }, 1000)
  }

  return (
    <footer className='bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white mt-20'>
      {/* Main Footer Content */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12'>
          {/* Brand Section */}
          <div className='lg:col-span-1'>
            <div className='mb-6'>
              <img src={assets.logo} className='h-12 w-auto mb-4 filter brightness-0 invert' alt="Vortex Logo" />
              <h3 className='text-xl font-bold text-white mb-3'>VORTEX CLOTHING</h3>
              <p className='text-gray-300 text-sm leading-relaxed mb-4'>
                Discover premium fashion that defines your style. From casual wear to elegant pieces, 
                we bring you quality clothing that speaks to your personality.
              </p>
            </div>
            
            {/* Social Media Links */}
            <div className='flex space-x-4'>
              <a 
                href='#' 
                className='w-10 h-10 bg-gray-700 hover:bg-blue-600 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110'
                aria-label='Facebook'
              >
                <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
                  <path d='M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z'/>
                </svg>
              </a>
              <a 
                href='#' 
                className='w-10 h-10 bg-gray-700 hover:bg-pink-600 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110'
                aria-label='Instagram'
              >
                <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
                  <path d='M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.418-3.323c.927-.875 2.026-1.315 3.323-1.315s2.396.44 3.323 1.315c.928.875 1.418 2.026 1.418 3.323s-.49 2.448-1.418 3.244c-.927.858-2.026 1.297-3.323 1.297zm7.83-9.184c-.245 0-.49-.098-.653-.293-.164-.196-.245-.441-.245-.686 0-.245.081-.49.245-.686.163-.195.408-.293.653-.293.245 0 .49.098.653.293.164.196.245.441.245.686 0 .245-.081.49-.245.686-.163.195-.408.293-.653.293zm-4.262 7.135c-1.526 0-2.764-1.238-2.764-2.764s1.238-2.764 2.764-2.764 2.764 1.238 2.764 2.764-1.238 2.764-2.764 2.764z'/>
                </svg>
              </a>
              <a 
                href='#' 
                className='w-10 h-10 bg-gray-700 hover:bg-blue-400 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110'
                aria-label='Twitter'
              >
                <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
                  <path d='M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z'/>
                </svg>
              </a>
              <a 
                href='#' 
                className='w-10 h-10 bg-gray-700 hover:bg-red-600 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110'
                aria-label='YouTube'
              >
                <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
                  <path d='M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z'/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className='text-lg font-semibold text-white mb-6'>Quick Links</h4>
            <ul className='space-y-3'>
              <li>
                <Link to='/' className='text-gray-300 hover:text-white transition-colors duration-200 flex items-center group'>
                  <span className='group-hover:translate-x-1 transition-transform duration-200'>Home</span>
                </Link>
              </li>
              <li>
                <Link to='/collection' className='text-gray-300 hover:text-white transition-colors duration-200 flex items-center group'>
                  <span className='group-hover:translate-x-1 transition-transform duration-200'>Collection</span>
                </Link>
              </li>
              <li>
                <Link to='/about' className='text-gray-300 hover:text-white transition-colors duration-200 flex items-center group'>
                  <span className='group-hover:translate-x-1 transition-transform duration-200'>About Us</span>
                </Link>
              </li>
              <li>
                <Link to='/contact' className='text-gray-300 hover:text-white transition-colors duration-200 flex items-center group'>
                  <span className='group-hover:translate-x-1 transition-transform duration-200'>Contact</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className='text-lg font-semibold text-white mb-6'>Customer Service</h4>
            <ul className='space-y-3'>
              <li>
                <a href='#' className='text-gray-300 hover:text-white transition-colors duration-200 flex items-center group'>
                  <span className='group-hover:translate-x-1 transition-transform duration-200'>Size Guide</span>
                </a>
              </li>
              <li>
                <a href='#' className='text-gray-300 hover:text-white transition-colors duration-200 flex items-center group'>
                  <span className='group-hover:translate-x-1 transition-transform duration-200'>Shipping Info</span>
                </a>
              </li>
              <li>
                <a href='#' className='text-gray-300 hover:text-white transition-colors duration-200 flex items-center group'>
                  <span className='group-hover:translate-x-1 transition-transform duration-200'>Returns & Exchanges</span>
                </a>
              </li>
              <li>
                <a href='#' className='text-gray-300 hover:text-white transition-colors duration-200 flex items-center group'>
                  <span className='group-hover:translate-x-1 transition-transform duration-200'>Privacy Policy</span>
                </a>
              </li>
              <li>
                <a href='#' className='text-gray-300 hover:text-white transition-colors duration-200 flex items-center group'>
                  <span className='group-hover:translate-x-1 transition-transform duration-200'>Terms of Service</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h4 className='text-lg font-semibold text-white mb-6'>Stay Connected</h4>
            
            {/* Contact Info */}
            <div className='mb-6'>
              <div className='flex items-center mb-3'>
                <svg className='w-5 h-5 text-gray-400 mr-3' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' />
                </svg>
                <a href='tel:+94770684222' className='text-gray-300 hover:text-white transition-colors'>+94 770 684 222</a>
              </div>
              <div className='flex items-center mb-4'>
                <svg className='w-5 h-5 text-gray-400 mr-3' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' />
                </svg>
                <a href='mailto:vortex@gmail.com' className='text-gray-300 hover:text-white transition-colors'>vortex@gmail.com</a>
              </div>
            </div>

            {/* Newsletter Signup */}
            <div>
              <h5 className='text-md font-medium text-white mb-3'>Newsletter</h5>
              <p className='text-gray-300 text-sm mb-4'>Get updates on new arrivals and exclusive offers</p>
              <form onSubmit={handleNewsletterSignup} className='flex flex-col space-y-3'>
                <div className='flex'>
                  <input
                    type='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder='Enter your email'
                    className='flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-l-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent'
                  />
                  <button
                    type='submit'
                    disabled={isSubscribing}
                    className='px-4 py-2 bg-white text-gray-900 rounded-r-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
                  >
                    {isSubscribing ? (
                      <svg className='animate-spin h-4 w-4' fill='none' viewBox='0 0 24 24'>
                        <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                        <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                      </svg>
                    ) : (
                      <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 19l9 2-9-18-9 18 9-2zm0 0v-8' />
                      </svg>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className='border-t border-gray-700'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
          <div className='flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0'>
            <div className='flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6'>
              <p className='text-gray-400 text-sm'>© 2025 Vortex Clothing. All rights reserved.</p>
              <div className='flex space-x-4 text-sm'>
                <a href='#' className='text-gray-400 hover:text-white transition-colors'>Privacy Policy</a>
                <span className='text-gray-600'>•</span>
                <a href='#' className='text-gray-400 hover:text-white transition-colors'>Terms of Service</a>
                <span className='text-gray-600'>•</span>
                <a href='#' className='text-gray-400 hover:text-white transition-colors'>Cookies</a>
              </div>
            </div>
            
            {/* Payment Methods */}
            <div className='flex items-center space-x-3'>
              <span className='text-gray-400 text-sm mr-3'>We Accept:</span>
              <div className='flex space-x-2'>
                <div className='w-8 h-5 bg-gray-700 rounded flex items-center justify-center'>
                  <span className='text-xs text-white font-bold'>VISA</span>
                </div>
                <div className='w-8 h-5 bg-gray-700 rounded flex items-center justify-center'>
                  <span className='text-xs text-white font-bold'>MC</span>
                </div>
                <div className='w-8 h-5 bg-gray-700 rounded flex items-center justify-center'>
                  <span className='text-xs text-white font-bold'>PP</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer