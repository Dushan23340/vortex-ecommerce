import React from 'react'

const SkeletonLoader = ({ className = '', type = 'text' }) => {
  const baseClasses = 'animate-pulse bg-gray-200 rounded'
  
  const typeClasses = {
    text: 'h-4',
    title: 'h-6',
    image: 'h-48',
    card: 'h-64',
    avatar: 'h-12 w-12 rounded-full',
    button: 'h-10 w-24'
  }

  return (
    <div className={`${baseClasses} ${typeClasses[type]} ${className}`}></div>
  )
}

const ProductCardSkeleton = () => {
  return (
    <div className="animate-pulse">
      <SkeletonLoader type="image" className="w-full mb-3" />
      <SkeletonLoader type="text" className="w-3/4 mb-2" />
      <SkeletonLoader type="text" className="w-1/2" />
    </div>
  )
}

const ProductGridSkeleton = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  )
}

export default SkeletonLoader
export { ProductCardSkeleton, ProductGridSkeleton }