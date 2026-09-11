---
name: reading-ui-expert
description: Visual aesthetics and UI/UX design guide for LocalRead — specializing in distraction-free personal reader interfaces, laptop ergonomics, calm reading palettes (Light/Dark/Sepia), typography for document readability, and clean library layout.
---

# Reading UI Expert — LocalRead

UI/UX design standards and visual aesthetic principles for the personal reading system **LocalRead** optimized for laptop screens.

---

## 1. Design Philosophy

> **"Turn a laptop into a convenient, simple, and comfortable personal reading environment."**

- **Distraction-Free**: The reading content is the primary focus. Surrounding controls, toolbars, and chrome must stay unobtrusive, fading into the background during active reading.
- **Calm & Ergonomic**: Tuned for prolonged reading sessions on 13" to 16" laptop displays.
- **Anti-Bloat**: No achievement badges, gamification notifications, social sharing counters, or unnecessary decorative clutter.

---

## 2. Color Palettes & Reading Themes

The system supports three dedicated reading themes:

| Theme | Page Background | Typography | Use Case |
|---|---|---|---|
| **Light** | `#FFFFFF` / App background `#F8F9FA` | `#1E293B` (Slate 800) | Daytime reading, well-lit environments, high contrast |
| **Sepia** | `#FBF0D9` / App background `#F4E8C1` | `#433422` (Warm Amber) | Extended reading sessions, warm parchment tone, reduced blue light |
| **Dark** | `#1E1E1E` / App background `#121212` | `#E2E8F0` (Slate 200) | Nighttime reading or low-light rooms, relaxed eye strain |

- **Highlights**:
  - Soft semi-transparent yellow (`rgba(250, 204, 21, 0.35)`), avoiding harsh neon tones.
  - Blends naturally over rendered text within the PDF text layer.

---

## 3. PDF Reader Screen Guidelines

### 3.1 Reader Toolbar
- **Placement**: Clean top bar or subtle floating bar with subtle glassmorphism (`backdrop-blur-md`).
- **Auto-hide Behavior**: Smoothly fades out when scrolling/flipping pages after 2.5 seconds of mouse inactivity. Hovering near the top immediately reveals the toolbar.
- **Essential Controls**:
  - Return to Library button (`← Library`).
  - Book title (single line, truncated if long).
  - Page navigation input (`[ 42 ] / 350`).
  - Zoom controls: Zoom Out (`-`), Zoom In (`+`), **Fit-to-Width** button (`[↔]`).
  - Display mode toggle: Continuous Scroll / Single Page.

### 3.2 Page Rendering & Laptop Ergonomics
- **Default Viewport**: Automatically set to **Fit-to-Width** on open so text is readable across standard laptop screen widths without horizontal scrolling.
- Subtle page shadow (`shadow-md` or `box-shadow: 0 4px 20px rgba(0,0,0,0.08)`) to clearly demarcate page boundaries against the background.
- In Continuous Scroll mode, provide comfortable spacing between pages (`gap: 16px` to `24px`).

---

## 4. Library Screen Guidelines

### 4.1 Bookshelf Grid
- Grid cards with a standard `3:4` book cover aspect ratio.
- Each book card clearly displays:
  - Book cover (or minimalist typographic placeholder if no cover exists in the PDF).
  - Title and author.
  - Subtle progress bar (3-4px height) at the bottom of the card.
  - Clean status badge: `Unread` (neutral gray), `Reading • 45%` (gentle blue), `Completed` (gentle green).
- **"Continue Reading"** button:
  - Highlighted action on the active book to jump straight to the last read page.

### 4.2 Book Import Zone
- Full-screen or dedicated drag-and-drop zone for PDF files.
- Subtle dashed border and slight scaling animation when hovering files over the dropzone.
- Clear progress indicator and error messaging for invalid/corrupted files.

---

## 5. Typography & Micro-interactions

- **UI Typography**: Neutral, legible Sans-serif fonts (`Inter`, `system-ui`, `-apple-system`, `Segoe UI`).
- **Transitions**:
  - Keep animations quick and subtle (`150ms - 250ms ease-in-out`).
  - Avoid disorienting page turn animations when flipping through pages quickly.
- **Empty State**:
  - When the library has no books: show a clean minimalist reading illustration and an inviting prompt: *"Your library is empty. Drag and drop a PDF file here to begin reading."* with a "Browse Files" button.
