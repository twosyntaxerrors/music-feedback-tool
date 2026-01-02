"use client"

import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
import { type Analysis } from "@/types/analysis";
import { AnnotatedWaveformPlayer } from "./AnnotatedWaveformPlayer";
import { GlowingEffect } from "./ui/glowing-effect";
import { TiltWrapper } from "./ui/tilt-wrapper";
import { ApiQuotaDisplay } from "./api-quota-display";
import { useEffect, useRef, useState } from "react";
import { useUser, SignInButton } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// Circular Gauge Component - Apple Style
function CircularGauge({ score, label, color, size = 120 }: { score: number; label: string; color: string; size?: number }) {
  const strokeWidth = 6; // Thinner, more elegant
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  
  // Apple-style simplified colors
  const colorClasses: Record<string, string> = {
    emerald: "text-emerald-400 stroke-emerald-400",
    blue: "text-blue-400 stroke-blue-400",
    amber: "text-amber-400 stroke-amber-400",
    violet: "text-white stroke-white", // Changed from violet to white for cleaner look
  };

  const colorClass = colorClasses[color] || colorClasses.emerald;
  
  const getRating = (score: number) => {
    if (score >= 90) return "Exceptional";
    if (score >= 80) return "Strong";
    if (score >= 70) return "Good";
    if (score >= 60) return "Decent";
    return "Needs Work";
  };

  return (
    <div className="flex flex-col items-center group cursor-default">
      <div className="relative transform-gpu transition-transform duration-500 ease-out group-hover:scale-105" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90" style={{ width: size, height: size }}>
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            fill="none"
            className="stroke-white/10"
          />
          {/* Progress circle */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            className={colorClass}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.2 }} // Apple ease
          />
        </svg>
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-light tracking-tighter text-white">{score}</span>
        </div>
      </div>
      <span className="mt-3 text-sm font-medium text-white/90 capitalize tracking-wide">{label}</span>
      <span className="text-xs text-white/40 font-medium tracking-wide mt-0.5">{getRating(score)}</span>
    </div>
  );
}

// Minimalist Tag Component
function Tag({ children, variant = "default" }: { children: React.ReactNode; variant?: "genre" | "instrument" | "mood" | "influence" | "default" }) {
  // Using subtle backgrounds instead of borders/gradients
  const variants = {
    genre: "bg-blue-500/10 text-blue-300 hover:bg-blue-500/20",
    instrument: "bg-orange-500/10 text-orange-300 hover:bg-orange-500/20",
    mood: "bg-rose-500/10 text-rose-300 hover:bg-rose-500/20",
    influence: "bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20",
    default: "bg-white/5 text-white/70 hover:bg-white/10",
  };

  return (
    <span className={`cursor-default inline-flex items-center px-3 py-1 rounded-full text-[11px] font-medium transition-all duration-300 ${variants[variant]}`}>
      {children}
    </span>
  );
}

// Section Heading Component
function SectionHeading({ icon, title, subtitle }: { icon: string; title: string; subtitle?: string }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/5 ring-1 ring-white/10">
        <Icon icon={icon} className="w-4 h-4 text-white/90" />
      </div>
      <div>
        <h3 className="text-base font-semibold text-white tracking-tight">{title}</h3>
        {subtitle && <p className="text-xs text-white/40 font-medium tracking-wide">{subtitle}</p>}
      </div>
    </div>
  );
}

// Insight Item Component
function InsightItem({ type, content, index }: { type: "positive" | "negative"; content: string; index: number }) {
  const isPositive = type === "positive";
  
  return (
    <motion.div
      initial={{ opacity: 0, x: isPositive ? -10 : 10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group flex items-start gap-3 py-2"
    >
      <div className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
        isPositive ? "bg-emerald-500/10 text-emerald-400" : "bg-orange-500/10 text-orange-400"
      }`}>
        <Icon 
          icon={isPositive ? "solar:check-circle-linear" : "solar:info-circle-linear"} 
          className="w-3.5 h-3.5" 
        />
      </div>
      <p className="text-sm text-white/70 leading-relaxed font-light group-hover:text-white transition-colors">{content}</p>
    </motion.div>
  );
}

// Expandable Analysis Detail Card
function DetailCard({ icon, title, content, color, index }: { icon: string; title: string; content: string; color: string; index: number }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Truncate to first 2 sentences for initial view
  const sentences = content.split('. ');
  const isLong = sentences.length > 2;
  const truncatedContent = isLong && !isExpanded 
    ? sentences.slice(0, 2).join('. ') + '.'
    : content;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      onClick={() => setIsExpanded(!isExpanded)}
      className="group cursor-pointer p-5 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] hover:border-white/10 transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <Icon icon={icon} className="w-5 h-5 text-white/80" />
          <span className="text-sm font-medium text-white/90">{title}</span>
        </div>
        {isLong && (
          <div className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
            <Icon icon="solar:alt-arrow-down-linear" className="w-4 h-4 text-white/30 group-hover:text-white/70" />
          </div>
        )}
      </div>
      <motion.div
        initial={false}
        animate={{ height: "auto" }}
      >
        <p className="text-sm text-white/60 leading-relaxed font-light">
          {truncatedContent}
        </p>
        {!isExpanded && isLong && (
          <p className="text-[10px] text-white/30 mt-3 font-medium uppercase tracking-widest group-hover:text-white/50 transition-colors">Read more</p>
        )}
      </motion.div>
    </motion.div>
  );
}

function TrackOverview({ analysis, isGuest }: { analysis: Analysis; isGuest?: boolean }) {
  const instrumentIcons: Record<string, string> = {
    "vocals": "solar:microphone-3-linear",
    "guitar": "solar:guitar-linear",
    "drums": "solar:music-note-linear", // Iconify doesn't have a specific drum kit linear in solar set often, using generic music note or similar. Let's try 'solar:music-note-2-linear'
    "bass": "solar:speaker-linear",
    "synth": "solar:keyboard-linear",
    "piano": "solar:keyboard-linear",
  };

  const getInstrumentIcon = (instrument: string) => {
    const lowerInstrument = instrument.toLowerCase();
    for (const [key, icon] of Object.entries(instrumentIcons)) {
      if (lowerInstrument.includes(key)) return icon;
    }
    return "solar:headphones-round-linear";
  };

  return (
    <TiltWrapper className="h-full rounded-2xl">
      <div className="h-full rounded-2xl p-6 bg-[#0A0A0A] border border-white/[0.08] relative overflow-hidden group">
        
        <SectionHeading 
          icon="solar:disk-linear"
          title="Track DNA"
          subtitle="Genre, instruments & vibe"
        />

        <div className="space-y-6 relative">
          {/* Genre & Type */}
          <div>
            <label className="text-[10px] uppercase tracking-widest text-white/30 mb-2.5 block font-medium">Genre</label>
            <div className="flex flex-wrap gap-2">
              <Tag variant="genre">{analysis.primary_genre || 'Unknown'}</Tag>
              {analysis.track_type && <Tag variant="genre">{analysis.track_type}</Tag>}
            </div>
          </div>
          
          {/* Influences */}
          {analysis.secondary_influences && analysis.secondary_influences.length > 0 && (
            <div>
              <label className="text-[10px] uppercase tracking-widest text-white/30 mb-2.5 block font-medium">Influences</label>
              <div className="flex flex-wrap gap-2">
                {analysis.secondary_influences.slice(0, 4).map((influence, i) => (
                  <Tag key={i} variant="influence">{influence}</Tag>
                ))}
              </div>
            </div>
          )}

          {/* Key Instruments */}
          {analysis.key_instruments && analysis.key_instruments.length > 0 && (
            <div>
              <label className="text-[10px] uppercase tracking-widest text-white/30 mb-2.5 block font-medium">Instruments</label>
              <div className="flex flex-wrap gap-2">
                {analysis.key_instruments.slice(0, 5).map((instrument, i) => (
                  <span 
                    key={i}
                    className="cursor-default inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium bg-orange-500/10 text-orange-300 transition-all duration-300 hover:bg-orange-500/20"
                  >
                    <Icon icon={getInstrumentIcon(instrument)} className="w-3.5 h-3.5" />
                    {instrument}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Mood */}
          {analysis.mood_tags && analysis.mood_tags.length > 0 && (
            <div>
              <label className="text-[10px] uppercase tracking-widest text-white/30 mb-2.5 block font-medium">Mood</label>
              <div className="flex flex-wrap gap-2">
                {analysis.mood_tags.slice(0, 4).map((tag, i) => (
                  <Tag key={i} variant="mood">{tag}</Tag>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </TiltWrapper>
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
  const metrics = analysis.scores ? [
    { name: "melody", score: analysis.scores.melody || 0, color: "emerald" },
    { name: "harmony", score: analysis.scores.harmony || 0, color: "blue" },
    { name: "rhythm", score: analysis.scores.rhythm || 0, color: "amber" },
    { name: "production", score: analysis.scores.production || 0, color: "violet" },
  ] : [];

  const overallScore = metrics.length > 0 
    ? Math.round(metrics.reduce((acc, m) => acc + m.score, 0) / metrics.length)
    : 0;

  return (
    <TiltWrapper className="h-full rounded-2xl">
      <div className="h-full rounded-2xl p-6 bg-[#0A0A0A] border border-white/[0.08] relative overflow-hidden group">
        
        <SectionHeading 
          icon="solar:speedometer-linear"
          title="Performance"
          subtitle="Scored out of 100"
        />

        <div className={isGuest ? 'relative' : ''}>
          <div className={isGuest ? 'filter blur-2xl brightness-50 select-none pointer-events-none' : ''}>
            {/* Overall Score - Large Center Gauge */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <CircularGauge score={overallScore} label="overall" color="violet" size={140} />
              </div>
            </div>

            {/* Individual Metrics Grid */}
            <div className="grid grid-cols-4 gap-2">
              {metrics.map((metric, i) => (
                <CircularGauge 
                  key={metric.name} 
                  score={metric.score} 
                  label={metric.name} 
                  color={metric.color}
                  size={70}
                />
              ))}
            </div>
          </div>
          {isGuest && (
            <LockedOverlay cta="Sign in to unlock scores" />
          )}
        </div>
      </div>
    </TiltWrapper>
  );
}

function KeyInsights({ analysis, isGuest }: { analysis: Analysis; isGuest?: boolean }) {
  const strengths = analysis.strengths || [];
  const improvements = analysis.improvements || [];

  // Show first item of each for guests
  const visibleStrengths = isGuest ? strengths.slice(0, 1) : strengths;
  const visibleImprovements = isGuest ? improvements.slice(0, 1) : improvements;

  return (
    <TiltWrapper className="md:col-span-2 rounded-2xl">
      <div className="h-full rounded-2xl p-6 bg-[#0A0A0A] border border-white/[0.08] relative overflow-hidden group">
        
        <SectionHeading 
          icon="solar:bolt-linear"
          title="Quick Insights"
          subtitle="What's working & what needs work"
        />

        <div className={isGuest ? 'relative' : ''}>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Strengths Column */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-[11px] uppercase tracking-widest text-emerald-400 font-medium">Strengths</span>
              </div>
              <div className="space-y-1">
                {visibleStrengths.map((strength, i) => (
                  <InsightItem key={i} type="positive" content={strength} index={i} />
                ))}
                {isGuest && strengths.length > 1 && (
                  <div className="p-3 rounded-xl border border-white/10 bg-white/5 text-center mt-2">
                    <span className="text-xs text-white/40">+{strengths.length - 1} more strengths</span>
                  </div>
                )}
              </div>
            </div>

            {/* Improvements Column */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span className="text-[11px] uppercase tracking-widest text-amber-400 font-medium">To Improve</span>
              </div>
          <div className="space-y-1">
                {visibleImprovements.map((improvement, i) => (
                  <InsightItem key={i} type="negative" content={improvement} index={i} />
                ))}
                {isGuest && improvements.length > 1 && (
                  <div className="p-3 rounded-xl border border-white/10 bg-white/5 text-center mt-2">
                    <span className="text-xs text-white/40">+{improvements.length - 1} more suggestions</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {isGuest && (
            <LockedOverlay cta="Sign in for all insights" />
          )}
        </div>
      </div>
    </TiltWrapper>
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
      icon: "solar:music-notes-linear",
      color: "emerald"
    },
    {
      title: "Production",
      content: analysis.analysis.production || '',
      icon: "solar:soundwave-linear",
      color: "blue"
    },
    {
      title: "Instruments",
      content: analysis.analysis.instrument_interplay || '',
      icon: "solar:guitar-linear",
      color: "pink"
    },
    {
      title: isVocalTrack ? "Vocals & Lyrics" : "Musical Journey",
      content: narrativeContent || '',
      icon: isVocalTrack ? "solar:microphone-3-linear" : "solar:stars-minimalistic-linear",
      color: "violet"
    }
  ].filter(section => section.content);

  if (sections.length === 0) return null;

  // For guests, only show composition
  const visibleSections = isGuest ? sections.filter(s => s.title === "Composition") : sections;
  const hiddenCount = sections.length - visibleSections.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="rounded-2xl p-6 bg-[#0A0A0A] border border-white/[0.08] md:col-span-2 relative overflow-hidden group"
    >
      <SectionHeading 
        icon="solar:layers-linear"
        title="Deep Dive"
        subtitle="Detailed breakdown"
      />

      <div className={isGuest && hiddenCount > 0 ? 'relative' : ''}>
        <div className="grid md:grid-cols-2 gap-4">
          {visibleSections.map((section, index) => (
            <DetailCard 
              key={section.title}
              icon={section.icon}
              title={section.title}
              content={section.content}
              color={section.color}
              index={index}
            />
          ))}
          {isGuest && hiddenCount > 0 && (
            <div className="md:col-span-2 p-6 rounded-2xl border border-white/10 bg-white/5 text-center">
              <Icon icon="solar:lock-keyhole-linear" className="w-6 h-6 text-white/30 mx-auto mb-2" />
              <span className="text-sm text-white/40">+{hiddenCount} more detailed sections</span>
          </div>
          )}
        </div>

        {isGuest && hiddenCount > 0 && (
          <LockedOverlay cta="Sign in for full analysis" />
        )}
      </div>
    </motion.div>
  );
}

// ... rest of the file (AudioAnalysisProps and AudioAnalysis export) remains the same as previous step, but I need to include it for the write tool to be correct.
// Re-including AudioAnalysis main component for completeness
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
      <div className="glass-card rounded-2xl p-8 text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 mx-auto mb-4"
        >
          <Icon icon="solar:disk-linear" className="w-12 h-12 text-white/20" />
        </motion.div>
        <p className="text-white/60">Analyzing your track...</p>
          </div>
    );
  }

  if (analysis.error) {
    const errorType = (analysis as any).errorType || "UNKNOWN_ERROR";
    const isRateLimitError = errorType === "RATE_LIMIT_EXCEEDED" || errorType === "QUOTA_EXCEEDED";

    return (
      <div className="glass-card rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-display font-bold text-white">
            {isRateLimitError ? "Rate Limited" : "Analysis Failed"}
            </h2>
            {onReset && (
              <button
                onClick={onReset}
              className="px-4 py-2 text-sm bg-white/5 border border-white/20 hover:border-white/40 text-white rounded-xl transition-all duration-200 hover:bg-white/10"
              >
                Try Again
              </button>
            )}
          </div>

        <div className={`p-4 rounded-xl border ${isRateLimitError ? 'bg-amber-500/10 border-amber-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
          <div className="flex items-start gap-3">
            <Icon icon="solar:danger-circle-linear" className={`w-5 h-5 flex-shrink-0 ${isRateLimitError ? 'text-amber-400' : 'text-red-400'}`} />
            <div>
              <p className="text-white/80">{analysis.error}</p>
              {isRateLimitError && (
                <p className="text-sm text-amber-400/80 mt-2">
                  Please wait a moment before trying again.
                </p>
              )}
                </div>
              </div>
            </div>

          {analysis.details && process.env.NODE_ENV !== "production" && (
            <details className="mt-4">
            <summary className="cursor-pointer text-sm text-white/40 hover:text-white/60">
                Technical Details
              </summary>
            <pre className="mt-2 p-4 bg-black/40 border border-white/10 rounded-xl text-xs text-white/50 overflow-auto font-mono">
                {analysis.details}
              </pre>
            </details>
          )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-semibold text-white tracking-tight">
            Analysis
          </h2>
          {/* Tier badge - Minimalist */}
          {user ? (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium bg-white/10 text-white/80 border border-white/10"
            >
              <Icon icon="solar:stars-minimalistic-linear" className="w-3.5 h-3.5" />
              Pro
            </motion.span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium bg-white/5 border border-white/10 text-white/50">
              <Icon icon="solar:lock-keyhole-linear" className="w-3.5 h-3.5" />
              Preview
            </span>
          )}
        </div>
        
          {onReset && (
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
              onClick={onReset}
            className="group relative px-4 py-2 rounded-lg bg-white text-black font-medium text-sm transition-all duration-300 hover:bg-white/90"
            >
            <span className="relative z-10 flex items-center gap-2">
              <Icon icon="solar:refresh-linear" className="w-4 h-4" />
                New Analysis
              </span>
          </motion.button>
          )}
      </motion.div>

      {/* Waveform Player Card */}
      {audioFile && audioUrl && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-6 bg-[#0A0A0A] border border-white/[0.08]"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/[0.03] flex items-center justify-center border border-white/[0.05]">
                <Icon icon="solar:music-note-2-linear" className="w-6 h-6 text-white/50" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-white truncate max-w-[200px] sm:max-w-none">{audioFile.name}</h3>
                <p className="text-xs text-white/40 mt-0.5">{(audioFile.size / (1024 * 1024)).toFixed(2)} MB</p>
              </div>
            </div>
          </div>
          <AnnotatedWaveformPlayer audioUrl={audioUrl} analysis={analysis} showCommentsToggle={false} />
        </motion.div>
      )}

      {/* Main Analysis Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TrackOverview analysis={analysis} isGuest={!user} />
        <PerformanceMetrics analysis={analysis} isGuest={!user} />
        <KeyInsights analysis={analysis} isGuest={!user} />
        <DetailedAnalysis analysis={analysis} isGuest={!user} />
      </div>

      {/* API Quota Display */}
      {!hideQuotaDisplay && user && (
        <div className="pt-4">
          <ApiQuotaDisplay />
        </div>
      )}

      {/* Bottom CTA */}
      {onReset && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex justify-center pt-6"
        >
          <button 
            onClick={onReset}
            className="group flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10 text-white/70 hover:text-white hover:border-white/30 transition-all duration-300"
          >
            <Icon icon="solar:disk-linear" className="w-4 h-4 group-hover:animate-spin" />
            Analyze Another Track
          </button>
        </motion.div>
      )}
    </div>
  );
}
