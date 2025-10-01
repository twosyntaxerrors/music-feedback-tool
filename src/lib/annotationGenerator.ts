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
  // Pool of concise, hype-style fan comments to add variety
  private shortFanComments: string[] = [
    'FIRE 🔥',
    'this is heat',
    '🔥🔥',
    'sheeeesh',
    'so hard',
    'this slaps',
    'banger',
    'on repeat',
    'W',
    'gas',
    'insane 🔥',
    'crazy',
    'too clean',
    'vibes',
    'GOATED',
    'cold ❄️',
    'hits',
    'no skips',
    'run it back',
    'chef’s kiss 👨‍🍳💋',
    'heat 🔥',
    'hard 🔥',
    'absolute W',
    'so tough',
    'bussin',
    'elite',
    'wow 🔥',
    'clean mix',
    'levels',
    'crazy good'
  ];
  private lastShortFanIndex = -1;

  constructor(config: AnnotationConfig) {
    this.config = config;
    console.log('AnnotationGenerator initialized with analysis:', this.config.analysis);
  }

  private pickShortFanComment(): string {
    if (this.shortFanComments.length === 0) return '🔥🔥';
    let idx = Math.floor(Math.random() * this.shortFanComments.length);
    if (this.shortFanComments.length > 1) {
      // Avoid immediate duplicates
      while (idx === this.lastShortFanIndex) {
        idx = Math.floor(Math.random() * this.shortFanComments.length);
      }
    }
    this.lastShortFanIndex = idx;
    return this.shortFanComments[idx];
  }

  generateAllAnnotations(): TemporalAnnotation[] {
    console.log('Generating all annotations...');
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

    // Add short fan-style comments for variety
    const flavored = this.applyShortFanFlavor(annotations);
    console.log(`Generated ${flavored.length} total annotations`);
    return flavored.sort((a, b) => a.timestamp - b.timestamp);
  }

  // Occasionally swap detailed descriptions for short hype comments to increase variety
  private applyShortFanFlavor(annotations: TemporalAnnotation[]): TemporalAnnotation[] {
    const probabilityByType: Record<TemporalAnnotation['type'], number> = {
      rhythm: 0.55,
      instrument: 0.5,
      production: 0.35,
      genre: 0.3,
      dynamics: 0.3,
      mood: 0.25,
      structure: 0.15,
    };
    return annotations.map((ann) => {
      const probability = probabilityByType[ann.type] ?? 0.25;
      if (Math.random() < probability) {
        return { ...ann, description: this.pickShortFanComment() };
      }
      return ann;
    });
  }

  private generateStructuralAnnotations(): TemporalAnnotation[] {
    const { analysis } = this.config;
    const analysisData = typeof analysis.analysis === 'object' ? analysis.analysis : null;
    const lyrics = analysisData?.lyrics || '';
    const hasLyrics = Boolean(lyrics && lyrics.length > 0);
    
    // Generate deterministic timestamps based on track characteristics
    const timestamps = this.generateDeterministicTimestamps();
    
    const structurePoints = [
      { 
        time: timestamps.intro, 
        name: 'Intro', 
        description: this.generateUniqueIntroComment(hasLyrics, lyrics)
      },
      { 
        time: timestamps.verse, 
        name: 'Verse 1', 
        description: this.generateUniqueVerseComment(hasLyrics, lyrics)
      },
      { 
        time: timestamps.chorus, 
        name: 'Chorus', 
        description: this.generateUniqueChorusComment(hasLyrics, lyrics)
      },
      { 
        time: timestamps.bridge, 
        name: 'Bridge', 
        description: this.generateUniqueBridgeComment(hasLyrics, lyrics)
      },
      { 
        time: timestamps.outro, 
        name: 'Outro', 
        description: this.generateUniqueOutroComment(hasLyrics, lyrics)
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

  private generateDeterministicTimestamps(): { intro: number; verse: number; chorus: number; bridge: number; outro: number } {
    const { analysis } = this.config;
    const duration = this.config.trackDuration;
    const scores = analysis.scores || {};
    const genre = analysis.primary_genre?.toLowerCase() || '';
    
    // Use deterministic values based on track characteristics
    const genreHash = this.hashString(genre);
    const scoreHash = this.hashString(JSON.stringify(scores));
    
    // Base timestamps with some variation
    const baseIntro = duration * (0.05 + (genreHash % 15) * 0.01); // 5-20% of track
    const baseVerse = duration * (0.2 + (scoreHash % 20) * 0.01); // 20-40% of track
    const baseChorus = duration * (0.45 + (genreHash % 25) * 0.01); // 45-70% of track
    const baseBridge = duration * (0.7 + (scoreHash % 20) * 0.01); // 70-90% of track
    const baseOutro = duration * (0.85 + (genreHash % 15) * 0.01); // 85-100% of track
    
    // Adjust based on track characteristics
    let intro = baseIntro;
    let verse = baseVerse;
    let chorus = baseChorus;
    let bridge = baseBridge;
    let outro = baseOutro;
    
    // Adjust based on genre patterns
    if (genre.includes('hip-hop') || genre.includes('rap')) {
      intro = duration * (0.08 + (genreHash % 17) * 0.01);
      bridge = duration * (0.65 + (scoreHash % 15) * 0.01);
    } else if (genre.includes('pop')) {
      chorus = duration * (0.35 + (genreHash % 20) * 0.01);
      bridge = duration * (0.75 + (scoreHash % 15) * 0.01);
    } else if (genre.includes('rock')) {
      intro = duration * (0.1 + (genreHash % 20) * 0.01);
      bridge = duration * (0.7 + (scoreHash % 20) * 0.01);
    } else if (genre.includes('electronic') || genre.includes('edm')) {
      intro = duration * (0.15 + (genreHash % 15) * 0.01);
      chorus = duration * (0.5 + (genreHash % 25) * 0.01);
      bridge = duration * (0.8 + (scoreHash % 15) * 0.01);
    } else if (genre.includes('classical') || genre.includes('orchestral')) {
      intro = duration * (0.05 + (genreHash % 25) * 0.01);
      verse = duration * (0.25 + (scoreHash % 25) * 0.01);
      chorus = duration * (0.55 + (genreHash % 25) * 0.01);
      bridge = duration * (0.75 + (scoreHash % 20) * 0.01);
    }
    
    // Adjust based on performance scores
    if (scores.rhythm && scores.rhythm > 8) {
      chorus = duration * (0.4 + (scoreHash % 30) * 0.01);
    }
    
    if (scores.melody && scores.melody > 8) {
      bridge = duration * (0.65 + (genreHash % 25) * 0.01);
    }
    
    // Ensure timestamps are in chronological order and within bounds
    intro = Math.max(0, Math.min(intro, duration * 0.25));
    verse = Math.max(intro + duration * 0.1, Math.min(verse, duration * 0.45));
    chorus = Math.max(verse + duration * 0.1, Math.min(chorus, duration * 0.75));
    bridge = Math.max(chorus + duration * 0.1, Math.min(bridge, duration * 0.95));
    outro = Math.max(bridge + duration * 0.05, Math.min(outro, duration * 0.98));
    
    return { intro, verse, chorus, bridge, outro };
  }

  // Simple hash function to create deterministic values
  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  private generateUniqueIntroComment(hasLyrics: boolean, lyrics: string): string {
    const { analysis } = this.config;
    const genre = analysis.primary_genre?.toLowerCase() || '';
    const mood = analysis.mood_tags?.[0]?.toLowerCase() || '';
    const instruments = analysis.key_instruments || [];
    
    if (hasLyrics && lyrics.length > 0) {
      const words = lyrics.split(' ').filter(word => word.length > 2).slice(0, 2);
      if (words.length > 0) {
        const lyricSample = words.join(' ').toLowerCase();
        return `Intro got me like "${lyricSample}" 🔥`;
      }
    }
    
    if (genre.includes('trap') || genre.includes('hip-hop')) {
      return `This ${genre} intro is absolutely fire 🔥`;
    } else if (genre.includes('orchestral') || genre.includes('classical')) {
      return `This orchestral intro is absolutely beautiful ✨`;
    } else if (mood.includes('dark') || mood.includes('mysterious')) {
      return `This dark intro is absolutely hypnotizing 🌙`;
    } else if (mood.includes('energetic') || mood.includes('uplifting')) {
      return `This intro got me absolutely hyped 💪`;
    }
    
    return `This intro is absolutely everything 🔥`;
  }

  private generateUniqueVerseComment(hasLyrics: boolean, lyrics: string): string {
    const { analysis } = this.config;
    const instruments = analysis.key_instruments || [];
    const hasStrings = instruments.some(inst => inst.toLowerCase().includes('violin') || inst.toLowerCase().includes('strings'));
    const hasPiano = instruments.some(inst => inst.toLowerCase().includes('piano'));
    
    if (hasLyrics && lyrics.length > 0) {
      const words = lyrics.split(' ').filter(word => word.length > 2).slice(0, 2);
      if (words.length > 0) {
        const lyricSample = words.join(' ').toLowerCase();
        return `Verse got me like "${lyricSample}" 🔥`;
      }
    }
    
    if (hasStrings && hasPiano) {
      return `Violin and piano together is absolutely beautiful 🎻🎹`;
    } else if (hasStrings) {
      return `These strings are absolutely beautiful 🎻`;
    } else if (hasPiano) {
      return `This piano is absolutely everything 🎹`;
    }
    
    return `This verse got me absolutely nodding 🔥`;
  }

  private generateUniqueChorusComment(hasLyrics: boolean, lyrics: string): string {
    const { analysis } = this.config;
    const genre = analysis.primary_genre?.toLowerCase() || '';
    const scores = analysis.scores || {};
    
    if (hasLyrics && lyrics.length > 0) {
      const words = lyrics.split(' ').filter(word => word.length > 2).slice(0, 2);
      if (words.length > 0) {
        const lyricSample = words.join(' ').toLowerCase();
        return `CHORUS got me like "${lyricSample}" 🔥`;
      }
    }
    
    if (genre.includes('orchestral') && genre.includes('trap')) {
      return `This orchestral trap fusion is absolutely mind-blowing 💯`;
    } else if (scores.rhythm && scores.rhythm > 8) {
      return `The CHORUS rhythm is absolutely insane 🔥`;
    } else if (scores.melody && scores.melody > 8) {
      return `The melody is absolutely magical ✨`;
    }
    
    return `This CHORUS is absolutely everything 🔥`;
  }

  private generateUniqueBridgeComment(hasLyrics: boolean, lyrics: string): string {
    const { analysis } = this.config;
    const mood = analysis.mood_tags?.[0]?.toLowerCase() || '';
    const instruments = analysis.key_instruments || [];
    const has808s = instruments.some(inst => inst.toLowerCase().includes('808'));
    
    if (hasLyrics && lyrics.length > 0) {
      const words = lyrics.split(' ').filter(word => word.length > 2).slice(0, 2);
      if (words.length > 0) {
        const lyricSample = words.join(' ').toLowerCase();
        return `Bridge got me like "${lyricSample}" 🔥`;
      }
    }
    
    if (has808s && mood.includes('dark')) {
      return `These 808s are absolutely dangerous 😈`;
    } else if (mood.includes('melancholic')) {
      return `This bridge got me absolutely in my feelings 💔`;
    } else if (mood.includes('energetic')) {
      return `The bridge energy is absolutely insane ⚡`;
    }
    
    return `This bridge is absolutely taking me places 🔥`;
  }

  private generateUniqueOutroComment(hasLyrics: boolean, lyrics: string): string {
    const { analysis } = this.config;
    const genre = analysis.primary_genre?.toLowerCase() || '';
    const scores = analysis.scores || {};
    
    if (hasLyrics && lyrics.length > 0) {
      const words = lyrics.split(' ').filter(word => word.length > 2).slice(0, 2);
      if (words.length > 0) {
        const lyricSample = words.join(' ').toLowerCase();
        return `Ending got me like "${lyricSample}" 👑`;
      }
    }
    
    if (genre.includes('trap') && scores.production && scores.production > 8) {
      return `This trap banger ending is absolutely insane 👑`;
    } else if (genre.includes('orchestral')) {
      return `This orchestral finale is absolutely majestic 🎭`;
    } else if (scores.production && scores.production > 8) {
      return `The production quality is absolutely insane 🔥`;
    }
    
    return `This ending is absolutely legendary 👑`;
  }

  private generateInstrumentAnnotations(): TemporalAnnotation[] {
    const instruments = this.config.analysis.key_instruments || [];
    const { analysis } = this.config;
    const analysisData = typeof analysis.analysis === 'object' ? analysis.analysis : null;
    const lyrics = analysisData?.lyrics || '';
    const hasLyrics = Boolean(lyrics && lyrics.length > 0);
    
    console.log('Generating instrument annotations for:', instruments);
    
    // Create unique comments based on specific instrument characteristics
    const uniqueComments = instruments.map((instrument: string, index: number) => {
      const inst = instrument.toLowerCase();
      const genre = this.config.analysis.primary_genre?.toLowerCase() || '';
      const mood = this.config.analysis.mood_tags?.[0]?.toLowerCase() || '';
      
      if (inst.includes('violin') || inst.includes('strings')) {
        if (genre.includes('hip-hop') || genre.includes('trap')) {
          return `Violin over hip-hop is absolutely fire 🔥🎻`;
        } else if (mood.includes('melancholic')) {
          return `This violin got me absolutely in my feelings 🎻💔`;
        }
        return `This violin hits absolutely different 🎻`;
      } else if (inst.includes('808') || inst.includes('sub-bass')) {
        if (genre.includes('trap')) {
          return `These 808s are absolutely destroying everything 💥`;
        }
        return `These 808s are absolutely insane 💥`;
      } else if (inst.includes('piano')) {
        if (mood.includes('peaceful') || mood.includes('melancholic')) {
          return `This piano is absolutely peaceful and beautiful 🎹✨`;
        }
        return `This piano is absolutely beautiful 🎹`;
      } else if (inst.includes('drum') || inst.includes('percussion')) {
        if (genre.includes('hip-hop')) {
          return `These ${genre} drums are absolutely hitting hard 🥁🔥`;
        }
        return `These drums are absolutely hitting hard 🥁`;
      } else if (inst.includes('synth') || inst.includes('electronic')) {
        if (mood.includes('mysterious')) {
          return `This mysterious synth is absolutely hypnotizing ⚡🔮`;
        }
        return `This synth is absolutely giving life ⚡`;
      } else if (inst.includes('guitar')) {
        if (genre.includes('rock')) {
          return `This guitar is absolutely rock epic 🎸🔥`;
        }
        return `This guitar is absolutely ascending 🎸`;
      } else if (inst.includes('saxophone')) {
        if (genre.includes('jazz') || mood.includes('smooth')) {
          return `This sax is absolutely smooth and jazzy 🎷✨`;
        }
        return `This sax is absolutely speaking to my soul 🎷`;
      } else if (inst.includes('organ')) {
        if (mood.includes('spiritual') || genre.includes('gospel')) {
          return `This organ is absolutely spiritual and beautiful 🙏✨`;
        }
        return `This organ is absolutely spiritual 🙏`;
      } else if (inst.includes('lead vocal') || inst.includes('vocal')) {
        if (hasLyrics && lyrics.length > 0) {
          const words = lyrics.split(' ').filter((word: string) => word.length > 2).slice(0, 2);
          if (words.length > 0) {
            const lyricSample = words.join(' ').toLowerCase();
            return `Vocals got me like "${lyricSample}" 🔥🎤`;
          }
        }
        return `These vocals are absolutely fire 🔥🎤`;
      } else if (inst.includes('hip-hop drum machine') || inst.includes('kick') || inst.includes('snare') || inst.includes('hi-hats')) {
        if (genre.includes('hip-hop')) {
          return `These hip-hop drums are absolutely authentic 🥁💥`;
        }
        return `These hip-hop drums are absolutely hitting 🥁💥`;
      } else if (inst.includes('vocal samples') || inst.includes('chants')) {
        if (mood.includes('energetic')) {
          return `These vocal samples are absolutely hype 🎤🔥`;
        }
        return `These vocal samples are absolutely hype 🎤🔥`;
      } else if (inst.includes('chiptune') || inst.includes('8-bit')) {
        if (mood.includes('nostalgic')) {
          return `This 8-bit sound is absolutely nostalgic and epic 🎮✨`;
        }
        return `This 8-bit sound is absolutely retro and epic 🎮✨`;
      }
      
      // Create unique comment based on instrument name and context
      if (genre && mood) {
        return `This ${instrument} is giving me major ${genre} vibes 🔥`;
      } else if (genre) {
        return `This ${instrument} is pure ${genre} energy 🔥`;
      } else if (mood) {
        return `This ${instrument} is creating such a ${mood} atmosphere 🔥`;
      }
      
      return `${instrument} is absolutely fire 🔥`;
    });

    // Generate timestamps with some variation to prevent exact same positioning
    const timestamps = this.generateVariedInstrumentTimestamps(instruments.length);

    return instruments.slice(0, 5).map((instrument: string, index: number) => ({
      id: `instrument-${index}`,
      timestamp: timestamps[index],
      type: 'instrument',
      title: instrument,
      description: uniqueComments[index] || 'instrument fire 🔥',
      color: 'bg-blue-500/20 border-blue-400/40 text-blue-300',
      avatarColor: 'bg-blue-500',
      intensity: 0.7,
      category: 'instrument'
    }));
  }

  private generateVariedInstrumentTimestamps(count: number): number[] {
    const duration = this.config.trackDuration;
    const { analysis } = this.config;
    const genre = analysis.primary_genre?.toLowerCase() || '';
    const genreHash = this.hashString(genre);
    const timestamps: number[] = [];
    
    // Distribute instrument comments throughout the track with natural variation
    for (let i = 0; i < count; i++) {
      // Start after intro, spread throughout the track
      const baseTime = duration * (0.15 + (i / count) * 0.7);
      // Add natural variation based on genre hash and instrument index
      const variation = duration * ((genreHash + i * 13) % 20 - 10) * 0.01; // ±10% variation
      const timestamp = Math.max(duration * 0.1, Math.min(duration * 0.9, baseTime + variation));
      timestamps.push(timestamp);
    }
    
    return timestamps.sort((a, b) => a - b); // Ensure chronological order
  }

  private generateMoodAnnotations(): TemporalAnnotation[] {
    const moods = this.config.analysis.mood_tags || ['neutral'];
    const mood = moods[0];
    const { analysis } = this.config;
    const analysisData = typeof analysis.analysis === 'object' ? analysis.analysis : null;
    const lyrics = analysisData?.lyrics || '';
    const hasLyrics = Boolean(lyrics && lyrics.length > 0);
    const genre = analysis.primary_genre?.toLowerCase() || '';
    const instruments = analysis.key_instruments || [];
    
    console.log('Generating mood annotations for:', mood);
    
    // Create unique mood comment based on specific characteristics
    let comment = 'this mood is absolutely everything';
    
    if (hasLyrics && lyrics.length > 0) {
      const words = lyrics.split(' ').filter((word: string) => word.length > 2).slice(0, 3);
      if (words.length > 0) {
        const lyricSample = words.join(' ').toLowerCase();
        
        // Create unique comment based on mood and lyrics combination
        if (mood.toLowerCase().includes('confrontational') || mood.toLowerCase().includes('aggressive')) {
          comment = `this confrontational energy got me like "${lyricSample}" 🔥⚔️`;
        } else if (mood.toLowerCase().includes('west coast')) {
          comment = `west coast energy got me feeling like a king rn "${lyricSample}" 🌴👑`;
        } else if (mood.toLowerCase().includes('hip-hop')) {
          comment = `hip-hop got me feeling unstoppable rn "${lyricSample}" 🔥💪`;
        } else if (mood.toLowerCase().includes('melancholic')) {
          comment = `this melancholic vibe with "${lyricSample}" got me in my feelings fr fr 💔`;
        } else if (mood.toLowerCase().includes('energetic')) {
          comment = `this energetic energy with "${lyricSample}" got me hyped af 💪`;
        } else if (mood.toLowerCase().includes('mysterious')) {
          comment = `this mysterious vibe with "${lyricSample}" is so intriguing 🔮`;
        } else {
          comment = `this ${mood} mood with "${lyricSample}" is absolutely everything 🔥`;
        }
      } else {
        // Fallback without lyrics
        comment = this.generateUniqueMoodComment(mood, genre, instruments);
      }
    } else {
      // No lyrics, create unique comment based on mood, genre, and instruments
      comment = this.generateUniqueMoodComment(mood, genre, instruments);
    }
    
    console.log(`Generated mood comment: ${comment}`);

    // Generate deterministic timestamp for mood comment
    const timestamp = this.generateDeterministicMoodTimestamp();

    return [{
      id: 'mood-main',
      timestamp: timestamp,
      type: 'mood',
      title: mood,
      description: comment,
      color: 'bg-purple-500/20 border-purple-400/40 text-purple-300',
      avatarColor: 'bg-purple-500',
      intensity: 0.8,
      category: 'mood'
    }];
  }

  private generateUniqueMoodComment(mood: string, genre: string, instruments: string[]): string {
    const moodLower = mood.toLowerCase();
    
    if (moodLower.includes('confrontational') || moodLower.includes('aggressive')) {
      if (genre.includes('hip-hop') || genre.includes('trap')) {
        return `This energy got me feeling unstoppable 🔥`;
      }
      return `The intensity is absolutely insane ⚔️`;
    } else if (moodLower.includes('west coast')) {
      if (genre.includes('hip-hop')) {
        return `West coast vibes hitting different 🌴`;
      }
      return `This is pure west coast energy 🌴`;
    } else if (moodLower.includes('hip-hop')) {
      if (genre.includes('hip-hop')) {
        return `Hip-hop at its finest 🔥`;
      }
      return `This is what hip-hop should sound like 🎤`;
    } else if (moodLower.includes('g-funk')) {
      if (genre.includes('hip-hop')) {
        return `G-funk never gets old ☁️`;
      }
      return `Classic g-funk vibes ☁️`;
    } else if (moodLower.includes('energetic') || moodLower.includes('energy')) {
      if (instruments.some(inst => inst.toLowerCase().includes('808') || inst.toLowerCase().includes('bass'))) {
        return `This energy is absolutely electric ⚡`;
      }
      return `Can't sit still to this 💪`;
    } else if (moodLower.includes('dramatic') || moodLower.includes('epic')) {
      if (instruments.some(inst => inst.toLowerCase().includes('strings') || inst.toLowerCase().includes('orchestra'))) {
        return `This orchestral section is everything 🎭`;
      }
      return `The drama is real with this one 🎭`;
    } else if (moodLower.includes('mysterious')) {
      if (instruments.some(inst => inst.toLowerCase().includes('synth'))) {
        return `This mysterious synth is hypnotizing 🔮`;
      }
      return `Getting lost in this mysterious vibe 🔮`;
    } else if (moodLower.includes('melancholic')) {
      if (instruments.some(inst => inst.toLowerCase().includes('piano'))) {
        return `This piano got me in my feelings 💔`;
      }
      return `This melancholic mood hits deep 💔`;
    } else if (moodLower.includes('peaceful')) {
      if (instruments.some(inst => inst.toLowerCase().includes('strings'))) {
        return `These strings are so peaceful 🎻`;
      }
      return `This peaceful vibe is everything 😌`;
    } else if (moodLower.includes('romantic')) {
      if (instruments.some(inst => inst.toLowerCase().includes('piano'))) {
        return `This romantic piano is beautiful 💕`;
      }
      return `The romance is real with this one 💕`;
    } else if (moodLower.includes('nostalgic')) {
      if (instruments.some(inst => inst.toLowerCase().includes('chiptune') || inst.toLowerCase().includes('8-bit'))) {
        return `This 8-bit sound is pure nostalgia 🎮`;
      }
      return `Getting major nostalgic vibes 📸`;
    } else if (moodLower.includes('triumphant')) {
      if (instruments.some(inst => inst.toLowerCase().includes('orchestra') || inst.toLowerCase().includes('brass'))) {
        return `This orchestral moment is triumphant 👑`;
      }
      return `Feeling like a champion listening to this 👑`;
    }
    
    // Generic fallbacks that sound human
    if (genre && genre !== 'unknown') {
      return `This ${genre} vibe is absolutely fire 🔥`;
    }
    
    return `This mood is everything 🔥`;
  }

  private generateDeterministicMoodTimestamp(): number {
    const duration = this.config.trackDuration;
    const { analysis } = this.config;
    const mood = analysis.mood_tags?.[0]?.toLowerCase() || '';
    const genre = analysis.primary_genre?.toLowerCase() || '';
    const moodHash = this.hashString(mood);
    const genreHash = this.hashString(genre);
    
    // Base timestamp with mood-specific adjustments
    let baseTime = duration * (0.3 + (moodHash % 25) * 0.01); // 30-55% of track
    
    // Adjust based on mood characteristics
    if (mood.includes('dark') || mood.includes('mysterious')) {
      baseTime = duration * (0.4 + (moodHash % 20) * 0.01); // Dark moods often appear later
    } else if (mood.includes('energetic') || mood.includes('uplifting')) {
      baseTime = duration * (0.25 + (moodHash % 25) * 0.01); // Energetic moods often appear earlier
    } else if (mood.includes('melancholic') || mood.includes('peaceful')) {
      baseTime = duration * (0.35 + (moodHash % 30) * 0.01); // Melancholic moods in the middle
    }
    
    // Adjust based on genre patterns
    if (genre.includes('hip-hop') || genre.includes('rap')) {
      baseTime = duration * (0.3 + (genreHash % 25) * 0.01); // Hip-hop moods often during verses
    } else if (genre.includes('pop')) {
      baseTime = duration * (0.35 + (genreHash % 20) * 0.01); // Pop moods often during chorus
    } else if (genre.includes('electronic') || genre.includes('edm')) {
      baseTime = duration * (0.4 + (genreHash % 25) * 0.01); // Electronic moods often during build-ups
    }
    
    return Math.max(duration * 0.2, Math.min(duration * 0.75, baseTime));
  }

  private generateRhythmAnnotations(): TemporalAnnotation[] {
    const { analysis } = this.config;
    const scores = analysis.scores || {};
    const genre = analysis.primary_genre?.toLowerCase() || '';
    const instruments = analysis.key_instruments || [];
    
    console.log('Generating rhythm annotations with scores:', scores);
    
    // Generate deterministic timestamps for rhythm comments
    const timestamps = this.generateDeterministicRhythmTimestamps();
    
    const rhythmPoints = [
      { 
        time: timestamps[0], 
        description: this.generateUniqueRhythmComment(0, scores, genre, instruments)
      },
      { 
        time: timestamps[1], 
        description: this.generateUniqueRhythmComment(1, scores, genre, instruments)
      },
      { 
        time: timestamps[2], 
        description: this.generateUniqueRhythmComment(2, scores, genre, instruments)
      },
      { 
        time: timestamps[3], 
        description: this.generateUniqueRhythmComment(3, scores, genre, instruments)
      }
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

  private generateDeterministicRhythmTimestamps(): number[] {
    const duration = this.config.trackDuration;
    const { analysis } = this.config;
    const scores = analysis.scores || {};
    const genre = analysis.primary_genre?.toLowerCase() || '';
    const genreHash = this.hashString(genre);
    const scoreHash = this.hashString(JSON.stringify(scores));
    
    const timestamps: number[] = [];
    
    // Generate 4 rhythm comment points with genre-specific distribution
    for (let i = 0; i < 4; i++) {
      let baseTime: number;
      
      if (genre.includes('hip-hop') || genre.includes('rap')) {
        baseTime = duration * (0.15 + (i / 3) * 0.7);
      } else if (genre.includes('electronic') || genre.includes('edm')) {
        baseTime = duration * (0.2 + (i / 3) * 0.6);
      } else if (genre.includes('rock')) {
        baseTime = duration * (0.1 + (i / 3) * 0.8);
      } else {
        baseTime = duration * (0.15 + (i / 3) * 0.7);
      }
      
      // Add natural variation based on genre hash and score hash
      const variation = duration * ((genreHash + scoreHash + i * 11) % 18 - 9) * 0.01; // ±9% variation
      const timestamp = Math.max(duration * 0.1, Math.min(duration * 0.9, baseTime + variation));
      timestamps.push(timestamp);
    }
    
    return timestamps.sort((a, b) => a - b); // Ensure chronological order
  }

  private generateUniqueRhythmComment(timePoint: number, scores: any, genre: string, instruments: string[]): string {
    const rhythmScore = scores.rhythm || 7;
    const hasDrums = instruments.some(inst => inst.toLowerCase().includes('drum') || inst.toLowerCase().includes('kick') || inst.toLowerCase().includes('snare'));
    const hasBass = instruments.some(inst => inst.toLowerCase().includes('808') || inst.toLowerCase().includes('bass'));
    
    if (timePoint === 0) {
      if (genre.includes('trap') || genre.includes('hip-hop')) {
        if (hasDrums && hasBass) {
          return `This ${genre} rhythm is absolutely infectious 🔥`;
        }
        return `The ${genre} groove is everything 🔥`;
      } else if (genre.includes('orchestral')) {
        if (instruments.some(inst => inst.toLowerCase().includes('strings'))) {
          return `These orchestral strings are so majestic 🎻`;
        }
        return `This orchestral rhythm is absolutely beautiful 🎭`;
      } else if (genre.includes('electronic')) {
        if (hasDrums) {
          return `This electronic beat is hypnotizing ⚡`;
        }
        return `The electronic rhythm is so infectious ⚡`;
      }
      return `This rhythm got me moving 🎵`;
    } else if (timePoint === 1) {
      if (rhythmScore > 8) {
        if (hasDrums) {
          return `The rhythm is absolutely perfect 💯`;
        }
        return `This rhythm is everything 💯`;
      } else if (hasBass) {
        return `This bass got me dancing in my chair 💃`;
      }
      return `Can't help but move to this 💃`;
    } else if (timePoint === 2) {
      if (genre.includes('electronic')) {
        if (hasDrums) {
          return `This electronic beat is absolutely fire ⚡`;
        }
        return `The electronic rhythm is so addictive ⚡`;
      } else if (genre.includes('hip-hop')) {
        if (hasBass) {
          return `This hip-hop beat is absolutely insane 🔥`;
        }
        return `The hip-hop rhythm is so infectious 🔥`;
      }
      return `This beat is absolutely everything 🎵`;
    } else {
      if (rhythmScore > 7) {
        if (hasDrums && hasBass) {
          return `The rhythm is absolutely perfect 💯`;
        }
        return `This rhythm is absolutely perfect 💯`;
      } else if (hasDrums) {
        return `The drums are absolutely fire 🔥`;
      }
      return `This rhythm is absolutely perfect 💯`;
    }
  }

  private generateProductionAnnotations(): TemporalAnnotation[] {
    const { analysis } = this.config;
    const scores = analysis.scores || {};
    const instruments = analysis.key_instruments || [];
    console.log('Generating production annotations with scores:', scores);
    
    const productionComments = [
      this.generateUniqueProductionComment(0, scores, instruments),
      this.generateUniqueProductionComment(1, scores, instruments),
      this.generateUniqueProductionComment(2, scores, instruments),
      this.generateUniqueProductionComment(3, scores, instruments)
    ];

    // Generate deterministic timestamps for production comments
    const timestamps = this.generateDeterministicProductionTimestamps();

    return productionComments.map((comment, index) => ({
      id: `production-${index}`,
      timestamp: timestamps[index],
      type: 'production',
      title: 'Production',
      description: comment,
      color: 'bg-orange-500/20 border-orange-400/40 text-orange-300',
      avatarColor: 'bg-orange-500',
      intensity: 0.8,
      category: 'production'
    }));
  }

  private generateDeterministicProductionTimestamps(): number[] {
    const duration = this.config.trackDuration;
    const { analysis } = this.config;
    const scores = analysis.scores || {};
    const genre = analysis.primary_genre?.toLowerCase() || '';
    const genreHash = this.hashString(genre);
    const scoreHash = this.hashString(JSON.stringify(scores));
    
    const timestamps: number[] = [];
    
    // Generate 4 production comment points with genre-specific distribution
    for (let i = 0; i < 4; i++) {
      let baseTime: number;
      
      if (genre.includes('hip-hop') || genre.includes('rap')) {
        baseTime = duration * (0.2 + (i / 3) * 0.6);
      } else if (genre.includes('electronic') || genre.includes('edm')) {
        baseTime = duration * (0.25 + (i / 3) * 0.5);
      } else if (genre.includes('rock')) {
        baseTime = duration * (0.15 + (i / 3) * 0.7);
      } else if (genre.includes('classical') || genre.includes('orchestral')) {
        baseTime = duration * (0.1 + (i / 3) * 0.8);
      } else {
        baseTime = duration * (0.2 + (i / 3) * 0.6);
      }
      
      // Add natural variation based on genre hash and score hash
      const variation = duration * ((genreHash + scoreHash + i * 17) % 16 - 8) * 0.01; // ±8% variation
      const timestamp = Math.max(duration * 0.15, Math.min(duration * 0.85, baseTime + variation));
      timestamps.push(timestamp);
    }
    
    return timestamps.sort((a, b) => a - b); // Ensure chronological order
  }

  private generateUniqueProductionComment(index: number, scores: any, instruments: string[]): string {
    const productionScore = scores.production || 7;
    const hasSynths = instruments.some(inst => inst.toLowerCase().includes('synth'));
    const hasStrings = instruments.some(inst => inst.toLowerCase().includes('strings') || inst.toLowerCase().includes('violin'));
    const hasPiano = instruments.some(inst => inst.toLowerCase().includes('piano'));
    const has808s = instruments.some(inst => inst.toLowerCase().includes('808') || inst.toLowerCase().includes('bass'));
    const hasDrums = instruments.some(inst => inst.toLowerCase().includes('drum') || inst.toLowerCase().includes('kick') || inst.toLowerCase().includes('snare'));
    
    if (index === 0) {
      if (productionScore > 8) {
        if (hasSynths && hasStrings) {
          return `The production quality is absolutely insane 🔥`;
        } else if (hasSynths) {
          return `These synths sound so clean and crisp ⚡`;
        } else if (hasStrings) {
          return `The strings are so clear and beautiful 🎻`;
        }
        return `The production is absolutely insane 🔥`;
      } else if (has808s) {
        return `These 808s are absolutely destroying everything 💥`;
      }
      return `The production is absolutely insane 🔥`;
    } else if (index === 1) {
      if (productionScore > 8) {
        if (hasPiano && hasStrings) {
          return `The piano and strings blend perfectly 🎹🎻`;
        } else if (hasPiano) {
          return `The piano sounds so clear and crisp 🎹`;
        }
        return `The production quality is absolutely perfect 💯`;
      } else if (hasSynths) {
        return `These synths are absolutely fire ⚡`;
      }
      return `The production quality is absolutely perfect 💯`;
    } else if (index === 2) {
      if (productionScore > 7) {
        if (hasStrings) {
          return `The strings are absolutely beautiful 🎻`;
        } else if (has808s) {
          return `The bass production is absolutely insane 💥`;
        }
        return `The production is absolutely insane 🔥`;
      } else if (hasDrums) {
        return `The drums are absolutely fire 🥁`;
      }
      return `The production is absolutely insane 🔥`;
    } else {
      if (productionScore > 8) {
        if (hasSynths && has808s) {
          return `The synth and bass production is absolutely perfect ⚡💥`;
        }
        return `The production quality is absolutely perfect 💯`;
      } else if (hasSynths) {
        return `These synths are absolutely fire ⚡`;
      }
      return `The production quality is absolutely perfect 💯`;
    }
  }

  private generateGenreAnnotations(): TemporalAnnotation[] {
    const genre = this.config.analysis.primary_genre || 'unknown';
    const secondaryInfluences = this.config.analysis.secondary_influences || [];
    const { analysis } = this.config;
    const analysisData = typeof analysis.analysis === 'object' ? analysis.analysis : null;
    const lyrics = analysisData?.lyrics || '';
    const hasLyrics = Boolean(lyrics && lyrics.length > 0);
    const instruments = analysis.key_instruments || [];
    const mood = analysis.mood_tags?.[0]?.toLowerCase() || '';
    
    console.log('Generating genre annotations for:', genre, 'with influences:', secondaryInfluences);
    
    // Create unique genre comment based on specific characteristics
    let comment = 'this genre is absolutely fire';
    
    if (hasLyrics && lyrics.length > 0) {
      const words = lyrics.split(' ').filter((word: string) => word.length > 2).slice(0, 3);
      if (words.length > 0) {
        const lyricSample = words.join(' ').toLowerCase();
        comment = this.generateUniqueGenreCommentWithLyrics(genre, lyricSample, secondaryInfluences, instruments, mood);
      } else {
        comment = this.generateUniqueGenreComment(genre, secondaryInfluences, instruments, mood);
      }
    } else {
      comment = this.generateUniqueGenreComment(genre, secondaryInfluences, instruments, mood);
    }
    
    console.log(`Generated genre comment: ${comment}`);

    // Generate deterministic timestamp for genre comment
    const timestamp = this.generateDeterministicGenreTimestamp();

    return [{
      id: 'genre-main',
      timestamp: timestamp,
      type: 'genre',
      title: genre,
      description: comment,
      color: 'bg-pink-500/20 border-pink-400/40 text-pink-300',
      avatarColor: 'bg-pink-500',
      intensity: 0.8,
      category: 'genre'
    }];
  }

  private generateUniqueGenreCommentWithLyrics(genre: string, lyricSample: string, secondaryInfluences: string[], instruments: string[], mood: string): string {
    const genreLower = genre.toLowerCase();
    
    // Create unique comment based on genre, lyrics, and context
    if (genreLower.includes('west coast') && genreLower.includes('hip-hop')) {
      return `West coast hip-hop got me like "${lyricSample}" 🔥👑`;
    } else if (genreLower.includes('hip-hop') && genreLower.includes('g-funk')) {
      return `Hip-hop meets g-funk got me like "${lyricSample}" 🌴🎤🔥`;
    } else if (genreLower.includes('trap')) {
      if (instruments.some(inst => inst.toLowerCase().includes('808'))) {
        return `Trap with 808s got me like "${lyricSample}" - absolutely destroying everything 💥`;
      }
      return `Trap got me like "${lyricSample}" - absolutely fire 🔥`;
    } else if (genreLower.includes('orchestral') && genreLower.includes('trap')) {
      return `Orchestral trap fusion got me like "${lyricSample}" - absolutely mind-blowing 🎭💥`;
    } else if (genreLower.includes('electronic') && genreLower.includes('classical')) {
      return `Electronic classical fusion got me like "${lyricSample}" - absolutely mind-blowing 🧠⚡`;
    } else if (genreLower.includes('hip-hop')) {
      if (mood.includes('aggressive') || mood.includes('confrontational')) {
        return `Aggressive hip-hop got me like "${lyricSample}" - absolutely powerful ⚔️🔥`;
      }
      return `Hip-hop got me like "${lyricSample}" - absolutely unstoppable 🔥💪`;
    } else if (genreLower.includes('rock')) {
      if (instruments.some(inst => inst.toLowerCase().includes('guitar'))) {
        return `Rock with guitar got me like "${lyricSample}" - absolutely epic 🎸🔥`;
      }
      return `Rock got me like "${lyricSample}" - absolutely powerful 🔥`;
    } else if (genreLower.includes('electronic')) {
      if (instruments.some(inst => inst.toLowerCase().includes('synth'))) {
        return `Electronic with synths got me like "${lyricSample}" - absolutely futuristic ⚡🔮`;
      }
      return `Electronic got me like "${lyricSample}" - absolutely futuristic ⚡`;
    } else if (genreLower.includes('orchestral')) {
      if (instruments.some(inst => inst.toLowerCase().includes('strings'))) {
        return `Orchestral with strings got me like "${lyricSample}" - absolutely majestic 🎭🎻`;
      }
      return `Orchestral got me like "${lyricSample}" - absolutely majestic 🎭`;
    } else if (genreLower.includes('classical')) {
      if (instruments.some(inst => inst.toLowerCase().includes('piano'))) {
        return `Classical with piano got me like "${lyricSample}" - absolutely sophisticated 🎼🎹`;
      }
      return `Classical got me like "${lyricSample}" - absolutely sophisticated 🎼`;
    }
    
    // Create unique comment based on genre and lyrics
    return `This ${genre} got me absolutely feeling like "${lyricSample}" 🔥`;
  }

  private generateUniqueGenreComment(genre: string, secondaryInfluences: string[], instruments: string[], mood: string): string {
    const genreLower = genre.toLowerCase();
    
    // Create unique comment based on genre, instruments, and mood
    if (genreLower.includes('west coast') && genreLower.includes('hip-hop')) {
      if (instruments.some(inst => inst.toLowerCase().includes('808'))) {
        return `West coast hip-hop with 808s got me feeling like a king - absolutely authentic 👑💥`;
      }
      return `West coast hip-hop got me feeling like a king - absolutely authentic 👑`;
    } else if (genreLower.includes('g-funk')) {
      if (instruments.some(inst => inst.toLowerCase().includes('synth'))) {
        return `G-funk with synths got me floating on cloud nine - absolutely legendary ☁️⚡`;
      }
      return `G-funk got me floating on cloud nine - absolutely legendary ☁️`;
    } else if (genreLower.includes('trap')) {
      if (instruments.some(inst => inst.toLowerCase().includes('808'))) {
        return `Trap with 808s is absolutely destroying everything - this bass is insane 💥`;
      } else if (instruments.some(inst => inst.toLowerCase().includes('synth'))) {
        return `Trap with synths is absolutely destroying everything - so futuristic 💥⚡`;
      }
      return `Trap is absolutely destroying everything - absolutely fire 💥`;
    } else if (genreLower.includes('orchestral') && genreLower.includes('trap')) {
      if (instruments.some(inst => inst.toLowerCase().includes('strings'))) {
        return `Orchestral trap fusion with strings is absolutely mind-blowing - so epic 🎭💥🎻`;
      }
      return `Orchestral trap fusion is absolutely mind-blowing - so epic 🎭💥`;
    } else if (genreLower.includes('electronic') && genreLower.includes('classical')) {
      if (instruments.some(inst => inst.toLowerCase().includes('piano'))) {
        return `Electronic classical fusion with piano is absolutely mind-blowing - so sophisticated 🧠⚡🎹`;
      }
      return `Electronic classical fusion is absolutely mind-blowing - so sophisticated 🧠⚡`;
    } else if (genreLower.includes('hip-hop')) {
      if (mood.includes('aggressive') || mood.includes('confrontational')) {
        if (instruments.some(inst => inst.toLowerCase().includes('808'))) {
          return `Aggressive hip-hop with 808s got me ready for war - absolutely powerful ⚔️🔥💥`;
        }
        return `Aggressive hip-hop got me ready for war - absolutely powerful ⚔️🔥`;
      } else if (instruments.some(inst => inst.toLowerCase().includes('drum'))) {
        return `Hip-hop with drums got me feeling unstoppable - absolutely authentic 🎤🥁`;
      }
      return `Hip-hop got me feeling unstoppable - absolutely authentic 🎤🔥`;
    } else if (genreLower.includes('rock')) {
      if (instruments.some(inst => inst.toLowerCase().includes('guitar'))) {
        if (mood.includes('energetic')) {
          return `Energetic rock with guitar got me wanting to headbang - absolutely epic 🤘🎸`;
        }
        return `Rock with guitar got me wanting to headbang - absolutely epic 🤘🎸`;
      }
      return `Rock energy is making me want to headbang - absolutely powerful 🤘`;
    } else if (genreLower.includes('electronic')) {
      if (instruments.some(inst => inst.toLowerCase().includes('synth'))) {
        if (mood.includes('mysterious')) {
          return `Electronic with synths got me feeling so futuristic and mysterious - absolutely hypnotic ⚡🔮`;
        }
        return `Electronic with synths got me feeling so futuristic - absolutely hypnotic ⚡`;
      }
      return `Electronic vibe is so futuristic - absolutely hypnotic ⚡`;
    } else if (genreLower.includes('orchestral')) {
      if (instruments.some(inst => inst.toLowerCase().includes('strings'))) {
        if (mood.includes('epic')) {
          return `Orchestral with strings got me feeling so epic and majestic - absolutely overwhelming 🎭🎻🏛️`;
        }
        return `Orchestral with strings got me feeling so majestic - absolutely overwhelming 🎭🎻`;
      }
      return `Orchestral elements are absolutely majestic - absolutely overwhelming 🎭`;
    } else if (genreLower.includes('classical')) {
      if (instruments.some(inst => inst.toLowerCase().includes('piano'))) {
        if (mood.includes('peaceful')) {
          return `Classical with piano got me feeling so peaceful and sophisticated - absolutely beautiful 🎼🎹✨`;
        }
        return `Classical with piano got me feeling so sophisticated - absolutely beautiful 🎼🎹`;
      }
      return `Classical influence is so sophisticated - absolutely beautiful 🎼`;
    } else if (genreLower.includes('jazz')) {
      if (instruments.some(inst => inst.toLowerCase().includes('saxophone'))) {
        return `Jazz with saxophone got me feeling so smooth and sophisticated - absolutely beautiful 🎷✨`;
      }
      return `Jazz feel is so sophisticated and smooth - absolutely beautiful 🎷`;
    } else if (genreLower.includes('r&b')) {
      if (instruments.some(inst => inst.toLowerCase().includes('piano'))) {
        return `R&B with piano got me feeling so smooth - absolutely beautiful 💫🎹`;
      }
      return `R&B got me feeling so smooth - absolutely beautiful 💫`;
    } else if (genreLower.includes('pop')) {
      if (mood.includes('uplifting')) {
        return `Pop with uplifting vibes is absolutely perfect - so infectious ✨`;
      }
      return `Pop sensibility is absolutely perfect - so infectious ✨`;
    } else if (genreLower.includes('country')) {
      if (instruments.some(inst => inst.toLowerCase().includes('guitar'))) {
        return `Country with guitar twang got me feeling so authentic - absolutely life-giving 🤠🎸`;
      }
      return `Country twang got me feeling so authentic - absolutely life-giving 🤠`;
    } else if (genreLower.includes('reggae')) {
      if (instruments.some(inst => inst.toLowerCase().includes('drum'))) {
        return `Reggae rhythm with drums got me feeling so laid back - absolutely perfect 🌴🥁`;
      }
      return `Reggae rhythm got me feeling so laid back - absolutely perfect 🌴`;
    } else if (genreLower.includes('blues')) {
      if (instruments.some(inst => inst.toLowerCase().includes('guitar'))) {
        return `Blues with guitar got me feeling so soulful - absolutely speaking to my soul 🎸💙`;
      }
      return `Blues got me feeling so soulful - absolutely speaking to my soul 💙`;
    } else if (genreLower.includes('video game') || genreLower.includes('chiptune')) {
      if (instruments.some(inst => inst.toLowerCase().includes('8-bit'))) {
        return `Video game energy with 8-bit got me feeling so nostalgic and epic - absolutely legendary 🎮✨`;
      }
      return `Video game energy got me feeling so nostalgic and epic - absolutely legendary 🎮`;
    } else if (genreLower.includes('neo-classical') || genreLower.includes('neo classical')) {
      if (instruments.some(inst => inst.toLowerCase().includes('strings'))) {
        return `Neo-classical fusion with strings is absolutely mind-blowing - so sophisticated 🎼🎻`;
      }
      return `Neo-classical fusion is absolutely mind-blowing - so sophisticated 🎼`;
    } else if (genreLower.includes('cinematic')) {
      if (instruments.some(inst => inst.toLowerCase().includes('orchestra'))) {
        return `Cinematic vibes with orchestra got me feeling like a movie star - absolutely epic 🎬🎭`;
      }
      return `Cinematic vibes got me feeling like a movie star - absolutely epic 🎬`;
    }
    
    // Create unique comment based on genre and context
    if (secondaryInfluences.length > 0) {
      const firstInfluence = secondaryInfluences[0].toLowerCase();
      return `This ${genre} with ${firstInfluence} influence is absolutely fire - so unique and powerful 🔥`;
    }
    
    return `This ${genre} is absolutely fire - so unique and powerful 🔥`;
  }

  private generateDeterministicGenreTimestamp(): number {
    const duration = this.config.trackDuration;
    const { analysis } = this.config;
    const genre = analysis.primary_genre?.toLowerCase() || '';
    const secondaryInfluences = analysis.secondary_influences || [];
    const genreHash = this.hashString(genre);
    const influenceHash = this.hashString(secondaryInfluences.join(''));
    
    // Base timestamp with genre-specific adjustments
    let baseTime = duration * (0.4 + (genreHash % 35) * 0.01); // 40-75% of track
    
    if (genre.includes('hip-hop') || genre.includes('rap')) {
      baseTime = duration * (0.35 + (genreHash % 30) * 0.01); // Hip-hop genre comments often during verses
    } else if (genre.includes('pop')) {
      baseTime = duration * (0.45 + (genreHash % 25) * 0.01); // Pop genre comments often during chorus
    } else if (genre.includes('rock')) {
      baseTime = duration * (0.5 + (genreHash % 30) * 0.01); // Rock genre comments often during guitar solos or bridges
    } else if (genre.includes('electronic') || genre.includes('edm')) {
      baseTime = duration * (0.5 + (genreHash % 35) * 0.01); // Electronic genre comments often during build-ups
    } else if (genre.includes('classical') || genre.includes('orchestral')) {
      baseTime = duration * (0.55 + (genreHash % 30) * 0.01); // Classical genre comments often during dynamic changes
    }
    
    // If there are secondary influences, the genre comment might appear later
    if (secondaryInfluences.length > 0) {
      baseTime = duration * (0.5 + (influenceHash % 35) * 0.01);
    }
    
    return Math.max(duration * 0.25, Math.min(duration * 0.8, baseTime));
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
