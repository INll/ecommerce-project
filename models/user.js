import mongoose from "mongoose";

const Schema = mongoose.Schema;

// user
const UserSchema = new Schema ({
  userName: { 
    type: String, 
    required: true,
    unique: true
  },
  passWord: { 
    type: String, 
    required: true 
  },
  clearance: { 
    type: Number, 
    min: 0, 
    max: 2 
  },
  favItems: { 
    type: [String],
  },
  creationTime: { 
    type: Date, 
    default: Date.now 
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },
  orders: [Number],
  hasUploaded: {
    type: Number,
    min: 0,
    default: 0
  }
});

export const User = mongoose.models.User || mongoose.model('User', UserSchema);