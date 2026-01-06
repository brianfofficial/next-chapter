# Next Chapter - Milestone 1 Todo

## MILESTONE 1: Core Translation Engine + Landing Page
**Goal**: Validate concept with working skill translator
**Timeline**: Weeks 1-2

---

## Setup & Infrastructure
- [ ] Initialize Next.js 14 project with App Router
- [ ] Set up Tailwind CSS + shadcn/ui
- [ ] Configure Framer Motion for animations
- [ ] Set up project structure (components, lib, app directories)
- [ ] Configure TypeScript strict mode
- [ ] Set up ESLint and Prettier
- [ ] Create base layout with navigation

---

## Landing Page
- [ ] Hero section with emotional hook
  - [ ] Headline: "You spent 4 years becoming elite. Now become undeniable."
  - [ ] Subheadline: Value proposition for athletes
  - [ ] CTA button: "Translate Your Experience" → scroll to translator
  - [ ] Background: Athletic imagery with dark overlay

- [ ] Stats section
  - [ ] 500K athletes graduate yearly
  - [ ] <2% go pro
  - [ ] 98% need this tool
  - [ ] Animated counters

- [ ] Problem/Solution section
  - [ ] "Your Resume Doesn't Speak Corporate" problem statement
  - [ ] Before/After comparison (athletic vs. translated)
  - [ ] Visual transformation animation

- [ ] How It Works (3 steps)
  - [ ] Step 1: Pick your sport
  - [ ] Step 2: Enter your experience
  - [ ] Step 3: Watch it transform

- [ ] Social Proof section
  - [ ] Success stories (3-4 examples with photos)
  - [ ] Employer logos (companies that hire athletes)
  - [ ] Testimonial carousel

- [ ] CTA section
  - [ ] "Try It Free" button
  - [ ] "Takes 60 seconds" trust badge

- [ ] Footer
  - [ ] Links (About, For Employers, For Schools)
  - [ ] Social media links
  - [ ] Copyright

---

## Athlete Onboarding Flow

- [ ] Sport Selection page
  - [ ] Grid of popular sports with icons
  - [ ] Basketball, Football, Soccer, Baseball, Track, Swimming, Volleyball, etc.
  - [ ] Search functionality for less common sports
  - [ ] Smooth animations on selection

- [ ] Position Selection page (conditional based on sport)
  - [ ] Football: QB, RB, WR, TE, OL, DL, LB, DB, K/P
  - [ ] Basketball: PG, SG, SF, PF, C
  - [ ] Soccer: GK, Defender, Midfielder, Forward
  - [ ] Baseball: Pitcher, Catcher, Infield, Outfield
  - [ ] Dynamic based on sport selected

- [ ] Experience Input page
  - [ ] Leadership roles (Captain, Team rep, etc.)
  - [ ] Years played
  - [ ] Key achievements (form with 3-5 inputs)
  - [ ] Stats/metrics (sport-specific)
  - [ ] Academic info (GPA, major)
  - [ ] Real-time character counts
  - [ ] Helpful placeholder examples

---

## Skill Translation Engine (Rule-Based for MVP)

- [ ] Translation Templates Database
  - [ ] Create JSON file with sport/position → skill mappings
  - [ ] Leadership translations
  - [ ] Training translations
  - [ ] Performance translations
  - [ ] Team collaboration translations
  - [ ] Time management translations

- [ ] Translation Logic
  - [ ] Parse athlete input
  - [ ] Match to appropriate templates
  - [ ] Inject quantified metrics
  - [ ] Format corporate language
  - [ ] Output as bullet points

- [ ] Sport-Specific Rules
  - [ ] Football (leadership, discipline, teamwork)
  - [ ] Basketball (agility, quick decision-making)
  - [ ] Swimming (individual accountability, consistency)
  - [ ] Track (goal-setting, incremental improvement)
  - [ ] Soccer (global perspective, collaboration)

---

## Translation Preview & Results

- [ ] Real-Time Preview Panel
  - [ ] Split-screen view (input left, output right on desktop)
  - [ ] Stacked view (input top, output bottom on mobile)
  - [ ] Live updates as athlete types
  - [ ] Smooth transitions between states

- [ ] Results Display
  - [ ] Professional summary paragraph
  - [ ] 5-7 bullet points of translated skills
  - [ ] Quantified achievements
  - [ ] Copy-to-clipboard buttons (individual bullets + full summary)
  - [ ] Success animation on copy
  - [ ] "Download as PDF" button (future)

- [ ] Shareable LinkedIn Summary
  - [ ] Generate LinkedIn-optimized version
  - [ ] One-click copy
  - [ ] Share directly to LinkedIn (future)
  - [ ] Twitter-friendly version (future)

---

## Design System Components

- [ ] Button component
  - [ ] Primary (gold gradient)
  - [ ] Secondary (outline)
  - [ ] Ghost
  - [ ] Hover states with motion
  - [ ] Loading states

- [ ] Input component
  - [ ] Text input with floating label
  - [ ] Textarea with character count
  - [ ] Focus states (gold ring)
  - [ ] Error states

- [ ] Card component
  - [ ] Dark background with subtle border
  - [ ] Hover lift effect
  - [ ] Content padding
  - [ ] Shadow variations

- [ ] Typography system
  - [ ] H1, H2, H3 styles
  - [ ] Body text, small text
  - [ ] Gold accent text class
  - [ ] Gradient text for hero

- [ ] Icons
  - [ ] Sport icons (custom SVG or library)
  - [ ] Checkmarks, arrows, copy icons
  - [ ] Social media icons

---

## Animations & Micro-interactions

- [ ] Page transitions
  - [ ] Smooth scroll between sections
  - [ ] Fade-in on scroll for sections

- [ ] Translation reveal animation
  - [ ] Type-writer effect or slide-in
  - [ ] Highlight changed text
  - [ ] Success pulse

- [ ] Button interactions
  - [ ] Hover scale (1.05)
  - [ ] Click ripple effect
  - [ ] Loading spinner

- [ ] Form interactions
  - [ ] Input focus expansion
  - [ ] Character count color change
  - [ ] Validation shake on error

- [ ] Hero section
  - [ ] Parallax background scroll (subtle)
  - [ ] Floating elements
  - [ ] Gradient animation

---

## Mobile Responsiveness

- [ ] Breakpoint system (sm, md, lg, xl)
- [ ] Mobile navigation (hamburger menu)
- [ ] Touch-friendly buttons (min 44px)
- [ ] Optimized form layout for mobile
- [ ] Single-column layout on mobile
- [ ] Sticky CTA button on mobile
- [ ] Test on iOS Safari and Chrome
- [ ] Test on Android Chrome

---

## Content & Copy

- [ ] Write hero headline variations (A/B test ready)
- [ ] Write compelling subheadlines
- [ ] Create 10+ example translations for each sport
- [ ] Write "How It Works" section copy
- [ ] Create 4-5 success story examples
- [ ] Write employer logos section copy
- [ ] Create FAQ content (future)

---

## Dummy Data for MVP

- [ ] Example athlete profiles (5-7 across different sports)
- [ ] Translation templates JSON
- [ ] Success stories JSON
- [ ] Employer logos/names
- [ ] Stats for stats section

---

## Performance & SEO

- [ ] Image optimization (Next.js Image component)
- [ ] Lazy loading for below-fold content
- [ ] Metadata for landing page (title, description, OG tags)
- [ ] Font optimization (preload, display: swap)
- [ ] Lighthouse score >90 on all metrics
- [ ] Mobile-first approach

---

## Testing & Polish

- [ ] Test onboarding flow end-to-end
- [ ] Test translation quality across 5+ sports
- [ ] Test copy/paste functionality
- [ ] Cross-browser testing (Chrome, Safari, Firefox)
- [ ] Accessibility audit
  - [ ] Keyboard navigation
  - [ ] Screen reader compatibility
  - [ ] Color contrast ratios
  - [ ] Alt text for images

- [ ] Final design polish
  - [ ] Spacing consistency
  - [ ] Color consistency
  - [ ] Animation smoothness
  - [ ] Loading states for all interactions

---

## Deployment

- [ ] Deploy to Vercel
- [ ] Set up custom domain (nextchapter.app or similar)
- [ ] Configure environment variables
- [ ] Set up analytics (PostHog)
- [ ] SSL certificate
- [ ] Test production build

---

## Success Criteria for Milestone 1

✅ Landing page loads in <2 seconds
✅ Translation happens in real-time (<500ms)
✅ Mobile experience is excellent
✅ At least 3 sports have quality translations
✅ Shareable output works on LinkedIn
✅ Design feels premium and aspirational
✅ User can complete flow in <60 seconds

---

## Next Steps After Milestone 1

- Gather user feedback (5-10 athletes)
- Iterate on translation quality
- Prepare for Milestone 2 (Supabase integration)
- Start building email list for launch
