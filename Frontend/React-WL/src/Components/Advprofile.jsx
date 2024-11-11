
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Card from './Card';
import { Phone, Calendar, User, Mail, Clock, Briefcase, Award, Star, Wallet, BarChart2, PlusCircle, Settings, Eye, EyeOff } from 'lucide-react';

const advProfile = () => {
  const [profile, setProfile] = useState(null);
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [username, setUsername] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showUpdateForm, setShowUpdateForm] = useState(false);

  const [YOE, setYoe] = useState(profile?.YOE || '');
  const [previousWork, setPreviousWork] = useState(profile?.previousWork || '');
  const [phoneNumber, setPhoneNumber] = useState(info?.mobileNumber || '');

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    fetchinfo();
  }, []);

  useEffect(() => {
    if (profile) {
      setYoe(profile.YOE || '');
      setPreviousWork(profile.previousWork || '');
    }
  }, [profile]);

  useEffect(() => {
    if (info) {
      setPhoneNumber(info.mobileNumber || '');
    }
  }, [info]);

  const fetchProfile = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/admin/getLoggedInUser", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`
        }
      });
      setProfile(response.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchinfo = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/admin/getLoggedInInfo", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`
        }
      });
      setInfo(response.data);
      setUsername(response.data.username);
    } catch (error) {
      console.error("Error fetching info:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  const handleImageUpload = (event) => {
    setSelectedImage(event.target.files[0]);
  };

  const uploadProfileImage = async () => {
    try {
      const formData = new FormData();
      formData.append('image', selectedImage);

      const response = await axios.post(
        `http://localhost:8000/api/uploadImage/tourGuide/photo`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
          },
        }
      );

      if (response.data.success) {
        setProfile((prevProfile) => ({
          ...prevProfile,
          profileImage: response.data.imageUrl,
        }));
        alert('Profile image uploaded successfully!');
      } else {
        alert('Error uploading profile image. Please try again.');
      }
    } catch (error) {
      console.error('Error uploading profile image:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  const handleUpdateProfile = () => {
    setShowUpdateForm(true);
  };

  const handleSaveProfile = async () => {
    try {
      console.log('Sending update request with:', {
        username,
        mobileNumber: phoneNumber,
        YOE,
        previousWork,
      });

      const response = await axios.put(
        'http://localhost:8000/api/tourGuide/updatetgprofile',
        {
          
          mobileNumber: phoneNumber,
          YOE,
          previousWork,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        }
      );

      if (response.data) {
        setProfile((prevProfile) => ({
          ...prevProfile,
          YOE: response.data.YOE,
          previousWork: response.data.previousWork,
        }));

        // setInfo((prevInfo) => ({
        //   ...prevInfo,
        //   mobileNumber: response.data.mobileNumber,
        // }));

        setShowUpdateForm(false);
        alert('Profile updated successfully!');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      const errorMessage = error.response?.data?.error || 'An error occurred. Please try again later.';
      alert(errorMessage);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
  );

  if (error) return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
      <strong className="font-bold">Error!</strong>
      <span className="block sm:inline"> {error.message}</span>
    </div>
  );

  if (!profile) return null;

  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center text-indigo-600 cursor-pointer ml-auto" onClick={toggleSettings}>
          <Settings className="w-6 h-6 mr-1" />
          <span className="text-lg font-semibold">Settings</span>
        </div>
      </div>
      {showSettings && <SettingsPopup profile={info} username={username} onClose={toggleSettings} />}

      <Card>
        <div className="profile-container">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex items-center mb-6">
                <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center">
                  {profile.profileImage ? (
                    <img
                      src={profile.profileImage}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-12 h-12 text-indigo-600" />
                  )}
                </div>
                <div className="ml-6">
                  {info && <h2 className="text-2xl font-semibold text-indigo-600">{info.username}</h2>}
                  <div className="flex items-center text-gray-600 mt-2">
                    <Phone className="w-4 h-4 mr-2" />
                    {info && <span>{info.mobileNumber || "N/A"}</span>}
                  </div>
                  <div className="flex items-center text-gray-600 mt-2">
                    <Mail className="w-4 h-4 mr-2" />
                    {info && <span>{info.email || "N/A"}</span>}
                  </div>
                  <div className="flex items-center text-gray-600 mt-2">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{profile.YOE || "N/A"} years of experience</span>
                  </div>
                  <div className="flex items-center text-gray-600 mt-2">
                    <Briefcase className="w-4 h-4 mr-2" />
                    <span>{profile.previousWork || "N/A"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {showUpdateForm && (
        <Card>
          <div className="profile-container">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex items-center text-gray-600 mt-2">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>Years of Experience: </span>
                  <input
                    type="number"
                    value={YOE}
                    onChange={(e) => setYoe(e.target.value)}
                    className="bg-gray-200 text-gray-800 rounded p-1 w-20"
                  />
                </div>
                <div className="flex items-center text-gray-600 mt-2">
                  <Briefcase className="w-4 h-4 mr-2" />
                  <span>Previous Work: </span>
                  <input
                    type="text"
                    value={previousWork}
                    onChange={(e) => setPreviousWork(e.target.value)}
                    className="bg-gray-200 text-gray-800 rounded p-1 w-40"
                  />
                </div>
                <div className="flex items-center text-gray-600 mt-2">
                  <Phone className="w-4 h-4 mr-2" />
                  <span>Phone Number: </span>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="bg-gray-200 text-gray-800 rounded p-1 w-24"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-600">Profile Photo</label>
                  <div className="flex items-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="bg-gray-200 text-gray-800 rounded p-2 mr-2"
                    />
                    {profile.profileImage && (
                      <img
                        src={profile.profileImage}
                        alt="Profile"
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    )}
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={handleSaveProfile}
                    className="bg-indigo-600 text-white py-2 px-4 rounded-md"
                  >
                    Save Profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      <button
        onClick={handleUpdateProfile}
        className="bg-indigo-600 text-white py-2 px-4 rounded-md mt-4"
      >
        Update Profile
      </button>
    </div>
  );
};

const SettingsPopup = ({ profile, username, onClose }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showChangePasswordFields, setShowChangePasswordFields] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleChangePassword = async () => {
    console.log(oldPassword);
    try {
      const response = await axios.post(
        'http://localhost:8000/api/admin/updatePassword',
        {
          oldPassword: oldPassword,
          newPassword: newPassword,
          confirmPassword: confirmPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        }
      );

      if (response.status === 200) {
        alert('Password updated successfully');
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        alert(`Error: ${error.response.data.message}`);
      } else {
        alert('An error occurred. Please try again.');
      }
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
            <label className="block text-gray-600">Username</label>
            {info && <p className="text-gray-800">{profile.username}</p>}
          </div>
          <div className="mb-2">
            <label className="block text-gray-600">Email</label>
            <p className="text-gray-800">{profile.email}</p>
          </div>
          <div className="mb-2">
            <label className="block text-gray-600">Password</label>
            <div className="flex items-center">
              <input
                type={showPassword ? 'text' : 'password'}
                value={profile.password || ""}
                readOnly
                className="bg-gray-200 text-gray-800 rounded p-2 mr-2 w-40"
              />
              <button onClick={togglePasswordVisibility}>
                {showPassword ? <EyeOff className="w-5 h-5 text-gray-600" /> : <Eye className="w-5 h-5 text-gray-600" />}
              </button>
            </div>
          </div>

          <div className="mt-4 mb-4">
            <button
              onClick={() => setShowChangePasswordFields(!showChangePasswordFields)}
              className="bg-indigo-600 text-white py-2 px-4 rounded-md">
              Change Password
            </button>
          </div>

          {showChangePasswordFields && (
            <div>
              <div className="mb-2">
                <label className="block text-gray-600">Old Password</label>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="bg-gray-200 text-gray-800 rounded p-2 w-full"
                />
              </div>
              <div className="mb-2">
                <label className="block text-gray-600">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="bg-gray-200 text-gray-800 rounded p-2 w-full"
                />
              </div>
              <div className="mb-2">
                <label className="block text-gray-600">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-gray-200 text-gray-800 rounded p-2 w-full"
                />
              </div>
              {passwordError && (
                <div className="text-red-500 text-sm mb-4">{passwordError}</div>
              )}
              <button
                onClick={handleChangePassword}
                className="bg-indigo-600 text-white py-2 px-4 rounded-md">
                Update Password
              </button>
            </div>
          )}
        </div>

        <div className="mt-4 text-center">
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};


export default advProfile;
