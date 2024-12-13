import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

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
  const router = useRouter();

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
      className="bg-gray-100 text-gray-800 p-6 rounded-xl shadow-lg max-w-3xl mx-auto space-y-6"
    >
      {error && <p className="text-red-500 text-center text-sm">{error}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 mt-1 text-gray-800 bg-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">CIF:</label>
          <input
            type="text"
            name="cif"
            value={formData.cif}
            onChange={handleChange}
            maxLength={9}
            className="w-full px-4 py-2 mt-1 text-gray-800 bg-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      <h3 className="text-lg font-semibold text-gray-800">Address</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {['street', 'number', 'postal', 'city', 'province'].map((field) => (
          <div key={field} className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              {field.charAt(0).toUpperCase() + field.slice(1)}:
            </label>
            <input
              type="text"
              name={`address.${field}`}
              value={formData.address[field]}
              onChange={handleChange}
              maxLength={field === 'postal' ? 5 : undefined}
              className="w-full px-4 py-2 mt-1 text-gray-800 bg-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center">
        <button
          type="button"
          onClick={() => router.push('/dashboard/clientes')}
          className="px-4 py-2 bg-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-400 transition-all duration-300"
        >
          Back
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all duration-300"
        >
          Add Client
        </button>
      </div>
    </form>
  );
}
