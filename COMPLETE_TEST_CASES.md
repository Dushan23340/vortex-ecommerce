# Vortex Clothing Website - Complete Test Cases

## 1. 🔐 Authentication & Registration Tests

### 1.1 User Registration
**Test Case ID:** REG-001 - Done
- **Description:** Successful user registration with valid data
- **Steps:**
  1. Navigate to `/login`
  2. Click "Sign up" 
  3. Enter valid name (min 2 characters)
  4. Enter valid email format
  5. Enter strong password (8+ characters)
  6. Click "Sign Up"
- **Expected Result:** 
  - Registration success message
  - Verification code sent to email
  - Redirected to `/email-verification`

**Test Case ID:** REG-002 - Done
- **Description:** Registration with invalid email format
- **Steps:**
  1. Navigate to registration
  2. Enter invalid email (e.g., "invalid-email")
  3. Submit form
- **Expected Result:** Email format validation error

**Test Case ID:** REG-003 - Done
- **Description:** Registration with weak password
- **Steps:**
  1. Enter password less than 8 characters
  2. Submit form
- **Expected Result:** Password strength error message

**Test Case ID:** REG-004 - Done
- **Description:** Registration with existing email
- **Steps:**
  1. Use email that's already registered
  2. Submit form
- **Expected Result:** "User already exists" error

### 1.2 Email Verification
**Test Case ID:** VER-001 - Done
- **Description:** Successful email verification with valid code
- **Steps:**
  1. Check email for 6-digit verification code
  2. Enter code in verification form
  3. Submit
- **Expected Result:** 
  - "Email verified successfully" message
  - Redirected to Home page after 2 seconds

**Test Case ID:** VER-002 - Done
- **Description:** Email verification with invalid code
- **Steps:**
  1. Enter incorrect 6-digit code
  2. Submit
- **Expected Result:** "Invalid verification code" error

**Test Case ID:** VER-003 - Done
- **Description:** Email verification with expired code
- **Steps:**
  1. Wait 24+ hours after registration
  2. Try to verify with original code
- **Expected Result:** "Invalid or expired verification code" error

**Test Case ID:** VER-004 - Done
- **Description:** Resend verification code functionality
- **Steps:**
  1. Click "Resend Code" on verification page
  2. Check email for new code
- **Expected Result:** New verification code received

### 1.3 User Login
**Test Case ID:** LOGIN-001 - Done
- **Description:** Successful login with verified account
- **Steps:**
  1. Navigate to `/login`
  2. Enter verified email and correct password
  3. Click "Sign In"
- **Expected Result:** 
  - Login success message
  - Redirected to home page
  - User menu shows logged-in state

**Test Case ID:** LOGIN-002 - Done
- **Description:** Login attempt with unverified email
- **Steps:**
  1. Try to login with unverified account
- **Expected Result:** 
  - Redirected to email verification page
  - Message about needing verification

**Test Case ID:** LOGIN-003 - Done
- **Description:** Login with invalid credentials
- **Steps:**
  1. Enter wrong email or password
- **Expected Result:** "Invalid credentials" error

### 1.4 Password Reset
**Test Case ID:** RESET-001 - Done
- **Description:** Password reset flow
- **Steps:**
  1. Click "Forgot Your Password?" on login
  2. Enter registered email
  3. Check email for reset link
  4. Click link and enter new password
- **Expected Result:** Password successfully reset

## 2. 🛍️ E-commerce Functionality Tests

### 2.1 Product Browsing
**Test Case ID:** BROWSE-001 - Done
- **Description:** View all products on collection page
- **Steps:**
  1. Navigate to `/collection`
  2. Verify products are displayed
- **Expected Result:** Products grid with images, names, prices

**Test Case ID:** BROWSE-002 - Done
- **Description:** Product filtering functionality
- **Steps:**
  1. On collection page, use category filters
  2. Apply price range filters
  3. Use search functionality
- **Expected Result:** Products filtered correctly

**Test Case ID:** BROWSE-003 - Done
- **Description:** Product sorting functionality
- **Steps:**
  1. Sort by price (low to high, high to low)
  2. Sort by newest/oldest
- **Expected Result:** Products reordered correctly

### 2.2 Product Details
**Test Case ID:** PRODUCT-001 - Done
- **Description:** View individual product page
- **Steps:**
  1. Click on any product
  2. Verify product details page loads
- **Expected Result:** 
  - Product images, description, price displayed
  - Size selection available
  - Add to cart button visible
  - Stock status shown
  - Reviews section visible

**Test Case ID:** PRODUCT-002 - Done
- **Description:** Product image gallery
- **Steps:**
  1. Click through product images
  2. Test zoom functionality if available
- **Expected Result:** Images switch correctly

### 2.3 Shopping Cart
**Test Case ID:** CART-001 - Done
- **Description:** Add product to cart
- **Steps:**
  1. Select product size
  2. Click "Add to Cart"
- **Expected Result:** 
  - Success message shown
  - Cart count updated in header
  - Product added to cart page

**Test Case ID:** CART-002 - Done
- **Description:** Add product without selecting size
- **Steps:**
  1. Try to add product without selecting size
- **Expected Result:** "Please select a size" error

**Test Case ID:** CART-003 - Done
- **Description:** View cart page
- **Steps:**
  1. Navigate to `/cart`
  2. Verify cart items displayed
- **Expected Result:** 
  - Products with images, names, sizes, quantities
  - Price calculations correct
  - Update quantity functionality
  - Remove item functionality

**Test Case ID:** CART-004 - Done
- **Description:** Update cart quantities
- **Steps:**
  1. Change quantity using +/- buttons
  2. Verify total price updates
- **Expected Result:** Quantities and totals update correctly

**Test Case ID:** CART-005 - Done
- **Description:** Remove items from cart
- **Steps:**
  1. Click remove button on cart item
- **Expected Result:** Item removed, totals recalculated

### 2.4 Checkout Process
**Test Case ID:** CHECKOUT-001
- **Description:** Complete checkout process (authenticated user)
- **Steps:**
  1. Add items to cart
  2. Navigate to checkout
  3. Fill delivery information
  4. Select payment method
  5. Complete order
- **Expected Result:** 
  - Order confirmation page
  - Order email sent
  - Cart cleared

**Test Case ID:** CHECKOUT-002 - Done
- **Description:** Checkout without login
- **Steps:**
  1. Try to checkout as guest
- **Expected Result:** Redirected to login page

### 2.5 Payment Integration
**Test Case ID:** PAY-001
- **Description:** PayHere payment flow (sandbox)
- **Steps:**
  1. Select PayHere payment
  2. Complete sandbox payment
- **Expected Result:** 
  - Redirected to PayHere sandbox
  - Payment success/failure handling
  - Order status updated

## 3. 👤 User Profile & Account Management

### 3.1 User Profile
**Test Case ID:** PROFILE-001 - Done
- **Description:** View user profile
- **Steps:**
  1. Login and navigate to profile
  2. Verify user information displayed
- **Expected Result:** Name, email, phone, address fields visible

**Test Case ID:** PROFILE-002 - Done
- **Description:** Update profile information
- **Steps:**
  1. Edit profile fields
  2. Save changes
- **Expected Result:** 
  - Success message
  - Data persisted after refresh

### 3.2 Order History
**Test Case ID:** ORDER-001 - Done
- **Description:** View order history
- **Steps:**
  1. Navigate to `/orders`
  2. Verify past orders displayed
- **Expected Result:** 
  - Orders with dates, items, status
  - Order details expandable

### 3.3 Wishlist Functionality
**Test Case ID:** WISH-001 - Done
- **Description:** Add products to wishlist
- **Steps:**
  1. Click heart icon on product
- **Expected Result:** Product added to wishlist

**Test Case ID:** WISH-002 - Done
- **Description:** View wishlist page
- **Steps:**
  1. Navigate to `/wishlist`
- **Expected Result:** Wishlist items displayed

**Test Case ID:** WISH-003 - Done
- **Description:** Remove from wishlist
- **Steps:**
  1. Click remove on wishlist item
- **Expected Result:** Item removed from wishlist

## 4. 🔍 Search & Navigation Tests

### 4.1 Site Navigation
**Test Case ID:** NAV-001 - Done
- **Description:** Header navigation functionality
- **Steps:**
  1. Test all header menu links
  2. Verify mobile menu functionality
- **Expected Result:** All links work, mobile menu toggles

**Test Case ID:** NAV-002 - Done
- **Description:** Footer links
- **Steps:**
  1. Test all footer links
- **Expected Result:** Links navigate correctly

### 4.2 Search Functionality
**Test Case ID:** SEARCH-001 - Done
- **Description:** Product search
- **Steps:**
  1. Use search bar with product names
  2. Test partial matches
  3. Test no results scenario
- **Expected Result:** 
  - Relevant products shown
  - "No products found" for invalid searches

### 4.3 Breadcrumb Navigation
**Test Case ID:** BREAD-001 - Done
- **Description:** Breadcrumb functionality
- **Steps:**
  1. Navigate deep into site
  2. Use breadcrumb links to go back
- **Expected Result:** Breadcrumbs show correct path and work

## 5. 📱 Responsive Design Tests

### 5.1 Mobile Responsiveness
**Test Case ID:** MOBILE-001
- **Description:** Mobile layout testing
- **Steps:**
  1. Test on various screen sizes (320px, 768px, 1024px+)
  2. Verify mobile menu functionality
  3. Test touch interactions
- **Expected Result:** 
  - Layout adapts correctly
  - All functionality works on mobile

### 5.2 Cross-Browser Testing
**Test Case ID:** BROWSER-001
- **Description:** Browser compatibility
- **Steps:**
  1. Test on Chrome, Firefox, Safari, Edge
  2. Verify functionality across browsers
- **Expected Result:** Consistent behavior across browsers

## 6. 🛡️ Security & Performance Tests

### 6.1 Security Tests
**Test Case ID:** SEC-001
- **Description:** Authentication security
- **Steps:**
  1. Try accessing protected routes without login
  2. Test session timeout
- **Expected Result:** Proper redirects to login

**Test Case ID:** SEC-002
- **Description:** Input validation
- **Steps:**
  1. Test XSS attempts in forms
  2. Test SQL injection in search
- **Expected Result:** Inputs properly sanitized

### 6.2 Performance Tests
**Test Case ID:** PERF-001
- **Description:** Page load times
- **Steps:**
  1. Measure load times for key pages
  2. Test with slow network conditions
- **Expected Result:** Pages load within acceptable time

**Test Case ID:** PERF-002
- **Description:** Image optimization
- **Steps:**
  1. Check image loading and lazy loading
- **Expected Result:** Images load efficiently

## 7. 🔧 Admin Panel Tests

### 7.1 Admin Authentication
**Test Case ID:** ADMIN-001 - Done
- **Description:** Admin login
- **Steps:**
  1. Navigate to admin panel
  2. Login with admin credentials
- **Expected Result:** Access to admin dashboard

### 7.2 Product Management
**Test Case ID:** ADMIN-002 - Done
- **Description:** Add new product
- **Steps:**
  1. Use "Add Product" form
  2. Upload images
  3. Set all required fields
- **Expected Result:** Product created and visible in frontend

**Test Case ID:** ADMIN-003 - Done
- **Description:** Edit/Delete products
- **Steps:**
  1. Edit existing product
  2. Delete product
- **Expected Result:** Changes reflected in frontend

### 7.3 Order Management
**Test Case ID:** ADMIN-004 - Done
- **Description:** View and manage orders
- **Steps:**
  1. View order list
  2. Update order status
- **Expected Result:** Order status updates correctly

### 7.4 Dashboard Analytics
**Test Case ID:** ADMIN-005 - Done
- **Description:** Dashboard statistics
- **Steps:**
  1. Verify dashboard shows correct data
  2. Check user count, order stats
- **Expected Result:** Accurate statistics displayed

## 8. 📧 Email & Communication Tests

### 8.1 Email Notifications
**Test Case ID:** EMAIL-001 - Done
- **Description:** Registration verification email
- **Steps:**
  1. Register new account
  2. Check email delivery and format
- **Expected Result:** Professional email with correct code

**Test Case ID:** EMAIL-002
- **Description:** Order confirmation email
- **Steps:**
  1. Complete an order
  2. Check order confirmation email
- **Expected Result:** Order details sent via email

### 8.2 Contact Form
**Test Case ID:** CONTACT-001
- **Description:** Contact form submission
- **Steps:**
  1. Fill and submit contact form
- **Expected Result:** Form submitted successfully

## 9. 🧪 Edge Cases & Error Handling

### 9.1 Error Scenarios
**Test Case ID:** ERROR-001
- **Description:** Network connectivity issues
- **Steps:**
  1. Simulate offline condition
  2. Test error handling
- **Expected Result:** Appropriate error messages

**Test Case ID:** ERROR-002
- **Description:** Server error handling
- **Steps:**
  1. Test 404 pages
  2. Test server downtime scenarios
- **Expected Result:** User-friendly error pages

### 9.2 Data Validation
**Test Case ID:** VALID-001 - Done
- **Description:** Form input validation
- **Steps:**
  1. Test all forms with invalid data
  2. Test required field validation
- **Expected Result:** Proper validation messages

## 10. 📊 Analytics & Monitoring Tests

### 10.1 User Behavior Tracking
**Test Case ID:** TRACK-001 - Done
- **Description:** Recently viewed products
- **Steps:**
  1. View several products
  2. Check recently viewed section
- **Expected Result:** Products appear in recently viewed

**Test Case ID:** TRACK-002 - Done
- **Description:** Product review system
- **Steps:**
  1. Submit product review
  2. Verify review appears
- **Expected Result:** Reviews displayed correctly

## Test Execution Checklist

### Pre-Testing Setup
- [ ] Backend server running on port 4000
- [ ] Frontend running on port 5175
- [ ] Admin panel running on port 5176
- [ ] MongoDB connection active
- [ ] Email service configured
- [ ] PayHere sandbox configured

### Test Environment
- [ ] Clean database state
- [ ] Test user accounts created
- [ ] Sample products available
- [ ] Email server accessible

### Post-Testing Verification
- [ ] All critical paths working
- [ ] No console errors
- [ ] Mobile compatibility confirmed
- [ ] Performance acceptable
- [ ] Security measures active

## Bug Reporting Template

**Bug ID:** BUG-XXX
**Severity:** Critical/High/Medium/Low
**Description:** Brief description
**Steps to Reproduce:** 
1. Step 1
2. Step 2
3. Step 3
**Expected Result:** What should happen
**Actual Result:** What actually happened
**Browser/Device:** Browser version and device info
**Screenshots:** If applicable
**Status:** Open/In Progress/Resolved

---

## Notes for Testing
- Test with both existing and new user accounts
- Clear browser cache between major test scenarios
- Test with different user roles (guest, customer, admin)
- Verify data persistence across sessions
- Check for memory leaks during extended testing
- Validate all error messages are user-friendly
- Ensure all success messages are clear and helpful