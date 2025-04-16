"use client"

import { motion } from "framer-motion"
import { Check } from "lucide-react"

export function Pricing() {
  const scrollToHero = () => {
    const heroSection = document.getElementById("hero");
    if (heroSection) {
      heroSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="py-24 bg-black/50 relative overflow-hidden" id="pricing">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-white/[0.02] to-black/0 pointer-events-none" />
      
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-4 text-white"
          >
            Pricing Plans
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-xl text-gray-400 max-w-2xl mx-auto"
          >
            Choose the perfect plan for your music production needs
          </motion.p>
        </div>

        <div className="max-w-lg mx-auto">
          {/* Single Free Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="relative p-8 rounded-lg bg-white/[0.03] border border-white/20 hover:border-white/30 transition-all duration-300 group backdrop-blur-sm"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Most Popular Badge */}
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <div className="inline-block px-4 py-1 rounded-full bg-gradient-to-r from-white/20 to-white/10 text-white text-sm font-medium border border-white/10">
                MOST POPULAR
              </div>
            </div>

            <div className="relative z-10">
              <h3 className="text-xl font-medium text-white/90 mb-2">Pro</h3>
              <div className="mb-4">
                <span className="text-5xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">FREE</span>
              </div>
              <p className="text-lg text-gray-400 mb-6">For serious musicians and producers</p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center text-gray-300">
                  <Check className="w-5 h-5 text-white/70 mr-3" />
                  <span>Advanced genre & influence detection</span>
                </li>
                <li className="flex items-center text-gray-300">
                  <Check className="w-5 h-5 text-white/70 mr-3" />
                  <span>Detailed performance metrics</span>
                </li>
                <li className="flex items-center text-gray-300">
                  <Check className="w-5 h-5 text-white/70 mr-3" />
                  <span>Personalized improvement suggestions</span>
                </li>
              </ul>
              <button
                onClick={scrollToHero}
                className="relative inline-flex h-12 overflow-hidden rounded-md p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 w-full justify-center"
              >
                <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#FFFFFF_0%,#000000_50%,#FFFFFF_100%)]" />
                <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-md bg-black px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
                  Get Started
                </span>
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

