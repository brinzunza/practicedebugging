import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Clock, Target, CheckCircle, Circle, AlertCircle, Code2 } from 'lucide-react'

export default function QuestionList({ questionService }) {
  const [questions, setQuestions] = useState([])
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    loadQuestions()
  }, [questionService])

  const loadQuestions = () => {
    const allQuestions = questionService.getAllQuestions()
    setQuestions(allQuestions)
  }

  const filteredQuestions = questions.filter(q => {
    if (filter === 'all') return true
    if (filter === 'solved') return q.status === 'solved'
    if (filter === 'unsolved') return !q.status || q.status !== 'solved'
    return q.difficulty === filter
  })

  // Group questions by language
  const questionsByLanguage = filteredQuestions.reduce((acc, question) => {
    const lang = question.language || 'other'
    if (!acc[lang]) {
      acc[lang] = []
    }
    acc[lang].push(question)
    return acc
  }, {})

  const getDifficultyClass = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'difficulty-easy'
      case 'medium': return 'difficulty-medium'
      case 'hard': return 'difficulty-hard'
      default: return 'difficulty-badge'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'solved': return <CheckCircle size={16} color="#00ff00" />
      case 'in_progress': return <AlertCircle size={16} color="#ffaa00" />
      default: return <Circle size={16} color="var(--text-muted)" />
    }
  }

  const getCardStyle = (status) => {
    const baseStyle = {
      border: '1px solid var(--border-primary)',
      padding: '10px 12px',
      marginBottom: '8px',
      transition: 'all 0.15s ease',
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    }

    switch (status) {
      case 'solved':
        return {
          ...baseStyle,
          background: 'rgba(0, 255, 0, 0.05)',
          borderLeft: '4px solid #00ff00'
        }
      case 'in_progress':
        return {
          ...baseStyle,
          background: 'rgba(255, 170, 0, 0.05)',
          borderLeft: '4px solid #ffaa00'
        }
      default:
        return {
          ...baseStyle,
          background: 'var(--bg-primary)',
          borderLeft: '4px solid transparent'
        }
    }
  }

  const getLanguageIcon = (language) => {
    return <Code2 size={18} />
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'solved':
        return (
          <span style={{
            fontSize: '8px',
            padding: '2px 6px',
            backgroundColor: 'rgba(0, 255, 0, 0.2)',
            color: '#00ff00',
            fontWeight: 700,
            textTransform: 'uppercase',
            borderRadius: '2px'
          }}>
            ✓ Solved
          </span>
        )
      case 'in_progress':
        return (
          <span style={{
            fontSize: '8px',
            padding: '2px 6px',
            backgroundColor: 'rgba(255, 170, 0, 0.2)',
            color: '#ffaa00',
            fontWeight: 700,
            textTransform: 'uppercase',
            borderRadius: '2px'
          }}>
            ⋯ In Progress
          </span>
        )
      default:
        return null
    }
  }

  return (
    <div className="question-list-container">
      <div className="mb-8">
        <h1 className="brutal-header">DEBUG CHALLENGES</h1>
        <p className="text-secondary mb-4">Find and fix bugs in broken code. Test your debugging skills.</p>

        <div className="flex gap-2 mb-4" style={{ flexWrap: 'wrap' }}>
          <button
            className={`brutal-button ${filter === 'all' ? 'primary' : ''}`}
            onClick={() => setFilter('all')}
          >
            ALL ({questions.length})
          </button>
          <button
            className={`brutal-button ${filter === 'solved' ? 'secondary' : ''}`}
            onClick={() => setFilter('solved')}
          >
            SOLVED ({questions.filter(q => q.status === 'solved').length})
          </button>
          <button
            className={`brutal-button ${filter === 'unsolved' ? '' : ''}`}
            onClick={() => setFilter('unsolved')}
          >
            UNSOLVED ({questions.filter(q => !q.status || q.status !== 'solved').length})
          </button>
          <button
            className={`brutal-button ${filter === 'easy' ? '' : ''}`}
            onClick={() => setFilter('easy')}
          >
            EASY
          </button>
          <button
            className={`brutal-button ${filter === 'medium' ? '' : ''}`}
            onClick={() => setFilter('medium')}
          >
            MEDIUM
          </button>
          <button
            className={`brutal-button ${filter === 'hard' ? '' : ''}`}
            onClick={() => setFilter('hard')}
          >
            HARD
          </button>
        </div>
      </div>

      {filteredQuestions.length > 0 ? (
        <div className="language-columns">
          {Object.keys(questionsByLanguage).sort().map((language) => (
            <div key={language} className="language-column">
              {/* Language Header */}
              <div className="language-header" style={{
                borderBottom: '2px solid var(--border-primary)',
                paddingBottom: '8px',
                marginBottom: '12px'
              }}>
                <div className="flex items-center gap-2" style={{ justifyContent: 'center' }}>
                  {getLanguageIcon(language)}
                  <h2 className="brutal-subheader" style={{
                    margin: 0,
                    fontSize: '1rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    {language.toUpperCase()}
                  </h2>
                </div>
                <div style={{
                  textAlign: 'center',
                  fontSize: '11px',
                  color: 'var(--text-muted)',
                  fontWeight: 500,
                  marginTop: '4px'
                }}>
                  {questionsByLanguage[language].length} {questionsByLanguage[language].length === 1 ? 'problem' : 'problems'}
                </div>
              </div>

              {/* Questions List */}
              <div className="questions-list">
                {questionsByLanguage[language].map((question) => (
                  <Link
                    key={question.id}
                    to={`/question/${question.id}`}
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    <div className="compact-question-card" style={getCardStyle(question.status)}>
                      {/* Top Row: Status and Difficulty */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                          {getStatusIcon(question.status)}
                          {getStatusBadge(question.status)}
                        </div>
                        <span className={`difficulty-badge ${getDifficultyClass(question.difficulty)}`} style={{
                          padding: '3px 8px',
                          fontSize: '9px',
                          textTransform: 'uppercase',
                          fontWeight: 600
                        }}>
                          {question.difficulty}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 style={{
                        fontSize: '13px',
                        fontWeight: 600,
                        margin: 0,
                        lineHeight: '1.3',
                        textTransform: 'none',
                        letterSpacing: 'normal'
                      }}>
                        {question.title}
                      </h3>

                      {/* Tags */}
                      {question.tags && (
                        <div style={{ display: 'flex', gap: '3px', flexWrap: 'wrap' }}>
                          {question.tags.split(',').slice(0, 2).map((tag, index) => (
                            <span
                              key={index}
                              style={{
                                fontSize: '8px',
                                padding: '2px 5px',
                                backgroundColor: 'var(--bg-tertiary)',
                                color: 'var(--text-muted)',
                                textTransform: 'uppercase'
                              }}
                            >
                              {tag.trim()}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Stats */}
                      {question.attempts > 0 && (
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          fontSize: '10px',
                          color: 'var(--text-muted)',
                          paddingTop: '4px'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                            <Target size={11} />
                            {question.attempts}
                          </div>
                          {question.time_spent > 0 && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                              <Clock size={11} />
                              {Math.floor(question.time_spent / 60)}m
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="brutal-card text-center">
          <h3 className="brutal-subheader">NO QUESTIONS FOUND</h3>
          <p className="text-secondary mb-4">No questions match your current filter.</p>
          <button
            className="brutal-button primary"
            onClick={() => setFilter('all')}
          >
            SHOW ALL QUESTIONS
          </button>
        </div>
      )}
    </div>
  )
}