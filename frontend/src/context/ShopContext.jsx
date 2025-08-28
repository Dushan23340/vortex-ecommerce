import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { useAuth } from './AuthContext';
import { calculateDeliveryFee, getAvailableServices } from '../utils/deliveryCalculator';

export const ShopContext = createContext();

const ShopContextProvider = (props) => {

    const currency = 'Rs.';
    // Remove static delivery fee - now calculated dynamically
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';
    const { isAuthenticated, token } = useAuth();
    
    // Debug: Log environment variable
    console.log('ShopContext loaded');
    console.log('Environment variable VITE_BACKEND_URL:', import.meta.env.VITE_BACKEND_URL);
    console.log('Backend URL:', backendUrl);
    
    const [search, setSearch] = useState('');
    const [showSearch,setShowSearch] = useState(false);
    
    // Delivery-related state
    const [deliveryInfo, setDeliveryInfo] = useState({
        district: '',
        city: '',
        serviceType: 'standard'
    });
    const [calculatedDeliveryFee, setCalculatedDeliveryFee] = useState(250); // Default fee
    const [deliveryCalculation, setDeliveryCalculation] = useState(null);
    
    // Initialize cartItems from localStorage or empty object
    const [cartItems,setCartItems] = useState(() => {
        const savedCart = localStorage.getItem('cartItems');
        if (savedCart) {
            const parsedCart = JSON.parse(savedCart);
            // Clean up any items with quantity 0
            const cleanedCart = {};
            for (const itemId in parsedCart) {
                for (const size in parsedCart[itemId]) {
                    if (parsedCart[itemId][size] > 0) {
                        if (!cleanedCart[itemId]) cleanedCart[itemId] = {};
                        cleanedCart[itemId][size] = parsedCart[itemId][size];
                    }
                }
            }
            return cleanedCart;
        }
        return {};
    });
    
    const [products,setProducts] = useState([]);
    const navigate = useNavigate();

    // Save cartItems to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        console.log('Cart saved to localStorage:', cartItems);
    }, [cartItems]);

    // Sync cart with database when authenticated and clear cart when logged out
    useEffect(() => {
        if (isAuthenticated && token) {
            loadCartFromDatabase();
        } else {
            // User logged out - clear cart from state
            console.log('User logged out - clearing cart from state');
            setCartItems({});
        }
    }, [isAuthenticated, token]);

    // Load cart from database
    const loadCartFromDatabase = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/user/cart`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            if (response.data.success) {
                const dbCart = response.data.cartData;
                if (Object.keys(dbCart).length > 0) {
                    setCartItems(dbCart);
                    localStorage.setItem('cartItems', JSON.stringify(dbCart));
                    console.log('Cart loaded from database:', dbCart);
                }
            }
        } catch (error) {
            console.error('Error loading cart from database:', error);
        }
    };

    // Save cart to database
    const saveCartToDatabase = async (cartData) => {
        if (!isAuthenticated || !token) return;
        
        try {
            await axios.post(`${backendUrl}/api/user/cart/update`, 
                { cartData },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            console.log('Cart saved to database');
        } catch (error) {
            console.error('Error saving cart to database:', error);
        }
    };

    // Clear cart from database
    const clearCartFromDatabase = async () => {
        if (!isAuthenticated || !token) return;
        
        try {
            await axios.delete(`${backendUrl}/api/user/cart`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log('Cart cleared from database');
        } catch (error) {
            console.error('Error clearing cart from database:', error);
        }
    };

    const addToCart = async (itemId,size) => {

        if(!size){
            toast.error('Please select a size');
            return;

        }


         let cartData = structuredClone(cartItems);
            if (cartData[itemId]) {
                if (cartData[itemId][size]) {
                    cartData[itemId][size] += 1;
                }
                else {
                    cartData[itemId][size] = 1;
                }
            }
            else {
                cartData[itemId] = {};
                cartData[itemId][size] = 1;
            }
            setCartItems(cartData);
            
            // Show success toast message
            const product = products.find(p => p._id === itemId);
            const productName = product ? product.name : 'Product';
            toast.success(`${productName} (Size: ${size}) added to cart!`);
            
            // Sync with database
            saveCartToDatabase(cartData);
    }

    const getCartCount = () => {
        let totalCount = 0;
        for (const items in cartItems)  {
            for ( const item in cartItems[items]){
                try {
                    if (cartItems[items][item] > 0) {
                        totalCount += cartItems[items][item];
                    }
                } catch (error) {
            }
        }
    
        }
        return totalCount;
    }

    const updateQuantity = async (itemId,size,quantity) => {
        let cartData = structuredClone(cartItems);
        cartData[itemId][size] = quantity;
        setCartItems(cartData);
        
        // Sync with database
        saveCartToDatabase(cartData);
    }

    // Remove item completely from cart
    const removeFromCart = (itemId, size) => {
        let cartData = structuredClone(cartItems);
        if (cartData[itemId] && cartData[itemId][size]) {
            delete cartData[itemId][size];
            // If no more sizes for this item, remove the entire item
            if (Object.keys(cartData[itemId]).length === 0) {
                delete cartData[itemId];
            }
            setCartItems(cartData);
            
            // Sync with database
            saveCartToDatabase(cartData);
        }
    };

    // Clear cart function (useful for after order completion)
    const clearCart = async () => {
        setCartItems({});
        localStorage.removeItem('cartItems');
        
        // Clear from database
        await clearCartFromDatabase();
    };

    // Calculate delivery fee based on location and cart amount
    const calculateDelivery = (district, city = '', serviceType = 'standard') => {
        const cartAmount = getCartAmount();
        const calculation = calculateDeliveryFee(district, city, cartAmount, serviceType);
        
        if (calculation.success) {
            setCalculatedDeliveryFee(calculation.finalFee);
            setDeliveryCalculation(calculation);
            setDeliveryInfo({ district, city, serviceType });
        }
        
        return calculation;
    };

    // Get available delivery services for current location
    const getDeliveryServices = (district, city = '') => {
        return getAvailableServices(district, city);
    };

    // Get current delivery fee (for backward compatibility)
    const getDeliveryFee = () => {
        return calculatedDeliveryFee;
    };

    // Update delivery info
    const updateDeliveryInfo = (info) => {
        setDeliveryInfo(prev => ({ ...prev, ...info }));
        if (info.district) {
            calculateDelivery(info.district, info.city || deliveryInfo.city, info.serviceType || deliveryInfo.serviceType);
        }
    };

    useEffect(() => {
        console.log(cartItems);

    },[cartItems])

    const getCartAmount = () => {
        let totalAmount = 0;
        for(const items in cartItems){
            let itemInfo = products.find((product)=> product._id === items);
            if (itemInfo) { // Only calculate if product data is available
                for(const item in cartItems[items]){
                    try {
                        if(cartItems[items][item] > 0){
                            totalAmount += itemInfo.price * cartItems[items][item];
                        }
                    } catch (error) {
                        console.error('Error calculating cart amount:', error);
                    }
                }
            }
        }
        return totalAmount;
    }

    const getProductsData = async () => {
        try {
            console.log('=== FETCHING PRODUCTS FROM FRONTEND ===');
            console.log('Backend URL:', backendUrl);
            console.log('Full API URL:', backendUrl + '/api/product/list');
            console.log('Fetching products...');

            const response = await axios.get(backendUrl + '/api/product/list')
            console.log('Full response:', response);
            console.log('Response data:', response.data);
            console.log('Response success:', response.data.success);
            console.log('Products array:', response.data.products);
            console.log('Products length:', response.data.products?.length);
            
            if(response.data.success){
                setProducts(response.data.products);
                console.log('Products set to state:', response.data.products);
            } else {
                console.log('API returned success: false');
                toast.error(response.data.message);
            }
            
            
        } catch (error) {
            console.log('=== ERROR FETCHING PRODUCTS FROM FRONTEND ===');
            console.log('Error:', error);
            console.log('Error message:', error.message);
            console.log('Error response:', error.response);
            toast.error('Error fetching products data');
            
        }
    }

     useEffect(() => {
        getProductsData();
     },[])

     useEffect(() => {
        console.log('=== PRODUCTS STATE CHANGED ===');
        console.log('New products state:', products);
        console.log('Products length:', products.length);
     }, [products])


    const value = {
        products, currency, 
        // Backward compatibility
        delivery_fee: calculatedDeliveryFee,
        // New delivery system
        calculatedDeliveryFee,
        deliveryCalculation,
        deliveryInfo,
        calculateDelivery,
        getDeliveryServices,
        getDeliveryFee,
        updateDeliveryInfo,
        // Existing functionality
        search, setSearch, showSearch,setShowSearch,
        cartItems, addToCart,
        getCartCount,updateQuantity,
        getCartAmount, navigate, backendUrl, clearCart, removeFromCart,
        getProductsData, setProducts,
        // Add clearCart to exports for use by AuthContext
        clearCart
    }

    return(
        <ShopContext.Provider value={value}>
           {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider;