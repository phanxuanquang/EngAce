type UserPreferences = {
  fullName: string;
  gender: string;
  age: number;
  geminiApiKey: string;
  hasCompletedOnboarding: boolean;
};

const STORAGE_KEY = 'user-preferences';

const isBrowser = typeof window !== 'undefined';

export const saveUserPreferences = (preferences: Partial<UserPreferences>) => {
  if (!isBrowser) return false;
  
  try {
    const existing = getUserPreferences();
    const updated = { ...existing, ...preferences };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return true;
  } catch (error) {
    console.error('Error saving user preferences:', error);
    return false;
  }
};

export const getUserPreferences = (): Partial<UserPreferences> => {
  if (!isBrowser) return {};
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Error getting user preferences:', error);
    return {};
  }
};

export const hasCompletedOnboarding = (): boolean => {
  if (!isBrowser) return false;
  
  const preferences = getUserPreferences();
  return preferences.hasCompletedOnboarding || false;
};