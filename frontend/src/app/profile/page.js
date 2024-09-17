"use client"

import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import styles from './Profile.module.css';

const ProfilePage = () => {
  const { user } = useAuth();

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Profile</h1>
      <p className={styles.description}>Welcome, {user?.email || 'User'}!</p>
      {/* Add more profile information here */}
    </div>
  );
};

export default ProtectedRoute(ProfilePage);