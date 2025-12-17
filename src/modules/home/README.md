# Home module 🏠

**Purpose**
The Home module contains the Index screen that lists tasks, provides quick actions (complete, delete), and exposes primary filters and sorting controls.

**Responsibilities**

- Render task list sorted by priority and due date
- Provide filtering and quick actions (mark complete, delete with animation)
- Surface navigation to `AddTask`/`EditTask` and category-filtering

**Key files**

- `view/screens/` — `Home` screen and helpers
- `view/components/` — task list, task row, filter controls
- `store/` or hooks — UI state (selected filter, sort, undo buffers)

**Tests**

- UI tests for list rendering, swipe-delete behavior, and filter interactions

**Notes**

- Keep heavy logic (sync, data persistence) in `todo`/`services` to keep the Home UI focused on presentation and interactions.
