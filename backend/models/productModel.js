import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {type:String, required:true},
    description: {type:String, required:true},
    price: {type:Number, required:true},
    image: {type:Array, required:true},
    category: {type:String, required:true},
    subCategory: {type:String, required:true},
    sizes: {type:Array, required:true},
    bestseller: {type:Boolean},
    date: {type: Number, required:true},
    averageRating: {type: Number, default: 0},
    reviewCount: {type: Number, default: 0},
    stock: {type: Number, default: 0, min: 0},
    stockStatus: {type: String, enum: ['In Stock', 'Low Stock', 'Out of Stock'], default: 'In Stock'},
    lowStockThreshold: {type: Number, default: 10}
})

const productModel = mongoose.models.product || mongoose.model('product', productSchema);

export default productModel;