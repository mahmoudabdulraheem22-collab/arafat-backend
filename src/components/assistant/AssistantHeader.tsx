import React from 'react';
import { Sparkles, Volume2, VolumeX, Trash2, Headphones, X, RefreshCw } from 'lucide-react';
import { LanguageOption } from '../../data/languages';
import { ArafatLogo } from '../common/ArafatLogo';

interface AssistantHeaderProps {
  language: LanguageOption;
  isMuted: boolean;
  isSpeaking?: boolean;
  onToggleMute: () => void;
  onClearChat: () => void;
  onRequestHumanSupport: () => void;
  onClose: () => void;
}

export const AssistantHeader: React.FC<AssistantHeaderProps> = ({
  language,
  isMuted,
  isSpeaking = false,
  onToggleMute,
  onClearChat,
  onRequestHumanSupport,
  onClose,
}) => {
  const isAr = language.code === 'ar';

  return (
    <div className="bg-[#03291F] px-4 sm:px-6 py-3.5 border-b border-[#D4AF37]/40 flex items-center justify-between shrink-0 shadow-md">
      {/* Title & Brand */}
      <div className="flex items-center gap-3">
        <ArafatLogo size="sm" />
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-1.5">
              <span>{isAr ? 'عرفات - الوكيل الذكي' : 'Arafat Smart Agent'}</span>
              <Sparkles className="w-4 h-4 text-[#D4AF37] animate-pulse" />
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/60 text-[10px] font-bold text-[#D4AF37]">
              {isAr ? 'مباشر' : 'Live'}
            </span>
            {isSpeaking && (
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/60 text-[10px] font-bold text-emerald-300 animate-pulse">
                <Volume2 className="w-3 h-3 text-emerald-400 animate-bounce" />
                <span>{isAr ? 'يتحدث الآن...' : 'Speaking...'}</span>
              </span>
            )}
          </div>
          <p className="text-xs text-[#D4AF37]/90 font-medium hidden sm:block">
            {isAr ? 'رفيقك الإيماني والمساعد التفاعلي الشامل لضيوف الرحمن' : 'Your spiritual interactive companion for Pilgrims'}
          </p>
        </div>
      </div>

      {/* Control Actions */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Audio Mute/Unmute */}
        <button
          type="button"
          onClick={onToggleMute}
          className={`p-2 rounded-xl border transition-all cursor-pointer ${
            isMuted
              ? 'bg-[#02130D] border-gray-600 text-gray-400 hover:text-white'
              : 'bg-[#02130D] border-[#D4AF37]/60 text-[#D4AF37] hover:bg-[#D4AF37]/20'
          }`}
          title={isMuted ? (isAr ? 'تشغيل القارئ الصوتي' : 'Unmute Speech') : (isAr ? 'كتم القارئ الصوتي' : 'Mute Speech')}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        {/* Clear Conversation */}
        <button
          type="button"
          onClick={onClearChat}
          className="p-2 rounded-xl bg-[#02130D] border border-[#D4AF37]/40 text-[#F8F3E7]/70 hover:text-red-400 hover:border-red-500/60 transition-all cursor-pointer"
          title={isAr ? 'مسح المحادثة' : 'Clear Chat'}
        >
          <Trash2 className="w-4 h-4" />
        </button>

        {/* Human Agent Request */}
        <button
          type="button"
          onClick={onRequestHumanSupport}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-400/60 text-amber-300 hover:bg-amber-500/30 text-xs font-bold transition-all cursor-pointer"
          title={isAr ? 'التحدث مع موظف بشري' : 'Talk to Human Agent'}
        >
          <Headphones className="w-3.5 h-3.5" />
          <span>{isAr ? 'موظف خدمة' : 'Human Support'}</span>
        </button>

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="p-2 rounded-xl bg-[#02130D] border border-[#D4AF37]/60 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#02130D] transition-all cursor-pointer"
          title={isAr ? 'إغلاق الشاشة' : 'Close'}
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default AssistantHeader;
