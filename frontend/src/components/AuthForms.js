"use client"

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import styles from './AuthForms.module.css';

const schema = yup.object().shape({
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup.string().min(8, 'Password must be at least 8 characters.').required('Password is required.'),
    firstName: yup.string().when('isSignup', {
        is: true,
        then: yup.string().required('First name is required.'),
    }),
    lastName: yup.string().when('isSignup', {
        is: true,
        then: yup.string().required('Last name is required.'),
    }),
});

export default function AuthForm({ onSubmit, isSignup }) {
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        context: { isSignup },
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            {isSignup && (
                <>
                    <div className={styles.formGroup}>
                        <label htmlFor="firstName" className={styles.label}>First Name</label>
                        <input
                            type="text"
                            id="firstName"
                            {...register('firstName')}
                            className={styles.input}
                        />
                        {errors.firstName && <p className={styles.error}>{errors.firstName.message}</p>}
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="lastName" className={styles.label}>Last Name</label>
                        <input
                            type="text"
                            id="lastName"
                            {...register('lastName')}
                            className={styles.input}
                        />
                        {errors.lastName && <p className={styles.error}>{errors.lastName.message}</p>}
                    </div>
                </>
            )}
            <div className={styles.formGroup}>
                <label htmlFor="email" className={styles.label}>Email</label>
                <input
                    type="email"
                    id="email"
                    {...register('email')}
                    className={styles.input}
                />
                {errors.email && <p className={styles.error}>{errors.email.message}</p>}
            </div>
            <div className={styles.formGroup}>
                <label htmlFor="password" className={styles.label}>Password</label>
                <input
                    type="password"
                    id="password"
                    {...register('password')}
                    className={styles.input}
                />
                {errors.password && <p className={styles.error}>{errors.password.message}</p>}
            </div>
            <button type="submit" className={styles.button}>
                {isSignup ? 'Sign Up' : 'Log In'}
            </button>
        </form>
    );
}