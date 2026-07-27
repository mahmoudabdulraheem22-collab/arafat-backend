import { useState, useCallback, useEffect } from 'react';

export function useSpeechSynthesis() {
  const [isMuted, setIsMuted] = useState<boolean>(() => {
    const saved = localStorage.getItem('arafat_speech_muted');
    return saved === 'true';
  });

  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem('arafat_speech_muted', String(isMuted));
  }, [isMuted]);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }, []);

  const speak = useCallback(
    (text: string, langCode: string = 'ar') => {
      if (isMuted || !('speechSynthesis' in window)) return;

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = langCode === 'ar' ? 'ar-SA' : 'en-US';
      utterance.rate = 1.0;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    },
    [isMuted]
  );

  const stop = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  }, []);

  return {
    isMuted,
    isSpeaking,
    toggleMute,
    speak,
    stop,
  };
}

export default useSpeechSynthesis;
