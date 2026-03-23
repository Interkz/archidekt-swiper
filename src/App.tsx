import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import SwipePage from './pages/SwipePage'
import CategoryModePage from './pages/CategoryModePage'
import ResultsPage from './pages/ResultsPage'
import CubeSetupPage from './pages/CubeSetupPage'
import CubeDashboardPage from './pages/CubeDashboardPage'
import CubeBrowserPage from './pages/CubeBrowserPage'
import VotingBoardPage from './pages/VotingBoardPage'
import ChangeHistoryPage from './pages/ChangeHistoryPage'
import ProposeChangePage from './pages/ProposeChangePage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/swipe" element={<SwipePage />} />
        <Route path="/category" element={<CategoryModePage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/cube/setup" element={<CubeSetupPage />} />
        <Route path="/cube/:id" element={<CubeDashboardPage />} />
        <Route path="/cube/:id/browser" element={<CubeBrowserPage />} />
        <Route path="/cube/:id/voting" element={<VotingBoardPage />} />
        <Route path="/cube/:id/history" element={<ChangeHistoryPage />} />
        <Route path="/cube/:id/propose" element={<ProposeChangePage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
