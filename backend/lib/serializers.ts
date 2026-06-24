import type { Product, Review } from '@prisma/client';

export function productJson(product: Product & { reviews?: Review[] }) {
  const reviews = product.reviews ?? [];
  return { ...product, _id: product.id, status: product.stock > 0 ? 'in_stock' : 'out_of_stock', reviews: reviews.map(review => ({ ...review, _id: review.id })), averageRating: reviews.length ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0 };
}

export function idJson<T extends { id: string }>(item: T) { return { ...item, _id: item.id }; }
