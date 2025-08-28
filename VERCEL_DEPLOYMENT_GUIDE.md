# 🚀 Complete Vercel Deployment Guide for Vortex E-commerce

## 📋 Pre-Deployment Checklist

- [ ] GitHub repository is up to date with all code
- [ ] All environment variables are ready (see VERCEL_ENV_SETUP.md)
- [ ] MongoDB Atlas database is set up
- [ ] Cloudinary account is configured
- [ ] PayHere merchant account is ready
- [ ] Email service (Gmail App Password) is configured

## 🔧 Step-by-Step Deployment Process

### Phase 1: Deploy Backend API

#### 1.1 Create New Vercel Project for Backend
```bash
# Navigate to your project
cd /Users/dushanchamuditha/Desktop/Vortex

# Install Vercel CLI if not installed
npm install -g vercel

# Login to Vercel
vercel login
```

#### 1.2 Deploy Backend
```bash
# Navigate to backend folder
cd backend

# Deploy to Vercel
vercel

# Follow the prompts:
# - Set up and deploy? Y
# - Which scope? (select your account)
# - Link to existing project? N
# - Project name: vortex-backend (or your preferred name)
# - Directory: ./
# - Override settings? N
```

#### 1.3 Set Backend Environment Variables
In Vercel Dashboard → Your Backend Project → Settings → Environment Variables:

Add all variables from `VERCEL_ENV_SETUP.md` backend section.

#### 1.4 Get Backend URL
After deployment, note your backend URL (e.g., `https://vortex-backend.vercel.app`)

### Phase 2: Update Configuration Files

#### 2.1 Update Frontend Vercel Config
```bash
cd ../frontend
```

Edit `vercel.json` and replace `your-backend-domain.vercel.app` with your actual backend URL.

#### 2.2 Update Admin Vercel Config
```bash
cd ../admin
```

Edit `vercel.json` and replace `your-backend-domain.vercel.app` with your actual backend URL.

#### 2.3 Update Backend CORS
Edit `backend/server.js` and add your actual Vercel URLs to the CORS origin array.

### Phase 3: Deploy Frontend

#### 3.1 Deploy Frontend
```bash
cd ../frontend

# Deploy to Vercel
vercel

# Follow the prompts:
# - Set up and deploy? Y
# - Which scope? (select your account)
# - Link to existing project? N
# - Project name: vortex-frontend (or your preferred name)
# - Directory: ./
# - Override settings? N
```

#### 3.2 Set Frontend Environment Variables
In Vercel Dashboard → Your Frontend Project → Settings → Environment Variables:

Add all variables from `VERCEL_ENV_SETUP.md` frontend section.

#### 3.3 Configure Build Settings
Ensure these build settings in Vercel Dashboard:
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

### Phase 4: Deploy Admin Panel

#### 4.1 Deploy Admin
```bash
cd ../admin

# Deploy to Vercel
vercel

# Follow the prompts:
# - Set up and deploy? Y
# - Which scope? (select your account)
# - Link to existing project? N
# - Project name: vortex-admin (or your preferred name)
# - Directory: ./
# - Override settings? N
```

#### 4.2 Set Admin Environment Variables
In Vercel Dashboard → Your Admin Project → Settings → Environment Variables:

Add all variables from `VERCEL_ENV_SETUP.md` admin section.

### Phase 5: Final Configuration Updates

#### 5.1 Update Backend CORS with Actual URLs
After getting your frontend and admin URLs, update `backend/server.js`:

```javascript
const corsOptions = {
  origin: [
    // Your actual deployed URLs
    'https://your-actual-frontend-url.vercel.app',
    'https://your-actual-admin-url.vercel.app',
    // Development URLs (keep for testing)
    'http://localhost:5173',
    'http://localhost:5174',
    // ... other localhost URLs
  ],
  // ... rest of config
};
```

#### 5.2 Redeploy Backend with Updated CORS
```bash
cd backend
vercel --prod
```

#### 5.3 Update Environment Variables with Actual URLs
Update these in all three projects:
- `FRONTEND_URL` in backend
- `BACKEND_URL` in backend
- `VITE_BACKEND_URL` in frontend
- `VITE_API_URL` in frontend
- `VITE_BACKEND_URL` in admin
- `VITE_API_URL` in admin

### Phase 6: Testing & Verification

#### 6.1 Test Backend API
```bash
# Test if backend is responding
curl https://your-backend-url.vercel.app/

# Should return: "API is working"
```

#### 6.2 Test Frontend
1. Visit your frontend URL
2. Test user registration
3. Test product browsing
4. Test cart functionality

#### 6.3 Test Admin Panel
1. Visit your admin URL
2. Test admin login
3. Test product management
4. Test dashboard functionality

## 🌐 Custom Domain Setup (Optional)

### 6.4 Add Custom Domain
1. Go to Vercel Dashboard → Project → Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed
4. Update environment variables with custom domain URLs

## 🔄 Deployment Commands Summary

```bash
# Backend deployment
cd backend
vercel --prod

# Frontend deployment
cd frontend
vercel --prod

# Admin deployment
cd admin
vercel --prod
```

## 🚨 Troubleshooting Common Issues

### Issue: CORS Error
**Solution:** 
- Check backend CORS configuration includes all frontend/admin URLs
- Ensure URLs match exactly (trailing slashes matter)

### Issue: Environment Variables Not Loading
**Solution:**
- Check variable names (case-sensitive)
- Ensure VITE_ prefix for frontend variables
- Redeploy after changing environment variables

### Issue: Build Failures
**Solution:**
- Check build logs in Vercel dashboard
- Ensure all dependencies are in package.json
- Check for TypeScript/ESLint errors

### Issue: API Connection Failed
**Solution:**
- Verify backend URL in frontend environment variables
- Check backend deployment status
- Test backend API endpoint directly

### Issue: Database Connection Failed
**Solution:**
- Verify MongoDB connection string
- Check MongoDB Atlas IP whitelist (add 0.0.0.0/0 for Vercel)
- Verify database credentials

## 📱 Mobile Testing

After deployment, test on mobile devices:
- Responsive design
- Touch interactions
- Payment flow
- Image loading

## 🔒 Security Checklist

- [ ] All environment variables are set correctly
- [ ] No sensitive data in client-side code
- [ ] HTTPS is enforced
- [ ] Database access is restricted
- [ ] Strong passwords are used
- [ ] JWT secret is secure (64+ characters)

## 📈 Performance Optimization

- [ ] Images are optimized (Cloudinary handles this)
- [ ] Lazy loading is implemented
- [ ] API responses are cached where appropriate
- [ ] Build is minified and compressed

## 🎉 Post-Deployment

1. **Monitor:** Set up monitoring for uptime and errors
2. **Backup:** Regular database backups
3. **Updates:** Plan for regular updates and maintenance
4. **Analytics:** Set up analytics tracking
5. **SEO:** Configure meta tags and sitemap

Your Vortex e-commerce platform is now live on Vercel! 🚀