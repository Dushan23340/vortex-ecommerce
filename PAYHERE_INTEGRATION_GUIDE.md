# PayHere Sri Lankan Payment Gateway Integration Guide

## Overview
PayHere is Sri Lanka's leading online payment gateway that allows businesses to accept payments via MasterCard, Visa, American Express, and local bank transfers. This integration enables secure MasterCard payments for your e-commerce website.

## Features Implemented
✅ **MasterCard Payment Processing** via PayHere  
✅ **Secure Payment Gateway** with SSL encryption  
✅ **Real-time Payment Notifications** via webhooks  
✅ **Order Management** with payment status tracking  
✅ **Automatic Cart Clearing** after successful payment  
✅ **Payment Success/Failure** handling  
✅ **Mobile-Friendly** payment flow  

## Setup Instructions

### 1. PayHere Account Setup
1. **Create PayHere Account**: Visit [https://www.payhere.lk](https://www.payhere.lk)
2. **Register as Merchant**: Complete business registration
3. **Get Merchant Credentials**:
   - Merchant ID
   - Merchant Secret
   - API Keys (if needed)
4. **Configure Webhooks**: Set notify URL to your backend

### 2. Backend Configuration

#### Environment Variables (.env file)
Create a `.env` file in the `backend` directory:

```env
# PayHere Configuration
PAYHERE_MERCHANT_ID=your_merchant_id_here
PAYHERE_MERCHANT_SECRET=your_merchant_secret_here

# URLs
FRONTEND_URL=https://yourdomain.com
BACKEND_URL=https://api.yourdomain.com

# Other configurations...
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=4000
```

#### Webhook Configuration in PayHere Dashboard
- **Notify URL**: `https://api.yourdomain.com/api/payment/payhere-webhook`
- **Return URL**: `https://yourdomain.com/payment-success`
- **Cancel URL**: `https://yourdomain.com/payment-cancelled`

### 3. Payment Flow

#### Customer Experience:
1. Customer adds items to cart
2. Proceeds to checkout and fills delivery information  
3. Selects "MasterCard via PayHere" payment method
4. Clicks "PAY WITH MASTERCARD" button
5. Redirected to PayHere secure payment page
6. Enters MasterCard details on PayHere
7. Payment processed securely by PayHere
8. Redirected back to success/failure page
9. Order automatically created in database

#### Technical Flow:
```
Frontend → Backend (Create Payment) → PayHere Gateway → Customer Payment → 
PayHere Webhook → Backend (Create Order) → Frontend (Success Page)
```

## API Endpoints

### Payment Creation
```
POST /api/payment/payhere/create
Authorization: Bearer {jwt_token}
Body: {
  orderData: {
    userId: "user_id",
    deliveryInfo: { ... },
    totalAmount: 5000,
    deliveryFee: 300,
    orderItems: { ... }
  }
}
```

### PayHere Webhook
```
POST /api/payment/payhere-webhook
Body: PayHere notification data
```

### Payment Status Check
```
GET /api/payment/status/{paymentId}
```

## Security Features

### 1. **Hash Verification**
- PayHere signatures are verified using MD5 hash
- Prevents payment tampering and fraud
- Merchant secret is used for hash generation

### 2. **Secure Data Handling**  
- Sensitive payment data never stored on your server
- All transactions processed by PayHere's secure infrastructure
- PCI DSS compliant payment processing

### 3. **Order Validation**
- Payment amounts are verified against order totals
- Duplicate payment prevention
- Status code validation (2 = Success, 0 = Cancelled, -1 = Failed)

## Testing

### Production Setup Required
To test PayHere integration, you need:
- **PayHere Merchant Account**: Register at [https://www.payhere.lk](https://www.payhere.lk)
- **Merchant Credentials**: Merchant ID and Secret from PayHere dashboard
- **SSL Certificate**: HTTPS is mandatory for PayHere integration
- **Webhook Configuration**: Set up in PayHere merchant dashboard

## Supported Payment Methods

### MasterCard Types Supported:
- **MasterCard Credit Cards**
- **MasterCard Debit Cards**  
- **Maestro Cards**
- **International MasterCards**

### Additional PayHere Features Available:
- Visa Cards
- American Express
- eZ Cash (Sri Lankan mobile wallet)
- Genie (HNB mobile payment)
- Bank Transfers

## Error Handling

### Common Issues & Solutions:

1. **"Invalid Merchant ID"**
   - Verify PAYHERE_MERCHANT_ID in .env file
   - Ensure correct merchant ID from PayHere dashboard

2. **"Hash Validation Failed"**
   - Check PAYHERE_MERCHANT_SECRET is correct
   - Verify hash generation algorithm

3. **"Payment Gateway Timeout"**
   - Network connectivity issue
   - PayHere service downtime (check status.payhere.lk)

4. **"Order Not Created"**
   - Check webhook URL is accessible
   - Verify MongoDB connection
   - Check server logs for errors

## Monitoring & Analytics

### Payment Tracking:
- All payments logged in database with PayHere reference
- Order status automatically updated via webhooks
- Payment confirmation emails sent to customers
- Admin dashboard shows payment statistics

### Logging:
```javascript
// Payment logs include:
- PayHere Payment ID  
- Order ID
- Amount & Currency
- Customer Information
- Transaction Status
- Timestamp
```

## Mobile Compatibility
- ✅ **Responsive Design**: Works on all mobile devices
- ✅ **Touch Optimized**: Mobile-friendly payment interface  
- ✅ **App Integration**: Supports mobile app payments
- ✅ **Mobile Banking**: Integrates with mobile banking apps

## Go-Live Checklist

### Before Production:
- [ ] PayHere account approved and verified
- [ ] SSL certificate installed (HTTPS)
- [ ] Webhook URL accessible from PayHere servers
- [ ] Environment variables configured correctly  
- [ ] Test payments completed successfully
- [ ] Error handling tested
- [ ] Mobile compatibility verified
- [ ] Customer success/failure pages working
- [ ] Email notifications configured

### Post Go-Live:
- [ ] Monitor payment success rates
- [ ] Check webhook delivery success  
- [ ] Verify order creation accuracy
- [ ] Monitor for failed payments
- [ ] Customer support process ready

## Support & Documentation

### PayHere Resources:
- **Developer Documentation**: [https://support.payhere.lk/api-&-mobile-sdk/](https://support.payhere.lk/api-&-mobile-sdk/)
- **Merchant Support**: support@payhere.lk
- **Technical Support**: developer@payhere.lk
- **Status Page**: [https://status.payhere.lk](https://status.payhere.lk)

### Implementation Support:
- Integration completed and ready for testing
- Webhook handling implemented
- Error scenarios covered
- Mobile responsiveness ensured

## Next Steps
1. **Setup PayHere merchant account** (if not done already)
2. **Configure environment variables** with your merchant credentials
3. **Configure webhooks** in PayHere dashboard
4. **Install SSL certificate** for production
5. **Test payments** with live merchant credentials
6. **Go live** with production setup

---

**Ready for Client Delivery! 🚀**

The PayHere MasterCard integration is complete and ready for testing and production use.