import React, { useState, useEffect } from 'react'
import Title from '../components/Title'
import { assets } from '../assets/frontend_assets/assets'
import NewsLetterbox from '../components/NewsLetterbox'

const About = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Simulate loading and trigger animations
    const timer = setTimeout(() => {
      setIsLoading(false)
      setIsVisible(true)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

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
        <div className='absolute inset-0 bg-opacity-5'></div>
        <div className='relative text-center'>
          <div className='inline-block'>
            <Title text1={'ABOUT'} text2={'US'} />
          </div>
          <p className='mt-4 text-gray-600 max-w-2xl mx-auto px-4'>
            Discover the story behind Vortex Clothing - where fashion meets quality and style meets comfort.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* About Content */}
        <div className='my-16 flex flex-col lg:flex-row gap-12 items-center'>
          <div className='lg:w-1/2'>
            <div className='relative group'>
              <img 
                className='w-full h-auto rounded-lg shadow-lg transition-transform duration-500 group-hover:scale-105' 
                src={assets.about_img} 
                alt="About Vortex Clothing" 
              />
              <div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
            </div>
          </div>
          
          <div className='lg:w-1/2 space-y-6'>
            <div className='transform transition-all duration-700 delay-300'>
              <h2 className='text-3xl font-bold text-gray-900 mb-4'>Our Story</h2>
              <p className='text-gray-600 leading-relaxed mb-4'>
                Founded with a passion for exceptional fashion, Vortex Clothing has been at the forefront of contemporary style since our inception. We believe that clothing is more than just fabric – it's a form of self-expression that empowers individuals to showcase their unique personality.
              </p>
              <p className='text-gray-600 leading-relaxed mb-6'>
                From our carefully curated collections to our commitment to sustainable practices, every aspect of our brand reflects our dedication to quality, innovation, and customer satisfaction. We work tirelessly to bring you the latest trends while maintaining the timeless elegance that defines our brand.
              </p>
            </div>
            
            <div className='bg-gray-50 p-6 rounded-lg border-l-4 border-black'>
              <h3 className='text-xl font-semibold text-gray-900 mb-3 flex items-center'>
                <span className='w-2 h-2 bg-black rounded-full mr-3'></span>
                Our Mission
              </h3>
              <p className='text-gray-600 leading-relaxed'>
                To democratize fashion by making high-quality, stylish clothing accessible to everyone, while fostering a community of confident individuals who express themselves through their unique style choices.
              </p>
            </div>
          </div>
        </div>

        {/* Statistics Section */}
        <div className='py-16 bg-gradient-to-r from-gray-900 to-black rounded-2xl text-white my-16'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl font-bold mb-4'>Our Impact</h2>
            <p className='text-gray-300 max-w-2xl mx-auto'>Numbers that reflect our commitment to excellence and customer satisfaction</p>
          </div>
          
          <div className='grid grid-cols-2 lg:grid-cols-4 gap-8 text-center'>
            <div className='transform hover:scale-105 transition-transform duration-300'>
              <div className='text-4xl font-bold mb-2'>10k+</div>
              <div className='text-gray-300'>Happy Customers</div>
            </div>
            <div className='transform hover:scale-105 transition-transform duration-300'>
              <div className='text-4xl font-bold mb-2'>500+</div>
              <div className='text-gray-300'>Premium Products</div>
            </div>
            <div className='transform hover:scale-105 transition-transform duration-300'>
              <div className='text-4xl font-bold mb-2'>98%</div>
              <div className='text-gray-300'>Satisfaction Rate</div>
            </div>
            <div className='transform hover:scale-105 transition-transform duration-300'>
              <div className='text-4xl font-bold mb-2'>24/7</div>
              <div className='text-gray-300'>Customer Support</div>
            </div>
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className='py-16'>
          <div className='text-center mb-12'>
            <Title text1={'WHY'} text2={'CHOOSE US'} />
            <p className='mt-4 text-gray-600 max-w-3xl mx-auto'>
              We're committed to delivering exceptional value through our core principles
            </p>
          </div>
          
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            <div className='group bg-white border border-gray-200 p-8 rounded-xl shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2'>
              <div className='mb-6'>
                <div className='w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300'>
                  <svg className='w-8 h-8 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
                  </svg>
                </div>
                <h3 className='text-xl font-semibold text-gray-900 mb-3'>Quality Assurance</h3>
              </div>
              <p className='text-gray-600 leading-relaxed'>
                Every piece undergoes rigorous quality control processes. We source premium materials and employ skilled craftspeople to ensure each product meets our exacting standards for durability and comfort.
              </p>
            </div>
            
            <div className='group bg-white border border-gray-200 p-8 rounded-xl shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2'>
              <div className='mb-6'>
                <div className='w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300'>
                  <svg className='w-8 h-8 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 10V3L4 14h7v7l9-11h-7z' />
                  </svg>
                </div>
                <h3 className='text-xl font-semibold text-gray-900 mb-3'>Convenience</h3>
              </div>
              <p className='text-gray-600 leading-relaxed'>
                Shop from the comfort of your home with our intuitive online platform. Enjoy fast shipping, easy returns, and multiple payment options designed to make your shopping experience seamless and enjoyable.
              </p>
            </div>
            
            <div className='group bg-white border border-gray-200 p-8 rounded-xl shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2'>
              <div className='mb-6'>
                <div className='w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300'>
                  <svg className='w-8 h-8 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z' />
                  </svg>
                </div>
                <h3 className='text-xl font-semibold text-gray-900 mb-3'>Exceptional Customer Service</h3>
              </div>
              <p className='text-gray-600 leading-relaxed'>
                Our dedicated customer service team is available 24/7 to assist you. From pre-purchase consultations to post-sale support, we're committed to ensuring your complete satisfaction at every step.
              </p>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className='py-16 bg-gray-50 rounded-2xl my-16'>
          <div className='text-center mb-12 px-8'>
            <h2 className='text-3xl font-bold text-gray-900 mb-4'>Our Values</h2>
            <p className='text-gray-600 max-w-3xl mx-auto'>
              The principles that guide everything we do
            </p>
          </div>
          
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-8'>
            <div className='text-center group'>
              <div className='w-20 h-20 bg-white rounded-full shadow-lg flex items-center justify-center mx-auto mb-4 group-hover:shadow-xl transition-shadow duration-300'>
                <span className='text-2xl'>🌱</span>
              </div>
              <h4 className='font-semibold text-gray-900 mb-2'>Sustainability</h4>
              <p className='text-sm text-gray-600'>Committed to eco-friendly practices</p>
            </div>
            
            <div className='text-center group'>
              <div className='w-20 h-20 bg-white rounded-full shadow-lg flex items-center justify-center mx-auto mb-4 group-hover:shadow-xl transition-shadow duration-300'>
                <span className='text-2xl'>✨</span>
              </div>
              <h4 className='font-semibold text-gray-900 mb-2'>Innovation</h4>
              <p className='text-sm text-gray-600'>Always pushing fashion boundaries</p>
            </div>
            
            <div className='text-center group'>
              <div className='w-20 h-20 bg-white rounded-full shadow-lg flex items-center justify-center mx-auto mb-4 group-hover:shadow-xl transition-shadow duration-300'>
                <span className='text-2xl'>🤝</span>
              </div>
              <h4 className='font-semibold text-gray-900 mb-2'>Community</h4>
              <p className='text-sm text-gray-600'>Building connections through fashion</p>
            </div>
            
            <div className='text-center group'>
              <div className='w-20 h-20 bg-white rounded-full shadow-lg flex items-center justify-center mx-auto mb-4 group-hover:shadow-xl transition-shadow duration-300'>
                <span className='text-2xl'>💎</span>
              </div>
              <h4 className='font-semibold text-gray-900 mb-2'>Excellence</h4>
              <p className='text-sm text-gray-600'>Uncompromising quality standards</p>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <NewsLetterbox/>
    </div>
  )
}

export default About