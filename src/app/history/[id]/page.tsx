"use client";

import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { AudioAnalysis } from "@/components/AudioAnalysis";
import Link from "next/link";

export default function HistoryDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const item = useQuery(api.analyses.getAnalysisById, id ? { id: id as any } : "skip");

  if (!id) return null;

  return (
    <div className="container mx-auto px-4 py-32">
      <div className="mb-6 flex items-center justify-between">
        <Link href="/history" className="px-3 py-1 rounded-md bg-slate-800 border border-white/20 text-white hover:bg-slate-700 transition-colors">← Back to History</Link>
        <Link href="/" className="relative inline-flex h-10 overflow-hidden rounded-md p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
          <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
          <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-md bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">Exit to Main</span>
        </Link>
      </div>
      {!item && (
        <div className="text-white/60">Loading analysis…</div>
      )}
      {item && (
        <AudioAnalysis
          analysis={item.analysis as any}
          audioFile={null}
          audioUrl={item.audioUrl ?? null}
          hideSaveButton
          hideQuotaDisplay
        />
      )}
    </div>
  );
}


