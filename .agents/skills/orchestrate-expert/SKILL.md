---
name: orchestrate
description: Master orchestration skill for LocalRead. Enforces AGENT.md principles, validates task scope against SCOPE.md and ARCHITECTURE.md, activates express-backend-expert and react-reader-expert, requires plan-first, verifies vertical completeness, and automates backlog tracking in docs/backlog.md.
---

# Orchestrate — LocalRead Agent Director

Before executing any task on **LocalRead**, the agent must read through this guide from top to bottom.
Never skip any phase. Do not write a single line of code until Phase 4 clears and the plan is approved.

---

## Phase 1 — Task Classification

Classify the user's request into exactly one of the following categories before proceeding:

| Type | Description | Example in LocalRead |
|------|-------------|----------------------|
| `NEW_FEATURE` | Building a new feature within MVP scope | "Add fit-to-width feature for the PDF reader" |
| `MODIFY` | Extending or adjusting existing behavior | "Increase progress save debounce timeout to 800ms" |
| `BUG_FIX` | Fixing broken behavior | "Reader resumes to wrong page when PDF has >100 pages" |
| `REFACTOR` | Improving code without altering behavior | "Extract page calculation into a custom hook" |
| `QUESTION` | Explanation, analysis, or advice — no code output | "Why is Reading Location stored as { type, value }?" |

> If a task spans multiple types (e.g. bug fix and refactoring), classify it under the highest-impact type.

---

## Phase 2 — Skill Activation

Activate skills corresponding to the system layers being touched:

### Layer $\rightarrow$ Skill Mapping

| Layer Touched | Activated Skill |
|---------------|-----------------|
| General orchestration, scope guard, decision process | `/orchestrate` |
| Express routes, controllers, services, ORM models, document storage, local file access | `/express-backend-expert` |
| React components, PDF viewer, reading progress hook, library, keyboard shortcuts | `/react-reader-expert` |
| UI layout, typography, reader themes, laptop ergonomics | `/reading-ui-expert` |

### Common Combinations

```text
New Backend Feature:
  /orchestrate + /express-backend-expert

New Frontend Reader Feature:
  /orchestrate + /react-reader-expert + /reading-ui-expert

Full-stack Feature (Book Import, Save & Resume Progress):
  /orchestrate + /express-backend-expert + /react-reader-expert

Data/Storage Bug Fix:
  /orchestrate + /express-backend-expert
```

---

## Phase 3 — Context Loading Hierarchy (Mandatory per AGENT.md §0.1)

Load documents in strict hierarchical sequence before starting work:

```text
docs/AGENT.md                   → Decision principles & mindset
    ↓
docs/ACTIVE-VERSION.md          → Active version (v1-mvp)
    ↓
docs/SCOPE.md + ARCHITECTURE.md → What is permitted, architectural boundaries
    ↓
Feature specification / plans   → Specific version requirements (docs/version/...)
    ↓
Existing code                   → Read code before modifying
```

### Context Loading Rules:
- `SCOPE.md`, `ARCHITECTURE.md`, and `ACTIVE-VERSION.md` are **fixed inputs** — do not re-interpret scope or architecture.
- Load only files directly relevant to the task to prevent context dilution.

---

## Phase 4 — Boundary Guard & Clarification Gate

**DO NOT WRITE ANY CODE UNTIL ALL ITEMS BELOW ARE CONFIRMED:**

### 4.1 Radical Scope Resistance Checklist (Mandatory)
```
□ MVP SCOPE COMPLIANCE (docs/SCOPE.md §2):
  - Format: PDF only? (EPUB is strictly FORBIDDEN in MVP).
  - Source: Local file only? (Google Drive is strictly FORBIDDEN in MVP).
  - Audience: Single-user personal app? (Auth/Login/RBAC/Multi-user is FORBIDDEN).
  - Excluded features: No AI assistant, OCR, social sharing, gamification, cloud sync.
  - Highlight: Simple single color, no notes, no complex annotation system.

□ ARCHITECTURAL DOMAIN CONCEPTS (docs/ARCHITECTURE.md §4):
  - Book and Document decoupled? (Never bind Book = Document).
  - Reading Location represented as polymorphic { type, value }? (Never store raw int).

□ SECURE RESOURCE ACCESS (docs/ARCHITECTURE.md §7):
  - Document Storage protects against path traversal?
  - Physical storage paths kept private from frontend?
```

> **Boundary Guard Warning**: If a requirement demands an abstraction, module, or architecture change not approved in `SCOPE.md`/`ARCHITECTURE.md` $\rightarrow$ **STOP**, record into `docs/backlog.md`, report to user, and await decision.

### 4.2 Mandatory Plan Before Code (docs/AGENT.md §3)
For any non-trivial task, the agent must create a plan saved in the active version plan directory with **all 9 mandatory sections**:
1. Goal & scope
2. Data flow
3. Affected files/modules
4. Backend API changes
5. UI/UX changes
6. Edge cases
7. Risks / assumptions
8. Testing strategy
9. Architecture impact (yes/no)

Present the plan for user approval before modifying code.

---

## Phase 5 — Output & Verification Checklist

Self-verify before delivering output:

### 5.1 Backend Checks (Express)
```
□ Architecture adheres to Modular + Layered structure
□ Business logic resides in Services, NOT route controllers
□ Business logic testable independent of Express runtime and live DB
□ Document Storage prevents path traversal
□ ORM entities decoupled from API DTOs
□ Centralized error handling middleware with standard HTTP status codes
□ Structured JSON logging
□ No hardcoded sensitive paths or ports (use config + env)
```

### 5.2 Frontend Checks (React)
```
□ Strict TypeScript: No `any` type
□ All API calls routed through centralized services
□ PDF Reader: Crisp rendering, fit-to-width functional, smooth page turns
□ Keyboard navigation shortcuts working (Arrow, PageUp/Down, Space, Fit-width)
□ Progress saving: Debounced (600ms-1000ms), no API request flooding
□ Progress resume: Opening a book auto-restores to exact saved page
□ Complete Loading, Error, and Empty states handled
```

### 5.3 Universal & Vertical Completeness Checks (AGENT.md §7)
```
□ No TODO, placeholder comments, or unfinished logic
□ End-to-end flow verified in practice:
  Import PDF -> Appears in Library -> Open -> Read to page 5 -> Close app -> Reopen -> Resumes page 5
□ Never declare completion based solely on build/compile pass
```

---

## Phase 6 — Transparent Reporting (Mandatory per AGENT.md §9)

The final response must include all 5 sections without omissions:

```text
1. What changed:
   - Specific files/features added/modified/removed.
2. Why:
   - Technical reason or business requirement behind the change.
3. Risk/Impact level:
   - High / Medium / Low (system-wide impact).
4. Assumptions (if any):
   - Assumptions made during implementation.
5. Not done / remaining:
   - Next steps or backlog tracking items.
```

---

## Phase 7 — Automated Backlog Protocol (`docs/backlog.md`)

The agent **automatically logs items into `docs/backlog.md`** under 3 triggers without waiting for an explicit prompt:
1. **Deferred Requests**: User says *"later"*, *"next phase"*, *"postpone"*.
2. **Out of Scope (Boundary Guard Trigger)**: Legitimate features that belong to Planned/Backlog (EPUB, Google Drive, Full-text search, Tags...).
3. **Edge cases / Known issues**: Identified during work but unsafe to fix in the current scope.

### Standard Entry Format in `docs/backlog.md`:
```markdown
- [ ] **[ID] [Feature / Issue Name]**: Summary of item
  - *Category:* [Planned / Backlog / Bug]
  - *Details:* In-depth description of requirement or issue
  - *Reason Recorded:* Outside MVP v1 scope / Postponed by user
  - *Technical Notes:* Modules/APIs/components involved
```
Notify the user in the final report that the item has been indexed in `docs/backlog.md`.