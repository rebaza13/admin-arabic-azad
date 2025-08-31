export interface Database {
  public: {
    Tables: {
      students: {
        Row: {
          id: string
          user_id: string | null
          name: string
          email: string
          phone: string | null
          education_level: string | null
          motivation: string | null
          status: 'pending' | 'active' | 'inactive' | 'suspended'
          registration_date: string
          last_login: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          name: string
          email: string
          phone?: string | null
          education_level?: string | null
          motivation?: string | null
          status?: 'pending' | 'active' | 'inactive' | 'suspended'
          registration_date?: string
          last_login?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          name?: string
          email?: string
          phone?: string | null
          education_level?: string | null
          motivation?: string | null
          status?: 'pending' | 'active' | 'inactive' | 'suspended'
          registration_date?: string
          last_login?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      materials: {
        Row: {
          id: string
          title: string
          description: string | null
          section_name: string | null
          file_url: string | null
          file_type: string | null
          file_size: number | null
          youtube_link: string | null
          category: string | null
          tags: string[] | null
          is_public: boolean
          download_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          section_name?: string | null
          file_url?: string | null
          file_type?: string | null
          file_size?: number | null
          youtube_link?: string | null
          category?: string | null
          tags?: string[] | null
          is_public?: boolean
          download_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          section_name?: string | null
          file_url?: string | null
          file_type?: string | null
          file_size?: number | null
          youtube_link?: string | null
          category?: string | null
          tags?: string[] | null
          is_public?: boolean
          download_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      exams: {
        Row: {
          id: string
          title: string
          description: string | null
          difficulty: 'easy' | 'medium' | 'hard'
          duration: number
          status: 'draft' | 'active' | 'completed' | 'archived'
          start_date: string | null
          end_date: string | null
          passing_score: number
          attempts_allowed: number
          show_results: boolean
          allow_review: boolean
          randomize_questions: boolean
          time_limit: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          difficulty?: 'easy' | 'medium' | 'hard'
          duration: number
          status?: 'draft' | 'active' | 'completed' | 'archived'
          start_date?: string | null
          end_date?: string | null
          passing_score?: number
          attempts_allowed?: number
          show_results?: boolean
          allow_review?: boolean
          randomize_questions?: boolean
          time_limit?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          difficulty?: 'easy' | 'medium' | 'hard'
          duration?: number
          status?: 'draft' | 'active' | 'completed' | 'archived'
          start_date?: string | null
          end_date?: string | null
          passing_score?: number
          attempts_allowed?: number
          show_results?: boolean
          allow_review?: boolean
          randomize_questions?: boolean
          time_limit?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      questions: {
        Row: {
          id: string
          exam_id: string
          question_text: string
          question_type: 'multiple_choice' | 'true_false'
          points: number
          order_index: number
          time_limit: number | null
          created_at: string
        }
        Insert: {
          id?: string
          exam_id: string
          question_text: string
          question_type?: 'multiple_choice' | 'true_false'
          points?: number
          order_index?: number
          time_limit?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          exam_id?: string
          question_text?: string
          question_type?: 'multiple_choice' | 'true_false'
          points?: number
          order_index?: number
          time_limit?: number | null
          created_at?: string
        }
      }
      question_options: {
        Row: {
          id: string
          question_id: string
          option_text: string
          is_correct: boolean
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          question_id: string
          option_text: string
          is_correct?: boolean
          order_index?: number
          created_at?: string
        }
        Update: {
          id?: string
          question_id?: string
          option_text?: string
          is_correct?: boolean
          order_index?: number
          created_at?: string
        }
      }
      exam_attempts: {
        Row: {
          id: string
          exam_id: string
          student_id: string
          start_time: string
          end_time: string | null
          score: number | null
          max_score: number | null
          percentage: number | null
          is_passed: boolean | null
          attempt_number: number
          status: 'in_progress' | 'completed' | 'abandoned'
          created_at: string
        }
        Insert: {
          id?: string
          exam_id: string
          student_id: string
          start_time?: string
          end_time?: string | null
          score?: number | null
          max_score?: number | null
          percentage?: number | null
          is_passed?: boolean | null
          attempt_number?: number
          status?: 'in_progress' | 'completed' | 'abandoned'
          created_at?: string
        }
        Update: {
          id?: string
          exam_id?: string
          student_id?: string
          start_time?: string
          end_time?: string | null
          score?: number | null
          max_score?: number | null
          percentage?: number | null
          is_passed?: boolean | null
          attempt_number?: number
          status?: 'in_progress' | 'completed' | 'abandoned'
          created_at?: string
        }
      }
      student_answers: {
        Row: {
          id: string
          attempt_id: string
          question_id: string
          selected_option_id: string | null
          answer_text: string | null
          is_correct: boolean | null
          points_earned: number
          time_spent: number | null
          created_at: string
        }
        Insert: {
          id?: string
          attempt_id: string
          question_id: string
          selected_option_id?: string | null
          answer_text?: string | null
          is_correct?: boolean | null
          points_earned?: number
          time_spent?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          attempt_id?: string
          question_id?: string
          selected_option_id?: string | null
          answer_text?: string | null
          is_correct?: boolean | null
          points_earned?: number
          time_spent?: number | null
          created_at?: string
        }
      }
      activity_log: {
        Row: {
          id: string
          action_type: string
          description: string
          user_id: string | null
          related_entity_type: string | null
          related_entity_id: string | null
          metadata: Record<string, unknown> | null
          created_at: string
        }
        Insert: {
          id?: string
          action_type: string
          description: string
          user_id?: string | null
          related_entity_type?: string | null
          related_entity_id?: string | null
          metadata?: Record<string, unknown> | null
          created_at?: string
        }
        Update: {
          id?: string
          action_type?: string
          description?: string
          user_id?: string | null
          related_entity_type?: string | null
          related_entity_id?: string | null
          metadata?: Record<string, unknown> | null
          created_at?: string
        }
      }
    }
  }
}
