import { Schema, model, models } from 'mongoose';

const productSchema = new Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, trim: true },
  description: { type: String, default: '' },
  thumbnail: { type: String, required: true },
  gallery: [{ type: String }],
  price: { type: Number, required: true, min: 0 },
  salePrice: { type: Number, min: 0 },
  stock: { type: Number, default: 0, min: 0 },
  category: { type: String, required: true },
  featured: { type: Boolean, default: false },
  reviews: [{
    name: { type: String, required: true },
    email: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  }],
}, { timestamps: true, toJSON: { virtuals: true } });

productSchema.virtual('status').get(function () { return this.stock > 0 ? 'in_stock' : 'out_of_stock'; });
productSchema.virtual('averageRating').get(function () {
  if (!this.reviews?.length) return 0;
  return this.reviews.reduce((sum: number, review: { rating: number }) => sum + review.rating, 0) / this.reviews.length;
});
export const Product = models.Product || model('Product', productSchema);
