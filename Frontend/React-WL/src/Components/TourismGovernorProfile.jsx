import React from 'react';
import { useEffect, useState } from 'react';
import {  Settings , Eye, EyeOff} from 'lucide-react';
import axios from 'axios';


const TourismGovernorProfile = () => {
    const [profile, setProfile] = useState({});
    const [showSettings, setShowSettings] = useState(false);

    useEffect(() => {
        fetchProfile();
      }, []);
      const toggleSettings = () => {
        setShowSettings(!showSettings);
      };

        const fetchProfile = async () => {
        const response = await fetch('http://localhost:8000/api/admin/getLoggedInUser', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("jwtToken")}`
            }
        });

        const data = await response.json();
        setProfile(data);
        console.log(data);
    }
    return (
        <div className="p-6 bg-gray-100 min-h-screen">
          
           
                <SettingsPopup
                    profile={profile}
                    onClose={toggleSettings}
                />
            
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
      <>
        
        <div className="bg-white rounded-lg shadow-lg p-6 z-10">
          <h3 className="text-xl font-semibold text-blue-600 mb-4">Settings</h3>
          <div className="mb-4">
            <h4 className="text-lg font-semibold text-blue-600 mb-2">Account Details</h4>
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
              className="text-blue-600 font-semibold"
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
                  className="bg-blue-600 text-white rounded px-4 py-2 mt-2"
                >
                  Update Password
                </button>
              </div>
            )}
          </div>
  

  
     
        </div>
    </>
    );
  };





export default TourismGovernorProfile;