import { createClient } from "@supabase/supabase-js"
import * as dotenv from "dotenv"

dotenv.config({ path: ".env.local" })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const ADMIN_EMAIL = "workwithbrianfarello@gmail.com"

async function setupAdmin() {
  console.log("🔧 Setting up admin account...\n")

  try {
    // Step 1: Check if user exists in auth.users
    const { data: authUser, error: authError } = await supabase.auth.admin.listUsers()

    if (authError) {
      console.error("❌ Error checking users:", authError)
      return
    }

    const existingUser = authUser.users.find(u => u.email === ADMIN_EMAIL)

    if (!existingUser) {
      console.log(`⚠️  User ${ADMIN_EMAIL} not found in auth.users`)
      console.log("\nTo create this admin account:")
      console.log("1. Go to https://next-chapter-4744ivcau-brianfprojects.vercel.app")
      console.log("2. Click 'Sign In' and use Google OAuth with workwithbrianfarello@gmail.com")
      console.log("3. Complete the signup process")
      console.log("4. Run this script again\n")
      return
    }

    console.log(`✅ Found user in auth.users: ${existingUser.id}`)

    // Step 2: Check if employer record exists
    const { data: employer, error: employerError } = await supabase
      .from("employers")
      .select("*")
      .eq("id", existingUser.id)
      .single()

    if (employerError && employerError.code !== "PGRST116") {
      console.error("❌ Error checking employer:", employerError)
      return
    }

    // Step 3: Create or update employer record with admin flag
    if (!employer) {
      console.log("📝 Creating employer record with admin privileges...")

      const { error: insertError } = await supabase
        .from("employers")
        .insert({
          id: existingUser.id,
          contact_email: ADMIN_EMAIL,
          contact_name: "Admin User",
          company_name: "Next Chapter Admin",
          subscription_tier: "pro",
          subscription_status: "active",
          is_admin: true
        })

      if (insertError) {
        console.error("❌ Error creating employer:", insertError)
        return
      }

      console.log("✅ Employer record created with admin privileges")
    } else {
      console.log("📝 Updating existing employer record to admin...")

      const { error: updateError } = await supabase
        .from("employers")
        .update({
          is_admin: true,
          subscription_tier: "pro",
          subscription_status: "active"
        })
        .eq("id", existingUser.id)

      if (updateError) {
        console.error("❌ Error updating employer:", updateError)
        return
      }

      console.log("✅ Employer record updated with admin privileges")
    }

    // Step 4: Verify admin access
    const { data: verifyAdmin, error: verifyError } = await supabase
      .from("employers")
      .select("id, contact_email, is_admin, subscription_tier")
      .eq("id", existingUser.id)
      .single()

    if (verifyError) {
      console.error("❌ Error verifying admin:", verifyError)
      return
    }

    console.log("\n🎉 Admin account setup complete!")
    console.log("\nAdmin Details:")
    console.log(`  Email: ${verifyAdmin.contact_email}`)
    console.log(`  Admin: ${verifyAdmin.is_admin}`)
    console.log(`  Subscription: ${verifyAdmin.subscription_tier}`)
    console.log(`  User ID: ${verifyAdmin.id}`)

    console.log("\n✨ You can now:")
    console.log("  • View all athletes and employers")
    console.log("  • Access admin dashboard (coming soon)")
    console.log("  • Unlimited messaging and contacts")
    console.log("  • No subscription required")

  } catch (error) {
    console.error("\n❌ Setup failed:", error)
  }
}

setupAdmin()
  .then(() => {
    console.log("\n✓ Script complete!")
    process.exit(0)
  })
  .catch((error) => {
    console.error("\n❌ Script failed:", error)
    process.exit(1)
  })
