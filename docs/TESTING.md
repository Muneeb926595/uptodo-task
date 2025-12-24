# Testing Guide

## Overview

This project uses **Jest** for unit and integration testing. Tests are co-located with source files in `__tests__` directories.

## 📁 Test Structure

```
src/modules/services/
├── storage/
│   ├── __tests__/
│   │   ├── storage-service.test.ts      # Service tests
│   │   ├── mmkv-adapter.test.ts         # Adapter tests
│   │   └── fixtures/
│   │       └── storage-test-data.ts     # Reusable test data
│   ├── storage-service.ts
│   ├── storage-adapter.ts
│   └── mmkv-adapter.ts
```

---

## 🧪 Test Patterns

### AAA Pattern (Arrange-Act-Assert)

All tests follow this clear structure:

```typescript
it('should authenticate successfully', async () => {
  // Arrange - Set up test data and mocks
  const mockAdapter = createMockAdapter();
  const service = new BiometricService(mockAdapter);

  // Act - Execute the code under test
  const result = await service.authenticate();

  // Assert - Verify the outcome
  expect(result.success).toBe(true);
});
```

### Test Organization

```typescript
describe('StorageService', () => {
  // Shared setup
  let service: StorageService;
  let mockAdapter: jest.Mocked<StorageAdapter>;

  beforeEach(() => {
    // Runs before each test
    mockAdapter = createMockAdapter();
    service = new StorageService(mockAdapter);
  });

  afterEach(() => {
    // Cleanup after each test
    jest.clearAllMocks();
  });

  // Group related tests
  describe('setItem', () => {
    it('should store string values', async () => {
      // Test implementation
    });

    it('should handle errors gracefully', async () => {
      // Test implementation
    });
  });
});
```

---

## 🚀 Running Tests

### Run all tests

```bash
yarn test
```

### Run tests in watch mode

```bash
yarn test --watch
```

### Run tests for specific file

```bash
yarn test storage-service
```

### Run with coverage

```bash
yarn test --coverage
```

### Run tests silently (CI mode)

```bash
yarn test --silent
```

---

## 📊 Coverage Thresholds

Current requirements (configured in `jest.config.js`):

- **Branches**: 70%
- **Functions**: 70%
- **Lines**: 70%
- **Statements**: 70%

View coverage report:

```bash
yarn test --coverage
open coverage/lcov-report/index.html
```

---

## 🎯 What to Test

### ✅ DO Test

- **Business logic** - Core functionality
- **Error handling** - Edge cases and failures
- **Public APIs** - All exported functions/classes
- **Integration points** - Service interactions
- **Data transformations** - Serialization, parsing
- **Conditional logic** - All branches

### ❌ DON'T Test

- **Third-party libraries** - Already tested
- **Implementation details** - Private methods
- **Simple getters/setters** - Unless they have logic
- **React Native native modules** - Use mocks

---

## 🛠️ Mocking Strategies

### 1. Adapter Pattern (Recommended)

```typescript
// Create mock adapter
const mockAdapter: jest.Mocked<StorageAdapter> = {
  set: jest.fn(),
  get: jest.fn(),
  remove: jest.fn(),
};

// Use in tests
const service = new StorageService(mockAdapter);
```

### 2. Jest Mock Functions

```typescript
const mockFunction = jest.fn();
mockFunction.mockReturnValue('value');
mockFunction.mockResolvedValue(Promise.resolve('async value'));
mockFunction.mockRejectedValue(new Error('error'));
```

### 3. Module Mocking

```typescript
jest.mock('react-native-mmkv', () => ({
  MMKV: jest.fn(() => ({
    set: jest.fn(),
    getString: jest.fn(),
  })),
}));
```

---

## 📝 Test Examples

### Testing Async Functions

```typescript
it('should retrieve user profile', async () => {
  // Arrange
  const mockProfile = { name: 'John' };
  mockAdapter.get.mockReturnValue(JSON.stringify(mockProfile));

  // Act
  const result = await service.getItem(StorageKeys.USER_PROFILE);

  // Assert
  expect(result).toEqual(mockProfile);
});
```

### Testing Error Handling

```typescript
it('should handle serialization errors', async () => {
  // Arrange
  const circular: any = {};
  circular.self = circular;

  // Act & Assert
  await expect(
    service.setItem(StorageKeys.USER_PROFILE, circular),
  ).rejects.toThrow();
});
```

### Testing Multiple Scenarios

```typescript
describe('getItem', () => {
  it.each([
    ['string', 'John Doe'],
    ['object', { name: 'John' }],
    ['array', [1, 2, 3]],
    ['boolean', true],
    ['null', null],
  ])('should handle %s values', async (type, value) => {
    mockAdapter.get.mockReturnValue(JSON.stringify(value));
    const result = await service.getItem(StorageKeys.USER_PROFILE);
    expect(result).toEqual(value);
  });
});
```

---

## 🏗️ Test Fixtures

Reusable test data in `fixtures/` directories:

```typescript
// fixtures/storage-test-data.ts
export const mockUserProfile = {
  id: 'user-123',
  name: 'John Doe',
  email: 'john@example.com',
};

export const createMockAdapter = () => ({
  set: jest.fn(),
  get: jest.fn(),
  remove: jest.fn(),
});

// In your test file
import {
  mockUserProfile,
  createMockAdapter,
} from './fixtures/storage-test-data';

it('should save user profile', async () => {
  const adapter = createMockAdapter();
  const service = new StorageService(adapter);
  await service.setItem(StorageKeys.USER_PROFILE, mockUserProfile);
  expect(adapter.set).toHaveBeenCalledWith(
    StorageKeys.USER_PROFILE,
    JSON.stringify(mockUserProfile),
  );
});
```

---

## 🎨 Best Practices

### 1. **Clear Test Names**

```typescript
// ✅ Good - Descriptive
it('should return null when storage key does not exist', () => {});

// ❌ Bad - Vague
it('should work', () => {});
```

### 2. **One Assertion Per Test**

```typescript
// ✅ Good - Focused
it('should call adapter.set with correct arguments', () => {
  service.setItem(key, value);
  expect(mockAdapter.set).toHaveBeenCalledWith(key, JSON.stringify(value));
});

it('should call adapter.set exactly once', () => {
  service.setItem(key, value);
  expect(mockAdapter.set).toHaveBeenCalledTimes(1);
});

// ❌ Bad - Multiple concerns
it('should set item correctly', () => {
  service.setItem(key, value);
  expect(mockAdapter.set).toHaveBeenCalledWith(key, JSON.stringify(value));
  expect(mockAdapter.set).toHaveBeenCalledTimes(1);
  expect(result).toBeTruthy();
});
```

### 3. **Avoid Test Interdependence**

```typescript
// ✅ Good - Each test is independent
beforeEach(() => {
  service = new StorageService(createMockAdapter());
});

// ❌ Bad - Tests depend on execution order
let service; // Shared state
it('test 1', () => {
  service = new StorageService();
});
it('test 2', () => {
  service.doSomething();
}); // Depends on test 1
```

### 4. **Use Fixtures for Complex Data**

```typescript
// ✅ Good - Reusable fixtures
import { mockUserProfile } from './fixtures/test-data';

// ❌ Bad - Inline complex objects in every test
const profile = { id: '123', name: 'John', email: 'john@example.com', ... };
```

---

## 🔄 Continuous Integration

Tests run automatically on:

- Git commits (pre-commit hook - optional)
- Pull requests
- Main branch pushes

Add to `package.json`:

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:ci": "jest --ci --coverage --maxWorkers=2"
  }
}
```
