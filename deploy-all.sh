#!/bin/bash

# 🚀 Vortex E-commerce Complete Deployment Script
# This script solves the circular deployment problem by automating the entire process

set -e  # Exit on any error

echo "🚀 Starting complete Vortex deployment to Vercel..."
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ] && [ ! -d "backend" ] && [ ! -d "frontend" ] && [ ! -d "admin" ]; then
    print_error "Please run this script from the Vortex project root directory"
    exit 1
fi

# Step 1: Deploy backend first
print_status "📦 Step 1: Deploying backend..."
cd backend

# Deploy backend and capture URL
print_status "Deploying backend to Vercel..."
BACKEND_URL=$(npx vercel --prod 2>&1 | grep -E 'https://.*\.vercel\.app' | tail -1 | tr -d '[:space:]')

if [ -z "$BACKEND_URL" ]; then
    print_error "Failed to get backend URL from deployment"
    exit 1
fi

print_success "Backend deployed: $BACKEND_URL"

# Step 2: Update frontend environment and deploy
print_status "📱 Step 2: Configuring and deploying frontend..."
cd ../frontend

# Update frontend environment variables
print_status "Updating frontend environment variables..."
echo "Removing old VITE_BACKEND_URL..."
npx vercel env rm VITE_BACKEND_URL production --yes 2>/dev/null || true

echo "Adding new VITE_BACKEND_URL: $BACKEND_URL"
echo "$BACKEND_URL" | npx vercel env add VITE_BACKEND_URL production

echo "Removing old VITE_API_URL..."
npx vercel env rm VITE_API_URL production --yes 2>/dev/null || true

echo "Adding new VITE_API_URL: $BACKEND_URL/api"
echo "$BACKEND_URL/api" | npx vercel env add VITE_API_URL production

# Add PayHere configuration
echo "Configuring PayHere environment variables..."
echo "1211149" | npx vercel env add VITE_PAYHERE_MERCHANT_ID production 2>/dev/null || true
echo "sandbox_secret" | npx vercel env add VITE_PAYHERE_MERCHANT_SECRET production 2>/dev/null || true
echo "true" | npx vercel env add VITE_PAYHERE_SANDBOX production 2>/dev/null || true

# Deploy frontend
print_status "Deploying frontend to Vercel..."
FRONTEND_URL=$(npx vercel --prod 2>&1 | grep -E 'https://.*\.vercel\.app' | tail -1 | tr -d '[:space:]')

if [ -z "$FRONTEND_URL" ]; then
    print_error "Failed to get frontend URL from deployment"
    exit 1
fi

print_success "Frontend deployed: $FRONTEND_URL"

# Step 3: Update admin environment and deploy
print_status "👨‍💼 Step 3: Configuring and deploying admin panel..."
cd ../admin

# Update admin environment variables
print_status "Updating admin environment variables..."
echo "Removing old VITE_BACKEND_URL..."
npx vercel env rm VITE_BACKEND_URL production --yes 2>/dev/null || true

echo "Adding new VITE_BACKEND_URL: $BACKEND_URL"
echo "$BACKEND_URL" | npx vercel env add VITE_BACKEND_URL production

echo "Removing old VITE_API_URL..."
npx vercel env rm VITE_API_URL production --yes 2>/dev/null || true

echo "Adding new VITE_API_URL: $BACKEND_URL/api"
echo "$BACKEND_URL/api" | npx vercel env add VITE_API_URL production

echo "Adding NODE_ENV..."
echo "production" | npx vercel env add VITE_NODE_ENV production 2>/dev/null || true

# Deploy admin
print_status "Deploying admin panel to Vercel..."
ADMIN_URL=$(npx vercel --prod 2>&1 | grep -E 'https://.*\.vercel\.app' | tail -1 | tr -d '[:space:]')

if [ -z "$ADMIN_URL" ]; then
    print_error "Failed to get admin URL from deployment"
    exit 1
fi

print_success "Admin panel deployed: $ADMIN_URL"

# Step 4: Update backend CORS and redeploy
print_status "🔧 Step 4: Updating backend CORS configuration..."
cd ../backend

# Add frontend and admin URLs to backend environment
print_status "Adding frontend and admin URLs to backend environment..."
echo "Removing old FRONTEND_URL..."
npx vercel env rm FRONTEND_URL production --yes 2>/dev/null || true

echo "Adding FRONTEND_URL: $FRONTEND_URL"
echo "$FRONTEND_URL" | npx vercel env add FRONTEND_URL production

echo "Removing old ADMIN_URL..."
npx vercel env rm ADMIN_URL production --yes 2>/dev/null || true

echo "Adding ADMIN_URL: $ADMIN_URL"
echo "$ADMIN_URL" | npx vercel env add ADMIN_URL production

# Final backend deployment with updated CORS
print_status "Final backend deployment with updated CORS..."
FINAL_BACKEND_URL=$(npx vercel --prod 2>&1 | grep -E 'https://.*\.vercel\.app' | tail -1 | tr -d '[:space:]')

print_success "Final backend deployment complete: $FINAL_BACKEND_URL"

# Step 5: Verification
print_status "🔍 Step 5: Testing deployments..."

echo ""
echo "Testing backend API..."
if curl -s "$FINAL_BACKEND_URL" | grep -q "API is working"; then
    print_success "Backend API is responding correctly"
else
    print_warning "Backend API test failed - please check manually"
fi

# Summary
echo ""
echo "=================================================="
print_success "🎉 Deployment Complete!"
echo "=================================================="
echo ""
echo "📱 Frontend URL:     $FRONTEND_URL"
echo "👨‍💼 Admin URL:        $ADMIN_URL" 
echo "🔧 Backend URL:      $FINAL_BACKEND_URL"
echo ""
echo "Next steps:"
echo "1. Test your frontend by visiting: $FRONTEND_URL"
echo "2. Test your admin panel by visiting: $ADMIN_URL"
echo "   - Login with: admin@gmail.com / vortex123"
echo "3. Check that products load correctly"
echo "4. Test user registration and login"
echo ""
print_warning "Note: If you see any CORS errors, wait a few minutes for Vercel's CDN to update"
echo ""
print_success "Your Vortex e-commerce platform is now live! 🚀"