import React from 'react';

interface WaveformProps {
  waveForms: number[];
  reversed?: boolean;
}

export default function Waveform({ waveForms, reversed }: WaveformProps) {
  return (
    <div
      className={`flex ${reversed ? 'items-start opacity-30' : 'items-end'} h-full`}
    >
      {waveForms.map((value, index) => (
        <div
          key={index}
          className="bg-white"
          style={{ height: `${value}%`, width: '2px', marginRight: '1px' }}
        />
      ))}
    </div>
  );
} 