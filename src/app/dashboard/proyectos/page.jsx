'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProjectTable from '@/components/proyectos/ProjectTable';
import ProjectDetailsModal from '@/components/proyectos/ProjectDetailsModal';
import EditProjectModal from '@/components/proyectos/EditProjectModal';

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null); // Modal de detalles
  const [editingProject, setEditingProject] = useState(null); // Modal de edición
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const router = useRouter();
  const token = typeof window !== 'undefined' ? localStorage.getItem('jwt') : null;

  // Fetch Projects
  const fetchProjects = async () => {
    if (!token) {
      setMessage('Error: No token found. Please login first.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('https://bildy-rpmaya.koyeb.app/api/project', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProjects(data);
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
    fetchProjects();
  }, [token]);

  const handleAddProject = () => {
    router.push('/dashboard/proyectos/add');
  };

  const handleDeleteProject = async (projectId) => {
    try {
      const response = await fetch(`https://bildy-rpmaya.koyeb.app/api/project/${projectId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setProjects((prevProjects) => prevProjects.filter((project) => project._id !== projectId));
        setMessage('Project deleted successfully!');
      } else {
        const errorData = await response.json();
        setMessage(`Error: ${errorData.message}`);
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  const handleShowDetails = (project) => {
    setSelectedProject(project);
  };

  const handleCloseDetailsModal = () => {
    setSelectedProject(null);
  };

  const handleEditProject = (project) => {
    setEditingProject(project);
  };

  const handleCloseEditModal = () => {
    setEditingProject(null);
  };

  const handleUpdateProject = (updatedProject) => {
    setProjects((prevProjects) =>
      prevProjects.map((project) =>
        project._id === updatedProject._id ? updatedProject : project
      )
    );
    setEditingProject(null); // Cerrar el modal
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 via-blue-100 to-blue-900 text-gray-700">
        <p className="text-lg font-medium">Loading projects...</p>
      </div>
    );
  }

  if (message) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 via-blue-100 to-blue-900 text-gray-700">
        <p className="text-lg font-medium">{message}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-blue-100 to-blue-900 text-gray-700 font-roboto">
      <div className="max-w-6xl mx-auto p-10 space-y-6">
        <h1 className="text-4xl font-extrabold text-center text-blue-700 mb-6">Projects</h1>
        {projects.length === 0 ? (
          <div className="text-center bg-white p-6 rounded-lg shadow-lg">
            <p className="text-gray-700 text-lg">No projects found. Please add a project.</p>
            <button
              onClick={handleAddProject}
              className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300"
            >
              Add Project
            </button>
          </div>
        ) : (
          <ProjectTable
            projects={projects}
            onDeleteProject={handleDeleteProject}
            onAddProject={handleAddProject}
            onShowDetails={handleShowDetails}
            onEditProject={handleEditProject} // Pasa la función para editar
          />
        )}
        {editingProject && (
          <EditProjectModal
            project={editingProject}
            onClose={handleCloseEditModal}
            onUpdate={handleUpdateProject}
          />
        )}
        {selectedProject && (
          <ProjectDetailsModal
            project={selectedProject}
            onClose={handleCloseDetailsModal}
          />
        )}
      </div>
    </div>
  );
}
