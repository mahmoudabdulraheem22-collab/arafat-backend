import React from 'react';
import { Volume2, Pause, Play, Headphones, Sparkles } from 'lucide-react';

interface TTSPlayButtonProps {
  trackId: string;
  title: string;
  text: string;
  category?: string;
  subTitle?: string;
  isPlaying: boolean;
  isCurrentTrack: boolean;
  onToggle: (track: { id: string; title: string; text: string; category?: string; subTitle?: string }) => void;
  variant?: 'compact' | 'pill' | 'icon' | 'banner';
  labelAr?: string;
  labelEn?: string;
  isAr?: boolean;
}

export const TTSPlayButton: React.FC<TTSPlayButtonProps> = ({
  trackId,
  title,
  text,
  category,
  subTitle,
  isPlaying,
  isCurrentTrack,
  onToggle,
  variant = 'compact',
  labelAr = 'استماع للصوت',
  labelEn = 'Listen Audio',
  isAr = true,
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggle({
      id: trackId,
      title,
      text,
      category,
      subTitle,
    });
  };

  const isActive = isCurrentTrack && isPlaying;

  if (variant === 'icon') {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={`p-2 rounded-xl transition-all cursor-pointer border ${
          isActive
            ? 'bg-[#D4AF37] text-[#02130D] border-[#D4AF37] scale-110 shadow-[0_0_12px_rgba(212,175,55,0.6)] animate-pulse'
            : 'bg-[#03291F] text-[#D4AF37] border-[#D4AF37]/40 hover:bg-[#073D2F] hover:border-[#D4AF37]'
        }`}
        title={isActive ? (isAr ? 'إيقاف الاستماع' : 'Pause Audio') : (isAr ? 'استماع للقراءة' : 'Play Audio')}
      >
        {isActive ? <Pause className="w-4 h-4 fill-current" /> : <Volume2 className="w-4 h-4" />}
      </button>
    );
  }

  if (variant === 'pill') {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={`px-3 py-1.5 rounded-xl border text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
          isActive
            ? 'bg-[#D4AF37] text-[#02130D] border-[#D4AF37] shadow-md animate-pulse'
            : 'bg-[#03291F] text-[#D4AF37] border-[#D4AF37]/50 hover:bg-[#D4AF37] hover:text-[#02130D]'
        }`}
      >
        {isActive ? (
          <>
            <Pause className="w-3.5 h-3.5 fill-current" />
            <span>{isAr ? 'إيقاف' : 'Pause'}</span>
          </>
        ) : (
          <>
            <Volume2 className="w-3.5 h-3.5" />
            <span>{isAr ? labelAr : labelEn}</span>
          </>
        )}
      </button>
    );
  }

  if (variant === 'banner') {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={`w-full py-2.5 px-4 rounded-xl border font-black text-xs transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm ${
          isActive
            ? 'bg-[#D4AF37] text-[#02130D] border-[#D4AF37] animate-pulse'
            : 'bg-gradient-to-r from-[#03291F] via-[#021E15] to-[#03291F] text-[#D4AF37] border-[#D4AF37]/50 hover:border-[#D4AF37]'
        }`}
      >
        <Headphones className="w-4 h-4" />
        <span>{isActive ? (isAr ? 'جاري الاستماع... انقر للإيقاف' : 'Playing... Click to Pause') : (isAr ? `🎧 ${labelAr}` : `🎧 ${labelEn}`)}</span>
      </button>
    );
  }

  // Default compact
  return (
    <button
      type="button"
      onClick={handleClick}
      className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
        isActive
          ? 'bg-[#D4AF37] text-[#02130D] border-[#D4AF37] shadow'
          : 'bg-[#02130D] text-[#D4AF37] border-[#D4AF37]/40 hover:bg-[#073D2F]'
      }`}
    >
      {isActive ? <Pause className="w-3 h-3 fill-current" /> : <Volume2 className="w-3 h-3" />}
      <span>{isActive ? (isAr ? 'إيقاف' : 'Pause') : (isAr ? labelAr : labelEn)}</span>
    </button>
  );
};
