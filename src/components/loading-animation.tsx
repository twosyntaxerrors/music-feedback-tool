interface LoadingAnimationProps {
  size?: "sm" | "md" | "lg"
}

export function LoadingAnimation({ size = "md" }: LoadingAnimationProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8"
  }

  return (
    <div className="flex items-center gap-1">
      <div className={`${sizeClasses[size]} flex items-center justify-center`}>
        <div className="relative w-full h-full">
          <div className="absolute w-full h-full rounded-full border-2 border-slate-700" />
          <div className="absolute w-full h-full rounded-full border-2 border-t-blue-400 animate-spin" />
        </div>
      </div>
    </div>
  )
}

