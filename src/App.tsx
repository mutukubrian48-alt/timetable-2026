import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { AssessmentItem, Course, ClassSession, AppNotification, DeliveryMode, AssessmentType } from './types';
import { INITIAL_COURSES, INITIAL_ASSESSMENTS, INITIAL_TIMETABLE_CLASSES, DEFAULT_ELEARNING_PORTAL } from './data/initialData';
import { Navbar } from './components/Navbar';
import { NextUrgentBanner } from './components/NextUrgentBanner';
import { CourseworkFilterBar } from './components/CourseworkFilterBar';
import { CourseworkCard } from './components/CourseworkCard';
import { ClassTimetableView } from './components/ClassTimetableView';
import { ClassSessionModal } from './components/ClassSessionModal';
import { ScheduleCalendarView } from './components/ScheduleCalendarView';
import { AssessmentMatrixView } from './components/AssessmentMatrixView';
import { GradeCalculatorView } from './components/GradeCalculatorView';
import { AssessmentModal } from './components/AssessmentModal';
import { PortalModal } from './components/PortalModal';
import { NotificationDrawer } from './components/NotificationDrawer';
import { ToastContainer, ToastMessage } from './components/ToastContainer';
import {
  generateAutomatedNotifications,
  sendBrowserPushNotification,
} from './utils/notifications';
import { playNotificationChime } from './utils/sound';
import { getUnifiedSchedule, UnifiedScheduleItem } from './utils/scheduleHelper';
import { BookOpen, Globe } from 'lucide-react';

const STORAGE_KEY_ASSESSMENTS = 'coursetrack_assessments_v3';
const STORAGE_KEY_TIMETABLE = 'coursetrack_timetable_v3';
const STORAGE_KEY_COURSES = 'coursetrack_courses_v3';
const STORAGE_KEY_PORTAL = 'coursetrack_portal_url';
const STORAGE_KEY_SOUND = 'coursetrack_sound_enabled';

export default function App() {
  const [courses, setCourses] = useState<Course[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_COURSES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed loading courses from storage', e);
    }
    return INITIAL_COURSES;
  });

  const [assessments, setAssessments] = useState<AssessmentItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ASSESSMENTS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed loading assessments from storage', e);
    }
    return INITIAL_ASSESSMENTS;
  });

  const [classSessions, setClassSessions] = useState<ClassSession[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TIMETABLE);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed loading class sessions', e);
    }
    return INITIAL_TIMETABLE_CLASSES;
  });

  const [portalUrl, setPortalUrl] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PORTAL);
      if (saved) return saved;
    } catch {
      // ignore
    }
    return DEFAULT_ELEARNING_PORTAL;
  });

  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SOUND);
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  // Navigation tab
  const [activeTab, setActiveTab] = useState<'overview' | 'timetable' | 'schedule' | 'matrix' | 'grades'>('overview');

  // Filter state
  const [selectedCourseId, setSelectedCourseId] = useState<string>('all');
  const [selectedMode, setSelectedMode] = useState<'all' | DeliveryMode>('all');
  const [selectedType, setSelectedType] = useState<'all' | AssessmentType | 'assignments' | 'cats'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals & Panels
  const [isAssessmentModalOpen, setIsAssessmentModalOpen] = useState(false);
  const [editingAssessment, setEditingAssessment] = useState<AssessmentItem | null>(null);

  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [editingClassSession, setEditingClassSession] = useState<ClassSession | null>(null);

  const [isPortalModalOpen, setIsPortalModalOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  // Notifications & Notice of finished class
  const [notifications, setNotifications] = useState<AppNotification[]>(() =>
    generateAutomatedNotifications(assessments)
  );
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [completedClassNotice, setCompletedClassNotice] = useState<{ title: string; nextTitle: string } | null>(null);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ASSESSMENTS, JSON.stringify(assessments));
  }, [assessments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_TIMETABLE, JSON.stringify(classSessions));
  }, [classSessions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_COURSES, JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PORTAL, portalUrl);
  }, [portalUrl]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SOUND, JSON.stringify(soundEnabled));
  }, [soundEnabled]);

  const addToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Periodic alert check
  useEffect(() => {
    const checkAlerts = () => {
      setNotifications(generateAutomatedNotifications(assessments));
    };
    checkAlerts();
    const interval = setInterval(checkAlerts, 30000);
    return () => clearInterval(interval);
  }, [assessments]);

  // UNIFIED SCHEDULE QUEUE: Online & Physical classes counted down together!
  const scheduleQueue = useMemo(() => {
    return getUnifiedSchedule(assessments, classSessions, portalUrl);
  }, [assessments, classSessions, portalUrl]);

  // CRITICAL FEATURE: Finish Class & Auto Detect Next Class in Unified Stream
  const handleFinishUnifiedItem = (item: UnifiedScheduleItem) => {
    if (soundEnabled) {
      playNotificationChime('success');
    }

    let nextUpcoming: UnifiedScheduleItem | undefined;

    if (item.kind === 'assessment' && item.rawAssessment) {
      const updated = assessments.map((a) =>
        a.id === item.rawAssessment!.id ? { ...a, status: 'completed' as const, updatedAt: new Date().toISOString() } : a
      );
      setAssessments(updated);
      const newQueue = getUnifiedSchedule(updated, classSessions, portalUrl);
      nextUpcoming = newQueue.find((q) => q.id !== item.id && q.status !== 'completed');
    } else if (item.kind === 'class' && item.rawSession) {
      const updated = classSessions.map((s) =>
        s.id === item.rawSession!.id ? { ...s, completed: true } : s
      );
      setClassSessions(updated);
      const newQueue = getUnifiedSchedule(assessments, updated, portalUrl);
      nextUpcoming = newQueue.find((q) => q.id !== item.id && q.status !== 'completed');
    }

    if (nextUpcoming) {
      setCompletedClassNotice({
        title: item.title,
        nextTitle: `${nextUpcoming.unitCode}: ${nextUpcoming.title} (${nextUpcoming.deliveryMode === 'online' ? 'Online Class' : 'Physical Room'})`,
      });

      addToast({
        title: `Class Finished: ${item.unitCode}`,
        description: `Next up detected: ${nextUpcoming.unitCode} (${nextUpcoming.deliveryMode === 'online' ? 'Online' : 'Physical'}). Live countdown started!`,
        deliveryMode: nextUpcoming.deliveryMode,
        type: 'success',
      });

      sendBrowserPushNotification(`Next Class: ${nextUpcoming.title}`, {
        body: `Next up: ${nextUpcoming.unitCode} (${nextUpcoming.deliveryMode.toUpperCase()}) at ${nextUpcoming.startTimeDisplay}. Venue: ${nextUpcoming.venueOrRoom}.`,
      });
    } else {
      setCompletedClassNotice({
        title: item.title,
        nextTitle: 'All Scheduled Classes Finished! Congratulations!',
      });

      addToast({
        title: 'All Classes Finished!',
        description: 'You have completed all scheduled classes and coursework.',
        type: 'success',
      });
    }

    setTimeout(() => {
      setCompletedClassNotice(null);
    }, 10000);
  };

  const handleFinishClass = (item: AssessmentItem) => {
    const updated = assessments.map((a) =>
      a.id === item.id ? { ...a, status: 'completed' as const, updatedAt: new Date().toISOString() } : a
    );
    setAssessments(updated);

    if (soundEnabled) {
      playNotificationChime('success');
    }

    const newQueue = getUnifiedSchedule(updated, classSessions, portalUrl);
    const nextUpcoming = newQueue.find((q) => q.id !== `assessment-schedule-${item.id}` && q.status !== 'completed');

    if (nextUpcoming) {
      setCompletedClassNotice({
        title: item.title,
        nextTitle: `${nextUpcoming.unitCode}: ${nextUpcoming.title} (${nextUpcoming.deliveryMode === 'online' ? 'Online' : 'Physical'})`,
      });

      addToast({
        title: `Class Finished: ${item.title}`,
        description: `Next up detected: ${nextUpcoming.unitCode} (${nextUpcoming.deliveryMode === 'online' ? 'Online' : 'Physical'}). Live countdown started!`,
        deliveryMode: nextUpcoming.deliveryMode,
        type: 'success',
      });

      sendBrowserPushNotification(`Next Class: ${nextUpcoming.title}`, {
        body: `Next up: ${nextUpcoming.unitCode} (${nextUpcoming.deliveryMode.toUpperCase()}) at ${nextUpcoming.startTimeDisplay}. Venue: ${nextUpcoming.venueOrRoom}.`,
      });
    } else {
      setCompletedClassNotice({
        title: item.title,
        nextTitle: 'All Scheduled Classes Finished! Congratulations!',
      });

      addToast({
        title: 'All Classes Finished!',
        description: 'You have completed all scheduled classes and coursework.',
        type: 'success',
      });
    }

    setTimeout(() => {
      setCompletedClassNotice(null);
    }, 10000);
  };

  const handleToggleMode = (id: string) => {
    setAssessments((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextMode: DeliveryMode = item.deliveryMode === 'online' ? 'offline' : 'online';
          const venue =
            nextMode === 'online'
              ? item.meetingLink || 'E-Learning Portal & Google Meet'
              : item.physicalRoom || 'Lecture Hall B4';

          if (soundEnabled) playNotificationChime('reminder');

          addToast({
            title: `Mode Updated: ${nextMode.toUpperCase()}`,
            description: `${item.title} is now ${nextMode === 'online' ? 'Online Class' : 'Physical Room'} (${venue}).`,
            deliveryMode: nextMode,
            type: 'info',
          });

          return {
            ...item,
            deliveryMode: nextMode,
            venueOrPlatform: venue,
            updatedAt: new Date().toISOString(),
          };
        }
        return item;
      })
    );
  };

  const handleStatusChange = (id: string, status: AssessmentItem['status']) => {
    if (status === 'completed') {
      const target = assessments.find((a) => a.id === id);
      if (target) {
        handleFinishClass(target);
        return;
      }
    }
    setAssessments((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status, updatedAt: new Date().toISOString() } : item))
    );
  };

  const handleScoreChange = (id: string, score: number | null) => {
    setAssessments((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, achievedScore: score, status: score !== null ? 'graded' : item.status, updatedAt: new Date().toISOString() }
          : item
      )
    );
    if (soundEnabled && score !== null) playNotificationChime('success');
  };

  const handleToggleChecklist = (itemId: string, checkId: string) => {
    setAssessments((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const updated = item.checklist.map((c) =>
            c.id === checkId ? { ...c, completed: !c.completed } : c
          );
          return { ...item, checklist: updated };
        }
        return item;
      })
    );
  };

  const handleSaveAssessment = (data: Partial<AssessmentItem>) => {
    if (data.id) {
      setAssessments((prev) =>
        prev.map((item) => (item.id === data.id ? ({ ...item, ...data } as AssessmentItem) : item))
      );
      addToast({ title: 'Coursework Updated', description: `Modified ${data.title}.`, type: 'info' });
    } else {
      const newItem: AssessmentItem = {
        id: `assessment-${Date.now()}`,
        courseId: data.courseId || courses[0].id,
        courseName: data.courseName || courses[0].name,
        courseCode: data.courseCode || courses[0].code,
        lecturerName: data.lecturerName || courses[0].lecturer,
        lecturerEmail: data.lecturerEmail || courses[0].lecturerEmail,
        type: data.type || 'cat_1',
        title: data.title || 'New Coursework Assessment',
        description: data.description || '',
        scheduledDate: data.scheduledDate || new Date().toISOString(),
        dueDate: data.dueDate || new Date().toISOString(),
        durationMinutes: data.durationMinutes || 90,
        deliveryMode: data.deliveryMode || 'online',
        venueOrPlatform: data.venueOrPlatform || 'E-Learning Portal',
        meetingLink: data.meetingLink,
        physicalRoom: data.physicalRoom,
        portalLink: data.portalLink || portalUrl,
        weightPercentage: data.weightPercentage || 10,
        maxScore: data.maxScore || 30,
        achievedScore: data.achievedScore ?? null,
        status: data.status || 'pending',
        checklist: data.checklist || [],
        syllabusTopics: data.syllabusTopics || [],
        reminderMinutesBefore: [1440, 120],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setAssessments((prev) => [newItem, ...prev]);
      if (soundEnabled) playNotificationChime('success');
      addToast({
        title: 'New Assessment Created',
        description: `${newItem.title} scheduled.`,
        type: 'success',
        deliveryMode: newItem.deliveryMode,
      });
    }
  };

  const handleDeleteAssessment = (id: string) => {
    const item = assessments.find((a) => a.id === id);
    if (!item) return;
    if (window.confirm(`Delete "${item.title}"?`)) {
      setAssessments((prev) => prev.filter((a) => a.id !== id));
      addToast({ title: 'Assessment Deleted', description: `${item.title} removed.`, type: 'warning' });
    }
  };

  const handleSaveClassSession = (sessionData: Partial<ClassSession>) => {
    if (sessionData.id) {
      setClassSessions((prev) =>
        prev.map((s) => (s.id === sessionData.id ? ({ ...s, ...sessionData } as ClassSession) : s))
      );
      addToast({ title: 'Class Updated', description: `Saved timetable for ${sessionData.unitCode}.`, type: 'info' });
    } else {
      const newSession: ClassSession = {
        id: `session-${Date.now()}`,
        courseId: sessionData.courseId || courses[0].id,
        unitCode: sessionData.unitCode || courses[0].code,
        unitName: sessionData.unitName || courses[0].name,
        lecturerName: sessionData.lecturerName || courses[0].lecturer,
        lecturerEmail: sessionData.lecturerEmail || courses[0].lecturerEmail,
        deliveryMode: sessionData.deliveryMode || 'online',
        venueOrRoom: sessionData.venueOrRoom || 'Lecture Hall B4',
        physicalRoom: sessionData.physicalRoom,
        meetingLink: sessionData.meetingLink,
        portalLink: sessionData.portalLink || portalUrl,
        dayOfWeek: sessionData.dayOfWeek || 'Monday',
        startTime: sessionData.startTime || '09:00',
        endTime: sessionData.endTime || '11:00',
        topic: sessionData.topic || '',
        completed: false,
      };
      setClassSessions((prev) => [...prev, newSession]);
      if (soundEnabled) playNotificationChime('success');
      addToast({
        title: 'Class Added to Timetable',
        description: `${newSession.unitCode} (${newSession.dayOfWeek} ${newSession.startTime}) scheduled.`,
        type: 'success',
        deliveryMode: newSession.deliveryMode,
      });
    }
  };

  const handleDeleteClassSession = (id: string) => {
    const s = classSessions.find((x) => x.id === id);
    if (!s) return;
    if (window.confirm(`Delete class session "${s.unitCode}: ${s.unitName}"?`)) {
      setClassSessions((prev) => prev.filter((x) => x.id !== id));
      addToast({ title: 'Class Deleted', description: `${s.unitCode} removed from timetable.`, type: 'warning' });
    }
  };

  const handleFinishTimetableSession = (session: ClassSession) => {
    const targetAssessment = assessments.find((a) => a.courseCode === session.unitCode && a.status !== 'completed');
    if (targetAssessment) {
      handleFinishClass(targetAssessment);
    } else {
      if (soundEnabled) playNotificationChime('success');
      addToast({
        title: `Finished Class: ${session.unitCode}`,
        description: `Marked completed! Lecturer: ${session.lecturerName}. Detecting next session...`,
        type: 'success',
        deliveryMode: session.deliveryMode,
      });

      const nextSession = classSessions.find((s) => s.id !== session.id);
      if (nextSession) {
        setCompletedClassNotice({
          title: `${session.unitCode} (${session.venueOrRoom})`,
          nextTitle: `${nextSession.unitCode} with ${nextSession.lecturerName} at ${nextSession.venueOrRoom}`,
        });
      }
    }
  };

  const handleToggleSessionMode = (id: string) => {
    setClassSessions((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const nextMode: DeliveryMode = s.deliveryMode === 'online' ? 'offline' : 'online';
          const venue = nextMode === 'online' ? s.meetingLink || 'E-Learning Portal' : s.physicalRoom || 'Lecture Hall B4';
          return { ...s, deliveryMode: nextMode, venueOrRoom: venue };
        }
        return s;
      })
    );
    if (soundEnabled) playNotificationChime('reminder');
  };

  const handleSendTestNotification = () => {
    if (soundEnabled) playNotificationChime('alert');
    sendBrowserPushNotification('CAT 1 Reminder · CourseTrack Pro', {
      body: 'Your CAT 1 starts soon. Mode: ONLINE CLASS (E-Learning Portal).',
    });
    addToast({
      title: 'Alert Triggered: CAT 1 Starting Soon',
      description: 'Test notification fired! CAT 1 conducted Online via E-learning Portal.',
      deliveryMode: 'online',
      type: 'urgent',
    });
  };

  const filteredAssessments = useMemo(() => {
    return assessments.filter((item) => {
      if (selectedCourseId !== 'all' && item.courseId !== selectedCourseId) return false;
      if (selectedMode !== 'all' && item.deliveryMode !== selectedMode) return false;
      if (selectedType === 'assignments') {
        if (item.type !== 'assignment_1' && item.type !== 'assignment_2') return false;
      } else if (selectedType === 'cats') {
        if (!item.type.startsWith('cat')) return false;
      } else if (selectedType !== 'all') {
        if (item.type !== selectedType) return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchDesc = item.description.toLowerCase().includes(q);
        const matchCourse = item.courseName.toLowerCase().includes(q) || item.courseCode.toLowerCase().includes(q);
        const matchLecturer = (item.lecturerName || '').toLowerCase().includes(q);
        const matchVenue = item.venueOrPlatform.toLowerCase().includes(q) || (item.physicalRoom || '').toLowerCase().includes(q);
        if (!matchTitle && !matchDesc && !matchCourse && !matchLecturer && !matchVenue) return false;
      }
      return true;
    });
  }, [assessments, selectedCourseId, selectedMode, selectedType, searchQuery]);

  const onlineCount = assessments.filter((a) => a.deliveryMode === 'online').length;
  const offlineCount = assessments.filter((a) => a.deliveryMode === 'offline').length;

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
      {/* 3-Zone Top Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAddModal={() => {
          setEditingAssessment(null);
          setIsAssessmentModalOpen(true);
        }}
        onOpenAddClassModal={() => {
          setEditingClassSession(null);
          setIsClassModalOpen(true);
        }}
        onOpenPortalModal={() => setIsPortalModalOpen(true)}
        portalUrl={portalUrl}
        notifications={notifications}
        isNotificationOpen={isNotificationOpen}
        setIsNotificationOpen={setIsNotificationOpen}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Next Urgent Assessment & Live Countdown Banner: Online & Physical counted down together! */}
        <NextUrgentBanner
          scheduleQueue={scheduleQueue}
          portalUrl={portalUrl}
          onFinishItem={handleFinishUnifiedItem}
          onOpenPortalModal={() => setIsPortalModalOpen(true)}
          completedClassNotice={completedClassNotice}
        />

        {/* Tab 1: Coursework Overview Cards (Assignment 1-2, CAT 1-3, Main Exam) */}
        {activeTab === 'overview' && (
          <div>
            <CourseworkFilterBar
              courses={courses}
              selectedCourseId={selectedCourseId}
              setSelectedCourseId={setSelectedCourseId}
              selectedMode={selectedMode}
              setSelectedMode={setSelectedMode}
              selectedType={selectedType}
              setSelectedType={setSelectedType}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              totalCount={assessments.length}
              onlineCount={onlineCount}
              offlineCount={offlineCount}
              onOpenAddModal={() => {
                setEditingAssessment(null);
                setIsAssessmentModalOpen(true);
              }}
            />

            {filteredAssessments.length === 0 ? (
              <div className="bg-[#0b1329] rounded-2xl border border-blue-900/50 p-12 text-center shadow-xl">
                <BookOpen className="w-12 h-12 text-blue-500/40 mx-auto mb-3" />
                <h3 className="text-base font-bold text-white">No Coursework Found</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  No assessments match current filters. Click below to add a new assessment.
                </p>
                <button
                  onClick={() => {
                    setEditingAssessment(null);
                    setIsAssessmentModalOpen(true);
                  }}
                  className="mt-4 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-colors"
                >
                  + Add New Assessment
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filteredAssessments.map((item) => (
                  <CourseworkCard
                    key={item.id}
                    item={item}
                    portalUrl={portalUrl}
                    onToggleMode={handleToggleMode}
                    onStatusChange={handleStatusChange}
                    onScoreChange={handleScoreChange}
                    onToggleChecklist={handleToggleChecklist}
                    onEdit={(itemToEdit) => {
                      setEditingAssessment(itemToEdit);
                      setIsAssessmentModalOpen(true);
                    }}
                    onDelete={handleDeleteAssessment}
                    onFinishClass={handleFinishClass}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Class Timetable View */}
        {activeTab === 'timetable' && (
          <ClassTimetableView
            sessions={classSessions}
            courses={courses}
            portalUrl={portalUrl}
            onAddSession={() => {
              setEditingClassSession(null);
              setIsClassModalOpen(true);
            }}
            onEditSession={(session) => {
              setEditingClassSession(session);
              setIsClassModalOpen(true);
            }}
            onDeleteSession={handleDeleteClassSession}
            onFinishSession={handleFinishTimetableSession}
            onToggleSessionMode={handleToggleSessionMode}
          />
        )}

        {/* Tab 3: Master Schedule Timeline */}
        {activeTab === 'schedule' && (
          <ScheduleCalendarView
            assessments={assessments}
            courses={courses}
            onToggleMode={handleToggleMode}
            onEditItem={(item) => {
              setEditingAssessment(item);
              setIsAssessmentModalOpen(true);
            }}
            onFinishClass={handleFinishClass}
          />
        )}

        {/* Tab 4: Assessment Matrix View */}
        {activeTab === 'matrix' && (
          <AssessmentMatrixView
            assessments={assessments}
            courses={courses}
            portalUrl={portalUrl}
            onToggleMode={handleToggleMode}
            onEditItem={(item) => {
              setEditingAssessment(item);
              setIsAssessmentModalOpen(true);
            }}
            onStatusChange={handleStatusChange}
            onFinishClass={handleFinishClass}
          />
        )}

        {/* Tab 5: Grade Predictor View */}
        {activeTab === 'grades' && (
          <GradeCalculatorView
            assessments={assessments}
            courses={courses}
            onScoreChange={handleScoreChange}
          />
        )}
      </main>

      {/* Coursework Assessment Modal */}
      <AssessmentModal
        isOpen={isAssessmentModalOpen}
        onClose={() => {
          setIsAssessmentModalOpen(false);
          setEditingAssessment(null);
        }}
        onSave={handleSaveAssessment}
        courses={courses}
        initialData={editingAssessment}
        defaultPortalUrl={portalUrl}
      />

      {/* Class Timetable Modal */}
      <ClassSessionModal
        isOpen={isClassModalOpen}
        onClose={() => {
          setIsClassModalOpen(false);
          setEditingClassSession(null);
        }}
        onSave={handleSaveClassSession}
        courses={courses}
        initialData={editingClassSession}
      />

      {/* E-Learning Portal Link Modal */}
      <PortalModal
        isOpen={isPortalModalOpen}
        onClose={() => setIsPortalModalOpen(false)}
        portalUrl={portalUrl}
        onSavePortalUrl={(url) => setPortalUrl(url)}
      />

      {/* Notification Drawer */}
      <NotificationDrawer
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        notifications={notifications}
        onMarkAsRead={(id) => setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))}
        onMarkAllAsRead={() => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))}
        onClearAll={() => setNotifications([])}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        onSendTestNotification={handleSendTestNotification}
      />

      {/* In-app Toast Messages */}
      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />
    </div>
  );
}
