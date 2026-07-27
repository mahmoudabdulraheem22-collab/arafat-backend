import React from 'react';
import {
  Activity,
  PhoneCall,
  MapPin,
  ShieldAlert,
  Heart,
  ArrowRight,
  Crosshair,
  Pill,
} from 'lucide-react';
import { LanguageOption } from '../../data/languages';

interface MyHealthViewProps {
  language: LanguageOption;
  onBack: () => void;
  onSendToWhatsapp: (message: string) => void;
}

export const MyHealthView: React.FC<MyHealthViewProps> = ({
  language,
  onBack,
  onSendToWhatsapp,
}) => {
  const isAr = language.code === 'ar';

  const emergencyNumbers = [
    { titleAr: 'الإسعاف السعودي (طوارئ الحرم والمشاعر)', titleEn: 'Saudi Ambulance (Red Crescent)', number: '997' },
    { titleAr: 'المركز الوطني للعمليات الأمنية الموحدة', titleEn: 'Unified Emergency Services', number: '911' },
    { titleAr: 'مركز العناية بضيوف الرحمن (وزارة الحج)', titleEn: 'Pilgrims Care Center', number: '1966' },
  ];

  const nearbyHospitals = [
    { nameAr: 'مستشفى أجياد للطوارئ (بجوار باب الملك عبد العزيز)', nameEn: 'Ajyad Emergency Hospital (Haram)', distance: '0.2 كم', phone: '0125700000' },
    { nameAr: 'مستشفى الحرم الطوارئ الميداني', nameEn: 'Haram Field Emergency Center', distance: 'داخل ساحة الحرم', phone: '997' },
    { nameAr: 'مستشفى شرق عرفات العام', nameEn: 'East Arafat General Hospital', distance: 'صعيد عرفات', phone: '0125501111' },
    { nameAr: 'مستشفى منى الشارع الجديد', nameEn: 'Mina New Street Hospital', distance: 'مشعر منى', phone: '0125588888' },
  ];

  const firstAidTips = [
    { titleAr: 'تفادي ضربات الشمس والإجهاد الحراري', textAr: 'استخدم المظلة الشمسية باستمرار، واشرب كميات كافية من ماء زمزم والسوائل الباردة، وتجنب المشي تحت الشمس المباشرة في أوقات الظهيرة.' },
    { titleAr: 'العناية بالقدمين والتسلخات', textAr: 'ارتدِ جوارب مريحة ونظيفة، واستخدم مرهم التسلخات الواقي قبل مشي المسافات الطويلة بين السكن والحرم.' },
    { titleAr: 'مرضى السكري والضغط', textAr: 'احفظ أ دويتك الأساسية ورخصة مرضك في حقيبتك الصغيرة المباشرة مع الاحتفاظ بوجبة خفيفة ومصدر سكر سريع.' },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 bg-[#021811]/95 text-[#F8F3E7] rounded-3xl border-2 border-[#D4AF37] shadow-[0_20px_50px_rgba(0,0,0,0.9)] my-6">
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-[#D4AF37]/30 pb-4 mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#D4AF37]/60 bg-[#03291F] hover:bg-[#073D2F] text-[#D4AF37] transition-all text-sm font-bold cursor-pointer"
        >
          <ArrowRight className={`w-4 h-4 ${!isAr ? 'rotate-180' : ''}`} />
          <span>{isAr ? 'العودة للرئيسية' : 'Back to Home'}</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-red-500/20 border border-red-500 flex items-center justify-center text-red-400">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-[#D4AF37]">
              {isAr ? 'صحتي والدليل الطبي لضيوف الرحمن' : 'My Health & Emergency Guide'}
            </h2>
            <p className="text-xs text-[#F8F3E7]/70">
              {isAr ? 'أقرب مستشفى وصيدلية، أرقام الطوارئ المباشرة، والإسعافات الأولية' : 'Nearby hospitals, pharmacies & direct emergency hotline'}
            </p>
          </div>
        </div>
      </div>

      {/* Emergency Hotlines Box */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        {emergencyNumbers.map((num, i) => (
          <a
            key={i}
            href={`tel:${num.number}`}
            className="p-4 rounded-2xl bg-gradient-to-r from-red-950/80 to-[#03291F] border-2 border-red-500/60 hover:border-red-500 flex items-center justify-between transition-all cursor-pointer shadow-lg group"
          >
            <div>
              <span className="text-xs text-[#F8F3E7]/80 block font-medium">{isAr ? num.titleAr : num.titleEn}</span>
              <span className="text-2xl font-black text-red-400 group-hover:scale-105 transition-transform inline-block mt-1">
                {num.number}
              </span>
            </div>
            <div className="w-10 h-10 rounded-full bg-red-500/20 border border-red-500 flex items-center justify-center text-red-400">
              <PhoneCall className="w-5 h-5" />
            </div>
          </a>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Nearby Hospitals List */}
        <div className="lg:col-span-6 space-y-3">
          <h3 className="text-sm font-bold text-[#D4AF37] flex items-center gap-2 mb-2">
            <MapPin className="w-4 h-4" />
            <span>{isAr ? 'أقرب المستشفيات والمراكز الطبية:' : 'Nearby Hospitals & Clinics:'}</span>
          </h3>

          {nearbyHospitals.map((h, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-[#03291F] border border-[#D4AF37]/40 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-xs text-white mb-1">{isAr ? h.nameAr : h.nameEn}</h4>
                <span className="text-[10px] text-[#D4AF37] font-medium">{isAr ? `المسافة: ${h.distance}` : `Distance: ${h.distance}`}</span>
              </div>
              <a
                href={`tel:${h.phone}`}
                className="px-3 py-1.5 rounded-xl bg-red-500/20 border border-red-500/60 text-red-300 font-bold text-xs hover:bg-red-500 hover:text-white transition-all flex items-center gap-1"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>{h.phone}</span>
              </a>
            </div>
          ))}
        </div>

        {/* First Aid & Health Advice */}
        <div className="lg:col-span-6 space-y-3">
          <h3 className="text-sm font-bold text-[#D4AF37] flex items-center gap-2 mb-2">
            <ShieldAlert className="w-4 h-4" />
            <span>{isAr ? 'الإسعافات الأولية والتوجيهات الوقائية:' : 'First Aid & Preventive Tips:'}</span>
          </h3>

          {firstAidTips.map((tip, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-[#03291F] border border-[#D4AF37]/30 space-y-1">
              <h4 className="font-bold text-xs text-[#D4AF37]">{tip.titleAr}</h4>
              <p className="text-xs text-[#F8F3E7]/80 leading-relaxed">{tip.textAr}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyHealthView;
