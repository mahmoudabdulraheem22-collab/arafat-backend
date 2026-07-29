import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Play,
  Pause,
  Square,
  Volume2,
  VolumeX,
  FastForward,
  ChevronUp,
  ChevronDown,
  X,
  Maximize2,
  BookOpen,
  Sparkles,
  RotateCcw,
  Headphones,
  Sliders
} from 'lucide-react';
import { GuidanceAudioTrack } from '../../hooks/useGuidanceTTS';
import { LanguageOption } from '../../data/languages';

interface GuidanceTTSPlayerBarProps {
  currentTrack: GuidanceAudioTrack | null;
  isPlaying: boolean;
  isPaused: boolean;
  progress: number;
  playbackRate: number;
  language: LanguageOption;
  onPause: () => void;
  onResume: (track: GuidanceAudioTrack) => void;
  onStop: () => void;
  onChangeRate: (rate: number) => void;
}

export const GuidanceTTSPlayerBar: React.FC<GuidanceTTSPlayerBarProps> = ({
  currentTrack,
  isPlaying,
  isPaused,
  progress,
  playbackRate,
  language,
  onPause,
  onResume,
  onStop,
  onChangeRate,
}) => {
  const isAr = language.code === 'ar';
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [showTranscriptModal, setShowTranscriptModal] = useState<boolean>(false);

  if (!currentTrack) return null;

  const rates = [0.75, 0.9, 1.0, 1.25, 1.5];

  return (
    <>
      {/* Sticky Bottom Audio Dock */}
      <div className="fixed bottom-3 left-3 right-3 sm:left-6 sm:right-6 md:left-auto md:right-8 md:max-w-xl z-50 pointer-events-auto dir-rtl">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-[#021811] border-2 border-[#D4AF37] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.9)] overflow-hidden text-[#F8F3E7]"
        >
          {/* Top Animated Progress Bar */}
          <div className="w-full bg-[#03291F] h-1.5 overflow-hidden relative">
            <div
              className="bg-gradient-to-r from-[#D4AF37] via-amber-300 to-[#D4AF37] h-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="p-3 sm:p-4 space-y-2">
            {/* Main Control Line */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                {/* Playing Animated Icon */}
                <div className="relative p-2.5 rounded-xl bg-[#03291F] border border-[#D4AF37] text-[#D4AF37] shrink-0">
                  <Headphones className={`w-5 h-5 ${isPlaying ? 'animate-bounce text-amber-300' : ''}`} />
                  {isPlaying && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
                  )}
                </div>

                {/* Track Info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-[#D4AF37]/20 text-[10px] font-bold text-[#D4AF37] border border-[#D4AF37]/40 shrink-0">
                      {currentTrack.category || (isAr ? 'قارئ التوجيهات' : 'Audio Guidance')}
                    </span>
                    {isPlaying && (
                      <span className="text-[10px] text-emerald-400 font-bold animate-pulse">
                        {isAr ? 'جاري الاستماع...' : 'Playing...'}
                      </span>
                    )}
                  </div>

                  <h4 className="text-xs sm:text-sm font-black text-white truncate mt-0.5">
                    {currentTrack.title}
                  </h4>
                  {currentTrack.subTitle && (
                    <p className="text-[11px] text-[#D4AF37]/80 truncate">
                      {currentTrack.subTitle}
                    </p>
                  )}
                </div>
              </div>

              {/* Media Control Buttons */}
              <div className="flex items-center gap-1.5 shrink-0">
                {/* Speed selector pill */}
                <div className="hidden sm:flex items-center bg-[#03291F] border border-[#D4AF37]/40 rounded-xl p-0.5 text-[11px]">
                  {rates.map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => onChangeRate(r)}
                      className={`px-1.5 py-0.5 rounded-lg font-bold transition-all cursor-pointer ${
                        playbackRate === r
                          ? 'bg-[#D4AF37] text-[#02130D]'
                          : 'text-gray-300 hover:text-white'
                      }`}
                    >
                      {r}x
                    </button>
                  ))}
                </div>

                {/* Play / Pause Toggle */}
                <button
                  type="button"
                  onClick={() => {
                    if (isPlaying) {
                      onPause();
                    } else {
                      onResume(currentTrack);
                    }
                  }}
                  className="w-10 h-10 rounded-xl bg-[#D4AF37] text-[#02130D] font-black flex items-center justify-center hover:bg-amber-300 transition-transform active:scale-95 cursor-pointer shadow-md"
                  title={isPlaying ? (isAr ? 'إيقاف مؤقت' : 'Pause') : (isAr ? 'تشغيل' : 'Play')}
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5 fill-current" />
                  ) : (
                    <Play className="w-5 h-5 fill-current translate-x-0.5" />
                  )}
                </button>

                {/* View Transcript Modal */}
                <button
                  type="button"
                  onClick={() => setShowTranscriptModal(true)}
                  className="p-2.5 rounded-xl bg-[#03291F] border border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#073D2F] transition-all cursor-pointer"
                  title={isAr ? 'عرض النص الكامل والقراءة' : 'View Full Transcript'}
                >
                  <BookOpen className="w-4 h-4" />
                </button>

                {/* Stop & Close */}
                <button
                  type="button"
                  onClick={onStop}
                  className="p-2.5 rounded-xl bg-[#03291F] border border-rose-500/40 text-rose-300 hover:bg-rose-950 transition-all cursor-pointer"
                  title={isAr ? 'إنهاء الاستماع' : 'Stop Audio'}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Transcript & Full Guidance Overlay Modal */}
      <AnimatePresence>
        {showTranscriptModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md text-[#F8F3E7]">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-xl bg-[#02130D] border-2 border-[#D4AF37] rounded-3xl p-5 shadow-2xl space-y-4 max-h-[85vh] flex flex-col relative"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-[#D4AF37]/40 pb-3">
                <div className="flex items-center gap-2.5">
                  <BookOpen className="w-6 h-6 text-[#D4AF37]" />
                  <div>
                    <h3 className="font-black text-white text-base sm:text-lg">
                      {currentTrack.title}
                    </h3>
                    <p className="text-xs text-[#D4AF37]">
                      {isAr ? 'النص الإرشادي والتوجيه الشرعي الصوتي' : 'Audio Transcript & Guidance'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowTranscriptModal(false)}
                  className="p-2 rounded-xl bg-[#03291F] border border-[#D4AF37]/30 text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Text Body with Highlighting Style */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-4 rounded-2xl bg-[#03291F]/60 border border-[#D4AF37]/30 text-base leading-loose font-serif text-amber-100/90 text-right dir-rtl">
                {currentTrack.text}
              </div>

              {/* Controls inside Modal */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#D4AF37]/30">
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="text-[#D4AF37] font-bold">{isAr ? 'سرعة القراءة:' : 'Speed:'}</span>
                  {rates.map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => onChangeRate(r)}
                      className={`px-2 py-1 rounded-lg font-bold transition-all ${
                        playbackRate === r
                          ? 'bg-[#D4AF37] text-[#02130D]'
                          : 'bg-[#03291F] text-gray-300 hover:text-white'
                      }`}
                    >
                      {r}x
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (isPlaying) onPause();
                    else onResume(currentTrack);
                  }}
                  className="px-5 py-2 rounded-xl bg-[#D4AF37] text-[#02130D] font-black text-sm flex items-center gap-2 hover:bg-amber-300 transition-all cursor-pointer shadow-lg"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-4 h-4 fill-current" />
                      <span>{isAr ? 'إيقاف مؤقت' : 'Pause'}</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-current" />
                      <span>{isAr ? 'استئناف القراءة' : 'Resume'}</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
