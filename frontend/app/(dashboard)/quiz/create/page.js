"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../../../lib/api';
import styles from './CreateQuiz.module.css';

export default function CreateQuiz() {
    const router = useRouter();
    const [topic, setTopic] = useState('');
    const [difficulty, setDifficulty] = useState('Medium');
    const [numQuestions, setNumQuestions] = useState(5);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await api.post('/quizzes/', {
                topic,
                difficulty_level: difficulty,
                num_questions: parseInt(numQuestions)
            });
            // Redirect to the newly created quiz attempt page
            router.push(`/quiz/${res.data.id}`);
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to generate quiz. Please try again.');
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.aiGlow}></div>
                <div className="loader" style={{ width: '48px', height: '48px', borderWidth: '4px' }}></div>
                <h2 className={styles.loadingText}>Gemini is generating your quiz...</h2>
                <p className={styles.loadingSubtext}>Crafting questions for {topic}</p>
            </div>
        );
    }

    return (
        <div className={`container ${styles.createContainer}`}>
            <div className={`glass-card ${styles.createCard}`}>
                <div className={styles.header}>
                    <h1>Generate AI Quiz</h1>
                    <p>Specify your topic and let Gemini do the rest.</p>
                </div>

                {error && <div className={styles.errorAlert}>{error}</div>}

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className="input-group">
                        <label className="input-label">Topic</label>
                        <input
                            type="text"
                            required
                            className="input-field"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="e.g. World War II, React Hooks, Python Basics..."
                            maxLength={100}
                        />
                    </div>

                    <div className={styles.row}>
                        <div className="input-group" style={{ flex: 1 }}>
                            <label className="input-label">Difficulty</label>
                            <select 
                                className={`input-field ${styles.select}`}
                                value={difficulty} 
                                onChange={(e) => setDifficulty(e.target.value)}
                            >
                                <option value="Easy">Easy</option>
                                <option value="Medium">Medium</option>
                                <option value="Hard">Hard</option>
                                <option value="Expert">Expert</option>
                            </select>
                        </div>

                        <div className="input-group" style={{ flex: 1 }}>
                            <label className="input-label">Questions ({numQuestions})</label>
                            <input
                                type="range"
                                min="5"
                                max="20"
                                step="1"
                                className={styles.slider}
                                value={numQuestions}
                                onChange={(e) => setNumQuestions(e.target.value)}
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem', padding: '1rem' }}>
                        <span className={styles.magicIcon}>✨</span> Generate Quiz
                    </button>
                </form>
            </div>
        </div>
    );
}
