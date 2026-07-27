import React from 'react';
import { Headphones } from 'lucide-react';

interface HumanSupportButtonProps {
  languageCode?: string;
  onClick: () => void;
  disabled?: boolean;
}

export const HumanSupportButton: React.FC<HumanSupportButtonProps> = ({
  languageCode = 'ar',
  onClick,
  disabled = false,
}) => {
  const isAr = languageCode === 'ar';

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-600/30 via-amber-500/20 to-amber-600/30 border border-amber-400/80 text-amber-200 hover:text-white hover:bg-amber-500/40 font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.2)] disabled:opacity-50"
    >
      <Headphones className="w-4 h-4 text-amber-300 animate-pulse" />
      <span>{isAr ? 'التحدث مع موظف خدمة ضيوف الرحمن' : 'Talk to Human Support Specialist'}</span>
    </button>
  );
};

export default HumanSupportButton;
