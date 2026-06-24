import type { BlogPost } from '../types';

const content = `<p>Jewelry has always been more than an accessory. It holds memories, marks meaningful moments and becomes part of the stories we carry with us.</p><p>This season celebrates softly sculpted forms, luminous details and pieces designed to feel personal from the very first wear. Each design balances modern ease with the lasting beauty of traditional craftsmanship.</p><blockquote>“The most beautiful pieces are the ones that become inseparable from the person wearing them.”</blockquote><p>Whether chosen for a ceremony, a celebration or an ordinary day made special, fine jewelry has the power to turn a moment into a keepsake.</p><h2>Designed to become part of your story</h2><p>Our artisans consider every curve, setting and finish. The result is a collection that layers effortlessly and remains timeless beyond the season.</p>`;

const names = [
  'Bridial Fair Collections 2023', 'Our Sterling Silver', 'New Season Modern Gold Earrings',
  'Kitchen Inspired On Japanese', 'The Art Of Layering Jewelry', 'A New Era Of Engagement Rings',
  'Meaningful Gifts For Every Story', 'Sculptural Forms In Fine Jewelry', 'How To Care For Your Collection',
];
const categories = ['Wedding & Bridal', 'Wedding & Bridal', 'Earrings', 'News', 'Necklaces', 'Wedding & Bridal', 'News', 'Bracelets', 'News'];

export const DEMO_BLOG_POSTS: BlogPost[] = names.map((title, index) => ({
  _id: `demo-blog-${index + 1}`,
  title,
  slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
  excerpt: 'Discover the inspiration, craftsmanship and quiet details behind the latest stories from the Mojuri journal.',
  content,
  coverImage: `/media/blog/${(index % 7) + 1}.jpg`,
  category: categories[index],
  status: 'published',
  publishedAt: new Date(2023, 4 + index, 30 - index).toISOString(),
  createdAt: new Date(2023, 4 + index, 30 - index).toISOString(),
}));

export const BLOG_CATEGORIES = [['Bracelets', 9], ['Earrings', 4], ['Necklaces', 3], ['News', 6], ['Wedding & Bridal', 2]] as const;

export function blogDate(post: BlogPost) {
  return new Date(post.publishedAt ?? post.createdAt).toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' });
}
