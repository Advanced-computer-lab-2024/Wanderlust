import React, { useEffect, useState } from 'react';
import Card from './Card';
import { Phone, Briefcase, User, Award, Clock, Mail } from 'lucide-react';

const  TourGuideProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try { 
      const response = await fetch('http://localhost:8000/api/tourGuide/gettgprofile?userName=Amrhesham_11');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setProfile(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
      setError(error);
    } finally {
      setLoading(false);
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
      <div className="max-w-6xl mx-auto px-4">
        <Card>
          <div className="profile-container">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-4xl font-bold text-indigo-700">Tour Guide Profile</h1>
            </div>
            
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                {/* Header Section */}
                <div className="flex items-center mb-6">
                  <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center">
                    <User className="w-12 h-12 text-indigo-600" />
                  </div>
                  <div className="ml-6">
                    <h2 className="text-2xl font-semibold text-indigo-600">{profile.username}</h2>
                    <div className="flex items-center text-gray-600 mt-2">
                      <Phone className="w-4 h-4 mr-2" />
                      <span>{profile.mobilenumber}</span>
                    </div>
                  </div>
                </div>

                {/* Previous Work Section */}
                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-semibold mb-4 text-indigo-500 border-b border-indigo-100 pb-2 flex items-center">
                    <Briefcase className="mr-2" size={20} />
                    Previous Work Experience
                  </h3>
                  <div className="space-y-4">
                    {profile.previouswork.map((work, index) => (
                      <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
                        <div className="flex items-start">
                          <Award className="w-5 h-5 text-indigo-500 mt-1 mr-3" />
                          <div>
                            <p className="text-gray-700">{work}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <StatCard
                    icon={<Clock className="w-8 h-8 text-indigo-500" />}
                    title="Years of Experience"
                    value={profile.previouswork.length}
                  />
                  <StatCard
                    icon={<Briefcase className="w-8 h-8 text-indigo-500" />}
                    title="Total Tours"
                    value={profile.previouswork.length * 12}
                  />
                  <StatCard
                    icon={<Award className="w-8 h-8 text-indigo-500" />}
                    title="Specializations"
                    value={Math.floor(profile.previouswork.length / 2)}
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

export default TourGuideProfile;