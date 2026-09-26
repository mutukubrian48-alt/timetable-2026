import React from 'react';
import { CheckCircle2, AlertTriangle, Info, X, Video, MapPin } from 'lucide-react';

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type?: 'success' | 'warning' | 'urgent' | 'info';
  deliveryMode?: 'online' | 'offline';
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const isOnline = toast.deliveryMode === 'online';
        const isOffline = toast.deliveryMode === 'offline';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg transition-all animate-in slide-in-from-bottom-2 ${
              toast.type === 'urgent'
                ? 'bg-rose-900 text-white border-rose-800'
                : toast.type === 'warning'
                ? 'bg-amber-900 text-white border-amber-800'
                : 'bg-slate-900 text-white border-slate-800'
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {toast.type === 'urgent' ? (
                <AlertTriangle className="w-5 h-5 text-rose-400" />
              ) : toast.type === 'warning' ? (
                <AlertTriangle className="w-5 h-5 text-amber-400" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              )}
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold leading-tight">{toast.title}</h4>
                {isOnline && (
                  <span className="inline-flex items-center gap-1 text-[10px] text-cyan-300 font-semibold bg-cyan-950/70 px-1.5 py-0.5 rounded border border-cyan-500/30">
                    <Video className="w-3 h-3 text-cyan-400" />
                    Online
                  </span>
                )}
                {isOffline && (
                  <span className="inline-flex items-center gap-1 text-[10px] text-amber-300 font-semibold bg-amber-950/70 px-1.5 py-0.5 rounded border border-amber-500/30">
                    <MapPin className="w-3 h-3 text-amber-400" />
                    Offline
                  </span>
                )}
              </div>
              {toast.description && (
                <p className="text-xs text-slate-300 leading-relaxed">
                  {toast.description}
                </p>
              )}
            </div>

            <button
              onClick={() => onDismiss(toast.id)}
              className="text-slate-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
