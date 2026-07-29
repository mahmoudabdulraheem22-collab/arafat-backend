import React, { useState, useEffect } from 'react';
import {
  Compass,
  CheckCircle2,
  Play,
  RotateCcw,
  Volume2,
  ArrowRight,
  Sparkles,
  BookOpen,
  MapPin,
  HeartHandshake,
  HardDriveDownload,
  Wifi,
  Headphones,
  ShieldAlert,
} from 'lucide-react';
import { LanguageOption } from '../../data/languages';
import { saveToCache, getFromCache, CACHE_KEYS } from '../../utils/offlineStorage';
import { RitualAudioPlayer } from '../common/RitualAudioPlayer';

import { JourneyTrackerView } from './JourneyTrackerView';
import { VisualRitualGuides } from '../common/VisualRitualGuides';

import { TTSPlayButton } from '../common/TTSPlayButton';

interface RitualsGuideViewProps {
  language: LanguageOption;
  onBack: () => void;
  onSendToWhatsapp?: (message: string) => void;
  onToggleTTS?: (track: { id: string; title: string; text: string; category?: string; subTitle?: string }) => void;
  currentTTSTrackId?: string;
  isTTSPlaying?: boolean;
}

export const RitualsGuideView: React.FC<RitualsGuideViewProps> = ({
  language,
  onBack,
  onSendToWhatsapp,
  onToggleTTS,
  currentTTSTrackId,
  isTTSPlaying = false,
}) => {
  const isAr = language.code === 'ar';

  const [activeTab, setActiveTab] = useState<'visual_guide' | 'journey_tracker' | 'audio_guide' | 'tawaf_counter' | 'umrah' | 'hajj' | 'arafat' | 'mina'>('visual_guide');
  
  // Interactive Lap Counters initialized from offline cache
  const cachedRituals = getFromCache<{ tawafLap: number; saiLap: number }>(CACHE_KEYS.RITUALS_COUNTER, {
    tawafLap: 1,
    saiLap: 1,
  });

  const [tawafLap, setTawafLap] = useState<number>(cachedRituals.data.tawafLap || 1);
  const [saiLap, setSaiLap] = useState<number>(cachedRituals.data.saiLap || 1);

  // Sync lap counters to offline storage whenever they change
  useEffect(() => {
    saveToCache(CACHE_KEYS.RITUALS_COUNTER, {
      tawafLap,
      saiLap,
      lastUpdated: new Date().toISOString(),
    });
  }, [tawafLap, saiLap]);

  const tawafDuas = [
    { lap: 1, dua: 'بِسْمِ اللَّهِ وَاللَّهُ أَكْبَرُ، اللَّهُمَّ إِيمَانًا بِكَ وَتَصْدِيقًا بِكِتَابِكَ وَوَفَاءً بِعَهْدِكَ وَاتِّبَاعًا لِسُنَّةِ نَبِيِّكَ مُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ.' },
    { lap: 2, dua: 'اللَّهُمَّ إِنَّ هَذَا الْبَيْتَ بَيْتُكَ، وَالْحَرَمَ حَرَمُكَ، وَالأَمْنَ أَمْنُكَ، وَهَذَا مَقَامُ الْعَائِذِ بِكَ مِنَ النَّارِ.' },
    { lap: 3, dua: 'اللَّهُمَّ حَبِّبْ إِلَيْنَا الإِيمَانَ وَزَيِّنْهُ فِي قُلُوبِنَا، وَكَرِّهْ إِلَيْنَا الْكُفْرَ وَالْفُسُوقَ وَالْعِصْيَانَ.' },
    { lap: 4, dua: 'اللَّهُمَّ اجْعَلْهُ حَجًّا مَبْرُورًا، وَذَنْبًا مَغْفُورًا، وَسَعْيًا مَشْكُورًا، وَتِجَارَةً لَنْ تَبُورَ.' },
    { lap: 5, dua: 'اللَّهُمَّ أَقِيلِي عَثْرَتِي، وَاغْفِرْ زَلَّتِي، وَتَجَاوَزْ عَنْ سَيِّئَاتِي، اللَّهُمَّ آتِنَا فِي الدُّنْيَا حَسَنَةً.' },
    { lap: 6, dua: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ.' },
    { lap: 7, dua: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ مُوجِبَاتِ رَحْمَتِكَ، وَعَزَائِمَ مَغْفِرَتِكَ، وَالسَّلامَةَ مِنْ كُلِّ إِثْمٍ، وَالْغَنِيمَةَ مِنْ كُلِّ بِرٍّ.' },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 bg-[#021811]/95 text-[#F8F3E7] rounded-3xl border-2 border-[#D4AF37] shadow-[0_20px_50px_rgba(0,0,0,0.9)] my-6">
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-[#D4AF37]/30 pb-4 mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#D4AF37]/60 bg-[#03291F] hover:bg-[#073D2F] text-[#D4AF37] transition-all text-sm font-bold cursor-pointer"
        >
          <ArrowRight className={`w-4 h-4 ${!isAr ? 'rotate-180' : ''}`} />
          <span>{isAr ? 'العودة للرئيسية' : 'Back to Home'}</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center text-[#D4AF37]">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-[#D4AF37]">
              {isAr ? 'دليل أداء مناسكي التفاعلي' : 'Interactive Rituals Guide'}
            </h2>
            <p className="text-xs text-[#F8F3E7]/70">
              {isAr ? 'خطوات صفة العمرة، الحج، عداد أشواط الطواف والسعي المباشر' : 'Umrah, Hajj steps & Live Tawaf & Sa\'i counter'}
            </p>
          </div>
        </div>
      </div>

      {/* Official Accredited Sources & Disclaimer Banner */}
      <div className="bg-[#03291F] border border-[#D4AF37]/50 rounded-2xl p-3.5 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-inner">
        <div className="flex items-start gap-2.5">
          <ShieldAlert className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
          <div>
            <span className="text-xs font-bold text-[#D4AF37] block">
              {isAr ? 'المصادر والمراجع الرسمية المعتمدة:' : 'Official Accredited Sources:'}
            </span>
            <p className="text-xs text-[#F8F3E7]/85 mt-0.5 leading-relaxed">
              {isAr
                ? 'جميع المخرجات والمعلومات الدينية والمناسك الواردة في التطبيق مستمدة من المصادر والمراجع الرسمية المعتمدة (وزارة الشؤون الإسلامية والدعوة والإرشاد، والرئاسة العامة للبحوث العلمية والإفتاء، ووزارة الحج والعمرة).'
                : 'All religious guidance & Hajj/Umrah rituals are derived from official accredited sources (Ministry of Islamic Affairs, General Presidency of Ifta, and Ministry of Hajj & Umrah).'}
            </p>
          </div>
        </div>
        <div className="shrink-0 bg-[#01140E] px-3 py-1.5 rounded-xl border border-[#D4AF37]/40 text-[11px] font-bold text-[#D4AF37]">
          <span>{isAr ? 'تنويه: رفيق إرشادي ومساعد ذكي ولا يغني عن الفتاوى الرسمية' : 'Smart guidance companion, not a substitute for official fatwas'}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-6 border-b border-[#D4AF37]/20 pb-3">
        {[
          { id: 'visual_guide', titleAr: '📸 الدليل البصري التوضيحي', titleEn: '📸 Visual Illustrated Guide' },
          { id: 'journey_tracker', titleAr: '✅ مُتتبّع خطوات المناسك', titleEn: '✅ Journey Progress Tracker' },
          { id: 'audio_guide', titleAr: '🎧 الأدلة الصوتية للمناسك', titleEn: '🎧 Audio Guides' },
          { id: 'tawaf_counter', titleAr: 'عداد الطواف والسعي الذكي', titleEn: 'Tawaf & Sa\'i Counter' },
          { id: 'umrah', titleAr: 'صفة العمرة خطوة بخطوة', titleEn: 'Umrah Steps' },
          { id: 'hajj', titleAr: 'مناسك الحج اليومية', titleEn: 'Hajj Guide' },
          { id: 'arafat', titleAr: 'يوم عرفة ومزدلفة', titleEn: 'Arafat & Muzdalifah' },
          { id: 'mina', titleAr: 'منى ورمي الجمرات', titleEn: 'Mina & Jamarat' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-[#D4AF37] text-[#02130D] shadow-[0_0_15px_rgba(212,175,55,0.4)]'
                : 'bg-[#03291F] text-[#F8F3E7] hover:bg-[#073D2F]'
            }`}
          >
            {isAr ? tab.titleAr : tab.titleEn}
          </button>
        ))}
      </div>

      {/* Content Area */}
      {activeTab === 'visual_guide' && (
        <VisualRitualGuides
          language={language}
          onToggleTTS={onToggleTTS}
          currentTTSTrackId={currentTTSTrackId}
          isTTSPlaying={isTTSPlaying}
        />
      )}
      {activeTab === 'journey_tracker' && (
        <JourneyTrackerView
          language={language}
          onBack={onBack}
          onSendToWhatsapp={onSendToWhatsapp}
        />
      )}
      {activeTab === 'audio_guide' && (
        <RitualAudioPlayer
          language={language}
          onSendWhatsApp={onSendToWhatsapp}
        />
      )}
      {activeTab === 'tawaf_counter' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tawaf Counter */}
          <div className="bg-gradient-to-b from-[#03291F] to-[#01140E] p-6 rounded-2xl border-2 border-[#D4AF37] flex flex-col items-center justify-between shadow-lg">
            <div className="text-center w-full">
              <span className="text-xs text-[#D4AF37] font-bold uppercase tracking-widest block mb-1">
                {isAr ? 'عداد أشواط الطواف حول الكعبة' : 'Tawaf Lap Counter'}
              </span>
              <h3 className="text-xl font-black text-white mb-4">
                {isAr ? `الشوط الحالي: ${tawafLap} من 7` : `Lap: ${tawafLap} of 7`}
              </h3>

              {/* Lap Circle Indicator */}
              <div className="w-32 h-32 mx-auto rounded-full border-4 border-[#D4AF37] bg-[#02130D] flex flex-col items-center justify-center shadow-[0_0_25px_rgba(212,175,55,0.3)] my-4">
                <span className="text-4xl font-black text-[#D4AF37]">{tawafLap}</span>
                <span className="text-[10px] text-[#F8F3E7]/60">/ 7 {isAr ? 'أشواط' : 'Laps'}</span>
              </div>

              {/* Dua Box for Current Lap */}
              <div className="bg-[#02130D] border border-[#D4AF37]/40 p-4 rounded-xl text-center my-4 min-h-[100px] flex flex-col items-center justify-center space-y-2">
                <span className="text-[10px] text-[#D4AF37] font-bold block">
                  {isAr ? `الدعاء المستحب للشوط ${tawafLap}:` : `Recommended Dua for Lap ${tawafLap}:`}
                </span>
                <p className="text-xs sm:text-sm text-[#F8F3E7] font-serif leading-relaxed">
                  "{tawafDuas[tawafLap - 1]?.dua}"
                </p>
                {onToggleTTS && (
                  <div className="pt-1">
                    <TTSPlayButton
                      trackId={`tawaf_lap_${tawafLap}`}
                      title={isAr ? `دعاء شوط الطواف ${tawafLap}` : `Tawaf Lap ${tawafLap} Dua`}
                      text={tawafDuas[tawafLap - 1]?.dua || ''}
                      category={isAr ? 'أدعية الطواف' : 'Tawaf Duas'}
                      isPlaying={isTTSPlaying}
                      isCurrentTrack={currentTTSTrackId === `tawaf_lap_${tawafLap}`}
                      onToggle={onToggleTTS}
                      variant="pill"
                      labelAr="استماع لدعاء الشوط 🔊"
                      labelEn="Listen Lap Dua 🔊"
                      isAr={isAr}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 w-full">
              <button
                onClick={() => setTawafLap((prev) => Math.min(7, prev + 1))}
                disabled={tawafLap === 7}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA820A] text-[#02130D] font-black text-sm hover:from-[#E5C158] transition-all cursor-pointer shadow-md disabled:opacity-50"
              >
                {tawafLap === 7 ? (isAr ? 'أتممت الطواف بحمد الله' : 'Completed!') : (isAr ? 'انتقال للشوط التالي (+1)' : 'Next Lap (+1)')}
              </button>
              <button
                onClick={() => setTawafLap(1)}
                className="p-3 rounded-xl bg-[#02130D] border border-[#D4AF37]/50 text-[#D4AF37] hover:bg-[#073D2F] cursor-pointer"
                title="إعادة الضبط"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Sa'i Counter */}
          <div className="bg-gradient-to-b from-[#03291F] to-[#01140E] p-6 rounded-2xl border-2 border-[#D4AF37] flex flex-col items-center justify-between shadow-lg">
            <div className="text-center w-full">
              <span className="text-xs text-[#D4AF37] font-bold uppercase tracking-widest block mb-1">
                {isAr ? 'عداد أشواط السعي بين الصفا والمروة' : 'Sa\'i Lap Counter'}
              </span>
              <h3 className="text-xl font-black text-white mb-4">
                {isAr ? `الشوط الحالي: ${saiLap} من 7 (${saiLap % 2 === 1 ? 'من الصفا إلى المروة' : 'من المروة إلى الصفا'})` : `Lap: ${saiLap} of 7`}
              </h3>

              {/* Lap Circle Indicator */}
              <div className="w-32 h-32 mx-auto rounded-full border-4 border-[#D4AF37] bg-[#02130D] flex flex-col items-center justify-center shadow-[0_0_25px_rgba(212,175,55,0.3)] my-4">
                <span className="text-4xl font-black text-[#D4AF37]">{saiLap}</span>
                <span className="text-[10px] text-[#F8F3E7]/60">/ 7 {isAr ? 'أشواط' : 'Laps'}</span>
              </div>

              {/* Dua Box for Sa'i */}
              <div className="bg-[#02130D] border border-[#D4AF37]/40 p-4 rounded-xl text-center my-4 min-h-[100px] flex flex-col items-center justify-center space-y-2">
                <span className="text-[10px] text-[#D4AF37] font-bold block">
                  {isAr ? 'الدعاء المأثور عند الصفا والمروة:' : 'Recommended Dua:'}
                </span>
                <p className="text-xs sm:text-sm text-[#F8F3E7] font-serif leading-relaxed">
                  "إِنَّ الصَّفَا وَالْمَرُوَةَ مِن شَعَائِرِ اللَّهِ ۖ أَبْدَأُ بِمَا بَدَأَ اللَّهُ بِهِ."
                </p>
                {onToggleTTS && (
                  <div className="pt-1">
                    <TTSPlayButton
                      trackId={`sai_lap_${saiLap}`}
                      title={isAr ? `دعاء شوط السعي ${saiLap}` : `Sa'i Lap ${saiLap} Dua`}
                      text="إِنَّ الصَّفَا وَالْمَرُوَةَ مِن شَعَائِرِ اللَّهِ ۖ أَبْدَأُ بِمَا بَدَأَ اللَّهُ بِهِ."
                      category={isAr ? 'أدعية السعي' : 'Sa\'i Duas'}
                      isPlaying={isTTSPlaying}
                      isCurrentTrack={currentTTSTrackId === `sai_lap_${saiLap}`}
                      onToggle={onToggleTTS}
                      variant="pill"
                      labelAr="استماع لدعاء السعي 🔊"
                      labelEn="Listen Sa'i Dua 🔊"
                      isAr={isAr}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 w-full">
              <button
                onClick={() => setSaiLap((prev) => Math.min(7, prev + 1))}
                disabled={saiLap === 7}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA820A] text-[#02130D] font-black text-sm hover:from-[#E5C158] transition-all cursor-pointer shadow-md disabled:opacity-50"
              >
                {saiLap === 7 ? (isAr ? 'أتممت السعي بحمد الله' : 'Completed!') : (isAr ? 'انتقال للشوط التالي (+1)' : 'Next Lap (+1)')}
              </button>
              <button
                onClick={() => setSaiLap(1)}
                className="p-3 rounded-xl bg-[#02130D] border border-[#D4AF37]/50 text-[#D4AF37] hover:bg-[#073D2F] cursor-pointer"
                title="إعادة الضبط"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'umrah' && (
        <div className="space-y-4">
          {[
            { step: '1', titleAr: 'النية والإحرام من الميقات', titleEn: 'Niyyah & Ihram from Miqat', textAr: 'الاغتسال والتطيب للرجال وارتداء ملابس الإحرام والتلبية: "لبَّيك اللَّهمَّ عُمرة".' },
            { step: '2', titleAr: 'الطواف حول الكعبة (7 أشواط)', titleEn: 'Tawaf (7 Laps)', textAr: 'بدء الطواف من الحجر الأسود بجعل الكعبة عن اليسار، مع الدعاء والذكر.' },
            { step: '3', titleAr: 'صلاة ركعتين خلف مقام إبراهيم', titleEn: 'Two Rakaat Prayer behind Maqam Ibrahim', textAr: 'الركعة الأولى بسورة الكافرون والثانية بسورة الإخلاص ثم الشرب من ماء زمزم.' },
            { step: '4', titleAr: 'السعي بين الصفا والمروة (7 أشواط)', titleEn: 'Sa\'i between Safa & Marwah (7 Laps)', textAr: 'البدء بالصفا والختام بالمروة مع الذكر المأثور والدعاء.' },
            { step: '5', titleAr: 'الحلق أو التقصير', titleEn: 'Halq or Taqsir (Hair Cutting)', textAr: 'الحلق للرجال كلياً أو تقصير جميع شعر الرأس، والتقصير للنساء قدر أنملة.' },
          ].map((item) => (
            <div key={item.step} className="p-4 rounded-2xl bg-[#03291F] border border-[#D4AF37]/40 flex flex-col sm:flex-row items-start justify-between gap-4">
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-[#D4AF37] text-[#02130D] font-black flex items-center justify-center shrink-0 text-sm">
                  {item.step}
                </div>
                <div>
                  <h4 className="font-bold text-[#D4AF37] text-sm mb-1">{isAr ? item.titleAr : item.titleEn}</h4>
                  <p className="text-xs text-[#F8F3E7]/80 leading-relaxed">{item.textAr}</p>
                </div>
              </div>
              {onToggleTTS && (
                <div className="shrink-0 self-end sm:self-center">
                  <TTSPlayButton
                    trackId={`umrah_step_${item.step}`}
                    title={isAr ? item.titleAr : item.titleEn}
                    text={item.textAr}
                    category={isAr ? 'صفة العمرة' : 'Umrah Steps'}
                    isPlaying={isTTSPlaying}
                    isCurrentTrack={currentTTSTrackId === `umrah_step_${item.step}`}
                    onToggle={onToggleTTS}
                    variant="pill"
                    labelAr="استماع للتوجيه 🔊"
                    labelEn="Listen Audio 🔊"
                    isAr={isAr}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {activeTab === 'hajj' && (
        <div className="space-y-4">
          {[
            { day: '8 ذو الحجة', titleAr: 'يوم التروية بمِنى', textAr: 'الإحرام بالحج والتوجه إلى منى وصلاة الظهر والعصر والمغرب والعشاء والفجر قصراً بلا جمع.' },
            { day: '9 ذو الحجة', titleAr: 'يوم عرفة العظيم', textAr: 'التوجه إلى عرفات بعد الشروق، صلاة الظهر والعصر جمع تقديم وقصراً، والإكثار من الدعاء حتى غروب الشمس.' },
            { day: 'ليلة 10 ذو الحجة', titleAr: 'المبيت بمزدلفة', textAr: 'الانتقال لمزدلفة بعد غروب الشمس، صلاة المغرب والعشاء جمع تأخير، والتقاط الجمار.' },
            { day: '10 ذو الحجة', titleAr: 'يوم النحر (عيد الأضحى)', textAr: 'رمي جمرة العقبة الكبرى بـ 7 حصيات، ذبح الهدي، الحلق أو التقصير، وطواف الإفاضة والسعي.' },
            { day: '11-13 ذو الحجة', titleAr: 'أيام التشريق بمنى', textAr: 'المبيت بمنى ورمي الجمرات الثلاث (الصغرى، الوسطى، العقبة) بعد الزوال كل يوم بـ 7 حصيات.' },
          ].map((item, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-[#03291F] border border-[#D4AF37]/40 flex flex-col sm:flex-row items-start justify-between gap-4">
              <div className="flex gap-4 items-start">
                <div className="px-3 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37] text-[#D4AF37] font-black text-xs shrink-0">
                  {item.day}
                </div>
                <div>
                  <h4 className="font-bold text-[#D4AF37] text-sm mb-1">{item.titleAr}</h4>
                  <p className="text-xs text-[#F8F3E7]/80 leading-relaxed">{item.textAr}</p>
                </div>
              </div>
              {onToggleTTS && (
                <div className="shrink-0 self-end sm:self-center">
                  <TTSPlayButton
                    trackId={`hajj_step_${idx}`}
                    title={item.titleAr}
                    text={item.textAr}
                    category={isAr ? 'مناسك الحج' : 'Hajj Guide'}
                    isPlaying={isTTSPlaying}
                    isCurrentTrack={currentTTSTrackId === `hajj_step_${idx}`}
                    onToggle={onToggleTTS}
                    variant="pill"
                    labelAr="استماع للتوجيه 🔊"
                    labelEn="Listen Audio 🔊"
                    isAr={isAr}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {(activeTab === 'arafat' || activeTab === 'mina') && (
        <div className="p-6 rounded-2xl bg-[#03291F] border border-[#D4AF37]/50 text-center space-y-3">
          <MapPin className="w-10 h-10 text-[#D4AF37] mx-auto" />
          <h3 className="font-bold text-lg text-[#D4AF37]">
            {activeTab === 'arafat' ? (isAr ? 'إرشادات صعيد عرفات ومزدلفة' : 'Arafat & Muzdalifah Guide') : (isAr ? 'إرشادات مخيمات منى ورمي الجمرات' : 'Mina & Jamarat Guide')}
          </h3>
          <p className="text-xs text-[#F8F3E7]/80 max-w-xl mx-auto leading-relaxed">
            {isAr
              ? 'تلتزم منصة عرفات بتزويدك بالخرائط الحية ومواقع المخيمات ومواعيد رمي الجمرات المحددة من وزارة الحج لتفادي الزحام مع تقديم المساعدة الميدانية.'
              : 'Arafat platform provides live maps, camp locations & scheduled Jamarat throwing times certified by Hajj ministry.'}
          </p>
        </div>
      )}

      {/* Embedded Audio Player for Quick Access across all tabs */}
      {activeTab !== 'audio_guide' && (
        <div className="mt-8 pt-6 border-t border-[#D4AF37]/30">
          <RitualAudioPlayer
            language={language}
            selectedCategory={activeTab}
            onSendWhatsApp={onSendToWhatsapp}
          />
        </div>
      )}
    </div>
  );
};

export default RitualsGuideView;
