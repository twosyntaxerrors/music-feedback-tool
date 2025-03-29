export interface Analysis {
  track_type?: "Vocal" | "Instrumental";
  primary_genre?: string;
  secondary_influences?: string[];
  key_instruments?: string[];
  mood_tags?: string[];
  genre_indicators?: string[];
  strengths?: string[];
  improvements?: string[];
  scores?: {
    melody?: number;
    harmony?: number;
    rhythm?: number;
    production?: number;
  };
  analysis?: {
    composition?: string;
    production?: string;
    lyrics?: string;
    arrangement?: string;
    instrument_interplay?: string;
  } | string;
  error?: string;
  details?: string;
} 