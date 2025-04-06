"use client"

import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { AlertCircle, CheckCircle, Info, Music, Waves } from "lucide-react";
import { motion } from "framer-motion";
import { type Analysis } from "@/types/analysis";
import { WaveformPlayer } from "./WaveformPlayer";

function TrackOverview({ analysis }: { analysis: Analysis }) {
  return (
    <Card className="bg-black/40 backdrop-blur-lg border border-[#00fff2]/20 hover:border-[#00fff2]/40 transition-all duration-300 shadow-[0_0_30px_rgba(0,255,242,0.1)]">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#00fff2] to-[#00c8ff]">
          Track Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-2 text-[#00fff2]">Genre & Type</h3>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="bg-black/40 border border-blue-400/40 text-blue-400 hover:bg-black/60 hover:border-blue-400">
                {analysis.primary_genre || 'Unknown Genre'}
              </Badge>
              {analysis.track_type && (
                <Badge variant="secondary" className="bg-black/40 border border-purple-400/40 text-purple-400 hover:bg-black/60 hover:border-purple-400">
                  {analysis.track_type}
                </Badge>
              )}
            </div>
          </div>
          
          {analysis.secondary_influences && analysis.secondary_influences.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-2 text-[#00fff2]">Musical Influences</h3>
              <div className="flex flex-wrap gap-2">
                {analysis.secondary_influences.map((influence, i) => (
                  <Badge
                    key={i}
                    variant="secondary"
                    className="bg-black/40 border border-green-400/40 text-green-400 hover:bg-black/60 hover:border-green-400"
                  >
                    {influence}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {analysis.key_instruments && analysis.key_instruments.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-2 text-[#00fff2]">Key Instruments</h3>
              <div className="flex flex-wrap gap-2">
                {analysis.key_instruments.map((instrument, i) => (
                  <Badge
                    key={i}
                    variant="secondary"
                    className="bg-black/40 border border-yellow-400/40 text-yellow-400 hover:bg-black/60 hover:border-yellow-400"
                  >
                    {instrument}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {analysis.mood_tags && analysis.mood_tags.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-2 text-[#00fff2]">Mood</h3>
              <div className="flex flex-wrap gap-2">
                {analysis.mood_tags.map((tag, i) => (
                  <Badge
                    key={i}
                    variant="secondary"
                    className="bg-black/40 border border-pink-400/40 text-pink-400 hover:bg-black/60 hover:border-pink-400"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function MetricGauge({ name, score, rating, color }: { name: string; score: number; rating: string; color: string }) {
  return (
    <div className="mb-4 last:mb-0">
      <div className="flex justify-between items-center mb-2">
        <div>
          <div className="text-sm font-medium text-[#00fff2]">{name}</div>
          <div className="text-xs text-[#00fff2]/60">{rating}</div>
        </div>
        <div className="text-lg font-bold text-[#00fff2]">{score}%</div>
      </div>
      <div className="h-2 bg-black/40 rounded-full overflow-hidden">
        <motion.div
          className={`h-full ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

function PerformanceMetrics({ analysis }: { analysis: Analysis }) {
  const getMetricData = (score: number | undefined, metricName: string) => {
    const numScore = score || 0;
    const colors = {
      melody: 'bg-green-400', // Bright green
      harmony: 'bg-blue-400', // Bright blue
      rhythm: 'bg-pink-400', // Bright pink
      production: 'bg-purple-400', // Bright purple
    };
    
    const rating = 
      numScore >= 95 ? 'Masterpiece' :
      numScore >= 90 ? 'Outstanding' :
      numScore >= 85 ? 'Excellent' :
      numScore >= 80 ? 'Very Good' :
      numScore >= 75 ? 'Good' :
      numScore >= 70 ? 'Solid' :
      numScore >= 65 ? 'Fair' :
      'Needs Work';

    return { 
      rating, 
      color: colors[metricName as keyof typeof colors] || 'bg-[#00fff2]'
    };
  };

  const metrics = analysis.scores ? Object.entries(analysis.scores).map(([name, score]) => {
    const { rating, color } = getMetricData(score, name);
    return {
      name,
      score: score || 0,
      rating,
      color
    };
  }) : [];

  return (
    <Card className="bg-black/40 backdrop-blur-lg border border-[#00fff2]/20 hover:border-[#00fff2]/40 transition-all duration-300 shadow-[0_0_30px_rgba(0,255,242,0.1)]">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#00fff2] to-[#00c8ff]">
          Performance Metrics
        </CardTitle>
      </CardHeader>
      <CardContent>
        {metrics.map((metric) => (
          <MetricGauge key={metric.name} {...metric} />
        ))}
      </CardContent>
    </Card>
  );
}

function KeyInsights({ analysis }: { analysis: Analysis }) {
  const insights = [];

  // Add strengths as positive insights
  if (analysis.strengths) {
    insights.push(...analysis.strengths.map(strength => ({
      type: 'positive' as const,
      content: strength
    })));
  }

  // Add improvements as negative insights
  if (analysis.improvements) {
    insights.push(...analysis.improvements.map(improvement => ({
      type: 'negative' as const,
      content: improvement
    })));
  }

  const iconMap = {
    positive: <CheckCircle className="w-4 h-4 text-green-500" />,
    negative: <AlertCircle className="w-4 h-4 text-red-500" />,
    info: <Info className="w-4 h-4 text-[#00fff2]" />,
  };

  return (
    <Card className="bg-black/40 backdrop-blur-lg border border-[#00fff2]/20 hover:border-[#00fff2]/40 transition-all duration-300 shadow-[0_0_30px_rgba(0,255,242,0.1)] md:col-span-2">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#00fff2] to-[#00c8ff]">
          Key Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {insights.map((insight, index) => (
          <motion.div
            key={index}
            className="flex items-start p-2 rounded-lg bg-black/40 border border-[#00fff2]/20"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
          >
            <div className="mr-3 mt-1">{iconMap[insight.type as keyof typeof iconMap]}</div>
            <p className="text-sm text-[#00fff2]/90">{insight.content}</p>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
}

function DetailedAnalysis({ analysis }: { analysis: Analysis }) {
  if (typeof analysis.analysis === 'string' || !analysis.analysis) return null;

  const sections = [
    {
      title: "Composition",
      content: analysis.analysis.composition || '',
      icon: <Music className="w-5 h-5 text-green-400" />
    },
    {
      title: "Production & Mix",
      content: analysis.analysis.production || '',
      icon: <Waves className="w-5 h-5 text-blue-400" />
    },
    {
      title: "Instrument Interplay",
      content: analysis.analysis.instrument_interplay || '',
      icon: <Music className="w-5 h-5 text-pink-400" />
    },
    {
      title: analysis.track_type === "Vocal" ? "Lyrics & Delivery" : "Musical Journey",
      content: analysis.analysis.lyrics || '',
      icon: <Info className="w-5 h-5 text-purple-400" />
    }
  ].filter(section => section.content);

  return (
    <Card className="bg-black/40 backdrop-blur-lg border border-[#00fff2]/20 hover:border-[#00fff2]/40 transition-all duration-300 shadow-[0_0_30px_rgba(0,255,242,0.1)] md:col-span-2">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#00fff2] to-[#00c8ff]">
          Detailed Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {sections.map((section, index) => (
          <motion.div
            key={section.title}
            className="p-4 rounded-lg bg-black/40 border border-[#00fff2]/20"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.1 }}
          >
            <div className="flex items-center gap-2 mb-2">
              {section.icon}
              <h3 className="text-sm font-medium text-[#00fff2]">{section.title}</h3>
            </div>
            <p className="text-sm text-[#00fff2]/80 leading-relaxed">{section.content}</p>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
}

interface AudioAnalysisProps {
  analysis: Analysis;
  audioFile: File | null;
  audioUrl: string | null;
  onReset?: () => void;
}

export function AudioAnalysis({ analysis, audioFile, audioUrl, onReset }: AudioAnalysisProps) {
  if (analysis.error) {
    return (
      <Card className="bg-black/40 backdrop-blur-lg border border-[#00fff2]/20 hover:border-[#00fff2]/40 transition-all duration-300 shadow-[0_0_30px_rgba(0,255,242,0.1)]">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-[#00fff2]">Analysis Error</h2>
            {onReset && (
              <button 
                onClick={onReset}
                className="px-3 py-1 text-sm bg-black/40 border border-[#00fff2]/40 hover:border-[#00fff2] text-[#00fff2] rounded-md transition-colors"
              >
                Try Again
              </button>
            )}
          </div>
          <p className="text-[#00fff2]/80">{analysis.error}</p>
          {analysis.details && (
            <pre className="mt-4 p-4 bg-black/40 border border-[#00fff2]/20 rounded text-sm text-[#00fff2]/60 overflow-auto">
              {analysis.details}
            </pre>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#00fff2] to-[#00c8ff]">
          Analysis Results
        </h2>
        {onReset && (
          <button 
            onClick={onReset}
            className="px-4 py-2 bg-black/40 border border-[#00fff2]/40 hover:border-[#00fff2] text-[#00fff2] rounded-md transition-colors"
          >
            New Analysis
          </button>
        )}
      </div>

      {audioFile && audioUrl && (
        <Card className="bg-black/40 backdrop-blur-lg border border-[#00fff2]/20 hover:border-[#00fff2]/40 transition-all duration-300 shadow-[0_0_30px_rgba(0,255,242,0.1)]">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#00fff2] to-[#00c8ff]">
              Analyzed Track
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm text-[#00fff2]/60">
                <span>{audioFile.name}</span>
                <span>{(audioFile.size / (1024 * 1024)).toFixed(2)} MB</span>
              </div>
              <WaveformPlayer audioUrl={audioUrl} />
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TrackOverview analysis={analysis} />
        <PerformanceMetrics analysis={analysis} />
        <KeyInsights analysis={analysis} />
        <DetailedAnalysis analysis={analysis} />
      </div>
    </div>
  );
} 