import { useState } from 'react';
import type { FormEvent } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useLocation, useParams } from 'react-router-dom';
import StoreLayout from '../components/StoreLayout';
import BlogSidebar from '../components/BlogSidebar';
import { api } from '../lib/api';
import { DEMO_BLOG_POSTS, blogDate } from '../data/blogData';
import type { BlogPost } from '../types';
import './store-blog.css';

type LocalComment = { name: string; message: string };

export default function StoreBlogDetail() {
  const { slug = '' } = useParams();
  const location = useLocation();
  const sidebarLeft = location.pathname.endsWith('-left');
  const sidebarRight = location.pathname.endsWith('-right');
  const fullwidth = location.pathname.includes('fullwidth') || (!sidebarLeft && !sidebarRight);
  const fallback = DEMO_BLOG_POSTS.find(post => post.slug === slug) ?? DEMO_BLOG_POSTS[0];
  const postQuery = useQuery({ queryKey: ['blog', slug], queryFn: () => api<BlogPost>(`/blogs/${slug}`), enabled: Boolean(slug), retry: false });
  const post = postQuery.data ?? fallback;
  const [comments, setComments] = useState<LocalComment[]>([{ name: 'Rosie', message: 'Such a beautiful collection and a lovely story behind every detail.' }]);

  function submitComment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setComments(value => [...value, { name: String(form.get('name') || 'Guest'), message: String(form.get('message') || '') }]);
    event.currentTarget.reset();
  }

  const index = DEMO_BLOG_POSTS.findIndex(item => item.slug === post.slug);
  const previous = DEMO_BLOG_POSTS[(index - 1 + DEMO_BLOG_POSTS.length) % DEMO_BLOG_POSTS.length];
  const next = DEMO_BLOG_POSTS[(index + 1) % DEMO_BLOG_POSTS.length];

  return <StoreLayout>
    <main className="journal-page detail-page">
      <section className="journal-hero detail-hero"><div><h1>{post.title}</h1><nav><Link to="/">Home</Link><span>/</span><strong>{post.title}</strong></nav></div></section>
      <div className={`journal-layout detail-layout ${sidebarRight ? 'sidebar-right' : ''} ${fullwidth ? 'journal-fullwidth' : ''}`}>
        {!fullwidth && <BlogSidebar />}
        <article className="journal-article">
          <img className="detail-cover" src={post._id.startsWith('demo-') ? '/media/blog/details.jpg' : post.coverImage} alt={post.title} />
          <div className="detail-meta"><span>{post.category}</span><span>{blogDate(post)}</span><span>{comments.length} Comments</span></div>
          <h1>{post.title}</h1>
          <div className="detail-content" dangerouslySetInnerHTML={{ __html: post.content }} />
          <div className="detail-taxonomy"><div><strong>Tags:</strong> <Link to="/blog-grid-left">Jewelry</Link>, <Link to="/blog-grid-left">Wedding</Link></div><div className="detail-share"><strong>Share:</strong><button aria-label="Facebook">f</button><button aria-label="Twitter">t</button><button aria-label="Pinterest">p</button></div></div>
          <nav className="detail-post-nav"><Link to={`/blog/${previous.slug}`}><small>Previous Post</small><strong>{previous.title}</strong></Link><Link to={`/blog/${next.slug}`}><small>Next Post</small><strong>{next.title}</strong></Link></nav>
          <section className="detail-comments"><h2>{comments.length} Comment{comments.length === 1 ? '' : 's'}</h2>{comments.map((comment, commentIndex) => <article key={`${comment.name}-${commentIndex}`}><div className="comment-avatar">{comment.name.charAt(0).toUpperCase()}</div><div><h3>{comment.name}</h3><small>June 24, 2026</small><p>{comment.message}</p></div></article>)}</section>
          <form className="comment-form" onSubmit={submitComment}><h2>Leave A Reply</h2><p>Your email address will not be published. Required fields are marked *</p><textarea name="message" placeholder="Comment *" required /><div><input name="name" placeholder="Name *" required /><input name="email" type="email" placeholder="Email *" required /></div><button type="submit">Post Comment</button></form>
        </article>
      </div>
    </main>
  </StoreLayout>;
}
