import React, { useState } from 'react';
import {
  Package,
  Building2,
  Plane,
  Car,
  Compass,
  Utensils,
  PlusCircle,
  Check,
  Send,
  ArrowRight,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { CurrencyOption, formatPrice } from '../../data/currencies';
import { LanguageOption } from '../../data/languages';

interface PackageDesignerViewProps {
  currency: CurrencyOption;
  language: LanguageOption;
  onBack: () => void;
  onSendToWhatsapp: (details: string) => void;
}

export const PackageDesignerView: React.FC<PackageDesignerViewProps> = ({
  currency,
  language,
  onBack,
  onSendToWhatsapp,
}) => {
  const isAr = language.code === 'ar';

  const [hotelMakkah, setHotelMakkah] = useState('makkah_vip');
  const [hotelMadinah, setHotelMadinah] = useState('madinah_vip');
  const [flight, setFlight] = useState('saudi_airlines');
  const [transport, setTransport] = useState('gmc_vip');
  const [selectedZiyarat, setSelectedZiyarat] = useState<string[]>(['jabal_alnour', 'quba_masjid']);
  const [selectedMeals, setSelectedMeals] = useState('open_buffet');
  const [selectedExtras, setSelectedExtras] = useState<string[]>(['sim_card', 'mutawwif']);

  const hotelsMakkahOptions = [
    { id: 'makkah_vip', nameAr: 'فندق دار التوحيد (صف أول على الحرم)', nameEn: 'Dar Al Tawhid InterContinental', stars: 5, priceSAR: 1800 },
    { id: 'makkah_clock', nameAr: 'فندق فيرمونت برج الساعة', nameEn: 'Fairmont Makkah Clock Royal Tower', stars: 5, priceSAR: 1400 },
    { id: 'makkah_central', nameAr: 'فندق أنجم مكة المكرمة', nameEn: 'Anjum Hotel Makkah', stars: 4, priceSAR: 750 },
  ];

  const hotelsMadinahOptions = [
    { id: 'madinah_vip', nameAr: 'فندق دار التقوى (مواجه للروضة)', nameEn: 'Dar Al Taqwa Hotel', stars: 5, priceSAR: 1500 },
    { id: 'madinah_oberoi', nameAr: 'فندق أوبيروي المدينة المنورة', nameEn: 'The Oberoi Madinah', stars: 5, priceSAR: 1300 },
    { id: 'madinah_pullman', nameAr: 'فندق بولمان زمزم المدينة', nameEn: 'Pullman Zamzam Madina', stars: 4, priceSAR: 680 },
  ];

  const flightOptions = [
    { id: 'saudi_airlines', nameAr: 'الخطوط السعودية (مباشر جدة/المدينة)', nameEn: 'Saudia Airlines Direct Flight', priceSAR: 2200 },
    { id: 'flynas', nameAr: 'طيران ناس (اقتصادي حديث)', nameEn: 'flynas Economy Direct', priceSAR: 1400 },
    { id: 'none', nameAr: 'بدون طيران (حجز بري فقط)', nameEn: 'Without Flight (Land Only)', priceSAR: 0 },
  ];

  const transportOptions = [
    { id: 'gmc_vip', nameAr: 'سيارة GMC Yukon VIP موديل السنة', nameEn: 'GMC Yukon VIP Luxury SUV', priceSAR: 2500 },
    { id: 'haramain_train', nameAr: 'قطار الحرمين السريع (درجة أعمال)', nameEn: 'Haramain Train Business Class', priceSAR: 450 },
    { id: 'private_bus', nameAr: 'حافلة VIP سياحية العائلة', nameEn: 'Private Family VIP Bus', priceSAR: 1200 },
  ];

  const ziyaratList = [
    { id: 'jabal_alnour', nameAr: 'جبل النور وغار حراء', nameEn: 'Mount Al-Nour & Cave Hira', priceSAR: 200 },
    { id: 'quba_masjid', nameAr: 'مسجد قباء ومسجد القبلتين', nameEn: 'Quba & Qiblatain Mosques', priceSAR: 180 },
    { id: 'arafat_mina', nameAr: 'جولة المشاعر (عرفات، مزدلفة، منى)', nameEn: 'Holy Sites Tour (Arafat, Mina, Muzdalifah)', priceSAR: 350 },
  ];

  const extraServices = [
    { id: 'sim_card', nameAr: 'شريحة اتصال وإنترنت 5G مفتوح', nameEn: '5G Unlimited Data SIM Card', priceSAR: 120 },
    { id: 'mutawwif', nameAr: 'مطوّف ومرافق مخصص للمناسك', nameEn: 'Personal Dedicated Mutawwif', priceSAR: 500 },
    { id: 'wheelchair', nameAr: 'خدمة دفع الكرسي المتحرك بالطواف', nameEn: 'Tawaf Wheelchair Assistant', priceSAR: 300 },
  ];

  // Price Total Calculation
  const selMakkah = hotelsMakkahOptions.find((h) => h.id === hotelMakkah);
  const selMadinah = hotelsMadinahOptions.find((h) => h.id === hotelMadinah);
  const selFlight = flightOptions.find((f) => f.id === flight);
  const selTrans = transportOptions.find((t) => t.id === transport);

  let totalSAR = (selMakkah?.priceSAR || 0) * 4 + (selMadinah?.priceSAR || 0) * 3 + (selFlight?.priceSAR || 0) + (selTrans?.priceSAR || 0);

  selectedZiyarat.forEach((zId) => {
    const z = ziyaratList.find((item) => item.id === zId);
    if (z) totalSAR += z.priceSAR;
  });

  selectedExtras.forEach((eId) => {
    const e = extraServices.find((item) => item.id === eId);
    if (e) totalSAR += e.priceSAR;
  });

  const toggleZiyarat = (id: string) => {
    setSelectedZiyarat((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const toggleExtra = (id: string) => {
    setSelectedExtras((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const handleBook = () => {
    const details = isAr
      ? `*تفاصيل تصميم باقتي المخصصة (منصة عرفات)*:\n- فندق مكة المكرمة: ${selMakkah?.nameAr}\n- فندق المدينة المنورة: ${selMadinah?.nameAr}\n- الطيران: ${selFlight?.nameAr}\n- وسيلة النقل: ${selTrans?.nameAr}\n- إجمالي التكلفة الحالية: ${formatPrice(totalSAR, currency)}`
      : `*My Custom Package Design (Arafat Platform)*:\n- Makkah Hotel: ${selMakkah?.nameEn}\n- Madinah Hotel: ${selMadinah?.nameEn}\n- Flight: ${selFlight?.nameEn}\n- Transport: ${selTrans?.nameEn}\n- Total Price: ${formatPrice(totalSAR, currency)}`;

    onSendToWhatsapp(details);
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
            <Package className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-[#D4AF37]">
              {isAr ? 'تصميم باقتي المخصصة' : 'Design My Package'}
            </h2>
            <p className="text-xs text-[#F8F3E7]/70">
              {isAr ? 'خصص الفندق، الطيران، النقل، المزارات والوجبات حسب رغبتك' : 'Customize hotels, flight, transport & ziyarat to your preference'}
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#03291F] border border-[#D4AF37]/50 text-xs font-bold text-[#D4AF37]">
          <span>{currency.code} ({currency.symbol})</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Selection Columns */}
        <div className="lg:col-span-8 space-y-6">
          {/* 1. Makkah Hotel */}
          <div className="bg-[#03291F]/80 p-4 sm:p-5 rounded-2xl border border-[#D4AF37]/30 space-y-3">
            <h3 className="text-sm font-bold text-[#D4AF37] flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#D4AF37]" />
              <span>{isAr ? '1. فندق مكة المكرمة (4 الليالي الأولى)' : '1. Makkah Hotel Stay'}</span>
            </h3>
            <div className="space-y-2">
              {hotelsMakkahOptions.map((h) => (
                <button
                  key={h.id}
                  onClick={() => setHotelMakkah(h.id)}
                  className={`w-full p-3 rounded-xl border flex items-center justify-between text-start transition-all cursor-pointer ${
                    hotelMakkah === h.id
                      ? 'bg-[#D4AF37] text-[#02130D] border-white font-bold shadow-[0_0_15px_rgba(212,175,55,0.4)]'
                      : 'bg-[#02130D] text-[#F8F3E7] border-[#D4AF37]/30 hover:border-[#D4AF37]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold">{isAr ? h.nameAr : h.nameEn}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#03291F] text-[#D4AF37] border border-[#D4AF37]/40">
                      {'★'.repeat(h.stars)}
                    </span>
                  </div>
                  <span className="text-xs font-black">{formatPrice(h.priceSAR, currency)} / {isAr ? 'ليلة' : 'night'}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Madinah Hotel */}
          <div className="bg-[#03291F]/80 p-4 sm:p-5 rounded-2xl border border-[#D4AF37]/30 space-y-3">
            <h3 className="text-sm font-bold text-[#D4AF37] flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#D4AF37]" />
              <span>{isAr ? '2. فندق المدينة المنورة (3 الليالي التالية)' : '2. Madinah Hotel Stay'}</span>
            </h3>
            <div className="space-y-2">
              {hotelsMadinahOptions.map((h) => (
                <button
                  key={h.id}
                  onClick={() => setHotelMadinah(h.id)}
                  className={`w-full p-3 rounded-xl border flex items-center justify-between text-start transition-all cursor-pointer ${
                    hotelMadinah === h.id
                      ? 'bg-[#D4AF37] text-[#02130D] border-white font-bold shadow-[0_0_15px_rgba(212,175,55,0.4)]'
                      : 'bg-[#02130D] text-[#F8F3E7] border-[#D4AF37]/30 hover:border-[#D4AF37]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold">{isAr ? h.nameAr : h.nameEn}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#03291F] text-[#D4AF37] border border-[#D4AF37]/40">
                      {'★'.repeat(h.stars)}
                    </span>
                  </div>
                  <span className="text-xs font-black">{formatPrice(h.priceSAR, currency)} / {isAr ? 'ليلة' : 'night'}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 3. Flight & Transport */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#03291F]/80 p-4 rounded-2xl border border-[#D4AF37]/30 space-y-3">
              <h3 className="text-sm font-bold text-[#D4AF37] flex items-center gap-2">
                <Plane className="w-4 h-4" />
                <span>{isAr ? '3. الطيران' : '3. Flight'}</span>
              </h3>
              <div className="space-y-2">
                {flightOptions.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFlight(f.id)}
                    className={`w-full p-2.5 rounded-xl border text-start transition-all cursor-pointer ${
                      flight === f.id
                        ? 'bg-[#D4AF37] text-[#02130D] border-white font-bold'
                        : 'bg-[#02130D] text-[#F8F3E7] border-[#D4AF37]/30'
                    }`}
                  >
                    <div className="text-xs font-bold">{isAr ? f.nameAr : f.nameEn}</div>
                    <div className="text-[10px] opacity-80">{formatPrice(f.priceSAR, currency)}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-[#03291F]/80 p-4 rounded-2xl border border-[#D4AF37]/30 space-y-3">
              <h3 className="text-sm font-bold text-[#D4AF37] flex items-center gap-2">
                <Car className="w-4 h-4" />
                <span>{isAr ? '4. النقل الداخلي' : '4. Transport'}</span>
              </h3>
              <div className="space-y-2">
                {transportOptions.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTransport(t.id)}
                    className={`w-full p-2.5 rounded-xl border text-start transition-all cursor-pointer ${
                      transport === t.id
                        ? 'bg-[#D4AF37] text-[#02130D] border-white font-bold'
                        : 'bg-[#02130D] text-[#F8F3E7] border-[#D4AF37]/30'
                    }`}
                  >
                    <div className="text-xs font-bold">{isAr ? t.nameAr : t.nameEn}</div>
                    <div className="text-[10px] opacity-80">{formatPrice(t.priceSAR, currency)}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 4. Ziyarat & Extras */}
          <div className="bg-[#03291F]/80 p-4 sm:p-5 rounded-2xl border border-[#D4AF37]/30 space-y-3">
            <h3 className="text-sm font-bold text-[#D4AF37] flex items-center gap-2">
              <Compass className="w-4 h-4" />
              <span>{isAr ? '5. المزارات والخدمات الإضافية' : '5. Ziyarat & Extras'}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[...ziyaratList, ...extraServices].map((item) => {
                const isSelected = selectedZiyarat.includes(item.id) || selectedExtras.includes(item.id);
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (ziyaratList.some((z) => z.id === item.id)) {
                        toggleZiyarat(item.id);
                      } else {
                        toggleExtra(item.id);
                      }
                    }}
                    className={`p-3 rounded-xl border flex items-center justify-between text-start transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#073D2F] border-[#D4AF37] text-[#D4AF37] font-bold'
                        : 'bg-[#02130D] border-[#D4AF37]/30 text-[#F8F3E7]'
                    }`}
                  >
                    <span className="text-xs">{isAr ? item.nameAr : item.nameEn}</span>
                    <span className="text-xs font-black text-[#D4AF37]">{formatPrice(item.priceSAR, currency)}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Live Package Summary Box */}
        <div className="lg:col-span-4 bg-gradient-to-b from-[#03291F] to-[#01140E] p-5 rounded-2xl border-2 border-[#D4AF37] flex flex-col justify-between shadow-[0_10px_30px_rgba(212,175,55,0.2)]">
          <div>
            <div className="border-b border-[#D4AF37]/30 pb-3 mb-4">
              <h3 className="font-black text-lg text-[#D4AF37] flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#D4AF37]" />
                <span>{isAr ? 'ملخص باقتك' : 'Package Summary'}</span>
              </h3>
            </div>

            <div className="space-y-3 text-xs mb-6">
              <div className="p-2.5 rounded-xl bg-[#02130D] border border-[#D4AF37]/20">
                <span className="text-[#D4AF37] font-bold block mb-1">{isAr ? 'فندق مكة:' : 'Makkah Hotel:'}</span>
                <span className="text-white font-medium">{isAr ? selMakkah?.nameAr : selMakkah?.nameEn}</span>
              </div>

              <div className="p-2.5 rounded-xl bg-[#02130D] border border-[#D4AF37]/20">
                <span className="text-[#D4AF37] font-bold block mb-1">{isAr ? 'فندق المدينة:' : 'Madinah Hotel:'}</span>
                <span className="text-white font-medium">{isAr ? selMadinah?.nameAr : selMadinah?.nameEn}</span>
              </div>

              <div className="p-2.5 rounded-xl bg-[#02130D] border border-[#D4AF37]/20">
                <span className="text-[#D4AF37] font-bold block mb-1">{isAr ? 'الطيران والنقل:' : 'Flight & Transport:'}</span>
                <span className="text-white font-medium">
                  {isAr ? selFlight?.nameAr : selFlight?.nameEn} / {isAr ? selTrans?.nameAr : selTrans?.nameEn}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#02130D] border border-[#D4AF37] text-center mb-6">
              <span className="text-xs text-[#D4AF37] block font-bold mb-1">
                {isAr ? 'السعر الإجمالي للباقة' : 'Total Package Price'}
              </span>
              <div className="text-3xl font-black text-white drop-shadow-[0_2px_10px_rgba(212,175,55,0.5)]">
                {formatPrice(totalSAR, currency)}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleBook}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA820A] hover:from-[#E5C158] hover:to-[#C2981D] text-[#02130D] font-black text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all cursor-pointer"
            >
              <Send className="w-4 h-4 text-[#02130D]" />
              <span>{isAr ? 'تأكيد وحجز الباقة عبر الواتساب' : 'Confirm & Book via WhatsApp'}</span>
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-[#D4AF37]/80">
              <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{isAr ? 'حجز فوري مؤكد مع ترخيص وزارة الحج والعمرة' : 'Official Ministry of Hajj & Umrah certified'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageDesignerView;
