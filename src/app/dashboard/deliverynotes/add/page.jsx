'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AddDeliveryNoteForm from '@/components/delivery/AddDeliveryNoteForm';

export default function AddDeliveryNotePage() {
  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const router = useRouter();
  const token = typeof window !== 'undefined' ? localStorage.getItem('jwt') : null;

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        setMessage('Error: No token found. Please login first.');
        setLoading(false);
        return;
      }

      try {
        const clientResponse = await fetch('https://bildy-rpmaya.koyeb.app/api/client', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const projectResponse = await fetch('https://bildy-rpmaya.koyeb.app/api/project', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (clientResponse.ok && projectResponse.ok) {
          setClients(await clientResponse.json());
          setProjects(await projectResponse.json());
        } else {
          setMessage('Failed to load clients or projects.');
        }
      } catch (error) {
        setMessage(`Error: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const handleDeliveryNoteSubmit = async (formData) => {
    try {
      const response = await fetch('https://bildy-rpmaya.koyeb.app/api/deliverynote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/dashboard/deliverynotes');
      } else {
        const errorData = await response.json();
        setMessage(`Error: ${errorData.message}`);
        router.push('/account/login');
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  if (loading) {
    return <p className="text-center text-gray-500">Loading clients and projects...</p>;
  }

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6">Add Delivery Note</h1>
      {message && <p className="text-red-400 mb-4">{message}</p>}
      <AddDeliveryNoteForm
        onSubmit={handleDeliveryNoteSubmit}
        clients={clients}
        projects={projects}
      />
    </div>
  );
}
