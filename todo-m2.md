# Milestone 2: Authentication & Database - Task List

## Status: 🚧 In Progress

---

## 1. Supabase Setup & Configuration

### 1.1 Client Setup
- [ ] Install Supabase packages (`@supabase/supabase-js`, `@supabase/ssr`)
- [ ] Create `lib/supabase/client.ts` - Browser client
- [ ] Create `lib/supabase/server.ts` - Server client with cookies
- [ ] Create `lib/supabase/middleware.ts` - Auth middleware
- [ ] Add environment variables to `.env.local` template
  - NEXT_PUBLIC_SUPABASE_URL
  - NEXT_PUBLIC_SUPABASE_ANON_KEY

### 1.2 Database Schema
- [ ] Create migration for `athletes` table
  - id (uuid, primary key, references auth.users)
  - email (text, unique)
  - full_name (text)
  - sport (text)
  - position (text, nullable)
  - school (text, nullable)
  - graduation_year (integer, nullable)
  - gpa (text, nullable)
  - major (text, nullable)
  - experiences (jsonb) - Stores leadership, achievements, stats
  - translated_summary (text, nullable)
  - translated_bullets (jsonb, nullable)
  - created_at (timestamp with time zone, default now())
  - updated_at (timestamp with time zone, default now())

- [ ] Create RLS (Row Level Security) policies
  - Enable RLS on athletes table
  - Policy: Users can read their own data
  - Policy: Users can insert their own data
  - Policy: Users can update their own data
  - Policy: Users can delete their own data

---

## 2. Authentication Pages & Flow

### 2.1 Login Page (`/login`)
- [ ] Create `app/login/page.tsx`
- [ ] Add "Continue with Google" button
- [ ] Add "Continue with LinkedIn" button
- [ ] OAuth redirect configuration
- [ ] Error handling for auth failures
- [ ] Loading states during authentication

### 2.2 Auth Callback
- [ ] Create `app/auth/callback/route.ts`
- [ ] Handle OAuth callback from Supabase
- [ ] Exchange code for session
- [ ] Redirect to profile or original destination

### 2.3 Sign Out
- [ ] Add sign out functionality to navigation
- [ ] Clear session and redirect to home

---

## 3. Protected Routes & Middleware

### 3.1 Middleware Setup
- [ ] Create `middleware.ts` at root
- [ ] Check authentication status
- [ ] Redirect unauthenticated users to `/login`
- [ ] Protected routes: `/profile`, `/dashboard` (future)
- [ ] Public routes: `/`, `/login`

### 3.2 Auth Context/Hooks
- [ ] Create `lib/hooks/useAuth.ts` - Get current user
- [ ] Create `lib/hooks/useUser.ts` - Get athlete profile data
- [ ] Handle loading states
- [ ] Handle error states

---

## 4. Save Translation Feature

### 4.1 Update Skill Translator Component
- [ ] Add "Save & Download" button to results page
- [ ] Check if user is authenticated
- [ ] If not authenticated, redirect to `/login` with return URL
- [ ] If authenticated, auto-save to database

### 4.2 Save Translation Logic
- [ ] Create `app/api/translations/save/route.ts`
- [ ] Accept translation data (summary, bullets, athlete input)
- [ ] Upsert to `athletes` table
- [ ] Return success/error response

### 4.3 Post-Auth Flow
- [ ] After successful login, check for pending translation in sessionStorage
- [ ] Auto-save pending translation to database
- [ ] Redirect to `/profile` to show saved translation
- [ ] Clear pending translation from sessionStorage

---

## 5. Profile Page

### 5.1 Layout & Navigation
- [ ] Create `app/profile/page.tsx`
- [ ] Add top navigation with "Home" and "Sign Out" links
- [ ] Display user's name and email
- [ ] Show athlete details (sport, position, school)

### 5.2 Saved Translations Display
- [ ] Fetch athlete's saved translation from database
- [ ] Display professional summary in a card
- [ ] Display bullet points in a card
- [ ] Add copy-to-clipboard buttons (reuse from translator)
- [ ] Show "last updated" timestamp

### 5.3 Edit Mode (Optional for M2)
- [ ] "Edit Translation" button
- [ ] Link back to skill translator with pre-filled data
- [ ] Update existing record instead of creating new

---

## 6. UI Components

### 6.1 Auth Components
- [ ] `components/auth/GoogleButton.tsx` - OAuth button with Google branding
- [ ] `components/auth/LinkedInButton.tsx` - OAuth button with LinkedIn branding
- [ ] `components/auth/AuthGuard.tsx` - Wrapper component for protected pages

### 6.2 Profile Components
- [ ] `components/profile/ProfileHeader.tsx` - User info display
- [ ] `components/profile/SavedTranslation.tsx` - Translation display with copy buttons
- [ ] `components/profile/AthleteInfo.tsx` - Athlete details card

---

## 7. Design System Updates

### 7.1 New Components
- [ ] Update button component with Google/LinkedIn brand colors
- [ ] Add loading spinner component
- [ ] Add error alert component
- [ ] Add success toast component

### 7.2 Animations
- [ ] Add loading animations for auth flow
- [ ] Add success animation after save
- [ ] Add smooth transition to profile page

---

## 8. Environment & Configuration

### 8.1 Supabase Dashboard Setup
- [ ] Configure Google OAuth provider in Supabase dashboard
- [ ] Configure LinkedIn OAuth provider in Supabase dashboard
- [ ] Set up redirect URLs (localhost + Vercel)
- [ ] Enable email confirmations (optional)

### 8.2 OAuth Provider Setup
- [ ] Create Google OAuth app in Google Console
- [ ] Create LinkedIn OAuth app in LinkedIn Developer Portal
- [ ] Add client IDs and secrets to Supabase

---

## 9. Testing & Polish

### 9.1 Manual Testing
- [ ] Test Google OAuth flow end-to-end
- [ ] Test LinkedIn OAuth flow end-to-end
- [ ] Test save translation when authenticated
- [ ] Test save translation when not authenticated (redirect flow)
- [ ] Test profile page display
- [ ] Test sign out flow
- [ ] Test protected route redirects

### 9.2 Error Handling
- [ ] Handle OAuth errors gracefully
- [ ] Handle database errors gracefully
- [ ] Show user-friendly error messages
- [ ] Log errors to console for debugging

### 9.3 Mobile Responsiveness
- [ ] Test login page on mobile
- [ ] Test profile page on mobile
- [ ] Test OAuth flow on mobile browsers

---

## 10. Documentation

### 10.1 Update README
- [ ] Add Supabase setup instructions
- [ ] Add OAuth setup instructions
- [ ] Update environment variables section

### 10.2 Update spec.md
- [ ] Mark Milestone 2 as complete
- [ ] Add authentication architecture notes

---

## Success Criteria

✅ **Authentication Works**
- Users can sign in with Google
- Users can sign in with LinkedIn
- Session persists across page reloads
- Sign out works correctly

✅ **Database Integration Works**
- Translations are saved to Supabase
- Saved translations display on profile page
- RLS policies prevent unauthorized access

✅ **User Flow Works**
- Unauthenticated users can use translator
- "Save" prompts login if not authenticated
- Post-login auto-saves pending translation
- Users see their saved translation on profile page

✅ **Protected Routes Work**
- Unauthenticated users redirected to /login
- After login, users redirected to intended destination
- Public pages accessible without auth

---

## Next Milestone Preview

**Milestone 3: Employer Dashboard** (Weeks 5-7)
- Employer profiles and authentication
- Searchable athlete database
- Advanced filters (sport, GPA, graduation year)
- Save/favorite athletes
- In-app messaging
- Analytics dashboard

---

**Estimated Time:** 1-2 weeks
**Started:** [Date]
**Completed:** [Date]
