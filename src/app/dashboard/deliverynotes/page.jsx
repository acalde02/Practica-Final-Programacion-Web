'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DeliveryNoteTable from '@/components/delivery/DeliveryNoteTable';
import ClientDetailsModal from '@/components/clientes/ClientDetailsModal';
import ProjectDetailsModal from '@/components/proyectos/ProjectDetailsModal';
import DeliveryNoteDetailsModal from '@/components/delivery/DeliveryNoteDetailsModal';
import EditDeliveryNoteModal from '@/components/delivery/EditDeliveryNoteModal';

export default function DeliveryNotesPage() {
  const [deliveryNotes, setDeliveryNotes] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null); // Modal for client details
  const [selectedProject, setSelectedProject] = useState(null); // Modal for project details
  const [selectedDeliveryNote, setSelectedDeliveryNote] = useState(null); // Modal for delivery note details
  const [editingDeliveryNote, setEditingDeliveryNote] = useState(null); // Modal for editing delivery note
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const router = useRouter();
  const token = typeof window !== 'undefined' ? localStorage.getItem('jwt') : null;

  const fetchDeliveryNotes = async () => {
    if (!token) {
      setMessage('Error: No token found. Please login first.');
      setLoading(false);
      return;
    }
  
    try {
      // Fetch delivery notes
      const response = await fetch('https://bildy-rpmaya.koyeb.app/api/deliverynote', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.ok) {
        const notes = await response.json();
  
        // Extract unique client IDs from delivery notes
        const clientIds = [...new Set(notes.map((note) => note.clientId))];
  
        // Fetch client details for each unique client ID
        const clientFetches = clientIds.map((id) =>
          fetch(`https://bildy-rpmaya.koyeb.app/api/client/${id}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }).then((res) => (res.ok ? res.json() : null))
        );
  
        const clients = await Promise.all(clientFetches);
  
        // Create a map of clientId -> client details
        const clientMap = clients.reduce((map, client) => {
          if (client) map[client._id] = client;
          return map;
        }, {});
  
        // Enrich delivery notes with client details
        const enrichedNotes = notes.map((note) => ({
          ...note,
          client: clientMap[note.clientId] || { name: 'Unknown Client' },
        }));
  
        setDeliveryNotes(enrichedNotes);
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
  

  useEffect(() => {
    fetchDeliveryNotes();
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

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `delivery_note_${id}.pdf`;
      link.click();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      setMessage('Error downloading the PDF. Please try again.');
    }
  };

  const handleShowClientDetails = async (clientId) => {
    try {
      const response = await fetch(`https://bildy-rpmaya.koyeb.app/api/client/${clientId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const clientData = await response.json();
        setSelectedClient(clientData);
      } else {
        setMessage('Failed to fetch client details.');
      }
    } catch (error) {
      setMessage('Error fetching client details.');
    }
  };

  const handleShowProjectDetails = async (projectId) => {
    try {
      const response = await fetch(`https://bildy-rpmaya.koyeb.app/api/project/one/${projectId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const projectData = await response.json();
        setSelectedProject(projectData);
      } else {
        setMessage('Failed to fetch project details.');
      }
    } catch (error) {
      setMessage('Error fetching project details.');
    }
  };

  const handleShowDetails = async (noteId) => {
    try {
      const response = await fetch(`https://bildy-rpmaya.koyeb.app/api/deliverynote/${noteId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const noteData = await response.json();
        const mappedNote = {
          ...noteData,
          clientName: noteData.client?.name || 'Unknown Client',
          projectName: noteData.projectName || 'Unknown Project',
        };
        setSelectedDeliveryNote(mappedNote);
      } else {
        const errorData = await response.json();
        setMessage('Failed to fetch delivery note details.');
      }
    } catch (error) {
      setMessage('Error fetching delivery note details.');
    }
  };

const handleEditNote = async (note) => {
    try {
        // Realiza la solicitud para obtener la nota
        const response = await fetch(`https://bildy-rpmaya.koyeb.app/api/deliverynote/${note._id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.ok) {
            const noteData = await response.json();

            // Extraer clientId desde el contenedor mapeado
            const clientId = noteData.client?._id || note.clientId || 'Unknown Client ID'; // Usa `cif` como ID del cliente si `_id` no está disponible
            const projectId = noteData.project?._id || note.projectId || 'Unknown Project ID';

            const mappedNote = {
                ...noteData,
                clientId, // Mapea el clientId desde el cliente
                projectId, // Mantén el projectId tal como está
            };

            // Configura el estado de edición
            console.log('Mapped Note with ClientId:', mappedNote); // Verifica en consola
            setEditingDeliveryNote(mappedNote);
        } else {
            console.error('Error fetching the note for editing');
        }
    } catch (error) {
        console.error('Error in handleEditNote:', error);
    }
};



  

const handleSaveEditNote = async (updatedNote) => {
  // Obtener el ID de la nota desde el estado actual de edición
  const noteId = editingDeliveryNote?._id;

  if (!noteId) {
      console.error("No note ID available for update.");
      return;
  }

  try {
      const response = await fetch(`https://bildy-rpmaya.koyeb.app/api/deliverynote/${noteId}`, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedNote),
      });

      if (response.ok) {
          fetchDeliveryNotes();
          setEditingDeliveryNote(null);
          setMessage('Delivery note updated successfully!');
      } else {
          const errorData = await response.json();
          setMessage(`Failed to update delivery note: ${errorData.message}`);
      }
  } catch (error) {
      setMessage('Error updating delivery note.');
      console.error(error);
  }
};


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 via-white to-blue-900 text-gray-700">
        <p className="text-lg font-medium">Loading delivery notes...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-blue-100 to-blue-900 text-gray-700 font-roboto">
      <div className="max-w-6xl mx-auto p-10 space-y-6">
        <h1 className="text-4xl font-extrabold text-center text-blue-700 mb-6">Delivery Notes</h1>
        {deliveryNotes.length === 0 ? (
          <div className="text-center bg-white p-6 rounded-lg shadow-lg">
            <p className="text-gray-700 text-lg">No delivery notes found. Add one to get started!</p>
            <button
              onClick={handleAddDeliveryNote}
              className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300"
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
            onShowClientDetails={handleShowClientDetails}
            onShowProjectDetails={handleShowProjectDetails}
            onShowDetails={handleShowDetails}
            onEditNote={handleEditNote}
          />
        )}
        {selectedClient && (
          <ClientDetailsModal client={selectedClient} onClose={() => setSelectedClient(null)} />
        )}
        {selectedProject && (
          <ProjectDetailsModal project={selectedProject} onClose={() => setSelectedProject(null)} />
        )}
        {selectedDeliveryNote && (
          <DeliveryNoteDetailsModal
            note={selectedDeliveryNote}
            onClose={() => setSelectedDeliveryNote(null)}
          />
        )}
        {editingDeliveryNote && (
          <EditDeliveryNoteModal
            note={editingDeliveryNote}
            onClose={() => setEditingDeliveryNote(null)}
            onUpdate={handleSaveEditNote}
          />
        )}
        {message && <p className="text-red-400 text-center mt-4">{message}</p>}
      </div>
    </div>
  );
}
