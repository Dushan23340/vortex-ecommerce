import validator from "validator";
import userModel from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendPasswordResetEmail, testEmailConfiguration, sendVerificationEmail } from "../utils/emailService.js";


const createToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, { expiresIn: '7d' })
}

// Function to generate email verification code (6 digits)
const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Routes for user login
const loginUser = async (req,res) => {

    try{

        const {email, password} = req.body;
        const user = await userModel.findOne({email});

        if (!user) {
            return res.json({success: false, message: "User doesn't exists"})
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            
            // Check if email is verified
            if (!user.isEmailVerified) {
                return res.json({
                    success: false,
                    message: "Please verify your email address before logging in",
                    needsVerification: true
                });
            }
            
            const token = createToken(user._id)
            res.json({
                success: true, 
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email
                }
            });
        }
        else {
            res.json({success:false, message: "Invalid credentials"})
        }

    } catch (error) {

        console.log(error);
        res.json({success: false, message:error.message})

    }
    


}

//Routes for user register
const registerUser = async (req,res) => {
    try {

        const {name, email, password} = req.body;

        //checking user already exits or not
        const exists = await userModel.findOne({email});
        if(exists) {
            return res.json({success: false, message: "User already exists"})
        }

        // validating email format & strong password
        if (!validator.isEmail(email)) {
            return res.json({success: false, message: "Please enter a valid email address"});
        }
        if (password.length < 8 ) {
            return res.json({success: false, message: "Please enter strong password"})
        }

        // hashing user password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new userModel({
            name, 
            email, 
            password: hashedPassword
        })

        const user = await newUser.save()
        
        // Generate verification code and send verification email
        const verificationCode = generateVerificationCode();
        const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        // Save code and expiration to user
        user.emailVerificationToken = verificationCode; // Store code directly
        user.emailVerificationExpires = verificationExpires;
        await user.save();
        
        // Send verification email with code
        const emailResult = await sendVerificationEmail(user.email, verificationCode, user.name);
        
        if (!emailResult.success) {
            console.error('❌ Failed to send verification email:', emailResult.error);
            // Continue with response but note the issue
        }
        
        const token = createToken(user._id)
        res.json({
            success: true, 
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            },
            needsVerification: true,
            message: emailResult.success 
                ? "Registration successful! Please check your email for the verification code" 
                : "Registration successful but there was an issue sending the verification email. You may need to request a new verification code."
        })


} catch (error) {
    console.log(error);
    res.json({success: false, message:error.message})

}

}

//Routes for admin login
const adminLogin = async (req,res) => {

    try {
        const {email,password} = req.body
        if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email+password,process.env.JWT_SECRET);
            res.json({success:true,token})

        } else {
            res.json({success:false, message:"Invalid credentials"})
        }


    } catch (error) {
        console.log(error);
        res.json({success: false, message:error.message})
        
    }



}

// Cart management functions
const updateCart = async (req, res) => {
    try {
        const { cartData } = req.body;
        const userId = req.user._id;
        
        if (!cartData) {
            return res.json({ success: false, message: "Cart data is required" });
        }

        const user = await userModel.findByIdAndUpdate(
            userId,
            { cartData: cartData },
            { new: true }
        );

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        res.json({ success: true, message: "Cart updated successfully", cartData: user.cartData });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

const getCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await userModel.findById(userId);
        
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        res.json({ success: true, cartData: user.cartData || {} });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

const clearCart = async (req, res) => {
    try {
        const userId = req.user._id;
        
        const user = await userModel.findByIdAndUpdate(
            userId,
            { cartData: {} },
            { new: true }
        );

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        res.json({ success: true, message: "Cart cleared successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};


// Get admin statistics (total users count)
const getAdminStats = async (req, res) => {
    try {
        const totalUsers = await userModel.countDocuments({})
        
        res.json({
            success: true,
            totalUsers
        })
    } catch (error) {
        console.log('Get admin stats error:', error)
        res.json({
            success: false,
            message: error.message
        })
    }
}

// Get user profile
const getUserProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await userModel.findById(userId).select('-password');
        
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        res.json({ 
            success: true, 
            user: {
                name: user.name,
                email: user.email,
                phone: user.phone || '',
                address: user.address || {
                    street: '',
                    city: '',
                    state: '',
                    zipCode: '',
                    country: ''
                }
            }
        });
    } catch (error) {
        console.log('Get user profile error:', error);
        res.json({ success: false, message: error.message });
    }
};

// Update user profile
const updateUserProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const { name, phone, address } = req.body;
        
        // Validate input
        if (!name || name.trim() === '') {
            return res.json({ success: false, message: "Name is required" });
        }

        const updateData = {
            name: name.trim(),
            phone: phone || '',
            address: address || {}
        };

        const user = await userModel.findByIdAndUpdate(
            userId,
            updateData,
            { new: true }
        ).select('-password');

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        res.json({ 
            success: true, 
            message: "Profile updated successfully",
            user: {
                name: user.name,
                email: user.email,
                phone: user.phone || '',
                address: user.address || {}
            }
        });
    } catch (error) {
        console.log('Update user profile error:', error);
        res.json({ success: false, message: error.message });
    }
};

// Resend Verification Code
const resendVerification = async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.json({ 
                success: false, 
                message: "Email is required" 
            });
        }
        
        if (!validator.isEmail(email)) {
            return res.json({ 
                success: false, 
                message: "Please enter a valid email address" 
            });
        }
        
        const user = await userModel.findOne({ email });
        
        if (!user) {
            return res.json({ 
                success: false, 
                message: "User not found" 
            });
        }
        
        if (user.isEmailVerified) {
            return res.json({ 
                success: false, 
                message: "Email is already verified" 
            });
        }
        
        // Generate new verification code
        const verificationCode = generateVerificationCode();
        const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
        
        // Update user with new code
        user.emailVerificationToken = verificationCode;
        user.emailVerificationExpires = verificationExpires;
        await user.save();
        
        // Send new verification email
        const emailResult = await sendVerificationEmail(user.email, verificationCode, user.name);
        
        if (emailResult.success) {
            res.json({ 
                success: true, 
                message: "New verification code sent to your email" 
            });
        } else {
            console.error('❌ Failed to send verification email:', emailResult.error);
            res.json({ 
                success: false, 
                message: "Failed to send verification email. Please try again later." 
            });
        }
    } catch (error) {
        console.log('Resend verification error:', error);
        res.json({ success: false, message: error.message });
    }
};

// Verify Email with Code
const verifyEmail = async (req, res) => {
    try {
        const { code, email } = req.body; // Change to accept code and email in body
        
        if (!code || !email) {
            return res.json({ 
                success: false, 
                message: "Verification code and email are required" 
            });
        }
        
        const user = await userModel.findOne({
            email: email,
            emailVerificationToken: code, // Direct comparison since we store code directly
            emailVerificationExpires: { $gt: Date.now() }
        });
        
        if (!user) {
            return res.json({ 
                success: false, 
                message: "Invalid or expired verification code" 
            });
        }
        
        // Update user verification status
        user.isEmailVerified = true;
        user.emailVerificationToken = undefined;
        user.emailVerificationExpires = undefined;
        await user.save();
        
        res.json({ 
            success: true, 
            message: "Email verified successfully. You can now log in." 
        });
    } catch (error) {
        console.log('Email verification error:', error);
        res.json({ success: false, message: error.message });
    }
};

// Forgot Password
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.json({ success: false, message: "Email is required" });
        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email address" });
        }

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        // Generate reset code (6 digits)
        const resetCode = generateVerificationCode();
        const resetPasswordExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Save code to user
        user.resetPasswordToken = resetCode; // Store code directly
        user.resetPasswordExpires = resetPasswordExpires;
        await user.save();
        
        // Send password reset email with code
        const emailResult = await sendPasswordResetEmail(user.email, resetCode, user.name);
        
        if (emailResult.success) {
            console.log('✅ Password reset code sent successfully to:', user.email);
            res.json({
                success: true,
                message: "Password reset code sent to your email"
            });
        } else {
            console.error('❌ Failed to send password reset email:', emailResult.error);
            // Still return success to prevent email enumeration attacks
            // but log the error for debugging
            res.json({
                success: true,
                message: "If your email exists in our system, you will receive a password reset code"
            });
        }
    } catch (error) {
        console.log('Forgot password error:', error);
        res.json({ success: false, message: error.message });
    }
};

// Reset Password
const resetPassword = async (req, res) => {
    try {
        const { code, password } = req.body;
        
        if (!code || !password) {
            return res.json({ success: false, message: "Reset code and password are required" });
        }
        
        if (password.length < 8) {
            return res.json({ success: false, message: "Password must be at least 8 characters long" });
        }
        
        const user = await userModel.findOne({
            resetPasswordToken: code, // Direct code comparison
            resetPasswordExpires: { $gt: Date.now() }
        });
        
        if (!user) {
            return res.json({ success: false, message: "Invalid or expired reset code" });
        }
        
        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        // Update user password and clear reset fields
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
        
        res.json({ success: true, message: "Password reset successfully" });
    } catch (error) {
        console.log('Reset password error:', error);
        res.json({ success: false, message: error.message });
    }
};

// Test Email Configuration
const testEmail = async (req, res) => {
    try {
        const result = await testEmailConfiguration();
        
        if (result.success) {
            res.json({ success: true, message: "Email configuration is working correctly" });
        } else {
            res.json({ success: false, message: `Email configuration error: ${result.error}` });
        }
    } catch (error) {
        console.log('Test email error:', error);
        res.json({ success: false, message: error.message });
    }
};

// Wishlist management functions
const addToWishlist = async (req, res) => {
    try {
        const userId = req.user._id;
        const { productId, productData } = req.body;
        
        if (!productId || !productData) {
            return res.json({ success: false, message: "Product ID and product data are required" });
        }

        const user = await userModel.findById(userId);
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        // Check if product already exists in wishlist
        const existingIndex = user.wishlistData.findIndex(item => item._id === productId);
        if (existingIndex !== -1) {
            return res.json({ success: false, message: "Product already in wishlist" });
        }

        // Add product to wishlist
        const wishlistItem = {
            _id: productId,
            name: productData.name,
            price: productData.price,
            image: productData.image,
            reviewCount: productData.reviewCount || 0,
            averageRating: productData.averageRating || 0,
            addedAt: new Date()
        };

        user.wishlistData.push(wishlistItem);
        await user.save();

        res.json({ 
            success: true, 
            message: "Product added to wishlist", 
            wishlistData: user.wishlistData 
        });
    } catch (error) {
        console.log('Add to wishlist error:', error);
        res.json({ success: false, message: error.message });
    }
};

const removeFromWishlist = async (req, res) => {
    try {
        const userId = req.user._id;
        const { productId } = req.body;
        
        if (!productId) {
            return res.json({ success: false, message: "Product ID is required" });
        }

        const user = await userModel.findById(userId);
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        // Remove product from wishlist
        user.wishlistData = user.wishlistData.filter(item => item._id !== productId);
        await user.save();

        res.json({ 
            success: true, 
            message: "Product removed from wishlist", 
            wishlistData: user.wishlistData 
        });
    } catch (error) {
        console.log('Remove from wishlist error:', error);
        res.json({ success: false, message: error.message });
    }
};

const getWishlist = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await userModel.findById(userId);
        
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        res.json({ 
            success: true, 
            wishlistData: user.wishlistData || [] 
        });
    } catch (error) {
        console.log('Get wishlist error:', error);
        res.json({ success: false, message: error.message });
    }
};

const clearWishlist = async (req, res) => {
    try {
        const userId = req.user._id;
        
        const user = await userModel.findByIdAndUpdate(
            userId,
            { wishlistData: [] },
            { new: true }
        );

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        res.json({ 
            success: true, 
            message: "Wishlist cleared successfully",
            wishlistData: []
        });
    } catch (error) {
        console.log('Clear wishlist error:', error);
        res.json({ success: false, message: error.message });
    }
};

const updateWishlist = async (req, res) => {
    try {
        const userId = req.user._id;
        const { wishlistData } = req.body;
        
        if (!Array.isArray(wishlistData)) {
            return res.json({ success: false, message: "Wishlist data must be an array" });
        }

        const user = await userModel.findByIdAndUpdate(
            userId,
            { wishlistData: wishlistData },
            { new: true }
        );

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        res.json({ 
            success: true, 
            message: "Wishlist updated successfully", 
            wishlistData: user.wishlistData 
        });
    } catch (error) {
        console.log('Update wishlist error:', error);
        res.json({ success: false, message: error.message });
    }
};

export {loginUser, registerUser, adminLogin, updateCart, getCart, clearCart, getAdminStats, getUserProfile, updateUserProfile, verifyEmail, resendVerification, forgotPassword, resetPassword, testEmail, addToWishlist, removeFromWishlist, getWishlist, clearWishlist, updateWishlist}