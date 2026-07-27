import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  MessageCircle,
  X,
  Send,
  HelpCircle,
  ShieldCheck,
  FileText,
  Building2,
  Users,
  ArrowLeft,
  Bot,
  Wallet,
  Package,
  Compass,
  Navigation,
  Sun,
  Activity,
  Heart,
  Globe,
  PhoneCall,
  User,
  PlusCircle,
  Mic,
  MicOff,
  Settings,
  Mail,
  Camera,
  MapPin,
  Eye,
  CheckCircle,
  Calendar,
  Award,
  Info,
  Share2,
  Star,
  BookOpen,
} from 'lucide-react';
import { LANGUAGES, TRANSLATIONS, LanguageOption } from '../../data/languages';
import { CURRENCIES, CurrencyOption, formatPrice } from '../../data/currencies';
import { ArafatLogo } from '../common/ArafatLogo';
import { ArafatHeader } from './ArafatHeader';

// Import All 10 Interactive Sub-Views and User Modal
import { BudgetCalculatorView } from '../views/BudgetCalculatorView';
import { PackageDesignerView } from '../views/PackageDesignerView';
import { RitualsGuideView } from '../views/RitualsGuideView';
import { MyLocationView } from '../views/MyLocationView';
import { MyPermitsView } from '../views/MyPermitsView';
import { MyAthkarView } from '../views/MyAthkarView';
import { MyHealthView } from '../views/MyHealthView';
import { AboutArafatView } from '../views/AboutArafatView';
import { SupportCenterView } from '../views/SupportCenterView';
import { PackagesView } from '../views/PackagesView';
import { ZiyaratTayyibahView } from '../views/ZiyaratTayyibahView';
import { LiveTranslationTool } from '../views/LiveTranslationTool';
import { SettingsView } from '../views/SettingsView';
import { DashboardView } from '../views/DashboardView';
import { TripDashboard } from '../views/TripDashboard';
import { UserProfileModal, UserProfile } from '../views/UserProfileModal';
import { ContactUsModal } from '../views/ContactUsModal';
import { ArafatAssistant } from '../assistant/ArafatAssistant';

/**
 * @file ArafatLandingPage.tsx
 * @description الواجهة الرئيسية المتكاملة لمنصة «عرفات» مع الربط الكامل للخدمات العشرة والذكاء الاصطناعي.
 */
export const ArafatLandingPage: React.FC = () => {
  // 1. إدارة حالة اللغة والعملة في localStorage
  const [selectedLang, setSelectedLang] = useState<LanguageOption>(() => {
    const saved = localStorage.getItem('arafat_lang');
    if (saved) {
      const found = LANGUAGES.find((l) => l.code === saved);
      if (found) return found;
    }
    return LANGUAGES[0]; // العربية
  });

  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyOption>(() => {
    const saved = localStorage.getItem('arafat_currency');
    if (saved) {
      const found = CURRENCIES.find((c) => c.code === saved);
      if (found) return found;
    }
    return CURRENCIES[0]; // SAR
  });

  // 2. إدارة الشاشة/الخدمة النشطة والنوافذ المنسدلة
  const [activeView, setActiveView] = useState<string>('home');
  const [isUserProfileModalOpen, setIsUserProfileModalOpen] = useState<boolean>(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState<boolean>(false);
  const [selectedHajjStep, setSelectedHajjStep] = useState<any | null>(null);

  // إدارة بيانات المستخدم / الحاج المحفوظة
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('arafat_user_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return {
      name: 'محمد أحمد',
      country: 'المملكة العربية السعودية',
      nationality: 'سعودي',
      campaignName: 'حملة عرفات المتميزة',
      campaignLeader: 'حملة رقم #8842 - قائد الحملة: م. عبد الله السلمي (0501234567)',
      phone: '+966500000000',
      email: 'pilgrim@arafat.sa',
      isLoggedIn: true,
    };
  });

  const handleUpdateUserProfile = (newProfile: UserProfile) => {
    setUserProfile(newProfile);
    localStorage.setItem('arafat_user_profile', JSON.stringify(newProfile));
  };

  // 3. حالات الشات التفاعلي مع الوكيل الذكي
  const [isChatMode, setIsChatMode] = useState<boolean>(false);
  const [isAskModalOpen, setIsAskModalOpen] = useState<boolean>(false);
  const [askQuery, setAskQuery] = useState<string>('');
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'arafat'; text: string }>>([]);

  // حالات وتجهيز التعرف على الصوت (Speech-to-Text)
  const [isListening, setIsListening] = useState<boolean>(false);
  const [recognitionInstance, setRecognitionInstance] = useState<any>(null);

  const getSpeechLangCode = (langCode: string) => {
    const map: Record<string, string> = {
      ar: 'ar-SA',
      en: 'en-US',
      ur: 'ur-PK',
      id: 'id-ID',
      fr: 'fr-FR',
      tr: 'tr-TR',
      fa: 'fa-IR',
      bn: 'bn-BD',
      ms: 'ms-MY',
      zh: 'zh-CN',
      ru: 'ru-RU',
      hi: 'hi-IN',
      es: 'es-ES',
      de: 'de-DE',
      pt: 'pt-BR',
      sw: 'sw-KE',
      ha: 'ha-NG',
      uz: 'uz-UZ',
      am: 'am-ET',
      ps: 'ps-AF',
    };
    return map[langCode] || `${langCode}-SA`;
  };

  const toggleVoiceRecognition = () => {
    if (isListening && recognitionInstance) {
      try {
        recognitionInstance.stop();
      } catch (err) {
        console.error('Error stopping speech recognition:', err);
      }
      setIsListening(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        selectedLang.code === 'ar'
          ? 'عذراً، متصفحك الحالي لا يدعم التعرف على الصوت المباشر. يمكنك استخدام متصفح Google Chrome أو Microsoft Edge.'
          : 'Your browser does not support live speech recognition. Please use Google Chrome or Microsoft Edge.'
      );
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = getSpeechLangCode(selectedLang.code);
      recognition.interimResults = true;
      recognition.continuous = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        if (currentTranscript) {
          setAskQuery(currentTranscript);
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
      setRecognitionInstance(recognition);
    } catch (err) {
      console.error('Failed to start speech recognition:', err);
      setIsListening(false);
    }
  };

  const WHATSAPP_URL = `https://wa.me/966546068859?text=${encodeURIComponent('السلام عليكم، أود الاستفسار عن خدمات منصة عرفات')}`;

  useEffect(() => {
    localStorage.setItem('arafat_lang', selectedLang.code);
    document.documentElement.dir = selectedLang.dir;
    document.documentElement.lang = selectedLang.code;
  }, [selectedLang]);

  useEffect(() => {
    localStorage.setItem('arafat_currency', selectedCurrency.code);
  }, [selectedCurrency]);

  const t = TRANSLATIONS[selectedLang.code] || TRANSLATIONS['ar'];

  // إرسال الرسالة إلى السيرفر وجلب استجابة Gemini Real AI
  const callGeminiServer = async (promptText: string) => {
    setIsAiLoading(true);
    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: promptText,
          language: selectedLang.code,
        }),
      });
      const data = await response.json();
      setIsAiLoading(false);
      return data.reply || data.response || 'أهلاً بك! أنا عرفات وكيلك الذكي، يسعدني إجابتك عن كافة مناسك الحج والعمرة والخدمات والميزانية.';
    } catch (err) {
      console.error('Gemini API call failed, fallback response used', err);
      setIsAiLoading(false);
      return `أهلاً بك! بالنسبة لسؤالك حول: "${promptText}". يقدم لك "عرفات وكيلك الذكي" الإرشاد الكامل والمعلومات المعتمدة خطوة بخطوة في مناسكك وحجز رحلتك.`;
    }
  };

  const handleSendAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!askQuery.trim()) return;

    if (isListening && recognitionInstance) {
      try {
        recognitionInstance.stop();
      } catch (_) {}
      setIsListening(false);
    }

    const userText = askQuery;
    setChatMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setAskQuery('');

    const aiReply = await callGeminiServer(userText);
    setChatMessages((prev) => [...prev, { sender: 'arafat', text: aiReply }]);
  };

  const handleSendWhatsAppMsg = (msg: string) => {
    window.open(`https://wa.me/966546068859?text=${encodeURIComponent(msg)}`, '_blank');
  };

  // أزرار البطاقات السبعة الرئيسية المطلوبة:
  const servicesList = [
    {
      id: 'budget',
      title: selectedLang.code === 'ar' ? 'خطتي وميزانيتي قبل الرحلة' : 'Plan & Budget Before Trip',
      desc: selectedLang.code === 'ar' ? 'حساب التكاليف والجدول الزمني والمدة' : 'Calculate costs, duration & breakdown',
      icon: Wallet,
    },
    {
      id: 'package_designer',
      title: selectedLang.code === 'ar' ? 'تصميم باقاتي' : 'Design My Packages',
      desc: selectedLang.code === 'ar' ? 'تخصيص الفنادق والطيران والمواصلات' : 'Custom hotels, flight & transport',
      icon: Package,
    },
    {
      id: 'rituals',
      title: selectedLang.code === 'ar' ? 'أداء مناسكي' : 'Performing My Rituals',
      desc: selectedLang.code === 'ar' ? 'دليل خطوة بخطوة وعدّاد الطواف والسعي' : 'Step-by-step rituals & live lap counter',
      icon: Compass,
    },
    {
      id: 'location',
      title: selectedLang.code === 'ar' ? 'مكاني في الرحلة' : 'My Location in Trip',
      desc: selectedLang.code === 'ar' ? 'خرائط الحرم، الفندق، وتتبع المواقيت' : 'Holy sites, hotel navigation & Miqat',
      icon: Navigation,
    },
    {
      id: 'permits',
      title: selectedLang.code === 'ar' ? 'تصاريحي' : 'My Permits',
      desc: selectedLang.code === 'ar' ? 'إدارة واستعراض تصاريح العمرة والروضة' : 'Manage Rawdah & Umrah permits',
      icon: ShieldCheck,
    },
    {
      id: 'athkar',
      title: selectedLang.code === 'ar' ? 'أذكاري' : 'My Athkar',
      desc: selectedLang.code === 'ar' ? 'أدعية الطواف والمشاعر والمسبحة الإلكترونية' : 'Duas, Athkar & Digital Tasbeeh',
      icon: Sun,
    },
    {
      id: 'ziyarat_tayyibah',
      title: selectedLang.code === 'ar' ? 'زيارة طيبة الطيبة' : 'Ziyarat Tayyibah',
      desc: selectedLang.code === 'ar' ? 'دليل المسجد النبوي والروضة ومعالم المدينة' : 'Prophet Mosque, Rawdah & Madinah landmarks',
      icon: Building2,
    },
    {
      id: 'live_translation',
      title: selectedLang.code === 'ar' ? 'الترجمة الفورية' : 'Live Interpreter',
      desc: selectedLang.code === 'ar' ? 'ترجمة صوتية ونصية فورية لضيوف الرحمن' : 'Instant voice & text interpreter for Pilgrims',
      icon: Globe,
    },
    {
      id: 'settings',
      title: selectedLang.code === 'ar' ? 'الإعدادات المركزية' : 'Central Settings',
      desc: selectedLang.code === 'ar' ? 'تفضيلات الصوت، اللغة، والعملات، واختصارات الميزات' : 'Voice speed, language, currency & audio preferences',
      icon: Settings,
    },
    {
      id: 'health',
      title: selectedLang.code === 'ar' ? 'صحتي' : 'My Health',
      desc: selectedLang.code === 'ar' ? 'أقرب مستشفى وصيدلية وطوارئ 997/911' : 'Nearby hospitals & emergency 997/911',
      icon: Activity,
    },
  ];

  // صور ومعالم معبرة عن رحلة الحج خطوة بخطوة
  const hajjJourneySteps = [
    {
      id: 'ihram',
      titleAr: '1. الإحرام وتلبية الميقات',
      titleEn: '1. Ihram & Miqat Declaration',
      locationAr: 'المواقيت المكانية (ذو الحليفة، يلملم، الجحفة)',
      locationEn: 'Designated Miqat Locations',
      descAr: 'بداية الرحلة الإيمانية بالتجرد ونية الحج وتلبية «لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ»، وارتداء لباس الإحرام الأبيض الناصع.',
      descEn: 'The spiritual beginning of Hajj by wearing white ihram garments and reciting the Talbiyah.',
      imageUrl: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?auto=format&fit=crop&w=1000&q=80',
      duaAr: '«لَبَّيْكَ اللَّهُمَّ حَجًّا، لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ، لَبَّيْكَ لاَ شَرِيكَ لَكَ لَبَّيْكَ»',
      badgeAr: 'بداية المناسك',
      stepNum: '01',
    },
    {
      id: 'tawaf',
      titleAr: '2. الكعبة المشرفة وطواف القدوم',
      titleEn: '2. Tawaf al-Qudum at Holy Kaaba',
      locationAr: 'المسجد الحرام - صحن المطاف بمكة',
      locationEn: 'Al-Masjid Al-Haram, Makkah',
      descAr: 'الطواف حول الكعبة المشرفة سبعة أشواط خاشعة ابتداءً من الحجر الأسود واستلام الركن اليماني والتضرع بالدعاء.',
      descEn: 'Circling the Holy Kaaba 7 times with devotion starting from the Black Stone.',
      imageUrl: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=1000&q=80',
      duaAr: '«رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ»',
      badgeAr: 'ركن مبارك',
      stepNum: '02',
    },
    {
      id: 'sai',
      titleAr: '3. السعي بين الصفا والمروة',
      titleEn: '3. Sa\'i Between Safa & Marwah',
      locationAr: 'المسعى المبارك بالمسجد الحرام',
      locationEn: 'Safa and Marwah Corridor',
      descAr: 'المشي والسعي سبعة أشواط بين جبلي الصفا والمروة اقتداءً بالسيدة هاجر عليها السلام واستشعاراً للرحمة الإلهية.',
      descEn: 'Walking 7 laps between Safa and Marwah hills commemorating Lady Hajar.',
      imageUrl: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=1000&q=80',
      duaAr: '«إِنَّ الصَّفَا وَالْمَرْوَةَ مِن شَعَائِرِ اللَّهِ، أَبْدَأُ بِمَا بَدَأَ اللَّهُ بِهِ»',
      badgeAr: 'شريعة طاهرة',
      stepNum: '03',
    },
    {
      id: 'arafat',
      titleAr: '4. يوم عرفة - الوقوف بجبل الرحمة',
      titleEn: '4. Day of Arafah - Standing at Mount Arafat',
      locationAr: 'صعيد عرفات الطاهر - جبل الرحمة',
      locationEn: 'Plains of Arafat & Mount Mercy',
      descAr: 'ركن الحج الأعظم «الحَجُّ عَرَفَةُ»، الوقوف بالتضرع والاستغفار والدعاء المستجاب من الزوال حتى غروب الشمس.',
      descEn: 'The core peak of Hajj pilgrimage standing in intense prayer from noon until sunset.',
      imageUrl: 'https://images.unsplash.com/photo-1565552070098-fd83a8b42f61?auto=format&fit=crop&w=1000&q=80',
      duaAr: '«لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ»',
      badgeAr: 'ركن الحج الأعظم',
      stepNum: '04',
    },
    {
      id: 'muzdalifah',
      titleAr: '5. المبيت بمزدلفة وجمع الحصى',
      titleEn: '5. Overnight Stay at Muzdalifah',
      locationAr: 'المشعر الحرام - مزدلفة',
      locationEn: 'Sacred Site of Muzdalifah',
      descAr: 'النفرة من عرفات إلى مزدلفة والمبيت بها تحت سماء مليئة بالسكينة، وصلاة المغرب والعشاء جمعاً مع التقاط الحصى.',
      descEn: 'Gathering pebbles under the peaceful night sky at Muzdalifah after sunset from Arafat.',
      imageUrl: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=1000&q=80',
      duaAr: '«فَإِذَا أَفَضْتُم مِّنْ عَرَفَاتٍ فَاذْكُرُوا اللَّهَ عِندَ الْمَشْعَرِ الْحَرَامِ»',
      badgeAr: 'المشعر الحرام',
      stepNum: '05',
    },
    {
      id: 'mina',
      titleAr: '6. رمي الجمرات والحلق بمنى',
      titleEn: '6. Rami al-Jamarat & Shaving in Mina',
      locationAr: 'مشعر منى - جسر الجمرات',
      locationEn: 'Mina Valley & Jamarat Complex',
      descAr: 'رمي جمرة العقبة الكبرى يوم العيد، ثم الذبح والحلق أو التقصير والتحلل الأصغر من الإحرام واستشعار البهجة.',
      descEn: 'Casting pebbles at Jamarat pillars followed by shaving/trimming hair in celebration.',
      imageUrl: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=1000&q=80',
      duaAr: '«اللَّهُ أَكْبَرُ، اللَّهُمَّ اجْعَلْهُ حَجًّا مَبْرُورًا وَذَنْبًا مَغْفُورًا»',
      badgeAr: 'أيام التشريق',
      stepNum: '06',
    },
    {
      id: 'madinah',
      titleAr: '7. زيارة المسجد النبوي والروضة الشريفة',
      titleEn: '7. Visiting Prophet\'s Mosque in Madinah',
      locationAr: 'المدينة المنورة - الروضة الشريفة',
      locationEn: 'Al-Masjid An-Nabawi, Madinah',
      descAr: 'زيارة طيبة الطيبة والصلاة في الروضة الشريفة «ما بين بيتي ومطبَري روضة من رياض الجنة» والسلام على النبي ﷺ.',
      descEn: 'Praying in Al-Rawdah Al-Sharifah and offering greetings to the Prophet Muhammad (PBUH).',
      imageUrl: '/images/landing/green-dome-madinah.webp',
      duaAr: '«الصَّلاَةُ وَالسَّلاَمُ عَلَيْكَ يَا رَسُولَ اللَّهِ، اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ»',
      badgeAr: 'زيارة طيبة',
      stepNum: '07',
    },
  ];

  return (
    <div
      dir={selectedLang.dir}
      className="min-h-screen w-full bg-[#02130D] text-[#F8F3E7] font-sans antialiased relative overflow-x-hidden flex flex-col justify-between selection:bg-[#D4AF37] selection:text-[#02130D]"
      style={{
        fontFamily: selectedLang.dir === 'rtl' ? "'Tajawal', 'Noto Sans Arabic', system-ui, sans-serif" : "system-ui, -apple-system, sans-serif",
      }}
    >
      {/* خلفية زجاجية متدرجة زمردية عميقة */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_35%,_var(--tw-gradient-stops))] from-[#073D2F] via-[#021811] to-[#010B07] pointer-events-none z-0" />

      {/* نقش هندسي إسلامي ذهبي ناعم */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none z-0 mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M40 0l10 30h30l-24 18 9 30-25-18-25 18 9-30-24-18h30z' fill='%20%23D4AF37' fill-opacity='0.6'/%3E%3C/svg%3E")`,
          backgroundSize: '80px 80px',
        }}
      />

      {/* معالم مكة والمدينة مندمجة في الخلفية بتأثيرات حركة ناعمة */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="absolute bottom-32 left-0 w-[42%] max-w-[620px] h-[80%] pointer-events-none z-0 hidden lg:block overflow-hidden"
      >
        <img
          src="/images/landing/makkah-clock-tower.webp"
          alt="أبراج الساعة مكة المكرمة"
          className="w-full h-full object-cover object-bottom opacity-80 brightness-110 contrast-105 hover:scale-105 transition-transform duration-1000"
          style={{
            maskImage: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0) 100%), linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)',
            WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0) 100%), linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)',
          }}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="absolute bottom-32 right-0 w-[42%] max-w-[620px] h-[80%] pointer-events-none z-0 hidden lg:block overflow-hidden"
      >
        <img
          src="/images/landing/madinah-prophet-mosque.webp"
          alt="المسجد النبوي الشريف بالمدينة المنورة"
          className="w-full h-full object-cover object-bottom opacity-80 brightness-110 contrast-105 hover:scale-105 transition-transform duration-1000"
          style={{
            maskImage: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0) 100%), linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)',
            WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0) 100%), linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)',
          }}
        />
      </motion.div>

      {/* الهيدر العلوي المطور */}
      <ArafatHeader
        selectedLang={selectedLang}
        onSelectLang={setSelectedLang}
        selectedCurrency={selectedCurrency}
        onSelectCurrency={setSelectedCurrency}
        onOpenAskModal={() => setIsAskModalOpen(true)}
        onOpenUserModal={() => setIsUserProfileModalOpen(true)}
        onOpenContactModal={() => setIsContactModalOpen(true)}
        onNavigateView={(view) => setActiveView(view)}
        userProfile={userProfile}
        t={t}
      />

      {/* المحتوى الرئيسي للواجهة حسب activeView مع تأثيرات حركة ناعمة */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 flex flex-col justify-between pt-4 pb-8">
        <AnimatePresence mode="wait">
          {activeView !== 'home' && (
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 15, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="w-full my-auto"
            >
              {/* 1. عرض بطاقات/أدوات الخدمة المخصصة إن لم تكن الرئيسية */}
              {activeView === 'budget' && (
                <BudgetCalculatorView
                  currency={selectedCurrency}
                  language={selectedLang}
                  onBack={() => setActiveView('home')}
                  onSendToWhatsapp={handleSendWhatsAppMsg}
                />
              )}

              {activeView === 'package_designer' && (
                <PackageDesignerView
                  currency={selectedCurrency}
                  language={selectedLang}
                  onBack={() => setActiveView('home')}
                  onSendToWhatsapp={handleSendWhatsAppMsg}
                />
              )}

              {activeView === 'rituals' && (
                <RitualsGuideView
                  language={selectedLang}
                  onBack={() => setActiveView('home')}
                />
              )}

              {activeView === 'location' && (
                <MyLocationView
                  language={selectedLang}
                  onBack={() => setActiveView('home')}
                  onSendToWhatsapp={handleSendWhatsAppMsg}
                />
              )}

              {activeView === 'permits' && (
                <MyPermitsView
                  language={selectedLang}
                  onBack={() => setActiveView('home')}
                  onSendToWhatsapp={handleSendWhatsAppMsg}
                />
              )}

              {activeView === 'athkar' && (
                <MyAthkarView
                  language={selectedLang}
                  onBack={() => setActiveView('home')}
                />
              )}

              {activeView === 'health' && (
                <MyHealthView
                  language={selectedLang}
                  onBack={() => setActiveView('home')}
                  onSendToWhatsapp={handleSendWhatsAppMsg}
                />
              )}

              {activeView === 'ziyarat_tayyibah' && (
                <ZiyaratTayyibahView
                  language={selectedLang}
                  onBack={() => setActiveView('home')}
                  onSendToWhatsapp={handleSendWhatsAppMsg}
                />
              )}

              {activeView === 'live_translation' && (
                <LiveTranslationTool
                  language={selectedLang}
                  onBack={() => setActiveView('home')}
                />
              )}

              {activeView === 'settings' && (
                <SettingsView
                  language={selectedLang}
                  onSelectLanguage={(lang) => {
                    setSelectedLang(lang);
                    localStorage.setItem('arafat_lang', lang.code);
                  }}
                  currency={selectedCurrency}
                  onSelectCurrency={(curr) => {
                    setSelectedCurrency(curr);
                    localStorage.setItem('arafat_currency', curr.code);
                  }}
                  onBack={() => setActiveView('home')}
                  onNavigateView={(view) => setActiveView(view)}
                />
              )}

              {activeView === 'dashboard' && (
                <DashboardView
                  language={selectedLang}
                  currency={selectedCurrency}
                  onBack={() => setActiveView('settings')}
                  onNavigateView={(view) => setActiveView(view)}
                  onSendToWhatsapp={handleSendWhatsAppMsg}
                />
              )}

              {activeView === 'trip_dashboard' && (
                <TripDashboard
                  language={selectedLang}
                  currency={selectedCurrency}
                  onBack={() => setActiveView('dashboard')}
                  onNavigateView={(view) => setActiveView(view)}
                  onSendToWhatsapp={handleSendWhatsAppMsg}
                />
              )}

              {activeView === 'about' && (
                <AboutArafatView
                  language={selectedLang}
                  onBack={() => setActiveView('home')}
                  onSendToWhatsapp={handleSendWhatsAppMsg}
                />
              )}

              {activeView === 'support' && (
                <SupportCenterView
                  language={selectedLang}
                  onBack={() => setActiveView('home')}
                  onSendToWhatsapp={handleSendWhatsAppMsg}
                />
              )}

              {activeView === 'packages' && (
                <PackagesView
                  currency={selectedCurrency}
                  language={selectedLang}
                  onBack={() => setActiveView('home')}
                  onSelectPlan={(plan, price) => {
                    setIsUserProfileModalOpen(true);
                  }}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* 2. الواجهة الرئيسية الهيرو + زر عرفات وكيلك الذكي الشات + البطاقات السبعة */}
        {activeView === 'home' && (
          <>
            <main className="my-auto text-center flex flex-col items-center justify-center pt-2 sm:pt-6 pb-4 relative z-10">
              
              {/* القوس السلكي الذهبي */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[360px] sm:w-[580px] h-[300px] sm:h-[450px] border border-[#D4AF37]/20 rounded-t-full pointer-events-none -z-10" />

              {/* الزخرفة النجمية مع تأثير الحركة */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="w-8 h-8 sm:w-10 sm:h-10 text-[#D4AF37] mb-3 flex items-center justify-center opacity-90 drop-shadow-[0_0_8px_rgba(212,175,55,0.5)]"
              >
                <svg viewBox="0 0 40 40" className="w-full h-full fill-current">
                  <path d="M20 0l5 15h15l-12 9 5 16-13-10-13 10 5-16-12-9h15z" />
                </svg>
              </motion.div>

              {/* العنوان الرئيسي مع تحريك زمني ناعم */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="text-4xl sm:text-6xl lg:text-7xl font-black leading-tight mb-3 tracking-tight"
              >
                <span className="block text-white drop-shadow-md">
                  {t.heroTitleLine1}
                </span>
                <span className="block bg-gradient-to-b from-[#FFFDF8] via-[#F5E5BE] to-[#C5A059] bg-clip-text text-transparent drop-shadow-lg mt-1">
                  {t.heroTitleLine2}
                </span>
              </motion.h1>

              {/* الفاصل الزخرفي مع تمدد ناعم */}
              <motion.div
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 0.85 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex items-center justify-center gap-3 my-3"
              >
                <div className="w-14 sm:w-20 h-[1px] bg-gradient-to-r from-transparent to-[#D4AF37]" />
                <div className="w-2.5 h-2.5 rotate-45 border border-[#D4AF37] bg-[#02130D]" />
                <div className="w-14 sm:w-20 h-[1px] bg-gradient-to-l from-transparent to-[#D4AF37]" />
              </motion.div>

              {/* زر كبير: عرفات وكيلك الذكي مع حركة سلسة */}
              <div className="my-3 sm:my-5 flex flex-col items-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => setIsChatMode(!isChatMode)}
                  className={`px-8 sm:px-12 py-4 sm:py-5 rounded-full border-2 border-[#D4AF37] bg-gradient-to-r from-[#D4AF37] via-[#F5E5BE] to-[#C5A059] text-[#02130D] font-black text-lg sm:text-2xl shadow-[0_0_35px_rgba(212,175,55,0.6)] hover:shadow-[0_0_55px_rgba(212,175,55,0.85)] transition-all cursor-pointer flex items-center gap-3 sm:gap-4 group ${
                    isChatMode ? 'ring-4 ring-[#D4AF37]/50' : ''
                  }`}
                >
                  <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-[#02130D] animate-pulse group-hover:rotate-12 transition-transform" />
                  <span>{selectedLang.code === 'ar' ? 'عرفات وكيلك الذكي' : 'Arafat, Your Smart Agent'}</span>
                  <Bot className="w-6 h-6 sm:w-8 sm:h-8 text-[#02130D]" />
                </motion.button>
                <p className="text-xs sm:text-sm text-[#D4AF37]/90 mt-2 font-bold">
                  {selectedLang.code === 'ar' ? 'اضغط للتحاور المباشر مع عرفات يجيب عن كافة أسئلتك' : 'Click to start chatting instantly with Arafat'}
                </p>
              </div>

              {/* الشات التفاعلي الكبير المركزي عند تفعيل الزر مع تأثير حركة ناعم سلس */}
              <AnimatePresence mode="wait">
                {isChatMode && (
                  <motion.div
                    key="arafat-chat-window"
                    initial={{ opacity: 0, scale: 0.93, y: 22 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.93, y: 15 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full max-w-2xl mt-4 bg-[#021811]/95 border-2 border-[#D4AF37] rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.95)] overflow-hidden text-start"
                  >
                    {/* هيدر الشات */}
                    <div className="bg-[#03291F] px-5 py-3.5 border-b border-[#D4AF37]/40 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <ArafatLogo size="sm" />
                          <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-[#02130D] rounded-full" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-base sm:text-lg font-black text-white">
                              {selectedLang.code === 'ar' ? 'عرفات - وكيلك الذكي' : 'Arafat - Smart Agent'}
                            </h3>
                            <span className="px-2 py-0.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-[10px] font-bold text-[#D4AF37]">
                              {selectedLang.code === 'ar' ? 'Gemini 3.6 متصل' : 'Gemini 3.6 AI'}
                            </span>
                          </div>
                          <p className="text-xs text-[#D4AF37]">
                            {selectedLang.code === 'ar' ? 'يجيب عن كافة أسئلتك ويساعدك في تنظيم رحلتك' : 'Answers all your questions & organizes your trip'}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setIsChatMode(false)}
                        className="px-3 py-1.5 rounded-full border border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#073D2F] text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                        <span>{selectedLang.code === 'ar' ? 'إغلاق الشات' : 'Close'}</span>
                      </button>
                    </div>

                    {/* منطقة الرسائل */}
                    <div className="p-4 sm:p-5 overflow-y-auto space-y-3.5 max-h-[380px] min-h-[220px] custom-scrollbar bg-[#01140E]/60">
                      {chatMessages.length === 0 ? (
                        <div className="text-center py-6 px-4">
                          <div className="mb-3 flex justify-center">
                            <ArafatLogo size="lg" />
                          </div>
                          <h4 className="font-black text-[#D4AF37] text-base mb-1">
                            {selectedLang.code === 'ar' ? 'أهلاً بك! أنا وكيلك الذكي عرفات' : 'Welcome! I am Arafat, your AI Agent'}
                          </h4>
                          <p className="text-xs sm:text-sm text-[#F8F3E7]/80 leading-relaxed max-w-md mx-auto">
                            {selectedLang.code === 'ar'
                              ? 'أنا هنا لمساعدتك في تخطيط الميزانية، معرفة المناسك، استخراج التصاريح، وتحديد الأماكن والمواقيت. اكتب سؤالك هنا:'
                              : 'I am here to help you with budgeting, rituals, permits, location guide & packages. Ask me anything:'}
                          </p>
                        </div>
                      ) : (
                        chatMessages.map((msg, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex ${msg.sender === 'user' ? 'justify-start' : 'justify-end'}`}
                          >
                            <div
                              className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed shadow-md ${
                                msg.sender === 'user'
                                  ? 'bg-[#D4AF37] text-[#02130D] font-black rounded-tr-none'
                                  : 'bg-[#073D2F] text-white border border-[#D4AF37]/50 rounded-tl-none'
                              }`}
                            >
                              {msg.text}
                            </div>
                          </motion.div>
                        ))
                      )}
                      {isAiLoading && (
                        <div className="flex justify-end">
                          <div className="bg-[#073D2F] text-[#D4AF37] border border-[#D4AF37]/40 rounded-2xl rounded-tl-none px-4 py-2.5 text-xs font-bold animate-pulse flex items-center gap-2">
                            <Bot className="w-4 h-4 text-[#D4AF37]" />
                            <span>{selectedLang.code === 'ar' ? 'جاري التفكير والتجهيز بواسطة الذكاء الاصطناعي...' : 'AI is processing...'}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* إدخال الرسائل والميكروفون الصوتي */}
                    <div className="p-3.5 bg-[#03291F] border-t border-[#D4AF37]/30">
                      <AnimatePresence>
                        {isListening && (
                          <motion.div
                            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                            animate={{ opacity: 1, height: 'auto', marginBottom: 8 }}
                            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                            className="px-3.5 py-2 bg-red-950/80 border border-red-500/60 rounded-xl flex items-center justify-between text-xs text-red-200 shadow-inner"
                          >
                            <div className="flex items-center gap-2">
                              <span className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                              </span>
                              <span className="font-bold">
                                {selectedLang.code === 'ar'
                                  ? 'جاري الاستماع لصوتك... تحدث بسؤالك الآن'
                                  : 'Listening to your voice... Speak your question now'}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={toggleVoiceRecognition}
                              className="text-xs text-red-300 hover:text-white underline font-bold cursor-pointer"
                            >
                              {selectedLang.code === 'ar' ? 'إيقاف' : 'Stop'}
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <form onSubmit={handleSendAsk} className="flex gap-2 items-center">
                        <button
                          type="button"
                          onClick={toggleVoiceRecognition}
                          title={
                            isListening
                              ? selectedLang.code === 'ar'
                                ? 'إيقاف التسجيل الصوتي'
                                : 'Stop voice recording'
                              : selectedLang.code === 'ar'
                              ? 'طرح السؤال صوتیًا (Speech-to-Text)'
                              : 'Ask by voice (Speech-to-Text)'
                          }
                          className={`p-2.5 sm:p-3 rounded-full transition-all cursor-pointer flex items-center justify-center shrink-0 border ${
                            isListening
                              ? 'bg-red-600 text-white border-red-400 animate-pulse shadow-[0_0_20px_rgba(220,38,38,0.8)]'
                              : 'bg-[#02130D] border-[#D4AF37]/60 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#02130D]'
                          }`}
                        >
                          {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                        </button>

                        <input
                          type="text"
                          value={askQuery}
                          onChange={(e) => setAskQuery(e.target.value)}
                          placeholder={
                            isListening
                              ? selectedLang.code === 'ar'
                                ? 'جاري تحويل صوتك لنص تلقائياً...'
                                : 'Transcribing voice to text...'
                              : selectedLang.code === 'ar'
                              ? 'اكتب سؤالك أو انقر زر الميكروفون للتحدث...'
                              : 'Type question or click mic to speak...'
                          }
                          className="flex-1 bg-[#02130D] border border-[#D4AF37]/60 rounded-full px-4 py-2.5 text-xs sm:text-sm text-white placeholder-[#F8F3E7]/50 focus:outline-none focus:border-[#D4AF37]"
                        />

                        <button
                          type="submit"
                          disabled={isAiLoading || !askQuery.trim()}
                          className="px-4 sm:px-5 py-2.5 bg-[#D4AF37] hover:bg-[#F5E5BE] text-[#02130D] font-black rounded-full transition-all flex items-center gap-1.5 cursor-pointer shrink-0 shadow-lg disabled:opacity-50"
                        >
                          <span>{t.send}</span>
                          <Send className={`w-4 h-4 ${selectedLang.dir === 'ltr' ? '' : 'rotate-180'}`} />
                        </button>
                      </form>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </main>

            {/* بطاقات الخدمات السبعة التفاعلية مع تحريك تتابعي */}
            <section className="w-full mt-6 sm:mt-8 mb-10 z-20">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
                {servicesList.map((service, idx) => {
                  const IconComp = service.icon;
                  return (
                    <motion.button
                      key={service.id}
                      type="button"
                      initial={{ opacity: 0, y: 25 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.45, delay: idx * 0.06, ease: [0.16, 1, 0.3, 1] }}
                      whileHover={{ y: -6, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveView(service.id)}
                      className="group text-start p-4 sm:p-5 rounded-2xl bg-[#03291F]/90 border border-[#D4AF37]/60 hover:border-[#D4AF37] hover:bg-[#073D2F] transition-colors duration-300 shadow-[0_10px_25px_rgba(0,0,0,0.7)] flex items-start gap-3.5 relative overflow-hidden cursor-pointer w-full"
                    >
                      <div className="w-11 h-11 rounded-2xl border border-[#D4AF37] bg-[#02130D] flex items-center justify-center text-[#D4AF37] shrink-0 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(212,175,55,0.3)]">
                        <IconComp className="w-5 h-5 sm:w-6 sm:h-6 text-[#D4AF37]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm sm:text-base font-black text-[#D4AF37] group-hover:text-white transition-colors truncate">
                          {service.title}
                        </h3>
                        <p className="text-xs text-[#F8F3E7]/75 mt-1 line-clamp-2 leading-relaxed">
                          {service.desc}
                        </p>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </section>

            {/* قسم رحلة الحج المصورة والمعبرة */}
            <section className="w-full my-10 z-20 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-center space-y-2 max-w-2xl mx-auto"
              >
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/50 text-[#D4AF37] text-xs font-bold">
                  <Camera className="w-4 h-4" />
                  <span>{selectedLang.code === 'ar' ? 'معرض رحلة الحج المصورة' : 'Visual Hajj Journey Gallery'}</span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-black text-white">
                  {selectedLang.code === 'ar' ? 'محطات ورحلة الحج خطوة بخطوة' : 'Step-by-Step Spiritual Hajj Landmarks'}
                </h2>
                <p className="text-xs sm:text-sm text-[#F8F3E7]/75 leading-relaxed">
                  {selectedLang.code === 'ar'
                    ? 'استكشف معالم ومشاعر رحلة العمر بالتسلسل الشرعي، انقر على أي صورة لمشاهدة التفاصيل والأدعية المأثورة.'
                    : 'Explore the sacred landmarks of Hajj pilgrimage with photos, location guides, and authentic supplications.'}
                </p>
              </motion.div>

              {/* شبكة الصور والمعالم المعبرة مع حركات تفاعلية */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {hajjJourneySteps.map((step, idx) => (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                    whileHover={{ y: -8, scale: 1.015 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setSelectedHajjStep(step)}
                    className="group bg-[#03291F] border-2 border-[#D4AF37]/50 hover:border-[#D4AF37] rounded-3xl overflow-hidden shadow-[0_12px_35px_rgba(0,0,0,0.8)] cursor-pointer transition-colors duration-300 flex flex-col justify-between"
                  >
                    {/* الصورة مع التدرج والتراكب */}
                    <div className="relative h-52 w-full overflow-hidden bg-[#02130D]">
                      <img
                        src={step.imageUrl}
                        alt={selectedLang.code === 'ar' ? step.titleAr : step.titleEn}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 brightness-95 group-hover:brightness-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#03291F] via-black/30 to-transparent" />
                      
                      {/* شارات الخطوة والمرحلة */}
                      <div className="absolute top-3 right-3 flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full bg-[#02130D]/90 border border-[#D4AF37] text-[#D4AF37] text-[10px] font-black shadow-md">
                          {selectedLang.code === 'ar' ? step.badgeAr : step.stepNum}
                        </span>
                      </div>

                      <div className="absolute bottom-3 right-3 left-3 flex items-center justify-between text-white">
                        <span className="text-xs font-bold text-[#D4AF37] flex items-center gap-1 bg-[#02130D]/80 px-2.5 py-1 rounded-xl border border-[#D4AF37]/40 backdrop-blur-sm">
                          <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                          <span className="truncate max-w-[180px]">{selectedLang.code === 'ar' ? step.locationAr : step.locationEn}</span>
                        </span>
                        <span className="p-1.5 rounded-full bg-[#D4AF37] text-[#02130D] group-hover:scale-110 transition-transform shadow-md">
                          <Eye className="w-4 h-4" />
                        </span>
                      </div>
                    </div>

                    {/* المحتوى النصي */}
                    <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                      <div className="space-y-1.5">
                        <h3 className="text-base sm:text-lg font-black text-white group-hover:text-[#D4AF37] transition-colors">
                          {selectedLang.code === 'ar' ? step.titleAr : step.titleEn}
                        </h3>
                        <p className="text-xs text-[#F8F3E7]/80 leading-relaxed line-clamp-2">
                          {selectedLang.code === 'ar' ? step.descAr : step.descEn}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-[#D4AF37]/20 flex items-center justify-between text-[11px] text-[#D4AF37] font-bold">
                        <span className="flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>{selectedLang.code === 'ar' ? 'انقر لعرض الدعاء والتفاصيل' : 'Click to view Dua & details'}</span>
                        </span>
                        <ArrowLeft className={`w-3.5 h-3.5 transition-transform group-hover:-translate-x-1 ${selectedLang.dir === 'ltr' ? 'rotate-180' : ''}`} />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          </>
        )}

      </div>

      {/* الفوتر الشامل لمنصة «عرفات» */}
      <footer className="relative z-30 w-full bg-[#01160E] border-t-2 border-[#D4AF37]/60 text-[#F8F3E7] pt-12 pb-8 shadow-[0_-20px_50px_rgba(0,0,0,0.9)]">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-[#D4AF37]/30">
            
            {/* قسم 3: عن عرفات */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-6 bg-[#D4AF37] rounded-full" />
                <h3 className="text-lg font-black text-[#D4AF37]">
                  {selectedLang.code === 'ar' ? 'عن عرفات' : 'About Arafat'}
                </h3>
              </div>
              <ul className="space-y-2.5 text-sm text-[#F8F3E7]/80 font-medium">
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveView('about')}
                    className="hover:text-[#D4AF37] transition-colors flex items-center gap-2 cursor-pointer bg-transparent border-none text-[#F8F3E7]"
                  >
                    <ArrowLeft className={`w-3.5 h-3.5 text-[#D4AF37] ${selectedLang.dir === 'ltr' ? 'rotate-180' : ''}`} />
                    <span>{selectedLang.code === 'ar' ? 'من نحن' : 'About Us'}</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveView('about')}
                    className="hover:text-[#D4AF37] transition-colors flex items-center gap-2 cursor-pointer bg-transparent border-none text-[#F8F3E7]"
                  >
                    <ArrowLeft className={`w-3.5 h-3.5 text-[#D4AF37] ${selectedLang.dir === 'ltr' ? 'rotate-180' : ''}`} />
                    <span>{selectedLang.code === 'ar' ? 'رؤيتنا' : 'Our Vision'}</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveView('about')}
                    className="hover:text-[#D4AF37] transition-colors flex items-center gap-2 cursor-pointer bg-transparent border-none text-[#F8F3E7]"
                  >
                    <ArrowLeft className={`w-3.5 h-3.5 text-[#D4AF37] ${selectedLang.dir === 'ltr' ? 'rotate-180' : ''}`} />
                    <span>{selectedLang.code === 'ar' ? 'رسالتنا' : 'Our Mission'}</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveView('about')}
                    className="hover:text-[#D4AF37] transition-colors flex items-center gap-2 cursor-pointer bg-transparent border-none text-[#F8F3E7]"
                  >
                    <ArrowLeft className={`w-3.5 h-3.5 text-[#D4AF37] ${selectedLang.dir === 'ltr' ? 'rotate-180' : ''}`} />
                    <span>{selectedLang.code === 'ar' ? 'لماذا عرفات؟' : 'Why Arafat?'}</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveView('about')}
                    className="hover:text-[#D4AF37] transition-colors flex items-center gap-2 cursor-pointer bg-transparent border-none text-[#F8F3E7]"
                  >
                    <ArrowLeft className={`w-3.5 h-3.5 text-[#D4AF37] ${selectedLang.dir === 'ltr' ? 'rotate-180' : ''}`} />
                    <span>{selectedLang.code === 'ar' ? 'كيف نساعد ضيوف الرحمن؟' : 'How We Help Pilgrims'}</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => handleSendWhatsAppMsg('السلام عليكم، أود الاستفسار عن الشراكة والانضمام لشركاء منصة عرفات')}
                    className="hover:text-[#D4AF37] transition-colors flex items-center gap-2 cursor-pointer bg-transparent border-none text-[#F8F3E7]"
                  >
                    <ArrowLeft className={`w-3.5 h-3.5 text-[#D4AF37] ${selectedLang.dir === 'ltr' ? 'rotate-180' : ''}`} />
                    <span>{selectedLang.code === 'ar' ? 'كن الشريك' : 'Become a Partner'}</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* قسم 4: الخدمات */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-6 bg-[#D4AF37] rounded-full" />
                <h3 className="text-lg font-black text-[#D4AF37]">
                  {selectedLang.code === 'ar' ? 'الخدمات' : 'Services'}
                </h3>
              </div>
              <ul className="space-y-2.5 text-sm text-[#F8F3E7]/80 font-medium">
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveView('package_designer')}
                    className="hover:text-[#D4AF37] transition-colors flex items-center gap-2 cursor-pointer bg-transparent border-none text-[#F8F3E7]"
                  >
                    <Building2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>{selectedLang.code === 'ar' ? 'الفنادق' : 'Hotels'}</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveView('location')}
                    className="hover:text-[#D4AF37] transition-colors flex items-center gap-2 cursor-pointer bg-transparent border-none text-[#F8F3E7]"
                  >
                    <Navigation className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>{selectedLang.code === 'ar' ? 'النقل' : 'Transport'}</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveView('ziyarat_tayyibah')}
                    className="hover:text-[#D4AF37] transition-colors flex items-center gap-2 cursor-pointer bg-transparent border-none text-[#F8F3E7]"
                  >
                    <Compass className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>{selectedLang.code === 'ar' ? 'الزيارات' : 'Ziyarat'}</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveView('permits')}
                    className="hover:text-[#D4AF37] transition-colors flex items-center gap-2 cursor-pointer bg-transparent border-none text-[#F8F3E7]"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>{selectedLang.code === 'ar' ? 'الحجوزات والتصاريح' : 'Bookings & Permits'}</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveView('package_designer')}
                    className="hover:text-[#D4AF37] transition-colors flex items-center gap-2 cursor-pointer bg-transparent border-none text-[#F8F3E7]"
                  >
                    <Package className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>{selectedLang.code === 'ar' ? 'تصميم الرحلة' : 'Trip Designer'}</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveView('rituals')}
                    className="hover:text-[#D4AF37] transition-colors flex items-center gap-2 cursor-pointer bg-transparent border-none text-[#F8F3E7]"
                  >
                    <Bot className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>{selectedLang.code === 'ar' ? 'المرشد والدليل' : 'Guide & Assistant'}</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* قسم 5: الدعم */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-6 bg-[#D4AF37] rounded-full" />
                <h3 className="text-lg font-black text-[#D4AF37]">
                  {selectedLang.code === 'ar' ? 'الدعم' : 'Support'}
                </h3>
              </div>
              <ul className="space-y-2.5 text-sm text-[#F8F3E7]/80 font-medium">
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveView('support')}
                    className="hover:text-[#D4AF37] transition-colors flex items-center gap-2 cursor-pointer bg-transparent border-none text-[#F8F3E7]"
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>{selectedLang.code === 'ar' ? 'مركز المساعدة' : 'Help Center'}</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveView('support')}
                    className="hover:text-[#D4AF37] transition-colors flex items-center gap-2 cursor-pointer bg-transparent border-none text-[#F8F3E7]"
                  >
                    <FileText className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>{selectedLang.code === 'ar' ? 'الأسئلة الشائعة' : 'FAQ'}</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => handleSendWhatsAppMsg('أود الاطلاع على حسابات وقنوات التواصل الاجتماعي لمنصة عرفات')}
                    className="hover:text-[#D4AF37] transition-colors flex items-center gap-2 cursor-pointer bg-transparent border-none text-[#F8F3E7]"
                  >
                    <Globe className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>{selectedLang.code === 'ar' ? 'التواصل الاجتماعي' : 'Social Media'}</span>
                  </button>
                </li>
                <li>
                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#25D366] transition-colors flex items-center gap-2 cursor-pointer text-[#F8F3E7]"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                    <span>{selectedLang.code === 'ar' ? 'واتساب' : 'WhatsApp'}</span>
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:support@arafat.sa"
                    className="hover:text-[#D4AF37] transition-colors flex items-center gap-2 cursor-pointer text-[#F8F3E7]"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>{selectedLang.code === 'ar' ? 'البريد الإلكتروني' : 'Email Support'}</span>
                  </a>
                </li>
              </ul>
            </div>

            {/* قسم 6: الباقات */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-6 bg-[#D4AF37] rounded-full" />
                <h3 className="text-lg font-black text-[#D4AF37]">
                  {selectedLang.code === 'ar' ? 'الباقات' : 'Packages'}
                </h3>
              </div>
              <ul className="space-y-2.5 text-sm text-[#F8F3E7]/80 font-medium">
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveView('packages')}
                    className="hover:text-[#D4AF37] transition-colors flex items-center gap-2 cursor-pointer bg-transparent border-none text-[#F8F3E7]"
                  >
                    <Users className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>{selectedLang.code === 'ar' ? 'باقة الأفراد' : 'Individual Package'} ({formatPrice(3800, selectedCurrency)})</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveView('packages')}
                    className="hover:text-[#D4AF37] transition-colors flex items-center gap-2 cursor-pointer bg-transparent border-none text-[#F8F3E7]"
                  >
                    <Users className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>{selectedLang.code === 'ar' ? 'باقة العائلة' : 'Family Package'} ({formatPrice(9500, selectedCurrency)})</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveView('packages')}
                    className="hover:text-[#D4AF37] transition-colors flex items-center gap-2 cursor-pointer bg-transparent border-none text-[#F8F3E7]"
                  >
                    <Building2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>{selectedLang.code === 'ar' ? 'باقات الشركات' : 'Corporate Packages'}</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveView('packages')}
                    className="hover:text-[#D4AF37] transition-colors flex items-center gap-2 cursor-pointer bg-transparent border-none text-[#F8F3E7]"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>{selectedLang.code === 'ar' ? 'مقارنة الباقات' : 'Compare Packages'}</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveView('packages')}
                    className="hover:text-[#D4AF37] transition-colors flex items-center gap-2 cursor-pointer bg-transparent border-none text-[#F8F3E7]"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>{selectedLang.code === 'ar' ? 'المزايا' : 'Features & Benefits'}</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveView('about')}
                    className="hover:text-[#D4AF37] transition-colors flex items-center gap-2 cursor-pointer bg-transparent border-none text-[#F8F3E7]"
                  >
                    <Users className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>{selectedLang.code === 'ar' ? 'الشركاء' : 'Partners'}</span>
                  </button>
                </li>
              </ul>

              <div className="pt-2 space-y-2">
                <button
                  type="button"
                  onClick={() => setIsContactModalOpen(true)}
                  className="w-full inline-flex items-center justify-center gap-2.5 px-4 py-3 rounded-2xl bg-gradient-to-r from-[#D4AF37] via-[#F5E5BE] to-[#AA820A] hover:from-[#E5C158] text-[#02130D] font-black text-sm shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all cursor-pointer"
                >
                  <Mail className="w-5 h-5 text-[#02130D]" />
                  <span>{selectedLang.code === 'ar' ? 'تواصل معنا (نموذج مباشر)' : 'Contact Us (Direct Form)'}</span>
                </button>

                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2.5 px-4 py-3 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-[#02130D] font-black text-sm shadow-[0_0_20px_rgba(37,211,102,0.3)] transition-all cursor-pointer"
                >
                  <MessageCircle className="w-5 h-5 fill-current" />
                  <span>{selectedLang.code === 'ar' ? 'تواصل عبر واتساب المباشر' : 'Direct WhatsApp Contact'}</span>
                </a>
              </div>
            </div>

          </div>

          <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-right">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <ArafatLogo size="md" />
              <div>
                <h4 className="text-lg font-black text-white">{t.arafatTitle}</h4>
                <p className="text-xs text-[#D4AF37] font-medium mt-0.5">
                  {t.arafatSubTitle}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 text-xs text-[#F8F3E7]/70">
              <p>{t.copyright}</p>
            </div>
          </div>

        </div>
      </footer>

      {/* النافذة المنبثقة لحساب المستخدم والاشتراكات */}
      <UserProfileModal
        isOpen={isUserProfileModalOpen}
        onClose={() => setIsUserProfileModalOpen(false)}
        language={selectedLang}
        currency={selectedCurrency}
        userProfile={userProfile}
        onUpdateProfile={handleUpdateUserProfile}
      />

      {/* نموذج تواصل معنا المنبثق المباشر */}
      <ContactUsModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        language={selectedLang}
        onSendToWhatsapp={handleSendWhatsAppMsg}
        defaultName={userProfile?.name}
        defaultPhone={userProfile?.phone}
      />

      {/* نافذة عرفات الوكيل الذكي لضيوف الرحمن */}
      <ArafatAssistant
        isOpen={isAskModalOpen}
        onClose={() => setIsAskModalOpen(false)}
        language={selectedLang}
        currency={selectedCurrency}
      />

      {/* النافذة المنبثقة لمعاينة معالم وصور رحلة الحج */}
      <AnimatePresence>
        {selectedHajjStep && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-[#021811] border-2 border-[#D4AF37] rounded-3xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.95)] text-[#F8F3E7]"
            >
              {/* زر الإغلاق */}
              <button
                type="button"
                onClick={() => setSelectedHajjStep(null)}
                className="absolute top-3 left-3 z-20 p-2 rounded-full bg-[#02130D]/90 border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#02130D] transition-all cursor-pointer shadow-lg"
              >
                <X className="w-5 h-5" />
              </button>

              {/* الصورة المكبرة */}
              <div className="relative h-64 sm:h-72 w-full bg-[#01140E]">
                <img
                  src={selectedHajjStep.imageUrl}
                  alt={selectedLang.code === 'ar' ? selectedHajjStep.titleAr : selectedHajjStep.titleEn}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover brightness-95"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#021811] via-black/20 to-transparent" />
                <div className="absolute bottom-4 right-4 left-4 flex items-center justify-between">
                  <span className="px-3.5 py-1.5 rounded-full bg-[#D4AF37] text-[#02130D] text-xs font-black shadow-md">
                    {selectedLang.code === 'ar' ? selectedHajjStep.badgeAr : selectedHajjStep.stepNum}
                  </span>
                  <span className="text-xs font-bold text-[#D4AF37] flex items-center gap-1.5 bg-[#02130D]/90 px-3 py-1.5 rounded-xl border border-[#D4AF37]/50">
                    <MapPin className="w-4 h-4 text-[#D4AF37]" />
                    <span>{selectedLang.code === 'ar' ? selectedHajjStep.locationAr : selectedHajjStep.locationEn}</span>
                  </span>
                </div>
              </div>

              {/* تفاصيل المحتوى والدعاء */}
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-[#D4AF37] mb-1">
                    {selectedLang.code === 'ar' ? selectedHajjStep.titleAr : selectedHajjStep.titleEn}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#F8F3E7]/85 leading-relaxed">
                    {selectedLang.code === 'ar' ? selectedHajjStep.descAr : selectedHajjStep.descEn}
                  </p>
                </div>

                {/* صندوق الدعاء المأثور */}
                <div className="p-4 bg-[#03291F] border border-[#D4AF37]/50 rounded-2xl space-y-2 text-center shadow-inner">
                  <span className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-wider block">
                    {selectedLang.code === 'ar' ? 'الدعاء المأثور والذكر المستحب:' : 'Authentic Supplication:'}
                  </span>
                  <p className="text-sm sm:text-base font-serif font-black text-white leading-loose">
                    {selectedHajjStep.duaAr}
                  </p>
                </div>

                {/* الأزرار والإجراءات */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#D4AF37]/30">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveView('rituals');
                      setSelectedHajjStep(null);
                    }}
                    className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA820A] text-[#02130D] font-black text-xs sm:text-sm flex items-center justify-center gap-2 hover:scale-[1.02] transition-all cursor-pointer shadow-md"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>{selectedLang.code === 'ar' ? 'الانتقال لدليل المناسك الكامل' : 'Full Rituals Guide'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const msg = `*${selectedHajjStep.titleAr}* 🕋\n\n${selectedHajjStep.descAr}\n\n*الدعاء المأثور*: ${selectedHajjStep.duaAr}\n_المكان_: ${selectedHajjStep.locationAr}\n\nمن منصة عرفات لخدمة ضيوف الرحمن 🕌`;
                      handleSendWhatsAppMsg(msg);
                    }}
                    className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>{selectedLang.code === 'ar' ? 'مشاركة عبر واتساب' : 'Share WhatsApp'}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default ArafatLandingPage;
