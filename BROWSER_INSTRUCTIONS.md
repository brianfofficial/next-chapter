# Quick Browser Instructions 🚀

I just opened 2 browser tabs for you. Here's what to do in each:

## Tab 1: Supabase Auth Providers

**URL**: https://supabase.com/dashboard/project/.../auth/providers

**What you see**: List of auth providers (Google, GitHub, etc.)

**What to do**:
1. Find "Google" in the list
2. Click on it
3. Toggle "Enable Sign in with Google" to **ON**
4. Scroll down to "Redirect URLs"
5. Add these two URLs (click "+ Add URL" for each):
   ```
   https://next-chapter-4744ivcau-brianfprojects.vercel.app/auth/callback
   http://localhost:3005/auth/callback
   ```
6. Click **"Save"** at the bottom

**Time**: 30 seconds

---

## Tab 2: Supabase SQL Editor

**URL**: https://supabase.com/dashboard/project/.../sql/new

**What you see**: Empty SQL editor

**What to do**:
1. Press **Cmd+V** (I already copied the SQL to your clipboard)
2. You should see this appear:
   ```sql
   -- Add admin role support to employers table
   ALTER TABLE public.employers
   ADD COLUMN IF NOT EXISTS is_admin boolean DEFAULT false;
   ...
   ```
3. Click the **"Run"** button (bottom right)
4. Wait for green success message: "Success. No rows returned"

**Time**: 15 seconds

---

## Tab 3: Next Chapter (Production)

**URL**: https://next-chapter-4744ivcau-brianfprojects.vercel.app

**What you see**: Next Chapter homepage

**What to do**:
1. Click **"Sign In"** (top right)
2. Click **"Continue with Google"**
3. Sign in with: **workwithbrianfarello@gmail.com**
4. You'll be redirected back to the site
5. Complete the employer signup form:
   - Company name: (anything)
   - Industry: (select one)
   - Name: Brian Farello
   - Email: workwithbrianfarello@gmail.com

**Time**: 1 minute

---

## Final Step: Terminal

After you complete the browser steps, come back to your terminal and run:

```bash
cd /Users/brianfarello/Desktop/next-chapter
npx tsx scripts/setup-admin.ts
```

This will grant admin privileges to your account.

**Expected output**:
```
🔧 Setting up admin account...
✅ Found user in auth.users: xxx-xxx-xxx
✅ Employer record updated with admin privileges

🎉 Admin account setup complete!
```

---

## You're Done! 🎉

After these steps, you'll have:
- ✅ Full admin access
- ✅ No paywalls
- ✅ Unlimited messaging
- ✅ All pro features

**Total time**: ~3 minutes

---

## Need Help?

If something doesn't work:
1. Check browser console (F12) for errors
2. Make sure you clicked "Save" in Tab 1
3. Make sure SQL ran successfully in Tab 2
4. Make sure you signed in with workwithbrianfarello@gmail.com

**I'm here to help!**
