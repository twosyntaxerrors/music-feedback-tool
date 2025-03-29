"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { AudioUploader } from "@/components/AudioUploader"
import { type Analysis } from "@/types/analysis"

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
      <div className="absolute -top-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-[80px] opacity-20 animate-blob"></div>
      <div className="absolute -bottom-40 left-20 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-[80px] opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute top-20 -right-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-[80px] opacity-20 animate-blob animation-delay-4000"></div>
      
      {/* Content */}
      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          <h1 className={`${showUploader ? 'text-4xl md:text-6xl' : 'text-2xl md:text-4xl'} font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600`}>
            Unlock Your Music's Potential with AI
          </h1>
          {showUploader && (
            <p className="text-lg md:text-xl text-gray-200 mb-8 md:mb-10 max-w-2xl mx-auto">
              Upload your track and get instant, AI-powered insights to elevate your music production.
              Our sophisticated algorithms analyze your music to provide detailed feedback.
            </p>
          )}
          
          {showUploader && (
            <div className="relative backdrop-blur-md bg-gray-900/50 rounded-xl p-6 shadow-xl border border-gray-800 hover:border-gray-700 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl"></div>
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

