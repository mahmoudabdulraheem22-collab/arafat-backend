import React from 'react';
import {
  ArrowLeft,
  LayoutDashboard,
  ShieldCheck,
  Wallet,
  Building2,
  Users,
  Activity,
  Volume2,
  Globe,
  Sparkles,
  Zap,
  CheckCircle2,
  Clock,
  TrendingUp,
  Settings,
  Bell,
  Sliders,
  FileText,
  BarChart3,
  Bot,
  Compass,
} from 'lucide-react';
import { LanguageOption } from '../../data/languages';
import { CurrencyOption, formatPrice } from '../../data/currencies';

interface DashboardViewProps {
  language: LanguageOption;
  currency: CurrencyOption;
  onBack: () => void;
  onNavigateView: (view: string) => void;
  onSendToWhatsapp?: (msg: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  language,
  currency,
  onBack,
  onNavigateView,
  onSendToWhatsapp, }) => {
  const isAr = language.code === 'ar';

  const stats = [
    {
      title: isAr ? 'التصاريح النشطة' : 'Active Permits',
      value: isAr ? '2 تصاريح (الروضة والعمرة)' : '2 Permits (Rawdah & Umrah)',
      status: isAr ? 'مؤكدة ومعتمدة' : 'Confirmed',
      icon: ShieldCheck,
      color: 'border-emerald-500/80 bg-emerald-950/40 text-emerald-400',
      actionView: 'permits',
    },
    {
      title: isAr ? 'الميزانية المخصصة' : 'Allocated Budget',
      value: formatPrice(12500, currency),
      status: isAr ? 'تغطية متكاملة' : 'Full Coverage',
      icon: Wallet,
      color: 'border-[#D4AF37]/80 bg-[#02130D]/60 text-[#D4AF37]',
      actionView: 'budget',
    },
    {
      title: isAr ? 'حالة المساعد الذكي' : 'AI Assistant Status',
      value: isAr ? 'Gemini 3.6 متصل' : 'Gemini 3.6 Online',
      status: isAr ? 'جاهز للإجابة 24/7' : 'Ready 24/7',
      icon: Bot,
      color: 'border-amber-500/80 bg-amber-950/40 text-amber-300',
      actionView: 'rituals',
    },
    {
      title: isAr ? 'لغة الواجهة والعملة' : 'Language & Currency',
      value: `${language.flag} ${language.name} (${currency.code})`,
      status: isAr ? 'مستقرة ومحدثة' : 'Active',
      icon: Globe,
      color: 'border-blue-500/80 bg-blue-950/40 text-blue-300',
      actionView: 'settings',
    },
  ];

  const quickActions = [
    {
      id: 'trip_dashboard',
      title: isAr ? 'ملخص رحلة الحج (Trip Dashboard)' : 'Trip Summary Dashboard',
      desc: isAr ? 'حالة الوصول، تقدم الحملة والمجموعة، وجدول المواعيد' : 'Arrival status, group progress, & upcoming events',
      icon: Compass,
      badge: isAr ? 'جديد' : 'New',
    },
    {
      id: 'settings',
      title: isAr ? 'الإعدادات المركزية' : 'Central Settings',
      desc: isAr ? 'ضبط الصوت، اللغات، والعملات' : 'Configure voice, languages & currencies',
      icon: Settings,
      badge: isAr ? 'الرئيسية' : 'Main',
    },
    {
      id: 'permits',
      title: isAr ? 'إدارة التصاريح' : 'Permit Management',
      desc: isAr ? 'استعراض تصاريح نسك للروضة والعمرة' : 'View Rawdah & Umrah permits',
      icon: ShieldCheck,
      badge: isAr ? 'نشط' : 'Active',
    },
    {
      id: 'budget',
      title: isAr ? 'حاسبة الميزانية' : 'Budget Calculator',
      desc: isAr ? 'تتبع مصاريف السكن والطيران والنقل' : 'Track accommodation & transit expenses',
      icon: Wallet,
    },
    {
      id: 'package_designer',
      title: isAr ? 'تصميم الباقات' : 'Package Designer',
      desc: isAr ? 'تعديل الفنادق والرحلات المخصصة' : 'Customize hotels & itineraries',
      icon: Building2,
    },
    {
      id: 'live_translation',
      title: isAr ? 'المترجم الفوري' : 'Live Interpreter',
      desc: isAr ? 'ترجمة صوتية فورية بالذكاء الاصطناعي' : 'Instant voice AI interpreter',
      icon: Globe,
    },
    {
      id: 'health',
      title: isAr ? 'صحتي والطوارئ' : 'My Health & Emergency',
      desc: isAr ? 'الوصول للمستشفيات وطوارئ 997' : 'Hospitals & 997 emergency hotline',
      icon: Activity,
    },
  ];

  return (
    <div className="bg-[#03291F]/95 border-2 border-[#D4AF37] rounded-3xl p-4 sm:p-8 text-[#F8F3E7] shadow-[0_15px_50px_rgba(0,0,0,0.8)] backdrop-blur-md max-w-5xl mx-auto my-4 space-y-6">
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-[#D4AF37]/30 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#02130D] border border-[#D4AF37] rounded-2xl text-[#D4AF37]">
            <LayoutDashboard className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <span>{isAr ? 'لوحة التحكم الرقمية - منصة عرفات' : 'Arafat Digital Dashboard'}</span>
              <Sparkles className="w-5 h-5 text-[#D4AF37]" />
            </h2>
            <p className="text-xs sm:text-sm text-[#D4AF37]/90 font-medium">
              {isAr
                ? 'مركز إدارة كافة خدمات ورحلات ضيوف الرحمن والتفضيلات الشخصية'
                : 'Central hub for managing pilgrim services, trip stats, & system preferences'}
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

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div
              key={idx}
              onClick={() => onNavigateView(s.actionView)}
              className={`p-4 rounded-2xl border ${s.color} transition-all cursor-pointer hover:scale-[1.02] space-y-2 flex flex-col justify-between`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold opacity-90">{s.title}</span>
                <Icon className="w-5 h-5 opacity-90" />
              </div>
              <div>
                <p className="text-lg font-black text-white tracking-tight">{s.value}</p>
                <div className="flex items-center gap-1 mt-1 text-[11px] font-bold text-[#D4AF37]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{s.status}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Control Panel System Overview Card */}
      <div className="p-5 bg-[#021811] border border-[#D4AF37]/50 rounded-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#D4AF37]/20 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#03291F] border border-[#D4AF37] rounded-xl text-[#D4AF37]">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="text-base sm:text-lg font-black text-white">
              {isAr ? 'نظرة عامة على حالة النظام والتصاريح' : 'System Status & Active Permits Overview'}
            </h3>
          </div>

          <span className="px-3 py-1 bg-emerald-950 border border-emerald-500/60 text-emerald-300 text-xs font-bold rounded-full flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{isAr ? 'النظام جاهز ومستقر' : 'System Online'}</span>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 bg-[#03291F] border border-[#D4AF37]/30 rounded-xl space-y-1.5">
            <div className="flex items-center justify-between font-bold text-[#D4AF37]">
              <span>{isAr ? 'تصريح العمرة (نسك)' : 'Umrah Permit (Nusuk)'}</span>
              <span className="text-emerald-400 font-mono">#NSK-9982</span>
            </div>
            <p className="text-[#F8F3E7]/80">{isAr ? 'الحرم المكي الشريف - باب الملك فهد' : 'Grand Mosque - King Fahd Gate'}</p>
            <p className="text-[10px] text-[#D4AF37]/80 font-mono">{isAr ? 'الحالة: ساري ومؤكد' : 'Status: Confirmed'}</p>
          </div>

          <div className="p-3.5 bg-[#03291F] border border-[#D4AF37]/30 rounded-xl space-y-1.5">
            <div className="flex items-center justify-between font-bold text-[#D4AF37]">
              <span>{isAr ? 'تصريح الروضة الشريفة' : 'Rawdah Permit'}</span>
              <span className="text-emerald-400 font-mono">#RAW-4412</span>
            </div>
            <p className="text-[#F8F3E7]/80">{isAr ? 'المسجد النبوي - الصلاة بالروضة' : 'Prophet Mosque - Rawdah Prayer'}</p>
            <p className="text-[10px] text-[#D4AF37]/80 font-mono">{isAr ? 'الحالة: محجوز ومؤكد' : 'Status: Booked'}</p>
          </div>

          <div className="p-3.5 bg-[#03291F] border border-[#D4AF37]/30 rounded-xl space-y-1.5">
            <div className="flex items-center justify-between font-bold text-[#D4AF37]">
              <span>{isAr ? 'خدمات الإرشاد والصوت' : 'Voice & Guide Services'}</span>
              <span className="text-amber-400 font-mono">1.0x Rate</span>
            </div>
            <p className="text-[#F8F3E7]/80">{isAr ? 'النطق الآلي والترجمة الفورية مفعّلان' : 'Voice output & Live translation active'}</p>
            <p className="text-[10px] text-[#D4AF37]/80 font-mono">{isAr ? 'اللغة: العربية (SAR)' : 'Lang: Arabic (SAR)'}</p>
          </div>
        </div>
      </div>

      {/* Control Panel Quick Shortcuts */}
      <div className="space-y-3">
        <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
          <Zap className="w-5 h-5 text-[#D4AF37]" />
          <span>{isAr ? 'اختصارات التحكّم المباشر' : 'Direct Management Shortcuts'}</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {quickActions.map((act) => {
            const Icon = act.icon;
            return (
              <button
                key={act.id}
                type="button"
                onClick={() => onNavigateView(act.id)}
                className="p-4 bg-[#021811] border border-[#D4AF37]/40 hover:border-[#D4AF37] rounded-2xl text-start transition-all cursor-pointer group hover:bg-[#073D2F]/70 flex items-center gap-3.5"
              >
                <div className="p-3 bg-[#03291F] border border-[#D4AF37]/50 rounded-xl text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-[#02130D] transition-all shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-white group-hover:text-[#D4AF37] transition-colors truncate">
                      {act.title}
                    </h4>
                    {act.badge && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40">
                        {act.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#F8F3E7]/70 truncate mt-0.5">{act.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
