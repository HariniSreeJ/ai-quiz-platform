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

    const [attempt, setAttempt] = useState(null);
    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let ignore = false;

        const loadResults = async () => {
            // Next.js useSearchParams can be null during the first hydration tick. 
            // We read directly from window.location as a fallback to prevent race conditions.
            const currentAttemptId = attemptId || (typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('attempt') : null);

            try {
                if (quizId && currentAttemptId) {
                    const [attemptRes, quizRes] = await Promise.all([
                        api.get(`/analytics/attempts/${currentAttemptId}/`),
                        api.get(`/quizzes/${quizId}/`)
                    ]);
                    
                    if (!ignore) {
                        setAttempt(attemptRes.data);
                        setQuiz(quizRes.data);
                        setLoading(false);
                    }
                } else if (quizId) {
                    // Fallback to latest attempt for this specific quiz only!
                    const [perfRes, quizRes] = await Promise.all([
                        api.get('/analytics/performance/'),
                        api.get(`/quizzes/${quizId}/`)
                    ]);
                    
                    if (!ignore) {
                        const stats = perfRes.data;
                        // ONLY match an attempt for the actual quiz. Do NOT fall back to recent_attempts[0] if the ID doesn't match!
                        const latest = stats?.recent_attempts?.find(a => a.quiz === parseInt(quizId));
                        
                        if (latest) {
                            setAttempt(latest);
                        } else {
                            // If they have no attempt in the top 5 for this specific quiz, we can't show a score accurately.
                            // We shouldn't borrow a score from another quiz. 
                            setAttempt("not_found");
                        }
                        setQuiz(quizRes.data);
                        setLoading(false);
                    }
                }
            } catch (error) {
                if (!ignore) {
                    console.error('Failed to load results', error);
                    router.push('/dashboard');
                }
            }
        };

        loadResults();

        return () => {
            ignore = true; // Cleanup to prevent race condition overwrites
        };
    }, [quizId, attemptId]);

    if (loading) return <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}><span className="loader"></span></div>;

    if (!attempt || !quiz) return <div className="container">Error loading attempt details.</div>;

    if (attempt === "not_found") {
        return (
            <div className={`container ${styles.resultsContainer}`}>
                <div className={`glass-card ${styles.scoreCard}`}>
                    <div className={styles.scoreHeader}>
                        <h1 className={styles.title}>No Recent Attempt Found</h1>
                        <p className={styles.subtitle}>We couldn't find a recent attempt for <strong>{quiz.topic}</strong> in your top 5 dashboard history.</p>
                    </div>
                    <div className={styles.actionGroup}>
                        <Link href="/dashboard" className="btn-secondary">Back to Dashboard</Link>
                        <Link href={`/quiz/${quiz.id}`} className="btn-primary">Take Quiz Now</Link>
                    </div>
                </div>
            </div>
        );
    }

    const currentAttempt = attempt;

    return (
        <div className={`container ${styles.resultsContainer}`}>
            <div className={`glass-card ${styles.scoreCard}`}>
                <div className={styles.scoreHeader}>
                    <h1 className={styles.title}>Quiz Review</h1>
                    <p className={styles.subtitle}>You completed the quiz on <strong>{quiz.topic}</strong></p>
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
