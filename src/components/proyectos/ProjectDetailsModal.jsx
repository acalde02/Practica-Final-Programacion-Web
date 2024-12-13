import React, { useEffect } from 'react';

export default function ProjectDetailsModal({ project, onClose }) {
  // Cerrar el modal al presionar "Escape"
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

  return (
    <div className="fixed inset-0 h-screen w-screen bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="animate-fade-in bg-white rounded-xl shadow-2xl p-8 w-[600px] max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">{project.name}</h2>
        <div className="flex flex-col items-center">
          {/* Project Details */}
          <div className="w-full text-gray-800 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Project Details</h3>
            <p>
              <strong>Project Code:</strong> {project.projectCode || 'N/A'}
            </p>
            <p>
              <strong>Code:</strong> {project.code || 'N/A'}
            </p>
            <p>
              <strong>Email:</strong> {project.email || 'N/A'}
            </p>
            <p>
              <strong>Active:</strong> {project.active ? 'Yes' : 'No'}
            </p>
            <p>
              <strong>Deleted:</strong> {project.deleted ? 'Yes' : 'No'}
            </p>
            <p>
              <strong>Created At:</strong> {new Date(project.createdAt).toLocaleString() || 'N/A'}
            </p>
            <p>
              <strong>Last Updated At:</strong> {new Date(project.updatedAt).toLocaleString() || 'N/A'}
            </p>
            {/* Conditionally render Notes */}
            {project.notes && (
              <p>
                <strong>Notes:</strong> {project.notes}
              </p>
            )}
          </div>

          {/* Address Details */}
          <div className="w-full text-gray-800 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Address</h3>
            {project.address ? (
              <>
                <p>
                  <strong>Street:</strong> {project.address.street || 'N/A'}{' '}
                  {project.address.number || ''}
                </p>
                <p>
                  <strong>Postal:</strong> {project.address.postal || 'N/A'}
                </p>
                <p>
                  <strong>City:</strong> {project.address.city || 'N/A'}
                </p>
                <p>
                  <strong>Province:</strong> {project.address.province || 'N/A'}
                </p>
              </>
            ) : (
              <p className="text-gray-500">No address available.</p>
            )}
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
