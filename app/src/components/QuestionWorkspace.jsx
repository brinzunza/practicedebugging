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
    <div className="workspace-container" style={{ height: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* Top Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0' }}>
        <button className="brutal-button" onClick={() => navigate('/')} style={{ padding: '6px 12px', fontSize: '12px' }}>
          <ArrowLeft size={14} style={{ marginRight: '6px' }} />
          BACK
        </button>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <h1 style={{ fontSize: '16px', fontWeight: 600, margin: 0 }}>{question.title}</h1>
          <span className={`difficulty-badge difficulty-${question.difficulty}`} style={{ padding: '4px 10px', fontSize: '10px' }}>
            {question.difficulty}
          </span>
          <span style={{ fontSize: '10px', padding: '4px 8px', border: '1px solid var(--border-primary)' }}>
            {question.language.toUpperCase()}
          </span>
        </div>

        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            className={`brutal-button ${showHints ? 'secondary' : ''}`}
            onClick={() => setShowHints(!showHints)}
            style={{ padding: '6px 10px', fontSize: '11px' }}
          >
            <Lightbulb size={14} />
          </button>
          <button
            className={`brutal-button ${showSolution ? 'secondary' : ''}`}
            onClick={() => setShowSolution(!showSolution)}
            style={{ padding: '6px 10px', fontSize: '11px' }}
          >
            {showSolution ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '12px', flex: 1, minHeight: 0 }}>
        {/* Left Sidebar - Problem Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', overflow: 'auto', border: '1px solid var(--border-primary)', padding: '12px', background: 'var(--bg-primary)' }}>
          <div>
            <h3 style={{ fontSize: '11px', fontWeight: 700, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Problem
            </h3>
            <p style={{ fontSize: '11px', lineHeight: '1.4', margin: 0, color: 'var(--text-secondary)' }}>{question.description}</p>
          </div>

          {question.expected_output && (
            <div>
              <h3 style={{ fontSize: '11px', fontWeight: 700, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Expected Output
              </h3>
              <div style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '10px',
                color: 'var(--accent-green)',
                whiteSpace: 'pre-wrap',
                padding: '6px',
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--accent-green)'
              }}>
                {question.expected_output}
              </div>
            </div>
          )}

          {question.table_schema && (
            <div>
              <h3 style={{ fontSize: '11px', fontWeight: 700, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Schema
              </h3>
              <div style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '10px',
                whiteSpace: 'pre-wrap',
                padding: '6px',
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-primary)'
              }}>
                {question.table_schema}
              </div>
            </div>
          )}

          <div style={{ borderTop: '1px solid var(--border-primary)', paddingTop: '8px', marginTop: 'auto' }}>
            <h3 style={{ fontSize: '11px', fontWeight: 700, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Output
            </h3>
            <div style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '10px',
              minHeight: '60px',
              maxHeight: '120px',
              color: consoleOutput.includes('Error') || consoleOutput.includes('Exception') ? 'var(--accent-red)' : 'var(--accent-green)',
              whiteSpace: 'pre-wrap',
              overflow: 'auto',
              padding: '6px',
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-primary)'
            }}>
              {consoleOutput || <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Run code...</span>}
            </div>

            <TestStatusIndicator
              soundnessStatus={soundnessStatus}
              correctionStatus={correctionStatus}
            />

            {feedback && (
              <div style={{
                marginTop: '8px',
                padding: '6px',
                fontSize: '10px',
                backgroundColor: feedback.type === 'success' ? 'rgba(0, 255, 0, 0.1)' : 'rgba(255, 0, 0, 0.1)',
                border: `1px solid ${feedback.type === 'success' ? 'var(--accent-green)' : 'var(--accent-red)'}`
              }}>
                {feedback.type === 'success' ? <CheckCircle size={12} color="var(--accent-green)" /> : <XCircle size={12} color="var(--accent-red)" />}
                <span style={{ marginLeft: '6px' }}>{feedback.message}</span>
              </div>
            )}
          </div>

          {showHints && question.hints && (
            <div style={{ borderTop: '1px solid var(--border-primary)', paddingTop: '8px' }}>
              <h3 style={{ fontSize: '11px', fontWeight: 700, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Hints
              </h3>
              <p style={{ fontSize: '10px', lineHeight: '1.4', margin: 0, color: 'var(--text-secondary)' }}>{question.hints}</p>
            </div>
          )}

          {showSolution && (
            <div style={{ borderTop: '1px solid var(--border-primary)', paddingTop: '8px' }}>
              <h3 style={{ fontSize: '11px', fontWeight: 700, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Solution
              </h3>
              <p style={{ fontSize: '10px', lineHeight: '1.4', margin: 0, marginBottom: '8px', color: 'var(--text-secondary)' }}>{question.explanation}</p>
            </div>
          )}
        </div>

        {/* Right Side - Code Editor */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', border: '1px solid var(--border-primary)' }}>
          {/* Editor Controls */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', borderBottom: '1px solid var(--border-primary)', background: 'var(--bg-secondary)' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Editor</span>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button className="brutal-button" onClick={resetCode} style={{ padding: '4px 10px', fontSize: '11px' }}>
                RESET
              </button>
              <button
                className="brutal-button secondary"
                onClick={runUserCode}
                disabled={isExecuting}
                style={{ padding: '4px 10px', fontSize: '11px' }}
              >
                <Play size={12} style={{ marginRight: '4px' }} />
                {isExecuting ? 'RUNNING...' : 'RUN'}
              </button>
              <button className="brutal-button primary" onClick={checkSolution} style={{ padding: '4px 10px', fontSize: '11px' }}>
                <CheckCircle size={12} style={{ marginRight: '4px' }} />
                CHECK
              </button>
            </div>
          </div>

          {/* Monaco Editor */}
          <div style={{ flex: 1, minHeight: 0 }}>
            <Editor
              height="100%"
              language={question.language}
              value={userCode}
              onChange={(value) => setUserCode(value)}
              options={{
                minimap: { enabled: false },
                fontSize: 13,
                fontFamily: 'JetBrains Mono, Courier New, monospace',
                lineNumbers: 'on',
                wordWrap: 'on',
                automaticLayout: true,
                scrollBeyondLastLine: false,
                padding: { top: 8, bottom: 8 }
              }}
              onMount={handleEditorDidMount}
            />
          </div>
        </div>
      </div>
    </div>
  )
}