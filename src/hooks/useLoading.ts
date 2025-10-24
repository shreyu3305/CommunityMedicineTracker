import { useState, useCallback } from 'react';

interface UseLoadingOptions {
  initialLoading?: boolean;
  delay?: number; // Minimum loading time in ms
}

export const useLoading = (options: UseLoadingOptions = {}) => {
  const { initialLoading = false, delay = 0 } = options;
  const [isLoading, setIsLoading] = useState(initialLoading);
  const [loadingMessage, setLoadingMessage] = useState<string>('');

  const startLoading = useCallback((message?: string) => {
    setLoadingMessage(message || '');
    setIsLoading(true);
  }, []);

  const stopLoading = useCallback(() => {
    if (delay > 0) {
      setTimeout(() => {
        setIsLoading(false);
        setLoadingMessage('');
      }, delay);
    } else {
      setIsLoading(false);
      setLoadingMessage('');
    }
  }, [delay]);

  const withLoading = useCallback(async <T>(
    asyncFunction: () => Promise<T>,
    message?: string
  ): Promise<T> => {
    startLoading(message);
    try {
      const result = await asyncFunction();
      return result;
    } finally {
      stopLoading();
    }
  }, [startLoading, stopLoading]);

  return {
    isLoading,
    loadingMessage,
    startLoading,
    stopLoading,
    withLoading
  };
};
