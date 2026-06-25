import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import { removeLegacyPageCss } from "../usePageScripts";
import type {
  BlogCategory,
  BlogPost,
  Category,
  ContactMessage,
  Order,
  OrderStatus,
  Product,
} from "../types";
import "./admin.css";
import "./admin-modules.css";

type Tab =
  | "dashboard"
  | "products"
  | "categories"
  | "orders"
  | "blogs"
  | "contacts";
type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
};
type AdminSession = { token: string; user: AdminUser };
type Revenue = {
  totalRevenue: number;
  deliveredOrders: number;
  byDay: { _id: string; revenue: number; orders: number }[];
  byMonth: { _id: string; revenue: number; orders: number }[];
};
const titles: Record<Tab, string> = {
  dashboard: "Tổng quan",
  products: "Quản lý sản phẩm",
  categories: "Danh mục sản phẩm",
  orders: "Quản lý đơn hàng",
  blogs: "Quản lý bài viết",
  contacts: "Hộp thư liên hệ",
};
const orderLabels: Record<OrderStatus, string> = {
  pending: "Chờ xử lý",
  processing: "Đang chuẩn bị",
  shipped: "Đang giao",
  delivered: "Đã giao",
  cancelled: "Đã hủy",
};
const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[đð]/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export default function AdminDashboard() {
  const [token, setToken] = useState(() =>
    localStorage.getItem("mojuri_admin_token"),
  );
  const [tab, setTab] = useState<Tab>("dashboard");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(Boolean(token));
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [productImage, setProductImage] = useState("");
  const [cover, setCover] = useState("");
  const queryClient = useQueryClient();
  useEffect(() => {
    removeLegacyPageCss();
  }, []);
  const dashboard = useQuery({
    queryKey: ["admin-data"],
    enabled: Boolean(token && adminUser?.role === "admin"),
    queryFn: async () => {
      const safe = <T,>(request: Promise<T>, fallback: T) => request.catch(() => fallback);
      const [p, c, o, b, bc, m, r] = await Promise.all([
        safe(api<{ items: Product[] }>("/products?limit=50"), { items: [] }),
        safe(api<{ items: Category[] }>("/categories"), { items: [] }),
        safe(api<{ items: Order[] }>("/orders"), { items: [] }),
        safe(api<{ items: BlogPost[] }>("/blogs?admin=true&limit=30"), { items: [] }),
        safe(api<{ items: BlogCategory[] }>("/blog-categories"), { items: [] }),
        safe(api<{ items: ContactMessage[] }>("/contacts"), { items: [] }),
        safe(api<Revenue>("/stats/revenue"), { totalRevenue: 0, deliveredOrders: 0, byDay: [], byMonth: [] }),
      ]);
      return {
        products: p.items,
        categories: c.items,
        orders: o.items,
        blogs: b.items,
        blogCategories: bc.items,
        contacts: m.items,
        revenue: r,
      };
    },
  });
  const products = dashboard.data?.products ?? [];
  const categories = dashboard.data?.categories ?? [];
  const orders = dashboard.data?.orders ?? [];
  const blogs = dashboard.data?.blogs ?? [];
  const blogCategories = dashboard.data?.blogCategories ?? [];
  const contacts = dashboard.data?.contacts ?? [];
  const revenue = dashboard.data?.revenue ?? {
    totalRevenue: 0,
    deliveredOrders: 0,
    byDay: [],
    byMonth: [],
  };
  useEffect(() => {
    let active = true;
    if (!token) {
      setAdminUser(null);
      setCheckingAuth(false);
      return;
    }
    setCheckingAuth(true);
    api<AdminUser>("/auth/me")
      .then((user) => {
        if (!active) return;
        if (user.role !== "admin") {
          localStorage.removeItem("mojuri_admin_token");
          setToken(null);
          setAdminUser(null);
          setError("Tài khoản này không có quyền Admin.");
          return;
        }
        setAdminUser(user);
        setError("");
      })
      .catch((e) => {
        if (!active) return;
        localStorage.removeItem("mojuri_admin_token");
        setToken(null);
        setAdminUser(null);
        setError(
          e instanceof Error ? e.message : "Phiên đăng nhập không hợp lệ",
        );
      })
      .finally(() => {
        if (active) setCheckingAuth(false);
      });
    return () => {
      active = false;
    };
  }, [token]);
  useEffect(() => {
    setProductImage(editingProduct?.thumbnail ?? "");
  }, [editingProduct]);
  const load = async () => {
    await queryClient.invalidateQueries({ queryKey: ["admin-data"] });
  };
  const done = (message: string) => {
    setNotice(message);
    setError("");
    window.setTimeout(() => setNotice(""), 2500);
  };
  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    try {
      const result = await api<AdminSession>("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: form.get("email"),
          password: form.get("password"),
        }),
      });
      if (result.user.role !== "admin") {
        setError("Tài khoản này không có quyền Admin.");
        return;
      }
      localStorage.setItem("mojuri_admin_token", result.token);
      setAdminUser(result.user);
      setToken(result.token);
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Đăng nhập thất bại");
    }
  }
  function logout() {
    localStorage.removeItem("mojuri_admin_token");
    setToken(null);
    setAdminUser(null);
    queryClient.removeQueries({ queryKey: ["admin-data"] });
  }
  async function saveProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const isEditing = Boolean(editingProduct);
    const form = new FormData(formElement);
    const name = String(form.get("name"));
    const body = {
      name,
      slug: slugify(name) || "san-pham",
      description: String(form.get("description")),
      thumbnail: productImage || String(form.get("thumbnail") ?? ""),
      gallery: String(form.get("gallery"))
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean),
      price: Number(form.get("price")),
      salePrice: form.get("salePrice") ? Number(form.get("salePrice")) : null,
      stock: Number(form.get("stock")),
      category: String(form.get("category") ?? ""),
      featured: form.get("featured") === "on",
    };
    try {
      await api(
        editingProduct ? `/products/${editingProduct._id}` : "/products",
        { method: isEditing ? "PUT" : "POST", body: JSON.stringify(body) },
      );
      setEditingProduct(null);
      setProductImage("");
      event.currentTarget.reset();
      done(isEditing ? "Đã cập nhật sản phẩm" : "Đã thêm sản phẩm");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Không lưu được sản phẩm");
    }
  }
  async function removeProduct(id: string) {
    if (confirm("Xóa sản phẩm này?")) {
      await api(`/products/${id}`, { method: "DELETE" });
      done("Đã xóa sản phẩm");
      await load();
    }
  }
  async function saveCategory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name"));
    try {
      await api("/categories", {
        method: "POST",
        body: JSON.stringify({
          name,
          slug: slugify(name),
          description: String(form.get("description")),
        }),
      });
      event.currentTarget.reset();
      done("Đã thêm danh mục");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Không lưu được danh mục");
    }
  }
  async function editCategory(item: Category) {
    const name = prompt("Tên danh mục", item.name);
    if (!name) return;
    await api(`/categories/${item._id}`, {
      method: "PUT",
      body: JSON.stringify({ name, slug: slugify(name) }),
    });
    done("Đã sửa danh mục");
    await load();
  }
  async function removeCategory(id: string) {
    if (confirm("Xóa danh mục này?")) {
      await api(`/categories/${id}`, { method: "DELETE" });
      done("Đã xóa danh mục");
      await load();
    }
  }
  async function updateOrder(id: string, status: OrderStatus) {
    try {
      await api(`/orders/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      done("Đã cập nhật trạng thái đơn");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Không cập nhật được đơn");
    }
  }
  async function upload(file: File, target: "blog" | "product" = "blog") {
    const data = new FormData();
    data.append("file", file);
    const result = await api<{ url: string }>("/upload", {
      method: "POST",
      body: data,
    });
    if (target === "product") setProductImage(result.url);
    else setCover(result.url);
  }
  async function saveBlog(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const isEditing = Boolean(editingBlog);
    const form = new FormData(formElement);
    const title = String(form.get("title"));
    const body = {
      title,
      slug: slugify(title) || "bai-viet",
      excerpt: String(form.get("excerpt")),
      content: String(form.get("content")),
      coverImage: cover || String(form.get("coverImage")),
      category: String(form.get("category") ?? ""),
      status: String(form.get("status")),
    };
    try {
      await api(editingBlog ? `/blogs/${editingBlog._id}` : "/blogs", {
        method: isEditing ? "PUT" : "POST",
        body: JSON.stringify(body),
      });
      setEditingBlog(null);
      setCover("");
      if (!isEditing) formElement.reset();
      done(editingBlog ? "Đã cập nhật bài viết" : "Đã tạo bài viết");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Không lưu được bài viết");
    }
  }
  async function removeBlog(id: string) {
    if (confirm("Xóa bài viết này?")) {
      await api(`/blogs/${id}`, { method: "DELETE" });
      done("Đã xóa bài viết");
      await load();
    }
  }
  async function saveBlogCategory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name"));
    await api("/blog-categories", {
      method: "POST",
      body: JSON.stringify({ name, slug: slugify(name) }),
    });
    event.currentTarget.reset();
    done("Đã thêm chủ đề Blog");
    await load();
  }
  async function removeBlogCategory(id: string) {
    if (confirm("Xóa chủ đề Blog này?")) {
      await api(`/blog-categories/${id}`, { method: "DELETE" });
      done("Đã xóa chủ đề Blog");
      await load();
    }
  }
  async function toggleContact(item: ContactMessage) {
    await api(`/contacts/${item._id}`, {
      method: "PATCH",
      body: JSON.stringify({
        status: item.status === "read" ? "unread" : "read",
      }),
    });
    await load();
  }
  if (checkingAuth)
    return (
      <main className="admin-login">
        <form>
          <img src="/media/logo.png" alt="Mojuri" />
          <h1>Đang kiểm tra quyền</h1>
          <p>Vui lòng chờ trong giây lát.</p>
        </form>
      </main>
    );
  if (!token)
    return (
      <main className="admin-login">
        <form onSubmit={login}>
          <img src="/media/logo.png" alt="Mojuri" />
          <h1>Admin Dashboard</h1>
          <label>
            Email
            <input
              name="email"
              type="email"
              defaultValue="admin@mojuri.local"
              required
            />
          </label>
          <label>
            Mật khẩu
            <input name="password" type="password" required />
          </label>
          {error && <p className="admin-error">{error}</p>}
          <button>Đăng nhập</button>
          <a href="/">← Về cửa hàng</a>
        </form>
      </main>
    );
  return (
    <div className="admin-shell">
      <aside>
        <img src="/media/logo-white.png" alt="Mojuri" />
        <nav>
          {(
            [
              "dashboard",
              "products",
              "categories",
              "orders",
              "blogs",
              "contacts",
            ] as Tab[]
          ).map((item) => (
            <button
              key={item}
              className={tab === item ? "active" : ""}
              onClick={() => setTab(item)}
            >
              {titles[item]}
              {item === "contacts" && (
                <span>
                  {contacts.filter((x) => x.status === "unread").length}
                </span>
              )}
              {item === "orders" && (
                <span>
                  {orders.filter((x) => x.status === "pending").length}
                </span>
              )}
            </button>
          ))}
        </nav>
        <button className="logout" onClick={logout}>
          Đăng xuất
        </button>
      </aside>
      <main>
        <header>
          <div>
            <small>MOJURI / ADMIN</small>
            <h1>{titles[tab]}</h1>
          </div>
          <button onClick={() => void load()}>Làm mới</button>
        </header>
        {error && <p className="admin-error">{error}</p>}
        {notice && <p className="admin-notice">{notice}</p>}
        {tab === "dashboard" && (
          <>
            <section className="admin-stats">
              <div>
                <small>Doanh thu đã giao</small>
                <b>${revenue.totalRevenue.toFixed(2)}</b>
              </div>
              <div>
                <small>Đơn mới</small>
                <b>{orders.filter((x) => x.status === "pending").length}</b>
              </div>
              <div>
                <small>Sản phẩm sắp hết</small>
                <b>{products.filter((x) => x.stock < 5).length}</b>
              </div>
              <div>
                <small>Tin chưa đọc</small>
                <b>{contacts.filter((x) => x.status === "unread").length}</b>
              </div>
            </section>
            <section className="admin-card">
              <h2>Doanh thu 30 ngày</h2>
              <table>
                <thead>
                  <tr>
                    <th>Ngày</th>
                    <th>Đơn đã giao</th>
                    <th>Doanh thu</th>
                  </tr>
                </thead>
                <tbody>
                  {revenue.byDay.map((day) => (
                    <tr key={day._id}>
                      <td>{day._id}</td>
                      <td>{day.orders}</td>
                      <td>${day.revenue.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!revenue.byDay.length && (
                <p className="admin-empty">Chưa có đơn đã giao.</p>
              )}
            </section>
          </>
        )}
        {tab === "dashboard" && revenue.byMonth.length > 0 && (
          <section className="admin-card" style={{ marginTop: 24 }}>
            <h2>Doanh thu theo tháng</h2>
            <table>
              <thead>
                <tr>
                  <th>Tháng</th>
                  <th>Đơn đã giao</th>
                  <th>Doanh thu</th>
                </tr>
              </thead>
              <tbody>
                {revenue.byMonth.map((month) => (
                  <tr key={month._id}>
                    <td>{month._id}</td>
                    <td>{month.orders}</td>
                    <td>${month.revenue.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}
        {tab === "products" && (
          <div className="admin-two">
            <form
              className="admin-card admin-form"
              onSubmit={saveProduct}
              key={editingProduct?._id ?? "new"}
            >
              <h2>{editingProduct ? "Sửa sản phẩm" : "Thêm sản phẩm"}</h2>
              <label>
                Tên
                <input
                  name="name"
                  defaultValue={editingProduct?.name}
                  required
                />
              </label>
              <label>
                Mô tả
                <textarea
                  name="description"
                  defaultValue={editingProduct?.description}
                />
              </label>
              <label>
                Thumbnail URL
                <input
                  name="thumbnail"
                  value={productImage}
                  onChange={(e) => setProductImage(e.target.value)}
                  placeholder="/media/product/1.jpg hoặc upload ảnh"
                />
              </label>
              <label>
                Upload ảnh sản phẩm (có thể bỏ qua)
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file)
                      void upload(file, "product").catch((err) =>
                        setError(err.message),
                      );
                  }}
                />
              </label>
              {productImage && (
                <img
                  className="admin-cover"
                  src={productImage}
                  alt="Product preview"
                />
              )}
              <label>
                Gallery URLs, cách nhau bởi dấu phẩy
                <textarea
                  name="gallery"
                  defaultValue={editingProduct?.gallery?.join(", ")}
                />
              </label>
              <div className="admin-form-row">
                <label>
                  Giá
                  <input
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    defaultValue={editingProduct?.price}
                    required
                  />
                </label>
                <label>
                  Giá sale
                  <input
                    name="salePrice"
                    type="number"
                    min="0"
                    step="0.01"
                    defaultValue={editingProduct?.salePrice}
                  />
                </label>
                <label>
                  Tồn kho
                  <input
                    name="stock"
                    type="number"
                    min="0"
                    defaultValue={editingProduct?.stock ?? 0}
                    required
                  />
                </label>
              </div>
              <label>
                Danh mục
                <select
                  name="category"
                  defaultValue={editingProduct?.category ?? categories[0]?.name}
                >
                  {categories.map((item) => (
                    <option key={item._id}>{item.name}</option>
                  ))}
                </select>
              </label>
              <label className="admin-check">
                <input
                  name="featured"
                  type="checkbox"
                  defaultChecked={editingProduct?.featured}
                />{" "}
                Sản phẩm nổi bật
              </label>
              <button>
                {editingProduct ? "Lưu thay đổi" : "Thêm sản phẩm"}
              </button>
              {editingProduct && (
                <button type="button" onClick={() => setEditingProduct(null)}>
                  Hủy sửa
                </button>
              )}
            </form>
            <section className="admin-card admin-list">
              <h2>{products.length} sản phẩm</h2>
              {products.map((item) => (
                <article key={item._id}>
                  <img
                    src={item.thumbnail || "/media/product/1.jpg"}
                    alt=""
                    onError={(event) => {
                      event.currentTarget.src = "/media/product/1.jpg";
                    }}
                  />
                  <div>
                    <b>{item.name}</b>
                    <small>
                      {item.category} · ${item.price} · Kho {item.stock}
                    </small>
                  </div>
                  <button onClick={() => setEditingProduct(item)}>Sửa</button>
                  <button
                    className="danger"
                    onClick={() => void removeProduct(item._id)}
                  >
                    Xóa
                  </button>
                </article>
              ))}
            </section>
          </div>
        )}
        {tab === "categories" && (
          <div className="admin-two">
            <form className="admin-card admin-form" onSubmit={saveCategory}>
              <h2>Thêm danh mục</h2>
              <label>
                Tên
                <input name="name" required />
              </label>
              <label>
                Mô tả
                <textarea name="description" />
              </label>
              <button>Thêm danh mục</button>
            </form>
            <section className="admin-card admin-list">
              <h2>Danh mục hiện có</h2>
              {categories.map((item) => (
                <article key={item._id}>
                  <div>
                    <b>{item.name}</b>
                    <small>/{item.slug}</small>
                  </div>
                  <button onClick={() => void editCategory(item)}>Sửa</button>
                  <button
                    className="danger"
                    onClick={() => void removeCategory(item._id)}
                  >
                    Xóa
                  </button>
                </article>
              ))}
            </section>
          </div>
        )}
        {tab === "orders" && (
          <section className="admin-card">
            <div className="admin-table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Mã đơn</th>
                    <th>Khách hàng</th>
                    <th>Ngày</th>
                    <th>Tổng</th>
                    <th>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((item) => (
                    <tr key={item._id}>
                      <td>
                        <b>{item.code}</b>
                      </td>
                      <td>
                        {item.customer.name}
                        <small>
                          {item.customer.email}
                          <br />
                          {item.customer.phone}
                        </small>
                      </td>
                      <td>
                        {new Date(item.createdAt).toLocaleDateString("vi-VN")}
                      </td>
                      <td>${item.total.toFixed(2)}</td>
                      <td>
                        <select
                          value={item.status}
                          onChange={(e) =>
                            void updateOrder(
                              item._id,
                              e.target.value as OrderStatus,
                            )
                          }
                        >
                          {Object.entries(orderLabels).map(([value, label]) => (
                            <option value={value} key={value}>
                              {label}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
        {tab === "blogs" && (
          <div className="admin-two">
            <form
              className="admin-card admin-form"
              onSubmit={saveBlog}
              key={editingBlog?._id ?? "new-blog"}
            >
              <h2>{editingBlog ? "Sửa bài viết" : "Tạo bài viết"}</h2>
              <label>
                Tiêu đề
                <input
                  name="title"
                  defaultValue={editingBlog?.title}
                  required
                />
              </label>
              <label>
                Tóm tắt
                <textarea
                  name="excerpt"
                  defaultValue={editingBlog?.excerpt}
                  required
                />
              </label>
              <label>
                Nội dung
                <textarea
                  name="content"
                  defaultValue={editingBlog?.content}
                  required
                />
              </label>
              <label>
                Ảnh bìa URL
                <input
                  name="coverImage"
                  value={cover || editingBlog?.coverImage || ""}
                  onChange={(e) => setCover(e.target.value)}
                  required
                />
              </label>
              <label>
                Hoặc upload ảnh (tối đa 5MB)
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file)
                      void upload(file).catch((err) => setError(err.message));
                  }}
                />
              </label>
              {(cover || editingBlog?.coverImage) && (
                <img
                  className="admin-cover"
                  src={cover || editingBlog?.coverImage}
                  alt="Preview"
                />
              )}
              <div className="admin-form-row">
                <label>
                  Chủ đề
                  <select
                    name="category"
                    defaultValue={
                      editingBlog?.category ?? blogCategories[0]?.name
                    }
                  >
                    {blogCategories.map((item) => (
                      <option key={item._id}>{item.name}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Trạng thái
                  <select
                    name="status"
                    defaultValue={editingBlog?.status ?? "draft"}
                  >
                    <option value="draft">Nháp</option>
                    <option value="published">Xuất bản</option>
                  </select>
                </label>
              </div>
              <button>{editingBlog ? "Lưu bài viết" : "Tạo bài viết"}</button>
              {editingBlog && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingBlog(null);
                    setCover("");
                  }}
                >
                  Hủy sửa
                </button>
              )}
            </form>
            <section className="admin-card admin-list">
              <h2>{blogs.length} bài viết</h2>
              {blogs.map((item) => (
                <article key={item._id}>
                  <img
                    src={item.coverImage || "/media/blog/1.jpg"}
                    alt=""
                    onError={(event) => {
                      event.currentTarget.src = "/media/blog/1.jpg";
                    }}
                  />
                  <div>
                    <b>{item.title}</b>
                    <small>
                      {item.category} ·{" "}
                      {item.status === "published" ? "Đã xuất bản" : "Bản nháp"}
                    </small>
                  </div>
                  <button
                    onClick={() => {
                      setEditingBlog(item);
                      setCover(item.coverImage);
                    }}
                  >
                    Sửa
                  </button>
                  <button
                    className="danger"
                    onClick={() => void removeBlog(item._id)}
                  >
                    Xóa
                  </button>
                </article>
              ))}
            </section>
          </div>
        )}
        {tab === "blogs" && (
          <section className="admin-card blog-category-admin">
            <h2>Chủ đề Blog</h2>
            <form onSubmit={saveBlogCategory}>
              <input name="name" placeholder="Tên chủ đề mới" required />
              <button>Thêm chủ đề</button>
            </form>
            <div>
              {blogCategories.map((item) => (
                <span key={item._id}>
                  {item.name}
                  <button
                    className="danger"
                    onClick={() => void removeBlogCategory(item._id)}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </section>
        )}
        {tab === "contacts" && (
          <section className="admin-grid">
            {contacts.map((item) => (
              <article
                className={`admin-card message ${item.status}`}
                key={item._id}
              >
                <div>
                  <span className="status">
                    {item.status === "unread" ? "Chưa đọc" : "Đã đọc"}
                  </span>
                  <time>
                    {new Date(item.createdAt).toLocaleDateString("vi-VN")}
                  </time>
                </div>
                <h2>{item.subject}</h2>
                <b>
                  {item.name} ·{" "}
                  <a href={`mailto:${item.email}?subject=Re: ${item.subject}`}>
                    {item.email}
                  </a>
                </b>
                <p>{item.message}</p>
                <button onClick={() => void toggleContact(item)}>
                  Đánh dấu {item.status === "read" ? "chưa đọc" : "đã đọc"}
                </button>
                <a
                  className="admin-reply"
                  href={`mailto:${item.email}?subject=Re: ${item.subject}`}
                >
                  Phản hồi qua email
                </a>
              </article>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}
