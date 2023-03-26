import mongoose from "mongoose";

const Schema = mongoose.Schema;

// order
const OrderSchema = new Schema ({
  itemID: [
    {
      itemid: {
        type: Schema.Types.ObjectId, 
        ref: 'Item', required: true  
      },
      amount: {
        type: Number,
        required: true
      },
      title: {
        type: String,
        required: true
      },
      url: {
        type: String,
        required: true
      },
      unitPrice: {
        type: Number,
        required: true
      }
    }
  ],
  timeOfSale: { 
    type: Date, 
    default: Date.now() 
  },
  userName: { 
    type: Schema.Types.ObjectId, 
    ref: 'User'
  },
  orderID: {
    type: Number,
    required: true,
    unique: true
  },
  total: {
    type: Number,
    required: true,
  }
});

export const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);