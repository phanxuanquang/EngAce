"use client";

import { motion } from "framer-motion";
import { Book, ListTodo, Pen, MessageCircle, Clock } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { RecentActivity } from "@/types/dashboard";

interface ActivityItemProps {
  activity: RecentActivity;
  delay: number;
}

const getActivityIcon = (type: RecentActivity["type"]) => {
  switch (type) {
    case "dictionary":
      return Book;
    case "assignment":
      return ListTodo;
    case "writing":
      return Pen;
    case "chat":
      return MessageCircle;
  }
};

const getActivityColor = (type: RecentActivity["type"]) => {
  switch (type) {
    case "dictionary":
      return "text-blue-500 bg-blue-500/10";
    case "assignment":
      return "text-green-500 bg-green-500/10";
    case "writing":
      return "text-purple-500 bg-purple-500/10";
    case "chat":
      return "text-orange-500 bg-orange-500/10";
  }
};

function ActivityItem({ activity, delay }: ActivityItemProps) {
  const Icon = getActivityIcon(activity.type);
  const colorClass = getActivityColor(activity.type);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
    >
      <div className="flex items-start gap-4 mb-4 last:mb-0">
        <div className={cn("p-2 rounded-lg", colorClass)}>
          <Icon className="h-4 w-4" />
        </div>
        <div className="flex-1 space-y-1">
          <p className="text-sm font-medium">{activity.title}</p>
          {activity.details && (
            <p className="text-sm text-muted-foreground">{activity.details}</p>
          )}
          <div className="flex items-center text-xs text-muted-foreground">
            <Clock className="mr-1 h-3 w-3" />
            {activity.timestamp}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

const mockActivities: RecentActivity[] = [
  {
    id: "1",
    type: "writing",
    title: "Submitted essay review",
    details: "Topic: Environmental Conservation",
    timestamp: "2 hours ago"
  },
  {
    id: "2",
    type: "assignment",
    title: "Completed daily exercise",
    details: "Score: 90%",
    timestamp: "4 hours ago"
  },
  {
    id: "3",
    type: "dictionary",
    title: "Learned 5 new words",
    timestamp: "5 hours ago"
  },
  {
    id: "4",
    type: "chat",
    title: "Practice conversation",
    details: "Topic: Business English",
    timestamp: "6 hours ago"
  }
];

export function RecentActivity() {
  return (
    <Card className="bg-background/60 backdrop-blur-lg border-0">
      <CardHeader>
        <h3 className="text-lg font-semibold">Recent Activity</h3>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockActivities.map((activity, index) => (
            <ActivityItem
              key={activity.id}
              activity={activity}
              delay={index * 0.1}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}