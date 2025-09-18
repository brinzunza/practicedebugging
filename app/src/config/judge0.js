// Judge0 API Configuration
export const JUDGE0_CONFIG = {
  // Using the free public instance - for production, consider self-hosting or paid plan
  baseURL: import.meta.env.VITE_JUDGE0_URL || 'https://judge0-ce.p.rapidapi.com',

  // RapidAPI headers (free tier: 50 requests/day)
  headers: {
    'Content-Type': 'application/json',
    'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
    'x-rapidapi-key': import.meta.env.VITE_RAPIDAPI_KEY || 'DEMO_KEY'
  },

  // Language IDs for Judge0 (only compiled languages)
  languageIds: {
    'c': 50,           // C (GCC 9.2.0)
    'cpp': 54,         // C++ (GCC 9.2.0)
    'c++': 54,
    'java': 62         // Java (OpenJDK 13.0.1)
    // Note: Python and JavaScript use original implementations (Pyodide/V8)
  },

  // Execution limits
  limits: {
    timeLimit: 2,      // 2 seconds
    memoryLimit: 128000, // 128MB
    maxOutputSize: 1024  // 1KB
  }
}

// Fallback configuration for when Judge0 is unavailable
export const FALLBACK_CONFIG = {
  useSimulation: true,
  simulationMessage: '[Real execution unavailable - using simulation]'
}