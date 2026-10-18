# Tin Việt 24 – Website mẫu cho bài tập lớn

Giao diện tham khảo mô phỏng **bố cục** minh họa trong yêu cầu giảng viên: navbar, 1 bài chính + 2 bài phụ, danh sách các bài còn lại, trang chi tiết, footer, responsive, LocalStorage và trang crawler.

**Nội dung và ảnh trong `data/posts.json` đều là dữ liệu mẫu tự biên soạn**, không phải tin tức thật và không lấy từ Dân trí. Ảnh minh họa tải từ Unsplash, cần có internet để hiển thị.

## Chạy trong GitHub Codespaces

```bash
npm install
npm start
```

Mở cổng 8000 (Ports > Open in Browser). Mở `index.html` để xem trang chính, nhấn bài để xem `article.html`, và dùng `crawler.html` để nhập URL bài báo.

## Tích hợp vào repository cũ

Giải nén tệp, sao chép các thư mục `assets`, `data` và các file `.html`, `server.js`, `package.json`, `.gitignore` vào thư mục gốc của repository. Nếu đã có chỉnh sửa cá nhân, sao lưu trước khi ghi đè.

## Lưu ý về crawler

Crawler là phần **thử nghiệm**, chỉ hỗ trợ Dân trí và có thể không hoạt động nếu trang thay đổi HTML hoặc từ chối yêu cầu. Không đăng lại toàn văn bài báo công khai khi chưa được phép. Giao diện mẫu hoạt động độc lập với crawler.

Đề yêu cầu **ít nhất 10 bài viết trong mỗi chuyên mục**: bộ dữ liệu mẫu này có 16 bài tổng cộng để thử giao diện, **chưa đáp ứng số lượng 10 bài/chuyên mục**. Cần thu thập hoặc bổ sung dữ liệu có nguồn hợp lệ để nộp đủ yêu cầu.
