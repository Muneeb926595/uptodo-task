# Focus Module 🎯

**Purpose**
The Focus Mode module helps users stay productive by providing timed focus sessions with automatic notification suppression and detailed focus statistics.

## Features

### Implemented

1. **Focus Sessions**

   - Start/stop focus sessions with customizable duration (default: 30 minutes)
   - Real-time countdown timer with animated circular progress
   - Persistent sessions that survive app restarts
   - Auto-completion when timer reaches zero
   - Confirmation dialog before stopping a session

2. **Notification Management**

   - **Automatic suppression**: All todo notifications are suppressed when focus mode starts
   - **Safe storage**: Notification details are saved before suppression
   - **Smart restoration**: Notifications are restored when focus ends or is canceled
   - **Future-proof**: Only notifications with future timestamps are restored
   - **Persistent**: Suppressed state survives app restarts

3. **Session Tracking**

   - All completed focus sessions are saved
   - Track total duration per session
   - Session history with timestamps

4. **Statistics & Analytics**

   - Weekly overview with bar chart visualization
   - Daily focus time tracking
   - Highlights current day in the chart
   - Total sessions count

5. **State Management**

   - Redux for app-level focus state
   - React Query for data persistence and caching
   - MMKV storage for fast, encrypted local persistence

6. **UI/UX**
   - Smooth animated timer with progress ring
   - Responsive design following app patterns
   - Dark theme support
   - Scrollable content with applications section

## Architecture

### File Structure

```
focus/
├── repository/
│   ├── focus-repository.ts    # Data layer - MMKV persistence
│   └── index.ts
├── react-query/
│   ├── hooks.ts                # React Query hooks
│   ├── keys.ts                 # Query key factory
│   └── index.ts
├── store/
│   └── focusSlice.ts          # Redux state management
└── view/
    └── screens/
        └── focus-screen/
            ├── index.tsx       # Main screen component
            └── styles.ts       # Themed styles
```

### Data Flow

1. **Start Focus Session**

   ```
   User taps "Start Focusing"
   → useStartFocus mutation
   → focusRepository.createSession()
   → Save to MMKV
   → Update Redux state
   → Update React Query cache
   ```

2. **Active Session**

   ```
   useActiveSession query polls every 1s
   → Calculate time remaining
   → Update progress animation
   → Auto-complete when timer reaches 0
   ```

3. **Statistics**
   ```
   useFocusStats query
   → focusRepository.getStats()
   → Aggregate sessions by day
   → Display in bar chart
   ```

## Storage Keys

Added to `/src/modules/services/storage/storage-service.ts`:

- `FOCUS_SESSIONS`: Record<string, FocusSession> - All focus sessions
- `ACTIVE_FOCUS_SESSION`: FocusSession | null - Currently active session
- `SUPPRESSED_NOTIFICATIONS`: SavedNotification[] - Notifications suppressed during focus mode

## Types

### FocusSession

```typescript
{
  id: string; // Unique identifier
  startTime: number; // Timestamp when started
  endTime: number; // Timestamp when should end
  duration: number; // Duration in seconds
  completed: boolean; // Whether session completed successfully
  createdAt: number; // Creation timestamp
}
```

### SavedNotification (NotificationService)

```typescript
{
  id: string; // Notification ID
  todoId: string; // Associated todo ID
  title: string; // Notification title
  body?: string; // Notification body
  timestamp: number; // Scheduled timestamp
}
```

### FocusStats

```typescript
{
  today: number;           // Total seconds today
  thisWeek: number[];      // 7 days, seconds per day (Sun-Sat)
  totalSessions: number;   // Total completed sessions
}
```

## API

### React Query Hooks

- `useActiveSession()` - Get current active session, polls every 1s
- `useFocusStats()` - Get weekly and daily statistics
- `useStartFocus()` - Start a new focus session (suppresses notifications)
- `useStopFocus()` - Complete active session (restores notifications)
- `useCancelFocus()` - Cancel active session without saving (restores notifications)

### Redux Selectors

```typescript
const isActive = useSelector((state: RootState) => state.focus.isActive);
const duration = useSelector((state: RootState) => state.focus.duration);
const notificationsSuppressed = useSelector(
  (state: RootState) => state.focus.notificationsSuppressed,
);
```

### NotificationService Methods

- `suppressNotifications(todos)` - Cancel all notifications and save for later
- `restoreNotifications()` - Restore previously suppressed notifications
- `areNotificationsSuppressed()` - Check if notifications are currently suppressed

## Notification Flow

```
Start Focus Mode:
1. User taps "Start Focusing"
2. todoRepository.getAll() retrieves all todos
3. notificationService.suppressNotifications(todos)
   → Get currently scheduled notification IDs
   → Filter and map to SavedNotification objects
   → Save to MMKV (SUPPRESSED_NOTIFICATIONS)
   → Cancel all notifications via notifee
4. focusRepository.createSession()
5. Redux state updated (isActive: true)

Stop/Cancel Focus Mode:
1. User taps "Stop" or timer reaches 0
2. focusRepository.completeSession() or cancelActiveSession()
3. notificationService.restoreNotifications()
   → Read SUPPRESSED_NOTIFICATIONS from MMKV
   → Reschedule each valid notification (timestamp > now)
   → Clear SUPPRESSED_NOTIFICATIONS from storage
4. Redux state updated (isActive: false)
```

## Complete Flow Documentation

### Flow 1: Normal Focus Session (User Stays in App)

#### Starting Focus Mode:

```
1. User taps "Start Focusing" with 30min duration
2. useStartFocus() mutation called
3. focusRepository.createSession(1800) // 1800 seconds
4. Creates FocusSession and saves to MMKV:
   - FOCUS_SESSIONS[id] = session
   - ACTIVE_FOCUS_SESSION = session
5. todoRepository.getAll() → gets all todos
6. notificationService.suppressNotifications(todos, session.endTime)
   - Filters notifications that would fire DURING focus (now < dueDate <= endTime)
   - Saves to SUPPRESSED_NOTIFICATIONS in MMKV
   - Cancels only those specific notifications
   - Notifications AFTER focus session remain scheduled
7. Updates React Query cache and Redux state
8. UI shows timer counting down
```

#### While Focus is Active:

```
1. useActiveSession() polls every 1 second (only when focus screen mounted)
2. focusRepository.getActiveSession() reads from MMKV
3. Checks if session.endTime > Date.now()
   - TRUE → returns session, timer continues
   - FALSE → triggers cleanup (see "Timer Expires" flow)
4. Focus screen updates countdown and progress ring
```

#### Stopping Focus Manually:

```
1. User taps "Stop Focusing" → confirmation dialog
2. useStopFocus({ completed: true }) called
3. focusRepository.completeSession(sessionId, true)
   - Updates session.completed = true in FOCUS_SESSIONS
   - Removes ACTIVE_FOCUS_SESSION
   - Calls notificationService.restoreNotifications()
4. restoreNotifications():
   - Reads SUPPRESSED_NOTIFICATIONS from MMKV
   - For each notification where timestamp > now: reschedules via Notifee
   - Past notifications are skipped (user was focused, missed them intentionally)
   - Clears SUPPRESSED_NOTIFICATIONS
5. Updates React Query cache (invalidates stats) and Redux
6. UI shows "Start Focusing" button
```

### Flow 2: Timer Expires (User Stays in App)

```
1. useActiveSession() polls and detects session.endTime <= Date.now()
2. focusRepository.getActiveSession() triggers cleanup:
   - Calls completeSession(session.id, false) // auto-completed
   - Restores notifications (same as manual stop)
3. Returns null → focus screen detects session ended
4. Shows alert: "Focus session completed!"
5. Stats updated, UI resets
```

### Flow 3: App Closed During Focus (Reopened Before Timer Expires)

#### Closing App:

```
1. User closes app while focus is active
2. MMKV persists to disk:
   - ACTIVE_FOCUS_SESSION
   - SUPPRESSED_NOTIFICATIONS
   - FOCUS_SESSIONS
3. Suppressed notifications remain canceled
4. Future notifications (after focus session) remain scheduled
```

#### Reopening App:

```
1. App launches → app.tsx runs initAppAssets()
2. Calls focusRepository.getActiveSession()
3. Checks: session.endTime > Date.now() → TRUE (time remaining)
4. Returns session (no cleanup needed)
5. User can navigate anywhere:
   - If visits focus screen: timer shows correct remaining time
   - If doesn't visit: session continues in background
6. When timer expires or user stops: notifications restored normally
```

### Flow 4: App Closed, Timer Expires While Closed ⭐ CRITICAL

#### Scenario:

```
Day 1, 2:00 PM: Start 30min focus (ends 2:30 PM)
Day 1, 2:10 PM: Close app
Day 1, 2:30 PM: Timer expires (app closed, no code runs)
Day 1, 3:00 PM: Todo notification scheduled → fires normally  (was never suppressed)
Day 2, 10:00 AM: Another todo → fires normally
Day 3, 9:00 AM: User opens app
```

#### What Happens:

```
1. App launches → initAppAssets()
2. focusRepository.getActiveSession()
3. Reads ACTIVE_FOCUS_SESSION from MMKV
4. Checks: session.endTime (2:30 PM Day 1) > now (9:00 AM Day 3) → FALSE
5. Triggers cleanup:
   - completeSession(session.id, false)
   - Updates FOCUS_SESSIONS: completed = false
   - Removes ACTIVE_FOCUS_SESSION
   - Calls restoreNotifications()
6. restoreNotifications():
   - Reads SUPPRESSED_NOTIFICATIONS (only notifications from 2:00-2:30 PM Day 1)
   - All timestamps are in the past → skips rescheduling (intentionally missed)
   - Clears SUPPRESSED_NOTIFICATIONS
7. User navigates anywhere → app works normally
8. All future notifications (Day 1 3:00 PM onwards) were NEVER suppressed
```

**Key Fix:** Only notifications that would fire DURING focus session are suppressed. Notifications scheduled after focus ends remain active, so users don't miss notifications days later.

### Flow 5: Multiple Sessions in One Day

```
1. Morning: 9:00 AM - 9:30 AM focus
   - Suppresses notifications for 9:00-9:30 AM
   - Restores at 9:30 AM
2. Afternoon: 2:00 PM - 2:45 PM focus
   - Suppresses notifications for 2:00-2:45 PM
   - Previous SUPPRESSED_NOTIFICATIONS overwritten
   - Restores at 2:45 PM
3. Each session independent, no conflicts
```

## Edge Cases Handled

### Edge Case 1: No Todos Exist

```
suppressNotifications([], endTime) → empty array → no cancellations
restoreNotifications() → empty array → does nothing
```

### Edge Case 2: Notification Scheduled During Focus

```
1. Focus active (2:00 PM - 2:30 PM)
2. User creates todo due at 3:00 PM
3. Notification gets scheduled immediately (3:00 PM > 2:30 PM)
4. NOT suppressed because it's after focus ends
5. When focus ends: only pre-existing suppressed notifications restored
6. New 3:00 PM notification fires normally
```

### Edge Case 3: Todo Completed During Focus

```
1. Focus active with notification suppressed
2. User marks todo complete
3. Todo repository filters it out
4. When focus ends: restoreNotifications() won't reschedule (not in list)
```

### Edge Case 4: Long Focus Session (2+ hours)

```
1. Focus: 2:00 PM - 4:30 PM
2. Todos due at: 2:15 PM, 2:45 PM, 3:30 PM, 5:00 PM
3. Suppressed: 2:15, 2:45, 3:30 (during focus)
4. NOT suppressed: 5:00 PM (after focus)
5. At 4:30 PM: tries to restore 2:15, 2:45, 3:30
   - All in past → skipped (user was focused, intentional)
6. 5:00 PM notification fires normally
```

### Edge Case 5: App Force Killed

```
Same as Flow 4 - MMKV persists to disk
Next launch triggers cleanup via app.tsx
```

## Storage State Examples

### Before Focus:

```javascript
ACTIVE_FOCUS_SESSION = null;
SUPPRESSED_NOTIFICATIONS = null;
FOCUS_SESSIONS = {
  /* previous sessions */
};
```

### During Focus (2:00 PM - 2:30 PM):

```javascript
ACTIVE_FOCUS_SESSION = {
  id: "focus_1734616200000",
  startTime: 1734616200000, // 2:00 PM
  endTime: 1734618000000,   // 2:30 PM
  duration: 1800,
  completed: false,
  createdAt: 1734616200000
}

SUPPRESSED_NOTIFICATIONS = [
  {
    id: "todo_123",
    todoId: "todo_123",
    title: "Todo Due",
    body: "Buy groceries",
    timestamp: 1734616800000 // 2:10 PM - DURING focus
  },
  {
    id: "todo_456",
    todoId: "todo_456",
    title: "Todo Due",
    body: "Call doctor",
    timestamp: 1734617400000 // 2:20 PM - DURING focus
  }
  // Note: 3:00 PM notification NOT in this list
]

FOCUS_SESSIONS = {
  "focus_1734616200000": { completed: false, ... }
}
```

### After Focus Ends:

```javascript
ACTIVE_FOCUS_SESSION = null  (removed)
SUPPRESSED_NOTIFICATIONS = null  (removed)
FOCUS_SESSIONS = {
  "focus_1734616200000": { completed: true, ... }
}
```

## Hook Responsibilities

### `useActiveSession()`

- **When:** Only when focus screen is mounted
- **Frequency:** Polls every 1 second
- **Purpose:** Real-time UI updates (timer, progress)
- **Note:** NOT required for cleanup if user doesn't visit screen

### `useStartFocus()`

- **When:** User taps "Start Focusing"
- **Purpose:** Create session + suppress notifications during session

### `useStopFocus()`

- **When:** User manually stops or timer expires
- **Purpose:** Complete session + restore suppressed notifications

### `useCancelFocus()`

- **When:** User cancels via dialog
- **Purpose:** Mark failed + restore notifications

### `app.tsx` Startup Check

- **When:** Every app launch
- **Purpose:** Safety net - cleanup expired sessions even if user never visits focus screen
- **Critical:** Prevents notification corruption when app closed during focus

## Future Enhancements

### 🚧 Planned Features

1. **Background Task Management**

   - Background task to auto-stop expired sessions when app is closed
   - Notification when focus session completes in background
   - Headless JS task for Android / Background Fetch for iOS

2. **Custom Durations**

   - Preset options (15min, 30min, 1hr, 2hr)
   - Custom duration picker
   - Quick start buttons

3. **App Usage Tracking**

   - Integrate with device usage stats (iOS Screen Time / Android Digital Wellbeing)
   - Track app usage during focus sessions
   - Block distracting apps during focus mode

4. **Advanced Analytics**

   - Monthly/yearly statistics
   - Focus streaks and achievements
   - Productivity insights
   - Export data

5. **Customization**
   - Custom focus goals
   - Break reminders (Pomodoro technique)
   - Focus mode themes/sounds
   - Integration with calendar events

## Usage Example

```tsx
import {
  useStartFocus,
  useActiveSession,
  useFocusStats,
} from '@modules/focus/react-query';

function MyComponent() {
  const { data: activeSession } = useActiveSession();
  const { data: stats } = useFocusStats();
  const startFocus = useStartFocus();

  const handleStart = () => {
    startFocus.mutate(1800); // 30 minutes
  };

  return (
    <View>
      {activeSession ? (
        <Text>Focus active: {activeSession.duration}s remaining</Text>
      ) : (
        <Button onPress={handleStart}>Start Focus</Button>
      )}
      <Text>Today: {stats?.today}s</Text>
    </View>
  );
}
```

## Testing

### Unit Tests (TODO)

- Repository CRUD operations
- Stats aggregation logic
- Redux reducer actions
- Timer calculations

### Integration Tests (TODO)

- Full focus session lifecycle
- Persistence across app restarts
- Query invalidation flows

## Notes

- Focus sessions persist across app restarts via MMKV
- Timer updates every second via React Query polling
- Statistics are calculated on-demand from session history
- Redux state is kept in sync with repository data
- All timestamps are stored in milliseconds (Unix epoch)
