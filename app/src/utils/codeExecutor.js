import { loadPyodide } from 'pyodide'

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

  normalizeOutput(output) {
    // Normalize output for consistent comparison
    return output
      .trim()
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .replace(/\s+$/gm, '') // Remove trailing whitespace from each line
  }

  async executeCode(code, language) {
    try {
      let output
      switch (language.toLowerCase()) {
        case 'python':
          output = await this.executePython(code)
          break
        case 'javascript':
        case 'js':
          output = await this.executeJavaScript(code)
          break
        case 'java':
          return 'Java execution requires a backend server. Showing simulated output instead.'
        case 'sql':
          return 'SQL execution requires a database connection. Showing simulated output instead.'
        default:
          return `Execution not supported for language: ${language}`
      }

      // Normalize the output for consistent testing
      return this.normalizeOutput(output)
    } catch (error) {
      return `Execution failed: ${error.message}`
    }
  }

  detectCheating(userCode, buggyCode, expectedOutput, language) {
    const cheatingPatterns = []

    // Remove comments and normalize whitespace for analysis
    const normalizeForAnalysis = (code) => {
      return code
        .replace(/\/\/.*$/gm, '') // Remove single-line comments
        .replace(/\/\*[\s\S]*?\*\//g, '') // Remove multi-line comments
        .replace(/#.*$/gm, '') // Remove Python comments
        .replace(/\s+/g, ' ')
        .trim()
        .toLowerCase()
    }

    const normalizedUser = normalizeForAnalysis(userCode)
    const normalizedBuggy = normalizeForAnalysis(buggyCode)
    const normalizedExpected = expectedOutput.toLowerCase().trim()


    // Language-specific cheating detection
    if (language.toLowerCase() === 'python') {
      // Check for hardcoded return values
      if (normalizedUser.includes(`return "${normalizedExpected}"`) ||
          normalizedUser.includes(`return '${normalizedExpected}'`)) {
        cheatingPatterns.push('Hardcoded return value detected')
      }
    }

    return {
      isCheating: cheatingPatterns.length > 0,
      patterns: cheatingPatterns
    }
  }

  validateStructuralFix(userCode, buggyCode, fixedCode) {
    // Check if the user's fix is structurally similar to the intended fix
    const normalizeStructure = (code) => {
      return code
        .replace(/\/\/.*$/gm, '')
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/#.*$/gm, '')
        .replace(/\s+/g, ' ')
        .trim()
    }

    const normalizedUser = normalizeStructure(userCode)
    const normalizedBuggy = normalizeStructure(buggyCode)
    const normalizedFixed = normalizeStructure(fixedCode)

    // Calculate similarity to intended fix
    const userChanges = this.getCodeDiff(normalizedBuggy, normalizedUser)
    const intendedChanges = this.getCodeDiff(normalizedBuggy, normalizedFixed)

    // Check if user made similar structural changes as intended
    let structuralSimilarity = 0
    for (const change of intendedChanges) {
      if (userChanges.some(userChange =>
          userChange.type === change.type &&
          userChange.content.includes(change.content.slice(0, 10)))) {
        structuralSimilarity++
      }
    }

    return {
      isStructurallyValid: structuralSimilarity > 0 || intendedChanges.length === 0,
      similarity: intendedChanges.length > 0 ? structuralSimilarity / intendedChanges.length : 1
    }
  }

  getCodeDiff(originalCode, newCode) {
    const originalLines = originalCode.split('\n')
    const newLines = newCode.split('\n')
    const changes = []

    // Simple diff algorithm
    newLines.forEach((line, index) => {
      if (!originalLines.includes(line)) {
        changes.push({ type: 'added', content: line, line: index })
      }
    })

    originalLines.forEach((line, index) => {
      if (!newLines.includes(line)) {
        changes.push({ type: 'removed', content: line, line: index })
      }
    })

    return changes
  }

  async validateOutput(userCode, language, expectedOutput, buggyCode = '', fixedCode = '') {
    try {
      const actualOutput = await this.executeCode(userCode, language)
      const normalizedActual = this.normalizeOutput(actualOutput)
      const normalizedExpected = this.normalizeOutput(expectedOutput)

      const isCorrect = normalizedActual === normalizedExpected
      const hasError = actualOutput.includes('Error:') || actualOutput.includes('Exception')

      // Anti-cheating validation
      const cheatingCheck = this.detectCheating(userCode, buggyCode, expectedOutput, language)
      const structuralCheck = fixedCode ?
        this.validateStructuralFix(userCode, buggyCode, fixedCode) :
        { isStructurallyValid: true, similarity: 1 }

      // If output is correct but cheating is detected
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

      // If output is correct but structural changes are minimal
      if (isCorrect && !structuralCheck.isStructurallyValid && structuralCheck.similarity < 0.3) {
        return {
          isCorrect: false,
          hasError: false,
          isCheating: true,
          actualOutput,
          message: 'Output is correct but the fix doesn\'t address the core logic issue. Please review the bug more carefully.'
        }
      }

      return {
        isCorrect,
        hasError,
        isCheating: false,
        actualOutput,
        normalizedActual,
        normalizedExpected,
        structuralSimilarity: structuralCheck.similarity,
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