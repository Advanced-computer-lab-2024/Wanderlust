import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ViewComplaintsTourist = () => {
    const [complaints, setComplaints] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchComplaints();
    }, []);

    const fetchComplaints = async () => {
        try {
            const token = localStorage.getItem('jwtToken');
            const response = await axios.get('http://localhost:8000/api/Complaint/mycomplaints', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.status === 200) {
                setComplaints(response.data);
            }
        } catch (error) {
            console.error('Error fetching complaints:', error);
        }
    };
    return (
        <>
        <div className="container py-4">
            <div className="mb-4">
                <h2 className='text-2xl font-bold mb-6'>Complaints</h2>
                <div className="mb-4 d-flex align-items-center">
                    
                </div>
            </div>
            <div className="d-flex flex-wrap gap-3">
                {complaints.map(complaint => (
                    <div key={complaint.id} className="flex-fill border rounded p-4 shadow-sm" style={{ flex: '1 1 calc(33.333% - 20px)' }}>
                        <span ><span className='text-gray-800 font-semibold'>Title:</span> {complaint.title}</span><br />
                        <span><span className='text-gray-800 font-semibold'>Date:</span> {new Date(complaint.createdAt).toISOString().split('T')[0]}</span><br />
                        <span><span className='text-gray-800 font-semibold'>status:</span> {complaint.status}</span><br />
                        <span><span className='text-gray-800 font-semibold'>Body:</span> {complaint.body}</span><br />
                        <span><span className='text-gray-800 font-semibold'>Reply:</span> {complaint.adminReply}</span><br />
                        <button className="btn bg-indigo-500 hover:bg-indigo-600 text-white mt-2" onClick={() => navigate(`/complaint?id=${complaint._id}`)}>View Details</button>
                    </div>
                ))}
            </div>
        </div>
        </>
    );
};

export default ViewComplaintsTourist;
