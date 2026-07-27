import React, { useState, useRef, useEffect } from 'react';
import {
  User,
  Globe,
  Coins,
  Sparkles,
  ChevronDown,
  Search,
  Check,
  Settings,
  Mail,
} from 'lucide-react';
import { LANGUAGES, LanguageOption, Translations } from '../../data/languages';
import { CURRENCIES, CurrencyOption } from '../../data/currencies';
import { ArafatLogo } from '../common/ArafatLogo';
import { UserProfile } from '../views/UserProfileModal';

interface ArafatHeaderProps {
  selectedLang: LanguageOption;
  onSelectLang: (lang: LanguageOption) => void;
  selectedCurrency: CurrencyOption;
  onSelectCurrency: (curr: CurrencyOption) => void;
  onOpenAskModal: () => void;
  onOpenUserModal: () => void;
  onOpenContactModal?: () => void;
  onNavigateView: (view: string) => void;
  userProfile?: UserProfile;
  t: Translations;
}

/**
 * @file ArafatHeader.tsx
 * @description الهيدر الخاص بمنصة عرفات مع الربط التفاعلي للخدمات والحساب
 */
export const ArafatHeader: React.FC<ArafatHeaderProps> = ({
  selectedLang,
  onSelectLang,
  selectedCurrency,
  onSelectCurrency,
  onOpenAskModal,
  onOpenUserModal,
  onOpenContactModal,
  onNavigateView,
  userProfile,
  t,
}) => {
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const [langSearch, setLangSearch] = useState('');
  const [currencySearch, setCurrencySearch] = useState('');

  const langDropdownRef = useRef<HTMLDivElement>(null);
  const currencyDropdownRef = useRef<HTMLDivElement>(null);

  // إغلاق القوائم عند النقر الخارج عن العنصر
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
      if (currencyDropdownRef.current && !currencyDropdownRef.current.contains(event.target as Node)) {
        setIsCurrencyOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // تصفية اللغات بناءً على البحث
  const filteredLanguages = LANGUAGES.filter((l) =>
    l.name.toLowerCase().includes(langSearch.toLowerCase()) ||
    l.nativeName.toLowerCase().includes(langSearch.toLowerCase()) ||
    l.code.toLowerCase().includes(langSearch.toLowerCase())
  );

  // تصفية العملات بناءً على البحث
  const filteredCurrencies = CURRENCIES.filter((c) =>
    c.name.toLowerCase().includes(currencySearch.toLowerCase()) ||
    c.code.toLowerCase().includes(currencySearch.toLowerCase()) ||
    c.symbol.toLowerCase().includes(currencySearch.toLowerCase())
  );

  return (
    <header className="relative w-full pt-2 mb-8 sm:mb-12">
      {/* إطار الهيدر الفاخر ذو الانحناءات مع الشعار المحرابي المركزي */}
      <div className="w-full bg-[#03291F]/90 backdrop-blur-md border border-[#D4AF37]/80 rounded-[32px] lg:rounded-[40px] px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between shadow-[0_12px_40px_rgba(0,0,0,0.8)] relative min-h-[90px]">

        {/* الجانب الأول: قائمتي اللغة والعملة وزر اسأل عرفات */}
        <div className="flex items-center gap-2 sm:gap-3 z-20">
          
          {/* 1. قائمة اختيار اللغة (20 لغة) */}
          <div className="relative" ref={langDropdownRef}>
            <button
              type="button"
              title="اختر لغتك"
              onClick={() => {
                setIsLangOpen(!isLangOpen);
                setIsCurrencyOpen(false);
              }}
              className="px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-full border border-[#D4AF37] bg-[#02130D]/90 hover:bg-[#073D2F] flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-bold text-[#D4AF37] transition-all shadow-[0_0_12px_rgba(212,175,55,0.25)] cursor-pointer hover:scale-105"
            >
              <Globe className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <span className="flex items-center gap-1">
                <span className="text-sm sm:text-base leading-none">{selectedLang.flag}</span>
                <span className="hidden sm:inline-block">{selectedLang.name}</span>
              </span>
              <ChevronDown className={`w-3.5 h-3.5 text-[#D4AF37] transition-transform duration-200 ${isLangOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* النافذة المنسدلة للغة */}
            {isLangOpen && (
              <div className="absolute top-full right-0 mt-2.5 w-64 bg-[#021811] border-2 border-[#D4AF37] rounded-2xl shadow-[0_20px_45px_rgba(0,0,0,0.95)] p-2 z-50">
                <div className="max-h-64 overflow-y-auto space-y-1 custom-scrollbar">
                  {filteredLanguages.map((lang) => (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => {
                        onSelectLang(lang);
                        setIsLangOpen(false);
                        setLangSearch('');
                      }}
                      className={`w-full text-start px-3 py-2 rounded-xl text-xs sm:text-sm flex items-center justify-between transition-all ${
                        selectedLang.code === lang.code
                          ? 'bg-[#D4AF37] text-[#02130D] font-black'
                          : 'text-[#F8F3E7] hover:bg-[#073D2F] hover:text-[#D4AF37]'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-base">{lang.flag}</span>
                        <span className="font-medium">{lang.name}</span>
                      </span>
                      {selectedLang.code === lang.code && <Check className="w-4 h-4 text-[#02130D]" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 2. قائمة اختيار العملة (20 عملة) */}
          <div className="relative" ref={currencyDropdownRef}>
            <button
              type="button"
              title="تغيير العملة"
              onClick={() => {
                setIsCurrencyOpen(!isCurrencyOpen);
                setIsLangOpen(false);
              }}
              className="px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-full border border-[#D4AF37] bg-[#02130D]/90 hover:bg-[#073D2F] flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-black text-[#D4AF37] transition-all shadow-[0_0_12px_rgba(212,175,55,0.25)] cursor-pointer hover:scale-105"
            >
              <Coins className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <span>{selectedCurrency.code} ({selectedCurrency.symbol})</span>
              <ChevronDown className={`w-3.5 h-3.5 text-[#D4AF37] transition-transform duration-200 ${isCurrencyOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* النافذة المنسدلة للعملة */}
            {isCurrencyOpen && (
              <div className="absolute top-full right-0 mt-2.5 w-72 bg-[#021811] border-2 border-[#D4AF37] rounded-2xl shadow-[0_20px_45px_rgba(0,0,0,0.95)] p-2 z-50">
                <div className="max-h-64 overflow-y-auto space-y-1 custom-scrollbar">
                  {filteredCurrencies.map((curr) => (
                    <button
                      key={curr.code}
                      type="button"
                      onClick={() => {
                        onSelectCurrency(curr);
                        setIsCurrencyOpen(false);
                        setCurrencySearch('');
                      }}
                      className={`w-full text-start px-3 py-2 rounded-xl text-xs sm:text-sm flex items-center justify-between transition-all ${
                        selectedCurrency.code === curr.code
                          ? 'bg-[#D4AF37] text-[#02130D] font-black'
                          : 'text-[#F8F3E7] hover:bg-[#073D2F] hover:text-[#D4AF37]'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className="font-bold text-[#D4AF37] min-w-[36px] inline-block">{curr.code}</span>
                        <span className="text-xs">{curr.name}</span>
                      </span>
                      <span className="font-bold px-1.5 py-0.5 rounded bg-[#02130D]/40 text-[#D4AF37]">
                        {curr.symbol}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 3. زر الإعدادات المركزية ولوحة التحكم */}
          <button
            type="button"
            title={selectedLang.code === 'ar' ? 'الإعدادات المركزية ولوحة التحكم' : 'Central Settings & Dashboard'}
            onClick={() => onNavigateView('settings')}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border-2 border-[#D4AF37] bg-gradient-to-b from-[#021A12] to-[#03291F] text-[#D4AF37] hover:text-white flex items-center justify-center transition-all shadow-[0_0_15px_rgba(212,175,55,0.35)] hover:scale-110 cursor-pointer shrink-0"
          >
            <Settings className="w-5 h-5 text-[#D4AF37]" />
          </button>

        </div>

        {/* الشعار المحرابي المركزي المتداخل بدون أي تحريك أو تشويه */}
        <div className="absolute left-1/2 -translate-x-1/2 -top-6 lg:-top-9 z-30 flex flex-col items-center pointer-events-auto">
          <div className="relative w-44 sm:w-64 h-32 sm:h-40 bg-gradient-to-b from-[#021E15] to-[#01140E] border-2 border-[#D4AF37] rounded-t-[80px] rounded-b-[32px] flex flex-col items-center justify-center shadow-[0_16px_40px_rgba(0,0,0,0.95)] px-3 pt-3 sm:pt-4 pb-2">
            <div className="absolute inset-1.5 border border-[#D4AF37]/40 rounded-t-[72px] rounded-b-[26px] pointer-events-none" />
            <div className="absolute top-2 w-32 h-28 bg-[#D4AF37]/15 rounded-full blur-xl pointer-events-none" />
            <ArafatLogo size="sm" className="mb-0.5 sm:mb-1 scale-110" />
            <span className="text-xl sm:text-2xl font-black text-white tracking-wide drop-shadow-sm whitespace-nowrap">
              {selectedLang.code === 'ar' ? 'وطهر بيتي' : t.arafatTitle}
            </span>
            <span className="text-[8px] sm:text-[10px] text-[#D4AF37] font-semibold mt-0.5 whitespace-nowrap px-1 text-center">
              {t.tagline}
            </span>
          </div>

          <div className="w-5 h-5 sm:w-6 sm:h-6 text-[#D4AF37] -mt-2.5 sm:-mt-3 z-40 drop-shadow-[0_0_10px_rgba(212,175,55,0.9)]">
            <svg viewBox="0 0 24 24" className="w-full h-full fill-current">
              <path d="M12 0l3 8 8 3-8 3-3 8-3-8-8-3 8-3z" />
            </svg>
          </div>
        </div>

        {/* الجانب الثاني: رؤيتنا | رسالتنا | تواصل معنا | زر المستخدم المطور */}
        <div className="flex items-center gap-2.5 sm:gap-4 z-20">
          <nav className="hidden lg:flex items-center gap-3.5 text-sm font-bold text-[#F8F3E7]">
            <button
              type="button"
              onClick={() => onNavigateView('about')}
              className="hover:text-[#D4AF37] transition-colors whitespace-nowrap cursor-pointer bg-transparent border-none text-[#F8F3E7] font-bold"
            >
              {t.vision}
            </button>
            <span className="text-[#D4AF37]/40">|</span>
            <button
              type="button"
              onClick={() => onNavigateView('about')}
              className="hover:text-[#D4AF37] transition-colors whitespace-nowrap cursor-pointer bg-transparent border-none text-[#F8F3E7] font-bold"
            >
              {t.mission}
            </button>
            <span className="text-[#D4AF37]/40">|</span>
            <button
              type="button"
              onClick={onOpenContactModal}
              className="hover:text-[#D4AF37] transition-colors whitespace-nowrap cursor-pointer bg-transparent border-none text-[#D4AF37] font-bold flex items-center gap-1.5"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>{selectedLang.code === 'ar' ? 'تواصل معنا' : 'Contact Us'}</span>
            </button>
          </nav>

          <button
            type="button"
            onClick={onOpenUserModal}
            title={userProfile?.isLoggedIn ? `حساب: ${userProfile.name}` : t.myAccount}
            className="flex items-center gap-1.5 sm:gap-2 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full border border-[#D4AF37] bg-[#021A12]/90 hover:bg-[#073D2F] text-xs sm:text-sm font-bold text-[#F8F3E7] transition-all cursor-pointer shadow-[0_0_15px_rgba(212,175,55,0.25)] hover:scale-105"
          >
            <div className="w-5 h-5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center text-[#D4AF37] shrink-0">
              <User className="w-3 h-3" />
            </div>
            <span className="max-w-[120px] sm:max-w-[170px] truncate text-white font-bold">
              {userProfile?.isLoggedIn && userProfile?.name
                ? userProfile.name
                : t.myAccount}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
          </button>
        </div>

      </div>
    </header>
  );
};

export default ArafatHeader;
