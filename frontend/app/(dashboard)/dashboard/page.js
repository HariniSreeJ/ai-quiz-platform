"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import api from '../../../lib/api';
import styles from './Dashboard.module.css';
import Link from 'next/link';

export default function Dashboard() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        if (user) {
            fetchStats();
        }
    }, [user]);

    const fetchStats = async () => {
        try {
            const res = await api.get('/analytics/performance/');
            setStats(res.data);
        } catch (error) {
            console.error('Failed to fetch stats', error);
        } finally {
            setLoading(false);
        }
    };

    if (authLoading || loading) return <div className={styles.centerPage}><span className="loader"></span></div>;

    return (
        <div className={`container ${styles.dashboardContainer}`}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Welcome back, {user?.username}</h1>
                    <p className={styles.subtitle}>Here's your learning progress</p>
                </div>
                <Link href="/quiz/create" className="btn-primary">
                    Generate New Quiz
                </Link>
            </div>

            {stats?.total_quizzes === 0 ? (
                <div className={`glass-card ${styles.emptyState}`}>
                    <h3>No quizzes taken yet</h3>
                    <p>Generate your first AI quiz to start tracking your learning progress.</p>
                </div>
            ) : (
                <>
                    <div className={styles.statsGrid}>
                        <div className={`glass-card ${styles.statCard}`}>
                            <h3>Total Quizzes</h3>
                            <div className={styles.statValue}>{stats?.total_quizzes}</div>
                        </div>
                        <div className={`glass-card ${styles.statCard}`}>
                            <h3>Avg. Accuracy</h3>
                            <div className={styles.statValue}>{stats?.overall_accuracy}%</div>
                        </div>
                        <div className={`glass-card ${styles.statCard}`}>
                            <h3>Topics Mastered</h3>
                            <div className={styles.statValue}>{stats?.topic_stats?.length || 0}</div>
                        </div>
                    </div>

                    <div className={styles.mainGrid}>
                        <div className={`glass-card ${styles.topicsSection}`}>
                            <h3>Topic Performance</h3>
                            <div className={styles.topicList}>
                                {stats?.topic_stats?.map((topic, index) => (
                                    <div key={index} className={styles.topicItem}>
                                        <div className={styles.topicHeader}>
                                            <span className={styles.topicName}>{topic.topic}</span>
                                            <span className={styles.topicScore}>{Math.round(topic.accuracy)}%</span>
                                        </div>
                                        <div className={styles.progressBar}>
                                            <div 
                                                className={styles.progressFill} 
                                                style={{ 
                                                    width: `${topic.accuracy}%`,
                                                    background: topic.accuracy > 70 ? 'var(--success)' : topic.accuracy > 40 ? 'var(--warning)' : 'var(--error)'
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className={`glass-card ${styles.recentSection}`}>
                            <h3>Recent Attempts</h3>
                            <div className={styles.attemptList}>
                                {stats?.recent_attempts?.map((attempt, index) => (
                                    <Link href={`/quiz/${attempt.quiz}/results?attempt=${attempt.id}`} key={index} className={styles.attemptItem}>
                                        <div className={styles.attemptInfo}>
                                            <span className={styles.attemptScore}>{attempt.score}/{attempt.total_questions}</span>
                                            <span className={styles.attemptDate}>
                                                {new Date(attempt.attempt_timestamp).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <span className={styles.continueLink}>View Details →</span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
