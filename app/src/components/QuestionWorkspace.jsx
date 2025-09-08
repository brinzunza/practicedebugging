import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Editor } from '@monaco-editor/react'
import { ArrowLeft, Play, CheckCircle, XCircle, Lightbulb, Eye, EyeOff, HelpCircle } from 'lucide-react'
import ConsoleOutput from './ConsoleOutput'

export default function QuestionWorkspace({ questionService }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [question, setQuestion] = useState(null)
  const [userCode, setUserCode] = useState('')
  const [showSolution, setShowSolution] = useState(false)
  const [showHints, setShowHints] = useState(false)
  const [showProblemType, setShowProblemType] = useState(false)
  const [feedback, setFeedback] = useState(null)
  const [startTime, setStartTime] = useState(null)
  const [consoleOutput, setConsoleOutput] = useState('')
  const [isCodeExecuted, setIsCodeExecuted] = useState(false)
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
      setIsCodeExecuted(false)
    }
  }

  const simulateCodeExecution = () => {
    if (!question) return
    
    // Show the console output from the buggy code
    setConsoleOutput(question.console_output || 'No output simulation available')
    setIsCodeExecuted(true)
  }

  const runUserCode = () => {
    if (!question) return
    
    // Simple check to see if user fixed the code
    const normalizedUserCode = userCode.replace(/\s+/g, ' ').trim()
    const normalizedBuggyCode = question.buggy_code.replace(/\s+/g, ' ').trim()
    const normalizedFixedCode = question.fixed_code.replace(/\s+/g, ' ').trim()
    
    if (normalizedUserCode === normalizedFixedCode) {
      // Show expected output if code is fixed
      setConsoleOutput(question.expected_output || 'Code runs successfully!')
    } else if (normalizedUserCode === normalizedBuggyCode) {
      // Show buggy output if code is unchanged
      setConsoleOutput(question.console_output || 'No output simulation available')
    } else {
      // Show a generic message for modified but not fixed code
      setConsoleOutput('Code modified - results may vary.\nRun the original code or fix the bug to see expected behavior.')
    }
    setIsCodeExecuted(true)
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

  const checkSolution = () => {
    if (!userCode.trim()) {
      setFeedback({ type: 'error', message: 'Please write some code first!' })
      return
    }

    const timeSpent = Math.floor((Date.now() - startTime) / 1000)
    
    const normalizedUserCode = userCode.replace(/\s+/g, ' ').trim()
    const normalizedSolution = question.fixed_code.replace(/\s+/g, ' ').trim()
    
    if (normalizedUserCode === normalizedSolution) {
      setFeedback({ 
        type: 'success', 
        message: 'Excellent! You found and fixed the bug correctly!' 
      })
      questionService.updateProgress(question.id, 'solved', userCode, timeSpent)
    } else {
      setFeedback({ 
        type: 'error', 
        message: 'Not quite right. Keep trying! Check the hints if you need help.' 
      })
      questionService.updateProgress(question.id, 'in_progress', userCode, timeSpent)
    }
  }

  const resetCode = () => {
    setUserCode(question.buggy_code)
    setFeedback(null)
    setShowSolution(false)
    setConsoleOutput('')
    setIsCodeExecuted(false)
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

      <div className="grid grid-2 gap-6">
        <div>
          <div className="brutal-card">
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

            {!showProblemType ? (
              <div className="brutal-card mb-6" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                <h3 className="brutal-subheader" style={{ fontSize: '1rem', marginBottom: '12px' }}>
                  🕵️ MYSTERY DEBUG CHALLENGE
                </h3>
                <p className="text-secondary mb-4">
                  Something is wrong with this code. Your job is to find and fix the bug!
                </p>
                <div className="flex gap-2">
                  <button 
                    className="brutal-button primary" 
                    onClick={simulateCodeExecution}
                    disabled={isCodeExecuted}
                  >
                    <Play size={16} style={{ marginRight: '8px' }} />
                    RUN CODE
                  </button>
                  <button 
                    className="brutal-button"
                    onClick={() => setShowProblemType(true)}
                  >
                    <HelpCircle size={16} style={{ marginRight: '8px' }} />
                    REVEAL PROBLEM TYPE
                  </button>
                </div>
              </div>
            ) : (
              <div className="brutal-card mb-6" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                <h3 className="brutal-subheader" style={{ fontSize: '1rem', marginBottom: '8px' }}>
                  PROBLEM DESCRIPTION
                </h3>
                <p className="text-secondary">{question.description}</p>
              </div>
            )}

            {isCodeExecuted && (
              <div className="mb-6">
                <h4 className="brutal-subheader" style={{ fontSize: '1rem', marginBottom: '8px' }}>
                  ACTUAL OUTPUT
                </h4>
                <ConsoleOutput 
                  output={consoleOutput} 
                  isError={consoleOutput.includes('Error') || consoleOutput.includes('Exception')}
                />
                {showProblemType && question.expected_output && (
                  <div className="mt-3">
                    <p className="text-sm text-secondary" style={{ fontStyle: 'italic' }}>
                      💡 <strong>Debugging Tip:</strong> Compare this actual output with the expected output shown in the solution. 
                      The differences will help you identify what needs to be fixed.
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-2 mb-4">
              <button 
                className={`brutal-button ${showHints ? 'primary' : ''}`}
                onClick={() => setShowHints(!showHints)}
                disabled={!showProblemType}
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
              <div className="brutal-card mb-4" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                <h4 className="brutal-subheader" style={{ fontSize: '1rem', marginBottom: '8px' }}>
                  HINTS
                </h4>
                <p className="text-secondary">{question.hints}</p>
              </div>
            )}

            {showSolution && (
              <div className="brutal-card mb-4" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                <h4 className="brutal-subheader" style={{ fontSize: '1rem', marginBottom: '8px' }}>
                  SOLUTION EXPLANATION
                </h4>
                <p className="text-secondary mb-4">{question.explanation}</p>
                
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

        <div>
          <div className="brutal-card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="brutal-subheader">CODE EDITOR</h2>
              <div className="flex gap-2">
                <button className="brutal-button" onClick={resetCode}>
                  RESET
                </button>
                <button className="brutal-button secondary" onClick={runUserCode}>
                  <Play size={16} style={{ marginRight: '8px' }} />
                  RUN CODE
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
                height="400px"
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

            {feedback && (
              <div 
                className="brutal-card"
                style={{ 
                  backgroundColor: feedback.type === 'success' ? 'rgba(0, 255, 0, 0.1)' : 'rgba(255, 0, 0, 0.1)',
                  borderColor: feedback.type === 'success' ? 'var(--accent-secondary)' : 'var(--accent-primary)',
                  margin: '16px 0'
                }}
              >
                <div className="flex items-center gap-2">
                  {feedback.type === 'success' ? (
                    <CheckCircle size={20} color="var(--accent-secondary)" />
                  ) : (
                    <XCircle size={20} color="var(--accent-primary)" />
                  )}
                  <p className="text-primary" style={{ margin: 0 }}>
                    {feedback.message}
                  </p>
                </div>
              </div>
            )}

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