// src/hooks/useLocalStorage.ts
import { useCallback, useEffect, useState } from 'react';

// Custom type guard to safely parse JSON
function isValidJSON(value: string | null): value is string {
  try {
    JSON.parse(value || '');
    return true;
  } catch {
    return false;
  }
}

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  options: {
    serializer?: (value: T) => string;
    deserializer?: (value: string) => T;
    storageType?: 'localStorage' | 'sessionStorage';
  } = {}
) {
  const { serializer = JSON.stringify, deserializer = JSON.parse, storageType = 'localStorage' } = options;

  // Get storage mechanism based on type
  const storage = storageType === 'localStorage' ? localStorage : sessionStorage;

  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = storage.getItem(key);

      // If item exists and is valid JSON, return parsed value
      return item && isValidJSON(item) ? deserializer(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        // Allow value to be a function that receives the previous value
        const valueToStore = value instanceof Function ? value(storedValue) : value;

        // Save state
        setStoredValue(valueToStore);

        // Save to localStorage
        storage.setItem(key, serializer(valueToStore));
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storage, serializer, storedValue]
  );

  // Listen for storage changes from other tabs/windows
  const handleStorageChange = useCallback(
    (event: StorageEvent) => {
      if (event.key === key && event.storageArea === storage) {
        try {
          // Only update if the new value is valid JSON
          if (event.newValue && isValidJSON(event.newValue)) {
            const newValue = deserializer(event.newValue);
            setStoredValue(newValue);
          }
        } catch (error) {
          console.warn(`Error parsing storage event for key "${key}":`, error);
        }
      }
    },
    [key, deserializer, storage]
  );

  // Add event listener for storage changes
  useEffect(() => {
    window.addEventListener('storage', handleStorageChange);

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [handleStorageChange]);

  // Method to remove the item from storage
  const remove = useCallback(() => {
    try {
      storage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, storage, initialValue]);

  return [storedValue, setValue, remove] as const;
}

// Example usage type definitions for clarity
type UseLocalStorageReturn<T> = [
  T, // Current stored value
  (value: T | ((val: T) => T)) => void, // Setter function
  () => void // Remove function
];
