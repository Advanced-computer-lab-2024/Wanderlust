import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Card from './Card';
import {  Eye, EyeOff} from 'lucide-react';
import { Phone, User, Mail, Settings } from 'lucide-react';

const SellerProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // State to control the edit form visibility
  const [updatedInfo, setUpdatedInfo] = useState({ name: '', description: '' });
  const [profilePicture, setProfilePicture] = useState(null); // State for the uploaded image

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const [infoResponse, userResponse] = await Promise.all([
        axios.get("http://localhost:8000/api/admin/getLoggedInInfo", {
          headers: { Authorization: `Bearer ${localStorage.getItem("jwtToken")}` }
        }),
        axios.get("http://localhost:8000/api/admin/getLoggedInUser", {
          headers: { Authorization: `Bearer ${localStorage.getItem("jwtToken")}` }
        }),
      ]);

      const combinedData = {
        ...infoResponse.data,
        ...userResponse.data
      };

      setProfile(combinedData);
      setUpdatedInfo({ name: combinedData.username, description: combinedData.description || '' });
    } catch (error) {
      console.error("Error fetching profile:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };
  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };
  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedInfo((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleProfilePictureChange = (e) => {
    setProfilePicture(e.target.files[0]); // Set the uploaded file to state
  };

  const handleUpdate = async () => {
    try {
      // Update text fields (name, description) first
      const response = await axios.put(
        `http://localhost:8000/api/seller/updateSeller/${profile._id}`,
        updatedInfo,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("jwtToken")}` }
        }
      );

      if (response.status === 200) {
        alert('Seller updated successfully');

        // Handle profile picture upload
       // Handle profile picture upload
if (profilePicture) {
    const formData = new FormData();
    formData.append('file', profilePicture); // Append the file
    formData.append('userId', profile.userId);  // Append the userId
  
    try {
      // Upload image to backend
      await axios.put(
        `http://localhost:8000/api/documents/uploadImage/Seller/logo`, // Ensure userType and documentType are correct
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
            'Content-Type': 'multipart/form-data', // Needed for file upload
          },
        }
      );
      alert('Image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
    }
  }
  
        // Update the profile with updated data
        setProfile({
          ...profile,
          username: updatedInfo.name,
          description: updatedInfo.description,
        });

        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating seller:', error);
      alert('Failed to update seller');
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64">
  <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
</div>;

  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-end items-center mb-8">
          <div className="flex items-center text-indigo-600 cursor-pointer" onClick={() => setShowSettings(!showSettings)}>
            <Settings className="w-6 h-6 mr-1" />
            <span className="text-lg font-semibold">Settings</span>
          </div>
        </div>

        <Card>
          <div className="profile-container">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex items-center mb-6">
                  <div className="w-24 h-24 rounded-full flex items-center justify-center overflow-hidden">
                    {/* Display either the uploaded picture or default avatar */}
                    {profile.logoURL ? (
                      <img src={profile.logoURL} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-12 h-12 text-indigo-600" />
                    )}
                  </div>
                  <div className="ml-6">
                    {!isEditing ? (
                      <>
                        <h2 className="text-2xl font-semibold text-indigo-600">{profile.username}</h2>
                        <p className="text-gray-600 mt-2">{profile.description || "No description available"}</p>
                      </>
                    ) : (
                      <>
                        <input
                          type="text"
                          name="name"
                          value={updatedInfo.name}
                          onChange={handleInputChange}
                          className="mb-2 p-2 border border-gray-300 rounded"
                        />
                        <textarea
                          name="description"
                          value={updatedInfo.description}
                          onChange={handleInputChange}
                          className="p-2 border border-gray-300 rounded w-full"
                        />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleProfilePictureChange} // Handle file input
                          className="mt-4"
                        />
                      </>
                    )}
                    <div className="flex items-center text-gray-600 mt-2">
                      <Phone className="w-4 h-4 mr-2" />
                      <span>{profile.mobileNumber || "N/A"}</span>
                    </div>
                    <div className="flex items-center text-gray-600 mt-2">
                      <Mail className="w-4 h-4 mr-2" />
                      <span>{profile.email}</span>
                    </div>
                  </div>
                </div>
                <button onClick={toggleEdit} className="btn btn-primary mr-4">
                  {isEditing ? 'Cancel' : 'Edit'}
                </button>
                {isEditing && (
                  <button onClick={handleUpdate} className="btn btn-success">
                    Save Changes
                  </button>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>
      {showSettings && (
                <SettingsPopup
                    profile={profile}
                    onClose={toggleSettings}
                />
            )}
    </div>
  );
};
const SettingsPopup = ({ profile, onClose }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showChangePasswordFields, setShowChangePasswordFields] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const handleDeleteAccount = async () => {
    try {

      const response = await axios.get(
        'http://localhost:8000/api/admin/requestDeleteAccount',
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`
          }
        }
      );
      console.log(response);
    } catch (error) {
      const message = error.response?.data?.message || 'An error has occurred. Please try again.';
      alert(`Error: ${message}`);
    }
  };

  const handleChangePassword = async () => {
    try {
      const response = await axios.post(
        'http://localhost:8000/api/admin/updatePassword',
        {
          oldPassword,
          newPassword,
          confirmPassword
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`}
          
        }
      );

      if (response.status === 200) {
        alert('Password updated successfully');
      }
    } catch (error) {
      const message = error.response?.data?.message || 'An error has occurred. Please try again.';
      alert(`Error: ${message}`);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-50" onClick={onClose}></div>
      <div className="bg-white rounded-lg shadow-lg p-6 z-10">
        <h3 className="text-xl font-semibold text-indigo-600 mb-4">Settings</h3>
        <div className="mb-4">
          <h4 className="text-lg font-semibold text-indigo-600 mb-2">Account Details</h4>
          <div className="mb-2">
            <label className="text-gray-700 font-semibold">Username</label>
            <p>{profile.username}</p>
          </div>

          <div className="mb-2">
            <label className="text-gray-700 font-semibold">Password</label>
            <div className="flex items-center">
              <input
                type={showPassword ? "text" : "password"}
                value={profile.password || ""}
                disabled
                className="border rounded px-2 py-1 w-full"
              />
              <button onClick={togglePasswordVisibility} className="ml-2">
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>
          <button
            onClick={() => setShowChangePasswordFields(true)}
            className="text-indigo-600 font-semibold"
          >
            Change Password
          </button>

          {showChangePasswordFields && (
            <div className="mt-4">
              <div className="mb-2">
                <label className="text-gray-700 font-semibold">Old Password</label>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="border rounded px-2 py-1 w-full"
                />
              </div>
              <div className="mb-2">
                <label className="text-gray-700 font-semibold">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="border rounded px-2 py-1 w-full"
                />
              </div>
              <div className="mb-2">
                <label className="text-gray-700 font-semibold">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="border rounded px-2 py-1 w-full"
                />
              </div>
              {passwordError && <p className="text-red-600">{passwordError}</p>}
              <button
                onClick={handleChangePassword}
                className="bg-indigo-600 text-white rounded px-4 py-2 mt-2"
              >
                Update Password
              </button>
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          className="mt-4 bg-red-600 text-white rounded px-4 py-2 mr-2"
        >
          Close
        </button>
        <button
          onClick={handleDeleteAccount}
          className="mt-4 bg-red-600 text-white rounded px-4 py-2"
        >
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default SellerProfile;
