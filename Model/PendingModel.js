import mongoose from 'mongoose';

// User Schema
const PendingSchema = new mongoose.Schema({
  UserType: {
    type: String,
    enum: ['Umuturage', 'Mutwarasibo', 'Mudugudu'],
    required: true,
  },
  FullName: { type: String, required: true },
  Province: { type: String, required: true},
  District:{ type: String, required: true},
  Sector:{ type: String, required: true},
  Cell:{ type: String, required: true},
  Village:{ type: String, required: true},
  Isibo:{ type: String, required: true},
  Email: { type: String, required: true },
  NationalID: { type: String, required: true,unique: true },
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
  approved:{
    type: Boolean,
    required: true,
    default: false
  },
  accountStatus: { type: String, enum: ['Pending', 'Active', 'Revoked'], default: 'Pending' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
const PendingModel = mongoose.model('Pending', PendingSchema);
export default PendingModel;
