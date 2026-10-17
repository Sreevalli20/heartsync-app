import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { ToastMessage } from '../types';

interface ToastProps {
  toast: ToastMessage | null;
  onDismiss: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onDismiss();
    }, 3500);
    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  if (!toast) return null;

  const isSuccess = toast.type === 'success' || !toast.type;
  const isWarning = toast.type === 'warning';

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 left-4 md:left-auto md:w-96 z-50 transition-all animate-in fade-in slide-in-from-bottom-2 duration-200">
      <div className="p-3.5 rounded-2xl bg-[#281426] text-[#FAF7F2] shadow-xl border border-[#3E213B] flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          {isSuccess ? (
            <CheckCircle2 className="w-4 h-4 text-[#7BD4A3] shrink-0 mt-0.5" />
          ) : isWarning ? (
            <AlertCircle className="w-4 h-4 text-[#F39A8E] shrink-0 mt-0.5" />
          ) : (
            <Info className="w-4 h-4 text-[#BCA5C4] shrink-0 mt-0.5" />
          )}

          <div>
            <p className="text-xs font-bold leading-tight">{toast.title}</p>
            {toast.description && (
              <p className="text-[11px] text-[#D8C7D8] mt-0.5 leading-snug">
                {toast.description}
              </p>
            )}
          </div>
        </div>

        <button
          onClick={onDismiss}
          className="text-[#BCA5C4] hover:text-[#FAF7F2] transition-colors p-0.5"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
