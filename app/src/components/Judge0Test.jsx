import { useState } from 'react'
import { judge0Service } from '../services/judge0Service.js'
import codeExecutor from '../utils/codeExecutor.js'

export default function Judge0Test() {
  const [testResult, setTestResult] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const testConnection = async () => {
    setIsLoading(true)
    setTestResult('Testing Judge0 connection...')

    try {
      const isHealthy = await judge0Service.healthCheck()
      const remaining = judge0Service.getRemainingExecutions()
      const used = judge0Service.dailyExecutions

      if (isHealthy) {
        setTestResult(`Judge0 connection successful!
Executions today: ${used}/50
Remaining: ${remaining}`)
      } else {
        setTestResult('Judge0 connection failed. Check API key and configuration.')
      }
    } catch (error) {
      setTestResult(`Error: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const testExecution = async () => {
    setIsLoading(true)
    setTestResult('Testing Java execution...')

    const testCode = `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello Judge0!");
    }
}`

    try {
      const output = await judge0Service.executeCode(testCode, 'java')
      setTestResult(`Execution successful!\nOutput: ${output}`)
    } catch (error) {
      setTestResult(`Execution failed: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const testPythonExecution = async () => {
    setIsLoading(true)
    setTestResult('Testing Python execution (should use Pyodide)...')

    const testCode = `print("Hello from Python!")
result = 2 + 3
print(f"2 + 3 = {result}")`

    try {
      const output = await codeExecutor.executeCode(testCode, 'python')
      setTestResult(`Python execution successful (using Pyodide)!
Output: ${output}
This uses local Pyodide, not Judge0`)
    } catch (error) {
      setTestResult(`Python execution failed: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }


  return (
    <div className="brutal-card" style={{ margin: '20px 0' }}>
      <h3 className="brutal-subheader">Judge0 API Test</h3>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', flexWrap: 'wrap' }}>
        <button
          className="brutal-button"
          onClick={testConnection}
          disabled={isLoading}
        >
          Test Connection
        </button>
        <button
          className="brutal-button secondary"
          onClick={testExecution}
          disabled={isLoading}
        >
          Test Java (Judge0)
        </button>
        <button
          className="brutal-button"
          onClick={testPythonExecution}
          disabled={isLoading}
          style={{ backgroundColor: 'var(--accent-green)', color: 'black' }}
        >
          Test Python (Pyodide)
        </button>
      </div>

      {testResult && (
        <div
          className="brutal-card"
          style={{
            backgroundColor: 'var(--bg-tertiary)',
            fontFamily: 'monospace',
            fontSize: '12px',
            whiteSpace: 'pre-wrap'
          }}
        >
          {testResult}
        </div>
      )}
    </div>
  )
}