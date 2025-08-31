import { supabase } from './supabase'

// Types for our database operations
export interface Student {
  id: string
  name: string
  email: string
  phone?: string | null
  education_level?: string | null
  motivation?: string | null
  status: 'pending' | 'active' | 'inactive' | 'suspended'
  registration_date: string
  last_login?: string
  created_at: string
  updated_at: string
}

export interface Material {
  id: string
  title: string
  description?: string | null
  section_name?: string | null
  file_url?: string | null
  file_type?: string | null
  file_size?: number | null
  youtube_link?: string | null
  category?: string | null
  tags?: string[] | null
  is_public: boolean
  download_count: number
  created_at: string
  updated_at: string
}

export interface Exam {
  id: string
  title: string
  description?: string
  difficulty: 'easy' | 'medium' | 'hard'
  duration: number
  status: 'draft' | 'active' | 'completed' | 'archived'
  start_date?: string
  end_date?: string
  passing_score: number
  attempts_allowed: number
  show_results: boolean
  allow_review: boolean
  randomize_questions: boolean
  time_limit: boolean
  created_at: string
  updated_at: string
}

export interface Question {
  id: string
  exam_id: string
  question_text: string
  question_type: 'multiple_choice' | 'true_false'
  points: number
  order_index: number
  time_limit?: number
  created_at: string
  options?: QuestionOption[]
}

export interface QuestionOption {
  id: string
  question_id: string
  option_text: string
  is_correct: boolean
  order_index: number
  created_at: string
}

export interface ExamAttempt {
  id: string
  exam_id: string
  student_id: string
  start_time: string
  end_time?: string
  score?: number
  max_score?: number
  percentage?: number
  is_passed?: boolean
  attempt_number: number
  status: 'in_progress' | 'completed' | 'abandoned'
  created_at: string
}

export interface ActivityLog {
  id: string
  action_type: string
  description: string
  user_id?: string
  related_entity_type?: string
  related_entity_id?: string
  metadata?: Record<string, unknown>
  created_at: string
}

// Dashboard Statistics
export interface DashboardStats {
  totalStudents: number
  totalExams: number
  pendingStudents: number
  totalMaterials: number
  activeExams: number
  completedExams: number
  averageScore: number
}

// Database Service Class
export class DatabaseService {
  // Students
  static async getStudents(): Promise<Student[]> {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  static async getPendingStudents(): Promise<Student[]> {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  static async createStudent(studentData: Partial<Student>): Promise<Student> {
    const { data, error } = await supabase
      .from('students')
      .insert([studentData])
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async updateStudent(id: string, updates: Partial<Student>): Promise<Student> {
    const { data, error } = await supabase
      .from('students')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async deleteStudent(id: string): Promise<void> {
    const { error } = await supabase
      .from('students')
      .delete()
      .eq('id', id)

    if (error) throw error
  }

  static async approveStudent(id: string): Promise<Student> {
    return this.updateStudent(id, { status: 'active' })
  }

  static async rejectStudent(id: string): Promise<void> {
    await this.deleteStudent(id)
  }

  // Materials
  static async getMaterials(): Promise<Material[]> {
    const { data, error } = await supabase
      .from('materials')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  static async createMaterial(materialData: Partial<Material>): Promise<Material> {
    const { data, error } = await supabase
      .from('materials')
      .insert([materialData])
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async updateMaterial(id: string, updates: Partial<Material>): Promise<Material> {
    const { data, error } = await supabase
      .from('materials')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async deleteMaterial(id: string): Promise<void> {
    const { error } = await supabase
      .from('materials')
      .delete()
      .eq('id', id)

    if (error) throw error
  }

  // Exams
  static async getExams(): Promise<Exam[]> {
    const { data, error } = await supabase
      .from('exams')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  static async createExam(examData: Partial<Exam>): Promise<Exam> {
    const { data, error } = await supabase
      .from('exams')
      .insert([examData])
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async updateExam(id: string, updates: Partial<Exam>): Promise<Exam> {
    const { data, error } = await supabase
      .from('exams')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async deleteExam(id: string): Promise<void> {
    const { error } = await supabase
      .from('exams')
      .delete()
      .eq('id', id)

    if (error) throw error
  }

  // Questions
  static async getQuestions(examId: string): Promise<Question[]> {
    const { data, error } = await supabase
      .from('questions')
      .select(`
        *,
        options:question_options(*)
      `)
      .eq('exam_id', examId)
      .order('order_index', { ascending: true })

    if (error) throw error
    return data || []
  }

  static async createQuestion(questionData: Partial<Question>): Promise<Question> {
    const { data, error } = await supabase
      .from('questions')
      .insert([questionData])
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async createQuestionOption(optionData: Partial<QuestionOption>): Promise<QuestionOption> {
    const { data, error } = await supabase
      .from('question_options')
      .insert([optionData])
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Exam Attempts
  static async getExamAttempts(examId?: string): Promise<ExamAttempt[]> {
    let query = supabase
      .from('exam_attempts')
      .select(`
        *,
        student:students(name, email),
        exam:exams(title)
      `)
      .order('created_at', { ascending: false })

    if (examId) {
      query = query.eq('exam_id', examId)
    }

    const { data, error } = await query
    if (error) throw error
    return data || []
  }

  // Dashboard Statistics
  static async getDashboardStats(): Promise<DashboardStats> {
    // Get counts
    const [studentsResult, examsResult, materialsResult, attemptsResult] = await Promise.all([
      supabase.from('students').select('id', { count: 'exact' }),
      supabase.from('exams').select('id', { count: 'exact' }),
      supabase.from('materials').select('id', { count: 'exact' }),
      supabase.from('exam_attempts').select('percentage')
    ])

    const pendingStudentsResult = await supabase
      .from('students')
      .select('id', { count: 'exact' })
      .eq('status', 'pending')

    const activeExamsResult = await supabase
      .from('exams')
      .select('id', { count: 'exact' })
      .eq('status', 'active')

    const completedExamsResult = await supabase
      .from('exams')
      .select('id', { count: 'exact' })
      .eq('status', 'completed')

    // Calculate average score
    const attempts = attemptsResult.data || []
    const averageScore = attempts.length > 0
      ? attempts.reduce((sum, attempt) => sum + (attempt.percentage || 0), 0) / attempts.length
      : 0

    return {
      totalStudents: studentsResult.count || 0,
      totalExams: examsResult.count || 0,
      pendingStudents: pendingStudentsResult.count || 0,
      totalMaterials: materialsResult.count || 0,
      activeExams: activeExamsResult.count || 0,
      completedExams: completedExamsResult.count || 0,
      averageScore: Math.round(averageScore)
    }
  }

  // Activity Log
  static async logActivity(activity: Partial<ActivityLog>): Promise<ActivityLog> {
    const { data, error } = await supabase
      .from('activity_log')
      .insert([activity])
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async getRecentActivity(limit: number = 10): Promise<ActivityLog[]> {
    const { data, error } = await supabase
      .from('activity_log')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data || []
  }

  // File Upload
  static async uploadFile(file: File, path: string): Promise<string> {
    const { data, error } = await supabase.storage
      .from('materials')
      .upload(path, file)

    if (error) throw error

    const { data: urlData } = supabase.storage
      .from('materials')
      .getPublicUrl(data.path)

    return urlData.publicUrl
  }

  static async deleteFile(path: string): Promise<void> {
    const { error } = await supabase.storage
      .from('materials')
      .remove([path])

    if (error) throw error
  }
}
