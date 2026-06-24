import type { ReactNode } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '../types';

export type CartItem = { productId: string; slug: string; name: string; thumbnail: string; price: number; stock: number; quantity: number };
type CartState = { items: CartItem[]; add: (product: Product, quantity?: number) => void; update: (id: string, quantity: number) => void; remove: (id: string) => void; clear: () => void };
const useCartStore = create<CartState>()(persist((set) => ({
  items: [],
  add: (product, quantity = 1) => set(state => {
    const found = state.items.find(item => item.productId === product._id);
    if (found) return { items: state.items.map(item => item.productId === product._id ? { ...item, quantity: Math.min(product.stock, item.quantity + quantity) } : item) };
    return { items: [...state.items, { productId: product._id, slug: product.slug, name: product.name, thumbnail: product.thumbnail, price: product.salePrice ?? product.price, stock: product.stock, quantity: Math.min(product.stock, quantity) }] };
  }),
  update: (id, quantity) => set(state => ({ items: state.items.map(item => item.productId === id ? { ...item, quantity: Math.max(1, Math.min(item.stock, quantity)) } : item) })),
  remove: id => set(state => ({ items: state.items.filter(item => item.productId !== id) })),
  clear: () => set({ items: [] }),
}), { name: 'mojuri_cart' }));

export function CartProvider({ children }: { children: ReactNode }) { return children; }

// Compatibility hook keeps existing components intact while Zustand owns global state.
// eslint-disable-next-line react-refresh/only-export-components
export function useCart() { const state = useCartStore(); return { ...state, count: state.items.reduce((sum,item)=>sum+item.quantity,0), subtotal: state.items.reduce((sum,item)=>sum+item.price*item.quantity,0) }; }
