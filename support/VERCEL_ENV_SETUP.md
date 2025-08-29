# 🚀 Vercel Deployment Environment Variables Guide

## 📋 Environment Variables Setup for Each Project

### 🔧 Backend API (.env for Vercel)

Set these environment variables in your Vercel backend project dashboard:

```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/vortex_production

# Cloudinary Configuration
CLOUDINARY_API_KEY=your_production_api_key
CLOUDINARY_API_SECRET=your_production_api_secret
CLOUDINARY_NAME=your_production_cloud_name

# Authentication
JWT_SECRET=your_64_character_strong_secret_here_make_it_really_long_and_random

# Admin Configuration
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=your_strong_admin_password

# Email Service Configuration
EMAIL_SERVICE=gmail
EMAIL_USER=noreply@yourdomain.com
EMAIL_APP_PASSWORD=your_app_password
EMAIL_FROM_NAME=Vortex Clothing

# URLs (update after deployment)
FRONTEND_URL=https://your-frontend-domain.vercel.app
BACKEND_URL=https://your-backend-domain.vercel.app

# PayHere Configuration
PAYHERE_MERCHANT_ID=your_production_merchant_id
PAYHERE_MERCHANT_SECRET=your_production_merchant_secret

# Server Configuration
PORT=4000
NODE_ENV=production
```

### 🌐 Frontend (.env for Vercel)

Set these environment variables in your Vercel frontend project dashboard:

```env
# Backend API URL (update after backend deployment)
VITE_BACKEND_URL=https://your-backend-domain.vercel.app
VITE_API_URL=https://your-backend-domain.vercel.app/api

# PayHere Configuration
VITE_PAYHERE_MERCHANT_ID=your_production_merchant_id
VITE_PAYHERE_MERCHANT_SECRET=your_production_merchant_secret
VITE_PAYHERE_SANDBOX=false

# Build Configuration
NODE_ENV=production
```

### 👥 Admin Panel (.env for Vercel)

Set these environment variables in your Vercel admin project dashboard:

```env
# Backend API URL (update after backend deployment)
VITE_BACKEND_URL=https://your-backend-domain.vercel.app
VITE_API_URL=https://your-backend-domain.vercel.app/api

# Build Configuration
NODE_ENV=production
```

## 🔑 How to Set Environment Variables in Vercel

### Method 1: Vercel Dashboard
1. Go to your project dashboard on Vercel
2. Click on "Settings" tab
3. Click on "Environment Variables" in the sidebar
4. Add each variable with its value
5. Select the appropriate environment (Production, Preview, Development)

### Method 2: Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Set environment variables
vercel env add MONGODB_URI
vercel env add JWT_SECRET
# ... add all other variables
```

### Method 3: Using .env files (for development)
Create `.env.example` files in each project root:

**Backend/.env.example:**
```env
MONGODB_URI=your_mongodb_connection_string
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLOUDINARY_NAME=your_cloudinary_name
JWT_SECRET=your_jwt_secret
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_admin_password
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_APP_PASSWORD=your_app_password
EMAIL_FROM_NAME=Vortex Clothing
FRONTEND_URL=https://your-frontend-domain.vercel.app
BACKEND_URL=https://your-backend-domain.vercel.app
PAYHERE_MERCHANT_ID=your_merchant_id
PAYHERE_MERCHANT_SECRET=your_merchant_secret
PORT=4000
NODE_ENV=production
```

**Frontend/.env.example:**
```env
VITE_BACKEND_URL=https://your-backend-domain.vercel.app
VITE_API_URL=https://your-backend-domain.vercel.app/api
VITE_PAYHERE_MERCHANT_ID=your_merchant_id
VITE_PAYHERE_MERCHANT_SECRET=your_merchant_secret
VITE_PAYHERE_SANDBOX=false
NODE_ENV=production
```

## ⚠️ Important Security Notes

1. **Never commit .env files** to your repository
2. **Use strong passwords** and secrets (minimum 32 characters for JWT_SECRET)
3. **Enable MongoDB IP whitelist** for production
4. **Use production PayHere credentials** (not sandbox)
5. **Validate email service** configuration before deployment

## 🔄 Update Sequence

**Important:** Follow this order when setting up:

1. **Deploy Backend first** → Get backend URL
2. **Update CORS settings** in backend with frontend/admin URLs
3. **Deploy Frontend** → Get frontend URL
4. **Deploy Admin** → Get admin URL
5. **Update environment variables** with actual URLs
6. **Test all connections** between services

## 🚨 Common Issues & Solutions

### CORS Errors
- Ensure all frontend/admin URLs are added to backend CORS configuration
- Check that URLs match exactly (with/without trailing slashes)

### Environment Variable Issues
- Variable names are case-sensitive
- VITE_ prefix required for frontend environment variables
- Restart deployments after changing environment variables

### Database Connection
- Whitelist Vercel IPs in MongoDB Atlas (use 0.0.0.0/0 for all IPs)
- Check connection string format and credentials