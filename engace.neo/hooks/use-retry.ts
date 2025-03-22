import { useState, useCallback } from "react";

interface UseRetryOptions {
  maxAttempts?: number;
  delay?: number;
}

export function useRetry(callback: () => Promise<any>, options: UseRetryOptions = {}) {
  const { maxAttempts = 3, delay = 1000 } = options;
  const [attempts, setAttempts] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  const retry = useCallback(async () => {
    if (attempts >= maxAttempts) {
      return;
    }

    setIsRetrying(true);
    setAttempts((prev) => prev + 1);

    try {
      await new Promise((resolve) => setTimeout(resolve, delay));
      await callback();
      setAttempts(0);
    } catch (error) {
      console.error("Retry attempt failed:", error);
    } finally {
      setIsRetrying(false);
    }
  }, [attempts, maxAttempts, delay, callback]);

  const reset = useCallback(() => {
    setAttempts(0);
    setIsRetrying(false);
  }, []);

  return {
    retry,
    reset,
    attempts,
    isRetrying,
    hasReachedMax: attempts >= maxAttempts,
  };
}