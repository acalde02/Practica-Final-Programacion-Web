'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ClientTable from '@/components/clientes/ClientTable';

export default function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const router = useRouter();
  const token = typeof window !== 'undefined' ? localStorage.getItem('jwt') : null;

  useEffect(() => {
    const fetchClients = async () => {
      if (!token) {
        setMessage('Error: No token found. Please login first.');
        setLoading(false);
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
          const errorData = await response.json();
          setMessage(`Error: ${errorData.message}`);
        }
      } catch (error) {
        setMessage(`Error: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, [token]);

  const handleAddClient = () => {
    router.push('/dashboard/clientes/add');
  };

  const handleDeleteClient = async (clientId) => {
    if (!token) {
      setMessage('Error: No token found. Please login first.');
      return;
    }

    try {
      const response = await fetch(`https://bildy-rpmaya.koyeb.app/api/client/${clientId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setClients((prevClients) => prevClients.filter((client) => client._id !== clientId));
        setMessage('Client deleted successfully!');
      } else {
        const errorData = await response.json();
        setMessage(`Error: ${errorData.message}`);
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-200">
        <p className="text-lg">Loading clients...</p>
      </div>
    );
  }

  if (message) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-200">
        <p className="text-lg">{message}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-200 font-roboto">
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-3xl font-extrabold text-center text-blue-400 mb-6">Clientes</h1>
        {clients.length === 0 ? (
          <div className="text-center bg-gray-800 p-6 rounded-lg shadow-lg">
            <p className="text-gray-300 text-lg">No clients found. Please add a client.</p>
            <button
              onClick={handleAddClient}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300"
            >
              Add Client
            </button>
          </div>
        ) : (
          <ClientTable
            clients={clients}
            onAddClient={handleAddClient}
            onDeleteClient={handleDeleteClient}
          />
        )}
      </div>
    </div>
  );
}
