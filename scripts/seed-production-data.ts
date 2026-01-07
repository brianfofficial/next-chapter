import { createClient } from "@supabase/supabase-js"
import * as dotenv from "dotenv"

dotenv.config({ path: ".env.local" })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Realistic athlete data
const ATHLETES = [
  // Football
  {
    email: "marcus.johnson@stanford.edu",
    password: "athlete2026",
    sport: "football",
    position: "Quarterback",
    school: "Stanford University",
    graduation_year: 2026,
    gpa: 3.8,
    major: "Business Administration",
    experiences: {
      leadership: ["Team Captain 2024-2026", "Offensive coordinator meetings"],
      achievements: ["All-Pac-12 Honorable Mention", "Led team to bowl game"],
      stats: "65% completion rate, 3,200 yards, 28 TDs"
    },
    translated_summary: "Strategic leader with proven track record of managing complex operations under high-pressure situations. Demonstrated excellence in data analysis, rapid decision-making, and team coordination while maintaining academic rigor.",
    translated_bullets: [
      "Led 85-person organization through high-stakes performance cycles, achieving measurable improvement in team efficiency metrics",
      "Analyzed performance data weekly to iterate on strategic approach, resulting in 28% improvement in key performance indicators",
      "Balanced rigorous 25-hour weekly performance schedule while maintaining 3.8 GPA in Business Administration"
    ]
  },
  {
    email: "david.chen@michigan.edu",
    password: "athlete2026",
    sport: "football",
    position: "Linebacker",
    school: "University of Michigan",
    graduation_year: 2025,
    gpa: 3.4,
    major: "Computer Science",
    experiences: {
      leadership: ["Special teams captain"],
      achievements: ["150 tackles in 2024 season", "Big Ten All-Academic Team"],
      stats: "150 tackles, 8 sacks, 3 forced fumbles"
    },
    translated_summary: "Detail-oriented analyst with exceptional pattern recognition and quick decision-making abilities. Proven capacity to process large volumes of information rapidly while maintaining high performance standards in technical environments.",
    translated_bullets: [
      "Processed and analyzed complex patterns in real-time situations, executing 150+ critical decisions per season with 95% accuracy rate",
      "Collaborated with cross-functional teams to develop and implement defensive strategies, resulting in 25% improvement in performance metrics",
      "Managed intensive 30-hour weekly training regimen while excelling in Computer Science coursework"
    ]
  },
  
  // Basketball
  {
    email: "sarah.williams@duke.edu",
    password: "athlete2026",
    sport: "basketball",
    position: "Point Guard",
    school: "Duke University",
    graduation_year: 2026,
    gpa: 3.9,
    major: "Economics",
    experiences: {
      leadership: ["Team Captain", "Mentor to freshman players"],
      achievements: ["ACC Player of the Week (3x)", "Academic All-American"],
      stats: "15.2 ppg, 8.1 apg, 45% FG"
    },
    translated_summary: "Dynamic decision-maker with exceptional situational awareness and ability to orchestrate team performance under pressure. Demonstrated excellence in rapid problem-solving, communication, and driving measurable results in competitive environments.",
    translated_bullets: [
      "Orchestrated team operations in real-time, managing 85+ decisions per game while maintaining 45% efficiency rate",
      "Developed and mentored 4 junior team members, improving their performance metrics by average of 30%",
      "Achieved Academic All-American status while managing 25-hour weekly performance schedule and Economics degree"
    ]
  },
  {
    email: "james.thompson@ucla.edu",
    password: "athlete2026",
    sport: "basketball",
    position: "Center",
    school: "UCLA",
    graduation_year: 2025,
    gpa: 3.2,
    major: "Psychology",
    experiences: {
      leadership: ["Locker room leader"],
      achievements: ["Pac-12 All-Defensive Team", "10 double-doubles"],
      stats: "12.5 ppg, 9.8 rpg, 2.1 bpg"
    },
    translated_summary: "Strategic team player with proven ability to protect organizational resources and maximize efficiency. Skilled in spatial awareness, resource allocation, and maintaining high performance under physical and mental pressure.",
    translated_bullets: [
      "Protected critical team resources with 98% success rate across 30+ high-stakes engagements",
      "Collaborated with coaching staff to optimize defensive strategies, reducing opponent efficiency by 18%",
      "Balanced rigorous athletic schedule with Psychology studies, maintaining academic standing while traveling 15+ days per month"
    ]
  },
  
  // Soccer
  {
    email: "maria.rodriguez@unc.edu",
    password: "athlete2026",
    sport: "soccer",
    position: "Midfielder",
    school: "University of North Carolina",
    graduation_year: 2026,
    gpa: 3.7,
    major: "International Business",
    experiences: {
      leadership: ["Captain 2025-2026", "Youth camp coordinator"],
      achievements: ["All-ACC First Team", "Hermann Trophy Semifinalist"],
      stats: "12 goals, 15 assists in 2024"
    },
    translated_summary: "Versatile professional with global perspective and exceptional endurance in high-demand environments. Proven ability to seamlessly transition between strategic planning and tactical execution while maintaining peak performance over extended periods.",
    translated_bullets: [
      "Coordinated cross-functional team operations across 90+ minute high-intensity sessions, contributing to 27 successful outcomes",
      "Developed strategic initiatives that improved team efficiency by 35%, recognized as one of top performers in competitive region",
      "Managed international travel and competition schedule across 3 countries while maintaining 3.7 GPA in International Business"
    ]
  },
  {
    email: "alex.kim@stanford.edu",
    password: "athlete2026",
    sport: "soccer",
    position: "Goalkeeper",
    school: "Stanford University",
    graduation_year: 2025,
    gpa: 3.6,
    major: "Mechanical Engineering",
    experiences: {
      leadership: ["Defensive coordinator", "Team representative to athletic board"],
      achievements: ["12 shutouts in 2024", "Pac-12 Goalkeeper of the Year"],
      stats: "0.68 GAA, 85% save percentage"
    },
    translated_summary: "Crisis management specialist with exceptional reflexes and ability to maintain composure under extreme pressure. Demonstrated excellence in risk assessment, rapid response, and protecting organizational outcomes in high-stakes environments.",
    translated_bullets: [
      "Maintained 85% success rate in protecting critical organizational objectives across 20+ high-pressure situations",
      "Analyzed opposition strategies and adapted response protocols in real-time, preventing 12 major adverse outcomes",
      "Balanced demanding Engineering curriculum with 25-hour weekly training schedule and leadership responsibilities"
    ]
  },

  // Track & Field
  {
    email: "jessica.martin@oregon.edu",
    password: "athlete2026",
    sport: "track",
    position: "400m Runner",
    school: "University of Oregon",
    graduation_year: 2026,
    gpa: 3.5,
    major: "Data Science",
    experiences: {
      leadership: ["Event captain for sprints"],
      achievements: ["NCAA Championships qualifier", "School record holder"],
      stats: "Personal best: 52.3 seconds"
    },
    translated_summary: "Results-driven individual with exceptional goal-setting and self-management capabilities. Proven track record of continuous improvement through data analysis, systematic training, and maintaining peak performance under individual accountability.",
    translated_bullets: [
      "Achieved top 2% performance in national competitive landscape through systematic goal-setting and data-driven optimization",
      "Independently managed training program with 98% adherence rate, resulting in 8% performance improvement year-over-year",
      "Applied quantitative analysis skills from Data Science studies to optimize personal performance metrics and recovery protocols"
    ]
  },
  {
    email: "michael.brown@texas.edu",
    password: "athlete2026",
    sport: "track",
    position: "High Jumper",
    school: "University of Texas",
    graduation_year: 2025,
    gpa: 3.3,
    major: "Kinesiology",
    experiences: {
      leadership: ["Field events representative"],
      achievements: ["Big 12 Champion 2024", "Olympic Trials qualifier"],
      stats: "Personal best: 7'2\""
    },
    translated_summary: "High-performer with exceptional technical precision and ability to execute under pressure. Demonstrated expertise in biomechanical optimization, mental preparation, and delivering results when stakes are highest.",
    translated_bullets: [
      "Achieved elite performance level (top 0.1% nationally) through technical mastery and systematic improvement methodology",
      "Qualified for Olympic Trials by optimizing technique through video analysis and biomechanical assessment",
      "Applied Kinesiology expertise to develop injury prevention protocols, maintaining 100% availability during critical competition season"
    ]
  },

  // Swimming
  {
    email: "emma.davis@cal.edu",
    password: "athlete2026",
    sport: "swimming",
    position: "Freestyle/Butterfly",
    school: "UC Berkeley",
    graduation_year: 2026,
    gpa: 3.8,
    major: "Environmental Science",
    experiences: {
      leadership: ["Team captain", "Fundraising committee chair"],
      achievements: ["NCAA All-American (3 events)", "Pac-12 Champion"],
      stats: "100m Free: 52.1s, 200m Fly: 2:01.3"
    },
    translated_summary: "Elite performer with unparalleled discipline and commitment to excellence. Proven ability to maintain focus during early-morning high-intensity work, optimize performance through meticulous preparation, and deliver consistent results across multiple high-stakes scenarios.",
    translated_bullets: [
      "Achieved All-American status through systematic training program requiring 5:30 AM starts 6 days per week for 4 years",
      "Led fundraising initiative that secured $50,000 in sponsorships through stakeholder engagement and presentation skills",
      "Maintained 3.8 GPA in Environmental Science while training 25+ hours weekly and competing in 12+ national-level events annually"
    ]
  },
  {
    email: "ryan.wilson@virginia.edu",
    password: "athlete2026",
    sport: "swimming",
    position: "Distance Freestyle",
    school: "University of Virginia",
    graduation_year: 2025,
    gpa: 3.4,
    major: "Finance",
    experiences: {
      leadership: ["Practice leader for distance group"],
      achievements: ["ACC Champion 1650 Free", "School record holder"],
      stats: "1650 Free: 15:12.4"
    },
    translated_summary: "Endurance specialist with exceptional mental fortitude and ability to maintain performance through extended high-intensity periods. Skilled in pacing strategy, long-term planning, and sustaining focus across marathon-length projects.",
    translated_bullets: [
      "Demonstrated exceptional endurance and strategic pacing by maintaining optimal performance across 16+ minute high-intensity efforts",
      "Led distance training group of 12 athletes, developing collaborative culture that improved group performance metrics by 15%",
      "Applied Finance degree learnings to analyze performance data and optimize training ROI, breaking school record established 8 years prior"
    ]
  },

  // Baseball
  {
    email: "carlos.garcia@vanderbilt.edu",
    password: "athlete2026",
    sport: "baseball",
    position: "Pitcher",
    school: "Vanderbilt University",
    graduation_year: 2026,
    gpa: 3.6,
    major: "Economics",
    experiences: {
      leadership: ["Pitching staff leader"],
      achievements: ["SEC Pitcher of the Week (2x)", "MLB Draft prospect"],
      stats: "2.85 ERA, 110 strikeouts, .215 BAA"
    },
    translated_summary: "Performance specialist with exceptional composure under pressure and proven ability to execute complex strategies in isolated, high-stakes situations. Demonstrated excellence in preparation, situational adaptation, and delivering results when organizational success depends on individual performance.",
    translated_bullets: [
      "Executed 110+ high-pressure decisions with 78% success rate in situations where single mistakes could derail organizational objectives",
      "Prepared for each engagement through detailed competitive analysis and strategic planning, limiting opponent success to 21.5%",
      "Managed individual performance across 15+ critical events per semester while maintaining 3.6 GPA in Economics"
    ]
  },
  {
    email: "brandon.lee@lsu.edu",
    password: "athlete2026",
    sport: "baseball",
    position: "Shortstop",
    school: "Louisiana State University",
    graduation_year: 2025,
    gpa: 3.2,
    major: "Marketing",
    experiences: {
      leadership: ["Infield captain", "Team community service coordinator"],
      achievements: ["All-SEC Second Team", "Gold Glove Award"],
      stats: ".315 BA, 45 RBIs, .975 fielding %"
    },
    translated_summary: "Multi-dimensional professional with exceptional hand-eye coordination and ability to perform at high level across diverse responsibilities. Proven skills in rapid decision-making, spatial awareness, and maintaining consistency across 50+ high-stakes engagements annually.",
    translated_bullets: [
      "Achieved 97.5% accuracy rate in high-pressure situations requiring split-second decisions and precise execution",
      "Coordinated community outreach program engaging 200+ local youth, managing logistics for 12 annual events",
      "Balanced 60+ game schedule with Marketing studies and leadership role, maintaining academic and athletic excellence"
    ]
  },

  // Volleyball
  {
    email: "ashley.johnson@penn-state.edu",
    password: "athlete2026",
    sport: "volleyball",
    position: "Outside Hitter",
    school: "Penn State University",
    graduation_year: 2026,
    gpa: 3.7,
    major: "Communications",
    experiences: {
      leadership: ["Team captain 2025-2026"],
      achievements: ["Big Ten Player of the Week (4x)", "AVCA All-Region"],
      stats: "4.2 kills/set, .285 hitting %"
    },
    translated_summary: "High-impact performer with exceptional timing and ability to deliver results under defensive pressure. Demonstrated expertise in reading situations, making split-second adjustments, and executing when team success depends on individual contribution.",
    translated_bullets: [
      "Delivered critical results in 28% of high-pressure situations, recognized as team's go-to performer when stakes were highest",
      "Led team communication strategy that improved coordination efficiency, resulting in 20% improvement in successful outcomes",
      "Managed Communications degree coursework alongside 25-hour weekly training schedule and 40+ competitive events annually"
    ]
  },
  {
    email: "sophie.anderson@stanford.edu",
    password: "athlete2026",
    sport: "volleyball",
    position: "Setter",
    school: "Stanford University",
    graduation_year: 2025,
    gpa: 3.9,
    major: "Computer Science",
    experiences: {
      leadership: ["Team captain", "Recruiting host coordinator"],
      achievements: ["Pac-12 Setter of the Year", "Academic All-American"],
      stats: "11.5 assists/set, .350 hitting %"
    },
    translated_summary: "Strategic orchestrator with exceptional multitasking abilities and talent for optimizing team performance. Proven skills in rapid assessment, resource allocation, and creating opportunities for teammates to achieve peak performance.",
    translated_bullets: [
      "Coordinated team operations across 100+ high-intensity points per match, optimizing resource allocation for maximum efficiency",
      "Achieved Academic All-American status in Computer Science while managing leadership responsibilities and 25+ hour weekly training schedule",
      "Hosted and coordinated recruiting process for 15+ prospective team members, resulting in top-ranked incoming class"
    ]
  },

  // Lacrosse
  {
    email: "connor.murphy@hopkins.edu",
    password: "athlete2026",
    sport: "lacrosse",
    position: "Attackman",
    school: "Johns Hopkins University",
    graduation_year: 2026,
    gpa: 3.5,
    major: "Biomedical Engineering",
    experiences: {
      leadership: ["Offensive coordinator meetings"],
      achievements: ["Big Ten All-Conference", "60+ goals in 2024"],
      stats: "62 goals, 28 assists"
    },
    translated_summary: "Creative problem-solver with exceptional hand-eye coordination and ability to identify and exploit opportunities in competitive environments. Demonstrated expertise in offensive strategy, rapid decision-making, and performing under defensive pressure.",
    translated_bullets: [
      "Identified and capitalized on 90+ strategic opportunities in competitive landscape, achieving 68% success rate in high-pressure situations",
      "Collaborated with coaching staff to develop offensive strategies that improved team scoring efficiency by 25%",
      "Applied Biomedical Engineering analytical skills to optimize personal performance through biomechanical analysis and data tracking"
    ]
  },
  {
    email: "madison.taylor@northwestern.edu",
    password: "athlete2026",
    sport: "lacrosse",
    position: "Midfielder",
    school: "Northwestern University",
    graduation_year: 2025,
    gpa: 3.6,
    major: "Economics",
    experiences: {
      leadership: ["Team captain", "Big Ten Student-Athlete Council"],
      achievements: ["Big Ten Midfielder of the Year", "Draw control specialist"],
      stats: "45 goals, 35 assists, 180 draw controls"
    },
    translated_summary: "Versatile leader with exceptional endurance and ability to excel in both offensive and defensive roles. Proven skills in transition management, competitive positioning, and maintaining peak performance across extended high-intensity periods.",
    translated_bullets: [
      "Secured competitive advantages in 180+ critical transition moments, directly contributing to team's offensive opportunities",
      "Represented athletic department on Student-Athlete Council, advocating for 500+ student-athletes across 15+ sports",
      "Managed dual responsibilities in offense and defense while maintaining 3.6 GPA in Economics and traveling 20+ days per semester"
    ]
  },

  // Tennis
  {
    email: "olivia.wright@duke.edu",
    password: "athlete2026",
    sport: "tennis",
    position: "Singles/Doubles",
    school: "Duke University",
    graduation_year: 2026,
    gpa: 3.8,
    major: "Public Policy",
    experiences: {
      leadership: ["Team captain", "ACC Student-Athlete Advisory Committee"],
      achievements: ["ACC Singles Champion", "NCAA Round of 16"],
      stats: "32-8 singles record"
    },
    translated_summary: "Independent high-performer with exceptional mental toughness and ability to maintain composure in isolated, pressure-filled situations. Demonstrated expertise in strategic thinking, self-management, and delivering results through individual excellence.",
    translated_bullets: [
      "Achieved 80% success rate in individual competitive situations requiring strategic planning and real-time adaptation",
      "Represented student-athletes on conference-level advisory committee, contributing to policy decisions affecting 5,000+ athletes",
      "Balanced solo travel to 15+ national tournaments with Public Policy studies and team leadership responsibilities"
    ]
  },
  {
    email: "nathan.patel@cal.edu",
    password: "athlete2026",
    sport: "tennis",
    position: "Singles",
    school: "UC Berkeley",
    graduation_year: 2025,
    gpa: 3.4,
    major: "Business Administration",
    experiences: {
      leadership: ["Team representative"],
      achievements: ["ITA All-American", "Pac-12 All-Conference"],
      stats: "28-10 singles record"
    },
    translated_summary: "Strategic competitor with exceptional focus and ability to analyze and adapt to changing competitive landscapes. Proven capacity for independent decision-making, pressure management, and consistent performance across extended campaigns.",
    translated_bullets: [
      "Analyzed opponent strategies and adapted tactical approach in real-time across 38 competitive engagements, achieving 74% success rate",
      "Maintained consistent high performance across 8-month season requiring solo preparation and individual accountability",
      "Applied Business Administration principles to personal brand development and networking, building relationships with 100+ industry professionals"
    ]
  },

  // Wrestling
  {
    email: "tyler.jackson@penn-state.edu",
    password: "athlete2026",
    sport: "wrestling",
    position: "165 lbs",
    school: "Penn State University",
    graduation_year: 2026,
    gpa: 3.3,
    major: "Kinesiology",
    experiences: {
      leadership: ["Practice intensity leader"],
      achievements: ["NCAA All-American", "Big Ten Champion"],
      stats: "38-5 record, 25 pins"
    },
    translated_summary: "Intense competitor with exceptional mental and physical resilience. Demonstrated expertise in one-on-one competitive situations, strategic preparation, and maintaining peak performance through demanding weight management and training protocols.",
    translated_bullets: [
      "Achieved 88% success rate in direct competitive engagements requiring strategic planning, technical mastery, and mental fortitude",
      "Maintained rigorous daily routine requiring 6 AM workouts, precise nutrition protocols, and afternoon technical training for 8 months annually",
      "Applied Kinesiology knowledge to optimize training methodology, reducing injury risk by 40% while improving performance metrics"
    ]
  },

  // Gymnastics
  {
    email: "emily.chen@ucla.edu",
    password: "athlete2026",
    sport: "gymnastics",
    position: "All-Around",
    school: "UCLA",
    graduation_year: 2026,
    gpa: 3.9,
    major: "Applied Mathematics",
    experiences: {
      leadership: ["Team captain", "Mental health advocate"],
      achievements: ["NCAA Champion (bars)", "All-American (4 events)"],
      stats: "9.85+ average on bars"
    },
    translated_summary: "Precision-oriented performer with exceptional attention to detail and ability to execute flawlessly under intense pressure. Demonstrated expertise in technical mastery, mental preparation, and delivering consistent excellence across multiple domains.",
    translated_bullets: [
      "Executed complex technical sequences with 98%+ precision under high-pressure evaluation by expert judges",
      "Led mental health initiative that improved team well-being metrics and created sustainable support systems for 25 team members",
      "Maintained 3.9 GPA in Applied Mathematics while training 25+ hours weekly and competing in 12+ major events annually"
    ]
  },

  // Cross Country
  {
    email: "luke.anderson@colorado.edu",
    password: "athlete2026",
    sport: "cross country",
    position: "Distance Runner",
    school: "University of Colorado",
    graduation_year: 2025,
    gpa: 3.5,
    major: "Environmental Studies",
    experiences: {
      leadership: ["Training group leader"],
      achievements: ["NCAA Championships qualifier", "All-Pac-12"],
      stats: "8K PR: 23:45"
    },
    translated_summary: "Endurance specialist with exceptional self-motivation and ability to maintain peak performance through extended high-intensity efforts. Proven skills in pacing strategy, long-term goal setting, and thriving in both individual and team competitive environments.",
    translated_bullets: [
      "Achieved top 5% national performance through self-directed training program requiring early-morning high-altitude workouts 6 days per week",
      "Led training group of 8 athletes, fostering collaborative culture while maintaining individual performance excellence",
      "Applied Environmental Studies research skills to training data analysis, optimizing performance and recovery protocols"
    ]
  },

  // Softball
  {
    email: "megan.rodriguez@arizona.edu",
    password: "athlete2026",
    sport: "softball",
    position: "Catcher",
    school: "University of Arizona",
    graduation_year: 2026,
    gpa: 3.7,
    major: "Psychology",
    experiences: {
      leadership: ["Team captain", "Defensive coordinator"],
      achievements: ["Pac-12 Defensive Player of the Year", "WCWS appearance"],
      stats: ".295 BA, .995 fielding %, 45% CS rate"
    },
    translated_summary: "Strategic leader with exceptional situational awareness and ability to manage complex operations under pressure. Demonstrated expertise in defensive coordination, rapid decision-making, and maintaining composure during extended high-stakes engagements.",
    translated_bullets: [
      "Coordinated defensive operations for 50+ games, achieving 99.5% success rate in executing strategic game plans",
      "Prevented competitor success in 45% of attempted advances through rapid assessment and decisive action",
      "Applied Psychology degree insights to develop team culture strategies, improving cohesion metrics across 25-person organization"
    ]
  },

  // Field Hockey
  {
    email: "hannah.cooper@unc.edu",
    password: "athlete2026",
    sport: "field hockey",
    position: "Forward",
    school: "University of North Carolina",
    graduation_year: 2025,
    gpa: 3.6,
    major: "Business Administration",
    experiences: {
      leadership: ["Offensive captain"],
      achievements: ["ACC Champion", "All-American"],
      stats: "18 goals, 12 assists"
    },
    translated_summary: "Offensive strategist with exceptional positioning skills and ability to identify and capitalize on competitive opportunities. Proven expertise in collaborative team environments, rapid decision-making, and delivering results in high-pressure situations.",
    translated_bullets: [
      "Identified and executed 30+ strategic opportunities in competitive landscape, achieving 60% success rate in high-leverage situations",
      "Collaborated with 10-person forward line to develop offensive strategies that improved team scoring efficiency by 35%",
      "Balanced 25+ game schedule across 4-month season with Business Administration coursework and offensive leadership duties"
    ]
  },

  // Ice Hockey
  {
    email: "jake.miller@boston-college.edu",
    password: "athlete2026",
    sport: "ice hockey",
    position: "Center",
    school: "Boston College",
    graduation_year: 2026,
    gpa: 3.3,
    major: "Finance",
    experiences: {
      leadership: ["Alternate captain"],
      achievements: ["Hockey East All-Star", "NHL Draft prospect"],
      stats: "22 goals, 35 assists, +18 rating"
    },
    translated_summary: "Fast-paced decision-maker with exceptional situational awareness and ability to perform across multiple responsibilities. Demonstrated skills in offensive creation, defensive accountability, and maintaining composure in physical, high-speed environments.",
    translated_bullets: [
      "Generated 57 positive outcomes through strategic positioning and rapid decision-making in fast-paced competitive environment",
      "Maintained +18 performance rating demonstrating excellence in both offensive contribution and defensive responsibility",
      "Balanced rigorous 40+ game schedule with Finance studies and daily 6 AM practice schedule throughout 5-month season"
    ]
  },

  // Golf
  {
    email: "andrew.green@wake-forest.edu",
    password: "athlete2026",
    sport: "golf",
    position: "Individual Competitor",
    school: "Wake Forest University",
    graduation_year: 2025,
    gpa: 3.8,
    major: "Accounting",
    experiences: {
      leadership: ["Team representative to athletic department"],
      achievements: ["ACC Individual Champion", "Amateur status golfer"],
      stats: "71.2 stroke average"
    },
    translated_summary: "Detail-oriented professional with exceptional focus and ability to maintain consistency across extended high-pressure periods. Proven expertise in individual accountability, strategic planning, and delivering results through meticulous preparation and mental discipline.",
    translated_bullets: [
      "Achieved elite performance level (top 1% nationally) through systematic preparation requiring 25+ hours weekly of individual practice and competition",
      "Maintained 71.2 average performance metric across 40+ competitive rounds under varying environmental conditions",
      "Applied Accounting principles to statistical analysis of performance data, identifying improvement opportunities and optimizing practice allocation"
    ]
  },

  // Rowing
  {
    email: "elizabeth.harris@washington.edu",
    password: "athlete2026",
    sport: "rowing",
    position: "Port (Stroke Seat)",
    school: "University of Washington",
    graduation_year: 2026,
    gpa: 3.7,
    major: "Mechanical Engineering",
    experiences: {
      leadership: ["Boat captain", "Stroke seat"],
      achievements: ["IRA National Championships", "All-Pac-12"],
      stats: "Varsity 8+ boat"
    },
    translated_summary: "Synchronized team player with exceptional discipline and ability to maintain peak performance through extended high-intensity efforts. Demonstrated expertise in setting pace for large teams, maintaining technical precision, and thriving in early-morning high-performance environments.",
    translated_bullets: [
      "Set performance pace for 8-person team across 2,000-meter high-intensity efforts, achieving top-3 national ranking",
      "Maintained technical precision across 5:30 AM practices 6 days per week for 10 months annually, demonstrating exceptional commitment",
      "Applied Mechanical Engineering principles to optimize rowing biomechanics, improving boat efficiency metrics by 4%"
    ]
  },

  // Additional athletes for variety
  {
    email: "jordan.lewis@texas.edu",
    password: "athlete2026",
    sport: "football",
    position: "Wide Receiver",
    school: "University of Texas",
    graduation_year: 2027,
    gpa: 3.4,
    major: "Communications",
    experiences: {
      leadership: ["Receiver room leader"],
      achievements: ["Freshman All-American", "1,000+ receiving yards"],
      stats: "75 catches, 1,150 yards, 12 TDs"
    },
    translated_summary: "Dynamic playmaker with exceptional hand-eye coordination and ability to perform in high-pressure situations. Proven skills in route running, creating separation, and executing precise tasks while managing defensive pressure.",
    translated_bullets: [
      "Executed 75 successful outcomes in high-pressure competitive situations, achieving 1,150+ measurable results",
      "Adapted to complex defensive schemes through film study and strategic preparation, maintaining high success rate against varied opposition",
      "Balanced first-year academic transition with 25-hour weekly training schedule and starting role in major conference competition"
    ]
  },
  {
    email: "rachel.kim@notre-dame.edu",
    password: "athlete2026",
    sport: "basketball",
    position: "Shooting Guard",
    school: "University of Notre Dame",
    graduation_year: 2027,
    gpa: 3.6,
    major: "Pre-Med Biology",
    experiences: {
      leadership: ["Freshman representative"],
      achievements: ["ACC All-Freshman Team", "40% 3PT percentage"],
      stats: "12.8 ppg, 4.2 rpg, 40% 3PT"
    },
    translated_summary: "Precise performer with exceptional focus under pressure and ability to deliver results in clutch situations. Demonstrated skills in preparation, execution, and maintaining composure while balancing rigorous academic requirements.",
    translated_bullets: [
      "Achieved 40% success rate in high-pressure distance-execution scenarios, ranking among team leaders in clutch performance",
      "Balanced demanding Pre-Med Biology curriculum with 25+ hour weekly training schedule and 30+ game season",
      "Earned All-Freshman Team recognition through consistent performance and rapid adaptation to elite competition level"
    ]
  }
]

async function seedAthletes() {
  console.log("🌱 Starting athlete seed process...\n")

  let created = 0
  let skipped = 0
  let failed = 0

  for (const athlete of ATHLETES) {
    try {
      console.log(`Creating: ${athlete.email}...`)

      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: athlete.email,
        password: athlete.password,
        email_confirm: true,
        user_metadata: {
          full_name: athlete.email.split('@')[0].replace('.', ' ').split(' ').map(w => 
            w.charAt(0).toUpperCase() + w.slice(1)
          ).join(' ')
        }
      })

      if (authError) {
        if (authError.message.includes('already exists')) {
          console.log(`  ⏭️  User already exists, skipping...`)
          skipped++
          continue
        }
        throw authError
      }

      // Create athlete profile
      const { error: profileError } = await supabase
        .from('athletes')
        .insert({
          id: authData.user.id,
          email: athlete.email,
          sport: athlete.sport,
          position: athlete.position,
          school: athlete.school,
          graduation_year: athlete.graduation_year,
          gpa: athlete.gpa,
          major: athlete.major,
          experiences: athlete.experiences,
          translated_summary: athlete.translated_summary,
          translated_bullets: athlete.translated_bullets,
          is_public: true
        })

      if (profileError) {
        console.log(`  ❌ Profile creation failed: ${profileError.message}`)
        failed++
        continue
      }

      console.log(`  ✅ Created successfully`)
      created++

    } catch (error: any) {
      console.log(`  ❌ Failed: ${error.message}`)
      failed++
    }
  }

  console.log(`\n📊 Seed Summary:`)
  console.log(`  ✅ Created: ${created}`)
  console.log(`  ⏭️  Skipped: ${skipped}`)
  console.log(`  ❌ Failed: ${failed}`)
  console.log(`  📈 Total: ${ATHLETES.length}`)
}

seedAthletes()
  .then(() => {
    console.log("\n✨ Seed complete!")
    process.exit(0)
  })
  .catch((error) => {
    console.error("\n💥 Seed failed:", error)
    process.exit(1)
  })
