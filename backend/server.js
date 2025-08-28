import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import userRouter from './routes/userRoute.js'
import productRouter from './routes/productRoute.js'
import orderRouter from './routes/orderRoute.js'
import paymentRouter from './routes/paymentRoute.js'
import reviewRouter from './routes/reviewRoute.js'
import dashboardRouter from './routes/dashboardRoute.js'
import contactRouter from './routes/contactRoute.js'


//App config
const app = express()
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()


//middlewares
app.use(express.json())

// CORS configuration for frontend access
const corsOptions = {
  origin: [
    // Development URLs
    'http://localhost:5173',  // Vite default
    'http://localhost:5174',  // Alternative Vite port
    'http://localhost:5175',  // Previous frontend port
    'http://localhost:5176',  // Previous frontend port
    'http://localhost:5177',  // Current frontend port
    'http://localhost:5178',  // Current frontend port
    'http://localhost:5179',  // Current admin port
    'http://localhost:3000',   // React default
    
    // Production URLs - Vercel deployed applications (Current)
    'https://vortex-frontend-omiqn1b60-dushans-projects-966fc3a3.vercel.app',
    'https://vortex-admin-hylbcpsrk-dushans-projects-966fc3a3.vercel.app',
    'https://vortex-frontend-j6cl7870z-dushans-projects-966fc3a3.vercel.app',
    'https://vortex-admin-p2quko6jz-dushans-projects-966fc3a3.vercel.app',
    
    // Production URLs - Previous deployments (Keep for compatibility)
    'https://vortex-frontend-bp5wntbsa-dushans-projects-966fc3a3.vercel.app',
    'https://vortex-admin-5id903yz5-dushans-projects-966fc3a3.vercel.app',
    'https://vortex-frontend-4h910ysbz-dushans-projects-966fc3a3.vercel.app',
    'https://vortex-admin-m86fvpn0y-dushans-projects-966fc3a3.vercel.app',
    'https://vortex-admin-23sqd7smc-dushans-projects-966fc3a3.vercel.app',
    
    // Add your custom domains here when available
    // 'https://your-custom-domain.com',
    // 'https://www.your-custom-domain.com',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'Origin', 
    'Accept', 
    'token',           // Admin authentication token
    'X-Requested-With',
    'Access-Control-Request-Method',
    'Access-Control-Request-Headers'
  ],
  exposedHeaders: ['token'],
  optionsSuccessStatus: 200,
  maxAge: 86400 // 24 hours cache for preflight requests
};

app.use(cors(corsOptions));

// Handle preflight requests for all routes
app.options('*', cors(corsOptions));

//api endpoints
app.use('/api/user', userRouter)
app.use('/api/product', productRouter)
app.use('/api/order', orderRouter)
app.use('/api/payment', paymentRouter)
app.use('/api/review', reviewRouter)
app.use('/api/dashboard', dashboardRouter)
app.use('/api/contact', contactRouter)

app.get('/', (req,res)=>{
    res.send("API is working")
})

app.listen(port, ()=> console.log('Server started on PORT :' + port))