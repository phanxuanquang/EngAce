import { LucideIcon } from "lucide-react";

export interface UserStats {
  wordsLearned: number;
  assignmentsCompleted: number;
  writingSubmissions: number;
  lastActive: string;
  proficiencyLevel: string;
}

export interface DashboardFeature {
  title: string;
  description: string;
  icon: LucideIcon;
  path: string;
  stats?: string | number;
}

export interface RecentActivity {
  id: string;
  type: 'dictionary' | 'assignment' | 'writing' | 'chat';
  title: string;
  timestamp: string;
  details?: string;
}