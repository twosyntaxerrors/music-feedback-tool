import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, AlertCircle, Star } from 'lucide-react'

interface FeedbackDisplayProps {
  feedback: {
    strengths: string[]
    improvements: string[]
    scores: {
      melody: number
      harmony: number
      rhythm: number
      production: number
    }
    details: string
  }
}

export function FeedbackDisplay({ feedback }: FeedbackDisplayProps) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <h2 className="text-2xl font-semibold">Analysis Results</h2>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6 bg-slate-900/50 border-slate-800 backdrop-blur">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              <h3 className="text-lg font-medium">Strengths</h3>
            </div>
            <div className="space-y-2">
              {feedback.strengths.map((strength) => (
                <Badge
                  key={strength}
                  variant="secondary"
                  className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                >
                  {strength}
                </Badge>
              ))}
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-slate-900/50 border-slate-800 backdrop-blur">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-400" />
              <h3 className="text-lg font-medium">Areas for Improvement</h3>
            </div>
            <div className="space-y-2">
              {feedback.improvements.map((improvement) => (
                <Badge
                  key={improvement}
                  variant="secondary"
                  className="bg-amber-500/10 text-amber-400 border-amber-500/20"
                >
                  {improvement}
                </Badge>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6 bg-slate-900/50 border-slate-800 backdrop-blur">
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-blue-400" />
            <h3 className="text-lg font-medium">Score Breakdown</h3>
          </div>
          <div className="grid gap-4">
            {Object.entries(feedback.scores).map(([category, score]) => (
              <div key={category} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="capitalize">{category}</span>
                  <span className="text-slate-400">{score}/10</span>
                </div>
                <Progress value={score * 10} className="h-2" />
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-slate-900/50 border-slate-800 backdrop-blur">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Detailed Analysis</h3>
          <p className="text-slate-400 leading-relaxed">{feedback.details}</p>
        </div>
      </Card>
    </div>
  )
}

