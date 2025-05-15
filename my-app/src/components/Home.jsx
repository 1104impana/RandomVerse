import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Home.module.css';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className={styles.wrapper}>
      <h1>Welcome to RandomVerse</h1>
      <div className={styles.container}>
        <button
          className={styles.button}
          onClick={() => navigate('/paint')}
        >
          Paint
        </button>
        <button
          className={styles.button}
          onClick={() => navigate('/fortune')}
        >
          Fortune
        </button>
      </div>
    </div>
  );
}
