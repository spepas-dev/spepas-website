import { useCallback } from 'react';

interface PageViewData {
  path: string;
  title: string;
  referrer: string;
}

export const useAnalytics = () => {
  const trackPageView = useCallback((data: PageViewData) => {
    // In a real application, you would send this to your analytics service
    // For now, we'll just log it
    console.log('Page View:', data);

    // Example: Send to analytics service
    // analyticsService.trackPageView(data);
  }, []);

  return {
    trackPageView
  };
};
