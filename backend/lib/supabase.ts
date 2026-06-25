type SupabaseUser = {
  id: string;
  email?: string;
  user_metadata?: Record<string, unknown>;
  app_metadata?: Record<string, unknown>;
};

type PasswordSession = { user: SupabaseUser; access_token: string };

export type PublicUser = {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  role: 'admin' | 'user';
  created_at: string;
  updated_at: string;
};

export type PublicContact = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
};

export type PublicProduct = {
  id: string;
  category_id?: string | null;
  name: string;
  slug: string;
  description: string;
  thumbnail: string;
  gallery: string[];
  price: number;
  sale_price?: number | null;
  stock: number;
  status: 'in_stock' | 'out_of_stock';
  is_featured: boolean;
  created_at: string;
  updated_at: string;
};

export type PublicBlog = {
  id: string;
  category_id?: string | null;
  author_id?: string | null;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string;
  status: 'draft' | 'published';
  published_at?: string | null;
  created_at: string;
  updated_at: string;
};

export type PublicCategory = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  created_at?: string;
};

export type PublicOrder = {
  id: string;
  order_code: string;
  customer_name: string;
  phone: string;
  email: string;
  address: string;
  subtotal: number;
  shipping_fee: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  created_at: string;
  updated_at: string;
};

export type PublicOrderItem = {
  id: string;
  order_id: string;
  product_id?: string | null;
  product_name: string;
  unit_price: number;
  quantity: number;
  line_total?: number | null;
};

export class SupabaseApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
    this.name = 'SupabaseApiError';
  }
}

function config(useClientKey = false) {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, '');
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const key = useClientKey ? (process.env.SUPABASE_ANON_KEY || serviceKey) : serviceKey;
  if (!url) throw new Error('SUPABASE_URL is not configured');
  if (!key) throw new Error(useClientKey
    ? 'SUPABASE_ANON_KEY or SUPABASE_SERVICE_ROLE_KEY is not configured'
    : 'SUPABASE_SERVICE_ROLE_KEY is not configured');
  return { url, key };
}

async function request<T>(path: string, options: RequestInit, useClientKey = false): Promise<T> {
  const { url, key } = config(useClientKey);
  const response = await fetch(`${url}/auth/v1${path}`, {
    ...options,
    cache: 'no-store',
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  const data = await response.json().catch(() => ({})) as Record<string, unknown>;
  if (!response.ok) {
    const message = String(data.message || data.msg || data.error_description || data.error || 'Supabase request failed');
    throw new SupabaseApiError(message, response.status);
  }
  return data as T;
}

async function tableRequest<T>(table: string, query: string, options: RequestInit = {}): Promise<T> {
  const { url, key } = config();
  const response = await fetch(`${url}/rest/v1/${table}${query}`, {
    ...options,
    cache: 'no-store',
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      'Accept-Profile': 'public',
      'Content-Profile': 'public',
      ...options.headers,
    },
  });
  const data = await response.json().catch(() => null) as T | Record<string, unknown> | null;
  if (!response.ok) {
    const details = data as Record<string, unknown> | null;
    throw new SupabaseApiError(String(details?.message || details?.details || 'Supabase database request failed'), response.status);
  }
  return data as T;
}

function unwrapUser(data: SupabaseUser | { user: SupabaseUser }): SupabaseUser {
  return 'user' in data ? data.user : data;
}

export async function createSupabaseUser(name: string, email: string, password: string) {
  const data = await request<SupabaseUser | { user: SupabaseUser }>('/admin/users', {
    method: 'POST',
    body: JSON.stringify({
      email,
      password,
      email_confirm: true,
      user_metadata: { name },
      app_metadata: { role: 'user' },
    }),
  });
  return unwrapUser(data);
}

export async function authenticateSupabaseUser(email: string, password: string) {
  const session = await request<PasswordSession>('/token?grant_type=password', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  }, true);
  return session.user;
}

export async function getSupabaseUser(id: string) {
  const data = await request<SupabaseUser | { user: SupabaseUser }>(`/admin/users/${encodeURIComponent(id)}`, {
    method: 'GET',
  });
  return unwrapUser(data);
}

export async function deleteSupabaseUser(id: string) {
  await request(`/admin/users/${encodeURIComponent(id)}`, { method: 'DELETE' });
}

export async function upsertPublicUser(input: Pick<PublicUser, 'id' | 'name' | 'email' | 'password_hash' | 'role'>) {
  const rows = await tableRequest<PublicUser[]>('users', '?on_conflict=id', {
    method: 'POST',
    headers: { Prefer: 'resolution=merge-duplicates,return=representation' },
    body: JSON.stringify(input),
  });
  return rows[0];
}

export async function getPublicUser(id: string) {
  const rows = await tableRequest<PublicUser[]>('users', `?id=eq.${encodeURIComponent(id)}&select=*`, { method: 'GET' });
  return rows[0] ?? null;
}

export async function listPublicCustomers() {
  const rows = await tableRequest<PublicUser[]>('users', '?role=eq.user&select=id,name,email,role,created_at,updated_at&order=created_at.desc', { method: 'GET' });
  return rows.map(user => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.created_at,
    updatedAt: user.updated_at,
  }));
}

export async function createPublicContact(input: Pick<PublicContact, 'name' | 'email' | 'subject' | 'message'>) {
  const rows = await tableRequest<PublicContact[]>('contacts', '', {
    method: 'POST',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify({ ...input, is_read: false }),
  });
  return rows[0];
}

export async function listPublicContacts() {
  return tableRequest<PublicContact[]>('contacts', '?select=*&order=created_at.desc', { method: 'GET' });
}

export async function updatePublicContact(id: string, isRead: boolean) {
  const rows = await tableRequest<PublicContact[]>('contacts', `?id=eq.${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify({ is_read: isRead }),
  });
  return rows[0] ?? null;
}

export function toAuthUser(user: SupabaseUser) {
  const name = typeof user.user_metadata?.name === 'string' ? user.user_metadata.name : 'Mojuri Customer';
  const role = user.app_metadata?.role === 'admin' ? 'admin' as const : 'user' as const;
  return { id: user.id, name, email: user.email ?? '', role };
}

export function publicUserToAuthUser(user: PublicUser) {
  return { id: user.id, name: user.name, email: user.email, role: user.role };
}

export function publicContactJson(contact: PublicContact) {
  return { _id: contact.id, name: contact.name, email: contact.email, subject: contact.subject, message: contact.message, status: contact.is_read ? 'read' as const : 'unread' as const, createdAt: contact.created_at };
}

export function publicProductJson(product: PublicProduct) {
  return {
    _id: product.id,
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    thumbnail: product.thumbnail,
    gallery: product.gallery ?? [],
    price: Number(product.price),
    salePrice: product.sale_price == null ? undefined : Number(product.sale_price),
    stock: product.stock,
    status: product.status,
    category: product.category_id ?? '',
    featured: product.is_featured,
    reviews: [],
    averageRating: 0,
    createdAt: product.created_at,
    updatedAt: product.updated_at,
  };
}

export function publicBlogJson(blog: PublicBlog) {
  return {
    _id: blog.id,
    id: blog.id,
    title: blog.title,
    slug: blog.slug,
    excerpt: blog.excerpt,
    content: blog.content,
    coverImage: blog.cover_image,
    category: blog.category_id ?? '',
    status: blog.status,
    publishedAt: blog.published_at ?? undefined,
    createdAt: blog.created_at,
    updatedAt: blog.updated_at,
  };
}

export function publicCategoryJson(category: PublicCategory) {
  return {
    _id: category.id,
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description ?? '',
    createdAt: category.created_at,
  };
}

export function publicOrderJson(order: PublicOrder, items: PublicOrderItem[] = []) {
  return {
    _id: order.id,
    id: order.id,
    code: order.order_code,
    customer: {
      name: order.customer_name,
      phone: order.phone,
      email: order.email,
      address: order.address,
      note: '',
    },
    items: items.map(item => ({
      productId: item.product_id ?? '',
      name: item.product_name,
      thumbnail: '',
      price: Number(item.unit_price),
      quantity: item.quantity,
    })),
    subtotal: Number(order.subtotal),
    shippingFee: Number(order.shipping_fee),
    total: Number(order.total),
    status: order.status,
    createdAt: order.created_at,
    updatedAt: order.updated_at,
  };
}

export type ProductInput = {
  name: string;
  slug: string;
  description: string;
  thumbnail: string;
  gallery: string[];
  price: number;
  salePrice?: number | null;
  stock: number;
  featured: boolean;
};

export type BlogInput = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  status: 'draft' | 'published';
};

function productPayload(input: Partial<ProductInput>) {
  const stock = input.stock;
  return {
    ...(input.name !== undefined ? { name: input.name } : {}),
    ...(input.slug !== undefined ? { slug: input.slug } : {}),
    ...(input.description !== undefined ? { description: input.description } : {}),
    ...(input.thumbnail !== undefined ? { thumbnail: input.thumbnail } : {}),
    ...(input.gallery !== undefined ? { gallery: input.gallery } : {}),
    ...(input.price !== undefined ? { price: input.price } : {}),
    ...(input.salePrice !== undefined ? { sale_price: input.salePrice } : {}),
    ...(stock !== undefined ? { stock, status: stock > 0 ? 'in_stock' : 'out_of_stock' } : {}),
    ...(input.featured !== undefined ? { is_featured: input.featured } : {}),
  };
}

export async function listPublicProducts(query = '') {
  return tableRequest<PublicProduct[]>(`products`, query || '?select=*&order=created_at.desc', { method: 'GET' });
}

export async function createPublicProduct(input: ProductInput) {
  const rows = await tableRequest<PublicProduct[]>('products', '', {
    method: 'POST',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify(productPayload(input)),
  });
  return rows[0];
}

export async function getPublicProduct(idOrSlug: string) {
  const column = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(idOrSlug) ? 'id' : 'slug';
  const rows = await tableRequest<PublicProduct[]>('products', `?${column}=eq.${encodeURIComponent(idOrSlug)}&select=*`, { method: 'GET' });
  return rows[0] ?? null;
}

async function uniqueProductSlug(slug: string) {
  let candidate = slug;
  let index = 2;
  while (await getPublicProduct(candidate)) {
    candidate = `${slug}-${index}`;
    index += 1;
  }
  return candidate;
}

export async function createPublicProductWithUniqueSlug(input: ProductInput) {
  return createPublicProduct({ ...input, slug: await uniqueProductSlug(input.slug) });
}

export async function updatePublicProduct(id: string, input: Partial<ProductInput>) {
  const rows = await tableRequest<PublicProduct[]>('products', `?id=eq.${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify({ ...productPayload(input), updated_at: new Date().toISOString() }),
  });
  return rows[0] ?? null;
}

export async function deletePublicProduct(id: string) {
  const rows = await tableRequest<PublicProduct[]>('products', `?id=eq.${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: { Prefer: 'return=representation' },
  });
  return rows[0] ?? null;
}

function blogPayload(input: Partial<BlogInput>) {
  const status = input.status;
  return {
    ...(input.title !== undefined ? { title: input.title } : {}),
    ...(input.slug !== undefined ? { slug: input.slug } : {}),
    ...(input.excerpt !== undefined ? { excerpt: input.excerpt } : {}),
    ...(input.content !== undefined ? { content: input.content } : {}),
    ...(input.coverImage !== undefined ? { cover_image: input.coverImage } : {}),
    ...(status !== undefined ? { status, published_at: status === 'published' ? new Date().toISOString() : null } : {}),
  };
}

export async function listPublicBlogs(query = '') {
  return tableRequest<PublicBlog[]>('blogs', query || '?select=*&order=published_at.desc.nullslast,created_at.desc', { method: 'GET' });
}

export async function getPublicBlog(idOrSlug: string) {
  const column = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(idOrSlug) ? 'id' : 'slug';
  const rows = await tableRequest<PublicBlog[]>('blogs', `?${column}=eq.${encodeURIComponent(idOrSlug)}&select=*`, { method: 'GET' });
  return rows[0] ?? null;
}

async function uniqueBlogSlug(slug: string) {
  let candidate = slug;
  let index = 2;
  while (await getPublicBlog(candidate)) {
    candidate = `${slug}-${index}`;
    index += 1;
  }
  return candidate;
}

export async function createPublicBlog(input: BlogInput) {
  const rows = await tableRequest<PublicBlog[]>('blogs', '', {
    method: 'POST',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify(blogPayload({ ...input, slug: await uniqueBlogSlug(input.slug) })),
  });
  return rows[0];
}

export async function updatePublicBlog(id: string, input: Partial<BlogInput>) {
  const rows = await tableRequest<PublicBlog[]>('blogs', `?id=eq.${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify({ ...blogPayload(input), updated_at: new Date().toISOString() }),
  });
  return rows[0] ?? null;
}

export async function deletePublicBlog(id: string) {
  const rows = await tableRequest<PublicBlog[]>('blogs', `?id=eq.${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: { Prefer: 'return=representation' },
  });
  return rows[0] ?? null;
}

export async function listPublicCategories(table: 'categories' | 'blog_categories') {
  return tableRequest<PublicCategory[]>(table, '?select=*&order=name.asc', { method: 'GET' });
}

export async function createPublicCategory(table: 'categories' | 'blog_categories', input: { name: string; slug: string; description?: string }) {
  const rows = await tableRequest<PublicCategory[]>(table, '', {
    method: 'POST',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify({ name: input.name, slug: input.slug }),
  });
  return rows[0];
}

export async function updatePublicCategory(table: 'categories' | 'blog_categories', id: string, input: { name?: string; slug?: string; description?: string }) {
  const rows = await tableRequest<PublicCategory[]>(table, `?id=eq.${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify({ ...(input.name !== undefined ? { name: input.name } : {}), ...(input.slug !== undefined ? { slug: input.slug } : {}) }),
  });
  return rows[0] ?? null;
}

export async function deletePublicCategory(table: 'categories' | 'blog_categories', id: string) {
  const rows = await tableRequest<PublicCategory[]>(table, `?id=eq.${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: { Prefer: 'return=representation' },
  });
  return rows[0] ?? null;
}

export async function listPublicOrders(status?: string | null) {
  const query = status ? `?status=eq.${encodeURIComponent(status)}&select=*&order=created_at.desc` : '?select=*&order=created_at.desc';
  const orders = await tableRequest<PublicOrder[]>('orders', query, { method: 'GET' });
  if (!orders.length) return [];
  const orderIds = orders.map(order => order.id).join(',');
  const items = await tableRequest<PublicOrderItem[]>('order_items', `?order_id=in.(${orderIds})&select=*`, { method: 'GET' });
  return orders.map(order => publicOrderJson(order, items.filter(item => item.order_id === order.id)));
}

export async function findPublicOrder(code: string, email: string) {
  const orders = await tableRequest<PublicOrder[]>('orders', `?order_code=eq.${encodeURIComponent(code.toUpperCase())}&email=eq.${encodeURIComponent(email.toLowerCase())}&select=*`, { method: 'GET' });
  const order = orders[0];
  if (!order) return null;
  const items = await tableRequest<PublicOrderItem[]>('order_items', `?order_id=eq.${encodeURIComponent(order.id)}&select=*`, { method: 'GET' });
  return publicOrderJson(order, items);
}

export type OrderInput = {
  customer: { name: string; phone: string; email: string; address: string; note?: string };
  items: { productId: string; quantity: number }[];
};

export async function createPublicOrder(input: OrderInput) {
  const ids = input.items.map(item => item.productId).filter(Boolean);
  const products = ids.length
    ? await tableRequest<PublicProduct[]>('products', `?id=in.(${ids.join(',')})&select=*`, { method: 'GET' })
    : [];
  const orderItems = input.items.map(item => {
    const product = products.find(value => value.id === item.productId);
    if (!product) throw new Error('Có sản phẩm không còn tồn tại');
    if (product.stock < item.quantity) throw new Error(`${product.name} không đủ hàng`);
    const price = product.sale_price == null ? Number(product.price) : Number(product.sale_price);
    return { product, quantity: item.quantity, price };
  });
  const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = subtotal >= 400 ? 0 : 20;
  const orderCode = `MJ${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).slice(2, 5).toUpperCase()}`;
  const rows = await tableRequest<PublicOrder[]>('orders', '', {
    method: 'POST',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify({
      order_code: orderCode,
      customer_name: input.customer.name,
      phone: input.customer.phone,
      email: input.customer.email.toLowerCase(),
      address: input.customer.address,
      subtotal,
      shipping_fee: shippingFee,
      total: subtotal + shippingFee,
      status: 'pending',
    }),
  });
  const order = rows[0];
  const itemRows = await tableRequest<PublicOrderItem[]>('order_items', '', {
    method: 'POST',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify(orderItems.map(item => ({
      order_id: order.id,
      product_id: item.product.id,
      product_name: item.product.name,
      unit_price: item.price,
      quantity: item.quantity,
    }))),
  });
  await Promise.all(orderItems.map(item => updatePublicProduct(item.product.id, { stock: item.product.stock - item.quantity })));
  return publicOrderJson(order, itemRows);
}

export async function updatePublicOrderStatus(id: string, status: PublicOrder['status']) {
  const rows = await tableRequest<PublicOrder[]>('orders', `?id=eq.${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify({ status, updated_at: new Date().toISOString() }),
  });
  const order = rows[0];
  if (!order) return null;
  const items = await tableRequest<PublicOrderItem[]>('order_items', `?order_id=eq.${encodeURIComponent(order.id)}&select=*`, { method: 'GET' });
  return publicOrderJson(order, items);
}
