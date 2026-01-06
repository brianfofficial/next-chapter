"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { SkillTranslator } from "@/components/skill-translator"
import { ArrowRight, TrendingUp, Users, Target, Zap } from "lucide-react"

export default function Home() {
  const scrollToTranslator = () => {
    document.getElementById("translator")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="text-2xl font-bold gradient-text">Next Chapter</div>
            <div className="flex items-center gap-6">
              <a href="#how-it-works" className="text-gray-300 hover:text-gold transition-colors">
                How It Works
              </a>
              <a href="#translator" className="text-gray-300 hover:text-gold transition-colors">
                Try It Free
              </a>
              <a href="/login">
                <Button size="sm">Sign In</Button>
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gold/10 via-transparent to-transparent"></div>
        </div>

        {/* Floating elements */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-gold/20 rounded-full"
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
              You spent 4 years
              <br />
              <span className="gradient-text">becoming elite.</span>
              <br />
              Now become{" "}
              <span className="gradient-text">undeniable.</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
              98% of NCAA athletes don't go pro. Your athletic experience built elite skills,
              but your resume can't prove it. Until now.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={scrollToTranslator} className="text-lg">
                Translate Your Experience
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="secondary" className="text-lg">
                Watch Demo
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
              <div className="text-4xl font-bold text-gold">500K</div>
              <div className="text-gray-400 mt-2">Athletes graduate yearly</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-gold">&lt;2%</div>
              <div className="text-gray-400 mt-2">Go pro</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-gold">98%</div>
              <div className="text-gray-400 mt-2">Need this tool</div>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-gold rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gold rounded-full mt-2"></div>
          </div>
        </motion.div>
      </section>

      {/* Problem/Solution Section */}
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
              Your Resume Doesn't Speak{" "}
              <span className="gradient-text">Corporate</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Recruiters don't know that "team captain" means you led 85 people through
              high-stakes performance cycles. Let's fix that.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="h-full border-red-500/50">
                <CardContent className="p-8">
                  <div className="text-red-500 text-4xl mb-4">❌</div>
                  <h3 className="text-2xl font-bold mb-4 text-red-400">Before</h3>
                  <ul className="space-y-3 text-gray-400">
                    <li>• Team Captain - Football</li>
                    <li>• Practiced 20 hours/week</li>
                    <li>• Reviewed film daily</li>
                    <li>• Maintained 3.2 GPA</li>
                  </ul>
                  <p className="mt-6 text-sm text-gray-500 italic">
                    Recruiters scroll past this in 6 seconds
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="h-full border-gold/50">
                <CardContent className="p-8">
                  <div className="text-gold text-4xl mb-4">✓</div>
                  <h3 className="text-2xl font-bold mb-4 text-gold">After</h3>
                  <ul className="space-y-3 text-gray-300">
                    <li>• Led 85-person organization through high-stakes performance cycles</li>
                    <li>• Managed rigorous 20hr/week schedule while maintaining 3.2 GPA</li>
                    <li>• Analyzed performance data to iterate on strategic approach</li>
                  </ul>
                  <p className="mt-6 text-sm text-gold italic">
                    This gets you the interview
                  </p>
                </CardContent>
              </Card>
            </motion.div>
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
              <span className="gradient-text">Undeniable</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Target className="h-12 w-12" />,
                title: "Pick Your Sport",
                description: "Select your sport and position. We'll tailor everything to your specific experience.",
              },
              {
                icon: <Zap className="h-12 w-12" />,
                title: "Enter Your Experience",
                description: "Add your leadership roles, achievements, and stats. Takes 60 seconds.",
              },
              {
                icon: <TrendingUp className="h-12 w-12" />,
                title: "Watch It Transform",
                description: "Get LinkedIn-ready summaries and resume bullets that prove your value.",
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
                    <div className="text-gold mb-4 flex justify-center">{step.icon}</div>
                    <div className="text-6xl font-bold text-gold/20 mb-4">{index + 1}</div>
                    <h3 className="text-xl font-bold mb-4">{step.title}</h3>
                    <p className="text-gray-400">{step.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Translator Section */}
      <section id="translator" className="py-24 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto">
          <SkillTranslator />
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
              Join Athletes Landing at{" "}
              <span className="gradient-text">Top Companies</span>
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
              Ready to start your{" "}
              <span className="gradient-text">next chapter?</span>
            </h2>
            <p className="text-xl text-gray-400 mb-12">
              Join thousands of athletes who've translated their experience into career success.
              It's free to start.
            </p>
            <Button size="lg" onClick={scrollToTranslator} className="text-lg">
              Try It Free - Takes 60 Seconds
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
                Helping NCAA athletes translate their experience into corporate careers.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-gold">Product</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-gold transition-colors">For Athletes</a></li>
                <li><a href="#" className="hover:text-gold transition-colors">For Employers</a></li>
                <li><a href="#" className="hover:text-gold transition-colors">For Schools</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-gold">Company</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-gold transition-colors">About</a></li>
                <li><a href="#" className="hover:text-gold transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-gold transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-gold">Legal</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-gold transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-gold transition-colors">Terms</a></li>
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
