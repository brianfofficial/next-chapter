import { createClient } from "@supabase/supabase-js"
import * as dotenv from "dotenv"

dotenv.config({ path: ".env.local" })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const athletes = [
  {
    full_name: "Marcus Thompson",
    sport: "Football",
    position: "Quarterback",
    years_played: 4,
    school: "Ohio State University",
    graduation_year: 2024,
    gpa: 3.4,
    major: "Business Administration",
    summary:
      "Led high-performing team of 85+ members through intense 12-game competition cycles, executing strategic plays under pressure while maintaining rigorous academic schedule",
    translated_bullets: [
      "Coordinated cross-functional team of 85 in high-stakes performance environment, making split-second decisions with millions of viewers",
      "Analyzed 40+ hours of performance data weekly to identify patterns and optimize strategic approach",
      "Maintained 3.4 GPA while managing 30+ hour/week commitment, demonstrating exceptional time management",
      "Mentored 8 underclassmen in leadership development and performance optimization",
    ],
    leadership_roles: ["Team Captain", "Peer Mentor"],
    is_public: true,
  },
  {
    full_name: "Sarah Chen",
    sport: "Basketball",
    position: "Point Guard",
    years_played: 4,
    school: "Duke University",
    graduation_year: 2024,
    gpa: 3.8,
    major: "Economics",
    summary:
      "Orchestrated fast-paced offensive strategies for elite Division I program, making rapid decisions in high-pressure situations while excelling academically in competitive Economics program",
    translated_bullets: [
      "Directed team strategy in real-time, processing complex information and adapting approach based on competitive landscape",
      "Achieved top 10% academic standing while dedicating 35+ hours weekly to team performance obligations",
      "Collaborated with coaching staff to analyze opponent tendencies and develop counter-strategies",
      "Led team in assists (6.2 per game), demonstrating ability to elevate collective performance",
    ],
    leadership_roles: ["Team Captain", "Student-Athlete Advisory Committee"],
    is_public: true,
  },
  {
    full_name: "James Rodriguez",
    sport: "Soccer",
    position: "Midfielder",
    years_played: 4,
    school: "UCLA",
    graduation_year: 2025,
    gpa: 3.6,
    major: "Communications",
    summary:
      "Managed high-volume workflow in dynamic environment, coordinating offensive and defensive initiatives across diverse team while balancing academic excellence",
    translated_bullets: [
      "Covered 7+ miles per game, demonstrating exceptional endurance and sustained performance under physical demands",
      "Facilitated communication between forward and defensive units, ensuring alignment on strategic objectives",
      "Adapted strategies in real-time based on changing conditions and competitive pressures",
      "Maintained 90%+ pass accuracy rate, reflecting precision and attention to detail under pressure",
    ],
    leadership_roles: ["Team Captain", "Athlete Mentor"],
    is_public: true,
  },
  {
    full_name: "Emily Washington",
    sport: "Track and Field",
    position: "Sprinter",
    years_played: 4,
    school: "Stanford University",
    graduation_year: 2024,
    gpa: 3.9,
    major: "Computer Science",
    summary:
      "Optimized individual performance through data-driven approach, achieving measurable results through systematic preparation and relentless execution",
    translated_bullets: [
      "Reduced 400m time by 8% over 4 years through methodical analysis of technique and training regimen",
      "Managed rigorous training schedule (25+ hours/week) while maintaining 3.9 GPA in competitive CS program",
      "Collaborated with biomechanics team to leverage technology for performance optimization",
      "Competed at NCAA Championships, performing at highest level under extreme pressure",
    ],
    leadership_roles: ["Team Representative"],
    is_public: true,
  },
  {
    full_name: "Tyler Brooks",
    sport: "Baseball",
    position: "Pitcher",
    years_played: 4,
    school: "University of Michigan",
    graduation_year: 2024,
    gpa: 3.3,
    major: "Kinesiology",
    summary:
      "Executed precise game strategies in high-leverage situations, analyzing opponent patterns and adapting approach to achieve optimal outcomes",
    translated_bullets: [
      "Prepared comprehensive opponent analysis reports, studying 20+ hours of footage to identify tendencies",
      "Maintained 2.8 ERA while facing top 1% of collegiate competition, demonstrating consistent performance",
      "Collaborated with analytics team to optimize pitch selection based on data-driven insights",
      "Performed under intense scrutiny with ability to reset and execute after setbacks",
    ],
    leadership_roles: ["Team Captain"],
    is_public: true,
  },
  {
    full_name: "Jessica Martinez",
    sport: "Volleyball",
    position: "Outside Hitter",
    years_played: 4,
    school: "Penn State University",
    graduation_year: 2025,
    gpa: 3.7,
    major: "Marketing",
    summary:
      "Delivered consistent results in fast-paced, team-oriented environment, adapting to changing situations and maintaining focus through extended high-pressure scenarios",
    translated_bullets: [
      "Averaged 3.8 kills per set across 120+ matches, demonstrating reliable execution in critical moments",
      "Coordinated with teammates through nonverbal communication during rapid 2-3 second decision cycles",
      "Traveled 15,000+ miles annually while maintaining academic progress and team commitments",
      "Studied opponent tendencies to anticipate strategies and position team for success",
    ],
    leadership_roles: ["Team Captain", "Big Ten Student-Athlete Council"],
    is_public: true,
  },
  {
    full_name: "David Kim",
    sport: "Swimming",
    position: "Freestyle",
    years_played: 4,
    school: "University of Texas",
    graduation_year: 2024,
    gpa: 3.5,
    major: "Finance",
    summary:
      "Achieved elite performance through disciplined training regimen and meticulous attention to technical details, balancing individual excellence with team contribution",
    translated_bullets: [
      "Trained 20+ hours weekly with 5am starts, demonstrating exceptional time management and discipline",
      "Reduced race times by 6% through systematic analysis of stroke mechanics and training data",
      "Qualified for NCAA Championships all four years, performing consistently at highest level",
      "Mentored 6 younger teammates on training methodology and mental preparation",
    ],
    leadership_roles: ["Team Captain"],
    is_public: true,
  },
  {
    full_name: "Amanda Foster",
    sport: "Lacrosse",
    position: "Attack",
    years_played: 4,
    school: "Northwestern University",
    graduation_year: 2025,
    gpa: 3.8,
    major: "Psychology",
    summary:
      "Drove offensive production through strategic positioning and rapid decision-making, collaborating with teammates to execute complex game plans",
    translated_bullets: [
      "Led team in goals scored (45 in senior season), translating preparation into measurable outcomes",
      "Adapted offensive strategies in real-time based on defensive formations and game situations",
      "Maintained academic excellence (3.8 GPA) while managing 30+ hour weekly athletic commitment",
      "Analyzed game film 10+ hours weekly to identify opportunities for improvement",
    ],
    leadership_roles: ["Team Captain", "Academic All-American"],
    is_public: true,
  },
  {
    full_name: "Chris Anderson",
    sport: "Wrestling",
    position: "165 lbs",
    years_played: 4,
    school: "Iowa State University",
    graduation_year: 2024,
    gpa: 3.2,
    major: "Engineering",
    summary:
      "Performed in individual high-pressure competitions requiring strategic preparation, mental toughness, and ability to execute under extreme physical and mental demands",
    translated_bullets: [
      "Compiled 105-28 career record, demonstrating consistent performance over 4-year period",
      "Prepared match-specific strategies for 30+ opponents annually through detailed video analysis",
      "Managed strict weight protocols while maintaining peak physical performance and academic progress",
      "Qualified for NCAA Tournament three times, competing at highest national level",
    ],
    leadership_roles: ["Team Captain"],
    is_public: true,
  },
  {
    full_name: "Rachel Green",
    sport: "Tennis",
    position: "Singles",
    years_played: 4,
    school: "University of Southern California",
    graduation_year: 2024,
    gpa: 3.6,
    major: "International Relations",
    summary:
      "Competed in individual performance environment requiring mental resilience, strategic adaptation, and ability to perform under pressure across extended matches",
    translated_bullets: [
      "Won 75% of singles matches over 4 years through combination of technical skill and mental preparation",
      "Adapted game strategy mid-match based on opponent tendencies and changing conditions",
      "Managed individual preparation while contributing to team goals across dual match and tournament formats",
      "Traveled to 12+ tournaments annually while maintaining Dean's List academic standing",
    ],
    leadership_roles: ["Team Co-Captain"],
    is_public: true,
  },
  {
    full_name: "Brandon Jackson",
    sport: "Football",
    position: "Linebacker",
    years_played: 4,
    school: "University of Alabama",
    graduation_year: 2025,
    gpa: 3.1,
    major: "Sports Management",
    summary:
      "Coordinated defensive strategies requiring rapid information processing, pattern recognition, and leadership of 11-person unit in high-stakes competitive environment",
    translated_bullets: [
      "Led defensive unit in tackles (95 in senior season), demonstrating consistent execution and preparation",
      "Diagnosed offensive formations in 2-3 seconds, communicating adjustments to defensive unit pre-snap",
      "Studied 15+ hours of opponent film weekly to anticipate plays and position team for success",
      "Mentored younger players on defensive schemes and professional development",
    ],
    leadership_roles: ["Defensive Captain", "Leadership Council"],
    is_public: true,
  },
  {
    full_name: "Nicole Johnson",
    sport: "Softball",
    position: "Catcher",
    years_played: 4,
    school: "University of Florida",
    graduation_year: 2024,
    gpa: 3.5,
    major: "Business Management",
    summary:
      "Managed game flow and defensive positioning while processing real-time information and maintaining team morale through high-pressure situations",
    translated_bullets: [
      "Called 100+ pitches per game, making split-second strategic decisions based on game situation",
      "Maintained .320 batting average while balancing defensive responsibilities and leadership duties",
      "Coordinated defensive alignment for 9-person unit, communicating adjustments between each pitch",
      "Led team to College World Series appearance, performing under national spotlight",
    ],
    leadership_roles: ["Team Captain", "SEC Leadership Council"],
    is_public: true,
  },
  {
    full_name: "Kevin Liu",
    sport: "Basketball",
    position: "Center",
    years_played: 4,
    school: "University of North Carolina",
    graduation_year: 2025,
    gpa: 3.4,
    major: "Public Policy",
    summary:
      "Anchored team defense through strategic positioning and communication, while contributing offensively in structured system requiring discipline and teamwork",
    translated_bullets: [
      "Averaged 8.2 rebounds and 2.1 blocks per game, providing consistent defensive presence",
      "Set screens and created opportunities for teammates, demonstrating commitment to team success over individual statistics",
      "Studied opponent tendencies to anticipate plays and position team for optimal defensive outcomes",
      "Managed physical demands of 35+ game season while maintaining academic progress in rigorous program",
    ],
    leadership_roles: ["Team Captain"],
    is_public: true,
  },
  {
    full_name: "Olivia Taylor",
    sport: "Soccer",
    position: "Goalkeeper",
    years_played: 4,
    school: "University of Virginia",
    graduation_year: 2024,
    gpa: 3.7,
    major: "Nursing",
    summary:
      "Managed defensive unit through constant communication and strategic positioning, performing under pressure with zero margin for error",
    translated_bullets: [
      "Maintained .82 save percentage over 80+ games, demonstrating consistent performance in high-leverage situations",
      "Directed defensive positioning for 10-person unit, processing information and communicating adjustments in real-time",
      "Balanced intensive Nursing program (3.7 GPA) with 25+ hour weekly athletic commitment",
      "Remained composed through high-pressure penalty kick situations, executing under extreme scrutiny",
    ],
    leadership_roles: ["Team Captain", "Student-Athlete Advisory Board"],
    is_public: true,
  },
  {
    full_name: "Jordan Miller",
    sport: "Track and Field",
    position: "Long Distance",
    years_played: 4,
    school: "University of Oregon",
    graduation_year: 2024,
    gpa: 3.3,
    major: "Environmental Science",
    summary:
      "Achieved elite endurance performance through systematic training approach, demonstrating mental toughness and ability to sustain effort through physical discomfort",
    translated_bullets: [
      "Reduced 10K time from 32:15 to 29:42 through methodical training progression and data analysis",
      "Logged 80+ miles per week while balancing academic coursework and recovery protocols",
      "Competed in NCAA Cross Country Championships, performing at highest national level",
      "Collaborated with sports science team to optimize training load and prevent overtraining",
    ],
    leadership_roles: ["Team Captain"],
    is_public: true,
  },
  {
    full_name: "Alex Rivera",
    sport: "Baseball",
    position: "Shortstop",
    years_played: 4,
    school: "Louisiana State University",
    graduation_year: 2025,
    gpa: 3.6,
    major: "Accounting",
    summary:
      "Coordinated defensive middle infield while contributing offensively, demonstrating versatility and ability to impact game in multiple dimensions",
    translated_bullets: [
      "Maintained .970 fielding percentage over 60+ game season, demonstrating consistency and reliability",
      "Processed rapid-fire ground balls requiring split-second decisions on positioning and throwing mechanics",
      "Batted .310 with 25 stolen bases, contributing value through multiple skill sets",
      "Studied opponent hitting tendencies to optimize defensive positioning and strategic approach",
    ],
    leadership_roles: ["Team Captain", "Academic All-SEC"],
    is_public: true,
  },
  {
    full_name: "Maya Patel",
    sport: "Gymnastics",
    position: "All-Around",
    years_played: 4,
    school: "University of Georgia",
    graduation_year: 2024,
    gpa: 3.9,
    major: "Biomedical Engineering",
    summary:
      "Performed complex skills requiring precision, preparation, and mental focus while managing demanding academic program in competitive STEM field",
    translated_bullets: [
      "Competed in all four events, demonstrating versatility and ability to prepare for multiple performance areas",
      "Scored 9.8+ on vault at NCAA Regionals, executing under pressure with judges and spectators",
      "Balanced 20+ hour weekly training commitment with rigorous Engineering coursework (3.9 GPA)",
      "Overcame injuries through systematic rehabilitation approach and mental resilience",
    ],
    leadership_roles: ["Team Captain", "Academic All-American"],
    is_public: true,
  },
  {
    full_name: "Ryan Cooper",
    sport: "Football",
    position: "Wide Receiver",
    years_played: 4,
    school: "Clemson University",
    graduation_year: 2024,
    gpa: 3.2,
    major: "Sociology",
    summary:
      "Executed precise routes and caught passes in high-pressure situations, requiring focus, preparation, and ability to perform with physical contact",
    translated_bullets: [
      "Caught 62 passes for 890 yards in senior season, demonstrating consistent production in competitive environment",
      "Mastered 50+ route concepts and audibles, adjusting approach based on defensive coverage",
      "Prepared through detailed film study (12+ hours weekly) to identify coverage tendencies",
      "Performed in front of 80,000+ fans, maintaining focus and execution under extreme pressure",
    ],
    leadership_roles: ["Team Leadership Council"],
    is_public: true,
  },
  {
    full_name: "Sophia Adams",
    sport: "Volleyball",
    position: "Setter",
    years_played: 4,
    school: "University of Nebraska",
    graduation_year: 2025,
    gpa: 3.7,
    major: "Business Administration",
    summary:
      "Orchestrated offensive strategy in fast-paced environment, making rapid decisions and distributing responsibilities across team to optimize performance",
    translated_bullets: [
      "Averaged 11.5 assists per set, demonstrating ability to elevate teammates and distribute workload effectively",
      "Processed defensive formations in split-seconds, selecting optimal offensive approach from 6+ options",
      "Led team to Final Four appearance, performing consistently through high-pressure tournament environment",
      "Maintained team chemistry and morale through leadership and positive communication",
    ],
    leadership_roles: ["Team Captain", "Big Ten Distinguished Scholar"],
    is_public: true,
  },
  {
    full_name: "Isaiah Williams",
    sport: "Basketball",
    position: "Shooting Guard",
    years_played: 4,
    school: "University of Kentucky",
    graduation_year: 2024,
    gpa: 3.1,
    major: "Communications",
    summary:
      "Contributed to elite program through consistent shooting and defensive intensity, balancing individual development with team success",
    translated_bullets: [
      "Shot 38% from three-point range over career, providing reliable spacing and offensive threat",
      "Guarded opponent's top perimeter scorer, demonstrating defensive commitment and versatility",
      "Adapted role based on team needs, showing flexibility and commitment to collective goals",
      "Competed against future NBA players nightly, elevating performance level through challenging competition",
    ],
    leadership_roles: ["Team Representative"],
    is_public: true,
  },
]

async function seedAthletes() {
  console.log("Starting to seed athletes...")

  for (const athlete of athletes) {
    try {
      const { data, error } = await supabase
        .from("athletes")
        .insert([athlete])
        .select()

      if (error) {
        console.error(`Error inserting ${athlete.full_name}:`, error)
      } else {
        console.log(`✓ Inserted ${athlete.full_name}`)
      }
    } catch (err) {
      console.error(`Exception inserting ${athlete.full_name}:`, err)
    }
  }

  console.log("\nSeeding complete!")
  console.log(`Total athletes seeded: ${athletes.length}`)
}

seedAthletes()
  .then(() => {
    console.log("\n✓ All athletes have been seeded successfully")
    process.exit(0)
  })
  .catch((error) => {
    console.error("\n✗ Error during seeding:", error)
    process.exit(1)
  })
