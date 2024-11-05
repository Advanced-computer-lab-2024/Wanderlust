// SettingsPopup.js
import React from 'react';
import { X } from 'lucide-react';

const ProfileSettings = ({ profile, onClose }) => {
  if (!profile) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-96 max-w-full p-6 relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700">
          <X className="w-5 h-5" />
        </button>
        
        {/* Account Details Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-indigo-600 border-b pb-2 mb-4">Account Details</h3>
          <div className="text-gray-700">
            <p><strong>Username:</strong> {profile.username}</p>
            <p><strong>Mobile:</strong> {profile.mobileNumber || "N/A"}</p>
            <p><strong>Email:</strong> {profile.email}</p>
          </div>
        </div>

        {/* Complaints Section */}
        <div>
          <h3 className="text-lg font-semibold text-indigo-600 border-b pb-2 mb-4">Complaints</h3>
          <p className="text-gray-500">No complaints found</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
