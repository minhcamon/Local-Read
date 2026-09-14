# Implementation Plan — Version v1-mvp (Revised)

> **Active Version:** `v1-mvp`  
> **Status:** Approved (Revision 2 — database approach corrected)  
> **Governed by:** `docs/AGENT.md`, `docs/ACTIVE-VERSION.md`, `docs/SCOPE.md`, `docs/ARCHITECTURE.md`, `docs/version/v1-mvp/FEATURES.md`

---

## 1. Goal & Scope

### 1.1 Goal
Fulfill the Completion Boundary defined in `SCOPE.md §7` and `docs/version/v1-mvp/FEATURES.md`:
> *"Launch app → view library → import PDF → open book → read comfortably → page navigation / zoom / fit-to-width → highlight when desired → close app → relaunch → see currently read book → resume at exact page."*

### 1.2 Scope Checklist (v1-mvp)
- **F1.1–F1.3**: Document Storage & Local PDF Import (drag-and-drop, path traversal guard, magic bytes check, PDF metadata extraction).
- **F2.1–F2.3**: Library Management (3:4 book cards, status badges `Unread` / `Reading` / `Completed`, 1-click "Continue Reading" quick resume, empty state).
- **F3.1–F3.6**: PDF Reader Experience (`pdfjs-dist` crisp canvas rendering, Fit-to-Width default, Continuous Scroll vs Single Page toggle, laptop keyboard ergonomics, distraction-free auto-hiding toolbar, Light / Sepia / Dark themes — *đã đối chiếu có trong `FEATURES.md` F3.6*).
- **F4.1–F4.3**: Reading Progress Persistence (polymorphic `{ type: 'pdf_page', value: { pageNumber, totalPages } }`, 600ms–1000ms debounced auto-save, atomic upsert, reliable resume).
- **F5.1–F5.2**: Simple Highlights (single-color soft yellow highlight on text selection, coordinates & text persistence, overlay rendering).

**Quality requirements (không phải feature, tách riêng khỏi F1–F5):**
- Automated unit tests cho backend services và storage security (bắt buộc theo `SCOPE.md §7` + `ARCHITECTURE.md §9`).

### 1.3 Radical Scope Guard (Strict Exclusions)
- **NO** EPUB format support (recorded as Planned in `docs/backlog.md` ENH-001).
- **NO** Google Drive or cloud sync (recorded as Planned in `docs/backlog.md` ENH-002).
- **NO** Accounts, authentication (JWT/OAuth), passwords, or multi-user permissions.
- **NO** Notes/comments attached to highlights or multiple colors (recorded as Backlog in ENH-005).
- **NO** AI assistance, OCR, audiobooks/TTS, or social features.

---

## 2. Data Flow (cập nhật persistence layer)

```text
1. Import Flow:
User drops PDF → Frontend FormData POST /api/books/import
  → Multer buffer in memory
  → LocalFileStorageService.saveFile:
      - Validates size limit & %PDF- magic bytes
      - Enforces path traversal checks
      - Writes file to backend/storage/documents/{timestamp}_{sanitizedName}.pdf
  → BooksService.importBook:
      - Extracts basic PDF metadata (page count / title)
      - Creates Book record (metadata) & Document record (format: 'PDF', filePath)
        via Prisma Client, in a single transaction
  → Returns BookSummaryDto to frontend → Library updates immediately.

2. Reading & Resume Flow:
User clicks "Continue Reading" or Book Card
  → React Router: /read/:bookId?doc=:docId
  → Parallel fetch:
      - GET /api/books/:id
      - GET /api/documents/:docId/progress
      - GET /api/documents/:docId/highlights
      - GET /api/documents/:docId/file (binary PDF stream with Range support)
  → PdfViewer renders with pdfjs-dist, resumes at saved pageNumber
  → useReadingProgress debounces 800ms → PUT /api/documents/:docId/progress
      → ReadingProgressService.upsert via Prisma (atomic upsert, no manual file I/O)
  → beforeunload flushes pending progress via keepalive fetch.

3. Highlight Flow:
User selects text → "Highlight" → POST /api/documents/:docId/highlights
  → HighlightsService creates record via Prisma
  → HighlightOverlay renders overlay.
```

---

## 3. Affected Files & Modules (cập nhật)

### Backend
- `backend/src/database/schema/index.ts` — **Code-First Schema.** Định nghĩa bảng `books`, `documents`, `readingProgress`, `highlights` hoàn toàn bằng mã TypeScript qua Drizzle ORM. `readingProgress.location` lưu dạng JSON column (`{ type, value }`) để giữ đúng tính trừu tượng đã chốt ở `ARCHITECTURE.md §4`, không tách cứng thành cột `pageNumber`.
- `backend/src/database/client.ts` — Drizzle ORM client singleton kết nối `better-sqlite3` file `storage/localread.db` (chế độ WAL, tự khởi tạo bảng).
- `backend/src/modules/books/books.repository.ts` & `books.service.ts` — Dùng Drizzle transaction cho việc tạo Book + Document đồng thời.
- `backend/src/modules/documents/documents.controller.ts` — Không đổi (streaming logic độc lập với DB layer).
- `backend/src/modules/reading-progress/reading-progress.service.ts` — Dùng Drizzle `onConflictDoUpdate` atomic upsert, validate/clamp page range trước khi ghi.
- `backend/src/modules/highlights/` — CRUD qua Drizzle ORM queries thay vì thao tác trực tiếp file JSON.
- `backend/src/**/*.spec.ts` — Vitest unit tests tách bạch độc lập với DB runtime thật (đúng `ARCHITECTURE.md §9`).

### Frontend
Không đổi so với bản gốc (§3 phần Frontend giữ nguyên) — thay đổi chỉ ở tầng persistence backend.
- `frontend/package.json` — `pdfjs-dist` dependency.
- `frontend/src/index.css` — Theme tokens (Light, Sepia, Dark).
- `frontend/src/modules/reader/components/PdfViewer.tsx` — Native `pdfjs-dist` canvas + text layer viewer.
- `frontend/src/modules/reader/components/ReaderToolbar.tsx` — Auto-hide toolbar (2.5s), theme selector, shortcut hints.
- `frontend/src/modules/reader/pages/ReaderPage.tsx` — Progress hook, keyboard navigation, auto-resume.
- `frontend/src/modules/highlights/components/HighlightOverlay.tsx` & `TextSelectionMenu.tsx` — Selection popover & overlays.
- `frontend/src/modules/library/components/BookCard.tsx` & `LibraryPage.tsx` — "Continue Reading", progress bar, status badges, empty state.

---

## 4. Backend API Changes

Không đổi — contract API giữ nguyên như bản gốc theo `ARCHITECTURE.md §6` và `express-backend-expert`:

| Method | Path | Description | Payload / Params |
|---|---|---|---|
| `GET` | `/api/books` | List books with latest reading progress | None |
| `POST` | `/api/books/import` | Upload local PDF file | Multipart `file`, `title?`, `author?` |
| `GET` | `/api/books/:id` | Get book metadata and documents | `id: string` |
| `GET` | `/api/documents/:id/file` | Stream PDF file binary | `id: string` (Supports `Range` header) |
| `GET` | `/api/documents/:id/progress` | Get latest reading progress | `id: string` |
| `PUT` | `/api/documents/:id/progress` | Update reading progress | `{ location: { type: 'pdf_page', value: { pageNumber, totalPages } }, percentage: number }` |
| `GET` | `/api/documents/:id/highlights` | Get document highlights | `id: string` |
| `POST` | `/api/documents/:id/highlights` | Create highlight | `{ location: { type: 'pdf_page', value: object }, color: string, textContent: string }` |
| `DELETE` | `/api/documents/:id/highlights/:highlightId` | Delete a highlight | `id: string`, `highlightId: string` |

---

## 5. UI/UX Changes

Không đổi:
- **5.1 Reader Screen**: Crisp canvas rendering với DPR scaling, Fit-to-Width mode, Reading Themes (Light/Sepia/Dark theo `FEATURES.md` F3.6), Distraction-Free Toolbar auto-hide sau 2.5s, Laptop keyboard ergonomics (`ArrowRight`/`Left`, `Space`, `PageDown`/`Up`, `W`).
- **5.2 Library Screen**: Bookshelf Grid (3:4 ratio), status badges (`Unread`, `Reading`, `Completed`), "Continue Reading" button nổi bật, drag-and-drop import zone.

---

## 6. Edge Cases & Handling (bổ sung)

1. **Path Traversal Attacks**: `resolveSafePath` asserts `startsWith(baseDir)` và ném `403 SecurityError`.
2. **Corrupted or Fake PDF Files**: Uploads thiếu header `%PDF-` bị từ chối ngay với `400 BadRequestError`.
3. **Large PDFs (>500 pages)**: Render visible pages + 1 buffer page ahead/behind, unmount off-screen canvas.
4. **Sudden App/Tab Close**: `beforeunload` listener flush pending progress qua `fetch(..., { keepalive: true })`.
5. **Server Restart**: SQLite file-backed DB (`backend/storage/localread.db`) bảo đảm dữ liệu toàn vẹn sau restart.
6. **Missing PDF Title Metadata**: Fallback về sanitized filename (bỏ đuôi `.pdf`).
7. **Concurrent write vào cùng một Document**: Prisma upsert theo `documentId` là atomic ở tầng DB SQLite, loại bỏ race condition của file JSON.

---

## 7. Risks & Assumptions (bổ sung)

- **Assumption**: Single-user laptop environment; SQLite (file-based) là đủ — không cần DB server chạy nền, giữ đúng nguyên tắc "deploy đơn giản 1 máy" ở `ARCHITECTURE.md §8`.
- **Risk: Vite Worker Bundling**: `pdfjs-dist` yêu cầu worker script.  
  *Mitigation*: Cấu hình worker tường minh qua `pdfjsLib.GlobalWorkerOptions.workerSrc`.
- **Risk: Prisma + SQLite trên các OS khác nhau**: Cần kiểm tra binary engine của Prisma tương thích Windows/macOS/Linux nếu app được chạy trên nhiều máy khác nhau của cùng người dùng.
- **Risk: Migration khi thêm format mới (EPUB)**: Vì `location` lưu JSON trừu tượng `{ type, value }` ngay từ đầu, sau này thêm `type: 'epub-cfi'` không cần schema migration cho bảng `ReadingProgress`.

---

## 8. Testing Strategy

### 8.1 Automated Unit Tests (Vitest)
1. `LocalFileStorageService`: path traversal, magic bytes, file deletion.
2. `BooksService`: import, Book/Document separation, transaction rollback nếu tạo Document thất bại.
3. `ReadingProgressService`: upsert, polymorphic `{ type, value }`, page clamping — chạy trên SQLite test DB riêng (`file:test.db` hoặc in-memory), không đụng `dev.db`.
4. `HighlightsService`: create/fetch/delete qua Prisma.

### 8.2 End-to-End Verification Scenario
10 bước kịch bản kiểm thử thực tế giữ nguyên (từ import PDF → library → đọc fit-to-width → phím tắt → highlight → đổi theme → tắt server mở lại → kiểm tra resume đúng trang).

---

## 9. Architecture Impact

**CÓ ảnh hưởng kiến trúc — đã được phân tích, đối chiếu và giải quyết trước khi approve:**

- Persistence chuyển từ giả định "flat JSON file" (sai lệch so với `ARCHITECTURE.md §4`) sang **SQLite + Prisma**, đúng nguyên tắc Code-first/Model-driven ORM đã chốt trong kiến trúc.
- Không vi phạm `ARCHITECTURE.md §8` (deploy đơn giản 1 máy) — SQLite là file-based embedded engine, không cần daemon hay container chạy nền.
- Reading Location vẫn giữ đúng dạng trừu tượng `{ type, value }` đã chốt, chỉ đổi nơi lưu trữ (JSON column trong SQLite thay vì JSON file phẳng).
- Không thêm hạ tầng mới nào (Docker, Postgres, Mongo) — tuân thủ triệt để nguyên tắc "không trả giá cho nhu cầu tương lai chưa xảy ra".
