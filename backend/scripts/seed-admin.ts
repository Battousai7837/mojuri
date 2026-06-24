import bcrypt from 'bcryptjs';
import { connectDb } from '../lib/db';
import { User } from '../models/User';
import { Category } from '../models/Category';
import { Product } from '../models/Product';
import { Blog } from '../models/Blog';
import { BlogCategory } from '../models/BlogCategory';

async function seed() {
  const email = process.env.ADMIN_EMAIL ?? 'admin@mojuri.local';
  const password = process.env.ADMIN_PASSWORD ?? 'Admin@123';
  await connectDb();
  await User.findOneAndUpdate({ email }, { name: 'Mojuri Admin', email, passwordHash: await bcrypt.hash(password, 12), role: 'admin' }, { upsert: true });
  const categoryNames = ['Rings', 'Necklaces', 'Earrings', 'Bracelets'];
  await Promise.all(categoryNames.map(name => Category.findOneAndUpdate({ name }, { name, slug: name.toLowerCase(), description: `${name} collection` }, { upsert: true })));
  await Promise.all(['Tips','Collections','News'].map(name => BlogCategory.findOneAndUpdate({ name }, { name, slug: name.toLowerCase() }, { upsert: true })));
  const products = [
    ['Medium Flat Hoops','medium-flat-hoops','/media/product/1.jpg',100,'Earrings',14,true],
    ['Bold Pearl Hoops','bold-pearl-hoops','/media/product/2.jpg',120,'Earrings',9,true],
    ['Twin Hoops','twin-hoops','/media/product/3.jpg',150,'Earrings',11,true],
    ['Moonlight Ring','moonlight-ring','/media/product/4.jpg',210,'Rings',7,true],
    ['Golden Chain','golden-chain','/media/product/5.jpg',280,'Necklaces',5,false],
    ['Aurora Bracelet','aurora-bracelet','/media/product/6.jpg',180,'Bracelets',12,false],
    ['Pearl Signet','pearl-signet','/media/product/7.jpg',195,'Rings',4,false],
    ['Celestial Pendant','celestial-pendant','/media/product/8.jpg',240,'Necklaces',8,false],
  ] as const;
  await Promise.all(products.map(([name,slug,thumbnail,price,category,stock,featured]) => Product.findOneAndUpdate({ slug }, { name,slug,thumbnail,gallery:[thumbnail.replace('.jpg','-2.jpg')],price,stock,category,featured,description:`<p>A timeless ${name.toLowerCase()} piece, designed for everyday elegance and carefully finished by Mojuri artisans.</p>` }, { upsert: true, setDefaultsOnInsert: true })));
  const posts = [
    { title:'How to Care for Sterling Silver',slug:'how-to-care-for-sterling-silver',excerpt:'Simple rituals that keep your favorite silver jewelry luminous for years.',coverImage:'/media/blog/1.jpg',category:'Tips',content:'<p>Sterling silver naturally develops a soft patina. Store each piece separately, avoid humidity, and polish gently with a dedicated silver cloth.</p><h2>Daily care</h2><p>Put jewelry on after perfume and remove it before swimming or showering.</p>' },
    { title:'The Story Behind Our Bridal Collection',slug:'story-behind-bridal-collection',excerpt:'A closer look at the forms, stones and quiet details of our bridal pieces.',coverImage:'/media/blog/2.jpg',category:'Collections',content:'<p>Our bridal collection begins with the idea that commitment deserves objects made slowly and thoughtfully.</p><p>Each silhouette is tested for comfort, balance and lasting beauty.</p>' },
    { title:'Mojuri Studio Notes: Summer',slug:'mojuri-studio-notes-summer',excerpt:'New textures, warm gold and a glimpse inside the Mojuri studio.',coverImage:'/media/blog/3.jpg',category:'News',content:'<p>This season we explored warm, organic shapes inspired by light moving across the sea.</p><p>The new pieces are now available online and in our studio.</p>' },
  ] as const;
  await Promise.all(posts.map(post => Blog.findOneAndUpdate({ slug: post.slug }, { ...post, status:'published', publishedAt:new Date() }, { upsert:true, setDefaultsOnInsert:true })));
  console.log(`Admin ready: ${email}`);
  console.log('Categories, demo products and blog posts are ready.');
  process.exit(0);
}
seed().catch((error) => { console.error(error); process.exit(1); });
