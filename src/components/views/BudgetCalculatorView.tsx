import React, { useState } from 'react';
import {
  Wallet,
  Calendar,
  Users,
  Building,
  Car,
  Utensils,
  Calculator,
  CheckCircle2,
  Send,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { CurrencyOption, formatPrice } from '../../data/currencies';
import { LanguageOption } from '../../data/languages';

interface BudgetCalculatorViewProps {
  currency: CurrencyOption;
  language: LanguageOption;
  onBack: () => void;
  onSendToWhatsapp: (details: string) => void;
}

export const BudgetCalculatorView: React.FC<BudgetCalculatorViewProps> = ({
  currency,
  language,
  onBack,
  onSendToWhatsapp,
}) => {
  const isAr = language.code === 'ar';

  // Form State
  const [days, setDays] = useState<number>(7);
  const [people, setPeople] = useState<number>(2);
  const [accommodation, setAccommodation] = useState<'luxury' | 'central' | 'standard' | 'economy'>('central');
  const [transport, setTransport] = useState<'train' | 'vip' | 'bus' | 'shuttle'>('train');
  const [meals, setMeals] = useState<'full' | 'half' | 'self'>('half');
  const [addons, setAddons] = useState<{ [key: string]: boolean }>({
    zamzam: true,
    ziyarat: true,
    vipLounge: false,
    wheelchair: false,
  });

  // Rates in SAR (Base) per day or per item
  const accommodationRates = {
    luxury: 1200, // 5 Stars Front Row
    central: 650,  // 4 Stars Central
    standard: 350, // 3 Stars
    economy: 200,  // Economy
  };

  const transportRates = {
    train: 220 * people, // Haramain Train tickets per person
    vip: 1500,           // Private VIP SUV for group
    bus: 350,            // Private bus
    shuttle: 80 * people,// Shuttle
  };

  const mealRatesPerPersonPerDay = {
    full: 150,
    half: 90,
    self: 40,
  };

  // Calculations
  const hotelCostSAR = accommodationRates[accommodation] * days;
  const transportCostSAR = transportRates[transport];
  const mealCostSAR = mealRatesPerPersonPerDay[meals] * people * days;
  
  let addonsCostSAR = 0;
  if (addons.zamzam) addonsCostSAR += 50 * people;
  if (addons.ziyarat) addonsCostSAR += 180 * people;
  if (addons.vipLounge) addonsCostSAR += 300 * people;
  if (addons.wheelchair) addonsCostSAR += 250;

  const totalCostSAR = hotelCostSAR + transportCostSAR + mealCostSAR + addonsCostSAR;
  const perPersonCostSAR = Math.round(totalCostSAR / Math.max(1, people));

  const handleSendDetails = () => {
    const summary = isAr
      ? `*خطتي وميزانيتي قبل الرحلة (منصة عرفات)*:\n- مدة الرحلة: ${days} أيام\n- عدد الأشخاص: ${people}\n- السكن: ${
          accommodation === 'luxury' ? 'فندق 5 نجوم مطل' : accommodation === 'central' ? 'فندق 4 نجوم مركزي' : 'فندق 3 نجوم'
        }\n- وسيلة النقل: ${
          transport === 'train' ? 'قطار الحرمين السريع' : transport === 'vip' ? 'سيارة VIP خاصة' : 'حافلة حديثة'
        }\n- الإجمالي التقريبي: ${formatPrice(totalCostSAR, currency)} (${formatPrice(perPersonCostSAR, currency)} للشخص)`
      : `*My Trip Budget Plan (Arafat Platform)*:\n- Duration: ${days} days\n- Pilgrims: ${people}\n- Accommodation: ${accommodation}\n- Transport: ${transport}\n- Estimated Total: ${formatPrice(
          totalCostSAR,
          currency
        )} (${formatPrice(perPersonCostSAR, currency)}/person)`;

    onSendToWhatsapp(summary);
  };

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
          <div className="w-10 h-10 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center text-[#D4AF37]">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-[#D4AF37]">
              {isAr ? 'خطتي وميزانيتي قبل الرحلة' : 'My Trip Budget Plan'}
            </h2>
            <p className="text-xs text-[#F8F3E7]/70">
              {isAr ? 'حساب تكاليف الإقامة والنقل والإعاشة بالعملة المحددة' : 'Calculate stay, transport & meals in selected currency'}
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#03291F] border border-[#D4AF37]/50 text-xs font-bold text-[#D4AF37]">
          <span>{currency.code} ({currency.symbol})</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Controls */}
        <div className="lg:col-span-7 space-y-5">
          {/* 1. Duration & People */}
          <div className="bg-[#03291F]/80 p-4 sm:p-5 rounded-2xl border border-[#D4AF37]/30 space-y-4">
            <h3 className="text-sm font-bold text-[#D4AF37] flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{isAr ? 'مدة الرحلة وعدد أفراد الأسرة' : 'Trip Duration & Travelers'}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-[#F8F3E7]/80 mb-1.5 block">
                  {isAr ? 'مدة الإقامة (أيام):' : 'Stay Duration (Days):'}
                </label>
                <div className="flex items-center gap-3 bg-[#02130D] border border-[#D4AF37]/40 rounded-xl p-2">
                  <button
                    onClick={() => setDays(Math.max(1, days - 1))}
                    className="w-8 h-8 rounded-lg bg-[#073D2F] text-[#D4AF37] font-bold text-lg hover:bg-[#D4AF37] hover:text-[#02130D] transition-colors"
                  >
                    -
                  </button>
                  <span className="flex-1 text-center font-black text-lg text-white">{days} {isAr ? 'أيام' : 'Days'}</span>
                  <button
                    onClick={() => setDays(days + 1)}
                    className="w-8 h-8 rounded-lg bg-[#073D2F] text-[#D4AF37] font-bold text-lg hover:bg-[#D4AF37] hover:text-[#02130D] transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs text-[#F8F3E7]/80 mb-1.5 block">
                  {isAr ? 'عدد الأشخاص / الحجاج:' : 'Number of Pilgrims:'}
                </label>
                <div className="flex items-center gap-3 bg-[#02130D] border border-[#D4AF37]/40 rounded-xl p-2">
                  <button
                    onClick={() => setPeople(Math.max(1, people - 1))}
                    className="w-8 h-8 rounded-lg bg-[#073D2F] text-[#D4AF37] font-bold text-lg hover:bg-[#D4AF37] hover:text-[#02130D] transition-colors"
                  >
                    -
                  </button>
                  <span className="flex-1 text-center font-black text-lg text-white">{people} {isAr ? 'أشخاص' : 'People'}</span>
                  <button
                    onClick={() => setPeople(people + 1)}
                    className="w-8 h-8 rounded-lg bg-[#073D2F] text-[#D4AF37] font-bold text-lg hover:bg-[#D4AF37] hover:text-[#02130D] transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Accommodation Selection */}
          <div className="bg-[#03291F]/80 p-4 sm:p-5 rounded-2xl border border-[#D4AF37]/30 space-y-3">
            <h3 className="text-sm font-bold text-[#D4AF37] flex items-center gap-2">
              <Building className="w-4 h-4" />
              <span>{isAr ? 'نوع السكن والإقامة' : 'Accommodation Type'}</span>
            </h3>

            <div className="grid grid-cols-2 gap-2.5">
              {[
                { id: 'luxury', titleAr: '5 نجوم مطل على الحرم', titleEn: '5-Star Haram View', rate: 1200 },
                { id: 'central', titleAr: '4 نجوم في المنطقة المركزية', titleEn: '4-Star Central Area', rate: 650 },
                { id: 'standard', titleAr: '3 نجوم قريب ومريح', titleEn: '3-Star Standard', rate: 350 },
                { id: 'economy', titleAr: 'سكن اقتصادي مشترك', titleEn: 'Economy Shared Stay', rate: 200 },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setAccommodation(item.id as any)}
                  className={`p-3 rounded-xl border text-start transition-all cursor-pointer ${
                    accommodation === item.id
                      ? 'bg-[#D4AF37] text-[#02130D] border-white font-black shadow-[0_0_15px_rgba(212,175,55,0.4)]'
                      : 'bg-[#02130D] text-[#F8F3E7] border-[#D4AF37]/40 hover:border-[#D4AF37]'
                  }`}
                >
                  <div className="text-xs font-bold leading-tight mb-1">
                    {isAr ? item.titleAr : item.titleEn}
                  </div>
                  <div className="text-[11px] opacity-80">
                    {formatPrice(item.rate, currency)} / {isAr ? 'ليلة' : 'night'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 3. Transport Options */}
          <div className="bg-[#03291F]/80 p-4 sm:p-5 rounded-2xl border border-[#D4AF37]/30 space-y-3">
            <h3 className="text-sm font-bold text-[#D4AF37] flex items-center gap-2">
              <Car className="w-4 h-4" />
              <span>{isAr ? 'وسيلة النقل والمواصلات' : 'Transportation Method'}</span>
            </h3>

            <div className="grid grid-cols-2 gap-2.5">
              {[
                { id: 'train', titleAr: 'قطار الحرمين السريع', titleEn: 'Haramain High-Speed Train' },
                { id: 'vip', titleAr: 'سيارة VIP خاصة بسائق', titleEn: 'Private VIP Chauffeur SUV' },
                { id: 'bus', titleAr: 'حافلة خاصة حديثة', titleEn: 'Private Modern Coach' },
                { id: 'shuttle', titleAr: 'ترددية ومواصلات عامة', titleEn: 'Shuttle & Public Transit' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setTransport(item.id as any)}
                  className={`p-3 rounded-xl border text-start transition-all cursor-pointer ${
                    transport === item.id
                      ? 'bg-[#D4AF37] text-[#02130D] border-white font-black shadow-[0_0_15px_rgba(212,175,55,0.4)]'
                      : 'bg-[#02130D] text-[#F8F3E7] border-[#D4AF37]/40 hover:border-[#D4AF37]'
                  }`}
                >
                  <div className="text-xs font-bold leading-tight">
                    {isAr ? item.titleAr : item.titleEn}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 4. Extra Services */}
          <div className="bg-[#03291F]/80 p-4 sm:p-5 rounded-2xl border border-[#D4AF37]/30 space-y-3">
            <h3 className="text-sm font-bold text-[#D4AF37] flex items-center gap-2">
              <Utensils className="w-4 h-4" />
              <span>{isAr ? 'الوجبات والخدمات الإضافية' : 'Meals & Additional Services'}</span>
            </h3>

            <div className="grid grid-cols-2 gap-2.5">
              {[
                { key: 'zamzam', labelAr: 'عبوات ماء زمزم للرحلة', labelEn: 'Zamzam Bottled Water' },
                { key: 'ziyarat', labelAr: 'جولة المزارات والمعالم', labelEn: 'Ziyarat Tour Guide' },
                { key: 'vipLounge', labelAr: 'صالة الاستقبال في المطار', labelEn: 'VIP Airport Lounge' },
                { key: 'wheelchair', labelAr: 'كرسي متحرك ومساعد', labelEn: 'Wheelchair & Helper' },
              ].map((item) => (
                <label
                  key={item.key}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-[#02130D] border border-[#D4AF37]/30 cursor-pointer hover:border-[#D4AF37]"
                >
                  <input
                    type="checkbox"
                    checked={addons[item.key]}
                    onChange={(e) => setAddons({ ...addons, [item.key]: e.target.checked })}
                    className="accent-[#D4AF37] w-4 h-4 rounded cursor-pointer"
                  />
                  <span className="text-xs font-medium text-[#F8F3E7]">
                    {isAr ? item.labelAr : item.labelEn}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Calculation Summary Card */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-gradient-to-b from-[#03291F] to-[#01140E] p-5 sm:p-6 rounded-2xl border-2 border-[#D4AF37] shadow-[0_10px_30px_rgba(212,175,55,0.2)]">
          <div>
            <div className="flex items-center justify-between border-b border-[#D4AF37]/30 pb-3 mb-4">
              <h3 className="font-black text-lg text-[#D4AF37] flex items-center gap-2">
                <Calculator className="w-5 h-5 text-[#D4AF37]" />
                <span>{isAr ? 'ملخص التكلفة التقديرية' : 'Estimated Cost Summary'}</span>
              </h3>
              <span className="text-xs text-[#F8F3E7]/60">{days} {isAr ? 'أيام' : 'days'} / {people} {isAr ? 'حجاج' : 'pilgrims'}</span>
            </div>

            <div className="space-y-3 text-xs mb-6">
              <div className="flex justify-between items-center py-1 border-b border-[#D4AF37]/10">
                <span className="text-[#F8F3E7]/70">{isAr ? 'تكلفة الإقامة:' : 'Stay Accommodation:'}</span>
                <span className="font-bold text-white">{formatPrice(hotelCostSAR, currency)}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-[#D4AF37]/10">
                <span className="text-[#F8F3E7]/70">{isAr ? 'وسيلة النقل:' : 'Transport Cost:'}</span>
                <span className="font-bold text-white">{formatPrice(transportCostSAR, currency)}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-[#D4AF37]/10">
                <span className="text-[#F8F3E7]/70">{isAr ? 'الوجبات والإعاشة:' : 'Meals & Dining:'}</span>
                <span className="font-bold text-white">{formatPrice(mealCostSAR, currency)}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-[#D4AF37]/10">
                <span className="text-[#F8F3E7]/70">{isAr ? 'الخدمات المضافة:' : 'Add-on Services:'}</span>
                <span className="font-bold text-white">{formatPrice(addonsCostSAR, currency)}</span>
              </div>
            </div>

            {/* Total Box */}
            <div className="p-4 rounded-xl bg-[#02130D] border border-[#D4AF37] text-center mb-6">
              <span className="text-xs text-[#D4AF37] block font-bold mb-1">
                {isAr ? 'المجموع الكلي التقديري' : 'Total Estimated Cost'}
              </span>
              <div className="text-3xl font-black text-white drop-shadow-[0_2px_10px_rgba(212,175,55,0.5)]">
                {formatPrice(totalCostSAR, currency)}
              </div>
              <span className="text-[11px] text-[#F8F3E7]/70 mt-1 block">
                ({formatPrice(perPersonCostSAR, currency)} {isAr ? 'لكل شخص' : 'per person'})
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleSendDetails}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA820A] hover:from-[#E5C158] hover:to-[#C2981D] text-[#02130D] font-black text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all cursor-pointer"
            >
              <Send className="w-4 h-4 text-[#02130D]" />
              <span>{isAr ? 'إرسال الخطة إلى الواتساب لحجزها' : 'Send Plan via WhatsApp to Book'}</span>
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-[#D4AF37]/80">
              <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{isAr ? 'أسعار شَفافة معتمدة وبدون رسوم خفية' : 'Transparent official rates, no hidden fees'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetCalculatorView;
