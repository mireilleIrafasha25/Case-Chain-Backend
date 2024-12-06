import mongoose from 'mongoose';

// User Schema
const userSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['Umuturage', 'Mutwarasibo', 'Mudugudu', 'Gitifu w’Akagari'],
    required: true,
  },
  FullName: { type: String, required: true },
  Province: { type: String, required: true},
  District:{ type: String, required: true},
  Sector:{ type: String, required: true},
  Cell:{ type: String, required: true},
  Village:{ type: String, required: false},
  Email: { type: String, unique: true, required: true },
  Password: { type: String, required: true },
  Telephone: { type: String, required: true },
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
