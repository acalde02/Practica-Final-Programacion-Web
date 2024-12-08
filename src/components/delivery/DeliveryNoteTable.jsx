import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faDownload } from '@fortawesome/free-solid-svg-icons';

export default function DeliveryNoteTable({ deliveryNotes, onDeleteDeliveryNote, onDownloadPDF, onAddDeliveryNote }) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);

  const handleDeleteClick = (note) => {
    setSelectedNote(note);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedNote) {
      onDeleteDeliveryNote(selectedNote._id);
    }
    setIsConfirmOpen(false);
    setSelectedNote(null);
  };

  const handleCancelDelete = () => {
    setIsConfirmOpen(false);
    setSelectedNote(null);
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-4">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-white">Delivery Notes</h2>
        <button
          onClick={onAddDeliveryNote}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add Delivery Note
        </button>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto">
        <table className="w-full text-left bg-gray-900 rounded-lg">
          <thead>
            <tr className="bg-gray-700 text-gray-300">
              <th className="px-4 py-2">Client</th>
              <th className="px-4 py-2">Project</th>
              <th className="px-4 py-2">Format</th>
              <th className="px-4 py-2">Material/Hours</th>
              <th className="px-4 py-2">Description</th>
              <th className="px-4 py-2">Work Date</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {deliveryNotes.length > 0 ? (
              deliveryNotes.map((note) => (
                <tr key={note._id} className="border-t border-gray-700 hover:bg-gray-800">
                  <td className="px-4 py-2 text-gray-200">{note.clientName}</td>
                  <td className="px-4 py-2 text-gray-200">{note.projectId?.name || 'Unknown Project'}</td>
                  <td className="px-4 py-2 text-gray-200 capitalize">{note.format}</td>
                  <td className="px-4 py-2 text-gray-200">
                    {note.format === 'material' ? note.material : `${note.hours} hours`}
                  </td>
                  <td className="px-4 py-2 text-gray-200">{note.description}</td>
                  <td className="px-4 py-2 text-gray-200">{note.workdate}</td>
                  <td className="px-4 py-2 flex gap-2">
                    <button
                      onClick={() => onDownloadPDF(note._id)}
                      className="p-2 bg-blue-500 rounded hover:bg-blue-600 flex items-center justify-center"
                    >
                      <FontAwesomeIcon icon={faDownload} />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(note)}
                      className="p-2 bg-red-500 rounded hover:bg-red-600 flex items-center justify-center"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-4 py-4 text-center text-gray-400">
                  No delivery notes found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Confirm Delete Modal */}
      {isConfirmOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg text-gray-900">
            <p className="mb-4">
              Are you sure you want to delete the delivery note for client "{selectedNote?.clientName}"?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
