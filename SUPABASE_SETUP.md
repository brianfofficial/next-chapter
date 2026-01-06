# Supabase Setup Guide

This guide will walk you through setting up Supabase for the Next Chapter project.

## Prerequisites

- Supabase account (sign up at [supabase.com](https://supabase.com))
- Supabase CLI installed (`brew install supabase/tap/supabase`)

## Step 1: Create a New Supabase Project

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Fill in:
   - **Name**: next-chapter
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Free tier is fine to start
4. Wait ~2 minutes for the project to be created

## Step 2: Get Your API Keys

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon / public key** (starts with `eyJ...`)

## Step 3: Set Up Local Environment Variables

1. In the project root, create a `.env.local` file:

```bash
cp .env.local.example .env.local
```

2. Edit `.env.local` and fill in your values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## Step 4: Link Your Project to Supabase CLI

```bash
# Login to Supabase CLI
supabase login

# Link to your project
supabase link --project-ref your-project-ref
```

To find your project ref:
- Go to your project settings
- Look for "Reference ID" (usually looks like: `xxxxx`)

## Step 5: Run Database Migrations

```bash
# This will create the athletes and employers tables
supabase db push
```

This command will:
- Run `001_create_athletes_table.sql`
- Run `002_create_employers_tables.sql`

## Step 6: Verify Database Setup

Check that tables were created correctly:

```bash
# List all tables
supabase db dump --schema public
```

You should see:
- `athletes` table
- `employers` table
- `saved_athletes` table

## Step 7: Set Up Authentication

1. In Supabase Dashboard, go to **Authentication** → **Providers**
2. Enable **Google** provider:
   - Follow Supabase's guide to create Google OAuth credentials
   - Add your OAuth Client ID and Secret
3. Add redirect URLs:
   - Development: `http://localhost:3000/auth/callback`
   - Production: `https://your-domain.com/auth/callback`

## Step 8: Configure Vercel Environment Variables

For production deployment, add the same environment variables to Vercel:

```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
```

Or via Vercel Dashboard:
1. Go to your project → Settings → Environment Variables
2. Add both variables for Production, Preview, and Development

## Step 9: Test the Connection

Start the dev server and test:

```bash
npm run dev
```

Visit:
- `http://localhost:3000` - Should load without Supabase errors
- `http://localhost:3000/login` - Test OAuth login

## Database Schema Overview

### athletes table
```sql
- id (uuid, primary key)
- email (text)
- sport (text)
- position (text)
- school (text)
- graduation_year (integer)
- gpa (text)
- major (text)
- experiences (jsonb) - leadership, achievements, stats
- translated_summary (text)
- translated_bullets (jsonb array)
- is_public (boolean) - whether employers can see this profile
- created_at, updated_at (timestamps)
```

### employers table
```sql
- id (uuid, primary key, references auth.users)
- company_name (text)
- industry (text)
- company_size (text)
- contact_email (text)
- subscription_tier (text) - 'free_trial', 'basic', 'pro'
- roles_hiring_for (text)
- created_at, updated_at (timestamps)
```

### saved_athletes table
```sql
- id (uuid, primary key)
- employer_id (uuid, references employers)
- athlete_id (uuid, references athletes)
- notes (text)
- saved_at (timestamp)
```

## Row Level Security (RLS)

The migrations automatically set up RLS policies:

**Athletes:**
- Athletes can only view/edit their own profiles
- Employers can view public athlete profiles

**Employers:**
- Employers can only view/edit their own profiles

**Saved Athletes:**
- Employers can only save/view/delete their own saved athletes

## Troubleshooting

### "Cannot find Supabase URL/Key" errors

Make sure `.env.local` exists and has the correct values:
```bash
cat .env.local
```

### OAuth Redirect Issues

Check that your redirect URLs match exactly:
- Supabase Dashboard → Authentication → URL Configuration
- Should include `http://localhost:3000/auth/callback`

### Migration Errors

If migrations fail, you can reset and try again:
```bash
supabase db reset
supabase db push
```

### Permission Errors

If you get permission errors when querying:
1. Check RLS policies in Supabase Dashboard → Authentication → Policies
2. Make sure you're authenticated (check `useAuth` hook)
3. Verify the logged-in user has the correct role (athlete vs employer)

## Next Steps

Once Supabase is configured:
1. Test athlete signup and profile creation
2. Test employer signup and browse functionality
3. Deploy to Vercel: `vercel --prod`
4. Test OAuth in production environment

## Useful Commands

```bash
# Check Supabase status
supabase status

# View database schema
supabase db dump --schema public

# Generate TypeScript types from database
supabase gen types typescript --local > lib/database.types.ts

# View logs
supabase functions logs
```

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase CLI Reference](https://supabase.com/docs/reference/cli)
- [Next.js + Supabase Guide](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
