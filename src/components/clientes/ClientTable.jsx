import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ConfirmDelete from '@/components/clientes/ConfirmDelete';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faInfoCircle, faEdit } from '@fortawesome/free-solid-svg-icons';
import ClientDetailsModal from '@/components/clientes/ClientDetailsModal';

export default function ClientList({
  clients,
  onAddClient,
  onDeleteClient,
  onEditClient,
}) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);

  const handleDeleteClick = (client) => {
    setSelectedClient(client);
    setIsConfirmOpen(true);
  };

  const handleDetailsClick = async (client) => {
    setSelectedClient(client);
    setIsDetailsOpen(true);
  };

  const handleEditClick = (client) => {
    onEditClient(client);
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

  const handleDetailsClose = () => {
    setIsDetailsOpen(false);
    setSelectedClient(null);
  };

  return (
    <div className="bg-gray-100 text-gray-800 font-roboto p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Clients</h2>
        <button
          onClick={onAddClient}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Add Client
        </button>
      </div>
      <div className="space-y-4">
        {clients.map((client, index) => (
          <motion.div
            key={client._id}
            initial={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: index * 0.2, duration: 0.5 }}
            className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-stone-500">{client.name}</h3>
                <p className="text-sm text-gray-500">CIF: {client.cif}</p>
                <p className="text-sm text-gray-500">
                  {client.address.city}, {client.address.province}
                </p>
              </div>
              <div className="flex gap-2">
                {/* Delete Button */}
                <button
                  onClick={() => handleDeleteClick(client)}
                  className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  <FontAwesomeIcon icon={faTrash} className="h-5 w-5" />
                </button>
                {/* Details Button */}
                <button
                  onClick={() => handleDetailsClick(client)}
                  className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  <FontAwesomeIcon icon={faInfoCircle} className="h-5 w-5" />
                </button>
                {/* Edit Button */}
                <button
                  onClick={() => handleEditClick(client)}
                  className="p-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                >
                  <FontAwesomeIcon icon={faEdit} className="h-5 w-5" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      <ConfirmDelete
        isOpen={isConfirmOpen}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        message={`Are you sure you want to delete the client "${selectedClient?.name}"?`}
      />
      {isDetailsOpen && (
        <ClientDetailsModal client={selectedClient} onClose={handleDetailsClose} />
      )}
    </div>
  );
}
