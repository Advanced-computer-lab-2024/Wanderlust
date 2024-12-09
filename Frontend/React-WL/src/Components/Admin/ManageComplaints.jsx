import React, {useState,useEffect} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../assets/adminstyle.css'
const ManageComplaints = () => {
    const [complaints, setComplaints] = useState([]);
    const navigate = useNavigate();
    const [filter, setFilter] = useState('all');
    const [sort, setSort] = useState('asc');
    useEffect(() => {
        fetchComplaints();
    }, [filter, sort]);

    const handleFilterChange = (e) => {
        setFilter(e.target.value);
    };

    const handleSortChange = (e) => {
        setSort(e.target.value);
    };


    


    const fetchComplaints = async () => {
        try {
            console.log(filter);
            console.log(sort);
            var response;
            const token = localStorage.getItem('jwtToken');
            let url = 'http://localhost:8000/api/Complaint/complaints?';
            if (filter !== 'all') url += `status=${filter}&`;
            if (sort !== 'asc') url += `sortBy=date&`;
            url =
              url.slice(-1) === "&" || url.slice(-1) === "?"
                ? url.slice(0, -1)
                : url;
            response = await axios.get(url, {
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
        <div className="container py-4 w-75">
            <div className="mb-4">
                <h2 className='text-2xl font-bold mb-6 text-center'>Complaints</h2>
                <div className="mb-4 d-flex align-items-center">
                    <div className="mr-4">
                        <label htmlFor="filter" className="mr-2">Filter by status:</label>
                        <select id="filter" value={filter} onChange={handleFilterChange} className="p-2 border rounded">
                            <option value="all">All</option>
                            <option value="pending">Pending</option>
                            <option value="resolved">Resolved</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="sort" className="mr-2">Sort by date:</label>
                        <select id="sort" value={sort} onChange={handleSortChange} className="p-2 border rounded">
                            <option value="asc">Ascending</option>
                            <option value="desc">Descending</option>
                        </select>
                    </div>
                </div>
            </div>
            <div className="row">
                {complaints.map(complaint => (
                    <div key={complaint.id} className="col-md-4 mb-4">
                        <div className="border rounded p-4 shadow-sm h-100">
                            <span><span className='text-gray-800 font-semibold'>Title:</span> {complaint.title}</span><br />
                            <span><span className='text-gray-800 font-semibold'>Date:</span> {new Date(complaint.createdAt).toISOString().split('T')[0]}</span><br />
                            <span><span className='text-gray-800 font-semibold'>Status:</span> {complaint.status}</span><br />
                            <button className="btn bg-custom hover:bg-indigo-600 text-white mt-2" onClick={() => navigate(`/complaint?id=${complaint._id}`)}>View Details</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
        </>
    );
};

export default ManageComplaints;