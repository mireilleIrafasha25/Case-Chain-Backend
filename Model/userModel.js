import mongoose from 'mongoose';

// User Schema
const userSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['Umuturage', 'Mutwarasibo', 'Mudugudu', 'Gitifu w’Akagari'],
    required: true,
  },
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  otp: { type: Number },
  otpExpiry: { type: Date },
  verified:{
    type:Boolean,
    required:true,
    default:false
},
  accountStatus: { type: String, enum: ['Pending', 'Active', 'Revoked'], default: 'Pending' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const UserModel = mongoose.model('User', userSchema);
export default UserModel;
