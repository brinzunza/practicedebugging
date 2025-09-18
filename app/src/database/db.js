const STORAGE_KEYS = {
  QUESTIONS: 'debug_practice_questions',
  PROGRESS: 'debug_practice_progress',
  STATS: 'debug_practice_stats'
}

export function initDatabase() {
  try {
    if (!localStorage.getItem(STORAGE_KEYS.QUESTIONS)) {
      localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify([]))
    }
    if (!localStorage.getItem(STORAGE_KEYS.PROGRESS)) {
      localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify([]))
    }
    if (!localStorage.getItem(STORAGE_KEYS.STATS)) {
      localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify({
        id: 1,
        total_questions_solved: 0,
        total_time_spent: 0,
        easy_solved: 0,
        medium_solved: 0,
        hard_solved: 0,
        streak: 0,
        last_solved_date: null
      }))
    }
    
    console.log('LocalStorage database initialized successfully')
    return true
  } catch (error) {
    console.error('Failed to initialize database:', error)
    throw error
  }
}

export function getDatabase() {
  return {
    questions: () => JSON.parse(localStorage.getItem(STORAGE_KEYS.QUESTIONS) || '[]'),
    progress: () => JSON.parse(localStorage.getItem(STORAGE_KEYS.PROGRESS) || '[]'),
    stats: () => JSON.parse(localStorage.getItem(STORAGE_KEYS.STATS) || '{}'),
    setQuestions: (data) => localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(data)),
    setProgress: (data) => localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(data)),
    setStats: (data) => localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(data))
  }
}

export function clearDatabase() {
  try {
    localStorage.removeItem(STORAGE_KEYS.QUESTIONS)
    localStorage.removeItem(STORAGE_KEYS.PROGRESS)
    localStorage.removeItem(STORAGE_KEYS.STATS)
    console.log('Database cleared successfully')
    return true
  } catch (error) {
    console.error('Failed to clear database:', error)
    return false
  }
}

export function closeDatabase() {
  // No-op for localStorage
}