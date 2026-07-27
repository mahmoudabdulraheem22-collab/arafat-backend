import React, { useState } from 'react';
import {
  Package,
  User,
  Users,
  Building,
  Check,
  Send,
  ArrowRight,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { CurrencyOption, formatPrice } from '../../data/currencies';
import { LanguageOption } from '../../data/languages';

interface PackagesViewProps {
  currency: CurrencyOption;
  language: LanguageOption;
  onBack: () => void;
  onSelectPlan: (planName: string, priceSAR: number) => void;
}

export const PackagesView: React.FC<PackagesViewProps> = ({
  currency,
  language,
  onBack,
  onSelectPlan,
}) => {
  const isAr = language.code === 'ar';

  const packages = [
    {
      id: 'individual',
      nameAr: 'باقة الأفراد الممتازة',
      nameEn: 'Individual VIP Package',
      icon: User,
      priceSAR: 3800,
      badgeAr: 'الأكثر طلبًا للأفراد',
      badgeEn: 'Popular Choice',
      featuresAr: [
        'فندق 5 نجوم قريب من الحرم المكي والمدني',
        'استقبال وتوديع خاص في المطار بسيارة VIP',
        'توفير واستخراج تصاريح العمرة والروضة عبر نسك',
        'دعم وإرشاد من المطوّف الشخصي المباشر',
        'شريحة اتصالات 5G مفتوحة البيانات',
      ],
    },
    {
      id: 'family',
      nameAr: 'باقة العائلة الذهبية',
      nameEn: 'Family Golden Package',
      icon: Users,
      priceSAR: 9500,
      badgeAr: 'توفير للعائلات (4-6 أفراد)',
      badgeEn: 'Best Family Value',
      featuresAr: [
        'أجنحة فندقية فاخرة متصلة مطلة على الحرم',
        'حافلة/سيارة عائلية خاصة GMC Yukon طوال الرحلة',
        'جولات مزارات كاملة (جبل النور، حراء، مساجد المدينة)',
        'وجبات بوفيه مفتوح كاملة لجميع أفراد الأسرة',
        'خدمة الكراسي المتحركة لكبار السن مجانًا',
      ],
    },
    {
      id: 'corporate',
      nameAr: 'باقة الشركات والمجموعات',
      nameEn: 'Corporate & Group Package',
      icon: Building,
      priceSAR: 24000,
      badgeAr: 'للمؤسسات والرحلات الجماعيه',
      badgeEn: 'Corporate & Hajj Groups',
      featuresAr: [
        'حجز أدوار كاملة وفنادق فاخرة بحسب العدد',
        'حافلات سياحية VIP حديثة مجهزة للرحلات البرية',
        'منسق ومطوّف خاص باللغة المطلوبة للمجموعة',
        'إعاشة متكاملة وبوفيهات مفتوحة ووجبات خفيفة',
        'إصدار كشوفات التصاريح والتأمين الطبي الموحد',
      ],
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 bg-[#021811]/95 text-[#F8F3E7] rounded-3xl border-2 border-[#D4AF37] shadow-[0_20px_50px_rgba(0,0,0,0.9)] my-6 space-y-6">
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-[#D4AF37]/30 pb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#D4AF37]/60 bg-[#03291F] hover:bg-[#073D2F] text-[#D4AF37] transition-all text-sm font-bold cursor-pointer"
        >
          <ArrowRight className={`w-4 h-4 ${!isAr ? 'rotate-180' : ''}`} />
          <span>{isAr ? 'العودة للرئيسية' : 'Back to Home'}</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center text-[#D4AF37]">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-[#D4AF37]">
              {isAr ? 'باقات عرفات الجاهزة والمقارنة' : 'Arafat Ready Packages'}
            </h2>
            <p className="text-xs text-[#F8F3E7]/70">
              {isAr ? 'باقات الأفراد، العائلة، والشركات مع المقارنة الفورية للمزايا' : 'Individual, family & corporate packages compared'}
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#03291F] border border-[#D4AF37]/50 text-xs font-bold text-[#D4AF37]">
          <span>{currency.code} ({currency.symbol})</span>
        </div>
      </div>

      {/* Package Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {packages.map((pkg) => {
          const IconComponent = pkg.icon;
          return (
            <div
              key={pkg.id}
              className="bg-gradient-to-b from-[#03291F] to-[#01140E] p-6 rounded-3xl border-2 border-[#D4AF37] flex flex-col justify-between relative shadow-[0_10px_30px_rgba(0,0,0,0.8)] hover:scale-[1.02] transition-transform"
            >
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#02130D] bg-[#D4AF37] px-3 py-1 rounded-full inline-block mb-3">
                  {isAr ? pkg.badgeAr : pkg.badgeEn}
                </span>

                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-[#02130D] border border-[#D4AF37] flex items-center justify-center text-[#D4AF37]">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <h3 className="font-black text-base text-white">{isAr ? pkg.nameAr : pkg.nameEn}</h3>
                </div>

                <div className="my-4 p-3 rounded-2xl bg-[#02130D] border border-[#D4AF37]/30 text-center">
                  <span className="text-[10px] text-[#D4AF37] block font-bold mb-0.5">{isAr ? 'التكلفة الإجمالية للباقة' : 'Total Price'}</span>
                  <div className="text-2xl font-black text-white">{formatPrice(pkg.priceSAR, currency)}</div>
                </div>

                <ul className="space-y-2.5 text-xs text-[#F8F3E7]/90 mb-6">
                  {pkg.featuresAr.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => onSelectPlan(pkg.nameAr, pkg.priceSAR)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA820A] text-[#02130D] font-black text-xs flex items-center justify-center gap-2 hover:from-[#E5C158] transition-all cursor-pointer shadow-lg"
              >
                <Send className="w-4 h-4 text-[#02130D]" />
                <span>{isAr ? 'حجز واشتراك في الباقة' : 'Select & Book Package'}</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PackagesView;
