import React, { useRef, useEffect } from 'react';
import { ChatMessage } from '../../types/assistant';
import { ArafatLogo } from '../common/ArafatLogo';
import { ActionProposalCard } from './ActionProposalCard';
import { RequestStatusCard } from './RequestStatusCard';
import { Bot, User, Sparkles, Loader2, AlertCircle, RefreshCw } from 'lucide-react';

interface MessageListProps {
  messages: ChatMessage[];
  isLoading?: boolean;
  error?: string | null;
  languageCode?: string;
  onConfirmAction?: (messageId: string) => void;
  onRejectAction?: (messageId: string) => void;
  onSelectSuggestedReply?: (replyText: string) => void;
  onRetry?: () => void;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  isLoading = false,
  error = null,
  languageCode = 'ar',
  onConfirmAction,
  onRejectAction,
  onSelectSuggestedReply,
  onRetry,
}) => {
  const isAr = languageCode === 'ar';
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="flex-1 p-3 sm:p-6 overflow-y-auto space-y-4 custom-scrollbar">
      {messages.map((msg) => {
        const isUser = msg.role === 'user';
        const isSystem = msg.role === 'system';

        if (isSystem) {
          return (
            <div key={msg.id} className="flex justify-center my-2">
              <div className="px-3.5 py-1.5 rounded-full bg-[#03291F] border border-[#D4AF37]/30 text-xs text-[#D4AF37] text-center font-medium shadow-inner max-w-lg">
                {msg.content}
              </div>
            </div>
          );
        }

        return (
          <div
            key={msg.id}
            className={`flex items-start gap-2.5 sm:gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
          >
            {/* Avatar */}
            <div
              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center shrink-0 border ${
                isUser
                  ? 'bg-[#D4AF37] text-[#02130D] border-[#D4AF37]'
                  : 'bg-[#03291F] border-[#D4AF37]/60 text-white'
              }`}
            >
              {isUser ? <User className="w-4 h-4" /> : <ArafatLogo size="xs" />}
            </div>

            {/* Bubble Container */}
            <div className={`max-w-[85%] sm:max-w-[75%] space-y-1.5 ${isUser ? 'items-end' : 'items-start'}`}>
              <div
                className={`rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed shadow-md ${
                  isUser
                    ? 'bg-[#D4AF37] text-[#02130D] font-bold rounded-tr-none'
                    : msg.error
                    ? 'bg-red-950/80 text-red-200 border border-red-500/60 rounded-tl-none'
                    : 'bg-[#073D2F] text-[#F8F3E7] border border-[#D4AF37]/40 rounded-tl-none'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>

                {/* Proposed Action Confirmation Card */}
                {msg.proposedAction && (
                  <ActionProposalCard
                    action={msg.proposedAction}
                    status={msg.status}
                    languageCode={languageCode}
                    onConfirm={() => onConfirmAction && onConfirmAction(msg.id)}
                    onReject={() => onRejectAction && onRejectAction(msg.id)}
                  />
                )}

                {/* Request Status Info Card */}
                {msg.status && !msg.proposedAction && (
                  <RequestStatusCard status={msg.status} languageCode={languageCode} />
                )}
              </div>

              {/* Suggested Quick Reply Chips for this message */}
              {!isUser && msg.suggestedReplies && msg.suggestedReplies.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {msg.suggestedReplies.map((reply, rIdx) => (
                    <button
                      key={rIdx}
                      type="button"
                      onClick={() => onSelectSuggestedReply && onSelectSuggestedReply(reply)}
                      className="px-2.5 py-1 rounded-full bg-[#02130D] border border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#02130D] text-[11px] font-semibold transition-all cursor-pointer"
                    >
                      {reply}
                    </button>
                  ))}
                </div>
              )}

              <span className="text-[10px] text-[#D4AF37]/60 block px-1 font-mono">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        );
      })}

      {/* Loading Indicator */}
      {isLoading && (
        <div className="flex items-center gap-3 text-xs text-[#D4AF37] font-semibold p-2">
          <div className="w-8 h-8 rounded-full bg-[#03291F] border border-[#D4AF37]/60 flex items-center justify-center">
            <Loader2 className="w-4 h-4 animate-spin text-[#D4AF37]" />
          </div>
          <span className="animate-pulse">
            {isAr ? 'عرفات يفكر ويكتب الرد المناسب...' : 'Arafat is thinking & generating response...'}
          </span>
        </div>
      )}

      {/* Error Alert Box */}
      {error && (
        <div className="p-3 bg-red-950/80 border border-red-500/60 rounded-2xl flex items-center justify-between text-xs text-red-200">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="px-3 py-1 bg-red-800 hover:bg-red-700 text-white font-bold rounded-lg flex items-center gap-1 cursor-pointer transition-all shrink-0"
            >
              <RefreshCw className="w-3 h-3" />
              <span>{isAr ? 'إعادة' : 'Retry'}</span>
            </button>
          )}
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
};

export default MessageList;
