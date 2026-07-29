import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LanguageOption } from '../../data/languages';
import { CurrencyOption } from '../../data/currencies';
import { UserContext } from '../../types/assistant';
import { useArafatChat } from '../../hooks/useArafatChat';
import { useSpeechSynthesis } from '../../hooks/useSpeechSynthesis';
import { AssistantHeader } from './AssistantHeader';
import { MessageList } from './MessageList';
import { QuickSuggestions } from './QuickSuggestions';
import { MessageComposer } from './MessageComposer';
import { HumanSupportButton } from './HumanSupportButton';

interface ArafatAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  language: LanguageOption;
  currency: CurrencyOption;
  userContext?: UserContext;
}

export const ArafatAssistant: React.FC<ArafatAssistantProps> = ({
  isOpen,
  onClose,
  language,
  currency,
  userContext,
}) => {
  const {
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
  } = useArafatChat({
    languageCode: language.code,
    currencyCode: currency.code,
    userContext,
  });

  const { isMuted, isSpeaking, currentMessageId, toggleMute, speak, stop } = useSpeechSynthesis();
  const lastSpokenIdRef = React.useRef<string | null>(null);

  // Automatically read out new assistant messages when not muted OR when autoSpeak is flagged
  React.useEffect(() => {
    if (messages.length > 0) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg.role === 'assistant' && lastMsg.id !== lastSpokenIdRef.current) {
        if (!isMuted || lastMsg.autoSpeak) {
          lastSpokenIdRef.current = lastMsg.id;
          speak(lastMsg.content, language.code, lastMsg.id);
        }
      }
    }
  }, [messages, isMuted, language.code, speak]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 15 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 w-screen h-screen bg-[#02130D] flex flex-col overflow-hidden text-[#F8F3E7]"
      >
        {/* 1. Header */}
        <AssistantHeader
          language={language}
          isMuted={isMuted}
          isSpeaking={isSpeaking}
          onToggleMute={toggleMute}
          onClearChat={clearChat}
          onRequestHumanSupport={() => requestHumanSupport()}
          onClose={onClose}
        />

        {/* Main Full-Screen Chat Viewport */}
        <div className="flex-1 flex flex-col w-full max-w-5xl mx-auto overflow-hidden">
          {/* 2. Messages Body */}
          <MessageList
            messages={messages}
            isLoading={isLoading}
            error={error}
            languageCode={language.code}
            onConfirmAction={confirmProposedAction}
            onRejectAction={rejectProposedAction}
            onSelectSuggestedReply={(reply) => sendMessage(reply)}
            onSpeakMessage={(text, msgId) => speak(text, language.code, msgId)}
            onStopSpeech={stop}
            currentSpeakingId={currentMessageId}
            onRetry={() => {
              const lastUserMsg = [...messages].reverse().find((m) => m.role === 'user');
              if (lastUserMsg) {
                sendMessage(lastUserMsg.content);
              }
            }}
          />

          {/* 3. Quick Suggestions Bar */}
          <QuickSuggestions
            languageCode={language.code}
            onSelectSuggestion={(prompt) => sendMessage(prompt)}
            disabled={isLoading}
          />

          {/* 4. Human Support Bar (Mobile visible) */}
          <div className="px-3 pt-1 sm:hidden">
            <HumanSupportButton
              languageCode={language.code}
              onClick={() => requestHumanSupport()}
              disabled={isLoading}
            />
          </div>

          {/* 5. Input Composer */}
          <MessageComposer
            languageCode={language.code}
            onSendMessage={(text) => sendMessage(text)}
            onAttachLocation={attachUserLocation}
            attachedLocation={locationAttached}
            isLoading={isLoading}
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ArafatAssistant;
