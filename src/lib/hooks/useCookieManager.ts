import { useEffect } from 'react';
import { cookieManager } from '../cookie-manager';
import { cookieHandler } from '../cookie-handler';

export function useCookieManager() {
  useEffect(() => {
    // Initialize cookie management on component mount
    const initializeCookies = async () => {
      try {
        // Sync with backend to ensure latest data
        await cookieHandler.syncWithBackend();
      } catch (error) {
        console.error('Error initializing cookies:', error);
      }
    };

    initializeCookies();

    // Cleanup on component unmount
    return () => {
      cookieHandler.syncWithBackend().catch(console.error);
    };
  }, []);

  return cookieHandler;
}