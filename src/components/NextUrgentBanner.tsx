import React, { useState, useEffect } from 'react';
import {
  Video,
  MapPin,
  ExternalLink,
  CalendarPlus,
  Clock,
  CheckCircle2,
  User,
  Sparkles,
  Globe,
  ArrowRight,
  Settings,
} from 'lucide-react';
import { UnifiedScheduleItem } from '../utils/scheduleHelper';
import { getGoogleCalendarUrl } from '../utils/calendar';

interface NextUrgentBannerProps {
  scheduleQueue: UnifiedScheduleItem[];
  portalUrl: string;
  onFinishItem: (item: UnifiedScheduleItem) => void;
  onOpenPortalModal: () => void;
  completedClassNotice?: { title: string; nextTitle: string } | null;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isOverdue: boolean;
  totalMs: number;
}

function calculateTimeLeft(targetDateStr: string): TimeLeft {
  const target = new Date(targetDateStr).getTime();
  const now = new Date().getTime();
  const diff = target - now;

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isOverdue: true, totalMs: diff };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return { days, hours, minutes, seconds, isOverdue: false, totalMs: diff };
}

export const NextUrgentBanner: React.FC<NextUrgentBannerProps> = ({
  scheduleQueue,
  portalUrl,
  onFinishItem,
  onOpenPortalModal,
  completedClassNotice,
}) => {
  const nextItem = scheduleQueue[0];
  const upcomingQueue = scheduleQueue.slice(1, 5);

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() =>
    nextItem
      ? calculateTimeLeft(nextItem.scheduledDate)
      : { days: 0, hours: 0, minutes: 0, seconds: 0, isOverdue: false, totalMs: 0 }
  );

  useEffect(() => {
    if (!nextItem) return;
    setTimeLeft(calculateTimeLeft(nextItem.scheduledDate));
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft(nextItem.scheduledDate));
    }, 1000);
    return () => clearInterval(interval);
  }, [nextItem?.scheduledDate]);

  if (!nextItem) {
    return (
      <div className="bg-[#0b1329] border border-emerald-500/40 rounded-2xl p-6 text-slate-100 mb-8 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">All Scheduled Classes & Coursework Completed!</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Every online and physical class in your timetable has been completed.
              </p>
            </div>
          </div>
          <a
            href={portalUrl}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-colors shadow-lg"
          >
            <Globe className="w-4 h-4" />
            <span>Open E-Learning Portal (All Units)</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    );
  }

  const isOnline = nextItem.deliveryMode === 'online';
  const scheduledDateObj = new Date(nextItem.scheduledDate);
  const formattedScheduled = scheduledDateObj.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="mb-8 space-y-3">
      {/* Finished Class Flash Notification */}
      {completedClassNotice && (
        <div className="bg-emerald-950/80 border border-emerald-500/50 rounded-2xl p-4 text-emerald-200 flex items-center justify-between shadow-lg animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-emerald-300">
                CLASS FINISHED: <span className="text-white">{completedClassNotice.title}</span>
              </p>
              <p className="text-[11px] text-emerald-200/80 mt-0.5">
                Next class auto-detected: <span className="font-semibold text-white">{completedClassNotice.nextTitle}</span>. Countdown started!
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-1 bg-emerald-900/60 rounded text-emerald-300">
            Auto Next Active
          </span>
        </div>
      )}

      {/* Main Countdown Hero Card */}
      <div
        className={`relative overflow-hidden rounded-2xl border transition-all shadow-2xl p-6 ${
          isOnline
            ? 'bg-gradient-to-br from-[#071329] via-[#0b1b3a] to-[#081226] border-cyan-500/40'
            : 'bg-gradient-to-br from-[#120f06] via-[#1a140a] to-[#0d0c0a] border-amber-500/40'
        }`}
      >
        {/* Ambient background glow */}
        <div
          className={`absolute -right-16 -top-16 w-72 h-72 rounded-full blur-3xl pointer-events-none opacity-20 ${
            isOnline ? 'bg-cyan-500' : 'bg-amber-500'
          }`}
        />

        <div className="relative z-10">
          {/* Header Row: Online vs Physical counted down together */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10">
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <Clock className="w-3.5 h-3.5 text-blue-400" />
                Next Up In Unified Timetable
              </span>

              {/* Mode Badge: Online Class or Physical Class */}
              {isOnline ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  <Video className="w-3.5 h-3.5 text-cyan-400" />
                  ONLINE CLASS
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-950/80 text-amber-300 border border-amber-500/40 shadow-sm">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  PHYSICAL CLASS (IN-PERSON)
                </span>
              )}

              <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-lg bg-blue-950/60 border border-blue-900/60 text-blue-300">
                {nextItem.typeLabel}
              </span>
            </div>

            {/* Quick Link to Master eLearning Portal */}
            <div className="flex items-center gap-2">
              <a
                href={portalUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md hover:shadow-cyan-500/20"
                title="Open one portal to access all units together"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>eLearning Portal (All Units)</span>
                <ExternalLink className="w-3 h-3 ml-0.5 opacity-80" />
              </a>
              <button
                onClick={onOpenPortalModal}
                className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors"
                title="Configure universal eLearning portal link"
              >
                <Settings className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Center Body: Class Details and Live Countdown Clock */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-5 items-center">
            {/* Left Column: Unit, Lecturer, Time, Room */}
            <div className="lg:col-span-7 space-y-3">
              <div>
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                  {nextItem.unitCode} · {nextItem.unitName}
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1 leading-snug">
                  {nextItem.title}
                </h2>
              </div>

              {/* Start Time, End Time & Venue */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                {/* Lesson Start & End Time */}
                <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-medium">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Lesson Scheduled Time:</span>
                  </div>
                  <div className="text-white font-mono font-bold text-sm">
                    {nextItem.startTimeDisplay} – {nextItem.endTimeDisplay}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {formattedScheduled} · {nextItem.durationMinutes} min session
                  </div>
                </div>

                {/* Venue / Room / Platform */}
                <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-medium">
                    {isOnline ? (
                      <Video className="w-3.5 h-3.5 text-cyan-400" />
                    ) : (
                      <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    )}
                    <span>{isOnline ? 'Online Access Venue:' : 'Campus Venue / Room:'}</span>
                  </div>
                  <div className="text-white font-semibold text-sm truncate">
                    {nextItem.venueOrRoom}
                  </div>
                  {nextItem.physicalRoom && (
                    <div className="text-[11px] text-amber-300 font-mono truncate">
                      Room: {nextItem.physicalRoom}
                    </div>
                  )}
                  {isOnline && (
                    <div className="text-[11px] text-cyan-300 truncate">
                      Central Portal & Online Meeting
                    </div>
                  )}
                </div>
              </div>

              {/* Lecturer Contact */}
              <div className="flex items-center gap-2 text-xs text-slate-300 pt-0.5">
                <div className="p-1.5 rounded-lg bg-white/5 border border-white/10">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <span>Lecturer: <strong className="text-white">{nextItem.lecturerName}</strong></span>
                {nextItem.lecturerEmail && (
                  <span className="text-slate-500 font-mono text-[11px]">({nextItem.lecturerEmail})</span>
                )}
              </div>
            </div>

            {/* Right Column: High-Visibility Countdown Timer */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center p-5 rounded-2xl bg-black/50 border border-white/10 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-3">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
                </span>
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-300">
                  Live Countdown to Start
                </span>
              </div>

              {/* Countdown Digits */}
              <div className="grid grid-cols-4 gap-2 text-center w-full max-w-sm">
                <div className="bg-[#070b14] border border-white/10 rounded-xl p-2.5">
                  <div className="text-2xl sm:text-3xl font-black font-mono text-white">
                    {String(timeLeft.days).padStart(2, '0')}
                  </div>
                  <div className="text-[10px] font-semibold text-slate-400 uppercase mt-0.5">Days</div>
                </div>
                <div className="bg-[#070b14] border border-white/10 rounded-xl p-2.5">
                  <div className="text-2xl sm:text-3xl font-black font-mono text-cyan-400">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </div>
                  <div className="text-[10px] font-semibold text-slate-400 uppercase mt-0.5">Hours</div>
                </div>
                <div className="bg-[#070b14] border border-white/10 rounded-xl p-2.5">
                  <div className="text-2xl sm:text-3xl font-black font-mono text-cyan-300">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </div>
                  <div className="text-[10px] font-semibold text-slate-400 uppercase mt-0.5">Mins</div>
                </div>
                <div className="bg-[#070b14] border border-white/10 rounded-xl p-2.5">
                  <div className="text-2xl sm:text-3xl font-black font-mono text-amber-400">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </div>
                  <div className="text-[10px] font-semibold text-slate-400 uppercase mt-0.5">Secs</div>
                </div>
              </div>

              {/* Finish Class & Switch to Next Button */}
              <div className="w-full mt-4 flex flex-col sm:flex-row gap-2">
                <button
                  onClick={() => onFinishItem(nextItem)}
                  className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-emerald-500/25"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Mark Class Finished & Start Next</span>
                </button>

                {isOnline && nextItem.meetingLink && (
                  <a
                    href={nextItem.meetingLink}
                    target="_blank"
                    rel="noreferrer"
                    className="py-2.5 px-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-lg"
                  >
                    <Video className="w-4 h-4" />
                    <span>Join Live Room</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Sequential Queue Bar: Showing Online and Physical classes counted down together */}
          {upcomingQueue.length > 0 && (
            <div className="mt-5 pt-4 border-t border-white/10">
              <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
                <span className="font-semibold text-slate-300 flex items-center gap-1">
                  <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
                  Continuous Class Sequence (Online & Physical Counted Together):
                </span>
                <span className="text-[10px] text-slate-400">
                  Auto-advances when each class finishes
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                {upcomingQueue.map((item, idx) => {
                  const isItemOnline = item.deliveryMode === 'online';
                  const itemDate = new Date(item.scheduledDate);
                  const dateStr = itemDate.toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' });
                  return (
                    <div
                      key={item.id}
                      className={`p-2.5 rounded-xl border text-xs flex flex-col justify-between transition-all ${
                        isItemOnline
                          ? 'bg-[#061226]/80 border-cyan-900/50 hover:border-cyan-500/50'
                          : 'bg-[#140e06]/80 border-amber-900/50 hover:border-amber-500/50'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="font-mono text-[10px] font-bold text-slate-400">
                          #{idx + 2} {item.unitCode}
                        </span>
                        {isItemOnline ? (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/60 flex items-center gap-1">
                            <Video className="w-2.5 h-2.5" /> Online
                          </span>
                        ) : (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800/60 flex items-center gap-1">
                            <MapPin className="w-2.5 h-2.5" /> Physical
                          </span>
                        )}
                      </div>
                      <div className="font-semibold text-white truncate text-[11px]" title={item.title}>
                        {item.title}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1 flex items-center justify-between">
                        <span>{dateStr}</span>
                        <span className="font-mono font-bold text-slate-300">{item.startTimeDisplay}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
