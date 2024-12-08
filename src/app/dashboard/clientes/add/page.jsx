'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import AddClientForm from '@/components/clientes/AddClientForm';
import ConfirmDialog from '@/components/clientes/ConfirmDialog';

export default function AddClientPage() {
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();
  const token = typeof window !== 'undefined' ? localStorage.getItem('jwt') : null;

  const handleAddClient = async (formData) => {
    if (!token) {
      alert('Error: No token found. Please login first.');
      return;
    }

    try {
      const response = await fetch('https://bildy-rpmaya.koyeb.app/api/client', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setShowConfirm(true);
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
        router.push('/account/login');
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const handleConfirm = () => {
    router.push('/dashboard/clientes');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="w-full max-w-lg bg-gray-800 rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Add a New Client</h1>
        <AddClientForm onSubmit={handleAddClient} />
      </div>
      {showConfirm && (
        <ConfirmDialog
          message="Client added successfully!"
          onConfirm={handleConfirm}
        />
      )}
    </div>
  );
}
