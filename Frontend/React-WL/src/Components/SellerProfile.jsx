import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Card from './Card';

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
    formData.append('userId', profile._id);  // Append the userId
  
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

  if (loading) return <div>Loading...</div>;

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
    </div>
  );
};

export default SellerProfile;
