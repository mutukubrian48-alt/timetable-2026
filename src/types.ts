export type AssessmentType =
  | 'assignment_1'
  | 'assignment_2'
  | 'cat_1'
  | 'cat_2'
  | 'cat_3'
  | 'main_exam'
  | 'regular_class'
  | 'custom';

export type DeliveryMode = 'online' | 'offline'; // 'offline' is physical room / campus venue

export type AssessmentStatus =
  | 'pending'
  | 'in_progress'
  | 'submitted'
  | 'completed'
  | 'graded';

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface AssessmentItem {
  id: string;
  courseId: string;
  courseName: string;      // The Unit Name (e.g. Database Systems)
  courseCode: string;      // The Unit Code (e.g. CS 302)
  lecturerName: string;    // Lecturer Name (e.g. Dr. Evans Mutuku)
  lecturerEmail?: string;
  type: AssessmentType;
  title: string;
  description: string;
  scheduledDate: string;   // ISO datetime string: YYYY-MM-DDTHH:mm (When lesson/assessment starts)
  dueDate: string;         // ISO datetime string: YYYY-MM-DDTHH:mm (When lesson/assessment ends)
  durationMinutes?: number;
  deliveryMode: DeliveryMode; // 'online' or 'offline' (physical)
  venueOrPlatform: string; // The Venue or Room (e.g. "Lecture Hall B4" or "Google Meet / Portal")
  meetingLink?: string;    // URL if online (e.g. elearning portal or meet link)
  physicalRoom?: string;   // Building & Room if physical
  portalLink?: string;     // E-learning portal URL
  weightPercentage: number;// e.g. 10 for 10%
  maxScore: number;
  achievedScore?: number | null;
  status: AssessmentStatus;
  checklist: ChecklistItem[];
  syllabusTopics: string[];
  reminderMinutesBefore: number[];
  createdAt: string;
  updatedAt: string;
}

export interface ClassSession {
  id: string;
  courseId: string;
  unitCode: string;        // The Unit (e.g. CS 302)
  unitName: string;        // The Unit Title
  lecturerName: string;    // The Lecturer Name
  lecturerEmail?: string;
  deliveryMode: DeliveryMode; // 'online' or 'offline' (physical)
  venueOrRoom: string;     // The Venue or Room (e.g. "Lecture Hall B4" or "Google Meet")
  physicalRoom?: string;
  meetingLink?: string;
  portalLink?: string;     // Link to university e-learning portal
  dayOfWeek: string;       // e.g. 'Monday', 'Tuesday'
  startTime: string;       // "09:00" (When lesson starts)
  endTime: string;         // "11:00" (When lesson ends)
  topic?: string;
  completed?: boolean;
}

export interface Course {
  id: string;
  code: string;            // The Unit Code (e.g. CS 302)
  name: string;            // The Unit Name (e.g. Database Systems)
  lecturer: string;        // The Lecturer Name
  lecturerEmail?: string;
  defaultMode: DeliveryMode;
  venueRoom?: string;      // Default Venue or Room
  onlinePlatform?: string;
  portalUrl?: string;      // Dedicated unit elearning portal URL
  credits: number;
  color: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'urgent' | 'warning' | 'info' | 'success';
  assessmentId?: string;
  courseCode?: string;
  deliveryMode?: DeliveryMode;
  read: boolean;
}
