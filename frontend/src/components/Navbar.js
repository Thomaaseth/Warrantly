'use client'

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import styles from './Navbar.module.css';

const Navbar = () => {
    const { user, logout } = useAuth();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    return (
        <nav className={styles.navbar}>
            <div className={styles.container}>
                <Link href="/" className={styles.logo}>
                    Your App Name
                </Link>
                <div className={styles.navLinks}>
                    <Link href="/" className={styles.navLink}>
                        Home
                    </Link>
                    {user ? (
                        <>
                            <Link href="/profile" className={styles.navLink}>
                                My Profile
                            </Link>
                            <button
                                onClick={handleLogout}
                                className={styles.navLink}
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/login" className={styles.navLink}>
                                Login
                            </Link>
                            <Link href="/signup" className={styles.navLink}>
                                Signup
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    )
}

export default Navbar;