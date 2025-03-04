"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import WelcomeScreen from "@/app/welcome/page"
import Loading from "@/components/Loading"
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
    return <Loading message="Vui lòng đợi..." />
  }

  return <WelcomeScreen />
}
