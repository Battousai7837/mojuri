import { Schema, model, models } from 'mongoose';

const contactSchema = new Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  subject: { type: String, required: true, trim: true },
  message: { type: String, required: true, trim: true },
  status: { type: String, enum: ['unread', 'read'], default: 'unread' },
}, { timestamps: true });

export const Contact = models.Contact || model('Contact', contactSchema);
