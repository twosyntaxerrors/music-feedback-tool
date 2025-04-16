"use client"

import { motion } from "framer-motion"
import { HeroGeometric } from "@/components/ui/shape-landing-hero"
import { AudioUploader } from "./AudioUploader"
import { type Analysis } from "@/types/analysis"

interface HeroSectionProps {
  onUploadComplete: (data: Analysis, file: File, url: string) => void
  onError: (message: string) => void
  onReset?: () => void
  showUploader?: boolean
}

export function HeroSection({ onUploadComplete, onError, onReset, showUploader = true }: HeroSectionProps) {
  return (
    <div id="hero" className="relative min-h-screen flex flex-col items-center justify-center">
      <div className="flex-1 w-full flex items-center">
        <HeroGeometric 
          badge="SoundScope AI"
          title1="Real Feedback."
          title2="No Guesswork."
          description="Instant feedback to fine-tune your sound. Upload your music and get real insight and analysis on what's strong and where to improve."
        />
      </div>
      
      {showUploader && (
        <div className="w-full max-w-2xl px-4 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.5 }}
          >
            <div className="relative backdrop-blur-md bg-black/40 rounded-xl p-6 shadow-[0_0_30px_rgba(0,255,242,0.1)] border border-white/20 hover:border-white/40 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-rose-500/5 rounded-xl"></div>
              <AudioUploader 
                onUploadComplete={onUploadComplete}
                onError={onError}
                onReset={onReset}
              />
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

