import { createClient } from "@supabase/supabase-js"
import * as dotenv from "dotenv"

dotenv.config({ path: ".env.local" })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function checkSchema() {
  console.log("Checking athletes table schema...\n")

  // Check what columns exist
  const { data: columns, error } = await supabase
    .from("athletes")
    .select("*")
    .limit(0)

  if (error) {
    console.error("Error querying athletes table:", error)
    return
  }

  console.log("Query succeeded. Checking applied migrations...")

  // Try to insert a test record to see the actual error
  const testAthlete = {
    full_name: "Test Athlete",
    sport: "Football",
    position: "Quarterback",
    school: "Test University",
    graduation_year: 2024,
    gpa: 3.5,
    contact_email: "test@example.com",
    athletic_experience: {
      years_played: 4,
      major: "Business",
      leadership_roles: ["Captain"],
      summary: "Test summary"
    },
    translated_bullets: [
      "Test bullet 1",
      "Test bullet 2"
    ]
  }

  const { data, error: insertError } = await supabase
    .from("athletes")
    .insert(testAthlete)
    .select()

  if (insertError) {
    console.error("\n❌ Insert test failed:")
    console.error("Error:", insertError.message)
    console.error("Details:", JSON.stringify(insertError, null, 2))
  } else {
    console.log("\n✅ Insert test succeeded!")
    console.log("Inserted record:", data)

    // Clean up
    if (data && data[0]) {
      await supabase.from("athletes").delete().eq("id", data[0].id)
      console.log("Test record cleaned up")
    }
  }
}

checkSchema()
  .then(() => {
    console.log("\n✓ Schema check complete!")
    process.exit(0)
  })
  .catch((error) => {
    console.error("\n❌ Schema check failed:", error)
    process.exit(1)
  })
