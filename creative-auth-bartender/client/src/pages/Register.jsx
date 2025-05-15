import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/LoginRegister.module.css'; 

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    localStorage.setItem('user', JSON.stringify({ email, password }));
    alert('Account created! You can now log in.');
    navigate('/accessibility-login');
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Create Account</h1>
      <form className={styles.form} onSubmit={handleRegister}>
        <input
          type="email"
          placeholder="Email"
          className={styles.input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className={styles.input}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className={styles.button}>
          Register
        </button>
      </form>
    </div>
  );
}
