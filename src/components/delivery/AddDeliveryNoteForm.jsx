import React, { useState } from 'react';

export default function AddDeliveryNoteForm({ clients = [], projects = [], onSubmit }) {
  const [formData, setFormData] = useState({
    clientId: '',
    projectId: '',
    format: '',
    material: '',
    hours: '',
    description: '',
    workdate: '',
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validación para el campo "hours"
    if (name === 'hours') {
      if (value === '' || /^[0-9]*$/.test(value)) {
        setFormData((prev) => ({ ...prev, [name]: value }));
        setError('');
      } else {
        setError('Hours must be a valid number');
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
      setError('');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return ''; // Si la fecha no es válida
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validaciones requeridas
    if (!formData.clientId) return setError('Client is required');
    if (!formData.projectId) return setError('Project is required');
    if (!formData.format.trim()) return setError('Format is required');
    if (!formData.material.trim()) return setError('Material is required');
    if (!formData.hours || parseInt(formData.hours, 10) <= 0) return setError('Valid hours are required');
    if (!formData.description.trim()) return setError('Description is required');
    if (!formData.workdate.trim()) return setError('Work date is required');

    // Preparar los datos para el envío
    const finalData = {
      clientId: formData.clientId,
      projectId: formData.projectId,
      format: formData.format.trim().toLowerCase(), // Convertir a minúsculas
      material: formData.material.trim(),
      hours: parseInt(formData.hours, 10),
      description: formData.description.trim(),
      workdate: formatDate(formData.workdate.trim()), // Convertir al formato dd/mm/aaaa
    };

    onSubmit(finalData);
  };

  const filteredProjects = projects.filter((project) => project.clientId === formData.clientId);

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-800 text-white p-6 rounded-lg shadow-lg max-w-2xl mx-auto"
    >
      {error && <p className="text-red-400 mb-4">{error}</p>}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300">Client:</label>
        <select
          name="clientId"
          value={formData.clientId}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 bg-gray-700 text-white rounded focus:ring-2 focus:ring-blue-500"
        >
          <option value="" disabled>Select a client</option>
          {clients.map((client) => (
            <option key={client._id} value={client._id}>{client.name}</option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300">Project:</label>
        <select
          name="projectId"
          value={formData.projectId}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 bg-gray-700 text-white rounded focus:ring-2 focus:ring-blue-500"
          disabled={!formData.clientId || filteredProjects.length === 0}
        >
          <option value="" disabled>
            {filteredProjects.length === 0 ? 'None' : 'Select a project'}
          </option>
          {filteredProjects.map((project) => (
            <option key={project._id} value={project._id}>{project.name}</option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300">Format:</label>
        <input
          type="text"
          name="format"
          value={formData.format}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 bg-gray-700 text-white rounded focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300">Material:</label>
        <input
          type="text"
          name="material"
          value={formData.material}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 bg-gray-700 text-white rounded focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300">Hours:</label>
        <input
          type="text"
          name="hours"
          value={formData.hours}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 bg-gray-700 text-white rounded focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300">Description:</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 bg-gray-700 text-white rounded focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300">Work Date:</label>
        <input
          type="date"
          name="workdate"
          value={formData.workdate}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 bg-gray-700 text-white rounded focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <button
        type="submit"
        className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-all"
      >
        Add Delivery Note
      </button>
    </form>
  );
}
