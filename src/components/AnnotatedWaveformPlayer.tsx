"use client"

import { useEffect, useRef, useState, useMemo } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { Play, Pause } from 'lucide-react';
import { Button } from './ui/button';
import { type Analysis } from '@/types/analysis';
import { motion, AnimatePresence } from 'framer-motion';
import { AnnotationGenerator, type TemporalAnnotation } from '@/lib/annotationGenerator';

interface AnnotatedWaveformPlayerProps {
  audioUrl: string;
  analysis: Analysis;
}

export function AnnotatedWaveformPlayer({ audioUrl, analysis }: AnnotatedWaveformPlayerProps) {
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentComment, setCurrentComment] = useState<TemporalAnnotation | null>(null);
  const [commentHistory, setCommentHistory] = useState<TemporalAnnotation[]>([]);
  const [lastSeekTime, setLastSeekTime] = useState(0);
  const [hoveredAvatar, setHoveredAvatar] = useState<TemporalAnnotation | null>(null);
  const [isSeeking, setIsSeeking] = useState(false);
  const [commentCounter, setCommentCounter] = useState(0);
  // New: toggle to enable/disable comments and avatars
  const [commentsEnabled, setCommentsEnabled] = useState(false);
  const [aiCommentsLoading, setAiCommentsLoading] = useState(false);
  const [aiComments, setAiComments] = useState<TemporalAnnotation[]>([]);

  // Generate temporal annotations using AI comments when available
  const annotations = useMemo(() => {
    // Return AI comments if available, otherwise return empty array
    if (aiComments.length > 0) {
      console.log('✅ Using AI-generated comments:', aiComments.length);
      return aiComments;
    }

    // Return empty array when comments are disabled or loading
    if (!commentsEnabled || aiCommentsLoading) {
      console.log('🔇 Comments disabled or loading, returning empty array');
      return [];
    }

    // Check if analysis has meaningful data
    const hasAnalysisData = analysis &&
      typeof analysis === 'object' &&
      analysis.primary_genre &&
      analysis.key_instruments &&
      analysis.mood_tags;

    if (!hasAnalysisData) {
      console.log('❌ Analysis is empty or missing key data, returning empty array');
      return [];
    }

    console.log('✅ Using fallback AnnotationGenerator');
    try {
      const generator = new AnnotationGenerator({ trackDuration: duration, analysis });
      const generated = generator.generateAllAnnotations();
      console.log('✅ Generated annotations:', generated);
      return generated;
    } catch (error) {
      console.error('❌ Error generating annotations:', error);
      return [];
    }
  }, [analysis, duration, aiComments, commentsEnabled, aiCommentsLoading]);

  // Function to generate AI comments when enabled
  const generateAIComments = async () => {
    if (!analysis || duration === 0) {
      console.log('❌ Cannot generate AI comments: missing analysis or duration');
      return;
    }

    setAiCommentsLoading(true);
    try {
      console.log('🚀 Generating AI comments...');

      const response = await fetch('/api/gemini/audio-comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          analysis,
          trackDuration: duration,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();

        // Create a more detailed error object
        const error = new Error(errorData.error || "Failed to generate AI comments");
        (error as any).statusCode = response.status;
        (error as any).errorType = errorData.errorType;
        (error as any).details = errorData.details;

        throw error;
      }

      const data = await response.json();

      if (data.success && data.comments) {
        console.log('✅ AI comments generated successfully:', data.comments.length);
        setAiComments(data.comments);
      } else {
        console.error('❌ Failed to generate AI comments:', data.error);

        // Handle specific error types
        const errorObj = error as any;
        const statusCode = errorObj.statusCode || 500;
        const errorType = errorObj.errorType || "UNKNOWN_ERROR";

        if (statusCode === 429) {
          if (errorType === "RATE_LIMIT_EXCEEDED") {
            alert("Too many requests to AI comments service. Please wait a moment before trying again.");
          } else if (errorType === "QUOTA_EXCEEDED") {
            alert("Daily API quota exceeded for AI comments. Please try again tomorrow.");
          }
        } else {
          alert(`Failed to generate AI comments: ${data.error}`);
        }

        // Fallback to local annotation generator
        console.log('🔄 Falling back to local annotation generator...');
        const generator = new AnnotationGenerator({ trackDuration: duration, analysis });
        const generated = generator.generateAllAnnotations();
        setAiComments(generated);
      }
    } catch (error) {
      console.error('❌ Error generating AI comments:', error);

      // Handle specific error types
      const errorObj = error as any;
      const statusCode = errorObj.statusCode || 500;
      const errorType = errorObj.errorType || "UNKNOWN_ERROR";

      if (statusCode === 429) {
        if (errorType === "RATE_LIMIT_EXCEEDED") {
          alert("Too many requests to AI comments service. Please wait a moment before trying again.");
        } else if (errorType === "QUOTA_EXCEEDED") {
          alert("Daily API quota exceeded for AI comments. Please try again tomorrow.");
        }
      } else {
        alert(`Failed to generate AI comments: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }

      // Fallback to local annotation generator
      console.log('🔄 Falling back to local annotation generator...');
      try {
        const generator = new AnnotationGenerator({ trackDuration: duration, analysis });
        const generated = generator.generateAllAnnotations();
        setAiComments(generated);
      } catch (fallbackError) {
        console.error('❌ Fallback annotation generation also failed:', fallbackError);
      }
    } finally {
      setAiCommentsLoading(false);
    }
  };

  // Detect seeking and reset comment history when needed
  useEffect(() => {
    if (lastSeekTime === 0) {
      setLastSeekTime(currentTime);
      return;
    }

    const timeJump = Math.abs(currentTime - lastSeekTime);
    
    // If there's a large time jump (more than 2 seconds), it's likely a seek operation
    if (timeJump > 2) {
      setCommentHistory([]);
      setCurrentComment(null);
      setCommentCounter(0);
      
      // Also check if we should show a comment immediately at the new position
      setTimeout(() => {
        const commentAtNewPosition = annotations.find(annotation => {
          const timeDiff = Math.abs(currentTime - annotation.timestamp);
          return timeDiff <= 1;
        });
        
        if (commentAtNewPosition) {
          setCurrentComment(commentAtNewPosition);
          setCommentHistory([commentAtNewPosition]);
          setCommentCounter(prev => prev + 1);
          
          // Auto-hide comment after 2 seconds
          setTimeout(() => {
            setCurrentComment(null);
          }, 2000);
        }
      }, 100);
    }
    
    setLastSeekTime(currentTime);
  }, [currentTime, lastSeekTime, annotations]);

  // Stable comment display - comments appear at their exact timestamps and don't shift
  useEffect(() => {
    if (!isPlaying || annotations.length === 0 || duration === 0) return;

    // Find the next comment that should appear based on exact timestamp
    const nextComment = annotations.find(annotation => {
      const timeDiff = currentTime - annotation.timestamp;
      // Comment should appear when we're within 0.5 seconds of its timestamp
      const shouldAppear = timeDiff >= -0.5 && timeDiff <= 0.5 && 
                           !commentHistory.some(hist => hist.id === annotation.id);
      
      return shouldAppear;
    });

    if (nextComment) {
      setCurrentComment(nextComment);
      setCommentHistory(prev => [...prev, nextComment]);
      setCommentCounter(prev => prev + 1);
      
      // Auto-hide comment after 2 seconds
      setTimeout(() => {
        setCurrentComment(null);
      }, 2000);
    }
  }, [isPlaying, currentTime, annotations, commentHistory, duration]);

  // Reset comment state when track starts over
  useEffect(() => {
    if (currentTime < 1) {
      setCurrentComment(null);
      setCommentHistory([]);
      setLastSeekTime(0);
      setCommentCounter(0);
    }
  }, [currentTime]);

  useEffect(() => {
    if (!waveformRef.current) return;

    // Create canvas for gradient
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    canvas.height = 80;

    // Define the waveform gradient - cleaner, simpler
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#444444');
    gradient.addColorStop(0.5, '#666666');
    gradient.addColorStop(1, '#444444');

    // Define the progress gradient - cleaner
    const progressGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    progressGradient.addColorStop(0, '#ffffff');
    progressGradient.addColorStop(1, '#ffffff');

    // Create wavesurfer instance
    const wavesurfer = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: gradient,
      progressColor: progressGradient,
      barWidth: 2,
      barGap: 1,
      barRadius: 2,
      height: 80,
      url: audioUrl,
    });

    wavesurferRef.current = wavesurfer;

    // Event listeners
    wavesurfer.on('ready', () => {
      const trackDuration = wavesurfer.getDuration();
      setDuration(trackDuration);
    });

    wavesurfer.on('play', () => {
      setIsPlaying(true);
    });

    wavesurfer.on('pause', () => {
      setIsPlaying(false);
    });

    wavesurfer.on('timeupdate', (time) => {
      setCurrentTime(time);
    });

    wavesurfer.on('finish', () => {
      setIsPlaying(false);
    });

    return () => {
      wavesurfer.destroy();
    };
  }, [audioUrl]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.round(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const togglePlayPause = () => {
    if (wavesurferRef.current) {
      const wasPlaying = isPlaying;
      wavesurferRef.current.playPause();
      setIsPlaying(!wasPlaying);
    }
  };

  const getAnnotationPosition = (timestamp: number) => {
    if (duration === 0) return 0;
    return (timestamp / duration) * 100;
  };

  const handleAvatarClick = (annotation: TemporalAnnotation) => {
    if (!wavesurferRef.current || isSeeking) return;
    
    setIsSeeking(true);
    console.log('Seeking to timestamp:', annotation.timestamp);
    
    // Pause current playback
    wavesurferRef.current.pause();
    
    // Seek to the exact timestamp
    wavesurferRef.current.setTime(annotation.timestamp);
    
    // Reset comment state for the new position
    setCommentHistory([]);
    setCurrentComment(null);
    setLastSeekTime(annotation.timestamp);
    setCommentCounter(0); // Reset counter on seek
    
    // Resume playback after a brief delay and update button state
    setTimeout(() => {
      wavesurferRef.current?.play();
      setIsPlaying(true); // Update button to show pause state
      setIsSeeking(false);
    }, 100);
  };

  const handleAvatarHover = (annotation: TemporalAnnotation) => {
    setHoveredAvatar(annotation);
  };

  const handleAvatarLeave = () => {
    setHoveredAvatar(null);
  };

  return (
    <div className="relative w-full rounded-xl overflow-hidden bg-black/80 backdrop-blur-sm border border-white/10 p-3">
      <div className="flex items-center gap-3 mb-3">
        <Button
          onClick={togglePlayPause}
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full bg-white/5 hover:bg-white/10 text-white"
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
        

        <div className="text-xs text-white/80 px-2 py-0.5 rounded bg-black/40">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
      </div>

      {/* Comments toggle moved to top-right of the card */}
      <div className="absolute right-4 top-4 z-30">
        <div className="flex items-center gap-3">
          <span className="text-sm text-white/80">Comments</span>
          <button
            onClick={() => {
              setCommentsEnabled(prev => {
                const next = !prev;
                if (next) {
                  // Generate AI comments when enabling
                  generateAIComments();
                } else {
                  // Clear comments when disabling
                  setCurrentComment(null);
                  setHoveredAvatar(null);
                  setAiComments([]);
                }
                return next;
              });
            }}
            className={`h-9 w-14 rounded-md p-0.5 flex items-center transition-colors ${
              aiCommentsLoading ? 'bg-yellow-500/60 border border-yellow-500' :
              commentsEnabled ? 'bg-green-500/60 border border-green-500' :
              'bg-white/5 border border-white/10'
            }`}
            aria-pressed={commentsEnabled}
            title={
              aiCommentsLoading ? 'Generating AI comments...' :
              commentsEnabled ? 'Turn comments off' :
              'Turn comments on'
            }
          >
            {aiCommentsLoading ? (
              <div className="h-6 w-6 rounded-full bg-white/90 flex items-center justify-center">
                <div className="h-3 w-3 border-2 border-transparent border-t-white rounded-full animate-spin" />
              </div>
            ) : (
              <div className={`h-6 w-6 rounded-full bg-white/90 transform transition-transform ${commentsEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
            )}
          </button>
        </div>
      </div>

      {/* AI Comments Loading Indicator */}
      {aiCommentsLoading && (
        <div className="mt-2 p-2 rounded-lg border border-yellow-500/20 bg-yellow-500/10">
          <div className="text-xs text-yellow-400 text-center flex items-center justify-center gap-2">
            <div className="h-3 w-3 border-2 border-transparent border-t-yellow-400 rounded-full animate-spin" />
            Generating AI comments...
          </div>
        </div>
      )}

      {/* Waveform with visible annotation avatars */}
      <div className="relative">
        <div ref={waveformRef} className="w-full" />
        
        {/* Annotation avatars on waveform */}
        {commentsEnabled && annotations.map((annotation) => (
          <div
            key={annotation.id}
            className="absolute top-0 bottom-0 z-20 flex flex-col items-center"
            style={{ left: `${getAnnotationPosition(annotation.timestamp)}%` }}
          >
            {/* Vertical line indicator */}
            <div className="w-px h-full bg-white/30" />
            
            {/* Avatar icon */}
            <div 
              className={`absolute bottom-2 w-6 h-6 rounded-full border-2 flex items-center justify-center cursor-pointer hover:scale-110 transition-all duration-200 ${annotation.avatarColor} ${isSeeking ? 'animate-pulse' : ''} ${hoveredAvatar?.id === annotation.id ? 'border-white scale-110 ring-2 ring-white/50' : 'border-white/30'}`}
              style={{ 
                transform: `scale(${0.8 + (annotation.intensity * 0.4)})`,
                boxShadow: annotation.intensity > 0.8 ? '0 0 10px rgba(255, 255, 255, 0.3)' : 'none'
              }}
              onClick={() => handleAvatarClick(annotation)}
              onMouseEnter={() => handleAvatarHover(annotation)}
              onMouseLeave={handleAvatarLeave}
              title={`Click to jump to ${formatTime(annotation.timestamp)}`}
            >
            </div>
          </div>
        ))}
        
        {/* Time indicators */}
        <div className="absolute left-0 bottom-0 z-11 text-[10px] text-white/80 bg-black/75 px-1 py-0.5">
          {formatTime(currentTime)}
        </div>
        <div className="absolute right-0 bottom-0 z-11 text-[10px] text-white/80 bg-black/75 px-1 py-0.5">
          {formatTime(duration)}
        </div>
      </div>

      {/* Seeking indicator */}
      {isSeeking && (
        <div className="mt-2 p-2 rounded-lg border border-blue-500/20 bg-blue-500/10">
          <div className="text-xs text-blue-400 text-center">
            ⏳ Seeking to new position...
          </div>
        </div>
      )}

      

      {/* Unified Comment Display - Handles both hover and playback */}
      <div className="mt-4">
        {/* Show message when comments are disabled */}
        {!commentsEnabled && !aiCommentsLoading && (
          <div className="p-3 rounded-lg border border-white/10 bg-white/5">
            <div className="text-sm text-white/60 text-center">
              💭 Enable AI comments to see interactive annotations on your track
            </div>
          </div>
        )}

        {/* Show hover comment if hovering, otherwise show current playback comment */}
        {commentsEnabled && (hoveredAvatar || currentComment) && (
          <motion.div 
            className="p-3 rounded-lg border border-white/20 bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            key={`comment-${hoveredAvatar?.id || currentComment?.id || 'none'}-${hoveredAvatar ? 'hover' : 'playback'}`}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${(hoveredAvatar || currentComment)?.avatarColor}`}>
                {(hoveredAvatar || currentComment)?.type?.charAt(0).toUpperCase() || 'C'}
              </div>
              <div className="flex-1">
                <div className="text-sm text-white/80 leading-relaxed">
                  {(hoveredAvatar || currentComment)?.description}
                </div>
              </div>
              <div className="text-xs text-white/60">
                {formatTime((hoveredAvatar || currentComment)?.timestamp || 0)}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Force trigger some comments for testing */}
    </div>
  );
}
