import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useLocation } from 'react-router-dom';
import StoreLayout from '../components/StoreLayout';
import BlogSidebar from '../components/BlogSidebar';
import { api } from '../lib/api';
import { DEMO_BLOG_POSTS, blogDate } from '../data/blogData';
import type { BlogPost } from '../types';
import './store-blog.css';

export default function StoreBlog() {
  const location = useLocation();
  const isList = location.pathname.includes('/blog-list-');
  const sidebarRight = location.pathname.endsWith('-right');
  const fullwidth = location.pathname.includes('fullwidth');
  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const [search, setSearch] = useState(params.get('search') ?? '');
  const [category, setCategory] = useState(params.get('category') ?? '');
  const [page, setPage] = useState(1);
  const routeSnapshot = `${location.pathname}${location.search}`;
  const [snapshot, setSnapshot] = useState(routeSnapshot);
  if (snapshot !== routeSnapshot) {
    setSnapshot(routeSnapshot);
    setSearch(params.get('search') ?? '');
    setCategory(params.get('category') ?? '');
    setPage(1);
  }

  const postsQuery = useQuery({ queryKey: ['blogs', 'journal'], queryFn: () => api<{ items: BlogPost[] }>('/blogs?limit=50'), retry: false });
  const source = postsQuery.data?.items.length ? postsQuery.data.items : DEMO_BLOG_POSTS;
  const filtered = source.filter(post => (!search || `${post.title} ${post.excerpt}`.toLowerCase().includes(search.toLowerCase())) && (!category || post.category === category));
  const pageSize = fullwidth ? 9 : 6;
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const items = filtered.slice((page - 1) * pageSize, page * pageSize);

  return <StoreLayout>
    <main className="journal-page">
      <section className="journal-hero"><div><h1>{category || 'Wedding & Bridal'}</h1><nav><Link to="/">Home</Link><span>/</span><strong>{category || 'Wedding & Bridal'}</strong></nav></div></section>
      <div className={`journal-layout ${sidebarRight ? 'sidebar-right' : ''} ${fullwidth ? 'journal-fullwidth' : ''}`}>
        {!fullwidth && <BlogSidebar search={search} category={category} onSearch={value => { setSearch(value); setPage(1); }} onCategory={value => { setCategory(value); setPage(1); }} />}
        <section className="journal-catalog">
          {(search || category) && <div className="journal-filter-summary"><span>{filtered.length} stories found</span><button onClick={() => { setSearch(''); setCategory(''); }}>Clear filters</button></div>}
          <div className={`journal-posts ${isList ? 'journal-list' : 'journal-grid'} ${fullwidth ? 'journal-grid-fullwidth' : ''}`}>
            {items.map(post => <article className="journal-card" key={post._id}>
              <Link className="journal-image" to={`/blog/${post.slug}`}><img src={post.coverImage} alt={post.title} /></Link>
              <div className="journal-card-body"><small>{post.category}</small><h2><Link to={`/blog/${post.slug}`}>{post.title}</Link></h2><div className="journal-meta"><span>{blogDate(post)}</span><span>{(Number(post._id.replace(/\D/g, '')) || 1) % 5 + 1} Comments</span></div>{isList && <><p>{post.excerpt}</p><Link className="journal-read-more" to={`/blog/${post.slug}`}>Read more</Link></>}</div>
            </article>)}
          </div>
          {!items.length && <div className="journal-empty"><h2>No stories found</h2><button onClick={() => { setSearch(''); setCategory(''); }}>Clear filters</button></div>}
          {items.length > 0 && <nav className="journal-pagination" aria-label="Blog pages"><button disabled={page === 1} onClick={() => setPage(value => value - 1)}>‹</button>{Array.from({ length: pages }, (_, index) => <button className={page === index + 1 ? 'active' : ''} key={index} onClick={() => setPage(index + 1)}>{index + 1}</button>)}<button disabled={page === pages} onClick={() => setPage(value => value + 1)}>›</button></nav>}
        </section>
      </div>
    </main>
  </StoreLayout>;
}
