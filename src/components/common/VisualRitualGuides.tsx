import React, { useState } from 'react';
import {
  Compass,
  CheckCircle2,
  MapPin,
  Calendar,
  AlertTriangle,
  ZoomIn,
  X,
  Sparkles,
  BookOpen,
  Eye,
  Layers,
  HelpCircle,
  Share2,
  Check,
  ShieldCheck,
  Building2,
  Volume2,
  Sun,
  Moon,
  Flame,
  Scissors,
  CircleDot,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';
import { LanguageOption } from '../../data/languages';
import { TTSPlayButton } from './TTSPlayButton';

interface VisualRitualStep {
  id: string;
  ritualType: 'hajj' | 'umrah';
  stepNumber: number;
  dayOrStageAr: string;
  dayOrStageEn: string;
  titleAr: string;
  titleEn: string;
  locationAr: string;
  locationEn: string;
  dateOrTimeAr: string;
  imageUrl: string;
  icon: React.ElementType;
  shortDescAr: string;
  shortDescEn: string;
  visualDetailsAr: string[];
  essentialSunanAr: string[];
  prohibitionsAr: string[];
  recommendedDuaAr: string;
}

const RITUAL_STEPS_DATA: VisualRitualStep[] = [
  // --- HAJJ RITUALS ---
  {
    id: 'hajj_1_ihram',
    ritualType: 'hajj',
    stepNumber: 1,
    dayOrStageAr: 'اليوم الأول: 8 ذو الحجة',
    dayOrStageEn: 'Day 1: 8th Dhul-Hijjah',
    titleAr: 'الإحرام والحركة إلى منى (يوم التروية)',
    titleEn: 'Ihram & Departure to Mina (Day of Tarwiyah)',
    locationAr: 'مكة المكرمة / مخيمات منى',
    locationEn: 'Makkah / Mina Camps',
    dateOrTimeAr: 'صباح يوم 8 ذو الحجة',
    imageUrl: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?auto=format&fit=crop&w=800&q=80',
    icon: Building2,
    shortDescAr: 'يحرم الحاج من مكانه بمكة بالنية والتلبية: "لبيك حجاً"، ثم يتوجه إلى مشعر منى صبيحة يوم التروية.',
    shortDescEn: 'Pilgrims assume Ihram from Makkah reciting Talbiyah, then head to Mina on Tarwiyah day.',
    visualDetailsAr: [
      'ارتداء رداء وطرحة الإحرام الأبيض للرجال والتجرد من المخيط.',
      'الاغتسال والتطيب في البدن فقط قبل عقد النية.',
      'التوجه لمخيمات منى والمبيت بها وصلاة الظهر والعصر والمغرب والعشاء وفجر 9 قصراً بلا جمع.',
      'الترديد المستمر للتلبية: "لَبَّيْكَ اللَّهُمَّ لَبَّيْك، لَبَّيْكَ لاَ شَرِيكَ لَكَ لَبَّيْك".',
    ],
    essentialSunanAr: [
      'الاغتسال والتنظف قبل الإحرام',
      'صلاة ركعتين إن لم تكن وقت فريضة',
      'الإكثار من التلبية بصوت مرتفع للرجال',
    ],
    prohibitionsAr: [
      'قص الشعر أو الأظافر بعد عقد النية',
      'لبس المخيط أو تغطية الرأس للرجال',
      'استخدام العطر أو الصابون المعطر',
    ],
    recommendedDuaAr: 'لَبَّيْكَ اللَّهُمَّ حَجًّا، لَبَّيْكَ اللَّهُمَّ لَبَّيْك، لَبَّيْكَ لا شَرِيكَ لَكَ لَبَّيْك، إِنَّ الْحَمْدَ وَالنِّعْمَةَ لَكَ وَالْمُلْك، لا شَرِيكَ لَك.',
  },
  {
    id: 'hajj_2_arafat',
    ritualType: 'hajj',
    stepNumber: 2,
    dayOrStageAr: 'اليوم الثاني: 9 ذو الحجة',
    dayOrStageEn: 'Day 2: 9th Dhul-Hijjah',
    titleAr: 'الوقوف بصعيد عرفة العظيم (ركن الحج الأكبر)',
    titleEn: 'Standing at Mount Arafat (The Pinnacle of Hajj)',
    locationAr: 'صعيد عرفات (جبل الرحمة والمسجد نمرة)',
    locationEn: 'Mount Arafat',
    dateOrTimeAr: 'من شروق الشمس حتى غروبها',
    imageUrl: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=800&q=80',
    icon: Sun,
    shortDescAr: 'الوقوف بعرفة هو أعظم أركان الحج. يتوجه الحجاج بعد الشروق ليجمعوا الظهر والعصر جمع تقديم وقصراً ويقبلوا على التضرع.',
    shortDescEn: 'Standing at Arafat is the core pillar of Hajj. Pilgrims pray Dhuhr & Asr shortened and engage in intense supplication.',
    visualDetailsAr: [
      'الانتقال من منى إلى صعيد عرفات بعد طلوع شروق شمس يوم 9 ذو الحجة.',
      'الجمع والقصر بين صلاتي الظهر والعصر بأذان وإقامتين في وقت الظهر (مسجد نمرة أو المخيمات).',
      'التفرغ التام للدعاء والذكر والاستغفار واستقبال القبلة ورفع اليدين حتى غروب الشمس.',
      'الاستمرار داخل حدود عرفات المحددة باللوحات الإرشادية الصفراء حتى غروب الكوكب.',
    ],
    essentialSunanAr: [
      'الوقوف عند جبل الرحمة إن تيسر بلا زحام',
      'الجمع بين الاستغفار والتسبيح ودعاء يوم عرفة',
      'عدم الصوم في هذا اليوم للحاج ليتفرغ للدعاء',
    ],
    prohibitionsAr: [
      'الخروج من حدود صعيد عرفات قبل غروب الشمس',
      'الاشتغال بالتصوير أو المهارشات والجدال',
      'صعود الجبل بجهد يتسبب في الإرهاق أو الخطر',
    ],
    recommendedDuaAr: 'لا إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ.',
  },
  {
    id: 'hajj_3_muzdalifah',
    ritualType: 'hajj',
    stepNumber: 3,
    dayOrStageAr: 'ليلة 10 ذو الحجة',
    dayOrStageEn: 'Night of 10th Dhul-Hijjah',
    titleAr: 'الإفاضة والمبيت بمزدلفة وجمع الحصى',
    titleEn: 'Muzdalifah Night & Collecting Pebbles',
    locationAr: 'المشعر الحرام (مزدلفة)',
    locationEn: 'Muzdalifah',
    dateOrTimeAr: 'منذ غروب شمس يوم عرفة حتى الفجر',
    imageUrl: 'https://images.unsplash.com/photo-1565552070098-0073a126b475?auto=format&fit=crop&w=800&q=80',
    icon: Moon,
    shortDescAr: 'ينطلق الحجاج بسكينة إلى مزدلفة بعد الغروب، ويصلون المغرب والعشاء جمع تأخير، ويبيتون بها ويلتقطون حصى الجمار.',
    shortDescEn: 'Pilgrims move peacefully to Muzdalifah, pray Maghrib & Isha combined, rest, and pick pebbles for Jamarat.',
    visualDetailsAr: [
      'المغادرة من عرفات إلى مزدلفة بسكينة ووقار دون استعجال.',
      'أداء صلاتي المغرب (ثلاثاً) والعشاء (ركعتين) جمع تأخير فور الوصول لمزدلفة.',
      'المبيت بمزدلفة حتى أداء صلاة الفجر، ويجوز للضعفاء والنساء الدفع بعد منتصف الليل.',
      'جمع حصى الجمار (بحجم حبة البندق أو الحمص - 7 حصيات لجمرة العقبة و21 حصية لأيام التشريق).',
    ],
    essentialSunanAr: [
      'الاستلقاء والراحة للتقوي على أعمال يوم النحر',
      'الوقوف عند المشعر الحرام للدعاء بعد الفجر حتى الإسفار',
      'الرفق في الطرقات ومساعدة كبار السن',
    ],
    prohibitionsAr: [
      'غسل الحصى بالماء (ليس من السنة)',
      'ترك صلاة المغرب والعشاء حتى يخرج وقت منتصف الليل',
      'التعجل بالخروج لمن ليس له عذر شرعي قبل منتصف الليل',
    ],
    recommendedDuaAr: 'فَإِذَا أَفَضْتُم مِّنْ عَرَفَاتٍ فَاذْكُرُوا اللَّهَ عِندَ الْمَشْعَرِ الْحَرَامِ ۖ وَاذْكُرُوهُ كَمَا هَدَاكُمْ.',
  },
  {
    id: 'hajj_4_nahr',
    ritualType: 'hajj',
    stepNumber: 4,
    dayOrStageAr: 'اليوم الثالث: 10 ذو الحجة (يوم النحر)',
    dayOrStageEn: 'Day 3: 10th Dhul-Hijjah (Eid Day)',
    titleAr: 'رمي جمرة العقبة، ذبح الهدي، الحلق، وطواف الإفاضة',
    titleEn: 'Jamarat Al-Aqaba, Sacrifice, Hair Cut & Tawaf Al-Ifadah',
    locationAr: 'منى (الجمرات) / المسجد الحرام (مكة)',
    locationEn: 'Mina Jamarat / Masjid al-Haram',
    dateOrTimeAr: 'ضحى يوم العيد (10 ذو الحجة)',
    imageUrl: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?auto=format&fit=crop&w=800&q=80',
    icon: Flame,
    shortDescAr: 'يوم أعمال الحج الكبرى: رمي جمرة العقبة بـ 7 حصيات، ثم نحر الهدي، والحلق أو التقصير (التلل الأول)، وطواف الإفاضة.',
    shortDescEn: 'The major Hajj day: Throwing Jamarat Al-Aqaba, animal sacrifice, hair cutting (First Tahallul), and Tawaf Al-Ifadah.',
    visualDetailsAr: [
      'الرمي: التوجه لجمرة العقبة الكبرى ورميها بـ 7 حصيات متعاقبة مع التكبير عند كل حصاة.',
      'النحر: ذبح هدي التمتع أو القران (أو عن طريق المنصات المعتمدة كأضاحي وسند).',
      'الحلق/التقصير: حلق جميع رأس الرجل أو تقصيره، وتقصير أنملة من شعر المرأة (وبذلك يحصل التحلل الأصغر).',
      'طواف الإفاضة والسعي: التوجه للحرم المكي لأداء طواف الإفاضة (ركن) وسعي الحج لمن لم يسعَ قبلاً.',
    ],
    essentialSunanAr: [
      'الترتيب: الرمي ثم النحر ثم الحلق ثم الطواف (ويجوز التقديم والتأخير لقوله ﷺ: افعل ولا حرج)',
      'الاستغفار والتكبير في أيام العيد',
      'التطيب ولبس الثياب المخيطة بعد التحلل الأول',
    ],
    prohibitionsAr: [
      'الرمي بالحجارة الكبيرة أو الأحذية والعلب',
      'الزحام والتدافع عند حوض الجمرة',
      'مباشرة النساء قبل التحلل الأكبر (طواف الإفاضة)',
    ],
    recommendedDuaAr: 'اللَّهُ أَكْبَرُ، اللَّهُ أَكْبَرُ، اللَّهُ أَكْبَرُ، لا إِلَهَ إِلاَّ اللَّهُ، وَاللَّهُ أَكْبَرُ اللَّهُ أَكْبَرُ وَلِلَّهِ الْحَمْدُ.',
  },
  {
    id: 'hajj_5_tashreeq',
    ritualType: 'hajj',
    stepNumber: 5,
    dayOrStageAr: 'الأيام 11 و12 و13 ذو الحجة',
    dayOrStageEn: 'Days 11, 12 & 13 Dhul-Hijjah',
    titleAr: 'المبيت بمنى ورمي الجمرات الثلاث (أيام التشريق)',
    titleEn: 'Mina Stay & Throwing 3 Jamarat (Days of Tashreeq)',
    locationAr: 'مشعر منى (منشأة الجمرات)',
    locationEn: 'Mina Jamarat Facility',
    dateOrTimeAr: 'بعد زوال الشمس (صلاة الظهر) كل يوم',
    imageUrl: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=800&q=80',
    icon: CircleDot,
    shortDescAr: 'المبيت بمنى ليالي أيام التشريق، ورمي الجمرات الثلاث بالترتيب (الصغرى ثم الوسطى ثم العقبة) بـ 7 حصيات لكل منها بعد الزوال.',
    shortDescEn: 'Overnight stay in Mina and throwing 7 pebbles at each of the 3 Jamarat (Small, Medium, Big) after Dhuhr.',
    visualDetailsAr: [
      'المبيت بمخيمات منى معظم الليل في ليلتي 11 و12 (وليلة 13 للمتعجلين).',
      'يبدأ وقت الرمي بعد زوال الشمس (دخول وقت الظهر).',
      'الرمي بالترتيب: 1. الجمرة الصغرى (7 حصيات + دعاء) -> 2. الجمرة الوسطى (7 حصيات + دعاء) -> 3. جمرة العقبة (7 حصيات دون دعاء بعدها).',
      'التعجل: يجوز للمتعجل الخروج من منى قبل غروب شمس يوم 12 ذو الحجة.',
    ],
    essentialSunanAr: [
      'إطالة الوقوف والدعاء بعد رمي الجمرة الصغرى والوسطى مستقبل القبلة',
      'الإكثار من الأكل والشرب وذكر الله تعالى ("أيام أكل وشرب وذكر لله")',
      'التزام مسارات التفويج المحددة لمنع الازدحام',
    ],
    prohibitionsAr: [
      'رمي الجمرات قبل زوال الشمس في أيام التشريق',
      'البقاء في منى بعد غروب شمس يوم 12 لمن أراد التعجل',
      'ترك المبيت بمنى لغير أصحاب الأعذار والسقاية والرعاة',
    ],
    recommendedDuaAr: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ.',
  },
  {
    id: 'hajj_6_wadaa',
    ritualType: 'hajj',
    stepNumber: 6,
    dayOrStageAr: 'ختام المناسك قبل المغادرة',
    dayOrStageEn: 'Final Step Before Leaving Makkah',
    titleAr: 'طواف الوداع (آخر العهد بالبيت الحرام)',
    titleEn: 'Tawaf Al-Wadaa (Farewell Tawaf)',
    locationAr: 'المسجد الحرام - مكة المكرمة',
    locationEn: 'Masjid al-Haram, Makkah',
    dateOrTimeAr: 'قبل السفر والمغادرة مباشرة',
    imageUrl: 'https://images.unsplash.com/photo-1565552070098-0073a126b475?auto=format&fit=crop&w=800&q=80',
    icon: Compass,
    shortDescAr: 'طواف الوداع واجب على كل حاج قبل المغادرة من مكة المكرمة ليكون آخر عهده بالبيت الحرام (ويُعفى منه الحائض والنفساء).',
    shortDescEn: 'Farewell Tawaf is mandatory before departing Makkah as the final act of reverence.',
    visualDetailsAr: [
      'التوجه للحرم المكي بعد حزم الأمتعة والاستعداد التام للسفر.',
      'الطواف حول الكعبة المشرفة 7 أشواط كاملة خفيفة بدون رمل ولا انطباع.',
      'صلاة ركعتين خلف مقام إبراهيم والمغادرة مباشرة دون المكث للشراء أو النوم.',
      'الدعاء بأن يرزق الله العبد العودة للبيت الحرام وأن يتقبل منه حجته.',
    ],
    essentialSunanAr: [
      'الشرب من ماء زمزم والتضلع منه قبل المغادرة',
      'الخروج بالسكينة والحمد والثناء على الله',
    ],
    prohibitionsAr: [
      'المكث في مكة بعد طواف الوداع (وإذا أقام فيجب إعادته)',
      'المغادرة دون أداء طواف الوداع لغير الحائض والنفساء',
    ],
    recommendedDuaAr: 'اللَّهُمَّ لا تَجْعَلْ هَذَا آخِرَ الْعَهْدِ بِبَيْتِكَ الْعَتِيقِ، وَارْزُقْنِي الْعَوْدَةَ إِلَيْهِ مَرَّاتٍ عَدِيدَةً.',
  },

  // --- UMRAH RITUALS ---
  {
    id: 'umrah_1_ihram',
    ritualType: 'umrah',
    stepNumber: 1,
    dayOrStageAr: 'الخطوة الأولى',
    dayOrStageEn: 'Step 1',
    titleAr: 'الإحرام والنية من الميقات',
    titleEn: 'Ihram & Niyyah from Miqat',
    locationAr: 'المواقيت المكانية (ذو الحليفة، الجحفة، قرن المنازل...)',
    locationEn: 'Designated Miqat Locations',
    dateOrTimeAr: 'عند الوصول للميقات قبل دخول الحرم',
    imageUrl: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?auto=format&fit=crop&w=800&q=80',
    icon: Building2,
    shortDescAr: 'الاغتسال والتنظف وارتداء ثياب الإحرام، ثم النية والتلبية: "لبيك اللهم عمرة".',
    shortDescEn: 'Perform Ghusl, wear Ihram garments, set Niyyah and recite Talbiyah.',
    visualDetailsAr: [
      'خلع الملابس العادية وارتداء إزار ورداء أبيضين غير محيطين للجسم (للرجال).',
      'المرأة تحرم بملابسها العادية الساترة الشريعة دون التبرج أو لبس القفازين والنيقاب.',
      'قول التلبية: "لَبَّيْكَ اللَّهُمَّ عُمْرَةً".',
    ],
    essentialSunanAr: ['قص الأظافر وحلق العانة قبل الإحرام', 'التطيب في البدن فقط قبل النية'],
    prohibitionsAr: ['لبس الجوارب أو الخفين للرجال', 'استخدام الطيب بعد النية'],
    recommendedDuaAr: 'لَبَّيْكَ اللَّهُمَّ عُمْرَةً، لَبَّيْكَ اللَّهُمَّ لَبَّيْك، لَبَّيْكَ لا شَرِيكَ لَكَ لَبَّيْك.',
  },
  {
    id: 'umrah_2_tawaf',
    ritualType: 'umrah',
    stepNumber: 2,
    dayOrStageAr: 'الخطوة الثانية',
    dayOrStageEn: 'Step 2',
    titleAr: 'الطواف حول الكعبة المشرفة (7 أشواط)',
    titleEn: 'Tawaf Around the Holy Kaaba (7 Laps)',
    locationAr: 'صحن المطاف - المسجد الحرام',
    locationEn: 'Mataf - Masjid al-Haram',
    dateOrTimeAr: 'فور الوصول للمسجد الحرام',
    imageUrl: 'https://images.unsplash.com/photo-1565552070098-0073a126b475?auto=format&fit=crop&w=800&q=80',
    icon: Compass,
    shortDescAr: 'الطواف 7 أشواط تبدأ من الحجر الأسود وتنتهي عنده، مع جعل الكعبة عن اليسار.',
    shortDescEn: 'Circumambulate the Kaaba 7 times counter-clockwise starting at the Black Stone.',
    visualDetailsAr: [
      'الاضطباع للرجال (كشف الكتف الأيمن) أثناء الطواف.',
      'الاستلام أو الإشارة للحجر الأسود بالتكبير: "بسم الله والله أكبر".',
      'الرَّمَل (الإسراع في المشي) في الأشواط الثلاثة الأولى للرجال.',
    ],
    essentialSunanAr: ['الدعاء بما يشاء الحاج في كل شوط', 'ختام كل شوط بدعاء: "ربنا آتنا في الدنيا حسنة..."'],
    prohibitionsAr: ['قطع الطواف بدون عذر شرعي', 'المزاحمة الشديدة عند تقبيل الحجر الأسود'],
    recommendedDuaAr: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ.',
  },
  {
    id: 'umrah_3_sai',
    ritualType: 'umrah',
    stepNumber: 3,
    dayOrStageAr: 'الخطوة الثالثة',
    dayOrStageEn: 'Step 3',
    titleAr: 'السعي بين الصفا والمروة (7 أشواط)',
    titleEn: 'Sa\'i Between Safa & Marwah (7 Laps)',
    locationAr: 'المسعى - المسجد الحرام',
    locationEn: 'Mas\'a - Masjid al-Haram',
    dateOrTimeAr: 'بعد صلاة ركعتي الطواف والشرب من زمزم',
    imageUrl: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=800&q=80',
    icon: CircleDot,
    shortDescAr: 'السعي بين جبل الصفا وجبل المروة 7 أشواط (الصفا إلى المروة شوط، والمروة إلى الصفا شوط).',
    shortDescEn: 'Walk 7 laps between Mount Safa and Mount Marwah.',
    visualDetailsAr: [
      'البداية بالصعود على الصفا وقراءة الآية: "إن الصفا والمروة من شعائر الله...".',
      'الهرولة بين العلمين الأخضرين للرجال فقط.',
      'الختام في الشوط السابع عند جبل المروة.',
    ],
    essentialSunanAr: ['استقبال القبلة عند الصفا والمروة والدعاء3 مرات', 'الإكثار من الذكر والتسبيح'],
    prohibitionsAr: ['الهرولة للنساء بين العلمين الأخضرين', 'العد الخطأ للأشواط'],
    recommendedDuaAr: 'إِنَّ الصَّفَا وَالْمَرُوَةَ مِن شَعَائِرِ اللَّهِ ۖ أَبْدَأُ بِمَا بدأَ اللَّهُ بِهِ.',
  },
  {
    id: 'umrah_4_halq',
    ritualType: 'umrah',
    stepNumber: 4,
    dayOrStageAr: 'الخطوة الرابعة والختام',
    dayOrStageEn: 'Step 4 (Final)',
    titleAr: 'الحلق أو التقصير (التحلل من العمرة)',
    titleEn: 'Halq or Taqsir (Completion of Umrah)',
    locationAr: 'صالونات الحلاقة المعتمدة بالمحيط',
    locationEn: 'Barber Shops near Haram',
    dateOrTimeAr: 'فور الفراغ من الشوط السابع بالسعي',
    imageUrl: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?auto=format&fit=crop&w=800&q=80',
    icon: Scissors,
    shortDescAr: 'حلق جميع الرأس أو تقصيره للرجال (والحلق أفضل)، وتقصير قدر أنملة للنساء لتمام التحلل.',
    shortDescEn: 'Shave or trim hair for men, trim fingertips length for women to complete Umrah.',
    visualDetailsAr: [
      'حلق رأس الرجل بالكامل بالموس أو تقصير شعر الرأس كاملاً بانتظام.',
      'تقصير المرأة قدر أنملة (حوالي 2 سم) من طرف ضفائر شعرها.',
      'بذلك تمت العمرة بحمد الله وتتحلل من جميع محظورات الإحرام.',
    ],
    essentialSunanAr: ['بدء الحلق بالجانب الأيمن من الرأس', 'شكر الله والثناء عليه لتمام العمرة'],
    prohibitionsAr: ['تقصير بعض شعرات معدودة دون تعميم الرأس', 'التحلل قبل الفراغ من السعي'],
    recommendedDuaAr: 'اللَّهُمَّ اغْفِرْ لِلْمُحَلِّقِينَ وَالْمُقَصِّرِينَ، وَتَقَبَّلْ مِنَّا عُمْرَتَنَا يَا أَرْحَمَ الرَّاحِمِينَ.',
  },
];

interface VisualRitualGuidesProps {
  language: LanguageOption;
  onToggleTTS?: (track: { id: string; title: string; text: string; category?: string; subTitle?: string }) => void;
  currentTTSTrackId?: string;
  isTTSPlaying?: boolean;
}

export const VisualRitualGuides: React.FC<VisualRitualGuidesProps> = ({
  language,
  onToggleTTS,
  currentTTSTrackId,
  isTTSPlaying = false,
}) => {
  const isAr = language.code === 'ar';

  const [filterType, setFilterType] = useState<'all' | 'hajj' | 'umrah'>('all');
  const [selectedStep, setSelectedStep] = useState<VisualRitualStep | null>(null);
  const [activeTabSection, setActiveTabSection] = useState<'visual_timeline' | 'checklist' | 'prohibitions'>('visual_timeline');

  const filteredSteps = RITUAL_STEPS_DATA.filter((step) => {
    if (filterType === 'hajj') return step.ritualType === 'hajj';
    if (filterType === 'umrah') return step.ritualType === 'umrah';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner & Control Bar */}
      <div className="bg-[#03291F] border border-[#D4AF37]/50 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#D4AF37] text-[#02130D] flex items-center justify-center font-black text-xl shadow-md shrink-0">
            <Eye className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg sm:text-xl font-black text-[#D4AF37]">
                {isAr ? 'الدليل البصري المصور لمناسك الحج والعمرة' : 'Visual Illustrated Hajj & Umrah Guide'}
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
                {isAr ? 'مدعوم بالأوفلاين والصوت' : 'Offline & Audio Ready'}
              </span>
            </div>
            <p className="text-xs text-[#F8F3E7]/80 mt-1 leading-relaxed">
              {isAr
                ? 'شرح مصور بالأيقونات واللوحات التوضيحية لخطوات المناسك، الموقيت، المحظورات، والأدعية المأثورة خطوة بخطوة.'
                : 'Step-by-step visual diagram guide with photos, icons, rulings, and audio supplications.'}
            </p>
          </div>
        </div>

        {/* Filter Switcher */}
        <div className="flex items-center gap-1.5 bg-[#01140E] p-1.5 rounded-xl border border-[#D4AF37]/30 self-stretch md:self-auto justify-center">
          {[
            { id: 'all', labelAr: 'الكل (10 خطوات)', labelEn: 'All Steps (10)' },
            { id: 'hajj', labelAr: 'مناسك الحج 🕋', labelEn: 'Hajj Steps 🕋' },
            { id: 'umrah', labelAr: 'صفة العمرة 🕌', labelEn: 'Umrah Steps 🕌' },
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => setFilterType(btn.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filterType === btn.id
                  ? 'bg-[#D4AF37] text-[#02130D] shadow-md'
                  : 'text-[#F8F3E7]/70 hover:text-white hover:bg-[#03291F]'
              }`}
            >
              {isAr ? btn.labelAr : btn.labelEn}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Visual Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredSteps.map((step) => {
          const IconComponent = step.icon;
          const trackId = `visual_step_${step.id}`;
          const isHajj = step.ritualType === 'hajj';

          return (
            <div
              key={step.id}
              className="group bg-[#01140E] border border-[#D4AF37]/40 rounded-3xl overflow-hidden hover:border-[#D4AF37] transition-all shadow-lg flex flex-col"
            >
              {/* Card Image Banner */}
              <div className="relative h-44 w-full overflow-hidden bg-[#03291F]">
                <img
                  src={step.imageUrl}
                  alt={isAr ? step.titleAr : step.titleEn}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#01140E] via-[#01140E]/40 to-transparent" />

                {/* Badge Overlay */}
                <div className="absolute top-3 right-3 flex items-center gap-2">
                  <span
                    className={`px-2.5 py-1 rounded-xl text-[11px] font-black border shadow-lg ${
                      isHajj
                        ? 'bg-[#D4AF37] text-[#02130D] border-[#D4AF37]'
                        : 'bg-emerald-600 text-white border-emerald-400'
                    }`}
                  >
                    {isHajj ? (isAr ? 'منسك حج' : 'Hajj') : (isAr ? 'عمرة' : 'Umrah')} #{step.stepNumber}
                  </span>
                </div>

                <div className="absolute top-3 left-3 bg-[#02130D]/80 backdrop-blur-md px-2.5 py-1 rounded-xl border border-[#D4AF37]/30 text-[10px] text-[#D4AF37] font-bold flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{step.dayOrStageAr}</span>
                </div>

                {/* Zoom Clickable Trigger */}
                <button
                  type="button"
                  onClick={() => setSelectedStep(step)}
                  className="absolute bottom-3 right-3 p-2 rounded-xl bg-[#02130D]/90 border border-[#D4AF37]/50 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#02130D] transition-all cursor-pointer shadow-md flex items-center gap-1.5 text-xs font-bold"
                >
                  <ZoomIn className="w-4 h-4" />
                  <span>{isAr ? 'عرض التفاصيل' : 'Expand'}</span>
                </button>
              </div>

              {/* Card Body */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-xl bg-[#03291F] border border-[#D4AF37]/40 text-[#D4AF37]">
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <h4 className="text-sm font-black text-[#D4AF37] leading-snug">
                        {isAr ? step.titleAr : step.titleEn}
                      </h4>
                    </div>
                  </div>

                  <p className="text-xs text-[#F8F3E7]/80 line-clamp-2 leading-relaxed">
                    {isAr ? step.shortDescAr : step.shortDescEn}
                  </p>
                </div>

                {/* Location & Time Tags */}
                <div className="p-2.5 rounded-xl bg-[#03291F]/60 border border-[#D4AF37]/20 text-[11px] space-y-1">
                  <div className="flex items-center gap-1.5 text-[#D4AF37] font-bold">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{step.locationAr}</span>
                  </div>
                </div>

                {/* Action Controls */}
                <div className="pt-2 border-t border-[#D4AF37]/20 flex items-center justify-between gap-2">
                  {onToggleTTS && (
                    <TTSPlayButton
                      trackId={trackId}
                      title={isAr ? step.titleAr : step.titleEn}
                      text={`${isAr ? step.titleAr : step.titleEn}. ${isAr ? step.shortDescAr : step.shortDescEn}. الخطوات المصورة: ${step.visualDetailsAr.join('. ')}`}
                      category={isAr ? 'شرح المنسك' : 'Ritual Voice'}
                      isPlaying={isTTSPlaying}
                      isCurrentTrack={currentTTSTrackId === trackId}
                      onToggle={onToggleTTS}
                      variant="pill"
                      labelAr="استماع للخطوات 🔊"
                      labelEn="Listen Audio 🔊"
                      isAr={isAr}
                    />
                  )}

                  <button
                    type="button"
                    onClick={() => setSelectedStep(step)}
                    className="px-3 py-1.5 rounded-xl bg-[#03291F] hover:bg-[#073D2F] border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <span>{isAr ? 'اللوحة الكاملة' : 'Full Panel'}</span>
                    <ArrowLeft className={`w-3.5 h-3.5 ${!isAr ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Expanded Modal View for Selected Step */}
      {selectedStep && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-2xl bg-[#02130D] border-2 border-[#D4AF37] rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
            {/* Modal Header Banner */}
            <div className="relative h-56 w-full bg-[#03291F]">
              <img
                src={selectedStep.imageUrl}
                alt={isAr ? selectedStep.titleAr : selectedStep.titleEn}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#02130D] via-[#02130D]/60 to-transparent" />

              <button
                type="button"
                onClick={() => setSelectedStep(null)}
                className="absolute top-4 right-4 p-2 rounded-xl bg-[#02130D]/80 text-white hover:bg-rose-950 border border-white/20 transition-all cursor-pointer shadow-lg"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 right-4 left-4 flex items-end justify-between">
                <div>
                  <span className="px-3 py-1 rounded-lg bg-[#D4AF37] text-[#02130D] font-black text-xs inline-block mb-1 shadow-md">
                    {selectedStep.dayOrStageAr}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-[#D4AF37] drop-shadow-md">
                    {isAr ? selectedStep.titleAr : selectedStep.titleEn}
                  </h3>
                </div>

                {onToggleTTS && (
                  <TTSPlayButton
                    trackId={`modal_step_${selectedStep.id}`}
                    title={isAr ? selectedStep.titleAr : selectedStep.titleEn}
                    text={`${selectedStep.titleAr}. ${selectedStep.shortDescAr}. ${selectedStep.visualDetailsAr.join('. ')}`}
                    category={isAr ? 'الدليل البصري' : 'Visual Guide'}
                    isPlaying={isTTSPlaying}
                    isCurrentTrack={currentTTSTrackId === `modal_step_${selectedStep.id}`}
                    onToggle={onToggleTTS}
                    variant="pill"
                    labelAr="استماع صوتي 🔊"
                    labelEn="Listen 🔊"
                    isAr={isAr}
                  />
                )}
              </div>
            </div>

            {/* Sub-Nav Tabs inside Modal */}
            <div className="flex items-center gap-2 px-4 py-2 bg-[#03291F] border-b border-[#D4AF37]/30">
              {[
                { id: 'visual_timeline', labelAr: '📌 الخطوات التنفيذية', labelEn: 'Action Steps' },
                { id: 'checklist', labelAr: '✨ سنن ومستحبات', labelEn: 'Sunnah Practices' },
                { id: 'prohibitions', labelAr: '⚠️ تحذيرات ومحظورات', labelEn: 'Prohibitions' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTabSection(tab.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTabSection === tab.id
                      ? 'bg-[#D4AF37] text-[#02130D]'
                      : 'text-[#F8F3E7]/70 hover:text-white'
                  }`}
                >
                  {isAr ? tab.labelAr : tab.labelEn}
                </button>
              ))}
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto flex-1 space-y-4 text-xs">
              {/* SECTION 1: Visual Timeline & Action Steps */}
              {activeTabSection === 'visual_timeline' && (
                <div className="space-y-4">
                  <div className="p-3.5 rounded-2xl bg-[#03291F] border border-[#D4AF37]/30 text-[#F8F3E7] leading-relaxed">
                    <h5 className="font-bold text-[#D4AF37] text-sm mb-1">{isAr ? 'الوصف والتوجيه الميداني:' : 'Field Instructions:'}</h5>
                    <p>{isAr ? selectedStep.shortDescAr : selectedStep.shortDescEn}</p>
                  </div>

                  <div className="space-y-2">
                    <h5 className="font-bold text-[#D4AF37] flex items-center gap-1.5 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>{isAr ? 'الخطوات العملية بالترتيب (التنفيذ الميداني):' : 'Step-by-Step Field Execution:'}</span>
                    </h5>
                    <div className="space-y-2 pl-2">
                      {selectedStep.visualDetailsAr.map((detail, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl bg-[#01140E] border border-[#D4AF37]/30 flex items-start gap-3 text-[#F8F3E7] font-bold"
                        >
                          <div className="w-6 h-6 rounded-full bg-[#D4AF37] text-[#02130D] flex items-center justify-center font-black text-xs shrink-0 mt-0.5">
                            {idx + 1}
                          </div>
                          <span className="leading-relaxed">{detail}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recommended Dua Box */}
                  <div className="p-4 rounded-2xl bg-[#03291F] border border-[#D4AF37]/50 text-center space-y-2">
                    <span className="text-[11px] font-bold text-[#D4AF37] block">
                      {isAr ? 'الدعاء والذكر المستحب المأثور لطلب القبُول:' : 'Recommended Supplication:'}
                    </span>
                    <p className="text-sm font-serif text-[#F8F3E7] leading-relaxed">
                      "{selectedStep.recommendedDuaAr}"
                    </p>
                  </div>
                </div>
              )}

              {/* SECTION 2: Sunnah Practices */}
              {activeTabSection === 'checklist' && (
                <div className="space-y-3">
                  <h5 className="font-bold text-emerald-300 flex items-center gap-1.5 text-sm">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>{isAr ? 'سنن ومندوبات يضاعف بها الأجر:' : 'Recommended Sunnah Acts:'}</span>
                  </h5>
                  <div className="space-y-2">
                    {selectedStep.essentialSunanAr.map((sunnah, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-100 flex items-center gap-2 font-bold"
                      >
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{sunnah}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SECTION 3: Prohibitions */}
              {activeTabSection === 'prohibitions' && (
                <div className="space-y-3">
                  <h5 className="font-bold text-amber-300 flex items-center gap-1.5 text-sm">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    <span>{isAr ? 'محظورات وأخطاء شائعة يجب تجنبها:' : 'Common Errors & Prohibitions:'}</span>
                  </h5>
                  <div className="space-y-2">
                    {selectedStep.prohibitionsAr.map((prohibition, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-200 flex items-center gap-2 font-bold"
                      >
                        <span className="text-amber-400 font-black">⚠️</span>
                        <span>{prohibition}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-[#03291F] border-t border-[#D4AF37]/30 flex items-center justify-between">
              <div className="flex items-center gap-2 text-[11px] text-[#D4AF37]">
                <MapPin className="w-4 h-4" />
                <span>الموقع: <strong>{selectedStep.locationAr}</strong></span>
              </div>

              <button
                type="button"
                onClick={() => setSelectedStep(null)}
                className="px-5 py-2 rounded-xl bg-[#D4AF37] hover:bg-[#F5E5BE] text-[#02130D] font-black text-xs shadow-md cursor-pointer"
              >
                {isAr ? 'إغلاق اللوحة' : 'Close Panel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VisualRitualGuides;
