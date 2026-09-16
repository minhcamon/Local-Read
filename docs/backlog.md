# LocalRead — Project Backlog

> This document tracks deferred user requests, features outside current scope (Boundary Guard), and recorded edge cases.
> Governed by `docs/AGENT.md` (Boundary Guard) and `docs/SCOPE.md`.

---

## 📌 Status Overview

| ID | Title | Category | Status | Notes |
|---|---|---|---|---|
| ENH-001 | EPUB Document Format Support | Planned | Pending Scope Approval | Planned for post-MVP when need arises |
| ENH-002 | Google Drive Document Source | Planned | Pending Scope Approval | Planned for post-MVP |
| ENH-003 | Full-text Document Search | Backlog | Uncommitted | Requires indexing strategy |
| ENH-004 | Tags and Collections | Backlog | Uncommitted | Categorization for large libraries |
| ENH-005 | Multiple Highlight Colors & Notes | Backlog | Uncommitted | Simple 1-color highlight in MVP |
| ENH-006 | Contextual Glossary & Term Definitions | Backlog | Uncommitted | Mock tab in reader notes drawer |
| ENH-007 | Saved Quotes Management | Backlog | Uncommitted | Mock tab in reader notes drawer |

---

## 📋 Item Details

### Planned Features (Post-MVP)

- [ ] **[ENH-001] EPUB Document Format Support**:
  - *Category:* Planned
  - *Details:* Support reading `.epub` documents in the reader interface.
  - *Reason Recorded:* Outside MVP v1 scope (`SCOPE.md §3`).
  - *Technical Notes:* Reading Location abstraction `{ type: 'epub_cfi', value: ... }` is already prepared in domain architecture.

- [ ] **[ENH-002] Google Drive Document Source**:
  - *Category:* Planned
  - *Details:* Allow importing documents directly from Google Drive cloud storage.
  - *Reason Recorded:* Outside MVP v1 scope (`SCOPE.md §3`).
  - *Technical Notes:* Requires Document Source expansion approval per `SCOPE.md §6`.

### Backlog Ideas

- [ ] **[ENH-003] Full-text Document Search**:
  - *Category:* Backlog
  - *Details:* Search text content across all books in the library.
  - *Reason Recorded:* `SCOPE.md §4`.

- [ ] **[ENH-004] Tags and Collections**:
  - *Category:* Backlog
  - *Details:* Create custom collections and assign tags to books.
  - *Reason Recorded:* `SCOPE.md §4`.

- [ ] **[ENH-005] Multiple Highlight Colors & Notes**:
  - *Category:* Backlog
  - *Details:* Allow yellow, green, pink highlights and attaching textual notes.
  - *Reason Recorded:* `SCOPE.md §4`.

- [ ] **[ENH-006] Contextual Glossary & Term Definitions**:
  - *Category:* Backlog
  - *Details:* Dedicated dictionary and glossary system for literary and technical terms.
  - *Reason Recorded:* Outside MVP v1 core loop (`SCOPE.md §1`).

- [ ] **[ENH-007] Saved Quotes Management**:
  - *Category:* Backlog
  - *Details:* Extracting and managing stand-alone quotes independent of continuous text highlight markers.
  - *Reason Recorded:* Outside MVP v1 core loop (`SCOPE.md §1`).
