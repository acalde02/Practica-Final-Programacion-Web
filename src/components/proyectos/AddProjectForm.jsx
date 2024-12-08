import React, { useState } from 'react';

export default function AddProjectForm({ onSubmit, clients = [] }) {
  const [formData, setFormData] = useState({
    name: '',
    projectCode: '',
    email: '',
    code: '',
    clientId: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!clients.length) {
      alert('No clients available to assign the project.');
      return;
    }

    const selectedClient = clients.find((client) => client._id === formData.clientId);
    if (!selectedClient) {
      alert('Please select a valid client.');
      return;
    }

    const finalFormData = {
      ...formData,
      address: selectedClient.address,
    };

    onSubmit(finalFormData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-900 text-white p-6 rounded-lg shadow-lg max-w-2xl mx-auto">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300">Name:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 mt-1 bg-gray-800 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300">Project Code:</label>
        <input
          type="text"
          name="projectCode"
          value={formData.projectCode}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 mt-1 bg-gray-800 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300">Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 mt-1 bg-gray-800 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300">Internal Code:</label>
        <input
          type="text"
          name="code"
          value={formData.code}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 mt-1 bg-gray-800 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300">Client:</label>
        <select
          name="clientId"
          value={formData.clientId}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 mt-1 bg-gray-800 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={!clients.length}
        >
          <option value="" disabled>
            {clients.length ? 'Select a client' : 'No clients available'}
          </option>
          {clients.map((client) => (
            <option key={client._id} value={client._id}>
              {client.name}
            </option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        className={`w-full px-4 py-2 mt-4 font-bold text-white rounded-lg transition-all duration-300 ${
          clients.length ? 'bg-blue-500 hover:bg-blue-600 focus:ring-2 focus:ring-blue-500' : 'bg-gray-500 cursor-not-allowed'
        }`}
        disabled={!clients.length}
      >
        Add Project
      </button>
    </form>
  );
}
