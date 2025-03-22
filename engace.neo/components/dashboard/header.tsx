"use client";

import { motion } from "framer-motion";
import { Bell, Settings, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import type { UserStats } from "@/types/dashboard";

interface DashboardHeaderProps {
  userStats: UserStats;
}

export function DashboardHeader({ userStats }: DashboardHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full mb-6"
    >
      <BackgroundGradient containerClassName="w-full" className="rounded-[22px] backdrop-blur-lg bg-white dark:bg-zinc-900">
        <Card className="border-0 bg-background backdrop-blur-xl p-4 ">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold tracking-tight">
                  Welcome back
                </h2>
                <p className="text-sm text-muted-foreground">
                  Current level: {userStats.proficiencyLevel}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-[10px] font-medium text-white">2</span>
                </span>
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="p-4 rounded-lg bg-background/40 backdrop-blur-sm">
              <p className="text-sm font-medium text-muted-foreground">
                Words Learned
              </p>
              <h3 className="text-2xl font-bold">{userStats.wordsLearned}</h3>
            </div>
            <div className="p-4 rounded-lg bg-background/40 backdrop-blur-sm">
              <p className="text-sm font-medium text-muted-foreground">
                Assignments
              </p>
              <h3 className="text-2xl font-bold">
                {userStats.assignmentsCompleted}
              </h3>
            </div>
            <div className="p-4 rounded-lg bg-background/40 backdrop-blur-sm">
              <p className="text-sm font-medium text-muted-foreground">
                Writing Reviews
              </p>
              <h3 className="text-2xl font-bold">
                {userStats.writingSubmissions}
              </h3>
            </div>
          </div>
        </Card>
      </BackgroundGradient>
    </motion.div>
  );
}
