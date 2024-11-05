import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import TouristNavBar from './NavBars/TouristNavBar';


const ViewComplaintsTourist = () => {
    const [complaints, setComplaints] = useState([]);
    const navigate = useNavigate();
    const [showForm, setShowForm] = useState(false);
    const [newComplaint, setNewComplaint] = useState({ title: '', body: '', date: '' });
    useEffect(() => {
        fetchComplaints();
    }, []);
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('jwtToken');
            const response = await axios.post('http://localhost:8000/api/Complaint/complaint', 
                {
                    title: newComplaint.title,
                    body: newComplaint.body,
                }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.status === 201) {
                setComplaints([...complaints, response.data.complaint]);
                setShowForm(false);
                setNewComplaint({ title: '', body: '', date: '' });
            }
        } catch (error) {
            console.error('Error creating complaint:', error);
        }
    };

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
        <button 
            className="btn btn-primary mb-4" 
            onClick={() => setShowForm(true)}
        >
            Create New Complaint
        </button>

        {showForm && (
            <div className="mb-4">
                <h3 className='text-xl font-bold mb-4'>New Complaint</h3>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Title</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            value={newComplaint.title} 
                            onChange={(e) => setNewComplaint({ ...newComplaint, title: e.target.value })} 
                            required 
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Body</label>
                        <textarea 
                            className="form-control" 
                            value={newComplaint.body} 
                            onChange={(e) => setNewComplaint({ ...newComplaint, body: e.target.value })} 
                            required 
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Date</label>
                        <input 
                            type="date" 
                            className="form-control" 
                            value={newComplaint.date} 
                            onChange={(e) => setNewComplaint({ ...newComplaint, date: e.target.value })} 
                            required 
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">Submit</button>
                    <button 
                        type="button" 
                        className="btn btn-secondary ml-2" 
                        onClick={() => setShowForm(false)}
                    >
                        Cancel
                    </button>
                </form>
            </div>
        )}



            <div className="mb-4">
                <h2 className='text-2xl font-bold mb-6'>My Complaints</h2>
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
                    </div>
                ))}
            </div>
        </div>
        </>
    );
};

export default ViewComplaintsTourist;
