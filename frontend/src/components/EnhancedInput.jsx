import React, { useState } from 'react'

const EnhancedInput = ({ 
  type = 'text', 
  name, 
  value, 
  onChange, 
  placeholder, 
  required = false,
  validation = null,
  className = '',
  label = null,
  ...props 
}) => {
  const [isValid, setIsValid] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [isTouched, setIsTouched] = useState(false)

  const validateInput = (inputValue) => {
    if (required && !inputValue.trim()) {
      setIsValid(false)
      setErrorMessage(`${label || name} is required`)
      return false
    }

    if (validation) {
      const validationResult = validation(inputValue)
      if (validationResult !== true) {
        setIsValid(false)
        setErrorMessage(validationResult)
        return false
      }
    }

    setIsValid(true)
    setErrorMessage('')
    return true
  }

  const handleChange = (e) => {
    const newValue = e.target.value
    onChange(e)
    
    if (isTouched) {
      validateInput(newValue)
    }
  }

  const handleBlur = () => {
    setIsTouched(true)
    validateInput(value)
  }

  const getBorderColor = () => {
    if (!isTouched) return 'border-gray-800'
    return isValid ? 'border-green-500' : 'border-red-500'
  }

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <input
        type={type}
        name={name}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        className={`w-full px-3 py-2 border ${getBorderColor()} focus:outline-none focus:ring-2 focus:ring-black focus:ring-opacity-50 transition-colors ${className}`}
        {...props}
      />
      
      {isTouched && !isValid && (
        <p className="mt-1 text-xs text-red-500">{errorMessage}</p>
      )}
      
      {isTouched && isValid && value && (
        <p className="mt-1 text-xs text-green-500">✓ Valid</p>
      )}
    </div>
  )
}

export default EnhancedInput