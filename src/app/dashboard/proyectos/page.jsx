'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProjectTable from '@/components/proyectos/ProjectTable';

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const router = useRouter();
  const token = typeof window !== 'undefined' ? localStorage.getItem('jwt') : null;

  useEffect(() => {
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

    fetchProjects();
  }, [token]);

  const handleAddProject = () => {
    router.push('/dashboard/proyectos/add');
  };

  const handleDeleteProject = async (projectId) => {
    if (!token) {
      setMessage('Error: No token found. Please login first.');
      return;
    }

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

  if (loading) {
    return <p className="text-center text-gray-500">Loading projects...</p>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-200 font-roboto">
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-3xl font-extrabold text-center text-blue-400 mb-6">Projects</h1>
        {projects.length === 0 ? (
          <div className="bg-gray-800 text-center rounded-lg p-6 shadow-md">
            <p className="text-lg text-gray-400 mb-4">No projects found. Please add a project.</p>
            <button
              onClick={handleAddProject}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Add Project
            </button>
          </div>
        ) : (
          <ProjectTable projects={projects} onDeleteProject={handleDeleteProject} onAddProject={handleAddProject} />
        )}
        {message && <p className="text-red-400 text-center mt-4">{message}</p>}
      </div>
    </div>
  );
}
