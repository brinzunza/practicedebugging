import { JUDGE0_CONFIG } from '../config/judge0.js'

export class Judge0Service {
  constructor() {
    this.baseURL = JUDGE0_CONFIG.baseURL
    this.headers = JUDGE0_CONFIG.headers
    this.isAvailable = true
  }

  async executeCode(code, language) {
    // Check API key
    if (JUDGE0_CONFIG.headers['x-rapidapi-key'] === 'DEMO_KEY') {
      throw new Error('Judge0 API key not configured. Add VITE_RAPIDAPI_KEY to your .env file.')
    }

    if (!this.isAvailable) {
      throw new Error('Judge0 service is unavailable')
    }

    const languageId = JUDGE0_CONFIG.languageIds[language.toLowerCase()]
    if (!languageId) {
      throw new Error(`Language ${language} not supported by Judge0`)
    }

    try {
      // Submit code
      const submissionResponse = await this.submitCode(code, languageId)
      if (!submissionResponse.token) {
        throw new Error('Failed to get submission token from Judge0')
      }

      // Get result
      const result = await this.getExecutionResult(submissionResponse.token)
      return this.formatOutput(result)
    } catch (error) {
      console.error('Judge0 execution failed:', error)

      // Mark unavailable on auth errors
      if (error.message.includes('401') || error.message.includes('403') ||
          error.message.includes('429') || error.message.includes('API key')) {
        this.isAvailable = false
      }

      throw error
    }
  }

  async submitCode(code, languageId) {
    const submission = {
      source_code: btoa(code),
      language_id: languageId,
      cpu_time_limit: JUDGE0_CONFIG.limits.timeLimit,
      memory_limit: JUDGE0_CONFIG.limits.memoryLimit
    }

    const response = await fetch(`${this.baseURL}/submissions?base64_encoded=true`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(submission)
    })

    if (!response.ok) {
      throw new Error(`Judge0 submission failed: ${response.status}`)
    }

    return await response.json()
  }

  async getExecutionResult(token, maxAttempts = 10) {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const response = await fetch(`${this.baseURL}/submissions/${token}?base64_encoded=true`, {
        headers: this.headers
      })

      if (!response.ok) {
        throw new Error(`Failed to get execution result: ${response.status}`)
      }

      const result = await response.json()

      // Check if complete (status id >= 3)
      if (result.status && result.status.id >= 3) {
        return result
      }

      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, Math.min(1000 * Math.pow(1.5, attempt), 5000)))
    }

    throw new Error('Execution timeout - code took too long to run')
  }

  formatOutput(result) {
    const status = result.status
    const decode = (str) => {
      if (!str) return ''
      try {
        return atob(str)
      } catch {
        return str
      }
    }

    switch (status.id) {
      case 3: // Accepted
      case 4: // Wrong Answer
        return decode(result.stdout).trim()

      case 5: // Time Limit Exceeded
        return `Time Limit Exceeded\n${decode(result.stdout)}`.trim()

      case 6: // Compilation Error
        return `Compilation Error:\n${decode(result.compile_output) || 'Unknown compilation error'}`.trim()

      case 7: case 8: case 9: case 10: case 11: case 12: // Runtime Errors
        const stdout = decode(result.stdout)
        const stderr = decode(result.stderr)
        return (stdout + (stderr ? `\n${stderr}` : '')).trim()

      case 13: // Internal Error
        return 'Internal execution error occurred'

      default:
        return decode(result.stdout) || 'Unknown execution result'
    }
  }

  async healthCheck() {
    try {
      const response = await fetch(`${this.baseURL}/about`, {
        headers: this.headers
      })
      this.isAvailable = response.ok
      return this.isAvailable
    } catch (error) {
      console.error('Judge0 health check failed:', error)
      this.isAvailable = false
      return false
    }
  }
}

// Singleton instance
export const judge0Service = new Judge0Service()
