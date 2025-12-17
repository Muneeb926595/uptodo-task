# Todo module ✅

**Purpose**
Core task domain: models, CRUD operations, business rules, and persistence. This module is the authoritative source for task data and domain logic.

**Responsibilities**

- Data model & types for `Task` (title, description, due date, priority, status, attachments, category)
- Task repository/service that talks to local storage and remote APIs
- Business rules (priority handling, overdue detection, status transitions)

**Key files**

- `api/` — remote API calls (if applicable)
- `repository/` — persistence layer (local DB + sync queue integration)
- `store/` — state management and selectors
- `view/` — screens are split into `home` / `add` / `edit` but presentation should import domain services from here

**Offline behavior**

- Support local create/update/delete with an operation queue; set `isSynced` flags to track sync state

**Tests**

- Unit tests for repository, sync queue, and business rules

**Notes**

- Keep domain logic here; UI modules import from `todo` instead of re-implementing logic.
