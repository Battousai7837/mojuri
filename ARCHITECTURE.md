# Kiến trúc Mojuri

Repository hiện là monorepo gồm hai ứng dụng độc lập, giao tiếp duy nhất qua JSON REST API:

```text
React Vite :5173                         Next.js API :3000
src/pages (Mojuri + /admin)  -- CORS --> app/api
src/lib/api.ts                <-- JSON -- lib (JWT, DB, HTTP)
localStorage (admin token)                models (Mongoose)
                                             |
                                         MongoDB :27017
```

Code giao diện Mojuri hiện có vẫn giữ nguyên ở `src/pages`. Backend mới nằm hoàn toàn trong `backend`.

## Chạy lần đầu

1. Tạo file môi trường từ các file mẫu:

   - `.env.example` -> `.env.local`
   - `backend/.env.example` -> `backend/.env.local`

2. Khởi động MongoDB (nếu máy có Docker):

   ```bash
   docker compose up -d mongodb
   ```

3. Tạo tài khoản quản trị (giá trị mặc định chỉ dùng khi phát triển):

   ```bash
   npm run seed:admin --prefix backend
   ```

4. Chạy hai ứng dụng trong cùng terminal:

   ```bash
   npm run dev:all
   ```

Frontend: `http://localhost:5173`  
Admin: `http://localhost:5173/admin`  
Backend: `http://localhost:3000`  
Kiểm tra API: `http://localhost:3000/api/health`

## Biên giới bảo mật

- `GET /api/products` và `POST /api/contacts` là public.
- Thêm/sửa/xóa sản phẩm, đọc/cập nhật inbox yêu cầu header `Authorization: Bearer <JWT>` và role `admin`.
- Mật khẩu admin được hash bằng bcrypt; API login chỉ trả JWT và thông tin user an toàn.
- Zod kiểm tra request trước khi ghi MongoDB.
- CORS chỉ cho phép origin khai báo bởi `FRONTEND_URL` (mặc định `http://localhost:5173`).

## API hiện có

| Method | Endpoint | Quyền | Mục đích |
| --- | --- | --- | --- |
| GET | `/api/health` | Public | Health check |
| POST | `/api/auth/login` | Public | Đăng nhập, nhận JWT |
| POST | `/api/auth/register` | Public | Đăng ký user, nhận JWT |
| GET | `/api/auth/me` | User/Admin | Thông tin phiên hiện tại |
| GET | `/api/products` | Public | Danh sách, tìm kiếm, lọc, phân trang |
| POST | `/api/products` | Admin | Tạo sản phẩm |
| GET | `/api/products/:id` | Public | Chi tiết sản phẩm |
| PUT/DELETE | `/api/products/:id` | Admin | Sửa/xóa sản phẩm |
| POST | `/api/contacts` | Public | Gửi liên hệ |
| GET | `/api/contacts` | Admin | Xem inbox |
| PATCH | `/api/contacts/:id` | Admin | Đổi trạng thái đọc |
| GET/POST | `/api/categories` | Public/Admin | Danh sách/tạo danh mục |
| PUT/DELETE | `/api/categories/:id` | Admin | Sửa/xóa danh mục |
| POST | `/api/products/:id/reviews` | Public | Gửi đánh giá |
| GET/POST | `/api/orders` | Admin/Public | Danh sách/tạo đơn |
| PATCH | `/api/orders/:id` | Admin | Cập nhật trạng thái |
| GET | `/api/orders/track` | Public | Tra cứu đơn bằng mã + email |
| GET | `/api/stats/revenue` | Admin | Doanh thu ngày/tháng |
| GET/POST | `/api/blogs` | Public/Admin | Danh sách/tạo bài |
| GET/PUT/DELETE | `/api/blogs/:id` | Public/Admin | Chi tiết/CRUD bài |
| POST | `/api/upload` | Admin | Upload ảnh tối đa 5MB |
| GET/POST | `/api/blog-categories` | Public/Admin | Danh sách/tạo chủ đề Blog |
| DELETE | `/api/blog-categories/:id` | Admin | Xóa chủ đề Blog |

Chi tiết chức năng và URL giao diện nằm trong [FUNCTIONAL_MODULES.md](./FUNCTIONAL_MODULES.md).

State toàn cục được lưu bằng Zustand persist; dữ liệu server được cache/refetch bằng TanStack Query. Frontend cố định ở React Router DOM v6 và có unit tests chạy bằng Vitest.

## Ghi chú triển khai

Đổi `JWT_SECRET`, mật khẩu admin và `MONGODB_URI` trong môi trường production. Không commit `.env.local`. Khi frontend được deploy sang domain khác, cập nhật đồng thời `FRONTEND_URL` ở backend và `VITE_API_URL` ở frontend.
