"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

const plans = [
  {
    name: "Basic",
    price: "$9",
    description: "Perfect for new musicians just getting started",
    features: [
      "10 track analyses per month",
      "Basic genre recognition",
      "Core performance metrics",
      "Email support",
    ],
    cta: "Start Free Trial",
    popular: false,
  },
  {
    name: "Pro",
    price: "$29",
    description: "For serious musicians and producers",
    features: [
      "50 track analyses per month",
      "Advanced genre & influence detection",
      "Detailed performance metrics",
      "Personalized improvement suggestions",
      "Priority email support",
      "API access",
    ],
    cta: "Get Started",
    popular: true,
  },
  {
    name: "Studio",
    price: "$99",
    description: "For professional studios and production teams",
    features: [
      "Unlimited track analyses",
      "Complete genre & subgenre analysis",
      "Advanced metrics with historical data",
      "In-depth professional recommendations",
      "Priority 24/7 support",
      "Team collaboration tools",
      "Custom branding options",
    ],
    cta: "Contact Sales",
    popular: false,
  },
]

export function Pricing() {
  return (
    <section className="py-24 bg-gray-900/50 relative overflow-hidden" id="pricing">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/0 via-[#00fff2]/5 to-gray-900/0 pointer-events-none" />
      
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-righteous mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#00fff2] to-[#00c8ff] drop-shadow-[0_0_10px_rgba(0,255,242,0.3)]"
          >
            Pricing Plans
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-xl text-gray-300 max-w-2xl mx-auto"
          >
            Choose the perfect plan for your music production needs
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`relative p-6 rounded-xl backdrop-blur-sm bg-gray-800/30 border ${
                plan.popular 
                  ? "border-[#00fff2] shadow-lg shadow-[#00fff2]/10" 
                  : "border-gray-700 hover:border-[#00fff2]/40"
              } transition-all duration-300 group`}
            >
              {plan.popular && (
                <div className="absolute -top-4 inset-x-0 mx-auto w-fit px-3 py-1 bg-[#00fff2] text-black rounded-full text-xs font-bold">
                  MOST POPULAR
                </div>
              )}
              
              <div className="relative z-10">
                <h3 className="text-2xl font-righteous text-[#00fff2] mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-righteous text-white">{plan.price}</span>
                  <span className="text-gray-400">/month</span>
                </div>
                <p className="text-gray-300 mb-6">{plan.description}</p>
                
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="h-5 w-5 text-[#00fff2] shrink-0 mr-2" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className={`w-full ${
                    plan.popular 
                      ? "bg-[#00fff2] hover:bg-[#00c8ff] text-black font-semibold" 
                      : "bg-gray-800 hover:bg-gray-700 text-gray-100 border border-[#00fff2]/20 hover:border-[#00fff2]/40"
                  }`}
                >
                  {plan.cta}
                </Button>
              </div>
              
              {plan.popular && (
                <div className="absolute inset-0 bg-gradient-to-br from-[#00fff2]/10 to-[#00c8ff]/10 rounded-xl z-0" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

