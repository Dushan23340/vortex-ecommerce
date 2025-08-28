import orderModel from '../models/orderModel.js';
import productModel from '../models/productModel.js';
import userModel from '../models/userModel.js';
import reviewModel from '../models/reviewModel.js';

// Get comprehensive dashboard statistics
const getDashboardStats = async (req, res) => {
    try {
        console.log('📊 Dashboard: Fetching comprehensive statistics...');

        // Get all orders with populated user data
        const orders = await orderModel.find({})
            .populate('userId', 'name email')
            .sort({ createdAt: -1 });

        // Get all products
        const products = await productModel.find({});

        // Get all users
        const users = await userModel.find({});

        // Get all reviews
        const reviews = await reviewModel.find({});

        console.log('📦 Dashboard: Data loaded:', {
            orders: orders.length,
            products: products.length,
            users: users.length,
            reviews: reviews.length
        });

        // Calculate basic counts
        const totalOrders = orders.length;
        const totalProducts = products.length;
        const totalUsers = users.length;
        const totalReviews = reviews.length;

        // Calculate revenue
        const totalRevenue = orders.reduce((sum, order) => {
            return sum + (order.totalAmount || 0);
        }, 0);

        const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

        // Calculate order status distribution
        const orderStatusCounts = {};
        orders.forEach(order => {
            const status = order.orderStatus || 'pending';
            orderStatusCounts[status] = (orderStatusCounts[status] || 0) + 1;
        });

        // Ensure all statuses are present
        const allStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
        allStatuses.forEach(status => {
            if (!orderStatusCounts[status]) {
                orderStatusCounts[status] = 0;
            }
        });

        // Calculate monthly revenue (last 6 months)
        const monthlyRevenue = [];
        const months = [];
        
        for (let i = 5; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            const monthName = date.toLocaleDateString('en-US', { month: 'short' });
            months.push(monthName);
            
            const monthOrders = orders.filter(order => {
                const orderDate = new Date(order.createdAt || order.orderDate || order.date || 0);
                return orderDate.getMonth() === date.getMonth() && 
                       orderDate.getFullYear() === date.getFullYear();
            });
            
            const monthRevenue = monthOrders.reduce((sum, order) => {
                return sum + (order.totalAmount || 0);
            }, 0);
            
            monthlyRevenue.push(monthRevenue);
        }

        // Calculate top categories
        const categoryCounts = {};
        products.forEach(product => {
            if (product.category) {
                categoryCounts[product.category] = (categoryCounts[product.category] || 0) + 1;
            }
        });

        const topCategories = Object.entries(categoryCounts)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5)
            .map(([category, count]) => ({ category, count }));

        // Calculate low stock products (important for inventory management)
        const lowStockProducts = products
            .filter(product => {
                // Assume low stock if no explicit stock field, use a threshold
                return product.stock !== undefined ? product.stock < 10 : false;
            })
            .sort((a, b) => (a.stock || 0) - (b.stock || 0))
            .slice(0, 5)
            .map(product => ({
                name: product.name,
                stock: product.stock || 0,
                category: product.category,
                price: product.price,
                image: product.image?.[0] || ''
            }));

        // Calculate revenue growth (current month vs previous month)
        const currentMonth = new Date();
        const previousMonth = new Date();
        previousMonth.setMonth(currentMonth.getMonth() - 1);
        
        const currentMonthOrders = orders.filter(order => {
            const orderDate = new Date(order.createdAt || order.orderDate || order.date || 0);
            return orderDate.getMonth() === currentMonth.getMonth() && 
                   orderDate.getFullYear() === currentMonth.getFullYear();
        });
        
        const previousMonthOrders = orders.filter(order => {
            const orderDate = new Date(order.createdAt || order.orderDate || order.date || 0);
            return orderDate.getMonth() === previousMonth.getMonth() && 
                   orderDate.getFullYear() === previousMonth.getFullYear();
        });
        
        const currentMonthRevenue = currentMonthOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
        const previousMonthRevenue = previousMonthOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
        
        const revenueGrowth = previousMonthRevenue > 0 
            ? ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100
            : currentMonthRevenue > 0 ? 100 : 0;

        // Get recent orders (last 5)
        const recentOrders = orders.slice(0, 5).map(order => ({
            _id: order._id,
            orderNumber: order._id.toString().slice(-6).toUpperCase(),
            customerName: order.userId?.name || 'Unknown User',
            amount: order.totalAmount || 0,
            status: order.orderStatus || 'pending',
            date: order.createdAt || order.orderDate || order.date
        }));

        // Calculate payment method distribution
        const paymentMethodCounts = {};
        orders.forEach(order => {
            const method = order.paymentMethod || 'unknown';
            paymentMethodCounts[method] = (paymentMethodCounts[method] || 0) + 1;
        });

        // Calculate review statistics
        const averageRating = reviews.length > 0 
            ? reviews.reduce((sum, review) => sum + (review.rating || 0), 0) / reviews.length 
            : 0;

        const dashboardStats = {
            // Basic counts
            totalOrders,
            totalProducts,
            totalUsers,
            totalCustomers: totalUsers, // Add totalCustomers alias for frontend compatibility
            totalReviews,
            totalRevenue,
            averageOrderValue,

            // Order status breakdown
            orderStatusDistribution: Object.entries(orderStatusCounts).map(([status, count]) => ({
                status: status.charAt(0).toUpperCase() + status.slice(1),
                count
            })),

            // Revenue data
            monthlyRevenue: {
                months,
                revenue: monthlyRevenue
            },

            // Category and inventory data
            topCategories,
            lowStockProducts,
            
            // Revenue insights
            revenueGrowth: Math.round(revenueGrowth * 10) / 10,
            currentMonthRevenue,
            previousMonthRevenue,

            // Recent orders
            recentOrders,

            // Payment methods
            paymentMethods: paymentMethodCounts,

            // Review data
            averageRating: Math.round(averageRating * 10) / 10,
            totalReviews,

            // Individual status counts for easy access
            pendingOrders: orderStatusCounts.pending || 0,
            processingOrders: orderStatusCounts.processing || 0,
            shippedOrders: orderStatusCounts.shipped || 0,
            deliveredOrders: orderStatusCounts.delivered || 0,
            cancelledOrders: orderStatusCounts.cancelled || 0,
            completedOrders: orderStatusCounts.delivered || 0
        };

        console.log('✅ Dashboard: Statistics calculated successfully');
        console.log('📊 Dashboard: Final stats:', dashboardStats);

        res.json({
            success: true,
            stats: dashboardStats
        });

    } catch (error) {
        console.log('❌ Dashboard: Error fetching statistics:', error);
        res.json({
            success: false,
            message: error.message
        });
    }
};

export { getDashboardStats };

