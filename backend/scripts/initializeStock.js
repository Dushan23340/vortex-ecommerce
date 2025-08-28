import mongoose from 'mongoose';
import productModel from '../models/productModel.js';
import 'dotenv/config';

// Initialize stock for existing products
const initializeStock = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');
        
        // Find products without stock field or with undefined stock
        const productsToUpdate = await productModel.find({
            $or: [
                { stock: { $exists: false } },
                { stock: undefined },
                { stockStatus: { $exists: false } },
                { lowStockThreshold: { $exists: false } }
            ]
        });
        
        console.log(`Found ${productsToUpdate.length} products to update`);
        
        let updatedCount = 0;
        
        for (const product of productsToUpdate) {
            // Set default stock values for existing products
            const defaultStock = 50; // Default stock quantity
            const lowStockThreshold = 10;
            
            let stockStatus = 'In Stock';
            if (defaultStock === 0) {
                stockStatus = 'Out of Stock';
            } else if (defaultStock <= lowStockThreshold) {
                stockStatus = 'Low Stock';
            }
            
            const updateData = {};
            
            // Only update fields that don't exist or are undefined
            if (product.stock === undefined || !product.hasOwnProperty('stock')) {
                updateData.stock = defaultStock;
            }
            
            if (!product.stockStatus) {
                updateData.stockStatus = stockStatus;
            }
            
            if (!product.lowStockThreshold) {
                updateData.lowStockThreshold = lowStockThreshold;
            }
            
            if (Object.keys(updateData).length > 0) {
                await productModel.findByIdAndUpdate(product._id, updateData);
                console.log(`✅ Updated ${product.name} - Stock: ${updateData.stock || product.stock}, Status: ${updateData.stockStatus || product.stockStatus}`);
                updatedCount++;
            }
        }
        
        console.log(`\n🎉 Successfully updated ${updatedCount} products with stock information`);
        
        // Display updated product count by status
        const stockReport = await productModel.aggregate([
            {
                $group: {
                    _id: '$stockStatus',
                    count: { $sum: 1 },
                    totalStock: { $sum: '$stock' }
                }
            }
        ]);
        
        console.log('\n📊 Stock Report:');
        stockReport.forEach(status => {
            console.log(`${status._id}: ${status.count} products (Total stock: ${status.totalStock})`);
        });
        
    } catch (error) {
        console.error('Error initializing stock:', error);
    } finally {
        mongoose.connection.close();
        console.log('\n🔌 Database connection closed');
        process.exit(0);
    }
};

// Run the script
initializeStock();