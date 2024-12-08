'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('https://bildy-rpmaya.koyeb.app/api/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Credenciales incorrectas. Por favor, verifica tu correo y contraseña.');
      }

      const data = await response.json();

      // Guardar el token JWT en localStorage
      localStorage.setItem('jwt', data.token);

      // Redirigir al dashboard
      router.push('/dashboard/clientes');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = () => {
    router.push('/account/register'); // Redirigir a la página de registro
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 font-roboto">
      <div className="w-full max-w-lg p-10 bg-gray-800 shadow-lg rounded-lg">
        <h1 className="text-4xl font-bold text-center text-blue-400">Log In</h1>
        <p className="mt-2 text-gray-200 text-center text-lg font-extrabold">
          Enter your credentials to access your account
        </p>
        <form onSubmit={handleLogin} className="mt-6">
          {error && (
            <p className="text-red-500 text-sm mb-4 text-center bg-red-100 p-2 rounded-lg">
              {error}
            </p>
          )}
          <div className="mb-4">
            <label htmlFor="email" className="block text-base font-medium text-gray-300">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 mt-2 text-gray-300 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-base font-medium text-gray-300">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 mt-2 text-gray-300 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full px-4 py-2 font-bold text-white rounded-lg transition-all duration-300 ${
              loading
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 focus:ring-2 focus:ring-blue-400'
            }`}
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400">Don’t have an account?</p>
          <button
            onClick={handleRegister}
            className="mt-2 px-4 py-2 text-blue-400 border border-blue-400 rounded-lg hover:bg-blue-500 hover:text-white transition-all duration-300 focus:ring-2 focus:ring-blue-400"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}
