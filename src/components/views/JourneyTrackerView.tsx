import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  Circle,
  Sparkles,
  Clock,
  MapPin,
  BookOpen,
  Volume2,
  VolumeX,
  RotateCcw,
  Share2,
  FileText,
  Calendar,
  ChevronDown,
  ChevronUp,
  Award,
  Compass,
  ArrowRight,
  Sun,
  Flame,
  ShieldCheck,
  Building2,
  Edit3,
  Check,
  CheckCheck,
  HeartHandshake,
  MessageSquare,
} from 'lucide-react';
import { LanguageOption } from '../../data/languages';
import { saveToCache, getFromCache, CACHE_KEYS } from '../../utils/offlineStorage';

interface JourneyTrackerViewProps {
  language: LanguageOption;
  onBack: () => void;
  onSendToWhatsapp?: (message: string) => void;
}

export interface JourneyStep {
  id: string;
  category: 'umrah' | 'hajj' | 'ziyarah';
  dayNumber?: string;
  stepNum: string;
  titleAr: string;
  titleEn: string;
  locationAr: string;
  locationEn: string;
  descAr: string;
  descEn: string;
  duaAr: string;
  transliteration?: string;
  duaEn?: string;
  tipsAr: string[];
  tipsEn: string[];
}

// 1. Umrah Steps
const UMRAH_STEPS: JourneyStep[] = [
  {
    id: 'umrah_1_ihram',
    category: 'umrah',
    stepNum: '01',
    titleAr: 'الإحرام والتلبية من الميقات',
    titleEn: 'Ihram & Niyyah from Miqat',
    locationAr: 'الميقات المحدد (ذو الحليفة، يلملم، الجحفة...)',
    locationEn: 'Designated Miqat Location',
    descAr: 'الاغتسال والتطيب للبدن، وارتداء لباس الإحرام الأبيض للرجال واللباس الشرعي للنساء، ونية العمرة بالقلب والجهر بالتلبية.',
    descEn: 'Ghusl, wearing clean white ihram garments, making intention (Niyyah) and reciting Talbiyah.',
    duaAr: '«لَبَّيْكَ اللَّهُمَّ عُمْرَةً، لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ، لَبَّيْكَ لاَ شَرِيكَ لَكَ لَبَّيْكَ، إِنَّ الْحَمْدَ وَالنِّعْمَةَ لَكَ وَالْمُلْكُ لاَ شَرِيكَ لَكَ»',
    transliteration: 'Labbayka Allāhumma ‘Umrah. Labbayk Allāhumma labbayk...',
    duaEn: 'Here I am, O Allah, for Umrah. Here I am, You have no partner...',
    tipsAr: [
      'احرص على الاغتسال وتقليم الأظافر قبل لبس الإحرام.',
      'يتجنب المحرم محظورات الإحرام مثل التطيب وتغطية الرأس للرجال.',
      'تستمر التلبية حتى البدء في الطواف حول الكعبة المشرفة.'
    ],
    tipsEn: [
      'Perform Ghusl & trim nails before entering Ihram.',
      'Avoid prohibitions like wearing perfume or head coverings for men.',
      'Recite Talbiyah continuously until beginning Tawaf.'
    ]
  },
  {
    id: 'umrah_2_tawaf',
    category: 'umrah',
    stepNum: '02',
    titleAr: 'طواف العمرة (7 أشواط)',
    titleEn: 'Tawaf Al-Umrah (7 Laps)',
    locationAr: 'المسجد الحرام - صحن المطاف حول الكعبة',
    locationEn: 'Makkah - Mataf Area around Kaaba',
    descAr: 'الطواف حول الكعبة المشرفة سبعة أشواط بدءاً من الحجر الأسود وجعل الكعبة عن اليسار، ثم صلاة ركعتين خلف مقام إبراهيم والشرب من Zamzam.',
    descEn: 'Circling the Holy Kaaba 7 times starting at Black Stone, praying 2 Rak\'ahs at Maqam Ibrahim & drinking Zamzam.',
    duaAr: '«رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ» (بين الركن اليماني والحجر الأسود)',
    transliteration: 'Rabbanā ātinā fid-dunyā ḥasanatan wa fil-ākhirati ḥasanatan wa qinā ‘adhāb an-nār.',
    duaEn: 'Our Lord, give us in this world good and in the Hereafter good and protect us from the punishment of the Fire.',
    tipsAr: [
      'الاضطباع للرجال (كشف الكتف الأيمن) في جميع أشواط هذا الطواف.',
      'الرَّمَل (الإسراع في المشي) في الأشواط الثلاثة الأولى للرجال إن تيسر.',
      'شرب ماء زمزم والتضلع منه والاستلقاء بالدعاء الخير.'
    ],
    tipsEn: [
      'Uncover right shoulder (Idtiba\') for men during Tawaf.',
      'Walk at a brisk pace (Raml) in the first 3 laps for men if space permits.',
      'Drink Zamzam water and make personal supplications.'
    ]
  },
  {
    id: 'umrah_3_sai',
    category: 'umrah',
    stepNum: '03',
    titleAr: 'السعي بين الصفا والمروة (7 أشواط)',
    titleEn: 'Sa\'i Between Safa & Marwah (7 Laps)',
    locationAr: 'المسجد الحرام - المسعى',
    locationEn: 'Makkah - Masa\'a Corridor',
    descAr: 'المشي بين جبل الصفا والمروة سبعة أشواط، يبدأ الشوط الأول من الصفا وينتهي السابع عند المروة، مع إكثار الذكر والدعاء.',
    descEn: 'Walking 7 laps between Safa and Marwah starting at Safa and finishing at Marwah.',
    duaAr: '«إِنَّ الصَّفَا وَالْمَرْوَةَ مِن شَعَائِرِ اللَّهِ ۖ فَمَنْ حَجَّ الْبَيْتَ أَوِ اعْتَمَرَ فَلَا جُنَاحَ عَلَيْهِ أَن يَطَّوَّفَ بِهِمَا»',
    transliteration: 'Innaṣ-Ṣafā wal-Marwata min sha‘ā\'irillāh...',
    duaEn: 'Indeed, Safa and Marwah are among the symbols of Allah...',
    tipsAr: [
      'الهرولة خفيفة للرجال بين العلمين الأخضرين.',
      'الدعاء والاستقبال للكعبة على جبل الصفا والمروة.',
      'حساب الشوط من الصفا إلى المروة كشوط كامل.'
    ],
    tipsEn: [
      'Jog lightly between the green lights for men.',
      'Face Kaaba and supplicate when standing on Safa and Marwah.',
      'Going from Safa to Marwah counts as 1 full lap.'
    ]
  },
  {
    id: 'umrah_4_tahallul',
    category: 'umrah',
    stepNum: '04',
    titleAr: 'الحلق أو التقصير (التحلل من العمرة)',
    titleEn: 'Halq or Taqseer (Completing Umrah)',
    locationAr: 'مكة المكرمة - الحلاقين المعتمدين',
    locationEn: 'Makkah Authorized Barbers / Hotel',
    descAr: 'حلق كامل شعر الرأس أو تقصيره من جميع الأنحاء للرجال، وتقصير أنملة من طرف الشعر للنساء، وبذلك تكتمل العمرة بحمد الله.',
    descEn: 'Shaving or shortening hair for men, trimming a fingertip length for women, completing Umrah rituals.',
    duaAr: '«الْحَمْدُ لِلَّهِ الَّذِي هَدَانَا لِهَذَا وَمَا كُنَّا لِنَهْتَدِيَ لَوْلَا أَنْ هَدَانَا اللَّهُ، اللَّهُمَّ تَقَبَّلْ مِنَّا»',
    transliteration: 'Al-ḥamdu lillāhilladhī hadānā lihādhā...',
    duaEn: 'Praise be to Allah who guided us to this. O Allah accept from us!',
    tipsAr: [
      'الحلق أفضل للرجال وله أجر ثلاث دعوات من النبي ﷺ.',
      'بعد التقصير يحل كل ما حرم بالإحرام وتكتمل العمرة.',
      'احرص على استخدام أدوات حلاقة معقمة وذات استخدام واحد.'
    ],
    tipsEn: [
      'Shaving is preferred for men and received triple blessings from the Prophet PBUH.',
      'After hair trimming, all Ihram restrictions are lifted.',
      'Ensure single-use sterile barber blades.'
    ]
  }
];

// 2. Hajj Steps
const HAJJ_STEPS: JourneyStep[] = [
  {
    id: 'hajj_1_tarwiyah',
    category: 'hajj',
    dayNumber: '8 ذو الحجة',
    stepNum: '01',
    titleAr: 'يوم التروية - التوجه إلى منى',
    titleEn: 'Day 8 Dhul Hijjah - Tarwiyah in Mina',
    locationAr: 'مشعر منى - مخيمات الحجاج',
    locationEn: 'Mina Tents Valley',
    descAr: 'الإحرام بالحج من مكان الإقامة بمكة، والتوجّه إلى مشعر منى والمبيت بها وصلاة الظهر والعصر والمغرب والعشاء والفجر قَصراً بلا جمع.',
    descEn: 'Entering Ihram for Hajj from hotel, moving to Mina, praying 5 daily prayers shortened without combining.',
    duaAr: '«لَبَّيْكَ اللَّهُمَّ حَجًّا، لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ...»',
    transliteration: 'Labbayk Allāhumma Hajjā...',
    duaEn: 'Here I am O Allah for Hajj...',
    tipsAr: [
      'التجهز بالإحرام والتلبية بكثرة أثناء التوجه لمشعر منى.',
      'المبيت بمنى سنة مؤكدة والإكثار من الاستغفار والذكر.',
      'شرب الماء الكافي وأخذ قسط من الراحة ليوم عرفة.'
    ],
    tipsEn: [
      'Enter Ihram from residence and recite Talbiyah frequently.',
      'Stay overnight in Mina and engage in remembrance.',
      'Stay hydrated and well-rested for the Day of Arafah.'
    ]
  },
  {
    id: 'hajj_2_arafah',
    category: 'hajj',
    dayNumber: '9 ذو الحجة',
    stepNum: '02',
    titleAr: 'يوم عرفة - الوقوف بجبل الرحمة (ركن الحج الأعظم)',
    titleEn: 'Day 9 - Standing at Arafat (Core Hajj Peak)',
    locationAr: 'صعيد عرفات الطاهر - جبل الرحمة ومسجد نمرة',
    locationEn: 'Plains of Arafat & Mount Mercy',
    descAr: 'التوجه إلى عرفات صباحاً، صلاة الظهر والعصر جمعاً وقصراً في وقت الظهر، والتفرغ التام للدعاء والتضرع والاستغفار حتى غروب الشمس.',
    descEn: 'Heading to Arafat, praying Dhuhr & Asr combined at Dhuhr time, devoting the afternoon entirely to intense Dua until sunset.',
    duaAr: '«لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ»',
    transliteration: 'Lā ilāha illallāhu waḥdahū lā sharīka lah...',
    duaEn: 'There is no deity except Allah alone, with no partner. His is the sovereignty and praise...',
    tipsAr: [
      'الحج عرفة: الوقوف في أي جزء من حدود عرفات يجزئ.',
      'أفضل الدعاء دعاء يوم عرفة؛ خَيْرُ الدُّعَاءِ دُعَاءُ يَوْمِ عَرَفَةَ.',
      'عدم المغادرة قبل غروب الشمس تماماً.'
    ],
    tipsEn: [
      'Hajj is Arafah: Standing anywhere within Arafat boundaries is valid.',
      'Best supplication of the year is on the Day of Arafah.',
      'Do not leave Arafat before complete sunset.'
    ]
  },
  {
    id: 'hajj_3_muzdalifah',
    category: 'hajj',
    dayNumber: 'ليلة 10 ذو الحجة',
    stepNum: '03',
    titleAr: 'المبيت بمزدلفة وجمع الحصى',
    titleEn: 'Muzdalifah Night & Collecting Pebbles',
    locationAr: 'المشعر الحرام - مزدلفة',
    locationEn: 'Muzdalifah Sacred Grounds',
    descAr: 'النفرة من عرفات بعد الغروب بمهل وسكينة إلى مزدلفة، صلاة المغرب والعشاء جمع تأخير، التقاط حصى الجمرات والمبيت حتى الفجر.',
    descEn: 'Departing Arafat peacefully after sunset to Muzdalifah, praying Maghrib & Isha combined, picking pebbles & resting until Fajr.',
    duaAr: '«فَإِذَا أَفَضْتُم مِّنْ عَرَفَاتٍ فَاذْكُرُوا اللَّهَ عِندَ الْمَشْعَرِ الْحَرَامِ»',
    transliteration: 'Fa\'idhā afaḍtum min ‘Arafātin fadhkurullāha ‘indal-Mash‘aril-Ḥarām...',
    duaEn: 'When you depart from Arafat, remember Allah at the Sacred Monument.',
    tipsAr: [
      'جمع 7 حصيات لجمرة العقبة الكبرى ليوم العيد (وحصى الأيام القادمة).',
      'صلاة المغرب والعشاء فور الوصول لمزدلفة.',
      'المبيت بمزدلفة واجب حتى صلاة الفجر ثم التوجه لمنى.'
    ],
    tipsEn: [
      'Gather 7 small pebbles for Jamrat Al-Aqabah.',
      'Pray Maghrib and Isha immediately upon arrival at Muzdalifah.',
      'Stay overnight in Muzdalifah until Fajr prayer.'
    ]
  },
  {
    id: 'hajj_4_eid_day',
    category: 'hajj',
    dayNumber: '10 ذو الحجة (يوم العيد)',
    stepNum: '04',
    titleAr: 'رمي جمرة العقبة والذبح والحلق وطواف الإفاضة',
    titleEn: 'Day 10 Eid - Jamarat, Qurbani & Tawaf Al-Ifadah',
    locationAr: 'منى (الجمرات) والمسجد الحرام',
    locationEn: 'Mina Jamarat Bridge & Makkah Kaaba',
    descAr: 'رمي جمرة العقبة الكبرى بـ 7 حصيات، ثم الهدي (الذبح)، ثم الحلق/التقصير (التحلل الأصغر)، ثم التوجه لمكة لطواف الإفاضة والسعي (التحلل الأكبر).',
    descEn: 'Casting 7 pebbles at Jamrat Al-Aqabah, sacrificing animal, shaving hair (minor Tahallul), Tawaf Al-Ifadah & Sa\'i (major Tahallul).',
    duaAr: '«اللَّهُ أَكْبَرُ، اللَّهُمَّ اجْعَلْهُ حَجًّا مَبْرُورًا وَذَنْبًا مَغْفُورًا وَسَعْيًا مَشْكُورًا»',
    transliteration: 'Allāhu Akbar, Allāhummaj‘alhu ḥajjan mabrūran...',
    duaEn: 'Allah is Almighty, O Allah make it an accepted Hajj and forgiven sins.',
    tipsAr: [
      'رمي الحصيات واحدة تلو الأخرى مع التكبير «الله أكبر».',
      'بعد الحلق يجوز لبس الثياب العادية وتطيب البدن (التحلل الأول).',
      'طواف الإفاضة ركن لا يصح الحج إلا به.'
    ],
    tipsEn: [
      'Cast pebbles one by one saying Allahu Akbar.',
      'After hair trimming, normal clothes are permitted (First Tahallul).',
      'Tawaf Al-Ifadah is an essential pillar of Hajj.'
    ]
  },
  {
    id: 'hajj_5_tashreeq',
    category: 'hajj',
    dayNumber: '11 - 13 ذو الحجة',
    stepNum: '05',
    titleAr: 'أيام التشريق والمبيت بمنى ورمي الجمرات الثلاث',
    titleEn: 'Days 11-13 - Tashreeq Days in Mina & 3 Jamarat',
    locationAr: 'مشعر منى - جسر الجمرات الحديث',
    locationEn: 'Mina Complex & Jamarat Bridge',
    descAr: 'المبيت بمنى ليلتي 11 و12 (و13 للمتأخر)، ورمي الجمرات الثلاث (الصغرى ثم الوسطى ثم الكبرى) بـ 21 حصاة يومياً بعد الزوال مع الدعاء.',
    descEn: 'Staying in Mina, casting 21 pebbles daily after Dhuhr at all 3 Jamarat pillars (Small, Middle, Aqabah) with Dua after first two.',
    duaAr: '«وَاذْكُرُوا اللَّهَ فِي أَيَّامٍ مَّعْدُودَاتٍ ۚ فَمَن تَعَجَّلَ فِي يَوْمَيْنِ فَلَا إِثْمَ عَلَيْهِ»',
    transliteration: 'Wadhkurullāha fī ayyāmin ma‘dūdāt...',
    duaEn: 'And remember Allah during specified days...',
    tipsAr: [
      'الرمي يبدأ بعد زوال الشمس (أذان الظهر).',
      'الدعاء الطويل المأثور بعد الجمرة الصغرى والوسطى.',
      'يجوز للمتعجل المغادرة يوم 12 قبل غروب الشمس.'
    ],
    tipsEn: [
      'Throwing pebbles begins after Dhuhr time.',
      'Offer lengthy supplications after Small and Middle Jamarat.',
      'Pilgrims rushing can depart on Day 12 before sunset.'
    ]
  },
  {
    id: 'hajj_6_wadaa',
    category: 'hajj',
    dayNumber: 'ختام المناسك',
    stepNum: '06',
    titleAr: 'طواف الوداع (آخر العهد بالبيت الحرام)',
    titleEn: 'Farewell Tawaf Al-Wadaa',
    locationAr: 'المسجد الحرام - الكعبة المشرفة',
    locationEn: 'Makkah - Holy Kaaba',
    descAr: 'الطواف حول الكعبة سبعة أشواط قبل مغادرة مكة المكرمة ليكون آخر عهد الحاج بالبيت الحرام، وتوديع البقاع الطاهرة بالدموع والدعاء.',
    descEn: 'Final 7-lap farewell Tawaf around Kaaba right before departing Makkah Mukarramah.',
    duaAr: '«اللَّهُمَّ لاَ تَجْعَلْ هَذَا آخِرَ الْعَهْدِ بِبَيْتِكَ الْحَرَامِ، وَارْزُقْنِي الْعَوْدَ إِلَيْهِ مَرَّاتٍ وَكَرَّاتٍ»',
    transliteration: 'Allāhumma lā taj‘al hādhā ākhiral-‘ahdi bibaytikil-Ḥarām...',
    duaEn: 'O Allah, do not make this the last time I visit Your Sacred House...',
    tipsAr: [
      'طواف الوداع واجب على كل حاج غير الحائض والنفساء.',
      'يكون السفر مباشرة بعد طواف الوداع بدون إقامة طويلة.',
      'شكر الله تعالى على نعمة تمام الحج والدعاء بالقبول.'
    ],
    tipsEn: [
      'Farewell Tawaf is mandatory before leaving Makkah.',
      'Travel immediately after performing Tawaf Al-Wadaa.',
      'Thank Allah for completing the sacred journey.'
    ]
  }
];

// 3. Madinah Ziyarah Steps
const ZIYARAH_STEPS: JourneyStep[] = [
  {
    id: 'ziyarah_1_nabawi',
    category: 'ziyarah',
    stepNum: '01',
    titleAr: 'الصلاة في المسجد النبوي الشريف',
    titleEn: 'Prayers at Prophet\'s Mosque',
    locationAr: 'المدينة المنورة - الحرم النبوي',
    locationEn: 'Madinah - Al-Masjid An-Nabawi',
    descAr: 'دخول المسجد النبوي بالسكينة والخشوع بدماء الرجل اليمنى، والصلاة فيه (الصلاة فيه بألف صلاة فيما سواه)، والخشوع والتدبر.',
    descEn: 'Entering the Prophet\'s Mosque with peace, offering prayers (rewarded 1,000 times higher).',
    duaAr: '«بِسْمِ اللَّهِ، وَالصَّلاَةُ وَالسَّلاَمُ عَلَى رَسُولِ اللَّهِ، اللَّهُمَّ اغْفِرْ لِي ذُنُوبِي وَافْتَحْ لِي أَبْوَابَ رَحْمَتِكَ»',
    transliteration: 'Bismillāh, was-ṣalātu was-salāmu ‘alā rasūlillāh...',
    duaEn: 'In the name of Allah, blessings on the Messenger of Allah, O Allah open for me the doors of Your mercy.',
    tipsAr: [
      'تقديم الرجل اليمنى عند الدخول وصلاة ركعتين تحية المسجد.',
      'خفض الصوت وتوقير المكان والاعتناء بالسكينة والوقار.',
      'الإكثار من الصلاة والسلام على النبي ﷺ.'
    ],
    tipsEn: [
      'Step in with right foot and offer 2 Rak\'ahs Tahiyyat Al-Masjid.',
      'Maintain serene silence and reverence inside the mosque.',
      'Send abundant Salawat upon the Prophet Muhammad PBUH.'
    ]
  },
  {
    id: 'ziyarah_2_rawdah',
    category: 'ziyarah',
    stepNum: '02',
    titleAr: 'الصلاة في الروضة الشريفة (بتصريح نسك)',
    titleEn: 'Praying in Al-Rawdah Al-Sharifah',
    locationAr: 'الروضة الشريفة بين المِنبَر والبيت الشريف',
    locationEn: 'Al-Rawdah Al-Sharifah Garden',
    descAr: 'الصلاة والتضرع بالدعاء في الروضة الشريفة «مَا بَيْنَ بَيْتِي وَمِنْبَرِي رَوْضَةٌ مِنْ رِيَاضِ الْجَنَّةِ» وفق تصريح تطبيق نسك.',
    descEn: 'Praying in Rawdah Al-Sharifah ("Between my house and pulpit is a garden of Paradise") via Nusuk app permit.',
    duaAr: '«اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ، اللَّهُمَّ إِنِّي أَسْأَلُكَ مِن خَيْرِ مَا سَأَلَكَ مِنْهُ نَبِيُّكَ مُحَمَّدٌ»',
    transliteration: 'Allāhumma ṣalli ‘alā Muḥammad...',
    duaEn: 'O Allah send peace upon Muhammad, I ask You for the best of what Your Prophet asked You.',
    tipsAr: [
      'حجز تصريح الروضة مسبقاً عبر تطبيق «نسك».',
      'الالتزام بالوقت المحدد والدعاء بما تيسر من خيري الدنيا والآخرة.',
      'استشعار القرب والفضل العظيم للصلاة في هذا البقعة الشريفة.'
    ],
    tipsEn: [
      'Book your permit ahead via Nusuk platform.',
      'Arrive on time for your slot and engage in sincere Dua.',
      'Cherish the blessed opportunity in the Garden of Paradise.'
    ]
  },
  {
    id: 'ziyarah_3_salam',
    category: 'ziyarah',
    stepNum: '03',
    titleAr: 'السلام على النبي ﷺ وصاحبيه أبا بكر وعمر',
    titleEn: 'Greetings to the Prophet ﷺ & Companions',
    locationAr: 'المواجهة الشريفة بالمسجد النبوي',
    locationEn: 'Prophet\'s Grave Corridor (Al-Muwajahah)',
    descAr: 'المرور أمام الحجرة الشريفة بأدب ووقار وإلقاء السلام على سيدنا رسول الله ﷺ، ثم السلام على الخليفة أبي بكر الصديق، ثم الفاروق عمر بن الخطاب رضي الله عنهما.',
    descEn: 'Walking past the Noble Chamber offering greetings to Prophet Muhammad PBUH, Abu Bakr Al-Siddiq & Umar Ibn Al-Khattab.',
    duaAr: '«السَّلاَمُ عَلَيْكَ يَا رَسُولَ اللَّهِ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ، أَشْهَدُ أَنَّكَ بَلَّغْتَ الرِّسَالَةَ وَأَدَّيْتَ الأَمَانَةَ»',
    transliteration: 'As-salāmu ‘alayka yā Rasūlallāh...',
    duaEn: 'Peace be upon you O Messenger of Allah, I bear witness you conveyed the message...',
    tipsAr: [
      'السلام بصوت خفيض دون رفع الصوت أو التمسح بالجدران.',
      'تبليغ سلام من أوصاك بالسلام على النبي ﷺ.',
      'المضي بسكينة لإفساح المجال للزوار الآخرين.'
    ],
    tipsEn: [
      'Greet with a respectful soft voice without overcrowding.',
      'Convey greetings from loved ones who asked you to greet the Prophet PBUH.',
      'Move forward smoothly to allow room for other pilgrims.'
    ]
  },
  {
    id: 'ziyarah_4_quba_uhud',
    category: 'ziyarah',
    stepNum: '04',
    titleAr: 'زيارة مسجد قباء وجبل أحد والبقيع',
    titleEn: 'Visiting Quba Mosque, Mount Uhud & Baqi\'',
    locationAr: 'المدينة المنورة - المعالم التاريخية',
    locationEn: 'Madinah Historical Sacred Sites',
    descAr: 'التطهر والصلاة في مسجد قباء (عُدِلَت صلاة فيه كأجر عُمْرَة)، وزيارة شهداء أحد وجبل أحد («جبل يحبنا ونحبه»)، وزيارة مقبرة البقيع.',
    descEn: 'Praying in Quba Mosque (equivalent to Umrah reward), visiting Mount Uhud & Baqi\' cemetery.',
    duaAr: '«السَّلاَمُ عَلَيْكُمْ دَارَ قَوْمٍ مُؤْمِنِينَ، وَإِنَّا إِنْ شَاءَ اللَّهُ بِكُمْ لاَحِقُونَ، يَرْحَمُ اللَّهُ الْمُسْتَقْدِمِينَ مِنَّا وَالْمُسْتَأْخِرِينَ»',
    transliteration: 'As-salāmu ‘alaykum dāra qawmim mu\'minīn...',
    duaEn: 'Peace be upon you O dwellers of the believers\' abode...',
    tipsAr: [
      'التطهر في المنزل أو الفندق قبل الذهاب لمسجد قباء لنيل أجر العمرة.',
      'السلام على شهداء أحد والدعاء لسيدنا حمزة بن عبد المطلب والشهداء.',
      'استشعار السيرة النبوية العطرة ومسيرة الصحابة الكرام.'
    ],
    tipsEn: [
      'Purify yourself at hotel before Quba Mosque to gain Umrah reward.',
      'Send greetings to Martyrs of Uhud including Hamzah R.A.',
      'Reflect on the noble prophetic history.'
    ]
  }
];

export const JourneyTrackerView: React.FC<JourneyTrackerViewProps> = ({
  language,
  onBack,
  onSendToWhatsapp,
}) => {
  const isAr = language.code === 'ar';

  // Category State
  const [activeTab, setActiveTab] = useState<'umrah' | 'hajj' | 'ziyarah'>('umrah');

  // Completed items dictionary: { [stepId]: { completed: boolean, timestamp: string, notes: string } }
  const [progressState, setProgressState] = useState<Record<string, { completed: boolean; timestamp?: string; notes?: string }>>(() => {
    const cached = getFromCache<Record<string, { completed: boolean; timestamp?: string; notes?: string }>>(
      CACHE_KEYS.JOURNEY_TRACKER,
      {}
    );
    return cached.data || {};
  });

  // Expanded card state
  const [expandedStepId, setExpandedStepId] = useState<string | null>(null);

  // Notes edit modal or inline text
  const [editingNoteStepId, setEditingNoteStepId] = useState<string | null>(null);
  const [tempNoteText, setTempNoteText] = useState<string>('');

  // Audio Playback state (TTS)
  const [playingDuaId, setPlayingDuaId] = useState<string | null>(null);

  // Sync to local storage
  useEffect(() => {
    saveToCache(CACHE_KEYS.JOURNEY_TRACKER, progressState);
  }, [progressState]);

  // Current steps list based on active tab
  const currentSteps =
    activeTab === 'umrah'
      ? UMRAH_STEPS
      : activeTab === 'hajj'
      ? HAJJ_STEPS
      : ZIYARAH_STEPS;

  // Stats calculation
  const completedCount = currentSteps.filter((s) => progressState[s.id]?.completed).length;
  const totalCount = currentSteps.length;
  const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Total journey stats across all categories
  const allSteps = [...UMRAH_STEPS, ...HAJJ_STEPS, ...ZIYARAH_STEPS];
  const totalAllCompleted = allSteps.filter((s) => progressState[s.id]?.completed).length;

  // Toggle step completion status
  const handleToggleStep = (stepId: string) => {
    setProgressState((prev) => {
      const current = prev[stepId] || { completed: false };
      const nextCompleted = !current.completed;
      const updated = {
        ...prev,
        [stepId]: {
          ...current,
          completed: nextCompleted,
          timestamp: nextCompleted
            ? new Date().toLocaleTimeString(isAr ? 'ar-SA' : 'en-US', { hour: '2-digit', minute: '2-digit' }) +
              ' - ' +
              new Date().toLocaleDateString(isAr ? 'ar-SA' : 'en-US', { month: 'short', day: 'numeric' })
            : undefined,
        },
      };
      return updated;
    });
  };

  // Save Note handler
  const handleSaveNote = (stepId: string) => {
    setProgressState((prev) => ({
      ...prev,
      [stepId]: {
        ...(prev[stepId] || { completed: false }),
        notes: tempNoteText.trim(),
      },
    }));
    setEditingNoteStepId(null);
    setTempNoteText('');
  };

  // Reset category handler
  const handleResetCategory = () => {
    if (
      window.confirm(
        isAr
          ? 'هل أنت تأكد من رغبتك في إعادة ضبط وتصفير التقدم لهذا القسم؟'
          : 'Are you sure you want to reset progress for this category?'
      )
    ) {
      setProgressState((prev) => {
        const next = { ...prev };
        currentSteps.forEach((s) => {
          delete next[s.id];
        });
        return next;
      });
    }
  };

  // Share via WhatsApp
  const handleShareReport = () => {
    const categoryTitle =
      activeTab === 'umrah'
        ? (isAr ? 'مناسك العمرة' : 'Umrah Pilgrimage')
        : activeTab === 'hajj'
        ? (isAr ? 'مناسك الحج' : 'Hajj Pilgrimage')
        : (isAr ? 'زيارة المدينة المنورة' : 'Madinah Ziyarah');

    let msg = `🕋 *${isAr ? 'تقرير تتبع رحلة الإيمانيات' : 'My Pilgrimage Journey Progress'} - ${categoryTitle}*\n`;
    msg += `📊 *${isAr ? 'نسبة الإنجاز' : 'Completion'}:* ${percent}% (${completedCount}/${totalCount} ${isAr ? 'خطوة' : 'steps'})\n\n`;

    currentSteps.forEach((s, idx) => {
      const isDone = progressState[s.id]?.completed;
      const note = progressState[s.id]?.notes;
      const timestamp = progressState[s.id]?.timestamp;

      msg += `${isDone ? '✅' : '⏳'} *${s.stepNum}. ${isAr ? s.titleAr : s.titleEn}*\n`;
      msg += `📍 _${isAr ? s.locationAr : s.locationEn}_\n`;
      if (isDone && timestamp) {
        msg += `🕒 ${isAr ? 'تم في' : 'Completed'}: ${timestamp}\n`;
      }
      if (note) {
        msg += `📝 _${isAr ? 'ملاحظة' : 'Note'}_: ${note}\n`;
      }
      msg += `\n`;
    });

    msg += `✨ ${isAr ? 'تم التتبع عبر منصة عرفات لخدمة ضيوف الرحمن 🕌' : 'Tracked via Arafat Pilgrimage Platform 🕌'}`;

    if (onSendToWhatsapp) {
      onSendToWhatsapp(msg);
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
    }
  };

  // Text-To-Speech for Dua
  const handlePlayTTS = (stepId: string, text: string) => {
    if (!('speechSynthesis' in window)) {
      alert(isAr ? 'عذراً، متصفحك لا يدعم قراءة النصوص صوتياً.' : 'TTS not supported on browser.');
      return;
    }

    if (playingDuaId === stepId) {
      window.speechSynthesis.cancel();
      setPlayingDuaId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ar-SA';
    utterance.rate = 0.85;

    utterance.onend = () => setPlayingDuaId(null);
    utterance.onerror = () => setPlayingDuaId(null);

    setPlayingDuaId(stepId);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 bg-[#021811]/95 text-[#F8F3E7] rounded-3xl border-2 border-[#D4AF37] shadow-[0_20px_50px_rgba(0,0,0,0.9)] my-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#D4AF37]/30 pb-4 mb-6">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#D4AF37]/60 bg-[#03291F] hover:bg-[#073D2F] text-[#D4AF37] transition-all text-sm font-bold cursor-pointer shadow-md"
        >
          <ArrowRight className={`w-4 h-4 ${!isAr ? 'rotate-180' : ''}`} />
          <span>{isAr ? 'العودة للرئيسية' : 'Back to Home'}</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/20 border-2 border-[#D4AF37] flex items-center justify-center text-[#D4AF37] shadow-lg">
            <Award className="w-6 h-6 text-[#D4AF37]" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-[#D4AF37]">
              {isAr ? 'مُتتبّع خطوات رحلة العمرة والحج' : 'Hajj & Umrah Journey Tracker'}
            </h2>
            <p className="text-xs text-[#F8F3E7]/75">
              {isAr
                ? 'سجّل إنجاز كل خطوة في مناسكك، وحفِظ أدعيتك وملاحظاتك الشخصية أوفلاين'
                : 'Mark completed steps, store notes & authentic supplications offline'}
            </p>
          </div>
        </div>

        {/* Global summary badge */}
        <div className="hidden sm:flex items-center gap-2 bg-[#03291F] border border-[#D4AF37]/50 px-3.5 py-1.5 rounded-2xl text-xs font-bold text-[#D4AF37]">
          <Sparkles className="w-4 h-4 text-[#D4AF37]" />
          <span>
            {isAr ? `إجمالي المكتمل: ${totalAllCompleted} من ${allSteps.length}` : `Total Completed: ${totalAllCompleted}/${allSteps.length}`}
          </span>
        </div>
      </div>

      {/* Mode Selector Tabs */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-6 bg-[#01140E] p-1.5 rounded-2xl border border-[#D4AF37]/40">
        {[
          {
            id: 'umrah',
            titleAr: '🕋 مناسك العمرة',
            titleEn: '🕋 Umrah Rituals',
            subtitleAr: '4 خطوات رئيسية',
            subtitleEn: '4 Main Steps',
          },
          {
            id: 'hajj',
            titleAr: '⛺ مناسك الحج',
            titleEn: '⛺ Hajj Rituals',
            subtitleAr: '6 مراحل يومية',
            subtitleEn: '6 Daily Stages',
          },
          {
            id: 'ziyarah',
            titleAr: '💚 زيارة المدينة',
            titleEn: '💚 Madinah Ziyarah',
            subtitleAr: '4 معالم مباركة',
            subtitleEn: '4 Sacred Landmarks',
          },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 px-2 sm:px-4 rounded-xl text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                isActive
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#AA820A] text-[#02130D] font-black shadow-lg scale-[1.02]'
                  : 'text-[#F8F3E7]/80 hover:text-white hover:bg-[#03291F]'
              }`}
            >
              <span className="text-xs sm:text-base font-bold">{isAr ? tab.titleAr : tab.titleEn}</span>
              <span className={`text-[10px] opacity-80 mt-0.5 ${isActive ? 'text-[#02130D]' : 'text-[#D4AF37]'}`}>
                {isAr ? tab.subtitleAr : tab.subtitleEn}
              </span>
            </button>
          );
        })}
      </div>

      {/* Progress Stats Card */}
      <div className="bg-[#03291F] border-2 border-[#D4AF37]/60 rounded-2xl p-4 sm:p-5 mb-8 shadow-inner">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
          <div>
            <div className="flex items-center gap-2 text-[#D4AF37] text-xs font-bold mb-1">
              <Calendar className="w-4 h-4" />
              <span>
                {activeTab === 'umrah'
                  ? isAr ? 'تقدم رحلة العمرة' : 'Umrah Journey Progress'
                  : activeTab === 'hajj'
                  ? isAr ? 'تقدم رحلة الحج المبرور' : 'Hajj Journey Progress'
                  : isAr ? 'تقدم زيارة طيبة الطيبة' : 'Madinah Ziyarah Progress'}
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-white">
              {percent === 100
                ? isAr ? '🎉 اكتملت هذه الرحلة المباركة تقبل الله طاعتكم!' : '🎉 Pilgrimage Completed! May Allah Accept!'
                : percent >= 50
                ? isAr ? 'قطعتم أكثر من نصف مناسك هذه الرحلة!' : 'Over halfway through your pilgrimage!'
                : isAr ? 'بداية مباركة على طريق النور' : 'A blessed beginning on your sacred journey'}
            </h3>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleShareReport}
              className="py-2 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>{isAr ? 'مشاركة التقرير' : 'Share Report'}</span>
            </button>

            <button
              type="button"
              onClick={handleResetCategory}
              className="py-2 px-3 rounded-xl border border-[#D4AF37]/40 bg-[#02130D] hover:bg-red-950/50 text-[#F8F3E7]/70 hover:text-red-300 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
              title={isAr ? 'إعادة الضبط' : 'Reset Category'}
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Live Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs font-bold text-[#D4AF37]">
            <span>{isAr ? `إنجاز ${completedCount} من ${totalCount} خطوات` : `${completedCount} of ${totalCount} steps completed`}</span>
            <span className="text-sm font-black">{percent}%</span>
          </div>
          <div className="w-full h-3.5 bg-[#01140E] rounded-full overflow-hidden border border-[#D4AF37]/30 p-0.5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percent}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-[#D4AF37] via-amber-400 to-emerald-400 rounded-full shadow-[0_0_12px_rgba(212,175,55,0.8)]"
            />
          </div>
        </div>
      </div>

      {/* Steps List */}
      <div className="space-y-4">
        {currentSteps.map((step, index) => {
          const stepData = progressState[step.id] || { completed: false };
          const isCompleted = stepData.completed;
          const isExpanded = expandedStepId === step.id;
          const isEditingNote = editingNoteStepId === step.id;

          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className={`rounded-2xl border-2 transition-all overflow-hidden shadow-lg ${
                isCompleted
                  ? 'bg-[#032d22] border-emerald-500/80'
                  : 'bg-[#03291F]/80 border-[#D4AF37]/50 hover:border-[#D4AF37]'
              }`}
            >
              {/* Header row of the step */}
              <div className="p-4 sm:p-5 flex items-start gap-3.5 sm:gap-4">
                {/* Checkbox Button */}
                <button
                  type="button"
                  onClick={() => handleToggleStep(step.id)}
                  className={`shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center transition-all cursor-pointer ${
                    isCompleted
                      ? 'bg-emerald-500 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.8)] scale-105'
                      : 'border-2 border-[#D4AF37] bg-[#02130D] text-[#D4AF37] hover:scale-110'
                  }`}
                  title={isCompleted ? (isAr ? 'علامة مكتمل' : 'Completed') : (isAr ? 'حدد كمكتمل' : 'Mark completed')}
                >
                  {isCompleted ? <Check className="w-5 h-5 sm:w-6 sm:h-6 stroke-[3]" /> : <Circle className="w-5 h-5 opacity-40" />}
                </button>

                {/* Step Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#02130D] border border-[#D4AF37]/60 text-[#D4AF37] text-[11px] font-black">
                      {step.stepNum}
                    </span>
                    {step.dayNumber && (
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/50 text-amber-300 text-[11px] font-bold">
                        {step.dayNumber}
                      </span>
                    )}
                    <span className="text-xs text-[#D4AF37] flex items-center gap-1 font-bold">
                      <MapPin className="w-3.5 h-3.5" />
                      <span className="truncate max-w-[200px]">{isAr ? step.locationAr : step.locationEn}</span>
                    </span>

                    {isCompleted && stepData.timestamp && (
                      <span className="text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-md flex items-center gap-1 ml-auto">
                        <Clock className="w-3 h-3" />
                        <span>{stepData.timestamp}</span>
                      </span>
                    )}
                  </div>

                  <h4
                    onClick={() => setExpandedStepId(isExpanded ? null : step.id)}
                    className={`text-base sm:text-lg font-black cursor-pointer transition-colors ${
                      isCompleted ? 'text-emerald-200 line-through decoration-emerald-500/50' : 'text-white hover:text-[#D4AF37]'
                    }`}
                  >
                    {isAr ? step.titleAr : step.titleEn}
                  </h4>

                  <p className="text-xs sm:text-sm text-[#F8F3E7]/80 mt-1 leading-relaxed">
                    {isAr ? step.descAr : step.descEn}
                  </p>

                  {/* Personal Note Preview if exists */}
                  {stepData.notes && !isEditingNote && (
                    <div className="mt-2 p-2.5 rounded-xl bg-[#01140E] border border-amber-500/30 text-xs text-amber-200/90 flex items-start gap-2">
                      <MessageSquare className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <span className="font-bold text-amber-300 block mb-0.5">{isAr ? 'ملاحظاتي الشخصية:' : 'My Personal Note:'}</span>
                        <p className="italic">{stepData.notes}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingNoteStepId(step.id);
                          setTempNoteText(stepData.notes || '');
                        }}
                        className="text-amber-400 hover:text-white p-1"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {/* Note Editing Form */}
                  {isEditingNote && (
                    <div className="mt-3 p-3 rounded-xl bg-[#01140E] border border-[#D4AF37]/60 space-y-2">
                      <label className="text-xs font-bold text-[#D4AF37] block">
                        {isAr ? 'اكتب ذكرياتك أو أدعيتك الشخصية لهذه الخطوة:' : 'Write your personal notes or prayers for this step:'}
                      </label>
                      <textarea
                        value={tempNoteText}
                        onChange={(e) => setTempNoteText(e.target.value)}
                        placeholder={isAr ? 'مثال: دعوت لأسرتي بالصحة والبركة عند الصفا والمروة...' : 'Example: Made prayers for my family at Safa and Marwah...'}
                        className="w-full h-20 p-2.5 rounded-lg bg-[#021811] border border-[#D4AF37]/30 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37]"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingNoteStepId(null)}
                          className="px-3 py-1 rounded-lg text-xs font-bold text-slate-400 hover:text-white"
                        >
                          {isAr ? 'إلغاء' : 'Cancel'}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSaveNote(step.id)}
                          className="px-4 py-1 rounded-lg bg-[#D4AF37] text-[#02130D] font-black text-xs hover:bg-amber-400"
                        >
                          {isAr ? 'حفظ الملاحظة' : 'Save Note'}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Actions Row */}
                  <div className="flex flex-wrap items-center gap-3 mt-3 pt-2 border-t border-[#D4AF37]/20 text-xs">
                    <button
                      type="button"
                      onClick={() => setExpandedStepId(isExpanded ? null : step.id)}
                      className="text-[#D4AF37] font-bold flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>{isExpanded ? (isAr ? 'إخفاء التفاصيل والدعاء' : 'Hide Details & Dua') : (isAr ? 'عرض الدعاء المأثور والإرشادات' : 'View Supplication & Tips')}</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>

                    {!stepData.notes && !isEditingNote && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingNoteStepId(step.id);
                          setTempNoteText('');
                        }}
                        className="text-[#F8F3E7]/70 hover:text-[#D4AF37] flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>{isAr ? 'إضافة ملاحظة شخصية' : 'Add Note'}</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handlePlayTTS(step.id, step.duaAr)}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                        playingDuaId === step.id
                          ? 'bg-amber-500 text-[#02130D] animate-pulse'
                          : 'bg-[#02130D] border border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#D4AF37]/20'
                      }`}
                    >
                      {playingDuaId === step.id ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                      <span>{playingDuaId === step.id ? (isAr ? 'إيقاف الصوت' : 'Stop Audio') : (isAr ? 'استماع للدعاء' : 'Listen Dua')}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Accordion Details section */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-[#01160E] border-t border-[#D4AF37]/40 p-4 sm:p-5 space-y-4"
                  >
                    {/* Dua Box */}
                    <div className="p-4 rounded-2xl bg-[#022117] border border-[#D4AF37]/60 space-y-2 text-center shadow-inner">
                      <span className="text-[11px] text-[#D4AF37] font-bold block uppercase tracking-wider">
                        {isAr ? 'الدعاء المأثور والذكر المستحب:' : 'Authentic Supplication:'}
                      </span>
                      <p className="text-base sm:text-lg font-serif font-black text-white leading-loose">
                        {step.duaAr}
                      </p>
                      {step.transliteration && (
                        <p className="text-xs text-amber-200/80 italic font-mono dir-ltr">
                          "{step.transliteration}"
                        </p>
                      )}
                      {step.duaEn && !isAr && (
                        <p className="text-xs text-[#F8F3E7]/80">
                          {step.duaEn}
                        </p>
                      )}
                    </div>

                    {/* Sunnah Tips */}
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-[#D4AF37] flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{isAr ? 'توصيات وإرشادات سنن أداء هذه الخطوة:' : 'Sunnah Recommendations & Tips:'}</span>
                      </span>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#F8F3E7]/85">
                        {(isAr ? step.tipsAr : step.tipsEn).map((tip, idx) => (
                          <li key={idx} className="flex items-start gap-2 bg-[#021811] p-2.5 rounded-xl border border-[#D4AF37]/20">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Completion Mubarak Banner if all done */}
      {percent === 100 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-8 p-6 rounded-3xl bg-gradient-to-r from-amber-500/20 via-[#D4AF37]/30 to-emerald-500/20 border-2 border-[#D4AF37] text-center space-y-3 shadow-2xl"
        >
          <div className="w-16 h-16 mx-auto rounded-full bg-[#D4AF37] text-[#02130D] flex items-center justify-center shadow-lg">
            <Award className="w-9 h-9" />
          </div>
          <h3 className="text-2xl font-black text-[#D4AF37]">
            {isAr ? 'مبارك! أتممت جميع خطوات هذه المرحلة بحمد الله' : 'Mubarak! You Have Completed All Ritual Steps!'}
          </h3>
          <p className="text-xs sm:text-sm text-[#F8F3E7]/90 max-w-xl mx-auto leading-relaxed">
            {isAr
              ? 'تقبل الله منكم صالح الأعمال وطاعاتكم، وجعل حَجّكُم مَبْرُوراً وسَعْيَكُم مَشْكُوراً وذَنْبَكُم مَغْفُوراً.'
              : 'May Allah accept your pilgrimage, forgive your sins, and reward your devotion.'}
          </p>
          <button
            type="button"
            onClick={handleShareReport}
            className="mt-2 py-3 px-6 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-amber-500 text-[#02130D] font-black text-sm inline-flex items-center gap-2 hover:scale-105 transition-all shadow-xl cursor-pointer"
          >
            <Share2 className="w-4.5 h-4.5" />
            <span>{isAr ? 'مشاركة وثيقة الإنجاز عبر واتساب' : 'Share Completion Certificate'}</span>
          </button>
        </motion.div>
      )}
    </div>
  );
};
