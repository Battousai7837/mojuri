import { Link } from 'react-router-dom';
import { BLOG_CATEGORIES, DEMO_BLOG_POSTS, blogDate } from '../data/blogData';

export default function BlogSidebar({ search = '', category = '', onSearch, onCategory }: { search?: string; category?: string; onSearch?: (value: string) => void; onCategory?: (value: string) => void }) {
  return <aside className="blog-sidebar">
    <section className="blog-widget"><h2>Search</h2><label className="blog-search"><input value={search} onChange={event => onSearch?.(event.target.value)} placeholder="Search..." aria-label="Search blog" /><span>⌕</span></label></section>
    <section className="blog-widget"><h2>Categories</h2><ul>{BLOG_CATEGORIES.map(([name, count]) => <li key={name}>{onCategory ? <button className={category === name ? 'active' : ''} onClick={() => onCategory(category === name ? '' : name)}>{name}<span>{count}</span></button> : <Link to={`/blog-grid-left?category=${encodeURIComponent(name)}`}>{name}<span>{count}</span></Link>}</li>)}</ul></section>
    <section className="blog-widget blog-recent"><h2>Recent Posts</h2>{DEMO_BLOG_POSTS.slice(0, 3).map(post => <article key={post._id}><img src={post.coverImage} alt="" /><div><Link to={`/blog/${post.slug}`}>{post.title}</Link><small>{blogDate(post)}</small></div></article>)}</section>
    <section className="blog-widget"><h2>Tags</h2><div className="blog-tags">{['Bracelets', 'Earrings', 'Fashion', 'Jewelry', 'Necklaces', 'Wedding'].map(tag => <Link key={tag} to={`/blog-grid-left?category=${encodeURIComponent(tag)}`}>{tag}</Link>)}</div></section>
  </aside>;
}
