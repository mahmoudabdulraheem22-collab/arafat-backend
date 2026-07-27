import React from 'react';
import { RequestStatus } from '../../types/assistant';
import { Clock, CheckCircle2, AlertCircle, Headphones, RefreshCw, XCircle } from 'lucide-react';

interface RequestStatusCardProps {
  status: RequestStatus;
  languageCode?: string;
}

export const RequestStatusCard: React.FC<RequestStatusCardProps> = ({
  status,
  languageCode = 'ar',
}) => {
  const isAr = languageCode === 'ar';

  const getStatusConfig = () => {
    switch (status) {
      case 'pending':
        return {
          label: isAr ? 'قيد المعالجة' : 'Processing',
          bgColor: 'bg-amber-500/10',
          borderColor: 'border-amber-500/40',
          textColor: 'text-amber-300',
          icon: <Clock className="w-4 h-4 text-amber-400 animate-spin" />,
          desc: isAr ? 'جارٍ العمل على تنفيذ طلبك في الأنظمة الرسمية.' : 'Your request is currently being processed.',
        };
      case 'human_requested':
        return {
          label: isAr ? 'محوّل لموظف بشري' : 'Human Agent Assigned',
          bgColor: 'bg-emerald-500/20',
          borderColor: 'border-emerald-400',
          textColor: 'text-emerald-300',
          icon: <Headphones className="w-4 h-4 text-emerald-300 animate-pulse" />,
          desc: isAr ? 'تم تحويل الطلب لموظف بشري متخصص لمتابعتك وإبلاغك بالتحديثات.' : 'Your request is assigned to an Arafat support agent.',
        };
      case 'confirmed':
        return {
          label: isAr ? 'مؤكد ومعتمد' : 'Confirmed',
          bgColor: 'bg-emerald-950/60',
          borderColor: 'border-emerald-500/60',
          textColor: 'text-emerald-300',
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
          desc: isAr ? 'تمت الموافقة وتوثيق الإجراء بنجاح.' : 'Confirmed and documented successfully.',
        };
      case 'failed':
        return {
          label: isAr ? 'تعذر التنفيذ' : 'Failed',
          bgColor: 'bg-red-950/60',
          borderColor: 'border-red-500/60',
          textColor: 'text-red-300',
          icon: <XCircle className="w-4 h-4 text-red-400" />,
          desc: isAr ? 'حدثت مشكلة أثناء المعالجة، يمكنك إعادة المحاولة.' : 'An error occurred during execution.',
        };
      default:
        return null;
    }
  };

  const config = getStatusConfig();
  if (!config) return null;

  return (
    <div className={`mt-2 p-2.5 rounded-xl border ${config.bgColor} ${config.borderColor} flex items-start gap-2.5 text-xs`}>
      <div className="mt-0.5 shrink-0">{config.icon}</div>
      <div>
        <span className={`font-bold block ${config.textColor}`}>{config.label}</span>
        <span className="text-[#F8F3E7]/80 text-[11px] leading-relaxed">{config.desc}</span>
      </div>
    </div>
  );
};

export default RequestStatusCard;
