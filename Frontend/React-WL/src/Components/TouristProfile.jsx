import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Card from './Card';
import { useNavigate } from 'react-router-dom';

import {
  Phone,
  User,
  Mail,
  Clock,
  Briefcase,
  Award,
  Star,
  Wallet,
  BarChart2,
  PlusCircle,
  Settings,
  Eye,
  EyeOff,
  Medal
} from 'lucide-react';

const TouristProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [preferenceTagOptions, setPreferenceTagOptions] = useState([]);
  const [selectedPreferenceTags, setSelectedPreferenceTags] = useState([]);
  const [username, setUsername] = useState("");
  const [showPreference, setShowpreference] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  const getBadgeColor = (badge) => {
    switch (badge) {
      case 'Gold':
        return 'text-yellow-500';
      case 'Silver':
        return 'text-gray-400';
      default:
        return 'text-yellow-800'; // Bronze or None
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchPreferenceTags();
  }, []);

  const handlePreferenceTagSelect = (tag) => {
    if (selectedPreferenceTags.includes(tag)) {
      setSelectedPreferenceTags(selectedPreferenceTags.filter((t) => t !== tag));
    } else {
      setSelectedPreferenceTags([...selectedPreferenceTags, tag]);
    }
  };

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
    } catch (error) {
      console.error("Error fetching profile:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPreferenceTags = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/preferenceTag/getpreferenceTags");
      setPreferenceTagOptions(response.data.map((tag) => tag.name));
    } catch (error) {
      console.error("Error fetching preference tags:", error);
      setError(error);
    }
  };

  const handleAddPreference = () => {
    setShowpreference(true);
  };

  const handleSavePreferences = async () => {
    try {
      await axios.put(`http://localhost:8000/api/preferenceTag/updateTouristPref/${profile._id}`, {
        preferences: selectedPreferenceTags
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("jwtToken")}` }
      });
      console.log(profile.id);
      setProfile((prevProfile) => ({
        ...prevProfile,
        preferences: selectedPreferenceTags
      }));
      setShowpreference(false);
    } catch (error) {
      console.error("Error saving preferences:", error);
      setError(error);
    }
  };

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  const togglePreference = () => {
    setShowpreference(!showPreference);
  };

  const redeemPoints = async () => {
    const username = profile.username;  
    console.log(profile.points);
    if(profile.points < 10000){
      alert("Insufficient Points");
    }
    else{
      alert("Points Redeemed Successfully");
    }

    try {
      const response = await fetch(`http://localhost:8000/api/tourist/redeemPoints/${username}`, {
        method: 'PUT', 
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to redeem points');
      }

      const data = await response.json();
      console.log('Redeemed successfully:', data);
      setProfile((prevProfile) => ({
        ...prevProfile,
        points: data.points, // Update points
        wallet: data.wallet, // Update wallet
      }));
    } catch (error) {
      console.error('Error:', error);
      // Show error notification
      alert("Insufficient Points");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
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

        
          {/* Right side with Settings */}
          
          <div className="flex items-center text-indigo-600 cursor-pointer ml-auto" onClick={toggleSettings}>
            <Settings className="w-6 h-6 mr-1" />
            <span className="text-lg font-semibold">Settings</span>
          </div>
        </div>

        {/* Redeem Button Section Below Points */}
        

        {/* Preference Popup */}
        {showPreference && (
          <PreferencePopup
            onClose={togglePreference}
            onSave={handleSavePreferences}
            preferenceTagOptions={preferenceTagOptions}
            selectedPreferenceTags={selectedPreferenceTags}
            handlePreferenceTagSelect={handlePreferenceTagSelect}
          />
        )}

        {/* Settings Popup */}
        {showSettings && <SettingsPopup profile={profile} username={username} onClose={toggleSettings} />}

        {/* Profile Card */}
        <Card>
          <div className="profile-container">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex items-center mb-6">
                  <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-12 h-12 text-blue-600" />
                  </div>
                  <div className="ml-6">
                    <h2 className="text-2xl font-semibold text-blue-600">{profile.username}</h2>
                    <div className="flex items-center text-gray-600 mt-2">
                      <Phone className="w-4 h-4 mr-2 text-blue-600" />
                      <span>{profile.mobileNumber || "N/A"}</span>
                    </div>
                    <div className="flex items-center text-gray-600 mt-2">
                      <Mail className="w-4 h-4 mr-2 text-blue-600" />
                      <span>{profile.email}</span>
                    </div>
                  </div>
                </div>

                {/* Preferences and Favorites */}
                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-blue-500 border-b border-blue-100 pb-2">
                      Preferences and Favorites
                    </h3>
                    <button onClick={handleAddPreference} className="flex items-center text-blue-600">
                      <PlusCircle className="w-5 h-5 mr-1" />
                      <span className="font-semibold">Add Preference</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {profile.preferences && profile.preferences.length > 0 ? (
                      profile.preferences.map((preference, index) => (
                        <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
                          <div className="flex items-start">
                            <Award className="w-5 h-5 text-blue-500 mt-1 mr-3" />
                            <div>
                              <p className="text-gray-700">{preference}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500">No preferences found</p>
                    )}
                  </div>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard
            icon={<Award className={`w-8 h-8 ${getBadgeColor(profile.badge)}`} />}
            title="Rank"  
            value={profile.badge || 'N/A'}
            badgeColor={getBadgeColor(profile.badge)}
          />
                  <StatCard
                    icon={<BarChart2 className="w-8 h-8 text-blue-500" />}
                    title="Points"
                    value= {profile.points.toFixed(2)}
                  />
                  <StatCard
                    icon={<Wallet className="w-8 h-8 text-blue-500" />}
                    title="Wallet"
                    value={profile.wallet.toFixed(2)}
                  />
                </div>
                <div className="flex justify-end mt-4">
                <button
      onClick={redeemPoints}
      className="bg-indigo-600 text-white py-2 px-4 rounded-md"
    >
      Redeem
    </button>
    </div>

              </div>
            </div>
          </div>
        </Card>
      </div>
    
  );
};

// Statistic Card Component
const StatCard = ({ icon, title, value }) => (
  <div className="bg-gray-50 rounded-lg p-4 text-center">
    <div className="flex justify-center mb-2">
      {icon}
    </div>
    <h4 className="text-lg font-semibold text-blue-600">{title}</h4>
    <p className="text-2xl font-bold text-blue-600">{value}</p>
  </div>
);

// Preference Popup Component
const PreferencePopup = ({
  onClose,
  onSave,
  preferenceTagOptions,
  selectedPreferenceTags,
  handlePreferenceTagSelect,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-50" onClick={onClose}></div>
      <div className="bg-white rounded-lg shadow-lg p-6 z-10">
        <h3 className="text-xl font-semibold text-blue-600 mb-4">Add Preferences</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {preferenceTagOptions.map((tag) => (
            <button
              key={tag}
              onClick={() => handlePreferenceTagSelect(tag)}
              className={`rounded-full py-1 px-3 ${
                selectedPreferenceTags.includes(tag)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
        <div className="mt-4 text-center">
          <button
            onClick={onSave}
            className="bg-blue-600 text-white py-2 px-4 rounded-md mr-2 hover:bg-blue-700"
          >
            Save Preferences
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

// Settings Popup Component
const SettingsPopup = ({ profile, username, onClose }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showChangePasswordFields, setShowChangePasswordFields] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [currency, setCurrency] = useState("EGP"); // Default currency abbreviation

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
      alert("Account deletion requested successfully.");
    } catch (error) {
      const message = error.response?.data?.message || 'An error has occurred. Please try again.';
      alert(`Error: ${message}`);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirm password do not match.");
      return;
    }
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
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`
          }
        }
      );

      if (response.status === 200) {
        alert('Password updated successfully');
        setShowChangePasswordFields(false);
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setPasswordError('');
      }
    } catch (error) {
      const message = error.response?.data?.message || 'An error occurred. Please try again.';
      alert(`Error: ${message}`);
    }
  };

  const handleChangeCurrency = async (newCurrency) => {
    setCurrency(newCurrency);
  
    try {
      const username = profile.username; // Assuming `profile.username` contains the username
  
      const response = await axios.put(
        `http://localhost:8000/api/tourist/updateTourist/${username}`,
        { currency: newCurrency },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
            "Content-Type": "application/json"
          }
        }
      );
  
      if (response.status === 200) {
        alert('Currency preference updated successfully');
      }
    } catch (error) {
      alert('Failed to update currency preference');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-50" onClick={onClose}></div>
      <div className="bg-white rounded-lg shadow-lg p-6 z-10 max-w-md w-full">
        <h3 className="text-xl font-semibold text-blue-600 mb-4">Settings</h3>
        
        {/* Account Details Section */}
        <div className="mb-4">
          <h4 className="text-lg font-semibold text-blue-600 mb-2">Account Details</h4>
          <div className="mb-2">
            <label className="block text-gray-600">Username</label>
            <p className="text-gray-800">{profile.username}</p>
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
                value="********" // Hide actual password
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
              className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
            >
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
                className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
              >
                Update Password
              </button>
            </div>
          )}
        </div>

        {/* Preferred Currency Section */}
        <div className="mb-4">
          <h4 className="text-lg font-semibold text-blue-600 mb-2">Preferred Currency</h4>
          <select
            value={currency}
            onChange={(e) => handleChangeCurrency(e.target.value)} 

            className="w-full bg-gray-200 text-gray-800 rounded p-2"
          >
            <option value="EGP">EGP</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
            <option value="SAR">SAR</option>
          </select>
        </div>

        {/* Delete Account Button */}
        <div className="mt-4 text-center">
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400 mr-2"
          >
            Close
          </button>
          <button
            onClick={handleDeleteAccount}
            className="bg-red-600 text-white rounded px-4 py-2 hover:bg-red-700"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default TouristProfile;
