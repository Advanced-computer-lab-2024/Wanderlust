import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Card from './Card';
import { Phone, User, Mail, Clock, Briefcase, Award, Star, Wallet, BarChart2, PlusCircle, Settings, Eye, EyeOff } from 'lucide-react';

const TouristProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [username, setUsername] = useState("");
  const [showSettings, setShowSettings] = useState(false);

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
        })
      ]);

      const combinedData = {
        ...infoResponse.data,
        ...userResponse.data
      };

      setProfile(combinedData);
      console.log("Profile data:", combinedData);
    } catch (error) {
      console.error("Error fetching profile:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPreference = () => {
    console.log("Add Preference clicked");
  };

  const toggleSettings = () => {
    setShowSettings(!showSettings);
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
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div className="flex space-x-6">
            <div className="flex items-center text-indigo-600">
              <Star className="w-6 h-6 mr-1" />
              <span className="text-lg font-semibold">Level: {profile.level}</span>
            </div>
            <div className="flex items-center text-indigo-600">
              <BarChart2 className="w-6 h-6 mr-1" />
              <span className="text-lg font-semibold">Points: {profile.points}</span>
            </div>
            <div className="flex items-center text-indigo-600">
              <Wallet className="w-6 h-6 mr-1" />
              <span className="text-lg font-semibold">Wallet: ${profile.wallet}</span>
            </div>
          </div>

          <div className="flex items-center text-indigo-600 cursor-pointer" onClick={toggleSettings}>
            <Settings className="w-6 h-6 mr-1" />
            <span className="text-lg font-semibold">Settings</span>
          </div>
        </div>

        {showSettings && <SettingsPopup profile={profile} username={username} onClose={toggleSettings} />}

        <Card>
          <div className="profile-container">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex items-center mb-6">
                  <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center">
                    <User className="w-12 h-12 text-indigo-600" />
                  </div>
                  <div className="ml-6">
                    <h2 className="text-2xl font-semibold text-indigo-600">{profile.username}</h2>
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

                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-indigo-500 border-b border-indigo-100 pb-2">
                      Preferences and Favorites
                    </h3>
                    <button onClick={handleAddPreference} className="flex items-center text-indigo-600">
                      <PlusCircle className="w-5 h-5 mr-1" />
                      <span className="font-semibold">Add Preference</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {profile.preferences && profile.preferences.length > 0 ? (
                      profile.preferences.map((preference, index) => (
                        <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
                          <div className="flex items-start">
                            <Award className="w-5 h-5 text-indigo-500 mt-1 mr-3" />
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <StatCard
                    icon={<Clock className="w-8 h-8 text-indigo-500" />}
                    title="Trips Taken"
                    value={profile.tripsTaken || 0}
                  />
                  <StatCard
                    icon={<Briefcase className="w-8 h-8 text-indigo-500" />}
                    title="Favorite Destinations"
                    value={profile.favoriteDestinations?.length || 0}
                  />
                  <StatCard
                    icon={<Award className="w-8 h-8 text-indigo-500" />}
                    title="Reviews Written"
                    value={profile.reviewsCount || 0}
                  />
                </div>

              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

const StatCard = ({ icon, title, value }) => (
  <div className="bg-gray-50 rounded-lg p-4 text-center">
    <div className="flex justify-center mb-2">
      {icon}
    </div>
    <h4 className="text-lg font-semibold text-gray-700">{title}</h4>
    <p className="text-2xl font-bold text-indigo-600">{value}</p>
  </div>
);

const SettingsPopup = ({ profile, username, onClose }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showChangePasswordFields, setShowChangePasswordFields] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

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
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`
          }
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
            <label className="text-gray-700 font-semibold">Email</label>
            <p>{profile.email}</p>
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

        <div className="mt-6">
          <h4 className="text-lg font-semibold text-indigo-600 mb-2">Complaints</h4>
          <p className="text-gray-500">No complaints found</p>
        </div>

        <button
          onClick={onClose}
          className="mt-4 bg-red-600 text-white rounded px-4 py-2"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default TouristProfile;
