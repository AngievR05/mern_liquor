import React, { useState, useEffect } from 'react';
import styles from './GameScreen.module.css';

const GameScreen = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [bottles, setBottles] = useState([
    { id: 1, name: 'Whiskey', shelf: null },
    { id: 2, name: 'Wine', shelf: null },
    { id: 3, name: 'Beer', shelf: null },
  ]);
  const [timeLeft, setTimeLeft] = useState(45);

  useEffect(() => {
    if (timeLeft > 0 && !isSubmitted) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft, isSubmitted]);

  const handleSubmit = () => {
    setIsSubmitted(true);
    // Here you would compare the bottles with correct shelves
    // You can add your logic to check if the game was completed correctly
  };

  const handleReset = () => {
    setBottles(bottles.map(bottle => ({ ...bottle, shelf: null })));
    setTimeLeft(45);
    setIsSubmitted(false);
  };

  return (
    <div className={styles.gameContainer}>
      <div className={styles.leftColumn}>
        <h2 className={styles.title}>Sort These Spirits</h2>
        <div className={styles.shelves}>
          {['Beer', 'Wine', 'Whiskey'].map((shelf, index) => (
            <div key={index} className={styles.shelf}>
              <h3>{shelf}</h3>
              {bottles.filter(bottle => bottle.shelf === shelf).map(bottle => (
                <div key={bottle.id} className={styles.bottle}>
                  {bottle.name}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className={styles.rightColumn}>
        <p className={styles.instructions}>Drag each bottle to the correct shelf. When you're done, click Submit.</p>
        <button className={styles.button} onClick={handleSubmit}>Submit</button>
        <button className={styles.button} onClick={handleReset}>Reset Puzzle</button>
        <p className={styles.timer}>Time left: {timeLeft}s</p>
        <div className={styles.hintIcon}>🕵️‍♂️</div>
      </div>
    </div>
  );
};

export default GameScreen;
