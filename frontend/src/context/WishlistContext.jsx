import React, { createContext, useContext, useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { useAuth } from './AuthContext'
import axios from 'axios'

const WishlistContext = createContext()

export const useWishlist = () => {
  const context = useContext(WishlistContext)
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider')
  }
  return context
}

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([])
  const [loading, setLoading] = useState(false)
  const { isAuthenticated, token } = useAuth()
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'

  // Load wishlist on mount and when authentication status changes
  useEffect(() => {
    if (isAuthenticated && token) {
      loadWishlistFromBackend()
    } else {
      // User logged out - clear wishlist and localStorage
      setWishlistItems([])
      localStorage.removeItem('wishlistItems')
    }
  }, [isAuthenticated, token])

  // Save to localStorage for non-authenticated users
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem('wishlistItems', JSON.stringify(wishlistItems))
    }
  }, [wishlistItems, isAuthenticated])

  // Load wishlist from backend
  const loadWishlistFromBackend = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${backendUrl}/api/user/wishlist`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      if (response.data.success) {
        setWishlistItems(response.data.wishlistData || [])
      }
    } catch (error) {
      console.error('Error loading wishlist:', error)
      // Fallback to localStorage
      const savedWishlist = localStorage.getItem('wishlistItems')
      if (savedWishlist) {
        setWishlistItems(JSON.parse(savedWishlist))
      }
    } finally {
      setLoading(false)
    }
  }

  const addToWishlist = async (product) => {
    if (!isAuthenticated) {
      // Handle non-authenticated users with localStorage
      const isAlreadyInWishlist = wishlistItems.some(item => item._id === product._id)
      
      if (isAlreadyInWishlist) {
        toast.info('Item is already in your wishlist')
        return
      }

      setWishlistItems(prev => [...prev, product])
      toast.success('Added to wishlist (login to sync across devices)')
      return
    }

    try {
      setLoading(true)
      const response = await axios.post(`${backendUrl}/api/user/wishlist/add`, {
        productId: product._id,
        productData: product
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      if (response.data.success) {
        setWishlistItems(response.data.wishlistData)
        toast.success('Added to wishlist')
      } else {
        toast.error(response.data.message || 'Failed to add to wishlist')
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error)
      toast.error('Failed to add to wishlist')
    } finally {
      setLoading(false)
    }
  }

  const removeFromWishlist = async (productId) => {
    if (!isAuthenticated) {
      // Handle non-authenticated users with localStorage
      setWishlistItems(prev => prev.filter(item => item._id !== productId))
      toast.success('Removed from wishlist')
      return
    }

    try {
      setLoading(true)
      const response = await axios.post(`${backendUrl}/api/user/wishlist/remove`, {
        productId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      if (response.data.success) {
        setWishlistItems(response.data.wishlistData)
        toast.success('Removed from wishlist')
      } else {
        toast.error(response.data.message || 'Failed to remove from wishlist')
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error)
      toast.error('Failed to remove from wishlist')
    } finally {
      setLoading(false)
    }
  }

  const clearWishlist = async () => {
    if (!isAuthenticated) {
      // Handle non-authenticated users with localStorage
      setWishlistItems([])
      localStorage.removeItem('wishlistItems')
      toast.success('Wishlist cleared')
      return
    }

    try {
      setLoading(true)
      const response = await axios.delete(`${backendUrl}/api/user/wishlist`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      if (response.data.success) {
        setWishlistItems([])
        toast.success('Wishlist cleared')
      } else {
        toast.error(response.data.message || 'Failed to clear wishlist')
      }
    } catch (error) {
      console.error('Error clearing wishlist:', error)
      toast.error('Failed to clear wishlist')
    } finally {
      setLoading(false)
    }
  }

  const isInWishlist = (productId) => {
    return wishlistItems.some(item => item._id === productId)
  }

  const getWishlistCount = () => {
    return wishlistItems.length
  }

  const value = {
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
    getWishlistCount,
    loading
  }

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  )
}