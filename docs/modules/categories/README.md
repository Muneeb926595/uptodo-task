# Categories module 🏷️

**Purpose**
Manage task categories (create, edit, delete) and provide metadata (color, icon) used for filtering and grouping tasks.

**Responsibilities**

- CRUD for categories
- Provide color & icon choices and validation
- Ensure referential integrity with tasks (e.g., behavior when deleting a category)

**Key files**

- `view/screens/` — category list / edit screen
- `services/` — repository or adapter to persist categories
- `types/` — `Category` type

**Tests**

- Unit tests for repository and UI behavior (delete confirmation, filter updates)

**Notes**

- Decide on behavior when deleting categories (reassign tasks to default, warn user, or delete tasks) and document it here.
