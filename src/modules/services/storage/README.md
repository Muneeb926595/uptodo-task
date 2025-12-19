# Storage Service

Centralized storage management using the adapter pattern for flexibility and testability.

## Architecture

```
storage/
├── storage-adapter.ts      # Interface definition
├── mmkv-adapter.ts        # MMKV implementation
├── storage-service.ts     # Service class with business logic
└── index.ts              # Singleton export
```

## Usage

```typescript
import { storageService, StorageKeys } from '@/modules/services/storage';

// Set a value
await storageService.setItem(StorageKeys.TODOS, todoMap);

// Get a value with optional default
const todos = await storageService.getItem<TodoMap>(
  StorageKeys.TODOS,
  {}, // default value if not found
);

// Remove a value
await storageService.removeItem(StorageKeys.ACCESS_TOKEN);

// Check if key exists
const hasToken = storageService.hasKey(StorageKeys.ACCESS_TOKEN);

// Get all keys
const allKeys = storageService.getAllKeys();

// Clear all storage
await storageService.clearAll();
```

## Storage Keys

All storage keys are defined in `StorageKeys` enum:

### Authentication

- `ACCESS_TOKEN` - User access token
- `REFRESH_TOKEN` - User refresh token
- `USER_PROFILE` - User profile data

### StorageAdapter Interface

Defines the contract for storage implementations:

```typescript
interface StorageAdapter {
  set(key: string, value: string): void;
  get(key: string): string | undefined;
  remove(key: string): void;
  clearAll(): void;
  contains(key: string): boolean;
  getAllKeys(): string[];
}
```

## Future Enhancements

- Add AsyncStorage adapter for fallback
- Add SQLite adapter for complex queries
- Implement migration utilities for schema changes
- Add storage encryption key rotation
- Add storage size monitoring and cleanup
