# Services module 🔧

**Purpose**
The `services` module contains shared, cross-cutting services and platform adapters used by other domains: media (image upload/storage), notifications (local scheduling + push adapters), and sync/offline helpers.

**Responsibilities**

- Provide clean, testable interfaces for platform features (APIs, storage, push, media)
- Keep platform-specific code isolated behind small adapters
- Provide utility helpers for scheduling and background sync

**Key files / subfolders**

- `services/api` — HTTP clients / API wrappers
- `services/storage` — persistent storage adapters (MMKV/SQLite wrapper)
- `services/notifications` — scheduling and platform adapters (Notifee / FCM / APNs)
- `services/media` — image upload, compression, cache helpers
- `services/sync` — offline queue and sync worker

**Guidelines**

- Export minimal, well-typed interfaces for each adapter
- Keep side effects (network, native modules) inside `services` to make business logic easy to test
- Add unit tests for every adapter and integration tests for sync flows

**Tests**

- Place unit tests in `__tests__` adjacent to the implementation of each service

**Notes / TODOs**

- Implement platform-specific tests and verify behavior on iOS & Android
