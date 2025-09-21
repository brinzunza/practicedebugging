import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import QuestionList from './components/QuestionList'
import QuestionWorkspace from './components/QuestionWorkspace'
import Header from './components/Header'
import Stats from './components/Stats'
import LearningGuide from './components/LearningGuide'
import { initDatabase } from './database/db'
import { QuestionService } from './database/questionService'

function App() {
  const [questionService, setQuestionService] = useState(null)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    const initializeApp = async () => {
      try {
        initDatabase()
        const service = new QuestionService()
        await service.seedSampleQuestions()
        setQuestionService(service)
      } catch (error) {
        console.error('Failed to initialize app:', error)
      }
    }
    initializeApp()
  }, [refreshKey])

  const refreshApp = () => {
    setRefreshKey(prev => prev + 1)
  }

  if (!questionService) {
    return (
      <div className="container">
        <div className="brutal-card text-center">
          <h1 className="brutal-header">Loading...</h1>
        </div>
      </div>
    )
  }

  return (
    <Router>
      <div className="min-h-screen">
        <Header />
        <main className="container">
          <Routes>
            <Route path="/" element={<QuestionList questionService={questionService} />} />
            <Route path="/question/:id" element={<QuestionWorkspace questionService={questionService} />} />
            <Route path="/stats" element={<Stats questionService={questionService} refreshApp={refreshApp} />} />
            <Route path="/learn" element={<LearningGuide />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
