"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import api from '../../../../../lib/api';
import styles from './Results.module.css';
import Link from 'next/link';

export default function QuizResults() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const params = useParams();
    const attemptId = searchParams.get('attempt');
    const quizId = params.id;

    const [stats, setStats] = useState(null);
    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (quizId) fetchResults();
    }, [quizId, attemptId]);

    const fetchResults = async () => {
        try {
            const [perfRes, quizRes] = await Promise.all([
                api.get('/analytics/performance/'),
                api.get(`/quizzes/${quizId}/`)
            ]);
            
            setStats(perfRes.data);
            setQuiz(quizRes.data);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch results', error);
            router.push('/dashboard');
        }
    };

    if (loading) return <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}><span className="loader"></span></div>;

    // Find the current attempt from recent attempts
    const currentAttempt = stats?.recent_attempts?.find(a => a.id === parseInt(attemptId)) || stats?.recent_attempts?.[0];

    if (!currentAttempt || !quiz) return <div className="container">Error loading attempt details.</div>;

    const scorePercentage = Math.round((currentAttempt.score / currentAttempt.total_questions) * 100);
    const isSuccess = scorePercentage >= 70;

    return (
        <div className={`container ${styles.resultsContainer}`}>
            <div className={`glass-card ${styles.scoreCard}`}>
                <div className={styles.scoreHeader}>
                    <h1 className={styles.title}>{isSuccess ? 'Outstanding Work! 🌟' : 'Good Effort! 📚'}</h1>
                    <p className={styles.subtitle}>You completed the quiz on <strong>{quiz.topic}</strong></p>
                </div>

                <div className={styles.circleContainer}>
                    <div className={styles.scoreCircle} style={{ 
                        borderColor: isSuccess ? 'var(--success)' : (scorePercentage > 40 ? 'var(--warning)' : 'var(--error)'),
                        color: isSuccess ? 'var(--success)' : (scorePercentage > 40 ? 'var(--warning)' : 'var(--error)')
                    }}>
                        <span className={styles.scoreNumber}>{scorePercentage}%</span>
                        <span className={styles.scoreFraction}>{currentAttempt.score}/{currentAttempt.total_questions} Correct</span>
                    </div>
                </div>

                <div className={styles.actionGroup}>
                    <Link href="/dashboard" className="btn-secondary">Back to Dashboard</Link>
                    <Link href={`/quiz/${quizId}`} className="btn-primary">Retake Quiz</Link>
                </div>
            </div>

            <div className={styles.reviewSection}>
                <h2 className={styles.sectionTitle}>Detailed Review</h2>
                <p className={styles.sectionDesc}>Review your answers and learn from AI explanations.</p>

                <div className={styles.questionsList}>
                    {quiz.questions.map((q, index) => {
                        return (
                            <div key={q.id} className={`glass-card ${styles.reviewCard}`}>
                                <div className={styles.qHeader}>
                                    <span className={styles.qNumber}>Question {index + 1}</span>
                                </div>
                                
                                <h3 className={styles.qText}>{q.question_text}</h3>
                                
                                <div className={styles.answerDisplay}>
                                    <div className={styles.correctAnswer}>
                                        <span className={styles.checkIcon}>✓</span>
                                        <div className={styles.ansContent}>
                                            <strong>Correct Answer ({q.correct_option}):</strong> {q[`option_${q.correct_option.toLowerCase()}`]}
                                        </div>
                                    </div>
                                </div>

                                {q.explanation && (
                                    <div className={styles.explanationBox}>
                                        <div className={styles.aiBadge}>✨ AI Explanation</div>
                                        <p>{q.explanation}</p>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
}
