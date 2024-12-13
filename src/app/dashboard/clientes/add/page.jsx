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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 via-white to-blue-700 text-gray-900">
      <div className="w-full max-w-4xl rounded-lg p-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-blue-700">
          Add a New Client
        </h1>
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
