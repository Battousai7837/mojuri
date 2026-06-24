export type Review = { _id: string; name: string; email: string; rating: number; comment: string; createdAt: string };
export type Product = { _id: string; name: string; slug: string; description: string; thumbnail: string; gallery: string[]; price: number; salePrice?: number; stock: number; status: string; category: string; featured: boolean; reviews: Review[]; averageRating: number; createdAt: string };
export type Category = { _id: string; name: string; slug: string; description: string };
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type Order = { _id: string; code: string; customer: { name: string; phone: string; email: string; address: string; note: string }; items: { productId: string; name: string; thumbnail: string; price: number; quantity: number }[]; subtotal: number; shippingFee: number; total: number; status: OrderStatus; createdAt: string };
export type BlogPost = { _id: string; title: string; slug: string; excerpt: string; content: string; coverImage: string; category: string; status: 'draft' | 'published'; publishedAt?: string; createdAt: string };
export type BlogCategory = { _id: string; name: string; slug: string };
export type ContactMessage = { _id: string; name: string; email: string; subject: string; message: string; status: 'read' | 'unread'; createdAt: string };
