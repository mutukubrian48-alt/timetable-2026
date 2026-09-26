import React, { useState, useEffect } from 'react';
import { AssessmentItem, AssessmentType, DeliveryMode, Course } from '../types';
import { X, Video, MapPin, Plus, Trash2, Calendar, Clock, User, Globe, ExternalLink } from 'lucide-react';

interface AssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Partial<AssessmentItem>) => void;
  courses: Course[];
  initialData?: AssessmentItem | null;
  defaultPortalUrl: string;
}

export const AssessmentModal: React.FC<AssessmentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  courses,
  initialData,
  defaultPortalUrl,
}) => {
  const [courseId, setCourseId] = useState(courses[0]?.id || '');
  const [type, setType] = useState<AssessmentType>('cat_1');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [lecturerName, setLecturerName] = useState(courses[0]?.lecturer || 'Dr. Evans Mutuku');
  const [scheduledDate, setScheduledDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [deliveryMode, setDeliveryMode] = useState<DeliveryMode>('online');
  const [venueOrPlatform, setVenueOrPlatform] = useState('');
  const [meetingLink, setMeetingLink] = useState('');
  const [physicalRoom, setPhysicalRoom] = useState('');
  const [portalLink, setPortalLink] = useState(defaultPortalUrl);
  const [weightPercentage, setWeightPercentage] = useState(10);
  const [maxScore, setMaxScore] = useState(30);
  const [achievedScore, setAchievedScore] = useState<number | null>(null);
  const [checklistTasks, setChecklistTasks] = useState<string[]>(['']);
  const [syllabusInput, setSyllabusInput] = useState('');

  useEffect(() => {
    if (initialData) {
      setCourseId(initialData.courseId);
      setType(initialData.type);
      setTitle(initialData.title);
      setDescription(initialData.description);
      setLecturerName(initialData.lecturerName || courses[0]?.lecturer || '');
      setScheduledDate(initialData.scheduledDate);
      setDueDate(initialData.dueDate);
      setDeliveryMode(initialData.deliveryMode);
      setVenueOrPlatform(initialData.venueOrPlatform);
      setMeetingLink(initialData.meetingLink || '');
      setPhysicalRoom(initialData.physicalRoom || '');
      setPortalLink(initialData.portalLink || defaultPortalUrl);
      setWeightPercentage(initialData.weightPercentage);
      setMaxScore(initialData.maxScore);
      setAchievedScore(initialData.achievedScore ?? null);
      setChecklistTasks(
        initialData.checklist.length > 0 ? initialData.checklist.map((c) => c.text) : ['']
      );
      setSyllabusInput(initialData.syllabusTopics.join(', '));
    } else {
      const now = new Date();
      const sched = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);
      sched.setHours(9, 0, 0, 0); // 09:00 AM
      const due = new Date(sched.getTime() + 2 * 60 * 60 * 1000); // 11:00 AM
      const formatDT = (d: Date) => d.toISOString().slice(0, 16);

      const defaultCourse = courses[0];
      setCourseId(defaultCourse?.id || '');
      // Enforce default rule: CAT 1 & 3 are online, CAT 2 is physical, Main Exam is physical
      setType('cat_1');
      setTitle('CAT 1: Continuous Assessment Test 1 (Online E-Learning Quiz)');
      setDescription('Continuous Assessment Test 1 conducted online on the E-learning portal.');
      setLecturerName(defaultCourse?.lecturer || 'Dr. Evans Mutuku');
      setScheduledDate(formatDT(sched));
      setDueDate(formatDT(due));
      setDeliveryMode('online'); // CAT 1 always online
      setVenueOrPlatform('E-Learning Portal');
      setMeetingLink('https://meet.google.com/cs302-live');
      setPhysicalRoom('Lecture Hall B4');
      setPortalLink(defaultPortalUrl);
      setWeightPercentage(10);
      setMaxScore(30);
      setAchievedScore(null);
      setChecklistTasks(['Login to E-learning Portal', 'Review practice quizzes']);
      setSyllabusInput('Module 1, Module 2');
    }
  }, [initialData, isOpen, courses, defaultPortalUrl]);

  /**
   * CRITICAL REQUIREMENT ENFORCEMENT:
   * "for cats cat 1 and 3 are always done online while cat 2 are physical then main exam physical"
   */
  const handleTypeSelect = (selectedType: AssessmentType) => {
    setType(selectedType);
    if (!initialData) {
      if (selectedType === 'assignment_1' || selectedType === 'assignment_2') {
        setTitle(selectedType === 'assignment_1' ? 'Assignment 1: Coursework Submission' : 'Assignment 2: Case Study & Project');
        setWeightPercentage(10);
        setMaxScore(30);
        setDeliveryMode('online');
        setVenueOrPlatform('E-Learning Portal');
      } else if (selectedType === 'cat_1') {
        // CAT 1: ALWAYS ONLINE
        setTitle('CAT 1: Continuous Assessment Test 1 (Online E-Learning Quiz)');
        setWeightPercentage(10);
        setMaxScore(30);
        setDeliveryMode('online'); // Enforced
        setVenueOrPlatform('E-Learning Portal (Online)');
      } else if (selectedType === 'cat_2') {
        // CAT 2: ALWAYS PHYSICAL
        setTitle('CAT 2: Continuous Assessment Test 2 (Physical Sit-In Exam)');
        setWeightPercentage(10);
        setMaxScore(30);
        setDeliveryMode('offline'); // Enforced
        setVenueOrPlatform('Lecture Hall B4 (Physical Room)');
        setPhysicalRoom('Lecture Hall B4');
      } else if (selectedType === 'cat_3') {
        // CAT 3: ALWAYS ONLINE
        setTitle('CAT 3: Continuous Assessment Test 3 (Online Practical Lab)');
        setWeightPercentage(10);
        setMaxScore(30);
        setDeliveryMode('online'); // Enforced
        setVenueOrPlatform('E-Learning Portal (Online Lab)');
      } else if (selectedType === 'main_exam') {
        // MAIN EXAM: ALWAYS PHYSICAL
        setTitle('Main Examination: Comprehensive Final Exam (Physical)');
        setWeightPercentage(50);
        setMaxScore(100);
        setDeliveryMode('offline'); // Enforced
        setVenueOrPlatform('University Great Hall (Physical Pavilion B)');
        setPhysicalRoom('University Great Hall, Pavilion B');
      }
    }
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const course = courses.find((c) => c.id === courseId) || courses[0];

    const cleanedChecklist = checklistTasks
      .filter((t) => t.trim().length > 0)
      .map((t, idx) => ({
        id: initialData?.checklist[idx]?.id || `chk-${Date.now()}-${idx}`,
        text: t.trim(),
        completed: initialData?.checklist[idx]?.completed ?? false,
      }));

    const cleanedSyllabus = syllabusInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    onSave({
      ...(initialData?.id ? { id: initialData.id } : {}),
      courseId: course.id,
      courseName: course.name,
      courseCode: course.code,
      lecturerName: lecturerName.trim() || course.lecturer,
      lecturerEmail: course.lecturerEmail,
      type,
      title: title.trim(),
      description: description.trim(),
      scheduledDate,
      dueDate,
      deliveryMode,
      venueOrPlatform: deliveryMode === 'online' ? (venueOrPlatform || 'E-Learning Portal') : (physicalRoom || venueOrPlatform || 'Lecture Hall B4'),
      meetingLink: deliveryMode === 'online' ? meetingLink : undefined,
      physicalRoom: deliveryMode === 'offline' ? physicalRoom : undefined,
      portalLink: portalLink.trim() || defaultPortalUrl,
      weightPercentage: Number(weightPercentage) || 10,
      maxScore: Number(maxScore) || 30,
      achievedScore: achievedScore !== null ? Number(achievedScore) : null,
      checklist: cleanedChecklist,
      syllabusTopics: cleanedSyllabus,
      status: initialData?.status || 'pending',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-[#03060f]/80 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="relative bg-[#0b1329] rounded-2xl max-w-2xl w-full shadow-2xl border border-blue-900/60 overflow-hidden z-10 my-8 text-slate-100">
        <div className="px-6 py-4 border-b border-blue-900/40 flex items-center justify-between bg-[#070d1e]">
          <div>
            <h3 className="text-base font-bold text-white">
              {initialData ? 'Edit Coursework Assessment' : 'Add Coursework Assessment'}
            </h3>
            <p className="text-xs text-slate-400">
              CAT 1 & 3 are Online, CAT 2 is Physical, Main Exam is Physical. With lesson start & end times and Portal link.
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white hover:bg-blue-900/40 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Assessment Type Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Select Assessment (Mode Preset Enforced):
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { type: 'assignment_1', label: 'Assignment 1', mode: 'Online' },
                { type: 'assignment_2', label: 'Assignment 2', mode: 'Online' },
                { type: 'cat_1', label: 'CAT 1', mode: '🌐 Online' },
                { type: 'cat_2', label: 'CAT 2', mode: '📍 Physical' },
                { type: 'cat_3', label: 'CAT 3', mode: '🌐 Online' },
                { type: 'main_exam', label: 'Main Exam', mode: '📍 Physical' },
              ].map((opt) => (
                <button
                  type="button"
                  key={opt.type}
                  onClick={() => handleTypeSelect(opt.type as AssessmentType)}
                  className={`p-2.5 rounded-xl text-xs font-bold border transition-all text-left flex flex-col justify-between ${
                    type === opt.type
                      ? 'bg-blue-600 text-white border-blue-500 shadow-md ring-1 ring-cyan-400/50'
                      : 'bg-[#070c1a] text-slate-300 border-blue-950 hover:border-blue-800'
                  }`}
                >
                  <span className="font-extrabold">{opt.label}</span>
                  <span className={`text-[10px] font-mono mt-1 ${type === opt.type ? 'text-cyan-200' : 'text-slate-400'}`}>
                    {opt.mode}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Unit & Lecturer Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Target Unit:</label>
              <select
                value={courseId}
                onChange={(e) => {
                  setCourseId(e.target.value);
                  const c = courses.find((x) => x.id === e.target.value);
                  if (c) setLecturerName(c.lecturer);
                }}
                className="w-full px-3 py-2 bg-[#070c1a] border border-blue-900/50 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
              >
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.code} - {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Lecturer Name:</label>
              <input
                type="text"
                required
                value={lecturerName}
                onChange={(e) => setLecturerName(e.target.value)}
                className="w-full px-3 py-2 bg-[#070c1a] border border-blue-900/50 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                placeholder="e.g. Dr. Evans Mutuku"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Assessment Title:</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-[#070c1a] border border-blue-900/50 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
              placeholder="e.g. CAT 1: Relational Algebra & Index Structures"
            />
          </div>

          {/* TIME LESSON WILL START AND WHEN IT ENDS (Crucial requested feature!) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-[#070d1e] rounded-xl border border-blue-900/40">
            <div>
              <label className="block text-xs font-bold text-cyan-300 mb-1 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                Time Lesson / Test Starts:
              </label>
              <input
                type="datetime-local"
                required
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="w-full px-3 py-2 bg-[#0b1329] border border-blue-900/60 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Start time for the live lecture or examination session.
              </span>
            </div>
            <div>
              <label className="block text-xs font-bold text-indigo-300 mb-1 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                When It Ends (Deadline / Finish Time):
              </label>
              <input
                type="datetime-local"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 bg-[#0b1329] border border-blue-900/60 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Exact time the session wraps up or submission closes.
              </span>
            </div>
          </div>

          {/* Delivery Mode (Online vs Physical Room) */}
          <div className="p-3.5 bg-[#070d1e] rounded-xl border border-blue-900/40 space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-white">Delivery Mode (Online vs Physical):</label>
              <span className="text-[10px] text-cyan-400 font-mono">
                {type === 'cat_1' || type === 'cat_3' ? 'CAT 1 & 3 are Online' : type === 'cat_2' || type === 'main_exam' ? 'CAT 2 & Main Exam are Physical' : 'Preset'}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDeliveryMode('online')}
                className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-bold transition-all ${
                  deliveryMode === 'online'
                    ? 'bg-cyan-950/80 border-cyan-500 text-cyan-300 ring-1 ring-cyan-500/50'
                    : 'bg-[#0b1329] border-blue-900/40 text-slate-400 hover:text-white'
                }`}
              >
                <Video className="w-4 h-4 text-cyan-400" />
                <span>ONLINE CLASS</span>
              </button>
              <button
                type="button"
                onClick={() => setDeliveryMode('offline')}
                className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-bold transition-all ${
                  deliveryMode === 'offline'
                    ? 'bg-amber-950/80 border-amber-500 text-amber-300 ring-1 ring-amber-500/50'
                    : 'bg-[#0b1329] border-blue-900/40 text-slate-400 hover:text-white'
                }`}
              >
                <MapPin className="w-4 h-4 text-amber-400" />
                <span>PHYSICAL ROOM</span>
              </button>
            </div>

            {deliveryMode === 'online' ? (
              <div className="space-y-1 pt-1">
                <label className="block text-[11px] font-semibold text-cyan-300">
                  Online Platform / Meeting Link (Venue):
                </label>
                <input
                  type="text"
                  value={meetingLink}
                  onChange={(e) => setMeetingLink(e.target.value)}
                  placeholder="https://meet.google.com/xyz or E-learning Portal quiz link"
                  className="w-full px-3 py-2 bg-[#0b1329] border border-cyan-900/60 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>
            ) : (
              <div className="space-y-1 pt-1">
                <label className="block text-[11px] font-semibold text-amber-300">
                  Campus Venue or Physical Room Number:
                </label>
                <input
                  type="text"
                  value={physicalRoom}
                  onChange={(e) => setPhysicalRoom(e.target.value)}
                  placeholder="e.g. Science Complex, Lecture Hall B4"
                  className="w-full px-3 py-2 bg-[#0b1329] border border-amber-900/60 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            )}
          </div>

          {/* E-LEARNING PORTAL LINK: One central link for all units as requested */}
          <div className="p-3.5 bg-[#070d1e] rounded-xl border border-blue-900/40 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 shrink-0">
                <Globe className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-white flex items-center gap-2">
                  <span>University E-Learning Portal</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 shrink-0">
                    One Link Accesses All Units
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 truncate max-w-sm mt-0.5 font-mono">
                  {portalLink || 'https://elearning.university.ac.ke'}
                </p>
              </div>
            </div>
            <a
              href={portalLink || 'https://elearning.university.ac.ke'}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-lg bg-blue-600/80 hover:bg-blue-600 text-white text-xs font-bold flex items-center gap-1 transition-colors shrink-0"
              title="Test connection to your universal portal"
            >
              <span>Test Portal</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Weight & Max Points */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Grade Weight (%):</label>
              <input
                type="number"
                min="1"
                max="100"
                value={weightPercentage}
                onChange={(e) => setWeightPercentage(Number(e.target.value))}
                className="w-full px-3 py-2 bg-[#070c1a] border border-blue-900/50 rounded-xl text-xs font-mono text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Max Score (Pts):</label>
              <input
                type="number"
                min="5"
                max="200"
                value={maxScore}
                onChange={(e) => setMaxScore(Number(e.target.value))}
                className="w-full px-3 py-2 bg-[#070c1a] border border-blue-900/50 rounded-xl text-xs font-mono text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Syllabus Topics Covered:</label>
            <input
              type="text"
              value={syllabusInput}
              onChange={(e) => setSyllabusInput(e.target.value)}
              placeholder="e.g. Relational Algebra, BCNF Normalization"
              className="w-full px-3 py-2 bg-[#070c1a] border border-blue-900/50 rounded-xl text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Instructions / Description:</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-[#070c1a] border border-blue-900/50 rounded-xl text-xs text-white"
              placeholder="Deliverables and guidance..."
            />
          </div>

          {/* Preparation Checklist */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-300">Preparation Tasks:</label>
              <button
                type="button"
                onClick={() => setChecklistTasks([...checklistTasks, ''])}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Step
              </button>
            </div>
            <div className="space-y-2">
              {checklistTasks.map((task, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={task}
                    onChange={(e) => {
                      const updated = [...checklistTasks];
                      updated[idx] = e.target.value;
                      setChecklistTasks(updated);
                    }}
                    placeholder={`Step ${idx + 1}`}
                    className="flex-1 px-3 py-1.5 bg-[#070c1a] border border-blue-900/50 rounded-xl text-xs text-white"
                  />
                  {checklistTasks.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setChecklistTasks(checklistTasks.filter((_, i) => i !== idx))}
                      className="p-1 text-slate-500 hover:text-rose-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-blue-900/40 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white bg-blue-950/40 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-md"
            >
              {initialData ? 'Save Changes' : 'Create Assessment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
