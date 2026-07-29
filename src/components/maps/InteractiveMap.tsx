import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Navigation,
  LocateFixed,
  Compass,
  Search,
  Filter,
  Info,
  ExternalLink,
  Share2,
  HeartPulse,
  Bus,
  Building2,
  ShieldAlert,
  Clock,
  Sparkles,
  Layers,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  CheckCircle2,
  ArrowRight,
  PhoneCall,
  Volume2,
  VolumeX,
  Footprints,
  Crosshair,
  RefreshCw,
  Wifi,
  WifiOff,
  HardDrive,
} from 'lucide-react';
import { LanguageOption } from '../../data/languages';

interface InteractiveMapProps {
  language: LanguageOption;
  onBack?: () => void;
  onSendToWhatsapp?: (message: string) => void;
  compactMode?: boolean;
}

export interface Landmark {
  id: string;
  nameAr: string;
  nameEn: string;
  category: 'holy_sites' | 'mosques' | 'miqat' | 'services' | 'transport';
  lat: number;
  lng: number;
  // Position on stylized 2D canvas (0-100%)
  xPercent: number;
  yPercent: number;
  area: 'makkah' | 'mina' | 'muzdalifah' | 'arafat' | 'madinah' | 'miqat';
  descAr: string;
  descEn: string;
  ritualsAr?: string;
  ritualsEn?: string;
  duaAr?: string;
  tipsAr: string[];
  tipsEn: string[];
  phone?: string;
  isPopular?: boolean;
}

// Key Hajj & Holy Sites Landmarks Data
export const HAJJ_LANDMARKS: Landmark[] = [
  {
    id: 'kaaba',
    nameAr: 'الكعبة المشرفه والمسجد الحرام',
    nameEn: 'Holy Kaaba & Al-Masjid Al-Haram',
    category: 'holy_sites',
    lat: 21.4225,
    lng: 39.8262,
    xPercent: 28,
    yPercent: 42,
    area: 'makkah',
    descAr: 'قبلة المسلمين وقبلة الصلاة ومقصد الحج والعمرة. تحوي الحجر الأسود، مقام إبراهيم، حجر إسماعيل، وبئر زمزم.',
    descEn: 'The Qibla of Muslims, core destination for Hajj & Umrah containing the Black Stone & Maqam Ibrahim.',
    ritualsAr: 'الطواف 7 أشواط، صلاة ركعتين خلف مقام إبراهيم، الشرب من زمزم، والسعي بين الصفا والمروة.',
    ritualsEn: '7 Tawaf laps, 2 Rak\'ahs at Maqam Ibrahim, drinking Zamzam, Sa\'i between Safa & Marwah.',
    duaAr: '«رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ»',
    tipsAr: [
      'أفضل أوقات الطواف خفيفة الزحام هي بعد الفجر مباشرة أو منتصف الليل.',
      'الالتزام بالمسارات المحددة للطائفين وكبار السن.',
      'استخدام العربات الكهربائية متوفر بدقة في الدور الثاني والدور العلوي.'
    ],
    tipsEn: [
      'Best off-peak times for Tawaf are right after Fajr or late night.',
      'Electric carts are available on upper floors for elderly pilgrims.'
    ],
    isPopular: true,
  },
  {
    id: 'safa_marwah',
    nameAr: 'المسعى - الصفا والمروة',
    nameEn: 'Masa\'a - Safa & Marwah',
    category: 'holy_sites',
    lat: 21.423,
    lng: 39.8275,
    xPercent: 32,
    yPercent: 40,
    area: 'makkah',
    descAr: 'الممر المبارك الممتد بين جبل الصفا والمروة، حيث يتم أداء ركن السعي 7 أشواط اقتداءً بالسيدة هاجر عليها السلام.',
    descEn: 'The sacred corridor connecting Safa & Marwah, site of the 7-lap Sa\'i ritual.',
    ritualsAr: 'السعي 7 أشواط يبدأ من الصفا وينتهي بالمرّة، والهرولة الخفيفة للرجال بين العلمين الأخضرين.',
    ritualsEn: '7 laps starting at Safa and ending at Marwah, jogging between green marks for men.',
    duaAr: '«إِنَّ الصَّفَا وَالْمَرْوَةَ مِن شَعَائِرِ اللَّهِ ۖ فَمَنْ حَجَّ الْبَيْتَ أَوِ اعْتَمَرَ فَلَا جُنَاحَ عَلَيْهِ أَن يَطَّوَّفَ بِهِمَا»',
    tipsAr: [
      'المسعى مكيف بالكامل ويتكون من أربعة أدوار لتسهيل الحركة.',
      'تتوفر مياه زمزم المبردة والرديئة في جميع أرجاء المسعى.'
    ],
    tipsEn: [
      'Masa\'a features 4 fully air-conditioned levels with Zamzam points.'
    ],
    isPopular: true,
  },
  {
    id: 'mina_jamarat',
    nameAr: 'مشعر منى ومجمع الجمرات',
    nameEn: 'Mina Valley & Jamarat Complex',
    category: 'holy_sites',
    lat: 21.4133,
    lng: 39.8933,
    xPercent: 50,
    yPercent: 48,
    area: 'mina',
    descAr: 'وادي منى المبارك حيث يتم المبيت أيام التشريق ورمي الجمرات الثلاث في المبنى المطور ذو الخمسة أدوار.',
    descEn: 'Mina Valley where pilgrims stay during Tashreeq days & perform pebble throwing at Jamarat.',
    ritualsAr: 'المبيت بمنى ليلة 8 ذو الحجة وأيام 11 و12 و13، ورمي الجمرات بـ 21 حصاة يومياً.',
    ritualsEn: 'Overnight stays on 8th & Tashreeq days, casting pebbles at Jamarat bridge.',
    duaAr: '«اللَّهُ أَكْبَرُ، اللَّهُمَّ اجْعَلْهُ حَجًّا مَبْرُورًا وَذَنْبًا مَغْفُورًا»',
    tipsAr: [
      'جسر الجمرات مزود بتكييف صحراوي ومسارات متعددة لتفادي التدافع.',
      'الالتزام بأوقات التفويج المحددة من وزارة الحج والعمرة.'
    ],
    tipsEn: [
      'Jamarat Bridge is multi-leveled with cool mist fans and regimented flow.'
    ],
    isPopular: true,
  },
  {
    id: 'jamarat_aqaba',
    nameAr: 'جمرة العقبة الكبرى (الجمرة الكبرى)',
    nameEn: 'Jamarat Al-Aqaba (Big Pillar)',
    category: 'holy_sites',
    lat: 21.4181,
    lng: 39.8732,
    xPercent: 45,
    yPercent: 46,
    area: 'mina',
    descAr: 'الجمرة الأخيرة الأقرب إلى مكة المكرمة، وترمى بـ 7 حصيات يوم النحر (10 ذو الحجة) ثم في أيام التشريق.',
    descEn: 'The last and largest Jamarah pillar closest to Makkah, pelted on Eid day (10th Dhul-Hijjah) with 7 pebbles.',
    ritualsAr: 'رمي 7 حصيات والتكبير مع كل حصاة: "الله أكبر، اللهم اجعله حجاً مبروراً".',
    ritualsEn: 'Pelting 7 pebbles reciting Takbeer with each pebble.',
    duaAr: '«اللَّهُ أَكْبَرُ، اللَّهُمَّ اجْعَلْهُ حَجًّا مَبْرُورًا»',
    tipsAr: ['يبدأ رميها بعد طلوع الشمس يوم 10 ذو الحجة ويستمر حتى الفجر.'],
    tipsEn: ['Throwing starts after sunrise on the 10th of Dhul-Hijjah.'],
    isPopular: true,
  },
  {
    id: 'jamarat_wusta',
    nameAr: 'الجمرة الوسطى (Jamarat Al-Wusta)',
    nameEn: 'Jamarat Al-Wusta (Middle Pillar)',
    category: 'holy_sites',
    lat: 21.4172,
    lng: 39.8751,
    xPercent: 48,
    yPercent: 47,
    area: 'mina',
    descAr: 'الجمرة الثانية الواقعة بين الجمرة الصغرى وجمرة العقبة الكبرى، ترمى في أيام التشريق 11 و12 و13 ذو الحجة.',
    descEn: 'The middle Jamarah pillar pelted second during Tashreeq days.',
    ritualsAr: 'رمي 7 حصيات ثم استقبال القبلة والوقوف للدعاء الطويل رفع اليدين.',
    ritualsEn: 'Pelt 7 pebbles then face Qibla and make long dua.',
    tipsAr: ['من السنة الوقوف بعد رميها للدعاء والتضرع لله تعالى.'],
    tipsEn: ['Sunnah to stand after throwing for long supplication.'],
  },
  {
    id: 'jamarat_sughra',
    nameAr: 'الجمرة الصغرى (Jamarat Al-Sughra)',
    nameEn: 'Jamarat Al-Sughra (First/Small Pillar)',
    category: 'holy_sites',
    lat: 21.4163,
    lng: 39.8768,
    xPercent: 52,
    yPercent: 49,
    area: 'mina',
    descAr: 'الجمرة الأولى الأقرب إلى مسجد الخيف بمشعر منى، يبدأ بها الرمي بعد الزوال في أيام التشريق.',
    descEn: 'The first Jamarah pillar near Al-Khaif Mosque, pelted first after Dhuhr on Tashreeq days.',
    ritualsAr: 'رمي 7 حصيات متعاقبة، ثم التنحي عن الطريق والاستقبال للقبلة والدعاء.',
    ritualsEn: 'Pelt 7 pebbles consecutively, then move aside to supplicate facing Qibla.',
    tipsAr: ['يبدأ رمي الجمرات الثلاث يوم 11 ذو الحجة بعد زوال الشمس (الظهر).'],
    tipsEn: ['Pelting begins after Dhuhr prayer on Tashreeq days.'],
  },
  {
    id: 'muzdalifah',
    nameAr: 'مشعر مزدلفة (المشعر الحرام)',
    nameEn: 'Muzdalifah Sacred Grounds',
    category: 'holy_sites',
    lat: 21.3892,
    lng: 39.9325,
    xPercent: 68,
    yPercent: 58,
    area: 'muzdalifah',
    descAr: 'البقعة المباركة بين عرفات ومنى التي يبيت فيها الحجاج ليلة العاشر من ذو الحجة ويجمعون منها حصى الجمرات.',
    descEn: 'Sacred grounds between Arafat and Mina where pilgrims spend the night of 10th Dhul Hijjah.',
    ritualsAr: 'صلاة المغرب والعشاء جمع تأخير وقصراً، التقاط 7 حصيات لجمرة العقبة والمبيت حتى الفجر.',
    ritualsEn: 'Combining Maghrib & Isha, gathering pebbles and resting overnight until Fajr.',
    duaAr: '«فَإِذَا أَفَضْتُم مِّنْ عَرَفَاتٍ فَاذْكُرُوا اللَّهَ عِندَ الْمَشْعَرِ الْحَرَامِ»',
    tipsAr: [
      'تتوفر دورات المياه الحافلات والخدمات الأساسية في الساحات المجهزة.',
      'الحفاظ على الهدوء والسكينة أثناء التقاط الحصى والتضرع لله.'
    ],
    tipsEn: [
      'Rest peacefully and gather smooth small pebbles for the Jamarat.'
    ],
    isPopular: true,
  },
  {
    id: 'arafat_mercy',
    nameAr: 'صعيد عرفات وجبل الرحمة',
    nameEn: 'Mount Arafat & Jabal Al-Rahmah',
    category: 'holy_sites',
    lat: 21.3549,
    lng: 39.9841,
    xPercent: 86,
    yPercent: 72,
    area: 'arafat',
    descAr: 'ركن الحج الأعظم «الحج عرفة»، البقعة التي يتنزل فيها الرب جل وعلا ويباهي بملائكته أهل الموقف يوم التاسع من ذو الحجة.',
    descEn: 'The core pillar of Hajj "Hajj is Arafah" where pilgrims gather on the 9th of Dhul Hijjah.',
    ritualsAr: 'الوقوف بعرفة من الزوال حتى غروب الشمس، الجمع بين الظهر والعصر وقصراً، والإكثار من الدعاء.',
    ritualsEn: 'Standing at Arafat from Dhuhr to sunset, combining Dhuhr & Asr, intense supplications.',
    duaAr: '«لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ»',
    tipsAr: [
      'الوقوف مجزئ في أي مكان داخل حدود عرفات المحددة باللوحات الإرشادية.',
      'عدم المغادرة قبل غروب الشمس تماماً اتباعاً للسنة.'
    ],
    tipsEn: [
      'Standing anywhere inside Arafat boundary signs is completely valid.'
    ],
    isPopular: true,
  },
  {
    id: 'namirah_mosque',
    nameAr: 'مسجد نمرة بعرفات',
    nameEn: 'Namirah Mosque in Arafat',
    category: 'mosques',
    lat: 21.3618,
    lng: 39.9722,
    xPercent: 82,
    yPercent: 68,
    area: 'arafat',
    descAr: 'المسجد الشهير الذي يلقى فيه خطيب يوم عرفة خطبة خطبة عرفة ويصلي فيه الحجاج الظهر والعصر جمعاً وقصراً.',
    descEn: 'Historic mosque where Arafah sermon is delivered & combined Dhuhr/Asr prayer is held.',
    ritualsAr: 'الاستماع لخطبة عرفة وصلاة الظهر والعصر جمع تقديم.',
    ritualsEn: 'Listening to Arafah sermon and praying combined Dhuhr and Asr.',
    tipsAr: [
      'ملاحظة: الجزء الأمامي من المسجد خارج حدود عرفات، والجزء الخلفي داخل عرفات.'
    ],
    tipsEn: [
      'Note: The front section of Namirah mosque lies outside Arafat boundaries.'
    ],
  },
  {
    id: 'prophet_mosque',
    nameAr: 'المسجد النبوي الشريف - المدينة المنورة',
    nameEn: 'Al-Masjid An-Nabawi - Madinah',
    category: 'holy_sites',
    lat: 24.4672,
    lng: 39.6112,
    xPercent: 18,
    yPercent: 18,
    area: 'madinah',
    descAr: 'مسجد رسول الله ﷺ في المدينة المنورة، يحوي الروضة الشريفة والحجرة النبوية المباركة.',
    descEn: 'The Prophet\'s Mosque in Madinah, housing Al-Rawdah Al-Sharifah and the Noble Chamber.',
    ritualsAr: 'الصلاة بالمسجد النبوي (بألف صلاة)، زيارة الروضة الشريفة بتصريح، والسلام على النبي ﷺ وصاحبيه.',
    ritualsEn: 'Prayers rewarded 1,000x, visiting Rawdah with permit, greeting the Prophet PBUH.',
    duaAr: '«السَّلاَمُ عَلَيْكَ يَا رَسُولَ اللَّهِ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ»',
    tipsAr: [
      'حجز تصريح الروضة الشريفة مسبقاً من تطبيق نسك.',
      'الالتزام بالسكينة والوقار والهدوء داخل الحرم النبوي.'
    ],
    tipsEn: [
      'Book Rawdah permit ahead on Nusuk app. Maintain serene silence.'
    ],
    isPopular: true,
  },
  {
    id: 'quba_mosque',
    nameAr: 'مسجد قباء بالمدينة المنورة',
    nameEn: 'Quba Mosque - Madinah',
    category: 'mosques',
    lat: 24.4392,
    lng: 39.6172,
    xPercent: 14,
    yPercent: 25,
    area: 'madinah',
    descAr: 'أول مسجد أُسّس على التقوى في الإسلام، الصلاة فيه تعدل أجر عمرة كليّة.',
    descEn: 'First mosque built in Islamic history; praying here equals the reward of full Umrah.',
    duaAr: '«اللَّهُمَّ افتَحْ لِي أَبْوَابَ رَحْمَتِكَ»',
    tipsAr: [
      'التطهر في الفندق والصلاة فيه ركعتين لنيل أجر العمرة.'
    ],
    tipsEn: [
      'Perform ablution beforehand to gain the reward of Umrah.'
    ],
  },
  {
    id: 'miqat_dhul_hulaifah',
    nameAr: 'ميقات ذو الحليفة (آبار علي)',
    nameEn: 'Miqat Dhul Hulaifah (Abar Ali)',
    category: 'miqat',
    lat: 24.4128,
    lng: 39.5442,
    xPercent: 10,
    yPercent: 15,
    area: 'miqat',
    descAr: 'ميقات أهل المدينة المنورة ومن مرّ بعليها للإحرام بالعمرة أو الحج.',
    descEn: 'Designated Miqat for pilgrims travelling from Madinah.',
    ritualsAr: 'الاغتسال وارتداء لباس الإحرام ونية الدخول في النسك والتلبية.',
    ritualsEn: 'Ghusl, wearing Ihram, declaring Niyyah and reciting Talbiyah.',
    tipsAr: [
      'يضم مرافق حديثة جداً لتبديل الملابس والاغتسال والمواقف.'
    ],
    tipsEn: [
      'Features modern facilities for Ghusl, changing & parking.'
    ],
  },
  {
    id: 'miqat_qarn_manazil',
    nameAr: 'ميقات قرن المنازل (السيل الكبير)',
    nameEn: 'Miqat Qarn Al-Manazil (Al-Sail Al-Kabeer)',
    category: 'miqat',
    lat: 21.6311,
    lng: 40.4286,
    xPercent: 40,
    yPercent: 12,
    area: 'miqat',
    descAr: 'ميقات أهل نجد والطائف والقادمين من الشرق.',
    descEn: 'Designated Miqat for pilgrims coming from Najd, Taif & Eastern region.',
    tipsAr: [
      'مجهز بمجمع خدمي كبير ومصليات تتسع لآلاف الحجاج.'
    ],
    tipsEn: [
      'Equipped with huge service complex & prayer halls.'
    ],
  },
  {
    id: 'hospital_mina_wadi',
    nameAr: 'مستشفى منى الوادي للطوارئ',
    nameEn: 'Mina Al-Wadi Emergency Hospital',
    category: 'services',
    lat: 21.4155,
    lng: 39.8890,
    xPercent: 54,
    yPercent: 52,
    area: 'mina',
    descAr: 'مستشفى طوارئ متخصص في المشاعر لتقديم الرعاية الطبية والإجهاد الحراري مجاناً.',
    descEn: 'Specialized emergency hospital in Mina for heatstroke & immediate medical aid.',
    phone: '997',
    tipsAr: [
      'الخدمة الطبية مجانية لجميع ضيوف الرحمن، وطوارئ الهلال الأحمر 997.'
    ],
    tipsEn: [
      'Free healthcare for all pilgrims. Red Crescent emergency: 997.'
    ],
  },
  {
    id: 'station_makkah_train',
    nameAr: 'محطة قطار الحرمين السريع - مكة',
    nameEn: 'Haramain Railway Station - Makkah',
    category: 'transport',
    lat: 21.4320,
    lng: 39.7925,
    xPercent: 22,
    yPercent: 38,
    area: 'makkah',
    descAr: 'محطة القطار الكهربائي السريع المربوط بين مكة والمدينة وجدة بمدة ساعتين فقط.',
    descEn: 'High-speed electric train connecting Makkah, Jeddah & Madinah in 2 hours.',
    tipsAr: [
      'حجز التذاكر الكترونياً مسبقاً عبر تطبيق قطار الحرمين.'
    ],
    tipsEn: [
      'Book tickets online in advance via Haramain train app.'
    ],
  }
];

// Helper: Haversine distance formula in kilometers
function calculateHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10; // 1 decimal point
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  language,
  onBack,
  onSendToWhatsapp,
  compactMode = false,
}) => {
  const isAr = language.code === 'ar';

  // State: Filter category
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // State: Active selected landmark
  const [selectedLandmark, setSelectedLandmark] = useState<Landmark | null>(HAJJ_LANDMARKS[0]);

  // State: Map view mode (Stylized Interactive Canvas vs Embedded Map)
  const [mapType, setMapType] = useState<'stylized' | 'hybrid'>('stylized');

  // State: User Geolocation
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
    accuracy?: number;
    addressName?: string;
    isLocating: boolean;
    error?: string;
  }>({
    lat: 21.4225, // Default near Kaaba
    lng: 39.8262,
    isLocating: false,
    addressName: isAr ? 'مكة المكرمة - قرب الحرم' : 'Makkah - Near Haram',
  });

  // State: Map Zoom & Pan
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  // State: TTS for Dua
  const [isPlayingDua, setIsPlayingDua] = useState<boolean>(false);

  // Get user location handler via Geolocation API
  const handleGetLiveLocation = () => {
    if (!navigator.geolocation) {
      setUserLocation((prev) => ({
        ...prev,
        error: isAr ? 'خاصية تحديد الموقع غير مدعومة في متصفحك.' : 'Geolocation not supported.',
      }));
      return;
    }

    setUserLocation((prev) => ({ ...prev, isLocating: true, error: undefined }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        setUserLocation({
          lat: latitude,
          lng: longitude,
          accuracy: Math.round(accuracy),
          isLocating: false,
          addressName: isAr ? 'موقعي الفعلي الحالي (عبر GPS)' : 'My Current Live GPS Position',
        });
      },
      (err) => {
        setUserLocation((prev) => ({
          ...prev,
          isLocating: false,
          error: isAr
            ? 'تعذر جلب الموقع. يرجى تفعيل إذن الوصول للموقع (GPS).'
            : 'Could not fetch location. Please enable GPS permissions.',
        }));
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // Preset location picker for testing or quick reference
  const handleSelectPresetLocation = (presetKey: string) => {
    if (presetKey === 'kaaba') {
      setUserLocation({
        lat: 21.4225,
        lng: 39.8262,
        isLocating: false,
        addressName: isAr ? 'المسجد الحرام - مكة المكرمة' : 'Al-Masjid Al-Haram, Makkah',
      });
    } else if (presetKey === 'mina') {
      setUserLocation({
        lat: 21.4133,
        lng: 39.8933,
        isLocating: false,
        addressName: isAr ? 'مخيمات منى - المشاعر المقدسة' : 'Mina Tents Camp',
      });
    } else if (presetKey === 'arafat') {
      setUserLocation({
        lat: 21.3549,
        lng: 39.9841,
        isLocating: false,
        addressName: isAr ? 'صعيد عرفات - جبل الرحمة' : 'Mount Arafat',
      });
    } else if (presetKey === 'madinah') {
      setUserLocation({
        lat: 24.4672,
        lng: 39.6112,
        isLocating: false,
        addressName: isAr ? 'المدينة المنورة - الحرم النبوي' : 'Prophet\'s Mosque, Madinah',
      });
    }
  };

  // Filter landmarks
  const filteredLandmarks = useMemo(() => {
    return HAJJ_LANDMARKS.filter((item) => {
      const matchCat = selectedCategory === 'all' || item.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        item.nameAr.toLowerCase().includes(q) ||
        item.nameEn.toLowerCase().includes(q) ||
        item.descAr.toLowerCase().includes(q) ||
        item.descEn.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Distance from user to selected landmark
  const currentDistanceKm = useMemo(() => {
    if (!selectedLandmark) return null;
    return calculateHaversineDistance(
      userLocation.lat,
      userLocation.lng,
      selectedLandmark.lat,
      selectedLandmark.lng
    );
  }, [userLocation, selectedLandmark]);

  // Nearest landmark calculation
  const nearestLandmark = useMemo(() => {
    let minDist = Infinity;
    let nearest: Landmark | null = null;
    HAJJ_LANDMARKS.forEach((lm) => {
      const d = calculateHaversineDistance(userLocation.lat, userLocation.lng, lm.lat, lm.lng);
      if (d < minDist) {
        minDist = d;
        nearest = lm;
      }
    });
    return { landmark: nearest, distance: minDist };
  }, [userLocation]);

  // Text To Speech for Dua
  const handlePlayTTSDua = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    if (isPlayingDua) {
      window.speechSynthesis.cancel();
      setIsPlayingDua(false);
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ar-SA';
    utterance.rate = 0.85;
    utterance.onend = () => setIsPlayingDua(false);
    utterance.onerror = () => setIsPlayingDua(false);
    setIsPlayingDua(true);
    window.speechSynthesis.speak(utterance);
  };

  // Share Landmark
  const handleShareLandmark = (landmark: Landmark) => {
    const dStr = currentDistanceKm !== null ? `📍 ${isAr ? 'المسافة من موقعي' : 'Distance'}: ${currentDistanceKm} km\n` : '';
    const msg = `🕋 *${isAr ? landmark.nameAr : landmark.nameEn}*\n` +
      `🌐 ${isAr ? landmark.descAr : landmark.descEn}\n${dStr}` +
      `🔗 Google Maps: https://www.google.com/maps?q=${landmark.lat},${landmark.lng}\n\n` +
      `✨ ${isAr ? 'منصة عرفات التفاعلية للمشاعر المقدسة 🕌' : 'Arafat Holy Sites Interactive Map 🕌'}`;

    if (onSendToWhatsapp) {
      onSendToWhatsapp(msg);
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
    }
  };

  return (
    <div className={`w-full max-w-6xl mx-auto bg-[#021811] text-[#F8F3E7] rounded-3xl border-2 border-[#D4AF37] shadow-[0_20px_50px_rgba(0,0,0,0.9)] overflow-hidden my-4 ${compactMode ? 'p-4' : 'p-4 sm:p-6'}`}>
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#D4AF37]/30 pb-4 mb-5">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#D4AF37]/60 bg-[#03291F] hover:bg-[#073D2F] text-[#D4AF37] transition-all text-sm font-bold cursor-pointer shadow-md"
          >
            <ArrowRight className={`w-4 h-4 ${!isAr ? 'rotate-180' : ''}`} />
            <span>{isAr ? 'العودة' : 'Back'}</span>
          </button>
        )}

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/20 border-2 border-[#D4AF37] flex items-center justify-center text-[#D4AF37] shadow-lg">
            <Navigation className="w-6 h-6 text-[#D4AF37]" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-[#D4AF37]">
              {isAr ? 'الخريطة التفاعلية للمشاعر المقدسة والمعالم' : 'Interactive Map of Sacred Sites & Hajj Landmarks'}
            </h2>
            <p className="text-xs text-[#F8F3E7]/75">
              {isAr
                ? 'استكشف أهم معالم الحج والعمرة، وحدد موقعك الحالي لحساب المسافات والإرشادات'
                : 'Explore core Hajj & Umrah landmarks with live GPS distance tracking'}
            </p>
          </div>
        </div>

        {/* Mode Toggle & Offline Status Badge */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-bold shadow-sm">
            <HardDrive className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isAr ? 'متاحة بدون إنترنت 100%' : '100% Offline Ready'}</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          </div>

          <div className="flex items-center gap-1 bg-[#01140E] p-1 rounded-2xl border border-[#D4AF37]/40">
            <button
              type="button"
              onClick={() => setMapType('stylized')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                mapType === 'stylized'
                  ? 'bg-[#D4AF37] text-[#02130D] shadow-md'
                  : 'text-[#F8F3E7]/70 hover:text-white'
              }`}
            >
              {isAr ? 'خريطة تفاعلية' : 'Interactive 2D'}
            </button>
            <button
              type="button"
              onClick={() => setMapType('hybrid')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                mapType === 'hybrid'
                  ? 'bg-[#D4AF37] text-[#02130D] shadow-md'
                  : 'text-[#F8F3E7]/70 hover:text-white'
              }`}
            >
              {isAr ? 'خريطة الأقمار (GPS)' : 'Satellite / OpenMap'}
            </button>
          </div>
        </div>
      </div>

      {/* User Location Bar & Preset Picker */}
      <div className="bg-[#03291F] border border-[#D4AF37]/50 rounded-2xl p-4 mb-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 shadow-inner">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={handleGetLiveLocation}
            disabled={userLocation.isLocating}
            className={`p-3 rounded-2xl border-2 transition-all flex items-center justify-center shrink-0 cursor-pointer shadow-md ${
              userLocation.isLocating
                ? 'bg-amber-500/20 border-amber-400 text-amber-300 animate-pulse'
                : 'bg-[#02130D] border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#02130D]'
            }`}
            title={isAr ? 'انقر لتحديد موقعي الحالي عبر GPS' : 'Click to get live GPS location'}
          >
            {userLocation.isLocating ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <LocateFixed className="w-5 h-5" />
            )}
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
                {isAr ? 'موقعي المعتمد:' : 'My Location:'}
              </span>
              <span className="text-xs text-emerald-400 bg-emerald-950/80 border border-emerald-500/40 px-2 py-0.5 rounded-full font-mono">
                {userLocation.lat.toFixed(4)}°, {userLocation.lng.toFixed(4)}°
              </span>
            </div>
            <h4 className="text-sm font-black text-white truncate mt-0.5">
              {userLocation.addressName}
            </h4>
            {userLocation.error && (
              <p className="text-[11px] text-rose-400 mt-0.5">{userLocation.error}</p>
            )}
          </div>
        </div>

        {/* Quick Presets for Pilgrims or testing */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          <span className="text-xs text-[#F8F3E7]/60 font-bold">
            {isAr ? 'مواقع افتراضية للتجربة:' : 'Test Locations:'}
          </span>
          {[
            { key: 'kaaba', nameAr: '🕋 الحرم', nameEn: 'Haram' },
            { key: 'mina', nameAr: '⛺ منى', nameEn: 'Mina' },
            { key: 'arafat', nameAr: '⛰️ عرفات', nameEn: 'Arafat' },
            { key: 'madinah', nameAr: '💚 المدينة', nameEn: 'Madinah' },
          ].map((preset) => (
            <button
              key={preset.key}
              type="button"
              onClick={() => handleSelectPresetLocation(preset.key)}
              className="px-2.5 py-1 rounded-xl bg-[#01140E] border border-[#D4AF37]/40 hover:border-[#D4AF37] text-xs font-bold text-[#D4AF37] hover:text-white transition-all cursor-pointer"
            >
              {isAr ? preset.nameAr : preset.nameEn}
            </button>
          ))}
        </div>
      </div>

      {/* Filter Categories Bar & Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 mb-5">
        {/* Categories */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {[
            { id: 'all', labelAr: 'الكل', labelEn: 'All' },
            { id: 'holy_sites', labelAr: '🕋 المشاعر المقدسة', labelEn: 'Holy Sites' },
            { id: 'mosques', labelAr: '🕌 المساجد والمعالم', labelEn: 'Mosques' },
            { id: 'miqat', labelAr: '🚩 المواقيت الشرعية', labelEn: 'Miqats' },
            { id: 'services', labelAr: '🏥 الطوارئ والخدمات', labelEn: 'Services' },
            { id: 'transport', labelAr: '🚆 القطارات والمواصلات', labelEn: 'Transport' },
          ].map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer border ${
                  isActive
                    ? 'bg-[#D4AF37] text-[#02130D] border-[#D4AF37] shadow-md'
                    : 'bg-[#03291F] text-[#F8F3E7]/80 border-[#D4AF37]/30 hover:border-[#D4AF37]'
                }`}
              >
                {isAr ? cat.labelAr : cat.labelEn}
              </button>
            );
          })}
        </div>

        {/* Search input */}
        <div className="relative min-w-[220px]">
          <Search className="w-4 h-4 text-[#D4AF37] absolute top-3 right-3 dir-rtl:right-3 dir-ltr:left-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isAr ? 'ابحث عن معلم أو مشعر...' : 'Search landmark...'}
            className="w-full py-2 px-9 rounded-xl bg-[#01140E] border border-[#D4AF37]/40 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#D4AF37]"
          />
        </div>
      </div>

      {/* Main Grid: Map Canvas + Sidebar Landmark Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left/Center: Interactive Map Stage */}
        <div className="lg:col-span-7 bg-[#01140E] border-2 border-[#D4AF37]/60 rounded-2xl relative min-h-[420px] sm:min-h-[480px] overflow-hidden flex flex-col justify-between shadow-2xl">
          {/* Controls Bar top right */}
          <div className="absolute top-3 right-3 z-20 flex items-center gap-2 bg-[#021811]/90 backdrop-blur-md p-1.5 rounded-xl border border-[#D4AF37]/50 shadow-lg">
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.min(z + 0.2, 1.8))}
              className="p-1.5 hover:bg-[#073D2F] text-[#D4AF37] rounded-lg cursor-pointer"
              title={isAr ? 'تكبير' : 'Zoom In'}
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <span className="text-[10px] font-bold text-[#D4AF37] px-1">{Math.round(zoomLevel * 100)}%</span>
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.max(z - 0.2, 0.8))}
              className="p-1.5 hover:bg-[#073D2F] text-[#D4AF37] rounded-lg cursor-pointer"
              title={isAr ? 'تصغير' : 'Zoom Out'}
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setZoomLevel(1)}
              className="p-1.5 hover:bg-[#073D2F] text-[#D4AF37] rounded-lg cursor-pointer text-[10px] font-bold"
            >
              100%
            </button>
          </div>

          {/* Map View Rendering */}
          {mapType === 'stylized' ? (
            <div className="relative w-full h-full min-h-[420px] sm:min-h-[480px] overflow-auto flex items-center justify-center p-4 bg-gradient-to-br from-[#01110b] via-[#022117] to-[#01160e]">
              {/* Animated Map Grid Lines */}
              <div
                className="absolute inset-0 opacity-15 pointer-events-none"
                style={{
                  backgroundImage:
                    'radial-gradient(#D4AF37 1px, transparent 1px), linear-gradient(to right, #D4AF37 1px, transparent 1px), linear-gradient(to bottom, #D4AF37 1px, transparent 1px)',
                  backgroundSize: '40px 40px',
                }}
              />

              {/* Scalable Canvas container */}
              <div
                className="relative w-full h-full max-w-[800px] min-h-[400px] transition-transform duration-300 ease-out"
                style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }}
              >
                {/* Visual Area Zones */}
                {/* Makkah Zone */}
                <div className="absolute left-[20%] top-[35%] w-[120px] h-[120px] rounded-full border border-dashed border-[#D4AF37]/30 bg-[#D4AF37]/5 flex items-center justify-center pointer-events-none">
                  <span className="text-[10px] font-bold text-[#D4AF37]/40 uppercase">منطقة مكة المكرمة</span>
                </div>
                {/* Mina Zone */}
                <div className="absolute left-[48%] top-[42%] w-[100px] h-[90px] rounded-2xl border border-dashed border-amber-500/20 bg-amber-500/5 flex items-center justify-center pointer-events-none">
                  <span className="text-[10px] font-bold text-amber-300/30">مشعر منى</span>
                </div>
                {/* Arafat Zone */}
                <div className="absolute left-[78%] top-[62%] w-[110px] h-[100px] rounded-2xl border border-dashed border-emerald-500/20 bg-emerald-500/5 flex items-center justify-center pointer-events-none">
                  <span className="text-[10px] font-bold text-emerald-300/30">صعيد عرفات</span>
                </div>

                {/* Connecting Holy Route Path (Makkah -> Mina -> Muzdalifah -> Arafat) */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                  <path
                    d="M 28% 42% Q 40% 45% 52% 48% T 68% 58% T 86% 72%"
                    fill="none"
                    stroke="#D4AF37"
                    strokeWidth="3"
                    strokeDasharray="6 4"
                    className="opacity-60 animate-pulse"
                  />
                </svg>

                {/* User Current Position Pin on Canvas */}
                <div
                  className="absolute z-20 transition-all duration-500 -translate-x-1/2 -translate-y-1/2"
                  style={{ left: '26%', top: '44%' }}
                >
                  <div className="relative group flex flex-col items-center">
                    <span className="w-5 h-5 rounded-full bg-cyan-400 border-2 border-white shadow-[0_0_15px_rgba(34,211,238,1)] animate-ping absolute inset-0" />
                    <div className="w-5 h-5 rounded-full bg-cyan-500 border-2 border-white shadow-md z-10 flex items-center justify-center">
                      <Crosshair className="w-3 h-3 text-slate-950 stroke-[3]" />
                    </div>
                    <span className="mt-1 bg-cyan-950 border border-cyan-400 text-cyan-200 text-[9px] font-bold px-1.5 py-0.5 rounded-md shadow-md whitespace-nowrap">
                      {isAr ? 'موقعي' : 'My Location'}
                    </span>
                  </div>
                </div>

                {/* Render Interactive Pins for Landmarks */}
                {filteredLandmarks.map((lm) => {
                  const isSelected = selectedLandmark?.id === lm.id;
                  const isPopular = lm.isPopular;

                  return (
                    <button
                      key={lm.id}
                      type="button"
                      onClick={() => setSelectedLandmark(lm)}
                      className="absolute z-10 -translate-x-1/2 -translate-y-1/2 group cursor-pointer transition-all duration-300"
                      style={{ left: `${lm.xPercent}%`, top: `${lm.yPercent}%` }}
                    >
                      <div className="flex flex-col items-center">
                        {/* Pin Ripple effect when selected */}
                        {isSelected && (
                          <span className="w-9 h-9 rounded-full bg-[#D4AF37]/40 border border-[#D4AF37] animate-ping absolute -top-1" />
                        )}

                        {/* Icon Marker Box */}
                        <div
                          className={`p-2 rounded-2xl border-2 transition-all flex items-center justify-center shadow-xl ${
                            isSelected
                              ? 'bg-[#D4AF37] text-[#02130D] border-white scale-125 z-30 shadow-[0_0_20px_rgba(212,175,55,0.9)]'
                              : isPopular
                              ? 'bg-[#03291F] text-[#D4AF37] border-[#D4AF37] hover:scale-110'
                              : 'bg-[#01140E] text-[#F8F3E7]/80 border-[#D4AF37]/50 hover:scale-105'
                          }`}
                        >
                          {lm.category === 'holy_sites' ? (
                            <Sparkles className="w-4 h-4" />
                          ) : lm.category === 'mosques' ? (
                            <Building2 className="w-4 h-4" />
                          ) : lm.category === 'miqat' ? (
                            <Navigation className="w-4 h-4" />
                          ) : lm.category === 'services' ? (
                            <HeartPulse className="w-4 h-4 text-rose-400" />
                          ) : (
                            <Bus className="w-4 h-4 text-amber-300" />
                          )}
                        </div>

                        {/* Label Badge */}
                        <span
                          className={`mt-1.5 px-2 py-0.5 rounded-lg text-[10px] font-bold shadow-md whitespace-nowrap border transition-all ${
                            isSelected
                              ? 'bg-[#D4AF37] text-[#02130D] border-white font-black scale-105'
                              : 'bg-[#021811]/90 text-white border-[#D4AF37]/40 group-hover:border-[#D4AF37]'
                          }`}
                        >
                          {isAr ? lm.nameAr : lm.nameEn}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            /* OpenStreetMap / Satellite Hybrid Frame */
            <div className="relative w-full h-full min-h-[420px] sm:min-h-[480px]">
              <iframe
                title="Sacred Sites Map"
                src={`https://maps.google.com/maps?q=${selectedLandmark ? selectedLandmark.lat : 21.4225},${selectedLandmark ? selectedLandmark.lng : 39.8262}&z=14&output=embed`}
                className="w-full h-full min-h-[420px] border-0 rounded-2xl filter brightness-95 contrast-105"
                loading="lazy"
              />
              <div className="absolute bottom-3 left-3 bg-[#021811]/90 p-2.5 rounded-xl border border-[#D4AF37]/50 text-xs font-bold text-[#D4AF37] shadow-lg">
                <span>📍 {selectedLandmark ? (isAr ? selectedLandmark.nameAr : selectedLandmark.nameEn) : ''}</span>
              </div>
            </div>
          )}

          {/* Map Legend Footer */}
          <div className="bg-[#02130D] border-t border-[#D4AF37]/30 p-3 flex flex-wrap items-center justify-between gap-3 text-[11px] text-[#F8F3E7]/80">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37]" />
                <span>{isAr ? 'المشاعر الرئيسية' : 'Core Sacred Sites'}</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                <span>{isAr ? 'موقعي الحالي' : 'My Position'}</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span>{isAr ? 'المساجد والمواقيت' : 'Mosques & Miqat'}</span>
              </span>
            </div>

            {nearestLandmark.landmark && (
              <div className="text-[#D4AF37] font-bold">
                <span>
                  {isAr
                    ? `أقرب معلَم لموقعك: ${nearestLandmark.landmark.nameAr} (${nearestLandmark.distance} كم)`
                    : `Nearest to you: ${nearestLandmark.landmark.nameEn} (${nearestLandmark.distance} km)`}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Selected Landmark Details Card */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          {selectedLandmark ? (
            <motion.div
              key={selectedLandmark.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-[#03291F] border-2 border-[#D4AF37]/60 rounded-2xl p-5 space-y-4 shadow-xl flex-1 flex flex-col justify-between"
            >
              <div>
                {/* Category & Distance Badge */}
                <div className="flex items-center justify-between gap-2 border-b border-[#D4AF37]/20 pb-3 mb-3">
                  <span className="px-3 py-1 rounded-full bg-[#02130D] border border-[#D4AF37]/60 text-[#D4AF37] text-xs font-bold">
                    {selectedLandmark.category === 'holy_sites'
                      ? isAr ? '🕋 مشعر مقدس رئيسي' : 'Core Sacred Site'
                      : selectedLandmark.category === 'mosques'
                      ? isAr ? '🕌 مسجد ومعلم تاريخي' : 'Mosque'
                      : selectedLandmark.category === 'miqat'
                      ? isAr ? '🚩 ميقات شرعي للإحرام' : 'Miqat Point'
                      : isAr ? '🏥 مرفق خدمات وطوارئ' : 'Emergency & Service'}
                  </span>

                  {currentDistanceKm !== null && (
                    <span className="text-xs font-black text-emerald-300 bg-emerald-950 border border-emerald-500/40 px-2.5 py-1 rounded-xl flex items-center gap-1">
                      <Footprints className="w-3.5 h-3.5" />
                      <span>{currentDistanceKm} {isAr ? 'كم عن موقعك' : 'km away'}</span>
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="text-xl font-black text-white mb-2 leading-tight">
                  {isAr ? selectedLandmark.nameAr : selectedLandmark.nameEn}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-[#F8F3E7]/85 leading-relaxed mb-4">
                  {isAr ? selectedLandmark.descAr : selectedLandmark.descEn}
                </p>

                {/* Rituals Info Box if available */}
                {selectedLandmark.ritualsAr && (
                  <div className="p-3.5 rounded-xl bg-[#01140E] border border-[#D4AF37]/40 space-y-1.5 mb-4">
                    <span className="text-xs font-bold text-[#D4AF37] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>{isAr ? 'المناسك المرتبطة بهذا الموقع:' : 'Associated Rituals:'}</span>
                    </span>
                    <p className="text-xs text-amber-100/90 leading-relaxed">
                      {isAr ? selectedLandmark.ritualsAr : selectedLandmark.ritualsEn}
                    </p>
                  </div>
                )}

                {/* Supplication Dua if available */}
                {selectedLandmark.duaAr && (
                  <div className="p-3.5 rounded-xl bg-[#021f17] border border-amber-500/40 space-y-2 mb-4 text-center">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-[#D4AF37] uppercase">
                        {isAr ? 'الدعاء المستحب:' : 'Recommended Dua:'}
                      </span>
                      <button
                        type="button"
                        onClick={() => handlePlayTTSDua(selectedLandmark.duaAr!)}
                        className="text-xs text-[#D4AF37] hover:text-white flex items-center gap-1 bg-[#02130D] px-2 py-0.5 rounded-lg border border-[#D4AF37]/40 cursor-pointer"
                      >
                        {isPlayingDua ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                        <span>{isPlayingDua ? (isAr ? 'إيقاف' : 'Stop') : (isAr ? 'استماع' : 'Listen')}</span>
                      </button>
                    </div>
                    <p className="text-sm font-serif font-bold text-white leading-loose">
                      {selectedLandmark.duaAr}
                    </p>
                  </div>
                )}

                {/* Tips */}
                {selectedLandmark.tipsAr && selectedLandmark.tipsAr.length > 0 && (
                  <div className="space-y-1.5 mb-4">
                    <span className="text-xs font-bold text-[#D4AF37]">
                      {isAr ? 'إرشادات ونصائح هامة:' : 'Important Tips:'}
                    </span>
                    <ul className="space-y-1 text-xs text-[#F8F3E7]/80">
                      {(isAr ? selectedLandmark.tipsAr : selectedLandmark.tipsEn).map((tip, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-[#D4AF37]/20 flex flex-wrap items-center gap-2">
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${selectedLandmark.lat},${selectedLandmark.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA820A] text-[#02130D] font-black text-xs flex items-center justify-center gap-2 transition-all shadow-md hover:scale-[1.02]"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>{isAr ? 'توجيه الملاحة (Google Maps)' : 'Navigate in Google Maps'}</span>
                </a>

                <button
                  type="button"
                  onClick={() => handleShareLandmark(selectedLandmark)}
                  className="py-2.5 px-3.5 rounded-xl border border-[#D4AF37]/60 bg-[#02130D] hover:bg-[#073D2F] text-[#D4AF37] text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                  title={isAr ? 'مشاركة الموقع' : 'Share Location'}
                >
                  <Share2 className="w-4 h-4" />
                  <span>{isAr ? 'مشاركة' : 'Share'}</span>
                </button>

                {selectedLandmark.phone && (
                  <a
                    href={`tel:${selectedLandmark.phone}`}
                    className="py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all flex items-center gap-1.5"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>{selectedLandmark.phone}</span>
                  </a>
                )}
              </div>
            </motion.div>
          ) : (
            <div className="bg-[#03291F] border border-[#D4AF37]/40 rounded-2xl p-6 text-center text-[#F8F3E7]/60 flex items-center justify-center h-full">
              <span>{isAr ? 'انقر على أي معلم في الخريطة لعرض تفاصيله' : 'Click any landmark on the map to view details'}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
