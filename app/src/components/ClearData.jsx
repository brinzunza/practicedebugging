import { Trash2 } from 'lucide-react'

export default function ClearData({ onClear }) {
  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all data? This will remove all questions, progress, and statistics.')) {
      localStorage.clear()
      onClear()
      window.location.reload()
    }
  }

  return (
    <button 
      className="brutal-button danger"
      onClick={handleClearData}
    >
      <Trash2 size={16} style={{ marginRight: '8px' }} />
      Clear Data
    </button>
  )
}