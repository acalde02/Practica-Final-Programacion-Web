'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ValidateEmailPage() {
  const [code, setCode] = useState(Array(6).fill('')); // 6-digit code
  const [error, setError] = useState(null); // For error messages
  const [success, setSuccess] = useState(false); // For successful validation
  const [resendMessage, setResendMessage] = useState(null); // Resend code feedback
  const [resendLoading, setResendLoading] = useState(false); // Loading state for resend action
  const router = useRouter();
  const inputRefs = useRef([]); // References for the input fields

  // Retrieve `email` and `password` from localStorage (set during register)
  const email = typeof window !== 'undefined' ? localStorage.getItem('email') : '';
  const password = typeof window !== 'undefined' ? localStorage.getItem('password') : '';
  const name = typeof window !== 'undefined' ? localStorage.getItem('name') : '';
  const surnames = typeof window !== 'undefined' ? localStorage.getItem('surnames') : '';

  useEffect(() => {
    if (!email || !password) {
      setError('Email or password not found. Please log in again.');
      router.push('/account/login'); // Redirect to login if missing
    }
  }, [email, password, router]);

  const handleInputChange = (e, index) => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) return; // Allow only digits

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Move to the next input field if value is entered
    if (value !== '' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      if (code[index] === '') {
        // Move to the previous input if current is empty
        if (index > 0) {
          inputRefs.current[index - 1]?.focus();
        }
      }
      const newCode = [...code];
      newCode[index] = '';
      setCode(newCode);
    }
  };

  const handleValidation = async (e) => {
    e.preventDefault();

    const fullCode = code.join('');
    if (fullCode.length < 6) {
      setError('Please complete the 6-digit code.');
      return;
    }

    try {
      const token = localStorage.getItem('jwt');
      if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
      }

      const response = await fetch('https://bildy-rpmaya.koyeb.app/api/user/validation', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ code: fullCode }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication token is missing or invalid.');
        } else if (response.status === 422) {
          throw new Error('Invalid validation code.');
        } else {
          throw new Error('Server error. Please try again.');
        }
      }

      const data = await response.json();
      console.log('Validation successful:', data);
      setSuccess(true);
      setTimeout(() => router.push('/account/login'), 2000); // Redirect after success
    } catch (err) {
      setError(err.message);
    }
  };

  const handleResendCode = async () => {
    try {
      setResendLoading(true);
      setResendMessage(null);
      setError(null);

      const response = await fetch('https://bildy-rpmaya.koyeb.app/api/user/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name, surnames}), // Use email and password to resend code
      });

      if (!response.ok) {
        throw new Error('Failed to resend the code. Please try again.');
      }

      setResendMessage('Code resent successfully! Please check your email.');
    } catch (err) {
      setError(err.message);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 font-roboto">
      <div className="w-full max-w-lg p-7 bg-gray-800 shadow-lg rounded-lg">
        <h1 className="text-4xl font-bold text-blue-400 text-center mb-4">Verify Your Email</h1>
        <p className="text-lg text-gray-400 text-center mb-6">
          Enter the 6-digit code sent to your email.
        </p>
        <form onSubmit={handleValidation} className="mt-4">
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          {success && (
            <p className="text-green-500 text-sm mb-4">
              Validation successful! Redirecting to login...
            </p>
          )}
          <div className="flex justify-between gap-4 mt-6">
            {code.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleInputChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                ref={(el) => (inputRefs.current[index] = el)}
                required
                className="w-16 h-16 text-center text-2xl font-semibold text-white bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            ))}
          </div>
          <button
            type="submit"
            className="mt-8 w-full px-4 py-3 bg-blue-500 text-white font-bold text-lg rounded-lg hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-400"
          >
            Validate
          </button>
        </form>
        <div className="mt-8 text-center">
          {resendMessage && <p className="text-green-400 text-sm mb-2">{resendMessage}</p>}
          <button
            onClick={handleResendCode}
            disabled={resendLoading}
            className="text-blue-400 text-lg font-semibold hover:underline disabled:text-gray-500"
          >
            {resendLoading ? 'Resending...' : 'Resend Code'}
          </button>
        </div>
      </div>
    </div>
  );
}
