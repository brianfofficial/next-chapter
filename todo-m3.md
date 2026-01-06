# Milestone 3: Employer Dashboard & Browse - Task List

## Overview
Build employer side of platform: landing page, signup, browse athletes, view profiles with paywalled contact info.

---

## 1. Database Schema Updates

### 1.1 Create employers table
- [ ] Create migration file `002_create_employers_table.sql`
- [ ] Fields: id (UUID references auth.users), user_id, company_name, industry, company_size, contact_email, subscription_tier ('free_trial', 'basic', 'pro'), role_hiring_for, created_at, updated_at
- [ ] Enable RLS policies (employers can only access their own data)
- [ ] Add updated_at trigger
- [ ] Create index on contact_email

### 1.2 Create saved_athletes table
- [ ] Add to same migration file
- [ ] Fields: id (UUID primary key), employer_id (references employers.id), athlete_id (references athletes.id), saved_at, notes (text, optional)
- [ ] Enable RLS policies (employers can only access their own saved athletes)
- [ ] Create composite index on (employer_id, athlete_id)
- [ ] Add unique constraint on (employer_id, athlete_id)

### 1.3 Update athletes table
- [ ] Add is_public boolean column (default true)
- [ ] Migration to alter table
- [ ] Update RLS policies to respect is_public for employer access

### 1.4 Update database types
- [ ] Add Employer type to `lib/database.types.ts`
- [ ] Add SavedAthlete type to `lib/database.types.ts`
- [ ] Update Athletes type with is_public field

---

## 2. Employer Authentication & Hooks

### 2.1 Employer hooks
- [ ] Create `lib/hooks/useEmployer.ts` - Get employer profile
- [ ] Add employer type detection in useAuth hook
- [ ] Create `lib/hooks/useSavedAthletes.ts` - Get employer's saved athletes

### 2.2 Update auth flow
- [ ] Modify signup to detect employer vs athlete
- [ ] Tag OAuth users with user_type in metadata
- [ ] Create employer profile on first login

---

## 3. Employer Landing Page (/employers)

### 3.1 Create /employers page
- [ ] Create `app/employers/page.tsx`
- [ ] Hero section: "Find Elite Talent" with compelling copy
- [ ] Value propositions section:
  - Pre-vetted NCAA athletes
  - Skills already translated to corporate language
  - Access to 500K+ graduating athletes yearly
  - Filter by sport, school, GPA, graduation year
- [ ] How it works section (3 steps)
- [ ] Pricing preview (Free trial → upgrade)
- [ ] Social proof (companies using it)
- [ ] CTA: "Start Free Trial" → /employers/signup
- [ ] Keep dark theme with blue accents for employer pages

### 3.2 Design system updates
- [ ] Add employer blue accent color to globals.css
- [ ] Create employer-specific gradient classes
- [ ] Ensure consistent dark mode design

---

## 4. Employer Signup Flow (/employers/signup)

### 4.1 Create signup page
- [ ] Create `app/employers/signup/page.tsx`
- [ ] Multi-step form:
  - Step 1: Company info (name, industry, company size dropdown)
  - Step 2: Work email validation (block Gmail, Yahoo, etc.)
  - Step 3: Hiring needs (what roles are you hiring for?)
  - Step 4: OAuth signup (Continue with Google)
- [ ] Form validation
- [ ] Email domain validation (must be company email)
- [ ] Store form data in state, save after OAuth

### 4.2 Create API route
- [ ] Create `app/api/employers/signup/route.ts`
- [ ] POST endpoint to create employer profile
- [ ] Validation: check email domain, required fields
- [ ] Upsert to employers table
- [ ] Set user_metadata.user_type = 'employer'
- [ ] Return success/error

### 4.3 Update auth callback
- [ ] Modify `app/auth/callback/route.ts`
- [ ] Check if pending employer signup in sessionStorage
- [ ] If employer, redirect to /employers/browse instead of /profile
- [ ] Auto-save employer profile data

---

## 5. Browse Athletes Page (/employers/browse)

### 5.1 Create browse page
- [ ] Create `app/employers/browse/page.tsx`
- [ ] Protected route (employers only)
- [ ] Header with search bar
- [ ] Filters sidebar:
  - Sport (multi-select checkboxes)
  - Graduation year (range slider or checkboxes)
  - School (searchable dropdown or input)
  - GPA range
  - Position (sport-specific, dynamic based on sport filter)
- [ ] Athlete cards grid (responsive 3-4 columns)
- [ ] Pagination or infinite scroll
- [ ] "No results" empty state

### 5.2 Athlete profile cards
- [ ] Create `components/employers/AthleteCard.tsx`
- [ ] Display: Sport icon, name (if available), position, school, grad year
- [ ] Translated summary preview (first 100 chars)
- [ ] "View Full Profile" button
- [ ] "Save" heart icon (toggle saved status)
- [ ] Hover effects

### 5.3 Create browse API
- [ ] Create `app/api/athletes/browse/route.ts`
- [ ] GET endpoint with query params for filters
- [ ] Return paginated athlete profiles
- [ ] Only return is_public = true athletes
- [ ] Exclude sensitive contact info for free trial users
- [ ] Include count for pagination

### 5.4 Search & filter logic
- [ ] Implement search by keywords (searches translated_summary, sport, position)
- [ ] Implement filter by sport
- [ ] Implement filter by graduation year
- [ ] Implement filter by school
- [ ] Combine filters with AND logic

---

## 6. Full Athlete Profile View (/employers/athletes/[id])

### 6.1 Create profile page
- [ ] Create `app/employers/athletes/[id]/page.tsx`
- [ ] Protected route (employers only)
- [ ] Fetch full athlete profile
- [ ] Display: Sport, position, school, graduation year, GPA, major
- [ ] Display: Full translated summary
- [ ] Display: All bullet points
- [ ] Contact info section (email) - BLURRED with paywall
- [ ] "Upgrade to Contact" CTA button
- [ ] "Save to List" button
- [ ] Back to browse button

### 6.2 Create profile API
- [ ] Create `app/api/athletes/[id]/route.ts`
- [ ] GET endpoint to fetch single athlete profile
- [ ] Check employer subscription tier
- [ ] If free_trial, blur/hide contact info
- [ ] If paid, return full contact info
- [ ] Return athlete data

### 6.3 Blur/paywall component
- [ ] Create `components/employers/ContactPaywall.tsx`
- [ ] Blurred email display
- [ ] "Upgrade to Contact Athletes" modal trigger
- [ ] Pricing comparison
- [ ] Upgrade CTA

---

## 7. Save Athletes Feature

### 7.1 Save/unsave functionality
- [ ] Create `app/api/employers/saved-athletes/route.ts`
- [ ] POST to save athlete (add to saved_athletes table)
- [ ] DELETE to unsave athlete
- [ ] GET to fetch all saved athletes for employer

### 7.2 Saved athletes list page
- [ ] Create `app/employers/saved/page.tsx`
- [ ] Display grid of saved athlete cards
- [ ] Same card component as browse page
- [ ] "Remove from saved" button
- [ ] Empty state: "No saved athletes yet"

---

## 8. Employer Navigation & Layout

### 8.1 Create employer layout
- [ ] Create `app/employers/layout.tsx`
- [ ] Employer-specific nav bar with links:
  - Browse Athletes
  - Saved (with count badge)
  - Account Settings
  - Sign Out
- [ ] Different styling (blue accents instead of gold)
- [ ] Show company name in nav

### 8.2 Route protection
- [ ] Create middleware to check user_type
- [ ] Redirect athletes trying to access /employers/* to /profile
- [ ] Redirect employers trying to access /profile to /employers/browse

---

## 9. UI Components

### 9.1 Athlete card component
- [ ] `components/employers/AthleteCard.tsx`
- [ ] Responsive grid item
- [ ] Sport icon, position, school display
- [ ] Summary preview with "Read more" truncation
- [ ] Save heart icon with toggle state
- [ ] Click handler to view full profile

### 9.2 Filter sidebar
- [ ] `components/employers/FilterSidebar.tsx`
- [ ] Collapsible on mobile
- [ ] Sport checkboxes with icons
- [ ] Graduation year range
- [ ] School input with autocomplete
- [ ] GPA range slider
- [ ] Clear filters button
- [ ] Apply button

### 9.3 Search bar
- [ ] `components/employers/SearchBar.tsx`
- [ ] Input with search icon
- [ ] Debounced search (500ms)
- [ ] Clear button
- [ ] Search suggestions (optional)

### 9.4 Paywall modal
- [ ] `components/employers/UpgradeModal.tsx`
- [ ] Triggered by "Upgrade to Contact" button
- [ ] Pricing tiers comparison
- [ ] Feature list per tier
- [ ] CTA buttons for each tier
- [ ] Close button

---

## 10. Employer Account Settings

### 10.1 Settings page
- [ ] Create `app/employers/settings/page.tsx`
- [ ] Company info edit form
- [ ] Email preferences
- [ ] Billing info (placeholder for Stripe)
- [ ] Subscription tier display
- [ ] Upgrade/downgrade options
- [ ] Delete account option

---

## 11. Subscription & Paywall Logic

### 11.1 Subscription tier checks
- [ ] Helper function `lib/utils/checkSubscription.ts`
- [ ] Check employer.subscription_tier
- [ ] Return allowed features based on tier
- [ ] Free trial: browse only, no contact info
- [ ] Basic: contact info for X athletes/month
- [ ] Pro: unlimited contact info

### 11.2 Contact info gating
- [ ] In athlete profile API, check subscription tier
- [ ] If free_trial, return null for email
- [ ] If basic/pro, return full contact info
- [ ] Track contact info views (for usage limits)

---

## 12. Email Domain Validation

### 12.1 Validation utility
- [ ] Create `lib/utils/validateEmail.ts`
- [ ] Blacklist common personal email domains (gmail.com, yahoo.com, hotmail.com, etc.)
- [ ] Check email against blacklist
- [ ] Return error message if invalid

### 12.2 Use in signup
- [ ] Add validation to employer signup form
- [ ] Show error message for invalid domains
- [ ] Block form submission if invalid

---

## 13. Design Updates

### 13.1 Color system
- [ ] Add employer blue accent: #0066CC or similar
- [ ] Add employer-specific gradient classes
- [ ] Update button variants for employer pages

### 13.2 Consistent styling
- [ ] Ensure all employer pages use dark mode
- [ ] Use blue accents on employer pages
- [ ] Keep gold accents on athlete pages
- [ ] Professional, modern design

---

## 14. Testing

### 14.1 Manual testing
- [ ] Employer signup flow end-to-end
- [ ] Browse athletes with filters
- [ ] Save/unsave athletes
- [ ] View athlete profile
- [ ] Paywall shows correctly for free trial
- [ ] Contact info hidden for free trial
- [ ] Navigation works correctly
- [ ] Route protection works

### 14.2 User flows
- [ ] Employer signs up → sees browse page
- [ ] Employer searches for athletes → finds results
- [ ] Employer saves athlete → appears in saved list
- [ ] Employer views profile → sees paywall
- [ ] Employer clicks upgrade → sees pricing modal

---

## 15. Documentation

### 15.1 Update README
- [ ] Add Milestone 3 features section
- [ ] Update project structure
- [ ] Add employer flow documentation

### 15.2 Create M3 summary
- [ ] Create `MILESTONE-3-SUMMARY.md`
- [ ] Document all features built
- [ ] User flow diagrams
- [ ] Files created/modified
- [ ] Setup instructions
- [ ] Known limitations

---

## Priority Order

**Phase 1: Foundation (Start Here)**
1. Database schema updates (all migrations)
2. Update database types
3. Employer hooks
4. Employer landing page

**Phase 2: Signup & Auth**
5. Employer signup page
6. Signup API route
7. Auth callback updates
8. Email validation

**Phase 3: Core Feature (Browse)**
9. Browse athletes page
10. Browse API
11. Athlete card component
12. Filter sidebar
13. Search functionality

**Phase 4: Profile View**
14. Full athlete profile page
15. Profile API
16. Paywall component
17. Save/unsave functionality

**Phase 5: Navigation & Polish**
18. Employer layout
19. Route protection
20. Saved athletes page
21. Settings page (basic)
22. Testing & documentation

---

## Notes
- Subscription tiers will be placeholder for now (Stripe integration in Milestone 4)
- Free trial lets employers browse but not contact
- Focus on making browse experience excellent (this is the product)
- Keep employer and athlete experiences visually distinct but cohesive
