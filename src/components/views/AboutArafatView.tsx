import React, { useState } from 'react';
import {
  Building2,
  Eye,
  Target,
  Sparkles,
  HeartHandshake,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Users,
  Compass,
  HelpCircle,
  MessageCircle,
  ExternalLink,
  Award,
  Globe2,
  Zap,
} from 'lucide-react';
import { LanguageOption } from '../../data/languages';

interface AboutArafatViewProps {
  language: LanguageOption;
  onBack: () => void;
  onSendToWhatsapp?: (msg: string) => void;
  initialSection?: string;
}

export const AboutArafatView: React.FC<AboutArafatViewProps> = ({
  language,
  onBack,
  onSendToWhatsapp,
  initialSection = 'all',
}) => {
  const isAr = language.code === 'ar';
  const [activeTab, setActiveTab] = useState<string>(initialSection);

  const sections = [
    {
      id: 'who_we_are',
      titleAr: '1. من نحن',
      titleEn: '1. Who We Are',
      icon: Building2,
      descAr:
        '«عرفات» هي المنظومة التقنية الرائدة والمخصصة لخدمة حجاج بيت الله الحرام وزوّار المسجد النبوي الشريف. ندمج أحدث تقنيات الذكاء الاصطناعي مع الخبرة العميقة والمصادر الشرعية المعتمدة، لنقدم تجربة إيمانية متكاملة تبدأ من مجرد فكرة السفر وحتى العودة إلى الديار بسلام وطمأنينة.',
      descEn:
        'Arafat is the leading digital tech ecosystem dedicated to serving Hajj & Umrah pilgrims and Prophet Mosque visitors. We combine state-of-the-art AI with deep domain expertise and accredited Islamic sources to deliver a holistic spiritual experience from trip inception to safe return home.',
      bulletsAr: [
        'منصة سعودية مبتكرة تتوافق تماماً مع الأنظمة واللوائح الرسمية.',
        'نظام شامل ومرن يدعم أكثر من 20 لغة عالمية و 20 عملة دولية.',
        'مساعد ذكي تفاعلي يعمل على مدار الساعة للإجابة عن كافة التساؤلات الفقهية والتنظيمية.',
      ],
      bulletsEn: [
        'Innovative Saudi platform fully compliant with official regulations.',
        'Comprehensive, flexible system supporting 20+ global languages & currencies.',
        '24/7 interactive AI assistant answering all jurisprudence & logistics questions.',
      ],
    },
    {
      id: 'vision',
      titleAr: 'رؤيتنا',
      titleEn: 'Our Vision',
      icon: Eye,
      descAr:
        'أن نكون المرجع الرقمي العالمي الأول والأنموذج الأرقى في تسخير الذكاء الاصطناعي لإثراء تجربة ضيوف الرحمن، بالانسجام التام مع مستهدفات رؤية المملكة 2030 لاستضافة ملايين الحجاج والمعتمرين وتقديم أرقى مستويات الراحة والسكينة.',
      descEn:
        'To be the leading global digital reference and premier benchmark in applying AI for enriching the pilgrim experience, fully aligned with Saudi Vision 2030 targets to welcome millions of pilgrims with maximum comfort and tranquility.',
      bulletsAr: [
        'الوصول لأكثر من 30 مليون معتمر وحاج سنوياً بخدمات رقمية موثوقة',
        'تحويل رحلة الحج والعمرة إلى تجربة سلسة خالصة للعبادة دون عناء',
        'الارتقاء بجودة الخدمات الرقمية للمشاعر المقدسة والحرمين الشريفين',
      ],
      bulletsEn: [
        'Reaching over 30 million annual pilgrims with trusted digital tools',
        'Transforming pilgrimage journeys into seamless, worship-focused experiences',
        'Elevating digital service quality in Makkah, Madinah, and Holy Sites',
      ],
    },
    {
      id: 'mission',
      titleAr: 'رسالتنا',
      titleEn: 'Our Mission',
      icon: Target,
      descAr:
        'تذليل كافة عقبات الرحلة الإيمانية من خلال توفير حلول رقمية مبتكرة تبدأ من تصميم الباقات وحساب الميزانية وتصاريح الروضة والعمرة، وحتى الإرشاد الميداني المباشر، والترجمة الفورية، لضمان تفرغ ضيف الرحمن للعبادة والدعاء.',
      descEn:
        'Eliminating every obstacle in the spiritual journey by delivering innovative digital tools ranging from trip designing, budget calculation, and permit booking, to real-time on-ground guidance and instant translation.',
      bulletsAr: [
        'تقديم معلومة موثوقة ومبسطة بالاعتماد على المصادر الرسمية',
        'تمكين ضيوف الرحمن من الوصول الفوري للخدمات الصحية والطوارئ',
        'توفير أدلة المناسك التفاعلية والأدعية المأثورة بالنطق الصوتي',
      ],
      bulletsEn: [
        'Providing verified, simplified information directly from official sources',
        'Empowering instant access to healthcare, navigation, and emergency support',
        'Delivering interactive ritual guides and supplications with voice audio',
      ],
    },
    {
      id: 'why_arafat',
      titleAr: '2. لماذا عرفات؟',
      titleEn: '2. Why Arafat?',
      icon: Sparkles,
      descAr:
        '«بسم الله الرحمن الرحيم»\n\n﴿وَإِذْ بَوَّأْنَا لِإِبْرَاهِيمَ مَكَانَ الْبَيْتِ أَنْ لَا تُشْرِكْ بِي شَيْئًا وَطَهِّرْ بَيْتِيَ لِلطَّائِفِينَ وَالْقَائِمِينَ وَالرُّكَّعِ السُّجُودِ﴾\n\nفي كل عصر، استخدم الإنسان أدوات عصره لخدمة الناس. واليوم أصبحت التقنية والذكاء الاصطناعي من أعظم أدوات هذا العصر، ومن هنا جاءت فكرة عرفات لخدمة ضيوف الرحمن وتيسير رحلتهم الإيمانية.',
      descEn:
        'In the name of Allah, the Most Gracious, the Most Merciful.\n\n"And [remember] when We designated for Abraham the site of the House, [saying], Do not associate anything with Me and purify My House for those who perform Tawaf..."\n\nIn every era, humanity has used the tools of its time to serve people. Arafat was born to harness technology and AI to serve the Guests of Allah.',
      bulletsAr: [
        'التقنية فيه وسيلة .. والإنسان هو الغاية .. وضيف الرحمن هو محور كل قرار.',
        'الشعار الرسمي للمشروع: «نسخر التقنية لخدمة ضيوف الرحمن، ليبقوا منشغلين بالعبادة، لا بالبحث عن الخدمات.»',
        'توفير وقت وجهد الحاج والمعتمر ليتفرغ تماماً للعبادة والخشوع ومناجاة رب العالمين.',
      ],
      bulletsEn: [
        'Technology is a means, humanity is the purpose, and the Pilgrim is the center of every decision.',
        'Official Slogan: "We harness technology to serve the guests of Allah, so they remain devoted to worship, not distracted by searching for services."',
        'Saving pilgrims time & effort so they can fully dedicate themselves to worship and prayer.',
      ],
    },
    {
      id: 'how_we_help',
      titleAr: '3. كيف نساعد ضيوف الرحمن؟',
      titleEn: '3. How We Assist Pilgrims',
      icon: HeartHandshake,
      descAr:
        'نأخذ بيد الحاج والمعتمر في كل خطوة، لنزيل عنه عناء التفكير والتنظيم. من خلال أدواتنا الرقمية التفاعلية، نحول تعقيدات السفر والتنقل إلى خطوات واضحة وميسرة، ليكون التركيز الأوحد لضيف الرحمن هو الخشوع ومناجاة الله.',
      descEn:
        'We hold the pilgrim’s hand at every single step, removing the burden of planning and logistics. Through interactive digital tools, we streamline complex travel details so pilgrims can focus purely on spiritual reflection and devotion.',
      bulletsAr: [
        'تصميم باقات مخصصة (طيران، سكن، تنقلات) تتناسب مع ميزانية ووقت كل زائر.',
        'تتبع حي ومباشر للمناسك مع «عدّاد ذكي» لأشواط الطواف والسعي.',
        'خرائط تفاعلية دقيقة للحرمين الشريفين والمشاعر المقدسة لتجنب الضياع والزحام.',
        'زر طوارئ (SOS) لإرسال الموقع الجغرافي الفوري لفرق المساعدة الطبية والأمنية.',
      ],
      bulletsEn: [
        'Custom Package Design (flights, hotels, transport) matching every visitor budget.',
        'Live Ritual Tracking with Smart Tawaf & Sa\'i lap counters.',
        'Precise Interactive Maps for Holy Mosques & Holy Sites to avoid crowd delays.',
        'SOS Emergency Button broadcasting instant GPS location to medical & security response.',
      ],
    },
    {
      id: 'partners',
      titleAr: '4. كن الشريك والوكيل',
      titleEn: '4. Become a Partner & Agent',
      icon: Users,
      descAr:
        'نؤمن في «عرفات» بأن خدمة ضيوف الرحمن شرف لا يُضاهى، وتعاوننا مع الشركاء هو مفتاح للارتقاء بهذه الخدمة. ندعو وكالات السفر، حملات الحج والعمرة، ومقدمي الخدمات للانضمام إلى شبكتنا وقيادة التحول الرقمي في قطاع السياحة الدينية وخدمة المعتمرين.',
      descEn:
        'At Arafat, we believe serving the guests of Allah is an unmatched honor, and partnering with industry leaders is key to elevating service quality. We invite travel agencies, Hajj & Umrah operators, and service providers to join our network.',
      bulletsAr: [
        'لوحة تحكم متقدمة لإدارة حجوزات عملائك وحملاتك بكل احترافية وسهولة.',
        'الوصول إلى شريحة عالمية واسعة من المعتمرين والحجاج المستهدفين.',
        'تكامل رقمي مرن (API) يربط خدماتك ووكالتك بمنصتنا الذكية بسلاسة.',
        'دعم فني وتقني مستدام لضمان تقديمك أعلى معايير الجودة لضيوفك.',
      ],
      bulletsEn: [
        'Advanced Dashboard to manage client bookings and campaign details effortlessly.',
        'Access to a broad global audience of targeted Hajj & Umrah pilgrims.',
        'Flexible API Integration linking your services seamlessly with our smart platform.',
        'Dedicated Technical Support ensuring the highest service quality for your guests.',
      ],
    },
  ];

  const handlePartnerCTA = () => {
    const msg = isAr
      ? 'السلام عليكم، أود التواصل مع فريق منصة عرفات لبحث فرص الشراكة والانضمام كشريك استراتيجي.'
      : 'Hello, I would like to contact the Arafat platform team to discuss partnership opportunities.';
    if (onSendToWhatsapp) {
      onSendToWhatsapp(msg);
    } else {
      window.open(`https://wa.me/966546068859?text=${encodeURIComponent(msg)}`, '_blank');
    }
  };

  return (
    <div className="bg-[#03291F]/95 border-2 border-[#D4AF37] rounded-3xl p-4 sm:p-8 text-[#F8F3E7] shadow-[0_15px_50px_rgba(0,0,0,0.8)] backdrop-blur-md max-w-5xl mx-auto my-4 space-y-6">
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-[#D4AF37]/30 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#02130D] border border-[#D4AF37] rounded-2xl text-[#D4AF37]">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <span>{isAr ? 'عن منصة عرفات' : 'About Arafat Platform'}</span>
              <Sparkles className="w-5 h-5 text-[#D4AF37]" />
            </h2>
            <p className="text-xs sm:text-sm text-[#D4AF37]/90 font-medium">
              {isAr
                ? 'تعرّف على رؤيتنا، رسالتنا، خدماتنا، وكيف نخدم ضيوف الرحمن وشركائنا'
                : 'Learn about our vision, mission, services, & how we empower pilgrims'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 bg-[#02130D] hover:bg-[#073D2F] border border-[#D4AF37]/60 text-[#D4AF37] font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <ArrowRight className={`w-4 h-4 ${!isAr ? 'rotate-180' : ''}`} />
          <span>{isAr ? 'العودة للرئيسية' : 'Back to Home'}</span>
        </button>
      </div>

      {/* Quick Navigation Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 border-b border-[#D4AF37]/20">
        <button
          type="button"
          onClick={() => setActiveTab('all')}
          className={`px-3.5 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer shrink-0 ${
            activeTab === 'all'
              ? 'bg-[#D4AF37] text-[#02130D] border-[#D4AF37]'
              : 'bg-[#02130D] text-[#D4AF37] border-[#D4AF37]/40 hover:bg-[#073D2F]'
          }`}
        >
          {isAr ? 'الكل (6 أقسام)' : 'All (6 Sections)'}
        </button>

        {sections.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setActiveTab(s.id)}
            className={`px-3.5 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer shrink-0 ${
              activeTab === s.id
                ? 'bg-[#D4AF37] text-[#02130D] border-[#D4AF37]'
                : 'bg-[#02130D] text-[#D4AF37] border-[#D4AF37]/40 hover:bg-[#073D2F]'
            }`}
          >
            {isAr ? s.titleAr : s.titleEn}
          </button>
        ))}
      </div>

      {/* Sections Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {sections
          .filter((s) => activeTab === 'all' || activeTab === s.id)
          .map((sec) => {
            const Icon = sec.icon;
            const isPartner = sec.id === 'partners';
            const isWhyArafat = sec.id === 'why_arafat';

            if (isWhyArafat) {
              return (
                <div
                  key={sec.id}
                  className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#021811] via-[#03291F] to-[#01140E] border-2 border-[#D4AF37] shadow-2xl md:col-span-2 space-y-6 text-[#F8F3E7]"
                >
                  {/* Header Title & Icon */}
                  <div className="flex items-center justify-between border-b border-[#D4AF37]/30 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-[#03291F] border border-[#D4AF37] rounded-2xl text-[#D4AF37] shadow-md">
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-xl sm:text-2xl font-black text-white">
                          {isAr ? sec.titleAr : sec.titleEn}
                        </h3>
                        <p className="text-xs sm:text-sm text-[#D4AF37]">
                          {isAr ? 'رؤية المنظومة، الرسالة الجوهرية والشعار الرسمي' : 'Core Vision, Philosophical Mission & Official Slogan'}
                        </p>
                      </div>
                    </div>

                    <span className="px-3 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37] text-xs font-black text-[#D4AF37] shadow-sm">
                      {isAr ? 'رؤية عرفات' : 'Arafat Vision'}
                    </span>
                  </div>

                  {/* 1. Quranic Verse Box */}
                  <div className="bg-gradient-to-b from-[#021A12] to-[#03291F] border-2 border-[#D4AF37] p-5 sm:p-6 rounded-2xl shadow-inner text-center space-y-3">
                    <p className="text-xs sm:text-sm font-black text-[#D4AF37] tracking-widest">
                      {isAr ? 'بسم الله الرحمن الرحيم' : 'In the name of Allah, the Most Gracious, the Most Merciful'}
                    </p>
                    <div className="p-3 bg-[#02130D]/70 border border-[#D4AF37]/40 rounded-xl shadow-md">
                      <p className="text-base sm:text-2xl font-bold text-[#F8F3E7] font-serif leading-loose">
                        {isAr
                          ? '﴿وَإِذْ بَوَّأْنَا لِإِبْرَاهِيمَ مَكَانَ الْبَيْتِ أَنْ لَا تُشْرِكْ بِي شَيْئًا وَطَهِّرْ بَيْتِيَ لِلطَّائِفِينَ وَالْقَائِمِينَ وَالرُّكَّعِ السُّجُودِ﴾'
                          : '"And [remember] when We designated for Abraham the site of the House, [saying], Do not associate anything with Me and purify My House for those who perform Tawaf and those who stand [in prayer] and those who bow and prostrate."'}
                      </p>
                    </div>
                    <span className="inline-block text-[11px] text-[#D4AF37]/90 font-bold px-3 py-0.5 rounded-full bg-[#02130D] border border-[#D4AF37]/30">
                      {isAr ? 'سورة الحج - الآية 26' : 'Surah Al-Hajj - Verse 26'}
                    </span>
                  </div>

                  {/* 2. Main Narrative Text */}
                  <div className="space-y-4 text-xs sm:text-base leading-relaxed text-[#F8F3E7]/95 font-serif">
                    <p className="font-semibold text-[#D4AF37] text-sm sm:text-lg border-r-4 border-[#D4AF37] pr-3">
                      {isAr ? 'لماذا عرفات؟' : 'Why Arafat?'}
                    </p>

                    <p>
                      {isAr
                        ? 'في كل عصر، استخدم الإنسان أدوات عصره لخدمة الناس. واليوم أصبحت التقنية والذكاء الاصطناعي من أعظم أدوات هذا العصر.'
                        : 'In every era, humanity has used the tools of its time to serve people. Today, technology and artificial intelligence have become among the greatest tools of this age.'}
                    </p>

                    <p>
                      {isAr
                        ? 'لكن قيمة التقنية لا تُقاس بقدرتها على معالجة البيانات أو سرعة تنفيذ الأوامر، وإنما بقدرتها على خدمة الإنسان وتحسين حياته. ومن هنا جاءت فكرة عرفات.'
                        : 'However, the true value of technology is not measured by its data processing power or execution speed, but by its capacity to serve humanity and enrich lives. And from this principle, the concept of Arafat was born.'}
                    </p>

                    <p>
                      {isAr
                        ? 'لم تبدأ الفكرة بكتابة برنامج، ولم تبدأ ببناء موقع إلكتروني، بل بدأت بسؤال بسيط:'
                        : 'The idea did not begin with writing a program or building a website; it began with a simple question:'}
                    </p>

                    {/* Question Highlight Box */}
                    <div className="p-4 bg-[#02130D] border-2 border-[#D4AF37] rounded-2xl text-center my-3 shadow-lg">
                      <p className="text-sm sm:text-xl font-black text-[#D4AF37] font-serif">
                        {isAr
                          ? '«كيف يمكن أن نُسخّر الذكاء الاصطناعي لخدمة ضيوف الرحمن؟»'
                          : '"How can we harness artificial intelligence to serve the Guests of the Most Merciful?"'}
                      </p>
                    </div>

                    <p>
                      {isAr
                        ? 'ومن هذا السؤال بدأت رحلة طويلة من التطوير، بدأت بمحرك عام للذكاء الاصطناعي، ثم تطورت عبر عدة مراحل حتى أصبحت رؤية متكاملة لمنصة ترافق الحاج والمعتمر قبل رحلته وأثناءها وبعد عودته.'
                        : 'From this question began a long journey of development, starting from a general AI engine, evolving through multiple stages into a holistic vision for a platform accompanying every pilgrim before, during, and after their journey.'}
                    </p>

                    <p>
                      {isAr
                        ? 'لم يكن الهدف أن يحل الذكاء الاصطناعي محل الإنسان، بل أن يزيل عنه الحيرة، ويختصر عليه الوقت، وييسر له الوصول إلى الخدمة الصحيحة في الوقت المناسب.'
                        : 'The goal was never for artificial intelligence to replace human care, but to remove confusion, save time, and facilitate smooth access to the right service at the exact right moment.'}
                    </p>

                    <p className="font-bold text-white">
                      {isAr
                        ? 'ولهذا فإن عرفات ليس مشروعًا تقنيًا فحسب، بل مشروع خدمة.'
                        : 'Therefore, Arafat is not merely a technological project; it is a dedicated service mission.'}
                    </p>
                  </div>

                  {/* 3. The Three Core Pillars */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
                    <div className="p-3.5 bg-[#02130D] border border-[#D4AF37]/60 rounded-xl text-center space-y-1 shadow-md">
                      <span className="text-lg">⚙️</span>
                      <p className="text-xs sm:text-sm font-black text-[#D4AF37]">
                        {isAr ? 'التقنية فيه وسيلة' : 'Technology is a Means'}
                      </p>
                    </div>
                    <div className="p-3.5 bg-[#02130D] border border-[#D4AF37]/60 rounded-xl text-center space-y-1 shadow-md">
                      <span className="text-lg">🤝</span>
                      <p className="text-xs sm:text-sm font-black text-[#D4AF37]">
                        {isAr ? 'والإنسان هو الغاية' : 'Humanity is the Purpose'}
                      </p>
                    </div>
                    <div className="p-3.5 bg-[#02130D] border border-[#D4AF37]/60 rounded-xl text-center space-y-1 shadow-md">
                      <span className="text-lg">🕋</span>
                      <p className="text-xs sm:text-sm font-black text-[#D4AF37]">
                        {isAr ? 'وضيف الرحمن هو محور كل قرار' : 'The Pilgrim is at the Heart of Every Decision'}
                      </p>
                    </div>
                  </div>

                  {/* 4. Official Slogan Card */}
                  <div className="p-5 sm:p-6 bg-gradient-to-r from-[#021811] via-[#073D2F] to-[#021811] border-2 border-[#D4AF37] rounded-2xl shadow-xl space-y-3">
                    <div className="flex items-center gap-2 text-xs font-black text-[#D4AF37] uppercase tracking-wider">
                      <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                      <span>{isAr ? 'الشعار الرسمي لمشروع عرفات' : 'Official Platform Slogan'}</span>
                    </div>

                    <div className="py-3 border-y border-[#D4AF37]/40 text-center">
                      <p className="text-base sm:text-2xl font-black text-white font-serif leading-relaxed text-[#F5E5BE]">
                        {isAr
                          ? '«نسخر التقنية لخدمة ضيوف الرحمن، ليبقوا منشغلين بالعبادة، لا بالبحث عن الخدمات.»'
                          : '"We harness technology to serve the guests of Allah, so they remain devoted to worship, not distracted by searching for services."'}
                      </p>
                    </div>

                    <p className="text-xs sm:text-sm text-[#F8F3E7]/90 leading-relaxed font-serif pt-1">
                      {isAr
                        ? 'هذه الجملة تحمل رسالة عملية واضحة: كل دقيقة يقضيها الحاج أو المعتمر في البحث عن فندق، أو وسيلة نقل، أو معلومة، أو حل لمشكلة، هي دقيقة يمكن للتقنية أن توفرها له ليصرفها فيما جاء من أجله.'
                        : 'This sentence carries a clear, actionable message: every minute a pilgrim spends searching for a hotel, transportation, information, or solving a logistics issue is a minute that technology can save—allowing them to devote it entirely to the spiritual purpose they came for.'}
                    </p>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={sec.id}
                className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
                  isPartner
                    ? 'bg-gradient-to-br from-[#021811] via-[#03291F] to-[#073D2F] border-[#D4AF37] shadow-xl md:col-span-2'
                    : 'bg-[#021811] border-[#D4AF37]/40 hover:border-[#D4AF37]'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2.5 bg-[#03291F] border border-[#D4AF37] rounded-xl text-[#D4AF37]">
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="text-base sm:text-lg font-black text-white">
                        {isAr ? sec.titleAr : sec.titleEn}
                      </h3>
                    </div>

                    <span className="px-2.5 py-0.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/60 text-[10px] font-bold text-[#D4AF37]">
                      {isAr ? 'منصة عرفات' : 'Arafat Platform'}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-[#F8F3E7]/90 leading-relaxed font-serif">
                    {isAr ? sec.descAr : sec.descEn}
                  </p>

                  <div className="p-3 bg-[#03291F]/80 border border-[#D4AF37]/20 rounded-xl space-y-2">
                    { (isAr ? sec.bulletsAr : sec.bulletsEn).map((b, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-[#F8F3E7]/80">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {isPartner && (
                  <div className="pt-2 border-t border-[#D4AF37]/30 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-xs text-[#D4AF37] font-semibold">
                      {isAr ? 'هل تمثل شركة عمرة، فندقاً، أو مزود خدمة لنقل ضيوف الرحمن؟' : 'Representing a Hajj agency, hotel, or transport provider?'}
                    </p>
                    <button
                      type="button"
                      onClick={handlePartnerCTA}
                      className="px-5 py-2.5 bg-[#D4AF37] hover:bg-[#F5E5BE] text-[#02130D] font-black text-xs sm:text-sm rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-lg shrink-0"
                    >
                      <MessageCircle className="w-4 h-4 fill-current" />
                      <span>{isAr ? 'الانضمام كشريك عبر الواتساب' : 'Join as Partner via WhatsApp'}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default AboutArafatView;
