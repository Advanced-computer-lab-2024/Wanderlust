import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Card from './Card';
import { Phone, Calendar, User, Mail, Clock, Briefcase, Award, Star, Wallet, BarChart2, PlusCircle, Settings, Eye, EyeOff } from 'lucide-react';

const AdvertiserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [username, setUsername] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showUpdateForm, setShowUpdateForm] = useState(false);

  const [website, setwebsite] = useState(profile?.website || '');
  const [hotline, sethotline] = useState(profile?.hotline || '');
  const [phoneNumber, setPhoneNumber] = useState(info?.mobileNumber || '');
  const [companyProfile, setCompanyProfile] = useState(profile?.companyProfile || '');

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    fetchinfo();
  }, []);

  useEffect(() => {
    if (profile) {
      setwebsite(profile.website || '');
      sethotline(profile.hotline || '');
      setPhoneNumber(profile.mobileNumber || '');
      setCompanyProfile(profile.companyProfile || '');
    }
  }, [profile]);

  useEffect(() => {
    if (info) {
      setPhoneNumber(info.mobileNumber || '');
      setUsername(info.username);
      
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
    if (!selectedImage) {
      alert('Please select an image to upload.'); // Alert if no image is selected
      return;
    }
  
    const formData = new FormData();
    formData.append('file', selectedImage); // Append the selected file
    formData.append('userId', profile.userId);  // Append the userId
  
    try {
      const response = await axios.put(
        `http://localhost:8000/api/documents/uploadImage/Advertiser/logo`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      alert('Image uploaded successfully!');
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
        companyProfile,
        website,
        hotline,
      });

      const response = await axios.put(
        'http://localhost:8000/api/advertiser/updateAdvertiser',
        {
          username,
          mobileNumber: phoneNumber,
          companyProfile,
          website,
          hotline,

          
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        }
      );
      console.log(response.data);

      if (response.data) {
        setProfile((prevProfile) => ({
          ...prevProfile,
          hotline: response.data.advertiser.hotline,
          website: response.data.advertiser.website,
          CompanyProfile: response.data.advertiser.companyProfile,
        }));

        setInfo((prevInfo) => ({
          ...prevInfo,
          mobileNumber: response.data.user.mobileNumber,
        }));

        setShowUpdateForm(false);
        alert('Profile updated successfully!');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      const errorMessage = error.response?.data?.error || 'An error occurred. Please try again later.';
      alert(errorMessage);
    }
  };
  const handleProfilePictureChange = (e) => {
    setSelectedImage(e.target.files[0]); // Set the uploaded file to state
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
    <>
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
                {profile.logoURL ? (
                      <img src={profile.logoURL} alt="Profile" className="w-full h-full object-cover" />
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
                    <Phone className="w-4 h-4 mr-2" />
                    <span>{profile.hotline || "N/A"}</span>
                  </div>
                  <div className="flex items-center text-gray-600 mt-2">
                    <Briefcase className="w-4 h-4 mr-2" />
                    <span>{profile.companyProfile || "N/A"}</span>
                  </div>
                  <div className="flex items-center text-gray-600 mt-2">
                    <Briefcase className="w-4 h-4 mr-2" />
                    <span>{profile.website || "N/A"}</span>
                  </div>
                </div>
                
              </div>
              <div className="flex justify-end mt-4">
    <button
      onClick={handleUpdateProfile}
      className="bg-indigo-600 text-white py-2 px-4 rounded-md"
    >
      Update Profile
    </button>
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
                  <Briefcase className="w-4 h-4 mr-2" />
                  <span>Website </span>
                  <input
                    type="text"
                    value={website}
                    onChange={(e) => setwebsite(e.target.value)}
                    className="bg-gray-200 text-gray-800 rounded p-1 w-80"
                  />
                </div>
                <div className="flex items-center text-gray-600 mt-2">
                  <Briefcase className="w-4 h-4 mr-2" />
                  <span>Company Profile: </span>
                  <input
                    type="text"
                    value={companyProfile}
                    onChange={(e) => setCompanyProfile(e.target.value)}
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
                    className="bg-gray-200 text-gray-800 rounded p-1 w-40"
                  />
                </div>
                <div className="flex items-center text-gray-600 mt-2">
                  <Phone className="w-4 h-4 mr-2" />
                  <span>Hotline: </span>
                  <input
                    type="tel"
                    value={hotline}
                    onChange={(e) => sethotline(e.target.value)}
                    className="bg-gray-200 text-gray-800 rounded p-1 w-24"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-600">Profile Photo</label>
                  <div className="flex items-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePictureChange}
                      className="bg-gray-200 text-gray-800 rounded p-2 mr-2"
                    />
                    {profile.logoURL && (
                      <img
                        src={profile.profileImage}
                        alt="Profile"
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    )}
                    <button
                      onClick={uploadProfileImage}
                      className="bg-indigo-600 text-white py-2 px-4 rounded-md ml-2"
                    >
                      Upload
                    </button>
                  </div>
                </div>
          
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={handleSaveProfile}
                    className="bg-indigo-600 text-white py-2 px-4 rounded-md"
                  >
                    Save Profile
                  </button>
                  <button
                    onClick={() => setShowUpdateForm(false)}
                    className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}


    </div>
    <div className="bg-custom text-white py-4 shadow-inner text-center ">
  <p>&copy; {new Date().getFullYear()} Wanderlust. All Rights Reserved.</p>
  <p className="text-sm">Need help? Contact us at support@Wanderlust.com</p>
</div>
    </>
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
            {profile && <p className="text-gray-800">{profile.username}</p>}
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

        <div className="mt-4 flex justify-between space-x-4">
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md">
            Close
          </button>
          <button
            onClick={handleDeleteAccount}
            className="bg-red-600 text-white py-2 px-4 rounded-md">
            Delete Account
          </button>
        
        </div>
      </div>
    </div>
  );
};


export default AdvertiserProfile;