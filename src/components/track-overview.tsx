import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export function TrackOverview() {
  return (
    <Card className="bg-gray-800 bg-opacity-50 text-gray-100 backdrop-blur-lg border-0">
      <CardHeader>
        <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
          Track Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2 text-blue-300">Genre</h3>
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-blue-500 hover:bg-blue-600 transition-colors">Electronic</Badge>
            <Badge className="bg-purple-500 hover:bg-purple-600 transition-colors">Dance</Badge>
          </div>
        </div>
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2 text-blue-300">Musical Influences</h3>
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-green-500 hover:bg-green-600 transition-colors">House</Badge>
            <Badge className="bg-yellow-500 hover:bg-yellow-600 transition-colors">Techno</Badge>
            <Badge className="bg-red-500 hover:bg-red-600 transition-colors">Pop</Badge>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2 text-blue-300">Key Characteristics</h3>
          <ul className="list-disc list-inside text-gray-300">
            <li>Energetic beat with consistent 4/4 time signature</li>
            <li>Prominent synthesizer leads and bass lines</li>
            <li>Build-ups and breakdowns typical of EDM structure</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

