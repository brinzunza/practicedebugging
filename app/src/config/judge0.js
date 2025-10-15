export const JUDGE0_CONFIG = {
  baseURL: import.meta.env.VITE_JUDGE0_URL || 'https://judge0-ce.p.rapidapi.com',

  headers: {
    'Content-Type': 'application/json',
    'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
    'x-rapidapi-key': import.meta.env.VITE_RAPIDAPI_KEY || 'DEMO_KEY'
  },

  languageIds: {
    'java': 62 // Java (OpenJDK 13.0.1)
  },

  limits: {
    timeLimit: 2,
    memoryLimit: 128000,
    maxOutputSize: 1024
  }
}
