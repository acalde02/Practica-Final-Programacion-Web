import React, { useState } from 'react';

export default function EditProjectModal({ project, onClose, onUpdate }) {
  const [formData, setFormData] = useState({
    name: project.name,
    code: project.code,
    projectCode: project.projectCode,
    email: project.email,
    notes: project.notes,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onUpdate({ ...project, ...formData });
  };

  return (
    <div className="fixed inset-0 h-screen w-screen bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="animate-fade-in bg-white rounded-xl shadow-2xl p-8 w-[600px] max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">Edit Project</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-800 font-semibold">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 rounded-lg bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-800 font-semibold">Project Code</label>
            <input
              type="text"
              name="projectCode"
              value={formData.projectCode}
              onChange={handleChange}
              className="w-full p-2 rounded-lg bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-800 font-semibold">Code</label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              className="w-full p-2 rounded-lg bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-800 font-semibold">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 rounded-lg bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-800 font-semibold">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="w-full p-2 rounded-lg bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-400 text-white font-bold rounded-lg hover:bg-gray-500 transition-all duration-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition-all duration-300"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
}
