# Authentication Setup Guide

## Issue: Cannot Sign In

The authentication system is built but needs configuration in the Supabase dashboard.

## Quick Fix (5 minutes)

### Step 1: Configure Google OAuth in Supabase

1. **Go to Supabase Auth Settings**:
   ```
   https://supabase.com/dashboard/project/nsfnbporijeaitiqzxyh/auth/providers
   ```

2. **Enable Google Provider**:
   - Click on "Google" in the providers list
   - Toggle "Enable Sign in with Google" to ON

3. **Get Google OAuth Credentials**:

   **Option A: Use Supabase's Default (Quickest)**
   - Supabase provides test credentials automatically
   - Just enable the provider and save
   - ⚠️ Note: This works for testing but may show "unverified app" warning

   **Option B: Create Your Own (Production-Ready)**
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create a new project (or select existing)
   - Navigate to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client ID"
   - Application type: "Web application"
   - Authorized redirect URIs:
     ```
     https://nsfnbporijeaitiqzxyh.supabase.co/auth/v1/callback
     ```
   - Copy the Client ID and Client Secret
   - Paste into Supabase Google provider settings

4. **Add Redirect URLs**:
   In the "Site URL" and "Redirect URLs" section, add:
   - Production: `https://next-chapter-4744ivcau-brianfprojects.vercel.app/auth/callback`
   - Local: `http://localhost:3005/auth/callback`

5. **Save Settings**

### Step 2: Test Authentication

**Test Locally**:
```bash
cd /Users/brianfarello/Desktop/next-chapter
npm run dev
```
- Visit http://localhost:3005
- Click "Sign In"
- Click "Continue with Google"
- Should redirect to Google login

**Test Production**:
- Visit https://next-chapter-4744ivcau-brianfprojects.vercel.app
- Click "Sign In"
- Click "Continue with Google"
- Should redirect to Google login

### Step 3: Verify in Supabase

After successful sign-in:
1. Go to https://supabase.com/dashboard/project/nsfnbporijeaitiqzxyh/auth/users
2. You should see your user account listed

## Alternative: Use Email/Password Auth (Fallback)

If Google OAuth is too complex right now, we can add email/password auth:

1. **Enable Email Auth in Supabase**:
   - Go to Auth > Providers
   - Enable "Email" provider
   - Configure email templates (optional)

2. **Update Code** (I can do this if needed):
   - Add email/password sign-in form
   - Add sign-up flow
   - Add password reset

## Troubleshooting

### Error: "Error loading external provider"
**Cause**: Google OAuth not configured in Supabase
**Fix**: Complete Step 1 above

### Error: "Invalid redirect URL"
**Cause**: Redirect URLs not whitelisted in Supabase
**Fix**: Add both production and local URLs to Supabase Auth settings

### Error: "Unauthorized client"
**Cause**: Google OAuth Client ID/Secret incorrect
**Fix**: Verify credentials in Google Cloud Console match Supabase settings

### Users can't see /profile after login
**Cause**: Auth callback not handling user creation properly
**Fix**: Check that the user is being created in both auth.users and public.athletes tables

## Current Auth Flow

```
1. User clicks "Sign In" → /login
2. User clicks "Continue with Google" → Google OAuth consent screen
3. Google redirects back → /auth/callback
4. Callback exchanges code for session
5. User redirected to /profile
```

## Verification Steps

After fixing:

- [ ] Can sign in with Google locally
- [ ] Can sign in with Google in production
- [ ] User profile is created in database
- [ ] User can save their professional profile
- [ ] User can access /profile page
- [ ] User stays logged in on page refresh

## Need Help?

If auth still doesn't work after following this guide:

1. **Check Browser Console**:
   - Open DevTools (F12)
   - Look for error messages
   - Share any errors you see

2. **Check Supabase Logs**:
   - Go to https://supabase.com/dashboard/project/nsfnbporijeaitiqzxyh/logs/auth-logs
   - Look for failed auth attempts
   - Note any error messages

3. **Test with Different Browser**:
   - Try incognito/private mode
   - Clear cookies and cache
   - Try different browser

---

**Estimated Time**: 5-10 minutes
**Difficulty**: Easy (just configuration, no code changes)
**Status**: Waiting for Supabase configuration
