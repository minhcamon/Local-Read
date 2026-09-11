# ARCHITECTURE.md — Personal Reading System

> This document describes system-level structure and architectural decisions.
> It does not describe features, roadmap, database schema, folder structure, or implementation details.
> Architecture serves approved scope (see `SCOPE.md`) — never expand speculatively because "it might be useful later."

## 1. System Architecture

The system is a **Web Application** consisting of two primary runtimes:

```text
Web Application
│
├── React Application
│
└── Express Application
      ├── REST/HTTP API
      ├── Persistence Boundary
      │     └── Database
      └── Document Storage Boundary
            └── Local File Storage
```

React and Express are two runtime components of the same Web Application, communicating via REST/HTTP.

## 2. Backend Architecture

Express adopts a **Modular + Layered** pattern:

```text
Presentation
    ↓
Application / Business Logic
    ↓
Meaningful Boundaries
    ↓
Infrastructure
```

A Module is the primary unit of responsibility. Layers are applied only where meaningful; never introduce layers or abstractions purely for pattern conformity.

Synchronous in-process communication is the default. Event-driven communication is employed only when asynchronous processing or explicit decoupling is genuinely required.

## 3. Boundaries & Dependencies

Application/Business Logic does not directly depend on infrastructure implementations where a boundary is meaningful.

Persistence employs the **Repository pattern as the default approach**, without mandating port/interface abstractions for every repository.

Database and Document Storage are **two independent architectural boundaries**.

Document Storage is encapsulated behind a strict boundary. The application core does not directly depend on filesystem or specific storage implementations.

## 4. Data Architecture

The Backend is the **source of truth** for persistent state.

The Frontend may retain UI state and cache server state for UX/performance reasons, but this cache is not a source of truth and must be invalidated/revalidated appropriately.

The Database follows a **Code-first / Model-driven approach**: ORM Entities/Models are the primary source defining the persistence model.

API DTOs are decoupled from ORM Entities to safeguard API contracts and prevent direct leakage of the persistence model. Distinct Domain Entities are not mandatory unless business complexity warrants them.

Transaction boundaries are governed by business operations; the persistence layer is responsible for executing transactions.

### Domain Concepts (Architectural Level, Not Schema)

- **Book** and **Document** are separate domain concepts.
  - **Book** is the single source for work metadata (title, author, description...).
  - **Document** is a specific file bound to a Format belonging to a Book.
  - One Book may possess multiple Documents. The MVP may practically yield 1 Document/Book (since only PDF is supported), but the model must never hard-bind Book = Document.

- **Reading Location** must not be persisted as a format-coupled primitive value (such as a raw page number). It must be represented as a type-declared structure — e.g. `{ type, value }` — allowing each Document Format to define its own interpretation of `value` without requiring schema migrations or data rewrites when introducing new formats. The MVP defines only one valid `type` (corresponding to PDF); additional `type`s are introduced when their respective Formats are approved into scope.

## 5. Document Rendering & Access

The Backend is responsible for providing document resources and enforcing access control.

The Frontend is responsible for rendering and reading documents. The MVP does not introduce an abstract "Reader interface" at the component layer — with only one Document Format (PDF), direct coupling to the designated PDF rendering library is permitted.

When a new Document Format is approved into scope, selecting the appropriate renderer component based on format represents a straightforward extension point (routing by Document Format), not an architectural redesign — provided Reading Location was modeled abstractly as specified above.

The Frontend never directly touches filesystem or storage:

```text
React → Express → Document Storage → Local File Storage
```

Storage implementations are never exposed directly to the frontend.

## 6. API & Configuration

The API uses REST/HTTP.

The Backend serves as the primary Code-first API definition. The API is documented with **OpenAPI/Swagger** to support lookup and development workflows.

Configuration provides sane defaults and supports **environment variable overrides** when deploying across different environments.

## 7. Security, Errors & Logging

Security currently focuses on **secure resource access**, not authentication/authorization — as this is a single-user application without user accounts. Specifically: the backend must rigorously control access to Document Storage (e.g. preventing path traversal, disallowing access outside authorized directories).

The architecture must not preclude adding authentication/authorization later. The principle "Backend is the security authority, enforcing all security decisions at the backend" remains intact and compatible with introducing authentication without redesign — but building accounts/login **is out of current scope** and must not be implemented prematurely.

Error handling follows a hybrid pattern:
- System and common API errors are handled centrally via middleware.
- Business errors originate within application modules and flow through standard response handlers.

Logging utilizes **structured centralized logging** with appropriate severity and context for debugging and auditability. Metrics, distributed tracing, and external monitoring are not baseline architectural requirements.

## 8. Deployment

The MVP prioritizes straightforward single-machine deployment — React, Express, Database, and Document Storage run together on one machine without distributed deployment overhead.

Clean separation between boundaries (Database, Document Storage) is the natural outcome of a modular, layered architecture — not a distributed deployment requirement. There is no genuine need to deploy components separately; this architecture does not treat separable deployment as an independent goal.

## 9. Testability

Business logic must be structured to run tests independently of Express and the ORM — for instance, business logic must never reside directly inside route handlers, and must not depend on a live database to execute unit tests.

This is a mandatory architectural prerequisite satisfying `SCOPE.md`: business logic requires automated testing; UI/UX relies on clear manual verification scenarios.

## 10. Architectural Principles

* Simple > clever
* Meaningful boundary > artificial abstraction
* Existing pattern > new pattern
* Backend is the source of truth
* Security is enforced at the backend
* Architecture supports change, but does not implement hypothetical future requirements
* Never alter architecture merely because an alternative implementation looks marginally better.