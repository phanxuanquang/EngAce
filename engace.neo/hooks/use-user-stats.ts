import useSWR from "swr";
import { useRetry } from "@/hooks/use-retry";
import type { UserStats } from "@/types/dashboard";

const CACHE_TIME = 60000; // 1 minute
const RETRY_COUNT = 3;
const RETRY_DELAY = 2000; // 2 seconds

// Mock fetcher - Replace with actual API call
const fetchUserStats = async (): Promise<UserStats> => {
  // Simulate API delay and potential errors
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  // Simulate random errors for testing retry functionality
  if (Math.random() < 0.1) {
    throw new Error("Failed to fetch user stats");
  }

  return {
    wordsLearned: 2450,
    assignmentsCompleted: 42,
    writingSubmissions: 12,
    lastActive: "2 hours ago",
    proficiencyLevel: "B2 - Upper Intermediate"
  };
};

export function useUserStats() {
  const { retry, isRetrying, hasReachedMax } = useRetry(fetchUserStats, {
    maxAttempts: RETRY_COUNT,
    delay: RETRY_DELAY,
  });

  const { data, error, isLoading, mutate } = useSWR<UserStats>(
    "user-stats",
    fetchUserStats,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: CACHE_TIME,
      shouldRetryOnError: !hasReachedMax,
      onError: (err) => {
        console.error("Error fetching user stats:", err);
        if (!hasReachedMax) {
          retry();
        }
      },
    }
  );

  return {
    data,
    isError: error && hasReachedMax,
    isLoading: isLoading || isRetrying,
    mutate,
    retry: !hasReachedMax ? retry : undefined,
  };
}