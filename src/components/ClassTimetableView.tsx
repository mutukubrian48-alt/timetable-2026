import React, { useState } from 'react';
import { ClassSession, Course } from '../types';
import {
  Calendar,
  Clock,
  Video,
  MapPin,
  User,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  ExternalLink,
  Globe,
} from 'lucide-react';

interface ClassTimetableViewProps {
  sessions: ClassSession[];
  courses: Course[];
  portalUrl: string;
  onAddSession: () => void;
  onEditSession: (session: ClassSession) => void;
  onDeleteSession: (id: string) => void;
  onFinishSession: (session: ClassSession) => void;
  onToggleSessionMode: (id: string) => void;
}

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const ClassTimetableView: React.FC<ClassTimetableViewProps> = ({
  sessions,
  courses,
  portalUrl,
  onAddSession,
  onEditSession,
  onDeleteSession,
  onFinishSession,
  onToggleSessionMode,
}) => {
  const [selectedDay, setSelectedDay] = useState<string>('All');
  const [modeFilter, setModeFilter] = useState<'all' | 'online' | 'offline'>('all');

  const filteredSessions = sessions.filter((s) => {
    if (selectedDay !== 'All' && s.dayOfWeek !== selectedDay) return false;
    if (modeFilter === 'online' && s.deliveryMode !== 'online') return false;
    if (modeFilter === 'offline' && s.deliveryMode !== 'offline') return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner & Action Controls */}
      <div className="bg-[#0b1329] border border-blue-900/40 rounded-2xl p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-500/10 text-cyan-400 border border-blue-500/20">
              WEEKLY TIMETABLE
            </span>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Class & Lecture Timetable
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Every session shows the unit, venue or room, lecturer name, exact time lesson starts and ends, and online vs physical status.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Online vs Physical Filter */}
          <div className="flex items-center p-1 bg-[#070c1a] border border-blue-950 rounded-xl text-xs">
            <button
              onClick={() => setModeFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                modeFilter === 'all'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Modes
            </button>
            <button
              onClick={() => setModeFilter('online')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                modeFilter === 'online'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-cyan-400 hover:text-cyan-200'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>Online</span>
            </button>
            <button
              onClick={() => setModeFilter('offline')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                modeFilter === 'offline'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-amber-400 hover:text-amber-200'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Physical</span>
            </button>
          </div>

          <button
            onClick={onAddSession}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 rounded-xl shadow-md transition-all whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Add Class to Timetable</span>
          </button>
        </div>
      </div>

      {/* Days of Week Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs">
        <button
          onClick={() => setSelectedDay('All')}
          className={`px-3.5 py-1.5 rounded-xl font-semibold transition-all whitespace-nowrap ${
            selectedDay === 'All'
              ? 'bg-blue-600 text-white shadow-sm border border-blue-500'
              : 'bg-[#0d162d] text-slate-300 hover:bg-[#131f3e] border border-blue-900/30'
          }`}
        >
          All Days ({sessions.length})
        </button>
        {DAYS_OF_WEEK.map((day) => {
          const count = sessions.filter((s) => s.dayOfWeek === day).length;
          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-3.5 py-1.5 rounded-xl font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                selectedDay === day
                  ? 'bg-blue-600 text-white shadow-sm border border-blue-500'
                  : 'bg-[#0d162d] text-slate-300 hover:bg-[#131f3e] border border-blue-900/30'
              }`}
            >
              <span>{day}</span>
              <span className="text-[10px] opacity-75 font-mono">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Timetable Cards Grid */}
      {filteredSessions.length === 0 ? (
        <div className="bg-[#0b1329] border border-blue-900/40 rounded-2xl p-12 text-center shadow-lg">
          <Calendar className="w-12 h-12 text-blue-500/40 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">No Classes Scheduled</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            No class matches the selected day or mode. Click "Add Class to Timetable" to schedule one.
          </p>
          <button
            onClick={onAddSession}
            className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-colors"
          >
            Add Class Session
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSessions.map((session) => {
            const isOnline = session.deliveryMode === 'online';

            return (
              <div
                key={session.id}
                className={`bg-[#0b1329] border rounded-2xl p-5 space-y-4 shadow-lg transition-all relative overflow-hidden flex flex-col justify-between hover:border-blue-500/60 ${
                  isOnline ? 'border-cyan-900/50' : 'border-amber-900/50'
                }`}
              >
                <div
                  className={`h-1 absolute top-0 left-0 right-0 ${
                    isOnline
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500'
                      : 'bg-gradient-to-r from-amber-500 to-orange-500'
                  }`}
                />

                <div className="space-y-3">
                  {/* Day of Week */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-blue-400 bg-blue-950/60 px-2.5 py-1 rounded-lg border border-blue-800/40">
                      {session.dayOfWeek}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-400 bg-blue-950/40 px-2 py-0.5 rounded">
                      {session.unitCode}
                    </span>
                  </div>

                  {/* Unit Title */}
                  <div>
                    <h3 className="text-base font-bold text-white leading-snug">
                      {session.unitName}
                    </h3>
                    {session.topic && (
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                        {session.topic}
                      </p>
                    )}
                  </div>

                  {/* TIME LESSON STARTS AND WHEN IT ENDS (Crucial requested feature!) */}
                  <div className="p-3 bg-[#060a16] rounded-xl border border-blue-950 flex items-center justify-between text-xs font-mono">
                    <div>
                      <span className="text-[10px] text-slate-500 block font-sans">Lesson Starts:</span>
                      <span className="font-bold text-cyan-400 text-sm">{session.startTime}</span>
                    </div>
                    <span className="text-slate-600">&rarr;</span>
                    <div>
                      <span className="text-[10px] text-slate-500 block font-sans">Lesson Ends:</span>
                      <span className="font-bold text-indigo-300 text-sm">{session.endTime}</span>
                    </div>
                  </div>

                  {/* Lecturer Name & Venue / Room */}
                  <div className="p-3 bg-[#070d1e] rounded-xl border border-blue-950 space-y-2">
                    <div className="flex items-center gap-2 text-xs">
                      <User className="w-4 h-4 text-indigo-400 shrink-0" />
                      <div>
                        <span className="text-[10px] text-slate-500 block font-medium">Lecturer Name:</span>
                        <span className="font-bold text-slate-200">{session.lecturerName}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs pt-1 border-t border-blue-950/60">
                      {isOnline ? (
                        <Video className="w-4 h-4 text-cyan-400 shrink-0" />
                      ) : (
                        <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                      )}
                      <div>
                        <span className="text-[10px] text-slate-500 block font-medium">Venue or Room:</span>
                        <span className="font-semibold text-slate-200">
                          {session.venueOrRoom}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Mode Indicator & Switcher */}
                  <div className="flex items-center justify-between gap-2 pt-1">
                    {isOnline ? (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-bold">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                        </span>
                        <Video className="w-3.5 h-3.5 text-cyan-400" />
                        <span>ONLINE CLASS</span>
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-950/80 border border-amber-500/40 text-amber-300 text-xs font-bold">
                        <span className="h-2 w-2 rounded-full bg-amber-400" />
                        <MapPin className="w-3.5 h-3.5 text-amber-400" />
                        <span>PHYSICAL ROOM</span>
                      </div>
                    )}

                    <button
                      onClick={() => onToggleSessionMode(session.id)}
                      className="text-xs text-blue-400 hover:text-blue-200 underline underline-offset-2 transition-colors"
                    >
                      Flip Mode
                    </button>
                  </div>
                </div>

                {/* Footer Controls: Finish Class, Edit, Delete, Portal */}
                <div className="pt-4 border-t border-blue-900/30 flex items-center justify-between gap-2 text-xs">
                  <button
                    onClick={() => onFinishSession(session)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600/90 hover:bg-emerald-500 text-white font-bold rounded-lg transition-all shadow-sm"
                    title="Finish class & auto-start countdown for the next class"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Finish Class</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <a
                      href={portalUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 text-cyan-400 hover:text-white hover:bg-blue-900/40 rounded-lg transition-colors"
                      title="Open Central E-learning Portal (All Units)"
                    >
                      <Globe className="w-4 h-4" />
                    </a>
                    {isOnline && session.meetingLink && (
                      <a
                        href={session.meetingLink}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 text-cyan-400 hover:text-cyan-200 hover:bg-cyan-950/50 rounded-lg transition-colors"
                        title="Join Online Class Link"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                    <button
                      onClick={() => onEditSession(session)}
                      className="p-2 text-slate-400 hover:text-white hover:bg-blue-900/40 rounded-lg transition-colors"
                      title="Edit class timetable entry"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteSession(session.id)}
                      className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition-colors"
                      title="Delete class"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
