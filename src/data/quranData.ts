export interface Qari {
  id: string;
  nameAr: string;
  nameEn: string;
  country: string;
  photoUrl?: string;
  bio: string;
  surahs: {
    id: number;
    nameAr: string;
    nameEn: string;
    audioUrl: string;
    duration: string;
  }[];
}

export interface RadioChannel {
  id: string;
  titleAr: string;
  titleEn: string;
  locationAr: string;
  locationEn: string;
  streamUrl: string;
  isLive: boolean;
  descAr: string;
}

export interface TajweedRule {
  color: string;
  hex: string;
  nameAr: string;
  nameEn: string;
  example: string;
  description: string;
}

export interface ColoredSurah {
  id: number;
  nameAr: string;
  nameEn: string;
  revelationType: 'مكية' | 'مدنية';
  versesCount: number;
  juz: number;
  verses: {
    number: number;
    textHtml: string; // HTML string containing Tajweed colored spans
    translationEn?: string;
  }[];
}

export interface VirtuesHadith {
  id: string;
  category: 'makkah' | 'madinah';
  titleAr: string;
  titleEn: string;
  hadithText: string;
  narrator: string;
  source: string;
  benefitsAr: string;
}

// 1. القراء العالمية
export const RECITERS_DATA: Qari[] = [
  {
    id: 'sudais',
    nameAr: 'الشيخ عبد الرحمن السديس',
    nameEn: 'Sheikh Abdul Rahman Al-Sudais',
    country: 'المملكة العربية السعودية',
    bio: 'إمام وخطيب المسجد الحرام بمكة المكرمة، ورئيس الشؤون الدينية بالمسجد الحرام والمسجد النبوي.',
    surahs: [
      { id: 1, nameAr: 'سورة الفاتحة', nameEn: 'Al-Fatiha', audioUrl: 'https://server11.mp3quran.net/sds/001.mp3', duration: '01:15' },
      { id: 18, nameAr: 'سورة الكهف', nameEn: 'Al-Kahf', audioUrl: 'https://server11.mp3quran.net/sds/018.mp3', duration: '28:40' },
      { id: 36, nameAr: 'سورة يس', nameEn: 'Yasin', audioUrl: 'https://server11.mp3quran.net/sds/036.mp3', duration: '12:10' },
      { id: 55, nameAr: 'سورة الرحمن', nameEn: 'Ar-Rahman', audioUrl: 'https://server11.mp3quran.net/sds/055.mp3', duration: '09:30' },
      { id: 67, nameAr: 'سورة الملك', nameEn: 'Al-Mulk', audioUrl: 'https://server11.mp3quran.net/sds/067.mp3', duration: '07:15' },
      { id: 112, nameAr: 'سورة الإخلاص', nameEn: 'Al-Ikhlas', audioUrl: 'https://server11.mp3quran.net/sds/112.mp3', duration: '00:25' },
    ],
  },
  {
    id: 'abdulbasit',
    nameAr: 'الشيخ عبد الباسط عبد الصمد',
    nameEn: 'Sheikh Abdul Basit Abdul Samad',
    country: 'جمهورية مصر العربية',
    bio: 'صوت مكة الخالد وصاحب الحنجرة الذهبية، أحد أشهر قراء القرآن الكريم في العالم الإسلامي.',
    surahs: [
      { id: 1, nameAr: 'سورة الفاتحة', nameEn: 'Al-Fatiha', audioUrl: 'https://server7.mp3quran.net/basit/001.mp3', duration: '01:40' },
      { id: 18, nameAr: 'سورة الكهف', nameEn: 'Al-Kahf', audioUrl: 'https://server7.mp3quran.net/basit/018.mp3', duration: '35:20' },
      { id: 36, nameAr: 'سورة يس', nameEn: 'Yasin', audioUrl: 'https://server7.mp3quran.net/basit/036.mp3', duration: '15:45' },
      { id: 55, nameAr: 'سورة الرحمن', nameEn: 'Ar-Rahman', audioUrl: 'https://server7.mp3quran.net/basit/055.mp3', duration: '11:20' },
      { id: 67, nameAr: 'سورة الملك', nameEn: 'Al-Mulk', audioUrl: 'https://server7.mp3quran.net/basit/067.mp3', duration: '08:50' },
    ],
  },
  {
    id: 'afasy',
    nameAr: 'الشيخ مشاري بن راشد العفاسي',
    nameEn: 'Sheikh Mishary Rashid Al-Afasy',
    country: 'دولة الكويت',
    bio: 'قارئ ورادود ومُنشد كويتي شهير، إمام المسجد الكبير بالكويت وعضو لجنة تحكيم القرآن.',
    surahs: [
      { id: 1, nameAr: 'سورة الفاتحة', nameEn: 'Al-Fatiha', audioUrl: 'https://server8.mp3quran.net/afs/001.mp3', duration: '01:20' },
      { id: 18, nameAr: 'سورة الكهف', nameEn: 'Al-Kahf', audioUrl: 'https://server8.mp3quran.net/afs/018.mp3', duration: '29:15' },
      { id: 36, nameAr: 'سورة يس', nameEn: 'Yasin', audioUrl: 'https://server8.mp3quran.net/afs/036.mp3', duration: '11:50' },
      { id: 56, nameAr: 'سورة الواقعة', nameEn: 'Al-Waqi\'ah', audioUrl: 'https://server8.mp3quran.net/afs/056.mp3', duration: '08:40' },
      { id: 67, nameAr: 'سورة الملك', nameEn: 'Al-Mulk', audioUrl: 'https://server8.mp3quran.net/afs/067.mp3', duration: '06:50' },
    ],
  },
  {
    id: 'minshawi',
    nameAr: 'الشيخ محمد صديق المنشاوي',
    nameEn: 'Sheikh Mohamed Siddiq Al-Minshawi',
    country: 'جمهورية مصر العربية',
    bio: 'القارئ الباكي، أحد أقطاب التلاوة الخاشعة والتجويد المتقن بالمنهج الأزهري الخالد.',
    surahs: [
      { id: 1, nameAr: 'سورة الفاتحة', nameEn: 'Al-Fatiha', audioUrl: 'https://server10.mp3quran.net/minsh/001.mp3', duration: '01:30' },
      { id: 18, nameAr: 'سورة الكهف', nameEn: 'Al-Kahf', audioUrl: 'https://server10.mp3quran.net/minsh/018.mp3', duration: '32:10' },
      { id: 36, nameAr: 'سورة يس', nameEn: 'Yasin', audioUrl: 'https://server10.mp3quran.net/minsh/036.mp3', duration: '14:20' },
      { id: 55, nameAr: 'سورة الرحمن', nameEn: 'Ar-Rahman', audioUrl: 'https://server10.mp3quran.net/minsh/055.mp3', duration: '10:50' },
      { id: 67, nameAr: 'سورة الملك', nameEn: 'Al-Mulk', audioUrl: 'https://server10.mp3quran.net/minsh/067.mp3', duration: '08:10' },
    ],
  },
  {
    id: 'maher',
    nameAr: 'الشيخ ماهر المعيقلي',
    nameEn: 'Sheikh Maher Al-Muaiqly',
    country: 'المملكة العربية السعودية',
    bio: 'إمام وخطيب المسجد الحرام بمكة المكرمة، صاحب الصوت الشجي المؤثر والتلاوة العذبة.',
    surahs: [
      { id: 1, nameAr: 'سورة الفاتحة', nameEn: 'Al-Fatiha', audioUrl: 'https://server12.mp3quran.net/maher/001.mp3', duration: '01:10' },
      { id: 18, nameAr: 'سورة الكهف', nameEn: 'Al-Kahf', audioUrl: 'https://server12.mp3quran.net/maher/018.mp3', duration: '26:50' },
      { id: 36, nameAr: 'سورة يس', nameEn: 'Yasin', audioUrl: 'https://server12.mp3quran.net/maher/036.mp3', duration: '11:15' },
      { id: 55, nameAr: 'سورة الرحمن', nameEn: 'Ar-Rahman', audioUrl: 'https://server12.mp3quran.net/maher/055.mp3', duration: '08:45' },
      { id: 67, nameAr: 'سورة الملك', nameEn: 'Al-Mulk', audioUrl: 'https://server12.mp3quran.net/maher/067.mp3', duration: '06:30' },
    ],
  },
  {
    id: 'shuraim',
    nameAr: 'الشيخ سعود الشريم',
    nameEn: 'Sheikh Saoud Al-Shuraim',
    country: 'المملكة العربية السعودية',
    bio: 'إمام المسجد الحرام الأسبق وعميد كلية الدراسات القضائية بجامعة أم القرى.',
    surahs: [
      { id: 1, nameAr: 'سورة الفاتحة', nameEn: 'Al-Fatiha', audioUrl: 'https://server7.mp3quran.net/shur/001.mp3', duration: '01:12' },
      { id: 18, nameAr: 'سورة الكهف', nameEn: 'Al-Kahf', audioUrl: 'https://server7.mp3quran.net/shur/018.mp3', duration: '27:10' },
      { id: 36, nameAr: 'سورة يس', nameEn: 'Yasin', audioUrl: 'https://server7.mp3quran.net/shur/036.mp3', duration: '11:30' },
      { id: 67, nameAr: 'سورة الملك', nameEn: 'Al-Mulk', audioUrl: 'https://server7.mp3quran.net/shur/067.mp3', duration: '06:40' },
    ],
  },
  {
    id: 'hussary',
    nameAr: 'الشيخ محمود خليل الحصري',
    nameEn: 'Sheikh Mahmoud Khalil Al-Hussary',
    country: 'جمهورية مصر العربية',
    bio: 'شيخ عموم المقارئ المصرية وأحد أعظم مرجعية للتلاوة الصحيحة وأحكام التجويد في التاريخ الإسلامي.',
    surahs: [
      { id: 1, nameAr: 'سورة الفاتحة', nameEn: 'Al-Fatiha', audioUrl: 'https://server13.mp3quran.net/hss/001.mp3', duration: '01:35' },
      { id: 18, nameAr: 'سورة الكهف', nameEn: 'Al-Kahf', audioUrl: 'https://server13.mp3quran.net/hss/018.mp3', duration: '34:00' },
      { id: 36, nameAr: 'سورة يس', nameEn: 'Yasin', audioUrl: 'https://server13.mp3quran.net/hss/036.mp3', duration: '14:50' },
      { id: 67, nameAr: 'سورة الملك', nameEn: 'Al-Mulk', audioUrl: 'https://server13.mp3quran.net/hss/067.mp3', duration: '08:20' },
    ],
  },
];

// 2. البث المباشر لإذاعات القرآن الكريم
export const LIVE_RADIOS: RadioChannel[] = [
  {
    id: 'makkah_live',
    titleAr: 'إذاعة القرآن الكريم - مكة المكرمة',
    titleEn: 'Makkah Holy Quran Radio',
    locationAr: 'المملكة العربية السعودية - مكة المكرمة',
    locationEn: 'Saudi Arabia - Makkah Al-Mukarramah',
    streamUrl: 'https://qurango.net/radio/tarawih',
    isLive: true,
    descAr: 'بث مباشر متواصل لتلاوات المسجد الحرام والتراويح والصلوات الخاشعة.',
  },
  {
    id: 'cairo_quran',
    titleAr: 'إذاعة القرآن الكريم من القاهرة',
    titleEn: 'Cairo Quran Radio (Egypt)',
    locationAr: 'جمهورية مصر العربية - القاهرة',
    locationEn: 'Egypt - Cairo',
    streamUrl: 'https://qurango.net/radio/cairo',
    isLive: true,
    descAr: 'أقدم وأعرق إذاعة للقرآن الكريم في العالم الإسلامي تبث تلاوات كبار القراء والبرامج الدينية.',
  },
  {
    id: 'saudi_quran',
    titleAr: 'إذاعة القرآن الكريم - الرياض',
    titleEn: 'Saudi Quran Radio (Riyadh)',
    locationAr: 'المملكة العربية السعودية - الرياض',
    locationEn: 'Saudi Arabia - Riyadh',
    streamUrl: 'https://qurango.net/radio/mix',
    isLive: true,
    descAr: 'البث الرسمي لإذاعة القرآن الكريم بالمملكة العربية السعودية بتلاوات خاشعة وتفاسير ميسرة.',
  },
  {
    id: 'fatwa_radio',
    titleAr: 'إذاعة الفتاوى والأحكام الشرعية',
    titleEn: 'Fatwa & Islamic Guidance Radio',
    locationAr: 'العالم الإسلامي',
    locationEn: 'Islamic World',
    streamUrl: 'https://qurango.net/radio/fatwa',
    isLive: true,
    descAr: 'برامج وفتاوى كبار العلماء في أحكام المناسك والعبادات والمعاملات.',
  },
  {
    id: 'minshawi_radio',
    titleAr: 'إذاعة الشيخ محمد صديق المنشاوي',
    titleEn: 'Sheikh Al-Minshawi Radio 24/7',
    locationAr: 'تلاوات خاشعة متواصلة',
    locationEn: 'Continuous Quran Recitations',
    streamUrl: 'https://qurango.net/radio/minshawi',
    isLive: true,
    descAr: 'بث مباشر متواصل طوال اليوم لتلاوات القارئ الشيخ محمد صديق المنشاوي.',
  },
  {
    id: 'sudais_radio',
    titleAr: 'إذاعة الشيخ عبد الرحمن السديس',
    titleEn: 'Sheikh Al-Sudais Radio 24/7',
    locationAr: 'الحرم المكي الشريف',
    locationEn: 'Masjid al-Haram',
    streamUrl: 'https://qurango.net/radio/sds',
    isLive: true,
    descAr: 'بث 24/7 لتلاوات إمام المسجد الحرام الشيخ عبد الرحمن السديس.',
  },
];

// 3. قواعد التجويد الملونة للمصحف الملون
export const TAJWEED_RULES: TajweedRule[] = [
  {
    color: 'أحمر',
    hex: '#EF4444',
    nameAr: 'المدود (واجب / لازم / عارض)',
    nameEn: 'Madd (Prolongation)',
    example: 'مَا كَانَ - السَّمَاءِ - الصَّاخَّةُ',
    description: 'يُمد الصوت بمقدار 4 إلى 6 حركات بحسب نوع المد.',
  },
  {
    color: 'أخضر',
    hex: '#10B981',
    nameAr: 'الإخفاء والغُنّة والإدغام بغنّة',
    nameEn: 'Ikhfa, Ghunnah & Igham',
    example: 'مِنْ قَبْلِ - كُنْتُمْ - إِنَّ اللَّهَ',
    description: 'صوت لذيذ يخرج من الخيشوم بمقدار حركتين عند حروف الإخفاء والغنة.',
  },
  {
    color: 'أزرق',
    hex: '#3B82F6',
    nameAr: 'القلقلة (ق ط ب ج د)',
    nameEn: 'Qalqalah (Echo)',
    example: 'أَحَدٌ - الْفَلَقِ - الْحَقُّ',
    description: 'اضطراب الصوت عند النطق بالحرف الساكن ليسمع له نبرة قوية.',
  },
  {
    color: 'برتقالي',
    hex: '#F97316',
    nameAr: 'التفخيم والإظهار والقلب',
    nameEn: 'Tafkhim & Izhar',
    example: 'الَّذِينَ - أَنْعَمْتَ - مِنْ بَعْدِ',
    description: 'تسمين الحرف وتغليظه عند النطق ببعض الحروف كالصاد والضاد والطاء.',
  },
  {
    color: 'رمادي',
    hex: '#9CA3AF',
    nameAr: 'حروف لا تُلفظ عند الوصل',
    nameEn: 'Silent Letters',
    example: 'وَالْمُرْسَلاتِ - وَالصُّبْحِ',
    description: 'همزة الوصل والحروف الشمسية غير المنطوقة لتسهيل القراءة.',
  },
];

// 4. المصحف الملون
export const COLORED_SURAHS: ColoredSurah[] = [
  {
    id: 1,
    nameAr: 'سورة الفاتحة',
    nameEn: 'Al-Fatiha',
    revelationType: 'مكية',
    versesCount: 7,
    juz: 1,
    verses: [
      {
        number: 1,
        textHtml: '<span style="color:#10B981">بِسْمِ اللَّهِ</span> <span style="color:#EF4444">الرَّحْمَٰنِ</span> <span style="color:#EF4444">الرَّحِيمِ</span>',
        translationEn: 'In the name of Allah, the Entirely Merciful, the Especially Merciful.',
      },
      {
        number: 2,
        textHtml: '<span style="color:#F97316">الْحَمْدُ لِلَّهِ</span> رَبِّ <span style="color:#F97316">الْعَالَمِينَ</span>',
        translationEn: '[All] praise is [due] to Allah, Lord of the worlds -',
      },
      {
        number: 3,
        textHtml: '<span style="color:#EF4444">الرَّحْمَٰنِ</span> <span style="color:#EF4444">الرَّحِيمِ</span>',
        translationEn: 'The Entirely Merciful, the Especially Merciful,',
      },
      {
        number: 4,
        textHtml: 'مَالِكِ يَوْمِ <span style="color:#3B82F6">الدِّينِ</span>',
        translationEn: 'Sovereign of the Day of Recompense.',
      },
      {
        number: 5,
        textHtml: '<span style="color:#10B981">إِيَّاكَ</span> نَعْبُدُ <span style="color:#10B981">وَإِيَّاكَ</span> نَسْتَعِينُ',
        translationEn: 'It is You we worship and You we ask for help.',
      },
      {
        number: 6,
        textHtml: '<span style="color:#3B82F6">اهْدِنَا</span> الصِّرَاطَ <span style="color:#F97316">الْمُسْتَقِيمَ</span>',
        translationEn: 'Guide us to the straight path -',
      },
      {
        number: 7,
        textHtml: 'صِرَاطَ الَّذِينَ <span style="color:#10B981">أَنْعَمْتَ</span> عَلَيْهِمْ غَيْرِ <span style="color:#F97316">الْمَغْضُوبِ</span> عَلَيْهِمْ وَلَا <span style="color:#EF4444">الضَّالِّينَ</span>',
        translationEn: 'The path of those upon whom You have bestowed favor, not of those who have evoked [Your] anger or of those who are astray.',
      },
    ],
  },
  {
    id: 36,
    nameAr: 'سورة يس',
    nameEn: 'Yasin',
    revelationType: 'مكية',
    versesCount: 83,
    juz: 22,
    verses: [
      {
        number: 1,
        textHtml: '<span style="color:#EF4444">يسۤ</span>',
        translationEn: 'Ya, Seeen.',
      },
      {
        number: 2,
        textHtml: 'وَالْقُرْآنِ <span style="color:#F97316">الْحَكِيمِ</span>',
        translationEn: 'By the wise Qur\'an.',
      },
      {
        number: 3,
        textHtml: '<span style="color:#10B981">إِنَّكَ</span> لَمِنَ <span style="color:#F97316">الْمُرْسَلِينَ</span>',
        translationEn: 'Indeed you, [O Muhammad], are from among the messengers,',
      },
      {
        number: 4,
        textHtml: 'عَلَىٰ صِرَاطٍ <span style="color:#3B82F6">مُسْتَقِيمٍ</span>',
        translationEn: 'On a straight path.',
      },
      {
        number: 5,
        textHtml: '<span style="color:#10B981">تَنْزِيلَ</span> <span style="color:#EF4444">الْعَزِيزِ</span> <span style="color:#EF4444">الرَّحِيمِ</span>',
        translationEn: '[This is] a revelation of the Exalted in Might, the Merciful,',
      },
    ],
  },
  {
    id: 55,
    nameAr: 'سورة الرحمن',
    nameEn: 'Ar-Rahman',
    revelationType: 'مدنية',
    versesCount: 78,
    juz: 27,
    verses: [
      {
        number: 1,
        textHtml: '<span style="color:#EF4444">الرَّحْمَٰنُ</span>',
        translationEn: 'The Entirely Merciful',
      },
      {
        number: 2,
        textHtml: 'عَلَّمَ <span style="color:#F97316">الْقُرْآنَ</span>',
        translationEn: 'Taught the Qur\'an,',
      },
      {
        number: 3,
        textHtml: '<span style="color:#3B82F6">خَلَقَ</span> <span style="color:#F97316">الْإِنْسَانَ</span>',
        translationEn: 'Created man,',
      },
      {
        number: 4,
        textHtml: 'عَلَّمَهُ <span style="color:#10B981">الْبَيَانَ</span>',
        translationEn: 'Taught him eloquence.',
      },
      {
        number: 5,
        textHtml: 'الشَّمْسُ وَالْقَمَرُ <span style="color:#3B82F6">بِحُسْبَانٍ</span>',
        translationEn: 'The sun and the moon [move] by precise calculation,',
      },
    ],
  },
  {
    id: 67,
    nameAr: 'سورة الملك',
    nameEn: 'Al-Mulk',
    revelationType: 'مكية',
    versesCount: 30,
    juz: 29,
    verses: [
      {
        number: 1,
        textHtml: '<span style="color:#3B82F6">تَبَارَكَ</span> الَّذِي بِيَدِهِ <span style="color:#F97316">الْمُلْكُ</span> وَهُوَ عَلَىٰ كُلِّ شَيْءٍ <span style="color:#3B82F6">قَدِيرٌ</span>',
        translationEn: 'Blessed is He in whose hand is dominion, and He is over all things competent -',
      },
      {
        number: 2,
        textHtml: 'الَّذِي <span style="color:#3B82F6">خَلَقَ</span> <span style="color:#F97316">الْمَوْتَ</span> وَالْحَيَاةَ <span style="color:#10B981">لِيَبْلُوَكُمْ</span> أَيُّكُمْ أَحْسَنُ عَمَلًا ۚ وَهُوَ <span style="color:#EF4444">الْعَزِيزُ</span> <span style="color:#F97316">الْغَفُورُ</span>',
        translationEn: '[He] who created death and life to test you as to which of you is best in deed - and He is the Exalted in Might, the Forgiving -',
      },
      {
        number: 3,
        textHtml: 'الَّذِي <span style="color:#3B82F6">خَلَقَ</span> سَبْعَ سَمَاوَاتٍ <span style="color:#3B82F6">طِبَاقًا</span> ۖ مَا تَرَىٰ فِي <span style="color:#3B82F6">خَلْقِ</span> <span style="color:#EF4444">الرَّحْمَٰنِ</span> مِنْ تَفَاوُتٍ ۖ <span style="color:#3B82F6">فَارْجِعِ</span> الْبَصَرَ هَلْ تَرَىٰ مِنْ <span style="color:#3B82F6">فُطُورٍ</span>',
        translationEn: '[And] who created seven heavens in layers. You do not see in the creation of the Most Merciful any inconsistency. So return [your] vision; do you see any breaks?',
      },
    ],
  },
  {
    id: 112,
    nameAr: 'سورة الإخلاص',
    nameEn: 'Al-Ikhlas',
    revelationType: 'مكية',
    versesCount: 4,
    juz: 30,
    verses: [
      {
        number: 1,
        textHtml: '<span style="color:#3B82F6">قُلْ</span> هُوَ اللَّهُ <span style="color:#3B82F6">أَحَدٌ</span>',
        translationEn: 'Say, "He is Allah, [who is] One,',
      },
      {
        number: 2,
        textHtml: 'اللَّهُ <span style="color:#3B82F6">الصَّمَدُ</span>',
        translationEn: 'Allah, the Eternal Refuge.',
      },
      {
        number: 3,
        textHtml: 'لَمْ <span style="color:#3B82F6">يَلِدْ</span> وَلَمْ <span style="color:#3B82F6">يُولَدْ</span>',
        translationEn: 'He neither begets nor is born,',
      },
      {
        number: 4,
        textHtml: 'وَلَمْ يَكُنْ لَهُ <span style="color:#10B981">كُفُوًا</span> <span style="color:#3B82F6">أَحَدٌ</span>',
        translationEn: 'Nor is there to Him any equivalent."',
      },
    ],
  },
];

// 5. الأحاديث النبوية الشريفة في فضل مكة والمدينة
export const VIRTUES_HADITHS: VirtuesHadith[] = [
  // أحاديث فضل مكة المكرمة
  {
    id: 'makkah_1',
    category: 'makkah',
    titleAr: 'عظمة حرمة مكة المكرمة وقداستها',
    titleEn: 'The Sacredness & Sanctity of Makkah',
    hadithText: '«إِنَّ هَذَا الْبَلَدَ حَرَّمَهُ اللَّهُ يَوْمَ خَلَقَ السَّمَاوَاتِ وَالأَرْضَ، فَهُوَ حَرَامٌ بِحُرْمَةِ اللَّهِ إِلَى يَوْمِ الْقِيَامَةِ، وَإِنَّهُ لَمْ يَحِلَّ الْقِتَالُ فِيهِ لأَحَدٍ قَبْلِي، وَلَمْ يَحِلَّ لِي إِلاَّ سَاعَةً مِنْ نَهَارٍ، فَهُوَ حَرَامٌ بِحُرْمَةِ اللَّهِ إِلَى يَوْمِ الْقِيَامَةِ»',
    narrator: 'عبد الله بن عباس رضي الله عنهما',
    source: 'صحيح البخاري وصحيح مسلم',
    benefitsAr: 'يبيّن الحديث أن مكة المكرمة حرم آمن قدسه الله تعالى منذ خُلق الكون، ولا يحل فيه القتال ولا قطع شجره أو ترعيب أهله.',
  },
  {
    id: 'makkah_2',
    category: 'makkah',
    titleAr: 'أحب بقاع الأرض إلى الله وإلى رسوله ﷺ',
    titleEn: 'The Most Beloved Land to Allah and His Messenger',
    hadithText: 'وقف رسول الله ﷺ على الحَزْوَرَةِ بمكة فقال: «وَاللَّهِ إِنَّكِ لَخَيْرُ أَرْضِ اللَّهِ، وَأَحَبُّ أَرْضِ اللَّهِ إِلَى اللَّهِ، وَلَوْلا أَنِّي أُخْرِجْتُ مِنْكِ مَا خَرَجْتُ»',
    narrator: 'عبد الله بن عدي بن حمراء رضي الله عنه',
    source: 'سنن الترمذي وقال حديث حسن صحيح',
    benefitsAr: 'شهادة نبوية شريفة بمكانة مكة العالية ومحبة النبي ﷺ الصادقة لبلده الأغلى والأطهر.',
  },
  {
    id: 'makkah_3',
    category: 'makkah',
    titleAr: 'مضاعفة أجر الصلاة في المسجد الحرام (مائة ألف صلاة)',
    titleEn: 'Multiplied Reward of Prayer in Al-Masjid Al-Haram (100,000x)',
    hadithText: '«صَلاةٌ فِي مَسْجِدِي هَذَا أَفْضَلُ مِنْ أَلْفِ صَلاةٍ فِيمَا سِوَاهُ إِلا المَسْجِدَ الحَرَامَ، وَصَلاةٌ فِي المَسْجِدِ الحَرَامِ أَفْضَلُ مِنْ مِائَةِ أَلْفِ صَلاةٍ فِيمَا سِوَاهُ»',
    narrator: 'جابر بن عبد الله رضي الله عنهما',
    source: 'مسند أحمد وسنن ابن ماجه (بإسناد صحيح)',
    benefitsAr: 'الركعة الواحدة في المسجد الحرام تتضاعف إلى 100,000 ركعة في الأجر، وهو فضل عظيم لضيوف الرحمن والحجاج.',
  },
  {
    id: 'makkah_4',
    category: 'makkah',
    titleAr: 'فضل ماء زمزم الشريف والشفاء به',
    titleEn: 'The Blessings & Healing Power of Zamzam Water',
    hadithText: '«مَاءُ زَمْزَمَ لِمَا شُرِبَ لَهُ... إِنَّهَا مُبَارَكَةٌ، إِنَّهَا طَعَامُ طُعْمٍ، وَشِفَاءُ سُقْمٍ»',
    narrator: 'أبو ذر الغفاري وجابر رضي الله عنهما',
    source: 'صحيح مسلم ومسند أحمد',
    benefitsAr: 'ماء زمزم مبارك نبع في أطهر بقعة، يرتوي منه الحاج بنيّة الشفاء أو الفرج أو العلم ويزوده الله من فضله.',
  },
  {
    id: 'makkah_5',
    category: 'makkah',
    titleAr: 'فضل الطواف بالبيت العتيق ومسح الركنين',
    titleEn: 'Virtues of Tawaf Around the Kaaba & Touching the Black Stone',
    hadithText: '«مَنْ طَافَ بِهَذَا الْبَيْتِ أُسْبُوعًا [أي 7 أشواط] فَأَحْصَاهُ، كَانَ كَعِتْقِ رَقَبَةٍ، وَلا يَضَعُ قَدَمًا وَلا يَرْفَعُ أُخْرَى إِلا حَطَّ اللَّهُ عَنْهُ خَطِيئَةً وَكَتَبَ لَهُ بِهَا حَسَنَةً»',
    narrator: 'عبد الله بن عمر رضي الله عنهما',
    source: 'سنن الترمذي وحسنه الألباني',
    benefitsAr: 'كل خطوة في الطواف ترتفع بها درجات ويُحط بها سيئات، وتعدل عتق رقبة في سبيل الله.',
  },

  // أحاديث فضل المدينة المنورة
  {
    id: 'madinah_1',
    category: 'madinah',
    titleAr: 'حرمة المدينة المنورة وأمانها المعظم',
    titleEn: 'The Sanctuary & Divine Protection of Madinah',
    hadithText: '«الْمَدِينَةُ حَرَمٌ مَا بَيْنَ عَيْرٍ إِلَى ثَوْرٍ، فَمَنْ أَحْدَثَ فِيهَا حَدَثًا أَوْ آوَى مُحْدِثًا فَعَلَيْهِ لَعْنَةُ اللَّهِ وَالْمَلائِكَةِ وَالنَّاسِ أَجْمَعِينَ، لا يُقْبَلُ مِنْهُ يَوْمَ الْقِيَامَةِ صَرْفٌ وَلا عَدْلٌ»',
    narrator: 'علي بن أبي طالب رضي الله عنه',
    source: 'صحيح البخاري وصحيح مسلم',
    benefitsAr: 'تأكيد حرمة المدينة المنورة وحدودها المقدرة نبوياً، ووجوب تعظيم قدرها ورعاية حرمة ساكنيها.',
  },
  {
    id: 'madinah_2',
    category: 'madinah',
    titleAr: 'فضل الصلاة في الروضة الشريفة بالمسجد النبوي',
    titleEn: 'Virtues of Praying in Al-Rawdah Al-Sharifah',
    hadithText: '«مَا بَيْنَ بَيْتِي وَمِنْبَرِي رَوْضَةٌ مِنْ رِيَاضِ الْجَنَّةِ، وَمِنْبَرِي عَلَى حَوْضِي»',
    narrator: 'أبو هريرة رضي الله عنه',
    source: 'صحيح البخاري وصحيح مسلم',
    benefitsAr: 'الروضة الشريفة قطعة مباركة تُشبه رياض الجنة تنزل فيها الرحمات والسكينة والقبول المستجاب.',
  },
  {
    id: 'madinah_3',
    category: 'madinah',
    titleAr: 'دعاء النبي ﷺ بالبركة المضاعفة للمدينة',
    titleEn: 'Prophet\'s Prayer for Double Blessings on Madinah',
    hadithText: '«اللَّهُمَّ بَارِكْ لَنَا فِي ثَمَرِنَا، وَبَارِكْ لَنَا فِي مَدِينَتِنَا، وَبَارِكْ لَنَا فِي صَاعِنَا، وَبَارِكْ لَنَا فِي مُدِّنَا، اللَّهُمَّ اجْعَلْ مَعَ الْبَرَكَةِ بَرَكَتَيْنِ»',
    narrator: 'أبو هريرة رضي الله عنه',
    source: 'صحيح مسلم',
    benefitsAr: 'استجابة دعوة النبي ﷺ بالبركة والخير والرزق الشامل في طعام المدينة وأرزاقها وأجوائها.',
  },
  {
    id: 'madinah_4',
    category: 'madinah',
    titleAr: 'حفظ المدينة من الدجال والوباء والفتن',
    titleEn: 'Protection of Madinah from Dajjal & Plagues',
    hadithText: '«عَلَى أَنْقَابِ الْمَدِينَةِ مَلائِكَةٌ لا يَدْخُلُهَا الطَّاعُونُ وَلا الدَّجَّالُ»',
    narrator: 'أبو هريرة رضي الله عنه',
    source: 'صحيح البخاري وصحيح مسلم',
    benefitsAr: 'المدينة حرسها الله بملائكة غلاظ شداد يحرسون منافذها من كل شر ومن كل طاعون ودجال إلى يوم القيامة.',
  },
  {
    id: 'madinah_5',
    category: 'madinah',
    titleAr: 'شفاعة النبي ﷺ لمن صبر على لأواء المدينة ومات بها',
    titleEn: 'Prophetic Intercession for Those Who Reside in Madinah',
    hadithText: '«لا يَصْبِرُ عَلَى لأْوَاءِ الْمَدِينَةِ وَشِدَّتِهَا أَحَدٌ مِنْ أُمَّتِي إِلا كُنْتُ لَهُ شَفِيعًا يَوْمَ الْقِيَامَةِ أَوْ شَهِيدًا»',
    narrator: 'أبو سعيد الخدري رضي الله عنه',
    source: 'صحيح مسلم',
    benefitsAr: 'بشارة عظيمة لمن يستوطن المدينة المنورة أو يزورها ويصبر على مشاق السفر وأجوائها نائلاً شفاعة الحبيب ﷺ.',
  },
];
