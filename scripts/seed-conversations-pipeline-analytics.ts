import { createClient } from "@supabase/supabase-js"
import * as dotenv from "dotenv"

dotenv.config({ path: ".env.local" })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const ADMIN_EMAIL = "workwithbrianfarello@gmail.com"

async function seedData() {
  console.log("🌱 Seeding conversations, pipeline, and analytics...\n")

  // Get admin employer ID
  const { data: employer } = await supabase
    .from('employers')
    .select('id')
    .eq('contact_email', ADMIN_EMAIL)
    .single()

  if (!employer) {
    console.error("❌ Admin employer not found. Please run admin setup first.")
    return
  }

  const employerId = employer.id
  console.log(`✅ Found employer ID: ${employerId}\n`)

  // Clean up existing test data
  console.log("🧹 Cleaning up existing test data...")
  await supabase.from('messages').delete().eq('sender_id', employerId)
  await supabase.from('conversations').delete().eq('employer_id', employerId)
  await supabase.from('pipeline_candidates').delete().eq('employer_id', employerId)
  await supabase.from('pipeline_stages').delete().eq('employer_id', employerId)
  await supabase.from('analytics_events').delete().eq('user_id', employerId)
  console.log("  ✅ Cleaned up existing data\n")

  // Get some athletes
  const { data: athletes } = await supabase
    .from('athletes')
    .select('id, email, sport, school')
    .limit(15)

  if (!athletes || athletes.length === 0) {
    console.error("❌ No athletes found. Please run athlete seed first.")
    return
  }

  console.log(`✅ Found ${athletes.length} athletes\n`)

  // 1. Create conversations and messages
  console.log("📧 Creating conversations and messages...")
  let conversationsCreated = 0
  let messagesCreated = 0

  for (let i = 0; i < Math.min(5, athletes.length); i++) {
    const athlete = athletes[i]
    
    // Create conversation
    const { data: conversation, error: convError } = await supabase
      .from('conversations')
      .insert({
        employer_id: employerId,
        athlete_id: athlete.id
      })
      .select()
      .single()

    if (convError) {
      console.log(`  ⚠️  Conversation with ${athlete.email} failed: ${convError.message}`)
      continue
    }

    conversationsCreated++

    // Create 3-5 messages per conversation
    const messageCount = Math.floor(Math.random() * 3) + 3
    const messages = []

    for (let j = 0; j < messageCount; j++) {
      const isFromEmployer = j % 2 === 0
      const messageTemplates = isFromEmployer ? [
        "Hi! I came across your profile and was impressed by your experience. Would love to chat about an opportunity.",
        "Thanks for your response! We're looking for someone with your leadership background. When would be a good time to connect?",
        "Great to hear from you! Let me send over some details about the role and our company culture."
      ] : [
        "Thanks for reaching out! I'd definitely be interested in learning more about the opportunity.",
        "That sounds great! I'm available for a call next week. Tuesday or Thursday afternoon work best for me.",
        "Appreciate the information! This aligns well with my career goals. Looking forward to our conversation."
      ]

      messages.push({
        conversation_id: conversation.id,
        sender_id: isFromEmployer ? employerId : athlete.id,
        sender_type: isFromEmployer ? 'employer' : 'athlete',
        content: messageTemplates[j % messageTemplates.length],
        created_at: new Date(Date.now() - (messageCount - j) * 3600000).toISOString() // Stagger by hours
      })
    }

    const { error: msgError } = await supabase
      .from('messages')
      .insert(messages)

    if (msgError) {
      console.log(`  ⚠️  Messages for conversation ${conversation.id} failed: ${msgError.message}`)
      console.log(`  Details:`, JSON.stringify(msgError, null, 2))
    } else {
      messagesCreated += messages.length
    }
  }

  console.log(`  ✅ Created ${conversationsCreated} conversations`)
  console.log(`  ✅ Created ${messagesCreated} messages\n`)

  // 2. Create pipeline stages (if not exist)
  console.log("📊 Setting up pipeline stages...")
  
  const stages = [
    { name: 'Discovery', order_index: 0, color: '#3B82F6' },
    { name: 'Initial Contact', order_index: 1, color: '#8B5CF6' },
    { name: 'Screening', order_index: 2, color: '#EC4899' },
    { name: 'Interview', order_index: 3, color: '#F59E0B' },
    { name: 'Offer', order_index: 4, color: '#10B981' },
    { name: 'Hired', order_index: 5, color: '#059669' }
  ]

  let stagesCreated = 0
  const stageIds: { [key: string]: string } = {}

  for (const stage of stages) {
    const { data, error } = await supabase
      .from('pipeline_stages')
      .insert({
        employer_id: employerId,
        ...stage
      })
      .select()
      .single()

    if (!error && data) {
      stageIds[stage.name] = data.id
      stagesCreated++
    }
  }

  console.log(`  ✅ Created ${stagesCreated} pipeline stages\n`)

  // 3. Create pipeline candidates
  console.log("👥 Creating pipeline candidates...")
  let candidatesCreated = 0

  const candidateData = [
    { athlete: athletes[0], stage: 'Interview', priority: 'high', position: 'Sales Associate', salary: 65000 },
    { athlete: athletes[1], stage: 'Screening', priority: 'medium', position: 'Marketing Coordinator', salary: 58000 },
    { athlete: athletes[2], stage: 'Offer', priority: 'urgent', position: 'Operations Manager', salary: 75000 },
    { athlete: athletes[3], stage: 'Initial Contact', priority: 'low', position: 'Business Analyst', salary: 70000 },
    { athlete: athletes[4], stage: 'Discovery', priority: 'medium', position: 'Account Executive', salary: 62000 },
    { athlete: athletes[5], stage: 'Interview', priority: 'high', position: 'Project Manager', salary: 80000 },
    { athlete: athletes[6], stage: 'Screening', priority: 'medium', position: 'Data Analyst', salary: 68000 },
    { athlete: athletes[7], stage: 'Hired', priority: 'high', position: 'Sales Manager', salary: 85000 },
  ]

  for (const candidate of candidateData) {
    if (!candidate.athlete || !stageIds[candidate.stage]) continue

    const { error } = await supabase
      .from('pipeline_candidates')
      .insert({
        employer_id: employerId,
        athlete_id: candidate.athlete.id,
        stage_id: stageIds[candidate.stage],
        priority: candidate.priority,
        position_title: candidate.position,
        salary_range: `$${candidate.salary.toLocaleString()}`
      })

    if (error) {
      console.log(`  ⚠️  Pipeline candidate failed: ${error.message}`)
      console.log(`  Details:`, JSON.stringify(error, null, 2))
    } else {
      candidatesCreated++
    }
  }

  console.log(`  ✅ Created ${candidatesCreated} pipeline candidates\n`)

  // 4. Create analytics events
  console.log("📈 Creating analytics events...")
  let eventsCreated = 0

  const eventTypes = ['page_view', 'profile_view', 'message_sent', 'athlete_saved', 'search_performed']
  const now = Date.now()
  const events = []

  // Create events for the past 30 days
  for (let day = 0; day < 30; day++) {
    const dayEvents = Math.floor(Math.random() * 15) + 5 // 5-20 events per day

    for (let i = 0; i < dayEvents; i++) {
      const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)]
      const timestamp = new Date(now - (day * 24 * 3600000) - (Math.random() * 24 * 3600000))

      events.push({
        user_id: employerId,
        user_type: 'employer',
        event_type: eventType,
        event_name: eventType,
        properties: {
          page: eventType === 'page_view' ? ['/employers/browse', '/employers/saved', '/employers/pipeline'][Math.floor(Math.random() * 3)] : null,
          search_query: eventType === 'search_performed' ? ['football', 'basketball', 'GPA 3.5+'][Math.floor(Math.random() * 3)] : null,
          athlete_id: eventType === 'profile_view' || eventType === 'athlete_saved' || eventType === 'message_sent'
            ? athletes[Math.floor(Math.random() * athletes.length)].id
            : null
        },
        page_url: eventType === 'page_view' ? ['/employers/browse', '/employers/saved', '/employers/pipeline'][Math.floor(Math.random() * 3)] : null,
        session_id: `session_${day}`,
        created_at: timestamp.toISOString()
      })
    }
  }

  // Insert in batches of 100
  for (let i = 0; i < events.length; i += 100) {
    const batch = events.slice(i, i + 100)
    const { error } = await supabase
      .from('analytics_events')
      .insert(batch)

    if (error) {
      console.log(`  ⚠️  Analytics batch ${i / 100 + 1} failed: ${error.message}`)
      console.log(`  Details:`, JSON.stringify(error, null, 2))
    } else {
      eventsCreated += batch.length
    }
  }

  console.log(`  ✅ Created ${eventsCreated} analytics events\n`)

  // Summary
  console.log("📊 Seed Summary:")
  console.log(`  ✅ Conversations: ${conversationsCreated}`)
  console.log(`  ✅ Messages: ${messagesCreated}`)
  console.log(`  ✅ Pipeline Stages: ${stagesCreated}`)
  console.log(`  ✅ Pipeline Candidates: ${candidatesCreated}`)
  console.log(`  ✅ Analytics Events: ${eventsCreated}`)
}

seedData()
  .then(() => {
    console.log("\n✨ Seed complete!")
    process.exit(0)
  })
  .catch((error) => {
    console.error("\n💥 Seed failed:", error)
    process.exit(1)
  })
