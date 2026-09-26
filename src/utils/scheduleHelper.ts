import { AssessmentItem, ClassSession, DeliveryMode, AssessmentType } from '../types';

export type ScheduleItemKind = 'class' | 'assessment';

export interface UnifiedScheduleItem {
  id: string;
  kind: ScheduleItemKind;
  unitCode: string;
  unitName: string;
  title: string;
  description?: string;
  lecturerName: string;
  lecturerEmail?: string;
  deliveryMode: DeliveryMode; // 'online' or 'offline' (physical)
  venueOrRoom: string;
  physicalRoom?: string;
  meetingLink?: string;
  portalLink?: string;
  scheduledDate: string; // ISO string of start
  endDate: string;       // ISO string of end
  startTimeDisplay: string;
  endTimeDisplay: string;
  durationMinutes: number;
  status: 'pending' | 'in_progress' | 'completed';
  typeLabel: string;
  assessmentType?: AssessmentType;
  dayOfWeek?: string;
  rawAssessment?: AssessmentItem;
  rawSession?: ClassSession;
}

const DAY_MAP: Record<string, number> = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
};

export function getNextSessionOccurrence(
  dayOfWeek: string,
  startTime: string,
  endTime: string,
  referenceDate: Date = new Date(),
  isCompletedToday: boolean = false
): { start: Date; end: Date } {
  const targetDay = DAY_MAP[dayOfWeek.toLowerCase().trim()] ?? 1;
  const currentDay = referenceDate.getDay();

  const [startH, startM] = (startTime || '08:00').split(':').map((v) => parseInt(v, 10) || 0);
  const [endH, endM] = (endTime || '10:00').split(':').map((v) => parseInt(v, 10) || 0);

  let daysAhead = (targetDay - currentDay + 7) % 7;

  // Check if session is today
  if (daysAhead === 0) {
    const sessionEndDate = new Date(referenceDate);
    sessionEndDate.setHours(endH, endM, 0, 0);

    // If it was marked completed today, or session already ended today, push to next week
    if (isCompletedToday || referenceDate.getTime() > sessionEndDate.getTime()) {
      daysAhead = 7;
    }
  }

  const startDate = new Date(referenceDate);
  startDate.setDate(referenceDate.getDate() + daysAhead);
  startDate.setHours(startH, startM, 0, 0);

  const endDate = new Date(referenceDate);
  endDate.setDate(referenceDate.getDate() + daysAhead);
  endDate.setHours(endH, endM, 0, 0);

  return { start: startDate, end: endDate };
}

export function formatTimeDisplay(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function getUnifiedSchedule(
  assessments: AssessmentItem[],
  classSessions: ClassSession[],
  portalUrl: string,
  referenceDate: Date = new Date()
): UnifiedScheduleItem[] {
  const unified: UnifiedScheduleItem[] = [];

  // 1. Process Timetable Class Sessions (Both Online and Physical)
  for (const session of classSessions) {
    const { start, end } = getNextSessionOccurrence(
      session.dayOfWeek,
      session.startTime,
      session.endTime,
      referenceDate,
      Boolean(session.completed)
    );

    const isOnline = session.deliveryMode === 'online';
    const typeLabel = isOnline ? 'Online Class' : 'Physical Class';
    const duration = Math.max(30, Math.round((end.getTime() - start.getTime()) / (1000 * 60)));

    unified.push({
      id: `session-schedule-${session.id}`,
      kind: 'class',
      unitCode: session.unitCode,
      unitName: session.unitName,
      title: `${session.unitCode}: ${session.topic || (isOnline ? 'Online Lecture' : 'Physical Lecture')}`,
      description: session.topic || `${session.unitName} (${typeLabel})`,
      lecturerName: session.lecturerName,
      lecturerEmail: session.lecturerEmail,
      deliveryMode: session.deliveryMode,
      venueOrRoom: session.venueOrRoom || (isOnline ? 'Central E-Learning Portal' : 'Lecture Room'),
      physicalRoom: session.physicalRoom,
      meetingLink: session.meetingLink,
      portalLink: portalUrl,
      scheduledDate: start.toISOString(),
      endDate: end.toISOString(),
      startTimeDisplay: formatTimeDisplay(start),
      endTimeDisplay: formatTimeDisplay(end),
      durationMinutes: duration,
      status: session.completed ? 'completed' : 'pending',
      typeLabel,
      dayOfWeek: session.dayOfWeek,
      rawSession: session,
    });
  }

  // 2. Process Coursework Assessments (Assignments, CAT 1-3, Main Exam)
  for (const item of assessments) {
    if (item.status === 'completed' || item.status === 'graded') {
      continue;
    }

    const start = new Date(item.scheduledDate);
    const end = new Date(item.dueDate);
    const isOnline = item.deliveryMode === 'online';

    let typeLabel = isOnline ? 'Online Assessment' : 'Physical Assessment';
    if (item.type === 'cat_1') typeLabel = 'CAT 1 · Online Test';
    else if (item.type === 'cat_2') typeLabel = 'CAT 2 · Physical Test';
    else if (item.type === 'cat_3') typeLabel = 'CAT 3 · Online Test';
    else if (item.type === 'main_exam') typeLabel = 'Main Exam · Physical Hall';
    else if (item.type === 'assignment_1') typeLabel = 'Assignment 1';
    else if (item.type === 'assignment_2') typeLabel = 'Assignment 2';

    const duration = item.durationMinutes || Math.max(60, Math.round((end.getTime() - start.getTime()) / (1000 * 60)));

    unified.push({
      id: `assessment-schedule-${item.id}`,
      kind: 'assessment',
      unitCode: item.courseCode,
      unitName: item.courseName,
      title: item.title,
      description: item.description,
      lecturerName: item.lecturerName || 'Faculty Lecturer',
      lecturerEmail: item.lecturerEmail,
      deliveryMode: item.deliveryMode,
      venueOrRoom: item.venueOrPlatform,
      physicalRoom: item.physicalRoom,
      meetingLink: item.meetingLink,
      portalLink: portalUrl,
      scheduledDate: start.toISOString(),
      endDate: end.toISOString(),
      startTimeDisplay: formatTimeDisplay(start),
      endTimeDisplay: formatTimeDisplay(end),
      durationMinutes: duration,
      status: item.status === 'in_progress' ? 'in_progress' : 'pending',
      typeLabel,
      assessmentType: item.type,
      rawAssessment: item,
    });
  }

  // Sort ALL together by start date & time (count down together!)
  return unified.sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime());
}
