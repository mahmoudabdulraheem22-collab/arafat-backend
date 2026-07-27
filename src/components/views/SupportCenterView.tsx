import React, { useState } from 'react';
import {
  HelpCircle,
  MessageCircle,
  Mail,
  PhoneCall,
  Send,
  ArrowRight,
  ChevronDown,
} from 'lucide-react';
import { LanguageOption } from '../../data/languages';

interface SupportCenterViewProps {
  language: LanguageOption;
  onBack: () => void;
  onSendToWhatsapp: (message: string) => void;
}

export const SupportCenterView: React.FC<SupportCenterViewProps> = ({
  language,
  onBack,
  onSendToWhatsapp,
}) => {
  const isAr = language.code === 'ar';

  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [senderName, setSenderName] = useState('');
  const [senderPhone, setSenderPhone] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [isSent, setIsSent] = useState(false);

  const faqs = [
    {
      qAr: 'كيف أستخدم وكيل عرفات الذكي لإجابة الفتاوى والاستفسارات؟',
      aAr: 'يمكنك النقر على زر "اسأل عرفات" في أعلى الواجهة أو الشات التفاعلي، وسيقوم الوكيل الذكي المزود بتقنيات Gemini بإجابتك فوراً بـ 20 لغة.',
    },
    {
      qAr: 'هل يمكنني تصميم باقة رحلة مخصصة لأسرتي بالكامل؟',
      aAr: 'نعم عبر بطاقة "تصميم باقتي"، حيث يمكنك اختيار الفنادق في مكة والمدينة، وسيلة النقل، الوجبات والمزارات ثم إرسال التقرير للواتساب لحجزه.',
    },
    {
      qAr: 'كيف أربط حسابي برقم الواتساب؟',
      aAr: 'عند تسجيل الدخول أو الاشتراك، تدخل رقم هاتفك وإيميلك، ويتم الربط تلقائياً مع نظام التنبيهات السحابي لربطك بآخر التحديثات والتصاريح.',
    },
    {
      qAr: 'ما هي العملات المدعومة للتحويل المباشر؟',
      aAr: 'تدعم منصة عرفات 20 عملة عالمية تشمل الريال السعودي، الدولار، اليورو، الجنيه الاسترليني، الدرهم الإماراتي، الدينار الكويتي وغيرها.',
    },
  ];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactMessage.trim()) return;
    const msg = `*نموذج تواصل مباشر - وطهر بيتي* 🏛️\n` +
      `• *الاسم*: ${senderName || 'غير محدد'}\n` +
      `• *رقم الهاتف*: ${senderPhone || 'غير محدد'}\n` +
      `• *الرسالة*:\n${contactMessage}`;
    onSendToWhatsapp(msg);
    setIsSent(true);
    setContactMessage('');
  };

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
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-[#D4AF37]">
              {isAr ? 'مركز المساعدة والدعم المباشر' : 'Support & Help Center'}
            </h2>
            <p className="text-xs text-[#F8F3E7]/70">
              {isAr ? 'الأسئلة الشائعة، الدعم الميداني، والتواصل عبر الواتساب والبريد' : 'FAQs, live WhatsApp support & email contact'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* FAQs */}
        <div className="lg:col-span-7 space-y-3">
          <h3 className="text-sm font-bold text-[#D4AF37] mb-2">{isAr ? 'الأسئلة الشائعة (FAQ):' : 'Frequently Asked Questions:'}</h3>
          {faqs.map((faq, idx) => (
            <div key={idx} className="rounded-2xl bg-[#03291F] border border-[#D4AF37]/30 overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-4 text-start font-bold text-xs text-[#D4AF37] flex items-center justify-between hover:bg-[#073D2F] cursor-pointer"
              >
                <span>{faq.qAr}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
              </button>
              {openFaq === idx && (
                <div className="p-4 pt-0 text-xs text-[#F8F3E7]/80 leading-relaxed border-t border-[#D4AF37]/10">
                  {faq.aAr}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Form & WhatsApp */}
        <div className="lg:col-span-5 bg-gradient-to-b from-[#03291F] to-[#01140E] p-5 rounded-2xl border-2 border-[#D4AF37] space-y-4">
          <h3 className="font-black text-sm text-[#D4AF37]">{isAr ? 'تواصل مع فريق خدمة الحجاج' : 'Contact Support Team'}</h3>

          <div className="space-y-2 text-xs">
            <a
              href="https://wa.me/966546068859"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/50 flex items-center gap-3 text-emerald-300 font-bold hover:bg-emerald-900/60 transition-all cursor-pointer"
            >
              <MessageCircle className="w-5 h-5 text-emerald-400" />
              <span>{isAr ? 'المحادثة المباشرة عبر الواتساب' : 'Live WhatsApp Support'}</span>
            </a>

            <div className="p-3 rounded-xl bg-[#02130D] border border-[#D4AF37]/30 flex items-center gap-3 text-[#F8F3E7]">
              <Mail className="w-5 h-5 text-[#D4AF37]" />
              <span className="font-mono text-xs">support@arafat.app</span>
            </div>
          </div>

          <form onSubmit={handleSendMessage} className="space-y-3 pt-2">
            <div>
              <label className="text-[11px] text-[#D4AF37] block font-bold mb-1">
                {isAr ? 'الاسم الكامل:' : 'Full Name:'}
              </label>
              <input
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder={isAr ? 'اسمك الكريم...' : 'Your name...'}
                className="w-full px-3 py-2 rounded-xl bg-[#02130D] border border-[#D4AF37]/40 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="text-[11px] text-[#D4AF37] block font-bold mb-1">
                {isAr ? 'رقم الهاتف / الواتساب:' : 'Phone Number:'}
              </label>
              <input
                type="tel"
                value={senderPhone}
                onChange={(e) => setSenderPhone(e.target.value)}
                placeholder={isAr ? '+966 50 000 0000' : '+966 50 000 0000'}
                className="w-full px-3 py-2 rounded-xl bg-[#02130D] border border-[#D4AF37]/40 text-xs text-white focus:outline-none focus:border-[#D4AF37] font-mono"
                dir="ltr"
              />
            </div>

            <div>
              <label className="text-[11px] text-[#D4AF37] block font-bold mb-1">
                {isAr ? 'الرسالة / الاستفسار:' : 'Your Message:'}
              </label>
              <textarea
                required
                rows={3}
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
                placeholder={isAr ? 'اكتب تفاصيل الرسالة هنا...' : 'Write your message here...'}
                className="w-full p-3 rounded-xl bg-[#02130D] border border-[#D4AF37]/40 text-xs text-white focus:outline-none focus:border-[#D4AF37] resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA820A] text-[#02130D] font-black text-xs flex items-center justify-center gap-2 cursor-pointer hover:from-[#E5C158] transition-all"
            >
              <Send className="w-4 h-4" />
              <span>{isAr ? 'إرسال الرسالة لإدارة المنصة' : 'Send Message to Platform Admin'}</span>
            </button>

            {isSent && (
              <p className="text-[11px] text-emerald-400 font-bold text-center mt-2">
                ✓ {isAr ? 'تم إرسال الرسالة بنجاح عبر الواتساب!' : 'Message sent successfully via WhatsApp!'}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default SupportCenterView;
