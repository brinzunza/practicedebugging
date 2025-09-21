import { Trash2, RefreshCw } from 'lucide-react'

export default function ClearData({ onClear, questionService, refreshApp }) {
  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all data? This will remove all questions, progress, and statistics.')) {
      localStorage.clear()
      // Refresh the entire app to ensure clean state
      if (refreshApp) {
        refreshApp()
      } else {
        // Fallback for components that don't have refreshApp
        onClear()
        window.location.reload()
      }
    }
  }

  const handleReseedData = async () => {
    if (window.confirm('Are you sure you want to reseed the questions? This will reload all questions with the latest updates.')) {
      if (questionService && questionService.forceReseed) {
        try {
          await questionService.forceReseed()
          // Refresh the entire app to ensure all components get the new questions
          if (refreshApp) {
            refreshApp()
          } else {
            // Fallback for components that don't have refreshApp
            onClear()
          }
        } catch (error) {
          console.error('Failed to reseed data:', error)
          alert('Failed to reseed data. Please try again.')
        }
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