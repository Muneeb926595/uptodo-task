# Biometric Service

Secure biometric authentication service for UpTodo app following the adapter pattern.

## Usage

### Check Availability

```typescript
import { biometricService } from '@/modules/services/biometric';

const isAvailable = await biometricService.isAvailable();
if (isAvailable) {
  const type = await biometricService.getBiometricTypeName();
  console.log(`${type} is available`); // "Face ID", "Touch ID", "Fingerprint"
}
```

### Authenticate User

```typescript
const result = await biometricService.authenticate();

if (result.success) {
  // User authenticated successfully
  unlockApp();
} else {
  // Authentication failed
  console.error(result.error);
}
```

### Enable App Lock

```typescript
const canEnable = await biometricService.promptToEnable();

if (canEnable) {
  const type = await biometricService.getBiometricTypeName();
  await profileRepository.enableAppLock(type);
}
```

## Platform Support

### iOS

- Face ID (iPhone X and later)
- Touch ID (iPhone 5s to iPhone SE 2nd gen)
- Fallback to passcode

### Android

- Fingerprint (Android 6.0+)
- Face unlock (Android 10+)
- Fallback to PIN/password
