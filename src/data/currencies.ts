export interface CurrencyOption {
  code: string;
  name: string;
  symbol: string;
  rate: number; // Conversion rate relative to 1 SAR
}

export const CURRENCIES: CurrencyOption[] = [
  { code: 'SAR', name: 'الريال السعودي', symbol: 'ر.س', rate: 1.0 },
  { code: 'USD', name: 'الدولار الأمريكي', symbol: '$', rate: 0.2667 },
  { code: 'EUR', name: 'اليورو', symbol: '€', rate: 0.245 },
  { code: 'GBP', name: 'الجنيه الإسترليني', symbol: '£', rate: 0.208 },
  { code: 'AED', name: 'الدرهم الإماراتي', symbol: 'د.إ', rate: 0.979 },
  { code: 'KWD', name: 'الدينار الكويتي', symbol: 'د.ك', rate: 0.0815 },
  { code: 'QAR', name: 'الريال القطري', symbol: 'ر.ق', rate: 0.971 },
  { code: 'BHD', name: 'الدينار البحريني', symbol: 'د.ب', rate: 0.100 },
  { code: 'OMR', name: 'الريال العماني', symbol: 'ر.ع', rate: 0.103 },
  { code: 'EGP', name: 'الجنيه المصري', symbol: 'ج.م', rate: 12.95 },
  { code: 'JOD', name: 'الدينار الأردني', symbol: 'د.أ', rate: 0.189 },
  { code: 'TRY', name: 'الليرة التركية', symbol: '₺', rate: 8.85 },
  { code: 'IDR', name: 'الروبية الإندونيسية', symbol: 'Rp', rate: 4250 },
  { code: 'MYR', name: 'الرينغيت الماليزي', symbol: 'RM', rate: 1.18 },
  { code: 'PKR', name: 'الروبية الباكستانية', symbol: '₨', rate: 74.2 },
  { code: 'INR', name: 'الروبية الهندية', symbol: '₹', rate: 22.3 },
  { code: 'BDT', name: 'التاكا البنغلاديشية', symbol: '৳', rate: 31.8 },
  { code: 'CNY', name: 'اليوان الصيني', symbol: '¥', rate: 1.92 },
  { code: 'RUB', name: 'الروبل الروسي', symbol: '₽', rate: 23.5 },
  { code: 'MAD', name: 'الدرهم المغربي', symbol: 'د.م', rate: 2.65 },
];

/**
 * دالة تحويل المبالغ من الريال السعودي إلى العملة المختارة
 */
export function formatPrice(amountInSAR: number, currency: CurrencyOption): string {
  const converted = amountInSAR * currency.rate;
  if (currency.rate > 100) {
    return `${Math.round(converted).toLocaleString()} ${currency.symbol}`;
  }
  return `${converted.toFixed(currency.rate < 1 ? 2 : 1)} ${currency.symbol}`;
}
