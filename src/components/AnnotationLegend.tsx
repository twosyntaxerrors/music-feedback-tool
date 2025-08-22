"use client"

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, X } from 'lucide-react';

interface AnnotationType {
  category: string;
  icon: string;
  color: string;
  description: string;
  examples: string[];
}

const annotationTypes: AnnotationType[] = [
  {
    category: 'structure',
    icon: '🏗️',
    color: 'bg-indigo-500/20 border-indigo-400/40 text-indigo-300',
    description: 'Track structure and arrangement changes',
    examples: ['Intro', 'Verse', 'Chorus', 'Bridge', 'Outro']
  },
  {
    category: 'instrument',
    icon: '🎵',
    color: 'bg-blue-500/20 border-blue-400/40 text-blue-300',
    description: 'Key instruments entering or changing',
    examples: ['808 bass drops', 'Lead guitar enters', 'Synth layers build']
  },
  {
    category: 'mood',
    icon: '🌊',
    color: 'bg-purple-500/20 border-purple-400/40 text-purple-300',
    description: 'Emotional and atmospheric shifts',
    examples: ['Dark atmosphere', 'Energetic groove', 'Melancholic shift']
  },
  {
    category: 'rhythm',
    icon: '⚡',
    color: 'bg-green-500/20 border-green-400/40 text-green-300',
    description: 'Rhythmic highlights and groove changes',
    examples: ['Rhythm peak', 'Groove intensifies', 'Hi-hat pattern']
  },
  {
    category: 'production',
    icon: '🎛️',
    color: 'bg-orange-500/20 border-orange-400/40 text-orange-300',
    description: 'Production and mix quality highlights',
    examples: ['Mix clarity', 'Production quality', 'Effects processing']
  },
  {
    category: 'genre',
    icon: '🎧',
    color: 'bg-pink-500/20 border-pink-400/40 text-pink-300',
    description: 'Genre-specific musical elements',
    examples: ['Trap signature', 'Rock energy', 'Electronic build']
  }
];

export function AnnotationLegend() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Legend Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 p-3 bg-black/80 backdrop-blur-md border border-white/20 rounded-full hover:bg-black/60 transition-all duration-200 shadow-lg"
        title="Annotation Legend"
      >
        <Info className="w-5 h-5 text-white" />
      </button>

      {/* Legend Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              className="bg-black/90 backdrop-blur-md border border-white/20 rounded-xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">Annotation Legend</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              <div className="space-y-4">
                <p className="text-sm text-white/80">
                  Temporal annotations provide real-time insights as you listen to your track. 
                  Each annotation type is color-coded and positioned at specific timestamps.
                </p>

                {annotationTypes.map((type) => (
                  <div key={type.category} className="space-y-2">
                    <div className={`flex items-center gap-3 p-3 rounded-lg border ${type.color}`}>
                      <span className="text-lg">{type.icon}</span>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-white capitalize">
                          {type.category}
                        </div>
                        <div className="text-xs text-white/80">
                          {type.description}
                        </div>
                      </div>
                    </div>
                    
                    <div className="ml-8">
                      <div className="text-xs text-white/60 mb-1">Examples:</div>
                      <div className="flex flex-wrap gap-1">
                        {type.examples.map((example, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 text-xs bg-white/10 text-white/80 rounded border border-white/20"
                          >
                            {example}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}

                <div className="pt-4 border-t border-white/20">
                  <div className="text-xs text-white/60 space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-white/20 rounded-full border border-white/40"></div>
                      <span>Click annotations to jump to that timestamp</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-white/40 rounded-full border border-white/60"></div>
                      <span>Hover for detailed information</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-white/60 rounded-full border border-white/80"></div>
                      <span>Annotations appear during playback</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
