# FEATURES.md — Version v1-mvp

> Active feature tracker for **v1-mvp**.
> Governed by `docs/ACTIVE-VERSION.md` and `docs/SCOPE.md`.

---

## Completion Boundary (MVP Done Definition)

```text
Launch app → view library → import PDF → open book → read comfortably
→ page navigation / zoom / fit-to-width → highlight when desired
→ close app → relaunch → see currently read book → resume at exact page
```

---

## 📌 Feature Checklist

### 1. Document Storage & Import
- [ ] **F1.1: Local PDF Import**: Import PDF from local filesystem via drag-and-drop or file picker.
- [ ] **F1.2: Path Traversal Security**: Ensure document storage is strictly isolated and prevents directory traversal attacks.
- [ ] **F1.3: Document Metadata Extraction**: Extract PDF title, total page count, and generate thumbnail/cover.

### 2. Library Management
- [ ] **F2.1: Bookshelf Grid/List View**: Display books with cover, title, author, and reading status.
- [ ] **F2.2: Reading Status**: Display `Unread`, `Reading` (with % and current page), and `Completed`.
- [ ] **F2.3: "Continue Reading" Quick Resume**: 1-click action to jump straight into the last read book and page.

### 3. PDF Reader Experience
- [ ] **F3.1: Crisp PDF Rendering**: Render pages cleanly using PDF.js without blurry text.
- [ ] **F3.2: Fit-to-Width Default**: Automatically scale page width to fit standard laptop display widths.
- [ ] **F3.3: Zoom & Display Controls**: Zoom In/Out/100%, and toggle Continuous Scroll vs Single Page.
- [ ] **F3.4: Keyboard Ergonomics**: ArrowLeft/ArrowRight, Space, PageUp/PageDown for swift page flipping.
- [ ] **F3.5: Distraction-Free Chrome**: Auto-hiding floating toolbar during reading.
- [ ] **F3.6: Reading Themes**: Toggle Light, Sepia (warm parchment), and Dark modes.

### 4. Reading Progress Persistence
- [ ] **F4.1: Accurate Page Tracking**: Save progress as `{ type: 'pdf_page', value: { pageNumber, totalPages } }`.
- [ ] **F4.2: Debounced Auto-save**: Auto-save progress with 600ms–1000ms debounce to avoid spamming the API.
- [ ] **F4.3: Reliable Page Resume**: Opening a book automatically navigates to the exact saved page number.

### 5. Simple Highlights
- [ ] **F5.1: Text Selection Highlight**: Select text in PDF text layer and apply a clean, soft yellow highlight.
- [ ] **F5.2: Highlight Persistence**: Save highlight coordinates/text to backend and re-render on page load.
