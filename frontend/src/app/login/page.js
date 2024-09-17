"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthForm from '@/components/AuthForms';  
import { useAuth } from '@/context/AuthContext';
import { login } from '@/lib/api';
import { toast } from 'react-toastify';
import { TOAST_MESSAGES } from '@/utils/toastMessage';

export default function Login() {

    const [error, setError] = useState('');
    const router = useRouter();
    const { loginUser } = useAuth();

    const handleLogin = async (data) => {
        try {
            // First, call the API directly
            const apiResponse = await login(data);
            console.log('API Response:', apiResponse);

            // Check if the response contains the expected data
            if (apiResponse.authToken && apiResponse.user) {
                console.log('Auth Token:', apiResponse.authToken);
                console.log('User Data:', apiResponse.user);
            } else {
                console.log('API response does not contain expected data structure');
            }

            // Then proceed with the existing login logic
            await loginUser(data);
            toast.success(TOAST_MESSAGES.LOGIN_SUCCESS);
            router.push('/'); 
        } catch (err) {
            console.error('Login error:', err);
            setError(err.message || 'An error occurred during login, please try again.')
            toast.error(err.message || 'An error occurred during login');
        }
    };
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Log in to your account</h2>
          </div>
          {error  && <p className="text-center text-red-600">{error }</p>}
          <AuthForm onSubmit={handleLogin} isSignup={false} />
        </div>
      </div>
    );
}