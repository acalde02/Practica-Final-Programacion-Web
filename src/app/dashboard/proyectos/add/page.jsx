'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AddProjectForm from '@/components/proyectos/AddProjectForm';

export default function AddProjectPage() {
  const [clients, setClients] = useState([]);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false); // Estado para mostrar el mensaje de éxito
  const token = typeof window !== 'undefined' ? localStorage.getItem('jwt') : null;
  const router = useRouter();

  useEffect(() => {
    const fetchClients = async () => {
      if (!token) {
        setMessage('No token found. Please login.');
        return;
      }

      try {
        const response = await fetch('https://bildy-rpmaya.koyeb.app/api/client', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setClients(data);
        } else {
          setMessage('Failed to fetch clients.');
          router.push('/account/login');
        }
      } catch (err) {
        setMessage('Error fetching clients.');
      }
    };

    fetchClients();
  }, [token, router]);

  const handleProjectSubmit = async (formData) => {
    try {
      const response = await fetch('https://bildy-rpmaya.koyeb.app/api/project', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess(true); // Mostrar el mensaje de éxito
      } else {
        const error = await response.json();
        setMessage(error.message || 'Failed to add project.');
      }
    } catch (err) {
      setMessage('Error connecting to server.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="w-full max-w-3xl p-8 bg-gray-900 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center">Add a New Project</h1>

        {message && (
          <p className="text-red-400 mb-4 text-center bg-red-800 p-2 rounded-lg">
            {message}
          </p>
        )}

        {success ? (
          <div className="bg-blue-950 text-center rounded-lg p-6 shadow-md">
            <p className="text-lg text-green-400 mb-4">Project added successfully!</p>
            <button
              onClick={() => router.push('/dashboard/proyectos')}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Go to Projects
            </button>
          </div>
        ) : (
          <AddProjectForm clients={clients} onSubmit={handleProjectSubmit} />
        )}
      </div>
    </div>
  );
}
