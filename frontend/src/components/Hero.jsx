import React, { useState, useEffect } from 'react'
import { assets } from '../assets/frontend_assets/assets'

const Hero = () => {
  // Array of  beautiful and colorful hero images for fashion brand
  const heroImages = [
    'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&h=600&fit=crop&auto=format', // Vibrant clothing collection
    'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=800&h=600&fit=crop&auto=format', // Stylish fashion model
    'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&h=600&fit=crop&auto=format&q=90', // Premium clothing rack display
    'https://images.unsplash.com/photo-1511401139252-f158d3209c17?w=800&h=600&fit=crop&auto=format&q=90', // Elegant fashion model portrait
    'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=800&h=600&fit=crop&auto=format&q=90', // Beautiful clothing collection
    
  ]

  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Auto-change images every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentImageIndex((prevIndex) => 
          prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
        )
        setIsTransitioning(false)
      }, 300) // Half of transition duration
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  // Manual navigation functions
  const goToNext = () => {
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
      )
      setIsTransitioning(false)
    }, 300)
  }

  const goToPrevious = () => {
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === 0 ? heroImages.length - 1 : prevIndex - 1
      )
      setIsTransitioning(false)
    }, 300)
  }

  const goToSlide = (index) => {
    if (index !== currentImageIndex) {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentImageIndex(index)
        setIsTransitioning(false)
      }, 300)
    }
  }

  return (
    <div className='flex flex-col sm:flex-row border border-gray-400'>
        {/* Hero Left Section */}
        <div className='w-full sm:w-1/2 flex items-center justify-center py-10 sm:py-0'>
            <div className='text-[#414141]'>
                <div className='flex items-center gap-2'>
                    <p className='w-8 md:w-11 h-[2px] bg-[#414141]'></p>
                    <p className='font-medium text-sm md:text-base'>OUR BEST SELLERS</p>
                </div>
                <h1 className='prata-regular text-3xl sm:py-3 lg:text-5xl leading-relaxed'>Latest Arrivals</h1>
                <div className='flex items-center gap-2'>
                    <p className='font-semibold text-sm md:text-base'>SHOP NOW</p>
                    <p className='w-8 md:w-11 h-[1px] bg-[#414141]'></p>
                </div>
            </div>
        </div>
        
        {/* Hero Right Side - Image Carousel */}
        <div className='relative w-full sm:w-1/2 group'>
            {/* Main Image Container */}
            <div className='relative overflow-hidden'>
                <img 
                    className={`w-full h-full object-cover transition-opacity duration-600 ${
                        isTransitioning ? 'opacity-50' : 'opacity-100'
                    }`}
                    src={heroImages[currentImageIndex]} 
                    alt={`Hero ${currentImageIndex + 1}`}
                    onError={(e) => {
                        // Fallback to first beautiful image if current image fails to load
                        e.target.src = heroImages[0]
                    }}
                />
            </div>

            {/* Navigation Arrows */}
            <button 
                onClick={goToPrevious}
                className='absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300'
            >
                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
                </svg>
            </button>
            
            <button 
                onClick={goToNext}
                className='absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300'
            >
                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
                </svg>
            </button>

            {/* Dot Indicators */}
            <div className='absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2'>
                {heroImages.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                            index === currentImageIndex 
                                ? 'bg-white shadow-lg scale-110' 
                                : 'bg-white bg-opacity-50 hover:bg-opacity-70'
                        }`}
                    />
                ))}
            </div>
        </div>
    </div>
  )
}

export default Hero