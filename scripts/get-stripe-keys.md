# Getting Your Stripe Keys for NextChapter Sandbox

## Step 1: Log into Stripe Dashboard

Go to: https://dashboard.stripe.com/test/apikeys

Make sure you're in **Test mode** (toggle in the top right should show "Test mode")

## Step 2: Get API Keys

You should see two keys:

### Publishable Key
- Starts with `pk_test_...`
- Example: `pk_test_51QSB3tP123456789abcdef`
- **Safe to use in client-side code**
- Copy this for `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

### Secret Key
- Starts with `sk_test_...`
- Click "Reveal test key" to see it
- Example: `sk_test_51QSB3tP123456789abcdef`
- **NEVER expose this publicly**
- Copy this for `STRIPE_SECRET_KEY`

## Step 3: Create Webhook Endpoint (For Payment Processing)

1. Go to: https://dashboard.stripe.com/test/webhooks
2. Click **"Add endpoint"**
3. Set endpoint URL to: `https://next-chapter-brianfprojects.vercel.app/api/webhooks/stripe`
4. Under "Events to send", select these events:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Click **"Add endpoint"**
6. Copy the **Signing secret** (starts with `whsec_...`)
7. Use this for `STRIPE_WEBHOOK_SECRET`

## Step 4: Set Up Products and Prices (If Not Already Done)

### Create Pro Subscription Product:

1. Go to: https://dashboard.stripe.com/test/products
2. Click **"Add product"**
3. Fill in:
   - **Name**: "Next Chapter Pro"
   - **Description**: "Full access to athlete database and messaging"
   - **Pricing model**: "Recurring"
   - **Price**: $299
   - **Billing period**: Monthly
4. Click **"Save product"**
5. Copy the **Price ID** (starts with `price_...`)
6. Update `app/employers/upgrade/page.tsx` line 42 with this price ID:
   ```typescript
   price: 'price_YOUR_ACTUAL_PRICE_ID_HERE'
   ```

## Quick Reference

Once you have all keys, you'll need:

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

## Testing Payment Flow

After deployment, test the full flow:

1. Go to `/employers/upgrade`
2. Click "Upgrade to Pro"
3. Use test card: `4242 4242 4242 4242`
4. Any future date for expiry
5. Any 3 digits for CVC
6. Any valid ZIP code

Stripe will process this as a successful test payment.

## Troubleshooting

- **"No such price" error**: Your price ID in the code doesn't match Stripe
- **"Webhook signature verification failed"**: Your webhook secret is incorrect
- **"Invalid API key"**: You're using the wrong secret key or publishable key

## Resources

- Stripe Test Cards: https://stripe.com/docs/testing#cards
- Webhook Testing: https://stripe.com/docs/webhooks/test
- NextChapter Webhook Endpoint: `/api/webhooks/stripe/route.ts`
