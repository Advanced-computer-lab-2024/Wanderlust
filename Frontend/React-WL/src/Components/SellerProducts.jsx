import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Seller = () => {
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
const [confirmDeleteProductId, setConfirmDeleteProductId] = useState(null);
 const [selectedProduct, setSelectedProduct] = useState(null);
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
                setConfirmDeleteProductId(null);
        closeModal(); // Close the modal after deleting the product
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
    const openModal = (product) => {
        setSelectedProduct(product);
      };
    
      const closeModal = () => {
        setSelectedProduct(null);
      };
      const customStyles = {
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          transition: 'opacity 200ms ease-in-out',
        },
        content: {
          maxWidth: '500px',
          margin: 'auto',
          padding: '20px',
          borderRadius: '8px',
          transition: 'transform 200ms ease-in-out',
          transform: 'translateY(-20px)',
        },
      };
      const [isAddProductOpen, setAddProductOpen] = useState(false);
    const [isUpdateProductOpen, setUpdateProductOpen] = useState(false);
    const [isAvailableProductsOpen, setAvailableProductsOpen] = useState(false);

    const toggleAddProduct = () => setAddProductOpen(!isAddProductOpen);
    const toggleUpdateProduct = () => setUpdateProductOpen(!isUpdateProductOpen);
    const toggleAvailableProducts = () => setAvailableProductsOpen(!isAvailableProductsOpen);

    return (
        <div className="container py-4 w-75">
            <div className="mb-4">
                <h1 className='text-2xl font-bold mb-6 text-center '>Manage Products</h1>
            </div>
            <div className="form-container mb-4 p-4 border rounded shadow-sm ">
            <h2 
      className="text-gray-800 font-semibold mb-3" 
      onClick={toggleAddProduct} 
      style={{ cursor: 'pointer' }}
    >
      {isAddProductOpen ? '-' : '+'} Add Product
    </h2>
                {isAddProductOpen && (<form onSubmit={handleAddProduct} >
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
                </form>)}
            </div>
            <div className="form-container mb-4 p-4 border rounded shadow-sm">
            <h2 
      className="text-gray-800 font-semibold mb-3" 
      onClick={toggleUpdateProduct} 
      style={{ cursor: 'pointer' }}
    >
      {isUpdateProductOpen ? '-' : '+'} Update Product
    </h2>
                {isUpdateProductOpen && (<form onSubmit={handleUpdateProduct}>
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
                </form>)}
            </div>
            <div className="products-container p-4 border rounded shadow-sm">
            <h2 
      className="text-gray-800 font-semibold mb-3" 
      onClick={toggleAvailableProducts} 
      style={{ cursor: 'pointer' }}
    >
      {isAvailableProductsOpen ? '-' : '+'} Available Products
    </h2>
                {isAvailableProductsOpen && (<>
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
                <table className="table table-bordered">
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Description</th>
            <th>Quantity</th>
            <th>Rating</th>
            <th>Reviews</th>
            <th>Sales</th>
            <th>Seller</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product._id}>
              <td>{product.name}</td>
              <td>${product.price}</td>
              <td>{product.description}</td>
              <td>{product.quantity}</td>
              <td>{product.rating}</td>
              <td>{product.reviews}</td>
              <td>{product.sales.map(sale => (
                <span key={sale._id}>{sale.quantity} </span>
              ))}</td>
              {/* <td>{product.seller ? product.seller.username : 'Unknown'}</td> */}
              <td>
                <button className="btn btn-info" onClick={() => openModal(product)}>Manage</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedProduct && (
        <Modal
        isOpen={true}
        onRequestClose={closeModal}
        style={customStyles}
      >
        <h2 className='fw-bold mb-2'>{selectedProduct.name}</h2>
        <div className="d-flex flex-column justify-content-between">
            
        <img src={selectedProduct.picture} alt={selectedProduct.name} style={{ maxWidth: '100%' }} />
        {/* <p><strong>Price:</strong> ${selectedProduct.price}</p>
        <p><strong>Description:</strong> {selectedProduct.description}</p>
        <p><strong>Quantity:</strong> {selectedProduct.quantity}</p>
        <p><strong>Rating:</strong> {selectedProduct.rating}</p>
        <p><strong>Reviews:</strong> {selectedProduct.reviews}</p>
        <p><strong>Sales:</strong> {selectedProduct.sales.map(sale => (
          <span key={sale._id}>{sale.quantity} </span>
        ))}</p>
        <p><strong>Seller:</strong> {selectedProduct.seller ? selectedProduct.seller.username : 'Unknown'}</p> */}
        <form onSubmit={(e) => {
          e.preventDefault();
          const fileInput = e.target.elements.file;
          if (fileInput.files.length > 0) {
            uploadProductImage(selectedProduct._id, fileInput.files[0]);
          }
        }}>
          <input type="file" name="file" className="form-control my-2" />
          <button type="submit" className="btn btn-secondary mb-1">Upload Image</button>
        </form>
        {confirmDeleteProductId === selectedProduct._id ? (
              <>
                <p className='text-center text-danger'>Are you sure you want to delete this product?</p>
                <button className="btn btn-danger mt-1" onClick={() => {deleteProduct(selectedProduct.name)}}>Yes</button>
                <button className="btn btn-secondary mt-1" onClick={() => setConfirmDeleteProductId(null)}>No</button>
              </>
            ) : (
              <button className="btn btn-danger mt-1" onClick={() => setConfirmDeleteProductId(selectedProduct._id)}>Delete Product</button>
            )}
        <button className="btn btn-warning mt-1" onClick={() => archiveProduct(selectedProduct.name)}>Archive Product</button>
        <button className="btn btn-success mt-1" onClick={() => unarchiveProduct(selectedProduct.name)}>Unarchive Product</button>
        <button className="btn btn-secondary mt-1" onClick={closeModal}>Close</button>
        </div>
      </Modal>
      )}
                </>)}
            </div>
        </div>
    );
};

export default Seller;