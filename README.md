# bds-editor

> **Người mới: chỉ cần đọc [`BAT-DAU.md`](BAT-DAU.md)** (hoặc tải bản in [`Huong-dan-lam-video.pdf`](Huong-dan-lam-video.pdf)). Từng cú bấm, không gõ lệnh. Phần còn lại của trang này dành cho người đã quen.

Bộ công cụ dựng video bất động sản dọc 1080×1920 từ **clip quay thật** (sale hay chủ đầu tư nói trước máy, quay dự án). Dùng với Claude Code: thả clip thô vào, Claude dựng ra video hoàn chỉnh gồm:
- cắt nhịp, bỏ khoảng lặng;
- hook 3 giây theo góc của câu mở;
- chữ chốt theo preset (bộ chung 67 preset, 22 preset BĐS, 14 preset ME4REAL, thẻ bám lời; chỉ dùng preset đã duyệt trong `lib/presets-duyet.json`), có chữ đặt sau người;
- minh họa "nói gì vẽ nấy", bản đồ;
- SFX, màu và LUT;
- tự kiểm trước khi giao.

Chạy bằng [HyperFrames](https://github.com/heygen-com/hyperframes) (HTML + GSAP → MP4), offline.

## Bắt đầu nhanh

Bản chi tiết (dạy luật mới, nhận bản cập nhật, lỗi hay gặp): [`HUONG-DAN.md`](HUONG-DAN.md).

**Trên cloud (claude.ai/code, khuyên dùng):** không cài gì. Để Network của môi trường là **Full** (một lần), mở phiên trên repo rồi dán:

```
Edit video cho anh Tuấn, dự án Sunrise Riverside.
Clip và tài liệu: <link Google Drive, để "Bất kỳ ai có đường liên kết">.
CTA: "Nhắn anh Tuấn để nhận bảng giá". Đăng TikTok.
```

Khi mở phiên, `.claude/hooks/session-start.sh` tự cài FFmpeg, Python, thư viện Node, tải sẵn model giọng nói ở chế độ nền và in một dòng `Kiểm máy`. Claude tải clip bằng `npm run tai-clip -- <link> <khach>-<du-an>`.

**Trên máy của mình** (macOS, Linux, Windows qua WSL2):

```bash
git clone https://github.com/<ten-ban>/<repo>.git && cd <repo>
bash scripts/cai-dat.sh          # cài mọi thứ còn thiếu, kiểm máy, dựng thử
npm run new -- tuan-sunrise      # tạo work/tuan-sunrise/01_footage/... rồi chép clip vào
claude                           # "Edit video tuan-sunrise cho anh Tuấn, clip ở work/tuan-sunrise/"
```

Lệnh hay dùng:

```
npm run kiem-may         # máy đủ đồ chưa: ✔ / ✘ từng mục kèm lệnh sửa
npm run demo             # kiểm thư viện: dựng tests/demo (media tổng hợp), không render
npm run example          # video mẫu đủ 5 bước (tạo nguồn → tiếp nhận → dựng → render) → build/example/output.mp4
```

## Dùng

Mở Claude Code trong repo, gửi clip và nói ví dụ: "edit video này cho anh Minh, dự án Sunrise". Skill `bds-editor` tự nhận việc. Nó chỉ hỏi những gì còn thiếu (khách nào, CTA gì), tối đa một lần.

Mỗi khách có cấu hình riêng ở `clients/<khach>/brand.json`: màu, LUT, CTA, lịch sử phong cách. Video mới của cùng khách sẽ tự đổi phong cách so với video trước.

## Tài liệu

| File | Nội dung |
|---|---|
| `BAT-DAU.md`, `Huong-dan-lam-video.pdf` | người mới: từng cú bấm tới video đầu tiên |
| `HUONG-DAN.md` | hướng dẫn chi tiết: dạy luật, cập nhật, chạy trên máy, lỗi hay gặp |
| `CLAUDE.md` | điểm vào cho Claude |
| `lib/README.md` | thư viện dựng: `plan.json`, phong cách S1–S5, công thức R1–R7 |
| `docs/PHONG-CACH-ME4REAL.md` | bộ mã phong cách đo từ editor BĐS chuyên nghiệp |
| `docs/VAN-HANH.md` | quy tắc vận hành, thứ tự ưu tiên, các mâu thuẫn đã gỡ |
| `TALKING-HEAD.md` | bảng luật người dùng đã chốt, quy trình 40–60 phút |
| `docs/TRINH-BAY.md` | hook, minh họa, bố cục đồ họa, kiểm phần hình |
| `docs/HAU-KY.md`, `docs/DAC-TA-CHU.md` | đặc tả gốc đo từ video mẫu |
| `TOOLKIT.md`, `MAP.md`, `docs/SHOTS.md` | công cụ dựng, bản đồ, phương pháp cú máy |
| `text-presets/` | preset chữ và quy tắc chọn |
| `docs/SOURCES.md` | nguồn và quyền sử dụng tài nguyên bên ngoài |

## Lưu ý

- Clip thô và file render không đưa vào repo (`work/`, `build/` đã có trong `.gitignore`).
- Tài nguyên bên ngoài (SFX, thẻ chuyển động) dùng theo quyền ghi trong `docs/SOURCES.md`.
