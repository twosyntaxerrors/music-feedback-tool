"use client"

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "./ui/button";
import { AudioPlayer } from "./AudioPlayer";
import { Upload, FileAudio, X, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AudioUploaderProps {
  onUploadComplete: (analysis: any, file: File, url: string) => void;
  onError: (error: string) => void;
  onReset?: () => void;
}

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ALLOWED_FORMATS = {
  'audio/mpeg': ['.mp3'],
  'audio/wav': ['.wav'],
  'audio/aac': ['.aac'],
  'audio/ogg': ['.ogg'],
  'audio/flac': ['.flac'],
  'audio/x-aiff': ['.aiff']
};

export function AudioUploader({ onUploadComplete, onError, onReset }: AudioUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const validateFile = (file: File) => {
    if (file.size > MAX_FILE_SIZE) {
      return "File size exceeds 50MB limit";
    }

    const fileType = file.type;
    if (!Object.keys(ALLOWED_FORMATS).includes(fileType)) {
      return "Unsupported file format";
    }

    return null;
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const error = validateFile(file);
      if (error) {
        setValidationError(error);
        return;
      }

      setValidationError(null);
      setSelectedFile(file);
      setAudioUrl(URL.createObjectURL(file));
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ALLOWED_FORMATS,
    maxFiles: 1,
    maxSize: MAX_FILE_SIZE,
  });

  const uploadFile = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setValidationError(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch("/api/gemini/audio-analysis", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Upload failed");
      }

      const data = await response.json();
      
      // Validate the response data
      if (!data || typeof data !== 'object') {
        throw new Error("Invalid response from server");
      }

      if (!audioUrl) {
        throw new Error("Audio URL is not available");
      }

      onUploadComplete(data, selectedFile, audioUrl);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Upload failed";
      setValidationError(message);
      onError(message);
    } finally {
      setUploading(false);
    }
  };

  const removeFile = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedFile(null);
    setAudioUrl(null);
    setValidationError(null);
    if (onReset) {
      onReset();
    }
  };

  return (
    <div className="space-y-6">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 backdrop-blur-lg ${
          isDragActive 
            ? "border-blue-400 bg-blue-400/10" 
            : validationError
            ? "border-red-400 hover:border-red-500"
            : "border-gray-600 hover:border-gray-400"
        }`}
      >
        <input {...getInputProps()} />
        <AnimatePresence mode="wait">
          {selectedFile ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex items-center justify-center"
            >
              <FileAudio className="w-8 h-8 mr-2 text-blue-400" />
              <span className="text-lg text-gray-200">{selectedFile.name}</span>
              <button
                onClick={removeFile}
                className="ml-4 p-1 rounded-full bg-red-500/20 hover:bg-red-500/30 transition-colors"
              >
                <X className="w-4 h-4 text-red-400" />
              </button>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: -20 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: 20 }}
              className="space-y-4"
            >
              <Upload className="w-16 h-16 mx-auto text-blue-400" />
              <div>
                <p className="text-xl mb-2 text-gray-200">
                  Drag & drop your audio file here, or click to select
                </p>
                <p className="text-sm text-gray-400">
                  Supported formats: MP3, WAV, AAC, OGG, FLAC, AIFF (max 50MB)
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {validationError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 text-red-400 text-sm"
        >
          <AlertCircle className="w-4 h-4" />
          <span>{validationError}</span>
        </motion.div>
      )}

      {selectedFile && !validationError && !uploading && (
        <div className="space-y-6">
          {audioUrl && <AudioPlayer audioUrl={audioUrl} />}
          
          <div className="bg-gray-800/50 backdrop-blur-lg p-4 rounded-xl border border-gray-700/50 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-400">Selected file: {selectedFile.name}</p>
              <p className="text-sm text-gray-500">
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
            <Button
              onClick={uploadFile}
              disabled={uploading}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white transition-colors disabled:opacity-50"
            >
              {uploading ? "Analyzing..." : "Analyze Audio"}
            </Button>
          </div>
        </div>
      )}

      {uploading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/50 backdrop-blur-lg p-6 rounded-xl border border-gray-700/50 shadow-xl"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-200">Analyzing your track</p>
              <p className="text-xs text-gray-400">This might take a minute...</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
              <div className="h-2 w-2 rounded-full bg-blue-400 animate-pulse [animation-delay:0.2s]" />
              <div className="h-2 w-2 rounded-full bg-blue-400 animate-pulse [animation-delay:0.4s]" />
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg text-sm text-gray-300">
            <svg className="animate-spin h-4 w-4 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>AI is analyzing your track...</span>
          </div>
        </motion.div>
      )}
    </div>
  );
} 