"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

interface ApiQuotaContextType {
  currentUsage: number
  maxRequests: number
  incrementUsage: () => void
  resetUsage: () => void
  remainingRequests: number
  nextReset: string
}

const ApiQuotaContext = createContext<ApiQuotaContextType | undefined>(undefined)

interface ApiQuotaProviderProps {
  children: ReactNode
  maxRequests?: number
}

export function ApiQuotaProvider({ children, maxRequests = 100 }: ApiQuotaProviderProps) {
  const [currentUsage, setCurrentUsage] = useState(0)
  const [nextReset, setNextReset] = useState("")

  // Load usage from localStorage on mount
  useEffect(() => {
    const loadUsage = () => {
      try {
        const stored = localStorage.getItem("gemini_api_usage")
        if (stored) {
          const data = JSON.parse(stored)
          const lastReset = new Date(data.lastReset)
          const now = new Date()
          
          // Check if we need to reset (new day in PT)
          const pacificNow = new Date(now.toLocaleString("en-US", { timeZone: "America/Los_Angeles" }))
          const pacificLastReset = new Date(lastReset.toLocaleString("en-US", { timeZone: "America/Los_Angeles" }))
          
          if (pacificNow.getDate() !== pacificLastReset.getDate() || 
              pacificNow.getMonth() !== pacificLastReset.getMonth() || 
              pacificNow.getFullYear() !== pacificLastReset.getFullYear()) {
            // New day, reset usage
            setCurrentUsage(0)
            localStorage.setItem("gemini_api_usage", JSON.stringify({
              count: 0,
              lastReset: now.toISOString()
            }))
          } else {
            // Same day, load stored usage
            setCurrentUsage(data.count || 0)
          }
        } else {
          // First time, initialize
          localStorage.setItem("gemini_api_usage", JSON.stringify({
            count: 0,
            lastReset: now.toISOString()
          }))
        }
      } catch (error) {
        console.error("Error loading API usage:", error)
        setCurrentUsage(0)
      }
    }

    loadUsage()
  }, [])

  // Calculate next reset time
  useEffect(() => {
    const calculateNextReset = () => {
      const now = new Date()
      const pacificTime = new Date(now.toLocaleString("en-US", { timeZone: "America/Los_Angeles" }))
      const nextMidnight = new Date(pacificTime)
      nextMidnight.setDate(nextMidnight.getDate() + 1)
      nextMidnight.setHours(0, 0, 0, 0)
      
      const timeUntilReset = nextMidnight.getTime() - pacificTime.getTime()
      const hours = Math.floor(timeUntilReset / (1000 * 60 * 60))
      const minutes = Math.floor((timeUntilReset % (1000 * 60 * 60)) / (1000 * 60))
      
      setNextReset(`${hours}h ${minutes}m`)
    }

    calculateNextReset()
    
    // Update every minute
    const interval = setInterval(calculateNextReset, 60000)
    
    return () => clearInterval(interval)
  }, [])

  const incrementUsage = () => {
    const newUsage = currentUsage + 1
    setCurrentUsage(newUsage)
    
    try {
      const stored = localStorage.getItem("gemini_api_usage")
      const data = stored ? JSON.parse(stored) : { count: 0, lastReset: new Date().toISOString() }
      
      localStorage.setItem("gemini_api_usage", JSON.stringify({
        ...data,
        count: newUsage
      }))
    } catch (error) {
      console.error("Error saving API usage:", error)
    }
  }

  const resetUsage = () => {
    setCurrentUsage(0)
    try {
      localStorage.setItem("gemini_api_usage", JSON.stringify({
        count: 0,
        lastReset: new Date().toISOString()
      }))
    } catch (error) {
      console.error("Error resetting API usage:", error)
    }
  }

  const value: ApiQuotaContextType = {
    currentUsage,
    maxRequests,
    incrementUsage,
    resetUsage,
    remainingRequests: maxRequests - currentUsage,
    nextReset
  }

  return (
    <ApiQuotaContext.Provider value={value}>
      {children}
    </ApiQuotaContext.Provider>
  )
}

export function useApiQuota() {
  const context = useContext(ApiQuotaContext)
  if (context === undefined) {
    throw new Error("useApiQuota must be used within an ApiQuotaProvider")
  }
  return context
}
