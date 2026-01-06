# Next Chapter - Product Specification

## Vision
Help the 98% of NCAA athletes who don't go pro translate their athletic experience into thriving corporate careers.

## Market Opportunity
- **500,000 NCAA athletes** graduate yearly
- **Less than 2%** go pro
- **High demand** from employers (Enterprise, Northwestern Mutual, Oracle) who actively seek former athletes
- **Gap in market**: Athletes can't translate experience, employers can't find them efficiently

## Core Value Proposition
Transform athletic achievements into corporate language that resonates with hiring managers while connecting companies directly with elite talent.

---

## Product Architecture (B2B2C SaaS)

### 1. ATHLETE SIDE (Free Tier)

**Core Features:**
- **Skill Translation Engine**
  - Sport-specific translation templates
  - Position-based context (captain vs. role player)
  - Achievement quantification
  - Examples:
    - "Team captain" → "Led 85-person organization through high-stakes performance cycles"
    - "Film review" → "Analyzed performance data to iterate on strategy"
    - "Practice 20hrs/week" → "Managed rigorous 20hr/week performance schedule while maintaining 3.2 GPA"

- **AI-Powered Resume Builder**
  - Sport-specific templates (Basketball, Football, Swimming, Track, etc.)
  - Position-specific variations (QB, Lineman, Guard, etc.)
  - Downloadable in multiple formats (PDF, DOCX, LinkedIn-optimized)

- **Career Path Matching**
  - Match athletes to industries based on sport/position
  - Examples: Football linemen → Construction management, Point guards → Sales
  - Show success stories from similar athletes

- **Profile Visibility Settings**
  - Control which employers can see profile
  - Opt-in to employer searches
  - Anonymous browsing mode

**User Journey:**
1. Sign up (Google/LinkedIn SSO)
2. Select sport and position
3. Enter achievements and stats
4. Watch real-time translation
5. Generate shareable content
6. Enable employer visibility

---

### 2. EMPLOYER SIDE ($5K-25K/year subscription)

**Pricing Tiers:**
- **Starter**: $5K/year (50 outreach credits/month, basic filters)
- **Professional**: $12K/year (200 outreach credits/month, advanced filters, analytics)
- **Enterprise**: $25K/year (Unlimited outreach, dedicated support, API access)

**Core Features:**
- **Searchable Talent Database**
  - Filter by: Sport, School, Graduation year, Location, GPA, Leadership roles
  - Advanced search: Skills match, Industry interest, Availability

- **Direct Outreach & Messaging**
  - In-app messaging system
  - Template library for first outreach
  - Track response rates

- **Analytics Dashboard**
  - Athlete engagement metrics
  - Response rates by sport/school
  - Hiring funnel conversion
  - ROI tracking

- **Team Collaboration**
  - Multi-seat access
  - Shared candidate pools
  - Notes and ratings

---

### 3. ATHLETIC DEPARTMENT SIDE ($10K-50K/year)

**Pricing Tiers:**
- **Division II/III**: $10K/year
- **Division I**: $25K/year
- **Power 5 Conference**: $50K/year (includes custom integrations)

**Core Features:**
- **White-Label Platform**
  - Custom branding (school colors, logos)
  - Custom domain (careers.schoolname.edu)
  - Embedded in existing career services site

- **Placement Dashboard**
  - Track athlete career outcomes
  - Generate recruiting pitch materials
  - Showcase placement rates by sport

- **Recruiting Enhancement**
  - "95% of our athletes placed in careers" messaging
  - Success story generation
  - Alumni network integration

- **Analytics & Reporting**
  - Athlete engagement rates
  - Top hiring companies
  - Salary data (anonymized)

---

## Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + shadcn/ui
- **Animations**: Framer Motion
- **State Management**: React Context + Zustand (if needed)

### Backend
- **Auth**: Supabase Auth (Google/LinkedIn SSO)
- **Database**: Supabase PostgreSQL
- **Storage**: Supabase Storage (profile photos, resumes)
- **AI**: OpenAI GPT-4 for skill translation
- **Payments**: Stripe (subscriptions + usage-based billing)

### Infrastructure
- **Hosting**: Vercel
- **Email**: Resend or SendGrid
- **Analytics**: PostHog
- **Monitoring**: Sentry

---

## Design Principles

### Visual Identity
- **Premium, Aspirational** - Not corporate stuffy
- **Dark Mode Default** - With gold/athletic accents (#FFD700, #FFA500)
- **Motion & Micro-interactions** - Athletes appreciate performance
- **Mobile-First** - Athletes live on their phones

### UX Principles
- **Instant Gratification** - Show translated skills in real-time
- **Social Proof** - Success stories everywhere
- **Trust Building** - Transparent pricing, clear ROI
- **Shareability** - One-click LinkedIn/Twitter share

---

## Milestones

### MILESTONE 1: Core Translation Engine + Landing (Weeks 1-2)
**Goal**: Validate concept with working skill translator

**Deliverables:**
- [ ] Landing page with emotional hook
- [ ] Athlete onboarding flow (sport/position selection)
- [ ] Skill translation engine (dummy AI, rule-based)
- [ ] Real-time translation preview
- [ ] Shareable LinkedIn-ready summary generation
- [ ] Mobile-responsive design

**Success Metrics:**
- Landing page conversion >5%
- Time-to-first-translation <60 seconds
- Share rate >20% of completions

---

### MILESTONE 2: Auth + Profile Persistence (Weeks 3-4)
**Goal**: Athletes can save and return to profiles

**Deliverables:**
- [ ] Supabase Auth integration (Google + LinkedIn SSO)
- [ ] Database schema (athletes, profiles, achievements)
- [ ] Save/edit athlete profiles
- [ ] Resume PDF generation
- [ ] Profile completion tracking
- [ ] Email notifications (welcome, profile tips)

**Success Metrics:**
- Registration-to-profile-completion >50%
- Return user rate >30% in first week

---

### MILESTONE 3: Employer Dashboard (Weeks 5-7)
**Goal**: Employers can browse and contact athletes

**Deliverables:**
- [ ] Employer onboarding flow
- [ ] Searchable athlete database
- [ ] Filter system (sport, school, location, etc.)
- [ ] In-app messaging system
- [ ] Athlete detail pages
- [ ] Employer analytics dashboard (basic)

**Success Metrics:**
- Employer sign-ups >10
- Messages sent >100
- Athlete response rate >40%

---

### MILESTONE 4: Monetization (Weeks 8-10)
**Goal**: Revenue-generating product

**Deliverables:**
- [ ] Stripe integration (subscriptions)
- [ ] Pricing page for employers
- [ ] Paywall for employer features
- [ ] Usage-based credit system
- [ ] Billing dashboard for employers
- [ ] Subscription management

**Success Metrics:**
- First paying customer
- MRR >$5K by end of month
- Churn <10%

---

### MILESTONE 5: Athletic Department Portal (Weeks 11-14)
**Goal**: Land first university partnership

**Deliverables:**
- [ ] White-label customization system
- [ ] Athletic department admin dashboard
- [ ] Placement tracking analytics
- [ ] Recruiting pitch material generator
- [ ] Alumni network integration
- [ ] Custom domain setup

**Success Metrics:**
- First university signed
- >100 athletes onboarded from partner school
- Renewal commitment secured

---

### MILESTONE 6: AI Enhancement + Scale (Weeks 15-20)
**Goal**: Industry-leading translation quality

**Deliverables:**
- [ ] OpenAI GPT-4 integration for skill translation
- [ ] Sport-specific AI models (fine-tuned)
- [ ] Career path recommendation engine
- [ ] Interview prep assistant
- [ ] Success story matching
- [ ] SEO optimization for athlete discovery

**Success Metrics:**
- Translation quality rating >4.5/5
- Organic traffic >1K/month
- Platform athletes >5,000

---

## Go-to-Market Strategy

### Phase 1: Athlete Acquisition (Months 1-3)
- Partner with 3-5 universities as launch partners
- Social media content (LinkedIn, Twitter) showcasing translations
- Athlete influencer partnerships
- Free tier with viral sharing mechanics

### Phase 2: Employer Sales (Months 2-6)
- Outbound sales to companies known to hire athletes
- Case studies from early placements
- ROI calculator on website
- Webinars for HR/recruiting teams

### Phase 3: Athletic Department Expansion (Months 6-12)
- White papers on career placement impact
- Conference presentations (NCAA, NACDA)
- University partnership program
- Referral incentives

---

## Key Metrics (North Star)

**Primary**: Athlete Placements (job offers accepted)
**Secondary**:
- Employer NPS
- Athlete profile completion rate
- Average time-to-placement
- Employer-to-athlete message ratio

---

## Competitive Differentiation

**vs. LinkedIn**: Sport-specific translation, verified athletic credentials
**vs. General Job Boards**: Direct employer access, no resume black holes
**vs. University Career Services**: Scale, employer network, modern UX

---

## Risk Mitigation

**Risk**: Athletes don't complete profiles
**Mitigation**: Gamification, profile completion incentives, dead-simple UX

**Risk**: Employers don't renew subscriptions
**Mitigation**: Usage analytics, success metrics, quarterly business reviews

**Risk**: Universities build their own solution
**Mitigation**: Network effects, superior product, fast iteration

---

## Future Vision (12-24 months)

- **Skill Assessment Tools**: Validate soft skills through simulations
- **Interview Prep**: AI-powered mock interviews
- **Salary Negotiation**: Data-driven compensation coaching
- **International Expansion**: European sports (soccer, rugby)
- **Professional Athletes**: Help post-career transition
