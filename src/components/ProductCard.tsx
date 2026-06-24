import { Link } from 'react-router-dom';
import { useCart } from '../store/CartContext';
import type { Product } from '../types';

export default function ProductCard({ product }: { product: Product }) {
  const { add } = useCart(); const price = product.salePrice ?? product.price;
  return <article className="product-card"><Link to={`/shop-details/${product.slug}`} className="product-image"><img src={product.thumbnail} alt={product.name}/>{product.salePrice != null && <span>Sale</span>}</Link><div className="product-meta"><small>{product.category}</small><h3><Link to={`/shop-details/${product.slug}`}>{product.name}</Link></h3><div className="product-price">{product.salePrice != null && <del>${product.price.toFixed(2)}</del>}<b>${price.toFixed(2)}</b></div><button disabled={!product.stock} onClick={() => add(product)}>{product.stock ? 'Add to bag' : 'Out of stock'}</button></div></article>;
}
