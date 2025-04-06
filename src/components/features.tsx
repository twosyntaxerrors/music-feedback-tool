"use client"

import { motion } from "framer-motion"
import { Bot, BarChart3, Wand2, Ear, Music, Zap } from "lucide-react"

export function Features() {
  const features = [
    {
      title: "Smart Analytics",
      description: "Our advanced algorithm breaks down your track to identify strengths and areas for improvement.",
      icon: <Bot className="w-10 h-10 text-[#00fff2]" />,
    },
    {
      title: "Genre Recognition",
      description: "Automatically identify your track's primary genre and musical influences.",
      icon: <Music className="w-10 h-10 text-[#00fff2]" />,
    },
    {
      title: "Performance Metrics",
      description: "Get quantitative scores for melody, harmony, rhythm, and production quality.",
      icon: <BarChart3 className="w-10 h-10 text-[#00fff2]" />,
    },
    {
      title: "Detailed Feedback",
      description: "Receive specific, actionable insights on composition, arrangement, and production techniques.",
      icon: <Ear className="w-10 h-10 text-[#00fff2]" />,
    },
    {
      title: "Instant Results",
      description: "No waiting. Get comprehensive analysis in seconds, not hours or days.",
      icon: <Zap className="w-10 h-10 text-[#00fff2]" />,
    },
    {
      title: "Music Enhancement",
      description: "Get personalized suggestions to take your music to the next level.",
      icon: <Wand2 className="w-10 h-10 text-[#00fff2]" />,
    },
  ]

  return (
    <section className="py-24 bg-gray-900/50 relative overflow-hidden" id="features">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/0 via-blue-950/10 to-gray-900/0 pointer-events-none" />
      
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-righteous mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#00fff2] to-[#00c8ff] drop-shadow-[0_0_10px_rgba(0,255,242,0.3)]"
          >
            Powerful Features
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-xl text-gray-300 max-w-2xl mx-auto"
          >
            Discover how our audio analysis tools help you create better music
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative p-6 rounded-xl backdrop-blur-sm bg-gray-800/30 border border-gray-700 hover:border-[#00fff2]/40 transition-all duration-300 group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#00fff2]/5 to-[#00c8ff]/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gray-800 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-righteous mb-2 text-[#00fff2]">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

