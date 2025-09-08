import { Terminal } from 'lucide-react'

export default function ConsoleOutput({ output, isError = false }) {
  const formatOutput = (text) => {
    if (!text) return ''
    return text.split('\n').map((line, index) => (
      <div key={index} className="console-line">
        {line}
      </div>
    ))
  }

  return (
    <div className="brutal-card" style={{ marginBottom: '16px' }}>
      <div className="flex items-center gap-2 mb-3">
        <Terminal size={20} color={isError ? 'var(--accent-primary)' : 'var(--text-primary)'} />
        <h3 className="brutal-subheader" style={{ fontSize: '1rem', marginBottom: 0 }}>
          CONSOLE OUTPUT
        </h3>
      </div>
      
      <div 
        className="brutal-card"
        style={{ 
          backgroundColor: 'var(--bg-primary)',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '13px',
          minHeight: '120px',
          color: isError ? 'var(--accent-primary)' : 'var(--accent-secondary)',
          whiteSpace: 'pre-wrap',
          overflow: 'auto'
        }}
      >
        {output ? formatOutput(output) : (
          <div style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>
            Run the code to see output...
          </div>
        )}
      </div>
    </div>
  )
}