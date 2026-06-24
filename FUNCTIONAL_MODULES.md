# Các module chức năng đã triển khai

## 1. Sản phẩm

- Admin CRUD sản phẩm và danh mục tại `/admin`.
- Dữ liệu gồm mô tả HTML rich text, thumbnail, gallery, giá, giá sale, kho, trạng thái tự tính và cờ nổi bật.
- Client shop tại `/shop-grid-left`: grid/list, tìm kiếm, lọc danh mục, khoảng giá và phân trang.
- Chi tiết tại `/shop-details/:slug`: gallery, tồn kho, đánh giá và sản phẩm liên quan.
- Trang chủ gọi API cho Trending và New Pieces, chèn vào trước footer Mojuri.

## 2. Đơn hàng

- Cart dùng `CartContext` và LocalStorage; hỗ trợ thêm, đổi số lượng và xóa.
- Checkout xác thực lại giá/tồn kho ở backend, tính phí ship và sinh mã đơn.
- Khách tra cứu bằng mã đơn + email tại `/order-tracking`.
- Admin cập nhật Pending → Processing → Shipped → Delivered/Cancelled. Hủy đơn hoàn tồn kho; mở lại đơn kiểm tra và trừ lại tồn.
- Dashboard thống kê doanh thu đơn đã giao theo ngày và tháng.

## 3. Liên hệ

- Form Mojuri hiện có gửi Name, Email, Subject, Message vào API.
- Admin inbox có trạng thái đọc/chưa đọc và link phản hồi qua email.

## 4. Blog

- Admin CRUD bài viết, nội dung HTML rich text, upload ảnh bìa tối đa 5MB, chủ đề Tips/Collections/News và Draft/Published.
- Client list tại `/blog-grid-fullwidth`, tìm kiếm/lọc/phân trang.
- Chi tiết tại `/blog/:slug` và widget Recent Posts.

## API bổ sung

- `/api/categories`, `/api/categories/:id`
- `/api/products/:id/reviews`
- `/api/orders`, `/api/orders/:id`, `/api/orders/track`
- `/api/stats/revenue`
- `/api/blogs`, `/api/blogs/:id`
- `/api/upload`

Chạy `npm run seed:admin --prefix backend` để tạo admin, bốn danh mục, tám sản phẩm và ba bài blog mẫu mà không xóa dữ liệu hiện có.

## Chuẩn kỹ thuật

- Zustand persist quản lý cart và phiên user toàn cục.
- TanStack Query quản lý cache, loading, error, mutation và refetch API.
- React Router DOM v6 quản lý Client/Admin routes.
- RichTextEditor dùng lại cho mô tả sản phẩm và nội dung Blog.
- ERD: [ERD.md](./ERD.md). Kiểm thử: `npm test`.
