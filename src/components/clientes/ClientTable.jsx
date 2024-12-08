import React, { useState } from 'react';
import ConfirmDelete from '@/components/clientes/ConfirmDelete';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

export default function ClientTable({ clients, onAddClient, onDeleteClient }) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);

  const handleDeleteClick = (client) => {
    setSelectedClient(client);
    setIsConfirmOpen(true);
  };

  const handleConfirm = () => {
    if (selectedClient) {
      onDeleteClient(selectedClient._id);
    }
    setIsConfirmOpen(false);
    setSelectedClient(null);
  };

  const handleCancel = () => {
    setIsConfirmOpen(false);
    setSelectedClient(null);
  };

  return (
    <div className="bg-gray-900 text-gray-300 font-roboto p-6 rounded-lg shadow-lg">
      {/* Contenedor flexible para ajustar el ancho */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-white">Clients</h2>
        <button
          onClick={onAddClient}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Add Client
        </button>
      </div>
      {/* Tabla con overflow controlado */}
      <div className="overflow-x-auto">
        <table className="w-full bg-gray-800 rounded-lg">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="text-left px-4 py-2">Name</th>
              <th className="text-left px-4 py-2">CIF</th>
              <th className="text-left px-4 py-2">City</th>
              <th className="text-left px-4 py-2">Province</th>
              <th className="text-left px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client._id} className="border-t border-gray-700">
                <td className="px-4 py-2 text-gray-300">{client.name}</td>
                <td className="px-4 py-2 text-gray-300">{client.cif}</td>
                <td className="px-4 py-2 text-gray-300">{client.address.city}</td>
                <td className="px-4 py-2 text-gray-300">{client.address.province}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleDeleteClick(client)}
                    className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    <FontAwesomeIcon icon={faTrash} className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Modal de confirmación */}
      <ConfirmDelete
        isOpen={isConfirmOpen}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        message={`Are you sure you want to delete the client "${selectedClient?.name}"?`}
      />
    </div>
  );
}
