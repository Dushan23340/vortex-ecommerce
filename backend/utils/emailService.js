import nodemailer from 'nodemailer';

// Create email transporter
const createTransporter = () => {
  // For Gmail (most common)
  if (process.env.EMAIL_SERVICE === 'gmail') {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD // Use App Password, not regular password
      }
    });
  }
  
  // For other email services (Outlook, Yahoo, etc.)
  if (process.env.EMAIL_SERVICE === 'outlook') {
    return nodemailer.createTransport({
      service: 'hotmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }
  
  // For custom SMTP (like company email servers)
  if (process.env.EMAIL_SERVICE === 'smtp') {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }
  
  // Default to Gmail if no service specified
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD
    }
  });
};

// Send password reset email
export const sendPasswordResetEmail = async (email, resetCode, userName) => {
  try {
    const transporter = createTransporter();
    
    // Verify connection configuration
    await transporter.verify();
    console.log('✅ Email server connection verified');
    
    const mailOptions = {
      from: {
        name: process.env.EMAIL_FROM_NAME || 'Vortex Clothing',
        address: process.env.EMAIL_USER
      },
      to: email,
      subject: 'Password Reset Code - Vortex Clothing',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Reset</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .logo { font-size: 24px; font-weight: bold; color: #000; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 8px; }
            .code { 
              display: inline-block; 
              background: #000; 
              color: white; 
              padding: 15px 30px; 
              font-size: 24px;
              font-weight: bold;
              letter-spacing: 3px;
              border-radius: 4px; 
              margin: 20px 0;
            }
            .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
            .warning { color: #e74c3c; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">VORTEX CLOTHING</div>
            </div>
            
            <div class="content">
              <h2>Password Reset Code</h2>
              
              <p>Hello ${userName || 'User'},</p>
              
              <p>We received a request to reset your password for your Vortex Clothing account.</p>
              
              <p>Use the verification code below to reset your password:</p>
              
              <div style="text-align: center;">
                <div class="code">${resetCode}</div>
              </div>
              
              <p>Enter this code in the password reset form to create your new password.</p>
              
              <p class="warning">⚠️ This code will expire in 10 minutes for security reasons.</p>
              
              <p>If you didn't request this password reset, please ignore this email. Your password will remain unchanged.</p>
              
              <p>For security reasons, please don't share this email or code with anyone.</p>
              
              <p>Best regards,<br>The Vortex Clothing Team</p>
            </div>
            
            <div class="footer">
              <p>This is an automated email. Please do not reply to this email.</p>
              <p>© ${new Date().getFullYear()} Vortex Clothing. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Password Reset Code - Vortex Clothing
        
        Hello ${userName || 'User'},
        
        We received a request to reset your password for your Vortex Clothing account.
        
        Use the verification code below to reset your password:
        
        Reset Code: ${resetCode}
        
        Enter this code in the password reset form to create your new password.
        
        ⚠️ This code will expire in 10 minutes for security reasons.
        
        If you didn't request this password reset, please ignore this email. Your password will remain unchanged.
        
        Best regards,
        The Vortex Clothing Team
        
        ---
        This is an automated email. Please do not reply to this email.
        © ${new Date().getFullYear()} Vortex Clothing. All rights reserved.
      `
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Password reset email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
    
  } catch (error) {
    console.error('❌ Error sending password reset email:', error);
    return { success: false, error: error.message };
  }
};

// Send verification email
export const sendVerificationEmail = async (email, verificationCode, userName) => {
  try {
    const transporter = createTransporter();
    
    // Verify connection configuration
    await transporter.verify();
    console.log('✅ Email server connection verified');
    
    const mailOptions = {
      from: {
        name: process.env.EMAIL_FROM_NAME || 'Vortex Clothing',
        address: process.env.EMAIL_USER
      },
      to: email,
      subject: 'Email Verification Code - Vortex Clothing',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Email Verification</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .logo { font-size: 24px; font-weight: bold; color: #000; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 8px; }
            .code { 
              display: inline-block; 
              background: #000; 
              color: white; 
              padding: 15px 30px; 
              font-size: 24px;
              font-weight: bold;
              letter-spacing: 3px;
              border-radius: 4px; 
              margin: 20px 0;
            }
            .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
            .warning { color: #e74c3c; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">VORTEX CLOTHING</div>
            </div>
            
            <div class="content">
              <h2>Email Verification Code</h2>
              
              <p>Hello ${userName || 'User'},</p>
              
              <p>Thank you for registering with Vortex Clothing. Please use the verification code below to verify your email address:</p>
              
              <div style="text-align: center;">
                <div class="code">${verificationCode}</div>
              </div>
              
              <p>Enter this code in the verification form to complete your registration.</p>
              
              <p class="warning">⚠️ This code will expire in 24 hours for security reasons.</p>
              
              <p>If you didn't create an account with us, please ignore this email.</p>
              
              <p>Best regards,<br>The Vortex Clothing Team</p>
            </div>
            
            <div class="footer">
              <p>This is an automated email. Please do not reply to this email.</p>
              <p>© ${new Date().getFullYear()} Vortex Clothing. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Email Verification Code - Vortex Clothing
        
        Hello ${userName || 'User'},
        
        Thank you for registering with Vortex Clothing. Please use the verification code below to verify your email address:
        
        Verification Code: ${verificationCode}
        
        Enter this code in the verification form to complete your registration.
        
        ⚠️ This code will expire in 24 hours for security reasons.
        
        If you didn't create an account with us, please ignore this email.
        
        Best regards,
        The Vortex Clothing Team
        
        ---
        This is an automated email. Please do not reply to this email.
        © ${new Date().getFullYear()} Vortex Clothing. All rights reserved.
      `
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Verification email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
    
  } catch (error) {
    console.error('❌ Error sending verification email:', error);
    return { success: false, error: error.message };
  }
};

// Send order verification email
export const sendOrderVerificationEmail = async (email, verificationCode, customerName, orderDetails) => {
  try {
    const transporter = createTransporter();
    
    // Verify connection configuration
    await transporter.verify();
    console.log('✅ Email server connection verified');
    
    const mailOptions = {
      from: {
        name: process.env.EMAIL_FROM_NAME || 'Vortex Clothing',
        address: process.env.EMAIL_USER
      },
      to: email,
      subject: 'Order Verification Code - Vortex Clothing',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Order Verification</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .logo { font-size: 24px; font-weight: bold; color: #000; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 8px; }
            .code { 
              display: inline-block; 
              background: #000; 
              color: white; 
              padding: 15px 30px; 
              font-size: 24px;
              font-weight: bold;
              letter-spacing: 3px;
              border-radius: 4px; 
              margin: 20px 0;
            }
            .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
            .warning { color: #e74c3c; font-weight: bold; }
            .order-summary { background: #fff; padding: 15px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #000; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">VORTEX CLOTHING</div>
            </div>
            
            <div class="content">
              <h2>Order Verification Required</h2>
              
              <p>Hello ${customerName || 'Valued Customer'},</p>
              
              <p>To complete your order, please verify your email address using the code below:</p>
              
              <div style="text-align: center;">
                <div class="code">${verificationCode}</div>
              </div>
              
              <div class="order-summary">
                <h4 style="margin: 0 0 10px 0; color: #333;">Order Summary</h4>
                <p style="margin: 5px 0; color: #666;">Total Amount: <strong>Rs. ${orderDetails.totalAmount.toFixed(2)}</strong></p>
                <p style="margin: 5px 0; color: #666;">Payment Method: <strong>${orderDetails.paymentMethod.toUpperCase()}</strong></p>
                <p style="margin: 5px 0; color: #666;">Delivery to: <strong>${orderDetails.deliveryInfo.city}, ${orderDetails.deliveryInfo.country}</strong></p>
              </div>
              
              <p>Enter this verification code on the order confirmation page to proceed with your purchase.</p>
              
              <p class="warning">⚠️ This code will expire in 10 minutes for security reasons.</p>
              
              <p>If you didn't attempt to place this order, please ignore this email.</p>
              
              <p>Best regards,<br>The Vortex Clothing Team</p>
            </div>
            
            <div class="footer">
              <p>This is an automated email. Please do not reply to this email.</p>
              <p>© ${new Date().getFullYear()} Vortex Clothing. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Order Verification Code - Vortex Clothing
        
        Hello ${customerName || 'Valued Customer'},
        
        To complete your order, please verify your email address using the code below:
        
        Verification Code: ${verificationCode}
        
        Order Summary:
        - Total Amount: Rs. ${orderDetails.totalAmount.toFixed(2)}
        - Payment Method: ${orderDetails.paymentMethod.toUpperCase()}
        - Delivery to: ${orderDetails.deliveryInfo.city}, ${orderDetails.deliveryInfo.country}
        
        Enter this verification code on the order confirmation page to proceed with your purchase.
        
        ⚠️ This code will expire in 10 minutes for security reasons.
        
        If you didn't attempt to place this order, please ignore this email.
        
        Best regards,
        The Vortex Clothing Team
        
        ---
        This is an automated email. Please do not reply to this email.
        © ${new Date().getFullYear()} Vortex Clothing. All rights reserved.
      `
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Order verification email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
    
  } catch (error) {
    console.error('❌ Error sending order verification email:', error);
    return { success: false, error: error.message };
  }
};

// Send order confirmation email
export const sendOrderConfirmationEmail = async (customerEmail, orderDetails, customerName) => {
  try {
    const transporter = createTransporter();
    
    // Verify connection configuration
    await transporter.verify();
    console.log('✅ Email server connection verified');
    
    // Calculate order summary
    const subtotal = orderDetails.totalAmount - orderDetails.deliveryFee;
    const orderDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    // Generate order items HTML
    const orderItemsHtml = orderDetails.orderItems.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">
          <div style="display: flex; align-items: center;">
            <img src="${item.image[0]}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px; margin-right: 15px;">
            <div>
              <div style="font-weight: 500; color: #333;">${item.name}</div>
              <div style="color: #666; font-size: 14px;">Size: ${item.size}</div>
            </div>
          </div>
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center; color: #666;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right; font-weight: 500;">Rs. ${item.price}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right; font-weight: 500;">Rs. ${(item.price * item.quantity).toFixed(2)}</td>
      </tr>
    `).join('');
    
    const mailOptions = {
      from: {
        name: process.env.EMAIL_FROM_NAME || 'Vortex Clothing',
        address: process.env.EMAIL_USER
      },
      to: customerEmail,
      subject: `Order Confirmation - #${orderDetails.orderNumber || orderDetails._id.toString().slice(-6).toUpperCase()}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Order Confirmation</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; padding: 20px; background: #f8f9fa; }
            .logo { font-size: 28px; font-weight: bold; color: #000; margin-bottom: 10px; }
            .content { background: #fff; padding: 0; border-radius: 8px; }
            .order-header { background: #000; color: white; padding: 20px; text-align: center; }
            .order-details { padding: 20px; }
            .order-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            .order-table th { background: #f8f9fa; padding: 12px; text-align: left; border-bottom: 2px solid #dee2e6; }
            .order-table td { padding: 10px; border-bottom: 1px solid #eee; }
            .summary-table { width: 100%; margin-top: 20px; }
            .summary-table td { padding: 8px; border: none; }
            .total-row { border-top: 2px solid #000; font-weight: bold; font-size: 16px; }
            .delivery-info { background: #f8f9fa; padding: 15px; border-radius: 6px; margin: 20px 0; }
            .payment-info { background: #e3f2fd; padding: 15px; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666; }
            .status-badge { display: inline-block; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 500; }
            .status-pending { background: #fff3cd; color: #856404; }
            .payment-cod { background: #d4edda; color: #155724; }
            .payment-card { background: #cce5ff; color: #004085; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">VORTEX CLOTHING</div>
              <p style="margin: 0; color: #666;">Thank you for your order!</p>
            </div>
            
            <div class="content">
              <div class="order-header">
                <h2 style="margin: 0; font-size: 24px;">Order Confirmation</h2>
                <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">
                  Order #${orderDetails.orderNumber || orderDetails._id.toString().slice(-6).toUpperCase()}
                </p>
              </div>
              
              <div class="order-details">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                  <div>
                    <h3 style="margin: 0; color: #333;">Hello ${customerName || 'Valued Customer'},</h3>
                    <p style="margin: 5px 0 0 0; color: #666;">Order placed on ${orderDate}</p>
                  </div>
                  <div style="text-align: right;">
                    <span class="status-badge status-pending">Order Placed</span>
                  </div>
                </div>
                
                <p>We've received your order and we're getting it ready. We'll send you a shipping confirmation email as soon as your order ships.</p>
                
                <!-- Order Items -->
                <h4 style="margin: 30px 0 15px 0; color: #333;">Order Items</h4>
                <table class="order-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th style="text-align: center; width: 80px;">Quantity</th>
                      <th style="text-align: right; width: 100px;">Price</th>
                      <th style="text-align: right; width: 100px;">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${orderItemsHtml}
                  </tbody>
                </table>
                
                <!-- Order Summary -->
                <table class="summary-table">
                  <tr>
                    <td style="text-align: right; padding-right: 20px;">Subtotal:</td>
                    <td style="text-align: right; width: 120px;">Rs. ${subtotal.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td style="text-align: right; padding-right: 20px;">Delivery Fee:</td>
                    <td style="text-align: right;">Rs. ${orderDetails.deliveryFee.toFixed(2)}</td>
                  </tr>
                  <tr class="total-row">
                    <td style="text-align: right; padding-right: 20px;">Total:</td>
                    <td style="text-align: right;">Rs. ${orderDetails.totalAmount.toFixed(2)}</td>
                  </tr>
                </table>
                
                <!-- Payment Information -->
                <div class="payment-info">
                  <h4 style="margin: 0 0 10px 0; color: #333;">Payment Information</h4>
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                      <strong>Payment Method:</strong> ${orderDetails.paymentMethod.toUpperCase()}
                    </div>
                    <span class="status-badge ${orderDetails.paymentMethod === 'cod' ? 'payment-cod' : 'payment-card'}">
                      ${orderDetails.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Card Payment'}
                    </span>
                  </div>
                  ${orderDetails.paymentMethod === 'cod' ? 
                    '<p style="margin: 10px 0 0 0; font-size: 14px; color: #666;">💡 Please keep the exact amount ready for delivery.</p>' : 
                    '<p style="margin: 10px 0 0 0; font-size: 14px; color: #666;">✅ Payment has been processed successfully.</p>'
                  }
                </div>
                
                <!-- Delivery Information -->
                <div class="delivery-info">
                  <h4 style="margin: 0 0 15px 0; color: #333;">Delivery Address</h4>
                  <div style="line-height: 1.5;">
                    <strong>${orderDetails.deliveryInfo.firstName} ${orderDetails.deliveryInfo.lastName}</strong><br>
                    ${orderDetails.deliveryInfo.street}<br>
                    ${orderDetails.deliveryInfo.city}, ${orderDetails.deliveryInfo.state} ${orderDetails.deliveryInfo.zipCode}<br>
                    ${orderDetails.deliveryInfo.country}<br>
                    <strong>Phone:</strong> ${orderDetails.deliveryInfo.phone}
                  </div>
                </div>
                
                <!-- Next Steps -->
                <div style="background: #f0f8f0; padding: 15px; border-radius: 6px; margin: 20px 0;">
                  <h4 style="margin: 0 0 10px 0; color: #2d5a2d;">What's Next?</h4>
                  <ul style="margin: 0; padding-left: 20px; color: #2d5a2d;">
                    <li>We'll process your order within 1-2 business days</li>
                    <li>You'll receive a shipping confirmation email with tracking details</li>
                    <li>Estimated delivery: 3-5 business days</li>
                    ${orderDetails.paymentMethod === 'cod' ? '<li>Please ensure someone is available to receive the package and make payment</li>' : ''}
                  </ul>
                </div>
                
                <div style="text-align: center; margin: 30px 0;">
                  <p style="margin: 0; color: #666;">Have questions about your order?</p>
                  <p style="margin: 5px 0 0 0;">
                    <a href="mailto:support@vortexclothing.com" style="color: #000; text-decoration: none; font-weight: 500;">Contact our support team</a>
                  </p>
                </div>
              </div>
            </div>
            
            <div class="footer">
              <p>Thank you for shopping with Vortex Clothing!</p>
              <p>This is an automated email. Please do not reply to this email.</p>
              <p>© ${new Date().getFullYear()} Vortex Clothing. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Order Confirmation - Vortex Clothing
        
        Hello ${customerName || 'Valued Customer'},
        
        Thank you for your order! We've received your order and we're getting it ready.
        
        Order Details:
        Order #: ${orderDetails.orderNumber || orderDetails._id.toString().slice(-6).toUpperCase()}
        Order Date: ${orderDate}
        
        Items Ordered:
        ${orderDetails.orderItems.map(item => 
          `- ${item.name} (Size: ${item.size}) x ${item.quantity} = Rs. ${(item.price * item.quantity).toFixed(2)}`
        ).join('\n        ')}
        
        Order Summary:
        Subtotal: Rs. ${subtotal.toFixed(2)}
        Delivery Fee: Rs. ${orderDetails.deliveryFee.toFixed(2)}
        Total: Rs. ${orderDetails.totalAmount.toFixed(2)}
        
        Payment Method: ${orderDetails.paymentMethod.toUpperCase()}
        ${orderDetails.paymentMethod === 'cod' ? 'Please keep the exact amount ready for delivery.' : 'Payment has been processed successfully.'}
        
        Delivery Address:
        ${orderDetails.deliveryInfo.firstName} ${orderDetails.deliveryInfo.lastName}
        ${orderDetails.deliveryInfo.street}
        ${orderDetails.deliveryInfo.city}, ${orderDetails.deliveryInfo.state} ${orderDetails.deliveryInfo.zipCode}
        ${orderDetails.deliveryInfo.country}
        Phone: ${orderDetails.deliveryInfo.phone}
        
        What's Next?
        - We'll process your order within 1-2 business days
        - You'll receive a shipping confirmation email with tracking details
        - Estimated delivery: 3-5 business days
        ${orderDetails.paymentMethod === 'cod' ? '- Please ensure someone is available to receive the package and make payment' : ''}
        
        Have questions? Contact our support team at support@vortexclothing.com
        
        Thank you for shopping with Vortex Clothing!
        
        ---
        This is an automated email. Please do not reply to this email.
        © ${new Date().getFullYear()} Vortex Clothing. All rights reserved.
      `
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Order confirmation email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
    
  } catch (error) {
    console.error('❌ Error sending order confirmation email:', error);
    return { success: false, error: error.message };
  }
};

// Send contact response email
export const sendContactResponseEmail = async (customerEmail, customerName, originalSubject, originalMessage, replyMessage, adminName) => {
  try {
    const transporter = createTransporter();
    
    // Verify connection configuration
    await transporter.verify();
    console.log('✅ Email server connection verified');
    
    const mailOptions = {
      from: {
        name: process.env.EMAIL_FROM_NAME || 'Vortex Clothing',
        address: process.env.EMAIL_USER
      },
      to: customerEmail,
      subject: `Re: ${originalSubject}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Response to Your Message</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .logo { font-size: 24px; font-weight: bold; color: #000; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 8px; }
            .original-message { background: #fff; padding: 20px; border-left: 4px solid #000; margin: 20px 0; }
            .reply-message { background: #fff; padding: 20px; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">VORTEX CLOTHING</div>
            </div>
            
            <div class="content">
              <h2>Response to Your Message</h2>
              
              <p>Hello ${customerName || 'Valued Customer'},</p>
              
              <p>Thank you for contacting us. We've received your message and here's our response:</p>
              
              <div class="reply-message">
                <h3 style="margin-top: 0; color: #333;">Our Response:</h3>
                <p style="margin-bottom: 0;">${replyMessage.replace(/\n/g, '<br>')}</p>
              </div>
              
              <div class="original-message">
                <h4 style="margin-top: 0; color: #666;">Your Original Message:</h4>
                <p style="margin: 5px 0; color: #666;"><strong>Subject:</strong> ${originalSubject}</p>
                <p style="margin-bottom: 0; color: #666;">${originalMessage.replace(/\n/g, '<br>')}</p>
              </div>
              
              <p>If you have any further questions, please don't hesitate to contact us.</p>
              
              <p>Best regards,<br>
              ${adminName}<br>
              Vortex Clothing Team</p>
            </div>
            
            <div class="footer">
              <p>This is a response to your inquiry. If you need further assistance, please reply to this email.</p>
              <p>© ${new Date().getFullYear()} Vortex Clothing. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Response to Your Message - Vortex Clothing
        
        Hello ${customerName || 'Valued Customer'},
        
        Thank you for contacting us. We've received your message and here's our response:
        
        Our Response:
        ${replyMessage}
        
        Your Original Message:
        Subject: ${originalSubject}
        ${originalMessage}
        
        If you have any further questions, please don't hesitate to contact us.
        
        Best regards,
        ${adminName}
        Vortex Clothing Team
        
        ---
        This is a response to your inquiry. If you need further assistance, please reply to this email.
        © ${new Date().getFullYear()} Vortex Clothing. All rights reserved.
      `
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Contact response email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
    
  } catch (error) {
    console.error('❌ Error sending contact response email:', error);
    return { success: false, error: error.message };
  }
};

// Test email configuration
export const testEmailConfiguration = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log('✅ Email configuration is valid');
    return { success: true, message: 'Email configuration is valid' };
  } catch (error) {
    console.error('❌ Email configuration error:', error);
    return { success: false, error: error.message };
  }
};