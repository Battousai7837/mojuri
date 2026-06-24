import { useEffect, useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useCart } from '../store/CartContext';
import { useWishlistStore } from '../store/wishlistStore';
import './client.css';

function Icon({ name }: { name: 'search' | 'user' | 'heart' | 'bag' | 'menu' | 'close' }) {
  const paths = {
    search: <><circle cx="11" cy="11" r="7" /><path d="m16 16 5 5" /></>,
    user: <><circle cx="12" cy="8" r="4" /><path d="M4 21c.5-5 3-7 8-7s7.5 2 8 7" /></>,
    heart: <path d="M20.8 5.8a5.5 5.5 0 0 0-7.8 0L12 6.9l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 22l8.8-8.4a5.5 5.5 0 0 0 0-7.8Z" />,
    bag: <><path d="M5 8h14l-1 13H6L5 8Z" /><path d="M9 9V6a3 3 0 0 1 6 0v3" /></>,
    menu: <><path d="M3 6h18M3 12h18M3 18h18" /></>,
    close: <path d="m5 5 14 14M19 5 5 19" />,
  };
  return <svg viewBox="0 0 24 24" aria-hidden="true">{paths[name]}</svg>;
}

export default function StoreLayout({ children }: { children: ReactNode }) {
  const { count, items, subtotal, remove } = useCart();
  const wishlistCount = useWishlistStore(state => state.ids.length);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileSubmenu, setMobileSubmenu] = useState<'home' | 'shop' | 'blog' | 'pages' | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    let timer = 0;
    const showCart = () => {
      window.clearTimeout(timer);
      setCartOpen(true);
      timer = window.setTimeout(() => setCartOpen(false), 4000);
    };
    window.addEventListener('mojuri:cart-added', showCart);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('mojuri:cart-added', showCart);
    };
  }, []);

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = String(new FormData(event.currentTarget).get('search') ?? '').trim();
    navigate(`/shop-grid-left${value ? `?search=${encodeURIComponent(value)}` : ''}`);
    setSearchOpen(false);
  }

  return <div className="store-app">
    <header className="mojuri-header">
      <button className="mojuri-menu-toggle" type="button" aria-label="Toggle menu" onClick={() => setMenuOpen(value => !value)}><Icon name={menuOpen ? 'close' : 'menu'} /></button>
      <Link to="/" className="mojuri-logo"><img src="/media/logo.png" alt="Mojuri" /></Link>
      <nav className={menuOpen ? 'open' : ''} aria-label="Main navigation">
        <div className="nav-item home-nav-item">
          <NavLink className="reference-home" to="/">Home <span className="nav-chevron" /></NavLink>
          <button className="mobile-submenu-toggle" type="button" aria-label="Toggle home menu" aria-expanded={mobileSubmenu === 'home'} onClick={() => setMobileSubmenu(value => value === 'home' ? null : 'home')}>⌄</button>
          <div className={`nav-dropdown simple-nav-dropdown home-dropdown ${mobileSubmenu === 'home' ? 'mobile-open' : ''}`}>
            <Link to="/">Home Clean</Link><Link to="/index2">Home Collection</Link><Link to="/index3">Home Minimal</Link><Link to="/index4">Home Modern</Link><Link to="/index5">Home Parallax</Link><Link to="/index6">Home Strong</Link><Link to="/index7">Home Style</Link><Link to="/index8">Home Unique</Link>
          </div>
        </div>
        <div className="nav-item shop-nav-item">
          <NavLink to="/shop-grid-left">Shop <span className="nav-chevron" /></NavLink>
          <button className="mobile-submenu-toggle" type="button" aria-label="Toggle shop menu" aria-expanded={mobileSubmenu === 'shop'} onClick={() => setMobileSubmenu(value => value === 'shop' ? null : 'shop')}>⌄</button>
          <div className={`shop-mega-menu ${mobileSubmenu === 'shop' ? 'mobile-open' : ''}`}>
            <div className="shop-mega-primary">
              <Link className="featured" to="/shop-grid-left">Shop - Products <span>›</span></Link>
              <Link to="/shop-details">Shop Details</Link>
              <Link to="/shop-cart">Shop - Cart</Link>
              <Link to="/shop-checkout">Shop - Checkout</Link>
              <Link to="/shop-wishlist">Shop - Wishlist</Link>
            </div>
            <div className="shop-mega-secondary">
              <Link to="/shop-grid-left">Shop Grid - Left Sidebar</Link>
              <Link to="/shop-list-left">Shop List - Left Sidebar</Link>
              <Link to="/shop-grid-right">Shop Grid - Right Sidebar</Link>
              <Link to="/shop-list-right">Shop List - Right Sidebar</Link>
              <Link to="/shop-grid-fullwidth">Shop Grid - No Sidebar</Link>
            </div>
          </div>
        </div>
        <div className="nav-item blog-nav-item">
          <NavLink to="/blog-grid-left">Blog <span className="nav-chevron" /></NavLink>
          <button className="mobile-submenu-toggle" type="button" aria-label="Toggle blog menu" aria-expanded={mobileSubmenu === 'blog'} onClick={() => setMobileSubmenu(value => value === 'blog' ? null : 'blog')}>⌄</button>
          <div className={`nav-dropdown blog-mega-menu ${mobileSubmenu === 'blog' ? 'mobile-open' : ''}`}>
            <div className="blog-menu-links">
              <section><h3>Blog Category</h3><Link to="/blog-grid-left">Blog Grid - Left Sidebar</Link><Link to="/blog-grid-right">Blog Grid - Right Sidebar</Link><Link to="/blog-list-left">Blog List - Left Sidebar</Link><Link to="/blog-list-right">Blog List - Right Sidebar</Link><Link to="/blog-grid-fullwidth">Blog Grid - No Sidebar</Link></section>
              <section><h3>Blog Details</h3><Link to="/blog-details-left">Blog Details - Left Sidebar</Link><Link to="/blog-details-right">Blog Details - Right Sidebar</Link><Link to="/blog-details-fullwidth">Blog Details - No Sidebar</Link></section>
            </div>
            <section className="blog-menu-recent"><h3>Recent Posts</h3>{[
              ['/media/blog/1.jpg', 'Bridial Fair Collections 2023', '/blog-details-right'],
              ['/media/blog/2.jpg', 'Our Sterling Silver', '/blog-details-right'],
              ['/media/blog/3.jpg', 'Kitchen Inspired On Japanese', '/blog-details-right'],
            ].map(([image, title, url]) => <article key={title}><img src={image} alt="" /><div><Link to={url}>{title}</Link><small>May 30, 2022 · 4 Comments</small></div></article>)}</section>
          </div>
        </div>
        <div className="nav-item pages-nav-item">
          <NavLink to="/page-about">Pages <span className="nav-chevron" /></NavLink>
          <button className="mobile-submenu-toggle" type="button" aria-label="Toggle pages menu" aria-expanded={mobileSubmenu === 'pages'} onClick={() => setMobileSubmenu(value => value === 'pages' ? null : 'pages')}>⌄</button>
          <div className={`nav-dropdown simple-nav-dropdown pages-dropdown ${mobileSubmenu === 'pages' ? 'mobile-open' : ''}`}>
            <Link to="/page-login">Login / Register</Link><Link to="/page-forgot-password">Forgot Password</Link><Link to="/page-my-account">My Account</Link><Link to="/page-about">About Us</Link><Link to="/page-contact">Contact</Link><Link to="/page-faq">FAQ</Link><Link to="/page-404">Page 404</Link>
          </div>
        </div>
        <NavLink to="/page-contact">Contact</NavLink>
      </nav>
      <div className="mojuri-header-actions">
        <button type="button" aria-label="Search" onClick={() => setSearchOpen(true)}><Icon name="search" /></button>
        <Link to="/page-login" aria-label="My account"><Icon name="user" /></Link>
        <Link className="header-count-link" to="/shop-wishlist" aria-label={`Wishlist with ${wishlistCount} items`}><Icon name="heart" />{wishlistCount > 0 && <b>{wishlistCount}</b>}</Link>
        <div className="header-cart" onMouseEnter={() => setCartOpen(true)} onMouseLeave={() => setCartOpen(false)}>
          <Link className="header-count-link" to="/shop-cart" aria-label={`Shopping bag with ${count} items`}><Icon name="bag" />{count > 0 && <b>{count}</b>}</Link>
          <div className={`mini-cart-panel ${cartOpen ? 'open' : ''}`}>
            <div className="mini-cart-title"><strong>Shopping Cart</strong><span>{count} item{count === 1 ? '' : 's'}</span></div>
            {items.length ? <>
              <div className="mini-cart-items">{items.slice(-3).reverse().map(item => <article key={item.productId}><img src={item.thumbnail} alt={item.name} /><div><Link to={item.productId.startsWith('demo-') ? '/shop-details' : `/shop-details/${item.slug}`}>{item.name}</Link><small>Qty: {item.quantity}</small><strong>${(item.price * item.quantity).toFixed(2)}</strong></div><button type="button" onClick={() => remove(item.productId)} aria-label={`Remove ${item.name}`}>×</button></article>)}</div>
              <div className="mini-cart-total"><span>Total:</span><strong>${subtotal.toFixed(2)}</strong></div>
              <div className="mini-cart-buttons"><Link to="/shop-cart">View cart</Link><Link to="/shop-checkout">Check out</Link></div>
            </> : <div className="mini-cart-empty"><Icon name="bag" /><p>No products in the cart.</p><Link to="/shop-grid-left">Go to shop</Link></div>}
          </div>
        </div>
      </div>
    </header>

    {searchOpen && <div className="mojuri-search-overlay" role="dialog" aria-modal="true" aria-label="Search products">
      <button type="button" aria-label="Close search" onClick={() => setSearchOpen(false)}><Icon name="close" /></button>
      <form onSubmit={submitSearch}><label htmlFor="site-search">What are you looking for?</label><div><input id="site-search" name="search" autoFocus placeholder="Search products..." /><button type="submit"><Icon name="search" /></button></div></form>
    </div>}

    {children}

    <footer className="mojuri-footer">
      <div className="mojuri-footer-grid">
        <section><h2>Contact Us</h2><p><strong>Head Office:</strong> 26 Wyle Cop, Shrewsbury, Shropshire, SY1 1XD</p><p><strong>Tel:</strong> 01743 234500</p><p><strong>Email:</strong> <a href="mailto:support@mojuri.com">support@mojuri.com</a></p><div className="footer-social"><a href="#" aria-label="Twitter">t</a><a href="#" aria-label="Instagram">◎</a><a href="#" aria-label="Dribbble">◉</a><a href="#" aria-label="Behance">Bē</a></div></section>
        <section><h2>Customer Services</h2><Link to="/page-contact">Contact Us</Link><Link to="/order-tracking">Track Your Order</Link><a href="#">Product Care &amp; Repair</a><a href="#">Book an Appointment</a><Link to="/page-faq">Frequently Asked Questions</Link><a href="#">Shipping &amp; Returns</a></section>
        <section><h2>About Us</h2><Link to="/page-about">About Us</Link><Link to="/page-faq">FAQ</Link><a href="#">Our Producers</a><a href="#">Sitemap</a><a href="#">Terms &amp; Conditions</a><a href="#">Privacy Policy</a></section>
        <section><h2>Catalog</h2><Link to="/shop-grid-left?category=Earrings">Earrings</Link><Link to="/shop-grid-left?category=Necklaces">Necklaces</Link><Link to="/shop-grid-left?category=Bracelets">Bracelets</Link><Link to="/shop-grid-left?category=Rings">Rings</Link><Link to="/shop-grid-left">Jewelry Box</Link><Link to="/shop-grid-left">Studs</Link></section>
      </div>
      <div className="mojuri-footer-bottom"><span>Copyright © 2026. All Right Reserved</span><img src="/media/payments.png" alt="Accepted payment methods" /></div>
    </footer>
  </div>;
}
