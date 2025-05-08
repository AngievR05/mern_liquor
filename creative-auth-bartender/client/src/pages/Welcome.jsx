import { Link } from 'react-router-dom'

export default function Welcome() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-primary text-white text-center px-4">
      <h1 className="text-4xl font-bold mb-2">Spirited Sign-In 🍸</h1>
      <p className="mb-6 text-lg">Match the bottles to the right shelves to prove you're not a lightweight.</p>
      <Link to="/game" className="bg-accent text-dark font-semibold px-6 py-2 rounded-full mb-3">Login with Bartender Game</Link>
      <Link to="/accessibility-login" className="text-soft underline">Accessibility Login</Link>
    </div>
  )
}