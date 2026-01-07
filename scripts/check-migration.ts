import { createClient } from "@supabase/supabase-js"
import * as dotenv from "dotenv"

dotenv.config({ path: ".env.local" })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function checkMigration() {
  console.log("Checking if Milestone 6 tables exist...\n")

  // Try to query pipeline_stages (from migration 005)
  const { data: stages, error: stagesError } = await supabase
    .from("pipeline_stages")
    .select("*")
    .limit(1)

  if (stagesError) {
    console.log("❌ pipeline_stages table:", stagesError.message)
  } else {
    console.log("✅ pipeline_stages table exists")
  }

  // Try to query analytics_events (from migration 005)
  const { data: events, error: eventsError } = await supabase
    .from("analytics_events")
    .select("*")
    .limit(1)

  if (eventsError) {
    console.log("❌ analytics_events table:", eventsError.message)
  } else {
    console.log("✅ analytics_events table exists")
  }

  // Try to query the original athletes table structure
  const { data: athletes, error: athletesError } = await supabase
    .from("athletes")
    .select("id, full_name, sport")
    .limit(1)

  if (athletesError) {
    console.log("❌ athletes table:", athletesError.message)
  } else {
    console.log("✅ athletes table exists (basic columns work)")
  }
}

checkMigration()
  .then(() => {
    console.log("\n✓ Migration check complete!")
    process.exit(0)
  })
  .catch((error) => {
    console.error("\n❌ Check failed:", error)
    process.exit(1)
  })
