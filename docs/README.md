# UpTodo - Complete Application Documentation

## 📱 Application Overview

**UpTodo** is a modern, production-ready React Native task management application built with React Native's New Architecture. The app follows enterprise-level coding standards with a modular, scalable architecture designed for maintainability and testability.

## 🎬 App Demos

Get a quick look at the app in action:

- [**Full App Demo**](https://drive.google.com/file/d/1iI1Hw9Yl9Y5NsSuda_95as74AZf05b8U/view?usp=sharing) - Complete walkthrough of all features
- [**Notification & Translation Demo**](https://drive.google.com/file/d/13PgGmIoA7Q4KOpdWeRcyUejicb0kmmwy/view?usp=sharing) - See notifications and multi-language support
- [**Delete, Import & Export Demo**](https://drive.google.com/file/d/1_32ZOw1vQmJGgNe6ava3l0bXs661sy5M/view?usp=sharing) - Data management features

## 🚀 Quick Start

#### Platform-Specific Requirements

**For iOS Development:**

- **Xcode**: >= 26.0
- **iOS Simulator**: Xcode 26+ includes iOS 17 simulator
- **macOS**: Latest

**For Android Development:**

- **Android Studio**: Latest version
- **JDK**: 17 (comes with Android Studio)
- **Android SDK**: API Level 34 (Android 14)
- **Android Emulator**: Set up through Android Studio AVD Manager

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/Muneeb926595/uptodo-task.git
cd uptodo-task
```

#### 2. Install Dependencies

```bash
# Using npm
npm install

# Using yarn (recommended)
yarn install
```

#### 3. Install iOS Dependencies (macOS only)

```bash
cd ios
pod install
cd ..
```

### Running the Application

#### iOS

```bash
# Start Metro bundler
npm start
# or
yarn start

# In a new terminal, run iOS
npm run ios
# or
yarn ios

# Run on specific simulator
npx react-native run-ios --simulator="iPhone 17 Pro"
```

#### Android

```bash
# Start Metro bundler
npm start
# or
yarn start

# In a new terminal, run Android
npm run android
# or
yarn android

# Run on specific emulator (if multiple devices)
npx react-native run-android
```

## 🛠 Technology Stack

### Core Framework

- **React Native**: 0.83.0 (Latest with New Architecture support)
- **React**: 19.2.0
- **TypeScript**: 5.8.3
- **Node**: >= 20

### State Management

- **@reduxjs/toolkit**: 2.11.2 - For app-level state (auth, focus mode)
- **@tanstack/react-query**: 5.90.12 - For server state and data caching
- **Hybrid Approach**: Redux for UI state, React Query for data fetching

### Navigation

- **@react-navigation/native**: 7.1.25
- **@react-navigation/native-stack**: 7.8.6
- **@react-navigation/bottom-tabs**: 7.8.12

### Storage & Persistence

- **react-native-mmkv**: 4.1.0 - High-performance key-value storage
- **react-native-fs**: 2.20.0 - File system operations

### UI & Styling

- **react-native-unistyles**: 3.0.20 - Type-safe theming system
- **react-native-reanimated**: 4.2.0 - Advanced animations
- **react-native-gesture-handler**: 2.29.1 - Touch handling
- **@gorhom/bottom-sheet**: 5.2.8 - Bottom sheet modals
- **react-native-magic-modal**: 6.1.0 - Modal management

### Platform Integrations

- **@notifee/react-native**: 9.1.8 - Local notifications
- **react-native-biometrics**: 3.0.1 - Biometric authentication
- **react-native-image-picker**: 8.2.1 - Image selection
- **react-native-compressor**: 1.13.0 - Image compression
- **react-native-calendars**: 1.1313.0 - Calendar UI
- **react-native-date-picker**: 5.0.13 - Date/time picker

### Internationalization

- **i18next**: 25.7.3
- **react-i18next**: 16.5.0
- **react-native-localize**: 3.6.0

### Development & Testing

- **Jest**: 29.6.3 - Testing framework
- **ESLint**: 8.19.0 - Code linting
- **Prettier**: 2.8.8 - Code formatting
- **Babel**: 7.25.2 - JavaScript compiler

---

## 🏗 Architecture & Design Patterns

### Architectural Pattern: **Feature-Sliced Modular Architecture**

The application follows a clean, modular architecture where each feature is self-contained with clear separation of concerns:

```
src/
├── app/                    # App-level infrastructure
│   ├── components/         # Reusable UI components
│   ├── navigation/         # Navigation configuration
│   ├── services/          # App-wide service configs (React Query, RTK)
│   ├── stores/            # Redux store setup
│   ├── theme/             # Theming system
│   ├── utils/             # Shared utilities
│   └── localisation/      # i18n configuration
│
└── modules/               # Feature modules
    ├── auth/              # Authentication module
    ├── todo/              # Task management
    ├── categories/        # Category management
    ├── focus/             # Focus mode/Pomodoro
    ├── profile/           # User profile & settings
    └── services/          # Domain services (Storage, Biometric, etc.)
```

### Design Patterns Applied

#### 1. **Repository Pattern**

Each domain module has a repository layer that abstracts data access:

```
auth/repository/auth-repository.ts
todo/repository/todo-repository.ts
categories/repository/categories-repository.ts
focus/repository/focus-repository.ts
```

**Benefits**:

- Decouples business logic from data sources
- Easy to mock for testing
- Supports multiple data sources (local + remote)

#### 2. **Adapter Pattern**

Services use adapters to abstract platform-specific implementations:

```
services/
├── storage/
│   ├── storage-adapter.ts           # Interface
│   ├── mmkv-adapter.ts             # MMKV implementation
│   └── storage-service.ts          # High-level service
├── biometric/
│   ├── biometric-adapter.ts        # Interface
│   └── react-native-biometrics-adapter.ts
└── media/
    ├── media-adapter.ts            # Interface
    └── react-native-image-picker-adapter.ts
```

**Benefits**:

- Easy to swap implementations (e.g., MMKV → AsyncStorage)
- Platform-agnostic business logic
- Excellent testability with mock adapters

#### 3. **Query Key Factory Pattern**

Centralized query key management for React Query:

```typescript
// todo/react-query/keys.ts
export const todosKeys = {
  all: () => ['todos'] as const,
  lists: () => [...todosKeys.all(), 'list'] as const,
  listByDate: (date: number) => [...todosKeys.lists(), date] as const,
  details: (id: string) => [...todosKeys.all(), 'detail', id] as const,
};
```

**Benefits**:

- Consistent cache invalidation
- Type-safe query keys
- Easy refactoring

#### 4. **Service Layer Pattern**

High-level services encapsulate complex business logic:

- `BiometricService`: Authentication flows
- `NotificationService`: Smart scheduling with focus mode integration
- `MediaService`: Image picking, compression, upload pipeline
- `ImportExportService`: Backup/restore functionality

#### 5. **Hooks-Based Architecture**

React Query hooks provide data access layer:

```typescript
// Clean, composable data fetching
const { data: todos } = useTodos();
const createTodo = useCreateTodo();
const updateTodo = useUpdateTodo();
```

---

## Code Quality & Testing

### Test Coverage: **70%+**

The project maintains a high standard of test coverage with strict thresholds:

```javascript
coverageThreshold: {
  global: {
    branches: 70,
    functions: 70,
    lines: 70,
    statements: 70,
  },
}
```

### Testing Strategy

#### 1. **AAA Pattern (Arrange-Act-Assert)**

All tests follow this clear, readable structure:

```typescript
it('should authenticate successfully', async () => {
  // Arrange - Set up test data and mocks
  const mockAdapter = createMockAdapter();

  // Act - Execute the code under test
  const result = await service.authenticate();

  // Assert - Verify the outcome
  expect(result.success).toBe(true);
});
```

#### 2. **Comprehensive Test Suites**

**Service Layer Tests (130+ tests)**:

- Storage Service (30+ tests) - CRUD operations, error handling
- Notification Service (23+ tests) - Scheduling, focus mode integration
- Biometric Service (12+ tests) - Authentication, availability checks
- Media Service (8+ tests) - Image picking, compression
- Import/Export Service - Backup/restore functionality
- Error Handler (15+ tests) - Global error handling

**Repository Layer Tests (87+ tests, 95%+ coverage)**:

- Auth Repository (10 tests, 100% coverage)
- Categories Repository (20 tests, 96% coverage)
- Todo Repository (22 tests, 85% coverage)
- Focus Repository (15 tests, 100% coverage)
- Profile Repository (20 tests, 100% coverage)

**Adapter Tests (73+ tests)**:

- MMKV Adapter (30 tests)
- Notifee Adapter (23 tests)
- Image Picker Adapter (8 tests)
- Biometrics Adapter (12 tests)

#### 3. **Test Fixtures & Reusability**

Tests use shared fixtures for consistency:

```
__tests__/
├── fixtures/
│   └── storage-test-data.ts
└── *.test.ts
```

#### 4. **Mocking Strategy**

- External dependencies mocked at module level
- Mock factories for adapters
- Isolated unit tests with `jest.clearAllMocks()`

---

## ⚙️ Services Layer

### 1. **Storage Service** (`src/modules/services/storage/`)

**Purpose**: Centralized, type-safe key-value storage

**Implementation**: MMKV (high-performance, encrypted)

**Features**:

- Type-safe storage keys (enum-based)
- JSON serialization/deserialization
- Error handling with fallbacks
- Async API for consistency

**Usage**:

```typescript
// Type-safe keys
await storageService.setItem(StorageKeys.USER_PROFILE, profile);
const profile = await storageService.getItem(StorageKeys.USER_PROFILE);
await storageService.removeItem(StorageKeys.ACCESS_TOKEN);
await storageService.clearAll();
```

**Performance Characteristics**:

- **Fast**: Synchronous native operations (wrapped in async API)
- **Encrypted**: Built-in encryption
- **Small footprint**: ~30KB library
- **Cross-platform**: iOS/Android consistency

**Strengths**:

- Adapter pattern enables easy swapping (AsyncStorage, SQLite, etc.)
- Centralized key management prevents typos

---

### 2. **Biometric Service** (`src/modules/services/biometric/`)

**Purpose**: Biometric authentication (Face ID, Touch ID, Fingerprint)

**Features**:

- Availability detection
- Biometric type detection (Face ID vs Touch ID vs Fingerprint)
- User-friendly prompts
- Error handling with alerts
- Platform-specific behavior

**Usage**:

```typescript
const isAvailable = await biometricService.isAvailable();
const type = await biometricService.getBiometricType(); // FACE_ID, TOUCH_ID, FINGERPRINT
const result = await biometricService.authenticate();
```

**Strengths**:

- Clean service layer abstracts platform differences
- Good error handling with user feedback
- Adapter pattern enables testing

---

### 3. **Notification Service** (`src/modules/services/notifications/`)

**Purpose**: Local notification scheduling with focus mode integration

**Features**:

- Schedule notifications for todos
- Reschedule on todo update
- Cancel notifications
- **Focus mode integration**:
- Suppress notifications during focus sessions
- Save suppressed notification details
- Restore notifications when focus ends
- Smart filtering (only future notifications)
- Permission handling
- Resync all notifications

**Usage**:

```typescript
// Basic operations
const notifId = await notificationService.scheduleForTodo(todo);
await notificationService.rescheduleTodo(todo);
await notificationService.cancelForTodo(todo);

// Focus mode
await notificationService.suppressNotifications(todos, focusEndTime);
await notificationService.restoreNotifications();
```

**Strengths**:

- **Smart suppression**: Only suppresses notifications that would fire during focus
- Persistent: Suppressed state survives app restarts
- Integration with todo lifecycle (create/update/delete)

---

### 4. **Media Service** (`src/modules/services/media/`)

**Purpose**: Image picking, compression, and upload pipeline

**Features**:

- Image picker (gallery/camera)
- Automatic compression
- FormData generation for uploads
- Temporary → permanent file persistence
- Customizable compression options

**Usage**:

```typescript
// Pick and compress
const image = await mediaService.pickAndCompress();

// Full pipeline: pick → compress → upload
const { uploadedUrl } = await mediaService.pickCompressAndUpload({
  uploader: async file => {
    const formData = mediaService.createImageFormData(file);
    const { url } = await api.upload(formData);
    return url;
  },
});
```

**Strengths**:

- Clean pipeline with composable operations
- Adapter pattern for different image pickers
- Good compression (reduces file sizes significantly)

---

### 5. **Import/Export Service** (`src/modules/services/import-export/`)

**Purpose**: Backup and restore todo data

**Features**:

- Export todos + categories to JSON
- Import from JSON file
- Data validation
- Version management
- Platform-specific file handling (iOS share, Android downloads)
- Duplicate detection

**Export Format**:

```json
{
  "version": "1.0",
  "exportDate": 1234567890,
  "todos": [...],
  "categories": [...]
}
```

**Strengths**:

- Version field enables future migration support
- Clean data (removes derived fields)
- Platform-appropriate UX

---

### 6. **Error Handler** (`src/modules/services/error-handler/`)

**Purpose**: Centralized error handling and user feedback

**Features**:

- Global error interception
- User-friendly error messages
- Error categorization
- Logging integration
- React Query integration

**Strengths**:

- Prevents cryptic error messages
- Centralized error policies
- Integration with React Query error handling

---

## 🔄 State Management

### Hybrid Approach: Redux + React Query

The app uses a **smart dual-state management** strategy:

### **Redux Toolkit** → App State

**Used for**: Synchronous, long-lived UI state

**Examples**:

- `auth.user` - Current user session
- `auth.isAuthenticated` - Auth status
- `focus.isActive` - Focus mode status
- `focus.notificationsSuppressed` - Notification state

**Benefits**:

- Persists across app lifecycle
- No automatic refetching
- Single source of truth for app behavior
- Predictable, synchronous updates

### **TanStack Query (React Query)** → Data State

**Used for**: Server data, cache management, async operations

**Examples**:

- `useTodos()` - Todo list
- `useCategories()` - Categories
- `useFocusStats()` - Focus statistics
- `useLogin()` - Authentication mutation

**Benefits**:

- Automatic background refetching
- Built-in loading/error states
- Optimistic updates
- Garbage collection
- Query invalidation

### Decision Matrix

```
Store in Redux if:
 Controls navigation/access
 Represents identity/session
 Must exist before API calls
 Should NOT refetch automatically
 Should NOT be garbage-collected
 Is mostly synchronous
 Is global UI configuration

Store in React Query if:
 Comes from server/async source
 Should refetch on focus/reconnect
 Can be garbage-collected
 Has loading/error states
 Benefits from caching
 Needs optimistic updates
```

### Integration Points

```typescript
// Login: Updates both Redux and React Query
const { mutateAsync: login } = useLogin();

// Behind the scenes:
onSuccess: user => {
  // Update React Query cache
  queryClient.setQueryData(authKeys.user(), user);

  // Update Redux state
  dispatch(setUser(user));
};
```

**Strengths**:

- Clear separation of concerns
- Best tool for each job
- Reduces Redux boilerplate for data fetching
- Better developer experience

---

## 🎨 Theming & UI

### Unistyles v3 - Type-Safe Theming

**Features**:

- 5 pre-built themes (Purple Dream, Ocean Blue, Forest Green, Sunset Orange, Rose Pink)
- Type-safe theme access
- Dynamic theme switching with animation
- Dark mode support
- Responsive breakpoints

**Implementation**:

```typescript
const { theme } = useTheme();
<View style={{ backgroundColor: theme.colors.brand.DEFAULT }} />;
```

**Strengths**:

- Compile-time type checking
- No runtime theme prop drilling
- Smooth theme transitions
- Centralized theme definitions

---

## 🚀 Performance Analysis

### Strengths

#### 1. **MMKV Storage**

- **10-30x faster** than AsyncStorage
- Synchronous operations (no async overhead)
- Encrypted by default
- Small memory footprint

#### 2. **React Query Optimizations**

```javascript
staleTime: 1000 * 30,        // 30s - Reduces unnecessary refetches
refetchOnWindowFocus: true,  // Smart background updates
refetchOnReconnect: true,    // Auto-sync on reconnect
retry: 2,                    // Resilient to transient failures
```

#### 3. **Smart Polling**

```typescript
// Focus timer only polls when active
refetchInterval: data => (!data ? false : 10000);
```

#### 4. **Image Compression**

- Automatic compression before upload
- Configurable quality settings
- Significant bandwidth savings

#### 5. **Efficient Navigation**

- Native stack navigation (faster than JS-based)
- Lazy screen loading
- Navigation state persistence

#### 6. **Reanimated Worklets**

- Animations run on UI thread (60fps)
- Smooth gesture handling
- No JS bridge for animations

### Performance Monitoring

**Key Metrics:**

- App startup: < 2 seconds
- Screen transitions: 60fps
- Todo list rendering (1000+ items): Smooth scrolling
- Data export (1500 todos): < 5 seconds
- Notification scheduling: < 10 seconds for 1500 items
