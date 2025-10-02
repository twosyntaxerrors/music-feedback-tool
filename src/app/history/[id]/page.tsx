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
        <Link href="/" className="px-3 py-1 rounded-md bg-slate-800 border border-white/20 text-white hover:bg-slate-700 transition-colors">Exit to Main</Link>
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


