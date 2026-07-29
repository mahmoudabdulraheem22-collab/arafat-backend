import React, { useState } from 'react';
import {
  ArrowLeft,
  Settings,
  Globe,
  Volume2,
  VolumeX,
  Coins,
  Languages,
  Sparkles,
  Check,
  Search,
  Sliders,
  Play,
  RotateCcw,
  Zap,
  Building2,
  ShieldCheck,
  BookOpen,
  Wallet,
  Sun,
  Activity,
  ChevronRight,
  LayoutDashboard,
  Compass,
} from 'lucide-react';
import { LANGUAGES, LanguageOption } from '../../data/languages';
import { CURRENCIES, CurrencyOption } from '../../data/currencies';
import { useSpeechSynthesis } from '../../hooks/useSpeechSynthesis';
import { LanguageSwitcher } from '../common/LanguageSwitcher';

interface SettingsViewProps {
  language: LanguageOption;
  onSelectLanguage: (lang: LanguageOption) => void;
  currency: CurrencyOption;
  onSelectCurrency: (curr: CurrencyOption) => void;
  onBack: () => void;
  onNavigateView: (view: string) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  language,
  onSelectLanguage,
  currency,
  onSelectCurrency,
  onBack,
  onNavigateView,
}) => {
  const isAr = language.code === 'ar';
  const { isMuted, toggleMute, speak, isSpeaking } = useSpeechSynthesis();

  const [langSearch, setLangSearch] = useState('');
  const [currencySearch, setCurrencySearch] = useState('');
  const [speechRate, setSpeechRate] = useState<number>(() => {
    return parseFloat(localStorage.getItem('arafat_speech_rate') || '1.0');
  });
  const [autoReadChat, setAutoReadChat] = useState<boolean>(() => {
    return localStorage.getItem('arafat_auto_read_chat') === 'true';
  });

  const [activeTab, setActiveTab] = useState<'all' | 'language' | 'audio' | 'currency' | 'shortcuts'>('all');

  const filteredLanguages = LANGUAGES.filter(
    (l) =>
      l.name.toLowerCase().includes(langSearch.toLowerCase()) ||
      l.nativeName.toLowerCase().includes(langSearch.toLowerCase()) ||
      l.code.toLowerCase().includes(langSearch.toLowerCase())
  );

  const filteredCurrencies = CURRENCIES.filter(
    (c) =>
      c.name.toLowerCase().includes(currencySearch.toLowerCase()) ||
      c.code.toLowerCase().includes(currencySearch.toLowerCase()) ||
      c.symbol.toLowerCase().includes(currencySearch.toLowerCase())
  );

  const handleSpeechRateChange = (rate: number) => {
    setSpeechRate(rate);
    localStorage.setItem('arafat_speech_rate', rate.toString());
  };

  const handleAutoReadToggle = () => {
    const nextVal = !autoReadChat;
    setAutoReadChat(nextVal);
    localStorage.setItem('arafat_auto_read_chat', String(nextVal));
  };

  const handleTestVoice = () => {
    const sampleText = isAr
      ? 'أهلاً بك في منصة عرفات لخدمة ضيوف الرحمن. نطق الصوت يعمل بنجاح.'
      : 'Welcome to Arafat platform for Pilgrims. Voice synthesis test successful.';
    speak(sampleText, language.code);
  };

  const shortcuts = [
    {
      id: 'trip_dashboard',
      title: isAr ? 'ملخص رحلة الحج (Trip Dashboard)' : 'Hajj Trip Dashboard',
      desc: isAr ? 'استعراض حالة الوصول، مراحل تقدم المجموعة، وجدول المواعيد والأحداث القادمة' : 'Summary of flight arrival, group progress, & scheduled events',
      icon: Compass,
      badge: isAr ? 'تفاعلي' : 'Live',
      badgeColor: 'bg-amber-500 text-black font-black',
    },
    {
      id: 'dashboard',
      title: isAr ? 'لوحة التحكم الرقمية' : 'Digital Dashboard',
      desc: isAr ? 'متابعة حالة الحجوزات، التصاريح، الميزانية، والتحكم الفوري بكافة إعدادات المنصة' : 'Overview of permits, budget, & active platform status',
      icon: LayoutDashboard,
      badge: isAr ? 'لوحة التحكم' : 'Dashboard',
      badgeColor: 'bg-emerald-500 text-white font-black',
    },
    {
      id: 'live_translation',
      title: isAr ? 'الترجمة الفورية المباشرة' : 'Live Interpreter',
      desc: isAr ? 'ترجمة صوتية ونصية فورية بين اللغات للحرم والفنادق' : 'Instant voice & text translation for Pilgrims',
      icon: Globe,
      badge: isAr ? 'جديد' : 'New',
      badgeColor: 'bg-emerald-500 text-white',
    },
    {
      id: 'ziyarat_tayyibah',
      title: isAr ? 'زيارة طيبة الطيبة' : 'Ziyarat Tayyibah Guide',
      desc: isAr ? 'دليل المسجد النبوي والروضة الشريفة وأدعية الزيارة' : 'Madinah, Prophet Mosque & Rawdah guide',
      icon: Building2,
      badge: isAr ? 'موصى به' : 'Featured',
      badgeColor: 'bg-amber-500 text-slate-950',
    },
    {
      id: 'permits',
      title: isAr ? 'إدارة واستعراض التصاريح' : 'Permits Management',
      desc: isAr ? 'استخراج واستعراض تصاريح العمرة والروضة الشريفة' : 'Manage Rawdah & Umrah permits',
      icon: ShieldCheck,
    },
    {
      id: 'guide',
      title: isAr ? 'دليل صفة المناسك' : 'Rituals Guide',
      desc: isAr ? 'خطوات العمرة والحج التفصيلية مع الأدعية المأثورة' : 'Step-by-step Umrah & Hajj guide',
      icon: BookOpen,
    },
    {
      id: 'budget',
      title: isAr ? 'حاسبة الميزانية الذكية' : 'Budget Calculator',
      desc: isAr ? 'تقدير تكاليف السكن والتنقلات والإعاشة بالريال والعملات' : 'Estimate accommodation & trip costs',
      icon: Wallet,
    },
    {
      id: 'athkar',
      title: isAr ? 'أذكاري والمسبحة' : 'My Athkar & Tasbeeh',
      desc: isAr ? 'أدعية الطواف والسعي والمسبحة الإلكترونية التفاعلية' : 'Tawaf prayers & electronic Tasbeeh',
      icon: Sun,
    },
    {
      id: 'health',
      title: isAr ? 'صحتي والطوارئ' : 'My Health & Emergency',
      desc: isAr ? 'أقرب مستشفى وصيدلية وطوارئ 997/911' : 'Nearby hospitals & emergency 997/911',
      icon: Activity,
    },
  ];

  return (
    <div className="bg-[#03291F]/95 border-2 border-[#D4AF37] rounded-3xl p-4 sm:p-8 text-[#F8F3E7] shadow-[0_15px_50px_rgba(0,0,0,0.8)] backdrop-blur-md max-w-5xl mx-auto my-4">
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-[#D4AF37]/30 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#02130D] border border-[#D4AF37] rounded-2xl text-[#D4AF37]">
            <Settings className="w-6 h-6 animate-spin-slow" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <span>{isAr ? 'الإعدادات المركزية وتفضيلات الصوت واللغة' : 'Central Settings & Audio Preferences'}</span>
              <Sparkles className="w-5 h-5 text-[#D4AF37]" />
            </h2>
            <p className="text-xs sm:text-sm text-[#D4AF37]/90 font-medium">
              {isAr
                ? 'تحكّم كامل بلغة المنصة، نطق الصوت، العملات، والوصول السريع للميزات الجديدة'
                : 'Full control over platform language, voice output, currency, & feature shortcuts'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 bg-[#02130D] hover:bg-[#073D2F] border border-[#D4AF37]/60 text-[#D4AF37] font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <ArrowLeft className={`w-4 h-4 ${isAr ? 'rotate-180' : ''}`} />
          <span>{isAr ? 'العودة' : 'Back'}</span>
        </button>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 mb-6 border-b border-[#D4AF37]/20">
        {[
          { id: 'all', label: isAr ? 'جميع الإعدادات' : 'All Settings', icon: Sliders },
          { id: 'dashboard_tab', label: isAr ? 'لوحة التحكم' : 'Dashboard', icon: LayoutDashboard },
          { id: 'language', label: isAr ? 'خيارات اللغة' : 'Language Options', icon: Languages },
          { id: 'audio', label: isAr ? 'تفضيلات الصوت' : 'Audio & Voice', icon: Volume2 },
          { id: 'currency', label: isAr ? 'العملة والتسعير' : 'Currency', icon: Coins },
          { id: 'shortcuts', label: isAr ? 'اختصارات الميزات' : 'Quick Shortcuts', icon: Zap },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === (tab.id as any);
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                if (tab.id === 'dashboard_tab') {
                  onNavigateView('dashboard');
                } else {
                  setActiveTab(tab.id as any);
                }
              }}
              className={`px-3.5 py-2 rounded-xl border text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 shrink-0 ${
                isActive
                  ? 'bg-[#D4AF37] text-[#02130D] border-[#D4AF37]'
                  : 'bg-[#02130D] text-[#D4AF37] border-[#D4AF37]/40 hover:bg-[#073D2F]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Prominent Dashboard Control Panel Header Banner */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-[#021811] via-[#03291F] to-[#073D2F] border-2 border-[#D4AF37] rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl mb-6">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-[#02130D] border border-[#D4AF37] rounded-2xl text-[#D4AF37]">
            <LayoutDashboard className="w-7 h-7 text-[#D4AF37]" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <span>{isAr ? 'لوحة التحكم الرقمية للمنصة' : 'Digital Platform Dashboard'}</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
                {isAr ? 'تفاعلية' : 'Live'}
              </span>
            </h3>
            <p className="text-xs text-[#F8F3E7]/80 mt-0.5">
              {isAr
                ? 'استعراض الحجوزات والتصاريح، الميزانية والمصروفات، وحالة الخدمات المباشرة'
                : 'Monitor permits, bookings, budget summary & active system status'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onNavigateView('dashboard')}
          className="px-5 py-2.5 bg-[#D4AF37] hover:bg-[#F5E5BE] text-[#02130D] font-black text-xs sm:text-sm rounded-xl transition-all cursor-pointer shadow-lg flex items-center gap-2 shrink-0 hover:scale-105"
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>{isAr ? 'فتح لوحة التحكم الآن' : 'Launch Dashboard Now'}</span>
          <ChevronRight className={`w-4 h-4 ${isAr ? 'rotate-180' : ''}`} />
        </button>
      </div>

      <div className="space-y-8">
        {/* Section 1: Quick Access Feature Shortcuts */}
        {(activeTab === 'all' || activeTab === 'shortcuts') && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-[#D4AF37]" />
                <span>{isAr ? 'الوصول السريع للميزات والخدمات' : 'Quick Access to Platform Features'}</span>
              </h3>
              <span className="text-xs text-[#D4AF37]/80 font-medium">
                {isAr ? 'انقر للانتقال المباشر للخدمة' : 'Click to launch directly'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {shortcuts.map((sc) => {
                const Icon = sc.icon;
                return (
                  <button
                    key={sc.id}
                    type="button"
                    onClick={() => onNavigateView(sc.id)}
                    className="p-4 bg-[#021811] border border-[#D4AF37]/40 hover:border-[#D4AF37] rounded-2xl text-start transition-all cursor-pointer group hover:bg-[#073D2F]/60 flex flex-col justify-between space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="p-2.5 bg-[#03291F] border border-[#D4AF37]/40 rounded-xl text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-[#02130D] transition-all">
                        <Icon className="w-5 h-5" />
                      </div>
                      {sc.badge && (
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${sc.badgeColor}`}>
                          {sc.badge}
                        </span>
                      )}
                    </div>

                    <div>
                      <h4 className="font-bold text-sm text-white group-hover:text-[#D4AF37] transition-colors mb-1">
                        {sc.title}
                      </h4>
                      <p className="text-xs text-[#F8F3E7]/70 leading-relaxed">{sc.desc}</p>
                    </div>

                    <div className="flex items-center justify-end text-xs font-bold text-[#D4AF37] pt-2 border-t border-[#D4AF37]/20">
                      <span>{isAr ? 'فتح الخدمة' : 'Open Feature'}</span>
                      <ChevronRight className={`w-4 h-4 ${isAr ? 'rotate-180' : ''}`} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Section 2: Audio & Voice Preferences */}
        {(activeTab === 'all' || activeTab === 'audio') && (
          <div className="p-5 bg-[#021811] border border-[#D4AF37]/50 rounded-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-[#D4AF37]/20 pb-3">
              <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-emerald-400" />
                <span>{isAr ? 'تفضيلات الصوت والنطق الآلي (Speech Synthesis)' : 'Audio & Voice Output Preferences'}</span>
              </h3>
              <span className="px-3 py-1 bg-emerald-950 border border-emerald-500/50 text-emerald-300 rounded-full text-xs font-bold">
                {isMuted ? (isAr ? 'الصوت مكتوم' : 'Muted') : (isAr ? 'الصوت مفعّل' : 'Active')}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Mute Toggle */}
              <div className="p-4 bg-[#03291F] border border-[#D4AF37]/30 rounded-xl flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-white">{isAr ? 'تشغيل الموجه الصوتي والقراءة' : 'Enable Speech Output'}</h4>
                  <p className="text-xs text-[#F8F3E7]/70 mt-0.5">
                    {isAr ? 'قراءة إجابات عرفات وأدعية المناسك والترجمة صوتیًا' : 'Read assistant answers & translation out loud'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={toggleMute}
                  className={`p-3 rounded-xl border font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    !isMuted
                      ? 'bg-emerald-600 text-white border-emerald-400 shadow-md'
                      : 'bg-red-950/80 text-red-300 border-red-500/50'
                  }`}
                >
                  {!isMuted ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                  <span className="text-xs">{!isMuted ? (isAr ? 'مفعّل' : 'On') : (isAr ? 'مكتوم' : 'Muted')}</span>
                </button>
              </div>

              {/* Auto Read Chat Toggle */}
              <div className="p-4 bg-[#03291F] border border-[#D4AF37]/30 rounded-xl flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-white">{isAr ? 'القراءة التلقائية للردود' : 'Auto-Read Assistant Responses'}</h4>
                  <p className="text-xs text-[#F8F3E7]/70 mt-0.5">
                    {isAr ? 'نطق إجابات عرفات فور توليدها دون الحاجة للضغط' : 'Speak assistant responses immediately when generated'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleAutoReadToggle}
                  className={`px-3 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    autoReadChat
                      ? 'bg-[#D4AF37] text-[#02130D] border-[#D4AF37]'
                      : 'bg-[#02130D] text-[#D4AF37] border-[#D4AF37]/40'
                  }`}
                >
                  {autoReadChat ? (isAr ? 'تلقائي' : 'Enabled') : (isAr ? 'يدوي' : 'Disabled')}
                </button>
              </div>
            </div>

            {/* Speech Rate Controls */}
            <div className="p-4 bg-[#03291F] border border-[#D4AF37]/30 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <label className="font-bold text-sm text-[#D4AF37]">
                  {isAr ? 'سرعة نطق الصوت (Speech Speed Rate):' : 'Voice Speech Rate Speed:'}
                </label>
                <span className="font-mono text-xs font-bold text-white bg-[#02130D] px-2.5 py-1 rounded-lg border border-[#D4AF37]/30">
                  {speechRate}x
                </span>
              </div>

              <div className="flex items-center gap-2">
                {[0.8, 1.0, 1.25, 1.5].map((rate) => (
                  <button
                    key={rate}
                    type="button"
                    onClick={() => handleSpeechRateChange(rate)}
                    className={`flex-1 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      speechRate === rate
                        ? 'bg-[#D4AF37] text-[#02130D] border-[#D4AF37]'
                        : 'bg-[#02130D] text-[#D4AF37] border-[#D4AF37]/40 hover:bg-[#073D2F]'
                    }`}
                  >
                    {rate === 1.0 ? (isAr ? '1.0x (عادي)' : '1.0x Normal') : `${rate}x`}
                  </button>
                ))}
              </div>

              {/* Voice Test Button */}
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleTestVoice}
                  className="px-4 py-2 bg-[#D4AF37] hover:bg-[#F5E5BE] text-[#02130D] font-black text-xs rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-md"
                >
                  <Play className={`w-3.5 h-3.5 ${isSpeaking ? 'animate-bounce' : ''}`} />
                  <span>{isAr ? 'اختبار الصوت والتوجيه الآن' : 'Test Speech Synthesis'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Section 3: Language Options */}
        {(activeTab === 'all' || activeTab === 'language') && (
          <div className="p-5 bg-[#021811] border border-[#D4AF37]/50 rounded-2xl space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#D4AF37]/20 pb-3">
              <div>
                <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                  <Languages className="w-5 h-5 text-amber-400" />
                  <span>{isAr ? 'لغة الواجهة والتعامل (20 لغة معتمدة)' : 'Interface & Interaction Language (20 Languages)'}</span>
                </h3>
                <p className="text-xs text-[#F8F3E7]/70">
                  {isAr
                    ? 'المنصة تدعم التبديل المباشر بين 20 لغة مع ضبط تلقائي لاتجاه النص RTL/LTR'
                    : 'Instant switching across 20 global languages with automatic RTL/LTR layout'}
                </p>
              </div>

              {/* Search Field */}
              <div className="relative w-full sm:w-64">
                <Search className={`w-4 h-4 text-[#D4AF37] absolute top-1/2 -translate-y-1/2 ${isAr ? 'right-3' : 'left-3'}`} />
                <input
                  type="text"
                  value={langSearch}
                  onChange={(e) => setLangSearch(e.target.value)}
                  placeholder={isAr ? 'ابحث عن لغة...' : 'Search language...'}
                  className={`w-full bg-[#03291F] border border-[#D4AF37]/50 rounded-xl py-2 text-xs text-white placeholder-[#F8F3E7]/50 focus:outline-none focus:border-[#D4AF37] ${
                    isAr ? 'pr-9 pl-3' : 'pl-9 pr-3'
                  }`}
                />
              </div>
            </div>

            {/* Featured Languages Quick Bar (Arabic, English, Urdu, French) */}
            <div className="bg-[#03291F] p-4 rounded-xl border border-[#D4AF37]/30 space-y-2">
              <div className="text-xs font-bold text-[#D4AF37] flex items-center justify-between">
                <span>{isAr ? 'اللغات الدولية الرئيسية لضيوف الرحمن (Quick Switcher):' : 'Main International Pilgrim Languages:'}</span>
                <span className="text-[10px] text-gray-400 font-mono">AR • EN • UR • FR</span>
              </div>
              <LanguageSwitcher
                selectedLang={language}
                onSelectLang={onSelectLanguage}
                variant="pills"
              />
            </div>

            {/* Grid of 20 languages */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 max-h-72 overflow-y-auto custom-scrollbar p-1">
              {filteredLanguages.map((lang) => {
                const isSelected = language.code === lang.code;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => onSelectLanguage(lang)}
                    className={`p-3 rounded-xl border text-start transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-[#D4AF37] text-[#02130D] font-black border-[#D4AF37] shadow-lg scale-[1.02]'
                        : 'bg-[#03291F] text-[#F8F3E7] border-[#D4AF37]/30 hover:border-[#D4AF37] hover:bg-[#073D2F]'
                    }`}
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <span className="text-lg shrink-0">{lang.flag}</span>
                      <div className="truncate">
                        <span className="text-xs font-bold block truncate">{lang.name}</span>
                        <span className="text-[10px] opacity-80 block truncate">{lang.nativeName}</span>
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-[#02130D] shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Section 4: Currency Selection */}
        {(activeTab === 'all' || activeTab === 'currency') && (
          <div className="p-5 bg-[#021811] border border-[#D4AF37]/50 rounded-2xl space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#D4AF37]/20 pb-3">
              <div>
                <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                  <Coins className="w-5 h-5 text-yellow-400" />
                  <span>{isAr ? 'العملة وتفضيلات الأسعار (20 عملة دولية)' : 'Currency & Pricing Preference (20 Currencies)'}</span>
                </h3>
                <p className="text-xs text-[#F8F3E7]/70">
                  {isAr ? 'عرض الحسابات وباقات الفنادق والخدمات بعملك المحبذة' : 'Display budgets & hotel packages in your preferred currency'}
                </p>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className={`w-4 h-4 text-[#D4AF37] absolute top-1/2 -translate-y-1/2 ${isAr ? 'right-3' : 'left-3'}`} />
                <input
                  type="text"
                  value={currencySearch}
                  onChange={(e) => setCurrencySearch(e.target.value)}
                  placeholder={isAr ? 'ابحث عن عملة (SAR, USD...)' : 'Search currency...'}
                  className={`w-full bg-[#03291F] border border-[#D4AF37]/50 rounded-xl py-2 text-xs text-white placeholder-[#F8F3E7]/50 focus:outline-none focus:border-[#D4AF37] ${
                    isAr ? 'pr-9 pl-3' : 'pl-9 pr-3'
                  }`}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 max-h-64 overflow-y-auto custom-scrollbar p-1">
              {filteredCurrencies.map((curr) => {
                const isSelected = currency.code === curr.code;
                return (
                  <button
                    key={curr.code}
                    type="button"
                    onClick={() => onSelectCurrency(curr)}
                    className={`p-3 rounded-xl border text-start transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-[#D4AF37] text-[#02130D] font-black border-[#D4AF37] shadow-lg scale-[1.02]'
                        : 'bg-[#03291F] text-[#F8F3E7] border-[#D4AF37]/30 hover:border-[#D4AF37] hover:bg-[#073D2F]'
                    }`}
                  >
                    <div className="truncate">
                      <span className="text-xs font-black block text-[#D4AF37]">{curr.code} ({curr.symbol})</span>
                      <span className="text-[10px] opacity-80 block truncate">{curr.name}</span>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-[#02130D] shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsView;
