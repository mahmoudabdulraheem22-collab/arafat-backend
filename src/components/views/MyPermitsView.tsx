import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FileText,
  CheckCircle2,
  QrCode,
  Calendar,
  Clock,
  ArrowRight,
  ShieldCheck,
  PlusCircle,
  Download,
  Printer,
  Eye,
  Share2,
  Maximize2,
  BadgeCheck,
  UserCheck,
  MapPin,
  Building2,
  Sparkles,
  Phone,
  Search,
  X,
  FileCheck,
  AlertCircle,
  ExternalLink,
  Shield,
  Smartphone,
} from 'lucide-react';
import { LanguageOption } from '../../data/languages';
import { saveToCache, getFromCache, CACHE_KEYS } from '../../utils/offlineStorage';
import { OfflineSyncStatus } from '../common/OfflineSyncStatus';

interface MyPermitsViewProps {
  language: LanguageOption;
  onBack: () => void;
  onSendToWhatsapp: (message: string) => void;
}

export interface PermitItem {
  id: string;
  typeAr: string;
  typeEn: string;
  category: 'hajj' | 'umrah' | 'rawdah' | 'access';
  status: 'active' | 'used' | 'pending';
  pilgrimNameAr: string;
  pilgrimNameEn: string;
  idNumber: string;
  nationalityAr: string;
  nationalityEn: string;
  campaignAr: string;
  campaignEn: string;
  minaTent: string;
  arafatCamp: string;
  date: string;
  timeSlot: string;
  gate: string;
  qrCodeData: string;
  securityHash: string;
  issuedDate: string;
}

export const MyPermitsView: React.FC<MyPermitsViewProps> = ({
  language,
  onBack,
  onSendToWhatsapp,
}) => {
  const isAr = language.code === 'ar';

  // Sample Default Permits Database
  const DEFAULT_PERMITS: PermitItem[] = [
    {
      id: 'HAJJ-1448-992014',
      typeAr: 'تصريح الحج العام (بطاقة نسك الرقمية)',
      typeEn: 'Official Hajj Permit (Nusuk Digital Pass)',
      category: 'hajj',
      status: 'active',
      pilgrimNameAr: 'محمود عبد الرحيم الشريف',
      pilgrimNameEn: 'Mahmoud Abdulraheem Al-Sharif',
      idNumber: '2498102931',
      nationalityAr: 'مصر',
      nationalityEn: 'Egypt',
      campaignAr: 'شركة حجاج العالم الإسلامي - حملة 104',
      campaignEn: 'Islamic World Pilgrims Co. - Group 104',
      minaTent: 'مخيم أ-42 (مربع 3)',
      arafatCamp: 'مخيم ج-18 (صعيد عرفات)',
      date: '8 - 13 ذو الحجة 1448 هـ',
      timeSlot: 'طيلة أيام التشريق والمناسك',
      gate: 'جميع منافذ ومداخل المشاعر المقدسة',
      qrCodeData: 'ARAFAT-NUSUK-HAJJ-OFFICIAL-1448-992014-VERIFIED',
      securityHash: '8F92-A410-BC77-90E1',
      issuedDate: '01 ذو القعدة 1448 هـ',
    },
    {
      id: 'PRM-UMR-98231',
      typeAr: 'تصريح أداء العمرة وتكرار أداء الطواف',
      typeEn: 'Umrah & Tawaf Permit',
      category: 'umrah',
      status: 'active',
      pilgrimNameAr: 'محمود عبد الرحيم الشريف',
      pilgrimNameEn: 'Mahmoud Abdulraheem Al-Sharif',
      idNumber: '2498102931',
      nationalityAr: 'مصر',
      nationalityEn: 'Egypt',
      campaignAr: 'حملة الضيافة المتميزة',
      campaignEn: 'Distinctive Hospitality Group',
      minaTent: 'غير محدد',
      arafatCamp: 'غير محدد',
      date: '10 صفر 1448 هـ',
      timeSlot: '04:00 م - 07:00 م',
      gate: 'باب الملك عبد العزيز (البوابة رقم 1)',
      qrCodeData: 'ARAFAT-NUSUK-UMRAH-98231',
      securityHash: '4E12-C890-FF11-2299',
      issuedDate: '05 صفر 1448 هـ',
    },
    {
      id: 'PRM-RWD-44120',
      typeAr: 'تصريح الصلاة في الروضة الشريفة (رجال)',
      typeEn: 'Noble Rawdah Prayer Permit (Men)',
      category: 'rawdah',
      status: 'active',
      pilgrimNameAr: 'محمود عبد الرحيم الشريف',
      pilgrimNameEn: 'Mahmoud Abdulraheem Al-Sharif',
      idNumber: '2498102931',
      nationalityAr: 'مصر',
      nationalityEn: 'Egypt',
      campaignAr: 'حملة الضيافة المتميزة',
      campaignEn: 'Distinctive Hospitality Group',
      minaTent: 'غير محدد',
      arafatCamp: 'غير محدد',
      date: '14 صفر 1448 هـ',
      timeSlot: '08:30 ص - 09:30 ص',
      gate: 'باب السلام - ساحة المسجد النبوي',
      qrCodeData: 'ARAFAT-RAWDAH-44120',
      securityHash: '7A34-991B-EE44-1188',
      issuedDate: '08 صفر 1448 هـ',
    },
  ];

  const [permits, setPermits] = useState<PermitItem[]>(() => {
    const cached = getFromCache<PermitItem[]>(CACHE_KEYS.PERMITS, DEFAULT_PERMITS);
    return cached.data;
  });

  const [selectedPermit, setSelectedPermit] = useState<PermitItem>(permits[0] || DEFAULT_PERMITS[0]);
  const [activeTab, setActiveTab] = useState<'all' | 'hajj' | 'umrah' | 'rawdah'>('all');
  const [showPdfModal, setShowPdfModal] = useState<boolean>(false);
  const [showCheckpointModal, setShowCheckpointModal] = useState<boolean>(false);
  const [showQrZoom, setShowQrZoom] = useState<boolean>(false);

  // Auto-sync permits state to offline local storage
  useEffect(() => {
    saveToCache(CACHE_KEYS.PERMITS, permits);
  }, [permits]);

  const filteredPermits = permits.filter(
    (p) => activeTab === 'all' || p.category === activeTab
  );

  const handleIssueNewPermit = () => {
    const newId = 'PRM-NEW-' + Math.floor(10000 + Math.random() * 90000);
    const newP: PermitItem = {
      id: newId,
      typeAr: 'تصريح دخول الحرم وصلاة الجمعة',
      typeEn: 'Haram Entry & Friday Prayer Permit',
      category: 'access',
      status: 'active',
      pilgrimNameAr: 'محمود عبد الرحيم الشريف',
      pilgrimNameEn: 'Mahmoud Abdulraheem Al-Sharif',
      idNumber: '2498102931',
      nationalityAr: 'مصر',
      nationalityEn: 'Egypt',
      campaignAr: 'حملة الضيافة المتميزة',
      campaignEn: 'Distinctive Hospitality Group',
      minaTent: 'غير محدد',
      arafatCamp: 'غير محدد',
      date: 'اليوم',
      timeSlot: 'صلاة الجمعة والعصر',
      gate: 'باب الملك فهد (79)',
      qrCodeData: `ARAFAT-NUSUK-ACCESS-${Date.now()}`,
      securityHash: '5C88-11A0-BB99-3311',
      issuedDate: 'اليوم',
    };
    setPermits([newP, ...permits]);
    setSelectedPermit(newP);
  };

  const handleSharePermit = () => {
    const msg = isAr
      ? `📄 *تصريحي الرسمي عبر منصة نسك / عرفات*:\n- النوع: ${selectedPermit.typeAr}\n- الاسم: ${selectedPermit.pilgrimNameAr}\n- رقم الهوية: ${selectedPermit.idNumber}\n- الرقم المرجعي: ${selectedPermit.id}\n- التاريخ والتوقيت: ${selectedPermit.date} (${selectedPermit.timeSlot})\n- البوابة: ${selectedPermit.gate}\n- رمز التحقق الأمني: ${selectedPermit.securityHash}`
      : `📄 *Official Nusuk / Arafat Permit*:\n- Type: ${selectedPermit.typeEn}\n- Name: ${selectedPermit.pilgrimNameEn}\n- ID No: ${selectedPermit.idNumber}\n- Ref: ${selectedPermit.id}\n- Date & Slot: ${selectedPermit.date} (${selectedPermit.timeSlot})\n- Gate: ${selectedPermit.gate}\n- Security Hash: ${selectedPermit.securityHash}`;

    onSendToWhatsapp(msg);
  };

  const handlePrintPdf = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 bg-[#021811]/95 text-[#F8F3E7] rounded-3xl border-2 border-[#D4AF37] shadow-[0_20px_50px_rgba(0,0,0,0.9)] my-6">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#D4AF37]/30 pb-4 mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#D4AF37]/60 bg-[#03291F] hover:bg-[#073D2F] text-[#D4AF37] transition-all text-sm font-bold cursor-pointer"
        >
          <ArrowRight className={`w-4 h-4 ${!isAr ? 'rotate-180' : ''}`} />
          <span>{isAr ? 'العودة للرئيسية' : 'Back to Home'}</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-[#D4AF37]/20 border-2 border-[#D4AF37] flex items-center justify-center text-[#D4AF37] shrink-0 shadow-[0_0_15px_rgba(212,175,55,0.4)]">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-[#D4AF37]">
                {isAr ? 'تصاريحي وتصريح الحج الرقمي (نسك)' : 'My Permits & Nusuk Digital Pass'}
              </h2>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded-full font-bold">
                <BadgeCheck className="w-3 h-3" />
                {isAr ? 'ربط مباشر موثق' : 'Nusuk Verified'}
              </span>
            </div>
            <p className="text-xs text-[#F8F3E7]/70">
              {isAr
                ? 'عرض تصاريح الحج والعمرة والروضة الشريفة بصيغة PDF وكود QR معتمد لنقاط التفتيش'
                : 'Display official Hajj, Umrah & Rawdah permits in PDF format with checkpoint QR scan'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setShowCheckpointModal(true)}
            className="flex-1 sm:flex-none items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-red-700 to-red-900 border border-red-400 text-white font-black text-xs hover:from-red-600 transition-all cursor-pointer shadow-lg animate-pulse"
          >
            <Shield className="w-4 h-4" />
            <span>{isAr ? 'وضع نقاط التفتيش الأمنية' : 'Security Checkpoint Mode'}</span>
          </button>

          <button
            onClick={handleIssueNewPermit}
            className="hidden lg:flex items-center gap-1.5 px-3 py-2.5 rounded-full bg-[#D4AF37] text-[#02130D] font-black text-xs hover:bg-[#E5C158] cursor-pointer shrink-0 shadow-md"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{isAr ? 'إصدار تصريح جديد' : 'Issue New Permit'}</span>
          </button>
        </div>
      </div>

      {/* Permits Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none border-b border-[#D4AF37]/20">
        {[
          { id: 'all', nameAr: 'جميع التصاريح', nameEn: 'All Permits', icon: FileCheck },
          { id: 'hajj', nameAr: 'تصريح الحج الرئيسي (نسك)', nameEn: 'Official Hajj Permit', icon: ShieldCheck },
          { id: 'umrah', nameAr: 'تصاريح العمرة والطواف', nameEn: 'Umrah Permits', icon: Sparkles },
          { id: 'rawdah', nameAr: 'تصاريح الروضة الشريفة', nameEn: 'Rawdah Permits', icon: Building2 },
        ].map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shrink-0 border ${
                isSelected
                  ? 'bg-[#D4AF37] text-[#02130D] border-white shadow-[0_0_15px_rgba(212,175,55,0.4)]'
                  : 'bg-[#03291F] text-[#F8F3E7]/80 border-[#D4AF37]/30 hover:border-[#D4AF37]'
              }`}
            >
              <Icon className={`w-4 h-4 ${isSelected ? 'text-[#02130D]' : 'text-[#D4AF37]'}`} />
              <span>{isAr ? tab.nameAr : tab.nameEn}</span>
            </button>
          );
        })}
      </div>

      {/* Offline Storage Status Banner */}
      <OfflineSyncStatus isAr={isAr} className="mb-6" />

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Permits Cards List */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-4 h-4" />
              <span>{isAr ? 'قائمة التصاريح المعتمدة:' : 'Approved Permits List:'}</span>
            </h3>
            <span className="text-[11px] font-bold text-[#D4AF37] bg-[#03291F] px-2.5 py-0.5 rounded-full border border-[#D4AF37]/30">
              {filteredPermits.length} {isAr ? 'تصريح' : 'Permits'}
            </span>
          </div>

          {filteredPermits.map((p) => {
            const isSelected = selectedPermit?.id === p.id;
            return (
              <div
                key={p.id}
                onClick={() => setSelectedPermit(p)}
                className={`p-4 rounded-2xl border text-start transition-all cursor-pointer relative overflow-hidden ${
                  isSelected
                    ? 'bg-[#03291F] border-2 border-[#D4AF37] shadow-[0_0_25px_rgba(212,175,55,0.3)] ring-1 ring-white/20'
                    : 'bg-[#02130D] border-[#D4AF37]/30 hover:border-[#D4AF37]/70'
                }`}
              >
                {p.category === 'hajj' && (
                  <div className="absolute -top-10 -left-10 w-24 h-24 bg-[#D4AF37]/10 rounded-full blur-xl pointer-events-none" />
                )}

                <div className="flex items-center justify-between mb-2">
                  <span className="font-black text-xs sm:text-sm text-white flex items-center gap-1.5">
                    {p.category === 'hajj' && <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />}
                    {isAr ? p.typeAr : p.typeEn}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold">
                    <CheckCircle2 className="w-3 h-3" />
                    {isAr ? 'ساري ومعتمد' : 'Active'}
                  </span>
                </div>

                <div className="space-y-1 text-xs text-[#F8F3E7]/80 my-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[#F8F3E7]/60">{isAr ? 'الرقم المرجعي:' : 'Ref ID:'}</span>
                    <span className="font-mono font-bold text-[#D4AF37]">{p.id}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#F8F3E7]/60">{isAr ? 'اسم الحاج:' : 'Pilgrim:'}</span>
                    <span className="font-bold text-white">{isAr ? p.pilgrimNameAr : p.pilgrimNameEn}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-[#F8F3E7]/80 pt-2 border-t border-[#D4AF37]/20">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span className="truncate">{p.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span className="truncate">{p.timeSlot}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Selected Digital Pass & Quick Actions */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Digital Permit Card Display */}
          <div className="bg-gradient-to-b from-[#03291F] via-[#021811] to-[#01140E] p-5 sm:p-6 rounded-3xl border-2 border-[#D4AF37] shadow-2xl relative overflow-hidden">
            {/* Top Official Saudi / Ministry Badge Watermark Header */}
            <div className="flex items-center justify-between border-b border-[#D4AF37]/40 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#02130D] border border-[#D4AF37] flex items-center justify-center text-[#D4AF37]">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-[#D4AF37] font-bold block">
                    {isAr ? 'وزارة الحج والعمرة - منصة نسك الرقمية' : 'Ministry of Hajj & Umrah - Nusuk Platform'}
                  </span>
                  <span className="text-xs font-black text-white">
                    {isAr ? 'بطاقة وتصريح الحج الموثق' : 'Official Verified Permit Pass'}
                  </span>
                </div>
              </div>

              <div className="text-end">
                <span className="text-[10px] text-emerald-400 bg-emerald-950/80 border border-emerald-500/50 px-2.5 py-1 rounded-lg font-bold block">
                  {isAr ? '✓ جاهز للعرض الأمني' : '✓ Security Ready'}
                </span>
              </div>
            </div>

            {/* Pilgrim Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center mb-5">
              {/* QR Code Presentation Box */}
              <div className="md:col-span-5 flex flex-col items-center justify-center bg-[#02130D] p-3.5 rounded-2xl border-2 border-[#D4AF37] shadow-inner relative group">
                <div
                  onClick={() => setShowQrZoom(true)}
                  className="w-36 h-36 bg-white rounded-xl p-2.5 border-2 border-[#D4AF37] flex flex-col items-center justify-center shadow-lg cursor-pointer hover:scale-105 transition-all"
                >
                  <QrCode className="w-28 h-28 text-[#02130D]" />
                  <span className="text-[8px] text-[#02130D] font-mono font-bold mt-0.5">{selectedPermit.id}</span>
                </div>

                <button
                  onClick={() => setShowQrZoom(true)}
                  className="mt-2 text-[10px] text-[#D4AF37] font-bold flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <Maximize2 className="w-3 h-3" />
                  <span>{isAr ? 'تكبير الكود للماسح الضوئي' : 'Enlarge QR Scanner'}</span>
                </button>
              </div>

              {/* Information Table */}
              <div className="md:col-span-7 space-y-2 text-xs">
                <div className="p-2 rounded-xl bg-[#02130D]/80 border border-[#D4AF37]/20">
                  <span className="text-[#F8F3E7]/60 block text-[10px]">{isAr ? 'نوع التصريح الرسمي:' : 'Official Permit Type:'}</span>
                  <span className="font-black text-sm text-[#D4AF37]">
                    {isAr ? selectedPermit.typeAr : selectedPermit.typeEn}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 rounded-xl bg-[#02130D]/80 border border-[#D4AF37]/20">
                    <span className="text-[#F8F3E7]/60 block text-[10px]">{isAr ? 'اسم الحاج الثلاثي:' : 'Pilgrim Name:'}</span>
                    <span className="font-bold text-white truncate block">
                      {isAr ? selectedPermit.pilgrimNameAr : selectedPermit.pilgrimNameEn}
                    </span>
                  </div>

                  <div className="p-2 rounded-xl bg-[#02130D]/80 border border-[#D4AF37]/20">
                    <span className="text-[#F8F3E7]/60 block text-[10px]">{isAr ? 'رقم الهوية / الإقامة:' : 'ID / Passport No:'}</span>
                    <span className="font-mono font-bold text-white">{selectedPermit.idNumber}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 rounded-xl bg-[#02130D]/80 border border-[#D4AF37]/20">
                    <span className="text-[#F8F3E7]/60 block text-[10px]">{isAr ? 'مخيم منى / عرفات:' : 'Camp Location:'}</span>
                    <span className="font-bold text-emerald-300 text-[11px]">
                      {selectedPermit.minaTent}
                    </span>
                  </div>

                  <div className="p-2 rounded-xl bg-[#02130D]/80 border border-[#D4AF37]/20">
                    <span className="text-[#F8F3E7]/60 block text-[10px]">{isAr ? 'البوابة / المنفذ:' : 'Entry Gate:'}</span>
                    <span className="font-bold text-amber-300 text-[11px] truncate block">
                      {selectedPermit.gate}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Action Buttons: PDF Preview & Whatsapp Share */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-[#D4AF37]/30">
              <button
                onClick={() => setShowPdfModal(true)}
                className="py-2.5 px-3 rounded-xl bg-[#D4AF37] hover:bg-[#F5E5BE] text-[#02130D] font-black text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md"
              >
                <Eye className="w-4 h-4" />
                <span>{isAr ? 'معاينة وتحميل PDF' : 'Preview & Save PDF'}</span>
              </button>

              <button
                onClick={() => setShowCheckpointModal(true)}
                className="py-2.5 px-3 rounded-xl bg-[#03291F] border border-[#D4AF37] text-[#D4AF37] hover:bg-[#073D2F] font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Smartphone className="w-4 h-4 text-emerald-400" />
                <span>{isAr ? 'عرض العالي السريع' : 'Fast Checkpoint'}</span>
              </button>

              <button
                onClick={handleSharePermit}
                className="py-2.5 px-3 rounded-xl bg-[#02130D] border border-[#D4AF37]/60 text-white hover:text-[#D4AF37] font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Share2 className="w-4 h-4 text-[#D4AF37]" />
                <span>{isAr ? 'مشاركة عبر الواتساب' : 'Share WhatsApp'}</span>
              </button>
            </div>
          </div>

          {/* Quick Security Guidance Tip */}
          <div className="p-3.5 bg-[#03291F]/80 border border-[#D4AF37]/40 rounded-2xl flex items-start gap-3 text-xs text-[#F8F3E7]/90">
            <ShieldCheck className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
            <p>
              {isAr
                ? 'ملاحظة هامة: يجب إبراز كود QR الخاص بتصريح الحج لرجال الأمن عند دخول المنافذ الرئيسية بمنى وعرفات والحرم المكي الشريف. التصريح يعمل دون الحاجة لربط الإنترنت.'
                : 'Important Note: Present your permit QR code at security checkpoints when entering Mina, Arafat, and Haram. QR code works offline.'}
            </p>
          </div>
        </div>
      </div>

      {/* ----------------- MODAL 1: PDF DOCUMENT PREVIEW MODAL ----------------- */}
      <AnimatePresence>
        {showPdfModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-3xl bg-white text-gray-900 rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-[#D4AF37] my-8 relative overflow-hidden"
            >
              {/* Modal Top Control Bar */}
              <div className="flex items-center justify-between border-b pb-4 mb-6 print:hidden">
                <div className="flex items-center gap-2">
                  <FileText className="w-6 h-6 text-[#021811]" />
                  <span className="font-black text-lg text-[#021811]">
                    {isAr ? 'معاينة المستند الرسمي للتصريح (PDF)' : 'Official Permit PDF Document'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrintPdf}
                    className="px-4 py-2 bg-[#D4AF37] text-[#02130D] font-black rounded-xl text-xs flex items-center gap-1.5 hover:bg-[#E5C158] cursor-pointer shadow-md"
                  >
                    <Printer className="w-4 h-4" />
                    <span>{isAr ? 'طباعة / حفظ PDF' : 'Print / Save PDF'}</span>
                  </button>

                  <button
                    onClick={() => setShowPdfModal(false)}
                    className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Printable Official Saudi Ministry Nusuk PDF Document Layout */}
              <div className="border-4 border-[#021811] p-6 rounded-2xl bg-[#FCFAF5] relative space-y-6">
                {/* Official PDF Header */}
                <div className="flex items-center justify-between border-b-2 border-[#D4AF37] pb-4">
                  <div className="text-right">
                    <span className="text-xs font-bold text-gray-600 block">المملكة العربية السعودية</span>
                    <span className="text-sm font-black text-[#021811] block">وزارة الحج والعمرة - منصة نسك</span>
                    <span className="text-[10px] text-gray-500">تصريح تصريح أداء مناسك الحج المعتمد</span>
                  </div>

                  <div className="text-center px-4 py-2 bg-[#021811] text-[#D4AF37] rounded-xl border border-[#D4AF37]">
                    <ShieldCheck className="w-8 h-8 mx-auto" />
                    <span className="text-[10px] font-black block mt-0.5">معتمد رسمياً 1448 هـ</span>
                  </div>

                  <div className="text-left">
                    <span className="text-xs font-bold text-gray-600 block">Kingdom of Saudi Arabia</span>
                    <span className="text-sm font-black text-[#021811] block">Ministry of Hajj & Umrah</span>
                    <span className="text-[10px] text-gray-500">Official Nusuk Permit Pass</span>
                  </div>
                </div>

                {/* Main Body Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                  <div className="sm:col-span-8 space-y-3">
                    <div className="bg-[#021811] text-white p-3.5 rounded-xl border border-[#D4AF37]">
                      <span className="text-[10px] text-[#D4AF37] block font-bold">نوع التصريح / Permit Type</span>
                      <span className="text-base font-black">{selectedPermit.typeAr}</span>
                      <span className="text-xs text-gray-300 block">{selectedPermit.typeEn}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="p-2.5 bg-gray-100 rounded-lg border">
                        <span className="text-gray-500 block text-[10px]">اسم الحاج / Pilgrim Name</span>
                        <span className="font-bold text-gray-900 block">{selectedPermit.pilgrimNameAr}</span>
                      </div>

                      <div className="p-2.5 bg-gray-100 rounded-lg border">
                        <span className="text-gray-500 block text-[10px]">رقم الهوية/الإقامة / ID No</span>
                        <span className="font-mono font-bold text-gray-900 block">{selectedPermit.idNumber}</span>
                      </div>

                      <div className="p-2.5 bg-gray-100 rounded-lg border">
                        <span className="text-gray-500 block text-[10px]">الحملة / Campaign Group</span>
                        <span className="font-bold text-gray-900 block truncate">{selectedPermit.campaignAr}</span>
                      </div>

                      <div className="p-2.5 bg-gray-100 rounded-lg border">
                        <span className="text-gray-500 block text-[10px]">مخيم منى / Mina Tent</span>
                        <span className="font-bold text-emerald-800 block">{selectedPermit.minaTent}</span>
                      </div>
                    </div>
                  </div>

                  {/* QR Code and Reference */}
                  <div className="sm:col-span-4 flex flex-col items-center justify-center p-4 bg-white rounded-2xl border-2 border-gray-300 text-center">
                    <QrCode className="w-32 h-32 text-black" />
                    <span className="text-[10px] font-mono font-bold text-gray-700 mt-2">{selectedPermit.id}</span>
                    <span className="text-[9px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 mt-1">
                      كود تحقق أمني مشفر
                    </span>
                  </div>
                </div>

                {/* Validity Details Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs bg-gray-100 p-3 rounded-xl border">
                  <div>
                    <span className="text-gray-500 text-[10px] block">التاريخ المعتمد</span>
                    <span className="font-bold text-gray-900">{selectedPermit.date}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 text-[10px] block">الفترة الزمنية</span>
                    <span className="font-bold text-gray-900">{selectedPermit.timeSlot}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 text-[10px] block">منفذ الدخول المخصص</span>
                    <span className="font-bold text-gray-900">{selectedPermit.gate}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 text-[10px] block">رمز التشفير الأمني</span>
                    <span className="font-mono text-gray-900 text-[11px] font-bold">{selectedPermit.securityHash}</span>
                  </div>
                </div>

                {/* Terms and Footer */}
                <div className="text-[10px] text-gray-500 text-center border-t pt-3 space-y-1">
                  <p>هذا المستند يعتبر تصريحاً رسمياً صادراً من وزارة الحج والعمرة بالمملكة العربية السعودية.</p>
                  <p className="font-mono text-[9px] text-gray-400">Issued via Arafat Digital Pilgrim System | Security Hash Verification: {selectedPermit.securityHash}</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ----------------- MODAL 2: FAST SECURITY CHECKPOINT DISPLAY MODAL ----------------- */}
      <AnimatePresence>
        {showCheckpointModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-lg bg-[#02130D] text-white rounded-3xl p-6 sm:p-8 border-4 border-red-500 shadow-[0_0_50px_rgba(220,38,38,0.6)] relative text-center space-y-5"
            >
              <button
                onClick={() => setShowCheckpointModal(false)}
                className="absolute top-4 left-4 p-2 rounded-full bg-red-950 text-red-300 hover:text-white border border-red-500/50 cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600 text-white font-black text-xs uppercase tracking-widest animate-pulse shadow-lg">
                <Shield className="w-4 h-4" />
                <span>{isAr ? 'وضع العرض المباشر لرجال الأمن' : 'SECURITY CHECKPOINT DISPLAY'}</span>
              </div>

              <div>
                <h2 className="text-xl font-black text-[#D4AF37]">{selectedPermit.typeAr}</h2>
                <p className="text-xs text-emerald-400 font-bold mt-1">✓ تصريح حج مصرح وساري بالدخول المباشر</p>
              </div>

              {/* Giant QR Code Display */}
              <div className="w-64 h-64 mx-auto bg-white rounded-3xl p-4 border-4 border-[#D4AF37] shadow-[0_0_30px_rgba(252,211,77,0.8)] flex flex-col items-center justify-center">
                <QrCode className="w-52 h-52 text-black" />
                <span className="text-xs font-mono font-black text-black mt-1">{selectedPermit.id}</span>
              </div>

              <div className="bg-[#03291F] p-4 rounded-2xl border border-[#D4AF37]/50 text-xs space-y-1.5 text-right">
                <p className="flex justify-between">
                  <span className="text-[#F8F3E7]/70">الاسم الثلاثي:</span>
                  <span className="font-black text-white">{selectedPermit.pilgrimNameAr}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-[#F8F3E7]/70">رقم الهوية:</span>
                  <span className="font-mono font-bold text-[#D4AF37]">{selectedPermit.idNumber}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-[#F8F3E7]/70">مخيم منى:</span>
                  <span className="font-bold text-emerald-400">{selectedPermit.minaTent}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-[#F8F3E7]/70">البوابة المخصصة:</span>
                  <span className="font-bold text-amber-300">{selectedPermit.gate}</span>
                </p>
              </div>

              <button
                onClick={() => setShowCheckpointModal(false)}
                className="w-full py-3 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-black text-sm transition-all cursor-pointer shadow-lg"
              >
                {isAr ? 'إغلاق شاشة التفتيش' : 'Close Checkpoint Screen'}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ----------------- MODAL 3: ENLARGED QR SCANNER MODAL ----------------- */}
      <AnimatePresence>
        {showQrZoom && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-[#02130D] p-6 rounded-3xl border-4 border-[#D4AF37] text-center space-y-4 max-w-sm w-full"
            >
              <h3 className="text-sm font-black text-[#D4AF37]">
                {isAr ? 'رمز المعاينة والمسح الضوئي' : 'Enlarged QR Code Scanner'}
              </h3>

              <div className="w-64 h-64 mx-auto bg-white p-3 rounded-2xl border-4 border-[#D4AF37] flex flex-col items-center justify-center shadow-2xl">
                <QrCode className="w-56 h-56 text-black" />
                <span className="text-[10px] font-mono font-bold text-black">{selectedPermit.id}</span>
              </div>

              <button
                onClick={() => setShowQrZoom(false)}
                className="w-full py-2.5 rounded-xl bg-[#D4AF37] text-[#02130D] font-black text-xs hover:bg-[#E5C158] cursor-pointer"
              >
                {isAr ? 'تم المسح الضوئي (إغلاق)' : 'Close'}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyPermitsView;

