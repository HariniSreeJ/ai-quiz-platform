"use client";

import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import styles from './Navbar.module.css';

export default function Navbar() {
    const { user, logout } = useAuth();

    return (
        <nav className={styles.navbar}>
            <div className={`container ${styles.navContainer}`}>
                <Link href="/" className={styles.logo}>
                    <span className={styles.logoIcon}>✨</span>
                    AuraQuiz
                </Link>

                <div className={styles.navLinks}>
                    {user ? (
                        <>
                            <Link href="/dashboard" className={styles.navLink}>Dashboard</Link>
                            <Link href="/quiz/create" className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                                + New Quiz
                            </Link>
                            <button onClick={logout} className={styles.navLink} style={{ color: 'var(--text-muted)' }}>
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/login" className={styles.navLink}>Login</Link>
                            <Link href="/register" className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                                Get Started
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
