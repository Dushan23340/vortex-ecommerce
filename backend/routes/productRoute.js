import express from "express"
import { listProducts, addProduct, removeProduct, singleProduct, updateProduct, updateStock, bulkUpdateStock, getLowStockProducts, getOutOfStockProducts, getStockReport } from "../controllers/productController.js"
import upload from "../middleware/multer.js";
import adminAuth from "../middleware/adminAuth.js";


const productRouter = express.Router();

productRouter.post('/add',adminAuth, upload.fields([{name:'image1', maxCount:1},{name:'image2', maxCount:1},{name:'image3', maxCount:1},{name:'image4', maxCount:1}]), addProduct);
productRouter.put('/update/:productId',adminAuth, upload.fields([{name:'image1', maxCount:1},{name:'image2', maxCount:1},{name:'image3', maxCount:1},{name:'image4', maxCount:1}]), updateProduct);
productRouter.post('/remove',adminAuth, removeProduct);
productRouter.post('/single', singleProduct);
productRouter.get('/list', listProducts);

// Stock Management Routes
productRouter.post('/stock/update', adminAuth, updateStock);
productRouter.post('/stock/bulk-update', adminAuth, bulkUpdateStock);
productRouter.get('/stock/low-stock', adminAuth, getLowStockProducts);
productRouter.get('/stock/out-of-stock', adminAuth, getOutOfStockProducts);
productRouter.get('/stock/report', adminAuth, getStockReport);

export default productRouter;