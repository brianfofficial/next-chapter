# Milestone 4: Stripe Integration Setup Guide

## Overview

Milestone 4 adds full payment processing and subscription management to Next Chapter, allowing employers to upgrade to the Pro plan ($299/month) and access athlete contact information.

## What's Included

### ✅ Stripe Integration
- Checkout flow for Pro subscription
- Webhook handlers for payment events
- Billing portal for subscription management
- Subscription status tracking

### ✅ Database Updates
- Added Stripe customer and subscription fields to employers table
- Migration 003 applied to production database

### ✅ New Pages & Routes
- `/employers/upgrade` - Updated with real Stripe Checkout
- `/employers/success` - Post-payment success page
- `/employers/settings` - Account and billing management
- `/api/stripe/checkout` - Create checkout session
- `/api/stripe/webhook` - Handle Stripe events
- `/api/stripe/portal` - Create billing portal session

### ✅ Seed Data Script
- `scripts/seed.ts` - Populates database with 20 realistic athlete profiles
- Diverse sports: Football, Basketball, Soccer, Baseball, Track, and more
- Top schools: Ohio State, Duke, UCLA, Michigan, Stanford, etc.

---

## Setup Instructions

### 1. Get Supabase Service Role Key

You need this for the seed script and webhook handler.

1. Go to [Supabase Dashboard](https://supabase.com/dashboard/project/nsfnbporijeaitiqzxyh/settings/api)
2. Scroll to "Service Role" section
3. Click "Reveal" next to `service_role` key
4. Copy the key (starts with `eyJhbGc...`)
5. Add to `.env.local`:
   ```bash
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
   ```

### 2. Set Up Stripe Test Account

1. **Create Stripe Account** (if you don't have one):
   - Go to https://stripe.com
   - Click "Start now" → "Skip to dashboard"
   - Complete account setup

2. **Enable Test Mode**:
   - In Stripe Dashboard, toggle "Test mode" ON (top right)
   - You should see "Test mode" badge

3. **Get API Keys**:
   - Go to [Developers → API Keys](https://dashboard.stripe.com/test/apikeys)
   - Copy your **Publishable key** (starts with `pk_test_`)
   - Copy your **Secret key** (starts with `sk_test_`)
   - Add to `.env.local`:
     ```bash
     NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
     STRIPE_SECRET_KEY=sk_test_...
     ```

### 3. Set Up Stripe Webhooks

Webhooks allow Stripe to notify your app about payment events.

#### For Local Development:

1. **Install Stripe CLI** (if not already installed):
   ```bash
   brew install stripe/stripe-cli/stripe
   ```

2. **Login to Stripe CLI**:
   ```bash
   stripe login
   ```
   - This will open browser to authorize
   - Confirm the pairing code matches

3. **Start webhook forwarding**:
   ```bash
   stripe listen --forward-to localhost:3005/api/stripe/webhook
   ```
   - Copy the webhook signing secret (starts with `whsec_`)
   - Add to `.env.local`:
     ```bash
     STRIPE_WEBHOOK_SECRET=whsec_...
     ```
   - Keep this terminal window running

#### For Production:

1. Go to [Stripe Webhooks](https://dashboard.stripe.com/test/webhooks)
2. Click "+ Add endpoint"
3. Set endpoint URL: `https://your-domain.vercel.app/api/stripe/webhook`
4. Select events to listen for:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Click "Add endpoint"
6. Reveal and copy "Signing secret"
7. Add to Vercel environment variables:
   ```bash
   vercel env add STRIPE_WEBHOOK_SECRET
   ```

### 4. Seed Database with Sample Athletes

This creates 20 realistic athlete profiles for testing the employer browse experience.

1. **Make sure you have the Service Role Key** in `.env.local` (from step 1)

2. **Run the seed script**:
   ```bash
   npx ts-node scripts/seed.ts
   ```

3. **Verify seeding**:
   - Go to [Supabase Table Editor](https://supabase.com/dashboard/project/nsfnbporijeaitiqzxyh/editor)
   - Click on `athletes` table
   - You should see 20 new athletes with varied sports, schools, and graduation years

4. **Sample Athletes Include**:
   - Marcus Thompson - Football QB (Ohio State)
   - Sarah Chen - Basketball PG (Duke)
   - James Rodriguez - Soccer MF (UCLA)
   - Emily Washington - Track Sprinter (Stanford)
   - And 16 more across Football, Basketball, Soccer, Baseball, Track, Volleyball, Swimming, Lacrosse, Wrestling, Tennis, Softball, and Gymnastics

---

## Testing the Integration

### Test Checkout Flow (Local)

1. **Start the app**:
   ```bash
   npm run dev
   ```

2. **Start Stripe webhook listener** (separate terminal):
   ```bash
   stripe listen --forward-to localhost:3005/api/stripe/webhook
   ```

3. **Test the flow**:
   - Sign up as an employer at http://localhost:3005/employers/signup
   - Complete signup and browse athletes
   - Click on an athlete profile
   - See blurred contact info (paywall)
   - Click "Upgrade to Pro"
   - Click "Upgrade to Pro - $299/month"
   - Use Stripe test card: `4242 4242 4242 4242`
   - Any future expiry date (e.g., 12/34)
   - Any 3-digit CVC (e.g., 123)
   - Any ZIP code (e.g., 12345)
   - Complete payment
   - Should redirect to `/employers/success`
   - Go back to athlete profile
   - Contact info should now be visible!

4. **Verify in Stripe Dashboard**:
   - Go to [Payments](https://dashboard.stripe.com/test/payments)
   - You should see the $299 payment
   - Go to [Subscriptions](https://dashboard.stripe.com/test/subscriptions)
   - You should see an active subscription

### Test Billing Portal

1. **Go to settings**:
   - Navigate to http://localhost:3005/employers/settings
   - Click "Manage Billing & Subscription"

2. **In Stripe portal, you can**:
   - Update payment method
   - View invoices
   - Cancel subscription (test this!)
   - Download receipts

3. **Test cancellation**:
   - Cancel the subscription
   - Go back to athlete profile
   - Contact info should be blurred again

### Test Card Numbers

Stripe provides test cards for different scenarios:

- **Success**: `4242 4242 4242 4242`
- **Requires authentication**: `4000 0025 0000 3155`
- **Declined**: `4000 0000 0000 9995`
- **Insufficient funds**: `4000 0000 0000 9995`

[Full list of test cards](https://stripe.com/docs/testing#cards)

---

## Webhook Events

The webhook handler (`/api/stripe/webhook/route.ts`) processes these events:

### `checkout.session.completed`
- Triggered when payment is successful
- Updates employer to Pro tier
- Sets subscription status to "active"
- Records subscription start and end dates

### `customer.subscription.updated`
- Triggered when subscription renews or changes
- Updates subscription status
- Updates billing period dates

### `customer.subscription.deleted`
- Triggered when subscription is canceled
- Downgrades employer to free_trial tier
- Sets status to "canceled"

### `invoice.payment_succeeded`
- Triggered on successful recurring payment
- Confirms subscription remains active

### `invoice.payment_failed`
- Triggered when payment fails
- Sets subscription status to "past_due"

---

## Environment Variables Summary

Your `.env.local` should have:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://nsfnbporijeaitiqzxyh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# Stripe (Test Mode)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

---

## Deployment to Production

### 1. Add Environment Variables to Vercel

```bash
vercel env add SUPABASE_SERVICE_ROLE_KEY production
vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY production
vercel env add STRIPE_SECRET_KEY production
vercel env add STRIPE_WEBHOOK_SECRET production
```

Enter the values when prompted.

### 2. Set Up Production Webhook

After deploying:

1. Go to [Stripe Webhooks](https://dashboard.stripe.com/test/webhooks)
2. Add endpoint: `https://your-domain.vercel.app/api/stripe/webhook`
3. Select all the events listed above
4. Copy new webhook secret
5. Update Vercel env: `vercel env add STRIPE_WEBHOOK_SECRET production`

### 3. Deploy

```bash
vercel --prod
```

### 4. Seed Production Database

Once deployed, seed the production database:

```bash
npx ts-node scripts/seed.ts
```

---

## Troubleshooting

### "Webhook signature verification failed"
- Check that `STRIPE_WEBHOOK_SECRET` matches your webhook endpoint
- For local development, make sure `stripe listen` is running
- For production, make sure you're using the production webhook secret (not the local one)

### "No employer profile found"
- Make sure you're signed in as an employer (not an athlete)
- Check that employer record exists in database

### Payment succeeds but subscription_tier doesn't update
- Check webhook is configured correctly
- Check `stripe listen` is running (local) or webhook is set up (production)
- Check Supabase logs for any errors
- Verify `SUPABASE_SERVICE_ROLE_KEY` is correct

### Seed script fails
- Check `SUPABASE_SERVICE_ROLE_KEY` is set in `.env.local`
- Make sure you're using the service role key (not anon key)
- Check Supabase connection is working

### Contact info still blurred after upgrade
- Wait 2-3 seconds for webhook to process
- Refresh the page
- Check employer record in Supabase shows `subscription_tier: 'pro'`
- Check browser console for errors

---

## Files Changed in Milestone 4

### New Files
```
supabase/migrations/003_add_stripe_fields.sql
app/api/stripe/checkout/route.ts
app/api/stripe/webhook/route.ts
app/api/stripe/portal/route.ts
app/employers/success/page.tsx
app/employers/settings/page.tsx
scripts/seed.ts
.env.example
MILESTONE-4-SETUP.md
```

### Modified Files
```
app/employers/upgrade/page.tsx (Added real Stripe Checkout)
.env.local (Added Stripe keys)
package.json (Added Stripe dependencies)
```

---

## Next Steps

After Milestone 4 is working:

1. **Test all user flows**:
   - Athlete signup and profile creation
   - Employer signup, browse, and save athletes
   - Upgrade flow with real payment
   - Billing portal for subscription management

2. **UX improvements**:
   - Add loading states to all async operations
   - Improve error messages
   - Test mobile responsiveness
   - Add success/error toasts

3. **Prepare for launch**:
   - Switch from Stripe test mode to live mode
   - Set up production domain
   - Configure email notifications
   - Set up analytics tracking

---

## Support

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Testing Guide](https://stripe.com/docs/testing)
- [Supabase Documentation](https://supabase.com/docs)

---

**Status**: ✅ Milestone 4 Complete - Payment Processing Integrated

Ready to accept payments and start monetizing! 💰
