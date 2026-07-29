import { PilgrimNotification, NotificationSettings } from '../types/notification';

// Helper to play a soft spiritual chime sound using Web Audio API
export const playNotificationChime = (type: 'chime' | 'adhan' | 'alert' = 'chime') => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    if (type === 'adhan') {
      // Spiritual multi-tone chime
      const freqs = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.value = freq;

        const startTime = now + idx * 0.22;
        const duration = 0.8;

        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.18, startTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + duration);
      });
    } else if (type === 'alert') {
      // Urgent double beep
      [0, 0.18].forEach((timeOffset) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.value = 880;

        const startTime = now + timeOffset;
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.25, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.12);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.12);
      });
    } else {
      // Gentle notification tone
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.15); // E5

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.2, now + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.5);
    }
  } catch (err) {
    console.warn('Web Audio playback failed:', err);
  }
};

// Check if Notification API is supported by the browser
export const isNotificationSupported = (): boolean => {
  return typeof window !== 'undefined' && 'Notification' in window;
};

// Get current permission status
export const getNotificationPermissionStatus = (): NotificationPermission => {
  if (!isNotificationSupported()) return 'denied';
  return Notification.permission;
};

// Request notification permissions from browser
export const requestBrowserNotificationPermission = async (): Promise<NotificationPermission> => {
  if (!isNotificationSupported()) return 'denied';

  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch (err) {
    console.error('Error requesting notification permission:', err);
    return 'denied';
  }
};

// Dispatch a standard native browser notification
export const sendNativeBrowserNotification = (
  notification: PilgrimNotification,
  lang: 'ar' | 'en' = 'ar'
): boolean => {
  if (!isNotificationSupported() || Notification.permission !== 'granted') {
    return false;
  }

  try {
    const title = lang === 'ar' ? notification.titleAr : notification.titleEn;
    const body = lang === 'ar' ? notification.bodyAr : notification.bodyEn;

    const nativeNotif = new Notification(title, {
      body,
      icon: '/icon.png', // Or app icon
      tag: notification.id,
      badge: '/icon.png',
      dir: lang === 'ar' ? 'rtl' : 'ltr',
      requireInteraction: notification.priority === 'urgent',
    });

    nativeNotif.onclick = () => {
      window.focus();
      nativeNotif.close();
    };

    return true;
  } catch (err) {
    console.error('Failed to dispatch native browser notification:', err);
    return false;
  }
};

// Format timestamp for display
export const formatNotificationTime = (isoString: string, lang: 'ar' | 'en' = 'ar'): string => {
  try {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));

    if (diffMins < 1) {
      return lang === 'ar' ? 'الآن' : 'Just now';
    }
    if (diffMins < 60) {
      return lang === 'ar' ? `منذ ${diffMins} دقيقة` : `${diffMins}m ago`;
    }
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) {
      return lang === 'ar' ? `منذ ${diffHours} ساعة` : `${diffHours}h ago`;
    }

    return date.toLocaleTimeString(lang === 'ar' ? 'ar-SA' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch (e) {
    return isoString;
  }
};
