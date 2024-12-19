import React, { useState,useEffect } from 'react';
import axios from 'axios';
import Navbar from '../Navbar';
import '../../assets/adminstyle.css'
const ViewComplaint = () => { 
    const [complaint, setComplaint] = useState([]);
    const params = new URLSearchParams(window.location.search);
    const complaintId = params.get('id');
    useEffect(() => {
        getComplaint();
    }, []);
    
    const getComplaint=  async () => {
        const token = localStorage.getItem('jwtToken');
        const response = await axios.get('http://localhost:8000/api/Complaint/complaint/'+complaintId , {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        );
        const complaint = response.data;
        setComplaint(complaint);
    }

    const changeStatus = async () => {
        const token = localStorage.getItem('jwtToken');
        const updatedStatus = complaint.status === 'resolved' ? 'pending' : 'resolved';
        const response = await axios.put('http://localhost:8000/api/Complaint/complaint/status', 
            { id: complaintId, status: updatedStatus }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        if (response.status === 200) {
            setComplaint({ ...complaint, status: updatedStatus });
            alert('Status updated successfully');
        } else {
            alert('Failed to update status: ' + response.data.message);
        }
    }
    const replyToComplaint = async () => {
        const token = localStorage.getItem('jwtToken');
        const response = await axios.put('http://localhost:8000/api/Complaint/reply', 
            { id: complaintId, reply: complaint.adminReply }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        if (response.status === 200) {
            setComplaint({ ...complaint, adminReply: response.data.complaint.adminReply });
            alert('Reply updated successfully');
        } else {
            alert('Failed to update reply: ' + response.data.message);
        }
    }

    return(
        <>
        <Navbar t1={"Admin Dashboard"} p1={"/admindashboard"} t6={"Login"} p6={"/Login"}/>
        <div className="container py-4 w-75">
            <div className="mb-4">
                <h2 className='text-2xl font-bold mb-6'>Complaint Details</h2>
            </div>
            <div className="d-flex flex-wrap gap-3">     
                    <div key={complaint.id} className="flex-fill border rounded p-4 shadow-sm mb-4" style={{ flex: '1 1 calc(33.333% - 20px)' }}>
                        <span ><span className='text-gray-800 font-semibold'>Title:</span> {complaint.title}</span><br />
                        <span><span className='text-gray-800 font-semibold'>status:</span> {complaint.status}</span><br />
                        <span><span className='text-gray-800 font-semibold'>Body:</span> {complaint.body}</span><br />
                        <span><span className='text-gray-800 font-semibold'>Reply:</span> {complaint.adminReply}</span><br />
                        <input 
                            type="text" 
                            value={complaint.adminReply || ''} 
                            onChange={(e) => setComplaint({ ...complaint, adminReply: e.target.value })} 
                            className="form-control mt-2" 
                            placeholder="Enter your reply here" 
                        />
                        <button onClick={replyToComplaint} className="btn bg-custom hover:bg-indigo-600 text-white mt-2 mr-2">Submit</button>
                        <button onClick={changeStatus} className={`btn mt-2 ${complaint.status === 'resolved' ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white`}>
                            {complaint.status === 'resolved' ? 'Mark as Pending' : 'Mark as Resolved'}
                        </button>
                    </div>
            </div>
        </div>
        </>
    );
};

export default ViewComplaint;