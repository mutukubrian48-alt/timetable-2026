import React, { useState, useEffect } from 'react';
import { ClassSession, Course, DeliveryMode } from '../types';
import { X, Video, MapPin, Globe, ExternalLink } from 'lucide-react';

interface ClassSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (session: Partial<ClassSession>) => void;
  courses: Course[];
  initialData?: ClassSession | null;
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const ClassSessionModal: React.FC<ClassSessionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  courses,
  initialData,
}) => {
  const [courseId, setCourseId] = useState(courses[0]?.id || '');
  const [unitCode, setUnitCode] = useState(courses[0]?.code || 'CS 302');
  const [unitName, setUnitName] = useState(courses[0]?.name || 'Database Systems');
  const [lecturerName, setLecturerName] = useState(courses[0]?.lecturer || 'Dr. Evans Mutuku');
  const [lecturerEmail, setLecturerEmail] = useState(courses[0]?.lecturerEmail || '');
  const [deliveryMode, setDeliveryMode] = useState<DeliveryMode>('online');
  const [venueOrRoom, setVenueOrRoom] = useState('E-Learning Portal');
  const [meetingLink, setMeetingLink] = useState('https://meet.google.com/cs302-live');
  const [physicalRoom, setPhysicalRoom] = useState('Lecture Hall B4');
  const [portalLink, setPortalLink] = useState(courses[0]?.portalUrl || 'https://elearning.university.ac.ke');
  const [dayOfWeek, setDayOfWeek] = useState('Monday');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('11:00');
  const [topic, setTopic] = useState('Database Normalization & Query Execution');

  useEffect(() => {
    if (initialData) {
      setCourseId(initialData.courseId);
      setUnitCode(initialData.unitCode);
      setUnitName(initialData.unitName);
      setLecturerName(initialData.lecturerName);
      setLecturerEmail(initialData.lecturerEmail || '');
      setDeliveryMode(initialData.deliveryMode);
      setVenueOrRoom(initialData.venueOrRoom);
      setMeetingLink(initialData.meetingLink || '');
      setPhysicalRoom(initialData.physicalRoom || '');
      setPortalLink(initialData.portalLink || 'https://elearning.university.ac.ke');
      setDayOfWeek(initialData.dayOfWeek);
      setStartTime(initialData.startTime);
      setEndTime(initialData.endTime);
      setTopic(initialData.topic || '');
    } else {
      const selected = courses[0];
      if (selected) {
        setCourseId(selected.id);
        setUnitCode(selected.code);
        setUnitName(selected.name);
        setLecturerName(selected.lecturer);
        setLecturerEmail(selected.lecturerEmail || '');
        setPortalLink(selected.portalUrl || 'https://elearning.university.ac.ke');
        setVenueOrRoom(selected.defaultMode === 'online' ? selected.onlinePlatform || 'E-Learning Portal' : selected.venueRoom || 'Lecture Hall B4');
      }
    }
  }, [initialData, isOpen, courses]);

  const handleCourseChange = (id: string) => {
    setCourseId(id);
    const c = courses.find((item) => item.id === id);
    if (c) {
      setUnitCode(c.code);
      setUnitName(c.name);
      setLecturerName(c.lecturer);
      setLecturerEmail(c.lecturerEmail || '');
      setDeliveryMode(c.defaultMode);
      setPortalLink(c.portalUrl || 'https://elearning.university.ac.ke');
      setVenueOrRoom(c.defaultMode === 'online' ? c.onlinePlatform || 'E-Learning Portal' : c.venueRoom || 'Lecture Hall B4');
    }
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const actualVenue = deliveryMode === 'online' 
      ? (venueOrRoom || meetingLink || 'E-Learning Portal')
      : (physicalRoom || venueOrRoom || 'Lecture Hall B4');

    onSave({
      ...(initialData?.id ? { id: initialData.id } : {}),
      courseId,
      unitCode: unitCode.trim(),
      unitName: unitName.trim(),
      lecturerName: lecturerName.trim(),
      lecturerEmail: lecturerEmail.trim(),
      deliveryMode,
      venueOrRoom: actualVenue,
      meetingLink: deliveryMode === 'online' ? meetingLink : undefined,
      physicalRoom: deliveryMode === 'offline' ? physicalRoom : undefined,
      portalLink: portalLink.trim(),
      dayOfWeek,
      startTime,
      endTime,
      topic: topic.trim(),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-[#03060f]/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative bg-[#0b1329] rounded-2xl max-w-xl w-full shadow-2xl border border-blue-900/60 overflow-hidden z-10 my-8 text-slate-100">
        <div className="px-6 py-4 border-b border-blue-900/40 flex items-center justify-between bg-[#070d1e]">
          <div>
            <h3 className="text-base font-bold text-white">
              {initialData ? 'Edit Class Timetable Entry' : 'Add New Class to Timetable'}
            </h3>
            <p className="text-xs text-slate-400">
              Set the Unit, Lecturer Name, Venue or Room, when lesson starts and ends, and Portal link.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-blue-900/40 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Select Unit:
            </label>
            <select
              value={courseId}
              onChange={(e) => handleCourseChange(e.target.value)}
              className="w-full px-3 py-2 bg-[#070c1a] border border-blue-900/50 rounded-xl text-xs font-medium text-white focus:outline-none focus:border-cyan-400"
            >
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code}: {c.name} (Lecturer: {c.lecturer})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Unit Code:
              </label>
              <input
                type="text"
                required
                value={unitCode}
                onChange={(e) => setUnitCode(e.target.value)}
                placeholder="e.g. CS 302"
                className="w-full px-3 py-2 bg-[#070c1a] border border-blue-900/50 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Unit Name:
              </label>
              <input
                type="text"
                required
                value={unitName}
                onChange={(e) => setUnitName(e.target.value)}
                placeholder="e.g. Database Systems & Architecture"
                className="w-full px-3 py-2 bg-[#070c1a] border border-blue-900/50 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Lecturer Name:
            </label>
            <input
              type="text"
              required
              value={lecturerName}
              onChange={(e) => setLecturerName(e.target.value)}
              placeholder="e.g. Dr. Evans Mutuku"
              className="w-full px-3 py-2 bg-[#070c1a] border border-blue-900/50 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* EXACT TIME LESSON WILL START AND WHEN IT ENDS (Crucial requested feature!) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-[#070d1e] rounded-xl border border-blue-900/40">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Day of Week:
              </label>
              <select
                value={dayOfWeek}
                onChange={(e) => setDayOfWeek(e.target.value)}
                className="w-full px-3 py-2 bg-[#070c1a] border border-blue-900/50 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400 font-medium"
              >
                {DAYS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-cyan-300 mb-1">
                Time Lesson Starts:
              </label>
              <input
                type="time"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2 bg-[#070c1a] border border-blue-900/50 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-indigo-300 mb-1">
                When It Ends:
              </label>
              <input
                type="time"
                required
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3 py-2 bg-[#070c1a] border border-blue-900/50 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          {/* DELIVERY MODE (ONLINE OR PHYSICAL) */}
          <div className="p-3.5 bg-[#070d1e] rounded-xl border border-blue-900/40 space-y-3">
            <label className="block text-xs font-bold text-white">
              Class Delivery Mode (Online vs Physical):
            </label>

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
                  placeholder="https://meet.google.com/xyz or E-learning Portal"
                  className="w-full px-3 py-2 bg-[#0b1329] border border-cyan-900/60 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>
            ) : (
              <div className="space-y-1 pt-1">
                <label className="block text-[11px] font-semibold text-amber-300">
                  The Venue or Room (Physical):
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

          {/* Universal E-Learning Portal: One link accesses all units */}
          <div className="p-3.5 bg-[#070d1e] rounded-xl border border-blue-900/40 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 shrink-0">
                <Globe className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-white flex items-center gap-2">
                  <span>University E-Learning Portal</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 shrink-0">
                    All Units One Portal
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

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Lesson Topic / Module Description:
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Lecture 5: Index Trees and B+ Query Optimization"
              className="w-full px-3 py-2 bg-[#070c1a] border border-blue-900/50 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
            />
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
              {initialData ? 'Save Changes' : 'Add Class'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
