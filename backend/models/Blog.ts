import { Schema, model, models } from 'mongoose';

const blogSchema = new Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, trim: true },
  excerpt: { type: String, required: true },
  content: { type: String, required: true },
  coverImage: { type: String, required: true },
  category: { type: String, required: true },
  status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  publishedAt: { type: Date },
}, { timestamps: true });

export const Blog = models.Blog || model('Blog', blogSchema);
