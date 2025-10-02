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
          className="px-3 py-1 rounded-md bg-slate-800 border border-white/20 text-white hover:bg-slate-700 transition-colors"
        >
          Exit to Main
        </button>
      </div>
      <AnalysisHistory onSelect={(item) => router.push(`/history/${item._id}`)} />
    </div>
  );
}



