"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import OnboardingForm from "@/components/OnboardingForm"
import { hasCompletedOnboarding } from "@/lib/localStorage"

export default function Home() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user has completed onboarding
    if (hasCompletedOnboarding()) {
      router.push("/dashboard")
    } else {
      setIsLoading(false)
    }
  }, [router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-slate-900"></div>
          <p className="mt-4 text-slate-600">Loading...</p>
        </div>
      </div>
    )
  }

  return <OnboardingForm />
}
