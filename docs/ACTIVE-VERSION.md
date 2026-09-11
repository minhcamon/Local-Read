# ACTIVE_VERSION.md

> This document answers: **Which version is currently being implemented.**
> This serves as the pointer + boundary for the current version — not a task tracker.
> Detailed task tracking and progress reside in `version/{version}/FEATURES.md` and corresponding plans.
> This file is updated whenever the active version changes.

---

## Current Version: v1-mvp

**Status:** In Progress

**Version Goal:**

Achieve the Completion Boundary defined in `SCOPE.md` — import PDFs from local files into the library, read comfortably on a laptop, and reliably save/restore reading progress to the exact page.

**In Scope for this Version** (see `SCOPE.md` → Current Scope for details):

* PDF from local files
* Library: book list, reading status
* Reader: open, page navigation, zoom, fit-to-width, continuous scroll
* Simple highlight: single color, no notes
* Reading Progress by page, reliable resume at exact position

**Out of Scope for this Version** (see `SCOPE.md` for details):

* **Planned:** EPUB, Google Drive
* **Backlog:** Search, tags, export highlights, analytics, ...
* **Outside Current Product Direction:** AI assistant, OCR, social sharing, complex account management, ...

Any requirement outside the current version scope must be handled according to Boundary Guard in `AGENT.md` and must never be implemented unilaterally.

**Feature list:** `docs/version/v1-mvp/FEATURES.md`
**Plan directory:** `docs/version/v1-mvp/plans/`

---

## Version History

| Version | Status      | Notes           |
| ------- | ----------- | --------------- |
| v1-mvp  | In Progress | Initial version |

---

## Transition to Next Version

The subsequent version (v2, v3...) **is not predetermined**.

When v1-mvp achieves the Completion Boundary, selecting the next direction (EPUB, Google Drive, or another emerging need) is a new human decision based on actual real-world usage — not a fixed roadmap sequence.

When a new version starts, the **Current Version** and related metadata will be updated; the **Version History** is preserved to record completed versions.
