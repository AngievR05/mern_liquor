import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    // Fake saving user to localStorage
    localStorage.setItem('user', JSON.stringify({ email, password }));
    alert('Account created! You can now log in.');
    navigate('/accessibility-login');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-primary text-white px-4">
      <h1 className="text-3xl font-bold mb-4">Create Account</h1>
      <form className="flex flex-col gap-4 w-full max-w-sm" onSubmit={handleRegister}>
        <input
          type="email"
          placeholder="Email"
          className="p-2 rounded text-dark"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="p-2 rounded text-dark"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="bg-accent text-dark font-semibold px-4 py-2 rounded-full">Register</button>
      </form>
    </div>
  );
}
