import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={`container ${styles.heroContainer}`}>
        <div className={styles.heroContent}>
          <div className={`animate-fade-in ${styles.badge}`}>
            ✨ Powered by Google Gemini AI
          </div>
          <h1 className={`animate-fade-in ${styles.title}`} style={{ animationDelay: '0.1s' }}>
            Master Any Topic,<br/>
            <span className={styles.gradientText}>Instantly.</span>
          </h1>
          <p className={`animate-fade-in ${styles.subtitle}`} style={{ animationDelay: '0.2s' }}>
            Generate high-quality quizzes on demand. Get detailed explanations for every answer and track your learning progress with deep analytics.
          </p>
          
          <div className={`animate-fade-in ${styles.ctaGroup}`} style={{ animationDelay: '0.3s' }}>
            <Link href="/register" className="btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
              Start Learning Free
            </Link>
            <Link href="/login" className="btn-secondary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
              Log In
            </Link>
          </div>
        </div>

        <div className={`animate-fade-in ${styles.heroVisual}`} style={{ animationDelay: '0.4s' }}>
          <div className={`glass-card ${styles.floatingCard} ${styles.card1}`}>
            <h3>Dynamic Generation</h3>
            <p>From "Quantum Physics" to "Pop Culture", generate quizzes on absolutely anything.</p>
          </div>
          <div className={`glass-card ${styles.floatingCard} ${styles.card2}`}>
            <h3>Smart Explanations</h3>
            <p>Don't just see the score. Understand exactly why an answer is correct.</p>
          </div>
          <div className={`glass-card ${styles.floatingCard} ${styles.card3}`}>
            <h3>Learning Analytics</h3>
            <p>Track your accuracy over time and identify your weakest topics.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
