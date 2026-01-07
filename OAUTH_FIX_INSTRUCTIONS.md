# Fix Google OAuth - redirect_uri_mismatch Error

## The Problem

You're getting `Error 400: redirect_uri_mismatch` because Supabase is trying to use a custom Google OAuth app, but the redirect URI isn't configured correctly in Google Cloud Console.

## The Solution (2 Options)

### Option 1: Use Supabase's Built-in OAuth (EASIEST - 30 seconds)

This uses Supabase's pre-configured Google OAuth so you don't need to set up anything in Google Cloud Console.

1. Go to: https://supabase.com/dashboard/project/nsfnbporijeaitiqzxyh/auth/providers
2. Click on "Google" provider
3. Look for the section titled **"Use Supabase OAuth"** or **"OAuth Credentials"**
4. **IMPORTANT**: Either:
   - Toggle/Check "Use Supabase OAuth" (if you see this option)
   - OR: **DELETE/CLEAR** the "Client ID" and "Client Secret" fields (leave them blank)
5. Make sure these redirect URLs are still there:
   - `https://next-chapter-4744ivcau-brianfprojects.vercel.app/auth/callback`
   - `http://localhost:3005/auth/callback`
6. Click **Save**
7. Try signing in again!

### Option 2: Fix Custom Google OAuth (5 minutes)

If you want to use your own Google OAuth app:

1. Go to: https://console.cloud.google.com/apis/credentials
2. Find your OAuth 2.0 Client ID (the one with the Client ID from Supabase)
3. Click Edit
4. Under "Authorized redirect URIs", add:
   ```
   https://nsfnbporijeaitiqzxyh.supabase.co/auth/v1/callback
   ```
5. Save
6. Wait 1-2 minutes for Google to update
7. Try signing in again!

## Why This Happens

The error occurs because Google expects the redirect URI to be:
`https://nsfnbporijeaitiqzxyh.supabase.co/auth/v1/callback`

But your app is configured to redirect to:
`https://next-chapter-4744ivcau-brianfprojects.vercel.app/auth/callback`

**Solution**: Use Supabase's built-in OAuth (Option 1) which handles this automatically!

## Next Steps After Fixing

Once OAuth is working:

1. Go to: https://next-chapter-4744ivcau-brianfprojects.vercel.app
2. Click "Sign In"
3. Click "Continue with Google"
4. Sign in with workwithbrianfarello@gmail.com
5. Complete the signup form
6. Run this command in your terminal:
   ```bash
   npx tsx scripts/setup-admin.ts
   ```

You'll have full admin access with no paywalls!

