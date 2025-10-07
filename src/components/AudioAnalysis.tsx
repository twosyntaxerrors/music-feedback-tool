"use client"

import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { AlertCircle, CheckCircle, Info, Music, Waves, Sparkles, Lock } from "lucide-react";
import { motion } from "framer-motion";
import { type Analysis } from "@/types/analysis";
import { AnnotatedWaveformPlayer } from "./AnnotatedWaveformPlayer";
import { GlowingEffect } from "./ui/glowing-effect";
import { ApiQuotaDisplay } from "./api-quota-display";
import { useEffect, useRef } from "react";
import { useUser, SignInButton } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

function TrackOverview({ analysis, isGuest }: { analysis: Analysis; isGuest?: boolean }) {
  return (
    <Card className="bg-black/40 backdrop-blur-lg border border-white/20 hover:border-white/40 transition-all duration-300 relative transform-gpu will-change-transform hover:-translate-y-0.5 hover:bg-white/5">
      <GlowingEffect
        blur={0}
        borderWidth={1}
        spread={80}
        glow={true}
        disabled={true}
        proximity={64}
        inactiveZone={0.01}
      />
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold text-white">
          Track Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-2 text-white">Genre & Type</h3>
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
              <h3 className="text-sm font-medium mb-2 text-white">Musical Influences</h3>
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
              <h3 className="text-sm font-medium mb-2 text-white">Key Instruments</h3>
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
              <h3 className="text-sm font-medium mb-2 text-white">Mood</h3>
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
          <div className="text-sm font-medium text-white">{name}</div>
          <div className="text-xs text-white/60">{rating}</div>
        </div>
        <div className="text-lg font-bold text-white">{score}%</div>
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

function LockedOverlay({ cta }: { cta: string }) {
  return (
    <SignInButton mode="modal">
      <div className="absolute inset-0 z-10 cursor-pointer group">
        {/* Centered CTA box with subtle glow; whole area is clickable */}
        <div className="absolute inset-0" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="px-5 py-3 rounded-xl bg-black/60 text-white text-lg font-bold ring-1 ring-white/20 shadow-[0_0_20px_rgba(255,255,255,0.12)] transition-transform duration-200 group-hover:scale-105 group-hover:brightness-110">
            {cta}
          </div>
        </div>
      </div>
    </SignInButton>
  );
}

function PerformanceMetrics({ analysis, isGuest }: { analysis: Analysis; isGuest?: boolean }) {
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
      color: colors[metricName as keyof typeof colors] || 'bg-white'
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
    <Card className="bg-black/40 backdrop-blur-lg border border-white/20 hover:border-white/40 transition-all duration-300 relative transform-gpu will-change-transform hover:-translate-y-0.5 hover:bg-white/5">
      <GlowingEffect
        blur={0}
        borderWidth={1}
        spread={80}
        glow={true}
        disabled={true}
        proximity={64}
        inactiveZone={0.01}
      />
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold text-white">
          Performance Metrics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className={isGuest ? 'relative' : ''}>
          <div className={isGuest ? 'filter blur-2xl brightness-50 select-none pointer-events-none' : ''}>
            {metrics.map((metric) => (
              <MetricGauge key={metric.name} {...metric} />
            ))}
          </div>
          {isGuest && (
            <LockedOverlay cta="Sign in to unlock performance scores" />
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function KeyInsights({ analysis, isGuest }: { analysis: Analysis; isGuest?: boolean }) {
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
    info: <Info className="w-4 h-4 text-white" />,
  };

  // Determine which insights remain fully visible for guests: one positive and one negative
  const positiveIndex = insights.findIndex((i) => i.type === 'positive');
  const negativeIndex = insights.findIndex((i) => i.type === 'negative');
  const visibleIndices = new Set<number>();
  if (positiveIndex >= 0) visibleIndices.add(positiveIndex);
  if (negativeIndex >= 0) visibleIndices.add(negativeIndex);

  return (
    <Card className="bg-black/40 backdrop-blur-lg border border-white/20 hover:border-white/40 transition-all duration-300 relative md:col-span-2 transform-gpu will-change-transform hover:-translate-y-0.5 hover:bg-white/5">
      <GlowingEffect
        blur={0}
        borderWidth={1}
        spread={80}
        glow={true}
        disabled={true}
        proximity={64}
        inactiveZone={0.01}
      />
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold text-white">
          Key Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className={isGuest ? 'relative group' : ''}>
          <div className="space-y-2">
            {insights.map((insight, index) => {
              const keepVisible = !isGuest || visibleIndices.has(index);
              return (
                <motion.div
                  key={index}
                  className="flex items-start p-2 rounded-lg bg-black/40 border border-white/20"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                >
                  <div className="mr-3 mt-1">{iconMap[insight.type as keyof typeof iconMap]}</div>
                  <p className={keepVisible ? 'text-sm text-white/90' : 'text-sm text-white/90 filter blur-sm select-none'}>
                    {insight.content}
                  </p>
                </motion.div>
              );
            })}
          </div>
          {isGuest && (
            <LockedOverlay cta="Sign in to unlock all insights" />
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function DetailedAnalysis({ analysis, isGuest }: { analysis: Analysis; isGuest?: boolean }) {
  if (typeof analysis.analysis === 'string' || !analysis.analysis) return null;

  const isVocalTrack = analysis.track_type === "Vocal";
  const narrativeContent = isVocalTrack ? analysis.analysis.lyrics : analysis.analysis.musical_journey;

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
      title: isVocalTrack ? "Lyrics & Delivery" : "Musical Journey",
      content: narrativeContent || '',
      icon: <Info className="w-5 h-5 text-purple-400" />
    }
  ].filter(section => section.content);

  return (
    <Card className="bg-black/40 backdrop-blur-lg border border-white/20 hover:border-white/40 transition-all duration-300 relative md:col-span-2 transform-gpu will-change-transform hover:-translate-y-0.5 hover:bg-white/5">
      <GlowingEffect
        blur={0}
        borderWidth={1}
        spread={80}
        glow={true}
        disabled={true}
        proximity={64}
        inactiveZone={0.01}
      />
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold text-white">
          Detailed Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className={isGuest ? 'relative group' : ''}>
          <div className="space-y-4">
            {sections.map((section, index) => {
              const isComposition = section.title === 'Composition';
              const lockThis = isGuest && !isComposition;
              return (
                <motion.div
                  key={section.title}
                  className="p-4 rounded-lg bg-black/40 border border-white/20"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.1 }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {section.icon}
                    <h3 className="text-sm font-medium text-white">{section.title}</h3>
                  </div>
                  <p className={lockThis ? 'text-sm text-white/80 leading-relaxed filter blur-sm select-none' : 'text-sm text-white/80 leading-relaxed'}>
                    {section.content}
                  </p>
                </motion.div>
              );
            })}
          </div>
          {isGuest && (
            <LockedOverlay cta="Sign in to unlock full analysis" />
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface AudioAnalysisProps {
  analysis: Analysis;
  audioFile: File | null;
  audioUrl: string | null;
  onReset?: () => void;
  hideSaveButton?: boolean;
  hideQuotaDisplay?: boolean;
}

export function AudioAnalysis({ analysis, audioFile, audioUrl, onReset, hideSaveButton, hideQuotaDisplay }: AudioAnalysisProps) {
  const { user } = useUser();
  const saveAnalysis = useMutation(api.analyses.saveAnalysis);
  const router = useRouter();
  const hasAutoSavedRef = useRef<boolean>(false);
  const isAutoSavingRef = useRef<boolean>(false);
  // Add logging to debug data flow
  useEffect(() => {
    console.log('🔍 AudioAnalysis - Component rendered with analysis:', analysis);
    console.log('🔍 AudioAnalysis - Analysis type:', typeof analysis);
    console.log('🔍 AudioAnalysis - Analysis keys:', analysis ? Object.keys(analysis) : 'NO ANALYSIS');
    console.log('🔍 AudioAnalysis - Has audioFile:', !!audioFile);
    console.log('🔍 AudioAnalysis - Has audioUrl:', !!audioUrl);
  }, [analysis, audioFile, audioUrl]);

  // Automatically save analysis to history when available (only on main analysis view)
  useEffect(() => {
    if (!user) return;
    if (!analysis || (analysis as any).error) return;
    if (hideSaveButton) return; // history/detail views pass this flag; skip autosave there
    if (hasAutoSavedRef.current || isAutoSavingRef.current) return;
    if (!audioFile && !audioUrl) return;

    let cancelled = false;
    let saveSucceeded = false;
    const run = async () => {
      try {
        // Guard against React StrictMode double-invocation and rapid re-renders
        isAutoSavingRef.current = true;
        hasAutoSavedRef.current = true;
        const result = await saveAnalysis({
          userId: user.id,
          audioFileName: audioFile?.name,
          audioFileSize: audioFile ? audioFile.size : undefined,
          audioUrl: audioUrl || undefined,
          analysis,
        });
        if (cancelled) return;
        hasAutoSavedRef.current = true;
        saveSucceeded = true;
        toast.success("Analysis saved to history!", {
          description: `"${audioFile?.name || 'Untitled'}" has been saved with all feedback details.`,
          duration: 4000,
          action: {
            label: "View",
            onClick: () => {
              if ((result as any)?.id) {
                router.push(`/history/${(result as any).id}`);
              } else {
                router.push("/history");
              }
            }
          }
        });
      } catch (e) {
        console.error(e);
        toast.error("Failed to save analysis", {
          description: "Please try again or check your connection.",
          duration: 4000,
        });
      } finally {
        isAutoSavingRef.current = false;
        if (!saveSucceeded) {
          // allow manual save if autosave failed
          hasAutoSavedRef.current = false;
        }
      }
    };
    run();

    return () => {
      cancelled = true;
    };
  }, [user, analysis, audioFile, audioUrl, hideSaveButton, saveAnalysis, router]);

  if (!analysis) {
    console.log('❌ AudioAnalysis - No analysis data, showing loading state');
    return (
      <Card className="bg-black/40 backdrop-blur-lg border border-white/20 hover:border-white/40 transition-all duration-300 relative">
        <CardContent className="p-6">
          <div className="text-center text-white/60">
            Loading analysis...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (analysis.error) {
    const errorType = (analysis as any).errorType || "UNKNOWN_ERROR";
    const isRateLimitError = errorType === "RATE_LIMIT_EXCEEDED" || errorType === "QUOTA_EXCEEDED";

    return (
      <Card className="bg-black/40 backdrop-blur-lg border border-white/20 hover:border-white/40 transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">
              {isRateLimitError ? "Too Many Requests" : "Analysis Failed"}
            </h2>
            {onReset && (
              <button
                onClick={onReset}
                className="px-3 py-1 text-sm bg-black/40 border border-white/40 hover:border-white text-white rounded-md transition-colors"
              >
                Try Again
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 mb-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              isRateLimitError ? 'bg-yellow-500/20' : 'bg-red-500/20'
            }`}>
              {isRateLimitError ? (
                <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              )}
            </div>
            <div>
              <p className="text-white/80">{analysis.error}</p>
              {isRateLimitError && (
                <p className="text-sm text-yellow-400 mt-1">
                  This happens when too many requests are made to the AI service.
                </p>
              )}
            </div>
          </div>

          {isRateLimitError && (
            <div className="mt-4 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
              <div className="flex items-start gap-2">
                <svg className="w-4 h-4 text-yellow-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-sm text-yellow-400 font-medium">Rate Limit Information</p>
                  <p className="text-xs text-yellow-300 mt-1">
                    {errorType === "RATE_LIMIT_EXCEEDED"
                      ? "The AI service is temporarily busy. Please wait a moment before trying again."
                      : "You've reached your daily limit for AI analysis. Please try again tomorrow."
                    }
                  </p>
                </div>
              </div>
            </div>
          )}

          {analysis.details && process.env.NODE_ENV !== "production" && (
            <details className="mt-4">
              <summary className="cursor-pointer text-sm text-white/60 hover:text-white/80">
                Technical Details
              </summary>
              <pre className="mt-2 p-4 bg-black/40 border border-white/20 rounded text-sm text-white/60 overflow-auto">
                {analysis.details}
              </pre>
            </details>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-white">
            Analysis Results
          </h2>
          {/* Analysis tier badge */}
          {user ? (
            <span
              className="inline-flex items-center gap-1.5 h-7 px-3 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-indigo-500/80 via-purple-500/80 to-emerald-500/80 ring-1 ring-white/20 shadow-[0_0_20px_rgba(99,102,241,0.25)] backdrop-blur hover:brightness-110 transition-all duration-200 select-none"
              title="Advanced analysis unlocked"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Advanced
            </span>
          ) : (
            <span
              className="inline-flex items-center gap-1.5 h-7 px-3 rounded-full text-xs font-semibold text-white/80 bg-white/5 border border-white/15 ring-1 ring-white/10 backdrop-blur-sm hover:bg-white/8 transition-colors select-none"
              title="Basic analysis — sign in to unlock advanced"
            >
              <Lock className="w-3.5 h-3.5 text-white/70" />
              Basic
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {onReset && (
            <button 
              onClick={onReset}
              className="relative inline-flex h-12 overflow-hidden rounded-md p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
            >
              <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
              <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-md bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
                New Analysis
              </span>
            </button>
          )}
        </div>
      </div>

      {audioFile && audioUrl && (
        <Card className="bg-black/40 backdrop-blur-lg border border-white/20 hover:border-white/40 transition-all duration-300 relative transform-gpu will-change-transform hover:-translate-y-0.5 hover:bg-white/5">
          <GlowingEffect
            blur={0}
            borderWidth={1}
            spread={80}
            glow={true}
            disabled={true}
            proximity={64}
            inactiveZone={0.01}
          />
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-white">
              Analyzed Track
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm text-white/60">
                <span>{audioFile.name}</span>
                <span>{(audioFile.size / (1024 * 1024)).toFixed(2)} MB</span>
              </div>
              {/* COMMENTED OUT: AI Comments toggle temporarily disabled for refinement */}
              <AnnotatedWaveformPlayer audioUrl={audioUrl} analysis={analysis} showCommentsToggle={false} />
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TrackOverview analysis={analysis} isGuest={!user} />
        <PerformanceMetrics analysis={analysis} isGuest={!user} />
      </div>

      <KeyInsights analysis={analysis} isGuest={!user} />
      <DetailedAnalysis analysis={analysis} isGuest={!user} />

      {/* Compact API Quota Display at Bottom (hide for guests) */}
      {!hideQuotaDisplay && user && (
        <div className="pt-4">
          <ApiQuotaDisplay />
        </div>
      )}

      {/* Additional New Analysis Button at Bottom */}
      {onReset && (
        <div className="flex justify-center pt-4">
          <button 
            onClick={onReset}
            className="relative inline-flex h-12 overflow-hidden rounded-md p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
          >
            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
            <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-md bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
              New Analysis
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
