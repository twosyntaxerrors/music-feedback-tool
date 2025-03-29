"use client"

import { motion } from "framer-motion"
import { Upload, Cpu, FileAudio, CheckCircle } from 'lucide-react'

const steps = [
  {
    icon: Upload,
    title: "Upload Your Track",
    description: "Simply drag and drop your audio file or click to browse"
  },
  {
    icon: Cpu,
    title: "AI Analysis",
    description: "Our AI processes your track and analyzes every aspect"
  },
  {
    icon: FileAudio,
    title: "Get Detailed Feedback",
    description: "Receive comprehensive analysis and actionable insights"
  },
  {
    icon: CheckCircle,
    title: "Improve Your Music",
    description: "Apply the feedback to enhance your production"
  }
]

export function HowItWorks() {
  return (
    <section className="py-24 bg-slate-900/90">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            How It Works
          </h2>
          <p className="text-xl text-slate-200 max-w-2xl mx-auto">
            Get started in minutes with our simple four-step process
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="relative"
            >
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 right-0 w-full h-0.5 bg-gradient-to-r from-blue-400/20 to-purple-400/20 transform translate-x-1/2" />
              )}
              
              <div className="relative z-10 text-center px-6">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-500/20 border-2 border-blue-400 mb-6">
                  <step.icon className="h-10 w-10 text-blue-400" />
                </div>
                <h3 className="text-2xl font-semibold mb-3 text-white">{step.title}</h3>
                <p className="text-lg text-slate-200">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

