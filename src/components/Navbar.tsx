import React from 'react';
import {
  Bell,
  Plus,
  Calendar,
  BookOpen,
  Award,
  SlidersHorizontal,
  Volume2,
  VolumeX,
  Clock,
  Globe,
  ExternalLink,
} from 'lucide-react';
import { AppNotification } from '../types';

interface NavbarProps {
  activeTab: 'overview' | 'timetable' | 'schedule' | 'matrix' | 'grades';
  setActiveTab: (tab: 'overview' | 'timetable' | 'schedule' | 'matrix' | 'grades') => void;
  onOpenAddModal: () => void;
  onOpenAddClassModal: () => void;
  onOpenPortalModal: () => void;
  portalUrl: string;
  notifications: AppNotification[];
  isNotificationOpen: boolean;
  setIsNotificationOpen: (open: boolean) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenAddModal,
  onOpenAddClassModal,
  onOpenPortalModal,
  portalUrl,
  notifications,
  isNotificationOpen,
  setIsNotificationOpen,
  soundEnabled,
  setSoundEnabled,
}) => {
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-40 bg-[#070c1a]/95 backdrop-blur-md border-b border-blue-950/80 shadow-lg transition-shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 text-white flex items-center justify-center font-extrabold text-base shadow-md border border-blue-400/30">
              C
            </div>
            <div>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab('overview');
                }}
                className="text-base font-extrabold tracking-tight text-white flex items-center gap-2"
              >
                <span>CourseTrack Pro</span>
              </a>
              <span className="text-[10px] text-blue-400 font-mono block -mt-1">
                Coursework · CATs · Timetable
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2 text-xs font-semibold text-slate-300">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all ${
                activeTab === 'overview'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'hover:text-white hover:bg-blue-950/50'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Coursework</span>
            </button>

            <button
              onClick={() => setActiveTab('timetable')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all ${
                activeTab === 'timetable'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'hover:text-white hover:bg-blue-950/50'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Class Timetable</span>
            </button>

            <button
              onClick={() => setActiveTab('schedule')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all ${
                activeTab === 'schedule'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'hover:text-white hover:bg-blue-950/50'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Schedule</span>
            </button>

            <button
              onClick={() => setActiveTab('matrix')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all ${
                activeTab === 'matrix'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'hover:text-white hover:bg-blue-950/50'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>CAT Matrix</span>
            </button>

            <button
              onClick={() => setActiveTab('grades')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all ${
                activeTab === 'grades'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'hover:text-white hover:bg-blue-950/50'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Grade Predictor</span>
            </button>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-2">
            {/* E-LEARNING PORTAL QUICK ACCESS BUTTON (Crucial requested feature!) */}
            <div className="flex items-center bg-[#0d162d] border border-blue-900/60 rounded-xl p-0.5">
              <a
                href={portalUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold text-cyan-300 hover:text-white hover:bg-blue-900/50 rounded-lg transition-colors"
                title="Open connected University E-learning Portal in new tab"
              >
                <Globe className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">My E-Learning</span>
                <span className="sm:hidden">Portal</span>
                <ExternalLink className="w-3 h-3 text-cyan-400/80" />
              </a>
              <button
                onClick={onOpenPortalModal}
                className="px-1.5 py-1.5 text-slate-400 hover:text-white hover:bg-blue-900/50 rounded-lg transition-colors text-[11px]"
                title="Change or link your E-Learning portal URL"
              >
                ⚙️
              </button>
            </div>

            {/* Sound toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? 'Mute notification sound' : 'Unmute notification sound'}
              aria-label={soundEnabled ? 'Sound enabled' : 'Sound muted'}
              className="p-2 text-slate-400 hover:text-white hover:bg-blue-950/60 rounded-xl transition-colors"
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-cyan-400" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-500" />
              )}
            </button>

            {/* Notification bell */}
            <div className="relative">
              <button
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className="relative p-2 text-slate-400 hover:text-white hover:bg-blue-950/60 rounded-xl transition-colors"
                title="Notifications & Reminders"
                aria-label="Open notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>
            </div>

            {/* Add Coursework CTA */}
            <button
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 rounded-xl shadow-md transition-colors whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>+ Assessment</span>
            </button>
          </div>
        </div>

        {/* Mobile secondary navigation strip */}
        <div className="flex md:hidden items-center justify-between border-t border-blue-950 py-2 text-xs overflow-x-auto gap-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`whitespace-nowrap px-2.5 py-1 rounded-lg font-medium ${
              activeTab === 'overview' ? 'bg-blue-600 text-white' : 'text-slate-400'
            }`}
          >
            Coursework
          </button>
          <button
            onClick={() => setActiveTab('timetable')}
            className={`whitespace-nowrap px-2.5 py-1 rounded-lg font-medium ${
              activeTab === 'timetable' ? 'bg-blue-600 text-white' : 'text-slate-400'
            }`}
          >
            Timetable
          </button>
          <button
            onClick={() => setActiveTab('schedule')}
            className={`whitespace-nowrap px-2.5 py-1 rounded-lg font-medium ${
              activeTab === 'schedule' ? 'bg-blue-600 text-white' : 'text-slate-400'
            }`}
          >
            Schedule
          </button>
          <button
            onClick={() => setActiveTab('matrix')}
            className={`whitespace-nowrap px-2.5 py-1 rounded-lg font-medium ${
              activeTab === 'matrix' ? 'bg-blue-600 text-white' : 'text-slate-400'
            }`}
          >
            CAT Matrix
          </button>
          <button
            onClick={() => setActiveTab('grades')}
            className={`whitespace-nowrap px-2.5 py-1 rounded-lg font-medium ${
              activeTab === 'grades' ? 'bg-blue-600 text-white' : 'text-slate-400'
            }`}
          >
            Grades
          </button>
        </div>
      </div>
    </header>
  );
};
