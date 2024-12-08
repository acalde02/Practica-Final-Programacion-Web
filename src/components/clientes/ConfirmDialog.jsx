import React from 'react';

export default function ConfirmDialog({ message, onConfirm }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-lg font-semibold mb-4">{message}</h2>
        <button
          onClick={onConfirm}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 w-full"
        >
          Go to Clients
        </button>
      </div>
    </div>
  );
}
