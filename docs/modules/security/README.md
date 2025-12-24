# Security Service

Lightweight jailbreak/root detection service for UpTodo app.

## Overview

The Security Service provides device security checks to detect compromised devices (jailbroken iOS or rooted Android). It uses the `jail-monkey` library for minimal overhead and reliable detection.

## Features

- **Jailbreak/Root Detection** - Detects compromised devices
- **Location Mocking Detection** (Android) - Detects fake GPS
- **Debug Mode Detection** - Identifies apps running in debug mode
- **External Storage Detection** (Android) - Checks if app is on SD card
- **Comprehensive Security Check** - All-in-one security validation
- **Minimal Performance Impact** - Synchronous checks, no network calls
- **Platform-Specific** - iOS and Android specific checks

## Usage

### Basic Jailbreak/Root Check

```typescript
import { securityService } from '@/modules/services/security';

const isCompromised = securityService.isJailbroken();
if (isCompromised) {
  console.warn('Device is jailbroken/rooted');
}
```

### Get Complete Security Status

```typescript
const status = securityService.getSecurityStatus();

console.log(status);
// {
//   isJailbroken: false,
//   canMockLocation: false,
//   isDebuggedMode: false,
//   isOnExternalStorage: false,
//   trustFall: false
// }
```

### Check Device Security for Sensitive Operations

```typescript
const isSecure = securityService.isDeviceSecure();

if (isSecure) {
  // Proceed with biometric authentication
  await performSensitiveOperation();
} else {
  // Show warning or restrict access
  showSecurityWarning();
}
```

### Show Security Warning to User

```typescript
const warning = securityService.getSecurityWarning();

if (warning) {
  Alert.alert('Security Warning', warning);
}
```

## API Reference

### Methods

#### `isJailbroken(): boolean`

Detects if device is jailbroken (iOS) or rooted (Android).

**Returns:** `true` if device is compromised

---

#### `canMockLocation(): boolean`

Checks if app can mock location (Android only).

**Returns:** `true` if location mocking is possible
**Note:** Always returns `false` on iOS

---

#### `isDebuggedMode(): boolean`

Detects if app is running in debug mode.

**Returns:** `true` if app is being debugged

---

#### `isOnExternalStorage(): boolean`

Checks if app is installed on external storage (Android only).

**Returns:** `true` if app is on SD card
**Note:** Always returns `false` on iOS

---

#### `trustFall(): boolean`

Comprehensive security check combining all detection methods.

**Returns:** `true` if any security issue is detected

---

#### `getSecurityStatus(): SecurityStatus`

Returns complete security status with all checks.

**Returns:**

```typescript
{
  isJailbroken: boolean;
  canMockLocation: boolean;
  isDebuggedMode: boolean;
  isOnExternalStorage: boolean;
  trustFall: boolean;
}
```

---

#### `isDeviceSecure(): boolean`

Simple check for sensitive operations.

**Returns:** `true` if device passes security checks (not jailbroken)

---

#### `getSecurityWarning(): string | null`

Gets user-friendly warning message.

**Returns:** Warning message or `null` if device is secure

## Integration

### Automatic Security Check

The app automatically checks device security on startup via the `SecurityAlert` component:

```tsx
// src/app.tsx
import { SecurityAlert } from './app/components/security-alert';

function App() {
  return (
    <SafeAreaProvider>
      <SecurityAlert />
      <AppNavigator />
    </SafeAreaProvider>
  );
}
```

**Behavior:**

- Only runs in production builds (skipped in `__DEV__`)
- Shows alert once per app session
- Delays check by 1 second after app load
- Non-blocking (app continues to work)

### Manual Integration

For specific screens or features:

```typescript
import { securityService } from '@/modules/services/security';

const BiometricScreen = () => {
  const [securityWarning, setSecurityWarning] = useState<string | null>(null);

  useEffect(() => {
    const warning = securityService.getSecurityWarning();
    setSecurityWarning(warning);
  }, []);

  const handleBiometricAuth = async () => {
    if (!securityService.isDeviceSecure()) {
      Alert.alert(
        'Security Risk',
        'Biometric auth disabled on compromised devices',
      );
      return;
    }

    await biometricService.authenticate();
  };

  return (
    <View>
      {securityWarning && <WarningBanner message={securityWarning} />}
      <Button onPress={handleBiometricAuth} title="Unlock" />
    </View>
  );
};
```

## Testing

### Run Tests

```bash
npm test security-service.test
```

### Test Coverage

**23 tests covering:**

- Jailbreak/root detection (2 tests)
- Location mocking (3 tests)
- Debug mode detection (2 tests)
- External storage detection (3 tests)
- Comprehensive security check (2 tests)
- Security status retrieval (3 tests)
- Device security validation (2 tests)
- Warning message generation (3 tests)
- Integration scenarios (3 tests)

**Coverage:** 100% of security service code

## Platform-Specific Behavior

### iOS

- ✅ Jailbreak detection
- ✅ Debug mode detection
- ✅ Comprehensive security check
- ❌ Location mocking (not applicable)
- ❌ External storage (not applicable)

### Android

- ✅ Root detection
- ✅ Location mocking detection
- ✅ Debug mode detection
- ✅ External storage detection
- ✅ Comprehensive security check

## Performance

- **Startup Impact:** < 5ms (runs asynchronously after 1s delay)
- **Memory:** Minimal (single service instance)
- **Network:** None (all checks are local)
- **Battery:** Negligible (synchronous checks)

## Security Considerations

### What It Detects

✅ **Common Jailbreak Tools:**

- Cydia, Sileo, Zebra (iOS)
- SuperSU, Magisk, KingRoot (Android)

✅ **System Modifications:**

- Modified system files
- Suspicious binaries
- Hook frameworks (Frida, Xposed)
