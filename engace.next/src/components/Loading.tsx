import { Loader2 } from "lucide-react"

interface LoadingProps {
  message?: string
}

export default function Loading({ message = "Loading..." }: LoadingProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-slate-900" />
        <p className="mt-4 text-slate-600 text-center">{message}</p>
    </div>
  )
} 