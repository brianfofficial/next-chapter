"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, TrendingUp, Users, Target, Search, Shield, Clock } from "lucide-react"
import { useRouter } from "next/navigation"

export default function EmployersPage() {
  const router = useRouter()

  const scrollToHowItWorks = () => {
    document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <a href="/" className="text-2xl font-bold gradient-text">
              Next Chapter
            </a>
            <div className="flex items-center gap-6">
              <a href="#how-it-works" className="text-gray-300 hover:text-employer-blue transition-colors">
                How It Works
              </a>
              <a href="#pricing" className="text-gray-300 hover:text-employer-blue transition-colors">
                Pricing
              </a>
              <a href="/employers/signup">
                <Button className="bg-employer-blue hover:bg-employer-blue-dark">
                  Start Free Trial
                </Button>
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-employer-blue/10 via-transparent to-transparent"></div>
        </div>

        {/* Floating elements */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-employer-blue/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
              Find{" "}
              <span className="gradient-text-employer">Elite Talent</span>
              <br />
              Built for{" "}
              <span className="gradient-text-employer">High Performance</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
              Access 500,000+ NCAA athletes with proven discipline, teamwork, and resilience.
              Their skills are already translated into corporate language you understand.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="text-lg bg-employer-blue hover:bg-employer-blue-dark"
                onClick={() => router.push('/employers/signup')}
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="secondary"
                className="text-lg"
                onClick={scrollToHowItWorks}
              >
                See How It Works
              </Button>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="grid grid-cols-3 gap-8 mt-20 max-w-3xl mx-auto"
          >
            <div>
              <div className="text-4xl font-bold text-employer-blue">500K+</div>
              <div className="text-gray-400 mt-2">Athletes graduate yearly</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-employer-blue">98%</div>
              <div className="text-gray-400 mt-2">Don't go pro - need careers</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-employer-blue">100%</div>
              <div className="text-gray-400 mt-2">Verified NCAA experience</div>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-employer-blue rounded-full flex justify-center">
            <div className="w-1 h-3 bg-employer-blue rounded-full mt-2"></div>
          </div>
        </motion.div>
      </section>

      {/* Value Propositions Section */}
      <section className="py-24 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Why Hire{" "}
              <span className="gradient-text-employer">NCAA Athletes?</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Athletes bring elite soft skills that can't be taught: discipline, teamwork,
              resilience, and the ability to perform under pressure.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Shield className="h-12 w-12" />,
                title: "Pre-Vetted Talent",
                description: "Every athlete has proven dedication through 4+ years of NCAA competition. No guessing about work ethic or commitment.",
              },
              {
                icon: <TrendingUp className="h-12 w-12" />,
                title: "Skills Already Translated",
                description: "We've converted their athletic achievements into corporate language. No more wondering what 'Team Captain' means.",
              },
              {
                icon: <Users className="h-12 w-12" />,
                title: "Untapped Market",
                description: "98% of NCAA athletes need careers after graduation. Most companies overlook this goldmine of talent.",
              },
              {
                icon: <Target className="h-12 w-12" />,
                title: "Filter Precisely",
                description: "Search by sport, school, GPA, graduation year, and more. Find exactly who you need.",
              },
              {
                icon: <Clock className="h-12 w-12" />,
                title: "Save Time",
                description: "Browse pre-translated profiles in minutes. No need to decode athletic resumes yourself.",
              },
              {
                icon: <Search className="h-12 w-12" />,
                title: "Access Before Competitors",
                description: "Most employers don't know how to find these candidates. You'll have first-mover advantage.",
              },
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full border-employer-blue/30 hover:border-employer-blue transition-all">
                  <CardContent className="p-8 text-center">
                    <div className="text-employer-blue mb-4 flex justify-center">{value.icon}</div>
                    <h3 className="text-xl font-bold mb-4">{value.title}</h3>
                    <p className="text-gray-400">{value.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-gray-900">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Three Steps to{" "}
              <span className="gradient-text-employer">Elite Hires</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Sign Up Free",
                description: "Create your employer account with your company email. Start browsing immediately with our free trial.",
              },
              {
                step: "2",
                title: "Browse & Filter",
                description: "Search 500,000+ athlete profiles. Filter by sport, school, GPA, position, and graduation year.",
              },
              {
                step: "3",
                title: "Contact Top Talent",
                description: "Upgrade to access contact info. Reach out directly to candidates who fit your needs.",
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <Card className="h-full">
                  <CardContent className="p-8 text-center">
                    <div className="text-6xl font-bold text-employer-blue/20 mb-4">{step.step}</div>
                    <h3 className="text-xl font-bold mb-4">{step.title}</h3>
                    <p className="text-gray-400">{step.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section id="pricing" className="py-24 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Simple,{" "}
              <span className="gradient-text-employer">Transparent Pricing</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Start free, upgrade when you're ready to hire.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "Free Trial",
                price: "$0",
                period: "forever",
                features: [
                  "Browse all athlete profiles",
                  "Search & filter unlimited",
                  "Save favorites",
                  "Contact info hidden",
                ],
                cta: "Start Free Trial",
                highlight: false,
              },
              {
                name: "Pro",
                price: "$299",
                period: "per month",
                features: [
                  "Everything in Free",
                  "Unlimited contact info access",
                  "Direct athlete messaging",
                  "Advanced analytics",
                  "Priority support",
                ],
                cta: "Start Free Trial",
                highlight: true,
              },
              {
                name: "Enterprise",
                price: "Custom",
                period: "pricing",
                features: [
                  "Everything in Pro",
                  "White-label customization",
                  "Dedicated account manager",
                  "API access",
                  "Custom integrations",
                ],
                cta: "Contact Sales",
                highlight: false,
              },
            ].map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className={`h-full ${plan.highlight ? 'border-employer-blue ring-2 ring-employer-blue/50' : ''}`}>
                  <CardContent className="p-8">
                    {plan.highlight && (
                      <div className="text-employer-blue text-sm font-semibold mb-4 text-center">
                        MOST POPULAR
                      </div>
                    )}
                    <h3 className="text-2xl font-bold mb-2 text-center">{plan.name}</h3>
                    <div className="text-center mb-6">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      <span className="text-gray-400">/{plan.period}</span>
                    </div>
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2 text-gray-300">
                          <span className="text-employer-blue mt-1">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button
                      className={`w-full ${plan.highlight ? 'bg-employer-blue hover:bg-employer-blue-dark' : ''}`}
                      variant={plan.highlight ? "default" : "secondary"}
                      onClick={() => router.push('/employers/signup')}
                    >
                      {plan.cta}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-24 bg-black">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Join Companies{" "}
              <span className="gradient-text-employer">Hiring Smarter</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center opacity-50">
            {["Enterprise", "Oracle", "Salesforce", "Goldman Sachs", "Deloitte", "McKinsey", "Google", "Meta"].map(
              (company) => (
                <div key={company} className="text-2xl font-bold text-gray-500">
                  {company}
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              Ready to hire{" "}
              <span className="gradient-text-employer">elite talent?</span>
            </h2>
            <p className="text-xl text-gray-400 mb-12">
              Start your free trial today. No credit card required.
              Browse unlimited profiles and upgrade when you're ready to hire.
            </p>
            <Button
              size="lg"
              className="text-lg bg-employer-blue hover:bg-employer-blue-dark"
              onClick={() => router.push('/employers/signup')}
            >
              Start Free Trial - Takes 60 Seconds
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-12 bg-black">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="text-2xl font-bold gradient-text mb-4">Next Chapter</div>
              <p className="text-gray-500 text-sm">
                Connecting elite NCAA athletes with companies that value performance.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-employer-blue">For Employers</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="/employers/signup" className="hover:text-employer-blue transition-colors">Sign Up</a></li>
                <li><a href="#pricing" className="hover:text-employer-blue transition-colors">Pricing</a></li>
                <li><a href="#how-it-works" className="hover:text-employer-blue transition-colors">How It Works</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-gold">For Athletes</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="/" className="hover:text-gold transition-colors">Translate Skills</a></li>
                <li><a href="/login" className="hover:text-gold transition-colors">Sign In</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-gray-400">Legal</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-gray-300 transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-gray-300 transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
            © 2026 Next Chapter. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
