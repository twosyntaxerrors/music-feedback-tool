"use client";

import { AnalysisHistory } from "@/components/AnalysisHistory";
import { useRouter } from "next/navigation";

export default function HistoryPage() {
  const router = useRouter();
  return (
    <div className="container mx-auto px-4 py-32">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Your Analysis History</h1>
          <p className="text-white/60">Browse and reopen any previously saved analysis.</p>
        </div>
        <button 
          onClick={() => router.push("/")}
          className="relative inline-flex h-10 overflow-hidden rounded-md p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
        >
          <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
          <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-md bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
            Exit to Main
          </span>
        </button>
      </div>
      <AnalysisHistory onSelect={(item) => router.push(`/history/${item._id}`)} />
    </div>
  );
}



