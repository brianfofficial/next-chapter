#!/bin/bash

# Next Chapter - Vercel Environment Variable Setup Script
# This script helps you configure all required environment variables for Vercel deployment

set -e

echo "🚀 Next Chapter - Vercel Environment Setup"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI is not installed. Installing now..."
    npm i -g vercel
fi

echo "📋 We'll now set up your environment variables for Vercel production."
echo ""

# Supabase URL (we already have this)
SUPABASE_URL="https://nsfnbporijeaitiqzxyh.supabase.co"
echo -e "${GREEN}✓${NC} Supabase URL: $SUPABASE_URL"

# Supabase Anon Key (we already have this)
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5zZm5icG9yaWplYWl0aXF6eHloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc3Mjg2MDksImV4cCI6MjA4MzMwNDYwOX0.bBB4uMQ5pRoDYkSyQqf_LCzG8smtPzO_Z47dAnWjad8"
echo -e "${GREEN}✓${NC} Supabase Anon Key: ${SUPABASE_ANON_KEY:0:20}..."
echo ""

# Get Supabase Service Role Key
echo -e "${YELLOW}📌 Step 1: Get Supabase Service Role Key${NC}"
echo "   Open: https://supabase.com/dashboard/project/nsfnbporijeaitiqzxyh/settings/api"
echo "   Copy the 'service_role' key (NOT the anon key)"
echo ""
read -p "   Paste your Supabase Service Role Key: " SUPABASE_SERVICE_ROLE_KEY
echo ""

# Get Stripe Keys
echo -e "${YELLOW}📌 Step 2: Get Stripe API Keys${NC}"
echo "   Open: https://dashboard.stripe.com/test/apikeys"
echo "   You should see your NextChapter sandbox keys"
echo ""
read -p "   Paste your Stripe Publishable Key (pk_test_...): " STRIPE_PUBLISHABLE_KEY
read -p "   Paste your Stripe Secret Key (sk_test_...): " STRIPE_SECRET_KEY
echo ""

# Stripe Webhook Secret (optional for now)
echo -e "${YELLOW}📌 Step 3: Stripe Webhook Secret (Optional)${NC}"
echo "   If you haven't set up webhooks yet, press Enter to skip"
echo "   You can add this later after webhook setup"
echo ""
read -p "   Paste your Stripe Webhook Secret (whsec_...) or press Enter: " STRIPE_WEBHOOK_SECRET
echo ""

# App URL
APP_URL="https://next-chapter-brianfprojects.vercel.app"
echo -e "${GREEN}✓${NC} App URL: $APP_URL"
echo ""

# Confirm before proceeding
echo "=========================================="
echo "📝 Summary of variables to add:"
echo "=========================================="
echo "NEXT_PUBLIC_SUPABASE_URL: $SUPABASE_URL"
echo "NEXT_PUBLIC_SUPABASE_ANON_KEY: ${SUPABASE_ANON_KEY:0:20}..."
echo "SUPABASE_SERVICE_ROLE_KEY: ${SUPABASE_SERVICE_ROLE_KEY:0:20}..."
echo "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: ${STRIPE_PUBLISHABLE_KEY:0:20}..."
echo "STRIPE_SECRET_KEY: ${STRIPE_SECRET_KEY:0:20}..."
if [ -n "$STRIPE_WEBHOOK_SECRET" ]; then
    echo "STRIPE_WEBHOOK_SECRET: ${STRIPE_WEBHOOK_SECRET:0:20}..."
fi
echo "NEXT_PUBLIC_APP_URL: $APP_URL"
echo "=========================================="
echo ""

read -p "Ready to add these to Vercel production? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Setup cancelled"
    exit 1
fi

echo ""
echo "🔄 Adding environment variables to Vercel..."
echo ""

# Add each variable to Vercel production
echo "$SUPABASE_URL" | vercel env add NEXT_PUBLIC_SUPABASE_URL production
echo "$SUPABASE_ANON_KEY" | vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
echo "$SUPABASE_SERVICE_ROLE_KEY" | vercel env add SUPABASE_SERVICE_ROLE_KEY production
echo "$STRIPE_PUBLISHABLE_KEY" | vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY production
echo "$STRIPE_SECRET_KEY" | vercel env add STRIPE_SECRET_KEY production

if [ -n "$STRIPE_WEBHOOK_SECRET" ]; then
    echo "$STRIPE_WEBHOOK_SECRET" | vercel env add STRIPE_WEBHOOK_SECRET production
fi

echo "$APP_URL" | vercel env add NEXT_PUBLIC_APP_URL production

echo ""
echo -e "${GREEN}✅ Environment variables added successfully!${NC}"
echo ""
echo "🚀 Next steps:"
echo "   1. Update your .env.local file with real keys (optional for local dev)"
echo "   2. Deploy to Vercel: vercel --prod"
echo "   3. Apply database migration via Supabase dashboard"
echo ""
