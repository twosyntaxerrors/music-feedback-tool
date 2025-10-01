export interface AnalysisVisualization {
  type?: string;
  categories?: string[];
  values?: number[];
  min?: number;
  max?: number;
  thresholds?: Array<{ value: number; label: string }>;
}

export interface AnalysisDetails {
  composition?: string;
  production?: string;
  lyrics?: string;
  arrangement?: string;
  instrument_interplay?: string;
  musical_journey?: string;
}

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
  analysis?: AnalysisDetails | string;
  visualization?: AnalysisVisualization;
  error?: string;
  details?: string;
}
