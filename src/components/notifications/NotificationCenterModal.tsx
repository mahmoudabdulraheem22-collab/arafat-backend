import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bell,
  BellOff,
  Check,
  CheckCheck,
  Trash2,
  X,
  Volume2,
  VolumeX,
  Globe,
  PlusCircle,
  Clock,
  Sparkles,
  Siren,
  MapPin,
  Send,
  Sliders,
  Filter,
  ShieldAlert,
  ChevronRight,
  Sun,
  Compass,
  Building2,
  HelpCircle,
  ExternalLink,
  Zap
} from 'lucide-react';
import { PilgrimNotification, NotificationSettings, CustomReminderInput, NotificationCategory } from '../../types/notification';
import {
  formatNotificationTime,
  requestBrowserNotificationPermission,
  playNotificationChime,
  sendNativeBrowserNotification
} from '../../utils/notificationUtils';
import { LanguageOption } from '../../data/languages';

interface NotificationCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: PilgrimNotification[];
  settings: NotificationSettings;
  language: LanguageOption;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onDeleteNotification: (id: string) => void;
  onClearAll: () => void;
  onUpdateSettings: (newSettings: Partial<NotificationSettings>) => void;
  onAddCustomReminder: (input: CustomReminderInput) => void;
  onTriggerTestNotification: () => void;
  onNavigateView: (view: string) => void;
}

export const NotificationCenterModal: React.FC<NotificationCenterModalProps> = ({
  isOpen,
  onClose,
  notifications,
  settings,
  language,
  onMarkAsRead,
  onMarkAllAsRead,
  onDeleteNotification,
  onClearAll,
  onUpdateSettings,
  onAddCustomReminder,
  onTriggerTestNotification,
  onNavigateView,
}) => {
  const isAr = language.code === 'ar';

  const [activeTab, setActiveTab] = useState<'all' | NotificationCategory>('all');
  const [showSettings, setShowSettings] = useState(false);
  const [showAddReminder, setShowAddReminder] = useState(false);

  // New Custom Reminder Form State
  const [reminderTitle, setReminderTitle] = useState('');
  const [reminderBody, setReminderBody] = useState('');
  const [reminderCategory, setReminderCategory] = useState<NotificationCategory>('custom');
  const [reminderTime, setReminderTime] = useState('15:00');

  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === 'all') return true;
    return n.category === activeTab;
  });

  const handleRequestPermission = async () => {
    const perm = await requestBrowserNotificationPermission();
    onUpdateSettings({
      browserPermission: perm,
      enableBrowserNotifications: perm === 'granted',
    });
    if (perm === 'granted') {
      playNotificationChime('chime');
    }
  };

  const handleAddReminderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reminderTitle.trim()) return;

    onAddCustomReminder({
      titleAr: reminderTitle,
      titleEn: reminderTitle,
      bodyAr: reminderBody || (isAr ? `تذكير في تمام الساعة ${reminderTime}` : `Reminder scheduled for ${reminderTime}`),
      bodyEn: reminderBody || `Reminder scheduled for ${reminderTime}`,
      scheduledTime: reminderTime,
      category: reminderCategory,
    });

    setReminderTitle('');
    setReminderBody('');
    setShowAddReminder(false);
  };

  const getCategoryBadge = (cat: NotificationCategory) => {
    switch (cat) {
      case 'prayer':
        return {
          label: isAr ? 'الصلوات والأذان' : 'Prayer Times',
          bg: 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300',
          icon: Clock,
        };
      case 'campaign':
        return {
          label: isAr ? 'تحديثات الحملة' : 'Campaign Updates',
          bg: 'bg-amber-950/80 border-amber-500/50 text-amber-300',
          icon: Building2,
        };
      case 'ritual':
        return {
          label: isAr ? 'المناسك والإرشاد' : 'Rituals Guide',
          bg: 'bg-yellow-950/80 border-yellow-500/50 text-yellow-300',
          icon: Compass,
        };
      case 'weather':
        return {
          label: isAr ? 'تنبيهات الطقس والتروية' : 'Weather & Hydration',
          bg: 'bg-sky-950/80 border-sky-500/50 text-sky-300',
          icon: Sun,
        };
      case 'emergency':
        return {
          label: isAr ? 'طوارئ وسلامة' : 'Emergency & Safety',
          bg: 'bg-rose-950/80 border-rose-500/50 text-rose-300',
          icon: Siren,
        };
      default:
        return {
          label: isAr ? 'تذكير خاص' : 'Custom Reminder',
          bg: 'bg-purple-950/80 border-purple-500/50 text-purple-300',
          icon: Sparkles,
        };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fadeIn text-[#F8F3E7]">
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 20 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-2xl bg-[#02130D] border-2 border-[#D4AF37] rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col max-h-[90vh] relative"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#03291F] via-[#021E15] to-[#01140E] p-4 sm:p-5 border-b border-[#D4AF37]/40 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative p-2.5 rounded-2xl bg-[#02130D] border border-[#D4AF37] text-[#D4AF37]">
              <Bell className="w-6 h-6 animate-pulse" />
              {unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-rose-500 text-white text-[11px] font-black rounded-full flex items-center justify-center border-2 border-[#02130D]">
                  {unreadCount}
                </span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-black text-white">
                  {isAr ? 'مركز الإشعارات والتنبيهات المباشرة' : 'Live Notifications & Prayer Reminders'}
                </h3>
              </div>
              <p className="text-xs text-[#D4AF37]">
                {isAr
                  ? 'تحديثات فورية للمسار الحركي والمناسك ومواقيت الصلاة'
                  : 'Real-time updates for rituals, buses & prayer times'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowSettings(!showSettings)}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                showSettings
                  ? 'bg-[#D4AF37] text-[#02130D] border-[#D4AF37]'
                  : 'bg-[#02130D] text-[#D4AF37] border-[#D4AF37]/40 hover:bg-[#073D2F]'
              }`}
              title={isAr ? 'إعدادات الإشعارات' : 'Notification Settings'}
            >
              <Sliders className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white rounded-xl bg-[#02130D] border border-[#D4AF37]/30 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Browser Permission Banner if not granted */}
        {settings.browserPermission !== 'granted' && (
          <div className="bg-gradient-to-r from-amber-950/90 via-amber-900/80 to-amber-950/90 border-b border-amber-500/50 p-3 sm:px-5 flex items-center justify-between text-xs gap-3 shrink-0">
            <div className="flex items-center gap-2 text-amber-200">
              <Zap className="w-5 h-5 text-amber-400 shrink-0 animate-bounce" />
              <span>
                {isAr
                  ? 'قم بتفعيل إشعارات المتصفح لتصلك تنبيهات الصلاة وأخبار الحملة مباشرة على جهازك!'
                  : 'Enable browser notifications for instant desktop prayer & campaign alerts!'}
              </span>
            </div>
            <button
              type="button"
              onClick={handleRequestPermission}
              className="px-3.5 py-1.5 rounded-xl bg-[#D4AF37] text-[#02130D] font-black hover:bg-amber-300 transition-all cursor-pointer whitespace-nowrap shadow-md"
            >
              {isAr ? 'تفعيل الآن' : 'Enable Now'}
            </button>
          </div>
        )}

        {/* Modal Body Container */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-5 space-y-4">
          {/* Settings Section Overlay / Sub-view */}
          <AnimatePresence>
            {showSettings && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-4 rounded-2xl bg-[#03291F] border border-[#D4AF37]/40 space-y-3"
              >
                <div className="flex items-center justify-between border-b border-[#D4AF37]/30 pb-2">
                  <h4 className="text-sm font-black text-[#D4AF37] flex items-center gap-2">
                    <Sliders className="w-4 h-4" />
                    <span>{isAr ? 'تفضيلات نظام التنبيهات المباشر' : 'Live Notification Preferences'}</span>
                  </h4>
                  <button
                    onClick={() => setShowSettings(false)}
                    className="text-xs text-gray-400 hover:text-white"
                  >
                    {isAr ? 'إغلاق الإعدادات' : 'Close'}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {/* Browser Native Notifications */}
                  <label className="flex items-center justify-between p-3 rounded-xl bg-[#02130D] border border-[#D4AF37]/30 cursor-pointer">
                    <span className="font-bold text-white">
                      {isAr ? 'إشعارات المتصفح والنظام' : 'Browser System Push'}
                    </span>
                    <input
                      type="checkbox"
                      checked={settings.enableBrowserNotifications}
                      onChange={(e) => {
                        if (e.target.checked && settings.browserPermission !== 'granted') {
                          handleRequestPermission();
                        } else {
                          onUpdateSettings({ enableBrowserNotifications: e.target.checked });
                        }
                      }}
                      className="w-4 h-4 accent-[#D4AF37]"
                    />
                  </label>

                  {/* Audio Sound Alerts */}
                  <label className="flex items-center justify-between p-3 rounded-xl bg-[#02130D] border border-[#D4AF37]/30 cursor-pointer">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <Volume2 className="w-4 h-4 text-[#D4AF37]" />
                      <span>{isAr ? 'التنبيه الصوتي (نغمات روحانية)' : 'Spiritual Chime Sound'}</span>
                    </span>
                    <input
                      type="checkbox"
                      checked={settings.enableSoundAlerts}
                      onChange={(e) => onUpdateSettings({ enableSoundAlerts: e.target.checked })}
                      className="w-4 h-4 accent-[#D4AF37]"
                    />
                  </label>

                  {/* Prayer Reminders */}
                  <label className="flex items-center justify-between p-3 rounded-xl bg-[#02130D] border border-[#D4AF37]/30 cursor-pointer">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-[#D4AF37]" />
                      <span>{isAr ? 'تنبيهات مواقيت الصلاة' : 'Prayer Time Alerts'}</span>
                    </span>
                    <input
                      type="checkbox"
                      checked={settings.notifyPrayers}
                      onChange={(e) => onUpdateSettings({ notifyPrayers: e.target.checked })}
                      className="w-4 h-4 accent-[#D4AF37]"
                    />
                  </label>

                  {/* Auto Simulated Live Updates */}
                  <label className="flex items-center justify-between p-3 rounded-xl bg-[#02130D] border border-[#D4AF37]/30 cursor-pointer">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-[#D4AF37]" />
                      <span>{isAr ? 'محاكاة التحديثات الحية تلقائياً' : 'Auto Simulated Live Stream'}</span>
                    </span>
                    <input
                      type="checkbox"
                      checked={settings.autoSimulateLiveUpdates}
                      onChange={(e) => onUpdateSettings({ autoSimulateLiveUpdates: e.target.checked })}
                      className="w-4 h-4 accent-[#D4AF37]"
                    />
                  </label>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Add Custom Reminder Form Overlay */}
          <AnimatePresence>
            {showAddReminder && (
              <motion.form
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                onSubmit={handleAddReminderSubmit}
                className="p-4 rounded-2xl bg-[#03291F] border border-[#D4AF37] space-y-3"
              >
                <div className="flex items-center justify-between border-b border-[#D4AF37]/30 pb-2">
                  <h4 className="text-sm font-black text-[#D4AF37] flex items-center gap-2">
                    <PlusCircle className="w-4 h-4" />
                    <span>{isAr ? 'إضافة تذكير خاص بالحاج' : 'Set Custom Pilgrim Reminder'}</span>
                  </h4>
                  <button
                    type="button"
                    onClick={() => setShowAddReminder(false)}
                    className="text-xs text-gray-400 hover:text-white"
                  >
                    {isAr ? 'إلغاء' : 'Cancel'}
                  </button>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <label className="block text-[#D4AF37] font-bold mb-1">
                      {isAr ? 'عنوان التذكير:' : 'Reminder Title:'}
                    </label>
                    <input
                      type="text"
                      value={reminderTitle}
                      onChange={(e) => setReminderTitle(e.target.value)}
                      placeholder={isAr ? 'مثال: موعد تناول الدواء أو لقاء الحملة' : 'e.g. Medicine time or group meeting'}
                      className="w-full px-3 py-2 rounded-xl bg-[#02130D] border border-[#D4AF37]/40 text-white focus:outline-none focus:border-[#D4AF37]"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[#D4AF37] font-bold mb-1">
                        {isAr ? 'وقت التذكير:' : 'Time:'}
                      </label>
                      <input
                        type="time"
                        value={reminderTime}
                        onChange={(e) => setReminderTime(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-[#02130D] border border-[#D4AF37]/40 text-white focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>
                    <div>
                      <label className="block text-[#D4AF37] font-bold mb-1">
                        {isAr ? 'التصنيف:' : 'Category:'}
                      </label>
                      <select
                        value={reminderCategory}
                        onChange={(e) => setReminderCategory(e.target.value as NotificationCategory)}
                        className="w-full px-3 py-2 rounded-xl bg-[#02130D] border border-[#D4AF37]/40 text-white focus:outline-none focus:border-[#D4AF37]"
                      >
                        <option value="custom">{isAr ? 'تذكير خاص' : 'Custom'}</option>
                        <option value="prayer">{isAr ? 'صلاة وأذكار' : 'Prayer'}</option>
                        <option value="ritual">{isAr ? 'مناسك الحج' : 'Ritual'}</option>
                        <option value="campaign">{isAr ? 'الحملة والسفر' : 'Campaign'}</option>
                        <option value="weather">{isAr ? 'صحي وطقس' : 'Health & Weather'}</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#D4AF37] font-bold mb-1">
                      {isAr ? 'ملاحظات إضافية (اختياري):' : 'Additional Notes (Optional):'}
                    </label>
                    <input
                      type="text"
                      value={reminderBody}
                      onChange={(e) => setReminderBody(e.target.value)}
                      placeholder={isAr ? 'اكتب أي تفاصيل تود تذكرها...' : 'Write extra details...'}
                      className="w-full px-3 py-2 rounded-xl bg-[#02130D] border border-[#D4AF37]/40 text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-[#D4AF37] text-[#02130D] font-black hover:bg-amber-300 transition-all cursor-pointer shadow-md mt-1"
                  >
                    {isAr ? 'حفظ التذكير الفوري' : 'Save Reminder'}
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Action Bar: Filters & Quick Actions */}
          <div className="flex flex-wrap items-center justify-between gap-2 bg-[#03291F]/80 p-2.5 rounded-2xl border border-[#D4AF37]/30 text-xs">
            {/* Filter Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto custom-scrollbar py-0.5">
              <button
                type="button"
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'all'
                    ? 'bg-[#D4AF37] text-[#02130D]'
                    : 'text-gray-300 hover:text-white hover:bg-[#073D2F]'
                }`}
              >
                {isAr ? `الكل (${notifications.length})` : `All (${notifications.length})`}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('prayer')}
                className={`px-2.5 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'prayer'
                    ? 'bg-[#D4AF37] text-[#02130D]'
                    : 'text-gray-300 hover:text-white hover:bg-[#073D2F]'
                }`}
              >
                {isAr ? 'الصلوات' : 'Prayers'}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('campaign')}
                className={`px-2.5 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'campaign'
                    ? 'bg-[#D4AF37] text-[#02130D]'
                    : 'text-gray-300 hover:text-white hover:bg-[#073D2F]'
                }`}
              >
                {isAr ? 'الحملة' : 'Campaign'}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('ritual')}
                className={`px-2.5 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'ritual'
                    ? 'bg-[#D4AF37] text-[#02130D]'
                    : 'text-gray-300 hover:text-white hover:bg-[#073D2F]'
                }`}
              >
                {isAr ? 'المناسك' : 'Rituals'}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('weather')}
                className={`px-2.5 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'weather'
                    ? 'bg-[#D4AF37] text-[#02130D]'
                    : 'text-gray-300 hover:text-white hover:bg-[#073D2F]'
                }`}
              >
                {isAr ? 'الطقس والصحة' : 'Health'}
              </button>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-1.5 shrink-0 ms-auto">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={onMarkAllAsRead}
                  className="px-2.5 py-1 rounded-lg bg-[#073D2F] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#02130D] font-bold transition-all flex items-center gap-1 cursor-pointer"
                  title={isAr ? 'تحديد الكل كأنها قُرئت' : 'Mark all as read'}
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>{isAr ? 'قراءة الكل' : 'Mark Read'}</span>
                </button>
              )}

              <button
                type="button"
                onClick={onTriggerTestNotification}
                className="px-2.5 py-1 rounded-lg bg-[#D4AF37]/20 border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#02130D] font-bold transition-all flex items-center gap-1 cursor-pointer"
                title={isAr ? 'إرسال إشعار تجريبي مباشر' : 'Trigger Live Test Notification'}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>{isAr ? 'اختبار حي' : 'Test Live'}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowAddReminder(true)}
                className="px-2.5 py-1 rounded-lg bg-emerald-600/30 border border-emerald-500 text-emerald-300 hover:bg-emerald-500 hover:text-white font-bold transition-all flex items-center gap-1 cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>{isAr ? 'إضافة تذكير' : 'Add Custom'}</span>
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="space-y-2.5">
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-10 px-4 bg-[#01140E] border border-dashed border-[#D4AF37]/30 rounded-2xl">
                <BellOff className="w-10 h-10 text-[#D4AF37]/40 mx-auto mb-2" />
                <p className="text-sm font-bold text-[#D4AF37]">
                  {isAr ? 'لا توجد إشعارات في هذا التصنيف حالياً' : 'No notifications in this category'}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {isAr ? 'ستصلك كافة التحديثات الميدانية وتنبيهات الصلاة تلقائياً هنا' : 'All field updates & prayer reminders will appear here automatically'}
                </p>
              </div>
            ) : (
              filteredNotifications.map((n) => {
                const badge = getCategoryBadge(n.category);
                const BadgeIcon = badge.icon;

                return (
                  <motion.div
                    key={n.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className={`p-3.5 rounded-2xl border transition-all relative overflow-hidden group ${
                      !n.read
                        ? 'bg-[#03291F] border-[#D4AF37] shadow-[0_4px_20px_rgba(212,175,55,0.15)]'
                        : 'bg-[#01140E]/80 border-[#D4AF37]/20 opacity-85 hover:opacity-100 hover:border-[#D4AF37]/50'
                    }`}
                  >
                    {/* Priority Accent Stripe */}
                    {n.priority === 'urgent' && (
                      <div className="absolute top-0 right-0 bottom-0 w-1.5 bg-rose-500" />
                    )}
                    {n.priority === 'high' && (
                      <div className="absolute top-0 right-0 bottom-0 w-1.5 bg-[#D4AF37]" />
                    )}

                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2.5 flex-1">
                        {/* Category Icon */}
                        <div className={`p-2 rounded-xl border shrink-0 mt-0.5 ${badge.bg}`}>
                          <BadgeIcon className="w-4 h-4" />
                        </div>

                        <div className="space-y-1 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`px-2 py-0.5 rounded-full border text-[10px] font-bold ${badge.bg}`}>
                              {badge.label}
                            </span>
                            <span className="text-[11px] text-gray-400 font-medium">
                              {formatNotificationTime(n.timestamp, language.code === 'ar' ? 'ar' : 'en')}
                            </span>
                            {!n.read && (
                              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            )}
                          </div>

                          <h4 className="text-sm font-black text-white leading-snug">
                            {isAr ? n.titleAr : n.titleEn}
                          </h4>

                          <p className="text-xs text-[#F8F3E7]/80 leading-relaxed">
                            {isAr ? n.bodyAr : n.bodyEn}
                          </p>

                          {/* Action Button if navigation target exists */}
                          {n.actionView && (
                            <button
                              type="button"
                              onClick={() => {
                                onMarkAsRead(n.id);
                                onNavigateView(n.actionView!);
                                onClose();
                              }}
                              className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#02130D] text-xs font-black transition-all cursor-pointer"
                            >
                              <span>
                                {isAr
                                  ? n.actionLabelAr || 'الانتقال للخدمة'
                                  : n.actionLabelEn || 'Open Service'}
                              </span>
                              <ExternalLink className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Right Action Menu */}
                      <div className="flex items-center gap-1 shrink-0">
                        {!n.read && (
                          <button
                            type="button"
                            onClick={() => onMarkAsRead(n.id)}
                            className="p-1.5 rounded-lg text-emerald-400 hover:bg-emerald-950 transition-colors"
                            title={isAr ? 'تعيين كـ قُرئ' : 'Mark as read'}
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => onDeleteNotification(n.id)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-rose-400 hover:bg-rose-950 transition-colors"
                          title={isAr ? 'حذف الإشعار' : 'Delete notification'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-[#01140E] p-3 sm:px-5 border-t border-[#D4AF37]/30 flex items-center justify-between text-xs text-gray-400 shrink-0">
          <span>
            {isAr
              ? `إجمالي الإشعارات: ${notifications.length} (${unreadCount} غير مقروء)`
              : `Total: ${notifications.length} (${unreadCount} unread)`}
          </span>

          {notifications.length > 0 && (
            <button
              type="button"
              onClick={onClearAll}
              className="text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{isAr ? 'مسح كافة الإشعارات' : 'Clear All'}</span>
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};
