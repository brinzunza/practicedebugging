import { JUDGE0_CONFIG, FALLBACK_CONFIG } from '../config/judge0.js'

export class Judge0Service {
  constructor() {
    this.baseURL = JUDGE0_CONFIG.baseURL
    this.headers = JUDGE0_CONFIG.headers
    this.isAvailable = true
    this.dailyExecutions = this.loadExecutionCount()
  }

  loadExecutionCount() {
    const today = new Date().toDateString()
    const stored = localStorage.getItem('judge0_executions')

    if (stored) {
      const data = JSON.parse(stored)
      if (data.date === today) {
        return data.count
      }
    }

    // Reset count for new day
    this.saveExecutionCount(0)
    return 0
  }

  saveExecutionCount(count) {
    const today = new Date().toDateString()
    localStorage.setItem('judge0_executions', JSON.stringify({
      date: today,
      count: count
    }))
    this.dailyExecutions = count
  }

  incrementExecutionCount() {
    this.saveExecutionCount(this.dailyExecutions + 1)
  }

  getRemainingExecutions() {
    return Math.max(0, 50 - this.dailyExecutions) // Free tier limit
  }

  async executeCode(code, language) {
    // Check if API key is available
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
      // Step 1: Submit the code for execution
      const submissionResponse = await this.submitCode(code, languageId)

      if (!submissionResponse.token) {
        throw new Error('Failed to get submission token from Judge0')
      }

      const token = submissionResponse.token

      // Step 2: Wait for execution to complete and get result
      const result = await this.getExecutionResult(token)

      // Increment execution count on successful execution
      this.incrementExecutionCount()

      return this.formatOutput(result)
    } catch (error) {
      console.error('Judge0 execution failed:', error)

      // Mark as unavailable for certain errors
      if (error.message.includes('401') || error.message.includes('403') ||
          error.message.includes('429') || error.message.includes('API key')) {
        this.isAvailable = false
      }

      throw error
    }
  }

  async submitCode(code, languageId) {
    console.log('Submitting code to Judge0:', { code: code.substring(0, 100) + '...', languageId })

    const submission = {
      source_code: btoa(code), // Base64 encode as per Judge0 API spec
      language_id: languageId,
      cpu_time_limit: JUDGE0_CONFIG.limits.timeLimit,
      memory_limit: JUDGE0_CONFIG.limits.memoryLimit
    }

    console.log('Submission payload:', submission)

    const response = await fetch(`${this.baseURL}/submissions?base64_encoded=true`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(submission)
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Judge0 submission error:', response.status, errorText)
      throw new Error(`Judge0 submission failed: ${response.status} ${errorText}`)
    }

    const result = await response.json()
    console.log('Submission response:', result)
    return result
  }

  async getExecutionResult(token, maxAttempts = 10) {
    console.log(`Getting execution result for token: ${token}`)

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const response = await fetch(`${this.baseURL}/submissions/${token}?base64_encoded=true`, {
        headers: this.headers
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Failed to get execution result:', response.status, errorText)
        throw new Error(`Failed to get execution result: ${response.status}`)
      }

      const result = await response.json()
      console.log(`Attempt ${attempt + 1}:`, result)

      // Check if execution is complete
      if (result.status && result.status.id >= 3) {
        console.log('Execution completed:', result)
        return result
      }

      console.log(`Execution not complete, waiting... (attempt ${attempt + 1}/${maxAttempts})`)
      // Wait before next attempt (exponential backoff)
      await this.sleep(Math.min(1000 * Math.pow(1.5, attempt), 5000))
    }

    throw new Error('Execution timeout - code took too long to run')
  }

  safeBase64Decode(str) {
    if (!str || typeof str !== 'string') {
      return ''
    }

    // First check if it looks like base64 (contains only valid base64 characters)
    const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/
    if (!base64Regex.test(str)) {
      console.log('String does not look like base64, returning as-is')
      return str // Not base64, return as-is
    }

    try {
      const decoded = atob(str)
      // Check if decoded result makes sense (printable characters)
      if (decoded.length > 0 && /[\x20-\x7E\n\r\t]/.test(decoded)) {
        return decoded
      } else {
        console.log('Decoded base64 contains non-printable characters, returning original')
        return str
      }
    } catch (error) {
      console.warn('Base64 decode failed, returning raw string:', error)
      return str // Return the raw string if decoding fails
    }
  }

  formatOutput(result) {
    const status = result.status
    let output = ''

    console.log('Judge0 result:', result) // Debug logging

    // Handle different execution statuses
    switch (status.id) {
      case 3: // Accepted
        output = this.safeBase64Decode(result.stdout)
        break
      case 4: // Wrong Answer (shouldn't happen in our context, but treat as success)
        output = this.safeBase64Decode(result.stdout)
        break
      case 5: // Time Limit Exceeded
        output = `Time Limit Exceeded\n${this.safeBase64Decode(result.stdout)}`
        break
      case 6: // Compilation Error
        output = `Compilation Error:\n${this.safeBase64Decode(result.compile_output) || 'Unknown compilation error'}`
        break
      case 7: // Runtime Error (SIGSEGV)
      case 8: // Runtime Error (SIGXFSZ)
      case 9: // Runtime Error (SIGFPE)
      case 10: // Runtime Error (SIGABRT)
      case 11: // Runtime Error (NZEC)
      case 12: // Runtime Error (Other)
        const stderr = this.safeBase64Decode(result.stderr)
        const stdout = this.safeBase64Decode(result.stdout)
        output = stdout + (stderr ? `\n${stderr}` : '')
        break
      case 13: // Internal Error
        output = 'Internal execution error occurred'
        break
      case 14: // Exec Format Error
        output = 'Executable format error'
        break
      default:
        output = this.safeBase64Decode(result.stdout) || 'Unknown execution result'
    }

    return output.trim()
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // Check if Judge0 service is working
  async healthCheck() {
    try {
      console.log('Testing Judge0 connection...')
      const response = await fetch(`${this.baseURL}/about`, {
        headers: this.headers
      })

      if (response.ok) {
        const data = await response.json()
        console.log('Judge0 connection successful:', data)
        this.isAvailable = true
      } else {
        console.error('Judge0 health check failed:', response.status, response.statusText)
        const errorText = await response.text()
        console.error('Error response:', errorText)
        this.isAvailable = false
      }

      return this.isAvailable
    } catch (error) {
      console.error('Judge0 health check failed:', error)
      this.isAvailable = false
      return false
    }
  }

  // Get supported languages
  async getSupportedLanguages() {
    try {
      const response = await fetch(`${this.baseURL}/languages`, {
        headers: this.headers
      })
      if (response.ok) {
        return await response.json()
      }
    } catch (error) {
      console.error('Failed to get supported languages:', error)
    }
    return []
  }
}

// Singleton instance
export const judge0Service = new Judge0Service()