"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { AudioUploader } from "@/components/AudioUploader"
import { type Analysis } from "@/types/analysis"
import HeroBadge from "@/app/components/ui/hero-badge"
import { Flame } from "lucide-react"

interface HeroSectionProps {
  onUploadComplete: (data: Analysis, file: File, url: string) => void
  onError: (message: string) => void
  onReset?: () => void
  showUploader?: boolean
}

export function HeroSection({ onUploadComplete, onError, onReset, showUploader = true }: HeroSectionProps) {
  return (
    <section className={`relative ${showUploader ? 'min-h-[calc(100vh-4rem)]' : 'min-h-fit py-16'} flex flex-col items-center justify-center overflow-hidden`} id="hero">
      {/* Gradient Orbs */}
      <div className="absolute -top-40 -left-40 w-80 h-80 bg-[#00fff2] rounded-full mix-blend-screen filter blur-[100px] opacity-10 animate-blob"></div>
      <div className="absolute -bottom-40 left-20 w-80 h-80 bg-[#00c8ff] rounded-full mix-blend-screen filter blur-[100px] opacity-10 animate-blob animation-delay-2000"></div>
      <div className="absolute top-20 -right-40 w-80 h-80 bg-[#00fff2] rounded-full mix-blend-screen filter blur-[100px] opacity-10 animate-blob animation-delay-4000"></div>
      
      {/* Content */}
      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          <div className="mb-6">
            <HeroBadge
              href="https://www.ervnoel.com"
              text="Instant Access to 300+ Fire Beats! Click Here"
              variant="outline"
              className="bg-black/40 border-[#00fff2]/40 hover:border-[#00fff2] text-[#00fff2] hover:bg-black/60"
              icon={<Flame className="w-4 h-4 text-orange-500 fill-orange-500" />}
              target="_blank"
            />
          </div>
          <h1 className={`font-righteous ${showUploader ? 'text-4xl md:text-6xl' : 'text-2xl md:text-4xl'} mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#00fff2] via-[#00c8ff] to-[#00fff2] drop-shadow-[0_0_10px_rgba(0,255,242,0.3)]`}>
          Real Feedback. No Guesswork.
          </h1>
          {showUploader && (
            <p className="text-lg md:text-xl text-gray-300 mb-8 md:mb-10 max-w-2xl mx-auto">
              Instant feedback to fine-tune your sound. Upload your music and get real insight and analysis on what&apos;s strong and where to improve.
            </p>
          )}
          
          {showUploader && (
            <div className="relative backdrop-blur-md bg-black/40 rounded-xl p-6 shadow-[0_0_30px_rgba(0,255,242,0.1)] border border-[#00fff2]/20 hover:border-[#00fff2]/40 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-r from-[#00fff2]/5 to-[#00c8ff]/5 rounded-xl"></div>
              <AudioUploader 
                onUploadComplete={onUploadComplete}
                onError={onError}
                onReset={onReset}
              />
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}

