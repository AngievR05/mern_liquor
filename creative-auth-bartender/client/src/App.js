import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Welcome from './pages/Welcome'
import GameAuth from './pages/GameScreen'
import GameSuccess from './pages/GameSuccess'
import GameFailure from './pages/GameFailure'
import AccessibilityLogin from './pages/AccessibilityLogin'

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/game" element={<GameAuth />} />
        <Route path="/success" element={<GameSuccess />} />
        <Route path="/failure" element={<GameFailure />} />
        <Route path="/accessibility-login" element={<AccessibilityLogin />} />
      </Routes>
    </Router>
  )
}


