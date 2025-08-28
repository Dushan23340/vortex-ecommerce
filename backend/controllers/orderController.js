import orderModel from '../models/orderModel.js';
import userModel from '../models/userModel.js';
import productModel from '../models/productModel.js';
import { sendOrderConfirmationEmail, sendOrderVerificationEmail } from '../utils/emailService.js';
import crypto from 'crypto';

// Temporary store for order verification codes (in production, use Redis or database)
const orderVerificationCodes = new Map();

// Generate 6-digit verification code
const generateOrderVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send order verification code
const sendOrderVerificationCode = async (req, res) => {
    try {
        const {
            deliveryInfo,
            paymentMethod,
            totalAmount,
            deliveryFee
        } = req.body;

        const userId = req.user._id;

        // Validate required fields
        if (!deliveryInfo || !paymentMethod || !totalAmount || !deliveryInfo.email) {
            return res.json({ 
                success: false, 
                message: "Missing required order information" 
            });
        }

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(deliveryInfo.email)) {
            return res.json({ 
                success: false, 
                message: "Please provide a valid email address" 
            });
        }

        // Generate verification code
        const verificationCode = generateOrderVerificationCode();
        const codeExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
        
        // Create unique identifier for this verification attempt
        const verificationId = crypto.randomUUID();
        
        // Store verification data
        orderVerificationCodes.set(verificationId, {
            userId,
            deliveryInfo,
            paymentMethod,
            totalAmount,
            deliveryFee,
            code: verificationCode,
            expires: codeExpires,
            verified: false
        });

        // Prepare order details for email
        const orderDetails = {
            totalAmount,
            deliveryFee,
            paymentMethod,
            deliveryInfo
        };

        // Send verification email
        const emailResult = await sendOrderVerificationEmail(
            deliveryInfo.email,
            verificationCode,
            deliveryInfo.firstName || 'Customer',
            orderDetails
        );

        if (emailResult.success) {
            console.log('✅ Order verification email sent successfully');
            res.json({
                success: true,
                message: "Verification code sent to your email",
                verificationId: verificationId
            });
        } else {
            console.error('❌ Failed to send verification email:', emailResult.error);
            res.json({
                success: false,
                message: "Failed to send verification email. Please try again."
            });
        }

    } catch (error) {
        console.log('Send verification code error:', error);
        res.json({ 
            success: false, 
            message: error.message 
        });
    }
};

// Verify order code and create order
const verifyOrderCode = async (req, res) => {
    try {
        const { verificationId, verificationCode } = req.body;
        const userId = req.user._id;

        if (!verificationId || !verificationCode) {
            return res.json({
                success: false,
                message: "Verification ID and code are required"
            });
        }

        // Get verification data
        const verificationData = orderVerificationCodes.get(verificationId);
        
        if (!verificationData) {
            return res.json({
                success: false,
                message: "Invalid or expired verification session"
            });
        }

        // Check if expired
        if (new Date() > verificationData.expires) {
            orderVerificationCodes.delete(verificationId);
            return res.json({
                success: false,
                message: "Verification code has expired. Please request a new one."
            });
        }

        // Check if user matches
        if (verificationData.userId.toString() !== userId.toString()) {
            return res.json({
                success: false,
                message: "Invalid verification session"
            });
        }

        // Check code
        if (verificationData.code !== verificationCode.toString()) {
            return res.json({
                success: false,
                message: "Invalid verification code"
            });
        }

        // Mark as verified
        verificationData.verified = true;
        orderVerificationCodes.set(verificationId, verificationData);

        res.json({
            success: true,
            message: "Email verified successfully. You can now place your order.",
            verificationId: verificationId
        });

    } catch (error) {
        console.log('Verify order code error:', error);
        res.json({ 
            success: false, 
            message: error.message 
        });
    }
};

// Create order with verification
const createOrderWithVerification = async (req, res) => {
    try {
        const { verificationId } = req.body;
        const userId = req.user._id;

        if (!verificationId) {
            return res.json({
                success: false,
                message: "Email verification required before placing order"
            });
        }

        // Get verification data
        const verificationData = orderVerificationCodes.get(verificationId);
        
        if (!verificationData) {
            return res.json({
                success: false,
                message: "Invalid verification session. Please verify your email again."
            });
        }

        // Check if verified
        if (!verificationData.verified) {
            return res.json({
                success: false,
                message: "Please verify your email before placing the order"
            });
        }

        // Check if expired
        if (new Date() > verificationData.expires) {
            orderVerificationCodes.delete(verificationId);
            return res.json({
                success: false,
                message: "Verification session has expired. Please start over."
            });
        }

        // Check if user matches
        if (verificationData.userId.toString() !== userId.toString()) {
            return res.json({
                success: false,
                message: "Invalid verification session"
            });
        }

        // Get user's cart data
        const user = await userModel.findById(userId);
        if (!user) {
            return res.json({ 
                success: false, 
                message: "User not found" 
            });
        }

        // Transform cart data to order items with product details
        const orderItems = [];
        const stockUpdates = [];
        console.log('🛒 User cart data:', JSON.stringify(user.cartData, null, 2));
        
        for (const productId in user.cartData) {
            const product = await productModel.findById(productId);
            console.log('📦 Product found:', product ? product.name : 'Not found');
            
            if (product) {
                for (const size in user.cartData[productId]) {
                    const quantity = user.cartData[productId][size];
                    if (quantity > 0) {
                        // Check if sufficient stock is available
                        const currentStock = product.stock || 0;
                        if (currentStock < quantity) {
                            return res.json({
                                success: false,
                                message: `Insufficient stock for ${product.name}. Available: ${currentStock}, Requested: ${quantity}`
                            });
                        }
                        
                        const orderItem = {
                            productId: productId,
                            name: product.name,
                            image: product.image,
                            size: size,
                            quantity: quantity,
                            price: product.price
                        };
                        orderItems.push(orderItem);
                        
                        // Store stock update for processing after order creation
                        stockUpdates.push({
                            productId: productId,
                            quantity: quantity,
                            originalStock: currentStock
                        });
                        
                        console.log('✅ Order item created:', orderItem);
                    }
                }
            }
        }
        
        console.log('📋 Final order items:', JSON.stringify(orderItems, null, 2));

        // Create new order using verified data
        const newOrder = new orderModel({
            userId,
            deliveryInfo: verificationData.deliveryInfo,
            orderItems: orderItems,
            paymentMethod: verificationData.paymentMethod,
            totalAmount: verificationData.totalAmount,
            deliveryFee: verificationData.deliveryFee,
            orderStatus: verificationData.paymentMethod === 'cod' ? 'pending' : 'pending',
            paymentStatus: verificationData.paymentMethod === 'cod' ? 'pending' : 'pending'
        });

        const savedOrder = await newOrder.save();

        // Reduce stock for each ordered item
        console.log('📉 Processing stock reductions...');
        for (const update of stockUpdates) {
            const { productId, quantity } = update;
            const product = await productModel.findById(productId);
            
            if (product) {
                const newStock = Math.max(0, (product.stock || 0) - quantity);
                
                // Calculate new stock status
                const lowStockThreshold = product.lowStockThreshold || 10;
                let stockStatus = 'Out of Stock';
                
                if (newStock > lowStockThreshold) {
                    stockStatus = 'In Stock';
                } else if (newStock > 0) {
                    stockStatus = 'Low Stock';
                }
                
                // Update product stock
                await productModel.findByIdAndUpdate(
                    productId,
                    { 
                        stock: newStock, 
                        stockStatus: stockStatus 
                    }
                );
                
                console.log(`✅ Stock updated for ${product.name}: ${product.stock} → ${newStock} (${stockStatus})`);
            }
        }

        // Clear user's cart after successful order creation
        await userModel.findByIdAndUpdate(userId, { cartData: {} });

        // Send order confirmation email to customer
        try {
            const customerEmail = verificationData.deliveryInfo.email;
            const customerName = verificationData.deliveryInfo.firstName;
            
            if (customerEmail) {
                console.log('📧 Sending order confirmation email to:', customerEmail);
                
                // Prepare order details for email
                const emailOrderDetails = {
                    _id: savedOrder._id,
                    orderNumber: savedOrder._id.toString().slice(-6).toUpperCase(),
                    totalAmount: savedOrder.totalAmount,
                    deliveryFee: savedOrder.deliveryFee,
                    paymentMethod: savedOrder.paymentMethod,
                    deliveryInfo: savedOrder.deliveryInfo,
                    orderItems: savedOrder.orderItems
                };
                
                const emailResult = await sendOrderConfirmationEmail(
                    customerEmail, 
                    emailOrderDetails, 
                    customerName
                );
                
                if (emailResult.success) {
                    console.log('✅ Order confirmation email sent successfully');
                } else {
                    console.error('❌ Failed to send order confirmation email:', emailResult.error);
                }
            }
        } catch (emailError) {
            console.error('❌ Error sending order confirmation email:', emailError);
        }

        // Clean up verification data
        orderVerificationCodes.delete(verificationId);

        res.json({
            success: true,
            message: "Order placed successfully!",
            order: savedOrder
        });

    } catch (error) {
        console.log('Create verified order error:', error);
        res.json({ 
            success: false, 
            message: error.message 
        });
    }
};

// Create new order (original function)
const createOrder = async (req, res) => {
    try {
        const {
            deliveryInfo,
            paymentMethod,
            totalAmount,
            deliveryFee
        } = req.body;

        const userId = req.user._id;

        // Validate required fields
        if (!deliveryInfo || !paymentMethod || !totalAmount) {
            return res.json({ 
                success: false, 
                message: "Missing required order information" 
            });
        }

        // Get user's cart data
        const user = await userModel.findById(userId);
        if (!user) {
            return res.json({ 
                success: false, 
                message: "User not found" 
            });
        }

        // Transform cart data to order items with product details
        const orderItems = [];
        const stockUpdates = []; // Track stock updates for rollback if needed
        console.log('🛒 User cart data:', JSON.stringify(user.cartData, null, 2));
        
        for (const productId in user.cartData) {
            const product = await productModel.findById(productId);
            console.log('📦 Product found:', product ? product.name : 'Not found');
            
            if (product) {
                for (const size in user.cartData[productId]) {
                    const quantity = user.cartData[productId][size];
                    if (quantity > 0) {
                        // Check if sufficient stock is available
                        const currentStock = product.stock || 0;
                        if (currentStock < quantity) {
                            return res.json({
                                success: false,
                                message: `Insufficient stock for ${product.name}. Available: ${currentStock}, Requested: ${quantity}`
                            });
                        }
                        
                        const orderItem = {
                            productId: productId,
                            name: product.name,
                            image: product.image,
                            size: size,
                            quantity: quantity,
                            price: product.price
                        };
                        orderItems.push(orderItem);
                        
                        // Store stock update for processing after order creation
                        stockUpdates.push({
                            productId: productId,
                            quantity: quantity,
                            originalStock: currentStock
                        });
                        
                        console.log('✅ Order item created:', orderItem);
                    }
                }
            }
        }
        
        console.log('📋 Final order items:', JSON.stringify(orderItems, null, 2));

        // Create new order
        const newOrder = new orderModel({
            userId,
            deliveryInfo,
            orderItems: orderItems,
            paymentMethod,
            totalAmount,
            deliveryFee,
            orderStatus: paymentMethod === 'cod' ? 'pending' : 'pending',
            paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending'
        });

        const savedOrder = await newOrder.save();

        // Reduce stock for each ordered item
        console.log('📉 Processing stock reductions...');
        for (const update of stockUpdates) {
            const { productId, quantity } = update;
            const product = await productModel.findById(productId);
            
            if (product) {
                const newStock = Math.max(0, (product.stock || 0) - quantity);
                
                // Calculate new stock status
                const lowStockThreshold = product.lowStockThreshold || 10;
                let stockStatus = 'Out of Stock';
                
                if (newStock > lowStockThreshold) {
                    stockStatus = 'In Stock';
                } else if (newStock > 0) {
                    stockStatus = 'Low Stock';
                }
                
                // Update product stock
                await productModel.findByIdAndUpdate(
                    productId,
                    { 
                        stock: newStock, 
                        stockStatus: stockStatus 
                    }
                );
                
                console.log(`✅ Stock updated for ${product.name}: ${product.stock} → ${newStock} (${stockStatus})`);
            }
        }

        // Clear user's cart after successful order creation
        await userModel.findByIdAndUpdate(userId, { cartData: {} });

        // Send order confirmation email to customer
        try {
            const customerEmail = deliveryInfo.email || user.email;
            const customerName = deliveryInfo.firstName || user.name;
            
            if (customerEmail) {
                console.log('📧 Sending order confirmation email to:', customerEmail);
                
                // Prepare order details for email
                const emailOrderDetails = {
                    _id: savedOrder._id,
                    orderNumber: savedOrder._id.toString().slice(-6).toUpperCase(),
                    totalAmount: savedOrder.totalAmount,
                    deliveryFee: savedOrder.deliveryFee,
                    paymentMethod: savedOrder.paymentMethod,
                    deliveryInfo: savedOrder.deliveryInfo,
                    orderItems: savedOrder.orderItems
                };
                
                const emailResult = await sendOrderConfirmationEmail(
                    customerEmail, 
                    emailOrderDetails, 
                    customerName
                );
                
                if (emailResult.success) {
                    console.log('✅ Order confirmation email sent successfully');
                } else {
                    console.error('❌ Failed to send order confirmation email:', emailResult.error);
                    // Don't fail the order creation if email fails
                }
            } else {
                console.log('⚠️ No email address found for order confirmation');
            }
        } catch (emailError) {
            console.error('❌ Error sending order confirmation email:', emailError);
            // Don't fail the order creation if email fails
        }

        res.json({
            success: true,
            message: "Order created successfully",
            order: savedOrder
        });

    } catch (error) {
        console.log('Create order error:', error);
        res.json({ 
            success: false, 
            message: error.message 
        });
    }
};

// Get user's orders
const getUserOrders = async (req, res) => {
    try {
        const userId = req.user._id;
        console.log('🔍 Fetching orders for userId:', userId);

        const orders = await orderModel.find({ userId })
            .sort({ createdAt: -1 }); // Most recent first
        
        console.log('📦 Raw orders from DB:', JSON.stringify(orders, null, 2));

        // Transform orders to match frontend expectations
        const transformedOrders = orders.map(order => {
            console.log('🔄 Transforming order:', order._id);
            console.log('📋 Order items:', order.orderItems);
            
            const transformed = {
                _id: order._id,
                date: order.orderDate || order.createdAt,
                amount: order.totalAmount,
                paymentMethod: order.paymentMethod,
                status: order.orderStatus === 'pending' ? 'Order Placed' : 
                       order.orderStatus === 'processing' ? 'Processing' :
                       order.orderStatus === 'shipped' ? 'Shipped' :
                       order.orderStatus === 'delivered' ? 'Delivered' :
                       order.orderStatus === 'cancelled' ? 'Cancelled' : 'Order Placed',
                items: (order.orderItems || []).map(item => {
                    console.log('🔄 Transforming item:', item);
                    return {
                        name: item.name || 'Unknown Product',
                        image: item.image || [],
                        size: item.size || 'N/A',
                        quantity: item.quantity || 1,
                        price: item.price || 0
                    };
                }),
                address: {
                    firstName: order.deliveryInfo.firstName,
                    lastName: order.deliveryInfo.lastName,
                    street: order.deliveryInfo.street,
                    city: order.deliveryInfo.city,
                    state: order.deliveryInfo.state,
                    zipcode: order.deliveryInfo.zipCode, // Fix field name mismatch
                    country: order.deliveryInfo.country,
                    phone: order.deliveryInfo.phone
                },
                payment: order.paymentStatus === 'completed',
                paymentId: order.paymentId || null
            };
            
            console.log('✅ Transformed order:', JSON.stringify(transformed, null, 2));
            return transformed;
        });

        console.log('🎯 Final response:', { success: true, orders: transformedOrders });

        res.json({
            success: true,
            orders: transformedOrders
        });

    } catch (error) {
        console.log('❌ Get user orders error:', error);
        res.json({ 
            success: false, 
            message: error.message 
        });
    }
};

// Get specific order by ID
const getOrderById = async (req, res) => {
    try {
        const { orderId } = req.params;
        const userId = req.user._id;

        const order = await orderModel.findOne({ 
            _id: orderId, 
            userId: userId 
        });

        if (!order) {
            return res.json({ 
                success: false, 
                message: "Order not found" 
            });
        }

        res.json({
            success: true,
            order: order
        });

    } catch (error) {
        console.log('Get order by ID error:', error);
        res.json({ 
            success: false, 
            message: error.message 
        });
    }
};

// Get all orders (admin function)
const getAllOrders = async (req, res) => {
    try {
        console.log('🔍 Admin: Fetching all orders');

        const orders = await orderModel.find({})
            .populate('userId', 'name email') // Populate user details
            .sort({ createdAt: -1 }); // Most recent first
        
        console.log('📦 Admin: Raw orders from DB:', orders.length);

        // Transform orders for admin view
        const transformedOrders = orders.map(order => {
            console.log('🔄 Admin: Transforming order:', order._id);
            
            const transformed = {
                _id: order._id,
                orderNumber: order._id.toString().slice(-6).toUpperCase(),
                date: order.orderDate || order.createdAt,
                amount: order.totalAmount,
                paymentMethod: order.paymentMethod,
                status: order.orderStatus === 'pending' ? 'Order Placed' : 
                       order.orderStatus === 'processing' ? 'Processing' :
                       order.orderStatus === 'shipped' ? 'Shipped' :
                       order.orderStatus === 'delivered' ? 'Delivered' :
                       order.orderStatus === 'cancelled' ? 'Cancelled' : 'Order Placed',
                paymentStatus: order.paymentStatus,
                items: (order.orderItems || []).map(item => ({
                    productId: item.productId,
                    name: item.name || 'Unknown Product',
                    image: item.image || [],
                    size: item.size || 'N/A',
                    quantity: item.quantity || 1,
                    price: item.price || 0
                })),
                customer: {
                    userId: order.userId._id,
                    name: order.userId.name || 'Unknown User',
                    email: order.userId.email || 'No Email'
                },
                address: {
                    firstName: order.deliveryInfo.firstName,
                    lastName: order.deliveryInfo.lastName,
                    street: order.deliveryInfo.street,
                    city: order.deliveryInfo.city,
                    state: order.deliveryInfo.state,
                    zipcode: order.deliveryInfo.zipCode,
                    country: order.deliveryInfo.country,
                    phone: order.deliveryInfo.phone
                },
                deliveryFee: order.deliveryFee,
                totalAmount: order.totalAmount
            };
            
            console.log('✅ Admin: Transformed order:', JSON.stringify(transformed, null, 2));
            return transformed;
        });

        console.log('🎯 Admin: Final response with', transformedOrders.length, 'orders');

        res.json({
            success: true,
            orders: transformedOrders
        });

    } catch (error) {
        console.log('❌ Admin: Get all orders error:', error);
        res.json({ 
            success: false, 
            message: error.message 
        });
    }
};

// Update payment status (admin function) - specifically for COD orders
const updatePaymentStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { paymentStatus, paymentMethod } = req.body;
        
        console.log('💰 Admin: Updating payment status:', orderId, 'to:', paymentStatus);
        
        // Validate payment status
        const validStatuses = ['pending', 'completed', 'failed'];
        if (!validStatuses.includes(paymentStatus)) {
            return res.json({
                success: false,
                message: "Invalid payment status. Use: pending, completed, or failed"
            });
        }
        
        // Find the order
        const order = await orderModel.findById(orderId);
        if (!order) {
            return res.json({
                success: false,
                message: "Order not found"
            });
        }
        
        // Update payment status
        const updatedOrder = await orderModel.findByIdAndUpdate(
            orderId,
            { 
                paymentStatus: paymentStatus,
                // If payment is completed and it's COD, also update order status if still pending
                ...(paymentStatus === 'completed' && order.paymentMethod === 'cod' && order.orderStatus === 'pending' ? 
                    { orderStatus: 'processing' } : {})
            },
            { new: true }
        );
        
        console.log('✅ Admin: Payment status updated successfully');
        
        res.json({
            success: true,
            message: "Payment status updated successfully",
            order: {
                _id: updatedOrder._id,
                paymentStatus: updatedOrder.paymentStatus,
                orderStatus: updatedOrder.orderStatus
            }
        });
        
    } catch (error) {
        console.log('❌ Admin: Update payment status error:', error);
        res.json({
            success: false,
            message: error.message
        });
    }
};

// Update order status (admin function)
const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        
        console.log('🔧 Admin: Updating order status:', orderId, 'to:', status);
        
        // Map frontend status to database status
        let orderStatus;
        switch (status) {
            case 'Order Placed':
                orderStatus = 'pending';
                break;
            case 'Processing':
                orderStatus = 'processing';
                break;
            case 'Shipped':
                orderStatus = 'shipped';
                break;
            case 'Delivered':
                orderStatus = 'delivered';
                break;
            case 'Cancelled':
                orderStatus = 'cancelled';
                break;
            default:
                orderStatus = 'pending';
        }
        
        const updatedOrder = await orderModel.findByIdAndUpdate(
            orderId,
            { orderStatus: orderStatus },
            { new: true }
        );
        
        if (!updatedOrder) {
            return res.json({
                success: false,
                message: "Order not found"
            });
        }
        
        console.log('✅ Admin: Order status updated successfully');
        
        res.json({
            success: true,
            message: "Order status updated successfully",
            order: updatedOrder
        });
        
    } catch (error) {
        console.log('❌ Admin: Update order status error:', error);
        res.json({ 
            success: false, 
            message: error.message 
        });
    }
};

export { createOrder, getUserOrders, getOrderById, getAllOrders, updateOrderStatus, updatePaymentStatus, sendOrderVerificationCode, verifyOrderCode, createOrderWithVerification };
