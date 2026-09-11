# SCOPE.md — Personal Reading System

> This document answers: **What the project is permitted / not permitted to do.**
> It serves as a fixed input for `AGENT.md` and the foundation for designing `ARCHITECTURE.md`.
> It does not describe how the system is structured (→ `ARCHITECTURE.md`) nor how the agent makes decisions (→ `AGENT.md`).

---

## 0. Product Intent

> Turn a laptop into a convenient, simple, and comfortable personal reading environment.

This is a **personal, single-user web app**. It is not designed for multi-user, account systems, permissions, or sharing at any stage of the current scope.

The right question when evaluating a proposed feature is not "is this feature useful?", but rather:

> **Does this feature serve the reading experience, or is it turning the app into something else?**

If the answer is not unambiguously "serves the reading experience" → the feature does not belong to the Current Scope.

## 1. Core Loop (Invariable)

```text
Add → Library → Open → Read → Save Progress → Resume
```

- This is the system's reason for existence. All other features are secondary.
- Search, tags, categorizations... **are not steps of the core loop**, even if helpful. They must never be prioritized alongside the core loop.
- Reading in this scope means **reading with one's eyes**. Audiobooks/TTS do not belong to the current product direction.

## 2. Current Scope (MVP)

Permitted to do, and **only up to the minimum necessary level**, for the following — nothing more:

- **Format:** PDF only. (This is an MVP constraint, not a permanent domain limit.)
- **Document Source:** Local file only. Importing from local storage must be frictionless — the exact mechanism (drag-and-drop, file picker, file watcher, etc.) is a decision for `ARCHITECTURE.md`/plans, not fixed here.
- **Reader:** Open PDF, page navigation, zoom, fit-to-width, continuous scroll, laptop-friendly interface.
- **Highlight:** Included in MVP at a simple level — marking text passages. No attached notes, no multiple colors, no complex annotation system.
- **Reading Progress:** Save and restore to the **exact page**. Does not require precision down to scroll offset, line, or character.
- **Library:** Book list, reading status, "Continue Reading".

### Condition for MVP Being Considered "Usable"

> Add a book into the system → open and read comfortably → close the app → return later → resume reading at the exact page, without needing to manually remember progress.

If the reading experience or resume progress is unreliable → the MVP is considered incomplete, regardless of how many other features exist.

## 3. Planned / Future (Intended, Not Yet Permitted)

Directions identified for future work, but **strictly forbidden from self-implementation before a separate scope decision**:

- Google Drive as a Document Source
- EPUB as a Document Format

Condition to begin: **real user need arises + MVP is stable** — no fixed calendar deadlines or triggers.

## 4. Backlog / Potential (Ideas, No Commitment)

Potential features if genuine needs emerge, but currently uncommitted:

- Full-text search
- Tags / collections
- Export highlights
- Reading analytics
- Multiple highlight colors
- Notes attached to highlights

When proposed by an agent or discovered during implementation, these items must be recorded in `backlog.md` according to `AGENT.md` (Boundary Guard) and must not be self-implemented.

## 5. Explicitly Excluded

Outside the current product direction. This does not mean "never," but bringing them into scope requires a **completely new scope decision**, not an ordinary feature request:

- AI assistant (summarization, Q&A, etc.)
- Spaced repetition
- OCR
- Social sharing
- Recommendation engine
- Multi-device cloud sync
- Gamification
- Ads
- Retention notifications/reminders
- Social features
- Complex user/account management

### Philosophy of Exclusion

> This is a personal reading tool, not an engagement platform trying to keep users hooked for as long as possible.

## 6. Document Source Expansion Policy

Architectural extensibility **is not permission to expand scope**.

Any new Document Source (Dropbox, Notion, Web Clipper, OneDrive, etc.) — even if the `DocumentSource` abstraction technically supports it out of the box — must proceed through:

```text
Backlog → Human decision → Scope approval → Plan → Implementation
```

There are no exceptions such as "since it's already decoupled, let's just build it."

## 7. Completion Boundary (MVP Done)

The MVP is considered complete when the following flow runs reliably across multiple books without manual database or filesystem intervention:

```text
Launch app → view library → import PDF → open book → read comfortably
→ page navigation / zoom / fit-to-width → highlight when desired
→ close app → relaunch → see currently read book → resume at exact page
```

### Data Integrity Requirement (Mandatory)

> Once reading progress is confirmed as saved by the system, it must be persisted and restored accurately.

The UI must never indicate "saved" if backend/database persistence did not succeed. Absolute zero-data-loss across catastrophic crashes is not expected, but reasonable transaction/atomicity guarantees are mandatory.

### Testing Requirement

```text
Business logic  → Automated tests mandatory
UI / UX flow    → Clear manual verification scenarios; automated UI tests not required
```

Across all layers, the ultimate standard remains **Vertical Completeness** (per `AGENT.md`): a feature is never considered done simply because backend tests pass or the frontend renders in isolation.

---

## 8. Scope Change Policy

- Any proposal to move an item between categories (Backlog → Planned, Planned → Current Scope, Excluded → Backlog...) is a **human decision**, never something an agent infers from technical context.
- When an agent identifies a potential category transition → record in `backlog.md` with rationale → await human decision, adhering strictly to Boundary Guard in `AGENT.md`.