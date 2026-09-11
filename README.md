# LocalRead — Personal Reading System

> Turn your laptop into a convenient, simple, and comfortable personal reading environment.

**LocalRead** is a personal, single-user web application designed specifically for distraction-free PDF reading on laptops. It focuses on a clean core loop: import a local PDF, read comfortably with dedicated reading themes, auto-save reading progress reliably, and resume reading at the exact page.

---

## 📖 Core Loop

```text
Add → Library → Open → Read → Save Progress → Resume
```

---

## ✨ Features (v1-mvp)

- **Local PDF Import**: Import local PDF documents via drag-and-drop or file picker with path traversal security.
- **Library Management**: Bookshelf grid view with 3:4 book cover aspect ratio, reading status badges (`Unread`, `Reading`, `Completed`), and 1-click "Continue Reading" quick-actions.
- **Laptop-Optimized PDF Reader**:
  - Distraction-free auto-hiding toolbar.
  - Automatic **Fit-to-Width** display for optimal laptop ergonomics.
  - Zoom controls and smooth page navigation.
  - Keyboard navigation shortcuts (`→`, `←`, `Space`, `PageUp`/`PageDown`, `W`).
- **Reading Themes**:
  - **Light**: Crisp high contrast for daytime reading.
  - **Sepia**: Warm parchment tone for prolonged reading sessions with reduced eye strain.
  - **Dark**: Deep slate low-emission background for nighttime reading.
- **Reliable Reading Progress**: Debounced auto-save (800ms) that persists reading locations as polymorphic `{ type: 'pdf_page', value: { pageNumber, totalPages } }`, automatically resuming at the exact page on book open.
- **Simple Highlights**: Single-color text selection highlights on the rendered document text layer.

---

## 🏛️ System Architecture

Built as a decoupled Web Application with two runtime components:

```text
LocalRead
├── frontend/                  # React 19 + TypeScript + Vite Application
│   ├── src/modules/library/   # Bookshelf, book cards, import modal
│   ├── src/modules/reader/    # PDF viewer, auto-hiding toolbar, zoom controls
│   ├── src/modules/reading-progress/ # Progress persistence & hooks
│   └── src/index.css          # Design tokens for Light, Sepia, and Dark themes
└── backend/                   # Express (Modular + Layered) REST API
    ├── src/modules/books/     # Book metadata management
    ├── src/modules/documents/ # Document streaming & file access
    ├── src/modules/reading-progress/ # Progress API
    ├── src/modules/highlights/# Highlight API
    ├── src/storage/           # Document Storage Boundary (Path traversal protection)
    └── src/swagger/           # OpenAPI / Swagger UI (/api/docs)
```

### Architectural Principles
- **Backend is Source of Truth**: Persistent state is authoritatively held and managed by the backend.
- **Book vs. Document Decoupling**: A `Book` holds creative work metadata; a `Document` represents a concrete file tied to a format.
- **Polymorphic Reading Location**: Progress is represented as `{ type, value }` to allow future format extensibility without database migrations.
- **Secure Resource Access**: Document Storage is strictly bounded with path traversal guards (`resolveSafePath`).

---

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (v20 or higher recommended)
- npm (v10 or higher)

### Setup & Run

1. **Clone the repository:**
   ```bash
   git clone https://github.com/minhcamon/Local-Read.git
   cd Local-Read
   ```

2. **Run Backend (Express API):**
   ```bash
   cd backend
   npm install
   npm run dev
   # API running at http://localhost:3001
   # OpenAPI docs at http://localhost:3001/api/docs
   ```

3. **Run Frontend (React Dev Server):**
   ```bash
   cd ../frontend
   npm install
   npm run dev
   # App running at http://localhost:5173
   ```

---

## 📜 Documentation

Detailed architectural and decision-making documents are available in the `docs/` folder:
- [docs/ACTIVE-VERSION.md](docs/ACTIVE-VERSION.md): Current active version pointer (`v1-mvp`).
- [docs/SCOPE.md](docs/SCOPE.md): Product boundaries and MVP scope definitions.
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md): System-level architecture and domain design.
- [docs/AGENT.md](docs/AGENT.md): Decision-making principles and engineering constraints.
- [docs/backlog.md](docs/backlog.md): Tracked backlog items and future scope expansions.
- [docs/version/v1-mvp/FEATURES.md](docs/version/v1-mvp/FEATURES.md): MVP feature checklist.

---

## 📄 License

ISC License.
