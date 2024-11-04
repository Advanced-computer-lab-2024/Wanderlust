import React, { useState,useEffect } from 'react';
import axios from 'axios';
import Navbar from '../Navbar';

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

    return(
        <>
        <Navbar t1={"Admin Dashboard"} p1={"/admindashboard"} t6={"Login"} p6={"/Login"}/>
        <div className="container py-4">
            <div className="mb-4">
                <h2 className='text-2xl font-bold mb-6'>Complaint Details</h2>
            </div>
            <div className="d-flex flex-wrap gap-3">     
                    <div key={complaint.id} className="flex-fill border rounded p-4 shadow-sm" style={{ flex: '1 1 calc(33.333% - 20px)' }}>
                        <span ><span className='text-gray-800 font-semibold'>Title:</span> {complaint.title}</span><br />
                        <span><span className='text-gray-800 font-semibold'>status:</span> {complaint.status}</span><br />
                        <span><span className='text-gray-800 font-semibold'>Body:</span> {complaint.body}</span><br />
                        <span><span className='text-gray-800 font-semibold'>Reply:</span> {complaint.adminReply}</span><br />
                        <button className="btn bg-indigo-500 hover:bg-indigo-600 text-white mt-2">Reply</button>

                    </div>
            </div>
        </div>
        </>
    );
};

export default ViewComplaint;