import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {type:String, required:true},
    email: {type:String, required:true, unique:true},
    password: {type:String, required:true},
    cartData: {type: Object, default: {}},
    wishlistData: {type: Array, default: []},
    phone: {type: String, default: ''},
    address: {
        street: {type: String, default: ''},
        city: {type: String, default: ''},
        state: {type: String, default: ''},
        zipCode: {type: String, default: ''},
        country: {type: String, default: ''}
    },
    resetPasswordToken: {type: String},
    resetPasswordExpires: {type: Date},
    // Email verification fields
    isEmailVerified: {type: Boolean, default: false},
    emailVerificationToken: {type: String},
    emailVerificationExpires: {type: Date}
},{minimize:false})

const userModel = mongoose.models.user || mongoose.model('user', userSchema);

export default userModel;