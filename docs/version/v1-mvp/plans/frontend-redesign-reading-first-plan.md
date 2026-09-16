# Implementation Plan — Tái cấu trúc giao diện Frontend "Reading-first, Tối giản & Chiều sâu Tri thức"

> **Active Version:** `v1-mvp`  
> **Governed by:** [PRODUCT-IDEA.md](../../../PRODUCT-IDEA.md), [AGENT.md](../../../AGENT.md), [SCOPE.md](../../../SCOPE.md), [ARCHITECTURE.md](../../../ARCHITECTURE.md)  
> **Activated Skills:** `/orchestrate`, `/react-reader-expert`, `/reading-ui-expert`, `/design-taste-frontend`  
> **Task Classification:** `REFACTOR` & `MODIFY` (UI/UX Aesthetic Alignment & Architecture Refinement)

---

## 1. Goal & Scope

### 1.1 Mục tiêu thiết kế
Tái cấu trúc toàn diện giao diện người dùng của **LocalRead** để phản ánh đúng linh hồn của sản phẩm theo `PRODUCT-IDEA.md`:
> **"LocalRead là một reading-first app tạo ra trải nghiệm đọc sách số thoải mái và tập trung, đồng thời hỗ trợ người đọc hiểu sâu hơn những gì họ đang đọc và khám phá những mối liên hệ giữa các source mà họ đã đọc."**  
> Progression: **Read $\rightarrow$ Understand $\rightarrow$ Connect** (Đọc là nền tảng cốt lõi, Hiểu & Kết nối là các tầng giá trị gia tăng).

### 1.2 Bốn trụ cột tái thiết kế
1. **Header & Navigation:** Bộ 3 mục điều hướng chính `Tủ sách` (Read) — `Ghi chú` (Understand) — `Mối nối` (Connect). Dọn dẹp nút trùng lặp, thu gọn theme switcher về icon đơn Sun/Moon.
2. **Page Title & Filter:** Tiêu đề Serif trang nhã `Thư viện của bạn`, dòng trạng thái rút gọn `X cuốn đang đọc`, 3 tab bộ lọc `Tất cả` — `Đang đọc` — `Đã xong` với đường gạch active mảnh (1px) màu than chì `#181A1B`.
3. **Procedural Book Card & Global Drag-Drop:**
   - Bìa sách tự sinh (Procedural Cover nền kem/ngà) in trực tiếp tiêu đề và tác giả lên bìa; **loại bỏ 2 dòng text lặp bên dưới bìa**.
   - Dưới bìa chỉ hiển thị thanh tiến độ siêu mảnh $2\text{px}$ và tín hiệu tri thức kín đáo: `5% • 3 ghi chú • 1 kết nối`.
   - Loại bỏ ô nét đứt DropZoneCard trong lưới; thay thế bằng **Global Drag & Drop Overlay** bao phủ toàn màn hình khi kéo thả PDF.
4. **Layout Grid & Footer:** Căn giữa toàn bộ nội dung trong container `max-w-6xl` ($1120\text{px} - 1200\text{px}$) với lề thoáng đãng; Footer tĩnh lặng chỉ giữ `LocalRead • Ấn / để tìm kiếm`.

---

## 2. Data Flow & Page Navigation

```text
Navigation State trong App.tsx:
  activeNav: 'bookshelf' | 'thoughts' | 'connections'

1. Khi activeNav === 'bookshelf' (Tầng Read):
   Hiển thị LibraryPage với Bookshelf Grid, bộ lọc (Tất cả / Đang đọc / Đã xong), Search
   → Kéo thả PDF ở bất kỳ đâu trên màn hình → Kích hoạt GlobalDropOverlay → Upload vào SQLite & mở sách.

2. Khi activeNav === 'thoughts' (Tầng Understand):
   Hiển thị ThoughtsPage tổng hợp các đoạn Highlights & Ghi chú từ các cuốn sách, phân nhóm theo tác phẩm và thời gian.

3. Khi activeNav === 'connections' (Tầng Connect):
   Hiển thị ConnectionsPage trực quan hóa các mối giao thoa tư tưởng, khái niệm chung giữa các nguồn đọc.

4. Khi click vào BookCard hoặc "Đọc tiếp":
   Chuyển sang ReaderPage (Distraction-free Reader) với PdfViewer stream từ backend, tự động ẩn toolbar khi đọc.
```

---

## 3. Affected Files & Modules

```text
frontend/src/
├── components/
│   └── common/
│       ├── Header.tsx                             # [MODIFY] 3 nav tabs, đơn nút '+ Thêm sách', Sun/Moon toggle
│       └── GlobalDropOverlay.tsx                  # [NEW] Kéo thả file PDF toàn màn hình với hiệu ứng mờ trang nhã
├── modules/
│   ├── library/
│   │   ├── components/
│   │   │   ├── BookCard.tsx                       # [MODIFY] Procedural Cover không lặp text, reading bar 2px, stats ngòi bút/liên kết
│   │   │   └── DropZoneCard.tsx                   # [DELETE/REPLACE] Thay thế bằng GlobalDropOverlay
│   │   └── pages/
│   │       └── LibraryPage.tsx                    # [MODIFY] Xóa nút '+ Thêm sách' trùng, 3 tab lọc, status 'X cuốn đang đọc'
│   ├── thoughts/                                  # [NEW] Tầng Understand (Ghi chú & Trích dẫn)
│   │   └── pages/
│   │       └── ThoughtsPage.tsx                   # Trang tổng hợp suy ngẫm, trích dẫn & highlights
│   ├── connections/                               # [NEW] Tầng Connect (Mối nối ý niệm)
│   │   └── pages/
│   │       └── ConnectionsPage.tsx                # Trang thể hiện mối liên hệ và ý tưởng giao thoa
│   └── reader/
│       ├── components/
│       │   └── ReaderChrome.tsx                   # [MODIFY] Căn chỉnh nhã nhặn, nút điều hướng tối giản
│       └── pages/
│           └── ReaderPage.tsx                     # [MODIFY] Tối ưu không gian đọc tập trung
├── App.tsx                                        # [MODIFY] Điều hướng 3 tầng: bookshelf | thoughts | connections
└── index.css                                      # [MODIFY] Tinh chỉnh token màu than chì #181A1B, border 1px mảnh
```

---

## 4. Chi tiết thiết kế từng thành phần

### 4.1 Header & Navigation (`Header.tsx`)
- **Logo:** `LocalRead` thanh lịch với icon logo nhỏ.
- **Nav Links (Căn giữa):**
  - `Tủ sách` (active khi ở Library)
  - `Ghi chú` (active khi ở Thoughts)
  - `Mối nối` (active khi ở Connections)
  - *Active state:* Gạch chân 1px màu than chì `#181A1B`, không dùng màu quá chói.
- **Cụm bên phải:**
  - Nút tìm kiếm (kính lúp).
  - Nút `+ Thêm sách` duy nhất: Dạng stroke mỏng tinh tế (`variant="outline"` hoặc border mảnh với bo góc nhẹ).
  - Nút chuyển Theme: Icon đơn Sun/Moon chuyển đổi giữa Light/Sepia/Dark.

### 4.2 Tiêu đề & Bộ lọc Thư viện (`LibraryPage.tsx`)
- **Tiêu đề:** `Thư viện của bạn` (Font Serif nhẹ nhàng).
- **Dòng trạng thái:** `{readingCount} cuốn đang đọc` (thay vì lặp tổng số sách).
- **Bộ lọc 3 tab:**
  - `Tất cả` (`all`)
  - `Đang đọc` (`reading`)
  - `Đã xong` (`finished`)
  - Gạch chân active 1px màu than chì `#181A1B`.

### 4.3 Procedural Book Card (`BookCard.tsx`)
- **Bìa sách tự sinh (Procedural Cover):**
  - Tỷ lệ `2:3` hoặc `3:4` với nền màu kem/ngà ấm (`#FBF8F3` / `#F4E8C1`).
  - Tiêu đề và tác giả in trang nhã **ngay trong bìa** với font Serif (Newsreader).
  - **KHÔNG in lặp lại 2 dòng tiêu đề + tác giả bên dưới bìa**.
- **Thanh tiến độ (Reading Bar):**
  - Chiều cao $2\text{px}$, nền xám rất nhạt (`#E5E5E5`), phần đã đọc màu than chì xám đậm (`#4A4A4A`).
- **Tín hiệu Understand / Connect:**
  - Góc dưới thanh tiến độ hoặc khi hover: hiển thị icon ngòi bút nhỏ và icon liên kết:
    `{progressPercent}% • {highlightsCount} ghi chú • {connectionsCount} kết nối`.

### 4.4 Global Drag & Drop Overlay (`GlobalDropOverlay.tsx`)
- Lắng nghe sự kiện `dragenter`, `dragleave`, `dragover`, `drop` trên toàn bộ cửa sổ trình duyệt.
- Khi người dùng kéo file PDF vào bất kỳ đâu trên cửa sổ:
  - Overlay mờ bán trong suốt xuất hiện (`backdrop-blur-sm bg-surface/85`).
  - Thông điệp: *"Thả để thêm sách vào không gian đọc"*.
  - Biểu tượng tệp sách nhẹ nhàng viền nét mỏng.

### 4.5 Tầng Understand & Connect (`ThoughtsPage.tsx`, `ConnectionsPage.tsx`)
- **ThoughtsPage (Ghi chú):**
  - Hiển thị danh sách trích dẫn, highlights và suy ngẫm đã lưu từ các cuốn sách.
  - Cho phép lọc theo cuốn sách hoặc tìm kiếm theo từ khóa ghi chú.
- **ConnectionsPage (Mối nối):**
  - Thể hiện triết lý giao thoa ý niệm giữa các tác phẩm mà người đọc đã nghiền ngẫm.

### 4.6 Footer
- Footer tĩnh lặng, tối giản:
  `LocalRead • Ấn / để tìm kiếm` (Font sans xám nhạt `#8A8A8A`, cỡ 11px).

---

## 5. UI/UX & Laptop Ergonomics Verification

- Khoảng cách lề cân đối (`max-w-6xl` căn giữa), giúp mắt thư giãn khi đọc trên màn hình laptop từ 13 đến 16 inch.
- Không còn bất kỳ yếu tố thừa thãi nào làm xao nhãng việc đọc.

---

## 6. Edge Cases & Xử lý ngoại lệ

1. **Kéo thả tệp không phải PDF:** Global Drag Drop kiểm tra MIME type hoặc đuôi file `.pdf`, thông báo nhẹ nhàng nếu tệp không hợp lệ.
2. **Kéo thả nhiều tệp cùng lúc:** Nạp lần lượt hoặc nạp tệp đầu tiên an toàn.
3. **Sách có bìa thật (Cover Image) vs Bìa tự sinh (Procedural):**
   - Nếu có `coverUrl`: Bìa hiển thị ảnh gốc, thanh tiến độ $2\text{px}$ đặt bên dưới.
   - Nếu không có `coverUrl`: Bìa hiển thị typography, không có text dư thừa bên dưới.

---

## 7. Risks & Assumptions

- **Assumption:** Các API backend đã sẵn sàng (`GET /api/books`, `POST /api/books/import`, `DELETE /api/books/:id`, `GET /api/documents/:id/highlights`).
- **Risk:** Trải nghiệm drag-and-drop có thể bị xung đột với các input con nếu không quản lý event target cẩn thận.
  - *Mitigation:* Sử dụng bộ đếm `dragCounter` trong `GlobalDropOverlay` để theo dõi chính xác khi nào con trỏ rời khỏi window.

---

## 8. Testing Strategy

### 8.1 TypeScript & Build Verification
- `npx tsc --noEmit` và `npm run build` trong `frontend/` phải pass 100% không có lỗi.

### 8.2 Visual & Interaction Scenarios
1. **Kiểm tra Header:** 3 tab `Tủ sách` | `Ghi chú` | `Mối nối` chuyển đổi mượt mà; 1 nút `+ Thêm sách` dạng stroke; 1 icon toggle Sun/Moon.
2. **Kiểm tra Thư viện:** Tiêu đề `Thư viện của bạn`, dòng phụ `X cuốn đang đọc`, 3 tab `Tất cả` | `Đang đọc` | `Đã xong`.
3. **Kiểm tra BookCard:** Bìa tự sinh hiển thị đẹp, không lặp text bên dưới, thanh progress $2\text{px}$ sắc nét, hiển thị số ghi chú/kết nối.
4. **Kiểm tra Drag & Drop:** Kéo file PDF vào bất kỳ vị trí nào trên trình duyệt $\rightarrow$ Overlay hiện lên $\rightarrow$ Thả chuột $\rightarrow$ Nạp sách thành công và mở reader.

---

## 9. Architecture Impact

- Giữ nguyên toàn bộ cấu trúc Backend và API contracts.
- Frontend tuân thủ đúng định hướng **Reading-first**, tinh giản mã nguồn và nâng cao tính thẩm mỹ theo `PRODUCT-IDEA.md`.
