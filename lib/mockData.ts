import { Assignment } from "@/components/AssignmentList";

export interface StudentProfile {
  name: string;
  studentId: string;
  department: string;
  semester: string;
  email: string;
  cgpa: string;
  attendance: string;
  attendancePercent: number;
}

export interface SubjectAttendance {
  code: string;
  subject: string;
  attended: number;
  total: number;
  percentage: number;
  faculty: string;
}

export interface SubjectPerformance {
  code: string;
  subject: string;
  credits: number;
  internalMarks: number; // max 50
  externalMarks: number; // max 50
  totalMarks: number; // max 100
  grade: string;
  gradePoints: number;
}

export interface SemesterTrend {
  semester: string;
  sgpa: number;
  cgpa: number;
  credits: number;
  status: string;
}

export const initialMockAssignments: Assignment[] = [
  {
    id: 1,
    title: "Data Structures Lab Report",
    subject: "Computer Science",
    dueDate: "March 1, 2026",
    status: "Pending",
  },
  {
    id: 2,
    title: "Calculus Problem Set 4",
    subject: "Mathematics",
    dueDate: "March 3, 2026",
    status: "In Progress",
  },
  {
    id: 3,
    title: "Operating Systems Essay",
    subject: "Computer Science",
    dueDate: "March 5, 2026",
    status: "Pending",
  },
  {
    id: 4,
    title: "Physics Circuit Simulation",
    subject: "Physics",
    dueDate: "February 25, 2026",
    status: "Completed",
  },
];

export const mockStudentProfile: StudentProfile = {
  name: "Aneesh Kashyap",
  studentId: "STU-2024-8891",
  department: "Computer Science & Engineering",
  semester: "6th Semester (Spring 2026)",
  email: "aneesh.kashyap@university.edu",
  cgpa: "8.5",
  attendance: "85%",
  attendancePercent: 85,
};

export const mockSubjectAttendance: SubjectAttendance[] = [
  {
    code: "CS301",
    subject: "Data Structures & Algorithms",
    attended: 38,
    total: 40,
    percentage: 95,
    faculty: "Dr. Evelyn Reed",
  },
  {
    code: "CS302",
    subject: "Operating Systems",
    attended: 32,
    total: 36,
    percentage: 89,
    faculty: "Prof. Alan Turing",
  },
  {
    code: "CS303",
    subject: "Database Management Systems",
    attended: 34,
    total: 40,
    percentage: 85,
    faculty: "Dr. Edgar Codd",
  },
  {
    code: "CS304",
    subject: "Computer Networks",
    attended: 28,
    total: 35,
    percentage: 80,
    faculty: "Prof. Vint Cerf",
  },
  {
    code: "CS305",
    subject: "Theory of Computation",
    attended: 25,
    total: 36,
    percentage: 69,
    faculty: "Dr. Michael Sipser",
  },
];

export const mockSubjectPerformance: SubjectPerformance[] = [
  {
    code: "CS301",
    subject: "Data Structures & Algorithms",
    credits: 4,
    internalMarks: 48,
    externalMarks: 46,
    totalMarks: 94,
    grade: "A+",
    gradePoints: 10,
  },
  {
    code: "CS302",
    subject: "Operating Systems",
    credits: 4,
    internalMarks: 44,
    externalMarks: 42,
    totalMarks: 86,
    grade: "A",
    gradePoints: 9,
  },
  {
    code: "CS303",
    subject: "Database Management Systems",
    credits: 4,
    internalMarks: 42,
    externalMarks: 43,
    totalMarks: 85,
    grade: "A",
    gradePoints: 9,
  },
  {
    code: "CS304",
    subject: "Computer Networks",
    credits: 3,
    internalMarks: 38,
    externalMarks: 39,
    totalMarks: 77,
    grade: "B+",
    gradePoints: 8,
  },
  {
    code: "CS305",
    subject: "Theory of Computation",
    credits: 3,
    internalMarks: 35,
    externalMarks: 36,
    totalMarks: 71,
    grade: "B",
    gradePoints: 7,
  },
];

export const mockSemesterTrends: SemesterTrend[] = [
  {
    semester: "Semester 1",
    sgpa: 8.1,
    cgpa: 8.1,
    credits: 22,
    status: "Distinction",
  },
  {
    semester: "Semester 2",
    sgpa: 8.3,
    cgpa: 8.2,
    credits: 22,
    status: "Distinction",
  },
  {
    semester: "Semester 3",
    sgpa: 8.6,
    cgpa: 8.33,
    credits: 24,
    status: "Distinction",
  },
  {
    semester: "Semester 4",
    sgpa: 8.4,
    cgpa: 8.35,
    credits: 24,
    status: "Distinction",
  },
  {
    semester: "Semester 5",
    sgpa: 8.8,
    cgpa: 8.44,
    credits: 22,
    status: "Distinction",
  },
  {
    semester: "Semester 6 (Current)",
    sgpa: 8.7,
    cgpa: 8.5,
    credits: 18,
    status: "Distinction",
  },
];
