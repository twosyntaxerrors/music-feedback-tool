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

  // Generate temporal annotations using the AnnotationGenerator
  const annotations = useMemo(() => {
    
    if (duration === 0) {
      return [];
    }
    
    if (!analysis || Object.keys(analysis).length === 0) {
      // Generate test annotations for debugging
      const testAnnotations: TemporalAnnotation[] = [
        {
          id: 'test-1',
          timestamp: duration * 0.1,
          type: 'instrument',
          title: 'Test Comment',
          description: '🔥🔥🔥 This is a test comment! Love how it builds up',
          color: 'bg-blue-500/20 border-blue-400/40 text-blue-300',
          avatarColor: 'bg-blue-500',
          intensity: 0.8,
          category: 'instrument'
        },
        {
          id: 'test-2',
          timestamp: duration * 0.3,
          type: 'mood',
          title: 'Test Mood',
          description: '🌊🌊 This vibe is so atmospheric! Love the moody energy',
          color: 'bg-purple-500/20 border-purple-400/40 text-purple-300',
          avatarColor: 'bg-purple-500',
          intensity: 0.7,
          category: 'mood'
        },
        {
          id: 'test-3',
          timestamp: duration * 0.6,
          type: 'rhythm',
          title: 'Test Rhythm',
          description: '⚡⚡⚡ RHYTHM PEAK! This is where the magic happens',
          color: 'bg-green-500/20 border-green-400/40 text-green-300',
          avatarColor: 'bg-green-500',
          intensity: 0.9,
          category: 'rhythm'
        }
      ];
      return testAnnotations;
    }
    
    try {
      const generator = new AnnotationGenerator({ trackDuration: duration, analysis });
      const generated = generator.generateAllAnnotations();
      return generated;
    } catch (error) {
      return [];
    }
  }, [analysis, duration]);

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
      
      // Also check if we should show a comment immediately at the new position
      setTimeout(() => {
        const commentAtNewPosition = annotations.find(annotation => {
          const timeDiff = Math.abs(currentTime - annotation.timestamp);
          return timeDiff <= 1;
        });
        
        if (commentAtNewPosition) {
          setCurrentComment(commentAtNewPosition);
          setCommentHistory([commentAtNewPosition]);
          
          // Auto-hide comment after 4 seconds
          setTimeout(() => {
            setCurrentComment(null);
          }, 2000); // Changed from 4000 to 2000 for faster fade-out
        }
      }, 100);
    }
    
    setLastSeekTime(currentTime);
  }, [currentTime, lastSeekTime, annotations]);

  // Simple comment display - one at a time with fade in/out
  useEffect(() => {
    if (!isPlaying || annotations.length === 0 || duration === 0) return;

    // Find the next comment that should appear
    const nextComment = annotations.find(annotation => {
      const timeDiff = currentTime - annotation.timestamp;
      const shouldAppear = timeDiff >= -0.5 && timeDiff <= 1 && 
                           !commentHistory.some(hist => hist.id === annotation.id);
      
      return shouldAppear;
    });

    if (nextComment) {
      setCurrentComment(nextComment);
      setCommentHistory(prev => [...prev, nextComment]);
      
      // Auto-hide comment after 4 seconds
      setTimeout(() => {
        setCurrentComment(null);
      }, 2000); // Changed from 4000 to 2000 for faster fade-out
    }
  }, [isPlaying, currentTime, annotations, commentHistory, duration]);

  // Reset comment state when track starts over
  useEffect(() => {
    if (currentTime < 1) {
      setCurrentComment(null);
      setCommentHistory([]);
      setLastSeekTime(0);
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

      {/* Waveform with visible annotation avatars */}
      <div className="relative">
        <div ref={waveformRef} className="w-full" />
        
        {/* Annotation avatars on waveform */}
        {annotations.map((annotation) => (
          <div
            key={annotation.id}
            className="absolute top-0 bottom-0 z-20 flex flex-col items-center"
            style={{ left: `${getAnnotationPosition(annotation.timestamp)}%` }}
          >
            {/* Vertical line indicator */}
            <div className="w-px h-full bg-white/30" />
            
            {/* Avatar icon */}
            <div 
              className={`absolute top-2 w-6 h-6 rounded-full border-2 flex items-center justify-center cursor-pointer hover:scale-110 transition-all duration-200 ${annotation.avatarColor} ${isSeeking ? 'animate-pulse' : ''} ${hoveredAvatar?.id === annotation.id ? 'border-white scale-110 ring-2 ring-white/50' : 'border-white/30'}`}
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
        {/* Show hover comment if hovering, otherwise show current playback comment */}
        {(hoveredAvatar || currentComment) && (
          <motion.div 
            className="p-3 rounded-lg border border-white/20 bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            key={hoveredAvatar?.id || currentComment?.id || 'comment'}
          >
            <div className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${(hoveredAvatar || currentComment)?.avatarColor}`}>
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
