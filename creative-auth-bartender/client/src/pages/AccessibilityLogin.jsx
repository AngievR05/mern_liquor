import { useNavigate } from 'react-router-dom'

export default function AccessibilityLogin() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-dark text-white px-4">
      <h1 className="text-2xl font-bold mb-4">Accessibility Login</h1>
      <form className="w-full max-w-md space-y-4">
        <input className="w-full px-4 py-2 rounded bg-white text-dark" placeholder="Email" type="email" />
        <input className="w-full px-4 py-2 rounded bg-white text-dark" placeholder="Password" type="password" />
        <input className="w-full px-4 py-2 rounded bg-white text-dark" placeholder="2FA Code (optional)" type="text" />
        <button type="submit" className="w-full bg-accent text-dark font-bold px-4 py-2 rounded">Sign In</button>
      </form>
      <button onClick={() => navigate('/')} className="mt-4 underline text-soft">Go back to game login</button>
    </div>
  )
}