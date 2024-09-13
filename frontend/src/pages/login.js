import { useState } from 'react';
import { useRouter } from 'next/router';
import AuthForm from '@/components/AuthForms';  
import { login as loginApi } from '@/lib/api';

export default function login() {
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = async (data) => {
        try {
            const response = await loginApi(data);
            localStorage.setItem('token', response.token);
            router.push('/homePage'); 
        } catch (err) {
            setError(err.message || 'An error occured during login, please try again.')
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Log in to your account</h2>
          </div>
          {error && <p className="text-center text-red-600">{error}</p>}
          <AuthForm onSubmit={handleLogin} isSignup={false} />
        </div>
      </div>
    );
}