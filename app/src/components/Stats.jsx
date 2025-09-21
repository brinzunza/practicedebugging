import { useState, useEffect } from 'react'
import { Trophy, Clock, Target, Zap, TrendingUp } from 'lucide-react'
import ClearData from './ClearData'
import Judge0Test from './Judge0Test'

export default function Stats({ questionService }) {
  const [stats, setStats] = useState(null)
  const [questions, setQuestions] = useState([])

  useEffect(() => {
    loadStats()
  }, [questionService])

  const loadStats = () => {
    const userStats = questionService.getStats()
    const allQuestions = questionService.getAllQuestions()
    setStats(userStats)
    setQuestions(allQuestions)
  }

  const formatTime = (seconds) => {
    if (!seconds) return '0m 0s'
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = seconds % 60
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${remainingSeconds}s`
    }
    return `${minutes}m ${remainingSeconds}s`
  }

  const getSuccessRate = () => {
    const totalAttempted = questions.filter(q => q.attempts > 0).length
    if (totalAttempted === 0) return 0
    return Math.round((stats?.total_questions_solved / totalAttempted) * 100)
  }

  const getAverageAttempts = () => {
    const solvedQuestions = questions.filter(q => q.status === 'solved')
    if (solvedQuestions.length === 0) return 0
    const totalAttempts = solvedQuestions.reduce((sum, q) => sum + (q.attempts || 0), 0)
    return Math.round(totalAttempts / solvedQuestions.length * 10) / 10
  }

  const getAverageTime = () => {
    const solvedQuestions = questions.filter(q => q.status === 'solved')
    if (solvedQuestions.length === 0) return 0
    const totalTime = solvedQuestions.reduce((sum, q) => sum + (q.time_spent || 0), 0)
    return Math.round(totalTime / solvedQuestions.length)
  }

  const getDifficultyBreakdown = () => {
    const solved = questions.filter(q => q.status === 'solved')
    const total = questions.length
    
    return {
      easy: {
        solved: solved.filter(q => q.difficulty === 'easy').length,
        total: questions.filter(q => q.difficulty === 'easy').length
      },
      medium: {
        solved: solved.filter(q => q.difficulty === 'medium').length,
        total: questions.filter(q => q.difficulty === 'medium').length
      },
      hard: {
        solved: solved.filter(q => q.difficulty === 'hard').length,
        total: questions.filter(q => q.difficulty === 'hard').length
      }
    }
  }

  const getRecentActivity = () => {
    return questions
      .filter(q => q.last_attempt)
      .sort((a, b) => new Date(b.last_attempt) - new Date(a.last_attempt))
      .slice(0, 5)
  }

  if (!stats) {
    return (
      <div className="container">
        <div className="brutal-card text-center">
          <h1 className="brutal-header">Loading stats...</h1>
        </div>
      </div>
    )
  }

  const difficultyBreakdown = getDifficultyBreakdown()
  const recentActivity = getRecentActivity()

  return (
    <div>
      <h1 className="brutal-header mb-8">STATISTICS</h1>
      
      <div className="grid grid-2 gap-6 mb-8">
        <div className="brutal-card">
          <div className="flex items-center gap-4 mb-4">
            <Trophy size={32} color="var(--accent-secondary)" />
            <div>
              <h2 className="brutal-subheader">PROBLEMS SOLVED</h2>
              <p className="text-muted">Out of {questions.length} total</p>
            </div>
          </div>
          <div className="text-center">
            <div className="brutal-header" style={{ fontSize: '3rem' }}>
              {stats.total_questions_solved}
            </div>
            <div className="text-secondary">
              Success Rate: {getSuccessRate()}%
            </div>
          </div>
        </div>

        <div className="brutal-card">
          <div className="flex items-center gap-4 mb-4">
            <Clock size={32} color="var(--accent-primary)" />
            <div>
              <h2 className="brutal-subheader">TIME SPENT</h2>
              <p className="text-muted">Total debugging time</p>
            </div>
          </div>
          <div className="text-center">
            <div className="brutal-header" style={{ fontSize: '2rem' }}>
              {formatTime(stats.total_time_spent)}
            </div>
            <div className="text-secondary">
              Avg per problem: {formatTime(getAverageTime())}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-2 gap-6 mb-8">
        <div className="brutal-card text-center">
          <Target size={24} color="#ffaa00" style={{ margin: '0 auto 8px' }} />
          <h3 className="brutal-subheader">AVERAGE ATTEMPTS</h3>
          <div className="brutal-header" style={{ fontSize: '2rem' }}>
            {getAverageAttempts()}
          </div>
        </div>

        <div className="brutal-card text-center">
          <TrendingUp size={24} color="var(--accent-primary)" style={{ margin: '0 auto 8px' }} />
          <h3 className="brutal-subheader">TOTAL ATTEMPTS</h3>
          <div className="brutal-header" style={{ fontSize: '2rem' }}>
            {questions.reduce((sum, q) => sum + (q.attempts || 0), 0)}
          </div>
        </div>
      </div>

      <div className="grid grid-2 gap-6">
        <div className="brutal-card">
          <h2 className="brutal-subheader mb-4">DIFFICULTY BREAKDOWN</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold" style={{ color: 'var(--accent-secondary)' }}>
                  EASY
                </span>
                <span className="text-secondary">
                  {difficultyBreakdown.easy.solved}/{difficultyBreakdown.easy.total}
                </span>
              </div>
              <div 
                className="brutal-card" 
                style={{ 
                  height: '20px', 
                  backgroundColor: 'var(--bg-tertiary)',
                  position: 'relative',
                  padding: 0,
                  margin: 0
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${difficultyBreakdown.easy.total > 0 ? (difficultyBreakdown.easy.solved / difficultyBreakdown.easy.total) * 100 : 0}%`,
                    backgroundColor: 'var(--accent-secondary)',
                    transition: 'width 0.3s ease'
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold" style={{ color: '#ffaa00' }}>
                  MEDIUM
                </span>
                <span className="text-secondary">
                  {difficultyBreakdown.medium.solved}/{difficultyBreakdown.medium.total}
                </span>
              </div>
              <div 
                className="brutal-card" 
                style={{ 
                  height: '20px', 
                  backgroundColor: 'var(--bg-tertiary)',
                  position: 'relative',
                  padding: 0,
                  margin: 0
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${difficultyBreakdown.medium.total > 0 ? (difficultyBreakdown.medium.solved / difficultyBreakdown.medium.total) * 100 : 0}%`,
                    backgroundColor: '#ffaa00',
                    transition: 'width 0.3s ease'
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold" style={{ color: 'var(--accent-primary)' }}>
                  HARD
                </span>
                <span className="text-secondary">
                  {difficultyBreakdown.hard.solved}/{difficultyBreakdown.hard.total}
                </span>
              </div>
              <div 
                className="brutal-card" 
                style={{ 
                  height: '20px', 
                  backgroundColor: 'var(--bg-tertiary)',
                  position: 'relative',
                  padding: 0,
                  margin: 0
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${difficultyBreakdown.hard.total > 0 ? (difficultyBreakdown.hard.solved / difficultyBreakdown.hard.total) * 100 : 0}%`,
                    backgroundColor: 'var(--accent-primary)',
                    transition: 'width 0.3s ease'
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="brutal-card">
          <h2 className="brutal-subheader mb-4">RECENT ACTIVITY</h2>
          
          {recentActivity.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {recentActivity.map(question => (
                <div 
                  key={question.id} 
                  className="flex justify-between items-center p-3"
                  style={{ 
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-tertiary)'
                  }}
                >
                  <div>
                    <div className="font-bold text-sm">{question.title}</div>
                    <div className="text-secondary text-xs">
                      {question.attempts} attempts • {formatTime(question.time_spent)}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span 
                      className="brutal-button" 
                      style={{ 
                        backgroundColor: question.status === 'solved' ? 'var(--accent-secondary)' : '#ffaa00',
                        color: 'var(--bg-primary)',
                        fontSize: '10px',
                        padding: '4px 8px'
                      }}
                    >
                      {question.status?.toUpperCase() || 'ATTEMPTED'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-secondary">
              <p>No recent activity</p>
              <p className="text-sm">Start solving problems to see your activity here!</p>
            </div>
          )}
        </div>
      </div>

      {stats.total_questions_solved === 0 && (
        <div className="brutal-card text-center mt-8">
          <h3 className="brutal-subheader">GET STARTED!</h3>
          <p className="text-secondary mb-4">
            You haven't solved any problems yet. Start debugging to see your statistics!
          </p>
        </div>
      )}

      <div className="brutal-card text-center mt-8">
        <h3 className="brutal-subheader mb-4">DATA MANAGEMENT</h3>
        <p className="text-secondary mb-4">
          Use "Reseed Questions" to reload all questions with the latest updates, including new C problems.
        </p>
        <ClearData onClear={loadStats} questionService={questionService} />
      </div>

      <Judge0Test />
    </div>
  )
}