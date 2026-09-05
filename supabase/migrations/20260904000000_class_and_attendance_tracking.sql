-- =====================================================================
-- Student Portal — Multi-Student Class & Attendance Tracking Migration
-- =====================================================================

-- Step 1: Create shared class_sessions table
CREATE TABLE IF NOT EXISTS public.class_sessions (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  course_id bigint NOT NULL REFERENCES public.courses(id) ON DELETE RESTRICT,
  session_date date NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  topic text,
  created_at timestamptz DEFAULT now()
);

-- Step 2: Create student-specific attendance_records table
CREATE TABLE IF NOT EXISTS public.attendance_records (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  session_id bigint NOT NULL REFERENCES public.class_sessions(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status text NOT NULL CHECK (status IN ('Present', 'Absent', 'Excused')),
  created_at timestamptz DEFAULT now(),
  CONSTRAINT attendance_records_session_student_unique UNIQUE(session_id, student_id)
);

-- Step 3: Performance Indexes
CREATE INDEX IF NOT EXISTS idx_class_sessions_course_id ON public.class_sessions(course_id);
CREATE INDEX IF NOT EXISTS idx_class_sessions_date ON public.class_sessions(session_date);
CREATE INDEX IF NOT EXISTS idx_attendance_records_student_id ON public.attendance_records(student_id);
CREATE INDEX IF NOT EXISTS idx_attendance_records_session_id ON public.attendance_records(session_id);

-- Step 4: Enable Row Level Security (RLS) & Grant Permissions
ALTER TABLE public.class_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON public.class_sessions TO authenticated;
GRANT SELECT ON public.attendance_records TO authenticated;

-- Step 5: Database-Level Security Policies (Strict Multi-Student Isolation)

-- 1. Class Sessions Policy:
-- A student can ONLY query class sessions for which they have an attendance_records row.
-- Prevents cross-student lecture disclosure at the PostgreSQL engine level.
DROP POLICY IF EXISTS "Authenticated users can select class_sessions" ON public.class_sessions;
DROP POLICY IF EXISTS "Students can view enrolled class sessions" ON public.class_sessions;
CREATE POLICY "Students can view enrolled class sessions"
  ON public.class_sessions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.attendance_records ar
      WHERE ar.session_id = public.class_sessions.id
        AND ar.student_id = auth.uid()
    )
  );

-- 2. Attendance Records Policy:
-- A student can ONLY select their own attendance records.
DROP POLICY IF EXISTS "Students can view only their own attendance records" ON public.attendance_records;
CREATE POLICY "Students can view only their own attendance records"
  ON public.attendance_records
  FOR SELECT
  TO authenticated
  USING (student_id = auth.uid());

-- Prevent students from mutating attendance records (read-only for students)
DROP POLICY IF EXISTS "Students cannot insert attendance records" ON public.attendance_records;
DROP POLICY IF EXISTS "Students cannot update attendance records" ON public.attendance_records;
DROP POLICY IF EXISTS "Students cannot delete attendance records" ON public.attendance_records;

-- =====================================================================
-- Demo Data Seed (Shared Class Sessions & Verified Real Student)
-- =====================================================================

-- Insert realistic shared class sessions across verified courses (CS301-CS305)
INSERT INTO public.class_sessions (course_id, session_date, start_time, end_time, topic)
VALUES
  (1, '2026-03-02', '09:00:00', '10:00:00', 'Binary Search Trees & AVL Balancing'),
  (1, '2026-03-04', '09:00:00', '10:00:00', 'Graph Representations & BFS/DFS Traversal'),
  (2, '2026-03-02', '10:15:00', '11:15:00', 'Process Scheduling Algorithms & Context Switching'),
  (2, '2026-03-04', '10:15:00', '11:15:00', 'Deadlock Detection, Prevention & Banker Algorithm'),
  (3, '2026-03-03', '11:30:00', '12:30:00', 'Relational Algebra & SQL Normalization (3NF/BCNF)'),
  (3, '2026-03-05', '11:30:00', '12:30:00', 'ACID Properties & Concurrency Control'),
  (4, '2026-03-03', '14:00:00', '15:00:00', 'OSI Model vs TCP/IP & IP Subnetting'),
  (4, '2026-03-05', '14:00:00', '15:00:00', 'Routing Protocols: OSPF, BGP & Distance Vector'),
  (5, '2026-03-04', '15:15:00', '16:15:00', 'Deterministic & Non-Deterministic Finite Automata')
ON CONFLICT DO NOTHING;

-- Seed attendance records ONLY for the verified real authenticated student:
-- Aneesh Kashyap K S (0d3f2420-2ffb-4d5f-aab9-0c8a47d3686b)
INSERT INTO public.attendance_records (session_id, student_id, status)
SELECT cs.id, '0d3f2420-2ffb-4d5f-aab9-0c8a47d3686b'::uuid,
  CASE 
    WHEN cs.id % 5 = 0 THEN 'Absent'
    WHEN cs.id % 7 = 0 THEN 'Excused'
    ELSE 'Present'
  END
FROM public.class_sessions cs
ON CONFLICT (session_id, student_id) DO NOTHING;
