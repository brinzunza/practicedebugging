import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Clock, Target, CheckCircle, Circle, AlertCircle } from 'lucide-react'

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
      case 'solved': return <CheckCircle size={20} color="var(--accent-secondary)" />
      case 'in_progress': return <AlertCircle size={20} color="#ffaa00" />
      default: return <Circle size={20} color="var(--text-muted)" />
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="brutal-header">DEBUG CHALLENGES</h1>
        <p className="text-secondary mb-4">Find and fix bugs in broken code. Test your debugging skills.</p>
        
        <div className="flex gap-2 mb-4">
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

      <div className="grid gap-4">
        {filteredQuestions.map(question => (
          <Link 
            key={question.id} 
            to={`/question/${question.id}`}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <div className="brutal-card" style={{ cursor: 'pointer', transition: 'transform 0.1s' }}>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                  {getStatusIcon(question.status)}
                  <div>
                    <h3 className="brutal-subheader" style={{ marginBottom: '8px' }}>
                      {question.title}
                    </h3>
                    <p className="text-secondary">🔍 Debug Challenge - Find and fix the hidden bug!</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className={`difficulty-badge ${getDifficultyClass(question.difficulty)}`}>
                    {question.difficulty}
                  </span>
                  <span className="brutal-button" style={{ fontSize: '11px', padding: '4px 10px', background: 'var(--bg-tertiary)' }}>
                    {question.language.toUpperCase()}
                  </span>
                </div>
              </div>

              {question.attempts > 0 && (
                <div className="flex items-center gap-4 text-muted" style={{ fontSize: '14px' }}>
                  <div className="flex items-center gap-1">
                    <Target size={16} />
                    {question.attempts} attempts
                  </div>
                  {question.time_spent > 0 && (
                    <div className="flex items-center gap-1">
                      <Clock size={16} />
                      {Math.floor(question.time_spent / 60)}m {question.time_spent % 60}s
                    </div>
                  )}
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
          </Link>
        ))}
      </div>

      {filteredQuestions.length === 0 && (
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