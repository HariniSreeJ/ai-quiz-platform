"use client";

import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import styles from './Auth.module.css';
import Link from 'next/link';

export default function Register() {
    const { register } = useAuth();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await register(username, email, password);
        } catch (err) {
            setError(err.response?.data?.username?.[0] || 'Registration failed. Try a different username.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.authContainer}>
            <div className={`glass-card ${styles.authCard}`}>
                <div className={styles.authHeader}>
                    <h2>Create an Account</h2>
                    <p>Start generating AI quizzes today</p>
                </div>

                {error && <div className={styles.errorAlert}>{error}</div>}

                <form onSubmit={handleSubmit} className={styles.authForm}>
                    <div className="input-group">
                        <label className="input-label">Username</label>
                        <input
                            type="text"
                            required
                            className="input-field"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="johndoe"
                        />
                    </div>
                    
                    <div className="input-group">
                        <label className="input-label">Email</label>
                        <input
                            type="email"
                            required
                            className="input-field"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="john@example.com"
                        />
                    </div>
                    
                    <div className="input-group">
                        <label className="input-label">Password</label>
                        <input
                            type="password"
                            required
                            className="input-field"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                        />
                    </div>

                    <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', marginTop: '1rem' }}>
                        {loading ? <span className="loader"></span> : 'Sign Up'}
                    </button>
                    
                    <p className={styles.authFooter}>
                        Already have an account? <Link href="/login" style={{ color: 'var(--accent-primary)', fontWeight: 500 }}>Log In</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
