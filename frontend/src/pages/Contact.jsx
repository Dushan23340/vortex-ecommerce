import React, { useState, useEffect, useContext } from 'react'
import Title from '../components/Title'
import { assets } from '../assets/frontend_assets/assets'
import NewsLetterbox from '../components/NewsLetterbox'
import { toast } from 'react-toastify'
import axios from 'axios'
import { ShopContext } from '../context/ShopContext'

const Contact = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [isVisible, setIsVisible] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState('contact')
  const { backendUrl } = useContext(ShopContext)

  useEffect(() => {
    // Simulate loading and trigger animations
    const timer = setTimeout(() => {
      setIsLoading(false)
      setIsVisible(true)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields')
      setIsSubmitting(false)
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address')
      setIsSubmitting(false)
      return
    }

    try {
      const response = await axios.post(`${backendUrl}/api/contact/submit`, {
        name: formData.name,
        email: formData.email,
        subject: formData.subject || 'General Inquiry',
        message: formData.message
      })
      
      if (response.data.success) {
        toast.success(response.data.message || 'Thank you for your message! We\'ll get back to you soon.')
        setFormData({ name: '', email: '', subject: '', message: '' })
      } else {
        toast.error(response.data.message || 'Failed to send message. Please try again.')
      }
    } catch (error) {
      console.error('Contact form error:', error)
      toast.error('Failed to send message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className='min-h-[60vh] flex items-center justify-center'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900'></div>
      </div>
    )
  }

  return (
    <div className={`transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {/* Hero Section */}
      <div className='relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 py-16 border-t'>
        <div className='absolute inset-0  bg-opacity-5'></div>
        <div className='relative text-center'>
          <div className='inline-block'>
            <Title text1={'CONTACT'} text2={'US'} />
          </div>
          <p className='mt-4 text-gray-600 max-w-2xl mx-auto px-4'>
            We're here to help! Reach out to us for any questions, concerns, or feedback.
          </p>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Tab Navigation */}
        <div className='flex justify-center mt-12 mb-8'>
          <div className='bg-gray-100 p-1 rounded-lg'>
            <button
              onClick={() => setActiveTab('contact')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                activeTab === 'contact'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Contact Info
            </button>
            <button
              onClick={() => setActiveTab('message')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                activeTab === 'message'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Send Message
            </button>
            <button
              onClick={() => setActiveTab('careers')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                activeTab === 'careers'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Careers
            </button>
          </div>
        </div>

        {/* Contact Info Tab */}
        {activeTab === 'contact' && (
          <div className='my-16 flex flex-col lg:flex-row gap-12 items-center'>
            <div className='lg:w-1/2'>
              <div className='relative group'>
                <img 
                  className='w-full h-auto rounded-lg shadow-lg transition-transform duration-500 group-hover:scale-105' 
                  src={assets.contact_img} 
                  alt="Contact Vortex Clothing" 
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
              </div>
            </div>
            
            <div className='lg:w-1/2 space-y-8'>
              {/* Store Location */}
              <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300'>
                <div className='flex items-start space-x-4'>
                  <div className='w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0'>
                    <svg className='w-6 h-6 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' />
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 11a3 3 0 11-6 0 3 3 0 016 0z' />
                    </svg>
                  </div>
                  <div>
                    <h3 className='text-xl font-semibold text-gray-900 mb-2'>Our Store</h3>
                    <p className='text-gray-600 leading-relaxed'>
                      54709 Kaduwela<br/>
                      Kothalawala<br/>
                      Sri Lanka
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact Details */}
              <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300'>
                <div className='flex items-start space-x-4'>
                  <div className='w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center flex-shrink-0'>
                    <svg className='w-6 h-6 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' />
                    </svg>
                  </div>
                  <div>
                    <h3 className='text-xl font-semibold text-gray-900 mb-2'>Contact Details</h3>
                    <div className='space-y-2'>
                      <p className='text-gray-600 flex items-center'>
                        <span className='w-16 text-sm font-medium'>Phone:</span>
                        <a href='tel:+94770684222' className='text-blue-600 hover:text-blue-800 transition-colors'>+94 770 684 222</a>
                      </p>
                      <p className='text-gray-600 flex items-center'>
                        <span className='w-16 text-sm font-medium'>Email:</span>
                        <a href='mailto:vortex@gmail.com' className='text-blue-600 hover:text-blue-800 transition-colors'>vortex@gmail.com</a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Business Hours */}
              <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300'>
                <div className='flex items-start space-x-4'>
                  <div className='w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0'>
                    <svg className='w-6 h-6 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' />
                    </svg>
                  </div>
                  <div>
                    <h3 className='text-xl font-semibold text-gray-900 mb-2'>Business Hours</h3>
                    <div className='space-y-1 text-sm'>
                      <div className='flex justify-between'>
                        <span className='text-gray-600'>Monday - Friday:</span>
                        <span className='text-gray-900 font-medium'>9:00 AM - 8:00 PM</span>
                      </div>
                      <div className='flex justify-between'>
                        <span className='text-gray-600'>Saturday:</span>
                        <span className='text-gray-900 font-medium'>10:00 AM - 6:00 PM</span>
                      </div>
                      <div className='flex justify-between'>
                        <span className='text-gray-600'>Sunday:</span>
                        <span className='text-gray-900 font-medium'>12:00 PM - 5:00 PM</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Send Message Tab */}
        {activeTab === 'message' && (
          <div className='my-16'>
            <div className='max-w-2xl mx-auto'>
              <div className='bg-white p-8 rounded-xl shadow-lg border border-gray-200'>
                <h2 className='text-2xl font-bold text-gray-900 mb-6 text-center'>Send us a Message</h2>
                
                <form onSubmit={handleSubmit} className='space-y-6'>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div>
                      <label htmlFor='name' className='block text-sm font-medium text-gray-700 mb-2'>
                        Full Name *
                      </label>
                      <input
                        type='text'
                        id='name'
                        name='name'
                        value={formData.name}
                        onChange={handleInputChange}
                        className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200'
                        placeholder='Enter your full name'
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor='email' className='block text-sm font-medium text-gray-700 mb-2'>
                        Email Address *
                      </label>
                      <input
                        type='email'
                        id='email'
                        name='email'
                        value={formData.email}
                        onChange={handleInputChange}
                        className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200'
                        placeholder='Enter your email'
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor='subject' className='block text-sm font-medium text-gray-700 mb-2'>
                      Subject
                    </label>
                    <input
                      type='text'
                      id='subject'
                      name='subject'
                      value={formData.subject}
                      onChange={handleInputChange}
                      className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200'
                      placeholder='Enter message subject'
                    />
                  </div>
                  
                  <div>
                    <label htmlFor='message' className='block text-sm font-medium text-gray-700 mb-2'>
                      Message *
                    </label>
                    <textarea
                      id='message'
                      name='message'
                      rows={6}
                      value={formData.message}
                      onChange={handleInputChange}
                      className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 resize-none'
                      placeholder='Enter your message here...'
                      required
                    ></textarea>
                  </div>
                  
                  <button
                    type='submit'
                    disabled={isSubmitting}
                    className='w-full bg-black text-white py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center'
                  >
                    {isSubmitting ? (
                      <>
                        <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2'></div>
                        Sending...
                      </>
                    ) : (
                      'Send Message'
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Careers Tab */}
        {activeTab === 'careers' && (
          <div className='my-16'>
            <div className='max-w-4xl mx-auto'>
              <div className='text-center mb-12'>
                <h2 className='text-3xl font-bold text-gray-900 mb-4'>Join Our Team</h2>
                <p className='text-gray-600 max-w-2xl mx-auto'>
                  Be part of a dynamic team that's passionate about fashion and customer satisfaction.
                </p>
              </div>
              
              <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mb-12'>
                {/* Career Benefits */}
                <div className='bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-xl'>
                  <h3 className='text-xl font-semibold text-gray-900 mb-6'>Why Work With Us?</h3>
                  <div className='space-y-4'>
                    <div className='flex items-center space-x-3'>
                      <div className='w-2 h-2 bg-blue-600 rounded-full'></div>
                      <span className='text-gray-700'>Competitive salary and benefits</span>
                    </div>
                    <div className='flex items-center space-x-3'>
                      <div className='w-2 h-2 bg-blue-600 rounded-full'></div>
                      <span className='text-gray-700'>Professional development opportunities</span>
                    </div>
                    <div className='flex items-center space-x-3'>
                      <div className='w-2 h-2 bg-blue-600 rounded-full'></div>
                      <span className='text-gray-700'>Flexible working arrangements</span>
                    </div>
                    <div className='flex items-center space-x-3'>
                      <div className='w-2 h-2 bg-blue-600 rounded-full'></div>
                      <span className='text-gray-700'>Employee discounts</span>
                    </div>
                    <div className='flex items-center space-x-3'>
                      <div className='w-2 h-2 bg-blue-600 rounded-full'></div>
                      <span className='text-gray-700'>Creative and collaborative environment</span>
                    </div>
                  </div>
                </div>
                
                {/* Open Positions */}
                <div className='bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-xl'>
                  <h3 className='text-xl font-semibold text-gray-900 mb-6'>Current Openings</h3>
                  <div className='space-y-4'>
                    <div className='bg-white p-4 rounded-lg shadow-sm'>
                      <h4 className='font-medium text-gray-900'>Fashion Designer</h4>
                      <p className='text-sm text-gray-600'>Full-time • Remote/On-site</p>
                    </div>
                    <div className='bg-white p-4 rounded-lg shadow-sm'>
                      <h4 className='font-medium text-gray-900'>Customer Service Rep</h4>
                      <p className='text-sm text-gray-600'>Full-time • On-site</p>
                    </div>
                    <div className='bg-white p-4 rounded-lg shadow-sm'>
                      <h4 className='font-medium text-gray-900'>Digital Marketing Specialist</h4>
                      <p className='text-sm text-gray-600'>Full-time • Remote</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className='text-center'>
                <p className='text-gray-600 mb-6'>
                  Interested in joining our team? Send us your resume and let's talk!
                </p>
                <button 
                  onClick={() => setActiveTab('message')}
                  className='bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-all duration-300 transform hover:scale-105'
                >
                  Apply Now
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Quick Contact Actions */}
        <div className='py-16 bg-gray-50 rounded-2xl my-16'>
          <div className='text-center mb-8'>
            <h2 className='text-2xl font-bold text-gray-900 mb-4'>Quick Actions</h2>
            <p className='text-gray-600'>Get in touch with us through your preferred method</p>
          </div>
          
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6 px-8'>
            <a 
              href='tel:+94770684222'
              className='group bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 text-center'
            >
              <div className='w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300'>
                <svg className='w-8 h-8 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' />
                </svg>
              </div>
              <h3 className='font-semibold text-gray-900 mb-2'>Call Us</h3>
              <p className='text-sm text-gray-600'>+94 770 684 222</p>
            </a>
            
            <a 
              href='mailto:vortex@gmail.com'
              className='group bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 text-center'
            >
              <div className='w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300'>
                <svg className='w-8 h-8 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' />
                </svg>
              </div>
              <h3 className='font-semibold text-gray-900 mb-2'>Email Us</h3>
              <p className='text-sm text-gray-600'>vortex@gmail.com</p>
            </a>
            
            <button 
              onClick={() => setActiveTab('message')}
              className='group bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 text-center'
            >
              <div className='w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300'>
                <svg className='w-8 h-8 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' />
                </svg>
              </div>
              <h3 className='font-semibold text-gray-900 mb-2'>Send Message</h3>
              <p className='text-sm text-gray-600'>Contact form</p>
            </button>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <NewsLetterbox/>
    </div>
  )
}

export default Contact