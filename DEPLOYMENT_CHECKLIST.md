# 🚀 Pre-Deployment Checklist

## ✅ Required Steps Before Deploying to Netlify

### 1. Supabase Setup

- [ ] **Run RLS Policies SQL** (from previous conversation)
  - File: `clean-rls-policies.sql`
  - This fixes contact form and blog creation permissions
  
- [ ] **Run Storage Setup SQL** ⚠️ **CRITICAL - NOT DONE YET**
  - File: `supabase/storage-setup.sql`
  - Creates `blog-images` bucket for image uploads
  - Without this, image upload will fail with "Bucket not found"

- [ ] **Verify in Supabase Dashboard:**
  - Go to **Storage** → Should see `blog-images` bucket
  - Go to **Authentication** → **Policies** → Should see 6 RLS policies (one per table)
  - Go to **Storage** → **Policies** → Should see 4 policies for blog-images

### 2. Environment Variables

Check your `.env` file has all required variables:

```bash
# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# Admin
ADMIN_PASSWORD=your_admin_password
```

### 3. Test Locally First

Before deploying, test everything works:

```bash
# Start dev server
npm run dev
```

**Test these features:**
- [ ] Homepage loads
- [ ] Projects page loads (fixed the .map error)
- [ ] Experience page loads
- [ ] Blogs page loads
- [ ] Individual blog pages load
- [ ] Contact form submits successfully
- [ ] Admin login works
- [ ] Admin can create blog
- [ ] Admin can upload image (after running storage SQL)

### 4. Build Check

Make sure the project builds without errors:

```bash
npm run build
```

If build succeeds, you're ready to deploy!

### 5. Netlify Deployment

#### Option A: Deploy via Netlify CLI

```bash
# Install Netlify CLI (if not installed)
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
netlify deploy --prod
```

#### Option B: Deploy via GitHub

1. Push your code to GitHub
2. Go to Netlify Dashboard
3. Click "Add new site" → "Import an existing project"
4. Connect to GitHub repository
5. Configure build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `.output/public`
   - **Functions directory:** `.netlify/functions` (auto-detected for Nuxt)

#### Set Environment Variables in Netlify

Go to **Site settings → Environment variables** and add:

```
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
ADMIN_PASSWORD=your_admin_password
```

### 6. Post-Deployment Tests

After deployment, test on the live site:

- [ ] Visit your Netlify URL
- [ ] Test contact form
- [ ] Test blog pages
- [ ] Test admin login
- [ ] Test image upload (should work if storage SQL was run)

---

## 🐛 Common Issues

### Issue: "Bucket not found" on image upload
**Solution:** Run `supabase/storage-setup.sql` in Supabase SQL Editor

### Issue: Contact form returns 500 error
**Solution:** Run the RLS policies SQL (clean-rls-policies.sql)

### Issue: Build fails
**Solution:** 
- Check for TypeScript errors: `npm run typecheck`
- Check for missing dependencies: `npm install`
- Check error logs in terminal

### Issue: Admin login doesn't work on production
**Solution:** Make sure `ADMIN_PASSWORD` environment variable is set in Netlify

### Issue: Blogs don't load
**Solution:** 
- Check Supabase RLS policies are enabled
- Verify `blogs` table exists
- Check browser console for errors

---

## 📊 Deployment Summary

**What's Ready:**
- ✅ Frontend code (all pages)
- ✅ API endpoints (projects, blogs, contact, admin)
- ✅ Admin authentication
- ✅ Blog management
- ✅ Image upload code (admin + telegram bot)
- ✅ RLS policy fixes
- ✅ TypeScript errors fixed

**What's Pending:**
- ⚠️ Supabase Storage bucket creation (MUST DO BEFORE DEPLOY)
- ⚠️ Test locally after running storage SQL
- ⚠️ Configure Netlify environment variables

**Deployment Platform:**
- Netlify (recommended for Nuxt 3)
- Alternative: Vercel, Cloudflare Pages

---

## 🎯 Quick Start (Do This Now)

1. **Run Storage SQL** (2 minutes)
   - Open Supabase Dashboard
   - SQL Editor → New Query
   - Paste contents of `supabase/storage-setup.sql`
   - Run

2. **Test Image Upload** (2 minutes)
   - Go to `/admin`
   - Try uploading an image
   - Should work now!

3. **Build Project** (2 minutes)
   ```bash
   npm run build
   ```

4. **Deploy to Netlify** (5 minutes)
   - Push to GitHub
   - Connect to Netlify
   - Set environment variables
   - Deploy!

---

**Total time to deploy: ~15 minutes after running the Storage SQL** ⏱️
