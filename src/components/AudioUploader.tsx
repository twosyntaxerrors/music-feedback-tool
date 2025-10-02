"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { AudioPlayer } from "./AudioPlayer";
import { AlertCircle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { FileUpload } from "./ui/file-upload";
import { useApiQuota } from "@/lib/contexts/ApiQuotaContext";
import { useAuth, useClerk } from "@clerk/nextjs";

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
  const [authNotice, setAuthNotice] = useState<string | null>(null);
  const [controlledFiles, setControlledFiles] = useState<File[]>([]);
  const pendingActionRef = useRef<(() => void) | null>(null);
  const authModalRequestedRef = useRef(false);
  const { isSignedIn } = useAuth();
  const previousAuthRef = useRef(isSignedIn);
  const { openSignIn } = useClerk();
  const { incrementUsage, remainingRequests } = useApiQuota();

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

  const revokeAudioUrl = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
  };

  const finalizeSelection = (file: File) => {
    const error = validateFile(file);
    if (error) {
      setValidationError(error);
      setAuthNotice(null);
      setSelectedFile(null);
      setControlledFiles([]);
      revokeAudioUrl();
      return;
    }

    setValidationError(null);
    setAuthNotice(null);
    setSelectedFile(file);
    revokeAudioUrl();
    const url = URL.createObjectURL(file);
    setAudioUrl(url);
    setControlledFiles([file]);
  };

  const ensureSignedIn = (action?: () => void) => {
    if (isSignedIn) {
      return true;
    }

    if (action) {
      pendingActionRef.current = action;
    }

    if (!authModalRequestedRef.current) {
      authModalRequestedRef.current = true;
      const locationHref = typeof window !== "undefined" ? window.location.href : "/";
      openSignIn({
        afterSignInUrl: locationHref,
        afterSignUpUrl: locationHref,
      });
      // Reset the flag after a short delay
      setTimeout(() => {
        authModalRequestedRef.current = false;
      }, 1000);
    }

    setAuthNotice("Sign in to upload and analyze your audio.");

    return false;
  };

  const handleFileChange = (files: File[]) => {
    const file = files[0];
    if (file) {
      const processSelection = () => finalizeSelection(file);

      if (!ensureSignedIn(processSelection)) {
        return;
      }

      processSelection();
    }
  };

  const uploadFile = async () => {
    if (!selectedFile) return;

    if (!ensureSignedIn(() => {
      void uploadFile();
    })) {
      return;
    }

    // Check if we have remaining API requests
    if (remainingRequests <= 0) {
      setValidationError("Daily API quota exceeded. Please try again tomorrow.");
      onError("Daily API quota exceeded. Please try again tomorrow.");
      return;
    }

    setUploading(true);
    setValidationError(null);

    let timingLabel: string | null = null;

    try {
      const uploadMeta = {
        name: selectedFile.name,
        size: selectedFile.size,
        type: selectedFile.type,
      };
      console.log("[AudioUploader] Starting upload", uploadMeta);
      timingLabel = `[AudioUploader] upload->fetch ${selectedFile.name}`;
      console.time(timingLabel);

      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch("/api/gemini/audio-analysis", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();

        // Create a more detailed error object
        const error = new Error(errorData.error || "Upload failed");
        (error as any).statusCode = response.status;
        (error as any).errorType = errorData.errorType;
        (error as any).details = errorData.details;

        throw error;
      }

      const data = await response.json();

      console.log("[AudioUploader] API response received", {
        status: response.status,
        ok: response.ok,
        keys: Object.keys(data || {}),
      });

      // Validate the response data
      if (!data || typeof data !== 'object') {
        throw new Error("Invalid response from server");
      }

      if (!audioUrl) {
        throw new Error("Audio URL is not available");
      }

      console.log('🔍 AudioUploader - Calling onUploadComplete with:', { data, file: selectedFile, url: audioUrl });
      
      // Increment API usage after successful analysis
      incrementUsage();

      onUploadComplete(data, selectedFile, audioUrl);
    } catch (error) {
      const errorObj = error as any;
      const statusCode = errorObj.statusCode || 500;
      const errorType = errorObj.errorType || "UNKNOWN_ERROR";

      let message = error instanceof Error ? error.message : "Upload failed";

      // Handle specific error types with user-friendly messages
      if (statusCode === 429) {
        if (errorType === "RATE_LIMIT_EXCEEDED") {
          message = "Too many requests. Please wait a moment before trying again.";
        } else if (errorType === "QUOTA_EXCEEDED") {
          message = "Daily API quota exceeded. Please try again tomorrow.";
        }
      } else if (statusCode === 413) {
        message = "File is too large. Please upload a smaller file (max 20MB).";
      } else if (statusCode === 415) {
        message = "Unsupported file format. Please upload an audio file.";
      } else if (statusCode === 401) {
        message = "Authentication required. Please sign in to continue.";
      }

      setValidationError(message);
      onError(message);
    } finally {
      if (timingLabel) {
        console.timeEnd(timingLabel);
      } else {
        console.debug("[AudioUploader] upload timing label unavailable; skipping console.timeEnd");
      }
      setUploading(false);
    }
  };

  const handleRemove = () => {
    revokeAudioUrl();
    setSelectedFile(null);
    setAudioUrl(null);
    setValidationError(null);
    setAuthNotice(null);
    setControlledFiles([]);
    if (onReset) {
      onReset();
    }
  };

  const handleRequireAuth = (interaction: "click" | "drop" | "change", files?: File[]) => {
    if (isSignedIn) {
      return true;
    }

    if (files && files.length > 0) {
      const file = files[0];
      pendingActionRef.current = () => finalizeSelection(file);
    }

    ensureSignedIn();
    return false;
  };

  useEffect(() => {
    if (previousAuthRef.current === isSignedIn) {
      return;
    }

    previousAuthRef.current = isSignedIn;

    if (!isSignedIn) {
      pendingActionRef.current = null;
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
      if (selectedFile || audioUrl || validationError || controlledFiles.length || authNotice) {
        setSelectedFile(null);
        setAudioUrl(null);
        setValidationError(null);
        setAuthNotice(null);
        setControlledFiles([]);
        if (onReset) {
          onReset();
        }
      }
      return;
    }

    setAuthNotice(null);

    if (pendingActionRef.current) {
      const action = pendingActionRef.current;
      pendingActionRef.current = null;
      action();
    }
  }, [authNotice, audioUrl, controlledFiles.length, isSignedIn, onReset, selectedFile, validationError]);

  return (
    <div className="space-y-6">
      <FileUpload
        onChange={handleFileChange}
        onRemove={handleRemove}
        onRequireAuth={handleRequireAuth}
        files={controlledFiles}
      />

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

      {authNotice && !validationError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 p-3 rounded-lg bg-blue-500/10 text-blue-300 text-sm"
        >
          <AlertCircle className="w-4 h-4" />
          <span>{authNotice}</span>
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
                  className="relative inline-flex h-12 overflow-hidden rounded-md p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 w-full justify-center"
                >
                  <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#FFFFFF_0%,#000000_50%,#FFFFFF_100%)]" />
                  <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-md bg-black px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
                    Analyze Audio
                  </span>
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
