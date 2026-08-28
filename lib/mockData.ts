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
