---
name: express-backend-expert
description: Guide for developing the Express REST API (Modular + Layered) for LocalRead — adhering to Code-first ORM, Document Storage boundary, Book vs Document separation, polymorphic Reading Location, path traversal security, and testable business logic.
---

# Express Backend Expert — LocalRead

Technical standards and guidelines for building the Backend of **LocalRead** using Express (Node.js/TypeScript).

---

## 1. Objectives & Architectural Principles

Aligned with [ARCHITECTURE.md](file:///d:/Data/Personal/STUDY/PROGRAMMING/CODE/CODE/LocalRead/docs/ARCHITECTURE.md) and [SCOPE.md](file:///d:/Data/Personal/STUDY/PROGRAMMING/CODE/CODE/LocalRead/docs/SCOPE.md):
- **Personal, single-user system**: No authentication mechanisms (auth/login/JWT), multi-user sessions, or RBAC in current scope.
- **Backend is Single Source of Truth**: Persistent state (books, reading progress, highlights) is authoritatively managed on the backend.
- **Security Enforced at Backend**: Focus on secure resource access (specifically preventing path traversal in Document Storage).
- **Modular + Layered Architecture**:
  ```text
  Presentation (Routes & Controllers)
       ↓
  Application / Business Logic (Services)
       ↓
  Meaningful Boundaries (Persistence & Document Storage)
       ↓
  Infrastructure (Database ORM & Local File System)
  ```
- **Simple > Clever**: Introduce boundaries only where truly meaningful. Avoid speculative layers, ports, or abstractions.

---

## 2. Standard Folder Structure (Modular + Layered)

All backend source code lives under `backend/src/`:

```text
backend/src/
├── config/                  # Configuration (defaults + environment overrides)
├── modules/                 # Responsibility-first domain modules
│   ├── books/               # Book & metadata management
│   │   ├── books.controller.ts
│   │   ├── books.service.ts
│   │   ├── books.repository.ts
│   │   └── dto/
│   ├── documents/           # Document & local file management
│   │   ├── documents.controller.ts
│   │   ├── documents.service.ts
│   │   └── dto/
│   ├── reading-progress/    # Save & restore reading progress
│   │   ├── reading-progress.controller.ts
│   │   ├── reading-progress.service.ts
│   │   └── dto/
│   └── highlights/          # Manage simple highlights
│       ├── highlights.controller.ts
│       ├── highlights.service.ts
│       └── dto/
├── storage/                 # Document Storage Boundary
│   ├── document-storage.interface.ts
│   └── local-file-storage.service.ts
├── database/                # Persistence Boundary
│   ├── client.ts            # ORM client instance
│   └── schema/              # Code-first ORM schema models
├── common/
│   ├── errors/              # Custom AppErrors & Centralized Error Handler
│   ├── logger/              # Structured centralized logger
│   └── middlewares/         # Validation, logging, security middlewares
├── swagger/                 # OpenAPI/Swagger configuration
├── app.ts                   # Express app setup
└── server.ts                # Bootstrap entry point
```

---

## 3. Mandatory Domain Concepts (Architectural, Not Just Schema)

### 3.1 Book vs Document Separation
- **Book**: Single source for a creative work's metadata (title, author, description, cover image, timestamps).
- **Document**: A specific file tied to a format (`format: 'PDF'`) belonging to a Book.
- **Relationship**: 1 Book can have multiple Documents. Even if MVP typically has 1 Document per Book, the domain model **must never hardcode Book = Document**.

### 3.2 Reading Location (Polymorphic `{ type, value }`)
- **Never store a format-bound primitive** (like raw `page: 42`).
- Must store as a type-declared structure:
  ```typescript
  export interface ReadingLocation<T = unknown> {
    type: string;  // In MVP: 'pdf_page'
    value: T;      // In MVP: { pageNumber: number } or number
  }
  ```
- **Rationale**: When adding new formats (e.g. EPUB with CFI), database schemas and API contracts do not break or require complex data migrations.

### 3.3 Simple Highlights (MVP)
- Simple text selection highlight in 1 single color, with no attached notes or complex comment trees.

---

## 4. Document Storage Boundary & Security Rules

Document Storage is an **independent architectural boundary** from the Database:
- **Separation**: Do not store binary files in the database. Files reside in Local Storage; the Database only stores metadata and secure relative references.
- **Path Traversal Prevention (Strictly Enforced)**:
  ```typescript
  import path from 'node:path';

  export function resolveSafePath(baseDir: string, relativeOrUserInputPath: string): string {
    const safePath = path.resolve(baseDir, relativeOrUserInputPath);
    if (!safePath.startsWith(path.resolve(baseDir))) {
      throw new SecurityError('Access denied: Path traversal detected');
    }
    return safePath;
  }
  ```
- **Format Verification**:
  - Verify MIME type: `application/pdf`.
  - Check magic bytes: PDF files must start with `%PDF-`.
  - Never expose physical absolute filesystem paths to the frontend.

---

## 5. Persistence & Data Architecture

- **Code-first / Model-driven**: ORM schemas/models (Prisma, Drizzle, etc.) are the primary source for the persistence model.
- **Decoupled DTOs & Entities**:
  - Request/Response DTOs are defined separately in each module with validation (e.g. Zod).
  - Internal ORM fields (e.g. absolute file paths) must never leak into API responses.
- **Transactions & Atomicity**:
  - When importing a Book along with its Document, metadata and document records must be committed within a transaction to avoid orphan state.

---

## 6. API, Error Handling & Logging

### 6.1 RESTful API Endpoints
- Standard REST conventions:
  - `GET /api/books`: List books with latest reading progress.
  - `POST /api/books/import`: Import local PDF file.
  - `GET /api/books/:id`: Book details and associated documents.
  - `GET /api/documents/:id/file`: Stream PDF content for the reader.
  - `GET /api/documents/:id/progress`: Get reading progress.
  - `PUT /api/documents/:id/progress`: Update progress (`{ location: { type, value } }`).
  - `GET /api/documents/:id/highlights`: Get highlights.
  - `POST /api/documents/:id/highlights`: Add new highlight.
- Expose **OpenAPI/Swagger** documentation for interactive development and reference.

### 6.2 Error Handling
- Differentiate between Client Errors (4xx) and System Errors (5xx).
- Standard JSON error format:
  ```json
  {
    "statusCode": 400,
    "error": "BAD_REQUEST",
    "message": "User-friendly error explanation",
    "details": null,
    "timestamp": "2026-09-12T00:00:00.000Z"
  }
  ```

### 6.3 Structured Logging
- Use structured JSON logging containing `timestamp`, `level`, `context`, and `requestId`.

---

## 7. Testability & Development Flow

### 7.1 Testability Rule (Mandatory per ARCHITECTURE.md)
- **Business logic must not reside directly in route controllers.**
- Controllers solely handle: parsing request, validating DTOs, delegating to Services, returning HTTP response.
- Services execute business logic and must be unit-testable without launching Express or a live DB.

### 7.2 Backend Pre-delivery Checklist
```
□ Verify NO extraneous auth/login/RBAC was added
□ Model strictly separates Book and Document
□ Reading Location is polymorphic { type, value }, not primitive int
□ Document Storage prevents path traversal
□ DTOs decoupled from ORM models
□ Centralized error middleware handling
□ No hardcoded storage paths or ports (use config + env)
□ Core service logic covered by unit tests
```
