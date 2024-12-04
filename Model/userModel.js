import mongoose from 'mongoose';

// User Schema
const userSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['Umuturage', 'Mutwarasibo', 'Mudugudu', 'Gitifu w’Akagari'],
    required: true,
  },
  FullName: { type: String, required: true },
  Province: { type: String, required: true },
  District: { type: String, required: true },
  Sector: { type: String, required: true },
  Cell: { type: String, required: true },
  Village: { type: String, required: true },
  Email: { type: String, unique: true, required: true },
  NationalId: { type: String, unique: true, required: true, index: { unique: true } },  // NationalId as unique
  Gender: { type: String, required: true },
  Password: { type: String, required: true },
  Telephone: { type: String, required: true },
  otp: { type: Number },
  otpExpiry: { type: Date },
  verified: {
    type: Boolean,
    required: true,
    default: false
  },
  accountStatus: { type: String, enum: ['Pending', 'Active', 'Revoked'], default: 'Pending' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Create an index on NationalId to ensure uniqueness
userSchema.index({ NationalId: 1 }, { unique: true });

const UserModel = mongoose.model('User', userSchema);
export default UserModel;
