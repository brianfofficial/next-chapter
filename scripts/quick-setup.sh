#!/bin/bash

echo "🚀 Next Chapter - Quick Setup"
echo "================================"
echo ""

# Check if already opened browsers
echo "✅ Step 1/3: Opening Supabase Auth Settings..."
open "https://supabase.com/dashboard/project/nsfnbporijeaitiqzxyh/auth/providers"
sleep 2

echo "✅ Step 2/3: Opening Supabase SQL Editor..."
open "https://supabase.com/dashboard/project/nsfnbporijeaitiqzxyh/sql/new"
sleep 2

echo "✅ Step 3/3: Copying migration SQL to clipboard..."
cat supabase/migrations/006_add_admin_role.sql | pbcopy

echo ""
echo "🎯 Quick Actions Needed:"
echo "================================"
echo ""
echo "Tab 1 (Auth Providers - just opened):"
echo "  1. Click 'Google'"
echo "  2. Toggle 'Enable' to ON"
echo "  3. In 'Redirect URLs', add:"
echo "     • https://next-chapter-4744ivcau-brianfprojects.vercel.app/auth/callback"
echo "     • http://localhost:3005/auth/callback"
echo "  4. Click 'Save'"
echo ""
echo "Tab 2 (SQL Editor - just opened):"
echo "  1. Press Cmd+V (migration SQL is in clipboard)"
echo "  2. Click 'Run'"
echo "  3. Wait for success message"
echo ""
echo "Tab 3 (Will open next):"
echo "  • Sign in with workwithbrianfarello@gmail.com"
echo ""

read -p "Press Enter when you've completed Auth & SQL steps above..."

echo ""
echo "✅ Opening production site for sign-in..."
open "https://next-chapter-4744ivcau-brianfprojects.vercel.app"

echo ""
echo "📋 Next Steps:"
echo "  1. Click 'Sign In' on the site"
echo "  2. Click 'Continue with Google'"
echo "  3. Sign in with workwithbrianfarello@gmail.com"
echo "  4. Complete the employer signup"
echo ""

read -p "Press Enter after you've signed in and completed signup..."

echo ""
echo "🔧 Setting up admin account..."
npx tsx scripts/setup-admin.ts

echo ""
echo "🎉 Setup Complete!"
echo "================================"
echo ""
echo "You can now:"
echo "  • Browse all athletes (no paywall)"
echo "  • Send unlimited messages"
echo "  • Use all pro features"
echo "  • Access admin dashboard (coming soon)"
echo ""
echo "Production: https://next-chapter-4744ivcau-brianfprojects.vercel.app"
echo ""
