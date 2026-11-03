# Bắt đầu: làm video đầu tiên

Không cần biết lập trình, không gõ lệnh. Anh/chị chỉ gửi clip, nói muốn gì; Claude dựng video.

## Làm một lần (khoảng 20 phút)

1. **Tạo tài khoản**
   - Claude gói Pro hoặc Max: [claude.ai](https://claude.ai)
   - GitHub (miễn phí): [github.com/signup](https://github.com/signup)
2. **Lấy bộ công cụ về tài khoản của mình**
   - Gửi tên GitHub cho người giao bộ công cụ, chờ email mời, bấm **Accept invitation**.
   - Vào trang repo mẫu → nút xanh **Use this template** → **Create a new repository** → chọn **Private** → **Create repository**. (Đừng bấm Fork.)
3. **Cho Claude vào repo đó**
   - Vào [claude.ai/code](https://claude.ai/code), làm theo khi được hỏi kết nối GitHub.
   - Vào [github.com/apps/claude](https://github.com/apps/claude) → **Install** → **Only select repositories** → chọn repo vừa tạo → **Save**.
4. **Mở mạng cho Claude**
   - Ở claude.ai/code, bấm tên môi trường (thường là "Default") → **Edit** → **Network access: Full** → Lưu.

## Mỗi video (khoảng 1 tiếng, phần lớn là chờ)

1. **Bỏ clip lên Google Drive**, chung một thư mục (kèm bảng giá, logo nếu có).
   Chuột phải thư mục → **Chia sẻ** → **Bất kỳ ai có đường liên kết** → **Sao chép đường liên kết**.
2. **Vào [claude.ai/code](https://claude.ai/code)**, chọn repo của mình, bấm tạo phiên mới.
3. **Dán câu này** (sửa chữ trong `< >`) rồi gửi:

   ```
   Edit video cho <anh Tuấn>, dự án <Sunrise Riverside>.
   Clip: <dán link Google Drive>.
   CTA: "<Nhắn anh Tuấn để nhận bảng giá>". Đăng <TikTok>.
   ```

4. **Chờ 40–60 phút.** Đóng tab cũng được, Claude vẫn làm. Xong sẽ có bản xem thử trong khung chat.
5. **Xem và góp ý** bằng lời thường, có giây cho dễ: "Giây 12 chữ che mặt, dời lên trên."
6. **Ưng rồi thì gõ:** `Duyệt. Gửi bản cuối, rồi commit và push.`
7. **Tải file MP4 về máy ngay.** Phiên đóng là file mất.

## Bị kẹt

Chụp màn hình hoặc chép nguyên thông báo lỗi, gửi cho Claude trong phiên và hỏi "lỗi này là sao, sửa giúp". Hay gặp nhất:

- Claude báo không tải được clip → link Drive chưa để **Bất kỳ ai có đường liên kết**.
- Không thấy repo của mình ở claude.ai/code → làm lại bước 3 phần "Làm một lần".
- Claude báo bị chặn mạng → làm lại bước 4.

Muốn dạy Claude luật riêng ("không bao giờ dùng màu đỏ"), chạy trên máy của mình, hay tìm hiểu sâu hơn: đọc [`HUONG-DAN.md`](HUONG-DAN.md).
