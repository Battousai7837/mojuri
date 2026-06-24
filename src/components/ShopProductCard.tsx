import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../store/CartContext';
import { useWishlistStore } from '../store/wishlistStore';
import type { Product } from '../types';

export type ShopProduct = Product & {
  secondImage?: string;
  color: string;
  size: string;
  brand: string;
  hot?: boolean;
};

function ActionIcon({ name }: { name: 'bag' | 'heart' | 'compare' | 'search' }) {
  return <svg viewBox="0 0 24 24" aria-hidden="true">
    {name === 'bag' && <><path d="M5 8h14l-1 13H6L5 8Z" /><path d="M9 9V6a3 3 0 0 1 6 0v3" /></>}
    {name === 'heart' && <path d="M20.5 5.8a5.2 5.2 0 0 0-7.4 0L12 6.9l-1.1-1.1a5.2 5.2 0 1 0-7.4 7.4L12 21l8.5-7.8a5.2 5.2 0 0 0 0-7.4Z" />}
    {name === 'compare' && <><path d="M8 4 5 7l3 3M5 7h11a3 3 0 0 1 3 3v1" /><path d="m16 20 3-3-3-3m3 3H8a3 3 0 0 1-3-3v-1" /></>}
    {name === 'search' && <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m15.5 15.5 5 5" /></>}
  </svg>;
}

export default function ShopProductCard({ product, view, onQuickView }: { product: ShopProduct; view: 'grid' | 'list'; onQuickView: (product: ShopProduct) => void }) {
  const { add } = useCart();
  const toggleWishlist = useWishlistStore(state => state.toggle);
  const wished = useWishlistStore(state => state.ids.includes(product._id));
  const [compared, setCompared] = useState(false);
  const price = product.salePrice ?? product.price;
  const discount = product.salePrice ? Math.round((1 - product.salePrice / product.price) * 100) : 0;
  const detailUrl = product._id.startsWith('demo-') ? '/shop-details' : `/shop-details/${product.slug}`;

  function addToCart() {
    add(product);
    window.dispatchEvent(new CustomEvent('mojuri:cart-added'));
  }

  return <article className={`shop-product ${view === 'list' ? 'is-list' : ''}`}>
    <div className="shop-product-image">
      {discount > 0 && <span className="shop-badge discount">-{discount}%</span>}
      {product.hot && <span className="shop-badge hot">Hot</span>}
      <Link to={detailUrl} aria-label={product.name}>
        <img className="primary" src={product.thumbnail} alt={product.name} />
        {product.secondImage && <img className="secondary" src={product.secondImage} alt="" />}
      </Link>
      <div className="shop-product-actions">
        <button type="button" onClick={addToCart} disabled={!product.stock} aria-label="Add to bag"><ActionIcon name="bag" /></button>
        <button className={wished ? 'active' : ''} type="button" onClick={() => toggleWishlist(product._id)} aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}><ActionIcon name="heart" /></button>
        <button className={compared ? 'active' : ''} type="button" onClick={() => setCompared(value => !value)} aria-label={compared ? 'Remove comparison' : 'Compare product'}><ActionIcon name="compare" /></button>
        <button type="button" onClick={() => onQuickView(product)} aria-label="Quick view"><ActionIcon name="search" /></button>
      </div>
    </div>
    <div className="shop-product-info">
      {view === 'grid' && <div className="shop-rating" aria-label={`${product.averageRating || 0} out of 5 stars`}><span>{'★'.repeat(Math.max(0, Math.round(product.averageRating || 0)))}</span>{'★'.repeat(5 - Math.max(0, Math.round(product.averageRating || 0)))} <small>({product.reviews.length} review{product.reviews.length === 1 ? '' : 's'})</small></div>}
      <h3><Link to={detailUrl}>{product.name}</Link></h3>
      <div className="shop-product-price">{product.salePrice != null && <del>${product.price.toFixed(2)}</del>}<strong>${price.toFixed(2)}</strong></div>
      {view === 'list' && <>
        <div className="shop-rating" aria-label={`${product.averageRating || 0} out of 5 stars`}><span>{'★'.repeat(Math.max(0, Math.round(product.averageRating || 0)))}</span>{'★'.repeat(5 - Math.max(0, Math.round(product.averageRating || 0)))} <small>({product.reviews.length} review{product.reviews.length === 1 ? '' : 's'})</small></div>
        <div className="list-product-actions">
          <button className="list-add-button" type="button" disabled={!product.stock} onClick={addToCart}>Add to cart</button>
          <button className={wished ? 'active' : ''} type="button" onClick={() => toggleWishlist(product._id)} aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}><ActionIcon name="heart" /></button>
          <button className={compared ? 'active' : ''} type="button" onClick={() => setCompared(value => !value)} aria-label={compared ? 'Remove comparison' : 'Compare product'}><ActionIcon name="compare" /></button>
        </div>
        <p>{product.description || 'A refined Mojuri piece designed to bring quiet brilliance to every day.'}</p>
      </>}
    </div>
  </article>;
}
