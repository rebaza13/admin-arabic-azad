import { supabase } from './supabase'

export async function testDatabaseConnection() {
  try {
    console.log('Testing database connection...')
    
    // Test basic connection
    const { error } = await supabase
      .from('exams')
      .select('count')
      .limit(1)
    
    if (error) {
      console.error('Database connection error:', error)
      return false
    }
    
    console.log('Database connection successful!')
    return true
  } catch (error) {
    console.error('Database test failed:', error)
    return false
  }
}

export async function checkTablesExist() {
  try {
    const tables = ['exams', 'questions', 'question_options', 'students', 'materials']
    
    for (const table of tables) {
      const { error } = await supabase
        .from(table)
        .select('*')
        .limit(1)
      
      if (error) {
        console.error(`Table ${table} does not exist:`, error)
        return false
      }
      
      console.log(`Table ${table} exists`)
    }
    
    return true
  } catch (error) {
    console.error('Table check failed:', error)
    return false
  }
}
