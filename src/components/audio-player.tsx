"use client"

import { useState, useRef, useEffect } from "react"
import { Play, Pause, Volume2, VolumeX } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { motion, AnimatePresence } from "framer-motion"

export function AudioPlayer({ file }: { file: File }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    if (audioRef.current) {
      const audio = audioRef.current
      audio.src = URL.createObjectURL(file)
      audio.onloadedmetadata = () => setDuration(audio.duration)
      audio.ontimeupdate = () => setCurrentTime(audio.currentTime)
    }
  }, [file])

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleVolumeChange = (newVolume: number[]) => {
    const volumeValue = newVolume[0]
    setVolume(volumeValue)
    if (audioRef.current) {
      audioRef.current.volume = volumeValue
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  return (
    <div className="bg-gray-800 bg-opacity-50 p-6 rounded-xl backdrop-blur-lg">
      <audio ref={audioRef} />
      <div className="flex items-center mb-4">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={togglePlayPause}
          className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-4 mr-4 transition-colors"
        >
          <AnimatePresence mode="wait" initial={false}>
            {isPlaying ? (
              <motion.div
                key="pause"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.2 }}
              >
                <Pause className="w-6 h-6" />
              </motion.div>
            ) : (
              <motion.div
                key="play"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.2 }}
              >
                <Play className="w-6 h-6" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
        <div className="flex-grow">
          <Slider
            value={[currentTime]}
            max={duration}
            step={0.1}
            onValueChange={(value) => {
              if (audioRef.current) {
                audioRef.current.currentTime = value[0]
              }
            }}
            className="w-full"
          />
        </div>
        <div className="ml-4 text-sm tabular-nums">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
      </div>
      <div className="flex items-center">
        <button
          onClick={() => handleVolumeChange([volume === 0 ? 1 : 0])}
          className="mr-2 text-gray-400 hover:text-white transition-colors"
        >
          {volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
        <Slider value={[volume]} max={1} step={0.01} onValueChange={handleVolumeChange} className="w-24" />
      </div>
      <div className="h-24 bg-gray-700 bg-opacity-50 rounded-lg mt-4">
        {/* Placeholder for waveform visualization */}
      </div>
    </div>
  )
}

