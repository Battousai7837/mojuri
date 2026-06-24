import { Schema, model, models } from 'mongoose';

const orderSchema = new Schema({
  code: { type: String, required: true, unique: true, index: true },
  customer: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true, lowercase: true },
    address: { type: String, required: true },
    note: { type: String, default: '' },
  },
  items: [{
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    thumbnail: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
  }],
  subtotal: { type: Number, required: true },
  shippingFee: { type: Number, required: true },
  total: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
}, { timestamps: true });

export const Order = models.Order || model('Order', orderSchema);
