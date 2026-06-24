# DỰ ÁN: MOJURI JEWELRY E-COMMERCE

**Mục tiêu dự án:** Chuyển đổi template tĩnh HTML "Mojuri" thành một ứng dụng Fullstack hoàn chỉnh. Áp dụng kiến trúc Microservices cơ bản bằng cách tách biệt hoàn toàn Frontend và Backend.

- **Frontend:** Xây dựng bằng React.js (dùng Vite để tối ưu hiệu suất build).
- **Backend:** Xây dựng bằng Next.js (Sử dụng API Routes / Route Handlers làm RESTful API server).
- **Link template tĩnh:** https://html-demo-orcin.vercel.app/premium/mojuri/index.html

---

## 1. KIẾN TRÚC HỆ THỐNG CẦN THIẾT LẬP

Để sinh viên nắm vững cách 2 hệ thống độc lập giao tiếp với nhau, dự án yêu cầu setup 2 repository (hoặc 1 monorepo với 2 workspace):

- **Backend (Next.js API - Port 3000):** Chỉ làm nhiệm vụ cung cấp dữ liệu qua định dạng JSON. Xử lý logic nghiệp vụ, tương tác với Database (MongoDB/PostgreSQL), xử lý Authentication (JWT) và phân quyền.
  - *Lưu ý cho sinh viên:* Cần cấu hình CORS (Cross-Origin Resource Sharing) để Frontend ở cổng khác có thể gọi được API.
- **Frontend (React Vite - Port 5173):** Đảm nhiệm việc hiển thị giao diện. Sẽ chia làm 2 khu vực:
  - **Client App:** Tích hợp giao diện HTML Mojuri (Home, Shop, Cart, Checkout, Blog, Contact).
  - **Admin Dashboard:** Tự xây dựng một giao diện quản trị (có thể dùng Ant Design, Material-UI, hoặc Tailwind CSS) để quản trị viên thao tác dữ liệu.

---

## 2. PHÂN TÍCH YÊU CẦU CHỨC NĂNG (MODULES)

Dựa trên giao diện Mojuri hiện có, hệ thống cần phát triển 4 module cốt lõi sau:

### 2.1. Module Quản Lý Sản Phẩm (Product Management)

Trang sức (Jewelry) có tính chất đặc thù là cần hình ảnh chất lượng cao và có phân loại (Nhẫn, Dây chuyền, Vòng tay...).

**Phía Admin (Backend + Admin UI):**
- CRUD (Thêm, Xem, Sửa, Xóa) sản phẩm.
- Mỗi sản phẩm bao gồm: Tên, Mô tả (Rich text), Hình ảnh (Thumbnail & Gallery), Giá bán, Giá khuyến mãi, Số lượng kho, Trạng thái (In stock/Out of stock).
- Quản lý danh mục (Categories): Rings, Necklaces, Earrings, Bracelets.

**Phía Client (React User UI):**
- Trang chủ: Gọi API hiển thị danh sách sản phẩm nổi bật (Trending), sản phẩm mới.
- Trang Shop: Hiển thị danh sách sản phẩm dạng Grid/List, có tính năng Phân trang (Pagination).
- Tính năng Lọc & Tìm kiếm: Lọc sản phẩm theo danh mục, mức giá.
- Trang Chi tiết sản phẩm: Hiển thị hình ảnh, mô tả, đánh giá (review), và các sản phẩm liên quan (Related products).

### 2.2. Module Quản Lý Đơn Hàng (Order Management)

Luồng mua hàng từ lúc chọn sản phẩm đến khi thanh toán.

**Phía Client (React User UI):**
- Giỏ hàng (Cart): Thêm/bớt số lượng, xóa sản phẩm khỏi giỏ. Lưu trữ giỏ hàng ở LocalStorage hoặc Redux/Zustand.
- Thanh toán (Checkout): Form điền thông tin người mua (Tên, SĐT, Địa chỉ, Email). Tính tổng tiền, phí ship.
- Khách hàng có thể tra cứu trạng thái đơn hàng của mình.

**Phía Admin (Backend + Admin UI):**
- Xem danh sách các đơn đặt hàng mới.
- Cập nhật trạng thái đơn hàng: Pending (Chờ xử lý) → Processing (Đang chuẩn bị) → Shipped (Đang giao) → Delivered (Đã giao) hoặc Cancelled (Đã hủy).
- **Nâng cao:** Thống kê doanh thu cơ bản theo ngày/tháng.

### 2.3. Module Quản Lý Liên Hệ (Contact Management)

Tương tác giữa khách hàng và bộ phận CSKH của cửa hàng.

**Phía Client (React User UI):**
- Trang Contact Us: Render form liên hệ gồm: Tên, Email, Tiêu đề, Nội dung tin nhắn. Gửi data xuống API Next.js.

**Phía Admin (Backend + Admin UI):**
- Hiển thị danh sách các tin nhắn liên hệ (Inbox).
- Trạng thái liên hệ: Đã đọc, Chưa đọc.
- Chức năng phản hồi (Gửi email tự động từ hệ thống - tính năng nâng cao sinh viên có thể dùng Nodemailer để tích hợp).

### 2.4. Module Quản Lý Bài Viết (Blog Management)

Giúp cửa hàng SEO và cung cấp kiến thức (VD: Cách bảo quản trang sức bạc).

**Phía Admin (Backend + Admin UI):**
- Quản lý Bài viết: Tạo bài viết mới với Trình soạn thảo văn bản (VD: Quill, CKEditor), Upload ảnh bìa.
- Quản lý danh mục Blog (VD: Tips, Collections, News).
- Quản lý trạng thái: Draft (Nháp) / Published (Đã xuất bản).

**Phía Client (React User UI):**
- Trang Blog: Lấy API hiển thị danh sách bài viết (tiêu đề, ảnh bìa, ngày đăng, tóm tắt).
- Trang Blog Details: Hiển thị chi tiết nội dung bài viết.
- Widget Recent Posts (Bài viết gần đây) bên sidebar như thiết kế của template.

---

## 3. YÊU CẦU VỀ KỸ THUẬT & CÔNG NGHỆ

Để đánh giá mức độ nắm vững Frontend và Backend, sinh viên cần áp dụng các chuẩn sau:

### A. Về phía Backend (Next.js):
- **Cấu trúc API:** Khuyến khích sử dụng Next.js App Router (`app/api/...`) xây dựng RESTful API chuẩn (GET, POST, PUT, DELETE).
- **Database ORM/ODM:** Sử dụng Prisma (nếu dùng SQL: MySQL/PostgreSQL) hoặc Mongoose (nếu dùng MongoDB).
- **Bảo mật & Auth:**
  - Bảo vệ các route API của Admin bằng JWT (JSON Web Token).
  - Mã hóa mật khẩu bằng `bcryptjs`.
- **Validation:** Sử dụng Zod hoặc Yup để validate dữ liệu từ Client gửi lên trước khi lưu vào Database.

### B. Về phía Frontend (React Vite):
- **Quản lý State:** Sử dụng Redux Toolkit hoặc Zustand để quản lý trạng thái global (Ví dụ: Giỏ hàng - Cart state, Thông tin User đăng nhập).
- **Gọi API (Data Fetching):** Thay vì dùng `useEffect` cơ bản, hãy yêu cầu sinh viên sử dụng React Query (TanStack Query) hoặc RTK Query để tối ưu hóa caching, loading state, và tự động gọi lại API.
- **Routing:** Sử dụng `react-router-dom` v6 để quản lý các trang (Client layouts và Admin layouts).
- **Tái sử dụng Component:** Bóc tách template HTML thành các functional component nhỏ (VD: ProductCard, Header, Footer, Sidebar).

---

## 4. LỘ TRÌNH (ROADMAP)

### Ngày 1: Khởi tạo & Thiết kế CSDL
- Setup 2 thư mục React Vite và Next.js. Cấu hình CORS.
- Bóc tách HTML/CSS vào các component React (Header, Footer, Layout).
- Thiết kế ERD (Database schema) cho Product, Order, User, Blog, Contact.

### Ngày 1: Authentication & Quản lý Sản phẩm
- Làm API Đăng nhập/Đăng ký. Phân quyền Admin/User.
- Xây dựng API CRUD Sản phẩm.
- Làm giao diện Admin để thêm/sửa sản phẩm.

### Ngày 2: Giao diện Client & Giỏ hàng
- Tích hợp API sản phẩm ra ngoài giao diện Mojuri (Home, Shop, Details).
- Xử lý logic Giỏ hàng bằng Redux/Zustand (Thêm/bớt/xóa sản phẩm, lưu LocalStorage).

### Ngày 2: Thanh toán & Quản lý Đơn hàng
- Giao diện Checkout, gọi API tạo Đơn hàng (POST Order).
- Trang Admin quản lý danh sách đơn hàng và cập nhật trạng thái.

### Ngày 3: Các module còn lại & Hoàn thiện
- Phát triển API và Giao diện cho Blog & Contact.
- Testing, dọn dẹp code, xử lý các lỗi responsive, chuẩn bị slide/tài liệu báo cáo dự án.
