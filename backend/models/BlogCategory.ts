import { Schema, model, models } from 'mongoose';

const schema = new Schema({ name: { type: String, required: true, unique: true, trim: true }, slug: { type: String, required: true, unique: true, trim: true } }, { timestamps: true });
export const BlogCategory = models.BlogCategory || model('BlogCategory', schema);
