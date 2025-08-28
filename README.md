# 🛍️ VORTEX E-Commerce Platform

A full-stack e-commerce platform built with modern web technologies, featuring a customer-facing storefront, comprehensive admin panel, and robust backend API.

## ✨ Features

### 🛒 Customer Features
- **User Authentication** - Register, login, email verification
- **Product Browsing** - Advanced filtering, search, and categories
- **Shopping Cart** - Add to cart, wishlist functionality
- **Sri Lankan Delivery** - Intelligent delivery fee calculation for all districts
- **Payment Integration** - PayHere payment gateway integration
- **Order Management** - Track orders, order history
- **Responsive Design** - Mobile-first, modern UI/UX

### 👨‍💼 Admin Features
- **Product Management** - Add, edit, delete products with image upload
- **Dynamic Sizing** - Different size options (S,M,L,XL,XXL for topwear, inches for bottomwear)
- **Order Management** - View, update order status
- **Dashboard Analytics** - Sales overview, order statistics
- **Contact Management** - Handle customer inquiries
- **Review Management** - Moderate product reviews

### 🔧 Technical Features
- **Email System** - Automated emails for orders, password reset
- **Image Management** - Cloudinary integration for optimized images
- **Secure Authentication** - JWT tokens with bcrypt password hashing
- **Database** - MongoDB with Mongoose ODM
- **API Documentation** - RESTful API design

## 🚀 Tech Stack

### Frontend
- **React 18** - Modern functional components with hooks
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Context API** - State management
- **React Toastify** - User notifications

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication tokens
- **Bcrypt** - Password hashing
- **Cloudinary** - Image storage and optimization
- **Nodemailer** - Email sending

### Admin Panel
- **React + Vite** - Same tech stack as frontend
- **Separate deployment** - Independent admin interface

## 📁 Project Structure

```
vortex-ecommerce/
├── frontend/          # Customer-facing React app
├── backend/           # Node.js Express API
├── admin/            # Admin panel React app
├── .gitignore        # Git ignore rules
└── README.md         # This file
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account
- Cloudinary account
- Gmail account (for emails)

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Fill in your environment variables in .env
npm run server
```

### Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
# Update backend URL in .env
npm run dev
```

### Admin Panel Setup
```bash
cd admin
npm install
cp .env.example .env
# Update backend URL in .env
npm run dev
```

## 🌍 Environment Variables

### Backend (.env)
```env
MONGODB_URI=your_mongodb_connection_string
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
CLOUDINARY_NAME=your_cloudinary_name
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_gmail_address
EMAIL_APP_PASSWORD=your_gmail_app_password
PAYHERE_MERCHANT_ID=your_payhere_merchant_id
PAYHERE_MERCHANT_SECRET=your_payhere_secret
```

### Frontend (.env)
```env
VITE_BACKEND_URL=http://localhost:4000
VITE_PAYHERE_MERCHANT_ID=your_payhere_merchant_id
```

## 🚀 Deployment

This project is ready for production deployment on:
- **Frontend & Admin:** Vercel, Netlify
- **Backend:** Railway, Render, Heroku

See `PRODUCTION_DEPLOYMENT_GUIDE.md` for detailed deployment instructions.

## 📱 Key Features Deep Dive

### Sri Lankan Delivery System
- Comprehensive district coverage (all 25 districts)
- Zone-based pricing (4 zones)
- Multiple delivery services (Standard, Express, Same-day)
- Free delivery thresholds
- Real-time calculation

### Dynamic Product Sizing
- **Topwear/Winterwear:** S, M, L, XL, XXL
- **Bottomwear:** 28", 30", 32", 34", 36", 38", 40", 42", 44"
- Automatic size selection based on product category

### Payment Integration
- PayHere gateway integration
- Sandbox and production modes
- Secure payment processing
- Order confirmation emails

## 🔐 Security Features

- JWT authentication with 7-day expiration
- Password hashing with bcrypt
- CORS protection
- Environment variable protection
- Input validation and sanitization

## 📊 Admin Dashboard

- Sales analytics and statistics
- Order management system
- Product inventory management
- Customer contact message handling
- Review moderation system

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📧 Contact

For support or inquiries, please contact through the admin panel or create an issue in this repository.

---

**Built with ❤️ for the Sri Lankan market**