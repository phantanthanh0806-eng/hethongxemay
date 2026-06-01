# 🏍️ Thế Giới Xe Máy

- **Repository:** [the-gioi-xe-may](https://github.com/nguyentrungking/the-gioi-xe-may)

---

## 📂 Cấu trúc cây thư mục

Mọi người chú ý vị trí file để nhúng đường dẫn (path) cho đúng. Khi nhúng JS, **luôn nhúng `script.js` lên trước** các file JS riêng của trang.

- `assets/`
  - `css/`
    - `style.css` (Style chung toàn website - Mọi trang đều phải nhúng)
    - `trang-chu.css`, `danh-sach-phu-tung.css`... (Style riêng từng trang)
  - `images/` (Hình ảnh sản phẩm xe và phụ tùng)
  - `js/`
    - `script.js` (Chứa các hàm/biến dùng chung toàn website)
    - `trang-chu.js`, `danh-sach-phu-tung.js`...
- `components/` (Chứa các file JS render Header, Footer, Nav dùng chung)
- `pages/` (Chứa toàn bộ các trang giao diện)
  - `trang-chu.html`
  - `danh-sach-phu-tung.html`
  - `danh-sach-xe-may.html`
  - `chi-tiet-xe-may.html`
  - `hoa-don.html`

## 🚀 Quy định Thêm/Xóa file

- Tự do xóa/đổi tên các file thuộc trang mình phụ trách nếu thấy không cần thiết (nhớ xóa luôn thẻ link/script tương ứng trong HTML).
- Nếu muốn xóa/đổi tên các file DÙNG CHUNG (trong thư mục `components/`, `script.js`, `style.css`...), vui lòng nhắn báo team trước để tránh lỗi Git Conflict.
