import React from 'react';
import { ProposedAction, RequestStatus } from '../../types/assistant';
import { Check, X, ShieldAlert, ArrowLeft } from 'lucide-react';

interface ActionProposalCardProps {
  action: ProposedAction;
  status?: RequestStatus;
  languageCode?: string;
  onConfirm: () => void;
  onReject: () => void;
}

export const ActionProposalCard: React.FC<ActionProposalCardProps> = ({
  action,
  status = 'pending',
  languageCode = 'ar',
  onConfirm,
  onReject,
}) => {
  const isAr = languageCode === 'ar';

  return (
    <div className="mt-3 p-3.5 bg-[#021811] border border-[#D4AF37]/60 rounded-2xl shadow-lg space-y-3">
      <div className="flex items-center gap-2 text-[#D4AF37] font-bold text-xs sm:text-sm">
        <ShieldAlert className="w-4 h-4 shrink-0" />
        <span>{isAr ? 'إجراء مقترح يحتاج تأكيدك:' : 'Proposed Action Requires Confirmation:'}</span>
      </div>

      <div className="p-2.5 bg-[#03291F] rounded-xl border border-[#D4AF37]/20 text-xs text-white leading-relaxed">
        <p className="font-semibold text-[#F8F3E7] mb-1">{action.summary}</p>
        {action.payload && (
          <div className="mt-2 pt-2 border-t border-[#D4AF37]/20 space-y-1 text-[11px] text-[#D4AF37]/90 font-mono">
            {Object.entries(action.payload).map(([k, v]) => (
              <div key={k} className="flex justify-between gap-2">
                <span className="text-[#F8F3E7]/70">{k}:</span>
                <span className="font-bold text-white">{String(v)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {status === 'pending' && (
        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 py-2 px-3 bg-[#D4AF37] hover:bg-[#F5E5BE] text-[#02130D] font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>{isAr ? 'تأكيد الإجراء والبدء' : 'Confirm Action'}</span>
          </button>
          <button
            type="button"
            onClick={onReject}
            className="py-2 px-3 bg-red-950/60 hover:bg-red-900/80 border border-red-500/50 text-red-300 font-bold text-xs rounded-xl flex items-center justify-center gap-1 transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
            <span>{isAr ? 'إلغاء' : 'Cancel'}</span>
          </button>
        </div>
      )}

      {status === 'confirmed' && (
        <div className="p-2 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 text-xs font-bold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{isAr ? 'تم تأكيد الإجراء بنجاح ومتابعة التنفيذ' : 'Action confirmed & processing'}</span>
        </div>
      )}

      {status === 'rejected' && (
        <div className="p-2 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs font-bold flex items-center gap-2">
          <X className="w-4 h-4 text-red-400" />
          <span>{isAr ? 'تم إلغاء المقترح بناءً على رغبتك' : 'Action cancelled by user'}</span>
        </div>
      )}
    </div>
  );
};

export default ActionProposalCard;
