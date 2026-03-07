import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import SwipePage from './pages/SwipePage'
import CategoryModePage from './pages/CategoryModePage'
import SessionStatsPage from './pages/SessionStatsPage'
import ResultsPage from './pages/ResultsPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/swipe" element={<SwipePage />} />
        <Route path="/category" element={<CategoryModePage />} />
        <Route path="/stats" element={<SessionStatsPage />} />
        <Route path="/results" element={<ResultsPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
