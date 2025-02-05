import { supabase } from './supabase';

interface LearningProgress {
  completedModules: string[];
  lastAccessed: string;
  currentModule?: string;
}

interface UserActivity {
  readBlogs: string[];
  workshopInteractions: {
    clicked: string[];
    registered: string[];
  };
}

interface CookieOptions {
  path?: string;
  domain?: string;
  maxAge?: number;
  secure?: boolean;
  sameSite?: 'Strict' | 'Lax' | 'None';
}

class CookieHandler {
  private static instance: CookieHandler;

  private constructor() {}

  public static getInstance(): CookieHandler {
    if (!CookieHandler.instance) {
      CookieHandler.instance = new CookieHandler();
    }
    return CookieHandler.instance;
  }

  private getDefaultOptions(): CookieOptions {
    return {
      path: '/',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      secure: true,
      sameSite: 'Strict'
    };
  }

  private setCookie(name: string, value: string, options: CookieOptions = {}): void {
    const mergedOptions = { ...this.getDefaultOptions(), ...options };
    let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

    if (mergedOptions.path) cookie += `; path=${mergedOptions.path}`;
    if (mergedOptions.domain) cookie += `; domain=${mergedOptions.domain}`;
    if (mergedOptions.maxAge) cookie += `; max-age=${mergedOptions.maxAge}`;
    if (mergedOptions.secure) cookie += '; secure';
    if (mergedOptions.sameSite) cookie += `; samesite=${mergedOptions.sameSite}`;

    document.cookie = cookie;
  }

  private getCookie(name: string): string | null {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [cookieName, cookieValue] = cookie.split('=').map(c => c.trim());
      if (cookieName === name) {
        return decodeURIComponent(cookieValue);
      }
    }
    return null;
  }

  private deleteCookie(name: string): void {
    this.setCookie(name, '', { maxAge: -1 });
  }

  // Learning Progress Methods
  public async trackModuleCompletion(moduleId: string): Promise<void> {
    const user = await supabase.auth.getUser();
    if (!user.data.user) return;

    const progress: LearningProgress = JSON.parse(
      this.getCookie('learningProgress') || 
      JSON.stringify({
        completedModules: [],
        lastAccessed: new Date().toISOString()
      })
    );

    if (!progress.completedModules.includes(moduleId)) {
      progress.completedModules.push(moduleId);
    }
    progress.lastAccessed = new Date().toISOString();

    this.setCookie('learningProgress', JSON.stringify(progress));

    // Sync with backend
    try {
      await supabase
        .from('user_progress')
        .upsert({
          user_id: user.data.user.id,
          progress: progress
        });
    } catch (error) {
      console.error('Error syncing progress:', error);
    }
  }

  // Blog Tracking Methods
  public async trackBlogRead(blogId: string): Promise<void> {
    const user = await supabase.auth.getUser();
    if (!user.data.user) return;

    const activity: UserActivity = JSON.parse(
      this.getCookie('userActivity') || 
      JSON.stringify({
        readBlogs: [],
        workshopInteractions: {
          clicked: [],
          registered: []
        }
      })
    );

    if (!activity.readBlogs.includes(blogId)) {
      activity.readBlogs.push(blogId);
    }

    this.setCookie('userActivity', JSON.stringify(activity));

    // Sync with backend
    try {
      await supabase
        .from('user_activity')
        .upsert({
          user_id: user.data.user.id,
          activity: activity
        });
    } catch (error) {
      console.error('Error syncing activity:', error);
    }
  }

  // Workshop Tracking Methods
  public async trackWorkshopInteraction(
    workshopId: string,
    type: 'click' | 'register'
  ): Promise<void> {
    const user = await supabase.auth.getUser();
    if (!user.data.user) return;

    const activity: UserActivity = JSON.parse(
      this.getCookie('userActivity') || 
      JSON.stringify({
        readBlogs: [],
        workshopInteractions: {
          clicked: [],
          registered: []
        }
      })
    );

    if (type === 'click' && !activity.workshopInteractions.clicked.includes(workshopId)) {
      activity.workshopInteractions.clicked.push(workshopId);
    } else if (type === 'register' && !activity.workshopInteractions.registered.includes(workshopId)) {
      activity.workshopInteractions.registered.push(workshopId);
    }

    this.setCookie('userActivity', JSON.stringify(activity));

    // Sync with backend
    try {
      await supabase
        .from('user_activity')
        .upsert({
          user_id: user.data.user.id,
          activity: activity
        });
    } catch (error) {
      console.error('Error syncing activity:', error);
    }
  }

  // Utility Methods
  public getUserProgress(): LearningProgress | null {
    const progress = this.getCookie('learningProgress');
    return progress ? JSON.parse(progress) : null;
  }

  public getUserActivity(): UserActivity | null {
    const activity = this.getCookie('userActivity');
    return activity ? JSON.parse(activity) : null;
  }

  public clearAllTracking(): void {
    this.deleteCookie('learningProgress');
    this.deleteCookie('userActivity');
  }

  public async syncWithBackend(): Promise<void> {
    const user = await supabase.auth.getUser();
    if (!user.data.user) return;

    const progress = this.getUserProgress();
    const activity = this.getUserActivity();

    try {
      if (progress) {
        await supabase
          .from('user_progress')
          .upsert({
            user_id: user.data.user.id,
            progress: progress
          });
      }

      if (activity) {
        await supabase
          .from('user_activity')
          .upsert({
            user_id: user.data.user.id,
            activity: activity
          });
      }
    } catch (error) {
      console.error('Error syncing with backend:', error);
    }
  }
}

export const cookieHandler = CookieHandler.getInstance();