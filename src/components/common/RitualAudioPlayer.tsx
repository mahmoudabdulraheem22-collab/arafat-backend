import React, { useState, useRef } from 'react';
import { Play, Pause, Volume2, Headphones, Share2, Radio } from 'lucide-react';
import { LanguageOption } from '../../data/languages';

interface RitualAudioPlayerProps {
  language: LanguageOption;
  selectedCategory?: string;
  onSendWhatsApp?: (message: string) => void;
}

export const RitualAudioPlayer: React.FC<RitualAudioPlayerProps> = ({
  language,
  onSendWhatsApp,
}) => {
  const isAr = language.code === 'ar';
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  const audioTracks = [
    {
      id: 'audio_fatiha_sudais',
      titleAr: 'سورة الفاتحة المباركة - تلاوة الحرم المكي',
      titleEn: 'Surah Al-Fatiha - Makkah Recitation',
      duration: '01:15',
      reciterAr: 'الشيخ عبد الرحمن السديس',
      audioUrl: 'https://server11.mp3quran.net/sds/001.mp3',
      textAr: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ. الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ. الرَّحْمَٰنِ الرَّحِيمِ. مَالِكِ يَوْمِ الدِّينِ. إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ. اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ.',
    },
    {
      id: 'audio_radio_makkah',
      titleAr: 'إذاعة القرآن الكريم - مكة المكرمة (بث مباشر)',
      titleEn: 'Makkah Live Quran Radio Channel',
      duration: 'بث مباشر 24/7',
      reciterAr: 'الإذاعة المباشرة للحرم المكي',
      audioUrl: 'https://qurango.net/radio/tarawih',
      isRadio: true,
      textAr: 'البث المباشر لإذاعة القرآن الكريم والتراويح من المسجد الحرام بمكة المكرمة.',
    },
    {
      id: 'audio_kahf_afasy',
      titleAr: 'سورة الكهف المباركة (تلاوة خاشعة)',
      titleEn: 'Surah Al-Kahf - Peaceful Recitation',
      duration: '29:15',
      reciterAr: 'الشيخ مشاري بن راشد العفاسي',
      audioUrl: 'https://server8.mp3quran.net/afs/018.mp3',
      textAr: 'الْحَمْدُ لِلَّهِ الَّذِي أَنزَلَ عَلَىٰ عَبْدِهِ الْكِتَابَ وَلَمْ يَجْعَل لَّهُ عِوَجًا ۜ قَيِّمًا لِّيُنذِرَ بَأْسًا شَدِيدًا مِّن لَّدُنْهُ وَيُبَشِّرَ الْمُؤْمِنِينَ.',
    },
    {
      id: 'audio_yasin_minshawi',
      titleAr: 'سورة يس - التلاوة المرتلة الخالدة',
      titleEn: 'Surah Yasin - Heartfelt Recitation',
      duration: '14:20',
      reciterAr: 'الشيخ محمد صديق المنشاوي',
      audioUrl: 'https://server10.mp3quran.net/minsh/036.mp3',
      textAr: 'يس. وَالْقُرْآنِ الْحَكِيمِ. إِنَّكَ لَمِنَ الْمُرْسَلِينَ. عَلَىٰ صِرَاطٍ مُّسْتَقِيمٍ.',
    },
    {
      id: 'audio_rahman_maher',
      titleAr: 'سورة الرحمن - تلاوة شجية',
      titleEn: 'Surah Ar-Rahman Recitation',
      duration: '08:45',
      reciterAr: 'الشيخ ماهر المعيقلي',
      audioUrl: 'https://server12.mp3quran.net/maher/055.mp3',
      textAr: 'الرَّحْمَٰنُ. عَلَّمَ الْقُرْآنَ. خَلَقَ الْإِنسَانَ. عَلَّمَهُ الْبَيَانَ.',
    },
    {
      id: 'audio_umrah_guide',
      titleAr: 'الدليل الصوتي والتلبية لصفة العمرة',
      titleEn: 'Audio Guide & Talbiyah for Umrah',
      duration: '08:45',
      reciterAr: 'دليل عرفات الصوتي',
      textAr: 'لبيك اللهم عمرة... تبدأ من الميقات بالإحرام ثم الطواف سبعة أشواط حول الكعبة، ثم صلاة ركعتين خلف المقام، والسعي بين الصفا والمروة.',
    },
  ];

  const handleTogglePlay = (track: typeof audioTracks[0]) => {
    // If clicking same active track
    if (playingTrackId === track.id && isPlayingAudio) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsPlayingAudio(false);
      setPlayingTrackId(null);
      return;
    }

    // Stop current audio/speech
    if (audioRef.current) {
      audioRef.current.pause();
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    if (track.audioUrl) {
      if (!audioRef.current) {
        audioRef.current = new Audio();
      }
      audioRef.current.src = track.audioUrl;
      setPlayingTrackId(track.id);

      audioRef.current
        .play()
        .then(() => {
          setIsPlayingAudio(true);
        })
        .catch(() => {
          // Fallback to TTS if network audio stream fails
          if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(track.textAr);
            utterance.lang = 'ar-SA';
            utterance.rate = 0.85;
            utterance.onend = () => {
              setIsPlayingAudio(false);
              setPlayingTrackId(null);
            };
            utterance.onerror = () => {
              setIsPlayingAudio(false);
              setPlayingTrackId(null);
            };
            setIsPlayingAudio(true);
            window.speechSynthesis.speak(utterance);
          } else {
            setIsPlayingAudio(false);
            setPlayingTrackId(null);
          }
        });
    } else if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(track.textAr);
      utterance.lang = 'ar-SA';
      utterance.rate = 0.85;
      utterance.onend = () => {
        setIsPlayingAudio(false);
        setPlayingTrackId(null);
      };
      utterance.onerror = () => {
        setIsPlayingAudio(false);
        setPlayingTrackId(null);
      };
      setPlayingTrackId(track.id);
      setIsPlayingAudio(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleShareTrack = (track: typeof audioTracks[0]) => {
    const msg = `🎧 *${isAr ? track.titleAr : track.titleEn}*\n🎙️ القارئ: ${track.reciterAr}\n📖 ${track.textAr}\n\n✨ ${isAr ? 'تم الاستماع عبر منصة عرفات لخدمة ضيوف الرحمن' : 'Arafat Pilgrimage Audio Guide'}`;
    if (onSendWhatsApp) {
      onSendWhatsApp(msg);
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#021A12] via-[#03291F] to-[#01140E] border-2 border-[#D4AF37] rounded-3xl p-4 sm:p-6 space-y-4 shadow-2xl text-[#F8F3E7]">
      <div className="flex items-center justify-between border-b border-[#D4AF37]/30 pb-3 flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-[#03291F] border border-[#D4AF37] text-[#D4AF37] shadow-md">
            <Headphones className="w-6 h-6 text-[#D4AF37]" />
          </div>
          <div>
            <h3 className="font-black text-[#D4AF37] text-base sm:text-lg">
              {isAr ? '🎧 المكتبة الصوتية الشاملة وتلاوات القرآن الكريم' : '🎧 Complete Quran & Rituals Audio Library'}
            </h3>
            <p className="text-xs text-[#F8F3E7]/80">
              {isAr ? 'استمع للتلاوات الخاشعة كبار القراء وإذاعة مكة المباشرة وبصوت واضح 24/7' : 'Listen to soul-soothing Quran recitations & live Makkah streams'}
            </p>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37] text-xs font-black text-[#D4AF37] shadow-sm">
          {isAr ? 'تلاوات وبث مباشر' : 'Live Audio'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {audioTracks.map((track) => {
          const isPlaying = playingTrackId === track.id && isPlayingAudio;
          return (
            <div
              key={track.id}
              className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                isPlaying
                  ? 'bg-gradient-to-r from-[#073D2F] to-[#03291F] border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.4)] scale-[1.01]'
                  : 'bg-[#02130D] border-[#D4AF37]/40 hover:border-[#D4AF37]/80'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <button
                  type="button"
                  onClick={() => handleTogglePlay(track)}
                  title={isPlaying ? (isAr ? 'إيقاف مؤقت' : 'Pause') : (isAr ? 'تشغيل التلاوة' : 'Play Recitation')}
                  className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 cursor-pointer transition-all ${
                    isPlaying
                      ? 'bg-[#D4AF37] text-[#02130D] scale-110 shadow-lg animate-pulse'
                      : 'bg-[#03291F] border-2 border-[#D4AF37] text-[#D4AF37] hover:scale-105 hover:bg-[#D4AF37] hover:text-[#02130D]'
                  }`}
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5 fill-current" />
                  ) : track.isRadio ? (
                    <Radio className="w-5 h-5" />
                  ) : (
                    <Play className="w-5 h-5 fill-current translate-x-0.5" />
                  )}
                </button>

                <div className="min-w-0">
                  <h4 className="text-xs sm:text-sm font-black text-white truncate flex items-center gap-1.5">
                    {isAr ? track.titleAr : track.titleEn}
                    {track.isRadio && (
                      <span className="px-1.5 py-0.5 bg-rose-600 text-white text-[9px] font-black rounded-full animate-pulse">
                        LIVE
                      </span>
                    )}
                  </h4>
                  <p className="text-[11px] text-[#D4AF37] flex items-center gap-1.5 font-bold pt-0.5">
                    <span>{track.reciterAr}</span>
                    <span>•</span>
                    <span className="font-mono text-[10px] text-white/80">{track.duration}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => handleTogglePlay(track)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    isPlaying
                      ? 'bg-rose-600 text-white shadow-md'
                      : 'bg-[#03291F] border border-[#D4AF37]/60 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#02130D]'
                  }`}
                >
                  {isPlaying ? (isAr ? 'إيقاف' : 'Stop') : (isAr ? 'استماع' : 'Listen')}
                </button>

                <button
                  type="button"
                  onClick={() => handleShareTrack(track)}
                  className="p-2 rounded-xl bg-[#03291F] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#02130D] transition-colors cursor-pointer"
                  title={isAr ? 'مشاركة التلاوة والنص' : 'Share Recitation'}
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

