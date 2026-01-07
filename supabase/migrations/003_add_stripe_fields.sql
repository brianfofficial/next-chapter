-- Add Stripe-related fields to employers table
ALTER TABLE public.employers
  ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT,
  ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'incomplete' CHECK (subscription_status IN ('incomplete', 'incomplete_expired', 'trialing', 'active', 'past_due', 'canceled', 'unpaid')),
  ADD COLUMN IF NOT EXISTS subscription_start_date TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS subscription_end_date TIMESTAMP WITH TIME ZONE;

-- Create index on stripe_customer_id for faster lookups
CREATE INDEX IF NOT EXISTS employers_stripe_customer_id_idx ON public.employers(stripe_customer_id);

-- Create index on stripe_subscription_id for faster lookups
CREATE INDEX IF NOT EXISTS employers_stripe_subscription_id_idx ON public.employers(stripe_subscription_id);
