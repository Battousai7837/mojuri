import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import StoreLayout from '../components/StoreLayout';
import ShopProductCard from '../components/ShopProductCard';
import type { ShopProduct } from '../components/ShopProductCard';
import { api } from '../lib/api';
import type { Product } from '../types';
import './store-shop.css';

const CATEGORIES = [
  ['Bracelets', 9], ['Earrings', 4], ['Necklaces', 3], ['Charms', 6], ['Rings', 2], ['Wedding & Bridal', 4],
] as const;
const COLORS = [['Antique', '#d99a82'], ['Bone', '#ead8c4'], ['Chestnut', '#a9443d'], ['Crimson', '#d8b966'], ['Eggshell', '#eee8d8'], ['Grullo', '#a6a489']] as const;
const BRANDS = ['/media/brand/1.jpg', '/media/brand/2.jpg', '/media/brand/3.jpg', '/media/brand/4.jpg', '/media/brand/5.jpg'];

function demoProduct(index: number, name: string, price: number, salePrice?: number): ShopProduct {
  const categories = ['Bracelets', 'Rings', 'Earrings', 'Necklaces'];
  const colors = COLORS.map(item => item[0]);
  return {
    _id: `demo-${index}`, slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'), name,
    description: 'A refined Mojuri piece designed to bring quiet brilliance to every day.',
    thumbnail: `/media/product/${index}.jpg`, secondImage: `/media/product/${index}-2.jpg`, gallery: [],
    price, salePrice, stock: 12, status: 'in_stock', category: categories[index % categories.length], featured: index < 4,
    reviews: Array.from({ length: index % 6 }, (_, reviewIndex) => ({ _id: `${index}-${reviewIndex}`, name: 'Customer', email: '', rating: 5, comment: '', createdAt: '' })),
    averageRating: index % 3 === 0 ? 0 : index % 2 === 0 ? 4 : 5, createdAt: new Date(2026, 5, 20 - index).toISOString(),
    color: colors[index % colors.length], size: ['L', 'M', 'S'][index % 3], brand: String((index % 5) + 1), hot: index === 1 || index === 6 || index === 8 || index === 9,
  };
}

const DEMO_PRODUCTS = [
  demoProduct(1, 'Medium Flat Hoops', 150),
  demoProduct(5, 'Yilver And Turquoise Earrings', 150, 100),
  demoProduct(2, 'Bold Pearl Hoop Earrings', 150),
  demoProduct(6, 'Bora Armchair', 150, 100),
  demoProduct(3, 'Twin Hoops', 100, 90),
  demoProduct(7, 'Diamond Bracelet', 79, 50),
  demoProduct(4, 'Yilver And Turquoise Earrings', 120),
  demoProduct(8, 'X Hoop Earrings', 200, 180),
  demoProduct(9, 'Yintage Medallion Necklace', 140),
  demoProduct(10, 'Pearly Hoop Earrings', 170, 145),
  demoProduct(11, 'Sculpted Gold Ring', 190),
  demoProduct(13, 'Diamond Charm', 240, 210),
];

function enrichProduct(product: Product, index: number): ShopProduct {
  return { ...product, secondImage: product.gallery[0], color: COLORS[index % COLORS.length][0], size: ['L', 'M', 'S'][index % 3], brand: String((index % 5) + 1), hot: product.featured };
}

export default function StoreShop() {
  const location = useLocation();
  const navigate = useNavigate();
  const routeView: 'grid' | 'list' = location.pathname.includes('/shop-list-') ? 'list' : 'grid';
  const sidebarRight = location.pathname.endsWith('-right');
  const fullwidth = location.pathname.includes('fullwidth');
  const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const [view, setView] = useState<'grid' | 'list'>(routeView);
  const [search, setSearch] = useState(queryParams.get('search') ?? '');
  const [category, setCategory] = useState(queryParams.get('category') ?? '');
  const [price, setPrice] = useState(250);
  const [color, setColor] = useState('');
  const [size, setSize] = useState('');
  const [brand, setBrand] = useState('');
  const [sort, setSort] = useState('default');
  const [page, setPage] = useState(1);
  const [quickView, setQuickView] = useState<ShopProduct | null>(null);
  const routeSnapshot = `${location.pathname}${location.search}`;
  const [urlSnapshot, setUrlSnapshot] = useState(routeSnapshot);
  if (urlSnapshot !== routeSnapshot) {
    setUrlSnapshot(routeSnapshot);
    setView(routeView);
    setSearch(queryParams.get('search') ?? '');
    setCategory(queryParams.get('category') ?? '');
    setPage(1);
  }

  const productsQuery = useQuery({
    queryKey: ['products', 'shop-catalog'],
    queryFn: () => api<{ items: Product[] }>('/products?limit=50'),
    retry: false,
  });

  const source = productsQuery.data?.items.length ? productsQuery.data.items.map(enrichProduct) : DEMO_PRODUCTS;
  const filtered = useMemo(() => {
    const value = source.filter(product => {
      const matchesSearch = !search || product.name.toLowerCase().includes(search.toLowerCase());
      return matchesSearch && (!category || product.category === category) && (product.salePrice ?? product.price) <= price && (!color || product.color === color) && (!size || product.size === size) && (!brand || product.brand === brand);
    });
    if (sort === 'price-low') value.sort((a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price));
    if (sort === 'price-high') value.sort((a, b) => (b.salePrice ?? b.price) - (a.salePrice ?? a.price));
    if (sort === 'rating') value.sort((a, b) => b.averageRating - a.averageRating);
    if (sort === 'latest') value.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
    if (sort === 'popularity') value.sort((a, b) => b.reviews.length - a.reviews.length);
    return value;
  }, [source, search, category, price, color, size, brand, sort]);
  const pageSize = fullwidth && view === 'grid' ? 12 : 9;
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const items = filtered.slice((page - 1) * pageSize, page * pageSize);

  function applyFilter(setter: (value: string) => void, value: string) {
    setter(value);
    setPage(1);
  }

  function changeView(nextView: 'grid' | 'list') {
    setView(nextView);
    if (!fullwidth) navigate(`/shop-${nextView}-${sidebarRight ? 'right' : 'left'}${location.search}`);
  }

  return <StoreLayout>
    <main className="shop-page">
      <section className="shop-hero">
        <div><h1>{category || 'Bracelets'}</h1><nav aria-label="Breadcrumb"><Link to="/">Home</Link><span>/</span><Link to="/shop-grid-left">Shop</Link><span>/</span><strong>{category || 'Bracelets'}</strong></nav></div>
      </section>

      <div className={`shop-layout ${sidebarRight ? 'sidebar-right' : ''} ${fullwidth ? 'shop-fullwidth' : ''}`}>
        {!fullwidth && <aside className="shop-sidebar">
          <section className="shop-filter"><h2>Categories</h2><ul>{CATEGORIES.map(([name, count]) => <li key={name}><button className={(category || 'Bracelets') === name ? 'active' : ''} onClick={() => applyFilter(setCategory, category === name ? '' : name)}>{name}<span>{count}</span></button></li>)}</ul></section>
          <section className="shop-filter"><h2>Price</h2><input aria-label="Maximum price" type="range" min="0" max="250" step="10" value={price} onChange={event => { setPrice(Number(event.target.value)); setPage(1); }} /><div className="price-values"><span>0 $</span><span>{price} $</span></div></section>
          <section className="shop-filter"><h2>Color</h2><ul className="color-filter">{COLORS.map(([name, swatch], index) => <li key={name}><button className={color === name ? 'active' : ''} onClick={() => applyFilter(setColor, color === name ? '' : name)}><i style={{ background: swatch }} />{name}<span>{[3, 2, 5, 8, 3, 4][index]}</span></button></li>)}</ul></section>
          <section className="shop-filter"><h2>Size</h2><div className="size-filter">{['L', 'M', 'S'].map(value => <button className={size === value ? 'active' : ''} key={value} onClick={() => applyFilter(setSize, size === value ? '' : value)}>{value}</button>)}</div></section>
          <section className="shop-filter"><h2>Brands</h2><div className="brand-filter">{BRANDS.map((image, index) => <button className={brand === String(index + 1) ? 'active' : ''} key={image} onClick={() => applyFilter(setBrand, brand === String(index + 1) ? '' : String(index + 1))}><img src={image} alt={`Brand ${index + 1}`} /></button>)}</div></section>
          <section className="shop-filter feature-products"><h2>Feature Product</h2>{DEMO_PRODUCTS.slice(0, 3).map(product => <article key={product._id}><img src={product.thumbnail} alt={product.name} /><div><Link to="/shop-details">{product.name}</Link><div className="mini-stars">★★★★★</div><p>{product.salePrice && <del>${product.price.toFixed(2)}</del>} ${(product.salePrice ?? product.price).toFixed(2)}</p></div></article>)}</section>
        </aside>}

        <section className="shop-catalog">
          {search && <div className="shop-search-summary">Search results for “{search}” <button onClick={() => setSearch('')}>Clear</button></div>}
          <div className="shop-toolbar"><p>Showing all {filtered.length} results</p><div><button className={view === 'grid' ? 'active' : ''} aria-label="Grid view" onClick={() => changeView('grid')}>▦</button><button className={view === 'list' ? 'active' : ''} aria-label="List view" onClick={() => changeView('list')}>☷</button><select value={sort} onChange={event => setSort(event.target.value)} aria-label="Sort products"><option value="default">Default Sorting</option><option value="popularity">Sort by popularity</option><option value="rating">Sort by average rating</option><option value="latest">Sort by latest</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option></select></div></div>
          <div className={`shop-products ${view === 'list' ? 'list-view' : ''} ${fullwidth && view === 'grid' ? 'fullwidth-grid' : ''}`}>{items.map(product => <ShopProductCard key={product._id} product={product} view={view} onQuickView={setQuickView} />)}</div>
          {!items.length && <div className="shop-no-results"><h2>No products found</h2><p>Try clearing one or more filters.</p><button onClick={() => { setCategory(''); setColor(''); setSize(''); setBrand(''); setPrice(250); }}>Clear filters</button></div>}
          {items.length > 0 && <nav className="shop-pagination" aria-label="Product pages"><button disabled={page === 1} onClick={() => setPage(value => Math.max(1, value - 1))}>‹</button>{Array.from({ length: pages }, (_, index) => <button className={page === index + 1 ? 'active' : ''} key={index} onClick={() => setPage(index + 1)}>{index + 1}</button>)}<button disabled={page === pages} onClick={() => setPage(value => Math.min(pages, value + 1))}>›</button></nav>}
        </section>
      </div>
    </main>

    {quickView && <div className="quick-view-backdrop" role="dialog" aria-modal="true" aria-label={`Quick view ${quickView.name}`} onMouseDown={() => setQuickView(null)}><div className="quick-view" onMouseDown={event => event.stopPropagation()}><button className="quick-close" onClick={() => setQuickView(null)} aria-label="Close">×</button><img src={quickView.thumbnail} alt={quickView.name} /><div><p className="quick-eyebrow">{quickView.category}</p><h2>{quickView.name}</h2><div className="quick-price">${(quickView.salePrice ?? quickView.price).toFixed(2)}</div><p>{quickView.description}</p><Link to={quickView._id.startsWith('demo-') ? '/shop-details' : `/shop-details/${quickView.slug}`}>View full details</Link></div></div></div>}
  </StoreLayout>;
}
