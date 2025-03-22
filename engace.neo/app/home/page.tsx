"use client";

import { motion } from "framer-motion";
import { AlertCircle, RefreshCcw } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/header";
import { FeatureGrid } from "@/components/dashboard/feature-grid";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { BackgroundEffect } from "@/components/ui/background-effect";
import { LoadingDots } from "@/components/ui/loading-dots";
import { Button } from "@/components/ui/button";
import { useUserStats } from "@/hooks/use-user-stats";

function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-4 p-8 rounded-lg bg-background/50 backdrop-blur-sm"
      >
        <LoadingDots size="lg" className="mb-2" />
        <p className="text-muted-foreground text-sm">Loading your dashboard...</p>
      </motion.div>
    </div>
  );
}

interface ErrorStateProps {
  onRetry?: () => void;
}

function ErrorState({ onRetry }: ErrorStateProps) {
  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-6 p-8 rounded-lg bg-destructive/5 backdrop-blur-sm"
      >
        <div className="p-3 rounded-full bg-destructive/10">
          <AlertCircle className="w-6 h-6 text-destructive" />
        </div>
        <div className="text-center">
          <p className="text-destructive font-medium mb-1">Failed to load dashboard data</p>
          <p className="text-sm text-muted-foreground mb-4">
            Please try again or check your connection
          </p>
          {onRetry && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRetry}
              className="gap-2 group"
            >
              <RefreshCcw className="w-4 h-4 transition-transform group-hover:rotate-180" />
              Try Again
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  );
}

function DashboardContent({ userStats }: { userStats: NonNullable<ReturnType<typeof useUserStats>["data"]> }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        ease: "easeOut"
      }}
      className="container mx-auto py-6 px-4 md:px-6 space-y-6"
    >
      <DashboardHeader userStats={userStats} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <FeatureGrid />
        </div>
        <div>
          <RecentActivity />
        </div>
      </div>
    </motion.div>
  );
}

export default function DashboardPage() {
  const { data: userStats, isError, isLoading, retry } = useUserStats();

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <BackgroundEffect />
      
      <div className="relative">
        {isError ? (
          <ErrorState onRetry={retry} />
        ) : isLoading || !userStats ? (
          <LoadingState />
        ) : (
          <DashboardContent userStats={userStats} />
        )}
      </div>
    </div>
  );
}
