import React, { useState } from 'react';

export default function AddClientForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    cif: '',
    address: {
      street: '',
      number: '',
      postal: '',
      city: '',
      province: '',
    },
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }

    if (!formData.cif.trim() || formData.cif.length !== 9) {
      setError('CIF must have exactly 9 characters');
      return;
    }

    if (!formData.address.street.trim()) {
      setError('Street is required');
      return;
    }

    if (
      !formData.address.number.trim() ||
      isNaN(formData.address.number) ||
      parseInt(formData.address.number) <= 0
    ) {
      setError('Number must be a positive integer');
      return;
    }

    if (
      !formData.address.postal.trim() ||
      formData.address.postal.length !== 5 ||
      isNaN(formData.address.postal)
    ) {
      setError('Postal must have exactly 5 digits');
      return;
    }

    if (!formData.address.city.trim()) {
      setError('City is required');
      return;
    }

    if (!formData.address.province.trim()) {
      setError('Province is required');
      return;
    }

    const finalData = {
      ...formData,
      address: {
        ...formData.address,
        number: parseInt(formData.address.number),
        postal: parseInt(formData.address.postal),
      },
    };

    console.log('Final Data:', finalData);
    onSubmit(finalData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-800 text-white p-4 rounded-lg shadow-lg max-w-md mx-auto"
    >
      {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300">Name:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 mt-1 text-gray-200 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300">CIF:</label>
        <input
          type="text"
          name="cif"
          value={formData.cif}
          onChange={handleChange}
          maxLength={9}
          required
          className="w-full px-3 py-2 mt-1 text-gray-200 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <h3 className="text-md font-semibold text-gray-300 mb-4">Address</h3>
      {['street', 'number', 'postal', 'city', 'province'].map((field) => (
        <div key={field} className="mb-4">
          <label className="block text-sm font-medium text-gray-300">
            {field.charAt(0).toUpperCase() + field.slice(1)}:
          </label>
          <input
            type={field === 'number' || field === 'postal' ? 'text' : 'text'}
            name={`address.${field}`}
            value={formData.address[field]}
            onChange={handleChange}
            maxLength={field === 'postal' ? 5 : undefined}
            required
            className="w-full px-3 py-2 mt-1 text-gray-200 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      ))}
      <button
        type="submit"
        className="w-full px-4 py-2 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600 transition-all duration-300"
      >
        Add Client
      </button>
    </form>
  );
}
