// Offline Cache Storage Engine for Arafat Platform & Makkah Offline Companion
import { useState, useEffect } from 'react';

export const CACHE_KEYS = {
  RITUALS_COUNTER: 'arafat_rituals_counter',
  JOURNEY_TRACKER: 'arafat_journey_tracker_v1',
  USER_PROFILE: 'arafat_user_profile',
  ATHKAR_STATE: 'arafat_athkar_state',
  HEALTH_LOGS: 'arafat_health_logs',
  PERMITS: 'arafat_permits',
  AUDIO_GUIDES: 'arafat_audio_guides',
  OFFLINE_DUAS_BUNDLE: 'arafat_offline_duas_bundle_v2',
  OFFLINE_MAP_DATA: 'arafat_offline_map_data_v1',
  OFFLINE_PACKAGE_META: 'arafat_offline_package_meta_v2',
  OFFLINE_HAJJ_GUIDES: 'arafat_offline_hajj_guides_v1',
  OFFLINE_EMERGENCY_PROTOCOLS: 'arafat_offline_emergency_protocols_v1',
};

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

export interface OfflineHajjGuide {
  id: string;
  stepNumber: number;
  titleAr: string;
  titleEn: string;
  locationAr: string;
  locationEn: string;
  dateAr: string;
  dateEn: string;
  summaryAr: string;
  summaryEn: string;
  essentialStepsAr: string[];
  essentialStepsEn: string[];
  prohibitionsAndErrorsAr: string[];
  prohibitionsAndErrorsEn: string[];
  emergencyOfflineTipsAr: string[];
  emergencyOfflineTipsEn: string[];
}

export interface OfflineEmergencyProtocol {
  id: string;
  severity: 'critical' | 'high' | 'medium';
  titleAr: string;
  titleEn: string;
  category: 'heat_stroke' | 'stampede_crowd' | 'lost_pilgrim' | 'medical_sos' | 'fire_safety' | 'lost_card';
  categoryAr: string;
  categoryEn: string;
  shortDescAr: string;
  shortDescEn: string;
  emergencyPhone: string;
  triageStepsAr: string[];
  triageStepsEn: string[];
  firstAidActionsAr: string[];
  firstAidActionsEn: string[];
  gpsOfflineAdviceAr: string;
  gpsOfflineAdviceEn: string;
}

export interface OfflineDua {
  id: string;
  titleAr: string;
  titleEn: string;
  textAr: string;
  textEn: string;
  transliteration?: string;
  category:
    | 'ihram'
    | 'tawaf'
    | 'sai'
    | 'arafat'
    | 'muzdalifah'
    | 'mina'
    | 'masjid'
    | 'sabah_massa'
    | 'travel_zamzam'
    | 'custom';
  categoryAr: string;
  sourceAr?: string;
  repeatCount?: number;
  virtueAr?: string;
  isBookmarked?: boolean;
  isCustom?: boolean;
  createdAt?: string;
}

export function saveToCache<T>(key: string, data: T): void {
  try {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(key, JSON.stringify(entry));
  } catch (error) {
    console.warn('Failed to save to localStorage cache:', error);
  }
}

export function getFromCache<T>(key: string, fallback: T): CacheEntry<T> {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      return { data: fallback, timestamp: Date.now() };
    }
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && 'data' in parsed) {
      return parsed as CacheEntry<T>;
    }
    return { data: parsed as T, timestamp: Date.now() };
  } catch (error) {
    console.warn('Failed to read from localStorage cache:', error);
    return { data: fallback, timestamp: Date.now() };
  }
}

export function clearCache(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.warn('Failed to clear cache key:', error);
  }
}

// Service Worker Registration
export function registerServiceWorker(): void {
  if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('[ServiceWorker] Registered successfully with scope:', registration.scope);
        })
        .catch((err) => {
          console.warn('[ServiceWorker] Registration failed:', err);
        });
    });
  }
}

// React Hook for Online / Offline Detection
export function useOnlineStatus(): boolean {
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}

// ============================================================================
// EXPANDED ESSENTIAL OFFLINE SACRED DUAS & ATHKAR BUNDLE (حزمة الأدعية والأذكار)
// ============================================================================
export const ESSENTIAL_OFFLINE_DUAS: OfflineDua[] = [
  // 1. الإحرام والتلبية
  {
    id: 'talbiyah_ihram',
    titleAr: 'التلبية الكبرى وشعار الحج والعمرة',
    titleEn: 'Great Talbiyah & Pilgrimage Chant',
    textAr: 'لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ، لَبَّيْكَ لاَ شَرِيكَ لَكَ لَبَّيْكَ، إِنَّ الْحَمْدَ وَالنِّعْمَةَ لَكَ وَالْمُلْكُ، لاَ شَرِيكَ لَكَ.',
    textEn: 'Here I am, O Allah, here I am. You have no partner, here I am. Indeed all praise, grace and sovereignty belong to You.',
    transliteration: 'Labbayka Allāhumma labbayk, labbayka lā sharīka laka labbayk, innal-ḥamda wan-ni‘mata laka wal-mulk, lā sharīka lak.',
    category: 'ihram',
    categoryAr: 'الإحرام والتلبية',
    sourceAr: 'صحيح البخاري ومسلم',
    repeatCount: 100,
    virtueAr: 'شعار الحج والعمرة الأعظم، يُسنّ رفع الصوت بها للرجال وإسرارها للنساء من لحظة الإحرام من الميقات حتى بدء الطواف أو رمي الجمرة.',
  },
  {
    id: 'ihram_intention_umrah',
    titleAr: 'نية عقد الإحرام للعمرة',
    titleEn: 'Umrah Ihram Intention',
    textAr: 'لَبَّيْكَ اللَّهُمَّ عُمْرَةً. اللَّهُمَّ هَذِهِ عُمْرَةٌ لاَ رِيَاءَ فِيهَا وَلاَ سُمْعَةَ، فَيَسِّرْهَا لِي وَتَقَبَّلْهَا مِنِّي.',
    textEn: 'Here I am, O Allah, for Umrah. O Allah, this is an Umrah free of showing off and reputation, so make it easy for me and accept it.',
    transliteration: 'Labbayka Allāhumma ‘Umrah. Allāhumma hādhihi ‘umratun lā riyā’a fīhā wa lā sum‘ah, fayassirhā lī wa taqabbalhā minnī.',
    category: 'ihram',
    categoryAr: 'الإحرام والتلبية',
    sourceAr: 'سنن ابن ماجه والنسائي',
    repeatCount: 1,
    virtueAr: 'تقال عند الميقات عقب صلاة الفريضة أو السنة وعند الشروع في نية النسك.',
  },
  {
    id: 'ihram_condition',
    titleAr: 'دعاء الاشتراط عند الخوف من العائق',
    titleEn: 'Condition Dua at Ihram',
    textAr: 'اللَّهُمَّ مَحِلِّي حَيْثُ حَبَسْتَنِي.',
    textEn: 'O Allah, my place of desacralization shall be wherever You hold me back.',
    transliteration: 'Allāhumma maḥillī ḥaythu ḥabastanī.',
    category: 'ihram',
    categoryAr: 'الإحرام والتلبية',
    sourceAr: 'صحيح البخاري',
    repeatCount: 1,
    virtueAr: 'يُشرع لمن خاف المرض أو عدم إتمام النسك، فإن حبسه حابس جاز له التحلل دون فدية.',
  },

  // 2. الطواف بالبيت العتيق
  {
    id: 'tawaf_black_stone',
    titleAr: 'التكبير والإشارة عند الحجر الأسود',
    titleEn: 'Black Stone Salute & Takbeer',
    textAr: 'بِسْمِ اللَّهِ وَاللَّهُ أَكْبَرُ، اللَّهُمَّ إِيمَانًا بِكَ وَتَصْدِيقًا بِكِتَابِكَ وَوَفَاءً بِعَهْدِكَ وَاتِّبَاعًا لِسُنَّةِ نَبِيِّكَ مُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ.',
    textEn: 'In the name of Allah, Allah is the Greatest. O Allah, out of faith in You, belief in Your Book, fulfillment of Your covenant, and following the Sunnah of Your Prophet Muhammad (pbuh).',
    transliteration: 'Bismillāhi wallāhu akbar, Allāhumma īmānan bika wa taṣdīqan bikitābika wa wafā’an bi‘ahdika wattibā‘an lisunnati nabiyyika Muḥammad.',
    category: 'tawaf',
    categoryAr: 'طواف البيت',
    sourceAr: 'جامع الترمذي والمصنف',
    repeatCount: 7,
    virtueAr: 'يقال عند محاذاة الحجر الأسود في بداية كل شوط من أشواط الطواف السبعة.',
  },
  {
    id: 'tawaf_yamani_corner',
    titleAr: 'دعاء ما بين الركن اليماني والحجر الأسود',
    titleEn: 'Dua Between Yamani Corner & Black Stone',
    textAr: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ.',
    textEn: 'Our Lord, grant us good in this world and good in the Hereafter and protect us from the punishment of the Fire.',
    transliteration: 'Rabbanā ātinā fid-dunyā ḥasanatan wa fil-ākhirati ḥasanatan wa qinā ‘adhāban-nār.',
    category: 'tawaf',
    categoryAr: 'طواف البيت',
    sourceAr: 'سنن أبي داود',
    repeatCount: 7,
    virtueAr: 'الدعاء المأثور الذي كان يحرص عليه النبي ﷺ بين الركن اليماني والحجر الأسود في كل شوط.',
  },
  {
    id: 'tawaf_multazam_dua',
    titleAr: 'دعاء الملتزم واستلام جدار الكعبة',
    titleEn: 'Multazam Supplication',
    textAr: 'اللَّهُمَّ إِنَّ هَذَا الْبَيْتَ بَيْتُكَ، وَالْحَرَمَ حَرَمُكَ، وَالأَمْنَ أَمْنُكَ، وَهَذَا مَقَامُ الْعَائِذِ بِكَ مِنَ النَّارِ، فَاغْفِرْ لِي وَارْحَمْنِي إِنَّكَ أَنْتَ الْغَفُورُ الرَّحِيمُ.',
    textEn: 'O Allah, this House is Your House, this Sanctuary is Your Sanctuary, and this Safety is Your Safety. Here stands one who seeks Your refuge from the Fire.',
    transliteration: 'Allāhumma inna hādhāl-bayta baytuk, wal-ḥarama ḥaramuk, wal-amna amnuk, wa hādhā maqāmul-‘ā’idhi bika minan-nār.',
    category: 'tawaf',
    categoryAr: 'طواف البيت',
    sourceAr: 'سنن السنن والمأثورات',
    repeatCount: 1,
    virtueAr: 'يستحب الدعاء به عند الملتزم بين الحجر الأسود وباب الكعبة المشرفة.',
  },

  // 3. السعي بين الصفا والمروة
  {
    id: 'sai_safa_start',
    titleAr: 'دعاء البداية على الصفا والبدء بما بدأ الله به',
    titleEn: 'Starting Sa\'i on Safa',
    textAr: 'إِنَّ الصَّفَا وَالْمَرْوَةَ مِن شَعَائِرِ اللَّهِ، أَبْدَأُ بِمَا بَدَأَ اللَّهُ بِهِ. لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ.',
    textEn: 'Indeed, Safa and Marwah are among the symbols of Allah. I begin with that with which Allah began. There is no god but Allah alone with no partner.',
    transliteration: 'Innaṣ-Ṣafā wal-Marwata min sha‘ā’irillāh, abdani bimā bada’allāhu bih.',
    category: 'sai',
    categoryAr: 'السعي بين الصفا والمروة',
    sourceAr: 'صحيح مسلم',
    repeatCount: 3,
    virtueAr: 'تقرأ الآية عند صعود الصفا لأول مرة، ثم يرفع يديه متوجهاً للقبلة ويكبر ويهلل ثلاثاً.',
  },
  {
    id: 'sai_green_lights',
    titleAr: 'دعاء المهرول بين العلمين الأخضرين',
    titleEn: 'Dua Between Green Lights',
    textAr: 'رَبِّ اغْفِرْ وَارْحَمْ، وَتَجَاوَزْ عَمَّا تَعْلَمْ، إِنَّكَ أَنْتَ الأَعَزُّ الأَكْرَمُ.',
    textEn: 'My Lord, forgive and have mercy, and pardon what You know, for You are indeed the Most Mighty, the Most Generous.',
    transliteration: 'Rabbighfir warḥam, wa tajāwaz ‘ammā ta‘lam, innaka antal-A‘azzul-Akram.',
    category: 'sai',
    categoryAr: 'السعي بين الصفا والمروة',
    sourceAr: 'مصنف ابن أبي شيبة عن ابن عمر',
    repeatCount: 7,
    virtueAr: 'يُسن للرجال الإسراع والهرولة بين الميلين الأخضرين في مسار السعي، والجهر بهذا الدعاء.',
  },

  // 4. وقفة عرفات وصعيد الرحمة
  {
    id: 'arafat_supreme_dua',
    titleAr: 'خير الدعاء يوم عرفة المأثور',
    titleEn: 'Supreme Day of Arafat Supplication',
    textAr: 'لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ.',
    textEn: 'There is no god but Allah alone with no partner. To Him belongs sovereignty and praise, and He has power over all things.',
    transliteration: 'Lā ilāha illallāhu waḥdahū lā sharīka lah, lahul-mulku wa lahul-ḥamdu wa huwa ‘alā kulli shay’in qadīr.',
    category: 'arafat',
    categoryAr: 'صعيد عرفات',
    sourceAr: 'جامع الترمذي - الحديث الشريف',
    repeatCount: 100,
    virtueAr: 'خير ما قال النبي ﷺ والنبيون من قبله في عشية يوم عرفة، وهو أعظم أدعية يوم الحج الأكبر.',
  },
  {
    id: 'arafat_praise_forgiveness',
    titleAr: 'دعاء التضرع والاستغفار بصعيد عرفات',
    titleEn: 'Arafat Forgiveness & Mercy Prayer',
    textAr: 'اللَّهُمَّ لَكَ الْحَمْدُ كَالَّذِي نَقُولُ وَخَيْرًا مِمَّا نَقُولُ، اللَّهُمَّ لَكَ صَلاَتِي وَنُسُكِي وَمَحْيَايَ وَمَمَاتِي، وَإِلَيْكَ مَآبِي، وَلَكَ رَبِّ تُرَاثِي، اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ عَذَابِ الْقَبْرِ وَوَسْوَسَةِ الصَّدْرِ وَشَتَاتِ الأَمْرِ.',
    textEn: 'O Allah, to You belongs all praise as we say and better than we say. O Allah, my prayers, my sacrifice, my living, and my dying are all for You.',
    transliteration: 'Allāhumma lakal-ḥamdu kalladhī naqūlu wa khayram-mimmā naqūl...',
    category: 'arafat',
    categoryAr: 'صعيد عرفات',
    sourceAr: 'سنن الترمذي والمأثورات',
    repeatCount: 10,
    virtueAr: 'جامع الخيرات وطلب الرحمة ورفع درجات القبول في موقف عرفة الشريف.',
  },

  // 5. مزدلفة والمشعر الحرام
  {
    id: 'muzdalifah_sacred_site',
    titleAr: 'دعاء المشعر الحرام في مزدلفة',
    titleEn: 'Muzdalifah Sacred Monument Dua',
    textAr: 'فَإِذَا أَفَضْتُم مِّنْ عَرَفَاتٍ فَاذْكُرُوا اللَّهَ عِندَ الْمَشْعَرِ الْحَرَامِ، وَاذْكُرُوهُ كَمَا هَدَاكُمْ وَإِن كُنتُم مِّن قَبْلِهِ لَمِنَ الضَّالِّينَ. اللَّهُمَّ كَمَا وَقَفْتَنَا فِيهِ وَأَرَيْتَنَا إِيَّاهُ فَوَفِّقْنَا لِذِكْرِكَ كَمَا هَدَيْتَنَا.',
    textEn: 'Remember Allah at the Sacred Monument, and remember Him as He guided you. O Allah, as You granted us to stand here, enable us to remember You as You guided us.',
    transliteration: 'Fa’idhā afaḍtum min ‘Arafātin fadhkurullāha ‘indal-Mash‘aril-Ḥarām...',
    category: 'muzdalifah',
    categoryAr: 'مزدلفة والمشعر الحرام',
    sourceAr: 'سورة البقرة وتفسير ابن كثير',
    repeatCount: 3,
    virtueAr: 'يستحب استقبال القبلة عند المشعر الحرام في الفجر والجهر بالتكبير والتهليل والدعاء حتى الإسفار جداً.',
  },

  // 6. منى ورمي الجمرات
  {
    id: 'jamarat_throwing_takbeer',
    titleAr: 'التكبير عند رمي كل حصاة في الجمرات',
    titleEn: 'Jamarat Pebbles Takbeer',
    textAr: 'اللَّهُ أَكْبَرُ، اللَّهُمَّ اجْعَلْهُ حَجًّا مَبْرُورًا وَذَنْبًا مَغْفُورًا وَسَعْيًا مَشْكُورًا.',
    textEn: 'Allah is the Greatest. O Allah, make it an accepted Hajj, a forgiven sin, and an appreciated endeavor.',
    transliteration: 'Allāhu akbar, Allāhummaj‘alhu ḥajjan mabrūran wa dhanbam-maghfūran wa sa‘yam-mashkūrā.',
    category: 'mina',
    categoryAr: 'منى ورمي الجمرات',
    sourceAr: 'صحيح مسلم',
    repeatCount: 21,
    virtueAr: 'يكبر مع كل حصاة يرميها في الجمرة الصغرى والوسطى والعقبة الكبرى.',
  },

  // 7. دخول الحرمين الشريفين والزيارة
  {
    id: 'masjid_haram_enter',
    titleAr: 'دعاء دخول المسجد الحرام ورؤية الكعبة',
    titleEn: 'Entering Sacred Mosque & Kaaba Sight',
    textAr: 'اللَّهُمَّ أَنْتَ السَّلاَمُ وَمِنْكَ السَّلاَمُ، حَيِّنَا رَبَّنَا بِالسَّلاَمِ. اللَّهُمَّ زِدْ هَذَا الْبَيْتَ تَشْرِيفًا وَتَعْظِيمًا وَتَكْرِيمًا وَمَهَابَةً، وَزِدْ مَنْ شَرَّفَهُ وَكَرَّمَهُ مِمَّنْ حَجَّهُ أَوِ اعْتَمَرَه تَشْرِيفًا وَتَكْرِيمًا وَتَعْظِيمًا وَبِرًّا.',
    textEn: 'O Allah, You are Peace and from You is peace. O Allah, increase this House in honor, reverence, and awe.',
    transliteration: 'Allāhumma antas-Salāmu wa minkas-Salām, ḥayyinā Rabbanā bis-Salām...',
    category: 'masjid',
    categoryAr: 'دخول الحرمين والزيارة',
    sourceAr: 'مصنف الشافعي والمأثورات',
    repeatCount: 1,
    virtueAr: 'يقال عند أول نظرة للكعبة المشرفة بدخول صحن الطواف بالمسجد الحرام.',
  },
  {
    id: 'prophet_salutation',
    titleAr: 'السلام على رسول الله ﷺ وبصاحبيه في المدينة',
    titleEn: 'Salutation to the Prophet in Madinah',
    textAr: 'السَّلاَمُ عَلَيْكَ يَا رَسُولَ اللَّهِ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ. السَّلاَمُ عَلَيْكَ يَا نَبِيَّ اللَّهِ وَخِيَرَتَهُ مِنْ خَلْقِهِ. جَزَاكَ اللَّهُ عَنْ أُمَّتِكَ أَفْضَلَ مَا جَزَى نَبِيًّا عَنْ أُمَّتِهِ.',
    textEn: 'Peace be upon you, O Messenger of Allah, and the mercy of Allah and His blessings. May Allah reward you on behalf of your nation with the best reward.',
    transliteration: 'As-salāmu ‘alayka yā Rasūlallāhi wa raḥmatullāhi wa barakātuh...',
    category: 'masjid',
    categoryAr: 'دخول الحرمين والزيارة',
    sourceAr: 'مناسك الإمام النووي وابن تيمية',
    repeatCount: 1,
    virtueAr: 'يقال بخشوع وأدب عند الوقوف أمام الحجرة النبوية الشريفة بالمسجد النبوي.',
  },
  {
    id: 'rawdah_sharifah_dua',
    titleAr: 'دعاء الصلاة في الروضة الشريفة',
    titleEn: 'Rawdah Sharifah Prayer & Supplication',
    textAr: 'اللَّهُمَّ إِنَّ هَذِهِ رَوْضَةٌ مِنْ رِيَاضِ الْجَنَّةِ، فَاكْتُبْ لِي فِيهَا حَظًّا وَنَصِيبًا مِنْ رَحْمَتِكَ، وَاغْفِرْ لِي وَلِوَالِدَيَّ وَلِلْمُؤْمِنِينَ يَوْمَ يَقُومُ الْحِسَابُ.',
    textEn: 'O Allah, this is a garden from the gardens of Paradise. Grant me a share of Your mercy herein and forgive me and my parents.',
    transliteration: 'Allāhumma inna hādhihi rawḍatum-min riyāḍil-jannah...',
    category: 'masjid',
    categoryAr: 'دخول الحرمين والزيارة',
    sourceAr: 'جامع الأحاديث في فضل الروضة',
    repeatCount: 1,
    virtueAr: 'الصلاة والتنفل والدعاء في الروضة الشريفة بين منبر النبي ﷺ وبيته، وهي روضة من رياض الجنة.',
  },

  // 8. أذكار الصباح والمساء واليوم والليل
  {
    id: 'sabah_sayyid_istighfar',
    titleAr: 'سيد الاستغفار (أعظم دعاء التوبة)',
    titleEn: 'Sayyid al-Istighfar (Master of Forgiveness)',
    textAr: 'اللَّهُمَّ أَنْتَ رَبِّي لاَ إِلَهَ إِلاَّ أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لاَ يَغْفِرُ الذُّنُوبَ إِلاَّ أَنْتَ.',
    textEn: 'O Allah, You are my Lord; there is no god but You. You created me and I am Your servant, and I remain faithful to Your covenant and promise as much as I can.',
    transliteration: 'Allāhumma anta Rabbī lā ilāha illā ant, khalaqtanī wa anā ‘abduk...',
    category: 'sabah_massa',
    categoryAr: 'أذكار الصباح والمساء',
    sourceAr: 'صحيح البخاري',
    repeatCount: 1,
    virtueAr: 'من قالها موقناً بها حين يمسي فمات دخل الجنة، وحين يصبح فمات دخل الجنة.',
  },
  {
    id: 'massa_protection_dua',
    titleAr: 'دعاء الحفظ والوقاية من الشرور',
    titleEn: 'Evening Protection Supplication',
    textAr: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ. بِسْمِ اللَّهِ الَّذِي لاَ يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الأَرْضِ وَلاَ فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ.',
    textEn: 'I seek refuge in the perfect words of Allah from the evil of what He created. In the name of Allah, with Whose name nothing can cause harm on earth or in heaven.',
    transliteration: 'A‘ūdhu bikalimātillāhit-tāmmāti min sharri mā khalaq. Bismillāhilladhī lā yaḍurru ma‘asmihī shay’un fil-arḍi wa lā fis-samā’...',
    category: 'sabah_massa',
    categoryAr: 'أذكار الصباح والمساء',
    sourceAr: 'صحيح مسلم وسنن أبي داود',
    repeatCount: 3,
    virtueAr: 'تحفظ المسلم والحاج من كل هامة ولامة وشر طوارق الليل والنهار.',
  },

  // 9. زمزم والسفر والمأكل والمنزل
  {
    id: 'zamzam_water_dua',
    titleAr: 'دعاء الشرب من ماء زمزم المبارك',
    titleEn: 'Drinking Zamzam Water Dua',
    textAr: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا، وَرِزْقًا وَاسِعًا، وَشِفَاءً مِنْ كُلِّ دَاءٍ.',
    textEn: 'O Allah, I ask You for beneficial knowledge, abundant provision, and healing from every illness.',
    transliteration: 'Allāhumma innī as’aluka ‘ilman nāfi‘an, wa rizqan wāsi‘an, wa shifā’an min kulli dā’.',
    category: 'travel_zamzam',
    categoryAr: 'زمزم والسفر والمنزل',
    sourceAr: 'سنن الدارقطني والحاكم',
    repeatCount: 1,
    virtueAr: 'ماء زمزم لما شُرب له، ويستحب شربه شبعاً واستقبال القبلة والتسمية والدعاء بصدق.',
  },
  {
    id: 'travel_riding_dua',
    titleAr: 'دعاء ركوب الحافلة والقطار والسفر',
    titleEn: 'Travel & Vehicle Riding Dua',
    textAr: 'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ، وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ. اللَّهُمَّ إِنَّا نَسْأَلُكَ فِي سَفَرِنَا هَذَا الْبِرَّ وَالتَّقْوَى، وَمِنَ الْعَمَلِ مَا تَرْضَى.',
    textEn: 'Glory be to Him Who has subjected this to us, and we could not have done it by ourselves. Indeed, to our Lord we shall return.',
    transliteration: 'Subḥānalladhī sakhkhara lanā hādhā wa mā kunnā lahū muqrinīn...',
    category: 'travel_zamzam',
    categoryAr: 'زمزم والسفر والمنزل',
    sourceAr: 'صحيح مسلم - سورة الزخرف',
    repeatCount: 1,
    virtueAr: 'يقال عند الانطلاق بين المشاعر أو السفر بين مكة والمدينة وجدة.',
  },
  {
    id: 'hotel_arrival_dua',
    titleAr: 'دعاء نزول الفندق والمنزل بالمشاعر',
    titleEn: 'Hotel & Dwelling Arrival Prayer',
    textAr: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ. رَبِّ أَنْزِلْنِي مُنْزَلاً مُبَارَكًا وَأَنْتَ خَيْرُ الْمُنْزِلِينَ.',
    textEn: 'I seek refuge in the perfect words of Allah from the evil of what He created. My Lord, grant me a blessed landing place, for You are the best of deliverers.',
    transliteration: 'A‘ūdhu bikalimātillāhit-tāmmāti min sharri mā khalaq. Rabbi anzilnī munzalan mubārakan wa anta khayrul-munzilīn.',
    category: 'travel_zamzam',
    categoryAr: 'زمزم والسفر والمنزل',
    sourceAr: 'صحيح مسلم وسورة المؤمنون',
    repeatCount: 1,
    virtueAr: 'من نزل منزلاً أو فندقاً فقالها لم يضره شيء حتى يرتحل منه.',
  },
];

// Essential Offline Map Data (Makkah & Sacred Sites POIs)
export const ESSENTIAL_OFFLINE_MAP_POIS = [
  {
    id: 'kaaba',
    nameAr: 'الكعبة المشرفة والمسجد الحرام',
    nameEn: 'Al-Masjid Al-Haram (Kaaba)',
    type: 'holy_site',
    lat: 21.4225,
    lng: 39.8262,
    descriptionAr: 'قبلة المسلمين ومقر الطواف والسعي وماء زمزم.',
  },
  {
    id: 'arafat_mount',
    nameAr: 'جبل الرحمة وصعيد عرفات',
    nameEn: 'Mount Mercy & Plains of Arafat',
    type: 'holy_site',
    lat: 21.3547,
    lng: 39.9841,
    descriptionAr: 'موقع الوقوف بعرفة ركن الحج الأعظم يوم 9 ذو الحجة.',
  },
  {
    id: 'muzdalifah_site',
    nameAr: 'المشعر الحرام بمزدلفة',
    nameEn: 'Muzdalifah Sacred Site',
    type: 'holy_site',
    lat: 21.3891,
    lng: 39.9328,
    descriptionAr: 'مبيت الحجاج وجمع الحصى عقب الغروب من عرفة.',
  },
  {
    id: 'mina_jamarat',
    nameAr: 'منشأة الجمرات ومشعر منى',
    nameEn: 'Mina Valley & Jamarat Complex',
    type: 'holy_site',
    lat: 21.4133,
    lng: 39.8731,
    descriptionAr: 'مقر رمي الجمرات والمبيت أيام التشريق.',
  },
  {
    id: 'emergency_makkah_1',
    nameAr: 'مستشفى أجياد الطوارئ (بجوار الحرم)',
    nameEn: 'Ajyad Emergency Hospital',
    type: 'medical',
    lat: 21.4201,
    lng: 39.8278,
    phone: '997',
    descriptionAr: 'طوارئ طبية على مدار 24 ساعة بخدمة الحجاج.',
  },
  {
    id: 'emergency_arafat_1',
    nameAr: 'مستشفى جبل الرحمة العام بعرفة',
    nameEn: 'Jabal Al-Rahmah Hospital',
    type: 'medical',
    lat: 21.3552,
    lng: 39.9835,
    phone: '997',
    descriptionAr: 'مركز طبي متكامل بقلب صعيد عرفات.',
  },
];

// ============================================================================
// ESSENTIAL OFFLINE HAJJ GUIDES (دليل مناسك الحج خطوة بخطوة للأوفلاين)
// ============================================================================
export const ESSENTIAL_OFFLINE_HAJJ_GUIDES: OfflineHajjGuide[] = [
  {
    id: 'hajj_step_1_ihram',
    stepNumber: 1,
    titleAr: '1. الإحرام وعقد النية من الميقات',
    titleEn: '1. Ihram & Intention at Miqat',
    locationAr: 'أحد المواقيت المكانية (مثل ذو الحليفة / يلملم / قرن المنازل)',
    locationEn: 'Designated Miqat boundary',
    dateAr: 'بداية رحلة الحج أو العمرة',
    dateEn: 'Start of Pilgrimage Journey',
    summaryAr: 'الاغتسال، ارتداء ملابس الإحرام، التلفظ بالنية والتلبية الكبرى.',
    summaryEn: 'Ghusl, wearing Ihram, stating intention, and chanting Great Talbiyah.',
    essentialStepsAr: [
      'الاغتسال والتطيب في البدن قبل ملابس الإحرام.',
      'ارتداء إزار ورداء أبيضين غير مخيطين للرجال، وملابس سابرة غير محددة للفتنة للنساء.',
      'صلاة ركعتين إن لم تكن هناك فريضة قائمة.',
      'التلفظ بالنية (لبيك اللهم حجاً أو لبيك اللهم عمرة).',
      'الإكثار من التلبية: (لبيك اللهم لبيك، لبيك لا شريك لك لبيك...).',
    ],
    essentialStepsEn: [
      'Perform Ghusl and apply perfume on body before wearing Ihram.',
      'Men wear two unstitched white sheets; women wear modest dress without face-veil or gloves.',
      'Pray 2 Rakaat if no obligatory prayer is due.',
      'State intention verbally: "Labbayka Allahumma Hajj" or "Umrah".',
      'Continuously chant the Talbiyah aloud for men and quietly for women.',
    ],
    prohibitionsAndErrorsAr: [
      'حظر قص الشعر والأظافر واستعمال الطيب بعد النية.',
      'حظر تغطية الرأس للرجال ولبس القفازات والنقاب للنساء.',
      'تجاوز الميقات بدون إحرام يلزم به فدية (دم).',
    ],
    prohibitionsAndErrorsEn: [
      'No cutting hair/nails or using perfume after Ihram intention.',
      'Men must not cover head; women must not wear face-veil or gloves.',
      'Crossing Miqat without Ihram requires a sacrificial Dam.',
    ],
    emergencyOfflineTipsAr: [
      'إذا تجاوزت الميقات ناسياً، احرم فور تذكرك واتصل بمرشد الحملة أو هيئة الفتوى.',
      'احفظ رقم خيمتك ومجموعة إحرامك في الذاكرة المحفوظة أوفلاين.',
    ],
    emergencyOfflineTipsEn: [
      'If you crossed Miqat by mistake, enter Ihram immediately once remembered.',
      'Keep your tent group number saved offline in your phone memory.',
    ],
  },
  {
    id: 'hajj_step_2_tarwiyah',
    stepNumber: 2,
    titleAr: '2. يوم التروية بمشعر منى (8 ذو الحجة)',
    titleEn: '2. Day of Tarwiyah in Mina (8th Dhul-Hijjah)',
    locationAr: 'مخيمات مشعر منى',
    locationEn: 'Mina Valley Tents',
    dateAr: '8 ذو الحجة (صباحاً حتى فجر 9 ذو الحجة)',
    dateEn: '8th Dhul-Hijjah (Morning to 9th Dawn)',
    summaryAr: 'التوجه لمنى، صلاة الظهر والعصر والمغرب والعشاء وفجر 9 ذو الحجة قصراً بلا جمع.',
    summaryEn: 'Move to Mina, pray Dhuhr, Asr, Maghrib, Isha & Fajr shortened, not combined.',
    essentialStepsAr: [
      'الخروج من مكة إلى منى ضحى يوم 8 ذو الحجة بالحافلات أو مشياً.',
      'أداء الصلوات الخمس قصراً (الظهر 2، العصر 2، العشاء 2) كل صلاة في وقتها بدون جمع.',
      'المبيت بمنى ليلة التاسع سنة مؤكدة عن النبي ﷺ.',
      'التزود بالماء والأذكار والاستعداد للانطلاق إلى عرفات.',
    ],
    essentialStepsEn: [
      'Move from Makkah to Mina in the morning of 8th Dhul-Hijjah.',
      'Pray prayers shortened (2 Rakaat for Dhuhr, Asr, Isha) at their specified times.',
      'Overnight stay in Mina is a confirmed Sunnah.',
      'Hydrate and prepare mentally for the Day of Arafat.',
    ],
    prohibitionsAndErrorsAr: [
      'الاندفاع والزحام الشديد عند أبواب المخيمات.',
      'جمع الصلوات دون حاجة؛ السنة القصْر فقط بدون جمع.',
    ],
    prohibitionsAndErrorsEn: [
      'Avoid rushing at tent entrances.',
      'Do not combine prayers unnecessarily; the Sunnah is shortening only.',
    ],
    emergencyOfflineTipsAr: [
      'احفظ موقع خيمتك بميزة تحديد الموقع أوفلاين لتسهيل العودة لمنى.',
      'احمل شاحناً متنقلاً (Powerbank) ومظلة شمسية وقنينة ماء.',
    ],
    emergencyOfflineTipsEn: [
      'Pin your tent position using offline GPS locator.',
      'Carry a power bank, umbrella, and water bottle at all times.',
    ],
  },
  {
    id: 'hajj_step_3_arafat',
    stepNumber: 3,
    titleAr: '3. الوقوف بصعيد عرفات (9 ذو الحجة - الركن الأعظم)',
    titleEn: '3. Day of Arafat (9th Dhul-Hijjah - Greatest Pillar)',
    locationAr: 'صعيد عرفات وجبل الرحمة ومسجد نمرة',
    locationEn: 'Plains of Arafat & Mount Mercy',
    dateAr: '9 ذو الحجة (من الزوال حتى غروب الشمس)',
    dateEn: '9th Dhul-Hijjah (Noon to Sunset)',
    summaryAr: 'الركن الأعظم للحج، التضرع والدعاء والاستغفار بين الزوال والغروب.',
    summaryEn: 'The core pillar of Hajj. Continuous prayer, supplication, & repentance.',
    essentialStepsAr: [
      'التوجه من منى إلى عرفات بعد شروق شمس يوم 9 ذو الحجة.',
      'أداء صلاتي الظهر والعصر جمع تقديم وقصراً بأذان وإقامتين في وقت الظهر.',
      'التأكد التام من التواجد داخل حدود عرفات الشرعية المحددة باللوحات الأشرطة الصفراء.',
      'الاجتهاد في الدعاء والتضرع والتلبية حتى غروب الشمس.',
    ],
    essentialStepsEn: [
      'Move to Arafat after sunrise on 9th Dhul-Hijjah.',
      'Pray Dhuhr & Asr combined and shortened during Dhuhr time.',
      'Ensure you are firmly inside the yellow Arafat boundary markers.',
      'Engage continuously in Dua, Istighfar, and Quran until sunset.',
    ],
    prohibitionsAndErrorsAr: [
      'مغادرة عرفات قبل غروب الشمس يلزم منها دم.',
      'صعود جبل الرحمة ليس شرطاً للحج وتكلفه يسبب الإجهاد الحراري.',
      'استقبال جبل الرحمة أثناء الدعاء؛ السنة استقبال القبلة.',
    ],
    prohibitionsAndErrorsEn: [
      'Leaving Arafat before sunset invalidates timing and requires Dam.',
      'Climbing Mount Mercy is NOT mandatory; avoid heat exhaustion.',
      'Face Qibla during Dua, not the mountain.',
    ],
    emergencyOfflineTipsAr: [
      'في حالات الإجهاد الحراري، استخدم بخاخات الماء البارد واجلس تحت المكيفات.',
      'شرب لا يقل عن 3 ليترات من السوائل للوقاية من الجفاف أوفلاين.',
    ],
    emergencyOfflineTipsEn: [
      'Use water sprays and stay in air-conditioned tents to combat heat.',
      'Drink at least 3 liters of fluids to prevent dehydration.',
    ],
  },
  {
    id: 'hajj_step_4_muzdalifah',
    stepNumber: 4,
    titleAr: '4. المبيت بمزدلفة والمشعر الحرام',
    titleEn: '4. Muzdalifah Overnight & Sacred Monument',
    locationAr: 'مشعر مزدلفة',
    locationEn: 'Muzdalifah Sacred Grounds',
    dateAr: 'ليلة 10 ذو الحجة (عقب غروب شمس عرفة)',
    dateEn: 'Night of 10th Dhul-Hijjah (After Arafat Sunset)',
    summaryAr: 'النفرة من عرفة، صلاة المغرب والعشاء جمع تأخير، المبيت وجمع الحصى.',
    summaryEn: 'Depart from Arafat, pray Maghrib & Isha combined, sleep, collect pebbles.',
    essentialStepsAr: [
      'الانطلاق بسكينة من عرفات إلى مزدلفة بعيد غروب الشمس.',
      'صلاة المغرب ثلاثاً والعشاء ركعتين جمع تأخير بأذان وإقامتين فور الوصول.',
      'المبيت بمزدلفة حتى صلاة الفجر (ويجوز للضعفاء وكبار السن الدفع بعد منتصف الليل).',
      'جمع 7 حصيات لجمرة العقبة (وحصى أيام التشريق 49 أو 70).',
    ],
    essentialStepsEn: [
      'Proceed peacefully to Muzdalifah after sunset.',
      'Pray Maghrib (3) and Isha (2) combined upon arrival.',
      'Overnight stay until Fajr (elderly & weak may depart after midnight).',
      'Collect small pea-sized pebbles for Jamarat.',
    ],
    prohibitionsAndErrorsAr: [
      'أداء المغرب والعشاء في عرفة قبل الانطلاق؛ الواجب أداؤهما بمزدلفة.',
      'غسل الحصى بالماء؛ لم يثبت بالسنّة.',
    ],
    prohibitionsAndErrorsEn: [
      'Do not pray Maghrib/Isha in Arafat before leaving.',
      'Washing pebbles with water is not required by Sunnah.',
    ],
    emergencyOfflineTipsAr: [
      'استخدم الإضاءة الكاشفة بمسار السير، والتزم بالسير بمجاميع.',
      'احفظ الحصيات في صرة أو علبة بلاستيكية صغيرة.',
    ],
    emergencyOfflineTipsEn: [
      'Use flashlights along walking path and stay with group.',
      'Store pebbles in a small pouch or bottle.',
    ],
  },
  {
    id: 'hajj_step_5_nahr_jamarat',
    stepNumber: 5,
    titleAr: '5. يوم النحر: رمي جمرة العقبة، الهدي، والحلق (10 ذو الحجة)',
    titleEn: '5. Day of Sacrifice: Jamarat Al-Aqaba & Halq (10th Dhul-Hijjah)',
    locationAr: 'منشأة الجمرات بمنى ومسالخ الهدي',
    locationEn: 'Jamarat Complex in Mina',
    dateAr: '10 ذو الحجة (يوم عيد الأضحى المبارك)',
    dateEn: '10th Dhul-Hijjah (Eid Al-Adha)',
    summaryAr: 'رمي جمرة العقبة الكبرى بـ 7 حصيات، ذبح الهدي، الحلق أو التقصير، والتحلل الأصغر.',
    summaryEn: 'Pelt Jamarat Al-Aqaba (7 pebbles), sacrifice Hady, shave/trim hair, 1st desacralization.',
    essentialStepsAr: [
      'التوجه من مزدلفة لمنى ورمي جمرة العقبة الكبرى بـ 7 حصيات متعاقبات مع التكبير مع كل حصاة.',
      'نحر الهدي (للمتمتع والقارن).',
      'الحلق الكامل للرجال (وهو الأفضل) أو التقصير، والتقصير فقط للنساء بقدر أنملة.',
      'التحلل الأول (الأصغر): يحل به كل شيء حرم بالإحرام إلا النساء.',
    ],
    essentialStepsEn: [
      'Throw 7 pebbles one by one at Jamarat Al-Aqaba with Takbeer.',
      'Sacrifice the Hady sheep/camel (for Tamattu & Qiran).',
      'Men shave or shorten hair; women trim hair length of a fingertip.',
      'First Tahallul achieved: all Ihram restrictions lifted except marital relations.',
    ],
    prohibitionsAndErrorsAr: [
      'رمي الحجارة الكبيرة أو الأحذية.',
      'الرمي في أوقات الذروة الشديدة لتجنب الازدحام والتدافع.',
    ],
    prohibitionsAndErrorsEn: [
      'Do not throw large rocks or personal items.',
      'Avoid peak hours to prevent stampedes.',
    ],
    emergencyOfflineTipsAr: [
      'التزم بالمسارات التفويجية المحددة من وزارة الحج.',
      'استخدم بطاقة الهدي الإلكترونية المعتمدة.',
    ],
    emergencyOfflineTipsEn: [
      'Follow official crowd management corridors.',
      'Use authorized digital Hady vouchers.',
    ],
  },
  {
    id: 'hajj_step_6_ifadah_sai',
    stepNumber: 6,
    titleAr: '6. طواف الإفاضة وسعي الحج بالبيت الحرام',
    titleEn: '6. Tawaf Al-Ifadah & Hajj Sa\'i at Kaaba',
    locationAr: 'المسجد الحرام بمكة المكرمة',
    locationEn: 'Grand Mosque (Makkah)',
    dateAr: '10 ذو الحجة أو أيام التشريق',
    dateEn: '10th Dhul-Hijjah or Tashreeq Days',
    summaryAr: 'أداء طواف الإفاضة (ركن الحج) بـ 7 أشواط ثم سعي الحج والتحلل الأكبر.',
    summaryEn: '7 Tawaf circuits around Kaaba, 2 Rakaat, 7 Sa\'i laps. Complete desacralization.',
    essentialStepsAr: [
      'التوجه للمسجد الحرام وأداء طواف الإفاضة 7 أشواط بدءاً من الحجر الأسود.',
      'صلاة ركعتين خلف مقام إبراهيم والشرب من ماء زمزم.',
      'أداء سعي الحج 7 أشواط بين الصفا والمروة.',
      'التحلل الثاني (الأكبر): يحل به كل شيء بما في ذلك النساء.',
    ],
    essentialStepsEn: [
      'Perform Tawaf Al-Ifadah (7 circuits) starting at Black Stone.',
      'Pray 2 Rakaat behind Maqam Ibrahim and drink Zamzam.',
      'Perform 7 Sa\'i laps between Safa & Marwah.',
      'Final Tahallul achieved: all prohibitions fully lifted.',
    ],
    prohibitionsAndErrorsAr: [
      'الطواف بدون طهارة ووضوء.',
      'تزاحم الطواف بالصحن الأرضي في حال الزحام؛ يفضل الأدوار العليا.',
    ],
    prohibitionsAndErrorsEn: [
      'Tawaf requires ritual purity (Wudu).',
      'Use upper floors if Mataf ground floor is crowded.',
    ],
    emergencyOfflineTipsAr: [
      'في حالة الزحام، الطواف في التوسعة السعودية الثالثة أكثر ملاءمة لكبار السن.',
      'احفظ العداد التفاعلي بالطواف أوفلاين في التطبيق.',
    ],
    emergencyOfflineTipsEn: [
      'Use 3rd Saudi Expansion for spacious Tawaf for elders.',
      'Keep offline live Tawaf counter active on your phone.',
    ],
  },
  {
    id: 'hajj_step_7_tashreeq_wadaa',
    stepNumber: 7,
    titleAr: '7. أيام التشريق بمنى وطواف الوداع',
    titleEn: '7. Days of Tashreeq & Farewell Tawaf',
    locationAr: 'مشعر منى والبيت الحرام',
    locationEn: 'Mina Tents & Grand Mosque',
    dateAr: '11، 12، و13 ذو الحجة',
    dateEn: '11th, 12th, & 13th Dhul-Hijjah',
    summaryAr: 'المبيت بمنى، رمي الجمرات الثلاث بعد الزوال، وطواف الوداع قبل مغادرة مكة.',
    summaryEn: 'Overnight in Mina, pelt 3 Jamarat each day after Zawal, Farewell Tawaf.',
    essentialStepsAr: [
      'المبيت بمنى ليالي 11 و 12 (وليلة 13 للمتأخر).',
      'رمي الجمرات الثلاث (الصغرى، الوسطى، والعقبة الكبرى) بـ 7 حصيات لكل منها بعد زوال الشمس.',
      'التعجل يجوز في اليوم 12 بشرط مغادرة منى قبل الغروب.',
      'أداء طواف الوداع 7 أشواط قبل المغادرة النهائية لمكة المكرمة.',
    ],
    essentialStepsEn: [
      'Stay overnight in Mina on nights of 11 & 12 (and 13 if remaining).',
      'Pelt all 3 Jamarat (Small, Middle, Big) with 7 pebbles each after Zawal.',
      'Leaving early on 12th is allowed if departing Mina before sunset.',
      'Perform 7 circuits Farewell Tawaf right before final departure from Makkah.',
    ],
    prohibitionsAndErrorsAr: [
      'الرمي قبل زوال الشمس في أيام التشريق.',
      'السفر والمغادرة من مكة دون طواف الوداع (إلا للحائض والنفساء).',
    ],
    prohibitionsAndErrorsEn: [
      'Do not pelt Jamarat before Zawal time.',
      'Do not leave Makkah without Tawaf Al-Wadaa (except menstruating women).',
    ],
    emergencyOfflineTipsAr: [
      'تأكد من تأكيد حافلاتك ونقاط التجمع قبل التوجه للوداع.',
      'طواف الوداع هو آخر عهد الحاج بالبيت الحرام.',
    ],
    emergencyOfflineTipsEn: [
      'Confirm bus transport before heading for Farewell Tawaf.',
      'Farewell Tawaf is the pilgrim\'s final act in Makkah.',
    ],
  },
];

// ============================================================================
// ESSENTIAL OFFLINE EMERGENCY PROTOCOLS (بروتوكولات الطوارئ والسلامة للأوفلاين)
// ============================================================================
export const ESSENTIAL_OFFLINE_EMERGENCY_PROTOCOLS: OfflineEmergencyProtocol[] = [
  {
    id: 'protocol_heat_stroke',
    severity: 'critical',
    titleAr: 'بروتوكول التعامل مع ضربات الشمس والإجهاد الحراري',
    titleEn: 'Heat Stroke & Heat Exhaustion Response Protocol',
    category: 'heat_stroke',
    categoryAr: 'الإجهاد الحراري والطوارئ الطبية',
    categoryEn: 'Heat Exhaustion & Medical',
    shortDescAr: 'خطوات إسناد فورية للمصاب بالدوار والدوخة والارتفاع الحاد لحرارة الجسم تحت الشمس.',
    shortDescEn: 'Immediate triage for heat exhaustion, high fever, dizziness under sunlight.',
    emergencyPhone: '997',
    triageStepsAr: [
      '1. نقل المصاب فوراً إلى مكان مظلل، مكيف، أو بارد بعيداً عن أشعة الشمس المباشرة.',
      '2. خلع ملابس الإحرام الإضافية وتخفيف الملابس لتهوية الجسم.',
      '3. سكب الماء البارد على الرأس، العنق، الإبطين، والفخذين مع استخدام بخاخات المروحة.',
      '4. إعطاء المصاب محلول إملاح الجفاف أو ماء مع قليل من الملح إذا كان واعياً وتجنب إجباره على الشرب إن كان يغمى عليه.',
      '5. الاتصال بالهلال الأحمر السعودي 997 أو إبلاغ أقرب فرقة طبية متجولة بالمركبات الكهربائية.',
    ],
    triageStepsEn: [
      '1. Move person immediately into shaded or air-conditioned area.',
      '2. Loosen Ihram garments and ensure max airflow.',
      '3. Pour cool water over head, neck, armpits, & thighs.',
      '4. Provide oral rehydration fluids if conscious; do NOT pour liquid down an unconscious person.',
      '5. Call Saudi Red Crescent 997 or flag nearest medical golf cart.',
    ],
    firstAidActionsAr: [
      'رفع قدمي المصاب 30 سم لأعلى لتحسين التروية الدموية للمخ.',
      'وضع كمدات ثلجية أو قماش مبلل بالماء على جانبي الرقبة تحت الإبط.',
    ],
    firstAidActionsEn: [
      'Elevate legs 30 cm to improve cerebral blood circulation.',
      'Apply wet cold towels to neck and armpits.',
    ],
    gpsOfflineAdviceAr: 'ابحث في الخريطة أوفلاين عن أقرب مركز صحي أو مستشفى ميداني بمنى أو عرفات.',
    gpsOfflineAdviceEn: 'Search offline map for nearest field hospital or Red Crescent station.',
  },
  {
    id: 'protocol_stampede_crowd',
    severity: 'critical',
    titleAr: 'بروتوكول السلامة أثناء ازدحام الحشود والتدافع',
    titleEn: 'Stampede & High-Density Crowd Safety Protocol',
    category: 'stampede_crowd',
    categoryAr: 'إدارة الحشود والتدافع',
    categoryEn: 'Crowd & Stampede Safety',
    shortDescAr: 'تعليمات حماية الصدر والبقاء واقفاً والتحرك الهادئ مع اتجاه التدفق عند الزحام.',
    shortDescEn: 'Protecting chest cavity, staying upright, and moving with density flow.',
    emergencyPhone: '911',
    triageStepsAr: [
      '1. حافظ على هدوئك وتجنب الصراخ أو مقاومة تدفق الحشد بالقوة.',
      '2. ارفع ذراعيك ومرفقيك أمام صدرك (موقف الملاكم Boxer Stance) لخلق مساحة تنفس لحماية القفص الصدري.',
      '3. تحرك بالكامل مع مسار الحشد ولا تتوقف إطلاقاً أو تجلس على الأرض.',
      '4. لا تنحني أبداً لالتقاط أشيائك المفقودة (نظارة، هاتف، نعل) لتجنب السقوط.',
      '5. اتجه بالتدريج وبشكل قطري (منحرف) نحو أطراف الحشد وأعمدة الجسور أو منافذ الطوارئ.',
    ],
    triageStepsEn: [
      '1. Stay calm and never push against the crowd flow.',
      '2. Raise arms & elbows in front of chest (boxer stance) to preserve breathing space.',
      '3. Keep moving with crowd momentum; never sit or stop.',
      '4. NEVER bend down to pick dropped personal belongings.',
      '5. Move diagonally towards outer edges, exits, or structural pillars.',
    ],
    firstAidActionsAr: [
      'إذا سقط أحد بجوارك، ساعده فوراً على النهوض بسحبه من اليدين.',
      'إذا سقطت أنت، اتكئ على جفنك الأيسر واحم رأسك ووجهك بيديك حتى يتاح لك النهوض.',
    ],
    firstAidActionsEn: [
      'If someone falls next to you, pull them up immediately.',
      'If you fall, curl into a ball protecting your head until you can stand.',
    ],
    gpsOfflineAdviceAr: 'استخدم الخريطة أوفلاين للتعرف على الطرق البديلة والأقل زحاماً حول جسر الجمرات.',
    gpsOfflineAdviceEn: 'Check offline map for secondary bypass streets around Jamarat complex.',
  },
  {
    id: 'protocol_lost_pilgrim',
    severity: 'high',
    titleAr: 'بروتوكول التعامل عند فقدان الحاج أو الضياع في المشاعر',
    titleEn: 'Lost Pilgrim & Lost Camp Emergency Protocol',
    category: 'lost_pilgrim',
    categoryAr: 'إرشاد التائهين ومتابعة المخيمات',
    categoryEn: 'Lost Pilgrim & Guidance',
    shortDescAr: 'إجراءات الوصول الفوري للخيمة عبر رقم المخيم واللوحات الإرشادية وبطاقة نسك.',
    shortDescEn: 'Step-by-step guidance to locate your tent using Nusuk card & landmark poles.',
    emergencyPhone: '936',
    triageStepsAr: [
      '1. التوقف عند أول نقطة إرشاد رئيسية أو مركز كشافة لإرشاد التائهين (تنتشر بالمشاعر).',
      '2. إبراز إسوارة المعصم أو بطاقة "نسك" الذكية التي تحتوي على رقم المخيم والشارع.',
      '3. استخدام ميزة "تحديد موقع خيمتي المخزنة" في منصة عرفات أوفلاين بدون إنترنت.',
      '4. التعرف على الشوارع الرئيسية بمنى (شارع 50، 100، 200) ورقم الجسر القريب.',
      '5. الاتصال برقم مركز إرشاد التائهين وزارة الحج والعمرة 936 أو مشاطرة الموقع.',
    ],
    triageStepsEn: [
      '1. Stop at the nearest Scout Lost Pilgrim Center or security checkpoint.',
      '2. Show your physical wristband or digital Nusuk QR card.',
      '3. Open Arafat Platform Offline Map to locate saved tent position without internet.',
      '4. Identify major Mina road numbers (Street 50, 100, 200, 500).',
      '5. Contact Ministry of Hajj Lost & Found Line: 936.',
    ],
    firstAidActionsAr: [
      'حافظ على هدوئك واجلس في ظل مركز الإرشاد وتناول قنينة ماء.',
      'ارسل رسالة نصية SMS برقم الشارع ورقم العمود المحيط لمشرف حملتك.',
    ],
    firstAidActionsEn: [
      'Stay seated in shade at guidance center with water.',
      'Send SMS with street number and nearest pole code to camp leader.',
    ],
    gpsOfflineAdviceAr: 'تتيح منصة عرفات تحديد موقع خيمتك وتوجيهك بدون أي اتصال بالإنترنت.',
    gpsOfflineAdviceEn: 'Arafat Platform offline GPS compass leads you straight back to your tent.',
  },
  {
    id: 'protocol_cardiac_sos',
    severity: 'critical',
    titleAr: 'بروتوكول الطوارئ الطبية والنوبات القلبية',
    titleEn: 'Severe Medical Emergency & Cardiac SOS Protocol',
    category: 'medical_sos',
    categoryAr: 'الطوارئ الطبية العاجلة 997',
    categoryEn: 'Medical SOS 997',
    shortDescAr: 'خطوات التعامل مع آلام الصدر الحادة، توقف التنفس، والإغماء المفاجئ.',
    shortDescEn: 'Emergency protocol for acute chest pain, unconsciousness, & cardiac arrest.',
    emergencyPhone: '997',
    triageStepsAr: [
      '1. الاتصال الفوري بالإسعاف 997 وتحديد موقعك الدقيق (رقم البوابة / الشارع / المحطة).',
      '2. إجلاس المصاب نصف مستلقٍ ومنع الحركة أو المجهود عنه تماماً.',
      '3. فتح الملابس حول العنق والصدر لضمان وصول الهواء النقي.',
      '4. إذا توقف التنفس والنبض، البدء بالإنعاش القلبي الرئوي CPR (30 ضغطة صدريّة مقابل نفختين).',
      '5. التلويح لمركبات الإسعاف الكهربائية الصغيرة التابعة للهلال الأحمر بالمشاعر.',
    ],
    triageStepsEn: [
      '1. Call 997 immediately, state clear location (Gate/Street/Train station #).',
      '2. Keep patient in semi-reclined resting position; forbid movement.',
      '3. Loosen clothing around neck & chest for air circulation.',
      '4. If pulse/breathing stops, start CPR (30 chest compressions : 2 breaths).',
      '5. Flag down nearby Red Crescent electric emergency vehicles.',
    ],
    firstAidActionsAr: [
      'إذا كان المصاب يتناول أدوية الذبحة الصدرية (مثل نتروجليسرين تحت اللسان)، ساعده على تناولها.',
      'افسح المجال حول المصاب ولا تدع الجمهور يتجمهر حوله.',
    ],
    firstAidActionsEn: [
      'Assist patient with prescribed emergency angina pills if available.',
      'Disperse surrounding crowd to maximize fresh air.',
    ],
    gpsOfflineAdviceAr: 'اعثر على أقرب مستشفى طوارئ أوفلاين (مستشفى أجياد، مستشفى جبل الرحمة، مستشفى منى الوادي).',
    gpsOfflineAdviceEn: 'Locate nearest emergency hospital on offline map (Ajyad, Jabal Al-Rahmah, Mina Valley).',
  },
  {
    id: 'protocol_fire_safety',
    severity: 'critical',
    titleAr: 'بروتوكول التعامل مع الحرائق والتسربات في المخيمات',
    titleEn: 'Tent Fire & Electrical Hazard Emergency Protocol',
    category: 'fire_safety',
    categoryAr: 'الدفاع المدني والسلامة 998',
    categoryEn: 'Civil Defense 998',
    shortDescAr: 'خطوات الإخلاء السريع ومقاطعة الإخلاء الآمنة والدفاع المدني.',
    shortDescEn: 'Rapid tent evacuation, cut-open emergency tent exits, & Civil Defense.',
    emergencyPhone: '998',
    triageStepsAr: [
      '1. الاتصال الفوري بالدفاع المدني 998 والتكبير بصوت عالٍ للتنبيه.',
      '2. في حال انسداد باب الخيمة، استخدم مقاطع الإخلاء الطارئة بالخيام المطاطية أو شق قماش الخيمة.',
      '3. الانحناء أسفل مستوى الدخان وتنفس الهواء بالقرب من الأرض.',
      '4. وضع قماش مبلل بالماء على الفم والأنف لمنع استنشاق الغازات السامة.',
      '5. التوجه فوراً لنقطة التجمع والإخلاء المحددة بمخيمك (Assembly Point).',
    ],
    triageStepsEn: [
      '1. Call Civil Defense 998 immediately & shout warning to nearby pilgrims.',
      '2. Use tent emergency velcro cuts or slit canvas if doors are blocked.',
      '3. Crawl low beneath smoke level.',
      '4. Cover nose and mouth with wet cloth.',
      '5. Head straight to your camp designated Emergency Assembly Point.',
    ],
    firstAidActionsAr: [
      'لا ترجع للخيمة إطلاقاً لالتقاط حقائبك.',
      'تأكد من سلامة كبار السن والأطفال في مجموعتك.',
    ],
    firstAidActionsEn: [
      'Never re-enter a burning tent for luggage.',
      'Escort elderly group members to safety.',
    ],
    gpsOfflineAdviceAr: 'مخيمات منى مصنعة من أقمشة مقاومة للحريق، اتبع ممرات الإخلاء العريضة الموضحة أوفلاين.',
    gpsOfflineAdviceEn: 'Mina tents are fire-resistant; follow wide evacuation corridors in offline map.',
  },
  {
    id: 'protocol_lost_card',
    severity: 'medium',
    titleAr: 'بروتوكول فقدان بطاقة نسك أو تصريح الحج',
    titleEn: 'Lost Nusuk Card & Digital Permit Emergency Protocol',
    category: 'lost_card',
    categoryAr: 'خدمة الحجاج ورعايتهم 1966',
    categoryEn: 'Pilgrim Care 1966',
    shortDescAr: 'إجراءات إبراز النسخة الرقمية أوفلاين والوصول لمكاتب وزارة الحج.',
    shortDescEn: 'Presenting digital offline permit & reporting to Ministry of Hajj desks.',
    emergencyPhone: '1966',
    triageStepsAr: [
      '1. فتح تبويب "تصاريحي ووثائقي" في منصة عرفات المحفوظة أوفلاين بذاكرة الجهاز.',
      '2. إبراز رمز QR الرقمي وصورة جواز السفر أو الهوية الوطنية لرجال الأمن.',
      '3. مراجعة مكتب وزارة الحج والعمرة بالمشعر أو رئيس البعثة لإصدار بديل فوري.',
      '4. الاتصال برقم خدمة ضيوف الرحمن الموحد 1966.',
    ],
    triageStepsEn: [
      '1. Open "My Permits" tab in Arafat Platform saved offline on your phone.',
      '2. Show offline QR code or photo ID to security personnel.',
      '3. Visit nearest Ministry of Hajj tent center for instant replacement.',
      '4. Call Pilgrim Unified Support: 1966.',
    ],
    firstAidActionsAr: [
      'احتفظ دائماً بصورة ضوئية من جواز السفر وبطاقة نسك في استوديو الهاتف.',
      'أبلغ مرشد المجموعة لتقييد البلاغ رسمياً.',
    ],
    firstAidActionsEn: [
      'Keep a saved photo of passport and Nusuk card in phone gallery.',
      'Inform group leader to log official report.',
    ],
    gpsOfflineAdviceAr: 'تتيح منصة عرفات عرض جميع التصاريح والهويات محلياً 100% بدون إنترنت.',
    gpsOfflineAdviceEn: 'Arafat Platform renders all permits & IDs 100% offline from local storage.',
  },
];

// ============================================================================
// HELPER METHODS FOR OFFLINE STORAGE MANAGEMENT
// ============================================================================

export function getOfflineDuasBundle(): OfflineDua[] {
  const cached = getFromCache<OfflineDua[]>(CACHE_KEYS.OFFLINE_DUAS_BUNDLE, ESSENTIAL_OFFLINE_DUAS);
  if (!cached.data || cached.data.length === 0) {
    saveToCache(CACHE_KEYS.OFFLINE_DUAS_BUNDLE, ESSENTIAL_OFFLINE_DUAS);
    return ESSENTIAL_OFFLINE_DUAS;
  }
  return cached.data;
}

export function saveOfflineDuasBundle(duas: OfflineDua[]): void {
  saveToCache(CACHE_KEYS.OFFLINE_DUAS_BUNDLE, duas);
}

export function getOfflineHajjGuides(): OfflineHajjGuide[] {
  const cached = getFromCache<OfflineHajjGuide[]>(CACHE_KEYS.OFFLINE_HAJJ_GUIDES, ESSENTIAL_OFFLINE_HAJJ_GUIDES);
  if (!cached.data || cached.data.length === 0) {
    saveToCache(CACHE_KEYS.OFFLINE_HAJJ_GUIDES, ESSENTIAL_OFFLINE_HAJJ_GUIDES);
    return ESSENTIAL_OFFLINE_HAJJ_GUIDES;
  }
  return cached.data;
}

export function saveOfflineHajjGuides(guides: OfflineHajjGuide[]): void {
  saveToCache(CACHE_KEYS.OFFLINE_HAJJ_GUIDES, guides);
}

export function getOfflineEmergencyProtocols(): OfflineEmergencyProtocol[] {
  const cached = getFromCache<OfflineEmergencyProtocol[]>(CACHE_KEYS.OFFLINE_EMERGENCY_PROTOCOLS, ESSENTIAL_OFFLINE_EMERGENCY_PROTOCOLS);
  if (!cached.data || cached.data.length === 0) {
    saveToCache(CACHE_KEYS.OFFLINE_EMERGENCY_PROTOCOLS, ESSENTIAL_OFFLINE_EMERGENCY_PROTOCOLS);
    return ESSENTIAL_OFFLINE_EMERGENCY_PROTOCOLS;
  }
  return cached.data;
}

export function saveOfflineEmergencyProtocols(protocols: OfflineEmergencyProtocol[]): void {
  saveToCache(CACHE_KEYS.OFFLINE_EMERGENCY_PROTOCOLS, protocols);
}

export function toggleBookmarkOfflineDua(duaId: string): OfflineDua[] {
  const bundle = getOfflineDuasBundle();
  const updated = bundle.map((item) => {
    if (item.id === duaId) {
      return { ...item, isBookmarked: !item.isBookmarked };
    }
    return item;
  });
  saveOfflineDuasBundle(updated);
  return updated;
}

export function addCustomOfflineDua(
  newDua: Omit<OfflineDua, 'id' | 'isCustom' | 'createdAt'>
): OfflineDua[] {
  const bundle = getOfflineDuasBundle();
  const customItem: OfflineDua = {
    ...newDua,
    id: `custom_dua_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    isCustom: true,
    createdAt: new Date().toISOString(),
  };
  const updated = [customItem, ...bundle];
  saveOfflineDuasBundle(updated);
  return updated;
}

export function deleteCustomOfflineDua(duaId: string): OfflineDua[] {
  const bundle = getOfflineDuasBundle();
  const updated = bundle.filter((item) => item.id !== duaId);
  saveOfflineDuasBundle(updated);
  return updated;
}

export function getOfflineStorageMetrics() {
  const bundle = getOfflineDuasBundle();
  const guides = getOfflineHajjGuides();
  const protocols = getOfflineEmergencyProtocols();
  const meta = getFromCache<{ preloadedAt: string; version: string }>(CACHE_KEYS.OFFLINE_PACKAGE_META, {
    preloadedAt: new Date().toISOString(),
    version: '2.5.0',
  });

  const categories = Array.from(new Set(bundle.map((b) => b.category)));
  const customCount = bundle.filter((b) => b.isCustom).length;
  const bookmarkedCount = bundle.filter((b) => b.isBookmarked).length;

  let estimatedBytes = 0;
  try {
    const rawDuas = localStorage.getItem(CACHE_KEYS.OFFLINE_DUAS_BUNDLE) || '';
    const rawGuides = localStorage.getItem(CACHE_KEYS.OFFLINE_HAJJ_GUIDES) || '';
    const rawProtocols = localStorage.getItem(CACHE_KEYS.OFFLINE_EMERGENCY_PROTOCOLS) || '';
    const rawPOIs = localStorage.getItem(CACHE_KEYS.OFFLINE_MAP_DATA) || '';
    estimatedBytes = new Blob([rawDuas, rawGuides, rawProtocols, rawPOIs]).size;
  } catch (e) {
    estimatedBytes = (JSON.stringify(bundle).length + JSON.stringify(guides).length + JSON.stringify(protocols).length) * 2;
  }

  return {
    totalDuasCount: bundle.length,
    totalGuidesCount: guides.length,
    totalProtocolsCount: protocols.length,
    categoriesCount: categories.length,
    customCount,
    bookmarkedCount,
    estimatedSizeBytes: estimatedBytes,
    estimatedSizeKB: (estimatedBytes / 1024).toFixed(1),
    lastSyncedAt: meta.data.preloadedAt || new Date().toISOString(),
  };
}

// Preload function to persist expanded offline duaa, guides, emergency protocols, and map packages
export function preloadEssentialOfflineData(): { success: boolean; date: string } {
  try {
    saveToCache(CACHE_KEYS.OFFLINE_DUAS_BUNDLE, ESSENTIAL_OFFLINE_DUAS);
    saveToCache(CACHE_KEYS.OFFLINE_MAP_DATA, ESSENTIAL_OFFLINE_MAP_POIS);
    saveToCache(CACHE_KEYS.OFFLINE_HAJJ_GUIDES, ESSENTIAL_OFFLINE_HAJJ_GUIDES);
    saveToCache(CACHE_KEYS.OFFLINE_EMERGENCY_PROTOCOLS, ESSENTIAL_OFFLINE_EMERGENCY_PROTOCOLS);

    const meta = {
      version: '2.5.0',
      preloadedAt: new Date().toISOString(),
      duasCount: ESSENTIAL_OFFLINE_DUAS.length,
      poisCount: ESSENTIAL_OFFLINE_MAP_POIS.length,
      guidesCount: ESSENTIAL_OFFLINE_HAJJ_GUIDES.length,
      protocolsCount: ESSENTIAL_OFFLINE_EMERGENCY_PROTOCOLS.length,
      isFullyCached: true,
    };
    saveToCache(CACHE_KEYS.OFFLINE_PACKAGE_META, meta);
    return { success: true, date: meta.preloadedAt };
  } catch (err) {
    console.error('Failed to preload essential offline data bundle:', err);
    return { success: false, date: new Date().toISOString() };
  }
}
