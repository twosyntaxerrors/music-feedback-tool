"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, RefreshCw } from "lucide-react";
import { useApiQuota } from "@/lib/contexts/ApiQuotaContext";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";

export function ApiQuotaDisplay() {
  const { currentUsage, maxRequests, remainingRequests, nextReset } = useApiQuota()
  const isLowQuota = remainingRequests <= 10
  const quotaFillPercentage = maxRequests > 0
    ? Math.min(100, Math.max(0, (remainingRequests / maxRequests) * 100))
    : 0

  const getQuotaColor = () => {
    if (remainingRequests <= 5) return "text-red-400 border-red-500/20 bg-red-500/10"
    if (remainingRequests <= 15) return "text-amber-400 border-amber-500/20 bg-amber-500/10"
    if (remainingRequests <= 30) return "text-yellow-400 border-yellow-500/20 bg-yellow-500/10"
    return "text-emerald-400 border-emerald-500/20 bg-emerald-500/10"
  }

  const getQuotaIcon = () => {
    if (remainingRequests <= 5) return <AlertCircle className="w-3 h-3" />
    if (remainingRequests <= 15) return <AlertCircle className="w-3 h-3" />
    return <RefreshCw className="w-3 h-3" />
  }

  return (
    <Card className="bg-black/40 backdrop-blur-lg border border-white/20 hover:border-white/40 transition-all duration-300 relative">
      <CardHeader className="pb-2 pt-4">
        <CardTitle className="text-base font-medium text-white flex items-center gap-2">
          {getQuotaIcon()}
          Daily Requests
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 pb-4">
        <SignedIn>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/80">Remaining Requests</span>
              <Badge 
                variant="secondary" 
                className={`${getQuotaColor()} text-base font-bold px-2 py-1`}
              >
                {remainingRequests}
              </Badge>
            </div>
            
            <div className="w-full bg-black/40 rounded-full h-1.5">
              <div 
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  remainingRequests <= 5 ? 'bg-red-500' :
                  remainingRequests <= 15 ? 'bg-amber-500' :
                  remainingRequests <= 30 ? 'bg-yellow-500' :
                  'bg-emerald-500'
                }`}
                style={{ width: `${quotaFillPercentage}%` }}
              />
            </div>
            
            <div className="flex items-center justify-between text-xs">
              <span className="text-white/60">Used: {currentUsage}</span>
              <span className="text-white/60">Total: {maxRequests}</span>
            </div>
            
            <div className="text-center">
              <p className="text-white/60 text-xs">
                Resets in <span className="text-white font-medium">{nextReset}</span>
              </p>
              <p className="text-white/40 text-xs mt-0.5">
                Resets daily at midnight Pacific Time
              </p>
            </div>
            
            {isLowQuota && (
              <div className="p-2 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-red-400 text-xs text-center">
                  ⚠️ Low quota remaining. Consider waiting until reset or upgrading your plan.
                </p>
              </div>
            )}
          </div>
        </SignedIn>

        <SignedOut>
          <div className="space-y-3">
            <p className="text-sm text-white/80 text-center">
              Create a free account to track your daily analysis quota.
            </p>
            <SignInButton mode="modal">
              <button className="w-full rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:border-white/40 hover:bg-white/10">
                Sign in to unlock tracking
              </button>
            </SignInButton>
          </div>
        </SignedOut>
      </CardContent>
    </Card>
  )
}
