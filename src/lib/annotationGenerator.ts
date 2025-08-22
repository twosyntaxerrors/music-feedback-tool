import { type Analysis } from '@/types/analysis';

export interface TemporalAnnotation {
  id: string;
  timestamp: number;
  type: 'structure' | 'instrument' | 'mood' | 'rhythm' | 'production' | 'genre' | 'dynamics';
  title: string;
  description: string;
  color: string;
  avatarColor: string; // New field for avatar color
  intensity: number;
  category: string;
}

export interface AnnotationConfig {
  trackDuration: number;
  analysis: Analysis;
}

export class AnnotationGenerator {
  private config: AnnotationConfig;
  private annotationId = 0;

  constructor(config: AnnotationConfig) {
    this.config = config;
  }

  generateAllAnnotations(): TemporalAnnotation[] {
    const annotations: TemporalAnnotation[] = [];

    // Generate structural annotations first (they provide framework)
    annotations.push(...this.generateStructuralAnnotations());
    
    // Generate instrument annotations
    annotations.push(...this.generateInstrumentAnnotations());
    
    // Generate mood and atmosphere annotations
    annotations.push(...this.generateMoodAnnotations());
    
    // Generate rhythm and groove annotations
    annotations.push(...this.generateRhythmAnnotations());
    
    // Generate production and mix annotations
    annotations.push(...this.generateProductionAnnotations());
    
    // Generate genre-specific annotations
    annotations.push(...this.generateGenreAnnotations());

    return annotations.sort((a, b) => a.timestamp - b.timestamp);
  }

  private generateStructuralAnnotations(): TemporalAnnotation[] {
    const structurePoints = [
      { 
        time: 0, 
        name: 'Intro', 
        description: 'yo this intro is hitting different fr fr 🔥' 
      },
      { 
        time: this.config.trackDuration * 0.25, 
        name: 'Verse 1', 
        description: 'okay this verse got me nodding my head already' 
      },
      { 
        time: this.config.trackDuration * 0.5, 
        name: 'Chorus', 
        description: 'CHORUS IS ABSOLUTELY EVERYTHING RN' 
      },
      { 
        time: this.config.trackDuration * 0.75, 
        name: 'Bridge', 
        description: 'this bridge is taking me places i never knew existed' 
      },
      { 
        time: this.config.trackDuration * 0.9, 
        name: 'Outro', 
        description: 'ending this track like a boss move' 
      }
    ];

    return structurePoints.map((point, index) => ({
      id: `structure-${index}`,
      timestamp: point.time,
      type: 'structure',
      title: point.name,
      description: point.description,
      color: 'bg-indigo-500/20 border-indigo-400/40 text-indigo-300',
      avatarColor: 'bg-indigo-500',
      intensity: 0.8,
      category: 'structure'
    }));
  }

  private generateInstrumentAnnotations(): TemporalAnnotation[] {
    const instruments = this.config.analysis.key_instruments || [];
    const comments = [
      'that bass is literally shaking my soul rn',
      'these drums are hitting harder than my ex',
      'piano keys got me feeling some type of way',
      'guitar solo just made me ascend to another dimension',
      'synth is giving me life rn',
      'strings are so beautiful i might cry',
      '808s are absolutely destroying everything',
      'this saxophone is speaking to my soul',
      'electric guitar is giving me chills fr',
      'organ is making this feel so spiritual'
    ];

    return instruments.slice(0, 5).map((instrument: string, index: number) => ({
      id: `instrument-${index}`,
      timestamp: this.config.trackDuration * (0.1 + index * 0.15),
      type: 'instrument',
      title: instrument,
      description: comments[index] || 'this instrument is absolutely fire',
      color: 'bg-blue-500/20 border-blue-400/40 text-blue-300',
      avatarColor: 'bg-blue-500',
      intensity: 0.7,
      category: 'instrument'
    }));
  }

  private generateMoodAnnotations(): TemporalAnnotation[] {
    const moods = this.config.analysis.mood_tags || ['neutral'];
    const mood = moods[0];
    const moodComments = {
      'dark': 'this dark energy is literally consuming me rn',
      'energetic': 'im about to run through a wall this is so hype',
      'melancholic': 'this got me in my feelings fr fr',
      'uplifting': 'im floating rn this is so beautiful',
      'aggressive': 'this aggression is making me feel invincible',
      'peaceful': 'this is so calming i could fall asleep to it',
      'mysterious': 'this mysterious vibe is so intriguing',
      'romantic': 'this is making me feel things i didnt know i could feel',
      'nostalgic': 'this is giving me flashbacks to better times',
      'triumphant': 'im feeling like i can conquer the world rn'
    };

    return [{
      id: 'mood-main',
      timestamp: this.config.trackDuration * 0.3,
      type: 'mood',
      title: mood,
      description: moodComments[mood as keyof typeof moodComments] || 'this mood is absolutely everything',
      color: 'bg-purple-500/20 border-purple-400/40 text-purple-300',
      avatarColor: 'bg-purple-500',
      intensity: 0.6,
      category: 'mood'
    }];
  }

  private generateRhythmAnnotations(): TemporalAnnotation[] {
    const rhythmPoints = [
      { time: this.config.trackDuration * 0.2, description: 'this rhythm got me moving whether i want to or not' },
      { time: this.config.trackDuration * 0.4, description: 'im literally dancing in my chair rn' },
      { time: this.config.trackDuration * 0.6, description: 'this beat is so infectious i cant help myself' },
      { time: this.config.trackDuration * 0.8, description: 'rhythm is absolutely perfect here' }
    ];

    return rhythmPoints.map((point, index) => ({
      id: `rhythm-${index}`,
      timestamp: point.time,
      type: 'rhythm',
      title: 'Rhythm',
      description: point.description,
      color: 'bg-green-500/20 border-green-400/40 text-green-300',
      avatarColor: 'bg-green-500',
      intensity: 0.9,
      category: 'rhythm'
    }));
  }

  private generateProductionAnnotations(): TemporalAnnotation[] {
    const productionComments = [
      'the mix is so clean i can hear every detail',
      'this production quality is absolutely insane',
      'whoever mixed this deserves a raise fr',
      'the levels are perfect, everything sits so well',
      'this is mixed better than most mainstream stuff',
      'the stereo field is giving me life rn',
      'compression is on point, everything sounds so punchy',
      'reverb is creating such a beautiful space',
      'the low end is so tight and controlled',
      'this is what good production sounds like'
    ];

    return productionComments.slice(0, 4).map((comment, index) => ({
      id: `production-${index}`,
      timestamp: this.config.trackDuration * (0.15 + index * 0.2),
      type: 'production',
      title: 'Production',
      description: comment,
      color: 'bg-orange-500/20 border-orange-400/40 text-orange-300',
      avatarColor: 'bg-orange-500',
      intensity: 0.7,
      category: 'production'
    }));
  }

  private generateGenreAnnotations(): TemporalAnnotation[] {
    const genre = this.config.analysis.primary_genre || 'unknown';
    const genreComments = {
      'hip-hop': 'this is giving me old school hip hop vibes fr',
      'trap': 'these 808s are absolutely destroying everything',
      'rock': 'this rock energy is making me want to headbang',
      'electronic': 'this electronic vibe is so futuristic i love it',
      'jazz': 'this jazz feel is so sophisticated and smooth',
      'r&b': 'this r&b is making me feel so smooth rn',
      'pop': 'this pop sensibility is absolutely perfect',
      'country': 'this country twang is giving me life',
      'reggae': 'this reggae rhythm is so laid back and perfect',
      'blues': 'this blues is speaking to my soul fr fr'
    };

    return [{
      id: 'genre-main',
      timestamp: this.config.trackDuration * 0.5,
      type: 'genre',
      title: genre,
      description: genreComments[genre as keyof typeof genreComments] || 'this genre is absolutely fire',
      color: 'bg-pink-500/20 border-pink-400/40 text-pink-300',
      avatarColor: 'bg-pink-500',
      intensity: 0.8,
      category: 'genre'
    }];
  }

  // Utility method to get annotations by category
  getAnnotationsByCategory(category: string): TemporalAnnotation[] {
    return this.generateAllAnnotations().filter(ann => ann.category === category);
  }

  // Utility method to get annotations by time range
  getAnnotationsInTimeRange(startTime: number, endTime: number): TemporalAnnotation[] {
    return this.generateAllAnnotations().filter(ann => 
      ann.timestamp >= startTime && ann.timestamp <= endTime
    );
  }
}
