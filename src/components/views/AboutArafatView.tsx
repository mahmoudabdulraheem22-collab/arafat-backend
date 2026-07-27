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
}

export const AboutArafatView: React.FC<AboutArafatViewProps> = ({
  language,
  onBack,
  onSendToWhatsapp,
}) => {
  const isAr = language.code === 'ar';
  const [activeTab, setActiveTab] = useState<string>('all');

  const sections = [
    {
      id: 'who_we_are',
      titleAr: 'من نحن',
      titleEn: 'Who We Are',
      icon: Building2,
      descAr:
        'منصة «عرفات» هي المنظومة التقنية الرقمية الذكية الرائدة والمخصصة لخدمة حجاج بيت الله الحرام والمعتمرين والزوار. ندمج أحدث تقنيات الذكاء الاصطناعي مع الخبرة العميقة في خدمة ضيوف الرحمن لتوفير تجربة إيمانية متكاملة وشخصية تبدأ من الفكرة والتخطيط حتى العودة إلى الوطن بسلام.',
      descEn:
        'Arafat Platform is the premier smart digital ecosystem dedicated to serving Hajj & Umrah pilgrims and visitors. We merge cutting-edge AI technology with deep pilgrimage expertise to provide an integrated spiritual experience from initial planning until a safe return home.',
      bulletsAr: [
        'منصة سعودية مبتكرة متوافقة مع الأنظمة واللوائح الرسمية',
        'دعم شامل لأكثر من 20 لغة عالمية و20 عملة دولية معتمدة',
        'مساعد ذكي تفاعلي يعمل على مدار الساعة للإجابة على التساؤلات',
      ],
      bulletsEn: [
        'Saudi-inspired innovative platform aligned with official standards',
        'Full multi-lingual support across 20 languages and 20 currencies',
        '24/7 Interactive AI Assistant answering instant pilgrimage queries',
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
      titleAr: 'لماذا عرفات؟',
      titleEn: 'Why Arafat?',
      icon: Sparkles,
      descAr:
        'تتميز منصة «عرفات» بأنها تجمع كل ما يحتاجه المعتمر والحاج في مكان واحد بتصميم إسلامي فاخر وسهل الاستخدام، بدعم من نماذج الذكاء الاصطناعي Gemini الفائقة لتلبية احتياجات كافة الثقافات واللغات.',
      descEn:
        'Arafat Platform stands out by unifying everything a pilgrim needs in one elegant, user-friendly Islamic interface, powered by advanced Gemini AI models to cater to all cultures and languages.',
      bulletsAr: [
        'ذكاء اصطناعي موجه يفهم خصوصية المناسك والأحكام الفقهية',
        'حاسبة ميزانية دقيقة تدعم 20 عملة دولية مع الأسعار المباشرة',
        'مساعد ترجمة فورية صوتية ونصية لتسهيل التواصل مع السائقين والمصالح',
        'ربط مباشر عبر الواتساب لإرسال واستلام البيانات بسرعة فائقة',
      ],
      bulletsEn: [
        'Specialized AI understanding the nuances of rituals and Islamic rules',
        'Precision budget calculator supporting 20 global currencies',
        'Live voice & text interpreter facilitating communication on the ground',
        'Direct WhatsApp Cloud integration for instant messaging & notifications',
      ],
    },
    {
      id: 'how_we_help',
      titleAr: 'كيف نساعد ضيوف الرحمن؟',
      titleEn: 'How We Assist Pilgrims',
      icon: HeartHandshake,
      descAr:
        'نصحب ضيف الرحمن خطوة بخطوة عبر محطات رحلته المباركة من خلال مجموعة أدوات متكاملة تضمن أعلى درجات الطمأنينة والسلامة:',
      descEn:
        'We accompany each pilgrim step-by-step across their sacred journey through a unified suite of tools ensuring safety, clarity, and peace of mind:',
      bulletsAr: [
        'التخطيط المسبق: تصميم الرحلة، اختيار الباقات، وحساب الميزانية المجهزة',
        'التصاريح والمواعيد: إرشادات استخراج وتتبع تصاريح نسك للروضة والعمرة',
        'الإرشاد الميداني: خريطة المعالم بالمدينة المنورة ومكة وبوابة صحتي والطوارئ',
        'التواصل والتفاعل: المساعد الذكي المباشر، والترجمة المباشرة للغات متعددة',
      ],
      bulletsEn: [
        'Pre-trip planning: Custom package design, hotel selection, and budget estimate',
        'Permits & Schedule: Step-by-step guidance for Nusuk Rawdah & Umrah permits',
        'Field Guidance: Interactive map of Makkah/Madinah landmarks & health emergency hub',
        'Communication: 24/7 AI guide & real-time interpreter for multi-lingual ease',
      ],
    },
    {
      id: 'partners',
      titleAr: 'كن الشريك والشركاء',
      titleEn: 'Partnership & Partners',
      icon: Users,
      descAr:
        'نعتز بالشراكات الاستراتيجية مع شركات العمرة والحج، الفنادق المعتمدة بمكة والمدينة المنورة، شركات النقل، والجهات الخدمية. نرحب بكافة الشركاء الراغبين في الانضمام لمنظومة عرفات الرقمية لتقديم أفضل الخدمات لضيوف الرحمن.',
      descEn:
        'We pride ourselves on strategic partnerships with certified Hajj & Umrah agencies, top hotels in Makkah & Madinah, transportation providers, and service agencies. We welcome all partners to join Arafat digital ecosystem.',
      bulletsAr: [
        'ربط تقني ذكي لعرض خدمات وباقات الشركاء لملايين الزوار',
        'برامج شراكة خاصة لشركات الحج والعمرة والوكالات الدولية',
        'تنسيق مباشر عبر الواتساب والدعم الفني المخصص للشركاء',
      ],
      bulletsEn: [
        'Smart API integration showcasing partner packages to millions of pilgrims',
        'Custom partner programs for Hajj/Umrah agencies & international operators',
        'Direct coordination via WhatsApp & dedicated partner technical support',
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
