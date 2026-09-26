import React, { useState } from 'react';
import { AssessmentItem, Course } from '../types';
import { Award, Calculator, TrendingUp, HelpCircle, CheckCircle } from 'lucide-react';

interface GradeCalculatorViewProps {
  assessments: AssessmentItem[];
  courses: Course[];
  onScoreChange: (id: string, score: number | null) => void;
}

export const GradeCalculatorView: React.FC<GradeCalculatorViewProps> = ({
  assessments,
  courses,
  onScoreChange,
}) => {
  const [selectedCourseId, setSelectedCourseId] = useState(courses[0]?.id || '');
  const [targetGrade, setTargetGrade] = useState<'A' | 'B' | 'C'>('A');

  const course = courses.find((c) => c.id === selectedCourseId) || courses[0];
  const courseItems = assessments.filter((a) => a.courseId === course.id);

  // Compute total weights and earned scores
  let totalGradedWeight = 0;
  let earnedPercentage = 0;
  let totalPotentialWeight = 0;

  for (const item of courseItems) {
    totalPotentialWeight += item.weightPercentage;
    if (item.achievedScore !== null && item.achievedScore !== undefined) {
      const percentageOnItem = (item.achievedScore / item.maxScore) * item.weightPercentage;
      earnedPercentage += percentageOnItem;
      totalGradedWeight += item.weightPercentage;
    }
  }

  // Target cutoffs
  const targetCutoff = targetGrade === 'A' ? 70 : targetGrade === 'B' ? 60 : 50;

  // Remaining weight to be decided
  const remainingWeight = 100 - totalGradedWeight;
  const pointsNeeded = targetCutoff - earnedPercentage;
  const requiredAverageOnRemaining =
    remainingWeight > 0 ? (pointsNeeded / remainingWeight) * 100 : null;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Coursework & Main Exam Grade Predictor
          </h2>
          <p className="text-xs text-slate-500">
            Simulate your continuous assessment (Assignments 1-2 & CATs 1-3) vs Main Examination weights.
          </p>
        </div>

        {/* Select Course */}
        <div className="flex items-center gap-2">
          <label htmlFor="grade-calc-course" className="text-xs font-semibold text-slate-600">Course:</label>
          <select
            id="grade-calc-course"
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none"
          >
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.code}: {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grade Metrics Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Metric 1 */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-1 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Graded Weight Completed</span>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {totalGradedWeight}% <span className="text-xs text-slate-400 font-normal">/ 100%</span>
          </div>
          <p className="text-[11px] text-slate-400">
            {remainingWeight}% remaining (CATs & Main Exam)
          </p>
        </div>

        {/* Metric 2 */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-1 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Current Points Secured</span>
          <div className="text-2xl font-bold text-emerald-600 font-mono tabular-nums">
            {earnedPercentage.toFixed(1)} <span className="text-xs text-slate-400 font-normal">/ 100</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Weighted contribution from entered marks
          </p>
        </div>

        {/* Metric 3 */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-1 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Target Grade Goal</span>
          <div className="flex items-center gap-2">
            {(['A', 'B', 'C'] as const).map((g) => (
              <button
                key={g}
                onClick={() => setTargetGrade(g)}
                className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                  targetGrade === g
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Grade {g} ({g === 'A' ? '70%+' : g === 'B' ? '60%+' : '50%+'})
              </button>
            ))}
          </div>
          <p className="text-[11px] text-slate-500 pt-1">
            {remainingWeight <= 0 ? (
              'All assessments graded'
            ) : requiredAverageOnRemaining !== null && requiredAverageOnRemaining <= 0 ? (
              <span className="text-emerald-600 font-semibold">Goal already secured! 🎉</span>
            ) : requiredAverageOnRemaining !== null && requiredAverageOnRemaining > 100 ? (
              <span className="text-rose-600 font-semibold">Mathematically unreachable</span>
            ) : (
              <span>
                Need <strong className="text-indigo-600 font-mono tabular-nums">{requiredAverageOnRemaining?.toFixed(1)}%</strong> on remaining assessments
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Assessment Breakdown Table with Inline Editable Scores */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            {course.code} Assessment Weighting & Score Sheet
          </h3>
          <span className="text-xs text-slate-500 font-medium">
            Enter marks below to recalculate required scores
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-600 bg-white">
                <th className="py-3 px-4">Component</th>
                <th className="py-3 px-4">Delivery Mode</th>
                <th className="py-3 px-4 text-right">Weight</th>
                <th className="py-3 px-4 text-center">Max Score</th>
                <th className="py-3 px-4 text-center">Your Score</th>
                <th className="py-3 px-4 text-right">Contribution</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {courseItems.map((item) => {
                const isOnline = item.deliveryMode === 'online';
                const hasScore = item.achievedScore !== null && item.achievedScore !== undefined;
                const contrib = hasScore
                  ? ((item.achievedScore! / item.maxScore) * item.weightPercentage).toFixed(1)
                  : '—';

                return (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{item.title}</div>
                      <div className="text-[11px] text-slate-500">
                        Scheduled: {new Date(item.scheduledDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 text-[11px] font-semibold ${isOnline ? 'text-cyan-700' : 'text-amber-700'}`}>
                        {isOnline ? '🌐 Online' : '📍 Offline'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-800 tabular-nums">
                      {item.weightPercentage}%
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono tabular-nums text-slate-600">
                      {item.maxScore}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="inline-flex items-center gap-1">
                        <input
                          type="number"
                          step="0.5"
                          min="0"
                          max={item.maxScore}
                          value={item.achievedScore !== null && item.achievedScore !== undefined ? item.achievedScore : ''}
                          onChange={(e) => {
                            const val = e.target.value === '' ? null : parseFloat(e.target.value);
                            onScoreChange(item.id, val);
                          }}
                          placeholder="—"
                          className="w-16 px-2 py-1 bg-slate-50 border border-slate-300 rounded text-center font-mono font-bold tabular-nums text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                        <span className="text-slate-400 text-[11px]">/ {item.maxScore}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold tabular-nums text-indigo-600">
                      {contrib !== '—' ? `${contrib}%` : '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-slate-50/80 font-bold border-t border-slate-200">
                <td colSpan={2} className="py-3 px-4 text-slate-900">
                  Total Coursework + Main Exam
                </td>
                <td className="py-3 px-4 text-right font-mono text-slate-900">
                  {courseItems.reduce((acc, i) => acc + i.weightPercentage, 0)}%
                </td>
                <td colSpan={2} className="py-3 px-4 text-right text-slate-500">
                  Total Earned:
                </td>
                <td className="py-3 px-4 text-right font-mono text-emerald-600">
                  {earnedPercentage.toFixed(1)}%
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};
