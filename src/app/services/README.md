# App Services

This directory contains **app-level infrastructure and configuration** only.

## What Belongs Here? ✅

Services that configure global app infrastructure:

### `reactQuery/`

**React Query (TanStack Query) Configuration**

- Query client setup
- Cache configuration
- Global query/mutation defaults
- Focus manager setup
- **Why here:** App-level infrastructure, not domain logic

### `rtk/` (if used)

**Redux Toolkit Query Configuration**

- RTK Query API setup
- Base query configuration
- Global endpoints
- **Why here:** App-level state management infrastructure

### `axios/`

**HTTP Client Configuration**

- Axios instance setup
- Base URL configuration
- Global interceptors (auth token, error handling)
- **Why here:** Global HTTP client used across entire app

## The Rule 🎯

**Ask: "Is this configuration or a service?"**

### Configuration → `app/services/`

- Sets up libraries (React Query, RTK, Axios)
- Provides global defaults
- Wraps the app with providers
- **No business logic**

### Service/Adapter → `modules/services/`

- Platform-specific implementations
- Business logic
- Testable with mocks
- Can be swapped (adapter pattern)

## Examples

### ✅ Correct - App Service

```typescript
// app/services/reactQuery/queryClient.tsx
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 1000 * 30 },
    mutations: { retry: 0 },
  },
});
```

### ❌ Wrong - Should be Module Service

```typescript
// app/services/storage.ts (WRONG LOCATION!)
export class StorageService {
  setItem(key: string, value: any) { ... }
  getItem(key: string) { ... }
}
```

### ✅ Correct - Module Service

```typescript
// modules/services/storage/storage-service.ts
export class StorageService {
  constructor(private adapter: StorageAdapter) {}
  setItem(key: string, value: any) { ... }
  getItem(key: string) { ... }
}
```
