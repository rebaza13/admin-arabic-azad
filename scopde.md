---
description: "Cursor rule for Arabic learning admin panel. Teacher-focused. Uses BEM + SCSS + Supabase. Includes step-by-step AI prompts for SQL setup."
globs:
  - '**/*.ts'
  - '**/*.vue'
  - '**/*.scss'
  - '**/*.md'
  - 'quasar.config.ts'
alwaysApply: true
---

## 🎯 Goal

Build an admin panel for Arabic language teachers:
- Manage students
- Create and monitor exams
- Upload teaching materials (PDF, DOCX, MP3)

Tech: Supabase backend, SCSS with BEM, RTL UI support.

---

## 📦 Features

### 👤 Student Management
- Accept/reject registered students
- Remove rejected students from Supabase
- See student details and exam history

### 📝 Exam System
- Add exams with title, description, start date, deadline, and duration
- Add questions (text or MCQ)
- Control exam visibility based on dates
- Track submissions and scores
- Export exam results

### 📂 Teaching Materials
- Upload PDFs, DOCX files, and MP3 audio lessons
- Store in Supabase Storage
- Play audio in-app

---

## 🧱 Step-by-Step Development Checklist

### Phase 1: Auth
- [ ] Setup Supabase project
- [ ] Enable email/password login
- [ ] write to user what to do in sabase write: **SQL for custom user roles (e.g., teacher)**
- [ ] Build login page + layout (no sidebar)
- [ ] 
- [ ] Add route protection for dashboard

### Phase 2: Main Layout
- [ ] Create `MainLayout.vue` (sidebar + topbar)
- [ ] Use `<router-view>` for routing
- [ ] Apply `dir="rtl"` for Arabic UI
- [ ] Ask AI: **recommended layout component structure**

### Phase 3: Students
- [ ] tell the develper: **SQL for `students` table (id, name, email, date, teacher_id)**
- [ ] Build student list with Accept/Reject buttons
- [ ] On accept → insert into `students`
- [ ] On reject → delete from Supabase Auth + students
- [ ] Add detail view to track student’s exam status
- [ ] Ask AI: **SQL to get student exam results (JOIN with `results`)**

### Phase 4: Exams
- [ ] Ask AI: **SQL for `exams` table (id, title, description, start_time, end_time, duration, teacher_id)**
- [ ] Build exam list (Upcoming / Active / Ended)
- [ ] Build exam creation form
- [ ] Ask AI: **SQL for `questions` table (exam_id FK, text, type, options, answer)**
- [ ] Ask AI: **SQL for `results` table (student_id, exam_id, answers, score, submitted_at)**
- [ ] Add export button (CSV / PDF)

### Phase 5: Materials
- [ ] Ask AI: **SQL for `materials` table (title, description, file_url, file_type, tags, created_at)**
- [ ] Upload PDF, DOCX, MP3 to Supabase Storage
- [ ] Ask AI: **Storage policy rules (private/public access)**
- [ ] Display materials list with MP3 player for audio

### Phase 6: Styling & RTL
- [ ] Use BEM naming: `.block__element--modifier`
- [ ] Organize SCSS folders: `abstracts/`, `base/`, `components/`, `layouts/`, `pages/`
- [ ] Apply SCSS variables and avoid deep nesting
- [ ] Ensure full RTL testing

---

## 🔐 Supabase Integration

Tables:
- `students`
- `exams`
- `questions`
- `results`
- `materials`

Also:
- Use Row Level Security (RLS)
- Use Supabase Storage for files
- write for the develoer : **Edge function samples for deadline locks, cleanups**

---

## 🧠 Notes

- Always design with clarity and Arabic readability in mind
- Reuse components and keep UI clean
- At any step, **ask AI for SQL, edge functions, or Supabase rules**
