export interface Sport {
  id: string
  name: string
  icon: string
  positions?: string[]
}

export interface TranslationTemplate {
  pattern: string
  translation: string
  category: "leadership" | "performance" | "teamwork" | "discipline" | "analytics"
}

export const SPORTS: Sport[] = [
  {
    id: "football",
    name: "Football",
    icon: "🏈",
    positions: ["QB", "RB", "WR", "TE", "OL", "DL", "LB", "DB", "K/P"]
  },
  {
    id: "basketball",
    name: "Basketball",
    icon: "🏀",
    positions: ["PG", "SG", "SF", "PF", "C"]
  },
  {
    id: "soccer",
    name: "Soccer",
    icon: "⚽",
    positions: ["GK", "Defender", "Midfielder", "Forward"]
  },
  {
    id: "baseball",
    name: "Baseball",
    icon: "⚾",
    positions: ["Pitcher", "Catcher", "Infield", "Outfield"]
  },
  {
    id: "track",
    name: "Track & Field",
    icon: "🏃",
    positions: ["Sprints", "Distance", "Hurdles", "Jumps", "Throws"]
  },
  {
    id: "swimming",
    name: "Swimming",
    icon: "🏊"
  },
  {
    id: "volleyball",
    name: "Volleyball",
    icon: "🏐",
    positions: ["Setter", "Outside Hitter", "Middle Blocker", "Libero"]
  },
  {
    id: "tennis",
    name: "Tennis",
    icon: "🎾"
  },
]

export const TRANSLATION_TEMPLATES: Record<string, TranslationTemplate[]> = {
  leadership: [
    {
      pattern: "captain",
      translation: "Led {size}-person organization through high-stakes performance cycles, coordinating strategy across multiple stakeholder groups",
      category: "leadership"
    },
    {
      pattern: "team leader",
      translation: "Managed team dynamics and performance outcomes for {size} individuals in competitive environment",
      category: "leadership"
    },
    {
      pattern: "leadership role",
      translation: "Demonstrated leadership capabilities while driving organizational goals and maintaining team cohesion under pressure",
      category: "leadership"
    },
  ],
  performance: [
    {
      pattern: "practice",
      translation: "Managed rigorous {hours}hr/week performance schedule while maintaining {gpa} GPA, demonstrating exceptional time management and prioritization",
      category: "discipline"
    },
    {
      pattern: "film review",
      translation: "Analyzed performance data and video metrics to identify improvement opportunities and iterate on strategic approach",
      category: "analytics"
    },
    {
      pattern: "training",
      translation: "Executed structured development program requiring consistent performance optimization and continuous skill refinement",
      category: "discipline"
    },
  ],
  teamwork: [
    {
      pattern: "team player",
      translation: "Collaborated with {size} team members to achieve shared objectives in fast-paced, competitive environment",
      category: "teamwork"
    },
    {
      pattern: "collaboration",
      translation: "Coordinated with coaching staff and teammates to execute complex strategic plans under time pressure",
      category: "teamwork"
    },
  ],
  competition: [
    {
      pattern: "competed",
      translation: "Performed under pressure in high-stakes competitive scenarios, maintaining composure and execution quality",
      category: "performance"
    },
    {
      pattern: "championship",
      translation: "Contributed to championship-level performance through consistent execution and strategic adaptation",
      category: "performance"
    },
  ],
}

export const SPORT_SPECIFIC_SKILLS: Record<string, string[]> = {
  football: [
    "Strategic planning and play execution under pressure",
    "Rapid decision-making in dynamic, high-stakes environments",
    "Physical resilience and performance optimization",
    "Team coordination across specialized functional units",
    "Adaptability to changing competitive landscapes"
  ],
  basketball: [
    "Quick decision-making in fast-paced environments",
    "Spatial awareness and strategic positioning",
    "Team chemistry and on-court communication",
    "Performance under time constraints",
    "Agility in adapting to opponent strategies"
  ],
  soccer: [
    "Global perspective and cross-cultural collaboration",
    "Endurance and sustained performance over extended periods",
    "Strategic positioning and field awareness",
    "Seamless teamwork with minimal verbal communication",
    "Adaptability to various role requirements"
  ],
  baseball: [
    "Mental resilience through high-pressure situations",
    "Statistical analysis and data-driven performance optimization",
    "Individual accountability within team framework",
    "Precision and attention to detail",
    "Patience and strategic timing"
  ],
  track: [
    "Goal-setting and incremental performance improvement",
    "Individual accountability and self-motivation",
    "Data-driven training optimization",
    "Mental fortitude and focus under pressure",
    "Time management and disciplined preparation"
  ],
  swimming: [
    "Individual accountability paired with team support",
    "Consistency and performance reliability",
    "Technical precision and stroke optimization",
    "Mental toughness through solitary training",
    "Recovery management and sustainable performance"
  ],
  volleyball: [
    "Real-time communication and coordination",
    "Anticipation and reactive decision-making",
    "Momentum management in dynamic situations",
    "Role flexibility and positional versatility",
    "Team synchronization and trust-building"
  ],
  tennis: [
    "Mental resilience in one-on-one competitive scenarios",
    "Strategic adaptation to opponent strengths/weaknesses",
    "Individual accountability for outcomes",
    "Composure under pressure",
    "Continuous performance self-analysis"
  ],
}

export interface AthleteInput {
  sport: string
  position?: string
  yearsPlayed: number
  leadership: string[]
  achievements: string[]
  stats?: string
  gpa?: string
  major?: string
  school?: string
  graduation_year?: number
}

export function translateExperience(input: AthleteInput): {
  summary: string
  bulletPoints: string[]
} {
  const sportSkills = SPORT_SPECIFIC_SKILLS[input.sport] || []
  const teamSize = input.sport === "football" ? "85" :
                   input.sport === "basketball" ? "15" :
                   input.sport === "soccer" ? "30" : "40"

  // Generate summary
  const summary = `${input.yearsPlayed}-year ${input.sport} ${input.position || "athlete"} with proven track record in high-performance environments. Demonstrated expertise in strategic execution, team leadership, and performance under pressure. Brings athletic discipline, coachability, and competitive drive to corporate environments. ${input.major ? `Academic background in ${input.major}` : ""} with ${input.gpa || "strong"} GPA while managing 20+ hour weekly athletic commitment.`

  // Generate bullet points
  const bulletPoints: string[] = []

  // Leadership bullets
  if (input.leadership.length > 0) {
    input.leadership.forEach(role => {
      const lower = role.toLowerCase()
      if (lower.includes("captain")) {
        bulletPoints.push(`Led ${teamSize}-person organization through high-stakes performance cycles, coordinating strategy across coaching staff, athletic department, and team members`)
      } else if (lower.includes("leader")) {
        bulletPoints.push(`Managed team dynamics and performance outcomes in competitive Division I environment with $${Math.floor(Math.random() * 50 + 50)}M+ annual athletic department budget`)
      } else {
        bulletPoints.push(`Demonstrated leadership capabilities while driving organizational goals and maintaining team cohesion under pressure`)
      }
    })
  }

  // Performance & Analytics bullets
  bulletPoints.push(`Analyzed performance video and statistical data to identify improvement opportunities, resulting in measurable skill development and strategic optimization`)

  bulletPoints.push(`Managed rigorous 20+ hour/week performance schedule while maintaining ${input.gpa || "3.2+"} GPA, demonstrating exceptional time management and prioritization under competing demands`)

  // Add sport-specific skills
  const selectedSkills = sportSkills.slice(0, 3)
  selectedSkills.forEach(skill => {
    bulletPoints.push(skill)
  })

  // Achievement-based bullet
  if (input.achievements.length > 0) {
    const achievement = input.achievements[0]
    bulletPoints.push(`${achievement}, demonstrating consistent execution quality and competitive resilience in high-stakes scenarios`)
  }

  return {
    summary,
    bulletPoints: bulletPoints.slice(0, 7) // Limit to 7 bullets
  }
}
