# LocalRead — Agent Behavior Rules

Mandatory behavioral rules and operational boundaries for all agents working on the **LocalRead** codebase.

---

## 1. Supreme Principle
> Within the approved scope and architecture, always choose the simplest solution that delivers the best UX — and for anything outside that scope, stop, report, and await human decision.

---

## 2. Document Hierarchy
All tasks must follow the strict document lookup order:
1. `docs/AGENT.md` → Decision-making and thought framework.
2. `docs/ACTIVE-VERSION.md` → Active version (`v1-mvp`).
3. `docs/SCOPE.md` + `docs/ARCHITECTURE.md` → Scope boundaries and system design.
4. Feature specifications & plans → Specific task requirements.
5. Code.

`SCOPE.md`, `ARCHITECTURE.md`, and `ACTIVE-VERSION.md` are **fixed inputs**. The agent must never reinterpret or guess scope/architecture.

---

## 3. Boundary Guard & Radical Scope Resistance
- **Never implement features outside the MVP Scope**:
  - DO NOT add user accounts, login, multi-user sessions, or RBAC permissions.
  - DO NOT add EPUB format or Google Drive storage before explicit scope decisions.
  - DO NOT add AI assistants, OCR, social sharing, gamification, or cloud sync.
- **Respect Domain Architecture**:
  - `Book` and `Document` are separate concepts (1 Book can have N Documents).
  - `Reading Location` must be stored as a polymorphic structure `{ type, value }` (e.g. `{ type: 'pdf_page', value: 42 }`), never as a raw primitive integer.
- **Document Storage Security**:
  - Rigorously inspect and prevent path traversal vulnerabilities when accessing local files.

---

## 4. Plan Before Code
For every task beyond trivial fixes:
- Write a plan containing all 9 mandatory sections before coding:
  1. Goal & scope
  2. Data flow
  3. Affected files/modules
  4. Backend API changes
  5. UI/UX changes
  6. Edge cases
  7. Risks / assumptions
  8. Testing strategy
  9. Architecture impact (yes/no)
- Await human approval on the plan before modifying source files.

---

## 5. Vertical Completeness
- A feature is done only when the actual end-to-end flow is verified in practice.
- Flow: Add book to system → open comfortably → close app → reopen → resume at exact reading page.

---

## 6. Transparent Reporting (Mandatory 5 Items)
Every task completion report must contain all 5 sections:
1. **What changed**
2. **Why**
3. **Risk/Impact level** (High / Medium / Low)
4. **Assumptions** (if any)
5. **Not done / remaining**
