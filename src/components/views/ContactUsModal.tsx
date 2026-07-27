import React, { useState } from 'react';
import {
  Mail,
  User,
  Phone,
  MessageSquare,
  Send,
  X,
  CheckCircle2,
  Sparkles,
  MessageCircle,
  Building2,
  ShieldCheck,
  Clock,
} from 'lucide-react';
import { LanguageOption } from '../../data/languages';

interface ContactUsModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: LanguageOption;
  onSendToWhatsapp?: (message: string) => void;
  defaultName?: string;
  defaultPhone?: string;
}

export const ContactUsModal: React.FC<ContactUsModalProps> = ({
  isOpen,
  onClose,
  language,
  onSendToWhatsapp,
  defaultName = '',
  defaultPhone = '',
}) => {
  if (!isOpen) return null;

  const isAr = language.code === 'ar';

  const [name, setName] = useState(defaultName);
  const [phone, setPhone] = useState(defaultPhone);
  const [subject, setSubject] = useState(isAr ? 'استفسار عام' : 'General Inquiry');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState('');

  const subjects = [
    { id: 'general', ar: 'استفسار عام', en: 'General Inquiry' },
    { id: 'support', ar: 'الدعم الميداني والحجوزات', en: 'Field Support & Bookings' },
    { id: 'fatwa', ar: 'الفتاوى وأحكام المناسك', en: 'Fatwa & Ritual Guidance' },
    { id: 'suggestion', ar: 'مقترحات وملاحظات', en: 'Suggestions & Feedback' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !message.trim()) return;

    // Generate reference code
    const generatedTicket = 'REF-' + Math.floor(100000 + Math.random() * 900000);
    setTicketId(generatedTicket);
    setIsSubmitted(true);
  };

  const handleSendToWhatsAppDirect = () => {
    const textMessage = isAr
      ? `*رسالة تواصل مع إدارة منصة وطهر بيتي* 🏛️\n` +
        `• *الاسم*: ${name}\n` +
        `• *رقم الهاتف*: ${phone}\n` +
        `• *موضوع التواصل*: ${subject}\n` +
        `• *الرسالة*:\n${message}\n\n` +
        `_رقم المرجعية: ${ticketId}_`
      : `*Contact Request - Wa Tahhir Baitiya Platform* 🏛️\n` +
        `• *Name*: ${name}\n` +
        `• *Phone*: ${phone}\n` +
        `• *Subject*: ${subject}\n` +
        `• *Message*:\n${message}\n\n` +
        `_Reference ID: ${ticketId}_`;

    if (onSendToWhatsapp) {
      onSendToWhatsapp(textMessage);
    } else {
      window.open(`https://wa.me/966546068859?text=${encodeURIComponent(textMessage)}`, '_blank');
    }
  };

  const resetForm = () => {
    setIsSubmitted(false);
    setMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#021811] border-2 border-[#D4AF37] rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.95)] text-[#F8F3E7] overflow-hidden my-auto max-h-[90vh] flex flex-col">
        {/* Decorative Top Bar */}
        <div className="h-2 bg-gradient-to-r from-[#D4AF37] via-[#F5E5BE] to-[#AA820A]" />

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#D4AF37]/30 bg-[#03291F]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#02130D] border border-[#D4AF37] flex items-center justify-center text-[#D4AF37] shadow-inner">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <span>{isAr ? 'تواصل معنا' : 'Contact Us'}</span>
                <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              </h3>
              <p className="text-xs text-[#D4AF37]/90 font-medium">
                {isAr ? 'التواصل المباشر مع إدارة منصة وطهر بيتي' : 'Direct contact with platform administration'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#02130D] border border-[#D4AF37]/40 text-[#D4AF37] flex items-center justify-center hover:bg-[#073D2F] hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#D4AF37] flex items-center gap-1.5">
                  <User className="w-4 h-4" />
                  <span>{isAr ? 'الاسم الكامل *' : 'Full Name *'}</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={isAr ? 'أدخل اسمك الكريم...' : 'Enter your name...'}
                    className="w-full px-4 py-3 bg-[#02130D] border border-[#D4AF37]/40 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] transition-all"
                  />
                </div>
              </div>

              {/* Phone Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#D4AF37] flex items-center gap-1.5">
                  <Phone className="w-4 h-4" />
                  <span>{isAr ? 'رقم الهاتف / الواتساب *' : 'Phone / WhatsApp *'}</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={isAr ? '+966 50 000 0000' : '+966 50 000 0000'}
                    className="w-full px-4 py-3 bg-[#02130D] border border-[#D4AF37]/40 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] transition-all font-mono"
                    dir="ltr"
                  />
                </div>
              </div>

              {/* Subject Selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#D4AF37] flex items-center gap-1.5">
                  <Building2 className="w-4 h-4" />
                  <span>{isAr ? 'موضوع التواصل' : 'Subject'}</span>
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-3 bg-[#02130D] border border-[#D4AF37]/40 rounded-xl text-sm text-white focus:outline-none focus:border-[#D4AF37] transition-all cursor-pointer"
                >
                  {subjects.map((sub) => (
                    <option key={sub.id} value={isAr ? sub.ar : sub.en} className="bg-[#02130D] text-white">
                      {isAr ? sub.ar : sub.en}
                    </option>
                  ))}
                </select>
              </div>

              {/* Message Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#D4AF37] flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4" />
                  <span>{isAr ? 'الرسالة / الاستفسار *' : 'Your Message *'}</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={isAr ? 'اكتب تفاصيل استفسارك أو طلبك هنا...' : 'Write your details or inquiry here...'}
                  className="w-full p-4 bg-[#02130D] border border-[#D4AF37]/40 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] transition-all resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#D4AF37] via-[#F5E5BE] to-[#AA820A] text-[#02130D] font-black text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:scale-[1.01] active:scale-95 transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>{isAr ? 'إرسال الرسالة لإدارة المنصة' : 'Send Message to Platform Admin'}</span>
              </button>
            </form>
          ) : (
            /* Success Confirmation Screen */
            <div className="py-6 px-3 text-center space-y-5 animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 mx-auto shadow-lg">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <h4 className="text-xl font-black text-white">
                  {isAr ? 'تم استلام رسالتك بنجاح!' : 'Message Received Successfully!'}
                </h4>
                <p className="text-xs text-[#F8F3E7]/80 max-w-sm mx-auto">
                  {isAr
                    ? 'شكراً لتواصلك مع إدارة منصة وطهر بيتي. تم تسجيل طلبك وسيقوم فريق الدعم بالمتابعة والرد عليك قريباً.'
                    : 'Thank you for reaching out to Wa Tahhir Baitiya Platform. Your inquiry has been registered and support will respond shortly.'}
                </p>
              </div>

              <div className="p-4 bg-[#03291F] border border-[#D4AF37]/40 rounded-2xl space-y-2 max-w-sm mx-auto text-xs">
                <div className="flex items-center justify-between text-[#D4AF37] font-bold">
                  <span>{isAr ? 'رقم المرجعية:' : 'Reference ID:'}</span>
                  <span className="font-mono text-sm text-white bg-[#02130D] px-2.5 py-1 rounded-lg border border-[#D4AF37]/30">
                    {ticketId}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[#F8F3E7]/70 text-[11px]">
                  <span>{isAr ? 'وقت التجاوب المتوقع:' : 'Expected Response:'}</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{isAr ? 'خلال ساعتين' : 'Within 2 hours'}</span>
                  </span>
                </div>
              </div>

              <div className="pt-2 space-y-2 max-w-sm mx-auto">
                <button
                  type="button"
                  onClick={handleSendToWhatsAppDirect}
                  className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{isAr ? 'إرسال نسخة مباشرة للواتساب' : 'Send direct copy via WhatsApp'}</span>
                </button>

                <button
                  type="button"
                  onClick={resetForm}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#02130D] hover:bg-[#073D2F] border border-[#D4AF37]/40 text-[#D4AF37] font-bold text-xs transition-all cursor-pointer"
                >
                  <span>{isAr ? 'إغلاق النافذة' : 'Close Window'}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer info note */}
        <div className="p-3 bg-[#02130D] border-t border-[#D4AF37]/20 text-center text-[11px] text-[#D4AF37]/80 flex items-center justify-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>{isAr ? 'بياناتك مشفرة ومحمية وفق معايير الأمان لمنصة وطهر بيتي' : 'Protected data according to platform security standards'}</span>
        </div>
      </div>
    </div>
  );
};

export default ContactUsModal;
