import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Globe, Mic, MicOff, Volume2, VolumeX, Sparkles, Send, Repeat, Languages, MessageSquare, Copy, Check, Headphones } from 'lucide-react';
import { LANGUAGES, LanguageOption } from '../../data/languages';
import { useSpeechSynthesis } from '../../hooks/useSpeechSynthesis';

interface LiveTranslationToolProps {
  language: LanguageOption;
  onBack: () => void;
}

export const LiveTranslationTool: React.FC<LiveTranslationToolProps> = ({
  language,
  onBack,
}) => {
  const isAr = language.code === 'ar';

  const [sourceLang, setSourceLang] = useState<LanguageOption>(language);
  const [targetLang, setTargetLang] = useState<LanguageOption>(() => {
    return LANGUAGES.find((l) => l.code === 'en') || LANGUAGES[1];
  });

  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [copied, setCopied] = useState(false);

  const { isMuted, toggleMute, speak } = useSpeechSynthesis();
  const recognitionRef = useRef<any>(null);

  // Pilgrim quick phrasebook cards
  const phrases = isAr
    ? [
        { topic: 'الاتجاهات والحرم', source: 'كيف أصل إلى أقرب باب للحرم المكي؟', target: 'How do I reach the nearest gate to Al-Haram in Makkah?' },
        { topic: 'الروضة الشريفة', source: 'أين مدخل الرجال للروضة الشريفة بالمدينة؟', target: 'Where is the men\'s entrance for Rawdah Sharif in Madinah?' },
        { topic: 'التاكسي والمواصلات', source: 'كم الأجرة للوصول إلى مطار جدة بالتاكسي؟', target: 'How much is the taxi fare to Jeddah Airport?' },
        { topic: 'الطوارئ والصحة', source: 'أحتاج مساعدة طبية عاجلة، أين أقرب صيدلية؟', target: 'I need urgent medical aid, where is the nearest pharmacy?' },
        { topic: 'الفندق والإقامة', source: 'أين حافلة الفندق المتجهة إلى الحرم الشريف؟', target: 'Where is the hotel shuttle bus heading to the Haram?' },
      ]
    : [
        { topic: 'Directions & Haram', source: 'How do I reach the nearest gate to Al-Haram?', target: 'كيف أصل إلى أقرب باب للحرم؟' },
        { topic: 'Rawdah Permit', source: 'Where is the entrance for Rawdah Sharif?', target: 'أين مدخل الروضة الشريفة؟' },
        { topic: 'Taxi & Transport', source: 'How much is the taxi fare to Jeddah Airport?', target: 'كم تكلفة التاكسي لمطار جدة؟' },
        { topic: 'Medical Emergency', source: 'I need urgent medical assistance.', target: 'أحتاج مساعدة طبية عاجلة.' },
        { topic: 'Hotel & Shuttle', source: 'Where is the hotel shuttle bus stop?', target: 'أين موقف حافلة الفندق؟' },
      ];

  const swapLanguages = () => {
    const temp = sourceLang;
    setSourceLang(targetLang);
    setTargetLang(temp);
    setInputText(translatedText);
    setTranslatedText(inputText);
  };

  const handleTranslate = async (textToTranslate?: string) => {
    const query = textToTranslate || inputText;
    if (!query.trim()) return;

    setIsTranslating(true);

    try {
      // Call Gemini translation API
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `You are a professional instant translator for Pilgrims in Makkah & Madinah. Translate the following text strictly from ${sourceLang.name} to ${targetLang.name}. Output ONLY the translated text without explanations or quotes:\n\n${query}`,
          lang: targetLang.code,
        }),
      });

      if (!res.ok) throw new Error('Translation request failed');

      const data = await res.json();
      const output = data.response?.trim() || (isAr ? 'عذراً، تعذر إجراء الترجمة الآن.' : 'Translation failed.');
      setTranslatedText(output);

      if (!isMuted) {
        speak(output, targetLang.code);
      }
    } catch (err) {
      console.error('Translation error:', err);
      setTranslatedText(isAr ? 'تعذر الاتصال بخدمة الترجمة المباشرة.' : 'Failed to connect to translation server.');
    } finally {
      setIsTranslating(false);
    }
  };

  const toggleVoiceInput = () => {
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (isListening && recognitionRef.current) {
        recognitionRef.current.stop();
        setIsListening(false);
        return;
      }

      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = sourceLang.code === 'ar' ? 'ar-SA' : `${sourceLang.code}-US`;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onstart = () => setIsListening(true);
      recognitionRef.current.onresult = (e: any) => {
        const transcript = e.results[0][0].transcript;
        if (transcript) {
          setInputText(transcript);
          handleTranslate(transcript);
        }
        setIsListening(false);
      };
      recognitionRef.current.onerror = () => setIsListening(false);
      recognitionRef.current.onend = () => setIsListening(false);

      recognitionRef.current.start();
    } else {
      alert(isAr ? 'التعرف على الصوت غير مدعوم في متصفحك' : 'Voice recognition not supported');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#03291F]/95 border-2 border-[#D4AF37] rounded-3xl p-4 sm:p-8 text-[#F8F3E7] shadow-[0_15px_50px_rgba(0,0,0,0.8)] backdrop-blur-md max-w-5xl mx-auto my-4">
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-[#D4AF37]/30 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#02130D] border border-[#D4AF37] rounded-2xl text-[#D4AF37]">
            <Languages className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <span>{isAr ? 'الترجمة الفورية المباشرة لضيوف الرحمن' : 'Live Interpreter for Pilgrims'}</span>
              <Sparkles className="w-5 h-5 text-[#D4AF37]" />
            </h2>
            <p className="text-xs sm:text-sm text-[#D4AF37]/90 font-medium">
              {isAr ? 'ترجمة صوتية ونصية بين أكثر من 20 لغة للتواصل في الحرم والمشاعر والفنادق' : 'Voice & text translation across 20+ languages for Makkah & Madinah'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 bg-[#02130D] hover:bg-[#073D2F] border border-[#D4AF37]/60 text-[#D4AF37] font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className={`w-4 h-4 ${isAr ? 'rotate-180' : ''}`} />
          <span>{isAr ? 'العودة' : 'Back'}</span>
        </button>
      </div>

      {/* Language Switcher Control */}
      <div className="p-4 bg-[#021811] border border-[#D4AF37]/50 rounded-2xl mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Source Language Picker */}
        <div className="w-full sm:w-2/5 space-y-1">
          <label className="text-[11px] font-bold text-[#D4AF37] block">
            {isAr ? 'اللغة الأصلية (تكلم بها):' : 'Speak / Source Language:'}
          </label>
          <select
            value={sourceLang.code}
            onChange={(e) => {
              const found = LANGUAGES.find((l) => l.code === e.target.value);
              if (found) setSourceLang(found);
            }}
            className="w-full bg-[#03291F] border border-[#D4AF37]/60 text-white rounded-xl px-3 py-2.5 text-xs font-bold focus:outline-none focus:border-[#D4AF37]"
          >
            {LANGUAGES.map((l) => (
              <option key={l.code} value={l.code} className="bg-[#021811] text-white">
                {l.flag} {l.name} ({l.nativeName})
              </option>
            ))}
          </select>
        </div>

        {/* Swap Button */}
        <button
          type="button"
          onClick={swapLanguages}
          className="p-3 bg-[#03291F] border border-[#D4AF37] rounded-full text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#02130D] transition-all cursor-pointer shadow-md shrink-0"
          title={isAr ? 'تبديل اللغتين' : 'Swap Languages'}
        >
          <Repeat className="w-5 h-5" />
        </button>

        {/* Target Language Picker */}
        <div className="w-full sm:w-2/5 space-y-1">
          <label className="text-[11px] font-bold text-[#D4AF37] block">
            {isAr ? 'اللغة المستهدفة (الترجمة):' : 'Target Language:'}
          </label>
          <select
            value={targetLang.code}
            onChange={(e) => {
              const found = LANGUAGES.find((l) => l.code === e.target.value);
              if (found) setTargetLang(found);
            }}
            className="w-full bg-[#03291F] border border-[#D4AF37]/60 text-white rounded-xl px-3 py-2.5 text-xs font-bold focus:outline-none focus:border-[#D4AF37]"
          >
            {LANGUAGES.map((l) => (
              <option key={l.code} value={l.code} className="bg-[#021811] text-white">
                {l.flag} {l.name} ({l.nativeName})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Translation Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Source Box */}
        <div className="p-4 bg-[#021811] border border-[#D4AF37]/40 rounded-2xl flex flex-col justify-between space-y-3 min-h-[180px]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#D4AF37] flex items-center gap-1.5">
              <span>{sourceLang.flag}</span>
              <span>{sourceLang.name}</span>
            </span>
            <button
              type="button"
              onClick={toggleVoiceInput}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                isListening
                  ? 'bg-red-600 border-red-400 text-white animate-pulse'
                  : 'bg-[#03291F] border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#D4AF37]/20'
              }`}
              title={isAr ? 'الإملاء الصوتي المباشر' : 'Voice Dictation'}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
          </div>

          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              isListening
                ? isAr
                  ? 'جاري الاستماع لحديثك...'
                  : 'Listening to your speech...'
                : isAr
                ? 'اكتب أو تحدث بالجملة التي تريد ترجمتها فوراً...'
                : 'Type or speak the phrase you want to translate...'
            }
            className="w-full bg-transparent border-none text-white text-sm focus:outline-none resize-none flex-1 placeholder-[#F8F3E7]/40"
            rows={4}
          />

          <button
            type="button"
            disabled={isTranslating || !inputText.trim()}
            onClick={() => handleTranslate()}
            className="w-full py-2.5 bg-[#D4AF37] hover:bg-[#F5E5BE] text-[#02130D] font-black text-xs sm:text-sm rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40"
          >
            <Send className={`w-4 h-4 ${isAr ? 'rotate-180' : ''}`} />
            <span>{isTranslating ? (isAr ? 'جاري الترجمة...' : 'Translating...') : (isAr ? 'ترجمة الجملة الآن' : 'Translate Now')}</span>
          </button>
        </div>

        {/* Target Translation Result Box */}
        <div className="p-4 bg-[#03291F] border border-[#D4AF37]/60 rounded-2xl flex flex-col justify-between space-y-3 min-h-[180px] shadow-inner">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
              <span>{targetLang.flag}</span>
              <span>{targetLang.name}</span>
            </span>

            <div className="flex items-center gap-1">
              {translatedText && (
                <>
                  <button
                    type="button"
                    onClick={() => speak(translatedText, targetLang.code)}
                    className="p-2 rounded-xl bg-[#02130D] border border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#02130D] transition-all cursor-pointer"
                    title={isAr ? 'نطق النتيجة صوتیًا' : 'Pronounce Audio'}
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(translatedText)}
                    className="p-2 rounded-xl bg-[#02130D] border border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#02130D] transition-all cursor-pointer"
                    title={isAr ? 'نسخ النص' : 'Copy Text'}
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="flex-1 py-2 text-white font-semibold text-sm sm:text-base leading-relaxed font-serif">
            {translatedText ? (
              <p className="bg-[#021811] p-3 rounded-xl border border-[#D4AF37]/20 whitespace-pre-wrap">{translatedText}</p>
            ) : (
              <p className="text-xs text-[#F8F3E7]/40 italic">
                {isAr ? 'ستظهر الترجمة الناتجة هنا فوراً مع إمكانية النطق الصوتي.' : 'Translation output will appear here with audio speech.'}
              </p>
            )}
          </div>

          <div className="text-[10px] text-[#D4AF37]/70 font-mono">
            {isAr ? '💡 يمكنك إبراز الشاشة للمسؤول أو سائق التاكسي مباشرةً' : '💡 Show screen directly to local staff or taxi drivers'}
          </div>
        </div>
      </div>

      {/* Quick Pilgrim Phrasebook */}
      <div className="p-4 bg-[#021811] border border-[#D4AF37]/40 rounded-2xl space-y-3">
        <h3 className="font-bold text-xs sm:text-sm text-[#D4AF37] flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-amber-400" />
          <span>{isAr ? 'قاموس عبارات سريع ومهام لضيوف الرحمن:' : 'Essential Pilgrim Quick Phrasebook:'}</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {phrases.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setInputText(item.source);
                handleTranslate(item.source);
              }}
              className="p-3 rounded-xl bg-[#03291F] border border-[#D4AF37]/20 hover:border-[#D4AF37] text-right transition-all cursor-pointer group"
            >
              <span className="text-[10px] font-bold text-amber-300 block mb-1">{item.topic}</span>
              <p className="text-xs font-semibold text-white group-hover:text-[#D4AF37] transition-colors">{item.source}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LiveTranslationTool;
