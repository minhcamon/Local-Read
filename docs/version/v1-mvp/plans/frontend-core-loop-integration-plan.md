# Implementation Plan — Tích hợp trọn vẹn Frontend Core Loop với Backend REST API

> **Active Version:** `v1-mvp`  
> **Governed by:** [AGENT.md](../../../AGENT.md), [ACTIVE-VERSION.md](../../../ACTIVE-VERSION.md), [SCOPE.md](../../../SCOPE.md), [ARCHITECTURE.md](../../../ARCHITECTURE.md), [backend-mvp-implementation-plan.md](./backend-mvp-implementation-plan.md)  
> **Activated Skills:** `/orchestrate`, `/react-reader-expert`, `/reading-ui-expert`, `/express-backend-expert`  
> **Task Classification:** `NEW_FEATURE` & `MODIFY` (Full-Stack Vertical Completeness — Core Loop)

---

## 1. Goal & Scope

### 1.1 Mục tiêu
Loại bỏ 100% Mock Data (`MOCK_BOOKS`, simulated reader content) trong luồng cốt lõi (Core Loop) và kết nối trọn vẹn từ giao diện React (`LibraryPage`, `ReaderPage`, `DropZoneCard`, `ImportModal`, `PdfViewer`) tới Backend REST API & cơ sở dữ liệu SQLite:
1. **Vertical Completeness Core Loop:**
   ```text
   Kéo thả PDF vào Thư viện → Backend lưu trữ an toàn & tạo Book+Document → Thư viện hiển thị danh sách sách thật từ SQLite
   → Bấm vào Sách → Reader mở stream PDF thật qua Range Request → Nhảy đến đúng trang đã lưu
   → Đọc & Lật trang (Phím tắt/Cuộn) → Tự động debounce 800ms lưu trang vào DB
   → Đánh dấu đoạn văn (Highlight) → Lưu & hiển thị overlay trên canvas PDF
   → Đóng app / F5 → Mở lại → Khôi phục chính xác vị trí đang đọc.
   ```
2. **Boundary Guard & Scope Resistance:**
   - Định dạng: Chỉ PDF từ tệp cục bộ (Local file).
   - Single-user personal app: Không login, không auth guards, không cloud sync.
   - Highlights đơn giản: Một màu dịu nhẹ (`#FACC15`), lưu vị trí text selection.

### 1.2 Bảng chuyển đổi Mock $\rightarrow$ Real API
| Thành phần | Hiện trạng (Mock) | Trạng thái sau tích hợp (Real API) |
|---|---|---|
| **Library List** | Đọc từ biến `MOCK_BOOKS` | Gọi `booksService.getBooks({ category, q })` |
| **Import PDF** | Mock thêm object vào state | Gửi FormData `POST /api/books/import`, xử lý upload progress |
| **Xóa sách** | Không hỗ trợ | Gọi `DELETE /api/books/:id` (xóa DB + xóa file) |
| **Reader View** | Render văn bản giả lập (`SAMPLE_READING_CONTENT`) | Render canvas PDF thực tế qua `PdfViewer` (`pdfjs-dist`) stream từ `/api/documents/:id/file` |
| **Tiến độ đọc** | State local không lưu | `useReadingProgress` gọi `GET/PUT /api/documents/:id/progress` |
| **Highlights** | Mock data tab | `useHighlights` gọi `GET/POST/DELETE /api/documents/:id/highlights` |

---

## 2. Data Flow (Luồng dữ liệu Frontend $\leftrightarrow$ Backend)

```text
1. Library Loading & Filter Flow:
   User mở App hoặc đổi Tab bộ lọc ('all' | 'reading' | 'finished' | 'saved') hoặc gõ Search
     │
     ├── LibraryPage kích hoạt useBooks(category, searchQuery)
     ├── Gọi booksService.getBooks({ category, q })
     ├── Hiển thị Loading Skeleton hoặc Grid danh sách sách thật
     └── Trường hợp chưa có sách: Hiển thị Empty State với Dropzone trực quan

2. Book Import Flow:
   User kéo thả file PDF vào DropZone hoặc chọn file qua ImportModal
     │
     ├── Gọi booksService.importBook(file, title, author)
     ├── Hiển thị trạng thái Uploading...
     ├── Backend trả về BookSummaryDto kèm primaryDocumentId
     └── Tự động reload danh sách và mở ngay sách vừa nạp (1-click read)

3. Reader Open & Resume Flow:
   User bấm vào BookCard hoặc "Đọc tiếp"
     │
     ├── App chuyển sang ReaderPage(bookId)
     ├── Gọi song song:
     │     * booksService.getBookById(bookId) -> lấy primaryDocumentId & metadata
     │     * useReadingProgress(documentId) -> GET /api/documents/:id/progress
     │     * useHighlights(documentId) -> GET /api/documents/:id/highlights
     ├── PdfViewer tải PDF stream từ GET /api/documents/:id/file
     └── Tự động cuộn/nhảy tới trang currentPage đã lưu trong DB

4. Page Flip & Auto-Save Flow:
   User lật trang bằng phím mũi tên (←/→), Space, PageUp/Down hoặc thanh điều hướng
     │
     ├── useReadingProgress bắt sự kiện chuyển trang
     ├── Cập nhật UI tức thời (Optimistic UI)
     ├── Debounce 800ms
     └── Gọi PUT /api/documents/:id/progress { location: { type: 'pdf_page', value: { pageNumber, totalPages } } }

5. Highlight Creation Flow:
   User bôi đen text trên canvas PDF -> Popover "Đánh dấu" xuất hiện
     │
     ├── Bấm "Đánh dấu"
     ├── Gọi highlightsService.createHighlight(documentId, location, textContent)
     └── HighlightOverlay vẽ lớp màu dịu nhẹ lên trang PDF
```

---

## 3. Affected Files & Modules

```text
frontend/src/
├── types/
│   └── index.ts                                   # [MODIFY] Mở rộng Book type khớp với DTO backend
├── services/
│   ├── books.service.ts                           # [MODIFY] Hỗ trợ getBooks(params), deleteBook(id)
│   ├── documents.service.ts                       # [VERIFY] getDocumentFileUrl, getDocumentById
│   ├── progress.service.ts                        # [VERIFY] getProgress, saveProgress
│   └── highlights.service.ts                      # [VERIFY] getHighlights, createHighlight, deleteHighlight
├── modules/
│   ├── library/
│   │   ├── components/
│   │   │   ├── BookCard.tsx                       # [MODIFY] Nhận type Book thật, hỗ trợ nút xóa và trạng thái
│   │   │   ├── DropZoneCard.tsx                   # [MODIFY] Xử lý upload file thật
│   │   └── pages/
│   │       └── LibraryPage.tsx                    # [MODIFY] Nạp dữ liệu từ booksService, loading & empty states
│   └── reader/
│       ├── components/
│       │   ├── PdfViewer.tsx                      # [MODIFY] Tối ưu stream, fit-to-width, highlight overlay
│       │   └── ReaderChrome.tsx                   # [MODIFY] Kết nối metadata sách thật, navigation & zoom
│       └── pages/
│           └── ReaderPage.tsx                     # [MODIFY] Tích hợp PdfViewer, useReadingProgress, useHighlights
```

---

## 4. Backend API Contract Integration

Tất cả các lời gọi API từ Frontend tuân thủ chính xác contract của Backend:
- `GET /api/books?category=...&q=...` $\rightarrow$ `{ data: BookSummaryDto[] }`
- `POST /api/books/import` (FormData) $\rightarrow$ `{ data: BookSummaryDto }`
- `GET /api/books/:id` $\rightarrow$ `{ data: BookDetailDto }`
- `DELETE /api/books/:id` $\rightarrow$ `{ success: true }`
- `GET /api/documents/:id/file` (Range Streaming) $\rightarrow$ Binary `application/pdf`
- `GET /api/documents/:id/progress` $\rightarrow$ `{ data: ReadingProgressResponseDto }`
- `PUT /api/documents/:id/progress` $\rightarrow$ `{ data: ReadingProgressResponseDto }`
- `GET /api/documents/:id/highlights` $\rightarrow$ `{ data: HighlightResponseDto[] }`
- `POST /api/documents/:id/highlights` $\rightarrow$ `{ data: HighlightResponseDto }`
- `DELETE /api/documents/:id/highlights/:highlightId` $\rightarrow$ HTTP 204

---

## 5. UI/UX Changes & Laptop Ergonomics

- **Library Page:**
  - Hiển thị Skeleton loader khi đang fetch API.
  - Khi thư viện trống: Hiển thị Empty State với thông điệp nhẹ nhàng và DropZone trung tâm.
  - Mỗi BookCard hiển thị chính xác % tiến độ, số trang hiện tại/tổng số trang từ backend.
  - Hỗ trợ xóa sách an toàn.
- **Reader Page:**
  - Loại bỏ hoàn toàn text giả lập; hiển thị trang PDF thật sắc nét trên canvas với tỷ lệ chuẩn.
  - Mặc định mở ở chế độ **Fit-to-Width** giúp vừa vặn màn hình laptop.
  - Phím tắt bàn phím hoạt động mượt mà: `←` / `→` / `Space` / `PageUp` / `PageDown` để lật trang, `W` để fit-width.
  - Tự động ẩn thanh công cụ khi đang đọc tĩnh để tối đa hóa không gian tập trung.
  - Bộ 3 chủ đề đọc: Sáng (Light), Ngà ấm (Ivory / Sepia), Tối (Dark).

---

## 6. Edge Cases & Xử lý ngoại lệ

1. **File PDF lớn (>50MB):** `PdfViewer` kết hợp với endpoint Partial Content Range của backend chỉ tải byte range của các trang cần render, không làm tràn RAM trình duyệt.
2. **Đột ngột tắt trình duyệt / Reload tab:** `useReadingProgress` hook bắt sự kiện `beforeunload` để lưu ngay số trang hiện tại.
3. **Mất kết nối mạng cục bộ / Server tắt:** Hiển thị toast thông báo nhẹ nhàng, không làm gián đoạn việc đọc trang hiện tại.
4. **Sách không có ảnh bìa:** Tự động tạo ảnh bìa typographic thanh lịch với màu nền nhã nhặn và tiêu đề sách.

---

## 7. Risks & Assumptions

- **Assumption:** Backend đang chạy tại `http://localhost:3000` (được proxy qua Vite hoặc gọi trực tiếp qua Axios với CORS).
- **Risk (`pdfjs-dist` Worker):** Khởi tạo worker của PDF.js có thể gặp vấn đề CSP hoặc bundler.
  - *Mitigation:* Cấu hình worker qua ESM import `pdfjs-dist/build/pdf.worker.min.mjs` hoặc fallback CDN tương thích.

---

## 8. Testing & Verification Strategy

### 8.1 TypeScript & Build Verification
- Chạy `npm run lint` / `npx tsc --noEmit` trong thư mục `frontend/` để đảm bảo strict TypeScript (No `any`).
- Chạy `npm run build` kiểm tra bundle hoàn chỉnh.

### 8.2 End-to-End Core Loop Manual Verification
1. Mở `http://localhost:5173/` $\rightarrow$ Thư viện nạp danh sách từ SQLite.
2. Kéo thả file PDF vào DropZone $\rightarrow$ Upload thành công $\rightarrow$ Sách xuất hiện trong thư viện.
3. Bấm vào sách $\rightarrow$ Mở Reader $\rightarrow$ Stream PDF trang 1 hiển thị sắc nét.
4. Bấm phím `→` để đọc tới trang 5 $\rightarrow$ Đợi 1 giây $\rightarrow$ Kiểm tra Network tab thấy request `PUT /api/documents/.../progress` thành công.
5. Bôi đen 1 đoạn văn và bấm "Đánh dấu" $\rightarrow$ Highlight màu vàng dịu xuất hiện.
6. F5 tải lại trang $\rightarrow$ Thư viện hiển thị "Đang đọc • Trang 5/N" $\rightarrow$ Bấm mở lại $\rightarrow$ Reader tự động nhảy đến đúng trang 5.

---

## 9. Architecture Impact

- **Kiến trúc:** Tuân thủ 100% mô hình Component $\rightarrow$ Hooks $\rightarrow$ Services $\rightarrow$ API Client.
- **Không phá vỡ Scope:** Giữ ứng dụng ở mức độ cá nhân, đơn giản, không thêm các tính năng ngoài scope MVP.
