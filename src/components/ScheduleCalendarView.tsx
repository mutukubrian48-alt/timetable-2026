import React, { useState } from 'react';
import { AssessmentItem, Course } from '../types';
import {
  Calendar as CalendarIcon,
  Video,
  MapPin,
  Clock,
  Download,
  User,
  CheckCircle2,
  Globe,
  ExternalLink,
} from 'lucide-react';
import { downloadICS, getGoogleCalendarUrl } from '../utils/calendar';

interface ScheduleCalendarViewProps {
  assessments: AssessmentItem[];
  courses: Course[];
  onToggleMode: (id: string) => void;
  onEditItem: (item: AssessmentItem) => void;
  onFinishClass?: (item: AssessmentItem) => void;
}

export const ScheduleCalendarView: React.FC<ScheduleCalendarViewProps> = ({
  assessments,
  courses,
  onToggleMode,
  onEditItem,
  onFinishClass,
}) => {
  const sortedAssessments = [...assessments].sort(
    (a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime()
  );

  const groupedByMonth: { [key: string]: AssessmentItem[] } = {};
  for (const item of sortedAssessments) {
    const d = new Date(item.scheduledDate);
    const monthKey = d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    if (!groupedByMonth[monthKey]) {
      groupedByMonth[monthKey] = [];
    }
    groupedByMonth[monthKey].push(item);
  }

  const [activeFilterMode, setActiveFilterMode] = useState<'all' | 'online' | 'offline'>('all');

  return (
    <div className="space-y-6">
      {/* Top Controls Bar */}
      <div className="bg-[#0b1329] rounded-2xl border border-blue-900/50 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div>
          <h2 className="text-base font-bold text-white">
            Master Coursework & Assessment Timeline
          </h2>
          <p className="text-xs text-slate-400">
            Chronological schedule of Assignment 1 & 2, CAT 1-3, and Main Exam with exact lesson start & end times and Portal links.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center p-1 bg-[#070c1a] border border-blue-950 rounded-xl text-xs">
            <button
              onClick={() => setActiveFilterMode('all')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                activeFilterMode === 'all' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveFilterMode('online')}
              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                activeFilterMode === 'online' ? 'bg-cyan-600 text-white shadow-sm' : 'text-cyan-400'
              }`}
            >
              <Video className="w-3 h-3" />
              <span>Online</span>
            </button>
            <button
              onClick={() => setActiveFilterMode('offline')}
              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                activeFilterMode === 'offline' ? 'bg-amber-600 text-white shadow-sm' : 'text-amber-400'
              }`}
            >
              <MapPin className="w-3 h-3" />
              <span>Physical</span>
            </button>
          </div>

          <button
            onClick={() => downloadICS(assessments, 'coursework-schedule.ics')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-blue-950/80 hover:bg-blue-900 border border-blue-800/60 rounded-xl transition-colors whitespace-nowrap shadow-sm"
            title="Download iCal file to import into Outlook, Google, or Apple Calendar"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export .ics</span>
          </button>
        </div>
      </div>

      {/* Schedule Timeline */}
      <div className="space-y-6">
        {Object.keys(groupedByMonth).length === 0 ? (
          <div className="bg-[#0b1329] rounded-2xl border border-blue-900/50 p-12 text-center">
            <CalendarIcon className="w-10 h-10 text-blue-400/40 mx-auto mb-2" />
            <p className="text-sm font-bold text-white">No scheduled sessions</p>
            <p className="text-xs text-slate-400 mt-1">Add a new assignment or CAT to populate the timetable.</p>
          </div>
        ) : (
          Object.entries(groupedByMonth).map(([month, monthItems]) => {
            const visibleMonthItems = monthItems.filter((i) => {
              if (activeFilterMode === 'online') return i.deliveryMode === 'online';
              if (activeFilterMode === 'offline') return i.deliveryMode === 'offline';
              return true;
            });

            if (visibleMonthItems.length === 0) return null;

            return (
              <div key={month} className="space-y-3">
                <div className="flex items-center gap-3">
                  <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
                    {month}
                  </h3>
                  <div className="h-px bg-blue-950 flex-1" />
                  <span className="text-xs text-slate-500 font-mono">
                    {visibleMonthItems.length} events
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {visibleMonthItems.map((item) => {
                    const isOnline = item.deliveryMode === 'online';
                    const scheduledD = new Date(item.scheduledDate);
                    const dueD = new Date(item.dueDate);

                    const startTime = scheduledD.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    const endTime = dueD.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                    return (
                      <div
                        key={item.id}
                        className={`bg-[#0b1329] rounded-2xl border p-5 space-y-3 shadow-lg transition-all flex flex-col justify-between ${
                          isOnline ? 'border-cyan-900/50' : 'border-amber-900/50'
                        }`}
                      >
                        <div className="space-y-2.5">
                          {/* Unit & Mode Badge */}
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-mono font-bold text-white bg-blue-950/70 px-2 py-0.5 rounded border border-blue-900/60">
                              {item.courseCode}
                            </span>

                            {isOnline ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-[11px] font-bold">
                                <Video className="w-3 h-3 text-cyan-400" />
                                ONLINE CLASS
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-amber-950/80 border border-amber-500/40 text-amber-300 text-[11px] font-bold">
                                <MapPin className="w-3 h-3 text-amber-400" />
                                PHYSICAL ROOM
                              </span>
                            )}
                          </div>

                          {/* Title */}
                          <div>
                            <h4 className="text-sm font-bold text-white leading-snug">
                              {item.title}
                            </h4>
                            <span className="text-xs text-blue-400 font-semibold mt-0.5 block">
                              Weight: {item.weightPercentage}% · Max {item.maxScore} pts
                            </span>
                          </div>

                          {/* EXACT TIME LESSON STARTS AND WHEN IT ENDS (Crucial requested feature!) */}
                          <div className="p-2.5 bg-[#060a16] rounded-xl border border-blue-950 flex items-center justify-between text-xs font-mono">
                            <div>
                              <span className="text-[10px] text-slate-500 block font-sans">Lesson Starts:</span>
                              <span className="font-extrabold text-cyan-400">{startTime}</span>
                            </div>
                            <span className="text-slate-600">&rarr;</span>
                            <div>
                              <span className="text-[10px] text-slate-500 block font-sans">When It Ends:</span>
                              <span className="font-extrabold text-indigo-300">{endTime}</span>
                            </div>
                          </div>

                          {/* Lecturer & Venue */}
                          <div className="p-2.5 bg-[#060a16] rounded-xl border border-blue-950 text-xs space-y-1">
                            <div className="flex items-center gap-1.5 text-slate-300">
                              <User className="w-3.5 h-3.5 text-indigo-400" />
                              <span className="text-slate-400">Lecturer:</span>
                              <span className="font-semibold text-white">{item.lecturerName || 'Dr. Evans Mutuku'}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-slate-300">
                              {isOnline ? (
                                <Video className="w-3.5 h-3.5 text-cyan-400" />
                              ) : (
                                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                              )}
                              <span className="text-slate-400">Venue/Room:</span>
                              <span className="font-semibold text-white truncate max-w-[170px]" title={item.physicalRoom || item.venueOrPlatform}>
                                {isOnline ? item.venueOrPlatform : item.physicalRoom || item.venueOrPlatform}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Action Row */}
                        <div className="pt-3 border-t border-blue-900/30 flex items-center justify-between text-xs">
                          {onFinishClass && (
                            <button
                              onClick={() => onFinishClass(item)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-600/80 hover:bg-emerald-500 text-white font-bold rounded-lg transition-colors text-[11px]"
                            >
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Finish</span>
                            </button>
                          )}

                          <div className="flex items-center gap-2">
                            {item.portalLink && (
                              <a
                                href={item.portalLink}
                                target="_blank"
                                rel="noreferrer"
                                className="text-cyan-400 hover:text-white flex items-center gap-1 text-[11px]"
                              >
                                <Globe className="w-3 h-3" />
                                <span>Portal</span>
                              </a>
                            )}
                            <a
                              href={getGoogleCalendarUrl(item)}
                              target="_blank"
                              rel="noreferrer"
                              className="text-blue-400 hover:text-white font-semibold"
                            >
                              + Cal
                            </a>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
