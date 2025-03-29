import { TrackOverview } from "@/components/track-overview"
import { PerformanceMetrics } from "@/components/performance-metrics"
import { KeyInsights } from "@/components/key-insights"

export function AnalysisDashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <TrackOverview />
      <PerformanceMetrics />
      <KeyInsights />
    </div>
  )
}

