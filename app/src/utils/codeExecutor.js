import { loadPyodide } from 'pyodide'
import { judge0Service } from '../services/judge0Service.js'
import sqlService from '../services/sqlService.js'

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

  simulateCompiledLanguageOutput(code, language, expectedOutput = null) {
    // This method provides intelligent simulation for compiled languages
    // It determines output based on code similarity to expected patterns

    const normalizedCode = this.normalizeCode(code)
    const lang = language.toLowerCase()

    // Strategy 1: Try to simulate based on code patterns
    if (lang === 'java') {
      return this.simulateJavaOutput(code, expectedOutput)
    }

    if (lang === 'c' || lang === 'cpp' || lang === 'c++') {
      return this.simulateCOutput(code, expectedOutput)
    }

    if (lang === 'sql') {
      return this.simulateSQLOutput(code, expectedOutput)
    }

    // Fallback
    return `[${language.toUpperCase()} execution requires backend - simulated output]`
  }

  simulateJavaOutput(code, expectedOutput = null) {
    // Check for common Java patterns and simulate their output

    // Array bounds errors (buggy code) - show the actual error
    if (code.includes('<=') && code.includes('.length')) {
      return `1
2
3
Exception in thread "main" java.lang.ArrayIndexOutOfBoundsException: Index 3 out of bounds for length 3
	at Main.main(Main.java:4)`
    }

    // Division by zero
    if (code.includes('/ 0') || code.includes('/0')) {
      return 'Exception in thread "main" java.lang.ArithmeticException: / by zero'
    }

    // Integer division (often the bug) - show the actual result
    if (code.includes('/ ') && !code.includes('(double)') && !code.includes('<=')) {
      return '0'  // Integer division result
    }

    // Look for System.out.println patterns for realistic output
    const printMatches = code.match(/System\.out\.println\s*\(\s*([^)]+)\s*\)/g)
    if (printMatches) {
      // Check if this is inside a loop (array iteration)
      const hasForLoop = code.includes('for')
      const hasArrayAccess = /\w+\[i\]/.test(code) // More flexible pattern for arrayName[i]
      const isInLoop = hasForLoop && hasArrayAccess

      if (isInLoop) {
        // Simulate array iteration output
        const content = printMatches[0].match(/\(\s*([^)]+)\s*\)/)[1]

        if (/\w+\[i\]/.test(content)) { // Match any variable name with [i]
          // This is printing array elements - simulate typical array [1, 2, 3]
          if (code.includes('<=') && code.includes('.length')) {
            // Buggy version - shows elements then crashes
            return `1
2
3
Exception in thread "main" java.lang.ArrayIndexOutOfBoundsException: Index 3 out of bounds for length 3
	at Main.main(Main.java:4)`
          } else {
            // Fixed version - shows just the elements
            return `1
2
3`
          }
        }
      }

      // Handle non-loop println statements
      let output = ''
      printMatches.forEach(match => {
        const content = match.match(/\(\s*([^)]+)\s*\)/)[1]
        if (content.includes('"')) {
          // String literal
          const stringContent = content.match(/"([^"]*)"/)?.[1] || ''
          output += stringContent + '\n'
        } else if (content.includes('(double)')) {
          // Cast to double - this is likely the fix, show realistic result
          output += '2.5\n'
        } else if (!isNaN(content.trim())) {
          // Number literal
          output += content.trim() + '\n'
        } else {
          // Variable or expression - try to infer realistic values
          const contextualOutput = this.inferJavaVariableOutput(code, content, expectedOutput)
          output += contextualOutput + '\n'
        }
      })
      return output.trim()
    }

    return '[JAVA execution requires backend - simulated output]'
  }

  isJavaCodeLikelyCorrect(code) {
    // Heuristics to determine if Java code is likely correct
    const hasCorrectArrayBounds = !code.includes('<=') || !code.includes('.length')
    const hasDoubleCasting = code.includes('(double)')
    const hasEqualsComparison = code.includes('.equals(')
    const noObviousErrors = !code.includes('/ 0') && !code.includes('/0')

    return hasCorrectArrayBounds && noObviousErrors && (hasDoubleCasting || hasEqualsComparison || true)
  }

  inferJavaVariableOutput(code, variable, expectedOutput) {
    // Try to infer what a variable should output based on context and expected output

    // Array iteration context - check if we're in a loop with array access
    if ((variable.includes('[i]') || (variable.includes('i') && code.includes('for'))) &&
        /\w+\[i\]/.test(code)) {
      // This is array iteration - generate complete output based on buggy vs fixed code
      if (code.includes('<=') && code.includes('.length')) {
        // Buggy version - shows elements then crashes
        return `1
2
3
Exception in thread "main" java.lang.ArrayIndexOutOfBoundsException: Index 3 out of bounds for length 3
	at Main.main(Main.java:4)`
      } else {
        // Fixed version - shows just the elements
        return `1
2
3`
      }
    }

    // Division context
    if (code.includes('/') && code.includes('(double)')) {
      return '2.5'  // Typical division result
    }

    // Result variable
    if (variable.includes('result')) {
      return '2.5'
    }

    // Index variable
    if (variable.includes('i') || variable === 'i') {
      return '0'
    }

    // If we have expected output, try to extract realistic values
    if (expectedOutput) {
      const expectedNumbers = expectedOutput.match(/[\d.]+/g)
      if (expectedNumbers && expectedNumbers.length > 0) {
        return expectedNumbers[0]
      }

      const expectedLines = expectedOutput.trim().split('\n')
      if (expectedLines.length > 0 && expectedLines[0].trim()) {
        return expectedLines[0].trim()
      }
    }

    // Default realistic fallback
    return '1'
  }

  simulateCOutput(code, expectedOutput = null) {
    // Check for common C patterns and show realistic raw output

    // Buffer overflow - show actual crash
    if (code.includes('strcpy') && !code.includes('strncpy')) {
      return `Buffer: This string is way too long for the buffer
*** buffer overflow detected ***: terminated
Aborted (core dumped)`
    }

    // Array bounds - show actual output with crash
    if (code.includes('<=') && code.match(/\d+/)) {
      return `10 20 30 40 50 0
Segmentation fault (core dumped)`
    }

    // Memory leak (successful but shows leak in valgrind-style output)
    if (code.includes('malloc') && !code.includes('free')) {
      return `Allocated memory block 0
Allocated memory block 1
Allocated memory block 2
Allocated memory block 3
Allocated memory block 4
Done allocating

==1234== HEAP SUMMARY:
==1234==     in use at exit: 2,000 bytes in 5 blocks
==1234==   total heap usage: 5 allocs, 0 frees, 2,000 bytes allocated
==1234==
==1234== 2,000 bytes in 5 blocks are definitely lost in loss record 1 of 1`
    }

    // Look for printf patterns and simulate realistic output
    const printMatches = code.match(/printf\s*\(\s*([^)]+)\s*\)/g)
    if (printMatches) {
      let output = ''
      printMatches.forEach(match => {
        const content = match.match(/\(\s*([^)]+)\s*\)/)[1]
        if (content.includes('"')) {
          const formatString = content.match(/"([^"]*)"/)?.[1] || ''
          let simulated = formatString
            .replace(/\\n/g, '\n')
            .replace(/%d/g, '10')  // Use realistic values instead of 42
            .replace(/%s/g, 'Hello')
            .replace(/%c/g, 'A')
          output += simulated
        }
      })
      return output || 'Program executed successfully'
    }

    // If code looks correct and we have expected output, use it
    const isLikelyCorrect = this.isCCodeLikelyCorrect(code)
    if (isLikelyCorrect && expectedOutput) {
      return expectedOutput
    }

    return '[C execution requires backend - simulated output]'
  }

  isCCodeLikelyCorrect(code) {
    // Heuristics to determine if C code is likely correct
    const hasCorrectArrayBounds = !code.includes('<=') || !code.match(/\d+/)
    const hasStrncpy = code.includes('strncpy')
    const hasFree = !code.includes('malloc') || code.includes('free')
    const noObviousErrors = !code.includes('strcpy') || code.includes('strncpy')

    return hasCorrectArrayBounds && (hasStrncpy || hasFree || noObviousErrors)
  }

  simulateSQLOutput(code) {
    const normalizedSQL = code.toLowerCase()

    // Missing WHERE clause
    if (normalizedSQL.includes('delete') && !normalizedSQL.includes('where')) {
      return 'ERROR: DELETE without WHERE clause would delete all records!'
    }

    // Column name errors
    if (normalizedSQL.includes('creation_date')) {
      return 'ERROR: column "creation_date" does not exist'
    }

    // HAVING vs WHERE errors
    if (normalizedSQL.includes('where') && normalizedSQL.includes('avg(')) {
      return 'ERROR: aggregate functions are not allowed in WHERE'
    }

    // GROUP BY errors
    if (normalizedSQL.includes('group by') && normalizedSQL.includes('employee_name') && normalizedSQL.includes('select')) {
      return 'ERROR: column "employee_name" must appear in GROUP BY clause or be used in an aggregate function'
    }

    // Success cases
    if (normalizedSQL.includes('delete') && normalizedSQL.includes('where')) {
      return 'DELETE 2\n(Query executed successfully)'
    }

    if (normalizedSQL.includes('select') && normalizedSQL.includes('having')) {
      return 'department | avg_salary\n----------+----------\nIT         | 77500.00\n(1 row)'
    }

    if (normalizedSQL.includes('count(*)')) {
      return 'department | total_employees\n-----------+----------------\nIT         | 3\nSales      | 2\nHR         | 1\n(3 rows)'
    }

    return '[SQL execution requires database connection - simulated output]'
  }

  async executeSQLReal(code, expectedOutput = null) {
    try {
      console.log('Executing SQL with SQL.js...')

      // Determine which schema to use based on the code
      let schema = null
      const lowerCode = code.toLowerCase()

      if (lowerCode.includes('employee_hierarchy') || lowerCode.includes('employee_id')) {
        schema = sqlService.getSchema('employee_hierarchy')
      } else if (lowerCode.includes('employee')) {
        schema = sqlService.getSchema('employees')
      } else if (lowerCode.includes('user') && lowerCode.includes('product')) {
        schema = sqlService.getSchema('users_products')
      } else if (lowerCode.includes('user')) {
        schema = sqlService.getSchema('users')
      } else if (lowerCode.includes('product')) {
        schema = sqlService.getSchema('products')
      } else if (lowerCode.includes('customer') || lowerCode.includes('order')) {
        schema = sqlService.getSchema('customers_orders')
      }

      const output = await sqlService.executeSQL(code, schema)
      console.log('SQL execution successful:', output)
      return output
    } catch (error) {
      console.warn('SQL execution failed:', error.message)
      return `SQL Error: ${error.message}`
    }
  }

  async executeCompiledLanguageReal(code, language) {
    try {
      console.log(`Attempting real execution for ${language}...`)

      // Test connection first if this is the first execution
      if (judge0Service.isAvailable) {
        await judge0Service.healthCheck()
      }

      const output = await judge0Service.executeCode(code, language)
      console.log('Real execution successful:', output)
      return output
    } catch (error) {
      console.warn(`Real execution failed for ${language}:`, error.message)
      // No fallback - return "Not executed!" message
      return 'Not executed!'
    }
  }

  async executeCode(code, language) {
    try {
      let output
      switch (language.toLowerCase()) {
        case 'python':
          output = await this.executePython(code)
          return this.normalizeOutput(output)
        case 'javascript':
        case 'js':
          output = await this.executeJavaScript(code)
          return this.normalizeOutput(output)
        case 'java':
        case 'c':
        case 'cpp':
        case 'c++':
          // Try real execution first, fallback to simulation
          return await this.executeCompiledLanguageReal(code, language)
        case 'sql':
          // For SQL, use real execution with SQL.js
          return await this.executeSQLReal(code)
        default:
          return `Execution not supported for language: ${language}`
      }
    } catch (error) {
      return `Execution failed: ${error.message}`
    }
  }

  async executeCodeWithContext(code, language, expectedOutput = null, buggyCode = '', fixedCode = '') {
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
        case 'c':
        case 'cpp':
        case 'c++':
          // Real execution only - no fallback for validation
          return await this.executeCompiledLanguageReal(code, language)
        case 'sql':
          return await this.executeSQLReal(code, expectedOutput)
        default:
          return `Execution not supported for language: ${language}`
      }

      // Normalize the output for consistent testing
      return this.normalizeOutput(output)
    } catch (error) {
      return `Execution failed: ${error.message}`
    }
  }

  simulateCompiledLanguageOutputWithContext(code, language, expectedOutput, buggyCode, fixedCode) {
    const lang = language.toLowerCase()

    // Strategy 1: If code matches fixed code closely, return expected output
    if (fixedCode && expectedOutput) {
      const userNorm = this.normalizeCode(code)
      const fixedNorm = this.normalizeCode(fixedCode)
      const buggyNorm = this.normalizeCode(buggyCode)

      // If user code is much closer to fixed than buggy, use expected output
      const fixedSimilarity = this.calculateEditDistanceSimilarity(userNorm, fixedNorm)
      const buggySimilarity = this.calculateEditDistanceSimilarity(userNorm, buggyNorm)

      if (fixedSimilarity > 0.8 && fixedSimilarity > buggySimilarity) {
        return expectedOutput
      }
    }

    // Strategy 2: Use context-aware simulation
    if (lang === 'java') {
      return this.simulateJavaOutput(code, expectedOutput)
    }

    if (lang === 'c' || lang === 'cpp' || lang === 'c++') {
      return this.simulateCOutput(code, expectedOutput)
    }

    // Fallback to regular simulation
    return this.simulateCompiledLanguageOutput(code, language)
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

  validateByCodeStructure(userCode, buggyCode, fixedCode, language) {
    // Enhanced pattern-based validation that compares code structure
    // instead of trying to simulate output

    const normalizeCode = (code) => {
      return code
        .replace(/\/\/.*$/gm, '') // Remove single-line comments
        .replace(/\/\*[\s\S]*?\*\//g, '') // Remove multi-line comments
        .replace(/#.*$/gm, '') // Remove Python/shell comments
        .replace(/--.*$/gm, '') // Remove SQL comments
        .replace(/\s+/g, ' ') // Normalize whitespace
        .trim()
        .toLowerCase()
    }

    const userNorm = normalizeCode(userCode)
    const buggyNorm = normalizeCode(buggyCode)
    const fixedNorm = normalizeCode(fixedCode)

    // Strategy 1: Exact match with fixed code
    if (userNorm === fixedNorm) {
      return { isCorrect: true, confidence: 1.0, method: 'exact_match' }
    }

    // Strategy 2: Language-specific pattern detection
    const patternResult = this.detectLanguageSpecificFixes(userCode, buggyCode, fixedCode, language)
    if (patternResult.isCorrect) {
      return patternResult
    }

    // Strategy 3: Key difference analysis
    const buggyTokens = new Set(buggyNorm.split(/\W+/).filter(t => t.length > 0))
    const fixedTokens = new Set(fixedNorm.split(/\W+/).filter(t => t.length > 0))
    const userTokens = new Set(userNorm.split(/\W+/).filter(t => t.length > 0))

    // Find critical changes made in the fix
    const criticalAdditions = [...fixedTokens].filter(token => !buggyTokens.has(token))
    const criticalRemovals = [...buggyTokens].filter(token => !fixedTokens.has(token))

    // Check if user made the critical changes
    const hasAdditions = criticalAdditions.length === 0 || criticalAdditions.every(token => userTokens.has(token))
    const hasRemovals = criticalRemovals.length === 0 || criticalRemovals.every(token => !userTokens.has(token))

    if (hasAdditions && hasRemovals) {
      return { isCorrect: true, confidence: 0.8, method: 'token_analysis' }
    }

    // Strategy 4: Edit distance similarity
    const similarity = this.calculateEditDistanceSimilarity(userNorm, fixedNorm)
    if (similarity > 0.85) {
      return { isCorrect: true, confidence: similarity, method: 'similarity' }
    }

    // Strategy 5: Partial credit for substantial improvements over buggy code
    const buggyDistance = this.calculateEditDistanceSimilarity(userNorm, buggyNorm)
    const fixedDistance = this.calculateEditDistanceSimilarity(userNorm, fixedNorm)

    if (fixedDistance > buggyDistance && fixedDistance > 0.7) {
      return { isCorrect: true, confidence: fixedDistance * 0.9, method: 'improvement' }
    }

    return { isCorrect: false, confidence: 0, method: 'no_match' }
  }

  detectLanguageSpecificFixes(userCode, buggyCode, fixedCode, language) {
    const lang = language.toLowerCase()

    switch (lang) {
      case 'java':
        return this.detectJavaFixes(userCode, buggyCode, fixedCode)
      case 'c':
      case 'cpp':
      case 'c++':
        return this.detectCFixes(userCode, buggyCode, fixedCode)
      case 'sql':
        return this.detectSQLFixes(userCode, buggyCode, fixedCode)
      case 'python':
        return this.detectPythonFixes(userCode, buggyCode, fixedCode)
      default:
        return { isCorrect: false, confidence: 0, method: 'unsupported_language' }
    }
  }

  detectJavaFixes(userCode, buggyCode, fixedCode) {
    const patterns = [
      // Array bounds errors
      {
        name: 'array_bounds',
        buggyPattern: /<=\s*\w*\.?length/gi,
        fixedPattern: /<\s*\w*\.?length/gi,
        description: 'Array bounds fix (change <= to <)'
      },
      // String comparison
      {
        name: 'string_comparison',
        buggyPattern: /==\s*["']|["']\s*==/g,
        fixedPattern: /\.equals\s*\(/g,
        description: 'String comparison fix (use .equals())'
      },
      // Missing semicolon
      {
        name: 'missing_semicolon',
        buggyPattern: /\w+\s*\n/g,
        fixedPattern: /\w+\s*;\s*\n/g,
        description: 'Missing semicolon fix'
      },
      // Integer division casting
      {
        name: 'integer_division',
        buggyPattern: /\)\s*\/\s*\w+/g,
        fixedPattern: /\(\s*double\s*\)\s*\w+\s*\/\s*\w+/gi,
        description: 'Integer division casting fix'
      }
    ]

    return this.checkPatternFixes(userCode, buggyCode, fixedCode, patterns)
  }

  detectCFixes(userCode, buggyCode, fixedCode) {
    const patterns = [
      // Buffer overflow
      {
        name: 'buffer_overflow',
        buggyPattern: /strcpy\s*\(/gi,
        fixedPattern: /strncpy\s*\(/gi,
        description: 'Buffer overflow fix (use strncpy)'
      },
      // Array bounds
      {
        name: 'array_bounds',
        buggyPattern: /<=\s*\d+/g,
        fixedPattern: /<\s*\d+/g,
        description: 'Array bounds fix (change <= to <)'
      },
      // Memory leak
      {
        name: 'memory_leak',
        buggyPattern: /malloc\s*\([^)]+\)/gi,
        fixedPattern: /free\s*\(/gi,
        description: 'Memory leak fix (add free())'
      }
    ]

    return this.checkPatternFixes(userCode, buggyCode, fixedCode, patterns)
  }

  detectSQLFixes(userCode, buggyCode, fixedCode) {
    const patterns = [
      // Missing WHERE clause
      {
        name: 'missing_where',
        buggyPattern: /delete\s+from\s+\w+\s*;/gi,
        fixedPattern: /delete\s+from\s+\w+\s+where/gi,
        description: 'Missing WHERE clause fix'
      },
      // Column name errors - more flexible
      {
        name: 'column_name_creation',
        buggyPattern: /creation_date/gi,
        fixedPattern: /created_date/gi,
        description: 'Column name fix (creation_date → created_date)'
      },
      // GROUP BY errors - WHERE with aggregate functions
      {
        name: 'having_vs_where',
        buggyPattern: /where\s+avg\s*\(/gi,
        fixedPattern: /having\s+avg\s*\(/gi,
        description: 'GROUP BY clause fix (WHERE → HAVING with aggregates)'
      },
      // COUNT vs COUNT(*) - more specific
      {
        name: 'count_null_values',
        buggyPattern: /count\s*\(\s*manager_id\s*\)/gi,
        fixedPattern: /count\s*\(\s*\*\s*\)/gi,
        description: 'COUNT function fix (COUNT(column) → COUNT(*) to include NULLs)'
      },
      // JOIN without proper conditions (cartesian product)
      {
        name: 'cartesian_product',
        buggyPattern: /from\s+\w+\s+\w+\s*,\s*\w+\s+\w+\s+where/gi,
        fixedPattern: /join\s+\w+\s+\w+\s+on/gi,
        description: 'JOIN fix (avoid cartesian product)'
      },
      // Ambiguous column references
      {
        name: 'ambiguous_column',
        buggyPattern: /where\s+user_id\s*=/gi,
        fixedPattern: /where\s+\w+\.user_id\s*=/gi,
        description: 'Ambiguous column fix (add table alias)'
      }
    ]

    return this.checkPatternFixes(userCode, buggyCode, fixedCode, patterns)
  }

  detectPythonFixes(userCode, buggyCode, fixedCode) {
    const patterns = [
      // Indentation
      {
        name: 'indentation',
        buggyPattern: /^(\w+)/gm,
        fixedPattern: /^\s+(\w+)/gm,
        description: 'Indentation fix'
      },
      // Division by zero
      {
        name: 'division_by_zero',
        buggyPattern: /return\s+\w+\s*\/\s*\w+/gi,
        fixedPattern: /if\s+\w+\s*==\s*0/gi,
        description: 'Division by zero check'
      }
    ]

    return this.checkPatternFixes(userCode, buggyCode, fixedCode, patterns)
  }

  checkPatternFixes(userCode, buggyCode, fixedCode, patterns) {
    // Reset regex flags for each test
    const resetRegex = (regex) => new RegExp(regex.source, regex.flags)

    for (const pattern of patterns) {
      const buggyRegex = resetRegex(pattern.buggyPattern)
      const fixedRegex = resetRegex(pattern.fixedPattern)

      const hasBuggyPattern = buggyRegex.test(buggyCode)
      const hasFixedPattern = fixedRegex.test(fixedCode)

      // Reset again for user code test
      const userBuggyRegex = resetRegex(pattern.buggyPattern)
      const userFixedRegex = resetRegex(pattern.fixedPattern)

      const userHasBuggy = userBuggyRegex.test(userCode)
      const userHasFixed = userFixedRegex.test(userCode)

      // If this pattern represents the main fix
      if (hasBuggyPattern && hasFixedPattern && !userHasBuggy && userHasFixed) {
        return {
          isCorrect: true,
          confidence: 0.9,
          method: 'pattern_fix',
          pattern: pattern.name,
          description: pattern.description
        }
      }

      // Also check for partial fixes (user added the fix but didn't remove buggy pattern)
      if (hasBuggyPattern && hasFixedPattern && userHasFixed) {
        return {
          isCorrect: true,
          confidence: 0.8,
          method: 'partial_pattern_fix',
          pattern: pattern.name,
          description: `${pattern.description} (partial fix detected)`
        }
      }
    }

    return { isCorrect: false, confidence: 0, method: 'no_pattern_match' }
  }

  calculateEditDistanceSimilarity(str1, str2) {
    const distance = this.levenshteinDistance(str1, str2)
    const maxLength = Math.max(str1.length, str2.length)
    return maxLength === 0 ? 1 : (maxLength - distance) / maxLength
  }

  levenshteinDistance(str1, str2) {
    const matrix = []

    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i]
    }

    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j
    }

    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1]
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          )
        }
      }
    }

    return matrix[str2.length][str1.length]
  }

  async validateOutput(userCode, language, expectedOutput, buggyCode = '', fixedCode = '') {
    try {
      // Execute the code with context for better simulation
      const actualOutput = await this.executeCodeWithContext(userCode, language, expectedOutput, buggyCode, fixedCode)
      const normalizedActual = this.normalizeOutput(actualOutput)
      const normalizedExpected = this.normalizeOutput(expectedOutput)

      // Check if this is the buggy code (should always fail)
      const isBuggyCode = this.normalizeCode(userCode) === this.normalizeCode(buggyCode)
      if (isBuggyCode) {
        return {
          isCorrect: false,
          hasError: false,
          isCheating: false,
          actualOutput,
          message: 'This is the original buggy code. You need to fix the bug first!'
        }
      }

      let isCorrect = false

      // Handle "Not executed!" case
      if (actualOutput === 'Not executed!') {
        return {
          isCorrect: false,
          hasError: true,
          isCheating: false,
          actualOutput,
          message: 'Code execution failed. Check Judge0 API configuration or try again.'
        }
      }

      const hasError = actualOutput.includes('Error:') || actualOutput.includes('Exception')

      if (hasError) {
        // If there's an execution error, definitely not correct
        isCorrect = false
      } else {
        // For compiled languages with real execution, use simple exact matching
        const lang = language.toLowerCase()
        if (['java', 'c', 'cpp', 'c++'].includes(lang)) {
          isCorrect = this.normalizeOutput(actualOutput) === this.normalizeOutput(expectedOutput)
        } else {
          // Use intelligent comparison for other languages
          isCorrect = this.compareOutputsIntelligently(actualOutput, expectedOutput, language)
        }
      }

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

  normalizeCode(code) {
    return code
      .replace(/\/\/.*$/gm, '') // Remove single-line comments
      .replace(/\/\*[\s\S]*?\*\//g, '') // Remove multi-line comments
      .replace(/#.*$/gm, '') // Remove Python comments
      .replace(/--.*$/gm, '') // Remove SQL comments
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim()
      .toLowerCase()
  }

  compareOutputsIntelligently(actual, expected, language) {
    const normalizedActual = this.normalizeOutput(actual)
    const normalizedExpected = this.normalizeOutput(expected)

    // Strategy 1: Exact match
    if (normalizedActual === normalizedExpected) {
      return true
    }

    const lang = language.toLowerCase()

    // Strategy 2: Language-specific intelligent comparison
    if (['java', 'c', 'cpp', 'c++', 'sql'].includes(lang)) {
      return this.compareSimulatedOutput(actual, expected, language)
    }

    // Strategy 3: For executable languages, be more strict
    return false
  }

  compareSimulatedOutput(actual, expected, language) {
    // Remove simulation messages and brackets
    const cleanActual = actual
      .replace(/\[.*?execution requires.*?\]/gi, '')
      .replace(/\[.*?showing simulated output\]/gi, '')
      .trim()

    const cleanExpected = expected.trim()

    // If the cleaned actual matches expected exactly
    if (this.normalizeOutput(cleanActual) === this.normalizeOutput(cleanExpected)) {
      return true
    }

    // Check if actual contains the expected output - but only if it's not a subset
    const normalizedActual = this.normalizeOutput(actual)
    const normalizedExpected = this.normalizeOutput(expected)

    // Only accept if actual contains expected AND they have similar content structure
    if (normalizedActual.includes(normalizedExpected) &&
        normalizedActual.split('\n').length >= normalizedExpected.split('\n').length) {
      return true
    }

    // For simulated languages, check if the key content matches
    const extractKeyContent = (text) => {
      const numbers = (text.match(/\d+/g) || []).sort()
      const words = (text.match(/[a-zA-Z]+/g) || [])
        .filter(word => word.length > 2)
        .map(w => w.toLowerCase())
        .sort()
      return { numbers, words }
    }

    const actualKey = extractKeyContent(cleanActual)
    const expectedKey = extractKeyContent(cleanExpected)

    // Compare key content
    const numbersMatch = JSON.stringify(actualKey.numbers) === JSON.stringify(expectedKey.numbers)
    const wordsMatch = actualKey.words.length > 0 &&
      actualKey.words.some(word => expectedKey.words.includes(word))

    // More lenient matching for simulated output
    return numbersMatch || (wordsMatch && actualKey.words.length >= expectedKey.words.length * 0.7)
  }

  async validateByCodeStructureWrapper(userCode, language, expectedOutput, buggyCode, fixedCode) {
    // Use the new code structure validation for non-executable languages
    const structureResult = this.validateByCodeStructure(userCode, buggyCode, fixedCode, language)

    // Also run the code to show simulated output for user feedback
    const actualOutput = await this.executeCode(userCode, language)

    // Enhanced messaging based on validation method
    let message = ''
    if (structureResult.isCorrect) {
      message = this.getSuccessMessage(structureResult)
    } else {
      message = this.getFailureMessage(structureResult, language)
    }

    return {
      isCorrect: structureResult.isCorrect,
      hasError: false,
      isCheating: false,
      actualOutput,
      confidence: structureResult.confidence,
      validationMethod: structureResult.method,
      patternDescription: structureResult.description,
      message
    }
  }

  getSuccessMessage(result) {
    const baseMessage = 'Excellent! Your code fix is correct!'

    switch (result.method) {
      case 'exact_match':
        return `${baseMessage} (Perfect match with expected solution)`
      case 'pattern_fix':
        return `${baseMessage} (${result.description})`
      case 'token_analysis':
        return `${baseMessage} (Detected all critical changes)`
      case 'similarity':
        return `${baseMessage} (High similarity to expected solution)`
      case 'improvement':
        return `${baseMessage} (Significant improvement over buggy code)`
      default:
        return baseMessage
    }
  }

  getFailureMessage(result, language) {
    const baseMessage = 'Your code structure doesn\'t match the expected fix.'

    switch (language.toLowerCase()) {
      case 'java':
        return `${baseMessage} Common Java issues: array bounds (use < instead of <=), string comparison (use .equals()), missing semicolons, integer division casting.`
      case 'c':
      case 'cpp':
        return `${baseMessage} Common C issues: buffer overflow (use strncpy), array bounds (use < instead of <=), memory leaks (add free()).`
      case 'sql':
        return `${baseMessage} Common SQL issues: missing WHERE clause, column name errors, GROUP BY vs HAVING, COUNT(*) vs COUNT(column).`
      default:
        return baseMessage
    }
  }
}

// Create singleton instance
const codeExecutor = new CodeExecutor()
export default codeExecutor