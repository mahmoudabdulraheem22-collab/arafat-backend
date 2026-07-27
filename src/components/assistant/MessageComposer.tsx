import React, { useState, useRef, useEffect } from 'react';
import { Send, MapPin, Mic, MicOff, Paperclip, Loader2 } from 'lucide-react';

interface MessageComposerProps {
  languageCode?: string;
  onSendMessage: (text: string) => void;
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
        }
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
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
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    onSendMessage(inputText);
    setInputText('');
  };

  return (
    <div className="p-3 sm:p-4 bg-[#03291F] border-t border-[#D4AF37]/40 shrink-0">
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

        {/* Voice Input STT */}
        <button
          type="button"
          onClick={toggleVoice}
          className={`p-2.5 rounded-xl border transition-all cursor-pointer shrink-0 ${
            isListening
              ? 'bg-red-600 border-red-400 text-white animate-pulse'
              : 'bg-[#02130D] border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#D4AF37]/20'
          }`}
          title={isAr ? 'الإدخال الصوتي (تحويل الصوت لنص)' : 'Voice dictation'}
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
              ? 'اسأل عرفات عن المناسك، الفنادق، المواقيت، أو الحسابات...'
              : 'Ask Arafat about rituals, hotels, permits, budget...'
          }
          className="flex-1 bg-[#02130D] border border-[#D4AF37]/60 rounded-xl px-4 py-2.5 text-sm text-white placeholder-[#F8F3E7]/40 focus:outline-none focus:border-[#D4AF37] disabled:opacity-50"
        />

        {/* Submit Send Button */}
        <button
          type="submit"
          disabled={isLoading || !inputText.trim()}
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
    </div>
  );
};

export default MessageComposer;
