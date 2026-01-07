import { createClient } from "@supabase/supabase-js"
import * as dotenv from "dotenv"

dotenv.config({ path: ".env.local" })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const athletes = [
  {
    email: "marcus.thompson@example.com",
    full_name: "Marcus Thompson",
    sport: "Football",
    position: "Quarterback",
    school: "Ohio State University",
    graduation_year: 2024,
    gpa: "3.4",
    major: "Business Administration",
    experiences: {
      years_played: 4,
      leadership_roles: ["Team Captain", "Peer Mentor"],
      summary: "Led high-performing team of 85+ members through intense 12-game competition cycles"
    },
    translated_bullets: [
      "Coordinated cross-functional team of 85 in high-stakes performance environment",
      "Analyzed 40+ hours of performance data weekly to optimize strategic approach",
      "Maintained 3.4 GPA while managing 30+ hour/week commitment",
      "Mentored 8 underclassmen in leadership development"
    ],
    is_public: true
  },
  {
    email: "sarah.chen@example.com",
    full_name: "Sarah Chen",
    sport: "Basketball",
    position: "Point Guard",
    school: "Duke University",
    graduation_year: 2024,
    gpa: "3.8",
    major: "Economics",
    experiences: {
      years_played: 4,
      leadership_roles: ["Team Captain", "Student-Athlete Advisory Committee"],
      summary: "Orchestrated fast-paced offensive strategies for elite Division I program"
    },
    translated_bullets: [
      "Directed team strategy in real-time, processing complex information rapidly",
      "Achieved top 10% academic standing while dedicating 35+ hours weekly to athletics",
      "Collaborated with coaching staff to analyze opponent tendencies",
      "Led team in assists (6.2 per game), elevating collective performance"
    ],
    is_public: true
  },
  {
    email: "james.rodriguez@example.com",
    full_name: "James Rodriguez",
    sport: "Soccer",
    position: "Midfielder",
    school: "UCLA",
    graduation_year: 2025,
    gpa: "3.6",
    major: "Communications",
    experiences: {
      years_played: 4,
      leadership_roles: ["Team Captain", "Athlete Mentor"],
      summary: "Managed high-volume workflow in dynamic environment"
    },
    translated_bullets: [
      "Covered 7+ miles per game, demonstrating exceptional endurance",
      "Facilitated communication between units, ensuring strategic alignment",
      "Adapted strategies in real-time based on changing conditions",
      "Maintained 90%+ pass accuracy rate under pressure"
    ],
    is_public: true
  },
  {
    email: "emily.washington@example.com",
    full_name: "Emily Washington",
    sport: "Track and Field",
    position: "Sprinter",
    school: "Stanford University",
    graduation_year: 2024,
    gpa: "3.9",
    major: "Computer Science",
    experiences: {
      years_played: 4,
      leadership_roles: ["Team Representative"],
      summary: "Optimized performance through data-driven approach"
    },
    translated_bullets: [
      "Reduced 400m time by 8% through methodical analysis",
      "Managed 25+ hours/week training while maintaining 3.9 GPA in CS",
      "Collaborated with biomechanics team for performance optimization",
      "Competed at NCAA Championships under extreme pressure"
    ],
    is_public: true
  },
  {
    email: "tyler.brooks@example.com",
    full_name: "Tyler Brooks",
    sport: "Baseball",
    position: "Pitcher",
    school: "University of Michigan",
    graduation_year: 2024,
    gpa: "3.3",
    major: "Kinesiology",
    experiences: {
      years_played: 4,
      leadership_roles: ["Pitching Captain"],
      summary: "Executed high-pressure scenarios with precision"
    },
    translated_bullets: [
      "Averaged 12 strikeouts per 9 innings through strategic approach",
      "Studied opponent tendencies across 100+ hours of video analysis",
      "Maintained composure in critical situations (2.8 ERA in conference)",
      "Led pitching staff in innings pitched, demonstrating reliability"
    ],
    is_public: true
  },
  {
    email: "jessica.martinez@example.com",
    full_name: "Jessica Martinez",
    sport: "Volleyball",
    position: "Outside Hitter",
    school: "Penn State",
    graduation_year: 2024,
    gpa: "3.5",
    major: "Psychology",
    experiences: {
      years_played: 4,
      leadership_roles: ["Team Captain"],
      summary: "Delivered results in high-intensity collaborative environment"
    },
    translated_bullets: [
      "Led team in kills per set (4.2), consistently driving results",
      "Coordinated offensive strategy across 6 rotating positions",
      "Demonstrated mental toughness in crucial match situations",
      "Balanced 30+ hour/week athletic commitment with Psychology major"
    ],
    is_public: true
  },
  {
    email: "david.kim@example.com",
    full_name: "David Kim",
    sport: "Swimming",
    position: "Freestyle",
    school: "University of Texas",
    graduation_year: 2025,
    gpa: "3.7",
    major: "Engineering",
    experiences: {
      years_played: 4,
      leadership_roles: ["Team Captain"],
      summary: "Achieved peak performance through disciplined training"
    },
    translated_bullets: [
      "Improved 200m freestyle time by 6% through systematic approach",
      "Trained 20+ hours weekly while excelling in Engineering program",
      "Qualified for NCAA Championships in multiple events",
      "Applied data analytics to optimize stroke technique"
    ],
    is_public: true
  },
  {
    email: "amanda.foster@example.com",
    full_name: "Amanda Foster",
    sport: "Lacrosse",
    position: "Attack",
    school: "Northwestern University",
    graduation_year: 2024,
    gpa: "3.6",
    major: "Marketing",
    experiences: {
      years_played: 4,
      leadership_roles: ["Offensive Captain"],
      summary: "Drove offensive production in competitive environment"
    },
    translated_bullets: [
      "Scored 40+ goals per season, ranking top 5 in conference",
      "Created scoring opportunities through strategic positioning",
      "Collaborated with coaching staff on game planning",
      "Maintained academic excellence while leading team offense"
    ],
    is_public: true
  },
  {
    email: "chris.anderson@example.com",
    full_name: "Chris Anderson",
    sport: "Wrestling",
    position: "165 lbs",
    school: "Iowa State",
    graduation_year: 2024,
    gpa: "3.2",
    major: "Sports Management",
    experiences: {
      years_played: 4,
      leadership_roles: ["Team Leader"],
      summary: "Competed at elite level through mental and physical preparation"
    },
    translated_bullets: [
      "Achieved All-American status through disciplined training regimen",
      "Studied opponent techniques across 200+ matches",
      "Demonstrated resilience in high-pressure tournament situations",
      "Balanced intense physical demands with academic requirements"
    ],
    is_public: true
  },
  {
    email: "rachel.green@example.com",
    full_name: "Rachel Green",
    sport: "Softball",
    position: "Shortstop",
    school: "University of Alabama",
    graduation_year: 2025,
    gpa: "3.5",
    major: "Finance",
    experiences: {
      years_played: 4,
      leadership_roles: ["Team Captain"],
      summary: "Excelled in fast-paced decision-making environment"
    },
    translated_bullets: [
      "Maintained .350 batting average through consistent performance",
      "Executed defensive plays with 96% fielding percentage",
      "Led team in stolen bases, demonstrating strategic awareness",
      "Managed academic rigor in Finance while competing at elite level"
    ],
    is_public: true
  },
  {
    email: "brandon.jackson@example.com",
    full_name: "Brandon Jackson",
    sport: "Tennis",
    position: "Singles",
    school: "University of Virginia",
    graduation_year: 2024,
    gpa: "3.8",
    major: "Political Science",
    experiences: {
      years_played: 4,
      leadership_roles: ["Team Representative"],
      summary: "Performed under pressure in individual competition"
    },
    translated_bullets: [
      "Ranked top 20 nationally in Division I singles",
      "Competed in 100+ matches, demonstrating consistency",
      "Analyzed opponent patterns to develop winning strategies",
      "Achieved Dean's List while maintaining national ranking"
    ],
    is_public: true
  },
  {
    email: "nicole.johnson@example.com",
    full_name: "Nicole Johnson",
    sport: "Gymnastics",
    position: "All-Around",
    school: "UCLA",
    graduation_year: 2024,
    gpa: "3.9",
    major: "Biology",
    experiences: {
      years_played: 4,
      leadership_roles: ["Senior Leader"],
      summary: "Delivered precision performance under scrutiny"
    },
    translated_bullets: [
      "Scored 9.8+ average across all events through meticulous preparation",
      "Performed complex routines under intense pressure and judgment",
      "Collaborated with coaches on technique refinement",
      "Maintained 3.9 GPA in rigorous Biology program"
    ],
    is_public: true
  },
  {
    email: "kevin.liu@example.com",
    full_name: "Kevin Liu",
    sport: "Golf",
    position: "Individual",
    school: "University of Southern California",
    graduation_year: 2025,
    gpa: "3.4",
    major: "Business",
    experiences: {
      years_played: 4,
      leadership_roles: ["Team Captain"],
      summary: "Achieved excellence through focus and precision"
    },
    translated_bullets: [
      "Averaged 72.5 strokes per round, competing at elite level",
      "Demonstrated mental toughness across 40+ tournament rounds",
      "Applied analytical approach to course management",
      "Balanced individual competition with team responsibilities"
    ],
    is_public: true
  },
  {
    email: "olivia.taylor@example.com",
    full_name: "Olivia Taylor",
    sport: "Field Hockey",
    position: "Forward",
    school: "University of North Carolina",
    graduation_year: 2024,
    gpa: "3.7",
    major: "Education",
    experiences: {
      years_played: 4,
      leadership_roles: ["Team Captain", "Offensive Leader"],
      summary: "Drove team success through leadership and performance"
    },
    translated_bullets: [
      "Scored 15+ goals per season, leading offensive production",
      "Coordinated attack strategies with midfield unit",
      "Mentored younger players in skill development",
      "Maintained academic excellence in Education program"
    ],
    is_public: true
  },
  {
    email: "jordan.miller@example.com",
    full_name: "Jordan Miller",
    sport: "Cross Country",
    position: "Distance Runner",
    school: "University of Oregon",
    graduation_year: 2024,
    gpa: "3.6",
    major: "Environmental Science",
    experiences: {
      years_played: 4,
      leadership_roles: ["Team Captain"],
      summary: "Achieved goals through consistent effort and endurance"
    },
    translated_bullets: [
      "Competed at NCAA Championships through rigorous training",
      "Ran 80+ miles weekly while maintaining 3.6 GPA",
      "Improved 8K time by 10% through systematic approach",
      "Demonstrated resilience in challenging race conditions"
    ],
    is_public: true
  },
  {
    email: "alex.rivera@example.com",
    full_name: "Alex Rivera",
    sport: "Hockey",
    position: "Center",
    school: "Boston University",
    graduation_year: 2025,
    gpa: "3.3",
    major: "International Relations",
    experiences: {
      years_played: 4,
      leadership_roles: ["Alternate Captain"],
      summary: "Performed in high-speed competitive environment"
    },
    translated_bullets: [
      "Averaged 1.2 points per game in highly competitive conference",
      "Executed plays at speeds exceeding 20 mph",
      "Demonstrated quick decision-making under physical pressure",
      "Balanced demanding travel schedule with academic commitments"
    ],
    is_public: true
  },
  {
    email: "maya.patel@example.com",
    full_name: "Maya Patel",
    sport: "Rowing",
    position: "Stroke Seat",
    school: "University of Washington",
    graduation_year: 2024,
    gpa: "3.8",
    major: "Mechanical Engineering",
    experiences: {
      years_played: 4,
      leadership_roles: ["Boat Captain"],
      summary: "Led synchronized team performance through coordination"
    },
    translated_bullets: [
      "Coordinated movements of 8-person crew with millisecond precision",
      "Trained 25+ hours weekly including 5am practices",
      "Competed at Henley Royal Regatta, performing at highest level",
      "Excelled in Engineering while maintaining elite athletic standard"
    ],
    is_public: true
  },
  {
    email: "ryan.cooper@example.com",
    full_name: "Ryan Cooper",
    sport: "Water Polo",
    position: "2-Meter Defender",
    school: "Stanford University",
    graduation_year: 2024,
    gpa: "3.5",
    major: "Economics",
    experiences: {
      years_played: 4,
      leadership_roles: ["Defensive Captain"],
      summary: "Excelled in physical, high-intensity competitive setting"
    },
    translated_bullets: [
      "Led defensive unit ranked #1 in conference",
      "Made strategic decisions in fast-paced aquatic environment",
      "Demonstrated endurance across 30+ minute matches",
      "Balanced rigorous Economics coursework with athletic demands"
    ],
    is_public: true
  },
  {
    email: "sophia.adams@example.com",
    full_name: "Sophia Adams",
    sport: "Fencing",
    position: "Foil",
    school: "University of Notre Dame",
    graduation_year: 2025,
    gpa: "3.9",
    major: "Pre-Med",
    experiences: {
      years_played: 4,
      leadership_roles: ["Team Captain"],
      summary: "Achieved precision results through focus and strategy"
    },
    translated_bullets: [
      "Ranked top 10 nationally in NCAA foil competition",
      "Analyzed opponent patterns across 200+ bouts",
      "Demonstrated split-second decision-making under pressure",
      "Maintained 3.9 GPA in demanding Pre-Med track"
    ],
    is_public: true
  },
  {
    email: "isaiah.williams@example.com",
    full_name: "Isaiah Williams",
    sport: "Football",
    position: "Wide Receiver",
    school: "University of Georgia",
    graduation_year: 2024,
    gpa: "3.4",
    major: "Sports Management",
    experiences: {
      years_played: 4,
      leadership_roles: ["Offensive Captain"],
      summary: "Delivered consistent performance in high-pressure situations"
    },
    translated_bullets: [
      "Caught 60+ passes per season with 95% catch rate",
      "Studied defensive schemes across 15+ hours of film weekly",
      "Performed in stadiums with 90,000+ spectators",
      "Managed academic requirements while traveling for away games"
    ],
    is_public: true
  }
]

async function seedAthletes() {
  console.log("Starting to seed athletes with correct schema...\n")

  let successCount = 0
  let errorCount = 0

  for (const athlete of athletes) {
    // Generate UUID for id since we're using service role key
    const athleteWithId = {
      id: crypto.randomUUID(),
      ...athlete
    }

    const { data, error } = await supabase
      .from("athletes")
      .insert(athleteWithId)
      .select()

    if (error) {
      console.error(`❌ Error inserting ${athlete.full_name}:`, error.message)
      errorCount++
    } else {
      console.log(`✅ Successfully seeded ${athlete.full_name}`)
      successCount++
    }
  }

  console.log(`\n📊 Seeding Summary:`)
  console.log(`  ✅ Success: ${successCount}`)
  console.log(`  ❌ Errors: ${errorCount}`)
  console.log(`  📦 Total: ${athletes.length}`)
}

seedAthletes()
  .then(() => {
    console.log("\n✨ Seeding complete!")
    process.exit(0)
  })
  .catch((error) => {
    console.error("\n❌ Seeding failed:", error)
    process.exit(1)
  })
