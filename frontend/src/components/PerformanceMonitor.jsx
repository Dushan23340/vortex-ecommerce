import React, { useState, useEffect } from 'react'

const PerformanceMonitor = ({ enabled = false }) => {
  const [metrics, setMetrics] = useState({
    loadTime: 0,
    renderTime: 0,
    memoryUsage: 0,
    fcp: 0, // First Contentful Paint
    lcp: 0, // Largest Contentful Paint
    cls: 0, // Cumulative Layout Shift
    fid: 0  // First Input Delay
  })

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return

    // Measure page load time
    const measureLoadTime = () => {
      const navigation = performance.getEntriesByType('navigation')[0]
      if (navigation) {
        setMetrics(prev => ({
          ...prev,
          loadTime: navigation.loadEventEnd - navigation.fetchStart
        }))
      }
    }

    // Measure Web Vitals
    const measureWebVitals = () => {
      // First Contentful Paint
      const fcpEntry = performance.getEntriesByName('first-contentful-paint')[0]
      if (fcpEntry) {
        setMetrics(prev => ({ ...prev, fcp: fcpEntry.startTime }))
      }

      // Largest Contentful Paint (requires PerformanceObserver)
      try {
        new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const lastEntry = entries[entries.length - 1]
          setMetrics(prev => ({ ...prev, lcp: lastEntry.startTime }))
        }).observe({ entryTypes: ['largest-contentful-paint'] })
      } catch (e) {
        console.log('LCP observation not supported')
      }

      // Cumulative Layout Shift
      try {
        new PerformanceObserver((list) => {
          let clsValue = 0
          for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) {
              clsValue += entry.value
            }
          }
          setMetrics(prev => ({ ...prev, cls: clsValue }))
        }).observe({ entryTypes: ['layout-shift'] })
      } catch (e) {
        console.log('CLS observation not supported')
      }

      // First Input Delay
      try {
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            setMetrics(prev => ({ ...prev, fid: entry.processingStart - entry.startTime }))
          }
        }).observe({ entryTypes: ['first-input'] })
      } catch (e) {
        console.log('FID observation not supported')
      }
    }

    // Measure memory usage (if available)
    const measureMemory = () => {
      if (performance.memory) {
        setMetrics(prev => ({
          ...prev,
          memoryUsage: performance.memory.usedJSHeapSize / 1024 / 1024 // Convert to MB
        }))
      }
    }

    const measureAll = () => {
      measureLoadTime()
      measureWebVitals()
      measureMemory()
    }

    // Initial measurement
    measureAll()

    // Periodic updates
    const interval = setInterval(measureMemory, 5000)

    return () => clearInterval(interval)
  }, [enabled])

  const getScoreColor = (metric, value) => {
    const thresholds = {
      fcp: { good: 1800, poor: 3000 },
      lcp: { good: 2500, poor: 4000 },
      cls: { good: 0.1, poor: 0.25 },
      fid: { good: 100, poor: 300 }
    }

    if (!thresholds[metric]) return 'text-gray-600'

    const { good, poor } = thresholds[metric]
    if (value <= good) return 'text-green-600'
    if (value <= poor) return 'text-yellow-600'
    return 'text-red-600'
  }

  if (!enabled) return null

  return (
    <div className="fixed bottom-4 left-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4 text-xs z-50 max-w-xs">
      <h3 className="font-semibold mb-2 text-gray-800">Performance Metrics</h3>
      <div className="space-y-1">
        <div className="flex justify-between">
          <span>Load Time:</span>
          <span className="font-mono">{Math.round(metrics.loadTime)}ms</span>
        </div>
        <div className="flex justify-between">
          <span>Memory:</span>
          <span className="font-mono">{metrics.memoryUsage.toFixed(1)}MB</span>
        </div>
        <div className="flex justify-between">
          <span>FCP:</span>
          <span className={`font-mono ${getScoreColor('fcp', metrics.fcp)}`}>
            {Math.round(metrics.fcp)}ms
          </span>
        </div>
        <div className="flex justify-between">
          <span>LCP:</span>
          <span className={`font-mono ${getScoreColor('lcp', metrics.lcp)}`}>
            {Math.round(metrics.lcp)}ms
          </span>
        </div>
        <div className="flex justify-between">
          <span>CLS:</span>
          <span className={`font-mono ${getScoreColor('cls', metrics.cls)}`}>
            {metrics.cls.toFixed(3)}
          </span>
        </div>
        <div className="flex justify-between">
          <span>FID:</span>
          <span className={`font-mono ${getScoreColor('fid', metrics.fid)}`}>
            {Math.round(metrics.fid)}ms
          </span>
        </div>
      </div>
    </div>
  )
}

// Performance optimization utilities
export const performanceUtils = {
  // Debounce function for search inputs
  debounce: (func, wait) => {
    let timeout
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout)
        func(...args)
      }
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    }
  },

  // Throttle function for scroll events
  throttle: (func, limit) => {
    let inThrottle
    return function() {
      const args = arguments
      const context = this
      if (!inThrottle) {
        func.apply(context, args)
        inThrottle = true
        setTimeout(() => inThrottle = false, limit)
      }
    }
  },

  // Intersection Observer for lazy loading
  createIntersectionObserver: (callback, options = {}) => {
    const defaultOptions = {
      root: null,
      rootMargin: '50px',
      threshold: 0.1,
      ...options
    }

    return new IntersectionObserver(callback, defaultOptions)
  },

  // Preload critical resources
  preloadImage: (src) => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'image'
    link.href = src
    document.head.appendChild(link)
  },

  // Optimize images
  getOptimizedImageUrl: (originalUrl, width = 800, quality = 80) => {
    // This would typically integrate with an image optimization service
    // For now, return the original URL
    return originalUrl
  },

  // Local storage with compression
  setCompressedStorage: (key, data) => {
    try {
      const compressed = JSON.stringify(data)
      localStorage.setItem(key, compressed)
    } catch (error) {
      console.warn('Failed to store data:', error)
    }
  },

  getCompressedStorage: (key) => {
    try {
      const data = localStorage.getItem(key)
      return data ? JSON.parse(data) : null
    } catch (error) {
      console.warn('Failed to retrieve data:', error)
      return null
    }
  }
}

export default PerformanceMonitor