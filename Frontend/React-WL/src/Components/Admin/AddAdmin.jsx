import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const AddAdmin = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        username: '',
        password: ''
    });
    const navigate = useNavigate();
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log(formData);
            const response = await axios.post('http://localhost:8000/api/admin/create', formData);
            console.log('Admin added successfully:', response.data);
            window.alert("Admin added successfully!");
            navigate('/admindashboard');
        } catch (error) {
            console.error('Error adding admin:', error);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-8 rounded shadow-2xl">
            <h1 className="text-2xl font-bold mb-6">Add Admin</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-6">
                    <label htmlFor="name" className="block text-gray-800 font-semibold">
                        Name<span className="text-red-500"> *</span>
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter your name"
                        className="w-full border-2 border-gray-300 p-2 rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
                        required
                    />
                </div>
                <div className="mb-6">
                    <label htmlFor="email" className="block text-gray-800 font-semibold">
                        Email<span className="text-red-500"> *</span>
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter your email"
                        className="w-full border-2 border-gray-300 p-2 rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
                        required
                    />
                </div>
                <div className="mb-6">
                    <label htmlFor="username" className="block text-gray-800 font-semibold">
                        Username<span className="text-red-500"> *</span>
                    </label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        placeholder="Enter your username"
                        className="w-full border-2 border-gray-300 p-2 rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
                        required
                    />
                </div>
                <div className="mb-6">
                    <label htmlFor="password" className="block text-gray-800 font-semibold">
                        Password<span className="text-red-500"> *</span>
                    </label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Enter your password"
                        className="w-full border-2 border-gray-300 p-2 rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
                        required
                    />
                </div>
                <button type="submit" className="w-full bg-indigo-600 text-white p-2 rounded-md">
                    Add Admin
                </button>
            </form>
        </div>
    );
};

export default AddAdmin;