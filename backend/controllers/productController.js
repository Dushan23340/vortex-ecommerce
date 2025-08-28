import {v2 as cloudinary} from "cloudinary"
import productModel from '../models/productModel.js'



// function for add product
const addProduct = async (req,res) => {
    try {
        const { name, description, price, category, subCategory, sizes, bestseller, stock } = req.body

        console.log('=== ADD PRODUCT DEBUG ===');
        console.log('Received bestseller value:', bestseller);
        console.log('Type of bestseller:', typeof bestseller);
        console.log('Bestseller === "true":', bestseller === "true");
        console.log('Bestseller === true:', bestseller === true);
        console.log('Bestseller === "1":', bestseller === "1");
        console.log('Bestseller === 1:', bestseller === 1);

        const files = req.files || {}
        const image1 = files.image1 && files.image1[0]
        const image2 = files.image2 && files.image2[0]
        const image3 = files.image3 && files.image3[0]
        const image4 = files.image4 && files.image4[0]

        const images = [image1,image2,image3,image4].filter((item )=> item && item.path)

        let imagesUrl = await Promise.all(
            images.map(async (item)=>{
                const result = await cloudinary.uploader.upload(item.path, {resource_type: 'image'});
                return result.secure_url
            })
        )

        // Safely parse sizes: accept JSON array or comma-separated string
        let parsedSizes = []
        if (Array.isArray(sizes)) {
            parsedSizes = sizes
        } else if (typeof sizes === 'string') {
            const trimmed = sizes.trim()
            if (trimmed.startsWith('[')) {
                try { parsedSizes = JSON.parse(trimmed) } catch { parsedSizes = [] }
            } else {
                parsedSizes = trimmed
                    .split(',')
                    .map(s => s.replace(/^['"]|['"]$/g,'').trim())
                    .filter(Boolean)
            }
        }

        // Calculate stock status based on stock quantity
        const stockQuantity = Number(stock) || 0;
        const lowStockThreshold = 10;
        let stockStatus = 'Out of Stock';
        
        if (stockQuantity > lowStockThreshold) {
            stockStatus = 'In Stock';
        } else if (stockQuantity > 0) {
            stockStatus = 'Low Stock';
        }

        const productData = {
            name,
            description,
            category,
            price: Number(price),
            subCategory,
            bestseller: bestseller === "true" || bestseller === true || bestseller === "1" || bestseller === 1,
            sizes: parsedSizes,
            image: imagesUrl,
            date: Date.now(),
            stock: stockQuantity,
            stockStatus: stockStatus,
            lowStockThreshold: lowStockThreshold
        }

        console.log(productData);
        console.log('Final bestseller value:', productData.bestseller);
        console.log('Final bestseller type:', typeof productData.bestseller);

        const product = new productModel(productData);
        await product.save()
        

        res.json({success: true, message: "Product added successfully"})
        
        

    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message})
    }


}

// function for updating product
const updateProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const { name, description, price, category, subCategory, sizes, bestseller, stock } = req.body;

        console.log('=== UPDATE PRODUCT DEBUG ===');
        console.log('Product ID:', productId);
        console.log('Received data:', req.body);

        // Find the existing product
        const existingProduct = await productModel.findById(productId);
        if (!existingProduct) {
            return res.json({ success: false, message: "Product not found" });
        }

        // Handle file uploads (if any new images are provided)
        const files = req.files || {};
        const image1 = files.image1 && files.image1[0];
        const image2 = files.image2 && files.image2[0];
        const image3 = files.image3 && files.image3[0];
        const image4 = files.image4 && files.image4[0];

        const newImages = [image1, image2, image3, image4].filter((item) => item && item.path);

        let imagesUrl = existingProduct.image; // Keep existing images by default

        // If new images are uploaded, replace them
        if (newImages.length > 0) {
            const uploadedImages = await Promise.all(
                newImages.map(async (item) => {
                    const result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
                    return result.secure_url;
                })
            );
            
            // Replace existing images with new ones
            imagesUrl = [...uploadedImages];
            
            // If fewer images uploaded than before, keep the remaining old ones
            if (uploadedImages.length < existingProduct.image.length) {
                const remainingOldImages = existingProduct.image.slice(uploadedImages.length);
                imagesUrl = [...uploadedImages, ...remainingOldImages];
            }
        }

        // Parse sizes if provided as string
        let parsedSizes = sizes;
        if (typeof sizes === 'string') {
            try {
                parsedSizes = JSON.parse(sizes);
            } catch (parseError) {
                console.log('Error parsing sizes:', parseError);
                return res.json({ success: false, message: "Invalid sizes format" });
            }
        }

        // Validate and set stock
        const stockQuantity = stock ? Number(stock) : existingProduct.stock;
        if (isNaN(stockQuantity) || stockQuantity < 0) {
            return res.json({ success: false, message: "Invalid stock quantity" });
        }

        // Calculate stock status
        const lowStockThreshold = existingProduct.lowStockThreshold || 10;
        let stockStatus = 'Out of Stock';
        if (stockQuantity > lowStockThreshold) {
            stockStatus = 'In Stock';
        } else if (stockQuantity > 0) {
            stockStatus = 'Low Stock';
        }

        // Prepare update data
        const updateData = {
            name: name || existingProduct.name,
            description: description || existingProduct.description,
            price: price ? Number(price) : existingProduct.price,
            category: category || existingProduct.category,
            subCategory: subCategory || existingProduct.subCategory,
            bestseller: bestseller !== undefined ? (bestseller === "true" || bestseller === true || bestseller === "1" || bestseller === 1) : existingProduct.bestseller,
            sizes: parsedSizes || existingProduct.sizes,
            image: imagesUrl,
            stock: stockQuantity,
            stockStatus: stockStatus,
            updatedAt: Date.now()
        };

        console.log('Update data:', updateData);

        // Update the product
        const updatedProduct = await productModel.findByIdAndUpdate(
            productId,
            updateData,
            { new: true }
        );

        res.json({
            success: true,
            message: "Product updated successfully",
            product: updatedProduct
        });

    } catch (error) {
        console.log('Update product error:', error);
        res.json({ success: false, message: error.message });
    }
};

// function for list product
const listProducts = async (req,res) => {
    try{

    const products = await productModel.find({});
        res.json({success:true, products})
    

    } catch(error) {
        console.log(error)
        res.json({success:false, message:error.message})
        

    }

}

//function for removing products
const removeProduct = async (req,res) => {
    try {
        await productModel.findByIdAndDelete(req.body.id)
        res.json({success:true, message:"Product successfully removed"})



    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
        
    }

}


// function for single product info
const singleProduct = async (req,res) => {
    try {
        const {productId} = req.body
        const product = await productModel.findById(productId)
        res.json({success:true, product})


    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
        
    }



}

// function for updating product stock
const updateStock = async (req, res) => {
    try {
        const { productId, quantity, operation } = req.body;
        
        if (!productId || quantity === undefined) {
            return res.json({ success: false, message: "Product ID and quantity are required" });
        }
        
        const product = await productModel.findById(productId);
        if (!product) {
            return res.json({ success: false, message: "Product not found" });
        }
        
        let newStock;
        if (operation === 'set') {
            newStock = Number(quantity);
        } else if (operation === 'add') {
            newStock = (product.stock || 0) + Number(quantity);
        } else if (operation === 'subtract') {
            newStock = Math.max(0, (product.stock || 0) - Number(quantity));
        } else {
            return res.json({ success: false, message: "Invalid operation. Use 'set', 'add', or 'subtract'" });
        }
        
        // Calculate stock status
        const lowStockThreshold = product.lowStockThreshold || 10;
        let stockStatus = 'Out of Stock';
        
        if (newStock > lowStockThreshold) {
            stockStatus = 'In Stock';
        } else if (newStock > 0) {
            stockStatus = 'Low Stock';
        }
        
        const updatedProduct = await productModel.findByIdAndUpdate(
            productId,
            { 
                stock: newStock, 
                stockStatus: stockStatus 
            },
            { new: true }
        );
        
        res.json({
            success: true,
            message: `Stock updated successfully. New stock: ${newStock}`,
            product: updatedProduct
        });
        
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// function for bulk stock update
const bulkUpdateStock = async (req, res) => {
    try {
        const { updates } = req.body; // Array of {productId, quantity, operation}
        
        if (!updates || !Array.isArray(updates)) {
            return res.json({ success: false, message: "Updates array is required" });
        }
        
        const results = [];
        
        for (const update of updates) {
            const { productId, quantity, operation } = update;
            
            try {
                const product = await productModel.findById(productId);
                if (!product) {
                    results.push({ productId, success: false, message: "Product not found" });
                    continue;
                }
                
                let newStock;
                if (operation === 'set') {
                    newStock = Number(quantity);
                } else if (operation === 'add') {
                    newStock = (product.stock || 0) + Number(quantity);
                } else if (operation === 'subtract') {
                    newStock = Math.max(0, (product.stock || 0) - Number(quantity));
                } else {
                    results.push({ productId, success: false, message: "Invalid operation" });
                    continue;
                }
                
                // Calculate stock status
                const lowStockThreshold = product.lowStockThreshold || 10;
                let stockStatus = 'Out of Stock';
                
                if (newStock > lowStockThreshold) {
                    stockStatus = 'In Stock';
                } else if (newStock > 0) {
                    stockStatus = 'Low Stock';
                }
                
                await productModel.findByIdAndUpdate(
                    productId,
                    { 
                        stock: newStock, 
                        stockStatus: stockStatus 
                    }
                );
                
                results.push({ 
                    productId, 
                    success: true, 
                    newStock, 
                    stockStatus,
                    message: `Stock updated to ${newStock}` 
                });
                
            } catch (error) {
                results.push({ productId, success: false, message: error.message });
            }
        }
        
        res.json({
            success: true,
            message: "Bulk stock update completed",
            results: results
        });
        
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// function for getting low stock products
const getLowStockProducts = async (req, res) => {
    try {
        const { threshold } = req.query;
        const stockThreshold = threshold ? Number(threshold) : 10;
        
        const lowStockProducts = await productModel.find({
            $or: [
                { stock: { $lte: stockThreshold, $gt: 0 } },
                { stockStatus: 'Low Stock' }
            ]
        }).sort({ stock: 1 });
        
        res.json({
            success: true,
            products: lowStockProducts,
            count: lowStockProducts.length,
            threshold: stockThreshold
        });
        
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// function for getting out of stock products
const getOutOfStockProducts = async (req, res) => {
    try {
        const outOfStockProducts = await productModel.find({
            $or: [
                { stock: 0 },
                { stockStatus: 'Out of Stock' }
            ]
        });
        
        res.json({
            success: true,
            products: outOfStockProducts,
            count: outOfStockProducts.length
        });
        
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// function for stock report
const getStockReport = async (req, res) => {
    try {
        const totalProducts = await productModel.countDocuments({});
        const inStockProducts = await productModel.countDocuments({ stockStatus: 'In Stock' });
        const lowStockProducts = await productModel.countDocuments({ stockStatus: 'Low Stock' });
        const outOfStockProducts = await productModel.countDocuments({ stockStatus: 'Out of Stock' });
        
        // Calculate total stock value
        const products = await productModel.find({}, 'stock price');
        const totalStockValue = products.reduce((total, product) => {
            return total + ((product.stock || 0) * (product.price || 0));
        }, 0);
        
        // Get category-wise stock
        const categoryStock = await productModel.aggregate([
            {
                $group: {
                    _id: '$category',
                    totalStock: { $sum: '$stock' },
                    productCount: { $sum: 1 },
                    averageStock: { $avg: '$stock' },
                    lowStockCount: {
                        $sum: {
                            $cond: [{ $eq: ['$stockStatus', 'Low Stock'] }, 1, 0]
                        }
                    },
                    outOfStockCount: {
                        $sum: {
                            $cond: [{ $eq: ['$stockStatus', 'Out of Stock'] }, 1, 0]
                        }
                    }
                }
            },
            { $sort: { totalStock: -1 } }
        ]);
        
        res.json({
            success: true,
            report: {
                overview: {
                    totalProducts,
                    inStockProducts,
                    lowStockProducts,
                    outOfStockProducts,
                    totalStockValue: Math.round(totalStockValue * 100) / 100
                },
                categoryBreakdown: categoryStock
            }
        });
        
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export {listProducts, addProduct, removeProduct, singleProduct, updateProduct, updateStock, bulkUpdateStock, getLowStockProducts, getOutOfStockProducts, getStockReport}

