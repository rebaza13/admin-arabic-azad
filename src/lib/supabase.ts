import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ilsojnzuaaubvcwuaklo.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlsc29qbnp1YWF1YnZjd3Vha2xvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQzNzY3NzksImV4cCI6MjA2OTk1Mjc3OX0.G1FCYPwc76zTQZuWoRbhMw5RqTwwVdVf0wJQe_MJd_A'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
