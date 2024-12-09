import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../assets/adminstyle.css'
const ManageActivities = () => {
    const [categories, setCategories] = useState([]);
    const [createFormData, setCreateFormData] = useState({
        name: '',
        description: ''
    });
    const [updateFormData, setUpdateFormData] = useState({
        id: '',
        name: '',
        description: ''
    });
    const [confirmDeleteCategoryId, setConfirmDeleteCategoryId] = useState(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/category/getCategories');
            if (response.status === 200) {
                setCategories(response.data);
            } else {
                alert('Failed to fetch categories: ' + response.data.message);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
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

    const handleCreateCategory = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/api/category/createCategory', createFormData);
            if (response.status === 201) {
                alert('Category created successfully');
                setCreateFormData({
                    name: '',
                    description: ''
                });
                fetchCategories();
            } else {
                alert('Failed to create category: ' + response.data.message);
            }
        } catch (error) {
            console.error('Error creating category:', error);
        }
    };

    const handleUpdateCategory = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put('http://localhost:8000/api/category/updateCategory', updateFormData);
            if (response.status === 200) {
                alert('Category updated successfully');
                setUpdateFormData({
                    id: '',
                    name: '',
                    description: ''
                });
                fetchCategories();
            } else {
                alert('Failed to update category: ' + response.data.message);
            }
        } catch (error) {
            console.error('Error updating category:', error);
        }
    };

    const deleteCategory = async (id) => {
        try {
            const response = await axios.delete('http://localhost:8000/api/category/deleteCategory', { data: { id } });
            if (response.status === 200) {
                alert('Category deleted successfully');
                fetchCategories();
            } else {
                alert('Failed to delete category: ' + response.data.message);
            }
        } catch (error) {
            console.error('Error deleting category:', error);
        }
    };
    const [isCreateOpen, setCreateOpenOpen] = useState(false);
    const [isUpdateOpen, setUpdateOpen] = useState(false);
    const [isAvailableCategoriesOpen, setAvailableCategoriesOpen] = useState(false);

    const toggleCreate = () => setCreateOpenOpen(!isCreateOpen);
    const toggleUpdate = () => setUpdateOpen(!isUpdateOpen);
    // const toggleAvailable = () => setAvailableCategoriesOpen(!isAvailableCategoriesOpen);
    return (
        <div className="container py-4 w-75">
            <div className="mb-4">
                <h1 className='text-2xl font-bold mb-6 text-center'>Manage Activity Categories</h1>
            </div>
            <div className="form-container mb-4 p-4 border rounded shadow-sm">
                {/* <h2 className='text-gray-800 font-semibold'>Create Category</h2> */}
                <h2 
      className="text-gray-800 font-semibold mb-3" 
      onClick={toggleCreate} 
      style={{ cursor: 'pointer' }}
    >
      {isCreateOpen ? '-' : '+'} Create Category
    </h2>
    {isCreateOpen && ( <form onSubmit={handleCreateCategory}>
                    <div className="mb-3">
                        <label htmlFor="createName" className="form-label">Name:</label>
                        <input type="text" id="createName" name="name" value={createFormData.name} onChange={handleCreateInputChange} className="form-control" required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="createDescription" className="form-label">Description:</label>
                        <input type="text" id="createDescription" name="description" value={createFormData.description} onChange={handleCreateInputChange} className="form-control" required />
                    </div>
                    <button type="submit" className="btn btn-primary">Create Category</button>
                </form>)}
            </div>
            <div className="form-container mb-4 p-4 border rounded shadow-sm">
                {/* <h2 className='text-gray-800 font-semibold'>Update Category</h2> */}
                <h2 
      className="text-gray-800 font-semibold mb-3" 
      onClick={toggleUpdate} 
      style={{ cursor: 'pointer' }}
    >
      {isUpdateOpen ? '-' : '+'} Update Category
    </h2>
    {isUpdateOpen && (<form onSubmit={handleUpdateCategory}>
                    <div className="mb-3">
                        <label htmlFor="updateId" className="form-label">ID:</label>
                        <input type="text" id="updateId" name="id" value={updateFormData.id} onChange={handleUpdateInputChange} className="form-control" required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="updateName" className="form-label">New Name:</label>
                        <input type="text" id="updateName" name="name" value={updateFormData.name} onChange={handleUpdateInputChange} className="form-control" required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="updateDescription" className="form-label">New Description:</label>
                        <input type="text" id="updateDescription" name="description" value={updateFormData.description} onChange={handleUpdateInputChange} className="form-control" required />
                    </div>
                    <button type="submit" className="btn btn-primary">Update Category</button>
                </form>)}
            </div>
            <div className="categories-container p-4 border rounded shadow-sm">
            <h2 className='text-2xl font-bold mb-6'>Available Categories</h2>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map(category => (
            <tr key={category._id}>
              <td>{category._id}</td>
              <td>{category.name}</td>
              <td>{category.description}</td>
              <td className="d-flex justify-content-center align-items-center">
                {confirmDeleteCategoryId === category._id ? (
                  <>
                    <p className='text-center text-danger'>Are you sure?</p>
                    <button className="btn btn-danger ms-1" onClick={() => deleteCategory(category._id)}>Yes</button>
                    <button className="btn btn-secondary ms-1" onClick={() => setConfirmDeleteCategoryId(null)}>No</button>
                  </>
                ) : (
                  <button className="btn btn-danger" onClick={() => setConfirmDeleteCategoryId(category._id)}>Delete</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
            </div>
        </div>
    );
};

export default ManageActivities;