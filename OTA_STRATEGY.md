# CI/CD + OTA Strategy - SIMPLIFIED ✅

## 🎯 The Core Concept

**OTA and Full Builds are TWO DIFFERENT RELEASE PATHS, not the same release!**

---

## Path 1: OTA Release (JavaScript Changes Only)

### When to Use:

- Bug fixes in JavaScript/TypeScript
- UI/styling changes
- Text/copy updates
- Business logic changes
- **NO native code changes**

### How It Works:

```bash
# Fix a bug in JavaScript
git checkout -b fix/button-bug
# Make changes in src/...
git commit -m "Fix button not responding"
git push

# Deploy OTA manually via GitHub Actions
GitHub → Actions → "OTA Update Deployment" → Run workflow
- Choose channel (development/test/staging/production)
- Add message
- Deploy!
```

### Result:

- Users get update in **2-5 minutes**
- **NO store submission needed**
- **NO full build needed**
- Works for users who already have the app installed

---

## Path 2: Full Build Release (Native Changes or Major Versions)

### When to Use:

- New native dependencies
- Permission changes
- Native code (Kotlin/Swift) changes
- AndroidManifest.xml / Info.plist changes
- Major version releases

### How It Works:

```bash
# Add native feature
git checkout -b feature/biometric-auth
# Add native dependencies, modify Android/iOS code
git commit -m "Add biometric authentication"
git push

# Merge to test/staging/main → Auto triggers full build
git checkout main
git merge feature/biometric-auth
git push origin main

# GitHub Actions automatically:
# 1. Builds Android AAB + iOS IPA
# 2. Submits to stores
# 3. Increments version
```

### Result:

- New app version in stores
- Takes **days** for store approval
- New installs get this version
- **NO OTA needed for this release**

**BUT!** After users have this new version, you CAN deploy OTA updates to them later for JavaScript fixes!

---

## Your Current Workflow Setup

### Automatic Workflows (Branch-based):

| Branch        | On Push        | What Happens                |
| ------------- | -------------- | --------------------------- |
| **`develop`** | Run tests      | Testing only, no deploy     |
| **`test`**    | Build APK/IPA  | Full builds for QA          |
| **`staging`** | Build AAB/IPA  | Beta builds                 |
| **`main`**    | Build + Submit | Production builds to stores |

**No automatic OTA** - You control when to deploy OTA!

### Manual Workflow (OTA Deployment):

**New workflow:** `.github/workflows/ota-deploy.yml`

**How to use:**

1. Go to GitHub → Actions tab
2. Select "OTA Update Deployment"
3. Click "Run workflow"
4. Choose:
   - **Channel**: development / test / staging / production
   - **Message**: "Fix login bug" (or whatever)
   - **Force Update**: Yes/No (for critical security fixes)
5. Click Run!

**Result:** OTA deployed to selected channel in 2-5 minutes

---

## 📊 Real-World Examples

### Example 1: JavaScript Bug Fix

**Problem:** Button in production not working

```bash
# 1. Fix the bug
git checkout -b hotfix/button-not-working
# Edit src/app/components/button.tsx
git commit -m "Fix button onClick handler"
git push

# 2. Deploy OTA (NO BUILD NEEDED!)
GitHub Actions → OTA Update Deployment
- Channel: production
- Message: "Fix button not responding"
- Force: No
→ Deploy!

# 3. Users get fix in 2-5 minutes ✅
```

**No store submission, no waiting!**

---

### Example 2: New Native Feature

**Problem:** Need to add fingerprint authentication (requires native code)

```bash
# 1. Add native feature
git checkout -b feature/fingerprint
# Install react-native-biometrics
npm install react-native-biometrics
cd ios && pod install
# Modify native code
git commit -m "Add fingerprint authentication"
git push

# 2. Merge to main
git checkout main
git merge feature/fingerprint
git push origin main

# 3. GitHub Actions automatically:
#    - Builds new version (1.2.0)
#    - Submits to App Store & Play Store
#    - Takes 3-5 days for approval

# 4. NO OTA for this release
#    (users must download from stores)
```

---

### Example 3: Bug Fix After Native Release

**Scenario:** You released fingerprint feature (v1.2.0) via full build. Now there's a UI bug in the fingerprint screen.

```bash
# 1. Fix the UI bug (JavaScript only)
git checkout -b fix/fingerprint-ui
# Edit src/modules/auth/fingerprint-screen.tsx
git commit -m "Fix fingerprint UI layout"
git push

# 2. Deploy OTA (targets v1.2.0 users)
GitHub Actions → OTA Update Deployment
- Channel: production
- Message: "Fix fingerprint UI"
→ Deploy!

# 3. Users with v1.2.0 get update in 2-5 minutes ✅
```

**This is the power of OTA - quick fixes after full builds!**

---

## 🎯 Decision Tree

```
Did you change files in android/ or ios/ folders?
│
├─ YES → Need FULL BUILD
│         - Push to main → Auto builds
│         - Wait for store approval
│         - Takes days
│
└─ NO  → Can use OTA
          - Run OTA workflow manually
          - Users get update in 2-5 min
          - No store approval needed
```

---

## 🚀 Quick Reference

### Deploy OTA Update:

```bash
# Via GitHub Actions (Recommended)
GitHub → Actions → "OTA Update Deployment" → Run workflow

# Via CLI (Local)
npx hot-updater deploy -c production -i
```

### Trigger Full Build:

```bash
# Push to branch (automatic)
git push origin main  # → Auto builds + submits

# Manual trigger
GitHub → Actions → "Production - Build & Deploy" → Run workflow
```

### Check OTA Status:

```bash
# Open web console
npx hot-updater console

# Or check GitHub Actions logs
GitHub → Actions → Latest OTA deployment run
```

---
