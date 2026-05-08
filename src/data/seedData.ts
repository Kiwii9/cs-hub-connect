// Optional local demo data. The live app reads courses/resources from Supabase.

export interface Course {
  id: string;
  code: string;
  name: string;
  college: string;
  major?: string;
  level?: number;
  description?: string;
}

export interface Lecturer {
  id: string;
  name: string;
  department: string;
}

export interface Resource {
  id: string;
  courseId: string;
  type: 'notes' | 'lecture_link';
  title: string;
  description?: string;
  academicYear: string;
  semester: '1' | '2' | 'Summer';
  batchYear: number;
  lecturerId?: string;
  section?: string;
  tags: string[];
  week?: number;
  topic?: string;
  fileUrl?: string;
  linkUrl?: string;
  textContent?: string;
  uploaderId: string;
  createdAt: string;
  status: 'active' | 'reported' | 'removed';
}

export interface Report {
  id: string;
  resourceId: string;
  reporterId: string;
  reason: string;
  details?: string;
  createdAt: string;
  status: 'open' | 'reviewed' | 'dismissed';
}

export const courses: Course[] = [
  { id: '1', code: 'CS101', name: 'Introduction to Computing', college: 'Computer Science and Information Technology', major: 'Computer Science', level: 1, description: 'Fundamental computing and programming concepts' },
  { id: '2', code: 'BUS201', name: 'Principles of Management', college: 'Business Administration', major: 'Business Administration', level: 2, description: 'Management foundations, planning, and organizational behavior' },
  { id: '3', code: 'ENG210', name: 'Engineering Mechanics', college: 'Engineering', major: 'Engineering', level: 2, description: 'Statics, force systems, equilibrium, and applications' },
  { id: '4', code: 'LAW101', name: 'Introduction to Law', college: 'Law', major: 'Law', level: 1, description: 'Legal systems, sources of law, and legal reasoning' },
  { id: '5', code: 'MED120', name: 'Human Anatomy', college: 'Medicine', major: 'Medicine', level: 1, description: 'Core anatomy concepts and medical terminology' },
  { id: '6', code: 'SCI230', name: 'General Chemistry', college: 'Science', major: 'Chemistry', level: 2, description: 'Chemical principles, reactions, and laboratory foundations' },
];

export const lecturers: Lecturer[] = [
  { id: '1', name: 'KFU Lecturer', department: 'General' },
  { id: '2', name: 'College Coordinator', department: 'Academic Affairs' },
];

export const resources: Resource[] = [
  {
    id: '1',
    courseId: '1',
    type: 'notes',
    title: 'Week 1 Lecture Notes',
    description: 'Student-made notes for the first lecture.',
    academicYear: '2025-2026',
    semester: '1',
    batchYear: 2025,
    lecturerId: '1',
    section: 'A',
    tags: ['intro', 'lecture-notes'],
    week: 1,
    topic: 'Course Introduction',
    uploaderId: 'demo-user',
    createdAt: '2026-05-01T10:00:00Z',
    status: 'active',
  },
  {
    id: '2',
    courseId: '2',
    type: 'lecture_link',
    title: 'Official Lecture Recording Link',
    description: 'A helpful public lecture link shared for revision.',
    academicYear: '2025-2026',
    semester: '2',
    batchYear: 2024,
    lecturerId: '2',
    tags: ['revision', 'lecture-link'],
    topic: 'Management Basics',
    linkUrl: 'https://example.com/lecture',
    uploaderId: 'demo-user',
    createdAt: '2026-04-20T10:00:00Z',
    status: 'active',
  },
];

export const reports: Report[] = [];
