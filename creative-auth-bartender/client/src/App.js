import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Welcome from './pages/Welcome'
import GameAuth from './pages/GameScreen'
import GameSuccess from './pages/GameSuccess'
import GameFailure from './pages/GameFailure'
import AccessibilityLogin from './pages/AccessibilityLogin'
import LandingPage from './pages/LandingPage'

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/game" element={<GameAuth />} />
        <Route path="/gamesuccess" element={<GameSuccess />} />
        <Route path="/gamefailure" element={<GameFailure />} />
        <Route path="/accessibility-login" element={<AccessibilityLogin />} />
        <Route path="/landing-page" element={<LandingPage />} />
      </Routes>
    </Router>
  )
}


