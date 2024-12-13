'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ClientTable from '@/components/clientes/ClientTable';
import ClientDetailsModal from '@/components/clientes/ClientDetailsModal';
import EditClientModal from '@/components/clientes/EditClientModal';

export default function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null); // Para el modal de detalles
  const [editingClient, setEditingClient] = useState(null); // Para el modal de edición
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const router = useRouter();
  const token = typeof window !== 'undefined' ? localStorage.getItem('jwt') : null;

  useEffect(() => {
    const fetchClientsData = async () => {
      if (!token) {
        setMessage('Error: No token found. Please login first.');
        setLoading(false);
        return;
      }

      try {
        const clientsResponse = await fetch('https://bildy-rpmaya.koyeb.app/api/client', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!clientsResponse.ok) {
          const errorData = await clientsResponse.json();
          setMessage(`Error fetching clients: ${errorData.message}`);
          setLoading(false);
          return;
        }

        const clientsData = await clientsResponse.json();
        setClients(clientsData);
      } catch (error) {
        setMessage(`Error: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchClientsData();
  }, [token]);

  const handleAddClient = () => {
    router.push('/dashboard/clientes/add');
  };

  const handleEditClient = (client) => {
    setEditingClient(client);
  };

  const handleShowDetails = (client) => {
    setSelectedClient(client); // Abrir el modal de detalles
  };

  const handleCloseDetailsModal = () => {
    setSelectedClient(null); // Cerrar el modal de detalles
  };

  const handleCloseEditModal = () => {
    setEditingClient(null); // Cerrar el modal de edición
  };

  const handleUpdateClient = (updatedClient) => {
    setClients((prevClients) =>
      prevClients.map((client) =>
        client._id === updatedClient._id ? { ...client, ...updatedClient } : client
      )
    );
    setEditingClient(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 via-white to-blue-900 text-gray-700">
        <p className="text-lg font-medium">Loading clients...</p>
      </div>
    );
  }

  if (message) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 via-white to-blue-900 text-gray-700">
        <p className="text-lg font-medium">{message}</p>
      </div>
    );
  }

  return (
 <div className="min-h-screen bg-gradient-to-br from-blue-500 via-blue-100 to-blue-900 text-gray-700 font-roboto">
  <div className="max-w-6xl mx-auto p-10 space-y-6">
    <h1 className="text-4xl font-extrabold text-center text-blue-700 mb-6">Clientes</h1>
    {clients.length === 0 ? (
      <div className="text-center bg-white p-6 rounded-lg shadow-lg">
        <p className="text-gray-700 text-lg">No clients found. Please add a client.</p>
        <button
          onClick={handleAddClient}
          className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300"
        >
          Add Client
        </button>
      </div>
    ) : (
      <ClientTable
        clients={clients}
        onAddClient={handleAddClient}
        onEditClient={handleEditClient}
        onShowDetails={handleShowDetails} // Agregar la función para manejar detalles
      />
    )}
    {selectedClient && (
      <ClientDetailsModal
        client={selectedClient}
        onClose={handleCloseDetailsModal}
      />
    )}
    {editingClient && (
      <EditClientModal
        client={editingClient}
        onClose={handleCloseEditModal}
        onUpdate={handleUpdateClient}
      />
    )}
  </div>
</div>

  );
}
