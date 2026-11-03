# Hướng dẫn làm video cho người mới

Không cần biết lập trình, không gõ lệnh. Bạn gửi clip, nói muốn gì, Claude dựng video.
Bản in: [`Huong-dan-lam-video.pdf`](Huong-dan-lam-video.pdf) (cùng nội dung).

> **Ba chữ sẽ gặp**
> - **Claude**: trợ lý AI, chính là người dựng video cho bạn.
> - **GitHub**: trang web cất "bộ công cụ dựng video" và mọi luật bạn dạy Claude.
> - **Repo**: một thư mục trên GitHub. Ở đây là thư mục chứa bộ công cụ.

---

## PHẦN 1 · LÀM MỘT LẦN DUY NHẤT

### Bước 1. Tạo tài khoản Claude

1. Mở trình duyệt (Chrome, Safari…), vào **claude.ai**.
2. Bấm **Sign up**, đăng ký bằng email hoặc tài khoản Google.
3. Bấm vào tên mình ở góc dưới bên trái → **Settings** → **Billing** (Thanh toán), mua gói **Pro** hoặc **Max**. Gói Max làm được nhiều video hơn mỗi ngày.

✔ **Xong khi:** đăng nhập claude.ai được và tài khoản đã có gói Pro hoặc Max.

### Bước 2. Tạo tài khoản GitHub

1. Vào **github.com/signup**.
2. Nhập email, đặt mật khẩu, đặt tên người dùng (viết liền, không dấu, ví dụ `nguyenvana`). **Ghi tên này ra giấy.**
3. Mở email, bấm vào thư xác nhận GitHub gửi tới.

✔ **Xong khi:** đăng nhập github.com được.

### Bước 3. Nhận bộ công cụ

1. Nhắn cho người giao bộ công cụ: *"Tên GitHub của tôi là nguyenvana, mời tôi vào repo mẫu."*
2. Chờ email từ GitHub có dòng *"… invited you to …"*. Bấm **View invitation** → **Accept invitation**.
3. Trình duyệt mở ra trang của bộ công cụ. Ở góc trên bên phải có nút màu xanh lá **Use this template**. Bấm vào → chọn **Create a new repository**.
4. Trang mới hiện ra, điền:
   - **Repository name:** gõ `bds-editor`
   - Chọn ô **Private** (để chỉ mình bạn thấy)
   - Các ô khác để nguyên
5. Kéo xuống, bấm **Create repository**.

⚠ Nếu thấy nút **Fork** thì đừng bấm, chỉ bấm **Use this template**.

✔ **Xong khi:** thanh địa chỉ có dạng `github.com/nguyenvana/bds-editor`, cạnh tên có chữ **Private**.

### Bước 4. Cho Claude vào bộ công cụ của bạn

1. Vào **claude.ai/code**.
2. Nếu Claude hỏi kết nối GitHub (**Connect GitHub**) thì bấm vào, rồi bấm **Authorize** (Cho phép).
3. Mở tab mới, vào **github.com/apps/claude** → bấm **Install** (hoặc **Configure** nếu đã cài trước đó).
4. Chọn tài khoản `nguyenvana` của bạn.
5. Chọn **Only select repositories** → bấm ô **Select repositories** → chọn `bds-editor`.
6. Bấm **Install** hoặc **Save**.

✔ **Xong khi:** quay lại claude.ai/code, bấm ô chọn repo thì thấy `nguyenvana/bds-editor` trong danh sách.

### Bước 5. Mở mạng cho Claude

Claude cần mạng để tải clip của bạn từ Google Drive về.

1. Ở claude.ai/code, cạnh ô chọn repo có chữ **Default** (tên môi trường). Bấm vào đó.
2. Bấm **Edit** (cây bút).
3. Ở mục **Network access**, chọn **Full**.
4. Bấm **Save**.

✔ **Xong khi:** mục Network access hiện **Full**.

**Phần 1 xong. Không bao giờ phải làm lại.**

---

## PHẦN 2 · MỖI LẦN LÀM MỘT VIDEO

### Bước 1. Đưa clip lên Google Drive

1. Vào **drive.google.com**.
2. Bấm **+ Mới** → **Thư mục mới**, đặt tên, ví dụ `Video anh Tuấn`.
3. Mở thư mục đó, kéo các file clip từ máy vào. Có bảng giá, logo thì kéo vào luôn.
4. Chờ tải lên xong (hết vòng xoay ở góc dưới bên phải).
5. Quay ra ngoài, **chuột phải vào thư mục** → **Chia sẻ** → **Chia sẻ**.
6. Ở mục **Quyền truy cập chung**, đổi "Bị hạn chế" thành **Bất kỳ ai có đường liên kết**.
7. Bấm **Sao chép đường liên kết** → **Xong**.

✔ **Xong khi:** link đã nằm trong bộ nhớ copy, chỉ cần dán.

### Bước 2. Giao việc cho Claude

1. Vào **claude.ai/code**.
2. Ở ô chọn repo, chọn `nguyenvana/bds-editor`.
3. Bấm vào khung gõ chữ, gõ theo mẫu này (đổi tên, dự án, câu cuối video cho đúng của bạn):

   ```
   Edit video cho anh Tuấn, dự án Sunrise Riverside.
   Clip: (bấm Ctrl+V để dán link Google Drive vào đây)
   Câu cuối video: "Nhắn anh Tuấn để nhận bảng giá". Đăng TikTok.
   ```

4. Bấm Enter hoặc nút gửi.

### Bước 3. Chờ

- Claude tự làm trong khoảng **40–60 phút**.
- Có thể đóng trình duyệt đi làm việc khác, Claude vẫn chạy.
- Nếu Claude hỏi lại (ví dụ: "Màu chủ đạo là gì?") thì trả lời như nhắn tin bình thường.

### Bước 4. Xem và sửa

1. Khi xong, trong khung chat hiện một **ô file video**. Bấm vào để xem.
2. Chỗ nào chưa ưng thì gõ như nói chuyện, càng nói rõ giây thứ mấy càng tốt:
   - *"Giây 12 chữ che mặt anh Tuấn, dời lên trên."*
   - *"Chữ giá tiền màu vàng khó đọc, đổi màu trắng."*
3. Claude sửa xong lại gửi bản mới. Lặp lại tới khi ưng.

### Bước 5. Lấy video về

1. Ưng rồi thì gõ:

   ```
   Duyệt. Gửi bản cuối, rồi commit và push.
   ```

2. Claude gửi file video bản cuối. Bấm vào ô file → **Download** (Tải về).
3. **Tải về ngay.** Phiên làm việc đóng là file mất.
4. Vào lại Google Drive, chuột phải thư mục clip → **Chia sẻ** → đổi lại thành **Bị hạn chế**, để clip của khách không bị lộ.

✔ **Xong:** video nằm trong máy bạn, đăng lên TikTok được.

---

## Bị kẹt?

- Chụp màn hình hoặc chép nguyên câu báo lỗi, gửi cho Claude trong phiên và hỏi "lỗi này là sao, sửa giúp".
- Claude báo không tải được clip → link Drive chưa để **Bất kỳ ai có đường liên kết** (Phần 2, bước 1).
- Không thấy repo của mình ở claude.ai/code → làm lại Phần 1, bước 4.
- Claude báo bị chặn mạng → làm lại Phần 1, bước 5.

Đã quen rồi, muốn dạy Claude luật riêng ("không bao giờ dùng màu đỏ") hay chạy trên máy của mình: đọc [`HUONG-DAN.md`](HUONG-DAN.md).
