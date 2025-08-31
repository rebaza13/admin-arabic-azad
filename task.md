# Arabic Learning Management System - Development Guide

## Table of Contents
1. [Database Setup](#database-setup)
2. [Authentication & Users](#authentication--users)
3. [Students Management](#students-management)
4. [Teachers Management](#teachers-management)
5. [Exams Management](#exams-management)
6. [Materials Management](#materials-management)
7. [Results & Analytics](#results--analytics)
8. [Frontend Integration](#frontend-integration)
9. [Deployment](#deployment)

---

## Database Setup

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Note down your project URL and anon key

### 2. Enable Required Extensions
```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable Row Level Security
-- (Already enabled by default in Supabase)
```

### 3. Create Database Tables

#### Users Table (extends Supabase auth.users)
```sql
-- Create custom user profiles table
CREATE TABLE public.user_profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'teacher', 'admin')),
    phone VARCHAR(20),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_profiles_updated_at 
    BEFORE UPDATE ON public.user_profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

#### Teachers Table
```sql
CREATE TABLE public.teachers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    specialization VARCHAR(255),
    bio TEXT,
    experience_years INTEGER DEFAULT 0,
    hourly_rate DECIMAL(10,2) DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TRIGGER update_teachers_updated_at 
    BEFORE UPDATE ON public.teachers 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

#### Students Table
```sql
CREATE TABLE public.students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    teacher_id UUID REFERENCES public.teachers(id) ON DELETE SET NULL,
    education_level VARCHAR(100),
    motivation TEXT,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'inactive', 'suspended')),
    registration_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TRIGGER update_students_updated_at 
    BEFORE UPDATE ON public.students 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

#### Exams Table
```sql
CREATE TABLE public.exams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    teacher_id UUID REFERENCES public.teachers(id) ON DELETE CASCADE,
    difficulty VARCHAR(50) DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
    duration INTEGER NOT NULL, -- in minutes
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'completed', 'archived')),
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    passing_score INTEGER DEFAULT 60,
    attempts_allowed INTEGER DEFAULT 1,
    show_results BOOLEAN DEFAULT true,
    allow_review BOOLEAN DEFAULT true,
    randomize_questions BOOLEAN DEFAULT false,
    time_limit BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TRIGGER update_exams_updated_at 
    BEFORE UPDATE ON public.exams 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

#### Questions Table
```sql
CREATE TABLE public.questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exam_id UUID REFERENCES public.exams(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    question_type VARCHAR(50) DEFAULT 'multiple_choice' CHECK (question_type IN ('multiple_choice', 'true_false', 'essay')),
    points INTEGER DEFAULT 1,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Question Options Table
```sql
CREATE TABLE public.question_options (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question_id UUID REFERENCES public.questions(id) ON DELETE CASCADE,
    option_text TEXT NOT NULL,
    is_correct BOOLEAN DEFAULT false,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Materials Table
```sql
CREATE TABLE public.materials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    teacher_id UUID REFERENCES public.teachers(id) ON DELETE CASCADE,
    file_url TEXT,
    file_type VARCHAR(50),
    file_size INTEGER, -- in bytes
    category VARCHAR(100),
    tags TEXT[],
    is_public BOOLEAN DEFAULT false,
    download_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TRIGGER update_materials_updated_at 
    BEFORE UPDATE ON public.materials 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

#### Exam Attempts Table
```sql
CREATE TABLE public.exam_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exam_id UUID REFERENCES public.exams(id) ON DELETE CASCADE,
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
    start_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_time TIMESTAMP WITH TIME ZONE,
    score INTEGER,
    max_score INTEGER,
    percentage DECIMAL(5,2),
    is_passed BOOLEAN,
    attempt_number INTEGER DEFAULT 1,
    status VARCHAR(50) DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'abandoned')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Student Answers Table
```sql
CREATE TABLE public.student_answers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    attempt_id UUID REFERENCES public.exam_attempts(id) ON DELETE CASCADE,
    question_id UUID REFERENCES public.questions(id) ON DELETE CASCADE,
    selected_option_id UUID REFERENCES public.question_options(id) ON DELETE SET NULL,
    answer_text TEXT, -- for essay questions
    is_correct BOOLEAN,
    points_earned INTEGER DEFAULT 0,
    answered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## Row Level Security (RLS) Policies

### Enable RLS on all tables
```sql
-- Enable RLS on all tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_answers ENABLE ROW LEVEL SECURITY;
```

### User Profiles Policies
```sql
-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON public.user_profiles
    FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON public.user_profiles
    FOR UPDATE USING (auth.uid() = id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles" ON public.user_profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );
```

### Teachers Policies
```sql
-- Teachers can view their own data
CREATE POLICY "Teachers can view own data" ON public.teachers
    FOR SELECT USING (user_id = auth.uid());

-- Teachers can update their own data
CREATE POLICY "Teachers can update own data" ON public.teachers
    FOR UPDATE USING (user_id = auth.uid());

-- Admins can view all teachers
CREATE POLICY "Admins can view all teachers" ON public.teachers
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );
```

### Students Policies
```sql
-- Students can view their own data
CREATE POLICY "Students can view own data" ON public.students
    FOR SELECT USING (user_id = auth.uid());

-- Teachers can view their assigned students
CREATE POLICY "Teachers can view assigned students" ON public.students
    FOR SELECT USING (
        teacher_id IN (
            SELECT id FROM public.teachers WHERE user_id = auth.uid()
        )
    );

-- Admins can view all students
CREATE POLICY "Admins can view all students" ON public.students
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );
```

### Exams Policies
```sql
-- Teachers can view their own exams
CREATE POLICY "Teachers can view own exams" ON public.exams
    FOR SELECT USING (
        teacher_id IN (
            SELECT id FROM public.teachers WHERE user_id = auth.uid()
        )
    );

-- Teachers can manage their own exams
CREATE POLICY "Teachers can manage own exams" ON public.exams
    FOR ALL USING (
        teacher_id IN (
            SELECT id FROM public.teachers WHERE user_id = auth.uid()
        )
    );

-- Students can view active exams
CREATE POLICY "Students can view active exams" ON public.exams
    FOR SELECT USING (status = 'active');

-- Admins can view all exams
CREATE POLICY "Admins can view all exams" ON public.exams
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );
```

### Questions & Options Policies
```sql
-- Teachers can manage questions for their exams
CREATE POLICY "Teachers can manage questions" ON public.questions
    FOR ALL USING (
        exam_id IN (
            SELECT id FROM public.exams 
            WHERE teacher_id IN (
                SELECT id FROM public.teachers WHERE user_id = auth.uid()
            )
        )
    );

-- Students can view questions for active exams
CREATE POLICY "Students can view questions" ON public.questions
    FOR SELECT USING (
        exam_id IN (
            SELECT id FROM public.exams WHERE status = 'active'
        )
    );

-- Similar policies for question_options
CREATE POLICY "Teachers can manage options" ON public.question_options
    FOR ALL USING (
        question_id IN (
            SELECT id FROM public.questions 
            WHERE exam_id IN (
                SELECT id FROM public.exams 
                WHERE teacher_id IN (
                    SELECT id FROM public.teachers WHERE user_id = auth.uid()
                )
            )
        )
    );

CREATE POLICY "Students can view options" ON public.question_options
    FOR SELECT USING (
        question_id IN (
            SELECT id FROM public.questions 
            WHERE exam_id IN (
                SELECT id FROM public.exams WHERE status = 'active'
            )
        )
    );
```

### Materials Policies
```sql
-- Teachers can manage their own materials
CREATE POLICY "Teachers can manage own materials" ON public.materials
    FOR ALL USING (
        teacher_id IN (
            SELECT id FROM public.teachers WHERE user_id = auth.uid()
        )
    );

-- Students can view public materials and materials from their teacher
CREATE POLICY "Students can view materials" ON public.materials
    FOR SELECT USING (
        is_public = true OR 
        teacher_id IN (
            SELECT teacher_id FROM public.students WHERE user_id = auth.uid()
        )
    );
```

### Exam Attempts Policies
```sql
-- Students can view their own attempts
CREATE POLICY "Students can view own attempts" ON public.exam_attempts
    FOR SELECT USING (
        student_id IN (
            SELECT id FROM public.students WHERE user_id = auth.uid()
        )
    );

-- Students can create attempts for active exams
CREATE POLICY "Students can create attempts" ON public.exam_attempts
    FOR INSERT WITH CHECK (
        student_id IN (
            SELECT id FROM public.students WHERE user_id = auth.uid()
        ) AND
        exam_id IN (
            SELECT id FROM public.exams WHERE status = 'active'
        )
    );

-- Teachers can view attempts for their exams
CREATE POLICY "Teachers can view attempts" ON public.exam_attempts
    FOR SELECT USING (
        exam_id IN (
            SELECT id FROM public.exams 
            WHERE teacher_id IN (
                SELECT id FROM public.teachers WHERE user_id = auth.uid()
            )
        )
    );
```

---

## Database Functions

### Create User Profile Function
```sql
-- Function to automatically create user profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (id, name, email, role)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'name', 'User'),
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'role', 'student')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function when a new user signs up
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### Get Student Statistics Function
```sql
CREATE OR REPLACE FUNCTION public.get_student_stats(student_uuid UUID)
RETURNS TABLE (
    total_exams_taken INTEGER,
    average_score DECIMAL(5,2),
    total_materials_downloaded INTEGER,
    last_activity TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(DISTINCT ea.exam_id)::INTEGER as total_exams_taken,
        AVG(ea.percentage)::DECIMAL(5,2) as average_score,
        (SELECT COUNT(*) FROM public.materials m 
         WHERE m.download_count > 0)::INTEGER as total_materials_downloaded,
        MAX(ea.created_at) as last_activity
    FROM public.exam_attempts ea
    WHERE ea.student_id = (
        SELECT id FROM public.students WHERE user_id = student_uuid
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### Get Teacher Statistics Function
```sql
CREATE OR REPLACE FUNCTION public.get_teacher_stats(teacher_uuid UUID)
RETURNS TABLE (
    total_students INTEGER,
    total_exams_created INTEGER,
    total_materials_uploaded INTEGER,
    average_student_score DECIMAL(5,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(DISTINCT s.id)::INTEGER as total_students,
        COUNT(DISTINCT e.id)::INTEGER as total_exams_created,
        COUNT(DISTINCT m.id)::INTEGER as total_materials_uploaded,
        AVG(ea.percentage)::DECIMAL(5,2) as average_student_score
    FROM public.teachers t
    LEFT JOIN public.students s ON s.teacher_id = t.id
    LEFT JOIN public.exams e ON e.teacher_id = t.id
    LEFT JOIN public.materials m ON m.teacher_id = t.id
    LEFT JOIN public.exam_attempts ea ON ea.exam_id = e.id
    WHERE t.user_id = teacher_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## Frontend Integration Steps

### 1. Update Environment Variables
Create `.env.local` file:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. Update Supabase Client Configuration
In `src/lib/supabase.ts`:
```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})
```

### 3. Create Database Service Functions
Create `src/services/database.ts`:
```typescript
import { supabase } from '../lib/supabase'

// User Profile Services
export const userProfileService = {
  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (error) throw error
    return data
  },

  async updateProfile(userId: string, updates: any) {
    const { data, error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()
    
    if (error) throw error
    return data
  }
}

// Students Services
export const studentsService = {
  async getStudents() {
    const { data, error } = await supabase
      .from('students')
      .select(`
        *,
        user_profiles(name, email),
        teachers(user_profiles(name))
      `)
    
    if (error) throw error
    return data
  },

  async createStudent(studentData: any) {
    const { data, error } = await supabase
      .from('students')
      .insert(studentData)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async updateStudent(id: string, updates: any) {
    const { data, error } = await supabase
      .from('students')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async deleteStudent(id: string) {
    const { error } = await supabase
      .from('students')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}

// Exams Services
export const examsService = {
  async getExams() {
    const { data, error } = await supabase
      .from('exams')
      .select(`
        *,
        teachers(user_profiles(name)),
        questions(count)
      `)
    
    if (error) throw error
    return data
  },

  async createExam(examData: any) {
    const { data, error } = await supabase
      .from('exams')
      .insert(examData)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async getExamWithQuestions(examId: string) {
    const { data, error } = await supabase
      .from('exams')
      .select(`
        *,
        questions(
          *,
          question_options(*)
        )
      `)
      .eq('id', examId)
      .single()
    
    if (error) throw error
    return data
  }
}

// Materials Services
export const materialsService = {
  async getMaterials() {
    const { data, error } = await supabase
      .from('materials')
      .select(`
        *,
        teachers(user_profiles(name))
      `)
    
    if (error) throw error
    return data
  },

  async uploadMaterial(materialData: any, file: File) {
    // Upload file to Supabase Storage
    const fileName = `${Date.now()}-${file.name}`
    const { data: fileData, error: fileError } = await supabase.storage
      .from('materials')
      .upload(fileName, file)
    
    if (fileError) throw fileError

    // Create material record
    const { data, error } = await supabase
      .from('materials')
      .insert({
        ...materialData,
        file_url: fileData.path,
        file_type: file.type,
        file_size: file.size
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  }
}
```

### 4. Update Auth Store
Update `src/stores/auth-store.ts`:
```typescript
import { defineStore } from 'pinia'
import { supabase } from '../lib/supabase'
import { userProfileService } from '../services/database'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    profile: null,
    loading: false,
    error: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
    isTeacher: (state) => state.profile?.role === 'teacher',
    isAdmin: (state) => state.profile?.role === 'admin'
  },

  actions: {
    async getCurrentUser() {
      try {
        this.loading = true
        const { data: { user } } = await supabase.auth.getUser()
        
        if (user) {
          this.user = user
          this.profile = await userProfileService.getProfile(user.id)
        }
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },

    async signIn(email: string, password: string) {
      try {
        this.loading = true
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        })
        
        if (error) throw error
        
        this.user = data.user
        this.profile = await userProfileService.getProfile(data.user.id)
        
        return { success: true }
      } catch (error) {
        this.error = error.message
        return { success: false, error: error.message }
      } finally {
        this.loading = false
      }
    },

    async signUp(email: string, password: string, name: string, role: string = 'student') {
      try {
        this.loading = true
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name,
              role
            }
          }
        })
        
        if (error) throw error
        
        return { success: true }
      } catch (error) {
        this.error = error.message
        return { success: false, error: error.message }
      } finally {
        this.loading = false
      }
    },

    async signOut() {
      try {
        await supabase.auth.signOut()
        this.user = null
        this.profile = null
      } catch (error) {
        this.error = error.message
      }
    }
  }
})
```

---

## Storage Setup

### 1. Create Storage Buckets
In Supabase Dashboard > Storage:

1. Create `materials` bucket for teaching materials
2. Create `avatars` bucket for user profile pictures

### 2. Storage Policies
```sql
-- Materials bucket policies
CREATE POLICY "Materials are accessible by authenticated users" ON storage.objects
    FOR SELECT USING (bucket_id = 'materials' AND auth.role() = 'authenticated');

CREATE POLICY "Teachers can upload materials" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'materials' AND 
        auth.uid() IN (
            SELECT user_id FROM public.teachers
        )
    );

-- Avatars bucket policies
CREATE POLICY "Users can view avatars" ON storage.objects
    FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload own avatar" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'avatars' AND 
        auth.uid()::text = (storage.foldername(name))[1]
    );
```

---

## Testing Data

### Insert Sample Data
```sql
-- Insert sample teachers
INSERT INTO public.user_profiles (id, name, email, role) VALUES
('11111111-1111-1111-1111-111111111111', 'أستاذ محمد', 'mohammed@example.com', 'teacher'),
('22222222-2222-2222-2222-222222222222', 'أستاذة سارة', 'sara@example.com', 'teacher');

INSERT INTO public.teachers (user_id, specialization, bio, experience_years) VALUES
('11111111-1111-1111-1111-111111111111', 'النحو والصرف', 'خبرة 10 سنوات في تدريس اللغة العربية', 10),
('22222222-2222-2222-2222-222222222222', 'الأدب العربي', 'متخصصة في الأدب العربي الحديث', 8);

-- Insert sample students
INSERT INTO public.user_profiles (id, name, email, role) VALUES
('33333333-3333-3333-3333-333333333333', 'أحمد محمد علي', 'ahmed@example.com', 'student'),
('44444444-4444-4444-4444-444444444444', 'فاطمة أحمد', 'fatima@example.com', 'student');

INSERT INTO public.students (user_id, teacher_id, education_level, status) VALUES
('33333333-3333-3333-3333-333333333333', 
 (SELECT id FROM public.teachers WHERE user_id = '11111111-1111-1111-1111-111111111111'), 
 'ثانوية عامة', 'active'),
('44444444-4444-4444-4444-444444444444', 
 (SELECT id FROM public.teachers WHERE user_id = '22222222-2222-2222-2222-222222222222'), 
 'جامعة', 'active');
```

---

## Deployment Checklist

### 1. Environment Setup
- [ ] Set up Supabase project
- [ ] Configure environment variables
- [ ] Set up storage buckets
- [ ] Configure RLS policies

### 2. Database Setup
- [ ] Run all SQL scripts
- [ ] Test RLS policies
- [ ] Insert sample data
- [ ] Test database functions

### 3. Frontend Integration
- [ ] Update Supabase client
- [ ] Implement authentication
- [ ] Connect all pages to database
- [ ] Test CRUD operations

### 4. Testing
- [ ] Test user registration/login
- [ ] Test student management
- [ ] Test exam creation/taking
- [ ] Test materials upload/download
- [ ] Test permissions and access control

### 5. Production Deployment
- [ ] Build production version
- [ ] Deploy to hosting platform
- [ ] Configure custom domain
- [ ] Set up SSL certificate
- [ ] Monitor performance and errors

---

## Common Issues & Solutions

### 1. RLS Policy Issues
If you get permission denied errors:
```sql
-- Check if RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- Temporarily disable RLS for testing
ALTER TABLE public.table_name DISABLE ROW LEVEL SECURITY;
```

### 2. Authentication Issues
Make sure your Supabase URL and key are correct in environment variables.

### 3. Storage Issues
Ensure storage buckets are created and policies are set correctly.

### 4. TypeScript Errors
Update your types to match the database schema:
```typescript
// Create types based on your database schema
interface UserProfile {
  id: string
  name: string
  email: string
  role: 'student' | 'teacher' | 'admin'
  // ... other fields
}
```

---

## Next Steps

1. **Follow the guide step by step**
2. **Test each section thoroughly**
3. **Implement error handling**
4. **Add loading states**
5. **Optimize performance**
6. **Add analytics and monitoring**
7. **Implement backup strategies**
8. **Add user feedback system**

This guide provides everything you need to build a complete Arabic Learning Management System. Follow each section carefully and test thoroughly before moving to the next step. 