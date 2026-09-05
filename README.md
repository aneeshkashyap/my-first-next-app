# Student Portal

A modern, cloud-native academic portal for college students to track deliverables, course attendance, academic performance, and official campus announcements in real time. Built with Next.js App Router, TypeScript, Tailwind CSS, and a relational Supabase (PostgreSQL) backend.

---

## 📌 Project Overview

The **Student Portal** is a centralized web workspace engineered to simplify student academic life. Designed with clean UX principles and strong data integrity, the portal replaces disconnected spreadsheets and legacy notice boards with an integrated, authenticated dashboard backed by live database services.

All user metrics—from attendance percentages to semester GPAs, interactive assignments, and campus bulletins—are dynamically fetched and persisted in real time via Supabase PostgreSQL tables.

---

## ✨ Key Features

* **Secure Authentication**:
  * Credential-based authentication powered by Supabase Auth.
  * Route protection using higher-order client and middleware guards.
  * Automatic session restoration and secure sign-out.
* **Student Dashboard**:
  * High-level academic overview with live metrics.
  * Weighted attendance summary card with standing status badges.
  * Cumulative Grade Point Average (CGPA) card with distinction indicators.
  * Pending assignments count and a single-click "Complete One" workflow.
  * Dynamic recent announcements bulletin.
* **Student Profile**:
  * Comprehensive academic credential view (department, semester, batch, year, ID, email, phone).
  * In-place editable personal details with real-time validation and database persistence.
* **Assignment Management**:
  * Live course deliverable tracking with course codes, subjects, and human-readable due dates.
  * Optimistic UI status updates with instant database synchronization.
  * Multi-status tracking (`Pending`, `In Progress`, `Completed`).
* **Official Campus Announcements**:
  * Real-time campus notice board with live text search across titles and descriptions.
  * Loading skeleton placeholders, empty state handling, and automated retry on error.
* **Academic Analytics**:
  * **Attendance Analytics**: Weighted attendance aggregation across all enrolled courses, minimum threshold indicators, and automated shortage warnings (< 75%).
  * **Performance Analytics**: Subject-level internal assessment, external finals, and letter grade points breakdown.
  * **Semester Progression**: Multi-semester SGPA vs. CGPA growth visual comparison chart across terms.

---

## 🛠 Technology Stack

* **Frontend Framework**: [Next.js](https://nextjs.org/) (App Router, React 19)
* **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict type safety)
* **Styling**: [Tailwind CSS](https://tailwindcss.com/) (Responsive layout, sleek modern dark/light aesthetics)
* **Backend as a Service (BaaS)**: [Supabase](https://supabase.com/)
* **Database**: [PostgreSQL](https://www.postgresql.org/) (Relational schema with foreign keys)
* **Authentication**: Supabase Auth
* **Deployment & CI/CD**: [Vercel](https://vercel.com/) via GitHub

---

## 🗄 Supabase Data Architecture

The application relies on a normalized relational PostgreSQL schema within Supabase:

| Table Name | Description | Key Columns |
| :--- | :--- | :--- |
| `public.profiles` | Student identity & contact details | `id` (PK, UUID references `auth.users`), `student_id`, `full_name`, `department`, `year`, `semester`, `batch`, `phone`, `institutional_email`, `avatar_url` |
| `public.courses` | Master academic course catalog | `id` (PK, BigInt), `course_code`, `course_name`, `credits`, `created_at` |
| `public.assignments` | Student coursework and deliverables | `id` (PK, BigInt), `student_id` (UUID references `auth.users`), `course_id` (BigInt references `courses`), `title`, `description`, `due_date`, `status` |
| `public.subject_attendance` | Course-level lecture and lab attendance | `id` (PK, UUID), `user_id` (UUID references `auth.users`), `code`, `subject`, `attended`, `total`, `faculty` |
| `public.subject_performance` | Course marks, grade points, and letter grades | `id` (PK, UUID), `user_id` (UUID references `auth.users`), `code`, `subject`, `credits`, `internal_marks`, `external_marks`, `total_marks`, `grade`, `grade_points` |
| `public.semester_trends` | Historical term progression and GPA growth | `id` (PK, UUID), `user_id` (UUID references `auth.users`), `semester`, `semester_order`, `sgpa`, `cgpa`, `credits`, `status` |
| `public.announcements` | Campus-wide and departmental bulletins | `id` (PK, BigInt), `title`, `body`, `created_at` |

---

## 🔒 Security & Privacy

* **User Identity Scoping**: Every private query and mutation is filtered explicitly by the authenticated user's ID (`auth.uid()`), preventing cross-tenant data access.
* **Row Level Security (RLS)**: Database tables enforce strict Postgres RLS policies to guarantee students can only query and mutate their own academic records.
* **Key Separation**: The client application only consumes public, browser-safe publishable credentials (`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`). Administrative secret keys are never bundled into client-side code.
* **Environment Isolation**: Database connection secrets and service keys are strictly isolated within local `.env.local` files and Vercel encrypted environment variables.

---

## 📂 Project Structure

```text
my-first-next-app/
├── app/
│   ├── analytics/          # Academic analytics page & trend charts
│   ├── announcements/      # Campus bulletins notice board
│   ├── assignments/        # Student coursework deliverables page
│   ├── login/              # Student sign-in page
│   ├── profile/            # Academic identity & profile editing page
│   ├── globals.css         # Global styling rules & CSS variables
│   ├── layout.tsx          # Root application layout & navigation shell
│   └── page.tsx            # Main Student Dashboard
├── components/
│   ├── analytics/          # Attendance & performance visualization cards
│   ├── profile/            # Profile display and inline edit forms
│   ├── Announcements.tsx   # Announcements list & live search component
│   ├── AssignmentList.tsx  # Deliverables table & status toggle component
│   ├── AuthProvider.tsx    # Supabase session & user context provider
│   ├── Header.tsx          # Responsive navigation header & user avatar
│   ├── ProgressBar.tsx     # Animated progress bar component
│   ├── ProtectedRoute.tsx  # Authentication wrapper for secured routes
│   └── StatCard.tsx        # Modular dashboard summary card
├── lib/
│   ├── auth.ts             # Supabase Auth helper & user session parser
│   ├── useAnalytics.ts     # Supabase hook for subject marks & attendance
│   ├── useAssignments.ts   # Supabase hook for coursework management
│   └── useProfile.ts       # Canonical hook for student profile & metrics
├── utils/
│   └── supabase/
│       ├── client.ts       # Browser-side Supabase client singleton
│       └── server.ts       # Server-side Supabase client (SSR / Actions)
├── public/                 # Static assets and icons
└── README.md               # Project documentation
```

---

## 🚀 Installation & Local Setup

### 1. Clone the Repository
```bash
git clone https://github.com/aneeshkashyap/my-first-next-app.git
cd my-first-next-app
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
```

### 4. Start the Local Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 🔐 Google & GitHub OAuth Configuration

To enable third-party single sign-on (SSO) with Google and GitHub, configure your Supabase project, Google Cloud Console, and GitHub Developer Settings manually:

### 1. Supabase Dashboard Settings
Navigate to **Authentication &rarr; URL Configuration** in your Supabase Dashboard:
* **Site URL**: `http://localhost:3000` (or `https://<your-production-domain>`)
* **Redirect URLs (Allow List)**:
  * `http://localhost:3000/auth/callback`
  * `http://localhost:3000/**`
  * `https://<your-production-domain>/auth/callback`

Supabase provides the shared callback URL for third-party providers:
```text
https://<your-project-ref>.supabase.co/auth/v1/callback
```

### 2. Google Cloud Console Configuration
1. Open [Google Cloud Console](https://console.cloud.google.com/) and select or create a project.
2. Go to **APIs & Services &rarr; OAuth consent screen**:
   * Set user type and fill in required app branding and developer contact emails.
   * Add scopes: `.../auth/userinfo.email`, `.../auth/userinfo.profile`, `openid`.
3. Go to **Credentials &rarr; Create Credentials &rarr; OAuth client ID**:
   * **Application type**: `Web application`
   * **Authorized JavaScript origins**:
     * `http://localhost:3000`
     * `https://<your-project-ref>.supabase.co`
     * `https://<your-production-domain>` (if deployed)
   * **Authorized redirect URIs**:
     * `https://<your-project-ref>.supabase.co/auth/v1/callback`
4. Copy the generated `Client ID` and `Client Secret`.
5. In **Supabase Dashboard &rarr; Authentication &rarr; Providers &rarr; Google**:
   * Enable Google.
   * Paste `Client ID` and `Client Secret`.
   * Save configuration.

### 3. GitHub Developer Settings
1. Go to [GitHub Developer Settings &rarr; OAuth Apps](https://github.com/settings/developers) and click **New OAuth App**.
2. Fill in the application details:
   * **Application name**: `Student Portal`
   * **Homepage URL**: `http://localhost:3000` (or your production URL)
   * **Authorization callback URL**:
     * `https://<your-project-ref>.supabase.co/auth/v1/callback`
3. Click **Register application**.
4. Generate a **Client Secret**.
5. In **Supabase Dashboard &rarr; Authentication &rarr; Providers &rarr; GitHub**:
   * Enable GitHub.
   * Paste `Client ID` and `Client Secret`.
   * Save configuration.

> [!IMPORTANT]
> Never store Google or GitHub Client Secrets in `.env.local`, client code, or version control. OAuth secrets reside exclusively in the Supabase Dashboard.

---

## 🌐 Production Deployment

The project is configured for continuous zero-downtime deployments using **Vercel**:

1. Push your changes to the `main` branch on GitHub.
2. Link your GitHub repository in the **Vercel Dashboard**.
3. Under **Project Settings &rarr; Environment Variables**, add:
   * `NEXT_PUBLIC_SUPABASE_URL`
   * `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
4. Trigger deployment. Every subsequent push automatically builds and updates the live production site.

---

## 📊 Development Status

* **Supabase Migration**: Complete. All mock data (`lib/mockData.ts`) and legacy local storage dependencies have been cleanly decoupled and removed.
* **Architecture**: Fully relational and unified across Dashboard, Profile, Analytics, Assignments, and Announcements.
* **Production Validation**: Clean build passing with zero ESLint warnings, strict TypeScript compilation, and zero formatting issues (`npm run build` &rarr; exit code 0).

---

## 🔮 Future Enhancements

* **Faculty & Administrator Portal**: Role-based access control allowing professors to post grades, manage syllabus deadlines, and broadcast department announcements.
* **Interactive Timetable**: Dynamic daily and weekly lecture scheduling with room allocations.
* **Notification Engine**: Email and in-app alerts for impending assignment deadlines and attendance threshold warnings.
* **Document Management**: File upload integration via Supabase Storage for assignment lab report submissions.
* **Predictive CGPA Calculator**: What-if GPA simulator assisting students in target grade forecasting.

---

## 👨‍💻 Author

**Aneesh Kashyap K S**  
*Department of Computer Science & Engineering*  
[GitHub Profile](https://github.com/aneeshkashyap)
