import { useState } from 'react'
import { CheckSquare, Square, RefreshCw } from 'lucide-react'

const debugChecklistItems = [
  { 
    id: 1, 
    text: "Read the error message completely and carefully", 
    category: "observation" 
  },
  { 
    id: 2, 
    text: "Reproduce the bug consistently", 
    category: "reproduction" 
  },
  { 
    id: 3, 
    text: "Check recent changes (git log, blame)", 
    category: "investigation" 
  },
  { 
    id: 4, 
    text: "Isolate the problem to the smallest possible code", 
    category: "investigation" 
  },
  { 
    id: 5, 
    text: "Form a hypothesis about the root cause", 
    category: "analysis" 
  },
  { 
    id: 6, 
    text: "Test the hypothesis with targeted experiments", 
    category: "testing" 
  },
  { 
    id: 7, 
    text: "Add logging/debugging statements strategically", 
    category: "investigation" 
  },
  { 
    id: 8, 
    text: "Check boundary conditions and edge cases", 
    category: "testing" 
  },
  { 
    id: 9, 
    text: "Verify assumptions about data types and values", 
    category: "analysis" 
  },
  { 
    id: 10, 
    text: "Test the fix thoroughly before deployment", 
    category: "verification" 
  }
]

export default function DebugChecklist({ onComplete }) {
  const [checkedItems, setCheckedItems] = useState(new Set())

  const toggleItem = (itemId) => {
    const newChecked = new Set(checkedItems)
    if (newChecked.has(itemId)) {
      newChecked.delete(itemId)
    } else {
      newChecked.add(itemId)
    }
    setCheckedItems(newChecked)
    
    if (newChecked.size === debugChecklistItems.length && onComplete) {
      onComplete()
    }
  }

  const resetChecklist = () => {
    setCheckedItems(new Set())
  }

  const getCategoryColor = (category) => {
    switch (category) {
      case 'observation': return 'var(--accent-secondary)'
      case 'reproduction': return '#ffaa00'
      case 'investigation': return 'var(--accent-primary)'
      case 'analysis': return '#00aaff'
      case 'testing': return '#aa00ff'
      case 'verification': return 'var(--accent-secondary)'
      default: return 'var(--text-secondary)'
    }
  }

  const completionPercentage = Math.round((checkedItems.size / debugChecklistItems.length) * 100)

  return (
    <div className="brutal-card">
      <div className="flex justify-between items-center mb-4">
        <h3 className="brutal-subheader">DEBUG CHECKLIST</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            {completionPercentage}% Complete
          </span>
          <button className="brutal-button" onClick={resetChecklist} style={{ padding: '6px' }}>
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      <div className="mb-4" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
        <div 
          style={{
            width: `${completionPercentage}%`,
            height: '8px',
            backgroundColor: 'var(--accent-primary)',
            transition: 'width 0.3s ease',
            borderRadius: '4px'
          }}
        />
      </div>

      <div className="space-y-2">
        {debugChecklistItems.map(item => (
          <div 
            key={item.id}
            className="flex items-center gap-3 p-2"
            style={{ 
              backgroundColor: checkedItems.has(item.id) ? 'var(--bg-tertiary)' : 'transparent',
              border: '1px solid var(--border-color)',
              cursor: 'pointer'
            }}
            onClick={() => toggleItem(item.id)}
          >
            {checkedItems.has(item.id) ? 
              <CheckSquare size={20} color="var(--accent-secondary)" /> :
              <Square size={20} color="var(--text-muted)" />
            }
            
            <div className="flex-1">
              <span 
                style={{ 
                  textDecoration: checkedItems.has(item.id) ? 'line-through' : 'none',
                  color: checkedItems.has(item.id) ? 'var(--text-muted)' : 'var(--text-primary)'
                }}
              >
                {item.text}
              </span>
              
              <div className="mt-1">
                <span 
                  className="text-xs"
                  style={{ 
                    backgroundColor: getCategoryColor(item.category),
                    color: 'var(--bg-primary)',
                    padding: '2px 6px',
                    borderRadius: '2px',
                    textTransform: 'uppercase',
                    fontWeight: 'bold'
                  }}
                >
                  {item.category}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {completionPercentage === 100 && (
        <div className="brutal-card mt-4" style={{ backgroundColor: 'var(--bg-secondary)' }}>
          <h4 className="font-bold" style={{ color: 'var(--accent-secondary)' }}>
            🎉 DEBUGGING MASTER!
          </h4>
          <p className="text-sm text-secondary mt-2">
            You've completed the systematic debugging checklist. Remember to use this process 
            for all your debugging sessions to build consistent problem-solving habits.
          </p>
        </div>
      )}
    </div>
  )
}