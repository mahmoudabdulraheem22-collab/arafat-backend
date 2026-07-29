import React, { useState, useRef, useEffect } from 'react';
import { Send, MapPin, Mic, MicOff, Camera, Loader2, ShieldAlert, Image as ImageIcon, X, Volume2 } from 'lucide-react';
import { CameraScannerModal } from './CameraScannerModal';

interface MessageComposerProps {
  languageCode?: string;
  onSendMessage: (text: string, options?: { image?: string; autoSpeak?: boolean }) => void;
  onAttachLocation?: () => void;
  attachedLocation?: boolean;
  isLoading?: boolean;
}

export const MessageComposer: React.FC<MessageComposerProps> = ({
  languageCode = 'ar',
  onSendMessage,
  onAttachLocation,
  attachedLocation = false,
  isLoading = false,
}) => {
  const isAr = languageCode === 'ar';
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [usedVoiceInput, setUsedVoiceInput] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = isAr ? 'ar-SA' : 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
          setUsedVoiceInput(true);
        }
        setIsListening(false);
      };

      recognitionRef.current.onerror = (e: any) => {
        setIsListening(false);
        const errType = e?.error || '';
        if (errType === 'not-allowed' || errType === 'service-not-allowed') {
          alert(isAr ? 'يرجى السماح بالوصول للميكروفون لاستخدام الإدخال الصوتي.' : 'Please allow microphone access in your browser settings.');
        }
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, [isAr]);

  const toggleVoice = () => {
    if (!recognitionRef.current) {
      alert(isAr ? 'خاصية التعرف على الصوت غير مدعومة في متصفحك' : 'Speech recognition not supported in your browser');
      return;
    }

    if (isListening) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
      setIsListening(false);
    } else {
      try {
        setIsListening(true);
        setUsedVoiceInput(true);
        recognitionRef.current.start();
      } catch (err: any) {
        setIsListening(false);
        if (err?.name === 'NotAllowedError' || err?.message?.includes('not-allowed')) {
          alert(isAr ? 'يرجى إعطاء إذن الميكروفون لاستخدام الرسائل الصوتية' : 'Microphone permission denied');
        }
      }
    }
  };

  const handleCaptureFromCameraModal = (imageBase64: string, customPrompt: string) => {
    // Directly send or attach
    onSendMessage(customPrompt, {
      image: imageBase64,
      autoSpeak: true, // Voice response enabled for camera scan
    });
    setAttachedImage(null);
    setInputText('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((!inputText.trim() && !attachedImage) || isLoading) return;
    onSendMessage(inputText, {
      image: attachedImage || undefined,
      autoSpeak: usedVoiceInput, // Auto voice readout if microphone was used
    });
    setInputText('');
    setAttachedImage(null);
    setUsedVoiceInput(false);
  };

  return (
    <div className="p-3 sm:p-4 bg-[#03291F] border-t border-[#D4AF37]/40 shrink-0">
      {/* Attached Image Preview Bar if present */}
      {attachedImage && (
        <div className="mb-2 p-2 rounded-xl bg-[#02130D] border border-[#D4AF37]/50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img src={attachedImage} alt="Attachment" className="w-10 h-10 object-cover rounded-lg border border-[#D4AF37]/30" />
            <span className="text-xs text-[#D4AF37] font-bold">
              {isAr ? '📷 صورة مرفقة من الكاميرا جاهزة للتحليل البصري' : '📷 Camera photo ready for analysis'}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setAttachedImage(null)}
            className="p-1.5 rounded-lg bg-rose-950/80 text-rose-300 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Mic Active Banner */}
      {usedVoiceInput && (
        <div className="mb-2 px-3 py-1.5 rounded-xl bg-amber-950/40 border border-amber-500/40 text-[11px] text-amber-300 flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-bold">
            <Volume2 className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>{isAr ? 'الرد الصوتي المباشر مفعل: سيرد عرفات عليك بصوت مسموع تلقائياً.' : 'Live audio response active: Arafat will reply with speech.'}</span>
          </div>
          <button
            type="button"
            onClick={() => setUsedVoiceInput(false)}
            className="text-[10px] underline text-amber-400 hover:text-amber-200"
          >
            {isAr ? 'إلغاء الصوتي' : 'Mute'}
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        {/* Attach Location */}
        {onAttachLocation && (
          <button
            type="button"
            onClick={onAttachLocation}
            className={`p-2.5 rounded-xl border transition-all cursor-pointer shrink-0 ${
              attachedLocation
                ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                : 'bg-[#02130D] border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#D4AF37]/20'
            }`}
            title={
              attachedLocation
                ? isAr
                  ? 'تم ربط الموقع الجغرافي'
                  : 'Location attached'
                : isAr
                ? 'إرفاق الموقع الجغرافي للمشاعر/الحرم'
                : 'Attach current GPS location'
            }
          >
            <MapPin className={`w-4 h-4 ${attachedLocation ? 'animate-bounce' : ''}`} />
          </button>
        )}

        {/* Live Camera Scanner Button */}
        <button
          type="button"
          onClick={() => setIsCameraModalOpen(true)}
          className="p-2.5 rounded-xl border bg-[#02130D] border-[#D4AF37]/50 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#02130D] transition-all cursor-pointer shrink-0 shadow-sm"
          title={isAr ? 'الكاميرا والتعرف البصري على الأشياء والمعالم' : 'Camera visual object scanner'}
        >
          <Camera className="w-4 h-4" />
        </button>

        {/* Voice Input STT */}
        <button
          type="button"
          onClick={toggleVoice}
          className={`p-2.5 rounded-xl border transition-all cursor-pointer shrink-0 ${
            isListening
              ? 'bg-red-600 border-red-400 text-white animate-pulse'
              : usedVoiceInput
              ? 'bg-[#D4AF37] text-[#02130D] border-[#D4AF37] shadow-[0_0_10px_rgba(212,175,55,0.5)]'
              : 'bg-[#02130D] border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#D4AF37]/20'
          }`}
          title={isAr ? 'الإدخال الصوتي (سيرد عرفات بصوت مسموع)' : 'Voice input & speech reply'}
        >
          {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>

        {/* Text Area Input */}
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          disabled={isLoading}
          placeholder={
            isListening
              ? isAr
                ? 'جاري الاستماع لصوتك...'
                : 'Listening to your speech...'
              : isAr
              ? 'اسأل عرفات أو استخدم الكاميرا والميكروفون...'
              : 'Ask Arafat or use camera & voice...'
          }
          className="flex-1 bg-[#02130D] border border-[#D4AF37]/60 rounded-xl px-4 py-2.5 text-sm text-white placeholder-[#F8F3E7]/40 focus:outline-none focus:border-[#D4AF37] disabled:opacity-50"
        />

        {/* Submit Send Button */}
        <button
          type="submit"
          disabled={isLoading || (!inputText.trim() && !attachedImage)}
          className="px-5 py-2.5 bg-[#D4AF37] hover:bg-[#F5E5BE] text-[#02130D] font-black text-sm rounded-xl transition-all flex items-center gap-1.5 shrink-0 cursor-pointer disabled:opacity-40 shadow-md"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-[#02130D]" />
          ) : (
            <>
              <span>{isAr ? 'إرسال' : 'Send'}</span>
              <Send className={`w-4 h-4 ${isAr ? 'rotate-180' : ''}`} />
            </>
          )}
        </button>
      </form>

      {/* Official Sources & Disclaimer Bar */}
      <div className="mt-2.5 pt-2 border-t border-[#D4AF37]/20 flex items-center justify-center text-center">
        <p className="text-[10px] sm:text-[11px] text-[#D4AF37]/90 font-medium leading-tight flex items-center justify-center gap-1.5 flex-wrap">
          <ShieldAlert className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
          <span>
            {isAr
              ? 'تنويه: التطبيق رفيق إرشادي ومساعد ذكي ولا يغني عن الفتاوى الرسمية | المصادر المعرفية: وزارة الشؤون الإسلامية والدعوة والإرشاد والرئاسة العامة للبحوث العلمية والإفتاء'
              : 'Notice: Arafat is a smart guidance assistant and does not replace official fatwas | Accredited Sources: Ministry of Islamic Affairs & General Presidency of Ifta'}
          </span>
        </p>
      </div>

      {/* Camera Scanner Modal */}
      <CameraScannerModal
        isOpen={isCameraModalOpen}
        onClose={() => setIsCameraModalOpen(false)}
        onCaptureImage={handleCaptureFromCameraModal}
        languageCode={languageCode}
      />
    </div>
  );
};

export default MessageComposer;
