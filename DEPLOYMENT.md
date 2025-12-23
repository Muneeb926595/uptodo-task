# Deployment Guide

## Overview

This project uses **EAS (Expo Application Services)** for building and deploying the React Native CLI app. The CI/CD pipeline is powered by GitHub Actions.

## Prerequisites

### 1. EAS CLI Setup

```bash
npm install -g eas-cli
eas login
```

### 2. Required Secrets

Add these secrets to your GitHub repository (Settings → Secrets and variables → Actions):

#### Required for all environments:

- `EXPO_TOKEN`: Your Expo access token (generate at https://expo.dev/accounts/[username]/settings/access-tokens)

#### Android (Google Play):

- `ANDROID_KEYSTORE`: Base64 encoded keystore file
- `ANDROID_KEYSTORE_PASSWORD`: Keystore password
- `ANDROID_KEY_ALIAS`: Key alias
- `ANDROID_KEY_PASSWORD`: Key password
- `GOOGLE_SERVICE_ACCOUNT_KEY`: Service account JSON for Play Store API

#### iOS (App Store):

- `APPLE_TEAM_ID`: Your Apple Team ID
- `ASC_APP_ID`: App Store Connect App ID
- `APPLE_ID`: Apple ID for App Store Connect
- `APPLE_APP_SPECIFIC_PASSWORD`: App-specific password

### 3. Environment Configuration

Create environment-specific configurations:

#### GitHub Environments

1. Go to Settings → Environments
2. Create environments: `test`, `staging`, `production`
3. Add environment-specific secrets and protection rules

## Deployment Workflows

### Branch Strategy

```
main/production    → Production releases
staging           → Staging/UAT releases
test              → Test builds
develop           → Development (OTA updates only)
feature/*         → Feature branches (tests only)
```

### 1. Development (OTA Updates Only)

**Trigger:** Push to `develop` branch

**What happens:**

- ✅ Runs tests and linting
- ✅ Publishes EAS Update to `development` channel
- ❌ No native builds

```bash
# Manual OTA update
eas update --branch development --message "Your message"
```

### 2. Test Environment

**Trigger:** Push to `test` or `test/active-sprint` branches

**What happens:**

- ✅ Publishes EAS Update to `test` channel
- ✅ Builds APK (Android) and IPA (iOS) - **automatic**
- ⚠️ Submission to stores - **manual via workflow_dispatch**

**Manual build:**

```bash
eas build --platform android --profile test
eas build --platform ios --profile test
```

**Manual submit:**

```bash
eas submit --platform android --profile test
eas submit --platform ios --profile test
```

### 3. Staging Environment

**Trigger:** Push to `staging` branch

**What happens:**

- ✅ Publishes EAS Update to `staging` channel - **automatic**
- ⚠️ Builds AAB/IPA - **manual via workflow_dispatch**
- ✅ Submits to internal tracks - **automatic after build**

**To trigger build:**

1. Go to Actions → Staging Environment - Build & Deploy
2. Click "Run workflow"
3. Select `staging` branch
4. Click "Run workflow"

### 4. Production Environment

**Trigger:** Push to `main` or `production` branch

**What happens:**

- ✅ Publishes EAS Update to `production` channel
- ⚠️ Builds AAB/IPA - **manual via workflow_dispatch**
- ✅ Submits to production tracks - **automatic after build**

**Production deployment steps:**

```bash
# 1. Merge to main/production
git checkout main
git merge staging
git push origin main

# 2. Trigger build via GitHub UI or CLI
gh workflow run production-deploy.yml

# 3. Monitor build
eas build:list --profile production
```

## Manual Build & Deploy

Use the **Manual Build** workflow for ad-hoc builds:

1. Go to Actions → Manual Build
2. Click "Run workflow"
3. Select:
   - **Platform**: android, ios, or all
   - **Profile**: development, test, staging, or production
   - **Submit**: Check to auto-submit after build
4. Click "Run workflow"

## EAS Update (OTA)

### What is EAS Update?

EAS Update allows you to push JavaScript/asset changes without rebuilding the native app.

**Use cases:**

- Bug fixes
- UI changes
- Non-native code updates

### Publishing updates:

```bash
# Development
eas update --branch development --message "Fix: Button alignment"

# Test
eas update --branch test --message "Feature: New dashboard"

# Staging
eas update --branch staging --message "Release candidate 1.2.0"

# Production
eas update --branch production --message "Hotfix: Login issue"
```

### Channel Strategy

| Branch  | Channel     | Purpose           |
| ------- | ----------- | ----------------- |
| develop | development | Developer testing |
| test    | test        | QA testing        |
| staging | staging     | UAT/Pre-prod      |
| main    | production  | Live users        |

## Version Management

### Automatic Version Bumping

Production builds automatically increment version numbers using EAS's `autoIncrement` feature.

### Manual Version Update

Update in both places:

1. `package.json`: `"version": "1.2.3"`
2. Native files:
   - Android: `android/app/build.gradle`
   - iOS: `ios/UpTodo.xcodeproj/project.pbxproj`

## Build Profiles

### Development

- Development client enabled
- Internal distribution
- For local testing

### Test

- APK for Android (faster builds)
- Internal distribution
- For QA team

### Staging

- App Bundle (AAB) for Android
- Internal track on Play Store
- TestFlight for iOS

### Production

- App Bundle (AAB) for Android
- Production track on Play Store
- App Store release for iOS
- Auto version increment

## Troubleshooting

### Build Failed

1. Check EAS build logs:

```bash
eas build:list
eas build:view [BUILD_ID]
```

2. Common issues:
   - Missing credentials
   - Dependency conflicts
   - Native code errors

### Submit Failed

1. Verify credentials:

```bash
eas credentials
```

2. Check store status:
   - Google Play Console
   - App Store Connect

### Update Not Appearing

1. Check update was published:

```bash
eas update:list --branch [BRANCH_NAME]
```

2. Ensure app is on correct channel
3. Force restart app

## Best Practices

### 1. Environment Variables

Store sensitive data in GitHub Secrets, not in code.

### 2. Testing

- Always run tests before merging to main branches
- Use test builds for QA
- Use staging for UAT

### 3. Version Control

- Tag releases: `git tag v1.2.3`
- Keep changelog updated
- Use semantic versioning

### 4. Rollback Strategy

**For OTA issues:**

```bash
# Republish previous working version
eas update --branch production --message "Rollback to v1.2.2"
```

**For native issues:**

- Revert merge commit
- Trigger new build from previous stable commit
