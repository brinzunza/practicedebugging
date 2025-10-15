import { loadPyodide } from 'pyodide'
import { judge0Service } from '../services/judge0Service.js'

class CodeExecutor {
  constructor() {
    this.pyodide = null
    this.pyodideLoading = false
  }

  async initPyodide() {
    if (this.pyodide) return this.pyodide
    if (this.pyodideLoading) {
      // Wait for existing load to complete
      while (this.pyodideLoading) {
        await new Promise(resolve => setTimeout(resolve, 100))
      }
      return this.pyodide
    }

    this.pyodideLoading = true
    try {
      this.pyodide = await loadPyodide({
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.28.2/full/'
      })
      console.log('Pyodide loaded successfully')
    } catch (error) {
      console.error('Failed to load Pyodide:', error)
      throw error
    } finally {
      this.pyodideLoading = false
    }
    return this.pyodide
  }

  async executePython(code) {
    try {
      const pyodide = await this.initPyodide()

      // Capture stdout
      pyodide.runPython(`
import sys
from io import StringIO
import contextlib

captured_output = StringIO()
`)

      // Execute the user code with captured output
      pyodide.runPython(`
try:
    with contextlib.redirect_stdout(captured_output):
        with contextlib.redirect_stderr(captured_output):
            exec("""${code.replace(/"/g, '\\"').replace(/\n/g, '\\n')}""")
    output = captured_output.getvalue()
except Exception as e:
    output = f"Error: {str(e)}"
`)

      const result = pyodide.globals.get('output')
      return result || '(No output)'
    } catch (error) {
      return `Execution Error: ${error.message}`
    }
  }

  async executeJavaScript(code) {
    try {
      // Capture console output
      const originalLog = console.log
      const originalError = console.error
      const outputs = []

      console.log = (...args) => {
        outputs.push(args.join(' '))
      }
      console.error = (...args) => {
        outputs.push('Error: ' + args.join(' '))
      }

      // Execute the code
      try {
        const result = eval(code)
        if (result !== undefined) {
          outputs.push(String(result))
        }
      } catch (error) {
        outputs.push(`Error: ${error.message}`)
      }

      // Restore console
      console.log = originalLog
      console.error = originalError

      return outputs.length > 0 ? outputs.join('\n') : '(No output)'
    } catch (error) {
      return `Execution Error: ${error.message}`
    }
  }

  async executeJava(code) {
    try {
      console.log('Executing Java code via Judge0...')

      // Check if Judge0 is available
      if (judge0Service.isAvailable) {
        await judge0Service.healthCheck()
      }

      const output = await judge0Service.executeCode(code, 'java')
      console.log('Java execution successful:', output)
      return output
    } catch (error) {
      console.warn('Java execution failed:', error.message)
      return 'Not executed!'
    }
  }

  normalizeOutput(output) {
    return output
      .trim()
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .replace(/\s+$/gm, '')
  }

  async executeCode(code, language) {
    try {
      const lang = language.toLowerCase()

      switch (lang) {
        case 'python':
          const pythonOutput = await this.executePython(code)
          return this.normalizeOutput(pythonOutput)

        case 'javascript':
        case 'js':
          const jsOutput = await this.executeJavaScript(code)
          return this.normalizeOutput(jsOutput)

        case 'java':
          return await this.executeJava(code)

        default:
          return `Execution not supported for language: ${language}`
      }
    } catch (error) {
      return `Execution failed: ${error.message}`
    }
  }

  normalizeCode(code) {
    return code
      .replace(/\/\/.*$/gm, '')
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/#.*$/gm, '')
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase()
  }

  detectCheating(userCode, buggyCode, expectedOutput) {
    // Remove comments and normalize
    const normalizedUser = this.normalizeCode(userCode)
    const normalizedExpected = expectedOutput.toLowerCase().trim()

    // Check for hardcoded output
    if (normalizedUser.includes(`"${normalizedExpected}"`) ||
        normalizedUser.includes(`'${normalizedExpected}'`) ||
        normalizedUser.includes(`print("${normalizedExpected}")`) ||
        normalizedUser.includes(`print('${normalizedExpected}')`)) {
      return {
        isCheating: true,
        patterns: ['Hardcoded output detected']
      }
    }

    return { isCheating: false, patterns: [] }
  }

  async validateOutput(userCode, language, expectedOutput, buggyCode = '', fixedCode = '') {
    try {
      // Execute the user's code
      const actualOutput = await this.executeCode(userCode, language)
      const normalizedActual = this.normalizeOutput(actualOutput)
      const normalizedExpected = this.normalizeOutput(expectedOutput)

      // Check if this is the original buggy code
      if (this.normalizeCode(userCode) === this.normalizeCode(buggyCode)) {
        return {
          isCorrect: false,
          hasError: false,
          isCheating: false,
          actualOutput,
          message: 'This is the original buggy code. You need to fix the bug first!'
        }
      }

      // Handle execution failures
      if (actualOutput === 'Not executed!') {
        return {
          isCorrect: false,
          hasError: true,
          isCheating: false,
          actualOutput,
          message: 'Code execution failed. Check Judge0 API configuration or try again.'
        }
      }

      // Check for execution errors
      const hasError = actualOutput.includes('Error:') || actualOutput.includes('Exception')

      // Check if output matches
      const isCorrect = normalizedActual === normalizedExpected && !hasError

      // Anti-cheating check
      const cheatingCheck = this.detectCheating(userCode, buggyCode, expectedOutput)

      if (isCorrect && cheatingCheck.isCheating) {
        return {
          isCorrect: false,
          hasError: false,
          isCheating: true,
          actualOutput,
          cheatingPatterns: cheatingCheck.patterns,
          message: 'Solution appears to bypass the actual debugging task. Please fix the underlying logic issue.'
        }
      }

      return {
        isCorrect,
        hasError,
        isCheating: false,
        actualOutput,
        normalizedActual,
        normalizedExpected,
        message: isCorrect
          ? 'Output matches expected result!'
          : hasError
            ? 'Code execution failed with errors'
            : 'Output does not match expected result'
      }
    } catch (error) {
      return {
        isCorrect: false,
        hasError: true,
        isCheating: false,
        actualOutput: `Execution failed: ${error.message}`,
        message: `Validation failed: ${error.message}`
      }
    }
  }
}

// Create singleton instance
const codeExecutor = new CodeExecutor()
export default codeExecutor
