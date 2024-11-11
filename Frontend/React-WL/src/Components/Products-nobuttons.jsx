import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [sortOrder, setSortOrder] = useState('desc');
    const [searchName, setSearchName] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    
    // States for rating and form visibility
    const [showRatingForm, setShowRatingForm] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');
    
    // State to track purchased products
    const [purchasedProducts, setPurchasedProducts] = useState({});

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

    const handlePurchase = (product) => {
        setSelectedProduct(product); // Store the selected product
        setShowRatingForm(true); // Show the rating form
        
        // Mark product as purchased
        setPurchasedProducts((prevState) => ({
            ...prevState,
            [product._id]: true
        }));
    };

    const submitRating = async () => {
        if (!rating) {
            alert('Please enter a rating.');
            return;
        }

        try {
            const token = localStorage.getItem('token'); // Assuming the token is stored in localStorage
            const response = await axios.post(
                'http://localhost:8000/api/product/product/rate',
                { productId: selectedProduct._id, rating, review },
                { headers: { Authorization: `Bearer ${localStorage.getItem("jwtToken")}` } }
            );

            if (response.status === 200) {
                alert('Rating submitted successfully');
                setShowRatingForm(false); // Hide the form after submission
                setRating(0); // Reset the form
                setReview('');
            } else {
                alert('Failed to submit rating');
            }
        } catch (error) {
            console.error('Error submitting rating:', error);
            alert('Error submitting rating');
        }
    };

    return (
        <div className="container py-4 w-75">
            <div className="mb-4">
                <h1 className='text-3xl font-bold text-indigo-500 mb-6 text-center'>Browse Products</h1>
            </div>

            <div className="products-container p-4 border rounded shadow-sm">
                
                <div className="mb-3">
                    <label htmlFor="sortOrder" className="form-label">Sort by Rating:</label>
                    <select id="sortOrder" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="form-select mb-2">
                        <option value="desc">Highest to Lowest</option>
                        <option value="asc">Lowest to Highest</option>
                    </select>
                </div>

                <div className="mb-3">
                    <label htmlFor="searchName" className="form-label">Search Product:</label>
                    <div className="d-flex align-items-center">
                        <input type="text" id="searchName" value={searchName} onChange={(e) => setSearchName(e.target.value)} className="form-control me-2" />
                        <button className="btn btn-primary" onClick={searchProducts}>Search</button>
                    </div>
                </div>

                <div className="mb-3 row">
                    <div className="col">
                        <label htmlFor="minPrice" className="form-label">Min Price:</label>
                        <input type="number" id="minPrice" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} className="form-control" />
                    </div>
                    <div className="col">
                        <label htmlFor="maxPrice" className="form-label">Max Price:</label>
                        <input type="number" id="maxPrice" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className="form-control" />
                    </div>
                </div>

                <button className="btn btn-primary mb-4" onClick={filterProducts}>Filter</button>
                
                <div id="productsList">
                    {products.map(product => (
                        <div key={product._id} className="product-item mb-3 p-3 border rounded">
                            <span>Name: {product.name}</span><br />
                            <span>Price: ${product.price}</span><br />
                            <span>Description: {product.description}</span><br />
                            <span>Quantity: {product.quantity}</span><br />
                            <span>Rating: {product.rating}</span><br />
                            <span>Reviews: {product.reviews}</span><br />
                            <img src={product.picture} alt={product.name} style={{ maxWidth: '100px', maxHeight: '100px' }} /><br />

                            <button 
                                className="btn btn-success mt-2" 
                                onClick={() => handlePurchase(product)} 
                                disabled={purchasedProducts[product._id]}
                            >
                                {purchasedProducts[product._id] ? "Purchased!" : "Purchase"}
                            </button>
                        </div>
                    ))}
                </div>

                {/* Rating Form Modal */}
                {showRatingForm && (
                    <div className="rating-form">
                        <h3>Rate {selectedProduct.name}</h3>
                        <div className="mb-3">
                            <label htmlFor="rating">Rating (1-5):</label>
                            <input type="number" id="rating" value={rating} onChange={(e) => setRating(e.target.value)} min="1" max="5" className="form-control" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="review">Review:</label>
                            <textarea id="review" value={review} onChange={(e) => setReview(e.target.value)} className="form-control" />
                        </div>
                        <button className="btn btn-primary" onClick={submitRating}>Submit</button>
                        <button className="btn btn-secondary" onClick={() => setShowRatingForm(false)}>Cancel</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Products;
