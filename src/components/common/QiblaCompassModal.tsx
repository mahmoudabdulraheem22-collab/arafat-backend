import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Compass,
  MapPin,
  X,
  Sparkles,
  LocateFixed,
  RotateCw,
  Smartphone,
  CheckCircle2,
  ShieldCheck,
  Globe,
  Sliders,
  AlertCircle
} from 'lucide-react';
import { LanguageOption } from '../../data/languages';

interface QiblaCompassModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: LanguageOption;
}

interface CityOption {
  nameAr: string;
  nameEn: string;
  lat: number;
  lng: number;
}

// قائمة المدن الرئيسية لحساب القبلة المباشر بدون شبكة
const FAMOUS_CITIES: CityOption[] = [
  { nameAr: 'مكة المكرمة (الكعبة المشرفة)', nameEn: 'Makkah Al-Mukarramah', lat: 21.422487, lng: 39.826206 },
  { nameAr: 'المدينة المنورة', nameEn: 'Madinah Al-Munawwarah', lat: 24.4672, lng: 39.6112 },
  { nameAr: 'الرياض (السعودية)', nameEn: 'Riyadh (KSA)', lat: 24.7136, lng: 46.6753 },
  { nameAr: 'جدة (السعودية)', nameEn: 'Jeddah (KSA)', lat: 21.5433, lng: 39.1728 },
  { nameAr: 'القاهرة (مصر)', nameEn: 'Cairo (Egypt)', lat: 30.0444, lng: 31.2357 },
  { nameAr: 'دبي (الإمارات)', nameEn: 'Dubai (UAE)', lat: 25.2048, lng: 55.2708 },
  { nameAr: 'إسطنبول (تركيا)', nameEn: 'Istanbul (Turkey)', lat: 41.0082, lng: 28.9784 },
  { nameAr: 'عمّان (الأردن)', nameEn: 'Amman (Jordan)', lat: 31.9454, lng: 35.9284 },
  { nameAr: 'بغداد (العراق)', nameEn: 'Baghdad (Iraq)', lat: 33.3152, lng: 44.3661 },
  { nameAr: 'الكويت (الكويت)', nameEn: 'Kuwait City', lat: 29.3759, lng: 47.9774 },
  { nameAr: 'الدوحة (قطر)', nameEn: 'Doha (Qatar)', lat: 25.2854, lng: 51.5310 },
  { nameAr: 'مسقط (عُمان)', nameEn: 'Muscat (Oman)', lat: 23.5880, lng: 58.3829 },
  { nameAr: 'لندن (المملكة المتحدة)', nameEn: 'London (UK)', lat: 51.5074, lng: -0.1278 },
  { nameAr: 'باريس (فرنسا)', nameEn: 'Paris (France)', lat: 48.8566, lng: 2.3522 },
  { nameAr: 'نيويورك (أمريكا)', nameEn: 'New York (USA)', lat: 40.7128, lng: -74.0060 },
  { nameAr: 'جاكرتا (إندونيسيا)', nameEn: 'Jakarta (Indonesia)', lat: -6.2088, lng: 106.8456 },
  { nameAr: 'كوالالمبور (ماليزيا)', nameEn: 'Kuala Lumpur (Malaysia)', lat: 3.1390, lng: 101.6869 },
  { nameAr: 'إسلام أباد (باكستان)', nameEn: 'Islamabad (Pakistan)', lat: 33.6844, lng: 73.0479 },
  { nameAr: 'تونس (تونس)', nameEn: 'Tunis (Tunisia)', lat: 36.8065, lng: 10.1815 },
  { nameAr: 'الرباط (المغرب)', nameEn: 'Rabat (Morocco)', lat: 34.0209, lng: -6.8416 }
];

// إحداثيات الكعبة المشرفة بمكة المكرمة
const KAABA_LAT = 21.422487;
const KAABA_LNG = 39.826206;

/**
 * حساب اتجاه القبلة بالدرجات (0 - 360) بناءً على خط الطول والعرض
 */
function calculateQiblaAngle(userLat: number, userLng: number): number {
  const phi1 = (userLat * Math.PI) / 180;
  const lambda1 = (userLng * Math.PI) / 180;
  const phi2 = (KAABA_LAT * Math.PI) / 180;
  const lambda2 = (KAABA_LNG * Math.PI) / 180;

  const dLambda = lambda2 - lambda1;
  const y = Math.sin(dLambda) * Math.cos(phi2);
  const x = Math.cos(phi1) * Math.sin(phi2) - Math.sin(phi1) * Math.cos(phi2) * Math.cos(dLambda);

  let angleRad = Math.atan2(y, x);
  let angleDeg = (angleRad * 180) / Math.PI;

  return (angleDeg + 360) % 360;
}

/**
 * حساب المسافة بـ الكيلومترات حتى الكعبة المشرفة
 */
function calculateDistanceToKaaba(userLat: number, userLng: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((KAABA_LAT - userLat) * Math.PI) / 180;
  const dLon = ((KAABA_LNG - userLng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((userLat * Math.PI) / 180) *
      Math.cos((KAABA_LAT * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

/**
 * تحويل الزاوية إلى اسم الاتجاه الجغرافي
 */
function getDirectionName(deg: number, isAr: boolean): string {
  const normalized = (deg + 360) % 360;
  if (normalized >= 337.5 || normalized < 22.5) return isAr ? 'شمال' : 'North';
  if (normalized >= 22.5 && normalized < 67.5) return isAr ? 'شمال شرق' : 'North-East';
  if (normalized >= 67.5 && normalized < 112.5) return isAr ? 'شرق' : 'East';
  if (normalized >= 112.5 && normalized < 157.5) return isAr ? 'جنوب شرق' : 'South-East';
  if (normalized >= 157.5 && normalized < 202.5) return isAr ? 'جنوب' : 'South';
  if (normalized >= 202.5 && normalized < 247.5) return isAr ? 'جنوب غرب' : 'South-West';
  if (normalized >= 247.5 && normalized < 292.5) return isAr ? 'غرب' : 'West';
  return isAr ? 'شمال غرب' : 'North-West';
}

export const QiblaCompassModal: React.FC<QiblaCompassModalProps> = ({
  isOpen,
  onClose,
  language
}) => {
  const isAr = language.code === 'ar';

  // موقع المستخدم
  const [selectedCity, setSelectedCity] = useState<CityOption>(FAMOUS_CITIES[2]); // Default Riyadh
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number }>({
    lat: FAMOUS_CITIES[2].lat,
    lng: FAMOUS_CITIES[2].lng
  });
  const [locationName, setLocationName] = useState<string>(
    isAr ? FAMOUS_CITIES[2].nameAr : FAMOUS_CITIES[2].nameEn
  );
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  // اتجاه البوصلة المستشعر واليدوي
  const [heading, setHeading] = useState<number>(0); // زاوية اتجاه الهاتف الحالي (0 - 360)
  const [hasGyro, setHasGyro] = useState<boolean>(false);
  const [permissionState, setPermissionState] = useState<'prompt' | 'granted' | 'denied' | 'unsupported'>('prompt');
  const [manualSlider, setManualSlider] = useState<number>(0);
  const [useManualSlider, setUseManualSlider] = useState<boolean>(false);

  // حساب زاوية القبلة والمسافة
  const qiblaAngle = calculateQiblaAngle(userCoords.lat, userCoords.lng);
  const distanceKm = calculateDistanceToKaaba(userCoords.lat, userCoords.lng);

  // الحساب والتقارب: عندما يتطابق الاتجاه مع القبلة ضمن ±4 درجات
  const currentHeading = useManualSlider ? manualSlider : heading;
  // الفرق بين اتجاه البوصلة وزاوية القبلة
  const rawDiff = (qiblaAngle - currentHeading + 360) % 360;
  const normalizedDiff = rawDiff > 180 ? 360 - rawDiff : rawDiff;
  const isAligned = normalizedDiff <= 4;

  const lastVibeRef = useRef<number>(0);

  // هز هاتف المستخدم عند المحاذاة التامة
  useEffect(() => {
    if (isAligned) {
      const now = Date.now();
      if (now - lastVibeRef.current > 1500 && 'vibrate' in navigator) {
        try {
          navigator.vibrate([100, 50, 100]);
        } catch {
          // ignore
        }
        lastVibeRef.current = now;
      }
    }
  }, [isAligned]);

  // الحصول على الموقع الجغرافي GPS
  const handleGetGPSLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError(isAr ? 'متصفحك لا يدعم تحديد الموقع الجغرافي GPS' : 'Geolocation is not supported by your browser');
      return;
    }

    setIsLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setUserCoords({ lat, lng });
        setLocationName(
          isAr
            ? `موقعك الحالي (${lat.toFixed(2)}°, ${lng.toFixed(2)}°)`
            : `Current GPS Location (${lat.toFixed(2)}°, ${lng.toFixed(2)}°)`
        );
        setIsLocating(false);
      },
      (err) => {
        setIsLocating(false);
        if (err.code === err.PERMISSION_DENIED) {
          setLocationError(
            isAr
              ? 'تم رفض إذن تحديد الموقع. يمكنك اختيار مدينتك يدوياً من القائمة.'
              : 'GPS access denied. You can select your city manually from the menu.'
          );
        } else {
          setLocationError(
            isAr
              ? 'تعذر الوصول إلى الموقع الجغرافي، يرجى تفعيل الـ GPS أو تحديد مدينتك.'
              : 'Unable to fetch GPS position. Please enable GPS or choose your city.'
          );
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }, [isAr]);

  // التعامل مع مستشعرات الاتجاه DeviceOrientation API
  const handleOrientation = useCallback((e: DeviceOrientationEvent) => {
    let compassHeading: number | null = null;

    // iOS Safari Compass Heading
    if ('webkitCompassHeading' in e && typeof (e as unknown as { webkitCompassHeading: number }).webkitCompassHeading === 'number') {
      compassHeading = (e as unknown as { webkitCompassHeading: number }).webkitCompassHeading;
    } else if (e.alpha !== null && e.alpha !== undefined) {
      // Android / Standard W3C Specs (alpha is rotation around Z-axis 0..360)
      compassHeading = (360 - e.alpha) % 360;
    }

    if (compassHeading !== null && !isNaN(compassHeading)) {
      setHeading(Math.round(compassHeading));
      setHasGyro(true);
      setPermissionState('granted');
    }
  }, []);

  // طلب إذن البوصلة لـ iOS Safari
  const requestCompassPermission = useCallback(async () => {
    if (
      typeof DeviceOrientationEvent !== 'undefined' &&
      'requestPermission' in DeviceOrientationEvent &&
      typeof (DeviceOrientationEvent as unknown as { requestPermission: () => Promise<'granted' | 'denied'> }).requestPermission === 'function'
    ) {
      try {
        const res = await (DeviceOrientationEvent as unknown as { requestPermission: () => Promise<'granted' | 'denied'> }).requestPermission();
        if (res === 'granted') {
          setPermissionState('granted');
          window.addEventListener('deviceorientation', handleOrientation, true);
        } else {
          setPermissionState('denied');
        }
      } catch {
        setPermissionState('denied');
      }
    } else if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation, true);
      setPermissionState('granted');
    } else {
      setPermissionState('unsupported');
    }
  }, [handleOrientation]);

  useEffect(() => {
    if (!isOpen) return;

    if (window.DeviceOrientationEvent) {
      // Listen for orientation absolute if supported
      window.addEventListener('deviceorientationabsolute', handleOrientation, true);
      window.addEventListener('deviceorientation', handleOrientation, true);
    } else {
      setPermissionState('unsupported');
    }

    return () => {
      window.removeEventListener('deviceorientationabsolute', handleOrientation, true);
      window.removeEventListener('deviceorientation', handleOrientation, true);
    };
  }, [isOpen, handleOrientation]);

  // تغيير المدينة
  const handleSelectCity = (city: CityOption) => {
    setSelectedCity(city);
    setUserCoords({ lat: city.lat, lng: city.lng });
    setLocationName(isAr ? city.nameAr : city.nameEn);
    setLocationError(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-gradient-to-b from-[#021811] via-[#03291F] to-[#01140E] border-2 border-[#D4AF37] rounded-3xl p-5 sm:p-7 shadow-[0_0_50px_rgba(212,175,55,0.4)] text-[#F8F3E7] max-h-[92vh] overflow-y-auto space-y-5">
        
        {/* Header Title & Close Button */}
        <div className="flex items-center justify-between border-b border-[#D4AF37]/30 pb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-2xl border ${isAligned ? 'bg-emerald-500 text-black border-emerald-300 animate-pulse' : 'bg-[#03291F] border-[#D4AF37] text-[#D4AF37]'} shadow-md`}>
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                <span>{isAr ? 'بوصلة القبلة المباشرة الذكية' : 'Smart Live Qibla Compass'}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37] text-[#D4AF37] font-bold">
                  {isAr ? 'مستشعرات فلكية' : 'Sensors'}
                </span>
              </h3>
              <p className="text-xs text-[#D4AF37]">
                {isAr ? 'تحديد اتجاه الكعبة المشرفة بدقة متناهية من موقعك الحقيقي' : 'Accurate Kaaba direction using device sensors & GPS'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full bg-[#02130D] border border-[#D4AF37]/50 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#02130D] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Badge: Alignment Indicator */}
        <div className={`p-3.5 rounded-2xl border transition-all text-center flex items-center justify-between gap-2 ${
          isAligned
            ? 'bg-emerald-950/90 border-emerald-400 text-emerald-200 shadow-[0_0_25px_rgba(16,185,129,0.5)] animate-bounce'
            : 'bg-[#02130D]/90 border-[#D4AF37]/40 text-[#F8F3E7]'
        }`}>
          <div className="flex items-center gap-2 text-xs sm:text-sm font-black">
            {isAligned ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span className="text-emerald-300">
                  {isAr ? 'أنت في اتجاه القبلة والكعبة المشرفة تماماً! 🕋' : 'Perfect Alignment with the Holy Kaaba! 🕋'}
                </span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>
                  {isAr
                    ? `أدر جهازك حتى تطابق المؤشر مع الكعبة (${normalizedDiff.toFixed(1)}° متبقية)`
                    : `Rotate phone to match Kaaba (${normalizedDiff.toFixed(1)}° away)`}
                </span>
              </>
            )}
          </div>

          <span className="text-xs font-mono font-black text-[#D4AF37] bg-[#01140E] px-2.5 py-1 rounded-xl border border-[#D4AF37]/30 shrink-0">
            {qiblaAngle.toFixed(1)}°
          </span>
        </div>

        {/* -------------------- Interactive Visual Compass -------------------- */}
        <div className="relative my-2 flex flex-col items-center justify-center">
          
          {/* Compass Top Indicator (Phones Top Heading) */}
          <div className="absolute top-0 z-20 flex flex-col items-center -mt-3">
            <div className={`w-3.5 h-3.5 rotate-45 border-2 ${isAligned ? 'bg-emerald-400 border-emerald-200' : 'bg-[#D4AF37] border-white'} shadow-lg`} />
            <span className="text-[10px] font-black text-[#D4AF37] bg-[#02130D] px-2 py-0.5 rounded-full border border-[#D4AF37]/40 shadow mt-0.5">
              {isAr ? 'أعلى الهاتف' : 'Phone Top'}
            </span>
          </div>

          {/* Compass Ring & Dial */}
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full border-4 border-[#D4AF37] bg-gradient-to-br from-[#01140E] via-[#032B20] to-[#010D09] shadow-[0_0_35px_rgba(212,175,55,0.3)] flex items-center justify-center overflow-hidden my-4">
            
            {/* Outer Rotating Dial (Rotates opposite to device heading so North stays North) */}
            <div
              className="absolute inset-0 w-full h-full rounded-full transition-transform duration-200 ease-out flex items-center justify-center"
              style={{ transform: `rotate(${-currentHeading}deg)` }}
            >
              {/* Ticks and Degrees Ring */}
              <div className="absolute inset-2 rounded-full border border-[#D4AF37]/30 pointer-events-none" />

              {/* Cardinal Directions */}
              <span className="absolute top-2 text-xs font-black text-rose-400 font-mono">N</span>
              <span className="absolute bottom-2 text-xs font-black text-[#F8F3E7]/80 font-mono">S</span>
              <span className="absolute right-3 text-xs font-black text-[#F8F3E7]/80 font-mono">E</span>
              <span className="absolute left-3 text-xs font-black text-[#F8F3E7]/80 font-mono">W</span>

              {/* Angle Markers 30° intervals */}
              {[30, 60, 120, 150, 210, 240, 300, 330].map((deg) => (
                <div
                  key={deg}
                  className="absolute text-[8px] text-[#D4AF37]/50 font-mono"
                  style={{
                    transform: `rotate(${deg}deg) translateY(-118px)`
                  }}
                >
                  |
                </div>
              ))}

              {/* KAABA POINTER (Sits at exact qiblaAngle on the compass dial) */}
              <div
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                style={{ transform: `rotate(${qiblaAngle}deg)` }}
              >
                <div className="absolute top-6 flex flex-col items-center group">
                  <div className={`p-1.5 rounded-xl border-2 transition-transform duration-300 ${
                    isAligned
                      ? 'bg-emerald-500 border-white text-black scale-125 shadow-[0_0_20px_rgba(16,185,129,0.8)] animate-pulse'
                      : 'bg-[#02130D] border-[#D4AF37] text-amber-300'
                  }`}>
                    <span className="text-lg">🕋</span>
                  </div>
                  <span className="text-[10px] font-black text-[#D4AF37] bg-black/80 px-2 py-0.5 rounded-full border border-[#D4AF37]/40 mt-1 whitespace-nowrap shadow">
                    {isAr ? 'الكعبة' : 'Kaaba'} ({qiblaAngle.toFixed(0)}°)
                  </span>
                </div>
              </div>
            </div>

            {/* Inner Center Hub & Needle */}
            <div className="relative z-10 w-24 h-24 rounded-full bg-gradient-to-b from-[#021811] to-[#010D09] border-2 border-[#D4AF37] shadow-xl flex flex-col items-center justify-center text-center p-2">
              <span className="text-xl font-black text-[#D4AF37] font-mono leading-none">
                {currentHeading}°
              </span>
              <span className="text-[10px] text-white/80 font-bold mt-1">
                {getDirectionName(currentHeading, isAr)}
              </span>
              <span className="text-[9px] text-amber-200/70 font-mono">
                {hasGyro && !useManualSlider ? (isAr ? 'مستشعر مباشر' : 'Live Gyro') : (isAr ? 'تعديل يدوياً' : 'Manual')}
              </span>
            </div>
          </div>

          {/* iOS / Browser Permission Prompt button if needed */}
          {permissionState === 'prompt' && !useManualSlider && (
            <button
              type="button"
              onClick={requestCompassPermission}
              className="mt-1 px-4 py-2 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-amber-500 text-[#02130D] text-xs font-black shadow-lg hover:scale-105 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Smartphone className="w-4 h-4" />
              <span>{isAr ? 'تفعيل مستشعر البوصلة بالهاتف' : 'Enable Mobile Compass Gyro'}</span>
            </button>
          )}

          {/* Toggle manual slider for desktops or testing */}
          <div className="mt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={() => setUseManualSlider(!useManualSlider)}
              className="text-xs text-[#D4AF37] hover:underline flex items-center gap-1 cursor-pointer font-bold"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>
                {useManualSlider
                  ? (isAr ? 'العودة للمستشعر التلقائي' : 'Use Device Gyro')
                  : (isAr ? 'تدوير البوصلة يدوياً (لأجهزة المكتبي)' : 'Manual Slider Mode')}
              </span>
            </button>
          </div>

          {/* Manual Angle Slider */}
          {useManualSlider && (
            <div className="w-full max-w-xs mt-3 p-3 bg-[#01140E] border border-[#D4AF37]/30 rounded-2xl space-y-1 text-center">
              <div className="flex justify-between text-xs text-[#D4AF37] font-bold">
                <span>{isAr ? 'تدوير الهاتف يدوياً:' : 'Manual Rotation:'}</span>
                <span className="font-mono">{manualSlider}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="359"
                value={manualSlider}
                onChange={(e) => setManualSlider(parseInt(e.target.value, 10))}
                className="w-full accent-[#D4AF37] cursor-pointer"
              />
            </div>
          )}
        </div>

        {/* -------------------- Location & Distance Information Card -------------------- */}
        <div className="p-4 rounded-2xl bg-[#02130D]/90 border border-[#D4AF37]/40 space-y-3">
          <div className="flex items-center justify-between border-b border-[#D4AF37]/20 pb-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#D4AF37]">
              <MapPin className="w-4 h-4 text-[#D4AF37]" />
              <span>{isAr ? 'الموقع الجغرافي المعتمد:' : 'Active Location:'}</span>
              <span className="text-white font-black">{locationName}</span>
            </div>

            <button
              type="button"
              onClick={handleGetGPSLocation}
              disabled={isLocating}
              className="px-3 py-1 rounded-xl bg-[#03291F] border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#02130D] text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <LocateFixed className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
              <span>{isLocating ? (isAr ? 'جاري التحديد...' : 'Locating...') : (isAr ? 'موقعي GPS' : 'GPS Location')}</span>
            </button>
          </div>

          {locationError && (
            <p className="text-xs text-rose-300 font-bold flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span>{locationError}</span>
            </p>
          )}

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
            <div className="p-2.5 bg-[#01140E] border border-[#D4AF37]/30 rounded-xl text-center space-y-0.5">
              <span className="text-[10px] text-[#F8F3E7]/70 font-bold block">
                {isAr ? 'زاوية القبلة' : 'Qibla Bearing'}
              </span>
              <span className="text-sm font-black text-[#D4AF37] font-mono">
                {qiblaAngle.toFixed(1)}°
              </span>
            </div>

            <div className="p-2.5 bg-[#01140E] border border-[#D4AF37]/30 rounded-xl text-center space-y-0.5">
              <span className="text-[10px] text-[#F8F3E7]/70 font-bold block">
                {isAr ? 'الاتجاه التقريبي' : 'Approx Direction'}
              </span>
              <span className="text-xs font-black text-white">
                {getDirectionName(qiblaAngle, isAr)}
              </span>
            </div>

            <div className="p-2.5 bg-[#01140E] border border-[#D4AF37]/30 rounded-xl text-center space-y-0.5 col-span-2 sm:col-span-1">
              <span className="text-[10px] text-[#F8F3E7]/70 font-bold block">
                {isAr ? 'المسافة إلى الكعبة' : 'Distance to Kaaba'}
              </span>
              <span className="text-xs font-black text-emerald-300 font-mono">
                {distanceKm.toLocaleString()} {isAr ? 'كم' : 'km'}
              </span>
            </div>
          </div>

          {/* City Selection Dropdown */}
          <div className="pt-2">
            <label className="block text-xs font-bold text-[#D4AF37] mb-1.5 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{isAr ? 'اختر مدينتك يدوياً للحساب الفوري:' : 'Select city manually:'}</span>
            </label>
            <select
              value={selectedCity.nameEn}
              onChange={(e) => {
                const found = FAMOUS_CITIES.find((c) => c.nameEn === e.target.value);
                if (found) handleSelectCity(found);
              }}
              className="w-full p-2.5 rounded-xl bg-[#01140E] border border-[#D4AF37]/60 text-white text-xs font-bold focus:outline-none focus:border-[#D4AF37]"
            >
              {FAMOUS_CITIES.map((c) => (
                <option key={c.nameEn} value={c.nameEn} className="bg-[#021811] text-white">
                  {isAr ? c.nameAr : c.nameEn}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Footer tips */}
        <div className="p-3 bg-[#01140E] border border-[#D4AF37]/20 rounded-2xl flex items-center gap-2.5 text-[11px] text-[#F8F3E7]/80">
          <ShieldCheck className="w-4 h-4 text-[#D4AF37] shrink-0" />
          <p className="leading-relaxed">
            {isAr
              ? 'نصيحة: ابتعد عن الأسطح المعدنية أو الأجهزة الإلكترونية القوية للحصول على قراءة دقيقة لمغناطيسية البوصلة.'
              : 'Tip: Keep phone away from metallic surfaces or large electronic devices for accurate compass calibration.'}
          </p>
        </div>

      </div>
    </div>
  );
};

export default QiblaCompassModal;
