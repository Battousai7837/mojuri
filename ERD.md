# ERD — Mojuri MongoDB

```mermaid
erDiagram
  USER { ObjectId _id string name string email string passwordHash enum role }
  CATEGORY { ObjectId _id string name string slug string description }
  PRODUCT { ObjectId _id string name string slug string description string thumbnail array gallery number price number salePrice number stock string category boolean featured array reviews }
  ORDER { ObjectId _id string code object customer array items number subtotal number shippingFee number total enum status }
  CONTACT { ObjectId _id string name string email string subject string message enum status }
  BLOG_CATEGORY { ObjectId _id string name string slug }
  BLOG { ObjectId _id string title string slug string excerpt string content string coverImage string category enum status date publishedAt }
  PRODUCT ||--o{ ORDER : "snapshotted in items"
  CATEGORY ||--o{ PRODUCT : classifies
  BLOG_CATEGORY ||--o{ BLOG : classifies
  USER ||--o{ ORDER : "email association"
```

MongoDB lưu `Order.items` dưới dạng snapshot để tên, giá và ảnh của đơn cũ không đổi khi sản phẩm được cập nhật. Review được nhúng trong Product vì luôn được đọc cùng chi tiết sản phẩm. Category được tham chiếu bằng tên để dữ liệu seed và bộ lọc client đơn giản, còn `_id` của Product được lưu trong từng order item để cập nhật tồn kho.

## Index và ràng buộc

- Unique: `User.email`, `Product.slug`, `Category.name/slug`, `Order.code`, `Blog.slug`, `BlogCategory.name/slug`.
- Enum: role, order status, contact status, blog status.
- Validation request dùng Zod trước khi Mongoose thực hiện schema validation.
- Xóa/hủy đơn không xóa snapshot; trạng thái Cancelled tự hoàn tồn kho.
