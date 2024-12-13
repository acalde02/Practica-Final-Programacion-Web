  import React, { useState } from 'react';
  import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
  import { faUser, faPen } from '@fortawesome/free-solid-svg-icons';

  export default function EditClientModal({ client, onClose, onUpdate }) {
    const [formData, setFormData] = useState({
      name: client.name,
      cif: client.cif,
      address: { ...client.address },
    });
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const token = typeof window !== 'undefined' ? localStorage.getItem('jwt') : null;

    const handleChange = (e) => {
      const { name, value } = e.target;
      if (name.includes('address.')) {
        const key = name.split('.')[1];
        setFormData((prev) => ({
          ...prev,
          address: {
            ...prev.address,
            [key]: value,
          },
        }));
      } else {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
    };

    const handleFileChange = (e) => {
      setFile(e.target.files[0]);
    };

    const handleUpdate = async () => {
      setLoading(true);
      try {
        await fetch(`https://bildy-rpmaya.koyeb.app/api/client/${client._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        });

        if (file) {
          const logoFormData = new FormData();
          logoFormData.append('image', file, file.name);

          await fetch(`https://bildy-rpmaya.koyeb.app/api/client/logo/${client._id}`, {
            method: 'PATCH',
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: logoFormData,
          });
        }

        onUpdate({ ...client, ...formData });
      } catch (error) {
        console.error('Error updating client:', error);
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="fixed inset-0 h-screen w-screen bg-black bg-opacity-50 flex items-center justify-center z-50 pt">
        <div className="animate-fade-in bg-gray-50 p-8 rounded-xl shadow-2xl w-[600px] max-h-[90vh] overflow-y-auto">
          {/* Logo Section */}
          <div className="relative mb-6 flex justify-center">
            {client.logo ? (
              <div className="group relative w-32 h-32">
                <img
                  src={client.logo}
                  alt={`${client.name} logo`}
                  className="w-32 h-32 rounded-full object-cover"
                  onError={(e) => (e.target.src = 'https://via.placeholder.com/128')}
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <label htmlFor="logo-upload" className="cursor-pointer text-white flex items-center gap-2">
                    <FontAwesomeIcon icon={faPen} className="text-xl" />
                  </label>
                  <input
                    id="logo-upload"
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              </div>
            ) : (
              <div className="group relative w-32 h-32 bg-gray-200 flex items-center justify-center rounded-full">
                <FontAwesomeIcon icon={faUser} className="text-gray-400 text-5xl" />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <label htmlFor="logo-upload" className="cursor-pointer text-white flex items-center gap-2">
                    <FontAwesomeIcon icon={faPen} className="text-xl" />
                  </label>
                  <input
                    id="logo-upload"
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Form Section */}
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Edit Client</h2>
          <div className="space-y-4">
            {[
              { label: 'Name', name: 'name', value: formData.name },
              { label: 'CIF', name: 'cif', value: formData.cif },
              { label: 'Street', name: 'address.street', value: formData.address.street },
              { label: 'Number', name: 'address.number', value: formData.address.number },
              { label: 'Postal', name: 'address.postal', value: formData.address.postal },
              { label: 'City', name: 'address.city', value: formData.address.city },
              { label: 'Province', name: 'address.province', value: formData.address.province },
            ].map((field) => (
              <div key={field.name}>
                <label className="block text-gray-600">{field.label}</label>
                <input
                  type="text"
                  name={field.name}
                  value={field.value}
                  onChange={handleChange}
                  className="w-full p-2 rounded-lg bg-gray-200 text-gray-800"
                />
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-400 text-gray-800 font-medium rounded-lg hover:bg-gray-500 transition-all duration-300"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdate}
              className={`px-4 py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition-all duration-300 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update'}
            </button>
          </div>
        </div>
      </div>
    );
  }
