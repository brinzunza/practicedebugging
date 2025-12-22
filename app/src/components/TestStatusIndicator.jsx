import { CheckCircle, XCircle } from 'lucide-react'

export default function TestStatusIndicator({ soundnessStatus, correctionStatus }) {
  const getStatusStyle = (status) => {
    switch (status) {
      case 'idle':
        return { color: '#000', animation: 'none' }
      case 'loading':
        return { color: '#ff9800', animation: 'pulse 1.5s ease-in-out infinite' }
      case 'passed':
        return { color: '#00ff00', animation: 'none' }
      case 'failed':
        return { color: '#000', animation: 'none' }
      default:
        return { color: '#000', animation: 'none' }
    }
  }

  const getIcon = (status) => {
    if (status === 'passed') {
      return <CheckCircle size={16} style={{ marginLeft: '8px' }} />
    } else if (status === 'failed') {
      return <XCircle size={16} style={{ marginLeft: '8px' }} />
    }
    return null
  }

  const soundnessStyle = getStatusStyle(soundnessStatus)
  const correctionStyle = getStatusStyle(correctionStatus)

  return (
    <div
      className="brutal-card"
      style={{
        backgroundColor: 'var(--bg-tertiary)',
        padding: '12px',
        margin: '0',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <h4 className="brutal-subheader" style={{ fontSize: '0.9rem', marginBottom: '8px' }}>
        TESTS
      </h4>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        padding: '8px',
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid var(--border-primary)',
        minHeight: '80px',
        flex: 1
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '13px',
              fontWeight: '500',
              ...soundnessStyle,
              display: 'flex',
              alignItems: 'center'
            }}
          >
            Soundness tests...
            {getIcon(soundnessStatus)}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '13px',
              fontWeight: '500',
              ...correctionStyle,
              display: 'flex',
              alignItems: 'center'
            }}
          >
            Correction tests...
            {getIcon(correctionStatus)}
          </span>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.02);
          }
        }
      `}</style>
    </div>
  )
}
