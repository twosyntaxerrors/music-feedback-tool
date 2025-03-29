"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Upload, FileAudio, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export function AudioUploadZone({ onFileUpload }: { onFileUpload: (file: File | null) => void }) {
  const [file, setFile] = useState<File | null>(null)

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const uploadedFile = acceptedFiles[0]
      setFile(uploadedFile)
      onFileUpload(uploadedFile)
    },
    [onFileUpload],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "audio/*": [".mp3", ".wav", ".ogg", ".flac"],
    },
    multiple: false,
  })

  const removeFile = () => {
    setFile(null)
    onFileUpload(null)
  }

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 backdrop-blur-lg ${
        isDragActive ? "border-blue-400 bg-blue-400 bg-opacity-10" : "border-gray-600 hover:border-gray-400"
      }`}
    >
      <input {...getInputProps()} />
      <AnimatePresence>
        {file ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex items-center justify-center"
          >
            <FileAudio className="w-8 h-8 mr-2 text-blue-400" />
            <span className="text-lg">{file.name}</span>
            <button
              onClick={(e) => {
                e.stopPropagation()
                removeFile()
              }}
              className="ml-4 p-1 rounded-full bg-red-500 hover:bg-red-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}>
            <Upload className="w-16 h-16 mx-auto mb-4 text-blue-400" />
            <p className="text-xl mb-2">Drag & drop your audio file here, or click to select</p>
            <p className="text-sm text-gray-400">Supported formats: MP3, WAV, OGG, FLAC</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

