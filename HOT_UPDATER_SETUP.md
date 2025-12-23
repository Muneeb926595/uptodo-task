# Hot Updater Setup - OTA Updates for React Native 🔥

**Successfully installed Hot Updater** - A self-hostable OTA (Over-The-Air) update solution for React Native.

## What is Hot Updater?

Hot Updater is the **modern alternative to CodePush** that gives you complete control over your OTA update infrastructure. Deploy JavaScript bundle updates instantly without going through app stores.

### Why Hot Updater?

- **Self-Hosted**: You control your update infrastructure
- **Plugin System**: Works with Metro, Re.Pack, Expo
- **Storage Options**: AWS S3, Cloudflare R2, Supabase, Firebase, or custom
- **Active Development**: 1.2k GitHub stars, updated 5 days ago
- **Web Console**: Intuitive update management interface
- **Auto Rollback**: Automatically detects crashed bundles and rolls back
- **React Native CLI**: Works with bare React Native (no Expo migration needed)

## Installation Status

All code changes have been completed:

1.  Installed packages: `hot-updater`, `@hot-updater/react-native`, `@hot-updater/firebase`
2.  Configured Babel plugin for bundle ID
3.  Updated Android native code (MainApplication.kt)
4.  Updated iOS native code (AppDelegate.swift)
5.  Wrapped App component with HotUpdater
6.  Installed iOS pods

## Configuration Files Created

### 1. `.env.hotupdater` (NEEDS YOUR INPUT)

This file contains your Firebase credentials. You need to fill in the values:

```env
# Firebase Configuration for Hot Updater
# Follow setup guide: https://hot-updater.dev/docs/managed/firebase

# Firebase Project ID (from Firebase Console)
HOT_UPDATER_FIREBASE_PROJECT_ID=your-project-id

# Firebase Storage Bucket (from Firebase Console - usually <project-id>.appspot.com)
HOT_UPDATER_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com

# Path to your Firebase service account credentials JSON file
# Download from: Firebase Console > Project Settings > Service Accounts > Generate New Private Key
# Example: ./firebase-adminsdk-credentials.json
GOOGLE_APPLICATION_CREDENTIALS=./firebase-adminsdk-credentials.json
```

### 2. `hot-updater.config.ts` (Already created)

Configuration file for Hot Updater that uses Firebase as the storage provider.

## Firebase Setup (Required)

You need to set up Firebase to use Hot Updater:

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use an existing one
3. Note your Project ID

### Step 2: Enable Firebase Storage

1. In Firebase Console, go to **Storage**
2. Click **Get Started**
3. Choose security rules (start in test mode)
4. Note your Storage Bucket name (usually `your-project-id.appspot.com`)

### Step 3: Download Service Account Credentials

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Go to **Service Accounts** tab
3. Click **Generate New Private Key**
4. Save the JSON file as `firebase-adminsdk-credentials.json` in your project root
5. **IMPORTANT**: Add this file to `.gitignore` (already done)

### Step 4: Update `.env.hotupdater`

Fill in the values from the steps above:

```env
HOT_UPDATER_FIREBASE_PROJECT_ID=your-actual-project-id
HOT_UPDATER_FIREBASE_STORAGE_BUCKET=your-actual-project-id.appspot.com
GOOGLE_APPLICATION_CREDENTIALS=./firebase-adminsdk-credentials.json
```

## Alternative Storage Providers

If you don't want to use Firebase, Hot Updater supports other providers:

1. **Supabase** - https://hot-updater.dev/docs/managed/supabase
2. **Cloudflare R2 + D1** - https://hot-updater.dev/docs/managed/cloudflare
3. **AWS S3 + Lambda** - https://hot-updater.dev/docs/managed/aws
4. **Custom Server** - https://hot-updater.dev/docs/self-hosting

To switch providers, run:

```bash
npm uninstall @hot-updater/firebase firebase-admin firebase-tools
npm install @hot-updater/[provider-name] --save-dev
```

Then update `hot-updater.config.ts` accordingly.

## How to Use Hot Updater

### 1. Build Your App (First Time)

Build a release version of your app:

**Android:**

```bash
npm run build:android
# or
cd android && ./gradlew assembleRelease
```

**iOS:**

```bash
npm run build:ios
# or
cd ios && xcodebuild -workspace UpTodo.xcworkspace -scheme UpTodo -configuration Release
```

### 2. Deploy an OTA Update

After making JavaScript changes (no native code changes):

```bash
# Interactive deployment (recommended)
npx hot-updater deploy -i

# Quick deployment
npx hot-updater deploy

# Force update (users must update immediately)
npx hot-updater deploy -i -f
```

### 3. Manage Updates via Web Console

Open the management console:

```bash
npx hot-updater console
```

Features:

- View all deployed updates
- Manage app versions
- Perform rollbacks
- View analytics
- Manage channels (dev, staging, production)

## Update Strategies

Hot Updater is configured to use **"appVersion"** strategy:

- **appVersion**: Updates are compatible with specific app versions (safer)
- **fingerprint**: Uses React Native's built-in fingerprint for auto-compatibility

You can change this in `src/app.tsx`:

```typescript
export default HotUpdater.wrap({
  updateStrategy: 'appVersion', // or 'fingerprint'
  ...
})(App);
```

## Channels

Hot Updater supports channels for different environments:

- **production**: For production releases
- **staging**: For staging/beta testing
- **development**: For development builds

Deploy to specific channels:

```bash
npx hot-updater deploy -c staging
```

## Testing OTA Updates

### On Simulators/Emulators

You need to test in **release mode**:

**iOS:**

```bash
# Build in release mode
cd ios && xcodebuild -workspace UpTodo.xcworkspace -scheme UpTodo -configuration Release -destination 'platform=iOS Simulator,name=iPhone 15'

# Or use EAS Build
eas build --platform ios --profile development
```

**Android:**

```bash
# Build in release mode
cd android && ./gradlew assembleRelease

# Install on device/emulator
adb install app/build/outputs/apk/release/app-release.apk
```

### On Real Devices

Use **EAS Build** to create development builds:

```bash
# iOS
eas build --platform ios --profile development

# Android
eas build --platform android --profile development
```

Then deploy updates:

```bash
npx hot-updater deploy
```

## Workflow with CI/CD

You can integrate Hot Updater with your existing GitHub Actions:

### Example: Deploy on PR merge

```yaml
name: Deploy OTA Update
on:
  push:
    branches: [main, develop]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install dependencies
        run: npm ci --legacy-peer-deps

      - name: Deploy to staging
        if: github.ref == 'refs/heads/develop'
        run: npx hot-updater deploy -c staging
        env:
          GOOGLE_APPLICATION_CREDENTIALS: ${{ secrets.FIREBASE_SERVICE_ACCOUNT }}

      - name: Deploy to production
        if: github.ref == 'refs/heads/main'
        run: npx hot-updater deploy -c production
        env:
          GOOGLE_APPLICATION_CREDENTIALS: ${{ secrets.FIREBASE_SERVICE_ACCOUNT }}
```

## Environment Variables

Add the Firebase service account JSON to your CI/CD secrets:

- GitHub Actions: `FIREBASE_SERVICE_ACCOUNT`
- EAS Secrets: `eas secret:create --name FIREBASE_SERVICE_ACCOUNT --value "$(cat firebase-adminsdk-credentials.json)"`

## Updating baseURL

After your first deployment, you'll get a base URL. Update `src/app.tsx`:

```typescript
export default HotUpdater.wrap({
  baseURL: 'https://your-firebase-function-url/api/check-update',
  // Or use environment variable:
  // baseURL: process.env.HOT_UPDATER_BASE_URL || '',
  ...
})(App);
```

## Important Notes

### What Can Be Updated via OTA?

**Can Update:**

- JavaScript code
- Images (require('...'))
- JSON files
- Styling
- Business logic

❌ **Cannot Update (requires new build):**

- Native code (Kotlin/Swift)
- Native dependencies
- App icons/splash screens
- Native modules
- AndroidManifest.xml / Info.plist changes
- New permissions

### Store Policies

**Apple App Store:**

- OTA updates are allowed for bug fixes and content updates
- ⚠️ Major feature changes may require review
- 📖 Read: https://developer.apple.com/app-store/review/guidelines/#software-requirements

**Google Play Store:**

- OTA updates are generally allowed
- ⚠️ Must not change the primary purpose of the app
- 📖 Read: https://support.google.com/googleplay/android-developer/answer/9888379

### Security

1. **Keep credentials secure**: Never commit `.env.hotupdater` or service account JSON
2. **Use HTTPS**: Always use secure URLs for baseURL
3. **Validate updates**: Test updates thoroughly before production
4. **Monitor rollbacks**: Check the console for automatic rollbacks

## Troubleshooting

### Update not working?

1. Check if you're in release mode (OTA doesn't work in debug)
2. Verify baseURL is correct
3. Check Firebase Storage rules
4. Look at console logs: `npx hot-updater console`

### Build fails?

1. Clean build: `cd android && ./gradlew clean` or `cd ios && rm -rf build`
2. Reinstall pods: `cd ios && pod install`
3. Clear Metro cache: `npm start -- --reset-cache`

### Can't deploy?

1. Check `.env.hotupdater` has correct values
2. Verify Firebase service account credentials
3. Ensure Firebase Storage is enabled
4. Check network/firewall settings

## Documentation

- **Official Docs**: https://hot-updater.dev
- **GitHub**: https://github.com/gronxb/hot-updater
- **Firebase Setup**: https://hot-updater.dev/docs/managed/firebase
- **API Reference**: https://hot-updater.dev/docs/api/react-native

## Next Steps

1.  Set up Firebase (see Firebase Setup section above)
2.  Fill in `.env.hotupdater` with your Firebase credentials
3.  Download and save service account JSON file
4.  Build a release version of your app
5.  Deploy your first OTA update: `npx hot-updater deploy -i`
6.  Test the update on a real device or release build
7.  Open the console: `npx hot-updater console`

---

**Hot Updater is now configured!** 🎉

You have full control over your OTA updates without relying on discontinued services like CodePush.
