import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const ViewUsers = () => {
    const [users, setUsers] = useState([]);
    const [statistics, setStatistics] = useState({
        totalUsers: 0,
        usersThisMonth: 0,
        averageUsersPerMonth: 0,
    });

    useEffect(() => {
        fetchUsers();
        fetchStatistics();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/admin/usernames');
            if (response.status === 200) {
                setUsers(response.data);
            } else {
                alert('Failed to fetch users: ' + response.data.message);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };
    const fetchStatistics = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/admin/userStatistics');
            if (response.status === 200) {
                setStatistics(response.data);
            } else {
                alert('Failed to fetch statistics: ' + response.data.message);
            }
        } catch (error) {
            console.error('Error fetching statistics:', error);
        }
    };
    const deleteUser = async (id) => {
        try {
            const response = await axios.delete('http://localhost:8000/api/admin/delete', { data: { id } });
            if (response.status === 200) {
                alert('User deleted successfully');
                fetchUsers();
            } else {
                alert('Failed to delete user: ' + response.data.message);
            }
        } catch (error) {
            if (error.response && error.response.data) {
                alert('An error occurred: ' + error.response.data.message);
            } else {
                alert('An error occurred: ' + error.message);
            }
        }
    };

    return (
        <div className="container">
            <div className="mb-4">
                <h2 className='text-2xl font-bold mb-6'>User Statistics</h2>
                <p><strong>Total Users:</strong> {statistics.totalUsers}</p>
                <p><strong>New users This Month:</strong> {statistics.usersThisMonth}</p>
                <p><strong>Average new users Per Month:</strong> {statistics.averageUsersPerMonth}</p>
            </div>
            <div className="mb-4">
                <h2 className='text-2xl font-bold mb-6'>Details of Users</h2>
            </div>
            <div className="d-flex flex-wrap gap-3">
                {users.map(user => (
                    <div key={user.id} className="flex-fill border rounded p-4 shadow-sm" style={{ flex: '1 1 calc(33.333% - 20px)' }}>
                        <span ><span className='text-gray-800 font-semibold'>ID:</span> {user.id}</span><br />
                        <span><span className='text-gray-800 font-semibold'>Username:</span> {user.username}</span><br />
                        <span><span className='text-gray-800 font-semibold'>Email:</span> {user.email}</span><br />
                        <span><span className='text-gray-800 font-semibold'>Password:</span> {user.password}</span><br />
                        <span><span className='text-gray-800 font-semibold'>Account Type:</span> {user.accountType}</span><br />
                        <button className="btn btn-danger mt-2" onClick={() => deleteUser(user.id)}>Delete Account</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ViewUsers;