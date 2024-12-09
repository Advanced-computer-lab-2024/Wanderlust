import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../assets/adminstyle.css'
const ManagePreferenceTags = () => {
    const [tags, setTags] = useState([]);
    const [createFormData, setCreateFormData] = useState({
        name: ''
    });
    const [updateFormData, setUpdateFormData] = useState({
        id: '',
        name: ''
    });

    useEffect(() => {
        fetchTags();
    }, []);

    const fetchTags = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/preferenceTag/getpreferenceTags');
            if (response.status === 200) {
                setTags(response.data);
            } else {
                alert('Failed to fetch tags: ' + response.data.message);
            }
        } catch (error) {
            console.error('Error fetching tags:', error);
        }
    };

    const handleCreateInputChange = (e) => {
        const { name, value } = e.target;
        setCreateFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const handleUpdateInputChange = (e) => {
        const { name, value } = e.target;
        setUpdateFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const handleCreateTag = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/api/preferenceTag/createTag', createFormData);
            if (response.status === 201) {
                alert('Tag created successfully');
                setCreateFormData({
                    name: ''
                });
                fetchTags();
            } else {
                alert('Failed to create tag: ' + response.data.message);
            }
        } catch (error) {
            console.error('Error creating tag:', error);
        }
    };

    const handleUpdateTag = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put('http://localhost:8000/api/preferenceTag/updateTag', updateFormData);
            if (response.status === 200) {
                alert('Tag updated successfully');
                setUpdateFormData({
                    id: '',
                    name: ''
                });
                fetchTags();
            } else {
                alert('Failed to update tag: ' + response.data.message);
            }
        } catch (error) {
            console.error('Error updating tag:', error);
        }
    };

    const deleteTag = async (id) => {
        try {
            const response = await axios.delete('http://localhost:8000/api/preferenceTag/deleteTag', { data: { id } });
            if (response.status === 200) {
                alert('Tag deleted successfully');
                fetchTags();
            } else {
                alert('Failed to delete tag: ' + response.data.message);
            }
        } catch (error) {
            console.error('Error deleting tag:', error);
        }
    };

    return (
        <div className="container py-4 w-75">
            <div className="mb-4">
                <h1 className='text-2xl font-bold mb-6 text-center'>Manage Preference Tags</h1>
            </div>
            <div className="form-container mb-4 p-4 border rounded shadow-sm">
                <h2 className='text-gray-800 font-semibold'>Add Tag</h2>
                <form onSubmit={handleCreateTag}>
                    <div className="mb-3">
                        <label htmlFor="addName" className="form-label">Name:</label>
                        <input type="text" id="addName" name="name" value={createFormData.name} onChange={handleCreateInputChange} className="form-control" required />
                    </div>
                    <button type="submit" className="btn btn-primary">Add Tag</button>
                </form>
            </div>
            <div className="form-container mb-4 p-4 border rounded shadow-sm">
                <h2 className='text-gray-800 font-semibold'>Update Tag</h2>
                <form onSubmit={handleUpdateTag}>
                    <div className="mb-3">
                        <label htmlFor="updateId" className="form-label">ID:</label>
                        <input type="text" id="updateId" name="id" value={updateFormData.id} onChange={handleUpdateInputChange} className="form-control" required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="updateName" className="form-label">New Name:</label>
                        <input type="text" id="updateName" name="name" value={updateFormData.name} onChange={handleUpdateInputChange} className="form-control" required />
                    </div>
                    <button type="submit" className="btn btn-primary">Update Tag</button>
                </form>
            </div>
            <div className="tags-container p-4 border rounded shadow-sm">
                <h2 className='text-gray-800 font-semibold'>Available Tags</h2>
                <div id="tagsList">
                    {tags.map(tag => (
                        <div key={tag._id} className="tag-item mb-3 p-3 border rounded">
                            <span>ID: {tag._id}</span><br />
                            <span>Name: {tag.name}</span><br />
                            <button className="btn btn-danger mt-2" onClick={() => deleteTag(tag._id)}>Delete</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ManagePreferenceTags;