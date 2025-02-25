type AssignmentData = {
  prompt: string;
  answer?: string;
  feedback?: string;
  score?: number;
  timestamp?: number;
};

type UserPreferences = {
  fullName: string;
  gender: string;
  age: number;
  geminiApiKey: string;
  hasCompletedOnboarding: boolean;
  proficiencyLevel: number;
};

const STORAGE_KEY = 'user-preferences';
const ASSIGNMENT_PREFIX = 'assignment-';

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

export const setAssignmentData = (id: string, data: AssignmentData): boolean => {
  if (!isBrowser) return false;
  
  try {
    localStorage.setItem(ASSIGNMENT_PREFIX + id, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Error saving assignment data:', error);
    return false;
  }
};

export const getAssignmentData = (id: string): AssignmentData | null => {
  if (!isBrowser) return null;
  
  try {
    const stored = localStorage.getItem(ASSIGNMENT_PREFIX + id);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Error getting assignment data:', error);
    return null;
  }
};

export const clearAssignmentData = (id: string): void => {
  if (!isBrowser) return;
  
  localStorage.removeItem(ASSIGNMENT_PREFIX + id);
};