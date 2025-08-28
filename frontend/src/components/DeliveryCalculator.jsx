import React, { useState, useContext, useEffect } from 'react'
import { ShopContext } from '../context/ShopContext'
import { getAllDistricts, getCitiesForDistrict } from '../utils/deliveryCalculator'

const DeliveryCalculator = ({ onDeliveryChange, selectedDistrict = '', selectedCity = '', selectedService = 'standard' }) => {
  const { calculateDelivery, getDeliveryServices, getCartAmount, currency } = useContext(ShopContext)
  
  const [district, setDistrict] = useState(selectedDistrict)
  const [city, setCity] = useState(selectedCity)
  const [serviceType, setServiceType] = useState(selectedService)
  const [calculation, setCalculation] = useState(null)
  const [availableServices, setAvailableServices] = useState([])
  const [cities, setCities] = useState([])
  const [isCalculating, setIsCalculating] = useState(false)

  // Get all districts for dropdown
  const districts = getAllDistricts()

  // Update cities when district changes
  useEffect(() => {
    if (district) {
      const districtCities = getCitiesForDistrict(district)
      setCities(districtCities)
      
      // Clear city if it's not available in new district
      if (city && !districtCities.includes(city)) {
        setCity('')
      }
      
      // Get available services for this district
      const services = getDeliveryServices(district, city)
      setAvailableServices(services)
      
      // Reset to standard if current service not available
      if (!services.find(s => s.type === serviceType)) {
        setServiceType('standard')
      }
    } else {
      setCities([])
      setAvailableServices([])
    }
  }, [district])

  // Calculate delivery fee when location or service changes
  useEffect(() => {
    if (district) {
      setIsCalculating(true)
      
      const result = calculateDelivery(district, city, serviceType)
      setCalculation(result)
      
      // Notify parent component
      if (onDeliveryChange) {
        onDeliveryChange({
          district,
          city,
          serviceType,
          calculation: result
        })
      }
      
      setIsCalculating(false)
    }
  }, [district, city, serviceType, getCartAmount()])

  const handleDistrictChange = (e) => {
    setDistrict(e.target.value)
  }

  const handleCityChange = (e) => {
    setCity(e.target.value)
  }

  const handleServiceChange = (e) => {
    setServiceType(e.target.value)
  }

  return (
    <div className='bg-gray-50 p-4 rounded-lg border border-gray-200'>
      <h3 className='text-lg font-semibold text-gray-900 mb-4 flex items-center'>
        <svg className='w-5 h-5 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' />
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 11a3 3 0 11-6 0 3 3 0 016 0z' />
        </svg>
        Delivery Calculator
      </h3>

      <div className='space-y-4'>
        {/* District Selection */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            District *
          </label>
          <select
            value={district}
            onChange={handleDistrictChange}
            className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
            required
          >
            <option value=''>Select District</option>
            {districts.map(dist => (
              <option key={dist} value={dist}>{dist}</option>
            ))}
          </select>
        </div>

        {/* City Selection */}
        {cities.length > 0 && (
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              City (Optional)
            </label>
            <select
              value={city}
              onChange={handleCityChange}
              className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
            >
              <option value=''>Select City</option>
              {cities.map(cityName => (
                <option key={cityName} value={cityName}>{cityName}</option>
              ))}
            </select>
          </div>
        )}

        {/* Service Type Selection */}
        {availableServices.length > 0 && (
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Delivery Service
            </label>
            <div className='space-y-2'>
              {availableServices.map(service => (
                <label key={service.type} className='flex items-center p-3 border border-gray-200 rounded-lg hover:bg-white cursor-pointer'>
                  <input
                    type='radio'
                    name='deliveryService'
                    value={service.type}
                    checked={serviceType === service.type}
                    onChange={handleServiceChange}
                    className='mr-3'
                  />
                  <div className='flex-1'>
                    <div className='flex justify-between items-center'>
                      <div>
                        <p className='font-medium text-gray-900'>{service.name}</p>
                        <p className='text-sm text-gray-500'>{service.description}</p>
                      </div>
                      <div className='text-right'>
                        <p className='font-semibold text-gray-900'>
                          {getCartAmount() >= service.freeThreshold ? (
                            <span className='text-green-600'>FREE</span>
                          ) : (
                            `${currency} ${service.rate}`
                          )}
                        </p>
                        {getCartAmount() < service.freeThreshold && (
                          <p className='text-xs text-gray-500'>
                            Free above {currency} {service.freeThreshold}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Calculation Result */}
        {calculation && (
          <div className='mt-4 p-4 bg-white rounded-lg border border-gray-200'>
            {isCalculating ? (
              <div className='flex items-center justify-center py-4'>
                <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900'></div>
                <span className='ml-2 text-gray-600'>Calculating...</span>
              </div>
            ) : calculation.success ? (
              <div>
                <div className='flex justify-between items-center mb-2'>
                  <span className='font-medium text-gray-900'>Delivery Fee:</span>
                  <span className='font-bold text-lg'>
                    {calculation.isFreeDelivery ? (
                      <span className='text-green-600'>FREE</span>
                    ) : (
                      `${currency} ${calculation.finalFee}`
                    )}
                  </span>
                </div>
                
                {calculation.isFreeDelivery && (
                  <p className='text-sm text-green-600 mb-2'>
                    🎉 You qualify for free delivery!
                  </p>
                )}
                
                <div className='text-sm text-gray-600 space-y-1'>
                  <p><strong>Service:</strong> {calculation.serviceName}</p>
                  <p><strong>Estimated Delivery:</strong> {calculation.estimatedDays?.text}</p>
                  <p><strong>Zone:</strong> {calculation.zone} - {calculation.district}{calculation.city ? `, ${calculation.city}` : ''}</p>
                  
                  {!calculation.isFreeDelivery && (
                    <p className='text-blue-600'>
                      💡 Add {currency} {calculation.freeDeliveryThreshold - getCartAmount()} more for free delivery!
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className='text-red-600'>
                <p className='font-medium'>❌ {calculation.error}</p>
                {calculation.availableServices && (
                  <p className='text-sm mt-1'>
                    Available services: {calculation.availableServices.join(', ')}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Information Box */}
        <div className='bg-blue-50 border border-blue-200 rounded-lg p-3'>
          <div className='flex items-start'>
            <svg className='w-5 h-5 text-blue-600 mr-2 mt-0.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
            </svg>
            <div className='text-sm text-blue-800'>
              <p className='font-medium mb-1'>Delivery Information</p>
              <ul className='space-y-1 text-xs'>
                <li>• Standard delivery: 1-7 working days depending on location</li>
                <li>• Express delivery: 1-4 working days with priority handling</li>
                <li>• Same day delivery: Available only in Colombo district</li>
                <li>• Free delivery available based on order amount</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DeliveryCalculator