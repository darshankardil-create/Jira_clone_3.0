````markdown
# Kanban Board with Virtual Scrolling and Drag-and-Drop

A Kanban board built with Next.js and React that efficiently handles large datasets using virtual scrolling and drag-and-drop, with URL-synced filters. The design is responsive for tablet and desktop devices only and does not support mobile.

---

## Live Demo

[Add your Vercel or Netlify live deployment link here]

## Repository

[Add your public GitHub or GitLab repository link here]

---

## Setup Instructions

```bash
# 1. Clone the repository
git clone <your-repo-url>

# 2. Navigate to the project folder
cd <project-folder>

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
````

The app will be available at:
`http://localhost:3000`

---

## State Management Decision

This project uses React’s built-in state (useState) with derived state, avoiding external state libraries.

### Why this approach?

* The app is UI-driven, not deeply nested
* State is mostly component-scoped
* Avoids unnecessary complexity from tools like Redux or Zustand

### State Structure

* `data` → main dataset
* `dataclone` → source of truth for filtering
* `filterbymeclone1-4` → column-specific filtered data

### Derived State

* Active filters
* Drag state (dragged item, hover column)
* Virtualized visible items

This structure keeps logic simple, predictable, and easy to debug.

---

## Virtual Scrolling Implementation

To efficiently handle 500+ tasks, manual virtualization is implemented.

### Core Concept

Instead of rendering all tasks:

* Only render visible items in the viewport
* Calculate which items should be visible based on scroll

### Implementation Details

* Fixed item height: `120px`
* Track scroll using `scrollTop`
* Compute:

  * `startIndex`
  * `endIndex`
  * `buffer` (extra items for smoother scrolling)

```ts
const visibleItems = data.slice(startIndex, endIndex);
```

### Positioning Technique

Use:

```css
transform: translateY(offset);
```

Add a spacer div:

```css
height = totalItems * itemHeight;
```

### Result

* Smooth performance
* No lag with large datasets
* Minimal DOM nodes rendered

---

## Drag-and-Drop Implementation

Built using the native HTML5 Drag and Drop API.

### Workflow

1. Drag Start

```ts
e.dataTransfer.setData("task", JSON.stringify(task));
```

2. Drag Over

```ts
e.preventDefault(); // Required to allow dropping
```

3. Drop

* Retrieve dragged task
* Update its column/status
* Insert into new column
* Track drop success using a ref to always access the latest state (avoids async state issues)

4. Drag End

* Replace original card with a placeholder (if moved)

### Ref Usage (Important)

* A dedicated `useRef` is used to track drag success state
* Since refs are synchronous, they ensure the latest value is always available
* This avoids inconsistencies caused by async state updates during drag/drop

---

## Drag Behavior and Placeholder System

* When a card is dragged:

  * It changes color to indicate active drag state
  * A placeholder is created at its original position

* When dropped:

  * The card moves to the new column
  * The placeholder remains in the original position
  * This helps visually track where the card came from

* The placeholder:

  * Preserves layout (no shifting)
  * Stores previous card position (history awareness)
  * Stays until user removes it manually

* A dedicated **"Remove All Placeholders"** button is provided in the header

* Placeholders are only cleared when the user explicitly clicks this button

---

## Placeholder Handling (No Layout Shift)

To prevent layout issues:

* The dragged item is not immediately removed
* It is replaced with a placeholder of equal height
* Ensures stable layout and smooth UX

### Benefits

* No sudden jumps
* Consistent spacing
* Better visual tracking

---

## Filters and URL Synchronization

Supports:

* Priority filter
* Assignee filter
* Status filter
* Due date range filter
* Clear all filters option

### URL Example

```txt
?a=["Darshan"]&p=["High"]&b=["2026-01-01","2026-02-01"]&s=["In Progress"]
```

### Benefits

* Shareable filter state
* State persists on refresh
* Better user experience

---

## Performance

* Handles 500+ tasks smoothly
* Virtual DOM load minimized
* Optimized rendering via slicing

Add Lighthouse screenshot here.

---

## Explanation (Challenges and Solutions)

The hardest problem in this project was combining virtual scrolling with drag-and-drop. Since only a subset of items is rendered at any given time, maintaining consistent drag behavior required separating the full dataset from the rendered slice. I solved this by updating the full dataset while only virtualizing at the render level.

Handling the drag placeholder without layout shift was another key challenge. Instead of removing the dragged item, I replace it with a placeholder of equal height. This ensures the layout remains stable and prevents visual jumps. Additionally, the placeholder keeps track of the original position, helping users understand movement history.

To reliably detect drop success, I used a ref instead of state. Because refs are synchronous, they always hold the latest value during drag operations, avoiding inconsistencies caused by async updates.

If I had more time, I would refactor repeated column logic into a reusable component to reduce duplication and improve scalability.

---

## Tech Stack

* Next.js
* React
* TypeScript
* Tailwind CSS

---

## Features

* Virtual scrolling for large datasets
* Drag-and-drop across columns
* Persistent placeholder system
* Ref-based drag success tracking
* URL-synced filters
* Due date range filtering
* Clear all filters option
* Responsive for tablet and desktop only

---

## Future Improvements

* Extract reusable column component
* Add backend integration (API and persistence)
* Improve touch-based drag support
* Add animations for smoother transitions
* Add testing (unit and integration)

---

## Author

Darshan Kardile

```
```
# Jira_clone
# Jira_clone
# Jira_clone_1.0
# myjira
# Jira_clone
# JiraCloneVersal
