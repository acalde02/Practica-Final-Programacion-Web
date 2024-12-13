import React, { useState } from 'react';

export default function EditDeliveryNoteModal({
  note,
  onClose,
  onUpdate,
}) {



  // Function to convert DD/MM/YYYY to YYYY-MM-DD
  const formatDateForInput = (dateString) => {
    if (!dateString) return ''; // Handle empty date
    const [day, month, year] = dateString.split('/'); // Split by "/"
    return `${year}-${month}-${day}`; // Rearrange to YYYY-MM-DD
  };

  const [formData, setFormData] = useState({
    client: note.client?.name || 'Unknown Client',
    project: note.projectName || 'Unknown Project',
    format: note.format || '',
    material: note.material || '',
    hours: note.hours || '',
    description: note.description || '',
    workdate: note.date ? formatDateForInput(note.date) : '', // Correct field name
  });
  

  

  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'hours') {
      // Validate hours input
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.format.trim()) return setError('Format is required');
    if (!formData.material.trim()) return setError('Material is required');
    if (!formData.hours || parseInt(formData.hours, 10) <= 0) return setError('Valid hours are required');
    if (!formData.description.trim()) return setError('Description is required');
    if (!formData.workdate.trim()) return setError('Work date is required');

    const updatedData = {
        clientId: note.clientId,
        projectId: note.projectId._id,
        format: formData.format.trim().toLowerCase(),
        material: formData.material.trim(),
        hours: parseInt(formData.hours, 10),
        description: formData.description.trim(),
        workdate: formatDateToDDMMYYYY(formData.workdate),
    };

    console.log('Updated Data:', updatedData); // Verifica que _id esté presente

    onUpdate(updatedData); // Llama a la función de actualización
};

  
  

  const formatDateToDDMMYYYY = (dateString) => {
    if (!dateString) return ''; // Manejar fecha vacía o inválida
    const [year, month, day] = dateString.split('-'); // Dividir el string por "-"
    return `${day}/${month}/${year}`; // Reorganizar en formato dd/mm/yyyy
  };
  
  // Ejemplo de uso:
  const formattedDate = formatDateToDDMMYYYY("2024-12-10");
  console.log(formattedDate); // "10/12/2024"
  

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-[500px]">
        <h2 className="text-2xl font-bold text-white mb-4 text-center">Edit Delivery Note</h2>
        <form onSubmit={handleSubmit}>
          {error && <p className="text-red-400 mb-4">{error}</p>}

          {/* Client Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300">Client:</label>
            <input
              type="text"
              value={formData.client}
              readOnly
              className="w-full px-4 py-2 bg-gray-700 text-white rounded focus:ring-2 focus:ring-blue-500 cursor-not-allowed"
            />
          </div>

          {/* Project Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300">Project:</label>
            <input
              type="text"
              value={formData.project}
              readOnly
              className="w-full px-4 py-2 bg-gray-700 text-white rounded focus:ring-2 focus:ring-blue-500 cursor-not-allowed"
            />
          </div>

          {/* Format Field */}
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

          {/* Material Field */}
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

          {/* Hours Field */}
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

          {/* Description Field */}
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

          {/* Work Date Field */}
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

          {/* Buttons */}
          <div className="mt-6 flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-all"
            >
              Update Delivery Note
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
