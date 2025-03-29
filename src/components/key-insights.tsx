import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { AlertCircle, CheckCircle, Info } from "lucide-react"
import { motion } from "framer-motion"

type Insight = {
  type: "positive" | "negative" | "info"
  content: string
}

const insights: Insight[] = [
  { type: "positive", content: "Strong, catchy melody that's easy to remember" },
  { type: "negative", content: "Mix could use more clarity in the mid-range frequencies" },
  { type: "info", content: "Consider adding more variation in the drum patterns" },
  { type: "positive", content: "Excellent use of stereo space and panning" },
]

function InsightItem({ insight }: { insight: Insight }) {
  const iconMap = {
    positive: <CheckCircle className="w-5 h-5 text-green-500" />,
    negative: <AlertCircle className="w-5 h-5 text-red-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />,
  }

  return (
    <motion.div
      className="flex items-start mb-4 p-3 rounded-lg bg-gray-700 bg-opacity-50"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mr-3 mt-1">{iconMap[insight.type]}</div>
      <p className="text-gray-200">{insight.content}</p>
    </motion.div>
  )
}

export function KeyInsights() {
  return (
    <Card className="bg-gray-800 bg-opacity-50 text-gray-100 backdrop-blur-lg border-0">
      <CardHeader>
        <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
          Key Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        {insights.map((insight, index) => (
          <InsightItem key={index} insight={insight} />
        ))}
      </CardContent>
    </Card>
  )
}

