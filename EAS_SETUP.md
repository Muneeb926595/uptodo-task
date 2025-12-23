# EAS Setup Guide for UpTodo

## Initial Setup (One-time)

### 1. Install EAS CLI globally

```bash
npm install -g eas-cli
```

### 2. Login to Expo

```bash
eas login
```

Use your Expo account credentials. If you don't have one, create at https://expo.dev/signup

### 3. Configure the project

```bash
# Initialize EAS in your project
eas init

# Follow the prompts:
# - Select "Create a new project" or link to existing
# - Confirm project slug: uptodo
# - Confirm owner
```

### 4. Update app.json with your project ID

After `eas init`, update the `updates.url` in `app.json`:

```json
"updates": {
  "url": "https://u.expo.dev/[YOUR-PROJECT-ID]"
}
```

Find your project ID at: https://expo.dev/accounts/[username]/projects/uptodo/updates

### 5. Configure Android Credentials

```bash
eas credentials

# Select Android
# Select your project
# Choose "Set up a new keystore" or "Use an existing keystore"
# Follow prompts to generate/upload keystore
```

**For CI/CD**, the credentials are automatically managed by EAS. You can view them:

```bash
eas credentials --platform android
```

### 6. Configure iOS Credentials

```bash
eas credentials

# Select iOS
# Select your project
# Choose how to manage credentials:
#   - "Automatic" (recommended) - EAS manages everything
#   - "Manual" - Upload your own certificates
#
# For automatic, you'll need:
# - Apple ID
# - App-specific password (generate at appleid.apple.com)
# - Apple Team ID
```

**For CI/CD**, credentials are managed by EAS. To view:

```bash
eas credentials --platform ios
```

**Note:** You'll need:

- Apple Team ID (find at https://developer.apple.com/account)
- App Store Connect API Key (for auto-submission)

## GitHub Secrets Setup

Go to your GitHub repository → Settings → Secrets and variables → Actions → New repository secret

### Required Secrets

1. **EXPO_TOKEN**

   ```bash
   # Generate token at: https://expo.dev/accounts/[username]/settings/access-tokens
   # Add with name: EXPO_TOKEN
   ```

2. **Android Credentials** (if auto-submitting to Play Store)

   - Get from Google Play Console → API Access
   - Create a service account
   - Download JSON key
   - Base64 encode it: `cat service-account.json | base64`
   - Add as secret: `GOOGLE_SERVICE_ACCOUNT_KEY`

3. **iOS Credentials** (if auto-submitting to App Store)
   - `APPLE_TEAM_ID`: Your Apple Developer Team ID
   - `ASC_APP_ID`: Your App Store Connect App ID (find in App Store Connect)
   - `APPLE_ID`: Your Apple ID email
   - `APPLE_APP_SPECIFIC_PASSWORD`: Generate at appleid.apple.com

### GitHub Environments

Create environments for protection rules:

1. Go to Settings → Environments
2. Create three environments:

   - `test`
   - `staging`
   - `production`

3. For `production`, add:
   - Required reviewers (recommended)
   - Wait timer (optional)
   - Deployment branches: `main`, `production`

## Install Required Dependencies

```bash
# Install EAS dependencies
npm install --save-dev expo-build-properties

# For EAS Updates
npm install expo-updates

# Update dependencies
npm install
```

## Configure Native Projects

### Android (android/app/build.gradle)

Ensure you have proper version configuration:

```gradle
android {
    defaultConfig {
        versionCode 1
        versionName "1.0.0"
    }
}
```

### iOS (ios/UpTodo/Info.plist)

Add EAS Update configuration:

```xml
<key>EXUpdatesURL</key>
<string>https://u.expo.dev/[YOUR-PROJECT-ID]</string>
<key>EXUpdatesRuntimeVersion</key>
<string>1.0.0</string>
```

## First Build Test

### Test local build (optional):

```bash
# Android
eas build --platform android --profile development --local

# iOS
eas build --platform ios --profile development --local
```

### Cloud build:

```bash
# Android
eas build --platform android --profile test

# iOS
eas build --platform ios --profile test
```

## Verify Setup

1. **Check EAS configuration:**

   ```bash
   eas config
   ```

2. **Check project status:**

   ```bash
   eas project:info
   ```

3. **Validate build profiles:**

   ```bash
   cat eas.json
   ```

4. **Test update publish:**
   ```bash
   eas update --branch development --message "Test update"
   ```

## Troubleshooting

### "Project not configured"

- Run `eas init` again
- Verify `app.json` has correct `expo.updates.url`

### "Credentials not found"

- Run `eas credentials` to configure
- For production, ensure proper certificates

### "Build failed: dependency conflict"

- Check React Native version compatibility
- Update `eas.json` build properties if needed

### "Cannot publish update"

- Verify project ID in `app.json`
- Check `EXPO_TOKEN` secret is set
- Ensure branch name matches channel

## Next Steps

1. ✅ Complete this setup guide
2. ✅ Test local build
3. ✅ Test cloud build on EAS
4. ✅ Configure GitHub secrets
5. ✅ Push to `develop` branch to test CI/CD
6. ✅ Review DEPLOYMENT.md for workflow details

## Useful Commands

```bash
# View builds
eas build:list

# View specific build
eas build:view [BUILD_ID]

# View updates
eas update:list --branch production

# Configure credentials
eas credentials

# View project info
eas project:info

# View current configuration
eas config

# Clear cache (if issues)
eas build:clear-cache
```
