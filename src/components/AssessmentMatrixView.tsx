import React from 'react';
import { AssessmentItem, Course } from '../types';
import { Video, MapPin, Edit2, CalendarPlus, ExternalLink, CheckCircle2, User, Globe, Clock } from 'lucide-react';
import { getGoogleCalendarUrl } from '../utils/calendar';

interface AssessmentMatrixViewProps {
  assessments: AssessmentItem[];
  courses: Course[];
  portalUrl: string;
  onToggleMode: (id: string) => void;
  onEditItem: (item: AssessmentItem) => void;
  onStatusChange: (id: string, status: AssessmentItem['status']) => void;
  onFinishClass: (item: AssessmentItem) => void;
}

export const AssessmentMatrixView: React.FC<AssessmentMatrixViewProps> = ({
  assessments,
  courses,
  portalUrl,
  onToggleMode,
  onEditItem,
  onStatusChange,
  onFinishClass,
}) => {
  return (
    <div className="space-y-6">
      {/* Notice on CAT & Exam rules */}
      <div className="bg-[#0b1329] border border-blue-900/40 rounded-2xl p-4 text-xs text-slate-300 flex flex-wrap items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-2">
          <span className="font-bold text-cyan-400">Institutional Policy Rule:</span>
          <span>
            <strong>CAT 1 & CAT 3</strong> are conducted <strong>Online</strong> via E-learning portal · <strong>CAT 2 & Main Exam</strong> are strictly <strong>Physical (Sit-In)</strong>.
          </span>
        </div>
        <a
          href={portalUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-950 hover:bg-blue-900 text-cyan-300 font-bold rounded-xl border border-blue-800 transition-colors"
        >
          <Globe className="w-3.5 h-3.5 text-cyan-400" />
          <span>Launch E-Learning Portal</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {courses.map((course) => {
        const courseAssessments = assessments.filter((a) => a.courseId === course.id);

        const coreItems = [
          { key: 'assignment_1', label: 'Assignment 1', rule: 'Online' },
          { key: 'assignment_2', label: 'Assignment 2', rule: 'Online' },
          { key: 'cat_1', label: 'CAT 1', rule: 'Online (Always)' },
          { key: 'cat_2', label: 'CAT 2', rule: 'Physical (Always)' },
          { key: 'cat_3', label: 'CAT 3', rule: 'Online (Always)' },
          { key: 'main_exam', label: 'Main Examination', rule: 'Physical (Always)' },
        ];

        return (
          <div
            key={course.id}
            className="bg-[#0b1329] rounded-2xl border border-blue-900/50 overflow-hidden shadow-xl"
          >
            {/* Course Header */}
            <div className="p-4 bg-[#070c1a] border-b border-blue-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/40">
                    {course.code}
                  </span>
                  <h3 className="text-base font-bold text-white">
                    {course.name}
                  </h3>
                </div>
                <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Lecturer: <strong className="text-slate-200">{course.lecturer}</strong></span>
                  <span className="text-slate-600">·</span>
                  <span>{course.credits} Credits</span>
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <span className="text-blue-300 font-semibold">Coursework: 50% · Main Exam: 50%</span>
                <a
                  href={course.portalUrl || portalUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1 text-cyan-300 hover:text-white bg-blue-950 border border-cyan-500/30 rounded-lg flex items-center gap-1 font-bold transition-colors"
                >
                  <Globe className="w-3 h-3" />
                  <span>Unit Portal</span>
                </a>
              </div>
            </div>

            {/* Matrix Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#080e22] border-b border-blue-900/40 text-slate-400 font-semibold">
                    <th className="py-3 px-4 min-w-[140px]">Assessment</th>
                    <th className="py-3 px-4 min-w-[190px]">Lesson Starts & Ends</th>
                    <th className="py-3 px-4 min-w-[210px]">Delivery Mode & Venue</th>
                    <th className="py-3 px-4 min-w-[120px]">E-Learning Portal</th>
                    <th className="py-3 px-3 text-right">Weight</th>
                    <th className="py-3 px-4 text-center">Score</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-950/60">
                  {coreItems.map(({ key, label, rule }) => {
                    const item = courseAssessments.find((a) => a.type === key);

                    if (!item) {
                      return (
                        <tr key={key} className="hover:bg-blue-950/20 transition-colors">
                          <td className="py-3 px-4 font-bold text-white">{label}</td>
                          <td colSpan={7} className="py-3 px-4 text-slate-500 italic">
                            Not yet scheduled ({rule})
                          </td>
                        </tr>
                      );
                    }

                    const isOnline = item.deliveryMode === 'online';
                    const sched = new Date(item.scheduledDate);
                    const due = new Date(item.dueDate);

                    const startTime = sched.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    const endTime = due.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                    return (
                      <tr key={item.id} className="hover:bg-blue-950/30 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-white">{label}</div>
                          <div className="text-[11px] text-slate-400 truncate max-w-[180px]" title={item.title}>
                            {item.title}
                          </div>
                        </td>

                        {/* Lesson Start and End Time (Crucial requested feature!) */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5 text-white font-mono font-bold text-[11px]">
                            <Clock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                            <span>{startTime} - {endTime}</span>
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            {sched.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                          </div>
                        </td>

                        {/* ONLINE VS PHYSICAL ROOM INDICATOR */}
                        <td className="py-3.5 px-4">
                          <div className="flex flex-col gap-1">
                            {isOnline ? (
                              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-[11px] font-bold w-fit">
                                <Video className="w-3 h-3 text-cyan-400" />
                                <span>ONLINE CLASS</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-950/80 border border-amber-500/40 text-amber-300 text-[11px] font-bold w-fit">
                                <MapPin className="w-3 h-3 text-amber-400" />
                                <span>PHYSICAL ROOM</span>
                              </span>
                            )}

                            <span className="text-[11px] text-slate-300 truncate max-w-[190px]" title={isOnline ? item.venueOrPlatform : item.physicalRoom || item.venueOrPlatform}>
                              {isOnline ? item.venueOrPlatform : item.physicalRoom || item.venueOrPlatform}
                            </span>
                          </div>
                        </td>

                        {/* Portal access column */}
                        <td className="py-3.5 px-4">
                          <a
                            href={item.portalLink || course.portalUrl || portalUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-cyan-300 hover:text-white font-semibold text-[11px] transition-colors"
                          >
                            <Globe className="w-3 h-3 text-cyan-400" />
                            <span>Open Portal</span>
                            <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                          </a>
                        </td>

                        <td className="py-3.5 px-3 text-right font-mono font-bold text-white tabular-nums">
                          {item.weightPercentage}%
                        </td>

                        <td className="py-3.5 px-4 text-center font-mono tabular-nums">
                          {item.achievedScore !== null && item.achievedScore !== undefined ? (
                            <span className="font-bold text-emerald-400">
                              {item.achievedScore} <span className="text-slate-400 font-normal">/ {item.maxScore}</span>
                            </span>
                          ) : (
                            <span className="text-slate-500">— / {item.maxScore}</span>
                          )}
                        </td>

                        <td className="py-3.5 px-4">
                          <select
                            value={item.status}
                            onChange={(e) => onStatusChange(item.id, e.target.value as AssessmentItem['status'])}
                            className="text-[11px] font-semibold rounded-lg px-2 py-1 bg-[#070c1a] border border-blue-900/60 text-slate-200"
                          >
                            <option value="pending">Pending</option>
                            <option value="in_progress">In Progress</option>
                            <option value="submitted">Submitted</option>
                            <option value="completed">Completed</option>
                            <option value="graded">Graded</option>
                          </select>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="inline-flex items-center gap-1">
                            <button
                              onClick={() => onFinishClass(item)}
                              className="px-2 py-1 bg-emerald-600/80 hover:bg-emerald-500 text-white rounded text-[11px] font-bold"
                              title="Finish Class & Start next countdown"
                            >
                              Finish
                            </button>
                            <a
                              href={getGoogleCalendarUrl(item)}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1 text-slate-400 hover:text-blue-400"
                              title="Add to Google Calendar"
                            >
                              <CalendarPlus className="w-3.5 h-3.5" />
                            </a>
                            <button
                              onClick={() => onEditItem(item)}
                              className="p-1 text-slate-400 hover:text-white"
                              title="Edit item"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
};
