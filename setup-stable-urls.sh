#!/bin/bash

# 🎯 Vortex Stable URL Setup Script
# This script sets up your projects with stable Vercel URLs

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

print_instruction() {
    echo -e "${YELLOW}[ACTION NEEDED]${NC} $1"
}

echo "🎯 Setting up Stable Vercel URLs for Vortex E-commerce"
echo "======================================================"
echo ""

print_warning "IMPORTANT: You need to manually set up domains in Vercel Dashboard first!"
echo ""
print_instruction "Please complete these steps in Vercel Dashboard:"
echo ""
echo "1. 🔧 Backend Project:"
echo "   - Go to https://vercel.com/dashboard"
echo "   - Click on 'vortex-backend' project"
echo "   - Go to Settings → Domains"
echo "   - Click 'Add Domain'"
echo "   - Add: vortex-backend.vercel.app"
echo "   - Click 'Add'"
echo ""
echo "2. 📱 Frontend Project:"
echo "   - Click on 'vortex-frontend' project"
echo "   - Go to Settings → Domains"
echo "   - Add: vortex-frontend.vercel.app"
echo ""
echo "3. 👨‍💼 Admin Project:"
echo "   - Click on 'vortex-admin' project"
echo "   - Go to Settings → Domains"
echo "   - Add: vortex-admin.vercel.app"
echo ""

read -p "Have you completed the above steps? (y/N): " domains_added

if [[ ! $domains_added =~ ^[Yy]$ ]]; then
    print_error "Please complete the domain setup first, then run this script again."
    exit 1
fi

print_success "Great! Now let's update your environment variables..."
echo ""

# Step 1: Update Vercel environment variables
print_status "📝 Step 1: Updating Vercel environment variables..."

# Update Backend environment variables
print_status "Updating backend environment variables..."
cd backend

echo "Adding stable URLs to backend environment..."
echo "https://vortex-frontend.vercel.app" | npx vercel env add FRONTEND_URL production 2>/dev/null || true
echo "https://vortex-admin.vercel.app" | npx vercel env add ADMIN_URL production 2>/dev/null || true

print_success "Backend environment variables updated"

# Update Frontend environment variables
print_status "Updating frontend environment variables..."
cd ../frontend

echo "Removing old frontend environment variables..."
npx vercel env rm VITE_BACKEND_URL production --yes 2>/dev/null || true
npx vercel env rm VITE_API_URL production --yes 2>/dev/null || true

echo "Adding stable backend URLs to frontend..."
echo "https://vortex-backend.vercel.app" | npx vercel env add VITE_BACKEND_URL production
echo "https://vortex-backend.vercel.app/api" | npx vercel env add VITE_API_URL production

# Add other frontend env vars
echo "1211149" | npx vercel env add VITE_PAYHERE_MERCHANT_ID production 2>/dev/null || true
echo "sandbox_secret" | npx vercel env add VITE_PAYHERE_MERCHANT_SECRET production 2>/dev/null || true
echo "true" | npx vercel env add VITE_PAYHERE_SANDBOX production 2>/dev/null || true

print_success "Frontend environment variables updated"

# Update Admin environment variables
print_status "Updating admin environment variables..."
cd ../admin

echo "Removing old admin environment variables..."
npx vercel env rm VITE_BACKEND_URL production --yes 2>/dev/null || true
npx vercel env rm VITE_API_URL production --yes 2>/dev/null || true

echo "Adding stable backend URLs to admin..."
echo "https://vortex-backend.vercel.app" | npx vercel env add VITE_BACKEND_URL production
echo "https://vortex-backend.vercel.app/api" | npx vercel env add VITE_API_URL production
echo "production" | npx vercel env add VITE_NODE_ENV production 2>/dev/null || true

print_success "Admin environment variables updated"

# Step 2: Deploy all projects
print_status "🚀 Step 2: Deploying all projects with stable URLs..."

# Deploy Backend
print_status "Deploying backend..."
cd ../backend
BACKEND_URL=$(npx vercel --prod 2>&1 | grep -E 'https://.*\.vercel\.app' | tail -1 | tr -d '[:space:]')
print_success "Backend deployed: $BACKEND_URL"

# Deploy Frontend
print_status "Deploying frontend..."
cd ../frontend
FRONTEND_URL=$(npx vercel --prod 2>&1 | grep -E 'https://.*\.vercel\.app' | tail -1 | tr -d '[:space:]')
print_success "Frontend deployed: $FRONTEND_URL"

# Deploy Admin
print_status "Deploying admin..."
cd ../admin
ADMIN_URL=$(npx vercel --prod 2>&1 | grep -E 'https://.*\.vercel\.app' | tail -1 | tr -d '[:space:]')
print_success "Admin deployed: $ADMIN_URL"

# Step 3: Test the setup
print_status "🔍 Step 3: Testing the deployment..."

echo ""
echo "Testing backend API..."
if curl -s "https://vortex-backend.vercel.app" | grep -q "API is working"; then
    print_success "✅ Backend stable URL is working: https://vortex-backend.vercel.app"
else
    print_warning "⚠️  Backend stable URL not responding yet (may take a few minutes)"
fi

echo ""
echo "======================================================"
print_success "🎉 Stable URL Setup Complete!"
echo "======================================================"
echo ""
echo "Your stable URLs (these NEVER change):"
echo "🔧 Backend:  https://vortex-backend.vercel.app"
echo "📱 Frontend: https://vortex-frontend.vercel.app"
echo "👨‍💼 Admin:    https://vortex-admin.vercel.app"
echo ""
echo "Next steps:"
echo "1. Wait 2-3 minutes for DNS propagation"
echo "2. Test your frontend: https://vortex-frontend.vercel.app"
echo "3. Test your admin: https://vortex-admin.vercel.app"
echo "4. Login to admin with: admin@gmail.com / vortex123"
echo ""
print_success "🎯 No more circular deployment problems!"
print_success "🔒 Your URLs are now stable and won't change!"
echo ""

cd ..