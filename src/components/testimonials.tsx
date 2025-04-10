"use client"

import { motion } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Wheezy",
    role: "Platinum Producer for Young Thug, Future, and more",
    content: "Wild how accurate this is when it's breaking my beats down. This is HEAT for improving your sound.",
    avatar: "/avatars/WheezyBeats.jpeg",
    rating: 5,
  },
  {
    name: "Wondagurl",
    role: "Multi-Platinum Producer for Travis Scott, Drake, and Rihanna",
    content: "The first app I've found that's able to listen to my music and is actually helpful for making my drums bouncier. Don't sleep on this.",
    avatar: "/avatars/WondagurlBeats.jpg",
    rating: 5,
  },
  {
    name: "Nick Mira",
    role: "Producer of Juice WRLD's Lucid Dreams",
    content: "We live in the wildest times. This is such a useful tool for beginners to quickly get feedback on their music",
    avatar: "/avatars/NickMiraBeats.jpg",
    rating: 4,
  },
  {
    name: "Cardo",
    role: "Diamond Producer for Kendrick Lamar, Travis Scott, and more",
    content: "It's like having Dr. Dre giving his opinion while I'm cooking up. Super dope.",
    avatar: "/avatars/CardoGotWings.jpg",
    rating: 5,
  },
]

export function Testimonials() {
  return (
    <section className="py-24 bg-gray-900/50 relative overflow-hidden" id="testimonials">
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
            What Our Users Say
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-xl text-gray-300 max-w-2xl mx-auto"
          >
            Join thousands of musicians who have improved their craft with our AI analysis
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
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
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={16} 
                      className={i < testimonial.rating ? "fill-[#00fff2] text-[#00fff2]" : "text-gray-500"} 
                    />
                  ))}
                </div>
                <p className="text-gray-300 mb-6 italic">&ldquo;{testimonial.content}&rdquo;</p>
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-3 border-2 border-[#00fff2]/20">
                    <AvatarFallback className="bg-gray-900/50">{testimonial.name.charAt(0)}</AvatarFallback>
                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                  </Avatar>
                  <div>
                    <div className="font-righteous text-[#00fff2]">{testimonial.name}</div>
                    <div className="text-sm text-gray-400">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

