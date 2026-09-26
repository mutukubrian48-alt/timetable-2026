import React, { useState } from 'react';
import { AssessmentItem } from '../types';
import {
  Video,
  MapPin,
  Calendar,
  Clock,
  ExternalLink,
  CalendarPlus,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Edit2,
  Trash2,
  CheckSquare,
  Square,
  User,
  Globe,
} from 'lucide-react';
import { getGoogleCalendarUrl } from '../utils/calendar';

interface CourseworkCardProps {
  item: AssessmentItem;
  portalUrl: string;
  onToggleMode: (id: string) => void;
  onStatusChange: (id: string, status: AssessmentItem['status']) => void;
  onScoreChange: (id: string, score: number | null) => void;
  onToggleChecklist: (itemId: string, checkId: string) => void;
  onEdit: (item: AssessmentItem) => void;
  onDelete: (id: string) => void;
  onFinishClass: (item: AssessmentItem) => void;
}

export const CourseworkCard: React.FC<CourseworkCardProps> = ({
  item,
  portalUrl,
  onToggleMode,
  onStatusChange,
  onScoreChange,
  onToggleChecklist,
  onEdit,
  onDelete,
  onFinishClass,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditingScore, setIsEditingScore] = useState(false);
  const [scoreInput, setScoreInput] = useState(item.achievedScore?.toString() || '');

  const isOnline = item.deliveryMode === 'online';

  const scheduledDate = new Date(item.scheduledDate);
  const dueDate = new Date(item.dueDate);

  const formattedScheduled = scheduledDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  
  // Lesson Start & End Times (Crucial requested feature!)
  const startTime = scheduledDate.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
  const endTime = dueDate.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  const now = new Date().getTime();
  const diffDays = Math.ceil((dueDate.getTime() - now) / (1000 * 60 * 60 * 24));
  const completedChecklistCount = item.checklist.filter((c) => c.completed).length;

  const handleScoreSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = scoreInput === '' ? null : parseFloat(scoreInput);
    if (parsed === null || (!isNaN(parsed) && parsed >= 0 && parsed <= item.maxScore)) {
      onScoreChange(item.id, parsed);
      setIsEditingScore(false);
    }
  };

  const getTypeDisplay = () => {
    switch (item.type) {
      case 'assignment_1':
        return 'Assignment 1';
      case 'assignment_2':
        return 'Assignment 2';
      case 'cat_1':
        return 'CAT 1 (Online Quiz)';
      case 'cat_2':
        return 'CAT 2 (Physical Paper)';
      case 'cat_3':
        return 'CAT 3 (Online Practical)';
      case 'main_exam':
        return 'Main Examination (Physical)';
      default:
        return 'Coursework';
    }
  };

  return (
    <div className="bg-[#0b1329] rounded-2xl border border-blue-900/50 shadow-lg hover:border-blue-700/60 transition-all overflow-hidden flex flex-col justify-between">
      {/* Top Accent Strip */}
      <div
        className={`h-1.5 w-full ${
          item.type === 'main_exam'
            ? 'bg-rose-500'
            : item.type === 'cat_1' || item.type === 'cat_3'
            ? 'bg-cyan-500' // Online CATs
            : item.type === 'cat_2'
            ? 'bg-amber-500' // Physical CAT 2
            : 'bg-indigo-500'
        }`}
      />

      <div className="p-5 space-y-4">
        {/* Header Metadata */}
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 font-medium">
              <span className="font-bold text-white font-mono bg-blue-950/70 px-2 py-0.5 rounded border border-blue-900/60">
                {item.courseCode}
              </span>
              <span aria-hidden="true">·</span>
              <span className="text-cyan-400 font-semibold">{getTypeDisplay()}</span>
              <span aria-hidden="true">·</span>
              <span>Weight {item.weightPercentage}%</span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums font-mono text-slate-300">Max {item.maxScore} pts</span>
            </div>

            <h3 className="text-base font-bold text-white leading-snug">
              {item.title}
            </h3>
          </div>

          {/* Status selector */}
          <div className="shrink-0 flex items-center gap-2">
            <select
              value={item.status}
              onChange={(e) => onStatusChange(item.id, e.target.value as AssessmentItem['status'])}
              className={`text-xs font-semibold rounded-lg px-2.5 py-1.5 border transition-colors cursor-pointer ${
                item.status === 'completed' || item.status === 'graded'
                  ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50'
                  : item.status === 'in_progress'
                  ? 'bg-blue-950/80 text-blue-300 border-blue-500/50'
                  : item.status === 'submitted'
                  ? 'bg-purple-950/80 text-purple-300 border-purple-500/50'
                  : 'bg-[#070c1a] text-slate-300 border-blue-950'
              }`}
            >
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="submitted">Submitted</option>
              <option value="completed">Completed</option>
              <option value="graded">Graded</option>
            </select>
          </div>
        </div>

        {/* The Unit & Lecturer details */}
        <div className="flex items-center gap-2 text-xs text-slate-300 p-2.5 bg-[#060a16] rounded-xl border border-blue-950/80">
          <User className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
          <span className="text-slate-400">Lecturer:</span>
          <span className="font-semibold text-white">{item.lecturerName || 'Dr. Evans Mutuku'}</span>
          <span className="text-slate-600">·</span>
          <span className="text-slate-400">{item.courseName}</span>
        </div>

        {/* TIME LESSON WILL START AND WHEN IT ENDS (Crucial requested feature!) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 py-2.5 px-3 bg-[#060a16] rounded-xl border border-blue-950 text-xs">
          {/* Lesson Start Time */}
          <div className="flex items-center gap-2 text-slate-300">
            <Clock className="w-4 h-4 text-cyan-400 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-500 block uppercase font-mono">Time lesson starts:</span>
              <span className="font-extrabold text-white text-sm font-mono">{startTime}</span>
              <span className="text-slate-400 ml-1.5 font-sans">({formattedScheduled})</span>
            </div>
          </div>

          {/* Lesson End Time */}
          <div className="flex items-center gap-2 text-slate-300">
            <Clock className="w-4 h-4 text-indigo-400 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-500 block uppercase font-mono">When it ends:</span>
              <span className="font-extrabold text-white text-sm font-mono">{endTime}</span>
              {item.status !== 'completed' && item.status !== 'graded' && (
                <span className={`ml-1.5 font-bold font-mono text-[11px] ${
                  diffDays < 0
                    ? 'text-rose-400'
                    : diffDays <= 2
                    ? 'text-amber-400'
                    : 'text-slate-400'
                }`}>
                  ({diffDays < 0 ? 'Overdue' : diffDays === 0 ? 'Today' : `${diffDays}d left`})
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ONLINE VS PHYSICAL ROOM INDICATOR & VENUE */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          <div className="flex items-center gap-2">
            {isOnline ? (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-bold">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                </span>
                <Video className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>ONLINE CLASS</span>
                <span className="text-cyan-500">·</span>
                <span className="font-normal text-cyan-200 max-w-[180px] truncate" title={item.venueOrPlatform}>
                  {item.venueOrPlatform}
                </span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-950/80 border border-amber-500/40 text-amber-300 text-xs font-bold">
                <span className="h-2 w-2 rounded-full bg-amber-400 shrink-0" />
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>PHYSICAL ROOM</span>
                <span className="text-amber-500">·</span>
                <span className="font-normal text-amber-200 max-w-[180px] truncate" title={item.physicalRoom || item.venueOrPlatform}>
                  {item.physicalRoom || item.venueOrPlatform}
                </span>
              </div>
            )}

            <button
              onClick={() => onToggleMode(item.id)}
              className="text-xs text-blue-400 hover:text-blue-200 underline underline-offset-2 transition-colors px-1"
            >
              Switch to {isOnline ? 'Physical' : 'Online'}
            </button>
          </div>

          {/* Central E-Learning Portal Access Link (One link for all units) */}
          <a
            href={portalUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-cyan-300 hover:text-white bg-blue-950/90 hover:bg-blue-900 border border-cyan-500/30 rounded-lg transition-colors"
            title="Open Central E-learning Portal to access all units"
          >
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span>eLearning Portal</span>
            <ExternalLink className="w-3 h-3 ml-0.5 opacity-80" />
          </a>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-300 leading-relaxed">
          {item.description}
        </p>

        {/* Score & Checklist Toggle */}
        <div className="pt-2 border-t border-blue-900/40 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Score display or editing */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium">Score:</span>
            {isEditingScore ? (
              <form onSubmit={handleScoreSubmit} className="flex items-center gap-1.5">
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  max={item.maxScore}
                  value={scoreInput}
                  onChange={(e) => setScoreInput(e.target.value)}
                  className="w-16 px-2 py-0.5 bg-[#070c1a] border border-blue-500 rounded text-xs font-mono font-bold text-white focus:outline-none"
                  autoFocus
                />
                <span className="text-slate-400">/ {item.maxScore}</span>
                <button
                  type="submit"
                  className="px-2 py-0.5 bg-blue-600 text-white rounded text-[11px] font-bold"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingScore(false)}
                  className="text-slate-400 hover:text-slate-200 text-[11px]"
                >
                  Cancel
                </button>
              </form>
            ) : (
              <button
                onClick={() => setIsEditingScore(true)}
                className="flex items-center gap-1 font-mono text-slate-200 hover:text-blue-400 transition-colors"
                title="Click to edit score"
              >
                <span className="font-bold text-white">
                  {item.achievedScore !== null && item.achievedScore !== undefined
                    ? item.achievedScore
                    : '—'}
                </span>
                <span className="text-slate-400 font-normal">/ {item.maxScore}</span>
                <Edit2 className="w-3 h-3 text-slate-400 ml-1" />
              </button>
            )}
          </div>

          {/* Checklist Counter */}
          {item.checklist.length > 0 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-1.5 text-slate-300 hover:text-blue-300 transition-colors"
            >
              <CheckSquare className="w-3.5 h-3.5 text-cyan-400" />
              <span>
                Preparation: {completedChecklistCount}/{item.checklist.length}
              </span>
              {isExpanded ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>
          )}

          {/* Action links */}
          <div className="flex items-center gap-1.5 ml-auto">
            <button
              onClick={() => onFinishClass(item)}
              className="px-2.5 py-1 text-[11px] font-bold bg-emerald-600/80 hover:bg-emerald-500 text-white rounded-lg transition-colors flex items-center gap-1"
              title="Finish session and start next countdown"
            >
              <CheckCircle2 className="w-3 h-3" />
              <span>Finish</span>
            </button>
            <a
              href={getGoogleCalendarUrl(item)}
              target="_blank"
              rel="noreferrer"
              className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-blue-900/30 rounded-lg transition-colors"
              title="Add to Google Calendar"
            >
              <CalendarPlus className="w-3.5 h-3.5" />
            </a>
            <button
              onClick={() => onEdit(item)}
              className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-blue-900/30 rounded-lg transition-colors"
              title="Edit assessment"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(item.id)}
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition-colors"
              title="Delete assessment"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Expandable Checklist & Syllabus Drawer */}
        {isExpanded && (
          <div className="pt-3 border-t border-blue-900/40 space-y-3 bg-[#060a16] p-3.5 rounded-xl">
            {item.checklist.length > 0 && (
              <div>
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block mb-2">
                  Preparation Tasks:
                </span>
                <div className="space-y-1.5">
                  {item.checklist.map((check) => (
                    <button
                      key={check.id}
                      onClick={() => onToggleChecklist(item.id, check.id)}
                      className="w-full flex items-center gap-2.5 text-xs text-left hover:text-blue-300 transition-colors"
                    >
                      {check.completed ? (
                        <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-500 shrink-0" />
                      )}
                      <span className={check.completed ? 'line-through text-slate-500' : 'text-slate-200'}>
                        {check.text}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {item.syllabusTopics.length > 0 && (
              <div className="pt-1">
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block mb-1">
                  Syllabus Modules:
                </span>
                <div className="flex flex-wrap gap-1.5 text-xs text-slate-300">
                  {item.syllabusTopics.map((topic, i) => (
                    <span key={i} className="text-slate-400">
                      • {topic}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
