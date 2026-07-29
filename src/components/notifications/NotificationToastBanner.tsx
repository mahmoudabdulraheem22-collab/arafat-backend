import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, X, ExternalLink, Clock, Siren, Sun, Compass, Building2, Sparkles, Check } from 'lucide-react';
import { PilgrimNotification } from '../../types/notification';
import { LanguageOption } from '../../data/languages';

interface NotificationToastBannerProps {
  notification: PilgrimNotification | null;
  language: LanguageOption;
  onDismiss: () => void;
  onOpenCenter: () => void;
  onNavigateView: (view: string) => void;
}

export const NotificationToastBanner: React.FC<NotificationToastBannerProps> = ({
  notification,
  language,
  onDismiss,
  onOpenCenter,
  onNavigateView,
}) => {
  if (!notification) return null;

  const isAr = language.code === 'ar';

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'prayer':
        return Clock;
      case 'emergency':
        return Siren;
      case 'weather':
        return Sun;
      case 'ritual':
        return Compass;
      case 'campaign':
        return Building2;
      default:
        return Sparkles;
    }
  };

  const IconComponent = getCategoryIcon(notification.category);

  return (
    <div className="fixed top-20 right-4 sm:right-8 z-50 max-w-md w-[calc(100%-2rem)] pointer-events-auto dir-rtl">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: -25, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="bg-[#03291F] border-2 border-[#D4AF37] rounded-2xl shadow-[0_15px_45px_rgba(0,0,0,0.85)] p-4 text-[#F8F3E7] relative overflow-hidden"
        >
          {/* Subtle Top Accent Line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#D4AF37] via-amber-300 to-[#D4AF37]" />

          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 flex-1">
              <div className="p-2.5 rounded-xl bg-[#02130D] border border-[#D4AF37] text-[#D4AF37] shrink-0 mt-0.5 animate-bounce">
                <IconComponent className="w-5 h-5" />
              </div>

              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-[10px] font-black text-[#D4AF37]">
                    {isAr ? 'إشعار مباشر جديد 🔔' : 'New Push Alert 🔔'}
                  </span>
                  <span className="text-[10px] text-gray-400">
                    {isAr ? 'الآن' : 'Just now'}
                  </span>
                </div>

                <h4 className="text-sm font-black text-white leading-snug">
                  {isAr ? notification.titleAr : notification.titleEn}
                </h4>

                <p className="text-xs text-[#F8F3E7]/85 line-clamp-2 leading-relaxed">
                  {isAr ? notification.bodyAr : notification.bodyEn}
                </p>

                <div className="flex items-center gap-2 pt-1.5">
                  {notification.actionView && (
                    <button
                      type="button"
                      onClick={() => {
                        onDismiss();
                        onNavigateView(notification.actionView!);
                      }}
                      className="px-3 py-1 rounded-lg bg-[#D4AF37] text-[#02130D] font-black text-xs hover:bg-amber-300 transition-all cursor-pointer flex items-center gap-1 shadow"
                    >
                      <span>
                        {isAr
                          ? notification.actionLabelAr || 'فتح الخدمة'
                          : notification.actionLabelEn || 'Open View'}
                      </span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      onDismiss();
                      onOpenCenter();
                    }}
                    className="px-2.5 py-1 rounded-lg bg-[#02130D] border border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#073D2F] text-xs font-bold transition-all cursor-pointer"
                  >
                    {isAr ? 'عرض الإشعارات' : 'View All'}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onDismiss}
              className="p-1 text-gray-400 hover:text-white rounded-lg hover:bg-[#02130D] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
