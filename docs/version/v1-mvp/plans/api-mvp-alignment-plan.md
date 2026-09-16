# Implementation Plan — Hoàn thiện & Chuẩn hóa API MVP cho LocalRead

> **Active Version:** `v1-mvp`  
> **Governed by:** `docs/AGENT.md`, `docs/ACTIVE-VERSION.md`, `docs/SCOPE.md`, `docs/ARCHITECTURE.md`, `docs/version/v1-mvp/FEATURES.md`  
> **Activated Skills:** `/orchestrate`, `/express-backend-expert`, `/react-reader-expert`, `/reading-ui-expert`

---

## 1. Goal & Scope

### 1.1 Mục tiêu
Rà soát và đồng bộ toàn diện giữa **Mock Giao diện / Mock Data** hiện tại (`frontend/src/mock/mockData.ts`, `LibraryPage`, `ReaderPage`, `NotesDrawer`, `ReaderChrome`) với **Hệ thống Backend REST API (Express + SQLite + Drizzle/Prisma)**, đảm bảo:
1. **Vertical Completeness:** Kết nối thực tế từ UI đến SQLite Database không dùng mock data cho luồng cốt lõi (Core Loop).
2. **Boundary Guard & Scope Resistance:** Phân định rõ ràng tính năng thuộc MVP v1 (Sách PDF, Lưu/Khôi phục tiến độ đọc chính xác, Highlight văn bản cơ bản) và các tính năng phụ chú nâng cao (Khái niệm, Trích dẫn, Ghi chú dài) đưa vào `docs/backlog.md`.
3. **Decoupled Architecture:** Giữ vững nguyên tắc phân tách `Book` vs `Document`, `ReadingLocation` đa hình `{ type: 'pdf_page', value: { pageNumber, totalPages } }`, và Document Storage bảo mật chống path traversal.

### 1.2 Bảng đối chiếu Mock UI vs API Scope

| Thành phần UI / Mock Data | Hiện trạng Backend API | Quyết định MVP v1 | Hành động kỹ thuật |
|---|---|---|---|
| **Danh sách sách (`MOCK_BOOKS`)** | `GET /api/books` trả về `BookSummaryDto[]` | **Trong Scope MVP** | Bổ sung computed fields `category` / `status` (`unread` \| `reading` \| `completed`), `currentPage`, `totalPages`, `progressPercent`, `estimatedReadTimeMinutes`. Hỗ trợ query params `?category=` & `?q=`. |
| **Nhập sách PDF (Dropzone / Upload)** | `POST /api/books/import` (Multipart) | **Trong Scope MVP** | Hoàn thiện PDF metadata parser, kiểm tra magic bytes `%PDF-`, tạo Book + Document trong 1 transaction. |
| **Xóa sách trong Thư viện** | Chưa có | **Trong Scope MVP** | Bổ sung `DELETE /api/books/:id` (xóa cascade trong DB và xóa an toàn file vật lý trong storage). |
| **Đọc PDF & Stream File (`PdfViewer`)** | `GET /api/documents/:id/file` | **Trong Scope MVP** | Hỗ trợ HTTP 206 Partial Content (Range headers) để `pdfjs-dist` tải và stream trang PDF mượt mà. |
| **Lưu & Phục hồi tiến độ đọc** | `GET/PUT /api/documents/:id/progress` | **Trong Scope MVP** | Debounce 800ms, atomic upsert với `{ location: { type: 'pdf_page', value: { pageNumber, totalPages } }, percentage }`. |
| **Highlight văn bản (`MOCK_NOTES` Tab 1)** | `GET/POST/DELETE /api/documents/:id/highlights` | **Trong Scope MVP** | Lưu tọa độ text selection, textContent, location đa hình, tùy chọn note ngắn. |
| **Ghi chú sâu, Định nghĩa, Trích dẫn (Tabs 2 & 3 trong `NotesDrawer`)** | Chưa có API riêng | **Giữ đơn giản trong MVP / Backlog** | Trong MVP: Tab "Ghi chép" tích hợp chung với Highlight. Tab "Khái niệm" & "Trích dẫn" ghi nhận vào `docs/backlog.md` (ENH-006, ENH-007) hoặc lưu dạng local context. |
| **Cài đặt hiển thị & Giao diện (Theme, Font, View Mode)** | Client-side state (LocalStorage) | **Client State** | Không cần lưu trên backend server, giữ nguyên client state theo laptop ergonomics. |

---

## 2. Data Flow (Luồng dữ liệu tích hợp)

```text
1. Import & Library Flow:
   User kéo thả PDF vào Thư viện
     → Frontend: FormData POST /api/books/import
     → Backend Multer → LocalFileStorageService:
         * Kiểm tra %PDF- magic bytes, chống path traversal
         * Lưu file vào backend/storage/documents/{timestamp}_{safeName}.pdf
     → BooksService:
         * Tạo bản ghi Book + Document (format: 'PDF') qua atomic transaction
     → Trả về BookSummaryDto đầy đủ status, primaryDocumentId
     → LibraryPage cập nhật ngay lập tức không cần tải lại trang.

2. Reading & Stream Flow:
   User bấm vào Book Card hoặc "Đọc tiếp"
     → Chuyển route /read/:bookId?doc=:docId
     → Song song gọi:
         * GET /api/books/:id (thông tin sách)
         * GET /api/documents/:docId/progress (lấy trang đã lưu)
         * GET /api/documents/:docId/highlights (lấy các đoạn đánh dấu)
         * GET /api/documents/:docId/file (stream binary với Range header)
     → PdfViewer render crisp canvas, tự động cuộn/nhảy đến trang `currentPage` đã lưu.

3. Auto-save Progress Flow:
   User lật trang (phím mũi tên / cuộn trang)
     → useReadingProgress hook bắt sự kiện, debounce 800ms
     → PUT /api/documents/:docId/progress với payload:
         { location: { type: 'pdf_page', value: { pageNumber: 48, totalPages: 307 } }, percentage: 16 }
     → ReadingProgressService thực hiện atomic upsert
     → Khi đóng tab: beforeunload gửi fetch với `keepalive: true` để tránh mất dữ liệu.

4. Highlight Flow:
   User bôi đen đoạn văn trên PDF TextLayer → bấm "Đánh dấu"
     → POST /api/documents/:docId/highlights:
         { location: { type: 'pdf_page', value: { pageNumber, rects } }, textContent, color: '#FACC15' }
     → Trả về Highlight vừa tạo → HighlightOverlay vẽ lớp màu dịu nhẹ lên trang PDF.
```

---

## 3. Affected Files & Modules

### 3.1 Backend Modules (`backend/src/`)
- `backend/src/database/schema/index.ts` / `backend/prisma/schema.prisma`:
  - Cập nhật trường dữ liệu cho `Book`, `Document`, `ReadingProgress`, `Highlight`.
- `backend/src/modules/books/`:
  - `dto/index.ts`: Bổ sung filter DTOs, chuẩn hóa `BookSummaryDto` và `BookDetailDto` khớp với UI Thư viện.
  - `books.service.ts`: Bổ sung tính toán `category`/`status`, `estimatedReadTimeMinutes`, tìm kiếm `?q=`, lọc danh mục `?category=`, và hàm `deleteBook`.
  - `books.controller.ts`: Thêm route `DELETE /api/books/:id`, cập nhật `GET /api/books` nhận query parameters.
  - `books.repository.ts`: Triển khai truy vấn lọc và cascade delete an toàn.
- `backend/src/modules/documents/`:
  - `documents.controller.ts`: Đảm bảo header `Accept-Ranges: bytes`, `Content-Range`, `Content-Length` cho PDF streaming chuẩn xác.
- `backend/src/modules/highlights/`:
  - `dto/index.ts` & `highlights.service.ts`: Chuẩn hóa DTO tạo/xóa highlight, hỗ trợ trường `note` tùy chọn.
- `backend/src/modules/reading-progress/`:
  - `reading-progress.service.ts`: Validate và clamp page range `1 <= pageNumber <= totalPages`.

### 3.2 Frontend Integration (`frontend/src/`)
- `frontend/src/types/index.ts`: Cập nhật type `Book`, `Highlight`, `ReadingProgress` đồng bộ 100% với DTO backend.
- `frontend/src/services/`:
  - `books.service.ts`: Bổ sung API `deleteBook(id)`, hỗ trợ query filters `getBooks(params)`.
  - `documents.service.ts`, `progress.service.ts`, `highlights.service.ts`: Kết nối apiClient thực tế thay vì mock state.
- `frontend/src/modules/library/pages/LibraryPage.tsx`: Chuyển từ `MOCK_BOOKS` sang nạp dữ liệu từ `booksService.getBooks()`.
- `frontend/src/modules/reader/pages/ReaderPage.tsx`: Tích hợp `PdfViewer` thật đọc stream từ `documentsService.getFileUrl(docId)` và đồng bộ progress/highlights.

---

## 4. Chi tiết các thay đổi Backend API Contract

### 4.1 Books API (`/api/books`)

#### `GET /api/books`
- **Query Params:**
  - `category?: 'all' | 'reading' | 'finished' | 'saved'`
  - `q?: string` (tìm kiếm theo tiêu đề hoặc tác giả)
- **Response Format (`200 OK`):**
  ```json
  {
    "data": [
      {
        "id": "uuid-1",
        "title": "Klara and the Sun",
        "author": "Kazuo Ishiguro",
        "description": "Tiểu thuyết ấm áp của Kazuo Ishiguro...",
        "coverUrl": null,
        "category": "reading",
        "progressPercent": 45,
        "currentPage": 48,
        "totalPages": 307,
        "estimatedReadTimeMinutes": 35,
        "primaryDocumentId": "doc-uuid-1",
        "createdAt": "2026-09-15T10:00:00.000Z",
        "updatedAt": "2026-09-15T15:30:00.000Z"
      }
    ]
  }
  ```

#### `POST /api/books/import`
- **Content-Type:** `multipart/form-data`
- **Fields:** `file` (PDF buffer, max 100MB), `title?` (string), `author?` (string)
- **Response (`201 Created`):** Thông tin Book + Document vừa nạp.

#### `GET /api/books/:id`
- **Response (`200 OK`):** Chi tiết sách cùng danh sách các Document đính kèm.

#### `DELETE /api/books/:id`
- **Response (`200 OK`):** `{ "success": true, "message": "Book and associated documents deleted" }`

---

### 4.2 Documents API (`/api/documents`)

#### `GET /api/documents/:id/file`
- **Headers:** Hỗ trợ `Range: bytes=start-end`
- **Response:** `200 OK` (toàn bộ file) hoặc `206 Partial Content` với `Content-Type: application/pdf`.

#### `GET /api/documents/:id/progress`
- **Response (`200 OK`):**
  ```json
  {
    "data": {
      "id": "prog-uuid",
      "documentId": "doc-uuid-1",
      "location": {
        "type": "pdf_page",
        "value": { "pageNumber": 48, "totalPages": 307 }
      },
      "percentage": 45,
      "updatedAt": "2026-09-15T15:30:00.000Z"
    }
  }
  ```

#### `PUT /api/documents/:id/progress`
- **Request Body:**
  ```json
  {
    "location": {
      "type": "pdf_page",
      "value": { "pageNumber": 49, "totalPages": 307 }
    },
    "percentage": 46
  }
  ```
- **Response (`200 OK`):** Bản ghi progress mới nhất sau khi atomic upsert.

---

### 4.3 Highlights API (`/api/documents/:id/highlights`)

#### `GET /api/documents/:id/highlights`
- **Response (`200 OK`):** Danh sách highlights của tài liệu.

#### `POST /api/documents/:id/highlights`
- **Request Body:**
  ```json
  {
    "location": {
      "type": "pdf_page",
      "value": { "pageNumber": 48, "rects": [[100, 200, 300, 220]] }
    },
    "color": "#FACC15",
    "textContent": "Mặt Trời luôn có cách vươn tới chúng tôi...",
    "note": "Biểu tượng niềm tin thuần khiết"
  }
  ```
- **Response (`201 Created`):** Highlight object với ID tạo mới.

#### `DELETE /api/documents/:id/highlights/:highlightId`
- **Response (`200 OK`):** Xóa highlight thành công.

---

## 5. UI/UX Changes
- **Library Page:**
  - Hiển thị loading skeleton khi nạp danh sách sách từ API.
  - Các tab lọc "Tất cả", "Đang đọc", "Đã đọc xong", "Sách đã lưu" và ô tìm kiếm kết nối trực tiếp với backend.
  - Dropzone & Nút "+ Thêm sách" nạp file PDF thật vào hệ thống và tự động cập nhật danh sách.
  - Nút "Đọc tiếp" / Click vào sách sẽ mở thẳng đúng trang đang đọc dở.
- **Reader Page:**
  - Tích hợp `PdfViewer` render trang PDF thật từ stream API.
  - Tự động debounce lưu tiến độ đọc khi người dùng chuyển trang.
  - Sidebar "Ghi chép" đồng bộ dữ liệu highlight thực tế từ backend.

---

## 6. Edge Cases & Xử lý ngoại lệ

1. **Path Traversal Security:** Hàm `resolveSafePath` kiểm tra tuyệt đối đường dẫn tệp không vượt ra ngoài thư mục `backend/storage/documents/`.
2. **File PDF hỏng / Giả mạo đuôi file:** Kiểm tra magic bytes `%PDF-` ở 5 byte đầu tiên của buffer, từ chối ngay với mã `400 BadRequestError`.
3. **Mất kết nối đột ngột khi đóng tab:** Sử dụng `navigator.sendBeacon` hoặc `fetch` với `keepalive: true` trong sự kiện `beforeunload` để đảm bảo trang vừa đọc được ghi nhận.
4. **File PDF dung lượng lớn (>200MB):** Controller xử lý stream có Range header, chỉ tải các trang cần hiển thị thay vì load toàn bộ file vào RAM một lần.
5. **Xóa sách đang mở:** Xóa tệp vật lý an toàn và thu hồi URL blob trên frontend để tránh rò rỉ bộ nhớ (memory leak).

---

## 7. Risks & Assumptions

- **Assumption:** Ứng dụng chạy trên môi trường laptop đơn người dùng (single-user personal app), cơ sở dữ liệu SQLite cục bộ đảm bảo tốc độ phản hồi tức thời (<10ms).
- **Risk (PDF Worker CDN vs Local):** `pdfjs-dist` cần file worker. Giải pháp: Cấu hình worker cục bộ từ thư mục `node_modules` hoặc build bundle tĩnh.
- **Scope Guard Action (Boundary Guard):**
  - Các tính năng trong mock UI chưa thuộc MVP v1 như: *AI Assistant, Từ điển định nghĩa tự động, Quản lý tài khoản, EPUB* được ghi nhận vào `docs/backlog.md` và không tự ý thêm vào API v1.

---

## 8. Testing Strategy

### 8.1 Automated Unit Tests (Vitest)
- `BooksService.spec.ts`: Kiểm tra tạo Book + Document, tính toán tiến độ, lọc theo danh mục, xóa sách.
- `LocalFileStorageService.spec.ts`: Kiểm tra phát hiện path traversal, kiểm tra magic bytes, xóa file.
- `ReadingProgressService.spec.ts`: Kiểm tra atomic upsert, kiểm tra clamp page number hợp lệ.
- `HighlightsService.spec.ts`: Kiểm tra tạo, lấy danh sách và xóa highlight.

### 8.2 End-to-End Core Loop Verification
1. Mở ứng dụng → Thư viện hiển thị danh sách sách từ SQLite.
2. Kéo thả file PDF vào Dropzone → API `POST /api/books/import` thành công → Sách xuất hiện trong thư viện với badge "Chưa đọc".
3. Bấm vào sách → Chuyển sang Reader → Stream PDF trang 1 thành công.
4. Lật đến trang 15 → Kiểm tra API `PUT /api/documents/:id/progress` được gọi sau 800ms.
5. Bôi đen văn bản và tạo Highlight → Highlight hiển thị trên trang và lưu vào DB.
6. Đóng trình duyệt / tab → Mở lại ứng dụng → Thư viện cập nhật trạng thái "Đang đọc (15 / N trang)".
7. Bấm "Đọc tiếp" → Reader tự động khôi phục chính xác tại trang 15.

---

## 9. Architecture Impact
- **Kiến trúc:** Tuân thủ 100% mô hình **Modular + Layered** theo `ARCHITECTURE.md` và `express-backend-expert`.
- **Domain Decoupling:** Giữ vững sự phân tách `Book` (metadata) và `Document` (file PDF), `ReadingLocation` đa hình `{ type: 'pdf_page', value: { pageNumber, totalPages } }`.
- **Hạ tầng:** Không thêm bất kỳ dịch vụ hay daemon bên ngoài nào, giữ trọn vẹn tiêu chí "chạy cục bộ đơn giản trên một máy cá nhân".
