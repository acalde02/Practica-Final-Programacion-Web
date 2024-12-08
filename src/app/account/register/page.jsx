'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [surnames, setSurnames] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('https://bildy-rpmaya.koyeb.app/api/user/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, surnames, email, password }),
      });

      if (!response.ok) {
        throw new Error('Error al registrar el usuario. Verifica los datos.');
      }

      const data = await response.json();

      // Guardar el token JWT en localStorage
      localStorage.setItem('jwt', data.token);

      setSuccess(true);

      localStorage.setItem('email', email);
      localStorage.setItem('password', password);
      localStorage.setItem('name', name);
      localStorage.setItem('surnames', surnames);

      // Redirigir a la página de validación después de 2 segundos
      setTimeout(() => router.push('/account/validate'), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 font-roboto">
      <div className="w-full max-w-lg p-10 bg-gray-800 shadow-lg rounded-lg">
        <h1 className="text-3xl font-bold text-center text-blue-400">Register</h1>
        <p className="text-lg font-bold text-center text-gray-300 mt-2">
          Create your account to access the dashboard
        </p>
        <form onSubmit={handleRegister} className="mt-6">
          {error && (
            <p className="text-red-500 text-sm mb-4 text-center bg-red-100 p-2 rounded-lg">
              {error}
            </p>
          )}
          {success && (
            <p className="text-green-500 text-sm mb-4 text-center bg-green-100 p-2 rounded-lg">
              Registration successful! Redirecting to validation...
            </p>
          )}
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-300">
              First Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2 mt-2 text-gray-300 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="surnames" className="block text-sm font-medium text-gray-300">
              Last Name
            </label>
            <input
              type="text"
              id="surnames"
              value={surnames}
              onChange={(e) => setSurnames(e.target.value)}
              required
              className="w-full px-4 py-2 mt-2 text-gray-300 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
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
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
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
            className={`w-full px-4 py-2 mt-4 font-bold text-white rounded-lg transition-all duration-300 ${
              loading
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 focus:ring-2 focus:ring-blue-400'
            }`}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400">Already have an account?</p>
          <button
            onClick={() => router.push('/account/login')}
            className="mt-2 px-4 py-2 text-blue-400 border border-blue-400 rounded-lg hover:bg-blue-500 hover:text-white transition-all duration-300 focus:ring-2 focus:ring-blue-400"
          >
            Log In
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
