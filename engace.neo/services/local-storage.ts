/**
 * Type-safe localStorage service with support for multiple key namespaces
 */

type StorageData = {
  userPreferences: {
    theme: 'light' | 'dark';
    language: string;
  };
  userProgress: {
    level: number;
    completedLessons: string[];
  };
  formData: {
    [key: string]: any;
  };
};

export class LocalStorageService {
  private static PREFIX = 'engace_';

  /**
   * Set an item in localStorage with type safety
   */
  static setItem<K extends keyof StorageData, T extends StorageData[K]>(
    namespace: K,
    key: keyof T,
    value: T[keyof T]
  ): void {
    try {
      const storageKey = this.getStorageKey(namespace, key as string);
      localStorage.setItem(storageKey, JSON.stringify(value));
    } catch (error) {
      console.error('Error setting localStorage item:', error);
    }
  }

  /**
   * Get an item from localStorage with type safety
   */
  static getItem<K extends keyof StorageData, T extends StorageData[K]>(
    namespace: K,
    key: keyof T
  ): T[keyof T] | null {
    try {
      const storageKey = this.getStorageKey(namespace, key as string);
      const item = localStorage.getItem(storageKey);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error getting localStorage item:', error);
      return null;
    }
  }

  /**
   * Remove an item from localStorage
   */
  static removeItem<K extends keyof StorageData, T extends StorageData[K]>(
    namespace: K,
    key: keyof T
  ): void {
    try {
      const storageKey = this.getStorageKey(namespace, key as string);
      localStorage.removeItem(storageKey);
    } catch (error) {
      console.error('Error removing localStorage item:', error);
    }
  }

  /**
   * Clear all items in a namespace
   */
  static clearNamespace(namespace: keyof StorageData): void {
    try {
      const keys = Object.keys(localStorage);
      const namespacePrefix = this.getStorageKey(namespace, '');
      
      keys.forEach(key => {
        if (key.startsWith(namespacePrefix)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Error clearing namespace:', error);
    }
  }

  /**
   * Clear all localStorage items with our prefix
   */
  static clearAll(): void {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.PREFIX)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }

  private static getStorageKey(namespace: string, key: string): string {
    return `${this.PREFIX}${namespace}_${key}`;
  }
}

// Usage examples:
/*
// Set user theme preference
LocalStorageService.setItem('userPreferences', 'theme', 'dark');

// Get user theme
const theme = LocalStorageService.getItem('userPreferences', 'theme');

// Store form data
LocalStorageService.setItem('formData', 'registration', { name: 'John', email: 'john@example.com' });

// Clear all form data
LocalStorageService.clearNamespace('formData');

// Clear everything
LocalStorageService.clearAll();
*/