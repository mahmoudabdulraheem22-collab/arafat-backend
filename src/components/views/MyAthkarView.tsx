import React, { useState, useRef, useEffect } from 'react';
import {
  Sun,
  Moon,
  BookOpen,
  RotateCcw,
  Volume2,
  VolumeX,
  Heart,
  ArrowRight,
  Sparkles,
  Award,
  Radio,
  Play,
  Pause,
  Search,
  Share2,
  Copy,
  Check,
  Info,
  MapPin,
  Mic,
  Bookmark,
  Layers,
  HelpCircle,
  Repeat,
  Headphones,
  HardDriveDownload,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { LanguageOption } from '../../data/languages';
import {
  RECITERS_DATA,
  LIVE_RADIOS,
  TAJWEED_RULES,
  COLORED_SURAHS,
  VIRTUES_HADITHS,
  Qari,
  RadioChannel,
  ColoredSurah,
} from '../../data/quranData';

import { TTSPlayButton } from '../common/TTSPlayButton';
import { OfflineSyncStatus } from '../common/OfflineSyncStatus';

interface MyAthkarViewProps {
  language: LanguageOption;
  onBack: () => void;
  onToggleTTS?: (track: { id: string; title: string; text: string; category?: string; subTitle?: string }) => void;
  currentTTSTrackId?: string;
  isTTSPlaying?: boolean;
}

export const MyAthkarView: React.FC<MyAthkarViewProps> = ({
  language,
  onBack,
  onToggleTTS,
  currentTTSTrackId,
  isTTSPlaying = false,
}) => {
  const isAr = language.code === 'ar';

  // Navigation main tab
  const [mainTab, setMainTab] = useState<'athkar' | 'offline' | 'qaris' | 'radio' | 'mushaf' | 'hadiths'>('athkar');

  // --- 1. Athkar & Tasbeeh State ---
  const [activeCategory, setActiveCategory] = useState<'talbiyah' | 'sabah' | 'massa' | 'umrah' | 'tawaf' | 'arafat'>('talbiyah');
  const [tasbeehCount, setTasbeehCount] = useState<number>(0);

  // --- Talbiyah Audio & Repeater State ---
  const [isTalbiyahPlaying, setIsTalbiyahPlaying] = useState<boolean>(false);
  const [talbiyahLoop, setTalbiyahLoop] = useState<boolean>(true);
  const [talbiyahCount, setTalbiyahCount] = useState<number>(0);
  const [talbiyahSpeed, setTalbiyahSpeed] = useState<number>(0.85);

  const isTalbiyahPlayingRef = useRef<boolean>(isTalbiyahPlaying);
  const talbiyahLoopRef = useRef<boolean>(talbiyahLoop);
  const talbiyahSpeedRef = useRef<number>(talbiyahSpeed);

  useEffect(() => {
    isTalbiyahPlayingRef.current = isTalbiyahPlaying;
  }, [isTalbiyahPlaying]);

  useEffect(() => {
    talbiyahLoopRef.current = talbiyahLoop;
  }, [talbiyahLoop]);

  useEffect(() => {
    talbiyahSpeedRef.current = talbiyahSpeed;
  }, [talbiyahSpeed]);

  const playTalbiyahSpeechCycle = () => {
    const talbiyahText = 'لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ، لَبَّيْكَ لاَ شَرِيكَ لَكَ لَبَّيْكَ، إِنَّ الْحَمْدَ وَالنِّعْمَةَ لَكَ وَالْمُلْكُ، لاَ شَرِيكَ لَكَ';

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(talbiyahText);
      utterance.lang = 'ar-SA';
      utterance.rate = talbiyahSpeedRef.current;
      utterance.pitch = 1.0;

      utterance.onend = () => {
        setTalbiyahCount((prev) => prev + 1);
        if (talbiyahLoopRef.current && isTalbiyahPlayingRef.current) {
          setTimeout(() => {
            if (isTalbiyahPlayingRef.current) {
              playTalbiyahSpeechCycle();
            }
          }, 1100);
        } else {
          setIsTalbiyahPlaying(false);
        }
      };

      utterance.onerror = () => {
        setIsTalbiyahPlaying(false);
      };

      window.speechSynthesis.speak(utterance);
    } else {
      setTalbiyahCount((prev) => prev + 1);
    }
  };

  const handleToggleTalbiyahAudio = () => {
    if (isTalbiyahPlaying) {
      setIsTalbiyahPlaying(false);
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    } else {
      setIsTalbiyahPlaying(true);
      playTalbiyahSpeechCycle();
    }
  };

  // --- 2. Qaris Recitation Audio State ---
  const [selectedQari, setSelectedQari] = useState<Qari>(RECITERS_DATA[0]);
  const [currentAudioUrl, setCurrentAudioUrl] = useState<string>(RECITERS_DATA[0].surahs[0].audioUrl);
  const [currentSurahTitle, setCurrentSurahTitle] = useState<string>(RECITERS_DATA[0].surahs[0].nameAr);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [audioVolume, setAudioVolume] = useState<number>(0.8);
  const [qariSearch, setQariSearch] = useState<string>('');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // --- 3. Live Radio State ---
  const [activeRadio, setActiveRadio] = useState<RadioChannel | null>(null);
  const [isPlayingRadio, setIsPlayingRadio] = useState<boolean>(false);
  const radioAudioRef = useRef<HTMLAudioElement | null>(null);

  // --- 4. Colored Mushaf State ---
  const [selectedSurah, setSelectedSurah] = useState<ColoredSurah>(COLORED_SURAHS[0]);
  const [fontSize, setFontSize] = useState<number>(20); // font size in px
  const [mushafSearch, setMushafSearch] = useState<string>('');
  const [showTajweedLegend, setShowTajweedLegend] = useState<boolean>(true);

  // --- 5. Hadiths Virtues State ---
  const [hadithCategory, setHadithCategory] = useState<'makkah' | 'madinah'>('makkah');
  const [hadithSearch, setHadithSearch] = useState<string>('');
  const [copiedHadithId, setCopiedHadithId] = useState<string | null>(null);

  // Athkar static dataset
  const athkarCategories = [
    { id: 'talbiyah', titleAr: 'التلبية والتكبير 🕋', titleEn: 'Talbiyah Chants', icon: Volume2 },
    { id: 'sabah', titleAr: 'أذكار الصباح', titleEn: 'Morning Athkar', icon: Sun },
    { id: 'massa', titleAr: 'أذكار المساء', titleEn: 'Evening Athkar', icon: Moon },
    { id: 'umrah', titleAr: 'دعاء العمرة والإحرام', titleEn: 'Umrah & Ihram Duas', icon: BookOpen },
    { id: 'tawaf', titleAr: 'أدعية الطواف والسعي', titleEn: 'Tawaf & Sa\'i Duas', icon: Sparkles },
    { id: 'arafat', titleAr: 'أدعية يوم عرفة المأثورة', titleEn: 'Arafat Blessed Duas', icon: Heart },
  ];

  const athkarData: Record<string, Array<{ text: string; repeat: number; noteAr?: string }>> = {
    talbiyah: [
      {
        text: 'لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ، لَبَّيْكَ لاَ شَرِيكَ لَكَ لَبَّيْكَ، إِنَّ الْحَمْدَ وَالنِّعْمَةَ لَكَ وَالْمُلْكُ، لاَ شَرِيكَ لَكَ.',
        repeat: 100,
        noteAr: 'شعار الحج والعمرة الأعظم، يُسنّ رفع الصوت بها للرجال وإسرارها للنساء من حين الإحرام حتى بدء الطواف في العمرة أو رمي جمرة العقبة في الحج.'
      },
      {
        text: 'لَبَّيْكَ إِلَٰهَ الْحَقِّ لَبَّيْكَ.',
        repeat: 33,
        noteAr: 'من صيغ التلبية الثابتة المأثورة عن النبي ﷺ.'
      },
      {
        text: 'اللَّهُ أَكْبَرُ، اللَّهُ أَكْبَرُ، اللَّهُ أَكْبَرُ، لاَ إِلَٰهَ إِلاَّ اللَّهُ، اللَّهُ أَكْبَرُ، اللَّهُ أَكْبَرُ، وَلِلَّهِ الْحَمْدُ.',
        repeat: 10,
        noteAr: 'تكبيرات العيد والمشاعر المقدسة ومنا والمزدلفة.'
      },
      {
        text: 'لَبَّيْكَ عُمْرَةً وَحَجًّا ، لَبَّيْكَ حَقًّا حَقًّا تعبُّداً ورِقّاً.',
        repeat: 10,
        noteAr: 'صيغة عقد النية والجهر بالتلبية.'
      }
    ],
    sabah: [
      { text: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ.', repeat: 1 },
      { text: 'اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ.', repeat: 1 },
      { text: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ: عَدَدَ خَلْقِهِ، وَرِضَا نَفْسِهِ، وَزِنَةَ عَرْشِهِ، وَمِدَادَ كَلِمَاتِهِ.', repeat: 3 },
      { text: 'آيَةُ الْكُرْسِيِّ: {اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ...}', repeat: 1 },
    ],
    massa: [
      { text: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ.', repeat: 1 },
      { text: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ.', repeat: 3 },
      { text: 'اللَّهُمَّ إِنِّي أَمْسَيْتُ أُشْهِدُكَ وَأُشْهِدُ حَمَلَةَ عَرْشِكَ وَمَلائِكَتَكَ وَجَمِيعَ خَلْقِكَ أَنَّكَ أَنْتَ اللَّهُ لا إِلَهَ إِلا أَنْتَ.', repeat: 4 },
    ],
    umrah: [
      { text: 'لَبَّيْكَ اللَّهُمَّ عُمْرَةً. لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ، لَبَّيْكَ لا شَرِيكَ لَكَ لَبَّيْكَ، إِنَّ الْحَمْدَ وَالنِّعْمَةَ لَكَ وَالْمُلْكُ لا شَرِيكَ لَكَ.', repeat: 1 },
      { text: 'اللَّهُمَّ هَذِهِ عُمْرَةٌ لا رِيَاءَ فِيهَا وَلا سُمْعَةَ، اللَّهُمَّ تَقَبَّلْ مِنِّي وَيَسِّرْهَا لِي.', repeat: 1 },
    ],
    tawaf: [
      { text: 'بِسْمِ اللَّهِ وَاللَّهُ أَكْبَرُ، اللَّهُمَّ إِيمَانًا بِكَ وَتَصْدِيقًا بِكِتَابِكَ وَوَفَاءً بِعَهْدِكَ وَاتِّبَاعًا لِسُنَّةِ نَبِيِّكَ مُحَمَّدٍ ﷺ.', repeat: 7 },
      { text: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ.', repeat: 7 },
    ],
    arafat: [
      { text: 'لا إِلَهَ إِلا اللَّهُ وَحْدَهُ لا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ.', repeat: 100 },
      { text: 'اللَّهُمَّ لَكَ الْحَمْدُ كَالَّذِي نَقُولُ وَخَيْرًا مِمَّا نَقُولُ، اللَّهُمَّ لَكَ صَلاتِي وَنُسُكِي وَمَحْيَايَ وَمَمَاتِي وَإِلَيْكَ مَآبِي.', repeat: 10 },
    ],
  };

  // Handle Qari Audio Playback
  const handlePlaySurah = (qari: Qari, surah: { id: number; nameAr: string; nameEn: string; audioUrl: string }) => {
    // If playing live radio, pause it
    if (isPlayingRadio && radioAudioRef.current) {
      radioAudioRef.current.pause();
      setIsPlayingRadio(false);
    }

    setSelectedQari(qari);
    setCurrentSurahTitle(`${surah.nameAr} - ${qari.nameAr}`);
    setCurrentAudioUrl(surah.audioUrl);

    if (audioRef.current) {
      audioRef.current.src = surah.audioUrl;
      audioRef.current.volume = audioVolume;
      audioRef.current
        .play()
        .then(() => setIsPlayingAudio(true))
        .catch((err) => console.log('Audio playback error:', err));
    }
  };

  const toggleAudioPlay = () => {
    if (!audioRef.current) return;
    if (isPlayingAudio) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlayingAudio(true))
        .catch((err) => console.log('Audio error:', err));
    }
  };

  // Handle Radio Streaming
  const handlePlayRadio = (radio: RadioChannel) => {
    // If playing Qari audio, pause it
    if (isPlayingAudio && audioRef.current) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    }

    if (activeRadio?.id === radio.id && isPlayingRadio) {
      if (radioAudioRef.current) radioAudioRef.current.pause();
      setIsPlayingRadio(false);
      return;
    }

    setActiveRadio(radio);
    if (radioAudioRef.current) {
      radioAudioRef.current.src = radio.streamUrl;
      radioAudioRef.current
        .play()
        .then(() => setIsPlayingRadio(true))
        .catch((err) => console.log('Radio playback error:', err));
    }
  };

  const handleCopyHadith = (hadith: { id: string; hadithText: string; source: string }) => {
    const textToCopy = `${hadith.hadithText}\nالمصدر: ${hadith.source}\n(منصة وطهر بيتي - أذكاري)`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedHadithId(hadith.id);
    setTimeout(() => setCopiedHadithId(null), 2500);
  };

  const handleShareHadithWA = (hadith: { hadithText: string; source: string; titleAr: string }) => {
    const msg = `*${hadith.titleAr}* 🕌\n\n${hadith.hadithText}\n\n*المصدر*: ${hadith.source}\n_تمت المشاركة عبر منصة وطهر بيتي_`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
  };

  // Filter Qaris
  const filteredQaris = RECITERS_DATA.filter(
    (q) =>
      q.nameAr.includes(qariSearch) ||
      q.nameEn.toLowerCase().includes(qariSearch.toLowerCase()) ||
      q.surahs.some((s) => s.nameAr.includes(qariSearch))
  );

  // Filter Hadiths
  const filteredHadiths = VIRTUES_HADITHS.filter(
    (h) =>
      h.category === hadithCategory &&
      (h.titleAr.includes(hadithSearch) ||
        h.hadithText.includes(hadithSearch) ||
        h.benefitsAr.includes(hadithSearch))
  );

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 bg-[#021811]/95 text-[#F8F3E7] rounded-3xl border-2 border-[#D4AF37] shadow-[0_20px_50px_rgba(0,0,0,0.9)] my-6">
      {/* Hidden Audio Elements */}
      <audio ref={audioRef} onEnded={() => setIsPlayingAudio(false)} />
      <audio ref={radioAudioRef} onError={() => setIsPlayingRadio(false)} />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-[#D4AF37]/30 pb-4 mb-6 gap-3">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#D4AF37]/60 bg-[#03291F] hover:bg-[#073D2F] text-[#D4AF37] transition-all text-sm font-bold cursor-pointer"
        >
          <ArrowRight className={`w-4 h-4 ${!isAr ? 'rotate-180' : ''}`} />
          <span>{isAr ? 'العودة للرئيسية' : 'Back to Home'}</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#02130D] border border-[#D4AF37] flex items-center justify-center text-[#D4AF37] shadow-inner">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-[#D4AF37]">
              {isAr ? 'أذكاري - الموسوعة الإيمانية والمصحف' : 'My Athkar & Quranic Spiritual Hub'}
            </h2>
            <p className="text-xs text-[#F8F3E7]/80">
              {isAr
                ? 'حصن المسلم، تلاوات القراء، البث المباشر للإذاعة، المصحف الملون، وأحاديث مكة والمدينة'
                : 'Athkar, World Qaris, Live Quran Radio, Colored Tajweed Quran, & Makkah-Madinah Hadiths'}
            </p>
          </div>
        </div>
      </div>

      {/* Primary Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 bg-[#02130D] p-2 rounded-2xl border border-[#D4AF37]/40 mb-6 shadow-inner">
        <button
          onClick={() => setMainTab('athkar')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            mainTab === 'athkar'
              ? 'bg-[#D4AF37] text-[#02130D] shadow-[0_0_15px_rgba(212,175,55,0.4)]'
              : 'text-[#F8F3E7] hover:bg-[#03291F]'
          }`}
        >
          <Sun className="w-4 h-4" />
          <span>{isAr ? 'الأذكار والمسبحة' : 'Athkar & Tasbeeh'}</span>
        </button>

        <button
          onClick={() => setMainTab('offline')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            mainTab === 'offline'
              ? 'bg-[#D4AF37] text-[#02130D] shadow-[0_0_15px_rgba(212,175,55,0.4)]'
              : 'text-[#F8F3E7] hover:bg-[#03291F]'
          }`}
        >
          <HardDriveDownload className="w-4 h-4 text-[#D4AF37]" />
          <span>{isAr ? 'أدعية الأوفلاين (بدون إنترنت)' : 'Offline Duas Storage'}</span>
        </button>

        <button
          onClick={() => setMainTab('qaris')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            mainTab === 'qaris'
              ? 'bg-[#D4AF37] text-[#02130D] shadow-[0_0_15px_rgba(212,175,55,0.4)]'
              : 'text-[#F8F3E7] hover:bg-[#03291F]'
          }`}
        >
          <Mic className="w-4 h-4" />
          <span>{isAr ? 'تلاوات قراء العالم الإسلامي' : 'Qaris Recitations'}</span>
        </button>

        <button
          onClick={() => setMainTab('radio')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer relative ${
            mainTab === 'radio'
              ? 'bg-[#D4AF37] text-[#02130D] shadow-[0_0_15px_rgba(212,175,55,0.4)]'
              : 'text-[#F8F3E7] hover:bg-[#03291F]'
          }`}
        >
          <Radio className="w-4 h-4 text-emerald-400" />
          <span>{isAr ? 'إذاعة القرآن (بث مباشر)' : 'Live Quran Radio'}</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping absolute top-2 left-2" />
        </button>

        <button
          onClick={() => setMainTab('mushaf')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            mainTab === 'mushaf'
              ? 'bg-[#D4AF37] text-[#02130D] shadow-[0_0_15px_rgba(212,175,55,0.4)]'
              : 'text-[#F8F3E7] hover:bg-[#03291F]'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>{isAr ? 'المصحف الملون (التجويدي)' : 'Colored Tajweed Quran'}</span>
        </button>

        <button
          onClick={() => setMainTab('hadiths')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            mainTab === 'hadiths'
              ? 'bg-[#D4AF37] text-[#02130D] shadow-[0_0_15px_rgba(212,175,55,0.4)]'
              : 'text-[#F8F3E7] hover:bg-[#03291F]'
          }`}
        >
          <Heart className="w-4 h-4 text-rose-400" />
          <span>{isAr ? 'فضل مكة والمدينة' : 'Makkah & Madinah Virtues'}</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: Athkar & Digital Tasbeeh                            */}
      {/* ========================================================= */}
      {mainTab === 'athkar' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn">
          {/* Athkar Categories & Lists */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex flex-wrap gap-2 border-b border-[#D4AF37]/20 pb-3">
              {athkarCategories.map((cat) => {
                const IconComp = cat.icon;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id as any)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      activeCategory === cat.id
                        ? 'bg-[#D4AF37] text-[#02130D] shadow-[0_0_15px_rgba(212,175,55,0.4)]'
                        : 'bg-[#03291F] text-[#F8F3E7] hover:bg-[#073D2F]'
                    }`}
                  >
                    <IconComp className="w-3.5 h-3.5" />
                    <span>{isAr ? cat.titleAr : cat.titleEn}</span>
                  </button>
                );
              })}
            </div>

            <div className="space-y-3">
              {/* Interactive Talbiyah Audio Player Card (مفتاح التلبية وترديد المناسك) */}
              {activeCategory === 'talbiyah' && (
                <div className="p-5 rounded-3xl bg-gradient-to-b from-[#03291F] via-[#021811] to-[#01140E] border-2 border-[#D4AF37] shadow-[0_0_25px_rgba(212,175,55,0.25)] space-y-4 mb-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#D4AF37]/30 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-2xl bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center text-[#D4AF37]">
                        <Headphones className="w-5 h-5 animate-pulse" />
                      </div>
                      <div>
                        <h4 className="text-base font-black text-[#D4AF37]">
                          {isAr ? 'مفتاح التلبية والترديد التفاعلي' : 'Interactive Talbiyah Repeater Key'}
                        </h4>
                        <p className="text-xs text-[#F8F3E7]/80">
                          {isAr ? 'استمع وردّد شعار الحج والعمرة مع التكرار التلقائي طوال الطريق' : 'Listen and recite along with automatic looping'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 bg-[#02130D] px-3 py-1.5 rounded-xl border border-[#D4AF37]/40">
                      <Repeat className={`w-4 h-4 ${talbiyahLoop ? 'text-emerald-400 animate-spin' : 'text-gray-400'}`} />
                      <span className="text-xs font-bold text-[#D4AF37]">
                        {isAr ? `تكرار التلبية: ${talbiyahCount} مرة` : `Talbiyah Count: ${talbiyahCount}`}
                      </span>
                    </div>
                  </div>

                  {/* Sacred Talbiyah Calligraphy Display */}
                  <div className="p-4 rounded-2xl bg-[#01140E] border border-[#D4AF37]/50 text-center relative overflow-hidden">
                    <p className="text-lg sm:text-xl md:text-2xl font-serif text-[#D4AF37] leading-relaxed font-bold tracking-wide">
                      «لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ، لَبَّيْكَ لاَ شَرِيكَ لَكَ لَبَّيْكَ، إِنَّ الْحَمْدَ وَالنِّعْمَةَ لَكَ وَالْمُلْكُ، لاَ شَرِيكَ لَكَ»
                    </p>
                    <p className="text-xs text-[#F8F3E7]/70 mt-2 font-sans italic">
                      "Here I am, O Allah, here I am. Here I am, You have no partner, here I am. All praise, grace and sovereignty belong to You."
                    </p>
                  </div>

                  {/* Control Keys Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-1">
                    {/* Main Audio Toggle Key */}
                    <button
                      onClick={handleToggleTalbiyahAudio}
                      className={`flex items-center justify-center gap-2.5 py-3 px-4 rounded-2xl font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-lg ${
                        isTalbiyahPlaying
                          ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-900/50 animate-pulse'
                          : 'bg-gradient-to-r from-[#D4AF37] to-[#AA820A] text-[#02130D] hover:scale-102 shadow-[0_0_20px_rgba(212,175,55,0.4)]'
                      }`}
                    >
                      {isTalbiyahPlaying ? (
                        <>
                          <Pause className="w-5 h-5" />
                          <span>{isAr ? 'إيقاف الترديد الصوتي' : 'Stop Recitation'}</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-5 h-5 fill-current" />
                          <span>{isAr ? 'تشغيل وترديد التلبية' : 'Play & Recite Talbiyah'}</span>
                        </>
                      )}
                    </button>

                    {/* Loop Toggle Key */}
                    <button
                      onClick={() => setTalbiyahLoop(!talbiyahLoop)}
                      className={`flex items-center justify-center gap-2 py-3 px-3 rounded-2xl font-bold text-xs transition-all cursor-pointer border ${
                        talbiyahLoop
                          ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
                          : 'bg-[#02130D] border-[#D4AF37]/30 text-gray-400 hover:text-white'
                      }`}
                    >
                      <Repeat className="w-4 h-4" />
                      <span>{isAr ? (talbiyahLoop ? 'التكرار التلقائي: مُفَعَّل' : 'التكرار التلقائي: معطّل') : 'Auto-Loop: On'}</span>
                    </button>

                    {/* Speed Key */}
                    <div className="flex items-center justify-between bg-[#02130D] px-3 py-2 rounded-2xl border border-[#D4AF37]/40">
                      <span className="text-[11px] text-[#D4AF37] font-bold">{isAr ? 'سرعة الصوت:' : 'Speed:'}</span>
                      <div className="flex items-center gap-1">
                        {[
                          { val: 0.75, label: '0.75x' },
                          { val: 0.85, label: '0.85x' },
                          { val: 1.0, label: '1.0x' },
                        ].map((s) => (
                          <button
                            key={s.val}
                            onClick={() => setTalbiyahSpeed(s.val)}
                            className={`px-2 py-1 rounded-lg text-[10px] font-bold cursor-pointer ${
                              talbiyahSpeed === s.val
                                ? 'bg-[#D4AF37] text-[#02130D]'
                                : 'bg-[#03291F] text-[#F8F3E7] hover:bg-[#073D2F]'
                            }`}
                          >
                            {s.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Manual Counter Tap Key */}
                    <button
                      onClick={() => setTalbiyahCount((prev) => prev + 1)}
                      className="flex items-center justify-center gap-2 py-3 px-3 rounded-2xl bg-[#02130D] border border-[#D4AF37] text-[#D4AF37] hover:bg-[#073D2F] font-bold text-xs transition-all cursor-pointer"
                    >
                      <Volume2 className="w-4 h-4" />
                      <span>{isAr ? 'ردّد معي (+1)' : 'Count (+1)'}</span>
                    </button>
                  </div>
                </div>
              )}

              {(athkarData[activeCategory] || []).map((item, idx) => {
                const itemId = `athkar_${activeCategory}_${idx}`;
                return (
                  <div key={idx} className="p-4 rounded-2xl bg-[#03291F] border border-[#D4AF37]/40 space-y-3">
                    <p className="text-base sm:text-lg font-serif text-[#F8F3E7] leading-loose text-center">
                      "{item.text}"
                    </p>
                    {item.noteAr && (
                      <p className="text-xs text-[#D4AF37]/90 bg-[#02130D] p-2.5 rounded-xl border border-[#D4AF37]/30 text-center">
                        💡 {item.noteAr}
                      </p>
                    )}
                    <div className="flex flex-wrap items-center justify-between text-[11px] text-[#D4AF37] border-t border-[#D4AF37]/20 pt-2 gap-2">
                      <span className="font-bold">{isAr ? `التكرار المستحب: ${item.repeat} مرة` : `Repeat: ${item.repeat} times`}</span>

                      {onToggleTTS && (
                        <TTSPlayButton
                          trackId={itemId}
                          title={athkarCategories.find((c) => c.id === activeCategory)?.titleAr || 'دعاء ومأثور'}
                          text={item.text}
                          category={isAr ? 'الأذكار والمأثورات' : 'Athkar'}
                          isPlaying={isTTSPlaying}
                          isCurrentTrack={currentTTSTrackId === itemId}
                          onToggle={onToggleTTS}
                          variant="pill"
                          labelAr="استماع بالذكاء الاصطناعي 🔊"
                          labelEn="Listen TTS 🔊"
                          isAr={isAr}
                        />
                      )}

                      <span className="flex items-center gap-1">
                        <Award className="w-3.5 h-3.5" />
                        {isAr ? 'مأثور وموثق' : 'Authentic'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Digital Tasbeeh Counter */}
          <div className="lg:col-span-4 bg-gradient-to-b from-[#03291F] to-[#01140E] p-6 rounded-2xl border-2 border-[#D4AF37] flex flex-col items-center justify-between text-center shadow-xl">
            <div className="w-full">
              <span className="text-xs text-[#D4AF37] font-bold block mb-1">
                {isAr ? 'المسبحة الإلكترونية الذكية' : 'Digital Tasbeeh Counter'}
              </span>
              <h3 className="text-sm font-black text-white mb-4">
                {isAr ? 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ ، سُبْحَانَ اللَّهِ الْعَظِيمِ' : 'SubhanAllah wa Bihamdihi'}
              </h3>

              {/* Clickable Circle Counter */}
              <button
                onClick={() => setTasbeehCount((prev) => prev + 1)}
                className="w-36 h-36 mx-auto rounded-full border-4 border-[#D4AF37] bg-[#02130D] flex flex-col items-center justify-center shadow-[0_0_30px_rgba(212,175,55,0.4)] my-4 hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <span className="text-5xl font-black text-[#D4AF37]">{tasbeehCount}</span>
                <span className="text-[10px] text-[#F8F3E7]/60 mt-1">{isAr ? 'اضغط للتسبيح' : 'Tap to Count'}</span>
              </button>
            </div>

            <button
              onClick={() => setTasbeehCount(0)}
              className="w-full mt-4 py-2.5 rounded-xl bg-[#02130D] border border-[#D4AF37]/50 text-[#D4AF37] hover:bg-[#073D2F] font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{isAr ? 'تصفير العداد' : 'Reset Counter'}</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB OFFLINE: Offline Storage Duas & Management             */}
      {/* ========================================================= */}
      {mainTab === 'offline' && (
        <div className="space-y-6 animate-fadeIn bg-[#01140E] p-6 rounded-2xl border-2 border-[#D4AF37]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#D4AF37]/30 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[#03291F] border border-[#D4AF37] rounded-2xl text-[#D4AF37]">
                <HardDriveDownload className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-black text-[#D4AF37]">
                  {isAr ? 'مركز التخزين المحلي للأدعية والأذكار (Offline Storage)' : 'Offline Duas & Adhkar Local Hub'}
                </h3>
                <p className="text-xs text-[#F8F3E7]/80">
                  {isAr
                    ? 'حزمة شاملة بذاكرة الجهاز الدائمة لضمان وصولك للأدعية والأذكار بدون شبكة في المشاعر'
                    : 'All essential supplications saved locally on your device for network-free pilgrimage'}
                </p>
              </div>
            </div>

            <OfflineSyncStatus
              onToggleTTS={onToggleTTS}
              currentTTSTrackId={currentTTSTrackId}
              isTTSPlaying={isTTSPlaying}
            />
          </div>

          <div className="bg-[#03291F] p-5 rounded-2xl border border-[#D4AF37]/40 text-xs text-[#F8F3E7] space-y-2">
            <div className="flex items-center gap-2 font-bold text-[#D4AF37]">
              <Sparkles className="w-4 h-4" />
              <span>{isAr ? 'مميزات حزمة التخزين المحلي في منصة عرفات:' : 'Arafat Offline Storage Features:'}</span>
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] text-[#F8F3E7]/90 list-disc list-inside">
              <li>{isAr ? 'تضم أكثر من 25 دعاءً مأثوراً للإحرام، الطواف، السعي، عرفة، ومزدلفة' : 'Over 25 essential prayers for Ihram, Tawaf, Sa\'i, & Arafat'}</li>
              <li>{isAr ? 'إمكانية إضافة أدعيتك الخاصة وحفظها محلياً بذاكرة الهاتف' : 'Add & save custom prayers locally on your device'}</li>
              <li>{isAr ? 'دعم مفضلة الأدعية وتصفيتها بضغطة زر واحدة أوفلاين' : 'Bookmark favorite prayers for one-tap offline access'}</li>
              <li>{isAr ? 'محرك نطق صوتی (TTS) نقي لنطق الأدعية المأثورة بدون إنترنت' : 'Vocal TTS engine for clear Dua pronunciation offline'}</li>
            </ul>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: Qaris Recitations (تلاوات قراء العالم الإسلامي)    */}
      {/* ========================================================= */}
      {mainTab === 'qaris' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Active Audio Player Bar */}
          <div className="p-4 bg-gradient-to-r from-[#03291F] via-[#021811] to-[#03291F] border-2 border-[#D4AF37] rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center text-[#D4AF37] shrink-0">
                <Mic className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <span className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-wider block">
                  {isAr ? 'المشغّل الصوتي المباشر' : 'Live Audio Player'}
                </span>
                <h4 className="text-sm font-black text-white">{currentSurahTitle}</h4>
                <p className="text-xs text-[#F8F3E7]/70">{selectedQari.country}</p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4">
              <button
                onClick={toggleAudioPlay}
                className="w-12 h-12 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#AA820A] text-[#02130D] flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                {isPlayingAudio ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ms-0.5" />}
              </button>

              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-[#D4AF37]" />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={audioVolume}
                  onChange={(e) => {
                    const vol = parseFloat(e.target.value);
                    setAudioVolume(vol);
                    if (audioRef.current) audioRef.current.volume = vol;
                  }}
                  className="w-20 accent-[#D4AF37] cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#D4AF37] absolute top-3.5 right-3.5" />
            <input
              type="text"
              value={qariSearch}
              onChange={(e) => setQariSearch(e.target.value)}
              placeholder={isAr ? 'ابحث عن اسم القارئ أو السورة المباركة...' : 'Search for qari or surah name...'}
              className="w-full pr-10 pl-4 py-3 bg-[#02130D] border border-[#D4AF37]/40 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          {/* Grid of Reciters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredQaris.map((qari) => (
              <div
                key={qari.id}
                className={`p-4 rounded-2xl border transition-all space-y-3 ${
                  selectedQari.id === qari.id
                    ? 'bg-[#03291F] border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.2)]'
                    : 'bg-[#02130D] border-[#D4AF37]/30 hover:border-[#D4AF37]/60'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-black text-white flex items-center gap-2">
                      <span>{qari.nameAr}</span>
                      <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                    </h3>
                    <p className="text-[11px] text-[#D4AF37] mt-0.5">{qari.country}</p>
                  </div>
                  <span className="text-[10px] px-2 py-1 rounded-full bg-[#02130D] border border-[#D4AF37]/40 text-[#F8F3E7]/80 font-mono">
                    {qari.surahs.length} {isAr ? 'سور متوفرة' : 'surahs'}
                  </span>
                </div>

                <p className="text-xs text-[#F8F3E7]/70 leading-relaxed">{qari.bio}</p>

                {/* Available Surahs List */}
                <div className="pt-2 border-t border-[#D4AF37]/20 space-y-1.5">
                  <span className="text-[10px] text-[#D4AF37] font-bold block">
                    {isAr ? 'التلاوات المتوفرة لربط الاستماع:' : 'Available Recitations:'}
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {qari.surahs.map((surah) => {
                      const isCurrentSurah =
                        selectedQari.id === qari.id && currentAudioUrl === surah.audioUrl && isPlayingAudio;
                      return (
                        <button
                          key={surah.id}
                          onClick={() => handlePlaySurah(qari, surah)}
                          className={`flex items-center justify-between p-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                            isCurrentSurah
                              ? 'bg-[#D4AF37] text-[#02130D] border-[#D4AF37]'
                              : 'bg-[#03291F] text-[#F8F3E7] border-[#D4AF37]/30 hover:bg-[#073D2F]'
                          }`}
                        >
                          <span className="truncate">{surah.nameAr}</span>
                          <span className="text-[10px] opacity-80 ms-1">{surah.duration}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: Live Quran Radio Stream (البث المباشر)           */}
      {/* ========================================================= */}
      {mainTab === 'radio' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Top Live Banner */}
          <div className="p-5 bg-gradient-to-r from-emerald-950 via-[#03291F] to-[#02130D] border-2 border-[#D4AF37] rounded-3xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-2 z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-400 text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>{isAr ? 'بث حي ومباشر على مدار 24 ساعة' : '24/7 Live Quran Audio Streams'}</span>
              </div>
              <h3 className="text-lg font-black text-white">
                {isAr ? 'إذاعة القرآن الكريم والحرمين الشريفين' : 'Holy Quran & Haramain Live Radio'}
              </h3>
              <p className="text-xs text-[#F8F3E7]/80 max-w-xl">
                {isAr
                  ? 'استمع إلى البث المباشر لإذاعة القرآن الكريم من القاهرة والرياض ومكة المكرمة، وتلاوات خاشعة متواصلة لكبار العلماء والقراء.'
                  : 'Tune in to live broadcasts from Makkah, Medina, Cairo, & Riyadh Quran Radio stations.'}
              </p>
            </div>

            {/* Currently Playing Station Badge */}
            {activeRadio && (
              <div className="p-4 bg-[#02130D]/90 border border-[#D4AF37] rounded-2xl text-center space-y-2 z-10 w-full md:w-64 shrink-0 shadow-lg">
                <span className="text-[10px] text-emerald-400 font-bold block">
                  ● {isAr ? 'يبث الآن' : 'Now Playing'}
                </span>
                <h4 className="text-xs font-black text-white">{activeRadio.titleAr}</h4>
                <div className="flex items-center justify-center gap-2 pt-1">
                  <button
                    onClick={() => handlePlayRadio(activeRadio)}
                    className="w-10 h-10 rounded-full bg-[#D4AF37] text-[#02130D] flex items-center justify-center font-bold shadow-md cursor-pointer"
                  >
                    {isPlayingRadio ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ms-0.5" />}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Grid of Radio Channels */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {LIVE_RADIOS.map((radio) => {
              const isSelected = activeRadio?.id === radio.id && isPlayingRadio;
              return (
                <div
                  key={radio.id}
                  className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
                    isSelected
                      ? 'bg-[#03291F] border-[#D4AF37] shadow-[0_0_25px_rgba(212,175,55,0.3)]'
                      : 'bg-[#02130D] border-[#D4AF37]/30 hover:border-[#D4AF37]/60'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span>{isAr ? 'مباشر الان' : 'LIVE'}</span>
                      </span>
                      <Radio className="w-4 h-4 text-[#D4AF37]" />
                    </div>

                    <h4 className="text-sm font-black text-white">{radio.titleAr}</h4>
                    <p className="text-[11px] text-[#D4AF37] font-medium flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>{radio.locationAr}</span>
                    </p>
                    <p className="text-xs text-[#F8F3E7]/70 leading-relaxed">{radio.descAr}</p>
                  </div>

                  <button
                    onClick={() => handlePlayRadio(radio)}
                    className={`w-full py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-md'
                        : 'bg-gradient-to-r from-[#D4AF37] to-[#AA820A] text-[#02130D] hover:scale-[1.01]'
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <Pause className="w-4 h-4" />
                        <span>{isAr ? 'إيقاف البث الحي' : 'Stop Live Radio'}</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-current" />
                        <span>{isAr ? 'تشغيل البث الحي الآن' : 'Start Live Stream'}</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 4: Colored Tajweed Quran (المصحف الملون التجويدي)      */}
      {/* ========================================================= */}
      {mainTab === 'mushaf' && (
        <div className="space-y-5 animate-fadeIn">
          {/* Tajweed Legend Bar Toggle */}
          <div className="p-4 bg-[#02130D] border border-[#D4AF37]/40 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-[#D4AF37] flex items-center gap-1.5">
                <Bookmark className="w-4 h-4" />
                <span>{isAr ? 'دليل ألوان أحكام التجويد بالمصحف الملون' : 'Tajweed Color Coding Legend'}</span>
              </span>
              <button
                type="button"
                onClick={() => setShowTajweedLegend(!showTajweedLegend)}
                className="text-xs text-[#D4AF37] underline hover:text-white cursor-pointer"
              >
                {showTajweedLegend ? (isAr ? 'إخفاء الدليل' : 'Hide') : (isAr ? 'عرض الدليل' : 'Show')}
              </button>
            </div>

            {showTajweedLegend && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 pt-2 border-t border-[#D4AF37]/20">
                {TAJWEED_RULES.map((rule, idx) => (
                  <div key={idx} className="p-2 bg-[#03291F] border border-[#D4AF37]/30 rounded-xl space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: rule.hex }} />
                      <span className="text-xs font-bold text-white truncate">{rule.nameAr}</span>
                    </div>
                    <p className="text-[10px] text-[#D4AF37]">{rule.example}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Controls Bar: Surah Picker & Font Size */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-[#03291F] border border-[#D4AF37]/40 rounded-2xl">
            {/* Surah Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
              {COLORED_SURAHS.map((surah) => (
                <button
                  key={surah.id}
                  onClick={() => setSelectedSurah(surah)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${
                    selectedSurah.id === surah.id
                      ? 'bg-[#D4AF37] text-[#02130D] border-[#D4AF37] shadow-md'
                      : 'bg-[#02130D] text-white border-[#D4AF37]/30 hover:border-[#D4AF37]'
                  }`}
                >
                  {surah.nameAr} ({surah.revelationType})
                </button>
              ))}
            </div>

            {/* Font Adjuster */}
            <div className="flex items-center gap-2 text-xs font-bold text-[#D4AF37] shrink-0">
              <span>{isAr ? 'حجم الخط:' : 'Font:'}</span>
              <button
                onClick={() => setFontSize((prev) => Math.max(16, prev - 2))}
                className="w-7 h-7 rounded-lg bg-[#02130D] border border-[#D4AF37]/50 flex items-center justify-center hover:bg-[#073D2F] cursor-pointer"
              >
                A-
              </button>
              <span className="text-white font-mono">{fontSize}px</span>
              <button
                onClick={() => setFontSize((prev) => Math.min(36, prev + 2))}
                className="w-7 h-7 rounded-lg bg-[#02130D] border border-[#D4AF37]/50 flex items-center justify-center hover:bg-[#073D2F] cursor-pointer"
              >
                A+
              </button>
            </div>
          </div>

          {/* Frame Container for Quran Verses */}
          <div className="p-6 sm:p-8 bg-gradient-to-b from-[#021811] via-[#01140E] to-[#021811] border-2 border-[#D4AF37] rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.8)] text-center space-y-6 relative overflow-hidden">
            {/* Islamic Frame Watermark Background */}
            <div className="absolute inset-2 border border-[#D4AF37]/20 rounded-2xl pointer-events-none" />

            {/* Surah Header */}
            <div className="space-y-1">
              <h3 className="text-2xl font-black text-[#D4AF37] tracking-wide">
                {selectedSurah.nameAr}
              </h3>
              <p className="text-xs text-[#F8F3E7]/70">
                {selectedSurah.revelationType} • {selectedSurah.versesCount} {isAr ? 'آيات' : 'verses'} • {isAr ? `الجزء ${selectedSurah.juz}` : `Juz ${selectedSurah.juz}`}
              </p>
            </div>

            {/* Basmala */}
            {selectedSurah.id !== 9 && (
              <p className="text-lg font-serif text-[#D4AF37] font-bold py-2 border-y border-[#D4AF37]/20 max-w-sm mx-auto">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </p>
            )}

            {/* Verses Container */}
            <div className="space-y-6 pt-2 text-right dir-rtl">
              {selectedSurah.verses.map((v) => (
                <div key={v.number} className="p-4 bg-[#03291F]/60 border border-[#D4AF37]/30 rounded-2xl space-y-2 hover:border-[#D4AF37]/60 transition-all">
                  <div
                    className="font-serif leading-[2.5] text-[#F8F3E7]"
                    style={{ fontSize: `${fontSize}px` }}
                    dangerouslySetInnerHTML={{ __html: `${v.textHtml} ﴿${v.number}﴾` }}
                  />
                  {v.translationEn && (
                    <p className="text-xs text-[#F8F3E7]/60 dir-ltr text-left pt-2 border-t border-[#D4AF37]/10 font-sans">
                      {v.translationEn}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 5: Virtues of Makkah & Madinah Hadiths                */}
      {/* ========================================================= */}
      {mainTab === 'hadiths' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Sub-tabs Makkah vs Madinah */}
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => setHadithCategory('makkah')}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-black text-xs sm:text-sm transition-all cursor-pointer border ${
                hadithCategory === 'makkah'
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#AA820A] text-[#02130D] border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.4)]'
                  : 'bg-[#03291F] text-white border-[#D4AF37]/40 hover:bg-[#073D2F]'
              }`}
            >
              <span>🕋</span>
              <span>{isAr ? 'فضل مكة المكرمة والحرم المكي' : 'Virtues of Makkah'}</span>
            </button>

            <button
              onClick={() => setHadithCategory('madinah')}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-black text-xs sm:text-sm transition-all cursor-pointer border ${
                hadithCategory === 'madinah'
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#AA820A] text-[#02130D] border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.4)]'
                  : 'bg-[#03291F] text-white border-[#D4AF37]/40 hover:bg-[#073D2F]'
              }`}
            >
              <span>🕌</span>
              <span>{isAr ? 'فضل المدينة المنورة والمسجد النبوي' : 'Virtues of Madinah'}</span>
            </button>
          </div>

          {/* Search Hadiths */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#D4AF37] absolute top-3.5 right-3.5" />
            <input
              type="text"
              value={hadithSearch}
              onChange={(e) => setHadithSearch(e.target.value)}
              placeholder={isAr ? 'ابحث في أحاديث فضل مكة أو المدينة والفوائد...' : 'Search in hadiths...'}
              className="w-full pr-10 pl-4 py-3 bg-[#02130D] border border-[#D4AF37]/40 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          {/* List of Hadiths */}
          <div className="space-y-4">
            {filteredHadiths.map((h) => (
              <div
                key={h.id}
                className="p-5 rounded-2xl bg-[#03291F] border-2 border-[#D4AF37]/40 space-y-4 shadow-md hover:border-[#D4AF37] transition-all"
              >
                <div className="flex items-start justify-between border-b border-[#D4AF37]/20 pb-3 gap-2">
                  <h3 className="text-sm font-black text-[#D4AF37] flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                    <span>{h.titleAr}</span>
                  </h3>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#02130D] border border-[#D4AF37]/40 text-emerald-400 shrink-0">
                    {h.source}
                  </span>
                </div>

                <p className="text-base font-serif text-[#F8F3E7] leading-loose text-center py-2 px-3 bg-[#02130D]/80 rounded-xl border border-[#D4AF37]/20">
                  {h.hadithText}
                </p>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-[#D4AF37] font-bold">
                    <Info className="w-3.5 h-3.5" />
                    <span>{isAr ? 'الراوي والشرح الإيماني:' : 'Narrator & Spiritual Benefit:'}</span>
                  </div>
                  <p className="text-xs text-[#F8F3E7]/80 leading-relaxed ps-5">
                    <strong className="text-white">{h.narrator}:</strong> {h.benefitsAr}
                  </p>
                </div>

                {/* Actions: Copy & Share */}
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#D4AF37]/20">
                  <button
                    onClick={() => handleCopyHadith(h)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#02130D] border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-bold hover:bg-[#073D2F] transition-all cursor-pointer"
                  >
                    {copiedHadithId === h.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedHadithId === h.id ? (isAr ? 'تم النسخ' : 'Copied') : (isAr ? 'نسخ الحديث' : 'Copy')}</span>
                  </button>

                  <button
                    onClick={() => handleShareHadithWA(h)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all cursor-pointer shadow-sm"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>{isAr ? 'مشاركة عبر الواتساب' : 'Share WhatsApp'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyAthkarView;
