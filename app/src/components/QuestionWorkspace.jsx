import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Editor } from '@monaco-editor/react'
import { ArrowLeft, Play, CheckCircle, XCircle, Lightbulb, Eye, EyeOff } from 'lucide-react'
import TestStatusIndicator from './TestStatusIndicator'
import codeExecutor from '../utils/codeExecutor'

export default function QuestionWorkspace({ questionService }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [question, setQuestion] = useState(null)
  const [userCode, setUserCode] = useState('')
  const [showSolution, setShowSolution] = useState(false)
  const [showHints, setShowHints] = useState(false)
  const [feedback, setFeedback] = useState(null)
  const [startTime, setStartTime] = useState(null)
  const [consoleOutput, setConsoleOutput] = useState('')
  const [isExecuting, setIsExecuting] = useState(false)
  const [soundnessStatus, setSoundnessStatus] = useState('idle')
  const [correctionStatus, setCorrectionStatus] = useState('idle')
  const editorRef = useRef(null)

  useEffect(() => {
    loadQuestion()
    setStartTime(Date.now())
  }, [id, questionService])

  const loadQuestion = () => {
    const q = questionService.getQuestionById(parseInt(id))
    if (q) {
      setQuestion(q)
      setUserCode(q.user_solution || q.buggy_code)
      setConsoleOutput('')
      setIsExecuting(false)
      setSoundnessStatus('idle')
      setCorrectionStatus('idle')
      setFeedback(null)
    }
  }


  const runUserCode = async () => {
    if (!question || isExecuting) return

    setIsExecuting(true)
    setConsoleOutput('Executing code...')

    // Start loading animations
    setSoundnessStatus('loading')
    setCorrectionStatus('loading')

    try {
      // Execute the code
      const output = await codeExecutor.executeCode(userCode, question.language)
      setConsoleOutput(output)

      // Simulate soundness test delay
      await new Promise(resolve => setTimeout(resolve, 300))

      // Soundness test: Check if code is hardcoded (anti-cheating)
      const cheatingCheck = codeExecutor.detectCheating(
        userCode,
        question.buggy_code || '',
        question.expected_output || ''
      )
      setSoundnessStatus(cheatingCheck.isCheating ? 'failed' : 'passed')

      // Simulate correction test delay
      await new Promise(resolve => setTimeout(resolve, 300))

      // Correction test: Check if output matches expected
      const normalizedOutput = output.trim().replace(/\r\n/g, '\n').replace(/\s+$/gm, '')
      const normalizedExpected = (question.expected_output || '').trim().replace(/\r\n/g, '\n').replace(/\s+$/gm, '')
      const outputMatches = normalizedOutput === normalizedExpected

      setCorrectionStatus(outputMatches && !output.includes('Error') && !output.includes('Exception') ? 'passed' : 'failed')

    } catch (error) {
      setConsoleOutput(`Execution failed: ${error.message}`)
      setSoundnessStatus('failed')
      setCorrectionStatus('failed')
    } finally {
      setIsExecuting(false)
    }
  }

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor
    
    monaco.editor.defineTheme('brutal-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '888888', fontStyle: 'italic' },
        { token: 'keyword', foreground: 'ff0000', fontStyle: 'bold' },
        { token: 'string', foreground: '00ff00' },
        { token: 'number', foreground: 'ffaa00' },
      ],
      colors: {
        'editor.background': '#111111',
        'editor.foreground': '#ffffff',
        'editor.lineHighlightBackground': '#1a1a1a',
        'editor.selectionBackground': '#333333',
        'editorCursor.foreground': '#ff0000',
      }
    })
    
    monaco.editor.setTheme('brutal-dark')
  }

  const checkSolution = async () => {
    if (!userCode.trim()) {
      setFeedback({ type: 'error', message: 'Please write some code first!' })
      return
    }

    const timeSpent = Math.floor((Date.now() - startTime) / 1000)

    setFeedback({ type: 'info', message: 'Testing your solution...' })

    // Start loading animations
    setSoundnessStatus('loading')
    setCorrectionStatus('loading')

    try {
      // Use the enhanced validation method
      const validation = await codeExecutor.validateOutput(
        userCode,
        question.language,
        question.expected_output || '',
        question.buggy_code || '',
        question.fixed_code || ''
      )

      // Update console output
      if (validation.actualOutput) {
        setConsoleOutput(validation.actualOutput)
      }

      // Simulate soundness test delay
      await new Promise(resolve => setTimeout(resolve, 500))

      // Soundness test: Check if code is NOT hardcoded (anti-cheating)
      setSoundnessStatus(validation.isCheating ? 'failed' : 'passed')

      // Simulate correction test delay
      await new Promise(resolve => setTimeout(resolve, 500))

      // Correction test: Check if output matches expected
      setCorrectionStatus(validation.isCorrect ? 'passed' : 'failed')

      // Update feedback and progress
      if (validation.isCorrect && !validation.isCheating) {
        setFeedback({
          type: 'success',
          message: validation.message || 'Excellent! Your code produces the correct output!'
        })
        questionService.updateProgress(question.id, 'solved', userCode, timeSpent)
      } else if (validation.isCheating) {
        const detectedPatterns = validation.cheatingPatterns ?
          validation.cheatingPatterns.join(', ') : ''
        setFeedback({
          type: 'error',
          message: `Soundness test failed: Code appears to be hardcoded.${detectedPatterns ? `\n\nDetected issues: ${detectedPatterns}` : ''}\n\nTip: Focus on fixing the actual logic error in the original code.`
        })
        questionService.updateProgress(question.id, 'in_progress', userCode, timeSpent)
      } else if (validation.message === 'This is the original buggy code. You need to fix the bug first!') {
        setFeedback({
          type: 'error',
          message: validation.message
        })
        questionService.updateProgress(question.id, 'in_progress', userCode, timeSpent)
      } else {
        setFeedback({
          type: 'error',
          message: validation.message || 'Correction test failed: Output does not match expected result.'
        })
        questionService.updateProgress(question.id, 'in_progress', userCode, timeSpent)
      }
    } catch (error) {
      setSoundnessStatus('failed')
      setCorrectionStatus('failed')
      setFeedback({
        type: 'error',
        message: `Failed to test your code: ${error.message}`
      })
      questionService.updateProgress(question.id, 'in_progress', userCode, timeSpent)
    }
  }

  const resetCode = () => {
    setUserCode(question.buggy_code)
    setFeedback(null)
    setShowSolution(false)
    setConsoleOutput('')
    setIsExecuting(false)
    setSoundnessStatus('idle')
    setCorrectionStatus('idle')
  }

  if (!question) {
    return (
      <div className="container">
        <div className="brutal-card text-center">
          <h1 className="brutal-header">Question not found</h1>
          <button className="brutal-button" onClick={() => navigate('/')}>
            Back to Questions
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-4">
        <button className="brutal-button" onClick={() => navigate('/')}>
          <ArrowLeft size={16} style={{ marginRight: '8px' }} />
          BACK TO QUESTIONS
        </button>
      </div>

      <div>
        {/* Question Description Section */}
        <div>
          <div className="brutal-card" style={{ marginBottom: '8px', padding: '16px' }}>
            <div className="flex justify-between items-start mb-4">
              <h1 className="brutal-subheader">{question.title}</h1>
              <div className="flex gap-2">
                <span 
                  className="brutal-button" 
                  style={{ 
                    backgroundColor: question.difficulty === 'easy' ? 'var(--accent-green)' :
                                   question.difficulty === 'medium' ? 'orange' : 'red',
                    color: 'black',
                    fontSize: '12px',
                    padding: '6px 12px'
                  }}
                >
                  {question.difficulty.toUpperCase()}
                </span>
                <span className="brutal-button" style={{ fontSize: '12px', padding: '6px 12px' }}>
                  {question.language.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="brutal-card" style={{ backgroundColor: 'var(--bg-tertiary)', padding: '12px', marginBottom: '12px' }}>
              <h3 className="brutal-subheader" style={{ fontSize: '0.9rem', marginBottom: '6px' }}>
                PROBLEM DESCRIPTION
              </h3>
              <p className="text-secondary mb-4" style={{ fontSize: '13px' }}>{question.description}</p>

              {question.table_schema && (
                <div className="mb-4">
                  <h4 className="brutal-subheader" style={{ fontSize: '0.9rem', marginBottom: '8px' }}>
                    DATABASE SCHEMA
                  </h4>
                  <div
                    className="brutal-card"
                    style={{
                      backgroundColor: 'var(--bg-primary)',
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: '12px',
                      color: 'var(--text-primary)',
                      whiteSpace: 'pre-wrap',
                      minHeight: '120px',
                      border: '1px solid var(--text-muted)',
                      marginBottom: '12px'
                    }}
                  >
                    {question.table_schema}
                  </div>
                </div>
              )}

              {question.expected_output && (
                <div className="mt-4">
                  <h4 className="brutal-subheader" style={{ fontSize: '0.9rem', marginBottom: '8px' }}>
                    EXPECTED OUTPUT
                  </h4>
                  <div
                    className="brutal-card"
                    style={{
                      backgroundColor: 'var(--bg-primary)',
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: '13px',
                      color: 'var(--accent-green)',
                      whiteSpace: 'pre-wrap',
                      minHeight: '60px',
                      border: '1px solid var(--accent-green)',
                      marginBottom: '12px'
                    }}
                  >
                    {question.expected_output}
                  </div>
                  <p className="text-sm text-secondary" style={{ fontStyle: 'italic' }}>
                    Your task: Fix the code so it produces this exact output
                  </p>
                </div>
              )}

            </div>

            {/* Output and Test Status Section */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px', marginBottom: '12px', alignItems: 'stretch' }}>
              {/* Console Output - Left Side */}
              <div
                className="brutal-card"
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  padding: '12px',
                  margin: '0',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <h4 className="brutal-subheader" style={{ fontSize: '0.9rem', marginBottom: '8px' }}>
                  OUTPUT
                </h4>
                <div
                  style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '13px',
                    minHeight: '80px',
                    maxHeight: '200px',
                    color: consoleOutput.includes('Error') || consoleOutput.includes('Exception')
                      ? 'var(--accent-red)' : 'var(--accent-green)',
                    whiteSpace: 'pre-wrap',
                    wordWrap: 'break-word',
                    overflow: 'auto',
                    padding: '8px',
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border-primary)'
                  }}
                >
                  {consoleOutput || (
                    <div style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>
                      Run or check your code to see output...
                    </div>
                  )}
                </div>

                {feedback && (
                  <div
                    style={{
                      marginTop: '12px',
                      padding: '8px',
                      backgroundColor: feedback.type === 'success' ? 'rgba(0, 255, 0, 0.1)' :
                                     feedback.type === 'info' ? 'rgba(0, 123, 255, 0.1)' : 'rgba(255, 0, 0, 0.1)',
                      border: `1px solid ${feedback.type === 'success' ? 'var(--accent-green)' :
                              feedback.type === 'info' ? '#007bff' : 'var(--accent-red)'}`
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {feedback.type === 'success' ? (
                        <CheckCircle size={16} color="var(--accent-green)" />
                      ) : feedback.type === 'info' ? (
                        <Play size={16} color="#007bff" />
                      ) : (
                        <XCircle size={16} color="var(--accent-red)" />
                      )}
                      <p style={{ margin: 0, fontSize: '12px', whiteSpace: 'pre-line' }}>
                        {feedback.message}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Test Status - Right Side */}
              <TestStatusIndicator
                soundnessStatus={soundnessStatus}
                correctionStatus={correctionStatus}
              />
            </div>

            <div className="flex gap-2 mb-4">
              <button
                className={`brutal-button ${showHints ? 'primary' : ''}`}
                onClick={() => setShowHints(!showHints)}
              >
                <Lightbulb size={16} style={{ marginRight: '8px' }} />
                {showHints ? 'HIDE HINTS' : 'SHOW HINTS'}
              </button>
              <button 
                className={`brutal-button ${showSolution ? 'secondary' : ''}`}
                onClick={() => setShowSolution(!showSolution)}
              >
                {showSolution ? <EyeOff size={16} /> : <Eye size={16} />}
                <span style={{ marginLeft: '8px' }}>
                  {showSolution ? 'HIDE SOLUTION' : 'SHOW SOLUTION'}
                </span>
              </button>
            </div>

            {showHints && question.hints && (
              <div className="brutal-card" style={{ backgroundColor: 'var(--bg-tertiary)', padding: '12px', marginBottom: '12px' }}>
                <h4 className="brutal-subheader" style={{ fontSize: '0.9rem', marginBottom: '6px' }}>
                  HINTS
                </h4>
                <p className="text-secondary" style={{ fontSize: '13px' }}>{question.hints}</p>
              </div>
            )}

            {showSolution && (
              <div className="brutal-card" style={{ backgroundColor: 'var(--bg-tertiary)', padding: '12px', marginBottom: '12px' }}>
                <h4 className="brutal-subheader" style={{ fontSize: '0.9rem', marginBottom: '6px' }}>
                  SOLUTION EXPLANATION
                </h4>
                <p className="text-secondary" style={{ fontSize: '13px', marginBottom: '12px' }}>{question.explanation}</p>
                
                <div className="mb-4">
                  <h5 className="font-bold mb-2">FIXED CODE:</h5>
                  <div style={{ border: '2px solid var(--text-primary)', borderRadius: '4px' }}>
                    <Editor
                      height="200px"
                      language={question.language}
                      value={question.fixed_code}
                      options={{
                        readOnly: true,
                        minimap: { enabled: false },
                        fontSize: 14,
                        fontFamily: 'JetBrains Mono, Courier New, monospace',
                        theme: 'brutal-dark'
                      }}
                      onMount={handleEditorDidMount}
                    />
                  </div>
                </div>

                {question.expected_output && (
                  <div>
                    <h5 className="font-bold mb-2">EXPECTED OUTPUT:</h5>
                    <div 
                      className="brutal-card"
                      style={{ 
                        backgroundColor: 'var(--bg-primary)',
                        fontFamily: 'JetBrains Mono, monospace',
                        fontSize: '13px',
                        color: 'var(--accent-green)',
                        whiteSpace: 'pre-wrap',
                        minHeight: '60px',
                        border: '1px solid var(--accent-green)'
                      }}
                    >
                      {question.expected_output}
                    </div>
                    <div className="mt-3">
                      {question.output_explanation ? (
                        <div className="brutal-card" style={{ backgroundColor: 'var(--bg-secondary)', padding: '12px' }}>
                          <p className="text-sm text-primary" style={{ margin: 0 }}>
                            <strong>Expected Output Explanation:</strong> {question.output_explanation}
                          </p>
                        </div>
                      ) : (
                        <p className="text-sm text-secondary" style={{ fontStyle: 'italic' }}>
                          ↗ This is what the code should output when the bug is fixed. 
                          Compare this with what you see when running the buggy code to understand the issue.
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Code Editor Section */}
        <div>
          <div className="brutal-card" style={{ marginTop: '0', marginBottom: '0', padding: '16px' }}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="brutal-subheader">CODE EDITOR</h2>
              <div className="flex gap-2">
                <button className="brutal-button" onClick={resetCode}>
                  RESET
                </button>
                <button
                  className="brutal-button secondary"
                  onClick={runUserCode}
                  disabled={isExecuting}
                >
                  <Play size={16} style={{ marginRight: '8px' }} />
                  {isExecuting ? 'EXECUTING...' : 'RUN CODE'}
                </button>
                <button className="brutal-button primary" onClick={checkSolution}>
                  <CheckCircle size={16} style={{ marginRight: '8px' }} />
                  CHECK SOLUTION
                </button>
              </div>
            </div>

            <div style={{
              border: '2px solid var(--text-primary)',
              borderRadius: '4px',
              marginBottom: '16px'
            }}>
              <Editor
                height="600px"
                language={question.language}
                value={userCode}
                onChange={(value) => setUserCode(value)}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  fontFamily: 'JetBrains Mono, Courier New, monospace',
                  lineNumbers: 'on',
                  wordWrap: 'on',
                  automaticLayout: true,
                }}
                onMount={handleEditorDidMount}
              />
            </div>

            {question.tags && (
              <div className="flex gap-2 mt-4">
                {question.tags.split(',').map((tag, index) => (
                  <span 
                    key={index}
                    className="brutal-button"
                    style={{ 
                      fontSize: '10px', 
                      padding: '4px 8px',
                      backgroundColor: 'var(--bg-tertiary)',
                      color: 'var(--text-muted)'
                    }}
                  >
                    {tag.trim()}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}