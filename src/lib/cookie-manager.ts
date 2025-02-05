import { cookieHandler } from './cookie-handler';

interface CookieManagerConfig {
  maxCookieSize: number; // in bytes
  cleanupInterval: number; // in milliseconds
  maxAge: number; // in milliseconds
}

class CookieManager {
  private static instance: CookieManager;
  private config: CookieManagerConfig = {
    maxCookieSize: 4096, // 4KB - standard browser cookie size limit
    cleanupInterval: 24 * 60 * 60 * 1000, // 24 hours
    maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
  };

  private constructor() {
    this.startPeriodicCleanup();
    this.monitorCookieSize();
  }

  public static getInstance(): CookieManager {
    if (!CookieManager.instance) {
      CookieManager.instance = new CookieManager();
    }
    return CookieManager.instance;
  }

  private getTotalCookieSize(): number {
    return document.cookie.length;
  }

  private getTimestamp(): number {
    return new Date().getTime();
  }

  private cleanupOldCookies(): void {
    const currentTime = this.getTimestamp();
    const progress = cookieHandler.getUserProgress();
    const activity = cookieHandler.getUserActivity();

    // Clean up old progress data
    if (progress) {
      const lastAccessed = new Date(progress.lastAccessed).getTime();
      if (currentTime - lastAccessed > this.config.maxAge) {
        cookieHandler.clearAllTracking();
        return;
      }

      // Clean up old completed modules if needed
      if (progress.completedModules.length > 100) { // Arbitrary limit
        progress.completedModules = progress.completedModules.slice(-100);
        cookieHandler.syncWithBackend();
      }
    }

    // Clean up old activity data
    if (activity) {
      // Keep only recent blog reads
      if (activity.readBlogs.length > 50) { // Arbitrary limit
        activity.readBlogs = activity.readBlogs.slice(-50);
      }

      // Clean up old workshop interactions
      if (activity.workshopInteractions.clicked.length > 50) {
        activity.workshopInteractions.clicked = activity.workshopInteractions.clicked.slice(-50);
      }
      if (activity.workshopInteractions.registered.length > 50) {
        activity.workshopInteractions.registered = activity.workshopInteractions.registered.slice(-50);
      }

      cookieHandler.syncWithBackend();
    }
  }

  private monitorCookieSize(): void {
    const totalSize = this.getTotalCookieSize();
    if (totalSize > this.config.maxCookieSize) {
      console.warn('Cookie size exceeds limit. Cleaning up...');
      this.cleanupOldCookies();
    }
  }

  private startPeriodicCleanup(): void {
    setInterval(() => {
      this.cleanupOldCookies();
    }, this.config.cleanupInterval);
  }

  public updateConfig(newConfig: Partial<CookieManagerConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }
}

export const cookieManager = CookieManager.getInstance();