---
name: react-reader-expert
description: Guide for developing the React frontend for LocalRead — focusing on PDF Reader experience, Library management, accurate Reading Progress resume, simple Highlights, and laptop ergonomics.
---

# React Reader Expert — LocalRead

Guidelines and conventions for developing the Frontend (React 19 + TypeScript + Vite) for **LocalRead**.

---

## 1. Objectives & Principles

Aligned with [SCOPE.md](file:///d:/Data/Personal/STUDY/PROGRAMMING/CODE/CODE/LocalRead/docs/SCOPE.md) and [ARCHITECTURE.md](file:///d:/Data/Personal/STUDY/PROGRAMMING/CODE/CODE/LocalRead/docs/ARCHITECTURE.md):
- **Personal, single-user**: Strictly avoid login/register forms, auth tokens, or ProtectedRoutes/Role Guards.
- **Core Loop is paramount**:
  ```text
  Add → Library → Open → Read → Save Progress → Resume
  ```
- **Optimized for laptops**:
  - Distraction-free reading experience.
  - Keyboard navigation shortcuts (arrows, PageUp/PageDown, Space, Fit-width).
  - Smooth page turns, sharp zoom, continuous scrolling.
- **Appropriate Abstraction (ARCHITECTURE.md §5)**:
  - MVP only supports PDF: Direct coupling to the PDF rendering library (`react-pdf` / `pdfjs-dist`) is permitted. Avoid speculative generic reader interfaces.
  - Future extension point: Routing by `Document.format` when new formats (like EPUB) are approved.

---

## 2. Standard Folder Structure (`frontend/src/`)

```text
frontend/src/
├── assets/                  # Icons, fonts, static assets
├── components/              # Shared UI components
│   ├── common/              # Button, Modal, Dropdown, Toast, Tooltip
│   └── layout/              # AppLayout, Header, NavigationBar
├── modules/                 # Modular domain features
│   ├── library/             # Library management
│   │   ├── components/      # BookCard, BookList, BookGrid, FilterBar, ImportModal
│   │   ├── hooks/           # useBooks, useImportBook
│   │   └── pages/           # LibraryPage.tsx
│   ├── reader/              # PDF Reader
│   │   ├── components/      # PdfViewer, ReaderControls, PageNavigation, ZoomControl
│   │   ├── hooks/           # usePdfDocument, useReaderShortcuts, useZoom
│   │   └── pages/           # ReaderPage.tsx
│   ├── reading-progress/    # Progress synchronization & resume
│   │   └── hooks/           # useReadingProgress, useAutoSaveProgress
│   └── highlights/          # Simple text highlights
│       ├── components/      # HighlightOverlay, TextSelectionMenu
│       └── hooks/           # useHighlights, useTextSelection
├── services/                # Centralized API clients
│   ├── apiClient.ts         # Axios/Fetch client with baseURL, timeout, error handling
│   ├── books.service.ts
│   ├── documents.service.ts
│   └── progress.service.ts
├── types/                   # TypeScript interfaces & types
│   ├── book.ts
│   ├── document.ts
│   ├── progress.ts          # ReadingLocation { type, value }
│   └── highlight.ts
├── utils/                   # Shortcuts, formatters, debounce, storage helpers
├── App.tsx                  # Router setup (Library ↔ Reader)
└── main.tsx                 # Entry point
```

---

## 3. Core Feature Standards

### 3.1 Library Module
- **Book Display**:
  - Support Grid (cover-first) or List (detailed metadata) views.
  - Clearly display reading status: `Unread`, `Reading` (with % or current / total pages), `Completed`.
  - Prominent **"Continue Reading"** button on actively read books for instant 1-click resume.
- **Book Import**:
  - Drag-and-drop zone for PDF files directly into the window.
  - Standard file picker input button.
  - Upload progress bar and automatic transition/opening upon import completion.

### 3.2 PDF Reader Module
- **Display & Navigation**:
  - Support two modes: Single Page view or Continuous Scroll.
  - Zoom controls: Zoom In, Zoom Out, 100%, and **Fit-to-Width** (matching laptop display width).
  - Keyboard Shortcuts:
    - `→` / `Space` / `PageDown`: Next page.
    - `←` / `PageUp`: Previous page.
    - `Ctrl + +` / `Ctrl + -`: Zoom in / Zoom out.
    - `W`: Fit-to-Width.
- **Distraction-Free Mode**:
  - Floating controls fade out automatically during active reading and reappear on mouse movement or keypress.

### 3.3 Reading Progress Management (Reliable Resume)
- **Location Structure**:
  ```typescript
  export interface PdfLocationValue {
    pageNumber: number;
    totalPages?: number;
  }

  export interface ReadingLocation {
    type: 'pdf_page';
    value: PdfLocationValue;
  }

  export interface ReadingProgress {
    documentId: string;
    location: ReadingLocation;
    percentage: number;
    updatedAt: string;
  }
  ```
- **Auto-Save Mechanism**:
  - **Debounced Save**: When flipping pages, debounce for 600ms–1000ms after settling before calling the API.
  - **No Spam**: Only call the API when the page number genuinely changes.
  - **Save on Unload**: Hook `beforeunload` or component unmount to persist unsaved pending progress.
- **Resume Mechanism**:
  - When opening the Reader, fetch the latest progress and auto-scroll/jump to the exact saved page.

### 3.4 Simple Highlights (Single Color)
- On text selection in the PDF text layer:
  - Display a minimal "Highlight" action button.
  - Persist text coordinates/selector and page number.
  - Render an unobtrusive, soft yellow highlight overlay.
  - No complex comment popups or nested notes in MVP.

---

## 4. TypeScript Strictness & Code Conventions

- **Strict TypeScript: No `any`**: All API payloads, states, and props must have strict types.
- **Component Modularity**:
  - Avoid large monolithic component files (>250 lines). Decompose subcomponents into module `components/`.
  - Extract complex behaviors into custom hooks.

---

## 5. Frontend Pre-delivery Checklist
```
□ Core loop operates smoothly: Add -> Library -> Read -> Save -> Resume
□ No extraneous code for auth, login, or roles
□ Crisp PDF rendering with functional laptop keyboard shortcuts
□ Reading progress saved and restored to exact page number
□ Complete handling of Loading, Error, and Empty states
□ Strict TypeScript verification passes (npx tsc --noEmit)
```
