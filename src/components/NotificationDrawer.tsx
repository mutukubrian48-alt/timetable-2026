import React from 'react';
import { AppNotification } from '../types';
import {
  Bell,
  X,
  Volume2,
  VolumeX,
  CheckCheck,
  Sparkles,
  ExternalLink,
  Video,
  MapPin,
  Clock,
  ShieldCheck,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { requestBrowserNotificationPermission, sendBrowserPushNotification, canSendBrowserNotification } from '../utils/notifications';
import { playNotificationChime } from '../utils/sound';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  onSendTestNotification: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onClearAll,
  soundEnabled,
  setSoundEnabled,
  onSendTestNotification,
}) => {
  if (!isOpen) return null;

  const browserNotificationGranted = canSendBrowserNotification();

  const handleEnableBrowserNotifications = async () => {
    const res = await requestBrowserNotificationPermission();
    if (res === 'granted') {
      sendBrowserPushNotification('CourseTrack Notifications Active', {
        body: 'You will receive reminders before online classes, CATs, and assignment deadlines.',
      });
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 border-l border-slate-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/60">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Notifications & Alerts</h3>
              <p className="text-xs text-slate-500">
                {unreadCount > 0 ? `${unreadCount} unread alert${unreadCount > 1 ? 's' : ''}` : 'All caught up'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Close notifications panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Browser Permission & Sound Controls Strip */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Browser Push Notifications
            </span>
            {browserNotificationGranted ? (
              <span className="text-emerald-700 font-medium">Enabled</span>
            ) : (
              <button
                onClick={handleEnableBrowserNotifications}
                className="px-2.5 py-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-white border border-indigo-200 rounded-md shadow-xs transition-colors"
              >
                Enable Desktop Alerts
              </button>
            )}
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                if (!soundEnabled) playNotificationChime('reminder');
              }}
              className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900"
            >
              {soundEnabled ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Audio Chime Enabled</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-slate-400">Audio Chime Muted</span>
                </>
              )}
            </button>

            <button
              onClick={onSendTestNotification}
              className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-800"
              title="Test audio chime & browser alert"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Test Alert</span>
            </button>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="px-5 py-2.5 bg-white border-b border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Active Reminders</span>
          <div className="flex items-center gap-3">
            {unreadCount > 0 && (
              <button
                onClick={onMarkAllAsRead}
                className="hover:text-indigo-600 flex items-center gap-1 font-medium transition-colors"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark all read</span>
              </button>
            )}
            {notifications.length > 0 && (
              <button
                onClick={onClearAll}
                className="hover:text-rose-600 font-medium transition-colors"
              >
                Clear all
              </button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="text-center py-12 px-4">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                <Bell className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-slate-800">No active alerts</p>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto leading-relaxed">
                When assessments, online classes, CATs, or exams are scheduled or approaching deadlines, notifications will show here.
              </p>
              <button
                onClick={onSendTestNotification}
                className="mt-4 px-3 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
              >
                Send Test Alert
              </button>
            </div>
          ) : (
            notifications.map((notif) => {
              const isOnline = notif.deliveryMode === 'online';
              const isOffline = notif.deliveryMode === 'offline';

              return (
                <div
                  key={notif.id}
                  onClick={() => onMarkAsRead(notif.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    notif.read
                      ? 'bg-slate-50/50 border-slate-200/60 opacity-80'
                      : notif.type === 'urgent'
                      ? 'bg-rose-50/60 border-rose-200 shadow-xs'
                      : notif.type === 'warning'
                      ? 'bg-amber-50/60 border-amber-200 shadow-xs'
                      : 'bg-white border-slate-200 shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2.5">
                      <div className="mt-0.5 shrink-0">
                        {notif.type === 'urgent' ? (
                          <AlertTriangle className="w-4 h-4 text-rose-600" />
                        ) : notif.type === 'warning' ? (
                          <Clock className="w-4 h-4 text-amber-600" />
                        ) : (
                          <Info className="w-4 h-4 text-indigo-600" />
                        )}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs font-bold text-slate-900 leading-snug">
                            {notif.title}
                          </h4>
                          {!notif.read && (
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {notif.message}
                        </p>

                        {/* Online / Offline Indicator badge in notification */}
                        <div className="pt-1 flex items-center gap-2 text-[11px]">
                          {isOnline && (
                            <span className="inline-flex items-center gap-1 text-cyan-700 font-semibold">
                              <Video className="w-3 h-3 text-cyan-600" />
                              Online Class
                            </span>
                          )}
                          {isOffline && (
                            <span className="inline-flex items-center gap-1 text-amber-700 font-semibold">
                              <MapPin className="w-3 h-3 text-amber-600" />
                              Offline / In-person
                            </span>
                          )}
                          <span className="text-slate-400">·</span>
                          <span className="text-slate-400">
                            {new Date(notif.timestamp).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 text-[11px] text-slate-500 text-center">
          CourseTrack Pro monitors deadlines and sends alerts for scheduled sessions.
        </div>
      </div>
    </div>
  );
};
