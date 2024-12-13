import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faInfoCircle, faPen } from '@fortawesome/free-solid-svg-icons';

export default function ProjectTable({
  projects,
  onDeleteProject,
  onAddProject,
  onShowDetails,
  onEditProject,
}) {
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
    <div className="bg-gray-100 text-gray-800 font-roboto p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Projects</h2>
        <button
          onClick={onAddProject}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300"
        >
          Add Project
        </button>
      </div>
      <div className="space-y-4">
        {projects.map((project, index) => (
          <motion.div
            key={project._id}
            initial={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: index * 0.2, duration: 0.5 }}
            className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-gray-700">{project.name}</h3>
                <p className="text-sm text-gray-500">Code: {project.projectCode}</p>
                <p className="text-sm text-gray-500">
                  {project.address?.city || 'Unknown City'},{' '}
                  {project.address?.province || 'Unknown Province'}
                </p>
              </div>
              <div className="flex gap-2">
                {/* Delete Button */}
                <button
                  onClick={() => handleDeleteClick(project)}
                  className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  <FontAwesomeIcon icon={faTrash} className="h-5 w-5" />
                </button>
                {/* Details Button */}
                <button
                  onClick={() => onShowDetails(project)}
                  className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  <FontAwesomeIcon icon={faInfoCircle} className="h-5 w-5" />
                </button>
                {/* Edit Button */}
                <button
                  onClick={() => onEditProject(project)}
                  className="p-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                >
                  <FontAwesomeIcon icon={faPen} className="h-5 w-5" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      {isConfirmOpen && (
        <div className="fixed inset-0 h-screen w-screen bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="animate-fade-in bg-white rounded-xl shadow-2xl p-8 w-[500px] max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">
              Confirm Delete
            </h2>
            <p className="text-gray-800 text-center mb-6">
              Are you sure you want to delete the project "{selectedProject?.name}"?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-400 text-white font-bold rounded-lg hover:bg-gray-500 transition-all duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition-all duration-300"
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
