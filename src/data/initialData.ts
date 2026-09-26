import { AssessmentItem, Course, ClassSession } from '../types';

export const DEFAULT_ELEARNING_PORTAL = 'https://elearning.university.ac.ke';

export const INITIAL_COURSES: Course[] = [
  {
    id: 'course-cs302',
    code: 'CS 302',
    name: 'Database Systems & Architecture',
    lecturer: 'Dr. Evans Mutuku',
    lecturerEmail: 'e.mutuku@university.ac.ke',
    defaultMode: 'online',
    venueRoom: 'Lecture Hall B4',
    onlinePlatform: 'E-Learning Portal & Google Meet',
    portalUrl: 'https://elearning.university.ac.ke/course/view.php?id=302',
    credits: 4,
    color: '#3B82F6',
  },
  {
    id: 'course-cs305',
    code: 'CS 305',
    name: 'Software Engineering & Agile Systems',
    lecturer: 'Prof. Sarah Jenkins',
    lecturerEmail: 's.jenkins@university.ac.ke',
    defaultMode: 'offline',
    venueRoom: 'Computing Complex Lab 2',
    onlinePlatform: 'E-Learning Portal & Zoom',
    portalUrl: 'https://elearning.university.ac.ke/course/view.php?id=305',
    credits: 4,
    color: '#8B5CF6',
  },
  {
    id: 'course-cs308',
    code: 'CS 308',
    name: 'Distributed Cloud Computing',
    lecturer: 'Dr. Kennedy Ochieng',
    lecturerEmail: 'k.ochieng@university.ac.ke',
    defaultMode: 'online',
    venueRoom: 'Engineering Auditorium A',
    onlinePlatform: 'E-Learning Portal & Teams',
    portalUrl: 'https://elearning.university.ac.ke/course/view.php?id=308',
    credits: 3,
    color: '#06B6D4',
  },
];

// Helper to construct dynamic scheduled ISO dates
const now = new Date();
const addDays = (d: number, hours: number, mins: number) => {
  const target = new Date(now);
  target.setDate(target.getDate() + d);
  target.setHours(hours, mins, 0, 0);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${target.getFullYear()}-${pad(target.getMonth() + 1)}-${pad(target.getDate())}T${pad(target.getHours())}:${pad(target.getMinutes())}`;
};

/**
 * Default rule enforced strictly:
 * - Assignment 1 & 2: Online (via E-learning portal)
 * - CAT 1: ONLINE (E-learning portal / LMS)
 * - CAT 2: PHYSICAL (In-person lecture hall/lab)
 * - CAT 3: ONLINE (E-learning portal / LMS)
 * - Main Exam: PHYSICAL (In-person examination hall)
 */
export const INITIAL_ASSESSMENTS: AssessmentItem[] = [
  // 1. Assignment 1
  {
    id: 'cs302-assign-1',
    courseId: 'course-cs302',
    courseName: 'Database Systems & Architecture',
    courseCode: 'CS 302',
    lecturerName: 'Dr. Evans Mutuku',
    lecturerEmail: 'e.mutuku@university.ac.ke',
    type: 'assignment_1',
    title: 'Assignment 1: Relational Schema & 3NF Normalization',
    description: 'Design comprehensive relational schema for a multi-tenant university portal. Apply functional dependency proofs and normalize to Boyce-Codd Normal Form (BCNF). Submit on the E-learning portal.',
    scheduledDate: addDays(1, 9, 0),   // Lesson starts at 09:00
    dueDate: addDays(7, 23, 59),       // Deadline ends at 23:59
    durationMinutes: 120,
    deliveryMode: 'online', // Online
    venueOrPlatform: 'E-Learning Portal & Google Meet',
    meetingLink: 'https://meet.google.com/cs302-live',
    portalLink: 'https://elearning.university.ac.ke/mod/assign/view.php?id=101',
    weightPercentage: 10,
    maxScore: 30,
    achievedScore: null,
    status: 'in_progress',
    checklist: [
      { id: 'c1', text: 'Define entities and attribute dictionaries', completed: true },
      { id: 'c2', text: 'Construct ERD with cardinality ratios', completed: true },
      { id: 'c3', text: 'Document 1NF, 2NF, 3NF decomposition steps', completed: false },
      { id: 'c4', text: 'Upload solution to E-Learning Portal', completed: false },
    ],
    syllabusTopics: ['Relational Model', 'Functional Dependencies', '3NF / BCNF Normalization'],
    reminderMinutesBefore: [1440, 180, 30],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // 2. CAT 1: ALWAYS DONE ONLINE (As requested)
  {
    id: 'cs302-cat-1',
    courseId: 'course-cs302',
    courseName: 'Database Systems & Architecture',
    courseCode: 'CS 302',
    lecturerName: 'Dr. Evans Mutuku',
    lecturerEmail: 'e.mutuku@university.ac.ke',
    type: 'cat_1',
    title: 'CAT 1: Continuous Assessment Test 1 (Online E-Learning Quiz)',
    description: 'Continuous Assessment Test 1 covering SQL query optimization, relational algebra operators, and index structures. Conducted online via the E-learning portal.',
    scheduledDate: addDays(4, 10, 0),  // Lesson / Test starts at 10:00
    dueDate: addDays(4, 11, 30),       // Lesson / Test ends at 11:30
    durationMinutes: 90,
    deliveryMode: 'online', // ALWAYS ONLINE as requested
    venueOrPlatform: 'E-Learning Portal (Online Timed Quiz)',
    meetingLink: 'https://meet.google.com/cs302-cat1',
    portalLink: 'https://elearning.university.ac.ke/mod/quiz/view.php?id=30201',
    weightPercentage: 10,
    maxScore: 30,
    achievedScore: null,
    status: 'pending',
    checklist: [
      { id: 'c5', text: 'Log in and test E-Learning Portal session', completed: false },
      { id: 'c6', text: 'Review Relational Algebra select, project, join formulas', completed: false },
      { id: 'c7', text: 'Practice nested subquery execution plans', completed: false },
    ],
    syllabusTopics: ['Relational Algebra', 'Tuple Relational Calculus', 'B+ Tree Indexing'],
    reminderMinutesBefore: [2880, 1440, 60],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // 3. Assignment 2
  {
    id: 'cs302-assign-2',
    courseId: 'course-cs302',
    courseName: 'Database Systems & Architecture',
    courseCode: 'CS 302',
    lecturerName: 'Dr. Evans Mutuku',
    lecturerEmail: 'e.mutuku@university.ac.ke',
    type: 'assignment_2',
    title: 'Assignment 2: Distributed Transaction Management & ACID',
    description: 'Implement two-phase locking (2PL) simulation and demonstrate deadlock prevention strategies. Portal submission portal.',
    scheduledDate: addDays(12, 14, 0), // Starts at 14:00
    dueDate: addDays(20, 23, 59),      // Ends at 23:59
    durationMinutes: 180,
    deliveryMode: 'online', // Online
    venueOrPlatform: 'E-Learning Portal & GitHub Classroom',
    meetingLink: 'https://meet.google.com/cs302-live',
    portalLink: 'https://elearning.university.ac.ke/mod/assign/view.php?id=102',
    weightPercentage: 10,
    maxScore: 30,
    achievedScore: null,
    status: 'pending',
    checklist: [
      { id: 'c8', text: 'Set up GitHub Classroom repository', completed: false },
      { id: 'c9', text: 'Implement Strict 2PL concurrency controller', completed: false },
      { id: 'c10', text: 'Submit zip archive to E-learning Portal', completed: false },
    ],
    syllabusTopics: ['ACID Properties', 'Two-Phase Locking (2PL)', 'Deadlock Detection'],
    reminderMinutesBefore: [1440, 240],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // 4. CAT 2: ALWAYS PHYSICAL (As requested)
  {
    id: 'cs302-cat-2',
    courseId: 'course-cs302',
    courseName: 'Database Systems & Architecture',
    courseCode: 'CS 302',
    lecturerName: 'Dr. Evans Mutuku',
    lecturerEmail: 'e.mutuku@university.ac.ke',
    type: 'cat_2',
    title: 'CAT 2: Continuous Assessment Test 2 (Sit-In Physical Paper)',
    description: 'In-person sit-in continuous assessment test covering transaction scheduling, serializability graphs, and query transformations. Physical attendance required.',
    scheduledDate: addDays(22, 11, 0), // Starts at 11:00
    dueDate: addDays(22, 12, 30),      // Ends at 12:30
    durationMinutes: 90,
    deliveryMode: 'offline', // ALWAYS PHYSICAL as requested
    venueOrPlatform: 'Lecture Hall B4 (Physical Room)',
    physicalRoom: 'Science & Computing Complex, 2nd Floor, Hall B4',
    portalLink: 'https://elearning.university.ac.ke/course/view.php?id=302',
    weightPercentage: 10,
    maxScore: 30,
    achievedScore: null,
    status: 'pending',
    checklist: [
      { id: 'c11', text: 'Bring student ID badge and approved pens', completed: false },
      { id: 'c12', text: 'Arrive at Lecture Hall B4 15 mins early', completed: false },
    ],
    syllabusTopics: ['Serializability', 'Concurrency Control', 'Recovery Systems (WAL)'],
    reminderMinutesBefore: [2880, 1440, 120],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // 5. CAT 3: ALWAYS DONE ONLINE (As requested)
  {
    id: 'cs302-cat-3',
    courseId: 'course-cs302',
    courseName: 'Database Systems & Architecture',
    courseCode: 'CS 302',
    lecturerName: 'Dr. Evans Mutuku',
    lecturerEmail: 'e.mutuku@university.ac.ke',
    type: 'cat_3',
    title: 'CAT 3: Continuous Assessment Test 3 (Online Practical Lab CAT)',
    description: 'Hands-on practical assessment on Postgres query plan analyzer (EXPLAIN ANALYZE) and partitioning strategies conducted online via LMS portal.',
    scheduledDate: addDays(35, 14, 0), // Starts at 14:00
    dueDate: addDays(35, 16, 0),       // Ends at 16:00
    durationMinutes: 120,
    deliveryMode: 'online', // ALWAYS ONLINE as requested
    venueOrPlatform: 'E-Learning Portal (Online Lab Submission)',
    meetingLink: 'https://meet.google.com/cs302-cat3',
    portalLink: 'https://elearning.university.ac.ke/mod/quiz/view.php?id=30203',
    weightPercentage: 10,
    maxScore: 30,
    achievedScore: null,
    status: 'pending',
    checklist: [
      { id: 'c13', text: 'Verify PostgreSQL terminal environment on laptop', completed: false },
      { id: 'c14', text: 'Log in to E-learning Portal practical upload portal', completed: false },
    ],
    syllabusTopics: ['Query Optimization', 'Index Tuning', 'Physical Storage & Sharding'],
    reminderMinutesBefore: [2880, 1440, 60],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // 6. MAIN EXAM: ALWAYS PHYSICAL (As requested)
  {
    id: 'cs302-main-exam',
    courseId: 'course-cs302',
    courseName: 'Database Systems & Architecture',
    courseCode: 'CS 302',
    lecturerName: 'Dr. Evans Mutuku',
    lecturerEmail: 'e.mutuku@university.ac.ke',
    type: 'main_exam',
    title: 'Main Examination: Database Systems & Architecture',
    description: 'Comprehensive end-of-semester final examination. Sit-in physical examination in the University Great Hall.',
    scheduledDate: addDays(50, 8, 30),  // Exam starts at 08:30
    dueDate: addDays(50, 11, 30),       // Exam ends at 11:30
    durationMinutes: 180,
    deliveryMode: 'offline', // ALWAYS PHYSICAL as requested
    venueOrPlatform: 'University Great Hall (Pavilion B - Physical)',
    physicalRoom: 'Main Campus Examination Pavilion B, Desk Row 12',
    portalLink: 'https://elearning.university.ac.ke/course/view.php?id=302',
    weightPercentage: 50,
    maxScore: 100,
    achievedScore: null,
    status: 'pending',
    checklist: [
      { id: 'c16', text: 'Review past 5 years examination papers on E-learning Portal', completed: false },
      { id: 'c17', text: 'Print examination clearance card & exam card', completed: false },
      { id: 'c18', text: 'Locate seat allocation in Great Hall Pavilion B', completed: false },
    ],
    syllabusTopics: [
      'Relational Calculus & Schema Synthesis',
      'Advanced Indexing & Query Pipelines',
      'Transaction Concurrency & ARIES Recovery',
      'NoSQL & Distributed Consensus Models',
    ],
    reminderMinutesBefore: [10080, 2880, 1440, 180],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // CS 305 Coursework Sequence
  {
    id: 'cs305-cat-1',
    courseId: 'course-cs305',
    courseName: 'Software Engineering & Agile Systems',
    courseCode: 'CS 305',
    lecturerName: 'Prof. Sarah Jenkins',
    lecturerEmail: 's.jenkins@university.ac.ke',
    type: 'cat_1',
    title: 'CAT 1: Agile Methodologies & Scrum Framework (Online Test)',
    description: 'Online timed evaluation of Scrum ceremonies, velocity charts, and extreme programming on the E-learning portal.',
    scheduledDate: addDays(8, 10, 0),  // Starts at 10:00
    dueDate: addDays(8, 11, 30),       // Ends at 11:30
    durationMinutes: 90,
    deliveryMode: 'online', // CAT 1 ALWAYS ONLINE
    venueOrPlatform: 'E-Learning Portal (Timed Quiz)',
    meetingLink: 'https://zoom.us/j/9384729104',
    portalLink: 'https://elearning.university.ac.ke/mod/quiz/view.php?id=30501',
    weightPercentage: 10,
    maxScore: 30,
    achievedScore: null,
    status: 'pending',
    checklist: [
      { id: 'c21', text: 'Review Scrum roles and sprint backlog grooming', completed: false },
    ],
    syllabusTopics: ['Agile Manifesto', 'Scrum vs Kanban', 'User Story Estimation'],
    reminderMinutesBefore: [2880, 1440],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'cs305-cat-2',
    courseId: 'course-cs305',
    courseName: 'Software Engineering & Agile Systems',
    courseCode: 'CS 305',
    lecturerName: 'Prof. Sarah Jenkins',
    lecturerEmail: 's.jenkins@university.ac.ke',
    type: 'cat_2',
    title: 'CAT 2: Clean Architecture & SOLID Principles (Physical Exam)',
    description: 'Written sit-in test on Clean Architecture, Microservices communication, and Domain-Driven Design.',
    scheduledDate: addDays(26, 9, 0),  // Starts at 09:00
    dueDate: addDays(26, 10, 30),      // Ends at 10:30
    durationMinutes: 90,
    deliveryMode: 'offline', // CAT 2 ALWAYS PHYSICAL
    venueOrPlatform: 'Engineering Lecture Theater 1 (Physical Room)',
    physicalRoom: 'Old Engineering Block, Theater 1',
    portalLink: 'https://elearning.university.ac.ke/course/view.php?id=305',
    weightPercentage: 10,
    maxScore: 30,
    achievedScore: null,
    status: 'pending',
    checklist: [
      { id: 'c24', text: 'Revise Dependency Inversion and Hexagonal Architecture', completed: false },
    ],
    syllabusTopics: ['Software Architecture', 'Microservices vs Monoliths', 'DDD Aggregates'],
    reminderMinutesBefore: [2880, 1440],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'cs305-cat-3',
    courseId: 'course-cs305',
    courseName: 'Software Engineering & Agile Systems',
    courseCode: 'CS 305',
    lecturerName: 'Prof. Sarah Jenkins',
    lecturerEmail: 's.jenkins@university.ac.ke',
    type: 'cat_3',
    title: 'CAT 3: Design Patterns & Refactoring Sprint (Online Live Exam)',
    description: 'Online sprint coding challenge on Factory, Observer, Strategy, and Decorator design patterns on E-learning Portal.',
    scheduledDate: addDays(40, 11, 0), // Starts at 11:00
    dueDate: addDays(40, 12, 30),      // Ends at 12:30
    durationMinutes: 90,
    deliveryMode: 'online', // CAT 3 ALWAYS ONLINE
    venueOrPlatform: 'E-Learning Portal & CodeSandbox Live',
    meetingLink: 'https://meet.google.com/swe-cs305-sprint',
    portalLink: 'https://elearning.university.ac.ke/mod/quiz/view.php?id=30503',
    weightPercentage: 10,
    maxScore: 30,
    achievedScore: null,
    status: 'pending',
    checklist: [
      { id: 'c25', text: 'Practice GoF design patterns in TypeScript', completed: false },
    ],
    syllabusTopics: ['Creational Patterns', 'Structural Patterns', 'Behavioral Refactoring'],
    reminderMinutesBefore: [2880, 1440, 60],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'cs305-main-exam',
    courseId: 'course-cs305',
    courseName: 'Software Engineering & Agile Systems',
    courseCode: 'CS 305',
    lecturerName: 'Prof. Sarah Jenkins',
    lecturerEmail: 's.jenkins@university.ac.ke',
    type: 'main_exam',
    title: 'Main Examination: Software Engineering & Agile Systems',
    description: 'Final physical sit-in examination for CS 305. Testing system design, software quality assurance, security, and project lifecycle management.',
    scheduledDate: addDays(56, 13, 30), // Starts at 13:30
    dueDate: addDays(56, 16, 30),       // Ends at 16:30
    durationMinutes: 180,
    deliveryMode: 'offline', // MAIN EXAM ALWAYS PHYSICAL
    venueOrPlatform: 'Assembly Auditorium Hall A (Physical)',
    physicalRoom: 'Assembly Complex, Central Auditorium, Section C',
    portalLink: 'https://elearning.university.ac.ke/course/view.php?id=305',
    weightPercentage: 50,
    maxScore: 100,
    achievedScore: null,
    status: 'pending',
    checklist: [
      { id: 'c26', text: 'Revise complete lecture slides and case studies', completed: false },
      { id: 'c27', text: 'Review past year question sets 2022-2025 on portal', completed: false },
    ],
    syllabusTopics: [
      'System Architecture & Design Patterns',
      'Agile Estimation & Risk Governance',
      'Software Testing Levels & QA Metrics',
      'DevOps, Containerization & Maintenance',
    ],
    reminderMinutesBefore: [10080, 2880, 1440],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const INITIAL_TIMETABLE_CLASSES: ClassSession[] = [
  {
    id: 'session-1',
    courseId: 'course-cs302',
    unitCode: 'CS 302',
    unitName: 'Database Systems & Architecture',
    lecturerName: 'Dr. Evans Mutuku',
    lecturerEmail: 'e.mutuku@university.ac.ke',
    deliveryMode: 'online', // Online
    venueOrRoom: 'E-Learning Portal & Google Meet',
    meetingLink: 'https://meet.google.com/cs302-live',
    portalLink: 'https://elearning.university.ac.ke/course/view.php?id=302',
    dayOfWeek: 'Monday',
    startTime: '08:00',
    endTime: '10:00',
    topic: 'Relational Calculus & Index Trees Optimization',
    completed: false,
  },
  {
    id: 'session-2',
    courseId: 'course-cs305',
    unitCode: 'CS 305',
    unitName: 'Software Engineering & Agile Systems',
    lecturerName: 'Prof. Sarah Jenkins',
    lecturerEmail: 's.jenkins@university.ac.ke',
    deliveryMode: 'offline', // Physical
    venueOrRoom: 'Science & Computing Complex, Lab 2',
    physicalRoom: 'Science & Tech Complex, 2nd Floor, Lab 2',
    portalLink: 'https://elearning.university.ac.ke/course/view.php?id=305',
    dayOfWeek: 'Tuesday',
    startTime: '10:30',
    endTime: '12:30',
    topic: 'Sprint Retrospective & Clean Architecture Patterns',
    completed: false,
  },
  {
    id: 'session-3',
    courseId: 'course-cs308',
    unitCode: 'CS 308',
    unitName: 'Distributed Cloud Computing',
    lecturerName: 'Dr. Kennedy Ochieng',
    lecturerEmail: 'k.ochieng@university.ac.ke',
    deliveryMode: 'online', // Online
    venueOrRoom: 'E-Learning Portal & Teams',
    meetingLink: 'https://teams.microsoft.com/l/meetup-join/cs308',
    portalLink: 'https://elearning.university.ac.ke/course/view.php?id=308',
    dayOfWeek: 'Wednesday',
    startTime: '14:00',
    endTime: '16:00',
    topic: 'Kubernetes Cluster Architecture & Raft Consensus',
    completed: false,
  },
  {
    id: 'session-4',
    courseId: 'course-cs302',
    unitCode: 'CS 302',
    unitName: 'Database Systems & Architecture',
    lecturerName: 'Dr. Evans Mutuku',
    lecturerEmail: 'e.mutuku@university.ac.ke',
    deliveryMode: 'offline', // Physical
    venueOrRoom: 'Lecture Hall B4 (Physical)',
    physicalRoom: 'Lecture Hall B4, Science Building',
    portalLink: 'https://elearning.university.ac.ke/course/view.php?id=302',
    dayOfWeek: 'Thursday',
    startTime: '11:00',
    endTime: '13:00',
    topic: 'Hands-on PostgreSQL 3NF Normalization Lab',
    completed: false,
  },
  {
    id: 'session-5',
    courseId: 'course-cs305',
    unitCode: 'CS 305',
    unitName: 'Software Engineering & Agile Systems',
    lecturerName: 'Prof. Sarah Jenkins',
    lecturerEmail: 's.jenkins@university.ac.ke',
    deliveryMode: 'online', // Online
    venueOrRoom: 'E-Learning Portal & Zoom Live',
    meetingLink: 'https://zoom.us/j/9384729104',
    portalLink: 'https://elearning.university.ac.ke/course/view.php?id=305',
    dayOfWeek: 'Friday',
    startTime: '09:00',
    endTime: '11:00',
    topic: 'CI/CD Pipeline Automation & Automated Test Fixtures',
    completed: false,
  },
];
