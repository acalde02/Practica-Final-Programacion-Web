import React from 'react';

export default function ConfirmDelete({ isOpen, onConfirm, onCancel, message }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 transition-opacity">
      <div className="bg-white text-gray-800 p-6 rounded-xl shadow-2xl max-w-md w-full animate-fade-in">
        <h2 className="text-lg font-bold mb-4 text-red-600">{message}</h2>
        <div className="flex justify-end gap-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 text-gray-800 font-medium rounded-lg hover:bg-gray-400 transition-all duration-300"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-all duration-300"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
