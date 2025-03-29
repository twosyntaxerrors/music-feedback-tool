"use client"

import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause } from 'lucide-react';
import { Button } from './ui/button';
import { Waveform } from './Waveform';

interface WaveformPlayerProps {
  audioUrl: string;
}

export function WaveformPlayer({ audioUrl }: WaveformPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [waveformData, setWaveformData] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generateWaveformData = async () => {
      try {
        const response = await fetch(audioUrl);
        const arrayBuffer = await response.arrayBuffer();
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        
        // Get the raw audio data
        const rawData = audioBuffer.getChannelData(0);
        
        // Generate waveform data by sampling the audio data
        const samples = 100; // Number of bars in the waveform
        const blockSize = Math.floor(rawData.length / samples);
        const waveform = [];
        
        for (let i = 0; i < samples; i++) {
          let blockStart = blockSize * i;
          let sum = 0;
          
          for (let j = 0; j < blockSize; j++) {
            sum += Math.abs(rawData[blockStart + j]);
          }
          
          // Normalize the value (0-100)
          waveform.push((sum / blockSize) * 100);
        }
        
        setWaveformData(waveform);
        setLoading(false);
      } catch (error) {
        console.error('Error generating waveform:', error);
        setLoading(false);
      }
    };

    generateWaveformData();
  }, [audioUrl]);

  useEffect(() => {
    if (audioRef.current) {
      const audio = audioRef.current;
      
      const handleTimeUpdate = () => {
        setCurrentTime(audio.currentTime);
      };
      
      const handleLoadedMetadata = () => {
        setDuration(audio.duration);
      };
      
      const handleEnded = () => {
        setIsPlaying(false);
      };
      
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('ended', handleEnded);
      
      return () => {
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audio.removeEventListener('ended', handleEnded);
      };
    }
  }, []);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleWaveformClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = x / rect.width;
      const newTime = percentage * duration;
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  return (
    <div className="w-full space-y-4">
      <audio ref={audioRef} src={audioUrl} />
      
      <div className="flex items-center gap-4">
        <Button
          onClick={togglePlayPause}
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-full bg-blue-500 hover:bg-blue-600 text-white"
        >
          {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
        </Button>
        
        <div className="text-sm text-gray-400">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
      </div>

      <div 
        className="relative h-24 w-full cursor-pointer"
        onClick={handleWaveformClick}
      >
        {loading ? (
          <div className="h-full w-full flex items-center justify-center">
            <div className="animate-pulse text-gray-400">Loading waveform...</div>
          </div>
        ) : (
          <>
            <Waveform waveForms={waveformData} />
            <div
              className="absolute bottom-0 left-0 h-full bg-blue-500/30"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
          </>
        )}
      </div>
    </div>
  );
} 