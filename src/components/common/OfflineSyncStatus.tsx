import React, { useState, useEffect } from 'react';
import {
  Wifi,
  WifiOff,
  RefreshCw,
  HardDriveDownload,
  CheckCircle2,
  X,
  MapPin,
  BookOpen,
  PhoneCall,
  ShieldCheck,
  Search,
  Bookmark,
  Trash2,
  Plus,
  Copy,
  Check,
  Sparkles,
  Award,
  Compass,
  ShieldAlert,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import {
  useOnlineStatus,
  preloadEssentialOfflineData,
  ESSENTIAL_OFFLINE_MAP_POIS,
  getFromCache,
  CACHE_KEYS,
  getOfflineDuasBundle,
  getOfflineHajjGuides,
  getOfflineEmergencyProtocols,
  toggleBookmarkOfflineDua,
  addCustomOfflineDua,
  deleteCustomOfflineDua,
  getOfflineStorageMetrics,
  OfflineDua,
  OfflineHajjGuide,
  OfflineEmergencyProtocol,
} from '../../utils/offlineStorage';
import { TTSPlayButton } from './TTSPlayButton';

interface OfflineSyncStatusProps {
  lastSyncedAt?: string;
  onSync?: () => void;
  onToggleTTS?: (track: { id: string; title: string; text: string; category?: string }) => void;
  currentTTSTrackId?: string;
  isTTSPlaying?: boolean;
}

export const OfflineSyncStatus: React.FC<OfflineSyncStatusProps> = ({
  lastSyncedAt,
  onSync,
  onToggleTTS,
  currentTTSTrackId,
  isTTSPlaying = false,
}) => {
  const isOnline = useOnlineStatus();
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'duas' | 'hajj_guides' | 'emergency' | 'add_custom' | 'map'>('duas');

  // Offline Data State
  const [duasBundle, setDuasBundle] = useState<OfflineDua[]>([]);
  const [hajjGuides, setHajjGuides] = useState<OfflineHajjGuide[]>([]);
  const [emergencyProtocols, setEmergencyProtocols] = useState<OfflineEmergencyProtocol[]>([]);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Expanded cards
  const [expandedGuideId, setExpandedGuideId] = useState<string | null>('hajj_step_1_ihram');
  const [expandedProtocolId, setExpandedProtocolId] = useState<string | null>('protocol_heat_stroke');

  // New Custom Dua Form State
  const [customTitleAr, setCustomTitleAr] = useState('');
  const [customTextAr, setCustomTextAr] = useState('');
  const [customTextEn, setCustomTextEn] = useState('');
  const [customTransliteration, setCustomTransliteration] = useState('');
  const [customCategory, setCustomCategory] = useState<OfflineDua['category']>('custom');
  const [addSuccessMsg, setAddSuccessMsg] = useState(false);

  // Storage Metrics
  const [metrics, setMetrics] = useState(getOfflineStorageMetrics());

  useEffect(() => {
    refreshBundle();
  }, []);

  const refreshBundle = () => {
    const bundle = getOfflineDuasBundle();
    const guides = getOfflineHajjGuides();
    const protocols = getOfflineEmergencyProtocols();

    setDuasBundle(bundle);
    setHajjGuides(guides);
    setEmergencyProtocols(protocols);
    setMetrics(getOfflineStorageMetrics());
  };

  const handleTriggerSync = () => {
    setIsSyncing(true);
    const res = preloadEssentialOfflineData();
    if (onSync) onSync();
    setTimeout(() => {
      setIsSyncing(false);
      refreshBundle();
    }, 800);
  };

  const handleToggleBookmark = (id: string) => {
    const updated = toggleBookmarkOfflineDua(id);
    setDuasBundle(updated);
    setMetrics(getOfflineStorageMetrics());
  };

  const handleDeleteCustom = (id: string) => {
    const updated = deleteCustomOfflineDua(id);
    setDuasBundle(updated);
    setMetrics(getOfflineStorageMetrics());
  };

  const handleAddCustomDua = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitleAr.trim() || !customTextAr.trim()) return;

    const categoryMapAr: Record<string, string> = {
      ihram: 'الإحرام والتلبية',
      tawaf: 'طواف البيت',
      sai: 'السعي بين الصفا والمروة',
      arafat: 'صعيد عرفات',
      muzdalifah: 'مزدلفة والمشعر الحرام',
      mina: 'منى ورمي الجمرات',
      masjid: 'دخول الحرمين والزيارة',
      sabah_massa: 'أذكار الصباح والمساء',
      travel_zamzam: 'زمزم والسفر والمنزل',
      custom: 'أدعيتي الخاصة',
    };

    const updated = addCustomOfflineDua({
      titleAr: customTitleAr.trim(),
      titleEn: customTitleAr.trim(),
      textAr: customTextAr.trim(),
      textEn: customTextEn.trim() || customTextAr.trim(),
      transliteration: customTransliteration.trim(),
      category: customCategory,
      categoryAr: categoryMapAr[customCategory] || 'أدعيتي الخاصة',
      sourceAr: 'دعاء محلي مخصص للذاكرة الدائمة',
    });

    setDuasBundle(updated);
    setMetrics(getOfflineStorageMetrics());
    setCustomTitleAr('');
    setCustomTextAr('');
    setCustomTextEn('');
    setCustomTransliteration('');
    setAddSuccessMsg(true);
    setTimeout(() => setAddSuccessMsg(false), 3000);
    setActiveTab('duas');
  };

  const handleCopyText = (id: string, textAr: string, titleAr: string) => {
    const copyContent = `${titleAr}\n«${textAr}»\n(محفوظ أوفلاين في منصة عرفات لخدمة ضيوف الرحمن)`;
    navigator.clipboard.writeText(copyContent);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Filter Duas
  const filteredDuas = duasBundle.filter((dua) => {
    const matchesCategory =
      selectedCategory === 'all'
        ? true
        : selectedCategory === 'bookmarked'
        ? dua.isBookmarked
        : selectedCategory === 'custom'
        ? dua.isCustom
        : dua.category === selectedCategory;

    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      dua.titleAr.toLowerCase().includes(q) ||
      dua.textAr.toLowerCase().includes(q) ||
      dua.textEn.toLowerCase().includes(q) ||
      (dua.transliteration && dua.transliteration.toLowerCase().includes(q));

    return matchesCategory && matchesSearch;
  });

  // Filter Hajj Guides
  const filteredGuides = hajjGuides.filter((guide) => {
    const q = searchQuery.toLowerCase().trim();
    return (
      !q ||
      guide.titleAr.toLowerCase().includes(q) ||
      guide.summaryAr.toLowerCase().includes(q) ||
      guide.essentialStepsAr.some((s) => s.toLowerCase().includes(q))
    );
  });

  // Filter Emergency Protocols
  const filteredProtocols = emergencyProtocols.filter((proto) => {
    const q = searchQuery.toLowerCase().trim();
    return (
      !q ||
      proto.titleAr.toLowerCase().includes(q) ||
      proto.shortDescAr.toLowerCase().includes(q) ||
      proto.categoryAr.toLowerCase().includes(q)
    );
  });

  const categoryFilterOptions = [
    { id: 'all', label: 'جميع الأدعية والأذكار' },
    { id: 'bookmarked', label: `⭐ المحفوظة بالمفضلة (${metrics.bookmarkedCount})` },
    { id: 'custom', label: `✍️ أدعيتي الخاصة (${metrics.customCount})` },
    { id: 'ihram', label: 'الإحرام والتلبية' },
    { id: 'tawaf', label: 'طواف البيت' },
    { id: 'sai', label: 'السعي بين الصفا والمروة' },
    { id: 'arafat', label: 'صعيد عرفات' },
    { id: 'muzdalifah', label: 'مزدلفة والمشعر الحرام' },
    { id: 'mina', label: 'منى ورمي الجمرات' },
    { id: 'masjid', label: 'دخول الحرمين والزيارة' },
    { id: 'sabah_massa', label: 'أذكار الصباح والمساء' },
    { id: 'travel_zamzam', label: 'زمزم والسفر والمنزل' },
  ];

  return (
    <>
      {/* Offline Status Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#02130D] border border-[#D4AF37]/60 text-xs text-[#D4AF37] shadow-lg">
        {isOnline ? (
          <Wifi className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
        ) : (
          <WifiOff className="w-3.5 h-3.5 text-amber-400 animate-pulse shrink-0" />
        )}
        <span
          className="font-bold cursor-pointer hover:underline"
          onClick={() => setShowModal(true)}
        >
          {isOnline
            ? `متصل (حزمة الأوفلاين: ${metrics.totalDuasCount} دعاء • ${metrics.totalGuidesCount} دليل • ${metrics.totalProtocolsCount} طوارئ)`
            : `أوفلاين (الحزمة محفوظة محلياً: ${metrics.totalDuasCount} دعاء • ${metrics.totalGuidesCount} دليل)`}
        </span>

        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="p-1 hover:bg-[#073D2F] rounded-full text-[#D4AF37] transition-all cursor-pointer border border-[#D4AF37]/30"
          title="عرض وإدارة الأوفلاين"
        >
          <HardDriveDownload className="w-3.5 h-3.5 text-[#D4AF37]" />
        </button>

        <button
          type="button"
          onClick={handleTriggerSync}
          className="p-1 hover:bg-[#073D2F] rounded-full text-[#D4AF37] transition-all cursor-pointer"
          title="تحديث وحفظ البيانات محلياً"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Offline Data Inspection & Management Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#02130D] border-2 border-[#D4AF37] rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl text-[#F8F3E7]">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-[#03291F] via-[#021811] to-[#01140E] border-b border-[#D4AF37]/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-[#D4AF37]/20 border border-[#D4AF37] text-[#D4AF37]">
                  <HardDriveDownload className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-[#D4AF37]">
                    نظام التخزين المحلي والأوفلاين (Offline-First System)
                  </h3>
                  <p className="text-xs text-[#F8F3E7]/80">
                    دليل المناسك، بروتوكولات الطوارئ والسلامة، والأدعية والأذكار المحفوظة محلياً لخدمتك بدون شبكة
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 text-gray-400 hover:text-white rounded-full bg-[#02130D] border border-[#D4AF37]/30 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Offline Status Metrics Bar */}
            <div className="px-5 py-2.5 bg-[#01140E] border-b border-[#D4AF37]/20 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-emerald-400">
                  {isOnline ? 'شبكة متصلة (جاهزية 100% للأوفلاين)' : 'وضع الأوفلاين (تعمل بكفاءة كاملة بدون إنترنت)'}
                </span>
              </div>
              <div className="flex items-center gap-3 text-[#D4AF37]">
                <span>الحجم المحفوظ: <strong className="text-white">{metrics.estimatedSizeKB} KB</strong></span>
                <span>•</span>
                <span>أدلة الحج: <strong className="text-white">{metrics.totalGuidesCount}</strong></span>
                <span>•</span>
                <span>الطوارئ: <strong className="text-white">{metrics.totalProtocolsCount}</strong></span>
                <span>•</span>
                <span>الأدعية: <strong className="text-white">{metrics.totalDuasCount}</strong></span>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-[#D4AF37]/30 bg-[#02130D] overflow-x-auto no-scrollbar">
              <button
                onClick={() => setActiveTab('hajj_guides')}
                className={`flex-1 py-3 px-4 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border-b-2 cursor-pointer transition-all whitespace-nowrap ${
                  activeTab === 'hajj_guides'
                    ? 'border-[#D4AF37] text-[#D4AF37] bg-[#03291F]'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                <Compass className="w-4 h-4 text-[#D4AF37]" />
                <span>أدلة الحج أوفلاين ({hajjGuides.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('emergency')}
                className={`flex-1 py-3 px-4 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border-b-2 cursor-pointer transition-all whitespace-nowrap ${
                  activeTab === 'emergency'
                    ? 'border-rose-500 text-rose-400 bg-rose-950/40'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <span>بروتوكولات الطوارئ ({emergencyProtocols.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('duas')}
                className={`flex-1 py-3 px-4 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border-b-2 cursor-pointer transition-all whitespace-nowrap ${
                  activeTab === 'duas'
                    ? 'border-[#D4AF37] text-[#D4AF37] bg-[#03291F]'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>الأدعية والأذكار ({duasBundle.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('add_custom')}
                className={`flex-1 py-3 px-4 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border-b-2 cursor-pointer transition-all whitespace-nowrap ${
                  activeTab === 'add_custom'
                    ? 'border-[#D4AF37] text-[#D4AF37] bg-[#03291F]'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                <Plus className="w-4 h-4 text-emerald-400" />
                <span>إضافة دعاء خاص</span>
              </button>

              <button
                onClick={() => setActiveTab('map')}
                className={`flex-1 py-3 px-4 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border-b-2 cursor-pointer transition-all whitespace-nowrap ${
                  activeTab === 'map'
                    ? 'border-[#D4AF37] text-[#D4AF37] bg-[#03291F]'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                <MapPin className="w-4 h-4" />
                <span>معالم المشاعر ({ESSENTIAL_OFFLINE_MAP_POIS.length})</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
              {/* TAB: Step-by-Step Offline Hajj Guides */}
              {activeTab === 'hajj_guides' && (
                <div className="space-y-4">
                  {/* Search input */}
                  <div className="relative">
                    <Search className="w-4 h-4 text-[#D4AF37] absolute top-3.5 right-3.5" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="ابحث في دليل المناسك خطوة بخطوة..."
                      className="w-full pr-10 pl-4 py-3 bg-[#01140E] border border-[#D4AF37]/50 rounded-2xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#03291F] border border-[#D4AF37]/40 text-xs text-[#D4AF37] flex items-center gap-2">
                    <Compass className="w-4 h-4 text-[#D4AF37] shrink-0" />
                    <span>دليل مناسك الحج السبعة محفوظ بالكامل على جهازك للاطلاع عليه في الصعيد أو المشاعر بدون شبكة.</span>
                  </div>

                  {filteredGuides.map((guide) => {
                    const isExpanded = expandedGuideId === guide.id;
                    const trackId = `hajj_guide_${guide.id}`;
                    return (
                      <div
                        key={guide.id}
                        className="bg-[#01140E] border border-[#D4AF37]/40 rounded-2xl overflow-hidden transition-all shadow-md"
                      >
                        <div
                          onClick={() => setExpandedGuideId(isExpanded ? null : guide.id)}
                          className="p-4 bg-[#03291F]/80 hover:bg-[#073D2F] cursor-pointer flex items-center justify-between gap-3 border-b border-[#D4AF37]/20"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#D4AF37] text-[#02130D] font-black flex items-center justify-center text-sm shrink-0">
                              {guide.stepNumber}
                            </div>
                            <div>
                              <h4 className="text-sm font-black text-[#D4AF37]">{guide.titleAr}</h4>
                              <p className="text-xs text-[#F8F3E7]/75">{guide.summaryAr}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {onToggleTTS && (
                              <TTSPlayButton
                                trackId={trackId}
                                title={guide.titleAr}
                                text={`${guide.titleAr}. ${guide.summaryAr}. الخطوات الأساسية: ${guide.essentialStepsAr.join('. ')}`}
                                currentTTSTrackId={currentTTSTrackId}
                                isTTSPlaying={isTTSPlaying}
                                onToggleTTS={onToggleTTS}
                                size="sm"
                              />
                            )}
                            {isExpanded ? (
                              <ChevronUp className="w-5 h-5 text-[#D4AF37]" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-gray-400" />
                            )}
                          </div>
                        </div>

                        {isExpanded && (
                          <div className="p-4 space-y-4 text-xs">
                            <div className="flex flex-wrap gap-2 text-[11px] text-gray-300 bg-[#02130D] p-2.5 rounded-xl border border-[#D4AF37]/20">
                              <span>الموقع: <strong className="text-[#D4AF37]">{guide.locationAr}</strong></span>
                              <span>•</span>
                              <span>التوقيت: <strong className="text-emerald-300">{guide.dateAr}</strong></span>
                            </div>

                            {/* Essential Steps */}
                            <div className="space-y-2">
                              <h5 className="font-bold text-[#D4AF37] flex items-center gap-1.5">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                <span>الخطوات التنفيذية الأساسية (أوفلاين):</span>
                              </h5>
                              <ul className="space-y-1.5 pl-2">
                                {guide.essentialStepsAr.map((step, idx) => (
                                  <li key={idx} className="flex items-start gap-2 text-[#F8F3E7]/90">
                                    <span className="text-[#D4AF37] font-bold">•</span>
                                    <span>{step}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Prohibitions */}
                            {guide.prohibitionsAndErrorsAr && guide.prohibitionsAndErrorsAr.length > 0 && (
                              <div className="space-y-2 bg-amber-950/30 p-3 rounded-xl border border-amber-600/30">
                                <h5 className="font-bold text-amber-400 flex items-center gap-1.5">
                                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                                  <span>محظورات وأخطاء يجب تجنبها:</span>
                                </h5>
                                <ul className="space-y-1">
                                  {guide.prohibitionsAndErrorsAr.map((err, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-amber-200">
                                      <span>⚠️</span>
                                      <span>{err}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* Offline Emergency Tips */}
                            {guide.emergencyOfflineTipsAr && guide.emergencyOfflineTipsAr.length > 0 && (
                              <div className="space-y-1.5 bg-emerald-950/40 p-3 rounded-xl border border-emerald-500/30">
                                <h5 className="font-bold text-emerald-300 flex items-center gap-1.5">
                                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                                  <span>تلميحات السلامة وطوارئ الأوفلاين:</span>
                                </h5>
                                {guide.emergencyOfflineTipsAr.map((tip, idx) => (
                                  <p key={idx} className="text-[#F8F3E7]/90 text-[11px]">
                                    💡 {tip}
                                  </p>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* TAB: Emergency Response Protocols */}
              {activeTab === 'emergency' && (
                <div className="space-y-4">
                  <div className="p-3.5 rounded-2xl bg-rose-950/60 border border-rose-600/50 text-xs text-rose-200 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0" />
                      <span>بروتوكولات الإسعاف والسلامة تعمل كلياً أوفلاين دون الحاجة لاتصال بالإنترنت.</span>
                    </div>
                    <a
                      href="tel:997"
                      className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs flex items-center gap-1.5 shrink-0 shadow-lg"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>طوارئ 997</span>
                    </a>
                  </div>

                  {filteredProtocols.map((proto) => {
                    const isExpanded = expandedProtocolId === proto.id;
                    const isCritical = proto.severity === 'critical';
                    const trackId = `emergency_proto_${proto.id}`;
                    return (
                      <div
                        key={proto.id}
                        className={`border rounded-2xl overflow-hidden transition-all shadow-md ${
                          isCritical
                            ? 'bg-rose-950/20 border-rose-600/40'
                            : 'bg-[#01140E] border-[#D4AF37]/40'
                        }`}
                      >
                        <div
                          onClick={() => setExpandedProtocolId(isExpanded ? null : proto.id)}
                          className="p-4 cursor-pointer flex items-center justify-between gap-3 border-b border-white/10"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`p-2.5 rounded-xl border shrink-0 ${
                                isCritical
                                  ? 'bg-rose-600/30 border-rose-500 text-rose-300'
                                  : 'bg-[#03291F] border-[#D4AF37] text-[#D4AF37]'
                              }`}
                            >
                              <ShieldAlert className="w-5 h-5" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-sm font-black text-white">{proto.titleAr}</h4>
                                <span
                                  className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                                    isCritical
                                      ? 'bg-rose-600 text-white'
                                      : 'bg-[#03291F] text-[#D4AF37] border border-[#D4AF37]/30'
                                  }`}
                                >
                                  {proto.categoryAr}
                                </span>
                              </div>
                              <p className="text-xs text-gray-300 mt-0.5">{proto.shortDescAr}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <a
                              href={`tel:${proto.emergencyPhone}`}
                              onClick={(e) => e.stopPropagation()}
                              className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1"
                            >
                              <PhoneCall className="w-3.5 h-3.5" />
                              <span>{proto.emergencyPhone}</span>
                            </a>
                            {onToggleTTS && (
                              <TTSPlayButton
                                trackId={trackId}
                                title={proto.titleAr}
                                text={`${proto.titleAr}. خطوات الفرز: ${proto.triageStepsAr.join('. ')}`}
                                currentTTSTrackId={currentTTSTrackId}
                                isTTSPlaying={isTTSPlaying}
                                onToggleTTS={onToggleTTS}
                                size="sm"
                              />
                            )}
                            {isExpanded ? (
                              <ChevronUp className="w-5 h-5 text-[#D4AF37]" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-gray-400" />
                            )}
                          </div>
                        </div>

                        {isExpanded && (
                          <div className="p-4 space-y-4 text-xs bg-[#01140E]">
                            {/* Triage Steps */}
                            <div className="space-y-2">
                              <h5 className="font-bold text-rose-300 flex items-center gap-1.5">
                                <AlertTriangle className="w-4 h-4 text-rose-400" />
                                <span>خطوات التعامل الفوري بالترتيب (Triage Protocol):</span>
                              </h5>
                              <div className="space-y-1.5 pl-2">
                                {proto.triageStepsAr.map((step, idx) => (
                                  <div
                                    key={idx}
                                    className="p-2.5 rounded-xl bg-[#02130D] border border-rose-500/20 text-[#F8F3E7]/90 leading-relaxed font-bold"
                                  >
                                    {step}
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* First Aid */}
                            {proto.firstAidActionsAr && proto.firstAidActionsAr.length > 0 && (
                              <div className="space-y-2 bg-[#03291F] p-3 rounded-xl border border-[#D4AF37]/30">
                                <h5 className="font-bold text-[#D4AF37] flex items-center gap-1.5">
                                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                                  <span>الإسعافات الأولية المساندة:</span>
                                </h5>
                                <ul className="space-y-1">
                                  {proto.firstAidActionsAr.map((aid, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-emerald-200">
                                      <span>✅</span>
                                      <span>{aid}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* Offline GPS Advice */}
                            <div className="p-2.5 rounded-xl bg-[#02130D] border border-emerald-500/30 text-emerald-300 flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                              <span>{proto.gpsOfflineAdviceAr}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* TAB 1: Offline Duas Search & List */}
              {activeTab === 'duas' && (
                <div className="space-y-4">
                  {/* Search Bar */}
                  <div className="relative">
                    <Search className="w-4 h-4 text-[#D4AF37] absolute top-3.5 right-3.5" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="ابحث في الأدعية والأذكار المحفوظة محلياً..."
                      className="w-full pr-10 pl-4 py-3 bg-[#01140E] border border-[#D4AF37]/50 rounded-2xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  {/* Category Pills */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                    {categoryFilterOptions.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                          selectedCategory === cat.id
                            ? 'bg-[#D4AF37] text-[#02130D] shadow-md'
                            : 'bg-[#03291F] text-[#F8F3E7] hover:bg-[#073D2F] border border-[#D4AF37]/30'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>

                  {/* Duas List */}
                  {filteredDuas.length === 0 ? (
                    <div className="p-8 text-center bg-[#01140E] rounded-2xl border border-[#D4AF37]/30 space-y-2">
                      <p className="text-sm font-bold text-[#D4AF37]">لا توجد نتائج مطابقة للبحث</p>
                      <p className="text-xs text-gray-400">جرب البحث بكلمات مختلفة أو اختر تصنيفاً آخر.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredDuas.map((dua) => {
                        const trackId = `offline_dua_${dua.id}`;
                        return (
                          <div
                            key={dua.id}
                            className={`p-4.5 rounded-2xl border transition-all space-y-3 ${
                              dua.isBookmarked
                                ? 'bg-[#03291F] border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.2)]'
                                : 'bg-[#01140E] border-[#D4AF37]/30 hover:border-[#D4AF37]/60'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2 border-b border-[#D4AF37]/20 pb-2">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-black text-[#D4AF37] bg-[#02130D] px-2.5 py-1 rounded-lg border border-[#D4AF37]/30">
                                  {dua.titleAr}
                                </span>
                                <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#03291F] border border-[#D4AF37]/20 text-[#F8F3E7]/80 font-bold">
                                  {dua.categoryAr}
                                </span>
                                {dua.isCustom && (
                                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-950 border border-emerald-500 text-emerald-300 font-bold">
                                    دعاء خاص
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center gap-1.5">
                                {/* Bookmark Button */}
                                <button
                                  type="button"
                                  onClick={() => handleToggleBookmark(dua.id)}
                                  className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                                    dua.isBookmarked
                                      ? 'bg-[#D4AF37] text-[#02130D] border-[#D4AF37]'
                                      : 'bg-[#02130D] text-gray-400 border-[#D4AF37]/30 hover:text-white'
                                  }`}
                                  title="حفظ للمفضلة الأوفلاين"
                                >
                                  <Bookmark className="w-3.5 h-3.5 fill-current" />
                                </button>

                                {/* Delete button for custom Duas */}
                                {dua.isCustom && (
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteCustom(dua.id)}
                                    className="p-1.5 rounded-lg bg-rose-950 border border-rose-600 text-rose-300 hover:bg-rose-900 transition-all cursor-pointer"
                                    title="حذف هذا الدعاء"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </div>

                            {/* Arabic Text */}
                            <p className="text-base sm:text-lg font-serif text-white leading-relaxed font-bold text-center py-1">
                              «{dua.textAr}»
                            </p>

                            {/* Transliteration & English */}
                            {dua.transliteration && (
                              <p className="text-xs text-[#D4AF37]/90 font-mono text-center italic">
                                {dua.transliteration}
                              </p>
                            )}
                            {dua.textEn && (
                              <p className="text-xs text-[#F8F3E7]/70 text-center italic">
                                {dua.textEn}
                              </p>
                            )}

                            {/* Virtue or Source Note */}
                            {dua.virtueAr && (
                              <div className="text-[11px] text-[#D4AF37] bg-[#02130D] p-2 rounded-xl border border-[#D4AF37]/20 text-center">
                                💡 {dua.virtueAr}
                              </div>
                            )}

                            {/* Bottom Controls Row */}
                            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#D4AF37]/20 pt-2 text-[11px]">
                              <span className="text-[#F8F3E7]/60 flex items-center gap-1">
                                <Award className="w-3.5 h-3.5 text-[#D4AF37]" />
                                <span>{dua.sourceAr || 'مأثور ومحفوظ أوفلاين'}</span>
                              </span>

                              <div className="flex items-center gap-2">
                                {/* TTS Play Button */}
                                {onToggleTTS && (
                                  <TTSPlayButton
                                    trackId={trackId}
                                    title={dua.titleAr}
                                    text={dua.textAr}
                                    category={dua.categoryAr}
                                    isPlaying={isTTSPlaying}
                                    isCurrentTrack={currentTTSTrackId === trackId}
                                    onToggle={onToggleTTS}
                                    variant="pill"
                                    labelAr="استماع صوتي 🔊"
                                    labelEn="Listen TTS 🔊"
                                    isAr={true}
                                  />
                                )}

                                {/* Copy Button */}
                                <button
                                  type="button"
                                  onClick={() => handleCopyText(dua.id, dua.textAr, dua.titleAr)}
                                  className="px-2.5 py-1 rounded-lg bg-[#02130D] border border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#073D2F] font-bold transition-all flex items-center gap-1 cursor-pointer"
                                >
                                  {copiedId === dua.id ? (
                                    <>
                                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                                      <span className="text-emerald-400">تم النسخ</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-3.5 h-3.5" />
                                      <span>نسخ</span>
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: Add Custom Offline Dua Form */}
              {activeTab === 'add_custom' && (
                <form onSubmit={handleAddCustomDua} className="space-y-4 bg-[#01140E] p-5 rounded-2xl border border-[#D4AF37]/40">
                  <div className="flex items-center gap-2 border-b border-[#D4AF37]/30 pb-3">
                    <Sparkles className="w-5 h-5 text-[#D4AF37]" />
                    <div>
                      <h4 className="text-sm font-black text-[#D4AF37]">
                        إضافة دعاء أو أمنية خاصة للتخزين المحلي الدائم
                      </h4>
                      <p className="text-xs text-[#F8F3E7]/70">
                        سيتم حفظ الدعاء بذاكرة جهازك (LocalStorage) ليكون متوفراً في أوقات الطواف والسعي وعرفة
                      </p>
                    </div>
                  </div>

                  {addSuccessMsg && (
                    <div className="p-3 bg-emerald-950 border border-emerald-500 rounded-xl text-xs text-emerald-300 font-bold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>تمت إضافة الدعاء بنجاح إلى حزمة الأدعية المحفوظة محلياً!</span>
                    </div>
                  )}

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-[#D4AF37] mb-1">
                        عنوان الدعاء (مثال: دعاء للوالدين والأبناء) *
                      </label>
                      <input
                        type="text"
                        required
                        value={customTitleAr}
                        onChange={(e) => setCustomTitleAr(e.target.value)}
                        placeholder="اكتب عنواناً مختصراً للدعاء..."
                        className="w-full p-2.5 bg-[#02130D] border border-[#D4AF37]/40 rounded-xl text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#D4AF37] mb-1">
                        نص الدعاء باللغة العربية *
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={customTextAr}
                        onChange={(e) => setCustomTextAr(e.target.value)}
                        placeholder="اكتب نص الدعاء المبارك هنا..."
                        className="w-full p-2.5 bg-[#02130D] border border-[#D4AF37]/40 rounded-xl text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#D4AF37] mb-1">
                        الترجمة بالإنجليزية (اختياري)
                      </label>
                      <input
                        type="text"
                        value={customTextEn}
                        onChange={(e) => setCustomTextEn(e.target.value)}
                        placeholder="English translation if needed..."
                        className="w-full p-2.5 bg-[#02130D] border border-[#D4AF37]/40 rounded-xl text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#D4AF37] mb-1">
                        التصنيف الخاص بالدعاء
                      </label>
                      <select
                        value={customCategory}
                        onChange={(e) => setCustomCategory(e.target.value as any)}
                        className="w-full p-2.5 bg-[#02130D] border border-[#D4AF37]/40 rounded-xl text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                      >
                        <option value="custom">أدعيتي الخاصة</option>
                        <option value="ihram">الإحرام والتلبية</option>
                        <option value="tawaf">طواف البيت</option>
                        <option value="sai">السعي بين الصفا والمروة</option>
                        <option value="arafat">صعيد عرفات</option>
                        <option value="muzdalifah">مزدلفة والمشعر الحرام</option>
                        <option value="mina">منى ورمي الجمرات</option>
                        <option value="sabah_massa">أذكار الصباح والمساء</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-[#D4AF37] text-[#02130D] font-black text-xs hover:bg-[#b8952b] transition-all cursor-pointer shadow-lg flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>حفظ الدعاء في الذاكرة المحلية أوفلاين</span>
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 3: Offline Map POIs */}
              {activeTab === 'map' && (
                <div className="space-y-3">
                  <div className="p-3 rounded-2xl bg-[#03291F] border border-[#D4AF37]/40 text-xs text-[#D4AF37] flex items-center gap-2">
                    <MapPin className="w-4 h-4 shrink-0 text-[#D4AF37]" />
                    <span>معالم مكة والمشاعر المقدسة والمستشفيات محفوظة للإرشاد الأوفلاين.</span>
                  </div>
                  {ESSENTIAL_OFFLINE_MAP_POIS.map((poi) => (
                    <div
                      key={poi.id}
                      className="p-3.5 rounded-2xl bg-[#01140E] border border-[#D4AF37]/30 flex items-start justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-[#D4AF37]">{poi.nameAr}</h4>
                          <span className="text-[10px] bg-[#03291F] px-2 py-0.5 rounded text-emerald-300 font-bold">
                            {poi.type === 'medical' ? 'طوارئ طبية' : 'مشعر مقدس'}
                          </span>
                        </div>
                        <p className="text-xs text-[#F8F3E7]/80">{poi.descriptionAr}</p>
                        <p className="text-[10px] font-mono text-gray-400">
                          إحداثيات: {poi.lat}, {poi.lng}
                        </p>
                      </div>
                      {poi.phone && (
                        <a
                          href={`tel:${poi.phone}`}
                          className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 shrink-0"
                        >
                          <PhoneCall className="w-3.5 h-3.5" />
                          <span>{poi.phone}</span>
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-[#01140E] border-t border-[#D4AF37]/30 flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs text-[#F8F3E7]/80">
                حالة التخزين المحلي: <strong>جاهز 100% للأوفلاين</strong> ({metrics.totalDuasCount} عنصر)
              </span>
              <button
                onClick={handleTriggerSync}
                className="px-4 py-2 rounded-xl bg-[#D4AF37] text-[#02130D] font-bold text-xs flex items-center gap-2 hover:bg-[#b8952b] cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>إعادة حفظ وتحديث الآن</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
