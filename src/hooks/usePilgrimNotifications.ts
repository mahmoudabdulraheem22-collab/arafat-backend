import { useState, useEffect, useCallback, useRef } from 'react';
import { PilgrimNotification, NotificationSettings, CustomReminderInput } from '../types/notification';
import { INITIAL_NOTIFICATIONS, LIVE_SIMULATED_UPDATES } from '../data/initialNotifications';
import {
  isNotificationSupported,
  getNotificationPermissionStatus,
  requestBrowserNotificationPermission,
  sendNativeBrowserNotification,
  playNotificationChime
} from '../utils/notificationUtils';

const NOTIFICATIONS_STORAGE_KEY = 'arafat_pilgrim_notifications';
const SETTINGS_STORAGE_KEY = 'arafat_notification_settings';

export const usePilgrimNotifications = (languageCode: string = 'ar') => {
  // Load notifications from localStorage or fallback to initial dataset
  const [notifications, setNotifications] = useState<PilgrimNotification[]>(() => {
    try {
      const saved = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to parse saved notifications:', e);
    }
    return INITIAL_NOTIFICATIONS;
  });

  // Load notification settings
  const [settings, setSettings] = useState<NotificationSettings>(() => {
    const defaultSettings: NotificationSettings = {
      browserPermission: getNotificationPermissionStatus(),
      enableBrowserNotifications: getNotificationPermissionStatus() === 'granted',
      enableSoundAlerts: true,
      enableVibration: true,
      notifyPrayers: true,
      prayerOffsetMinutes: 10,
      notifyCampaignUpdates: true,
      notifyWeatherAlerts: true,
      notifyRitualReminders: true,
      notifyHealthSafety: true,
      autoSimulateLiveUpdates: true,
    };

    try {
      const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (saved) {
        return { ...defaultSettings, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.error('Failed to parse saved notification settings:', e);
    }
    return defaultSettings;
  });

  // Active Toast Notification state for floating on-screen alert banner
  const [activeToast, setActiveToast] = useState<PilgrimNotification | null>(null);

  // Sync notifications to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifications));
    } catch (e) {
      console.error('Failed to save notifications:', e);
    }
  }, [notifications]);

  // Sync settings to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save notification settings:', e);
    }
  }, [settings]);

  // Dispatch a new notification into the state + trigger audio + native notification + active toast
  const pushNotification = useCallback(
    (newNotifData: Omit<PilgrimNotification, 'id' | 'timestamp' | 'read'>) => {
      const id = `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const newNotif: PilgrimNotification = {
        ...newNotifData,
        id,
        timestamp: new Date().toISOString(),
        read: false,
      };

      setNotifications((prev) => [newNotif, ...prev]);

      // 1. Play Audio Chime if enabled
      if (settings.enableSoundAlerts) {
        const soundType = newNotif.category === 'prayer' ? 'adhan' : newNotif.priority === 'urgent' ? 'alert' : 'chime';
        playNotificationChime(soundType);
      }

      // 2. Dispatch Native Browser Notification if enabled
      if (settings.enableBrowserNotifications && settings.browserPermission === 'granted') {
        sendNativeBrowserNotification(newNotif, languageCode === 'ar' ? 'ar' : 'en');
      }

      // 3. Set Active Toast Banner
      setActiveToast(newNotif);
      setTimeout(() => {
        setActiveToast((current) => (current?.id === id ? null : current));
      }, 6000);
    },
    [settings, languageCode]
  );

  // Mark single notification as read
  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  // Mark all notifications as read
  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  // Delete notification
  const deleteNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  // Clear all
  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Update settings
  const updateSettings = useCallback((newSettings: Partial<NotificationSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  }, []);

  // Add Custom Reminder
  const addCustomReminder = useCallback(
    (input: CustomReminderInput) => {
      pushNotification({
        titleAr: `⏰ تذكير خاص: ${input.titleAr}`,
        titleEn: `⏰ Custom Reminder: ${input.titleEn}`,
        bodyAr: input.bodyAr,
        bodyEn: input.bodyEn,
        category: input.category,
        priority: 'high',
        actionView: 'rituals',
        actionLabelAr: 'عرض التذكير',
        actionLabelEn: 'View Reminder',
      });
    },
    [pushNotification]
  );

  // Trigger Test Notification for immediate demonstration
  const triggerTestNotification = useCallback(() => {
    const isAr = languageCode === 'ar';
    pushNotification({
      titleAr: '✨ إشعار حي تجريبي: تم فتح مسار الطواف الجديد',
      titleEn: '✨ Live Test Alert: Upper Tawaf Deck Now Open',
      bodyAr: 'نجحت تجربة نظام الإشعارات الفوري لمنصة عرفات! يصلك هذا التنبيه مباشرة للتأكد من الجاهزية.',
      bodyEn: 'Live Notification System test successful! Direct push alert delivered to your device.',
      category: 'system',
      priority: 'high',
      actionView: 'rituals',
      actionLabelAr: 'استعراض الخدمة',
      actionLabelEn: 'Explore Service',
    });
  }, [pushNotification, languageCode]);

  // Periodic Simulated Live Updates Engine (Every 90 seconds if enabled)
  useEffect(() => {
    if (!settings.autoSimulateLiveUpdates) return;

    const intervalId = setInterval(() => {
      // Pick a random update from simulated pool
      const randomUpdate = LIVE_SIMULATED_UPDATES[Math.floor(Math.random() * LIVE_SIMULATED_UPDATES.length)];
      pushNotification({
        ...randomUpdate,
        actionLabelAr: 'الانتقال للتفاصيل',
        actionLabelEn: 'View Details',
      });
    }, 120000); // Every 2 minutes

    return () => clearInterval(intervalId);
  }, [settings.autoSimulateLiveUpdates, pushNotification]);

  const dismissToast = useCallback(() => {
    setActiveToast(null);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return {
    notifications,
    unreadCount,
    settings,
    activeToast,
    pushNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    updateSettings,
    addCustomReminder,
    triggerTestNotification,
    dismissToast,
  };
};
