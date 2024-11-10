import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const ManageProducts = () => {
    const [products, setProducts] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        quantity: '',
        rating: '',
        reviews: '',
        seller: '',
        picture: ''
    });
    const [updateData, setUpdateData] = useState({
        name: '',
        price: '',
        description: ''
    });
    const [sortOrder, setSortOrder] = useState('desc');
    const [searchName, setSearchName] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');

    useEffect(() => {
        fetchProducts();
    }, [sortOrder]);

    const fetchProducts = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/product/sortedByRating?sort=${sortOrder}`);
            if (response.status === 200) {
                setProducts(response.data);
            } else {
                alert('Failed to fetch products: ' + response.data.message);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const handleUpdateInputChange = (e) => {
        const { name, value } = e.target;
        setUpdateData((prevUpdateData) => ({
            ...prevUpdateData,
            [name]: value,
        }));
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/api/product/addProduct', formData);
            if (response.status === 201) {
                alert('Product added successfully');
                setFormData({
                    name: '',
                    price: '',
                    description: '',
                    quantity: '',
                    rating: '',
                    reviews: '',
                    seller: '',
                    picture: ''
                });
                fetchProducts();
            } else {
                alert('Failed to add product: ' + response.data.message);
            }
        } catch (error) {
            console.error('Error adding product:', error);
        }
    };

    const handleUpdateProduct = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put('http://localhost:8000/api/product/updateProductByName', updateData);
            if (response.status === 200) {
                alert('Product updated successfully');
                setUpdateData({
                    name: '',
                    price: '',
                    description: ''
                });
                fetchProducts();
            } else {
                alert('Failed to update product: ' + response.data.message);
            }
        } catch (error) {
            console.error('Error updating product:', error);
        }
    };

    const deleteProduct = async (name) => {
        try {
            const response = await axios.delete('http://localhost:8000/api/product/deleteproduct', { data: { name } });
            if (response.status === 200) {
                alert('Product deleted successfully');
                fetchProducts();
            } else {
                alert('Failed to delete product: ' + response.data.message);
            }
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    const archiveProduct = async (name) => {
        try {
            const response = await axios.put('http://localhost:8000/api/product/archiveProduct', { name });
            if (response.status === 200) {
                alert('Product archived successfully');
                fetchProducts();
            } else {
                alert('Failed to archive product: ' + response.data.message);
            }
        } catch (error) {
            console.error('Error archiving product:', error);
        }
    };

    const unarchiveProduct = async (name) => {
        try {
            const response = await axios.put('http://localhost:8000/api/product/unarchiveProduct', { name });
            if (response.status === 200) {
                alert('Product unarchived successfully');
                fetchProducts();
            } else {
                alert('Failed to unarchive product: ' + response.data.message);
            }
        } catch (error) {
            console.error('Error unarchiving product:', error);
        }
    };

    const uploadProductImage = async (productId, file) => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.put(`http://localhost:8000/api/documents/uploadProductImage/${productId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (response.status === 200) {
                alert('Product image uploaded successfully');
                fetchProducts();
            } else {
                alert('Failed to upload product image: ' + response.data.message);
            }
        } catch (error) {
            console.error('Error uploading product image:', error);
        }
    };

    const searchProducts = async () => {
        if (!searchName) {
            alert('Please enter a product name to search');
            return;
        }

        try {
            const response = await axios.get('http://localhost:8000/api/product/searchProductByName', { params: { name: searchName } });
            if (response.status === 200) {
                setProducts(response.data.products);
            } else {
                alert('No products found');
            }
        } catch (error) {
            console.error('Error searching products:', error);
        }
    };

    const filterProducts = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/product/filterProductsByPrice?minPrice=${minPrice}&maxPrice=${maxPrice}`);
            if (response.status === 200) {
                setProducts(response.data.products);
            } else {
                alert('No products found');
            }
        } catch (error) {
            console.error('Error filtering products:', error);
        }
    };

    return (
        <div className="container py-4">
            <div className="mb-4">
                <h1>Manage Products</h1>
            </div>
            <div className="form-container mb-4 p-4 border rounded shadow-sm">
                <h2>Add Product</h2>
                <form onSubmit={handleAddProduct}>
                    <div className="mb-3">
                        <label htmlFor="addName" className="form-label">Name:</label>
                        <input type="text" id="addName" name="name" value={formData.name} onChange={handleInputChange} className="form-control" required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="addPrice" className="form-label">Price:</label>
                        <input type="number" id="addPrice" name="price" value={formData.price} onChange={handleInputChange} className="form-control" required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="addDescription" className="form-label">Description:</label>
                        <input type="text" id="addDescription" name="description" value={formData.description} onChange={handleInputChange} className="form-control" required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="addQuantity" className="form-label">Quantity:</label>
                        <input type="number" id="addQuantity" name="quantity" value={formData.quantity} onChange={handleInputChange} className="form-control" required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="addRating" className="form-label">Rating:</label>
                        <input type="number" id="addRating" name="rating" value={formData.rating} onChange={handleInputChange} className="form-control" required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="addReviews" className="form-label">Reviews:</label>
                        <input type="text" id="addReviews" name="reviews" value={formData.reviews} onChange={handleInputChange} className="form-control" />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="addSeller" className="form-label">Seller:</label>
                        <input type="text" id="addSeller" name="seller" value={formData.seller} onChange={handleInputChange} className="form-control" />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="addPicture" className="form-label">Picture URL:</label>
                        <input type="text" id="addPicture" name="picture" value={formData.picture} onChange={handleInputChange} className="form-control" />
                    </div>
                    <button type="submit" className="btn btn-primary">Add Product</button>
                </form>
            </div>
            <div className="form-container mb-4 p-4 border rounded shadow-sm">
                <h2>Update Product</h2>
                <form onSubmit={handleUpdateProduct}>
                    <div className="mb-3">
                        <label htmlFor="updateName" className="form-label">Name:</label>
                        <input type="text" id="updateName" name="name" value={updateData.name} onChange={handleUpdateInputChange} className="form-control" required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="updatePrice" className="form-label">New Price:</label>
                        <input type="number" id="updatePrice" name="price" value={updateData.price} onChange={handleUpdateInputChange} className="form-control" required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="updateDescription" className="form-label">New Description:</label>
                        <input type="text" id="updateDescription" name="description" value={updateData.description} onChange={handleUpdateInputChange} className="form-control" required />
                    </div>
                    <button type="submit" className="btn btn-primary">Update Product</button>
                </form>
            </div>
            <div className="products-container p-4 border rounded shadow-sm">
                <h2 className='text-gray-800 font-semibold'>Available Products</h2>
                <div className="mb-3">
                    <label htmlFor="sortOrder" className="form-label">Sort by Rating:</label>
                    <select id="sortOrder" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="form-select">
                        <option value="desc">Highest to Lowest</option>
                        <option value="asc">Lowest to Highest</option>
                    </select>
                </div>
                <div className="mb-3">
                    <label htmlFor="searchName" className="form-label">Product Name:</label>
                    <input type="text" id="searchName" value={searchName} onChange={(e) => setSearchName(e.target.value)} className="form-control" />
                    <button className="btn btn-primary mt-2" onClick={searchProducts}>Search</button>
                </div>
                <div className="mb-3">
                    <label htmlFor="minPrice" className="form-label">Min Price:</label>
                    <input type="number" id="minPrice" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} className="form-control" />
                </div>
                <div className="mb-3">
                    <label htmlFor="maxPrice" className="form-label">Max Price:</label>
                    <input type="number" id="maxPrice" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className="form-control" />
                </div>
                <button className="btn btn-primary mb-4" onClick={filterProducts}>Filter</button>
                <div id="productsList" className=''>
                    {products.map(product => (
                        <div key={product.name} className="product-item mb-3 p-3 border rounded">
                            <p><span className="fw-bold">Name:</span> {product.name}</p>
                            <p><span className="fw-bold">Price:</span> ${product.price}</p>
                            <p><span className="fw-bold">Description:</span> {product.description}</p>
                            <p><span className="fw-bold">Quantity:</span> {product.quantity}</p>
                            <p><span className="fw-bold">Rating:</span> {product.rating}</p>
                            <p><span className="fw-bold">Reviews:</span> {product.reviews}</p>
                            <p><span className="fw-bold">Sales:</span> {product.sales.map(sale => (
                                <span key={sale._id}>{sale.quantity} </span>
                            ))}</p>
                            <p><span className="fw-bold">Seller:</span> {product.seller ? product.seller.username : 'Unknown'}</p>
                            <img src={product.picture} alt={product.name} style={{ maxWidth: '100px', maxHeight: '100px' }} /><br />
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                const fileInput = e.target.elements.file;
                                if (fileInput.files.length > 0) {
                                    uploadProductImage(product._id, fileInput.files[0]);
                                }
                            }}>
                                <input type="file" name="file" className="form-control mb-2" />
                                <button type="submit" className="btn btn-secondary">Upload Image</button>
                            </form>
                            <button className="btn btn-danger mt-2" onClick={() => deleteProduct(product.name)}>Delete Product</button>
                            <button className="btn btn-warning mt-2" onClick={() => archiveProduct(product.name)}>Archive Product</button>
                            <button className="btn btn-success mt-2" onClick={() => unarchiveProduct(product.name)}>Unarchive Product</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ManageProducts;