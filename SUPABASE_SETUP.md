# Supabase Setup for Hot Updater 🚀

**Much better than Firebase!** 🎉

---

### Step 2: Get Your Project Credentials

1. In your project, go to **Settings** (gear icon) → **API**
2. Copy these values:

**Project URL:**

```
https://ygwcjpfvtptmyuwidjmx.supabase.co
```

Copy this exactly!

**Anon/Public Key** (under "Project API keys"):

```
sb_publishable_2OXhaFEI5AEhU1aGjzpnrg_lm6SN07v
```

This is your public API key - safe to use in CI/CD

---

### Step 3: Create Storage Bucket

1. In Supabase Dashboard, go to **Storage** (left sidebar)
2. Click **"New bucket"**
3. Fill in:
   - **Name**: `hot-updater-bundles`
   - **Public bucket**: Toggle **ON** ✅ (bundles need to be publicly downloadable)
4. Click **"Create bucket"**

---

### Step 4: Set Bucket Policies (Important!)

1. Click on your `hot-updater-bundles` bucket
2. Go to **Policies** tab
3. Click **"New Policy"** under SELECT
4. Choose **"Enable read access for all users"**
5. Click **"Review"** → **"Save policy"**

This allows your app to download bundles without authentication.

---

### Step 5: Update `.env.hotupdater`

Open `.env.hotupdater` and fill in your values:

```env
# Supabase Project URL (from Step 2)
HOT_UPDATER_SUPABASE_URL=https://xyzproject.supabase.co

# Supabase Anon Key (from Step 2)
HOT_UPDATER_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Storage Bucket Name (from Step 3)
HOT_UPDATER_SUPABASE_BUCKET_NAME=hot-updater-bundles
```

---

### Step 6: Add GitHub Secrets

For CI/CD to work, add these to GitHub:

1. Go to your repo: https://github.com/Muneeb926595/uptodo-task
2. **Settings** → **Secrets and variables** → **Actions**
3. Click **"New repository secret"** (3 times)

**Secret 1:**

- Name: `SUPABASE_URL`
- Value: `https://xyzproject.supabase.co`

**Secret 2:**

- Name: `SUPABASE_ANON_KEY`
- Value: Your anon key from Step 2

**Secret 3:**

- Name: `SUPABASE_BUCKET_NAME`
- Value: `hot-updater-bundles`

---

## ✅ Test Your Setup

### Local Test (Recommended First)

1. Make sure `.env.hotupdater` is filled in
2. Run:

```bash
npm install --legacy-peer-deps
```

3. Deploy a test OTA:

```bash
npx hot-updater deploy -c development -m "Test deployment"
```

4. If successful, you'll see:

```
✓ Bundle created
✓ Uploaded to Supabase
✓ Deployment complete
URL: https://xyzproject.supabase.co/...
```

---

### CI/CD Test

1. Go to GitHub → Actions
2. Select **"OTA Update Deployment"**
3. Click **"Run workflow"**
4. Choose:
   - Channel: `development`
   - Message: "Test from CI/CD"
5. Click **"Run workflow"**

If it succeeds, your CI/CD is configured correctly! 🎉

---

## 📊 Monitoring Usage

### Check Storage Usage:

1. Supabase Dashboard → **Settings** → **Usage**
2. View:
   - Storage used
   - Bandwidth used
   - Remaining in free tier

### View Bundles:

1. Supabase Dashboard → **Storage**
2. Click `hot-updater-bundles`
3. See all uploaded OTA bundles

### Hot Updater Console:

```bash
npx hot-updater console
```

Shows deployment history, versions, and analytics.

## 🔧 Advanced Configuration

### Automatic Cleanup (Optional)

To save storage, automatically delete old bundles:

1. Supabase Dashboard → **Database** → **SQL Editor**
2. Create a function:

```sql
CREATE OR REPLACE FUNCTION cleanup_old_bundles()
RETURNS void AS $$
BEGIN
  DELETE FROM storage.objects
  WHERE bucket_id = 'hot-updater-bundles'
  AND created_at < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql;
```

3. This keeps only last 30 days of bundles

---

### CDN Configuration

Supabase uses Cloudflare CDN by default - no extra setup needed! Your bundles are automatically:

- Cached globally
- Fast downloads worldwide
- Protected from DDoS
