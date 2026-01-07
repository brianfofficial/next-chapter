# Admin Account Setup Guide

## Quick Setup (5 minutes)

### Step 1: Enable Google OAuth

**First, enable authentication** (if not already done):

1. Go to [Supabase Auth Providers](https://supabase.com/dashboard/project/nsfnbporijeaitiqzxyh/auth/providers)
2. Enable Google OAuth
3. Add redirect URLs:
   - `https://next-chapter-4744ivcau-brianfprojects.vercel.app/auth/callback`
   - `http://localhost:3005/auth/callback`
4. Save

### Step 2: Apply Admin Migration

Run the migration to add admin capabilities:

```bash
cd /Users/brianfarello/Desktop/next-chapter

# Apply migration (choose one method):

# Method A: Via Supabase Dashboard (Recommended)
# 1. Go to https://supabase.com/dashboard/project/nsfnbporijeaitiqzxyh/sql/new
# 2. Copy contents of supabase/migrations/006_add_admin_role.sql
# 3. Paste and run

# Method B: Via CLI (if Supabase CLI installed)
supabase db push
```

### Step 3: Create Your Admin Account

**Option A: Sign up through the app (Easiest)**

1. Go to https://next-chapter-4744ivcau-brianfprojects.vercel.app
2. Click "Sign In"
3. Use Google OAuth with `workwithbrianfarello@gmail.com`
4. Complete the employer signup flow
5. Run the setup script (see Step 4)

**Option B: Create directly in Supabase**

1. Go to [Supabase Auth Users](https://supabase.com/dashboard/project/nsfnbporijeaitiqzxyh/auth/users)
2. Click "Invite User"
3. Enter `workwithbrianfarello@gmail.com`
4. User will receive email to set password
5. Run the setup script (see Step 4)

### Step 4: Grant Admin Privileges

Run this script to make the account an admin:

```bash
npx tsx scripts/setup-admin.ts
```

**Expected Output:**
```
🔧 Setting up admin account...

✅ Found user in auth.users: abc-123-def
📝 Creating employer record with admin privileges...
✅ Employer record created with admin privileges

🎉 Admin account setup complete!

Admin Details:
  Email: workwithbrianfarello@gmail.com
  Admin: true
  Subscription: pro
  User ID: abc-123-def

✨ You can now:
  • View all athletes and employers
  • Access admin dashboard (coming soon)
  • Unlimited messaging and contacts
  • No subscription required

✓ Script complete!
```

## What Admin Access Gives You

### Current Capabilities ✅

1. **View All Athletes**
   - Browse all athlete profiles
   - No paywall restrictions
   - See contact information for everyone

2. **View All Employers**
   - See all employer accounts
   - View subscription status
   - Check company information

3. **Pro Subscription Features**
   - Unlimited messages
   - Unlimited contact views
   - Full pipeline access
   - All analytics features

### Coming Soon 🚀

1. **Admin Dashboard** (`/admin`)
   - Total users count
   - Subscription metrics
   - Revenue tracking
   - User growth charts

2. **User Management**
   - View all users
   - Edit user profiles
   - Grant/revoke admin access
   - Delete accounts

3. **Content Moderation**
   - Review athlete profiles
   - Monitor conversations
   - Handle reported content

## Database Changes

The migration adds:

```sql
-- New column
employers.is_admin (boolean, default false)

-- New policies
- Admins can view all employers
- Admins can update any employer
- Admins can view all athletes

-- New view
admin_stats (total_athletes, total_employers, pro_subscribers, etc.)
```

## Verification

To verify your admin access:

1. **Check Database**:
   ```sql
   SELECT id, contact_email, is_admin, subscription_tier
   FROM employers
   WHERE contact_email = 'workwithbrianfarello@gmail.com';
   ```

2. **Test in App**:
   - Sign in to https://next-chapter-4744ivcau-brianfprojects.vercel.app
   - Go to `/employers/browse`
   - All athlete contact info should be visible (no blur)
   - No "Upgrade to Pro" prompts

## Troubleshooting

### "User not found in auth.users"

**Solution**: You need to sign in first
1. Go to the app
2. Click "Sign In"
3. Use Google OAuth with workwithbrianfarello@gmail.com
4. Complete signup
5. Run script again

### "Error checking employer"

**Solution**: Migration not applied
1. Apply migration 006_add_admin_role.sql in Supabase dashboard
2. Run script again

### "is_admin is null"

**Solution**: Column doesn't exist
1. Verify migration was applied
2. Check column exists: `SELECT * FROM employers LIMIT 1;`
3. Re-run migration if needed

## Security Notes

⚠️ **Admin Privileges Are Powerful**:
- Can view all user data
- Can modify any employer account
- Can see all conversations and messages

🔒 **Best Practices**:
- Keep admin credentials secure
- Use 2FA on Google account
- Don't share admin access
- Audit admin actions regularly

## Next Steps

After setup:

1. **Test Admin Access**:
   - Browse athletes without paywall
   - Access all pro features
   - Verify no subscription prompts

2. **Build Admin Dashboard** (Optional):
   - Create `/app/admin/page.tsx`
   - Show admin_stats view
   - Add user management UI

3. **Add More Admins** (If Needed):
   - Update ADMIN_EMAIL in script
   - Run setup-admin.ts again

---

**Status**: Migration ready, script ready, waiting for Google OAuth setup
**Estimated Time**: 5 minutes
**Required**: Google OAuth must be enabled first
