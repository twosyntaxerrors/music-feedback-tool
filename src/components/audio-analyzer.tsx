"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, AudioWaveformIcon as Waveform } from 'lucide-react'
import { motion, AnimatePresence } from "framer-motion"
import { AudioPlayer } from "./audio-player"
import { FeedbackDisplay } from "./feedback-display"

export function AudioAnalyzer() {
  const [file, setFile] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [feedback, setFeedback] = useState<any>(null)
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith("audio/")) {
      setFile(file)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setFile(file)
  }

  const analyzeFeedback = async () => {
    setIsAnalyzing(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setFeedback({
      strengths: ["Rhythmic Foundation", "Use of Filtered Effects"],
      improvements: ["Melodic Development", "Harmonic Complexity"],
      scores: {
        melody: 7,
        harmony: 6,
        rhythm: 8,
        production: 7
      },
      details: "Your track shows promising elements with a solid rhythmic foundation..."
    })
    setIsAnalyzing(false)
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <Card className="bg-slate-900/50 border-slate-800 backdrop-blur">
        <CardContent className="p-6">
          <AnimatePresence mode="wait">
            {!file ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="relative"
              >
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`
                    relative rounded-lg border-2 border-dashed transition-colors duration-200
                    ${dragActive 
                      ? "border-blue-400 bg-blue-400/10" 
                      : "border-slate-700 hover:border-slate-600"
                    }
                  `}
                >
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="p-12 text-center">
                    <Upload className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                    <p className="text-lg text-slate-300 mb-2">
                      Drop your audio file here or click to browse
                    </p>
                    <p className="text-sm text-slate-400">
                      Supports WAV, MP3, and AIFF files
                    </p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <AudioPlayer file={file} />
                
                <Button 
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                  size="lg"
                  onClick={analyzeFeedback}
                  disabled={isAnalyzing}
                >
                  {isAnalyzing ? (
                    <div className="flex items-center gap-2">
                      <Waveform className="animate-pulse" />
                      Analyzing Audio...
                    </div>
                  ) : (
                    "Analyze Track"
                  )}
                </Button>

                {feedback && !isAnalyzing && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <FeedbackDisplay feedback={feedback} />
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  )
}

