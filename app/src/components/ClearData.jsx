import { Trash2, RefreshCw } from 'lucide-react'

export default function ClearData({ onClear, questionService }) {
  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all data? This will remove all questions, progress, and statistics.')) {
      localStorage.clear()
      onClear()
      window.location.reload()
    }
  }

  const handleReseedData = () => {
    if (window.confirm('Are you sure you want to reseed the questions? This will reload all questions with the latest updates.')) {
      if (questionService && questionService.forceReseed) {
        questionService.forceReseed()
        onClear()
        window.location.reload()
      }
    }
  }

  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      <button
        className="brutal-button secondary"
        onClick={handleReseedData}
      >
        <RefreshCw size={16} style={{ marginRight: '8px' }} />
        Reseed Questions
      </button>
      <button
        className="brutal-button danger"
        onClick={handleClearData}
      >
        <Trash2 size={16} style={{ marginRight: '8px' }} />
        Clear All Data
      </button>
    </div>
  )
}