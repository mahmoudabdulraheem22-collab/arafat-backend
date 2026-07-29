export type NotificationCategory = 'prayer' | 'campaign' | 'ritual' | 'weather' | 'emergency' | 'system' | 'custom';
export type NotificationPriority = 'low' | 'normal' | 'high' | 'urgent';

export interface PilgrimNotification {
  id: string;
  titleAr: string;
  titleEn: string;
  bodyAr: string;
  bodyEn: string;
  category: NotificationCategory;
  priority: NotificationPriority;
  timestamp: string; // ISO string or human formatted
  read: boolean;
  actionView?: string; // View ID to navigate to if clicked
  actionLabelAr?: string;
  actionLabelEn?: string;
  isPinned?: boolean;
  iconName?: string;
}

export interface NotificationSettings {
  browserPermission: 'default' | 'granted' | 'denied';
  enableBrowserNotifications: boolean;
  enableSoundAlerts: boolean;
  enableVibration: boolean;
  notifyPrayers: boolean;
  prayerOffsetMinutes: number; // e.g., 10 minutes before
  notifyCampaignUpdates: boolean;
  notifyWeatherAlerts: boolean;
  notifyRitualReminders: boolean;
  notifyHealthSafety: boolean;
  autoSimulateLiveUpdates: boolean;
}

export interface CustomReminderInput {
  titleAr: string;
  titleEn: string;
  bodyAr: string;
  bodyEn: string;
  scheduledTime: string; // HH:mm or ISO
  category: NotificationCategory;
}
