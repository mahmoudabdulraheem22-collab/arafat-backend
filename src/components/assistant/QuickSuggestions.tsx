import React from 'react';
import { Compass, Sparkles, Building2, Wallet, RefreshCw, Heart } from 'lucide-react';

interface QuickSuggestionsProps {
  languageCode?: string;
  onSelectSuggestion: (prompt: string) => void;
  disabled?: boolean;
}

export const QuickSuggestions: React.FC<QuickSuggestionsProps> = ({
  languageCode = 'ar',
  onSelectSuggestion,
  disabled = false,
}) => {
  const isAr = languageCode === 'ar';

  const suggestions = isAr
    ? [
        { label: 'شرح صفة العمرة', prompt: 'اشرح لي صفة العمرة خطوة بخطوة بالترتيب الصحيح', icon: <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" /> },
        { label: 'حساب الميزانية', prompt: 'احسب لي ميزانية رحلة عمرة لشخصين لمدة 5 أيام بالريال السعودي', icon: <Wallet className="w-3.5 h-3.5 text-amber-400" /> },
        { label: 'بحث عن فنادق', prompt: 'أبحث عن فندق قاطن قريب من الحرم الشريف بمكة بسعر مناسب', icon: <Building2 className="w-3.5 h-3.5 text-emerald-400" /> },
        { label: 'أدعية الطواف والسعي', prompt: 'ما هي الأدعية المأثورة المستحبة أثناء الطواف والسعي؟', icon: <Heart className="w-3.5 h-3.5 text-rose-400" /> },
        { label: 'تصاريح الروضة الشريفة', prompt: 'كيف يمكنني استخراج تصريح الصلاة في الروضة الشريفة عبر نسك؟', icon: <Compass className="w-3.5 h-3.5 text-sky-400" /> },
      ]
    : [
        { label: 'Umrah Guide', prompt: 'Explain Umrah step-by-step in proper sequence', icon: <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" /> },
        { label: 'Calculate Budget', prompt: 'Calculate Umrah trip budget for 2 persons for 5 days in SAR', icon: <Wallet className="w-3.5 h-3.5 text-amber-400" /> },
        { label: 'Find Hotels', prompt: 'Search for hotels near Haram in Makkah with reasonable price', icon: <Building2 className="w-3.5 h-3.5 text-emerald-400" /> },
        { label: 'Tawaf Prayers', prompt: 'What are recommended prayers during Tawaf and Sa’i?', icon: <Heart className="w-3.5 h-3.5 text-rose-400" /> },
        { label: 'Rawdah Permit', prompt: 'How can I get Rawdah prayer permit through Nusuk?', icon: <Compass className="w-3.5 h-3.5 text-sky-400" /> },
      ];

  return (
    <div className="px-3 sm:px-6 py-2 bg-[#021811] border-t border-[#D4AF37]/20 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
      <span className="text-[11px] font-bold text-[#D4AF37] whitespace-nowrap shrink-0 flex items-center gap-1">
        <Sparkles className="w-3 h-3" />
        <span>{isAr ? 'مقترحات سريعة:' : 'Quick Prompts:'}</span>
      </span>

      {suggestions.map((item, idx) => (
        <button
          key={idx}
          type="button"
          disabled={disabled}
          onClick={() => onSelectSuggestion(item.prompt)}
          className="px-3 py-1.5 rounded-full bg-[#03291F] border border-[#D4AF37]/40 hover:border-[#D4AF37] hover:bg-[#073D2F] text-white text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 cursor-pointer disabled:opacity-50"
        >
          {item.icon}
          <span>{item.label}</span>
        </button>
      ))}
    </div>
  );
};

export default QuickSuggestions;
