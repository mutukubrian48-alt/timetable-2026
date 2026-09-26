import React from 'react';
import { Search, Video, MapPin, Plus } from 'lucide-react';
import { Course, DeliveryMode, AssessmentType } from '../types';

interface CourseworkFilterBarProps {
  courses: Course[];
  selectedCourseId: string;
  setSelectedCourseId: (id: string) => void;
  selectedMode: 'all' | DeliveryMode;
  setSelectedMode: (mode: 'all' | DeliveryMode) => void;
  selectedType: 'all' | AssessmentType | 'assignments' | 'cats';
  setSelectedType: (type: 'all' | AssessmentType | 'assignments' | 'cats') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  totalCount: number;
  onlineCount: number;
  offlineCount: number;
  onOpenAddModal?: () => void;
}

export const CourseworkFilterBar: React.FC<CourseworkFilterBarProps> = ({
  courses,
  selectedCourseId,
  setSelectedCourseId,
  selectedMode,
  setSelectedMode,
  selectedType,
  setSelectedType,
  searchQuery,
  setSearchQuery,
  totalCount,
  onlineCount,
  offlineCount,
  onOpenAddModal,
}) => {
  return (
    <div className="bg-[#0b1329] rounded-2xl border border-blue-900/50 p-4 mb-6 shadow-xl space-y-3.5">
      {/* Search & Course Selector Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search unit, lecturer, CAT 1, room, or topic..."
            className="w-full pl-10 pr-4 py-2 bg-[#070c1a] border border-blue-900/60 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Unit Filter Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 whitespace-nowrap">Unit:</span>
            <select
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              className="bg-[#070c1a] border border-blue-900/60 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-cyan-400"
            >
              <option value="all">All Units ({courses.length})</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.code}: {course.name} ({course.lecturer})
                </option>
              ))}
            </select>
          </div>

          {/* Add Assessment CTA */}
          {onOpenAddModal && (
            <button
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-md transition-colors whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>Add Coursework</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs: Type & Mode */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-2 border-t border-blue-900/40">
        <div className="flex items-center gap-1 overflow-x-auto pb-1 lg:pb-0 text-xs">
          <button
            onClick={() => setSelectedType('all')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-colors whitespace-nowrap ${
              selectedType === 'all'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-blue-950/40'
            }`}
          >
            All Coursework
          </button>
          <button
            onClick={() => setSelectedType('assignments')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-colors whitespace-nowrap ${
              selectedType === 'assignments'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-blue-950/40'
            }`}
          >
            Assignments (1 & 2)
          </button>
          <button
            onClick={() => setSelectedType('cats')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-colors whitespace-nowrap ${
              selectedType === 'cats'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-blue-950/40'
            }`}
          >
            CATs (1 & 3 Online, 2 Physical)
          </button>
          <button
            onClick={() => setSelectedType('main_exam')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-colors whitespace-nowrap ${
              selectedType === 'main_exam'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-blue-950/40'
            }`}
          >
            Main Exam (Physical)
          </button>
        </div>

        {/* DELIVERY MODE (ONLINE OR PHYSICAL) */}
        <div className="flex items-center gap-1.5 p-1 bg-[#070c1a] border border-blue-950 rounded-xl text-xs">
          <span className="text-[10px] font-bold text-slate-400 px-2 uppercase tracking-wider">
            Mode:
          </span>
          <button
            onClick={() => setSelectedMode('all')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
              selectedMode === 'all'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All ({totalCount})
          </button>
          <button
            onClick={() => setSelectedMode('online')}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-semibold transition-all ${
              selectedMode === 'online'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-cyan-400 hover:text-cyan-200'
            }`}
          >
            <Video className="w-3 h-3" />
            <span>Online ({onlineCount})</span>
          </button>
          <button
            onClick={() => setSelectedMode('offline')}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-semibold transition-all ${
              selectedMode === 'offline'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-amber-400 hover:text-amber-200'
            }`}
          >
            <MapPin className="w-3 h-3" />
            <span>Physical ({offlineCount})</span>
          </button>
        </div>
      </div>
    </div>
  );
};
