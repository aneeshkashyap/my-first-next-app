/**
 * Secure Server-Side Demo Student Provisioning Script
 * 
 * USAGE (Run ONLY in a secure server / CI / local terminal environment):
 *   SUPABASE_SERVICE_ROLE_KEY="your-service-role-key" node scripts/provision-demo-students.mjs
 * 
 * IMPORTANT:
 * - This script is designed for server-side administrative execution only.
 * - NEVER commit the service-role key to source code or git.
 * - NEVER expose SUPABASE_SERVICE_ROLE_KEY to browser code or NEXT_PUBLIC_* variables.
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://epgpvljsysputiftbtyg.supabase.co";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!serviceRoleKey) {
  console.error("Error: SUPABASE_SERVICE_ROLE_KEY environment variable is required.");
  console.error("Run: SUPABASE_SERVICE_ROLE_KEY=\"<secret>\" node scripts/provision-demo-students.mjs");
  process.exit(1);
}

// Initialize Supabase admin client with service_role privileges
const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const DEMO_STUDENTS = [
  {
    email: "aarav.sharma@svce.ac.in",
    password: "Student@123",
    name: "Aarav Sharma",
    studentId: "2024CS0910",
    department: "Computer Science & Engineering",
    semester: "6th Semester (Spring 2026)",
    year: "3rd Year",
    batch: "2024 - 2028",
    phone: "+91 98765 11111",
  },
  {
    email: "priya.patel@svce.ac.in",
    password: "Student@123",
    name: "Priya Patel",
    studentId: "2024CS0915",
    department: "Computer Science & Engineering",
    semester: "6th Semester (Spring 2026)",
    year: "3rd Year",
    batch: "2024 - 2028",
    phone: "+91 98765 22222",
  },
  {
    email: "rohan.gupta@svce.ac.in",
    password: "Student@123",
    name: "Rohan Gupta",
    studentId: "2024CS0920",
    department: "Computer Science & Engineering",
    semester: "6th Semester (Spring 2026)",
    year: "3rd Year",
    batch: "2024 - 2028",
    phone: "+91 98765 33333",
  },
];

async function provisionDemoStudents() {
  console.log("=== Provisioning Demo Students via Supabase Admin API ===");

  for (const student of DEMO_STUDENTS) {
    console.log(`\nCreating student: ${student.name} (${student.email})...`);

    // 1. Create Supabase Auth user with confirmed email
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
      email: student.email,
      password: student.password,
      email_confirm: true,
      user_metadata: {
        full_name: student.name,
        name: student.name,
        student_id: student.studentId,
        role: "student",
      },
    });

    if (userError) {
      if (userError.message.includes("already registered")) {
        console.log(`  Notice: User ${student.email} already exists.`);
      } else {
        console.error(`  Error creating user: ${userError.message}`);
        continue;
      }
    }

    const userId = userData?.user?.id;
    if (!userId) continue;

    console.log(`  Auth UID: ${userId}`);

    // 2. Upsert profile in public.profiles
    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .upsert({
        id: userId,
        student_id: student.studentId,
        full_name: student.name,
        department: student.department,
        year: student.year,
        semester: student.semester,
        batch: student.batch,
        phone: student.phone,
        institutional_email: student.email,
      });

    if (profileError) {
      console.error(`  Profile error: ${profileError.message}`);
    } else {
      console.log(`  Profile upserted successfully.`);
    }
  }

  console.log("\n=== Provisioning Complete ===");
}

provisionDemoStudents().catch(console.error);
