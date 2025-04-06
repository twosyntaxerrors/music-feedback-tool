"use client"

import { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { Play, Pause } from 'lucide-react';
import { Button } from './ui/button';

interface WaveformPlayerProps {
  audioUrl: string;
}

export function WaveformPlayer({ audioUrl }: WaveformPlayerProps) {
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [duration, setDuration] = useState("0:00");
  const hoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!waveformRef.current) return;

    // Create canvas for gradient
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    canvas.height = 50;

    // Define the waveform gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 1.35);
    gradient.addColorStop(0, '#656666');
    gradient.addColorStop((canvas.height * 0.7) / canvas.height, '#656666');
    gradient.addColorStop((canvas.height * 0.7 + 1) / canvas.height, '#ffffff');
    gradient.addColorStop((canvas.height * 0.7 + 2) / canvas.height, '#ffffff');
    gradient.addColorStop((canvas.height * 0.7 + 3) / canvas.height, '#B1B1B1');
    gradient.addColorStop(1, '#B1B1B1');

    // Define the progress gradient
    const progressGradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 1.35);
    progressGradient.addColorStop(0, '#00fff2');
    progressGradient.addColorStop((canvas.height * 0.7) / canvas.height, '#00c8ff');
    progressGradient.addColorStop((canvas.height * 0.7 + 1) / canvas.height, '#ffffff');
    progressGradient.addColorStop((canvas.height * 0.7 + 2) / canvas.height, '#ffffff');
    progressGradient.addColorStop((canvas.height * 0.7 + 3) / canvas.height, '#00fff2');
    progressGradient.addColorStop(1, '#00c8ff');

    // Create wavesurfer instance
    const wavesurfer = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: gradient,
      progressColor: progressGradient,
      barWidth: 2,
      barGap: 1,
      barRadius: 2,
      height: 50,
      url: audioUrl,
    });

    wavesurferRef.current = wavesurfer;

    // Event listeners
    wavesurfer.on('ready', () => {
      setDuration(formatTime(wavesurfer.getDuration()));
    });

    wavesurfer.on('timeupdate', (currentTime) => {
      setCurrentTime(formatTime(currentTime));
    });

    wavesurfer.on('finish', () => {
      setIsPlaying(false);
    });

    // Hover effect
    if (waveformRef.current && hoverRef.current) {
      const waveformEl = waveformRef.current;
      const hoverEl = hoverRef.current;

      const handlePointerMove = (e: PointerEvent) => {
        const rect = waveformEl.getBoundingClientRect();
        const x = e.clientX - rect.left;
        hoverEl.style.width = `${x}px`;
      };

      waveformEl.addEventListener('pointermove', handlePointerMove);

      return () => {
        waveformEl.removeEventListener('pointermove', handlePointerMove);
        wavesurfer.destroy();
      };
    }
  }, [audioUrl]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.round(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const togglePlayPause = () => {
    if (wavesurferRef.current) {
      wavesurferRef.current.playPause();
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="relative w-full rounded-xl overflow-hidden bg-gradient-to-r from-gray-900 via-blue-900/20 to-gray-900 backdrop-blur-sm border border-white/10 p-3">
      <div className="flex items-center gap-3 mb-3">
        <Button
          onClick={togglePlayPause}
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 text-white"
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
        
        <div className="text-xs text-white/80 px-2 py-0.5 rounded bg-black/20">
          {currentTime} / {duration}
        </div>
      </div>

      <div className="relative cursor-pointer">
        <div ref={waveformRef} className="w-full" />
        <div
          ref={hoverRef}
          className="absolute left-0 top-0 z-10 pointer-events-none h-full w-0 mix-blend-overlay bg-white/50 opacity-0 transition-opacity duration-200 hover:opacity-100"
        />
        <div className="absolute left-0 bottom-0 z-11 text-[10px] text-white/80 bg-black/75 px-1 py-0.5">
          {currentTime}
        </div>
        <div className="absolute right-0 bottom-0 z-11 text-[10px] text-white/80 bg-black/75 px-1 py-0.5">
          {duration}
        </div>
      </div>
    </div>
  );
} 