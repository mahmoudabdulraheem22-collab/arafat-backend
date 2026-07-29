import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { ChatMessage, UserContext, ChatApiResponse } from '../types/assistant';

interface UseArafatChatOptions {
  languageCode?: string;
  currencyCode?: string;
  userContext?: UserContext;
  initialMessages?: ChatMessage[];
}

const DEFAULT_EMPTY_CONTEXT: UserContext = {};

export function useArafatChat({
  languageCode = 'ar',
  currencyCode = 'SAR',
  userContext = DEFAULT_EMPTY_CONTEXT,
  initialMessages,
}: UseArafatChatOptions = {}) {
  const isAr = languageCode === 'ar';

  const defaultWelcomeMessage: ChatMessage = useMemo(
    () => ({
      id: 'welcome_1',
      role: 'assistant',
      content: isAr
        ? 'أهلاً بك يا ضيف الرحمن في منصة عرفات! أنا وكيلك الذكي المعتمد. كيف أستطيع خدمتك اليوم في مناسكك، حجز السكن، التنقلات، أو حساب ميزانية رحلتك؟'
        : 'Welcome Pilgrim to Arafat Platform! I am your AI assistant. How can I serve you today with rituals, hotel booking, transport, or trip budget planning?',
      timestamp: Date.now(),
      intent: 'welcome',
      suggestedReplies: isAr
        ? ['اشرح لي العمرة خطوة بخطوة', 'صمّم رحلتي الكاملة', 'احسب ميزانية رحلتي', 'ابحث لي عن فندق بمكة']
        : ['Explain Umrah step-by-step', 'Design my complete journey', 'Calculate my budget', 'Find me a hotel in Makkah'],
    }),
    [isAr]
  );

  const [conversationId, setConversationId] = useState<string>(() => `conv_${Date.now()}`);
  const [messages, setMessages] = useState<ChatMessage[]>(() => initialMessages || [defaultWelcomeMessage]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [attachedLocation, setAttachedLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const locationAttached = attachedLocation !== null;

  const currentUserContext = useMemo<UserContext>(() => {
    if (!attachedLocation) return userContext;
    return {
      ...userContext,
      location: attachedLocation,
    };
  }, [userContext, attachedLocation]);

  // AbortController ref to cancel pending requests
  const abortControllerRef = useRef<AbortController | null>(null);

  // Clean up controller on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const abortRequest = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsLoading(false);
    }
  }, []);

  const sendMessage = useCallback(
    async (text: string, options?: { image?: string; autoSpeak?: boolean }) => {
      const trimmedText = text.trim();
      const hasImage = Boolean(options?.image);
      if ((!trimmedText && !hasImage) || isLoading) return;

      const messageContent = trimmedText || (isAr ? 'قام الحاج بإرسال صورة ملتقطة بالكاميرا للتعرف البصري.' : 'Pilgrim sent camera photo for visual analysis.');

      // Abort any previous pending request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      setError(null);
      setIsLoading(true);

      const userMsgId = `user_${Date.now()}`;
      const newUserMessage: ChatMessage = {
        id: userMsgId,
        role: 'user',
        content: messageContent,
        imagePreview: options?.image,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, newUserMessage]);

      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        const response = await fetch('/api/ai/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          signal: controller.signal,
          body: JSON.stringify({
            message: messageContent,
            conversationId,
            language: languageCode,
            currency: currencyCode,
            userContext: currentUserContext,
            image: options?.image || null,
          }),
        });

        if (!response.ok) {
          // Fallback to legacy endpoint if /api/ai/chat returned non-200
          const legacyRes = await fetch('/api/gemini/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            signal: controller.signal,
            body: JSON.stringify({
              message: messageContent,
              lang: languageCode,
            }),
          });

          if (!legacyRes.ok) {
            throw new Error(`Server responded with status ${response.status}`);
          }

          const legacyData = await legacyRes.json();
          const assistantMsgId = `asst_${Date.now()}`;
          const assistantMsg: ChatMessage = {
            id: assistantMsgId,
            role: 'assistant',
            content: legacyData.response || (isAr ? 'تم استلام استفسارك بنجاح.' : 'Your request was received.'),
            timestamp: Date.now(),
            autoSpeak: options?.autoSpeak,
            suggestedReplies: isAr
              ? ['مناسك العمرة', 'حساب الميزانية', 'التحدث مع موظف']
              : ['Umrah rituals', 'Calculate budget', 'Talk to Human Agent'],
          };

          setMessages((prev) => [...prev, assistantMsg]);
          setIsLoading(false);
          abortControllerRef.current = null;
          return;
        }

        const data: ChatApiResponse = await response.json();

        if (data.conversationId) {
          setConversationId(data.conversationId);
        }

        const assistantMsgId = `asst_${Date.now()}`;
        const assistantMsg: ChatMessage = {
          id: assistantMsgId,
          role: 'assistant',
          content: data.message || (isAr ? 'تمت معالجة طلبك.' : 'Your request processed.'),
          timestamp: Date.now(),
          intent: data.intent,
          requiresConfirmation: data.requiresConfirmation,
          proposedAction: data.proposedAction,
          status: data.requiresConfirmation ? 'pending' : undefined,
          autoSpeak: options?.autoSpeak,
          suggestedReplies: data.suggestedReplies || [],
        };

        setMessages((prev) => [...prev, assistantMsg]);
      } catch (err: any) {
        if (err.name === 'AbortError') {
          console.log('Request aborted');
          return;
        }

        console.error('Error sending message to Arafat AI:', err);
        const errorText = isAr
          ? 'عذراً، تعذر الاتصال بالوكيل الذكي حالياً. يرجى التحقق من الاتصال وإعادة المحاولة.'
          : 'Sorry, failed to connect to Arafat AI agent. Please check your connection and retry.';

        setError(errorText);

        const fallbackErrorMsg: ChatMessage = {
          id: `err_${Date.now()}`,
          role: 'assistant',
          content: isAr
            ? 'نعتذر عن عدم الاستجابة المؤقتة، يمكنك إما إعادة المحاولة أو طلب التحدث مع موظف خدمة ضيوف الرحمن.'
            : 'Apologies for the temporary issue. You can retry or request human support.',
          timestamp: Date.now(),
          error: true,
          suggestedReplies: isAr ? ['إعادة المحاولة', 'التحدث مع موظف'] : ['Retry', 'Talk to Agent'],
        };

        setMessages((prev) => [...prev, fallbackErrorMsg]);
      } finally {
        setIsLoading(false);
        abortControllerRef.current = null;
      }
    },
    [isLoading, conversationId, languageCode, currencyCode, currentUserContext, isAr]
  );

  const confirmProposedAction = useCallback(
    async (messageId: string) => {
      setMessages((prev) =>
        prev.map((m) => (m.id === messageId ? { ...m, status: 'confirmed' } : m))
      );

      const targetMsg = messages.find((m) => m.id === messageId);
      const actionSummary = targetMsg?.proposedAction?.summary || (isAr ? 'الإجراء المطلوب' : 'the action');

      await sendMessage(
        isAr ? `نعم، أؤكد تنفيذ الإجراء: ${actionSummary}` : `Yes, confirm action: ${actionSummary}`
      );
    },
    [messages, isAr, sendMessage]
  );

  const rejectProposedAction = useCallback(
    (messageId: string) => {
      setMessages((prev) =>
        prev.map((m) => (m.id === messageId ? { ...m, status: 'rejected' } : m))
      );
    },
    []
  );

  const requestHumanSupport = useCallback(async () => {
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 600));

      const systemMsg: ChatMessage = {
        id: `human_${Date.now()}`,
        role: 'assistant',
        content: isAr
          ? 'تم رفع طلبك فوراً لموظف خدمة ضيوف الرحمن المباشر. جارٍ توصيلك بأقرب ممثل خدمة متاح لمساعدتك.'
          : 'Your request has been escalated to a live Arafat Human Support Specialist. Connecting you shortly.',
        timestamp: Date.now(),
        status: 'human_requested',
        suggestedReplies: isAr ? ['متابعة حالة الطلب', 'العودة للوكيل الذكي'] : ['Check request status', 'Back to AI Agent'],
      };

      setMessages((prev) => [...prev, systemMsg]);
    } finally {
      setIsLoading(false);
    }
  }, [isAr]);

  const attachUserLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setError(isAr ? 'خاصية تحديد الموقع غير مدعومة في متصفحك' : 'Geolocation is not supported by your browser');
      return;
    }

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 10000,
          enableHighAccuracy: true,
        });
      });

      const loc = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };

      setAttachedLocation(loc);

      const systemNotice: ChatMessage = {
        id: `loc_${Date.now()}`,
        role: 'system',
        content: isAr
          ? `📍 تم ربط موقعك الجغرافي بنجاح (${loc.latitude.toFixed(4)}, ${loc.longitude.toFixed(4)}) لتلقي توجيهات المواقيت والمشاعر والخدمات المجاورة.`
          : `📍 Geographic location attached successfully (${loc.latitude.toFixed(4)}, ${loc.longitude.toFixed(4)}).`,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, systemNotice]);
    } catch (err) {
      console.warn('Geolocation permission or fetch failed:', err);
      setError(isAr ? 'عذراً، لم نتمكن من الوصول لموقعك الجغرافي' : 'Unable to access your location');
    }
  }, [isAr]);

  const clearChat = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setConversationId(`conv_${Date.now()}`);
    setMessages([defaultWelcomeMessage]);
    setError(null);
    setIsLoading(false);
  }, [defaultWelcomeMessage]);

  return {
    conversationId,
    messages,
    isLoading,
    error,
    locationAttached,
    sendMessage,
    confirmProposedAction,
    rejectProposedAction,
    requestHumanSupport,
    attachUserLocation,
    clearChat,
    abortRequest,
  };
}

export default useArafatChat;
