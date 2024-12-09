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
    const [notification, setNotification] = useState(null); // For inline notifications
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchComplaints();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('jwtToken');
            const response = await axios.post(
                'http://localhost:8000/api/Complaint/complaint',
                {
                    title: newComplaint.title,
                    body: newComplaint.body,
                    date: newComplaint.date, // Include date in the payload if required by the API
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.status === 201) {
                setComplaints([...complaints, response.data.complaint]);
                setNotification({ type: 'success', message: 'Complaint created successfully!' });
                setShowForm(false);
                setNewComplaint({ title: '', body: '', date: '' });
            }
        } catch (error) {
            console.error('Error creating complaint:', error);
            setNotification({
                type: 'danger',
                message: error.response?.data?.message || 'Failed to create complaint.',
            });
        }
    };

    const fetchComplaints = async () => {
        try {
            const token = localStorage.getItem('jwtToken');
            const response = await axios.get('http://localhost:8000/api/Complaint/mycomplaints', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                setComplaints(response.data);
                setError(null);
            }
        } catch (error) {
            console.error('Error fetching complaints:', error);
            setError(error.response?.data?.message || 'Failed to fetch complaints.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
           

            <div className="container py-4">
                {/* Notification */}
                {notification && (
                    <div className={`alert alert-${notification.type} alert-dismissible fade show`} role="alert">
                        {notification.message}
                        <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                )}

                {/* Button to Show Form */}
                <button
                    className="btn btn-primary mb-4"
                    onClick={() => setShowForm(true)}
                    style={{ backgroundColor: '#003580', borderColor: '#003580' }} // Booking.com blue
                >
                    Create New Complaint
                </button>

                {/* Complaint Form */}
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
                            <div className="d-flex justify-content-end">
                                <button
                                    type="button"
                                    className="btn btn-secondary me-2"
                                    onClick={() => setShowForm(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    style={{ backgroundColor: '#003580', borderColor: '#003580' }} // Booking.com blue
                                >
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Heading */}
                <div className="mb-4">
                    <h2 className='text-2xl font-bold mb-6'>My Complaints</h2>
                </div>

                {/* Loading Indicator */}
                {loading ? (
                    <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
                        <div className="spinner-border text-primary" role="status" style={{ color: '#003580' }}>
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : error ? (
                    <div className="alert alert-danger" role="alert">
                        {error}
                    </div>
                ) : complaints.length > 0 ? (
                    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                        {complaints.map(complaint => (
                            <div key={complaint.id} className="col">
                                <div className="card h-100">
                                    <div className="card-body">
                                        <h5 className="card-title" style={{ color: '#003580' }}>Title: {complaint.title}</h5>
                                        <h6 className="card-subtitle mb-2 text-muted">Date: {new Date(complaint.createdAt).toLocaleDateString()}</h6>
                                        <p className="card-text"><strong>Status:</strong> {complaint.status}</p>
                                        <p className="card-text"><strong>Body:</strong> {complaint.body}</p>
                                        <p className="card-text"><strong>Reply:</strong> {complaint.adminReply || 'No reply yet.'}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-muted">You have no complaints.</p>
                )}
            </div>
        </>
    );
};

export default ViewComplaintsTourist;
