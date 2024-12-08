import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

export default function ProjectTable({ projects, onDeleteProject, onAddProject }) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const handleDeleteClick = (project) => {
    setSelectedProject(project);
    setIsConfirmOpen(true);
  };

  const handleConfirm = () => {
    if (selectedProject) {
      onDeleteProject(selectedProject._id);
    }
    setIsConfirmOpen(false);
    setSelectedProject(null);
  };

  const handleCancel = () => {
    setIsConfirmOpen(false);
    setSelectedProject(null);
  };

  return (
    <div className="bg-gray-900 text-gray-300 font-roboto p-6 rounded-lg shadow-lg">
      {/* Título y botón */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white">Projects</h2>
        <button
          onClick={onAddProject}
          className="px-4 py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition-all duration-300"
        >
          Add Project
        </button>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full bg-gray-800 rounded-lg">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="text-left px-4 py-2">Name</th>
              <th className="text-left px-4 py-2">Project Code</th>
              <th className="text-left px-4 py-2">Email</th>
              <th className="text-left px-4 py-2">City</th>
              <th className="text-left px-4 py-2">Province</th>
              <th className="text-left px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project._id} className="border-t border-gray-700">
                <td className="px-4 py-2 text-gray-300">{project.name}</td>
                <td className="px-4 py-2 text-gray-300">{project.projectCode}</td>
                <td className="px-4 py-2 text-gray-300">{project.email}</td>
                <td className="px-4 py-2 text-gray-300">{project.address.city}</td>
                <td className="px-4 py-2 text-gray-300">{project.address.province}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleDeleteClick(project)}
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
      {isConfirmOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg w-96">
            <p className="mb-4 text-gray-300">
              Are you sure you want to delete the project "{selectedProject?.name}"?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-600 text-gray-300 rounded hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
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
