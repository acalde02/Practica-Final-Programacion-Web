import React, { useEffect } from 'react';

export default function DeliveryNoteDetailsModal({ note, onClose }) {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleString();
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
      <div className="animate-fade-in bg-white rounded-xl shadow-2xl p-8 w-[600px] max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">Delivery Note Details</h2>
        <div className="flex flex-col items-center">
          {/* Details Section */}
          <div className="w-full text-gray-800 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">General Information</h3>
            <p>
              <strong>Client:</strong> {note.client?.name || 'Unknown Client'}
            </p>
            <p>
              <strong>Project:</strong> {note.projectName || 'Unknown Project'}
            </p>
            <p>
              <strong>Format:</strong> {note.format || 'N/A'}
            </p>
          </div>

          {/* Additional Details */}
          <div className="w-full text-gray-800">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Additional Details</h3>
            <p>
              <strong>Material/Hours:</strong>{' '}
              {note.format === 'material' ? note.material || 'N/A' : `${note.hours || '0'} hours`}
            </p>
            <p>
              <strong>Description:</strong> {note.description || 'N/A'}
            </p>
            <p>
              <strong>Work Date:</strong> {formatDate(note.workdate)}
            </p>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="mt-6 w-full px-4 py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition-all duration-300"
        >
          Close
        </button>
      </div>
    </div>
  );
}
