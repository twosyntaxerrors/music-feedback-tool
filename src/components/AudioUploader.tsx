"use client"

import { useState } from "react";
import { Button } from "./ui/button";
import { AudioPlayer } from "./AudioPlayer";
import { AlertCircle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { FileUpload } from "./ui/file-upload";

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

  const handleFileChange = (files: File[]) => {
    const file = files[0];
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
  };

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

  const handleRemove = () => {
    setSelectedFile(null);
    setAudioUrl(null);
    setValidationError(null);
    if (onReset) {
      onReset();
    }
  };

  return (
    <div className="space-y-6">
      <FileUpload onChange={handleFileChange} onRemove={handleRemove} />

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

      {selectedFile && !validationError && (
        <div className="space-y-6">
          {audioUrl && (
            <div className="bg-neutral-900/50 backdrop-blur-sm border border-neutral-800 rounded-xl p-4">
              <AudioPlayer audioUrl={audioUrl} />
            </div>
          )}
          
          <div className="bg-neutral-900/50 backdrop-blur-sm p-4 rounded-xl border border-neutral-800 shadow-xl space-y-4">
            {!uploading ? (
              <>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-neutral-400">Selected file: {selectedFile.name}</p>
                  <p className="text-sm text-neutral-500">
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
                <Button
                  onClick={uploadFile}
                  disabled={uploading}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white transition-colors disabled:opacity-50"
                >
                  Analyze Audio
                </Button>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-neutral-200">Analyzing your track</p>
                    <p className="text-xs text-neutral-400">This might take a minute...</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
                    <div className="h-2 w-2 rounded-full bg-blue-400 animate-pulse [animation-delay:0.2s]" />
                    <div className="h-2 w-2 rounded-full bg-blue-400 animate-pulse [animation-delay:0.4s]" />
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-neutral-800/30 rounded-lg text-sm text-neutral-300">
                  <Loader2 className="h-4 w-4 text-blue-400 animate-spin" />
                  <span>Listening to your music...</span>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 