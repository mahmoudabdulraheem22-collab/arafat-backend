import React, { useState, useRef, useEffect } from 'react';
import {
  User,
  Globe,
  Coins,
  Sparkles,
  ChevronDown,
  Search,
  Check,
  Mail,
  Siren,
  PhoneCall,
  MapPin,
  Send,
  X,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  ShieldAlert,
  Clock,
  Bell,
  Moon,
  Sun,
  BookOpen,
  Calendar,
  CalendarDays,
  ArrowRightLeft,
  Copy,
  Headphones,
  Compass,
} from 'lucide-react';
import { LANGUAGES, LanguageOption, Translations } from '../../data/languages';
import { CURRENCIES, CurrencyOption } from '../../data/currencies';
import { ArafatLogo } from '../common/ArafatLogo';
import { UserProfile } from '../views/UserProfileModal';
import { LanguageSwitcher } from '../common/LanguageSwitcher';

interface ArafatHeaderProps {
  selectedLang: LanguageOption;
  onSelectLang: (lang: LanguageOption) => void;
  selectedCurrency: CurrencyOption;
  onSelectCurrency: (curr: CurrencyOption) => void;
  onOpenAskModal: () => void;
  onOpenUserModal: () => void;
  onOpenContactModal?: () => void;
  onOpenNotificationCenter?: () => void;
  onOpenQiblaModal?: () => void;
  unreadNotificationCount?: number;
  onNavigateView: (view: string) => void;
  userProfile?: UserProfile;
  t: Translations;
  isNightMode?: boolean;
  onToggleNightMode?: () => void;
  isReadingMode?: boolean;
  onToggleReadingMode?: () => void;
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
  onOpenNotificationCenter,
  onOpenQiblaModal,
  unreadNotificationCount = 0,
  onNavigateView,
  userProfile,
  t,
  isNightMode = false,
  onToggleNightMode,
  isReadingMode = false,
  onToggleReadingMode,
}) => {
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const [currencySearch, setCurrencySearch] = useState('');

  // حالات أداة تحويل ومفتاح تبديل التاريخ الهجري والميلادي الحية
  const [headerDateMode, setHeaderDateMode] = useState<'hijri' | 'gregorian'>('hijri');
  const [isHijriModalOpen, setIsHijriModalOpen] = useState(false);
  const [converterGregDate, setConverterGregDate] = useState<string>(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  });
  const [isCopied, setIsCopied] = useState(false);

  // حالات زر الطوارئ وإرسال الموقع الجغرافي
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number; accuracy?: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationNote, setLocationNote] = useState<string | null>(null);
  const [sosSentSuccess, setSosSentSuccess] = useState(false);

  const handleOpenEmergency = () => {
    setIsEmergencyModalOpen(true);
    setSosSentSuccess(false);
    setLocationNote(null);
    setIsLocating(true);

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
          });
          setIsLocating(false);
        },
        (error) => {
          // Fallback to Makkah Al-Haram reference location
          setUserLocation({ lat: 21.4225, lng: 39.8262, accuracy: 20 });
          setLocationNote('تم تحديد الموقع الجغرافي المرجعي في نطاق الحرم المكي الشريف.');
          setIsLocating(false);
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    } else {
      setUserLocation({ lat: 21.4225, lng: 39.8262, accuracy: 20 });
      setIsLocating(false);
    }
  };

  const handleSendLocationToSupport = () => {
    const lat = userLocation?.lat || 21.4225;
    const lng = userLocation?.lng || 39.8262;
    const mapUrl = `https://maps.google.com/?q=${lat},${lng}`;
    const name = userProfile?.name || 'حاج / معتمر';
    const campaign = userProfile?.campaignLeader || 'حملة عرفات المعتمدة';
    const msg = `🚨 *نداء استغاثة وطوارئ من منصة عرفات* 🚨\nالاسم: ${name}\nالحملة: ${campaign}\nالموقع الحالي على الخريطة:\n${mapUrl}`;
    
    // Open WhatsApp / Share URL
    const waUrl = `https://wa.me/966500000000?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, '_blank');
    setSosSentSuccess(true);
  };

  // دالة تحويل التاريخ الميلادي إلى الهجري المباشر (تقويم أم القرى)
  const getHijriFromGregorian = (gregDateStr: string, isAr: boolean) => {
    try {
      const parts = gregDateStr.split('-');
      if (parts.length !== 3) return { fullString: '', occasionNote: '' };
      const dateObj = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));

      const locale = isAr ? 'ar-SA-u-ca-islamic-umaqura' : 'en-US-u-ca-islamic-umaqura';
      const formatter = new Intl.DateTimeFormat(locale, {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });

      const fullString = formatter.format(dateObj);

      const dayStr = new Intl.DateTimeFormat('en-US-u-ca-islamic-umaqura', { day: 'numeric' }).format(dateObj);
      const monthStr = new Intl.DateTimeFormat('en-US-u-ca-islamic-umaqura', { month: 'numeric' }).format(dateObj);
      const day = parseInt(dayStr, 10);
      const month = parseInt(monthStr, 10);

      let occasionNote = '';
      if (month === 12 && day === 9) {
        occasionNote = isAr ? 'يوم عرفة المبارك 🕋' : 'Day of Arafah 🕋';
      } else if (month === 12 && (day >= 10 && day <= 13)) {
        occasionNote = isAr ? 'أيام عيد الأضحى المبارك والمناسك 🐑' : 'Eid Al-Adha Days 🐑';
      } else if (month === 9) {
        occasionNote = isAr ? 'شهر رمضان المبارك 🌙' : 'Blessed Ramadan 🌙';
      } else if (month === 12 && day === 8) {
        occasionNote = isAr ? 'يوم التروية بمشعر منى ⛺' : 'Day of Tarwiyah at Mina ⛺';
      } else if (month === 1 && day === 1) {
        occasionNote = isAr ? 'رأس السنة الهجرية 🕌' : 'Hijri New Year 🕌';
      }

      return { fullString, occasionNote };
    } catch {
      return {
        fullString: isAr ? 'تاريخ هجري تحويلي' : 'Converted Hijri Date',
        occasionNote: '',
      };
    }
  };

  const makkahTodayDate = new Date();
  const todayHijriObj = getHijriFromGregorian(
    `${makkahTodayDate.getFullYear()}-${String(makkahTodayDate.getMonth() + 1).padStart(2, '0')}-${String(makkahTodayDate.getDate()).padStart(2, '0')}`,
    selectedLang.code === 'ar'
  );
  const convertedResult = getHijriFromGregorian(converterGregDate, selectedLang.code === 'ar');

  // دالة حساب التاريخ المباشر المقترن بالموقع الجغرافي لمكة المكرمة (توقيت مكة UTC+3 وتقويم أم القرى)
  const getMakkahLiveFormattedDate = (mode: 'hijri' | 'gregorian', isAr: boolean) => {
    try {
      const now = new Date();
      if (mode === 'hijri') {
        const locale = isAr ? 'ar-SA-u-ca-islamic-umaqura' : 'en-US-u-ca-islamic-umaqura';
        return new Intl.DateTimeFormat(locale, {
          timeZone: 'Asia/Riyadh',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        }).format(now);
      } else {
        const locale = isAr ? 'ar-SA' : 'en-US';
        return new Intl.DateTimeFormat(locale, {
          timeZone: 'Asia/Riyadh',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        }).format(now);
      }
    } catch {
      return mode === 'hijri'
        ? (isAr ? '9 ذو الحجة 1447 هـ' : '9 Dhul-Hijjah 1447 AH')
        : (isAr ? '28 يوليو 2026 م' : '28 July 2026 AD');
    }
  };

  const currentHeaderDateDisplay = getMakkahLiveFormattedDate(headerDateMode, selectedLang.code === 'ar');

  const currencyDropdownRef = useRef<HTMLDivElement>(null);

  // إغلاق القوائم عند النقر الخارج عن العنصر
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (currencyDropdownRef.current && !currencyDropdownRef.current.contains(event.target as Node)) {
        setIsCurrencyOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
          
          {/* 1. مكون مبدل اللغات الفاخر (Language Switcher) */}
          <LanguageSwitcher selectedLang={selectedLang} onSelectLang={onSelectLang} />

          {/* 2. قائمة اختيار العملة (20 عملة) */}
          <div className="relative" ref={currencyDropdownRef}>
            <button
              type="button"
              title="تغيير العملة"
              onClick={() => {
                setIsCurrencyOpen(!isCurrencyOpen);
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

          {/* 3. زر مركز الإشعارات والتنبيهات المباشرة */}
          <button
            type="button"
            title={selectedLang.code === 'ar' ? 'مركز الإشعارات وتنبيهات الصلاة والحملة' : 'Notification Center & Prayer Reminders'}
            onClick={onOpenNotificationCenter}
            className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full border-2 border-[#D4AF37] bg-gradient-to-b from-[#021A12] via-[#03291F] to-[#01140E] text-[#D4AF37] hover:text-white flex items-center justify-center transition-all shadow-[0_0_18px_rgba(212,175,55,0.45)] hover:scale-110 cursor-pointer shrink-0"
          >
            <Bell className="w-5 h-5 text-[#D4AF37]" />
            {unreadNotificationCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-600 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-[#02130D] animate-bounce">
                {unreadNotificationCount > 9 ? '+9' : unreadNotificationCount}
              </span>
            )}
          </button>

          {/* 4. زر مواقيت الصلاة والأذان المباشر */}
          <button
            type="button"
            title={selectedLang.code === 'ar' ? 'مواقيت الصلاة والتنبيهات الصوتية في المشاعر المقدسة' : 'Sacred Sites Prayer Times & Audio Alerts'}
            onClick={() => {
              window.scrollTo({ top: 750, behavior: 'smooth' });
            }}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border-2 border-[#D4AF37] bg-gradient-to-b from-[#021A12] via-[#03291F] to-[#01140E] text-[#D4AF37] hover:text-white flex items-center justify-center transition-all shadow-[0_0_15px_rgba(212,175,55,0.4)] hover:scale-110 cursor-pointer shrink-0"
          >
            <Clock className="w-5 h-5 text-[#D4AF37]" />
          </button>

          {/* 4.01 زر المكتبة الصوتية والاستماع إلى التلاوات القران الكريم والإذاعة المباشرة */}
          <button
            type="button"
            title={selectedLang.code === 'ar' ? 'المكتبة الصوتية وتلاوات القرآن الكريم وإذاعة مكة المباشرة' : 'Audio Library, Quran Recitations & Makkah Live Radio'}
            onClick={() => onNavigateView('athkar')}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border-2 border-[#D4AF37] bg-gradient-to-b from-[#021A12] via-[#03291F] to-[#01140E] text-[#D4AF37] hover:text-white flex items-center justify-center transition-all shadow-[0_0_18px_rgba(212,175,55,0.5)] hover:scale-110 cursor-pointer shrink-0 animate-pulse"
          >
            <Headphones className="w-5 h-5 text-[#D4AF37]" />
          </button>

          {/* 4.02 زر بوصلة القبلة الذكية والتحديد المباشر لاتجاه الكعبة */}
          <button
            type="button"
            title={selectedLang.code === 'ar' ? 'أداة بوصلة القبلة الذكية والمستشعرات الفلكية' : 'Smart Qibla Compass & Kaaba Direction Tool'}
            onClick={() => {
              if (onOpenQiblaModal) {
                onOpenQiblaModal();
              }
            }}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border-2 border-[#D4AF37] bg-gradient-to-b from-[#021A12] via-[#03291F] to-[#01140E] text-[#D4AF37] hover:text-white flex items-center justify-center transition-all shadow-[0_0_18px_rgba(212,175,55,0.5)] hover:scale-110 cursor-pointer shrink-0"
          >
            <Compass className="w-5 h-5 text-[#D4AF37]" />
          </button>

          {/* 4.1 زر وتقويم التاريخ الهجري والميلادي (شكل التقويم بأسلوبه الناعم هـ / م) */}
          <div className="flex items-center gap-1.5 bg-gradient-to-b from-[#021A12] via-[#03291F] to-[#01140E] border-2 border-[#D4AF37] rounded-full p-1 sm:p-1.5 shadow-[0_0_15px_rgba(212,175,55,0.35)] shrink-0">
            {/* أيقونة التقويم وتفتح أداة المحول عند الضغط عليها */}
            <button
              type="button"
              title={
                selectedLang.code === 'ar'
                  ? 'عرض محول التاريخ الهجري والميلادي المباشر'
                  : 'Open Hijri & Gregorian Date Converter'
              }
              onClick={() => setIsHijriModalOpen(true)}
              className="p-1 hover:scale-110 text-[#D4AF37] transition-all cursor-pointer flex items-center justify-center"
            >
              <CalendarDays className="w-5 h-5 text-[#D4AF37] shrink-0" />
            </button>

            {/* أزرار التبديل السريع هـ / م */}
            <div className="flex items-center bg-[#01140E] border border-[#D4AF37]/60 rounded-full p-0.5 dir-ltr shadow-inner">
              <button
                type="button"
                onClick={() => setHeaderDateMode('hijri')}
                title={
                  selectedLang.code === 'ar'
                    ? 'التبديل للتاريخ الهجري (تقويم أم القرى)'
                    : 'Switch to Hijri Date'
                }
                className={`px-2 py-0.5 rounded-full text-xs font-black transition-all cursor-pointer ${
                  headerDateMode === 'hijri'
                    ? 'bg-[#D4AF37] text-[#02130D] shadow-md scale-105'
                    : 'text-[#D4AF37]/70 hover:text-white'
                }`}
              >
                {selectedLang.code === 'ar' ? 'هـ' : 'AH'}
              </button>
              <button
                type="button"
                onClick={() => setHeaderDateMode('gregorian')}
                title={
                  selectedLang.code === 'ar'
                    ? 'التبديل للتاريخ الميلادي'
                    : 'Switch to Gregorian Date'
                }
                className={`px-2 py-0.5 rounded-full text-xs font-black transition-all cursor-pointer ${
                  headerDateMode === 'gregorian'
                    ? 'bg-emerald-500 text-[#02130D] shadow-md scale-105'
                    : 'text-emerald-400/70 hover:text-white'
                }`}
              >
                {selectedLang.code === 'ar' ? 'م' : 'AD'}
              </button>
            </div>
          </div>

          {/* 4. زر الطوارئ والاستغاثة العاجلة SOS */}
          <button
            type="button"
            title={selectedLang.code === 'ar' ? 'نداء استغاثة عاجل وإرسال الموقع لمركز المساعدة' : 'Emergency SOS & Send Location'}
            onClick={handleOpenEmergency}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border-2 border-rose-400 bg-gradient-to-b from-rose-600 via-rose-700 to-rose-900 text-white hover:bg-rose-500 flex items-center justify-center transition-all shadow-[0_0_22px_rgba(225,29,72,0.8)] hover:scale-110 cursor-pointer shrink-0 animate-pulse"
          >
            <Siren className="w-5.5 h-5.5 text-white" />
          </button>

          {/* 5. زر تفعيل/إيقاف الوضع الليلي لحماية العين أثناء التهجد */}
          <button
            type="button"
            title={
              selectedLang.code === 'ar'
                ? isNightMode
                  ? 'إيقاف الوضع الليلي (العودة للنمط العادي)'
                  : 'تفعيل الوضع الليلي (وضع التهجد لحماية العينين)'
                : isNightMode
                  ? 'Disable Night Mode'
                  : 'Enable Night Mode (Eye Protection)'
            }
            onClick={onToggleNightMode}
            className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full border-2 transition-all flex items-center justify-center cursor-pointer shrink-0 hover:scale-110 ${
              isNightMode
                ? 'border-amber-400 bg-gradient-to-b from-amber-950 via-amber-900 to-black text-amber-300 shadow-[0_0_22px_rgba(251,191,36,0.7)] animate-pulse'
                : 'border-[#D4AF37] bg-gradient-to-b from-[#021A12] to-[#03291F] text-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.35)] hover:text-white'
            }`}
          >
            {isNightMode ? (
              <Sun className="w-5 h-5 text-amber-300 animate-spin-slow" />
            ) : (
              <Moon className="w-5 h-5 text-[#D4AF37]" />
            )}
          </button>

          {/* 6. زر نمط القراءة المريح لضيوف الرحمن (تكبير الخط وتباعد الأسطر) */}
          <button
            type="button"
            title={
              selectedLang.code === 'ar'
                ? isReadingMode
                  ? 'إيقاف نمط القراءة (العودة للحجم العادي)'
                  : 'تفعيل نمط القراءة (تكبير الخط وزيادة التباعد)'
                : isReadingMode
                  ? 'Disable Reading Mode'
                  : 'Enable Reading Mode (Larger text & Line Spacing)'
            }
            onClick={onToggleReadingMode}
            className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full border-2 transition-all flex items-center justify-center cursor-pointer shrink-0 hover:scale-110 ${
              isReadingMode
                ? 'border-emerald-400 bg-gradient-to-b from-emerald-900 via-emerald-950 to-black text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.7)]'
                : 'border-[#D4AF37] bg-gradient-to-b from-[#021A12] to-[#03291F] text-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.35)] hover:text-white'
            }`}
          >
            <BookOpen className={`w-5 h-5 ${isReadingMode ? 'text-emerald-300 scale-110' : 'text-[#D4AF37]'}`} />
          </button>

        </div>

        {/* الشعار المحرابي المركزي للمنصة في المنتصف */}
        <div
          onClick={() => onNavigateView('home')}
          title={selectedLang.code === 'ar' ? 'منصة عرفات - الصفحة الرئيسية' : 'Arafat Platform - Home'}
          className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center z-30 cursor-pointer group"
        >
          <div className="relative p-1.5 rounded-2xl bg-gradient-to-b from-[#021811] via-[#03291F] to-[#01140E] border-2 border-[#D4AF37] shadow-[0_0_25px_rgba(212,175,55,0.5)] group-hover:scale-110 transition-all duration-300">
            <ArafatLogo size="md" />
          </div>
          <span className="text-[11px] font-black text-[#D4AF37] group-hover:text-white transition-colors mt-0.5 tracking-widest font-serif uppercase">
            {selectedLang.code === 'ar' ? 'عرفات' : 'ARAFAT'}
          </span>
        </div>

        {/* الجانب الثاني: رؤيتنا | رسالتنا | تواصل معنا | زر المستخدم المطور */}
        <div className="flex items-center gap-2.5 sm:gap-4 z-20">
          <nav className="hidden lg:flex items-center gap-3.5 text-sm font-bold text-[#F8F3E7]">
            <button
              type="button"
              onClick={() => onNavigateView('why_arafat')}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#02130D]/80 border border-[#D4AF37]/60 hover:border-[#D4AF37] hover:bg-[#073D2F] transition-all cursor-pointer text-[#D4AF37] font-bold shadow-[0_0_10px_rgba(212,175,55,0.2)] shrink-0"
              title={selectedLang.code === 'ar' ? 'لماذا عرفات؟' : 'Why Arafat?'}
            >
              <ArafatLogo size="xs" />
              <span className="text-xs sm:text-sm font-black text-[#D4AF37] hover:text-white transition-colors">
                {selectedLang.code === 'ar' ? 'لماذا عرفات؟' : 'Why Arafat?'}
              </span>
            </button>
            <span className="text-[#D4AF37]/40">|</span>
            <button
              type="button"
              onClick={() => onNavigateView('about')}
              className="hover:text-[#D4AF37] transition-colors whitespace-nowrap cursor-pointer bg-transparent border-none text-[#F8F3E7] font-bold"
            >
              {selectedLang.code === 'ar' ? 'من نحن' : 'Who We Are'}
            </button>
            <span className="text-[#D4AF37]/40">|</span>
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

      {/* نافذة الطوارئ ونداء الاستغاثة المعتمد */}
      {isEmergencyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn text-[#F8F3E7]">
          <div className="bg-[#02130D] border-2 border-rose-500 rounded-3xl max-w-lg w-full p-5 sm:p-6 space-y-4 shadow-[0_0_50px_rgba(225,29,72,0.6)] relative overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-rose-500/30 pb-3">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-rose-600/20 border border-rose-500 text-rose-400 animate-bounce">
                  <Siren className="w-6 h-6 text-rose-400" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-rose-400 flex items-center gap-2">
                    <span>{selectedLang.code === 'ar' ? 'مركز طوارئ وإستغاثة الحجاج' : 'Emergency & SOS Center'}</span>
                  </h3>
                  <p className="text-xs text-[#F8F3E7]/80 mt-0.5">
                    {selectedLang.code === 'ar' ? 'إرسال موقعك الجغرافي الفوري لمركز المساعدة والخدمات الطبية' : 'Direct location transmission to emergency response center'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsEmergencyModalOpen(false)}
                className="p-2 text-gray-400 hover:text-white rounded-full bg-[#01140E] border border-rose-500/30 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Location Status Card */}
            <div className="p-4 rounded-2xl bg-[#03291F] border border-rose-500/40 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-[#D4AF37]">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-rose-400" />
                  <span>{selectedLang.code === 'ar' ? 'إحداثيات موقعك الجغرافي:' : 'Your Location Coordinates:'}</span>
                </span>
                {isLocating && <Loader2 className="w-4 h-4 text-[#D4AF37] animate-spin" />}
              </div>

              {isLocating ? (
                <p className="text-xs text-amber-300 font-medium py-1 animate-pulse">
                  {selectedLang.code === 'ar' ? 'جاري تحديد موقعك بدقة عبر أجهزة الـ GPS...' : 'Acquiring GPS location...'}
                </p>
              ) : userLocation ? (
                <div className="space-y-1">
                  <p className="text-sm font-mono font-bold text-white dir-ltr text-right bg-[#01140E] p-2.5 rounded-xl border border-[#D4AF37]/30">
                    LAT: {userLocation.lat.toFixed(5)}, LNG: {userLocation.lng.toFixed(5)}
                  </p>
                  {locationNote && (
                    <p className="text-[11px] text-amber-300">{locationNote}</p>
                  )}
                </div>
              ) : null}
            </div>

            {/* Success Banner if sent */}
            {sosSentSuccess && (
              <div className="p-3 rounded-2xl bg-emerald-950/80 border border-emerald-500 text-emerald-300 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>
                  {selectedLang.code === 'ar'
                    ? 'تم توجيه بلاغ الاستغاثة مع موقعك بنجاح لغرفة العمليات ومركز المساعدة!'
                    : 'SOS call & location successfully transmitted to help center!'}
                </span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-2 pt-1">
              <button
                onClick={handleSendLocationToSupport}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-800 hover:from-rose-500 hover:to-rose-700 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg cursor-pointer transition-all border border-rose-400"
              >
                <Send className="w-4 h-4" />
                <span>
                  {selectedLang.code === 'ar'
                    ? 'إرسال موقعي الجغرافي لمركز المساعدة المعتمد'
                    : 'Send My Location to Help Center'}
                </span>
              </button>

              <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                <a
                  href="tel:997"
                  className="py-2.5 px-3 rounded-xl bg-[#01140E] border border-rose-500/50 hover:bg-rose-950 text-rose-300 flex items-center justify-center gap-1.5 text-center"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>{selectedLang.code === 'ar' ? 'الإسعاف (997)' : 'Red Crescent (997)'}</span>
                </a>
                <a
                  href="tel:911"
                  className="py-2.5 px-3 rounded-xl bg-[#01140E] border border-rose-500/50 hover:bg-rose-950 text-rose-300 flex items-center justify-center gap-1.5 text-center"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>{selectedLang.code === 'ar' ? 'الطوارئ الأمنية (911)' : 'Security SOS (911)'}</span>
                </a>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="text-[10px] text-gray-400 text-center border-t border-rose-500/20 pt-2 flex items-center justify-center gap-1">
              <ShieldAlert className="w-3 h-3 text-rose-400 shrink-0" />
              <span>
                {selectedLang.code === 'ar'
                  ? 'خدمة الطوارئ متصلة مباشرة بالجهات الرسمية وبعثة الحج المعتمدة'
                  : 'Connected directly to accredited official Hajj emergency services'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* نافذة أداة تحويل التاريخ الميلادي إلى الهجري الحية - تقويم أم القرى */}
      {isHijriModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-lg bg-gradient-to-b from-[#021A12] via-[#03291F] to-[#01140E] border-2 border-[#D4AF37] rounded-3xl p-5 sm:p-6 shadow-[0_25px_60px_rgba(0,0,0,0.9)] text-[#F8F3E7] space-y-4 sm:space-y-5">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#D4AF37]/30 pb-3 sm:pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-[#D4AF37]/20 border border-[#D4AF37] text-[#D4AF37]">
                  <CalendarDays className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-white">
                    {selectedLang.code === 'ar' ? 'أداة تحويل التاريخ الميلادي إلى الهجري' : 'Gregorian to Hijri Date Converter'}
                  </h3>
                  <p className="text-xs text-[#D4AF37] font-bold">
                    {selectedLang.code === 'ar' ? 'معتمد رسمياً بموجب تقويم أم القرى بمكة المكرمة' : 'Official Umm Al-Qura Calendar (Makkah)'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsHijriModalOpen(false)}
                className="p-2 rounded-xl bg-[#01140E] border border-gray-600 hover:border-[#D4AF37] text-gray-300 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Current Makkah Date Card */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-[#01140E] border border-[#D4AF37]/50 shadow-inner space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-[#D4AF37]">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>{selectedLang.code === 'ar' ? 'التاريخ الهجري المباشر اليوم في مكة:' : 'Today\'s Live Makkah Hijri Date:'}</span>
                </span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px]">
                  {selectedLang.code === 'ar' ? 'حي ومباشر 🟢' : 'Live UTC+3 🟢'}
                </span>
              </div>
              <p className="text-base sm:text-lg font-black text-white font-mono">
                {todayHijriObj.fullString}
              </p>
              {todayHijriObj.occasionNote && (
                <div className="inline-block px-2.5 py-1 rounded-lg bg-[#D4AF37] text-[#02130D] text-xs font-black">
                  {todayHijriObj.occasionNote}
                </div>
              )}
            </div>

            {/* Interactive Gregorian Date Picker Form */}
            <div className="space-y-3 bg-[#02130D]/90 p-3.5 sm:p-4 rounded-2xl border border-[#D4AF37]/30">
              <label className="block text-xs font-bold text-[#D4AF37]">
                {selectedLang.code === 'ar' ? 'اختر التاريخ الميلادي للتحويل الفوري:' : 'Select Gregorian Date for Live Conversion:'}
              </label>

              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={converterGregDate}
                  onChange={(e) => setConverterGregDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#01140E] border border-[#D4AF37]/60 text-white font-mono font-bold text-sm focus:outline-none focus:border-[#D4AF37] shadow-sm dir-ltr cursor-pointer"
                />

                <button
                  type="button"
                  onClick={() => {
                    const today = new Date();
                    const yyyy = today.getFullYear();
                    const mm = String(today.getMonth() + 1).padStart(2, '0');
                    const dd = String(today.getDate()).padStart(2, '0');
                    setConverterGregDate(`${yyyy}-${mm}-${dd}`);
                  }}
                  className="px-3 py-2.5 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#02130D] text-xs font-black transition-all whitespace-nowrap cursor-pointer"
                  title={selectedLang.code === 'ar' ? 'العودة لليوم' : 'Reset to Today'}
                >
                  {selectedLang.code === 'ar' ? 'اليوم' : 'Today'}
                </button>
              </div>

              {/* Conversion Result Display */}
              <div className="mt-3 p-3.5 sm:p-4 rounded-xl bg-[#01140E] border-2 border-[#D4AF37] text-center space-y-2 relative overflow-hidden shadow-lg">
                <p className="text-xs font-bold text-[#D4AF37]">
                  {selectedLang.code === 'ar' ? 'التاريخ الهجري المقابل (تقويم أم القرى):' : 'Converted Hijri Date (Umm Al-Qura):'}
                </p>

                <p className="text-base sm:text-xl font-black text-white font-mono leading-relaxed">
                  {convertedResult.fullString}
                </p>

                {convertedResult.occasionNote && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400 text-xs font-black">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>{convertedResult.occasionNote}</span>
                  </div>
                )}

                {/* Copy Button */}
                <div className="pt-2 flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(convertedResult.fullString);
                      setIsCopied(true);
                      setTimeout(() => setIsCopied(false), 2500);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-[#021A12] border border-[#D4AF37]/60 text-xs font-bold text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#02130D] flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{selectedLang.code === 'ar' ? 'تم نسخ التاريخ بنجاح!' : 'Copied!'}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>{selectedLang.code === 'ar' ? 'نسخ التاريخ الهجري' : 'Copy Hijri Date'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Hajj & Islamic Occasion Shortcuts */}
            <div className="space-y-2">
              <p className="text-xs font-black text-[#D4AF37]">
                {selectedLang.code === 'ar' ? 'اختصارات سريعة لمواسم الحج والمناسبات:' : 'Quick Hajj & Sacred Occasions:'}
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setConverterGregDate('2026-05-25')}
                  className="p-2 rounded-xl bg-[#01140E] border border-[#D4AF37]/40 hover:border-[#D4AF37] text-gray-200 hover:text-[#D4AF37] text-start transition-all cursor-pointer"
                >
                  <span>⛺ {selectedLang.code === 'ar' ? 'يوم التروية (8 ذو الحجة)' : 'Day of Tarwiyah'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setConverterGregDate('2026-05-26')}
                  className="p-2 rounded-xl bg-[#01140E] border border-[#D4AF37]/40 hover:border-[#D4AF37] text-gray-200 hover:text-[#D4AF37] text-start transition-all cursor-pointer"
                >
                  <span>🕋 {selectedLang.code === 'ar' ? 'يوم عرفة (9 ذو الحجة)' : 'Day of Arafah'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setConverterGregDate('2026-05-27')}
                  className="p-2 rounded-xl bg-[#01140E] border border-[#D4AF37]/40 hover:border-[#D4AF37] text-gray-200 hover:text-[#D4AF37] text-start transition-all cursor-pointer"
                >
                  <span>🐑 {selectedLang.code === 'ar' ? 'عيد الأضحى (10 ذو الحجة)' : 'Eid Al-Adha'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setConverterGregDate('2026-02-18')}
                  className="p-2 rounded-xl bg-[#01140E] border border-[#D4AF37]/40 hover:border-[#D4AF37] text-gray-200 hover:text-[#D4AF37] text-start transition-all cursor-pointer"
                >
                  <span>🌙 {selectedLang.code === 'ar' ? 'أول رمضان 1447 هـ' : '1st Ramadan 1447'}</span>
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-2 border-t border-[#D4AF37]/20 text-center">
              <button
                type="button"
                onClick={() => setIsHijriModalOpen(false)}
                className="w-full py-3 rounded-2xl bg-[#D4AF37] hover:bg-[#c39f2e] text-[#02130D] font-black text-sm shadow-md transition-all cursor-pointer"
              >
                {selectedLang.code === 'ar' ? 'إغلاق المحول' : 'Close Converter'}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default ArafatHeader;