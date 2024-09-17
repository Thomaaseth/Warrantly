"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthForm from '@/components/AuthForms';
// import { signup } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-toastify';

export default function Signup() {
    const [error, setError] = useState('');
    const router = useRouter();
    const { signupUser } = useAuth();
    
    const handleSignup = async (data) => {
        try {
            await signupUser(data);
            toast.success(TOAST_MESSAGES.SIGNUP_SUCCESS);
            router.push('/login');
        } catch (err) {
            setError(err.message || 'An error occured during signup. Please try again.');
            toast.error('An error occurred during signup.')
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign up for an account</h2>
          </div>
          {error && <p className="text-center text-red-600">{error}</p>}
          <AuthForm onSubmit={handleSignup} isSignup={true} />
        </div>
      </div>
    )
}