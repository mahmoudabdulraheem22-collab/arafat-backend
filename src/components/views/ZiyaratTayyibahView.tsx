import React, { useState } from 'react';
import { ArrowLeft, Building2, MapPin, Sparkles, BookOpen, Heart, Compass, CheckCircle2, ShieldCheck, ExternalLink } from 'lucide-react';
import { LanguageOption } from '../../data/languages';

import { TTSPlayButton } from '../common/TTSPlayButton';

interface ZiyaratTayyibahViewProps {
  language: LanguageOption;
  onBack: () => void;
  onSendToWhatsapp?: (msg: string) => void;
  onToggleTTS?: (track: { id: string; title: string; text: string; category?: string; subTitle?: string }) => void;
  currentTTSTrackId?: string;
  isTTSPlaying?: boolean;
}

export const ZiyaratTayyibahView: React.FC<ZiyaratTayyibahViewProps> = ({
  language,
  onBack,
  onSendToWhatsapp,
  onToggleTTS,
  currentTTSTrackId,
  isTTSPlaying = false,
}) => {
  const isAr = language.code === 'ar';
  const [activeTab, setActiveTab] = useState<'prophet_mosque' | 'landmarks' | 'supplications' | 'etiquette'>('prophet_mosque');

  const landmarks = [
    {
      id: 'prophet_mosque',
      nameAr: 'المسجد النبوي الشريف والروضة الشريفة',
      nameEn: 'The Prophet\'s Mosque & Al-Rawdah Al-Sharifah',
      descAr: 'الصلاة فيه بألف صلاة، وتضم الروضة الشريفة (ما بين بيتي ومنبري روضة من رياض الجنة).',
      descEn: 'Praying here equals 1000 prayers elsewhere. Contains Al-Rawdah Al-Sharifah.',
      distanceAr: 'مركز المدينة المنورة',
      distanceEn: 'Center of Madinah',
      permitRequired: true,
      tagAr: 'يتطلب تصريح نسك للروضة',
      tagEn: 'Nusuk permit required for Rawdah',
      image: '/images/landing/madinah-prophet-mosque.webp',
    },
    {
      id: 'quba',
      nameAr: 'مسجد قباء',
      nameEn: 'Quba Mosque',
      descAr: 'أول مسجد أُسس على التقوى، والتطهر في البيت ثم الصلاة فيه تعدل أجر عمرة كاملا.',
      descEn: 'The first mosque built in Islam. Performing ablution at home and praying here equals Umrah reward.',
      distanceAr: '3.5 كم من المسجد النبوي',
      distanceEn: '3.5 km from Prophet\'s Mosque',
      permitRequired: false,
      tagAr: 'أجر عمرة تامة',
      tagEn: 'Reward of Umrah',
      image: '/images/landing/madinah-prophet-mosque.webp',
    },
    {
      id: 'uhud',
      nameAr: 'جبل أحد ومقبرة شهداء أحد',
      nameEn: 'Mount Uhud & Martyrs Cemetery',
      descAr: 'جبل يحبنا ونحبه، ويضم مقبرة 70 من صحابة رسول الله الكرام وفي مقدمتهم سيد الشهداء حمزة بن عبدالمطلب.',
      descEn: 'A mountain that loves us and we love it. Resting place of 70 honorable companions including Hamza (RA).',
      distanceAr: '5 كم شمال المسجد النبوي',
      distanceEn: '5 km North of Prophet\'s Mosque',
      permitRequired: false,
      tagAr: 'معلم تاريخي وإيماني',
      tagEn: 'Historic & Spiritual Site',
      image: '/images/landing/madinah-prophet-mosque.webp',
    },
    {
      id: 'baqi',
      nameAr: 'مقبرة البقيع الغرقد',
      nameEn: 'Al-Baqi Cemetery',
      descAr: 'مقبرة أهل المدينة المجاورة للمسجد النبوي، تضم أكثر من 10,000 من صحابة رسول الله وأمهات المؤمنين.',
      descEn: 'Historic cemetery adjacent to Prophet\'s Mosque, containing over 10,000 noble companions and Mothers of Believers.',
      distanceAr: 'ملاصق للمسجد النبوي (الجهة الشرقية)',
      distanceEn: 'Adjacent to Prophet\'s Mosque (East side)',
      permitRequired: false,
      tagAr: 'زيارة واستغفار للصحابة',
      tagEn: 'Supplication for Companions',
      image: '/images/landing/madinah-prophet-mosque.webp',
    },
    {
      id: 'qiblatain',
      nameAr: 'مسجد القبلتين',
      nameEn: 'Al-Qiblatain Mosque',
      descAr: 'المسجد الذي نزل فيه الأمر الإلهي بتحويل القبلة من بيت المقدس إلى الكعبة المشرفة في مكة.',
      descEn: 'The mosque where the divine order descended to change Qibla direction from Jerusalem to Makkah.',
      distanceAr: '4 كم شمال غرب المسجد النبوي',
      distanceEn: '4 km North-West of Prophet\'s Mosque',
      permitRequired: false,
      tagAr: 'تحويل القبلة المباركة',
      tagEn: 'Historic Qibla Shift',
      image: '/images/landing/madinah-prophet-mosque.webp',
    },
  ];

  const supplications = [
    {
      titleAr: 'السلام على رسول الله ﷺ عند الشباك الشريف',
      titleEn: 'Greeting the Prophet Peace Be Upon Him',
      textAr: 'السلام عليك يا رسول الله ورحمة الله وبركاته، السلام عليك يا نبي الله وخيرته من خلقه، أشهد أنك قد بلغت الرسالة وأديت الأمانة ونصحت الأمة.',
      textEn: 'Peace be upon you, O Messenger of Allah, and His mercy and blessings. I bear witness that you delivered the message and fulfilled the trust.',
    },
    {
      titleAr: 'السلام على الصدّيق أبا بكر رضي الله عنه',
      titleEn: 'Greeting Abu Bakr As-Siddiq (RA)',
      textAr: 'السلام عليك يا أبا بكر الصديق، السلام عليك يا خليفة رسول الله وصاحبه في الغار، جزاك الله عن أمة محمد خيراً.',
      textEn: 'Peace be upon you, O Abu Bakr As-Siddiq, Caliph of the Messenger of Allah and his companion in the cave.',
    },
    {
      titleAr: 'السلام على الفاروق عمر بن الخطاب رضي الله عنه',
      titleEn: 'Greeting Umar ibn Al-Khattab (RA)',
      textAr: 'السلام عليك يا عمر الفاروق، السلام عليك يا أمير المؤمنين، الذي أعز الله به الإسلام وجعل الحق على لسانه وقلبه.',
      textEn: 'Peace be upon you, O Umar Al-Farooq, Commander of the Faithful.',
    },
    {
      titleAr: 'الدعاء لأهل البقيع وشهداء أحد',
      titleEn: 'Dua for Al-Baqi & Uhud Martyrs',
      textAr: 'السلام عليكم دار قوم مؤمنين، وإنا إن شاء الله بكم لاحقون، اللهم اغفر لأهل بَقيِع الغرقد وشهداء أحد وارفع درجاتهم.',
      textEn: 'Peace be upon you, inhabitants of the abode of believers. O Allah, forgive the people of Baqi and the martyrs of Uhud.',
    },
  ];

  return (
    <div className="bg-[#03291F]/95 border-2 border-[#D4AF37] rounded-3xl p-4 sm:p-8 text-[#F8F3E7] shadow-[0_15px_50px_rgba(0,0,0,0.8)] backdrop-blur-md max-w-5xl mx-auto my-4">
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-[#D4AF37]/30 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#02130D] border border-[#D4AF37] rounded-2xl text-[#D4AF37]">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <span>{isAr ? 'زيارة طيبة الطيبة (المدينة المنورة)' : 'Ziyarat Tayyibah (Madinah Guide)'}</span>
              <Sparkles className="w-5 h-5 text-[#D4AF37]" />
            </h2>
            <p className="text-xs sm:text-sm text-[#D4AF37]/90 font-medium">
              {isAr ? 'دليل زيارة المسجد النبوي، الروضة الشريفة، المعالم التاريخية، وأدعية الزيارة' : 'Guide for Prophet\'s Mosque, Rawdah Sharif, historic landmarks & supplications'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 bg-[#02130D] hover:bg-[#073D2F] border border-[#D4AF37]/60 text-[#D4AF37] font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className={`w-4 h-4 ${isAr ? 'rotate-180' : ''}`} />
          <span>{isAr ? 'العودة' : 'Back'}</span>
        </button>
      </div>

      {/* Tabs Switcher */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
        <button
          type="button"
          onClick={() => setActiveTab('prophet_mosque')}
          className={`py-2.5 px-3 rounded-xl border text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'prophet_mosque'
              ? 'bg-[#D4AF37] text-[#02130D] border-[#D4AF37]'
              : 'bg-[#02130D] text-[#D4AF37] border-[#D4AF37]/40 hover:bg-[#073D2F]'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>{isAr ? 'المسجد النبوي والروضة' : 'Prophet\'s Mosque'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('landmarks')}
          className={`py-2.5 px-3 rounded-xl border text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'landmarks'
              ? 'bg-[#D4AF37] text-[#02130D] border-[#D4AF37]'
              : 'bg-[#02130D] text-[#D4AF37] border-[#D4AF37]/40 hover:bg-[#073D2F]'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>{isAr ? 'معالم زيارة طيبة' : 'Landmarks'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('supplications')}
          className={`py-2.5 px-3 rounded-xl border text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'supplications'
              ? 'bg-[#D4AF37] text-[#02130D] border-[#D4AF37]'
              : 'bg-[#02130D] text-[#D4AF37] border-[#D4AF37]/40 hover:bg-[#073D2F]'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>{isAr ? 'أدعية الزيارة' : 'Supplications'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('etiquette')}
          className={`py-2.5 px-3 rounded-xl border text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'etiquette'
              ? 'bg-[#D4AF37] text-[#02130D] border-[#D4AF37]'
              : 'bg-[#02130D] text-[#D4AF37] border-[#D4AF37]/40 hover:bg-[#073D2F]'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>{isAr ? 'آداب الزيارة' : 'Etiquette'}</span>
        </button>
      </div>

      {/* Tab 1: Prophet Mosque & Rawdah */}
      {activeTab === 'prophet_mosque' && (
        <div className="space-y-6">
          <div className="p-5 bg-[#021811] border border-[#D4AF37]/50 rounded-2xl flex flex-col md:flex-row gap-6 items-center">
            <div className="w-full md:w-1/2 h-52 rounded-xl overflow-hidden border border-[#D4AF37]/30">
              <img
                src="/images/landing/madinah-prophet-mosque.webp"
                alt="المسجد النبوي الشريف"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-full md:w-1/2 space-y-3">
              <span className="px-3 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/60 text-xs font-bold text-[#D4AF37]">
                {isAr ? 'الروضة الشريفة' : 'Al-Rawdah Sharifah'}
              </span>
              <h3 className="text-xl font-black text-white">
                {isAr ? 'الصلاة في الروضة الشريفة والسلام على النبي ﷺ' : 'Praying in Rawdah & Greeting Prophet ﷺ'}
              </h3>
              <p className="text-xs sm:text-sm text-[#F8F3E7]/90 leading-relaxed">
                {isAr
                  ? 'قال النبي ﷺ: "ما بين بيتي ومنبري روضة من رياض الجنة". الصلاة في الروضة الشريفة تتطلب حجز تصريح مسبق عبر تطبيق «نسك» لضمان تنظيم وحفظ راحة ضيوف الرحمن.'
                  : 'Prophet ﷺ said: "Between my house and my pulpit is a garden from the gardens of Paradise". Praying in Rawdah requires prior permit booking via Nusuk app.'}
              </p>

              <div className="p-3 bg-[#03291F] border border-[#D4AF37]/30 rounded-xl space-y-2 text-xs">
                <div className="flex items-center gap-2 text-emerald-300 font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isAr ? 'خطوات حجز تصريح الروضة عبر نسك:' : 'Steps to book Rawdah permit:'}</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-[#F8F3E7]/80">
                  <li>{isAr ? 'فتح تطبيق نسك واختيار الصلاة في الروضة الشريفة (رجال / نساء).' : 'Open Nusuk app and select Praying in Rawdah.'}</li>
                  <li>{isAr ? 'تحديد التاريخ والوقت المناسب وحضور الموعد بدقة.' : 'Select date & time slot and arrive on schedule.'}</li>
                  <li>{isAr ? 'إبراز الكود الرقمي للخدم العسكريين والمنظمين عند الأبواب.' : 'Present QR permit to organizers at gates.'}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Landmarks */}
      {activeTab === 'landmarks' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {landmarks.map((item) => (
            <div key={item.id} className="p-4 bg-[#021811] border border-[#D4AF37]/40 rounded-2xl hover:border-[#D4AF37] transition-all space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-black text-base text-white">{isAr ? item.nameAr : item.nameEn}</h4>
                <span className="px-2.5 py-0.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/60 text-[11px] font-bold text-[#D4AF37]">
                  {isAr ? item.tagAr : item.tagEn}
                </span>
              </div>
              <p className="text-xs text-[#F8F3E7]/80 leading-relaxed">
                {isAr ? item.descAr : item.descEn}
              </p>
              <div className="flex items-center justify-between text-[11px] text-[#D4AF37]/90 font-semibold pt-2 border-t border-[#D4AF37]/20">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  {isAr ? item.distanceAr : item.distanceEn}
                </span>
                {onSendToWhatsapp && (
                  <button
                    type="button"
                    onClick={() => onSendToWhatsapp(`أود الاستفسار عن تنظيم زيارة إلى ${isAr ? item.nameAr : item.nameEn} في المدينة المنورة`)}
                    className="text-[#D4AF37] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>{isAr ? 'طلب مواصلات / جولة' : 'Book Tour'}</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Supplications */}
      {activeTab === 'supplications' && (
        <div className="space-y-4">
          {supplications.map((sup, idx) => {
            const trackId = `madinah_sup_${idx}`;
            return (
              <div key={idx} className="p-4 bg-[#021811] border border-[#D4AF37]/40 rounded-2xl space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-bold text-sm text-[#D4AF37] flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-emerald-400" />
                    <span>{isAr ? sup.titleAr : sup.titleEn}</span>
                  </h4>
                  {onToggleTTS && (
                    <TTSPlayButton
                      trackId={trackId}
                      title={isAr ? sup.titleAr : sup.titleEn}
                      text={sup.textAr}
                      category={isAr ? 'أدعية الزيارة' : 'Madinah Duas'}
                      isPlaying={isTTSPlaying}
                      isCurrentTrack={currentTTSTrackId === trackId}
                      onToggle={onToggleTTS}
                      variant="pill"
                      labelAr="استماع بالصوت 🔊"
                      labelEn="Listen Audio 🔊"
                      isAr={isAr}
                    />
                  )}
                </div>
                <p className="text-sm font-semibold text-white leading-loose bg-[#03291F] p-3 rounded-xl border border-[#D4AF37]/20 font-serif">
                  "{isAr ? sup.textAr : sup.textEn}"
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 4: Etiquette */}
      {activeTab === 'etiquette' && (
        <div className="p-5 bg-[#021811] border border-[#D4AF37]/40 rounded-2xl space-y-4 text-xs sm:text-sm">
          <h3 className="font-black text-lg text-[#D4AF37] flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-400" />
            <span>{isAr ? 'آداب وأخلاق زيارة المدينة المنورة' : 'Etiquette of Visiting Madinah'}</span>
          </h3>

          <ul className="space-y-3 text-[#F8F3E7]/90 leading-relaxed">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{isAr ? 'إخلاص النية لله تعالى واستشعار هيبة ومكانة المدينة المنورة والمسجد النبوي.' : 'Sincere intention for Allah and honoring the sanctity of Madinah.'}</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{isAr ? 'خفض الصوت والتأدب التام عند السلام على الرسول ﷺ وصاحبيه الكرام.' : 'Lowering voice and maintaining deep respect when greeting Prophet ﷺ and companions.'}</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{isAr ? 'تجنب التزاحم أو رفع الصوت داخل الروضة الشريفة ومراعاة بقية المصلين.' : 'Avoiding overcrowding and maintaining tranquility inside Rawdah Sharif.'}</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{isAr ? 'كثرة الصلاة والسلام على النبي المختار والكثرة من النوافل والاستغفار.' : 'Frequent prayers upon Prophet Muhammad ﷺ and continuous supplication.'}</span>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ZiyaratTayyibahView;
