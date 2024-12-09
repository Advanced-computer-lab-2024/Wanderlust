import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../assets/adminstyle.css'
const ViewUsers = () => {
    const [users, setUsers] = useState([]);
    const [statistics, setStatistics] = useState({
        totalUsers: 0,
        usersThisMonth: 0,
        averageUsersPerMonth: 0,
    });
    const [confirmDeleteUserId, setConfirmDeleteUserId] = useState(null);

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
      <div className="mx-auto text-center mb-4 mt-4 rounded shadow p-4 w-25">
        <h2 className='text-2xl font-bold mb-6'>User Statistics</h2>
        <p><strong>Total Users:</strong> {statistics.totalUsers}</p>
        <p><strong>New users This Month:</strong> {statistics.usersThisMonth}</p>
        <p><strong>Average new users Per Month:</strong> {statistics.averageUsersPerMonth}</p>
      </div>
      <div className="mb-4">
        <h2 className='text-2xl font-bold mb-6'>Details of Users</h2>
      </div>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Password</th>
            <th>Account Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.password}</td>
              <td>{user.accountType}</td>
              <td className="d-flex justify-content-center align-items-center">
              {confirmDeleteUserId === user.id ? (
                  <>
                    <p className='text-center text-danger'>Are you sure?</p>
                    <button className="btn btn-danger ms-1" onClick={() => deleteUser(user.id)}>Yes</button>
                    <button className="btn btn-secondary ms-1" onClick={() => setConfirmDeleteUserId(null)}>No</button>
                  </>
                ) : (
                  <button className="btn btn-danger" onClick={() => setConfirmDeleteUserId(user.id)}>Delete Account</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    );
};

export default ViewUsers;