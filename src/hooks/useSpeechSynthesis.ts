import { useState, useCallback, useEffect } from 'react';

const LANG_LOCALE_MAP: Record<string, string> = {
  ar: 'ar-SA',
  en: 'en-US',
  fr: 'fr-FR',
  tr: 'tr-TR',
  ur: 'ur-PK',
  id: 'id-ID',
  ms: 'ms-MY',
  bn: 'bn-BD',
  fa: 'fa-IR',
  ru: 'ru-RU',
  zh: 'zh-CN',
  es: 'es-ES',
  de: 'de-DE',
  it: 'it-IT',
  pt: 'pt-PT',
  hi: 'hi-IN',
  sw: 'sw-KE',
  ha: 'ha-NG',
  bs: 'bs-BA',
  ug: 'ug-CN',
  tl: 'fil-PH',
  uz: 'uz-UZ',
  ps: 'ps-AF',
  so: 'so-SO',
  kk: 'kk-KZ',
  ckb: 'ku-IQ',
};

function cleanTextForSpeech(text: string): string {
  if (!text) return '';
  return text
    .replace(/https?:\/\/\S+/g, '') // strip URLs
    .replace(/[*_#~`>|-]/g, ' ') // strip markdown syntax
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // strip markdown links
    .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '') // strip emojis for clean clear vocal output
    .replace(/\s+/g, ' ')
    .trim();
}

export function useSpeechSynthesis() {
  const [isMuted, setIsMuted] = useState<boolean>(() => {
    const saved = localStorage.getItem('arafat_speech_muted');
    return saved === 'true';
  });

  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [currentMessageId, setCurrentMessageId] = useState<string | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  // Load available system voices
  const loadVoices = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const available = window.speechSynthesis.getVoices();
      if (available && available.length > 0) {
        setVoices(available);
      }
    }
  }, []);

  useEffect(() => {
    loadVoices();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, [loadVoices]);

  useEffect(() => {
    localStorage.setItem('arafat_speech_muted', String(isMuted));
  }, [isMuted]);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setCurrentMessageId(null);
  }, []);

  const speak = useCallback(
    (text: string, langCode: string = 'ar', messageId?: string) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
      if (isMuted) return;

      window.speechSynthesis.cancel();

      const cleanText = cleanTextForSpeech(text);
      if (!cleanText) return;

      const utterance = new SpeechSynthesisUtterance(cleanText);
      const targetLocale = LANG_LOCALE_MAP[langCode] || 'ar-SA';
      utterance.lang = targetLocale;
      utterance.rate = 0.92; // Clear, deliberate speed for spiritual & religious guidance
      utterance.pitch = 1.0;

      // Select optimal voice if available
      const currentVoices = voices.length > 0 ? voices : window.speechSynthesis.getVoices();
      if (currentVoices && currentVoices.length > 0) {
        const targetClean = targetLocale.toLowerCase().replace('_', '-');
        const langClean = langCode.toLowerCase();

        const exactMatch = currentVoices.find(
          (v) => v.lang.toLowerCase().replace('_', '-') === targetClean
        );
        const langMatch = currentVoices.find((v) =>
          v.lang.toLowerCase().startsWith(langClean)
        );
        const arabicMatch = currentVoices.find((v) =>
          v.lang.toLowerCase().startsWith('ar')
        );

        const chosenVoice = exactMatch || langMatch || (langCode === 'ar' ? arabicMatch : null);
        if (chosenVoice) {
          utterance.voice = chosenVoice;
        }
      }

      utterance.onstart = () => {
        setIsSpeaking(true);
        if (messageId) setCurrentMessageId(messageId);
      };
      utterance.onend = () => {
        setIsSpeaking(false);
        setCurrentMessageId(null);
      };
      utterance.onerror = () => {
        setIsSpeaking(false);
        setCurrentMessageId(null);
      };

      window.speechSynthesis.speak(utterance);
    },
    [isMuted, voices]
  );

  const stop = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setCurrentMessageId(null);
  }, []);

  return {
    isMuted,
    isSpeaking,
    currentMessageId,
    toggleMute,
    speak,
    stop,
  };
}

export default useSpeechSynthesis;

