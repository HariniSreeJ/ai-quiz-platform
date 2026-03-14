"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import api from '../../../../lib/api';
import styles from './ActiveQuiz.module.css';

export default function ActiveQuiz() {
    const router = useRouter();
    const params = useParams();
    const quizId = params.id;

    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({}); // { questionId: selectedOption }
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (quizId) fetchQuiz();
    }, [quizId]);

    const fetchQuiz = async () => {
        try {
            const res = await api.get(`/quizzes/${quizId}/`);
            setQuiz(res.data);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch quiz', error);
            router.push('/dashboard');
        }
    };

    const handleOptionSelect = (option) => {
        setAnswers({
            ...answers,
            [quiz.questions[currentQuestionIndex].id]: option
        });
    };

    const handleNext = () => {
        if (currentQuestionIndex < quiz.questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        // Format answers for API
        const formattedAnswers = Object.entries(answers).map(([qId, option]) => ({
            question_id: parseInt(qId),
            selected_option: option
        }));

        try {
            const res = await api.post('/analytics/submit/', {
                quiz: quizId,
                total_questions: quiz.questions.length,
                answers: formattedAnswers
            });
            // Go to Results Dashboard with attempt ID
            router.push(`/quiz/${quizId}/results?attempt=${res.data.id}`);
        } catch (error) {
            console.error('Failed to submit quiz', error);
            setSubmitting(false);
        }
    };

    if (loading) return <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}><span className="loader"></span></div>;
    
    if (!quiz || quiz.questions.length === 0) return <div className="container">Error: Quiz format invalid.</div>;

    const currentQuestion = quiz.questions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;
    const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

    return (
        <div className={`container ${styles.quizContainer}`}>
            <div className={styles.header}>
                <div>
                    <span className={styles.topicBadge}>{quiz.topic}</span>
                    <span className={styles.difficultyBadge}>{quiz.difficulty_level}</span>
                </div>
                <div className={styles.progressText}>Question {currentQuestionIndex + 1} of {quiz.questions.length}</div>
            </div>

            <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: `${progress}%` }}></div>
            </div>

            <div className={`glass-card animate-fade-in ${styles.questionCard}`} key={currentQuestion.id}>
                <h2 className={styles.questionText}>{currentQuestion.question_text}</h2>

                <div className={styles.optionsList}>
                    {['A', 'B', 'C', 'D'].map((option) => (
                        <button
                            key={option}
                            onClick={() => handleOptionSelect(option)}
                            className={`${styles.optionBtn} ${answers[currentQuestion.id] === option ? styles.selected : ''}`}
                        >
                            <span className={styles.optionLetter}>{option}</span>
                            <span className={styles.optionText}>{currentQuestion[`option_${option.toLowerCase()}`]}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className={styles.navigation}>
                <button 
                    onClick={handlePrevious} 
                    className="btn-secondary"
                    disabled={currentQuestionIndex === 0}
                    style={{ opacity: currentQuestionIndex === 0 ? 0.5 : 1, width: '120px' }}
                >
                    Previous
                </button>
                
                {isLastQuestion ? (
                    <button 
                        onClick={handleSubmit} 
                        className="btn-primary" 
                        disabled={submitting || Object.keys(answers).length !== quiz.questions.length}
                        style={{ width: '150px' }}
                    >
                        {submitting ? <span className="loader" style={{ width: '20px', height: '20px' }}></span> : 'Submit Quiz'}
                    </button>
                ) : (
                    <button 
                        onClick={handleNext} 
                        className="btn-primary"
                        disabled={!answers[currentQuestion.id]}
                        style={{ width: '120px' }}
                    >
                        Next
                    </button>
                )}
            </div>
            {isLastQuestion && Object.keys(answers).length !== quiz.questions.length && (
                <p className={styles.warningText}>Please answer all questions before submitting.</p>
            )}
        </div>
    );
}
