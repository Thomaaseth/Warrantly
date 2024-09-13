import { useState } from 'react';
import { useRouter } from 'next/router';
import AuthForm from '@/components/AuthForms';
import { signup } from '@/lib/api';

export default function Signup() {
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSignup = async (data) => {
        try {
            const response = await signup(data);
            console.log('Signup successful:', response);

            router.push('/login');
        } catch (err) {
            console.error('Signup error:', err);
            setError(err.message || 'An error occured during signup. Please try again.');
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