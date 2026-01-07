# Next Chapter - Athlete Career Platform

> You spent 4 years becoming elite. Now become undeniable.

## Overview

Next Chapter is a B2B2C SaaS platform helping the 98% of NCAA athletes who don't go pro translate their athletic experience into thriving corporate careers.

### The Problem
500,000 NCAA athletes graduate yearly. Less than 2% go pro. They've spent 4 years building elite skills (discipline, teamwork, performing under pressure, coachability) but their resumes can't translate this.

### The Solution
A skill translation engine that transforms athletic achievements into corporate language that resonates with hiring managers.

## Features

### Milestone 1 ✅ Complete
- ✅ **Landing Page** - Emotional, premium design with hero section
- ✅ **Sport Selection** - Choose from 8+ sports (Football, Basketball, Soccer, etc.)
- ✅ **Athlete Onboarding** - Position selection, experience input
- ✅ **Skill Translation Engine** - Rule-based translations with sport-specific templates
- ✅ **Real-Time Preview** - Watch athletic experience transform into corporate language
- ✅ **Shareable Output** - Copy-to-clipboard for LinkedIn/resume
- ✅ **Premium Design** - Dark mode with gold accents, smooth animations
- ✅ **Mobile-First** - Fully responsive design

### Milestone 2 ✅ Complete
- ✅ **Authentication** - Google and LinkedIn OAuth via Supabase
- ✅ **User Profiles** - Save athlete information and translations
- ✅ **Database Integration** - Supabase with Row Level Security
- ✅ **Protected Routes** - Secure profile page and data access
- ✅ **Persistent Storage** - Translations saved to cloud database
- ✅ **Auto-Save Flow** - Seamless login → save → profile workflow
- ✅ **Profile Page** - View and manage saved translations

### Milestone 3 ✅ Complete
- ✅ **Employer Portal** - Separate employer user type and authentication
- ✅ **Employer Landing Page** - Value proposition and signup flow
- ✅ **Employer Registration** - Multi-step signup with company validation
- ✅ **Browse Athletes** - Searchable, filterable talent database
- ✅ **Advanced Filters** - Filter by sport, graduation year, school, GPA
- ✅ **Athlete Profiles** - Full profile view with professional summary
- ✅ **Contact Paywall** - Blurred contact info with upgrade prompt
- ✅ **Save Functionality** - Save athletes to favorites list
- ✅ **Saved Athletes Page** - Manage saved talent
- ✅ **Subscription Tiers** - Free trial vs Pro tier distinction
- ✅ **Blue Employer Theme** - Visual distinction from athlete gold theme

### Milestone 4 ✅ Complete
- ✅ **Stripe Integration** - Full payment processing with Stripe Checkout
- ✅ **Subscription Management** - Pro plan at $299/month with automatic billing
- ✅ **Checkout Flow** - Secure payment with test mode support
- ✅ **Webhook Handlers** - Process subscription events (create, update, cancel)
- ✅ **Billing Portal** - Self-service subscription and payment management
- ✅ **Payment Success Page** - Post-checkout confirmation and next steps
- ✅ **Settings Page** - Account management with billing integration
- ✅ **Database Migrations** - Added Stripe fields for customer and subscription tracking
- ✅ **Seed Data Script** - 20 sample athlete profiles for testing and demos
- ✅ **Contact Info Unlocking** - Automatic access after Pro subscription payment

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (Google & LinkedIn OAuth)
- **Payments**: Stripe (Checkout, Subscriptions, Billing Portal)
- **Styling**: Tailwind CSS + Custom design system
- **UI Components**: Custom components with shadcn/ui patterns
- **Animations**: Framer Motion
- **Language**: TypeScript
- **Deployment**: Vercel

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account (for auth & database)

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Add your Supabase credentials to .env.local
```

### Supabase Setup

See the comprehensive **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)** guide for detailed instructions.

Quick start:

1. **Create Supabase Project** at [supabase.com](https://supabase.com)
2. **Set Environment Variables** in `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
3. **Run Migrations**:
   ```bash
   supabase link --project-ref your-project-ref
   supabase db push
   ```
4. **Configure Google OAuth** in Supabase dashboard

### Run Locally

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

The app will be available at [http://localhost:3005](http://localhost:3005)

See `MILESTONE-2-SUMMARY.md` for detailed setup instructions.

## Project Structure

\`\`\`
next-chapter/
├── app/
│   ├── layout.tsx                      # Root layout
│   ├── page.tsx                        # Athlete landing page
│   ├── login/page.tsx                  # Athlete login
│   ├── profile/page.tsx                # Athlete profile
│   ├── auth/callback/route.ts          # OAuth callback handler
│   ├── employers/
│   │   ├── page.tsx                    # Employer landing page
│   │   ├── signup/page.tsx             # Employer registration
│   │   ├── browse/page.tsx             # Browse athletes
│   │   ├── saved/page.tsx              # Saved athletes list
│   │   ├── athletes/[id]/page.tsx      # Athlete profile view
│   │   ├── upgrade/page.tsx            # Upgrade to Pro
│   │   └── welcome/page.tsx            # Post-signup flow
│   └── api/
│       ├── athletes/
│       │   ├── browse/route.ts         # Browse API with filters
│       │   └── [id]/route.ts           # Get athlete profile
│       ├── employers/
│       │   ├── signup/route.ts         # Employer registration
│       │   └── saved-athletes/route.ts # Save/unsave athletes
│       └── translations/save/route.ts  # Save athlete translations
├── components/
│   ├── skill-translator.tsx            # Translation engine UI
│   ├── employers/
│   │   ├── AthleteCard.tsx             # Browse grid card
│   │   ├── FilterSidebar.tsx           # Search filters
│   │   ├── SearchBar.tsx               # Debounced search
│   │   └── ContactPaywall.tsx          # Paywall component
│   └── ui/                             # Reusable UI components
├── lib/
│   ├── translations.ts                 # Translation engine
│   ├── database.types.ts               # Supabase types
│   ├── hooks/
│   │   ├── useAuth.ts                  # Auth hook
│   │   ├── useUser.ts                  # Athlete profile hook
│   │   └── useEmployer.ts              # Employer profile hook
│   ├── supabase/
│   │   ├── client.ts                   # Browser client
│   │   ├── server.ts                   # Server client
│   │   └── middleware.ts               # Auth middleware
│   └── utils/
│       └── validateEmail.ts            # Email domain validation
├── supabase/
│   └── migrations/
│       ├── 001_create_athletes_table.sql
│       └── 002_create_employers_tables.sql
├── SUPABASE_SETUP.md                   # Setup guide
├── MILESTONE-2-SUMMARY.md              # M2 documentation
└── MILESTONE-3-SUMMARY.md              # M3 documentation
\`\`\`

## Translation Engine

The translation engine uses sport-specific templates to convert athletic achievements into corporate language:

### Example Translations:

**Before (Athletic):**
- Team Captain
- Practiced 20 hours/week
- Reviewed film daily

**After (Corporate):**
- Led 85-person organization through high-stakes performance cycles
- Managed rigorous 20hr/week schedule while maintaining 3.2 GPA
- Analyzed performance data to iterate on strategic approach

### Sport-Specific Skills

Each sport has unique translations:
- **Football**: Strategic planning, rapid decision-making, physical resilience
- **Basketball**: Quick decision-making, spatial awareness, team chemistry
- **Soccer**: Global perspective, endurance, seamless teamwork
- **Track**: Goal-setting, individual accountability, data-driven optimization
- And more...

## Next Milestones

### Milestone 5: Enhanced Features & Analytics (Next)
- In-app messaging between employers and athletes
- Resume PDF generation with branded templates
- Email notifications and weekly digests
- Employer analytics dashboard with hiring insights
- Success tracking and placement metrics
- Athlete search saved filters
- Advanced search with keywords and skills
- Employer team management (add multiple users)

### Milestone 6: Athletic Department Portal
- White-label customization for universities
- Placement tracking and reporting dashboard
- Recruiting materials integration
- Team management for athletic departments
- Bulk athlete imports and profile templates
- Department-wide analytics and success metrics

### Milestone 7: Go-to-Market & Scale
- Production launch with live payments
- Custom domain and branding
- Analytics integration (PostHog/Google Analytics)
- SEO optimization and content marketing
- Partnership outreach to athletic departments
- Beta testing program with 10-20 employers
- User feedback collection and iteration

## Design System

### Colors

**Athlete Theme (Gold):**
- **Primary Gold**: #FFD700
- **Athletic Orange**: #FFA500
- **Dark Background**: #0a0a0a to #1a1a1a gradient

**Employer Theme (Blue):**
- **Employer Blue**: #0EA5E9
- **Employer Blue Light**: #38BDF8
- **Employer Blue Dark**: #0284C7
- **Same Dark Background**: #0a0a0a to #1a1a1a gradient

### Typography
- Font: Inter
- Headings: Bold, gradient text for emphasis
- Body: Regular, high contrast for readability

### Components
- Dark mode default
- Gold accent colors
- Smooth transitions and hover effects
- Mobile-first responsive design

## Key Features

### 1. Emotional Landing Page
The hero section captures the emotion: "You spent 4 years becoming elite. Now become undeniable."

### 2. Three-Step Flow
1. Pick your sport
2. Enter your experience
3. Watch it transform

### 3. Instant Gratification
Real-time translation as athletes input their information.

### 4. Shareability
One-click copy to clipboard for LinkedIn, resume, or other platforms.

## Performance

- Lighthouse score target: 90+ on all metrics
- Mobile-first responsive design
- Optimized images and fonts
- Fast page loads with Next.js

## Contributing

This is currently a solo project. Future contributions welcome once MVP is validated.

## License

Proprietary - All rights reserved

## Contact

For inquiries about Next Chapter, please reach out through the platform.

---

**Status**: ✅ Milestones 1, 2, 3, & 4 Complete

- Milestone 1: Landing page and skill translator ✅
- Milestone 2: Authentication and database integration ✅
- Milestone 3: Employer dashboard and browse ✅
- Milestone 4: Stripe integration and payment processing ✅

**Next Steps**:
1. **Add Stripe keys** to `.env.local` (see MILESTONE-4-SETUP.md)
2. **Seed database** with sample athletes: `npx ts-node scripts/seed.ts`
3. **Test payment flow** locally with Stripe test cards
4. **Deploy to production** with updated environment variables
5. **Set up production webhooks** in Stripe dashboard
6. **Launch beta** with select employers and gather feedback
