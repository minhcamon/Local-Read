# Implementation Plan — Backend MVP Alignment & Hardening

> **Active Version:** `v1-mvp`  
> **Governed by:** [AGENT.md](../../../AGENT.md), [ACTIVE-VERSION.md](../../../ACTIVE-VERSION.md), [SCOPE.md](../../../SCOPE.md), [ARCHITECTURE.md](../../../ARCHITECTURE.md), [api-mvp-alignment-plan.md](./api-mvp-alignment-plan.md)  
> **Activated Skills:** `/orchestrate`, `/express-backend-expert`  
> **Task Classification:** `NEW_FEATURE` & `MODIFY` (Backend MVP Vertical Alignment)

---

## 1. Goal & Scope

### 1.1 Mục tiêu
Hiện thực hóa và hoàn thiện 100% tầng Backend Express REST API cho LocalRead phục vụ phiên bản `v1-mvp`, đảm bảo:
1. **Core Loop Vertical Completeness:** Đáp ứng trọn vẹn luồng cốt lõi: Nạp PDF từ máy $\rightarrow$ Lưu trữ & quản lý Thư viện $\rightarrow$ Mở tài liệu & Stream Range $\rightarrow$ Lưu tiến độ đọc chính xác $\rightarrow$ Khôi phục trang đọc dở $\rightarrow$ Quản lý Highlight đơn giản.
2. **Boundary Guard & Security:** Khóa chặt phạm vi (chỉ PDF, local storage, single-user, không auth/login/RBAC). Ngăn chặn triệt để lỗ hổng Path Traversal trong Document Storage.
3. **Decoupled Architecture:** Tách bạch tuyệt đối giữa `Book` (Metadata tác phẩm) và `Document` (Tệp PDF định dạng cụ thể). Cấu trúc vị trí đọc `ReadingLocation` đa hình `{ type: 'pdf_page', value: { pageNumber, totalPages } }`.

### 1.2 Boundary Guard Compliance Checklist
- [x] **Format:** PDF only (EPUB nằm trong Planned theo `SCOPE.md` §3).
- [x] **Source:** Local file storage only (Không cloud sync hay Google Drive).
- [x] **Audience:** Single-user personal app (Không Auth, Session hay RBAC).
- [x] **Highlights:** Màu đơn sắc (`#FACC15`), lưu vị trí text selection, không hỗ trợ annotation trees phức tạp.
- [x] **Document Storage Security:** BaseDir isolation, kiểm tra magic bytes `%PDF-`, không để lộ đường dẫn tuyệt đối cho client.

---

## 2. Data Flow (Luồng dữ liệu Backend)

```text
1. PDF Import Flow:
   Client POST /api/books/import (multipart/form-data)
     │
     ├── Multer: Tiếp nhận buffer file vào bộ nhớ
     ├── LocalFileStorageService:
     │     * Kiểm tra dung lượng (max 100MB)
     │     * Kiểm tra Magic Bytes (%PDF-)
     │     * Sinh tên file an toàn: {timestamp}_{sanitizedName}.pdf
     │     * Ghi vào storage/documents/
     ├── BooksService + BooksRepository:
     │     * Mở atomic transaction SQLite (Drizzle ORM)
     │     * Tạo bản ghi Book + Document (format: 'PDF', filePath, size)
     └── Trả về HTTP 201 Created kèm BookSummaryDto

2. Document Streaming Flow (PDF Range Request):
   Client GET /api/documents/:id/file (Header Range: bytes=start-end)
     │
     ├── DocumentsService: Lấy Document theo ID từ DB
     ├── LocalFileStorageService: resolveSafePath(filePath) kiểm tra Path Traversal
     └── DocumentsController:
           * Nếu có Range: Trả về HTTP 206 Partial Content + Content-Range + Content-Length
           * Nếu không có Range: Trả về HTTP 200 OK + toàn bộ file stream

3. Reading Progress Save & Resume Flow:
   Save: Client PUT /api/documents/:id/progress { location: { type, value }, percentage }
     ├── ReadingProgressService:
     │     * Kiểm tra Document tồn tại
     │     * Validate & clamp pageNumber (1 <= page <= totalPages)
     │     * Atomic Upsert (onConflictDoUpdate) vào bảng reading_progress
     │     * Cập nhật updatedAt của Book
     └── Trả về HTTP 200 OK

   Resume: Client GET /api/documents/:id/progress
     └── Trả về ReadingProgressResponseDto với vị trí đọc { type: 'pdf_page', value: { pageNumber, totalPages } }

4. Highlights Flow:
   Client POST /api/documents/:id/highlights
     ├── HighlightsService: Tạo highlight với location, color, textContent
     └── Trả về HTTP 201 Created
```

---

## 3. Affected Files & Modules

```text
backend/
├── src/
│   ├── config/
│   │   └── index.ts                               # Storage paths, port, limits
│   ├── common/
│   │   ├── errors/AppError.ts                     # Custom errors (SecurityError, NotFoundError, BadRequestError)
│   │   └── middlewares/errorHandler.ts            # Centralized error handler
│   ├── database/
│   │   ├── client.ts                              # Drizzle SQLite client instance
│   │   └── schema/index.ts                        # Code-first ORM models (Book, Document, ReadingProgress, Highlight)
│   ├── storage/
│   │   ├── document-storage.interface.ts          # Storage boundary interface
│   │   ├── local-file-storage.service.ts          # [MODIFY] Fix resolveSafePath logic & security check
│   │   └── local-file-storage.service.spec.ts     # [MODIFY] Unit tests for storage & path traversal
│   ├── modules/
│   │   ├── books/
│   │   │   ├── dto/index.ts                       # BookSummaryDto, BookDetailDto, ImportBookDto, QueryDto
│   │   │   ├── books.repository.ts                # Drizzle repo with transactions & cascade logic
│   │   │   ├── books.service.ts                   # Core business logic (categories, search, import, delete)
│   │   │   ├── books.controller.ts                # Route handling (/api/books)
│   │   │   └── books.service.spec.ts              # Unit tests for BooksService
│   │   ├── documents/
│   │   │   ├── dto/index.ts                       # Document DTOs
│   │   │   ├── documents.service.ts               # Document retrieval
│   │   │   └── documents.controller.ts            # Streaming HTTP 206 / 200 handler
│   │   ├── reading-progress/
│   │   │   ├── dto/index.ts                       # SaveProgressDto, ReadingProgressResponseDto
│   │   │   ├── reading-progress.service.ts        # Atomic upsert & page validation
│   │   │   ├── reading-progress.controller.ts     # Routes (/api/documents/:id/progress)
│   │   │   └── reading-progress.service.spec.ts   # Unit tests for Progress
│   │   └── highlights/
│   │       ├── dto/index.ts                       # CreateHighlightDto, HighlightResponseDto
│   │       ├── highlights.service.ts              # Create, list, delete highlights
│   │       ├── highlights.controller.ts           # Routes (/api/documents/:id/highlights)
│   │       └── highlights.service.spec.ts         # Unit tests for Highlights
│   ├── swagger/
│   │   └── swagger.json                           # OpenAPI specification for all endpoints
│   ├── app.ts                                     # Express middleware & router registration
│   └── server.ts                                  # Server bootstrap
```

---

## 4. Backend API Contract Specifications

### 4.1 Books API (`/api/books`)
| Method | Endpoint | Description | Request Body / Query | Response Code & Body |
|---|---|---|---|---|
| `GET` | `/api/books` | Danh sách sách trong thư viện | `?category=all\|reading\|finished\|saved&q=keyword` | `200 OK`: `{ data: BookSummaryDto[] }` |
| `GET` | `/api/books/:id` | Chi tiết sách và danh sách documents | Không | `200 OK`: `{ data: BookDetailDto }` |
| `POST` | `/api/books/import` | Nạp file PDF vào hệ thống | `multipart/form-data`: `file`, `title?`, `author?`, `description?` | `201 Created`: `{ data: BookSummaryDto }` |
| `DELETE` | `/api/books/:id` | Xóa sách và file vật lý | Không | `200 OK`: `{ success: true, message: string }` |

### 4.2 Documents & Streaming API (`/api/documents`)
| Method | Endpoint | Description | Request Headers | Response |
|---|---|---|---|---|
| `GET` | `/api/documents/:id` | Lấy metadata document | Không | `200 OK`: `{ data: DocumentDto }` |
| `GET` | `/api/documents/:id/file` | Stream tệp PDF (hỗ trợ partial content) | `Range: bytes=start-end` (optional) | `200 OK` hoặc `206 Partial Content` (MIME: `application/pdf`) |

### 4.3 Reading Progress API (`/api/documents/:id/progress`)
| Method | Endpoint | Description | Request Body | Response Code & Body |
|---|---|---|---|---|
| `GET` | `/api/documents/:id/progress` | Lấy tiến độ đọc gần nhất | Không | `200 OK`: `{ data: ReadingProgressResponseDto \| null }` |
| `PUT` | `/api/documents/:id/progress` | Lưu/cập nhật tiến độ đọc | `{ location: { type: 'pdf_page', value: { pageNumber, totalPages } }, percentage? }` | `200 OK`: `{ data: ReadingProgressResponseDto }` |

### 4.4 Highlights API (`/api/documents/:id/highlights`)
| Method | Endpoint | Description | Request Body | Response Code & Body |
|---|---|---|---|---|
| `GET` | `/api/documents/:id/highlights` | Lấy tất cả highlight của doc | Không | `200 OK`: `{ data: HighlightResponseDto[] }` |
| `POST` | `/api/documents/:id/highlights` | Tạo mới highlight | `{ location: { type: 'pdf_page', value: any }, textContent: string, color?: string, note?: string }` | `201 Created`: `{ data: HighlightResponseDto }` |
| `DELETE` | `/api/documents/:id/highlights/:highlightId` | Xóa highlight | Không | `200 OK`: `{ success: true }` |

---

## 5. UI/UX Changes (Từ góc nhìn API & Contract)

- Cung cấp trường `category`, `currentPage`, `totalPages`, `progressPercent`, `estimatedReadTimeMinutes` tính toán sẵn từ backend giúp UI `LibraryPage` hiển thị mượt mà không cần tự parse metadata.
- Hỗ trợ đầy đủ HTTP 206 Partial Content cho `PdfViewer` trên frontend tải trang PDF theo nhu cầu (on-demand streaming), tối ưu hiệu năng bộ nhớ trên laptop.

---

## 6. Edge Cases & Xử lý ngoại lệ

1. **Path Traversal Attack:**
   - Trường hợp: Tên file hoặc đường dẫn chứa `../`, `..\\`, `%2e%2e%2f` hoặc đường dẫn tuyệt đối khác ổ đĩa.
   - Xử lý: `resolveSafePath` so sánh `safePath.startsWith(baseDir)`. Ném ngay `SecurityError` (HTTP 403 / 400).
2. **File giả mạo hoặc corrupt:**
   - Trường hợp: File đổi đuôi `.pdf` nhưng nội dung thực chất là binary/executable độc hại.
   - Xử lý: Kiểm tra 5 byte đầu buffer `%PDF-`. Nếu sai, từ chối ngay với `BadRequestError`.
3. **Partial Content Range không hợp lệ:**
   - Trường hợp: Header `Range: bytes=5000-1000` hoặc `bytes=9999999-` vượt quá kích thước file.
   - Xử lý: Trả về HTTP `416 Range Not Satisfiable` kèm `Content-Range: bytes */fileSize`.
4. **Xóa sách khi file vật lý đã bị xóa thủ công ngoài OS:**
   - Xử lý: Bọc hàm xóa file vật lý trong khối `try/catch`, không làm gián đoạn transaction xóa dữ liệu trong DB.
5. **Tiến độ đọc gửi số trang vượt giới hạn:**
   - Xử lý: Tự động clamp `pageNumber` trong khoảng `[1, totalPages]`, không gây lỗi server.

---

## 7. Risks & Assumptions

- **Assumption:** Môi trường Node.js 18+ / 20+ và SQLite cục bộ (via LibSQL / Better-SQLite3).
- **Risk:** Quá trình upload file dung lượng lớn làm nghẽn RAM nếu không giới hạn.
  - *Mitigation:* Giới hạn multer 100MB cho MVP v1 và stream trực tiếp ra disk.

---

## 8. Testing Strategy

### 8.1 Automated Unit Tests (Vitest)
Chạy bộ test suite với lệnh `npm test` trong thư mục `backend/`:
1. `src/storage/local-file-storage.service.spec.ts`:
   - Kiểm tra chặn triệt để path traversal (`../../etc/passwd`, `..\\..\\secret.txt`).
   - Kiểm tra lưu file an toàn, kiểm tra magic bytes `%PDF-`.
2. `src/modules/books/books.service.spec.ts`:
   - Kiểm tra import sách trong transaction, tính toán status/category, filter query, cascade delete.
3. `src/modules/reading-progress/reading-progress.service.spec.ts`:
   - Kiểm tra atomic upsert, tính toán percentage và clamp page number.
4. `src/modules/highlights/highlights.service.spec.ts`:
   - Kiểm tra tạo mới, lấy danh sách và xóa highlight.

### 8.2 API Endpoint Integration Verification
- Kiểm tra toàn bộ endpoint qua Swagger UI tại `http://localhost:3000/api/docs`.
- Kiểm tra streaming PDF với curl/client có gửi `Range` header.

---

## 9. Architecture Impact

- **Kiến trúc:** Tuân thủ tuyệt đối mô hình **Modular + Layered** theo `ARCHITECTURE.md` và `express-backend-expert`.
- **Domain Decoupling:** Giữ vững sự phân tách `Book` (metadata) và `Document` (file PDF), `ReadingLocation` đa hình `{ type: 'pdf_page', value: { pageNumber, totalPages } }`.
- **Không phá vỡ Scope:** Không đưa auth, login, RBAC, hay EPUB vào mã nguồn.
