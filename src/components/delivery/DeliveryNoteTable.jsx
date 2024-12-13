import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faDownload, faInfoCircle, faPen } from '@fortawesome/free-solid-svg-icons';

export default function DeliveryNoteTable({
  deliveryNotes,
  onDeleteDeliveryNote,
  onDownloadPDF,
  onAddDeliveryNote,
  onShowClientDetails,
  onShowProjectDetails,
  onEditNote,
  onShowDetails,
}) {
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
    <div className="bg-gray-100 text-gray-800 font-roboto p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Delivery Notes</h2>
        <button
          onClick={onAddDeliveryNote}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300"
        >
          Add Delivery Note
        </button>
      </div>
      <div className="space-y-4">
        <AnimatePresence>
          {deliveryNotes.length > 0 ? (
            deliveryNotes.map((note, index) => (
              <motion.div
                key={note._id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow space-y-4"
              >
                <div className="flex justify-between">
                  {/* Client and Project Info */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-700">
                      <span
                        onClick={() => onShowClientDetails(note.clientId)}
                        className="text-blue-500 underline hover:text-blue-600 transition-all cursor-pointer"
                      >
                        {note.client?.name || 'Unknown Client'}
                      </span>
                    </h3>
                    <p className="text-sm text-gray-500">
                      Project:{' '}
                      <span
                        onClick={() => onShowProjectDetails(note.projectId._id)}
                        className="text-blue-500 underline hover:text-blue-600 transition-all cursor-pointer"
                      >
                        {note.projectId?.name || 'Unknown Project'}
                      </span>
                    </p>
                  </div>
                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => onShowDetails(note._id)}
                      className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-300"
                      title="View Details"
                    >
                      <FontAwesomeIcon icon={faInfoCircle} />
                    </button>
                    <button
                      onClick={() => onEditNote(note)}
                      className="p-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-all duration-300"
                      title="Edit Note"
                    >
                      <FontAwesomeIcon icon={faPen} />
                    </button>
                    <button
                      onClick={() => onDownloadPDF(note._id)}
                      className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300"
                      title="Download PDF"
                    >
                      <FontAwesomeIcon icon={faDownload} />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(note)}
                      className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-300"
                      title="Delete Note"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </div>
                {/* Additional Details */}
                <div className="text-gray-600">
                  <p>
                    <strong>Format:</strong> {note.format}
                  </p>
                  <p>
                    <strong>Material/Hours:</strong>{' '}
                    {note.format === 'material' ? note.material : `${note.hours} hours`}
                  </p>
                  <p>
                    <strong>Description:</strong> {note.description}
                  </p>
                  <p>
                    <strong>Work Date:</strong> {note.workdate}
                  </p>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center text-gray-500">
              No delivery notes found. Add one to get started!
            </div>
          )}
        </AnimatePresence>
      </div>
      {isConfirmOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-gray-800 max-w-md">
            <p className="text-center mb-4">
              Are you sure you want to delete the delivery note for client "{selectedNote?.clientName}"?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 bg-gray-400 text-gray-800 rounded-lg hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
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
