"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { type Analysis } from "@/types/analysis";

type SavedAnalysis = {
  _id: string;
  analysis: Analysis;
  audioFileName?: string;
  audioUrl?: string;
  createdAt: number;
};

export function AnalysisHistory({ onSelect }: { onSelect?: (item: SavedAnalysis) => void }) {
  const { user } = useUser();
  const userId = user?.id;
  const items = useQuery(api.analyses.getAnalyses, userId ? { userId } : "skip");

  if (!userId) return null;

  return (
    <Card className="bg-black/40 backdrop-blur-lg border border-white/20 hover:border-white/40 transition-all duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold text-white">History</CardTitle>
      </CardHeader>
      <CardContent>
        {!items && (
          <div className="text-white/60 text-sm">Loading...</div>
        )}
        {items && items.length === 0 && (
          <div className="text-white/60 text-sm">No saved analyses yet.</div>
        )}
        {items && items.length > 0 && (
          <ul className="space-y-3">
            {items.map((item) => {
              const overallScore = item.analysis?.scores ? 
                Math.round(((item.analysis.scores.melody||0)+(item.analysis.scores.harmony||0)+(item.analysis.scores.rhythm||0)+(item.analysis.scores.production||0))/4) : 0;
              const genre = item.analysis?.primary_genre || 'Unknown';
              const trackType = item.analysis?.track_type || '';
              
              return (
                <li key={item._id} className="flex items-center justify-between text-sm text-white/80 p-3 rounded-lg bg-black/20 border border-white/10 hover:bg-black/30 transition-colors">
                  <div className="flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{item.audioFileName || "Untitled"}</span>
                      <span className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                        {overallScore}%
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-white/60">
                      <span>{genre}</span>
                      {trackType && <span>•</span>}
                      {trackType && <span>{trackType}</span>}
                      <span>•</span>
                      <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                    </div>
                    {item.analysis?.strengths && item.analysis.strengths.length > 0 && (
                      <div className="mt-2 text-xs text-green-300">
                        <span className="font-medium">Strengths:</span> {item.analysis.strengths[0]}
                        {item.analysis.strengths.length > 1 && ` (+${item.analysis.strengths.length - 1} more)`}
                      </div>
                    )}
                  </div>
                  {onSelect && (
                    <button
                      onClick={() => onSelect(item as unknown as SavedAnalysis)}
                      className="relative inline-flex h-10 overflow-hidden rounded-md p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
                    >
                      <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#FFFFFF_0%,#000000_50%,#FFFFFF_100%)]" />
                      <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-md bg-black px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
                        View Full Analysis
                      </span>
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}


