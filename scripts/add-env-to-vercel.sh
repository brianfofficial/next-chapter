#!/bin/bash

# Quick Vercel Environment Setup
# Usage: ./scripts/add-env-to-vercel.sh <supabase_service_role_key> <stripe_publishable_key> <stripe_secret_key> [stripe_webhook_secret]

set -e

if [ "$#" -lt 3 ]; then
    echo "❌ Missing arguments"
    echo ""
    echo "Usage: ./scripts/add-env-to-vercel.sh <supabase_service_role_key> <stripe_publishable_key> <stripe_secret_key> [stripe_webhook_secret]"
    echo ""
    echo "Example:"
    echo "  ./scripts/add-env-to-vercel.sh \\"
    echo "    eyJhbGc... \\"
    echo "    pk_test_... \\"
    echo "    sk_test_... \\"
    echo "    whsec_..."
    exit 1
fi

SUPABASE_SERVICE_ROLE_KEY="$1"
STRIPE_PUBLISHABLE_KEY="$2"
STRIPE_SECRET_KEY="$3"
STRIPE_WEBHOOK_SECRET="${4:-}"

# Known values
SUPABASE_URL="https://nsfnbporijeaitiqzxyh.supabase.co"
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5zZm5icG9yaWplYWl0aXF6eHloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc3Mjg2MDksImV4cCI6MjA4MzMwNDYwOX0.bBB4uMQ5pRoDYkSyQqf_LCzG8smtPzO_Z47dAnWjad8"
APP_URL="https://next-chapter-brianfprojects.vercel.app"

echo "🚀 Adding environment variables to Vercel..."
echo ""

# Add each variable
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
echo "✅ Done! Environment variables added to Vercel production."
echo ""
echo "🚀 Next: Deploy with 'vercel --prod'"
