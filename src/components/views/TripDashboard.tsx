import React, { useState } from 'react';
import {
  Plane,
  Users,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Bus,
  Hotel,
  Compass,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  PhoneCall,
  MessageCircle,
  Bell,
  ChevronRight,
  Filter,
  Plus,
  Luggage,
  CalendarDays,
  UserCheck,
  TrendingUp,
} from 'lucide-react';
import { LanguageOption } from '../../data/languages';
import { CurrencyOption } from '../../data/currencies';

interface TripDashboardProps {
  language?: LanguageOption;
  currency?: CurrencyOption;
  onBack?: () => void;
  onNavigateView?: (view: string) => void;
  onSendToWhatsapp?: (msg: string) => void;
}

export const TripDashboard: React.FC<TripDashboardProps> = ({
  language = { code: 'ar', name: 'العربية', flag: '🇸🇦', dir: 'rtl' },
  currency,
  onBack,
  onNavigateView,
  onSendToWhatsapp,
}) => {
  const isAr = language.code === 'ar';
  const [eventFilter, setEventFilter] = useState<'all' | 'rituals' | 'transport' | 'lectures'>('all');
  const [activeReminders, setActiveReminders] = useState<Record<string, boolean>>({
    'ev-1': true,
    'ev-2': true,
  });

  // Mock arrival status dataset
  const arrivalInfo = {
    flightNumber: 'SV-884',
    airline: isAr ? 'الخطوط السعودية' : 'Saudia Airlines',
    origin: isAr ? 'القاهرة (CAI)' : 'Cairo (CAI)',
    destination: isAr ? 'مطار الملك عبد العزيز - جدة (JED)' : 'Jeddah Airport (JED)',
    arrivalTime: isAr ? 'اليوم - 02:30 مساءً' : 'Today - 02:30 PM',
    status: isAr ? 'وصل بسلام - اكتمل الدخول' : 'Arrived safely - Cleared Customs',
    terminal: isAr ? 'الصالة 1 - ممر الحجاج' : 'Terminal 1 - Hajj Hall',
    busNumber: isAr ? 'حافلة VIP رقم #14' : 'VIP Bus #14',
    hotelName: isAr ? 'فندق بولمان زمزم مكة (غرفة 1402)' : 'Pullman Zamzam Makkah (Room 1402)',
    luggageStatus: isAr ? 'تم الاستلام ونقله للفندق بنجاح' : 'Delivered to Hotel',
  };

  // Mock group progress dataset
  const groupInfo = {
    campaignName: isAr ? 'حملة عرفات المتميزة #8842' : 'Arafat Premium Campaign #8842',
    leaderName: isAr ? 'م. عبد الله السلمي' : 'Eng. Abdullah Al-Sulami',
    leaderPhone: '+966501234567',
    totalPilgrims: 45,
    checkedInPilgrims: 43,
    currentLocation: isAr ? 'فندق بولمان زمزم - مكة المكرمة' : 'Pullman Zamzam - Makkah',
    stages: [
      {
        titleAr: 'الوصول واستلام السكن',
        titleEn: 'Arrival & Hotel Check-in',
        status: 'completed',
        progress: 100,
        timeAr: 'تمت بنجاح',
        timeEn: 'Completed',
      },
      {
        titleAr: 'أداء طواف القدوم والسعي',
        titleEn: "Tawaf Al-Qudum & Sa'i",
        status: 'in_progress',
        progress: 75,
        timeAr: 'جاري الأداء الآن',
        timeEn: 'In Progress',
      },
      {
        titleAr: 'التفويج إلى مخيم منى (يوم التروية)',
        titleEn: 'Transfer to Mina Camp (Tarwiyah Day)',
        status: 'upcoming',
        progress: 0,
        timeAr: 'غداً 08:00 ص',
        timeEn: 'Tomorrow 08:00 AM',
      },
      {
        titleAr: 'الوقوف بعرفات (يوم الحج الأكبر)',
        titleEn: 'Arafat Day Stand',
        status: 'upcoming',
        progress: 0,
        timeAr: 'بعد غد 05:00 ص',
        timeEn: 'In 2 Days 05:00 AM',
      },
      {
        titleAr: 'المبيت بمزدلفة ورمي الجمرات',
        titleEn: 'Muzdalifah & Jamarat Stoning',
        status: 'upcoming',
        progress: 0,
        timeAr: 'ليلة 10 ذو الحجة',
        timeEn: 'Eve 10 Dhu Al-Hijjah',
      },
    ],
  };

  // Mock scheduled events dataset
  const events = [
    {
      id: 'ev-1',
      category: 'rituals',
      titleAr: 'التجمع لبدء طواف القدوم الجماعي',
      titleEn: 'Assembly for Group Tawaf Al-Qudum',
      timeAr: 'اليوم - 08:30 مساءً',
      timeEn: 'Today - 08:30 PM',
      locationAr: 'بهو فندق بولمان زمزم - الدور الأرضي',
      locationEn: 'Pullman Zamzam Hotel Lobby - Ground Floor',
      guideAr: 'الشيخ عبد الرحمن - مرشد الحملة',
      guideEn: 'Sheikh Abdulrahman - Group Guide',
      badgeAr: 'مأدية نسك',
      badgeEn: 'Ritual Event',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    },
    {
      id: 'ev-2',
      category: 'transport',
      titleAr: 'ركوب حافلات التفويج إلى مشعر منى',
      titleEn: 'Boarding Buses to Mina Camp',
      timeAr: 'غداً - 07:30 صباحاً',
      timeEn: 'Tomorrow - 07:30 AM',
      locationAr: 'موقف الحافلات الرئيسي أمام الفندق',
      locationEn: 'Main Bus Station in front of Hotel',
      guideAr: 'كابتن أحمد - مسؤول النقل',
      guideEn: 'Captain Ahmad - Transport Manager',
      badgeAr: 'تفويج ونقل',
      badgeEn: 'Transportation',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    },
    {
      id: 'ev-3',
      category: 'lectures',
      titleAr: 'محاضرة إيمانية: أحكام الحج ومسائل يوم عرفة',
      titleEn: 'Spiritual Lecture: Rites of Arafat Day',
      timeAr: 'غداً - 04:00 مساءً',
      timeEn: 'Tomorrow - 04:00 PM',
      locationAr: 'المصلى الرئيسي بمخيم منى - خيمة 4',
      locationEn: 'Main Prayer Hall Mina Camp - Tent 4',
      guideAr: 'د. خالد الغامدي - محاضر شرعي',
      guideEn: 'Dr. Khalid Al-Ghamdi - Islamic Scholar',
      badgeAr: 'درس علمي',
      badgeEn: 'Lecture',
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    },
    {
      id: 'ev-4',
      category: 'rituals',
      titleAr: 'التحرك الجماعي لنفرة عرفات والموقف',
      titleEn: 'Group Departure for Arafat Stand',
      timeAr: 'بعد غد - 05:30 صباحاً',
      timeEn: 'In 2 Days - 05:30 AM',
      locationAr: 'مخيم عرفات المخصص برقم #40',
      locationEn: 'Designated Arafat Camp #40',
      guideAr: 'م. عبد الله السلمي - قائد الحملة',
      guideEn: 'Eng. Abdullah - Campaign Leader',
      badgeAr: 'ركن الحج الأكبر',
      badgeEn: 'Core Ritual',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    },
  ];

  const filteredEvents = events.filter((ev) => eventFilter === 'all' || ev.category === eventFilter);

  const toggleReminder = (id: string) => {
    setActiveReminders((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleContactLeader = () => {
    const message = isAr
      ? `السلام عليكم ورحمة الله، أنا الحاج ${groupInfo.campaignName}. أود الاستفسار بخصوص جدول الرحلة والتجمع.`
      : `Hello, I am a pilgrim in ${groupInfo.campaignName}. I would like to inquire about the schedule.`;

    if (onSendToWhatsapp) {
      onSendToWhatsapp(message);
    } else {
      window.open(`https://wa.me/966501234567?text=${encodeURIComponent(message)}`, '_blank');
    }
  };

  return (
    <div className="bg-[#03291F]/95 border-2 border-[#D4AF37] rounded-3xl p-4 sm:p-8 text-[#F8F3E7] shadow-[0_15px_50px_rgba(0,0,0,0.8)] backdrop-blur-md max-w-5xl mx-auto my-4 space-y-6">
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-[#D4AF37]/30 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#02130D] border border-[#D4AF37] rounded-2xl text-[#D4AF37]">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <span>{isAr ? 'لوحة ملخص رحلة الحج والعمرة' : 'Hajj Trip Dashboard & Schedule'}</span>
              <Sparkles className="w-5 h-5 text-[#D4AF37]" />
            </h2>
            <p className="text-xs sm:text-sm text-[#D4AF37]/90 font-medium">
              {isAr
                ? 'متابعة حالة الوصول، تقدم الحملة والمجموعة، وجدول المواعيد والأحداث القادمة'
                : 'Live arrival status, group progress tracking, & upcoming scheduled events'}
            </p>
          </div>
        </div>

        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2 bg-[#02130D] hover:bg-[#073D2F] border border-[#D4AF37]/60 text-[#D4AF37] font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <ArrowRight className={`w-4 h-4 ${!isAr ? 'rotate-180' : ''}`} />
            <span>{isAr ? 'العودة' : 'Back'}</span>
          </button>
        )}
      </div>

      {/* Quick Summary Highlights Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Metric 1 */}
        <div className="p-4 bg-[#021811] border border-[#D4AF37]/40 rounded-2xl flex items-center gap-3">
          <div className="p-2.5 bg-[#03291F] border border-[#D4AF37] rounded-xl text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] text-[#D4AF37] font-bold block">{isAr ? 'حالة الوصول' : 'Arrival Status'}</span>
            <p className="text-sm font-black text-white">{isAr ? 'وصل بسلام وكتمل السكن' : 'Arrived & Checked In'}</p>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-4 bg-[#021811] border border-[#D4AF37]/40 rounded-2xl flex items-center gap-3">
          <div className="p-2.5 bg-[#03291F] border border-[#D4AF37] rounded-xl text-[#D4AF37]">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] text-[#D4AF37] font-bold block">{isAr ? 'حالة المجموعة' : 'Group Presence'}</span>
            <p className="text-sm font-black text-white">
              {groupInfo.checkedInPilgrims} / {groupInfo.totalPilgrims} {isAr ? 'حاج متواجد' : 'Pilgrims Present'}
            </p>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="p-4 bg-[#021811] border border-[#D4AF37]/40 rounded-2xl flex items-center gap-3">
          <div className="p-2.5 bg-[#03291F] border border-[#D4AF37] rounded-xl text-amber-300">
            <CalendarDays className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] text-[#D4AF37] font-bold block">{isAr ? 'الحدث القادم' : 'Next Event'}</span>
            <p className="text-sm font-black text-white truncate max-w-[180px]">
              {isAr ? 'طواف القدوم (08:30 م)' : 'Group Tawaf (08:30 PM)'}
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 1: ARRIVAL STATUS SUMMARY */}
      <div className="p-5 bg-gradient-to-br from-[#021811] via-[#03291F] to-[#01120C] border-2 border-[#D4AF37]/80 rounded-2xl space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-[#D4AF37]/20 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-[#02130D] border border-[#D4AF37] rounded-xl text-[#D4AF37]">
              <Plane className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white">
                {isAr ? '1. ملخص حالة الوصول والتنقل' : '1. Arrival & Transit Summary'}
              </h3>
              <p className="text-xs text-[#D4AF37]">
                {isAr ? 'بيانات رحلة الطيران، استلام الأمتعة، والحافلة والسكن' : 'Flight details, luggage transfer, assigned bus & hotel'}
              </p>
            </div>
          </div>

          <span className="px-3 py-1 rounded-full bg-emerald-950 border border-emerald-500/60 text-emerald-300 text-xs font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>{arrivalInfo.status}</span>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* Flight */}
          <div className="p-3 bg-[#02130D]/80 border border-[#D4AF37]/30 rounded-xl space-y-1">
            <span className="text-[10px] text-[#D4AF37] font-bold block flex items-center gap-1">
              <Plane className="w-3.5 h-3.5" />
              <span>{isAr ? 'رحلة الطيران:' : 'Flight:'}</span>
            </span>
            <p className="font-bold text-white text-sm">{arrivalInfo.flightNumber} ({arrivalInfo.airline})</p>
            <p className="text-[10px] text-[#F8F3E7]/70">{arrivalInfo.destination}</p>
          </div>

          {/* Terminal */}
          <div className="p-3 bg-[#02130D]/80 border border-[#D4AF37]/30 rounded-xl space-y-1">
            <span className="text-[10px] text-[#D4AF37] font-bold block flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>{isAr ? 'الصالة والمطار:' : 'Terminal & Airport:'}</span>
            </span>
            <p className="font-bold text-white text-sm">{arrivalInfo.terminal}</p>
            <p className="text-[10px] text-[#F8F3E7]/70">{arrivalInfo.arrivalTime}</p>
          </div>

          {/* Bus */}
          <div className="p-3 bg-[#02130D]/80 border border-[#D4AF37]/30 rounded-xl space-y-1">
            <span className="text-[10px] text-[#D4AF37] font-bold block flex items-center gap-1">
              <Bus className="w-3.5 h-3.5 text-amber-400" />
              <span>{isAr ? 'حافلة الميدان:' : 'Assigned Bus:'}</span>
            </span>
            <p className="font-bold text-white text-sm">{arrivalInfo.busNumber}</p>
            <p className="text-[10px] text-emerald-400 font-bold">{arrivalInfo.luggageStatus}</p>
          </div>

          {/* Hotel */}
          <div className="p-3 bg-[#02130D]/80 border border-[#D4AF37]/30 rounded-xl space-y-1">
            <span className="text-[10px] text-[#D4AF37] font-bold block flex items-center gap-1">
              <Hotel className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isAr ? 'الفندق والغرفة:' : 'Hotel & Room:'}</span>
            </span>
            <p className="font-bold text-white text-sm">{arrivalInfo.hotelName}</p>
            <p className="text-[10px] text-[#D4AF37]">{isAr ? 'تأكيد المفتاح الإلكتروني نسك' : 'Nusuk Digital Key Confirmed'}</p>
          </div>
        </div>
      </div>

      {/* SECTION 2: GROUP PROGRESS & MILESTONES */}
      <div className="p-5 bg-[#021811] border border-[#D4AF37]/50 rounded-2xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#D4AF37]/20 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-[#03291F] border border-[#D4AF37] rounded-xl text-[#D4AF37]">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white">
                {isAr ? '2. تقدم الحملة والمجموعة' : '2. Group Progress & Milestones'}
              </h3>
              <p className="text-xs text-[#D4AF37]">{groupInfo.campaignName}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleContactLeader}
              className="px-3.5 py-2 bg-[#D4AF37] hover:bg-[#F5E5BE] text-[#02130D] font-black text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-md"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>{isAr ? 'تواصل مع قائد الحملة' : 'Contact Leader'}</span>
            </button>
          </div>
        </div>

        {/* Group Leader Contact Details Bar */}
        <div className="p-3.5 bg-[#03291F]/80 border border-[#D4AF37]/30 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#02130D] border border-[#D4AF37] flex items-center justify-center text-[#D4AF37] font-black">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-white">
                {isAr ? 'قائد الحملة والمرشد الميداني:' : 'Group Leader:'} <span className="text-[#D4AF37]">{groupInfo.leaderName}</span>
              </p>
              <p className="text-[11px] text-[#F8F3E7]/70">{groupInfo.currentLocation}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-[#02130D] px-3 py-1.5 rounded-xl border border-[#D4AF37]/30 font-mono text-[#D4AF37] font-bold">
            <PhoneCall className="w-3.5 h-3.5" />
            <span>{groupInfo.leaderPhone}</span>
          </div>
        </div>

        {/* Milestone Timeline Steps */}
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-bold text-[#D4AF37] flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-[#D4AF37]" />
            <span>{isAr ? 'مراحل ومناسك الرحلة بالترتيب:' : 'Rituals Timeline Steps:'}</span>
          </h4>

          <div className="space-y-2.5">
            {groupInfo.stages.map((stg, idx) => {
              const isDone = stg.status === 'completed';
              const isInProg = stg.status === 'in_progress';

              return (
                <div
                  key={idx}
                  className={`p-3.5 rounded-xl border transition-all ${
                    isDone
                      ? 'bg-emerald-950/30 border-emerald-500/50 text-white'
                      : isInProg
                      ? 'bg-[#03291F] border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.2)]'
                      : 'bg-[#02130D]/70 border-[#D4AF37]/20 text-[#F8F3E7]/60'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : isInProg ? (
                        <Clock className="w-4 h-4 text-[#D4AF37] animate-pulse shrink-0" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-gray-500 shrink-0 flex items-center justify-center text-[10px]">
                          {idx + 1}
                        </div>
                      )}
                      <span className="font-bold text-xs sm:text-sm">
                        {isAr ? stg.titleAr : stg.titleEn}
                      </span>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isDone
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : isInProg
                          ? 'bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/50'
                          : 'bg-gray-800 text-gray-400'
                      }`}
                    >
                      {isAr ? stg.timeAr : stg.timeEn}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-1.5 bg-[#02130D] rounded-full overflow-hidden border border-[#D4AF37]/20">
                    <div
                      className={`h-full transition-all duration-500 ${
                        isDone ? 'bg-emerald-400' : isInProg ? 'bg-[#D4AF37]' : 'bg-gray-700'
                      }`}
                      style={{ width: `${stg.progress}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* SECTION 3: UPCOMING SCHEDULED EVENTS */}
      <div className="p-5 bg-[#021811] border border-[#D4AF37]/50 rounded-2xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#D4AF37]/20 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-[#03291F] border border-[#D4AF37] rounded-xl text-[#D4AF37]">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white">
                {isAr ? '3. الجدول الزمني والأحداث القادمة' : '3. Scheduled Events & Timeline'}
              </h3>
              <p className="text-xs text-[#D4AF37]">
                {isAr ? 'مواعيد التجمع، الدروس الإيمانية، وحافلات النقل الميداني' : 'Assembly times, lectures, & transit schedules'}
              </p>
            </div>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar max-w-full">
            {[
              { id: 'all', labelAr: 'الكل', labelEn: 'All' },
              { id: 'rituals', labelAr: 'المناسك', labelEn: 'Rituals' },
              { id: 'transport', labelAr: 'التفويج والنقل', labelEn: 'Transit' },
              { id: 'lectures', labelAr: 'الدروس', labelEn: 'Lectures' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setEventFilter(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  eventFilter === tab.id
                    ? 'bg-[#D4AF37] text-[#02130D] border-[#D4AF37]'
                    : 'bg-[#03291F] text-[#D4AF37] border-[#D4AF37]/40 hover:bg-[#073D2F]'
                }`}
              >
                {isAr ? tab.labelAr : tab.labelEn}
              </button>
            ))}
          </div>
        </div>

        {/* List of Event Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredEvents.map((ev) => {
            const hasReminder = activeReminders[ev.id];

            return (
              <div
                key={ev.id}
                className="p-4 bg-[#03291F]/90 border border-[#D4AF37]/40 hover:border-[#D4AF37] rounded-2xl space-y-3 transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${ev.badgeColor}`}>
                      {isAr ? ev.badgeAr : ev.badgeEn}
                    </span>

                    <button
                      type="button"
                      onClick={() => toggleReminder(ev.id)}
                      className={`p-1.5 rounded-lg border text-xs transition-all cursor-pointer flex items-center gap-1 ${
                        hasReminder
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                          : 'bg-[#02130D] text-gray-400 border-gray-700 hover:text-white'
                      }`}
                      title={isAr ? 'تفعيل/إلغاء التنبيه' : 'Toggle Alert'}
                    >
                      <Bell className="w-3.5 h-3.5" />
                      <span className="text-[10px]">{hasReminder ? (isAr ? 'تنبيه مفعّل' : 'Alert On') : (isAr ? 'تنبيه' : 'Alert')}</span>
                    </button>
                  </div>

                  <h4 className="font-black text-sm text-white">{isAr ? ev.titleAr : ev.titleEn}</h4>

                  <div className="space-y-1 text-xs text-[#F8F3E7]/80">
                    <div className="flex items-center gap-2 font-bold text-[#D4AF37]">
                      <Clock className="w-3.5 h-3.5 shrink-0" />
                      <span>{isAr ? ev.timeAr : ev.timeEn}</span>
                    </div>

                    <div className="flex items-start gap-2">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{isAr ? ev.locationAr : ev.locationEn}</span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-[#F8F3E7]/60">
                      <Users className="w-3.5 h-3.5 shrink-0" />
                      <span>{isAr ? ev.guideAr : ev.guideEn}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#D4AF37]/20 flex items-center justify-between text-[11px]">
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{isAr ? 'جدول معتمد' : 'Verified Schedule'}</span>
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      const msg = isAr
                        ? `تذكير بالموعد: ${ev.titleAr} (${ev.timeAr}) - الموعد بالموقع: ${ev.locationAr}`
                        : `Reminder: ${ev.titleEn} (${ev.timeEn}) at ${ev.locationEn}`;
                      if (onSendToWhatsapp) {
                        onSendToWhatsapp(msg);
                      } else {
                        window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
                      }
                    }}
                    className="text-[#D4AF37] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>{isAr ? 'إرسال بالواتساب' : 'Share via WA'}</span>
                    <ChevronRight className={`w-3 h-3 ${isAr ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TripDashboard;
