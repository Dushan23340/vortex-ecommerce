import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const Breadcrumb = () => {
  const location = useLocation()
  
  const getBreadcrumbs = () => {
    const pathnames = location.pathname.split('/').filter(x => x)
    
    const breadcrumbs = [
      { name: 'Home', path: '/' }
    ]
    
    pathnames.forEach((pathname, index) => {
      const path = `/${pathnames.slice(0, index + 1).join('/')}`
      
      // Customize breadcrumb names based on routes
      let name = pathname.charAt(0).toUpperCase() + pathname.slice(1)
      
      if (pathname === 'collection') name = 'All Collections'
      if (pathname === 'place-order') name = 'Checkout'
      if (pathname === 'forgot-password') name = 'Forgot Password'
      if (pathname === 'reset-password') name = 'Reset Password'
      
      breadcrumbs.push({ name, path })
    })
    
    return breadcrumbs
  }

  const breadcrumbs = getBreadcrumbs()
  
  // Don't show breadcrumbs on home page
  if (location.pathname === '/') return null

  return (
    <nav className="flex py-3 px-4 text-gray-600 text-sm" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        {breadcrumbs.map((breadcrumb, index) => (
          <li key={breadcrumb.path} className="inline-flex items-center">
            {index > 0 && (
              <svg className="w-4 h-4 mx-1 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            )}
            
            {index === breadcrumbs.length - 1 ? (
              <span className="text-gray-800 font-medium">{breadcrumb.name}</span>
            ) : (
              <Link 
                to={breadcrumb.path} 
                className="hover:text-gray-800 transition-colors"
              >
                {breadcrumb.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

export default Breadcrumb