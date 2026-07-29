import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Clock,
  Bell,
  BellOff,
  Volume2,
  MapPin,
  Compass,
  Sparkles,
  Sun,
  Sunrise,
  Sunset,
  Moon,
  Check,
  Navigation,
  Activity,
  Building2,
  Landmark,
  ShieldCheck,
} from 'lucide-react';
import { LanguageOption } from '../../data/languages';

interface PrayerTimesWidgetProps {
  language: LanguageOption;
  onOpenLocationModal?: () => void;
  onOpenQiblaModal?: () => void;
}

export interface HolySiteLocation {
  id: string;
  nameAr: string;
  nameEn: string;
  cityAr: string;
  cityEn: string;
  lat: number;
  lng: number;
  qiblaDeg: number;
  statusAr: string;
  statusEn: string;
  capacityTextAr: string;
  capacityTextEn: string;
  timesOffsetMinutes: {
    fajr: number;
    sunrise: number;
    dhuhr: number;
    asr: number;
    maghrib: number;
    isha: number;
  };
}

// قائمة المشاعر المقدسة والمواقع الجغرافية الرئيسية
const HOLY_SITES: HolySiteLocation[] = [
  {
    id: 'makkah',
    nameAr: 'المسجد الحرام',
    nameEn: 'Al-Masjid Al-Haram',
    cityAr: 'مكة المكرمة',
    cityEn: 'Makkah Al-Mukarramah',
    lat: 21.4225,
    lng: 39.8262,
    qiblaDeg: 0,
    statusAr: 'مفتوح للصلوات والطواف - حركة سلسة 🟢',
    statusEn: 'Open for Prayers & Tawaf - Smooth Flow 🟢',
    capacityTextAr: 'طاقة استيعابية آمنة ومخدومة بالكامل',
    capacityTextEn: 'Safe & Fully Serviced Capacity',
    timesOffsetMinutes: { fajr: 0, sunrise: 0, dhuhr: 0, asr: 0, maghrib: 0, isha: 0 }
  },
  {
    id: 'arafat',
    nameAr: 'مشعر عرفات (جبل الرحمة)',
    nameEn: 'Arafat Sacred Site',
    cityAr: 'مكة المكرمة',
    cityEn: 'Makkah Al-Mukarramah',
    lat: 21.3549,
    lng: 39.9841,
    qiblaDeg: 254,
    statusAr: 'مهيأ ومخدم - خيام ومستشفيات ميدانية ⛺',
    statusEn: 'Fully Prepared - Tents & Field Hospitals ⛺',
    capacityTextAr: 'جاهز لاستقبال حجاج بيت الله الحرام',
    capacityTextEn: 'Ready for Pilgrims Gathering',
    timesOffsetMinutes: { fajr: 1, sunrise: 1, dhuhr: 1, asr: 1, maghrib: 1, isha: 1 }
  },
  {
    id: 'muzdalifah',
    nameAr: 'مشعر مزدلفة',
    nameEn: 'Muzdalifah Plain',
    cityAr: 'مكة المكرمة',
    cityEn: 'Makkah Al-Mukarramah',
    lat: 21.3891,
    lng: 39.9070,
    qiblaDeg: 255,
    statusAr: 'مسارات المشاة والحافلات ميسرة 🚌',
    statusEn: 'Pedestrian & Bus Routes Open 🚌',
    capacityTextAr: 'مناطق المبيت والخدمات مكثفة',
    capacityTextEn: 'Overnight Service Zones Active',
    timesOffsetMinutes: { fajr: 0, sunrise: 0, dhuhr: 0, asr: 0, maghrib: 0, isha: 0 }
  },
  {
    id: 'mina',
    nameAr: 'مشعر منى (مدينة الخيام)',
    nameEn: 'Mina Tents City',
    cityAr: 'مكة المكرمة',
    cityEn: 'Makkah Al-Mukarramah',
    lat: 21.4133,
    lng: 39.8933,
    qiblaDeg: 256,
    statusAr: 'خيام مطورة وجسار الجمرات منسقة 🕋',
    statusEn: 'Upgraded Tents & Jamarat Ready 🕋',
    capacityTextAr: 'إدارة التفويج آمنة ومنتظمة',
    capacityTextEn: 'Organized Crowd Management',
    timesOffsetMinutes: { fajr: 0, sunrise: 0, dhuhr: 0, asr: 0, maghrib: 0, isha: 0 }
  },
  {
    id: 'madinah',
    nameAr: 'المسجد النبوي الشريف',
    nameEn: 'Al-Masjid An-Nabawi',
    cityAr: 'المدينة المنورة',
    cityEn: 'Madinah Al-Munawwarah',
    lat: 24.4672,
    lng: 39.6112,
    qiblaDeg: 195,
    statusAr: 'الروضة الشريفة بتصريح نسك - الروضة مخدومة 🕊️',
    statusEn: 'Rawdah Open via Nusuk Permit 🕊️',
    capacityTextAr: 'الساحات والمظلات مفتوحة ومجهزة',
    capacityTextEn: 'Courtyards & Umbrellas Active',
    timesOffsetMinutes: { fajr: -4, sunrise: -4, dhuhr: -3, asr: -3, maghrib: -3, isha: -3 }
  }
];

// دالة احتساب الوقت الحالي في مكة المكرمة والمدينة المنورة (توقيت السعودية UTC+3)
export function getMakkahNow(): Date {
  const now = new Date();
  const utcMs = now.getTime() + (now.getTimezoneOffset() * 60000);
  return new Date(utcMs + (3 * 3600000));
}

// دالة الحساب الفلكي الدقيق لمواقيت الصلاة حسب تقويم أم القرى لمكة المكرمة والمدينة المنورة
export function calculateSolarPrayerTimes(
  makkahDate: Date,
  lat: number,
  lng: number,
  timesOffsetMinutes = { fajr: 0, sunrise: 0, dhuhr: 0, asr: 0, maghrib: 0, isha: 0 }
) {
  const startOfYear = new Date(makkahDate.getFullYear(), 0, 0);
  const diff = makkahDate.getTime() - startOfYear.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));

  // الميل الشمسي ومعادلة الزمن
  const B = (360 / 365) * (dayOfYear - 81) * (Math.PI / 180);
  const EoT = 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B); // بالدقائق
  const declination = 23.45 * Math.sin(B); // بالدرجات

  const latRad = lat * (Math.PI / 180);
  const decRad = declination * (Math.PI / 180);

  // خط الطول لخط الزوال لتوقيت السعودية (UTC+3) = 45 درجة شرقاً
  const lonDiff = (45 - lng) * 4; // بالدقائق
  const dhuhrMinutes = 12 * 60 + lonDiff - EoT + timesOffsetMinutes.dhuhr;

  const getHourAngle = (angleDeg: number) => {
    const angleRad = angleDeg * (Math.PI / 180);
    const cosH = (Math.sin(angleRad) - Math.sin(latRad) * Math.sin(decRad)) / (Math.cos(latRad) * Math.cos(decRad));
    if (cosH > 1) return 0;
    if (cosH < -1) return Math.PI;
    return Math.acos(cosH) * (180 / Math.PI);
  };

  // الفجر (-18.5 درجة أم القرى)
  const fajrHA = getHourAngle(-18.5);
  const fajrMinutes = dhuhrMinutes - (fajrHA * 4) + timesOffsetMinutes.fajr;

  // الشروق (-0.833 درجة)
  const sunriseHA = getHourAngle(-0.833);
  const sunriseMinutes = dhuhrMinutes - (sunriseHA * 4) + timesOffsetMinutes.sunrise;

  // المغرب (-0.833 درجة)
  const maghribMinutes = dhuhrMinutes + (sunriseHA * 4) + timesOffsetMinutes.maghrib;

  // العصر (ظل الشيء مثل طوله + ظله عند الزوال)
  const phiMinusDelta = Math.abs(latRad - decRad);
  const cotAsr = 1 + Math.tan(phiMinusDelta);
  const asrAngleDeg = Math.atan(1 / cotAsr) * (180 / Math.PI);
  const asrHA = getHourAngle(asrAngleDeg);
  const asrMinutes = dhuhrMinutes + (asrHA * 4) + timesOffsetMinutes.asr;

  // العشاء (معيار أم القرى: المغرب + 90 دقيقة)
  const ishaMinutes = maghribMinutes + 90 + timesOffsetMinutes.isha;

  const toHourMin = (totMin: number) => {
    let m = Math.round(totMin);
    let h = Math.floor(m / 60) % 24;
    m = m % 60;
    if (m < 0) {
      m += 60;
      h = (h - 1 + 24) % 24;
    }
    return { hour: h, minute: m };
  };

  return [
    { key: 'fajr', nameAr: 'الفجر', nameEn: 'Fajr', icon: Sunrise, ...toHourMin(fajrMinutes) },
    { key: 'sunrise', nameAr: 'الشروق', nameEn: 'Sunrise', icon: Sun, ...toHourMin(sunriseMinutes) },
    { key: 'dhuhr', nameAr: 'الظهر', nameEn: 'Dhuhr', icon: Sun, ...toHourMin(dhuhrMinutes) },
    { key: 'asr', nameAr: 'العصر', nameEn: 'Asr', icon: Sun, ...toHourMin(asrMinutes) },
    { key: 'maghrib', nameAr: 'المغرب', nameEn: 'Maghrib', icon: Sunset, ...toHourMin(maghribMinutes) },
    { key: 'isha', nameAr: 'العشاء', nameEn: 'Isha', icon: Moon, ...toHourMin(ishaMinutes) }
  ];
}

// حساب والتاريخ الهجري الديناميكي المعتمد على وقت مكة للغتين العربية والإنجليزية
export interface HijriDateResult {
  fullAr: string;
  shortAr: string;
  fullEn: string;
  shortEn: string;
  fullString: string;
  occasionNote?: string;
  day: number;
  month: number;
  year: number;
}

export function getMakkahHijriDate(makkahDate: Date, isAr: boolean): HijriDateResult {
  const islamicMonthsAr = [
    'محرم', 'صفر', 'ربيع الأول', 'ربيع الثاني',
    'جمادى الأولى', 'جمادى الآخرة', 'رجب', 'شعبان',
    'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'
  ];
  const islamicMonthsEn = [
    'Muharram', 'Safar', "Rabi' Al-Awwal", "Rabi' Al-Thani",
    'Jumada Al-Ula', 'Jumada Al-Akhirah', 'Rajab', "Sha'ban",
    'Ramadan', 'Shawwal', "Dhu Al-Qi'dah", "Dhu Al-Hijjah"
  ];

  let day = 14;
  let month = 2; // Safar
  let year = 1448;

  // 1. Algorithmic Hijri (Umm Al Qura standards)
  try {
    const gYear = makkahDate.getFullYear();
    const gMonth = makkahDate.getMonth() + 1;
    const gDay = makkahDate.getDate();

    const julianDay = Math.floor((1461 * (gYear + 4800 + Math.floor((gMonth - 14) / 12))) / 4) +
                      Math.floor((367 * (gMonth - 2 - 12 * (Math.floor((gMonth - 14) / 12)))) / 12) -
                      Math.floor((3 * (Math.floor((gYear + 4900 + Math.floor((gMonth - 14) / 12)) / 100))) / 4) +
                      gDay - 32075;

    let l = julianDay - 1948440 + 10632;
    let n = Math.floor((l - 1) / 10631);
    l = l - 10631 * n + 354;
    let j = (Math.floor((10985 - l) / 5316)) * (Math.floor((50 * l) / 17719)) + (Math.floor(l / 5670)) * (Math.floor((43 * l) / 15238));
    l = l - (Math.floor((30 - j) / 15)) * (Math.floor((17719 * j) / 50)) - (Math.floor(j / 16)) * (Math.floor((15238 * j) / 43)) + 29;
    month = Math.floor((24 * l) / 709);
    day = l - Math.floor((709 * month) / 24);
    year = 30 * n + j - 30;
  } catch {
    // fallback
  }

  // 2. Browser Intl DateTimeFormat check for high-precision Islamic calendar
  try {
    const dayStr = new Intl.DateTimeFormat('en-US-u-ca-islamic-umaqura', { day: 'numeric', timeZone: 'Asia/Riyadh' }).format(makkahDate);
    const monthStr = new Intl.DateTimeFormat('en-US-u-ca-islamic-umaqura', { month: 'numeric', timeZone: 'Asia/Riyadh' }).format(makkahDate);
    const yearStr = new Intl.DateTimeFormat('en-US-u-ca-islamic-umaqura', { year: 'numeric', timeZone: 'Asia/Riyadh' }).format(makkahDate);
    const pDay = parseInt(dayStr, 10);
    const pMonth = parseInt(monthStr, 10);
    const pYear = parseInt(yearStr, 10);

    if (!isNaN(pDay) && !isNaN(pMonth) && !isNaN(pYear) && pMonth >= 1 && pMonth <= 12 && pYear > 1400 && pYear < 1600) {
      day = pDay;
      month = pMonth;
      year = pYear;
    }
  } catch {
    // fallback
  }

  const monthArName = islamicMonthsAr[month - 1] || 'صفر';
  const monthEnName = islamicMonthsEn[month - 1] || 'Safar';

  const fullAr = `${day} ${monthArName} ${year} هـ`;
  const shortAr = `${day} ${monthArName}`;
  const fullEn = `${monthEnName} ${day}, ${year} AH`;
  const shortEn = `${monthEnName} ${day}`;

  let occasionNote = '';
  if (month === 12 && day === 9) {
    occasionNote = isAr ? 'يوم عرفة المبارك 🕋' : 'Day of Arafah 🕋';
  } else if (month === 12 && (day >= 10 && day <= 13)) {
    occasionNote = isAr ? 'أيام عيد الأضحى والمناسك بمنى 🐑' : 'Eid Al-Adha Days 🐑';
  } else if (month === 9) {
    occasionNote = isAr ? 'شهر رمضان المبارك 🌙' : 'Blessed Ramadan 🌙';
  } else if (month === 1 && day === 1) {
    occasionNote = isAr ? 'رأس السنة الهجرية 🕌' : 'Hijri New Year 🕌';
  } else if (month === 8 && day === 15) {
    occasionNote = isAr ? 'ليلة النصف من شعبان ✨' : 'Mid-Sha\'ban Night ✨';
  } else if (month === 12 && day === 8) {
    occasionNote = isAr ? 'يوم التروية بمشعر منى ⛺' : 'Day of Tarwiyah at Mina ⛺';
  }

  return {
    fullAr,
    shortAr,
    fullEn,
    shortEn,
    fullString: isAr ? `${fullAr} (${fullEn})` : `${fullEn} (${fullAr})`,
    occasionNote,
    day,
    month,
    year
  };
}

export const PrayerTimesWidget: React.FC<PrayerTimesWidgetProps> = ({ language, onOpenQiblaModal }) => {
  const isAr = language.code === 'ar';
  
  const [selectedSite, setSelectedSite] = useState<HolySiteLocation>(HOLY_SITES[0]);
  const [useGps, setUseGps] = useState(false);
  const [gpsLocationName, setGpsLocationName] = useState<string | null>(null);
  const [audioAlertsEnabled, setAudioAlertsEnabled] = useState<boolean>(() => {
    return localStorage.getItem('arafat_prayer_audio_enabled') === 'true';
  });
  
  const [isPlayingTestSound, setIsPlayingTestSound] = useState(false);
  const [makkahTime, setMakkahTime] = useState<Date>(getMakkahNow());
  const [nextPrayerCountdown, setNextPrayerCountdown] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [nextPrayerKey, setNextPrayerKey] = useState<string>('dhuhr');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // احتساب أوقات الصلاة الفلكية المباشرة لليوم بحسب وقت مكة والمشعر المحدد
  const rawPrayerList = calculateSolarPrayerTimes(
    makkahTime,
    selectedSite.lat,
    selectedSite.lng,
    selectedSite.timesOffsetMinutes
  );

  const calculatedPrayerTimes = rawPrayerList.map((p) => {
    const displayHour = p.hour > 12 ? p.hour - 12 : p.hour === 0 ? 12 : p.hour;
    const periodStr = p.hour >= 12 ? (isAr ? 'م' : 'PM') : (isAr ? 'ص' : 'AM');
    const formattedTime = `${displayHour.toString().padStart(2, '0')}:${p.minute.toString().padStart(2, '0')} ${periodStr}`;

    return {
      ...p,
      formattedTime
    };
  });

  // تحديث وقت مكة والمدينة الحي كل ثانية والعد التنازلي للصلاة القادمة
  useEffect(() => {
    const timer = setInterval(() => {
      const nowMakkah = getMakkahNow();
      setMakkahTime(nowMakkah);

      const currentMinutes = nowMakkah.getHours() * 60 + nowMakkah.getMinutes();
      const currentSeconds = nowMakkah.getSeconds();

      // البحث عن الصلاة القادمة
      let nextP = calculatedPrayerTimes.find((p) => p.hour * 60 + p.minute > currentMinutes);
      
      if (!nextP) {
        // إذا انتهت جميع صلوات اليوم، فالصلاة القادمة هي صلاة الفجر للغد
        nextP = calculatedPrayerTimes[0];
      }

      setNextPrayerKey(nextP.key);

      // حساب الفرق بالثواني
      let targetTime = new Date(nowMakkah);
      targetTime.setHours(nextP.hour, nextP.minute, 0, 0);

      if (targetTime.getTime() <= nowMakkah.getTime()) {
        targetTime.setDate(targetTime.getDate() + 1);
      }

      const diffSec = Math.floor((targetTime.getTime() - nowMakkah.getTime()) / 1000);
      const hrs = Math.floor(diffSec / 3600);
      const mins = Math.floor((diffSec % 3600) / 60);
      const secs = diffSec % 60;

      setNextPrayerCountdown({ hours: hrs, minutes: mins, seconds: secs });

      // عند حلول موعد الأذان تماماً
      if (diffSec === 0 && currentSeconds === 0 && audioAlertsEnabled) {
        triggerAdhanAudioNotification(nextP.nameAr);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [selectedSite, audioAlertsEnabled]);

  const toggleAudioAlerts = () => {
    const nextVal = !audioAlertsEnabled;
    setAudioAlertsEnabled(nextVal);
    localStorage.setItem('arafat_prayer_audio_enabled', String(nextVal));

    if (nextVal) {
      if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
      }
      playTakbeerAudio();
      showToast(isAr ? 'تم تفعيل التنبيهات الصوتية للأذان بنجاح 🔔' : 'Prayer audio notifications enabled 🔔');
    } else {
      showToast(isAr ? 'تم إيقاف التنبيهات الصوتية 🔕' : 'Audio notifications disabled 🔕');
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // توليد نغمة التكبير والأذان باستخدام Web Audio API
  const playTakbeerAudio = () => {
    if (isPlayingTestSound) return;
    setIsPlayingTestSound(true);

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) {
        setIsPlayingTestSound(false);
        return;
      }
      const ctx = new AudioCtx();

      const notes = [
        { freq: 261.63, duration: 0.6, delay: 0 },
        { freq: 329.63, duration: 0.9, delay: 0.65 },
        { freq: 392.00, duration: 1.1, delay: 1.6 },
        { freq: 523.25, duration: 1.4, delay: 2.75 }
      ];

      notes.forEach((note) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(note.freq, ctx.currentTime + note.delay);

        const subOsc = ctx.createOscillator();
        const subGain = ctx.createGain();
        subOsc.type = 'triangle';
        subOsc.frequency.setValueAtTime(note.freq * 1.5, ctx.currentTime + note.delay);
        subGain.gain.setValueAtTime(0.08, ctx.currentTime + note.delay);

        gain.gain.setValueAtTime(0.001, ctx.currentTime + note.delay);
        gain.gain.exponentialRampToValueAtTime(0.35, ctx.currentTime + note.delay + 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + note.delay + note.duration);

        osc.connect(gain);
        subOsc.connect(subGain);
        gain.connect(ctx.destination);
        subGain.connect(ctx.destination);

        osc.start(ctx.currentTime + note.delay);
        subOsc.start(ctx.currentTime + note.delay);
        osc.stop(ctx.currentTime + note.delay + note.duration);
        subOsc.stop(ctx.currentTime + note.delay + note.duration);
      });

      setTimeout(() => {
        setIsPlayingTestSound(false);
        ctx.close();
      }, 4200);
    } catch {
      setIsPlayingTestSound(false);
    }
  };

  const triggerAdhanAudioNotification = (prayerName: string) => {
    playTakbeerAudio();
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      new Notification(`حان الآن موعد صلاة ${prayerName}`, {
        body: `نحيطكم علماً بحلول وقت الصلاة في ${selectedSite.nameAr}. تقبل الله منا ومنكم.`,
        icon: '/favicon.ico'
      });
    }
  };

  const handleAutoGps = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setUseGps(true);
          setGpsLocationName(isAr ? 'موقعك الحالي في المشاعر المقدسة' : 'Current GPS Location (Sacred Sites)');
          showToast(isAr ? 'تم تحديد موقعك وضبط أوقات الصلاة بدقة 📍' : 'Location updated for prayer times 📍');
        },
        () => {
          showToast(isAr ? 'تعذر تحديد الموقع بالـ GPS. تم اعتماد المسجد الحرام افتراضياً.' : 'GPS access denied. Defaulted to Al-Masjid Al-Haram.');
        }
      );
    }
  };

  const nextPrayerObj = calculatedPrayerTimes.find((p) => p.key === nextPrayerKey) || calculatedPrayerTimes[0];
  const hijriData = getMakkahHijriDate(makkahTime, isAr);

  // تنسيق ساعات وثواني توقيت مكة والمدينة المباشر
  const formatLiveClock = (date: Date) => {
    return date.toLocaleTimeString(isAr ? 'ar-SA' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  const makkahTimeString = formatLiveClock(makkahTime);

  return (
    <div className="w-full bg-gradient-to-b from-[#021811] via-[#03291F] to-[#01160E] border-2 border-[#D4AF37]/80 rounded-3xl p-5 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.85)] relative overflow-hidden text-[#F8F3E7]">
      {/* خلفية زخرفية */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Toast Alert */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="absolute top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-2xl bg-[#D4AF37] text-[#02130D] font-black text-xs sm:text-sm shadow-xl flex items-center gap-2 border border-white/40"
          >
            <Sparkles className="w-4 h-4 text-[#02130D]" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 pb-6 border-b border-[#D4AF37]/30">
        
        {/* Title & Live Saudi Clock Info */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <div className="px-3 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37] text-[#D4AF37] text-xs font-black flex items-center gap-1.5 shadow-sm">
              <Clock className="w-3.5 h-3.5 text-[#D4AF37] animate-spin" />
              <span>{isAr ? 'مواقيت الصلاة والتوقيت المباشر' : 'Live Prayer Times & Saudi Clock'}</span>
            </div>
            
            <span className="text-xs text-emerald-300 font-bold bg-[#01140E] px-2.5 py-1 rounded-xl border border-emerald-500/40 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>{isAr ? 'محدّث تلقائياً (توقيت مكة والمدينة)' : 'Live Update (Makkah & Madinah Time)'}</span>
            </span>
          </div>

          <h2 className="text-xl sm:text-3xl font-black text-white flex items-center gap-2">
            <span>{isAr ? 'مواقيت الصلاة والمشاعر والتاريخ الهجري' : 'Sacred Sites Prayer Times & Live Hijri Date'}</span>
          </h2>

          <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-[#F8F3E7]/90 font-bold">
            <span className="flex items-center gap-1.5 text-[#D4AF37]">
              <MapPin className="w-4 h-4 text-[#D4AF37]" />
              <span>{useGps && gpsLocationName ? gpsLocationName : isAr ? selectedSite.nameAr : selectedSite.nameEn}</span>
            </span>

            <span className="text-xs text-amber-300 font-mono bg-[#02130D] px-2.5 py-0.5 rounded-lg border border-amber-500/30 dir-ltr">
              {makkahTimeString} (UTC+3)
            </span>
          </div>
        </div>

        {/* Live Clock Display Cards (Makkah & Madinah) */}
        <div className="flex items-center gap-3 self-start lg:self-auto flex-wrap">
          <div className="p-3 rounded-2xl bg-[#01140E] border-2 border-[#D4AF37]/60 shadow-lg flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#D4AF37]/20 text-[#D4AF37]">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-[#D4AF37] font-bold">{isAr ? 'توقيت مكة والمدينة' : 'Makkah & Madinah Clock'}</p>
              <p className="text-sm font-black text-white font-mono dir-ltr">{makkahTimeString}</p>
            </div>
          </div>

          {/* Test Sound & Notification Toggle */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={playTakbeerAudio}
              disabled={isPlayingTestSound}
              className={`p-2.5 rounded-2xl border border-[#D4AF37]/60 bg-[#02130D] hover:bg-[#073D2F] text-xs font-bold text-[#D4AF37] flex items-center gap-1.5 transition-all cursor-pointer hover:scale-105 ${
                isPlayingTestSound ? 'animate-pulse text-amber-300 border-amber-400' : ''
              }`}
              title={isAr ? 'تجربة نغمة التكبير والأذان' : 'Test Takbeer & Adhan Audio'}
            >
              <Volume2 className={`w-4 h-4 ${isPlayingTestSound ? 'animate-spin text-amber-300' : 'text-[#D4AF37]'}`} />
              <span className="hidden sm:inline">{isPlayingTestSound ? (isAr ? 'جاري الأذان...' : 'Playing...') : (isAr ? 'تجربة الأذان' : 'Test')}</span>
            </button>

            <button
              type="button"
              onClick={toggleAudioAlerts}
              className={`px-3.5 py-2.5 rounded-2xl border-2 font-black text-xs flex items-center gap-2 transition-all cursor-pointer shadow-lg hover:scale-105 ${
                audioAlertsEnabled
                  ? 'bg-gradient-to-r from-emerald-600 to-emerald-800 border-emerald-400 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)]'
                  : 'bg-[#01140E] border-gray-600 text-gray-300 hover:border-[#D4AF37]'
              }`}
            >
              {audioAlertsEnabled ? (
                <>
                  <Bell className="w-4 h-4 text-emerald-300 animate-bounce" />
                  <span>{isAr ? 'التنبيهات مفعلة' : 'Audio On'}</span>
                </>
              ) : (
                <>
                  <BellOff className="w-4 h-4 text-gray-400" />
                  <span>{isAr ? 'تفعيل الصوت' : 'Enable Audio'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Dynamic Hijri Banner & Mashaer Status */}
      <div className="my-4 p-3.5 sm:p-4 rounded-2xl bg-[#02130D]/90 border border-[#D4AF37]/40 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs sm:text-sm font-bold shadow-md">
        
        {/* Hijri Date Box */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#D4AF37] text-[#02130D] shrink-0 font-black shadow-md">
            <Sparkles className="w-5 h-5 text-[#02130D]" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[#D4AF37] font-black text-xs sm:text-sm">
                {isAr ? 'التاريخ الهجري المباشر:' : 'Live Hijri Date:'}
              </span>

              {/* Arabic Hijri Badge */}
              <div className="px-3 py-1 bg-[#01140E] border border-[#D4AF37] rounded-xl text-white font-black text-xs sm:text-sm shadow flex items-center gap-1.5 dir-rtl">
                <span className="text-[#D4AF37]">{hijriData.fullAr}</span>
                <span className="text-[11px] text-amber-200 bg-[#022218] px-1.5 py-0.5 rounded border border-[#D4AF37]/40 font-mono">
                  {hijriData.shortAr}
                </span>
              </div>

              {/* English Hijri Badge */}
              <div className="px-3 py-1 bg-[#01140E] border border-emerald-500/80 rounded-xl text-emerald-300 font-black text-xs sm:text-sm shadow font-mono flex items-center gap-1.5 dir-ltr">
                <span>{hijriData.fullEn}</span>
                <span className="text-[11px] text-emerald-200 bg-[#022218] px-1.5 py-0.5 rounded border border-emerald-500/40">
                  {hijriData.shortEn}
                </span>
              </div>
            </div>

            {hijriData.occasionNote && (
              <p className="text-xs text-amber-300 font-extrabold flex items-center gap-1 pt-0.5">
                <span>✨</span>
                <span>{hijriData.occasionNote}</span>
              </p>
            )}
          </div>
        </div>

        {/* Live Operational Mashaer Status */}
        <div className="flex items-center gap-2 bg-[#03291F] px-3 py-1.5 rounded-xl border border-emerald-500/30 text-xs text-emerald-300">
          <Activity className="w-4 h-4 text-emerald-400 shrink-0 animate-pulse" />
          <span>{isAr ? selectedSite.statusAr : selectedSite.statusEn}</span>
        </div>
      </div>

      {/* Selector for Holy Sites & GPS */}
      <div className="py-3 border-b border-[#D4AF37]/20 flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth">
        <span className="text-xs font-black text-[#D4AF37] shrink-0 flex items-center gap-1 pl-1">
          <Compass className="w-4 h-4 text-[#D4AF37]" />
          <span>{isAr ? 'اختر المشعر / الموقع:' : 'Holy Site Location:'}</span>
        </span>

        {HOLY_SITES.map((site) => {
          const isSelected = !useGps && selectedSite.id === site.id;
          return (
            <button
              key={site.id}
              type="button"
              onClick={() => {
                setUseGps(false);
                setSelectedSite(site);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all cursor-pointer border flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-[#D4AF37] text-[#02130D] border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.4)] scale-105'
                  : 'bg-[#01140E]/80 text-[#F8F3E7]/80 border-[#D4AF37]/30 hover:bg-[#073D2F] hover:text-[#D4AF37]'
              }`}
            >
              <span>{isAr ? site.nameAr : site.nameEn}</span>
              {isSelected && <Check className="w-3.5 h-3.5 text-[#02130D]" />}
            </button>
          );
        })}

        <button
          type="button"
          onClick={handleAutoGps}
          className={`px-3.5 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all cursor-pointer border flex items-center gap-1.5 ${
            useGps
              ? 'bg-emerald-500 text-[#02130D] border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
              : 'bg-[#01140E]/80 text-emerald-400 border-emerald-500/40 hover:bg-emerald-950/60'
          }`}
        >
          <Navigation className="w-3.5 h-3.5" />
          <span>{isAr ? 'موقعي (GPS)' : 'Auto GPS'}</span>
        </button>
      </div>

      {/* Banner Countdown to Next Prayer */}
      <div className="my-5 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#02130D] via-[#053B2D] to-[#02130D] border-2 border-[#D4AF37] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        
        {/* Next Prayer Title */}
        <div className="flex items-center gap-3 text-center sm:text-start">
          <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center text-[#D4AF37] shrink-0 shadow-inner">
            <Sparkles className="w-6 h-6 text-[#D4AF37]" />
          </div>
          <div>
            <div className="text-xs font-bold text-[#D4AF37] flex items-center justify-center sm:justify-start gap-1">
              <span>{isAr ? 'الصلاة القادمة:' : 'Next Prayer:'}</span>
              <span className="font-black text-white underline decoration-[#D4AF37]">
                {isAr ? nextPrayerObj.nameAr : nextPrayerObj.nameEn}
              </span>
              <span className="text-[10px] bg-[#D4AF37] text-[#02130D] px-2 py-0.5 rounded-full font-black ml-1">
                {nextPrayerObj.formattedTime}
              </span>
            </div>
            <p className="text-xs text-[#F8F3E7]/75 mt-0.5">
              {isAr
                ? `الوقت المتبقي لرفع أذان الصلاة القادمة في ${selectedSite.nameAr}`
                : `Countdown timer to the next prayer at ${selectedSite.nameEn}`}
            </p>
          </div>
        </div>

        {/* Live Timer Boxes */}
        <div className="flex items-center gap-2 dir-ltr">
          <div className="flex flex-col items-center bg-[#01140E] border border-[#D4AF37]/50 rounded-xl px-3 py-2 min-w-[55px]">
            <span className="text-lg sm:text-2xl font-black text-[#D4AF37] font-mono leading-none">
              {nextPrayerCountdown.hours.toString().padStart(2, '0')}
            </span>
            <span className="text-[9px] text-[#F8F3E7]/70 font-bold mt-1">{isAr ? 'ساعة' : 'HRS'}</span>
          </div>
          <span className="text-lg font-bold text-[#D4AF37] animate-pulse">:</span>

          <div className="flex flex-col items-center bg-[#01140E] border border-[#D4AF37]/50 rounded-xl px-3 py-2 min-w-[55px]">
            <span className="text-lg sm:text-2xl font-black text-[#D4AF37] font-mono leading-none">
              {nextPrayerCountdown.minutes.toString().padStart(2, '0')}
            </span>
            <span className="text-[9px] text-[#F8F3E7]/70 font-bold mt-1">{isAr ? 'دقيقة' : 'MIN'}</span>
          </div>
          <span className="text-lg font-bold text-[#D4AF37] animate-pulse">:</span>

          <div className="flex flex-col items-center bg-[#01140E] border border-[#D4AF37]/50 rounded-xl px-3 py-2 min-w-[55px]">
            <span className="text-lg sm:text-2xl font-black text-emerald-400 font-mono leading-none">
              {nextPrayerCountdown.seconds.toString().padStart(2, '0')}
            </span>
            <span className="text-[9px] text-[#F8F3E7]/70 font-bold mt-1">{isAr ? 'ثانية' : 'SEC'}</span>
          </div>
        </div>
      </div>

      {/* Grid of Prayer Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-1">
        {calculatedPrayerTimes.map((prayer) => {
          const IconComponent = prayer.icon;
          const isNext = prayer.key === nextPrayerKey;

          return (
            <motion.div
              key={prayer.key}
              whileHover={{ y: -4, scale: 1.02 }}
              className={`p-3.5 sm:p-4 rounded-2xl border transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
                isNext
                  ? 'bg-gradient-to-b from-[#053B2D] to-[#021811] border-2 border-[#D4AF37] shadow-[0_0_25px_rgba(212,175,55,0.4)]'
                  : 'bg-[#01140E]/80 border-[#D4AF37]/30 hover:border-[#D4AF37]/60 hover:bg-[#03291F]'
              }`}
            >
              {/* Badge for Next Prayer */}
              {isNext && (
                <div className="absolute top-2 left-2">
                  <span className="px-2 py-0.5 rounded-md bg-[#D4AF37] text-[#02130D] text-[9px] font-black uppercase tracking-wider shadow">
                    {isAr ? 'القادمة' : 'NEXT'}
                  </span>
                </div>
              )}

              {/* Icon & Name */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-xl ${isNext ? 'bg-[#D4AF37] text-[#02130D]' : 'bg-[#02130D] text-[#D4AF37] border border-[#D4AF37]/40'}`}>
                    <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                </div>

                <h3 className={`text-sm sm:text-base font-black ${isNext ? 'text-[#D4AF37]' : 'text-white'}`}>
                  {isAr ? prayer.nameAr : prayer.nameEn}
                </h3>
              </div>

              {/* Formatted Time Display */}
              <div className="mt-3 pt-2 border-t border-[#D4AF37]/20 flex items-baseline justify-between">
                <span className={`text-base sm:text-lg font-black font-mono ${isNext ? 'text-white' : 'text-[#D4AF37]'}`}>
                  {prayer.formattedTime}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Footer info: Hijri date & Qibla Direction & Operational Capacity */}
      <div className="mt-5 pt-4 border-t border-[#D4AF37]/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#F8F3E7]/80 font-bold">
        <div className="flex items-center gap-2 bg-[#01140E] px-3.5 py-1.5 rounded-xl border border-[#D4AF37]/30">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>{isAr ? selectedSite.capacityTextAr : selectedSite.capacityTextEn}</span>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            type="button"
            onClick={() => {
              if (onOpenQiblaModal) {
                onOpenQiblaModal();
              }
            }}
            className="flex items-center gap-1.5 text-[#D4AF37] bg-[#01140E] px-3 py-1 rounded-xl border border-[#D4AF37]/40 hover:bg-[#D4AF37] hover:text-[#02130D] transition-all cursor-pointer shadow-sm group"
          >
            <Compass className="w-4 h-4 text-[#D4AF37] group-hover:text-[#02130D] animate-spin-slow" />
            <span className="font-bold">
              {isAr ? `زاوية القبلة: ${selectedSite.qiblaDeg}° (فتح البوصلة التفاعلية)` : `Qibla Angle: ${selectedSite.qiblaDeg}° (Open Compass)`}
            </span>
          </button>

          <span className="text-[10px] text-[#F8F3E7]/60">
            {isAr ? 'تقويم أم القرى وحسابات مكة والمدينة الفلكية Makkah Standard' : 'Umm Al-Qura Astronomical Makkah Standards'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PrayerTimesWidget;
