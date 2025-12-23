# Hot Updater Setup - Next Steps 🚀

## ✅ Current Status

Your Hot Updater is configured but **temporarily disabled** so your app can run.

## 🔧 Why It's Disabled

Hot Updater requires a `baseURL` which is only available **after your first deployment**. This is a chicken-and-egg problem:

- Need baseURL to run app with Hot Updater
- Need to deploy to get baseURL
- Need working app to create deployment

**Solution**: Disable Hot Updater, deploy once, then enable it with the correct URL.

---

## 📝 Step-by-Step Activation

### Step 1: Create Supabase Storage Bucket (If not done)

1. Go to https://supabase.com/dashboard
2. Select your project: `ygwcjpfvtptmyuwidjmx`
3. Go to **Storage** → Click **"New bucket"**
4. Name: `hot-updater-bundles`
5. Public: **ON** ✅
6. Click **"Create bucket"**
7. Go to **Policies** → **"New Policy"** → **"Enable read access for all users"**

### Step 2: Deploy Your First OTA Bundle

```bash
# Make sure you're in project root
cd /Users/emumba/Desktop/uptodo-task

# Install packages if not done
npm install --legacy-peer-deps

# Deploy to development channel
npx hot-updater deploy -c development -m "Initial deployment"
```

**Expected Output:**

```
✓ Building bundle...
✓ Uploading to Supabase...
✓ Deployment complete!

Update URL: https://ygwcjpfvtptmyuwidjmx.supabase.co/storage/v1/object/public/hot-updater-bundles/...
```

**IMPORTANT**: Copy the "Update URL" - you'll need part of it!

### Step 3: Get the Correct baseURL

After deployment, Hot Updater will tell you the update server URL. It should look like:

```
https://ygwcjpfvtptmyuwidjmx.supabase.co/functions/v1/hot-updater-check-update
```

OR if using storage directly:

```
https://ygwcjpfvtptmyuwidjmx.supabase.co/storage/v1/object/public/hot-updater-bundles
```

### Step 4: Enable Hot Updater in App

Open `src/app.tsx` and **replace**:

```typescript
export default App;
```

**With:**

```typescript
export default HotUpdater.wrap({
  baseURL:
    'https://ygwcjpfvtptmyuwidjmx.supabase.co/functions/v1/hot-updater-check-update',
  updateStrategy: 'appVersion',
  updateMode: 'auto',
  fallbackComponent: ({ progress, status }) => (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
      }}
    >
      <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>
        {status === 'UPDATING' ? 'Updating...' : 'Checking for Update...'}
      </Text>
      {progress > 0 ? (
        <Text style={{ color: 'white', fontSize: 20, marginTop: 10 }}>
          {Math.round(progress * 100)}%
        </Text>
      ) : null}
    </View>
  ),
})(App);
```

**Use the baseURL from Step 3!**

### Step 5: Test It Works

1. Build a release version of your app
2. Install on device/emulator
3. Make a code change
4. Deploy: `npx hot-updater deploy -c development`
5. Restart app → Should auto-update! 🎉

---

## 🚨 Troubleshooting

### Error: "Cannot read property 'supabaseUrl'"

Your `.env.hotupdater` isn't being loaded. Make sure:

- File exists in project root
- Has correct values filled in
- dotenv is loading it (already configured in `hot-updater.config.ts`)

### Error: "Bucket not found"

Create the bucket in Supabase Storage (Step 1 above)

### Error: "Permission denied"

Make bucket **public** and add read policy (Step 1 above)

### Deployment succeeds but app doesn't update

1. Check baseURL matches deployment output
2. Verify you're using a release build (not debug)
3. Make sure app version matches deployment target

---

## 🎯 Quick Test Checklist

- [ ] Supabase project created
- [ ] Storage bucket `hot-updater-bundles` created
- [ ] Bucket is public with read policy
- [ ] `.env.hotupdater` has correct values
- [ ] Run `npm install --legacy-peer-deps`
- [ ] Run `npx hot-updater deploy -c development`
- [ ] Copy baseURL from output
- [ ] Update `src/app.tsx` with baseURL
- [ ] Test in release mode

---

## 📚 Your Current Config

**Supabase Project**: `ygwcjpfvtptmyuwidjmx`
**Bucket**: `hot-updater-bundles`
**Config File**: `hot-updater.config.ts` ✅
**Env File**: `.env.hotupdater` ✅

**All configuration is correct! Just need to:**

1. Deploy once to get baseURL
2. Add baseURL to app.tsx
3. Done!

---

## 💡 Pro Tip

After first deployment, you can check your bundles:

```bash
# Open Hot Updater console
npx hot-updater console
```

This shows all deployments, versions, and analytics!

---

**Next Step**: Run `npx hot-updater deploy -c development -m "First deployment"` 🚀
