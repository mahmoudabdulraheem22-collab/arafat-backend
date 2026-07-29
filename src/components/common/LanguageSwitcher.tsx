import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check, Search, Sparkles, Languages } from 'lucide-react';
import { LANGUAGES, LanguageOption } from '../../data/languages';

interface LanguageSwitcherProps {
  selectedLang: LanguageOption;
  onSelectLang: (lang: LanguageOption) => void;
  variant?: 'header' | 'pills' | 'dropdown' | 'full';
  className?: string;
  showLabel?: boolean;
}

// Four primary featured international languages for Hajj & Umrah pilgrims
const FEATURED_CODES = ['ar', 'en', 'ur', 'fr'];

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  selectedLang,
  onSelectLang,
  variant = 'header',
  className = '',
  showLabel = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const featuredLanguages = LANGUAGES.filter((l) => FEATURED_CODES.includes(l.code));

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectLanguage = (lang: LanguageOption) => {
    onSelectLang(lang);
    setIsOpen(false);
    setSearchQuery('');
    
    // Update HTML root attributes for RTL/LTR & lang code
    if (typeof document !== 'undefined') {
      document.documentElement.dir = lang.dir;
      document.documentElement.lang = lang.code;
      localStorage.setItem('arafat_lang', lang.code);
    }
  };

  const filteredLanguages = LANGUAGES.filter((l) => {
    const q = searchQuery.toLowerCase().trim();
    return (
      !q ||
      l.name.toLowerCase().includes(q) ||
      l.nativeName.toLowerCase().includes(q) ||
      l.code.toLowerCase().includes(q)
    );
  });

  // Variant 1: Quick Pills Bar (Fast toggle between Arabic, English, Urdu, French + More dropdown)
  if (variant === 'pills' || variant === 'full') {
    return (
      <div className={`space-y-3 ${className}`}>
        {/* Featured 4 International Pilgrim Languages Quick Bar */}
        <div className="flex flex-wrap items-center gap-2">
          {featuredLanguages.map((lang) => {
            const isSelected = selectedLang.code === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => handleSelectLanguage(lang)}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer border shadow-sm ${
                  isSelected
                    ? 'bg-[#D4AF37] text-[#02130D] border-[#D4AF37] shadow-[0_0_12px_rgba(212,175,55,0.4)] scale-105'
                    : 'bg-[#02130D]/90 text-[#F8F3E7] border-[#D4AF37]/40 hover:bg-[#073D2F] hover:border-[#D4AF37]'
                }`}
                title={`${lang.name} (${lang.nativeName})`}
              >
                <span className="text-base leading-none">{lang.flag}</span>
                <span>{lang.nativeName}</span>
                {isSelected && <Check className="w-3.5 h-3.5 stroke-[3] text-[#02130D]" />}
              </button>
            );
          })}

          {/* More Languages Dropdown Trigger */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-[#03291F] text-[#D4AF37] border border-[#D4AF37]/50 hover:bg-[#073D2F] flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Globe className="w-4 h-4 text-[#D4AF37]" />
              <span>لغات أخرى ({LANGUAGES.length})</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Modal / Menu */}
            {isOpen && (
              <div className="absolute top-full right-0 mt-2 w-72 bg-[#021811] border-2 border-[#D4AF37] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.95)] p-3 z-50 animate-fadeIn">
                {/* Search */}
                <div className="relative mb-2">
                  <Search className="w-3.5 h-3.5 text-[#D4AF37] absolute top-2.5 right-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="ابحث عن لغتك / Search language..."
                    className="w-full pr-8 pl-3 py-1.5 bg-[#01140E] border border-[#D4AF37]/40 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="max-h-60 overflow-y-auto space-y-1 custom-scrollbar pr-1">
                  {filteredLanguages.map((lang) => {
                    const isSelected = selectedLang.code === lang.code;
                    return (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => handleSelectLanguage(lang)}
                        className={`w-full px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#D4AF37] text-[#02130D] font-black'
                            : 'text-[#F8F3E7] hover:bg-[#073D2F]'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className="text-base">{lang.flag}</span>
                          <span>{lang.nativeName} ({lang.name})</span>
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/30 font-mono">
                            {lang.dir.toUpperCase()}
                          </span>
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Variant Default: Header Dropdown with quick toggle bar inside
  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        title="تغيير اللغة / Change Language"
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-full border border-[#D4AF37] bg-[#02130D]/90 hover:bg-[#073D2F] flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-bold text-[#D4AF37] transition-all shadow-[0_0_12px_rgba(212,175,55,0.25)] cursor-pointer hover:scale-105"
      >
        <Globe className="w-4 h-4 text-[#D4AF37] shrink-0" />
        <span className="flex items-center gap-1">
          <span className="text-sm sm:text-base leading-none">{selectedLang.flag}</span>
          {showLabel && <span className="hidden sm:inline-block">{selectedLang.nativeName}</span>}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-[#D4AF37] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2.5 w-72 bg-[#021811] border-2 border-[#D4AF37] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.95)] p-3 z-50 animate-fadeIn">
          {/* Header Section */}
          <div className="flex items-center justify-between border-b border-[#D4AF37]/30 pb-2 mb-2 text-xs text-[#D4AF37] font-bold">
            <span className="flex items-center gap-1.5">
              <Languages className="w-4 h-4" />
              <span>اختر لغة المنصة / Language</span>
            </span>
            <span className="text-[10px] bg-[#03291F] px-2 py-0.5 rounded border border-[#D4AF37]/30 text-emerald-300">
              {selectedLang.dir.toUpperCase()}
            </span>
          </div>

          {/* Quick Switcher for Featured 4 Languages */}
          <div className="text-[11px] font-bold text-gray-400 mb-1">اللغات الأكثر استخداماً:</div>
          <div className="grid grid-cols-2 gap-1.5 mb-3">
            {featuredLanguages.map((lang) => {
              const isSelected = selectedLang.code === lang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleSelectLanguage(lang)}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer border ${
                    isSelected
                      ? 'bg-[#D4AF37] text-[#02130D] border-[#D4AF37] font-black shadow-md'
                      : 'bg-[#01140E] text-[#F8F3E7] border-[#D4AF37]/30 hover:bg-[#073D2F]'
                  }`}
                >
                  <span className="flex items-center gap-1.5 truncate">
                    <span>{lang.flag}</span>
                    <span className="truncate">{lang.nativeName}</span>
                  </span>
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3] shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative mb-2">
            <Search className="w-3.5 h-3.5 text-[#D4AF37] absolute top-2.5 right-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث في جميع اللغات (26+ لغة)..."
              className="w-full pr-8 pl-3 py-1.5 bg-[#01140E] border border-[#D4AF37]/40 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          {/* All Languages List */}
          <div className="max-h-52 overflow-y-auto space-y-1 custom-scrollbar pr-1">
            {filteredLanguages.map((lang) => {
              const isSelected = selectedLang.code === lang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleSelectLanguage(lang)}
                  className={`w-full px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#D4AF37] text-[#02130D] font-black'
                      : 'text-[#F8F3E7] hover:bg-[#073D2F]'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-base">{lang.flag}</span>
                    <span>{lang.nativeName} <span className="text-[10px] opacity-75">({lang.name})</span></span>
                  </span>
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
