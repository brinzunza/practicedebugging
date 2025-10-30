import { Link } from 'react-router-dom'
import { Code, BarChart3, Settings, Home, GraduationCap } from 'lucide-react'
import ClearData from './ClearData'

export default function Header() {
  return (
    <header style={{ 
      background: 'var(--bg-primary)', 
      borderBottom: '1px solid var(--border-primary)',
      boxShadow: 'none',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      padding: '16px 0'
    }}>
      <div className="container">
        <div className="flex justify-between items-center">
          <Link to="/" style={{ textDecoration: 'none' }}>
            <div className="flex items-center gap-4">
              <div style={{ 
                fontSize: '1.5rem', 
                fontWeight: '700',
                color: 'var(--text-primary)',
                fontFamily: 'inherit',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                textShadow: 'none'
              }}>
                PracticeDebugging.com
              </div>
            </div>
          </Link>
          
          <nav className="flex gap-3" style={{ alignItems: 'center' }}>
            <Link to="/" className="brutal-button" style={{ fontSize: '15px', padding: '8px 16px' }}>
              Challenges
            </Link>
            <Link to="/learn" className="brutal-button" style={{ fontSize: '15px', padding: '8px 16px' }}>
              Learn
            </Link>
            <Link to="/stats" className="brutal-button" style={{ fontSize: '15px', padding: '8px 16px' }}>
              Progress
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}