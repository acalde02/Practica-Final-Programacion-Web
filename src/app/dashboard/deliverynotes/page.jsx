'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DeliveryNoteTable from '@/components/delivery/DeliveryNoteTable';

export default function DeliveryNotesPage() {
  const [deliveryNotes, setDeliveryNotes] = useState([]);
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
        // Fetch delivery notes
        const deliveryNoteResponse = await fetch('https://bildy-rpmaya.koyeb.app/api/deliverynote', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const deliveryNoteData = deliveryNoteResponse.ok ? await deliveryNoteResponse.json() : [];

        // Fetch clients
        const clientResponse = await fetch('https://bildy-rpmaya.koyeb.app/api/client', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const clientData = clientResponse.ok ? await clientResponse.json() : [];

        // Map delivery notes with client names
        const notesWithClientNames = deliveryNoteData.map((note) => ({
          ...note,
          clientName: clientData.find((client) => client._id === note.clientId)?.name || 'Unknown Client',
        }));

        setDeliveryNotes(notesWithClientNames);
      } catch (error) {
        setMessage(`Error: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const handleAddDeliveryNote = () => {
    router.push('/dashboard/deliverynotes/add');
  };

  const handleDeleteDeliveryNote = (id) => {
    setDeliveryNotes((prev) => prev.filter((note) => note._id !== id));
  };

  const handlePDFDownload = async (id) => {
    try {
      const response = await fetch(`https://bildy-rpmaya.koyeb.app/api/deliverynote/pdf/${id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to download PDF');
      }

      // Crear un Blob para el archivo PDF
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      // Crear un enlace para descargar el archivo
      const link = document.createElement('a');
      link.href = url;
      link.download = `delivery_note_${id}.pdf`; // Nombre del archivo
      link.click();

      // Limpiar la URL del objeto después de la descarga
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      setMessage('Error downloading the PDF. Please try again.');
    }
  };

  if (loading) {
    return <p className="text-center text-gray-500">Loading delivery notes...</p>;
  }

  return (
    <div className="p-6 bg-gray-900 text-gray-300 min-h-screen font-roboto">
      <div className="max-w-6xl mx-auto p-8">
        <h1 className="text-3xl font-extrabold text-center text-blue-400 mb-6">Delivery Notes</h1>
        {deliveryNotes.length === 0 ? (
          <div className="bg-gray-800 text-center rounded-lg p-6 shadow-md">
            <p className="text-lg text-gray-400 mb-4">No delivery notes found. Add one to get started!</p>
            <button
              onClick={handleAddDeliveryNote}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add Delivery Note
            </button>
          </div>
        ) : (
          <DeliveryNoteTable
            deliveryNotes={deliveryNotes}
            onDeleteDeliveryNote={handleDeleteDeliveryNote}
            onAddDeliveryNote={handleAddDeliveryNote}
            onDownloadPDF={handlePDFDownload}
          />
        )}
        {message && <p className="text-red-400 mt-4">{message}</p>}
      </div>
    </div>
  );
}
