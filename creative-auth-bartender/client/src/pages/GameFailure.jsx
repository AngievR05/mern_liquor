import { useNavigate } from 'react-router-dom'

export default function GameFailure() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-red-100 text-red-800 text-center">
      <h1 className="text-4xl font-bold mb-2 animate-shake">Oops! A bottle’s out of place.</h1>
      <p className="mb-4">Try again, bartender.</p>
      <button onClick={() => navigate('/game')} className="bg-red-500 text-white px-4 py-2 rounded">Retry</button>
    </div>
  )
}