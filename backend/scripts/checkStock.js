import mongoose from 'mongoose';
import productModel from '../models/productModel.js';
import 'dotenv/config';

// Check current stock status
const checkStock = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');
        
        // Get all products
        const products = await productModel.find({});
        console.log(`\n📦 Found ${products.length} products in database\n`);
        
        // Display each product's stock information
        products.forEach((product, index) => {
            console.log(`${index + 1}. ${product.name}`);
            console.log(`   Stock: ${product.stock || 'undefined'}`);
            console.log(`   Status: ${product.stockStatus || 'undefined'}`);
            console.log(`   Threshold: ${product.lowStockThreshold || 'undefined'}`);
            console.log(`   Price: Rs.${product.price}`);
            console.log(`   Category: ${product.category}`);
            console.log('   ---');
        });
        
        // Generate stock report
        const stockReport = await productModel.aggregate([
            {
                $group: {
                    _id: '$stockStatus',
                    count: { $sum: 1 },
                    totalStock: { $sum: '$stock' },
                    averageStock: { $avg: '$stock' }
                }
            }
        ]);
        
        console.log('\n📊 Stock Summary:');
        stockReport.forEach(status => {
            console.log(`${status._id || 'Undefined'}: ${status.count} products`);
            console.log(`   Total Stock: ${status.totalStock || 0}`);
            console.log(`   Average Stock: ${Math.round((status.averageStock || 0) * 10) / 10}`);
            console.log('');
        });
        
        // Check for products without stock fields
        const noStockProducts = await productModel.find({
            $or: [
                { stock: { $exists: false } },
                { stock: undefined },
                { stock: null }
            ]
        });
        
        if (noStockProducts.length > 0) {
            console.log(`⚠️  ${noStockProducts.length} products need stock initialization:`);
            noStockProducts.forEach(product => {
                console.log(`   - ${product.name}`);
            });
        } else {
            console.log('✅ All products have stock information');
        }
        
    } catch (error) {
        console.error('Error checking stock:', error);
    } finally {
        mongoose.connection.close();
        console.log('\n🔌 Database connection closed');
        process.exit(0);
    }
};

// Run the script
checkStock();