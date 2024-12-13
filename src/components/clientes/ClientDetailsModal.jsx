import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

export default function ClientDetailsModal({ client, onClose }) {
  const [projects, setProjects] = useState([]);
  const token = typeof window !== 'undefined' ? localStorage.getItem('jwt') : null;

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

  useEffect(() => {
    const fetchProjects = async () => {
      if (!token) {
        console.error('Error: No token found. Please login first.');
        return;
      }

      try {
        const response = await fetch(`https://bildy-rpmaya.koyeb.app/api/project/${client._id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error(`Error fetching projects: ${errorData.message}`);
          return;
        }

        const projectsData = await response.json();
        setProjects(projectsData);
      } catch (error) {
        console.error(`Error fetching projects: ${error.message}`);
      }
    };

    if (client) {
      fetchProjects();
    }
  }, [client, token]);

  return (
    <div className="fixed inset-0 h-screen w-screen bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="animate-fade-in bg-white rounded-xl shadow-2xl p-8 w-[600px] max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">{client.name}</h2>
        <div className="flex flex-col items-center">
          {/* Logo or Placeholder */}
          {client.logo ? (
            <img
              src={client.logo}
              alt={`${client.name} logo`}
              className="w-32 h-32 mb-6 rounded-full object-cover"
            />
          ) : (
            <div className="w-32 h-32 flex items-center justify-center bg-gray-200 rounded-full mb-6">
              <FontAwesomeIcon icon={faUser} className="text-gray-400 text-5xl" />
            </div>
          )}

          {/* Address Section */}
          <div className="w-full text-gray-800 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Address</h3>
            {client.address ? (
              <>
                <p>
                  <strong>Street:</strong> {client.address.street || 'N/A'} {client.address.number || ''}
                </p>
                <p>
                  <strong>Postal:</strong> {client.address.postal || 'N/A'}
                </p>
                <p>
                  <strong>City:</strong> {client.address.city || 'N/A'}
                </p>
                <p>
                  <strong>Province:</strong> {client.address.province || 'N/A'}
                </p>
              </>
            ) : (
              <p className="text-gray-500">No address available.</p>
            )}
          </div>

          {/* Projects Section */}
          <div className="w-full text-gray-800">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Projects</h3>
            {projects.length > 0 ? (
              projects.map((project) => (
                <div key={project._id} className="mb-4">
                  <p>
                    <strong>Name:</strong> {project.name}
                  </p>
                  <p>
                    <strong>Code:</strong> {project.projectCode}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No projects available.</p>
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
