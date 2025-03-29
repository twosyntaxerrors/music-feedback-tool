import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"

type Metric = {
  name: string
  score: number
  rating: string
  color: string
}

const metrics: Metric[] = [
  { name: "Melody", score: 85, rating: "Excellent", color: "bg-green-500" },
  { name: "Harmony", score: 75, rating: "Good", color: "bg-blue-500" },
  { name: "Rhythm", score: 90, rating: "Masterpiece", color: "bg-purple-500" },
  { name: "Production", score: 80, rating: "Very Good", color: "bg-yellow-500" },
]

function MetricGauge({ metric }: { metric: Metric }) {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <div>
          <div className="text-lg font-semibold">{metric.name}</div>
          <div className="text-sm text-gray-400">{metric.rating}</div>
        </div>
        <div className="text-2xl font-bold">{metric.score}%</div>
      </div>
      <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          className={`h-full ${metric.color}`}
          initial={{ width: 0 }}
          animate={{ width: `${metric.score}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
    </div>
  )
}

export function PerformanceMetrics() {
  return (
    <Card className="bg-gray-800 bg-opacity-50 text-gray-100 backdrop-blur-lg border-0">
      <CardHeader>
        <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
          Performance Metrics
        </CardTitle>
      </CardHeader>
      <CardContent>
        {metrics.map((metric) => (
          <MetricGauge key={metric.name} metric={metric} />
        ))}
      </CardContent>
    </Card>
  )
}

