import { Link } from 'react-router-dom';
import styles from '../styles/Welcome.module.css';

export default function Welcome() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Spirited Sign-In 🍸</h1>
      <p className={styles.subtitle}>Match the bottles to the right shelves to prove you're not a lightweight.</p>
      <Link to="/game" className={styles.button}>
        Login with Bartender Game
      </Link>
      <br />
            
      <Link to="/register" className={styles.link}>
        Create an Account
      </Link>
      <br />
      <Link to="/accessibility-login" className={styles.link}>
        Already have an account? Login here
      </Link>
    </div>
  );
}
