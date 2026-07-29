import { useState, useEffect, useRef, useCallback } from 'react';

export interface GuidanceAudioTrack {
  id: string;
  title: string;
  text: string;
  category?: string;
  subTitle?: string;
}

export interface TTSState {
  isPlaying: boolean;
  isPaused: boolean;
  currentTrack: GuidanceAudioTrack | null;
  playbackRate: number; // 0.75, 1, 1.25, 1.5
  progress: number; // 0 to 100 estimated
  selectedVoiceName: string | null;
  availableArabicVoices: SpeechSynthesisVoice[];
}

export const useGuidanceTTS = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [currentTrack, setCurrentTrack] = useState<GuidanceAudioTrack | null>(null);
  const [playbackRate, setPlaybackRate] = useState<number>(0.9); // Slightly slower rate for clear Quranic / religious recitation
  const [progress, setProgress] = useState<number>(0);
  const [availableArabicVoices, setAvailableArabicVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceName, setSelectedVoiceName] = useState<string | null>(null);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const progressTimerRef = useRef<any>(null);
  const startTimeRef = useRef<number>(0);
  const estimatedDurationRef = useRef<number>(10000);

  // Load available voices in browser
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const updateVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      const arVoices = voices.filter((v) => v.lang.startsWith('ar'));
      setAvailableArabicVoices(arVoices.length > 0 ? arVoices : voices);
      if (arVoices.length > 0 && !selectedVoiceName) {
        setSelectedVoiceName(arVoices[0].name);
      }
    };

    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, [selectedVoiceName]);

  // Clean timer helper
  const clearProgressTimer = () => {
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current);
      progressTimerRef.current = null;
    }
  };

  // Stop currently playing audio
  const stopAudio = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    clearProgressTimer();
    setIsPlaying(false);
    setIsPaused(false);
    setProgress(0);
    setCurrentTrack(null);
  }, []);

  // Play a specific guidance text or dua
  const playTrack = useCallback(
    (track: GuidanceAudioTrack) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        alert('القراءة الصوتية غير مدعومة في متصفحك بشكل مباشر.');
        return;
      }

      // If playing same track and paused, resume
      if (currentTrack?.id === track.id && isPaused) {
        window.speechSynthesis.resume();
        setIsPlaying(true);
        setIsPaused(false);
        return;
      }

      // Cancel previous speech
      stopAudio();

      // Clean text from emojis and bullet symbols for smoother Arabic TTS reading
      const cleanedText = track.text
        .replace(/[\u{1F300}-\u{1F9FF}]/gu, '')
        .replace(/[•★♦️▪️▫️]/g, '')
        .trim();

      const utterance = new SpeechSynthesisUtterance(cleanedText);
      utterance.lang = 'ar-SA';
      utterance.rate = playbackRate;
      utterance.pitch = 1.0;

      // Select Arabic Voice if available
      if (availableArabicVoices.length > 0) {
        const matchedVoice = availableArabicVoices.find((v) => v.name === selectedVoiceName) || availableArabicVoices[0];
        if (matchedVoice) utterance.voice = matchedVoice;
      }

      // Estimate duration based on word count (~130 words per minute at 1.0 rate)
      const wordCount = cleanedText.split(/\s+/).length;
      const estimatedMs = Math.max(4000, ((wordCount / 130) * 60 * 1000) / playbackRate);
      estimatedDurationRef.current = estimatedMs;
      startTimeRef.current = Date.now();

      utterance.onstart = () => {
        setIsPlaying(true);
        setIsPaused(false);
        setCurrentTrack(track);
        setProgress(0);

        // Progress estimation ticker
        clearProgressTimer();
        progressTimerRef.current = setInterval(() => {
          const elapsed = Date.now() - startTimeRef.current;
          const pct = Math.min(98, Math.round((elapsed / estimatedDurationRef.current) * 100));
          setProgress(pct);
        }, 300);
      };

      utterance.onend = () => {
        clearProgressTimer();
        setProgress(100);
        setTimeout(() => {
          setIsPlaying(false);
          setIsPaused(false);
          setProgress(0);
          setCurrentTrack(null);
        }, 500);
      };

      utterance.onerror = (err) => {
        console.warn('TTS Playback error or cancelled:', err);
        clearProgressTimer();
        setIsPlaying(false);
        setIsPaused(false);
        setProgress(0);
      };

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    },
    [currentTrack, isPaused, playbackRate, stopAudio, availableArabicVoices, selectedVoiceName]
  );

  // Pause speech
  const pauseAudio = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window && isPlaying) {
      window.speechSynthesis.pause();
      setIsPlaying(false);
      setIsPaused(true);
      clearProgressTimer();
    }
  }, [isPlaying]);

  // Toggle play/pause for a given track
  const togglePlayTrack = useCallback(
    (track: GuidanceAudioTrack) => {
      if (currentTrack?.id === track.id) {
        if (isPlaying) {
          pauseAudio();
        } else {
          playTrack(track);
        }
      } else {
        playTrack(track);
      }
    },
    [currentTrack, isPlaying, pauseAudio, playTrack]
  );

  // Change speed
  const changePlaybackRate = useCallback(
    (rate: number) => {
      setPlaybackRate(rate);
      if (currentTrack && (isPlaying || isPaused)) {
        // Re-trigger with new rate at current track
        playTrack(currentTrack);
      }
    },
    [currentTrack, isPlaying, isPaused, playTrack]
  );

  return {
    isPlaying,
    isPaused,
    currentTrack,
    playbackRate,
    progress,
    availableArabicVoices,
    selectedVoiceName,
    setSelectedVoiceName,
    playTrack,
    pauseAudio,
    stopAudio,
    togglePlayTrack,
    changePlaybackRate,
  };
};
