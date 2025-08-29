# 🚀 VORTEX E-commerce Production Deployment Guide

## 📋 Pre-Deployment Checklist

### 1. Environment Configuration
- [ ] Update all .env files with production URLs
- [ ] Replace localhost URLs with your domain
- [ ] Configure production MongoDB database
- [ ] Set up production Cloudinary account
- [ ] Configure production email service
- [ ] Set up PayHere production account

### 2. Security Setup
- [ ] Generate strong JWT secret (min 64 characters)
- [ ] Set strong admin password
- [ ] Enable MongoDB authentication
- [ ] Configure SSL certificates
- [ ] Set up firewall rules

### 3. Build & Deploy
```bash
# Frontend build
cd frontend
npm run build

# Backend deploy
cd backend
npm start
```

## 🌐 Environment Variables for Production

### Backend (.env)
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/vortex_production
CLOUDINARY_API_KEY=your_production_api_key
CLOUDINARY_API_SECRET=your_production_api_secret
CLOUDINARY_NAME=your_production_cloud_name
JWT_SECRET=your_64_character_strong_secret_here
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=your_strong_admin_password
EMAIL_SERVICE=gmail
EMAIL_USER=noreply@yourdomain.com
EMAIL_APP_PASSWORD=your_app_password
EMAIL_FROM_NAME=Vortex Clothing
FRONTEND_URL=https://yourdomain.com
BACKEND_URL=https://api.yourdomain.com
PAYHERE_MERCHANT_ID=your_production_merchant_id
PAYHERE_MERCHANT_SECRET=your_production_merchant_secret
PORT=4000
```

### Frontend (.env)
```env
VITE_BACKEND_URL=https://api.yourdomain.com
VITE_PAYHERE_MERCHANT_ID=your_production_merchant_id
VITE_PAYHERE_MERCHANT_SECRET=your_production_merchant_secret
VITE_PAYHERE_SANDBOX=false
VITE_API_URL=https://api.yourdomain.com/api
```

## 🔧 Server Configuration

### Update CORS for Production
Edit `backend/server.js`:
```javascript
const corsOptions = {
  origin: [
    'https://yourdomain.com',
    'https://www.yourdomain.com'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
  optionsSuccessStatus: 200
};
```

## 📈 Performance Optimizations

### Frontend
- Build files are optimized automatically
- Images lazy-loaded with LazyImage component
- Proper error boundaries implemented

### Backend
- Database indexes on frequently queried fields
- Cloudinary for image optimization
- JWT token expiration properly set (7 days)

## 🛡️ Security Features

### Implemented
- ✅ JWT authentication with 7-day expiration
- ✅ Password hashing with bcrypt
- ✅ Email verification for password reset
- ✅ CORS protection
- ✅ Environment variable protection
- ✅ Input validation

### Recommended Additions
- [ ] Rate limiting for API endpoints
- [ ] Helmet.js for security headers
- [ ] Request logging and monitoring
- [ ] Database connection pooling

## 🚨 Critical Notes

1. **Never commit .env files** - They're now protected by .gitignore
2. **Update all localhost URLs** to your production domain
3. **Use HTTPS** in production for security
4. **Set up monitoring** for uptime and errors
5. **Regular database backups** are essential

## 📞 Support

For deployment issues, ensure:
- All environment variables are set correctly
- Database connection is working
- Domain DNS is properly configured
- SSL certificates are valid