import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
    FaShoppingCart, 
    FaHeart, 
    FaStar, 
    FaTimes, 
    FaSearch, 
    FaFilter, 
    FaComment 
} from 'react-icons/fa';

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
    // States for cart form visibility and quantity
    const [showCartForm, setShowCartForm] = useState(false);
    const [cartQuantity, setCartQuantity] = useState(1);

    // State to track reviewed products
    const [reviewedProducts, setReviewedProducts] = useState({});

    useEffect(() => {
        fetchProducts();
    }, [sortOrder]);

    // StarRating Component
    const StarRating = ({ rating, setRating }) => {
        const [hoverRating, setHoverRating] = useState(0);

        return (
            <div className="flex items-center">
                {[...Array(5)].map((star, index) => {
                    const starValue = index + 1;
                    return (
                        <button
                            key={index}
                            type="button"
                            className={`ml-1 focus:outline-none`}
                            onClick={() => setRating(starValue)}
                            onMouseEnter={() => setHoverRating(starValue)}
                            onMouseLeave={() => setHoverRating(0)}
                            aria-label={`Rate ${starValue} star${starValue > 1 ? 's' : ''}`}
                        >
                            <FaStar 
                                className={`h-6 w-6 ${
                                    starValue <= (hoverRating || rating) 
                                        ? 'text-yellow-400' 
                                        : 'text-gray-300'
                                }`}
                            />
                        </button>
                    );
                })}
            </div>
        );
    };

    const fetchProducts = async () => {
        try {
            const responseUser = await axios.get('http://localhost:8000/api/admin/getLoggedInUser', { 
                headers: { Authorization: `Bearer ${localStorage.getItem("jwtToken")}` } 
            });
            const touristId = responseUser.data._id;

            const response = await axios.get(`http://localhost:8000/api/product/viewAvailableProducts`, {
                params: { touristId }
            });

            if (response.status === 200) {
                let fetchedProducts = response.data;

                // Client-side sorting based on sortOrder
                fetchedProducts.sort((a, b) => {
                    if (sortOrder === 'asc') {
                        return a.rating - b.rating;
                    } else {
                        return b.rating - a.rating;
                    }
                });

                setProducts(fetchedProducts);
            } else {
                alert('Failed to fetch products: ' + response.data.message);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            alert('Error fetching products. Please try again later.');
        }
    };

    const searchProducts = async () => {
        if (!searchName.trim()) {
            alert('Please enter a product name to search');
            return;
        }

        try {
            const response = await axios.get('http://localhost:8000/api/product/searchProductByName', { 
                params: { name: searchName } 
            });
            if (response.status === 200 && response.data.products.length > 0) {
                setProducts(response.data.products);
            } else {
                alert('No products found');
            }
        } catch (error) {
            console.error('Error searching products:', error);
            alert('Error searching products. Please try again later.');
        }
    };

    const filterProducts = async () => {
        if (minPrice && maxPrice && Number(minPrice) > Number(maxPrice)) {
            alert('Min Price cannot be greater than Max Price');
            return;
        }

        try {
            const response = await axios.get(`http://localhost:8000/api/product/filterProductsByPrice`, {
                params: { minPrice, maxPrice }
            });
            if (response.status === 200 && response.data.products.length > 0) {
                setProducts(response.data.products);
            } else {
                alert('No products found within the specified price range');
            }
        } catch (error) {
            console.error('Error filtering products:', error);
            alert('Error filtering products. Please try again later.');
        }
    };

    const handleReview = (product) => {
        setSelectedProduct(product); // Store the selected product
        setShowRatingForm(true); // Show the rating form
        
        // Mark product as reviewed
        setReviewedProducts((prevState) => ({
            ...prevState,
            [product._id]: true
        }));
    };

    const submitRating = async () => {
        if (!rating || rating < 1 || rating > 5) {
            alert('Please enter a valid rating between 1 and 5.');
            return;
        }

        try {
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
            alert('Error submitting rating. Please try again later.');
        }
    };

    const handleSaveToWishlist = async (product) => {
        try {
            const response = await axios.put(
                `http://localhost:8000/api/tourist/addProductToWishlist/${product._id}`,
                {},
                { headers: { Authorization: `Bearer ${localStorage.getItem("jwtToken")}` } }
            );

            if (response.status === 200) {
                alert('Product added to wishlist successfully');
            } else {
                alert('Failed to add product to wishlist');
            }
        } catch (error) {
            console.error('Error adding product to wishlist:', error);
            alert('Error adding product to wishlist. Please try again later.');
        }
    };

    const handleAddToCart = async () => {
        try {
            const response = await axios.put(
                `http://localhost:8000/api/tourist/addProductToCart/${selectedProduct._id}`,
                { quantity: cartQuantity },
                { headers: { Authorization: `Bearer ${localStorage.getItem("jwtToken")}` } }
            );

            if (response.status === 200) {
                alert('Product added to cart successfully');
                setShowCartForm(false); // Hide the form after adding to cart
                setCartQuantity(1); // Reset the quantity
            } else {
                alert('Failed to add product to cart');
            }
        } catch (error) {
            console.error('Error adding product to cart:', error);
            alert('Error adding product to cart. Please try again later.');
        }
    };

    return (
        <div className="max-w-6xl mx-auto py-8 px-4">
            {/* Header */}
            <div className="mb-8 text-center">
                <h1 className='text-4xl font-extrabold text-blue-900 mb-4'>Browse Products</h1>
                <p className='text-gray-600'>Find the best products tailored to your needs.</p>
            </div>

            {/* Filters and Search */}
            <div className="bg-white shadow-md rounded-lg p-6 mb-8">
                <div className="flex flex-col md:flex-row md:items-end md:space-x-6">
                    {/* Sort by Rating */}
                    <div className="flex-1 mb-4 md:mb-0">
                        <label htmlFor="sortOrder" className="block text-sm font-medium text-gray-700 mb-1">Sort by Rating:</label>
                        <select
                            id="sortOrder"
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}
                            className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="desc">Highest to Lowest</option>
                            <option value="asc">Lowest to Highest</option>
                        </select>
                    </div>

                    {/* Search Product */}
                    <div className="flex-1 mb-4 md:mb-0">
                        <label htmlFor="searchName" className="block text-sm font-medium text-gray-700 mb-1">Search Product:</label>
                        <div className="flex">
                            <input
                                type="text"
                                id="searchName"
                                value={searchName}
                                onChange={(e) => setSearchName(e.target.value)}
                                className="flex-1 block w-full bg-white border border-gray-300 rounded-l-md shadow-sm p-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter product name"
                            />
                            <button
                                className="bg-blue-900 text-white px-4 rounded-r-md hover:bg-blue-800 focus:outline-none flex items-center transition-colors duration-200"
                                onClick={searchProducts}
                                aria-label="Search Products"
                            >
                                <FaSearch />
                            </button>
                        </div>
                    </div>

                    {/* Price Range */}
                    <div className="flex-1 grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="minPrice" className="block text-sm font-medium text-gray-700 mb-1">Min Price:</label>
                            <input
                                type="number"
                                id="minPrice"
                                value={minPrice}
                                onChange={(e) => setMinPrice(e.target.value)}
                                className="block w-full bg-white border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                placeholder="0"
                                min="0"
                            />
                        </div>
                        <div>
                            <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700 mb-1">Max Price:</label>
                            <input
                                type="number"
                                id="maxPrice"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value)}
                                className="block w-full bg-white border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                placeholder="1000"
                                min="0"
                            />
                        </div>
                    </div>
                </div>

                {/* Filter Button */}
                <div className="mt-6 text-center">
                    <button
                        className="bg-blue-900 text-white px-6 py-3 rounded-md hover:bg-blue-800 focus:outline-none flex items-center justify-center transition-colors duration-200"
                        onClick={filterProducts}
                    >
                        <FaFilter className="mr-2" /> Filter
                    </button>
                </div>
            </div>

            {/* Products List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                {products.map(product => (
                    <div key={product._id} className="bg-white shadow-md rounded-lg overflow-hidden w-full">
                        {/* Product Picture */}
                        <img
                            src={product.picture}
                            alt={product.name}
                            className="w-full h-48 object-cover"
                            loading="lazy"
                        />
                        <div className="p-4">
                            {/* Product Name */}
                            <h2 className="text-xl font-semibold text-blue-900">{product.name}</h2>

                            {/* Price */}
                            <div className="mt-2">
                                <span className="text-gray-700 font-medium">Price: </span>
                                <span className="text-blue-900 font-semibold">${product.price}</span>
                            </div>

                            {/* Rating */}
                            <div className="flex items-center mt-2">
                                <FaStar className="text-yellow-400 mr-1" />
                                <span className="text-gray-700">{product.rating}</span>
                                <span className="text-gray-500 ml-2">({product.reviews} reviews)</span>
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-4 flex space-x-2">
                                {/* Review Button */}
                                <button
                                    className={`flex-1 bg-blue-900 text-white px-4 py-3 rounded-md hover:bg-blue-800 focus:outline-none flex items-center justify-center transition-colors duration-200 ${
                                        reviewedProducts[product._id] ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                                    onClick={() => handleReview(product)}
                                    disabled={reviewedProducts[product._id]}
                                >
                                    <FaStar className="mr-2" />
                                    {reviewedProducts[product._id] ? 'Reviewed' : 'Review'}
                                </button>
                                
                                {/* Wishlist Button */}
                                <button
                                    className="flex-1 border border-blue-900 text-blue-900 px-4 py-3 rounded-md hover:bg-blue-900 hover:text-white focus:outline-none flex items-center justify-center transition-colors duration-200"
                                    onClick={() => handleSaveToWishlist(product)}
                                >
                                    <FaHeart className="mr-2" />
                                    Wishlist
                                </button>
                                
                                {/* Add to Cart Button */}
                                <button
                                    className="flex-1 bg-blue-900 text-white px-4 py-3 rounded-md hover:bg-blue-800 focus:outline-none flex items-center justify-center transition-colors duration-200"
                                    onClick={() => {
                                        setSelectedProduct(product);
                                        setShowCartForm(true);
                                    }}
                                >
                                    <FaShoppingCart className="mr-2" />
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Review Form Modal */}
            {showRatingForm && selectedProduct && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 md:w-1/3">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold text-blue-900">Review {selectedProduct.name}</h3>
                            <button 
                                onClick={() => setShowRatingForm(false)} 
                                className="text-gray-500 hover:text-gray-700" 
                                aria-label="Close Review Form"
                            >
                                <FaTimes size={20} />
                            </button>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Your Rating:</label>
                            <StarRating rating={rating} setRating={setRating} />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="review" className="block text-sm font-medium text-gray-700 mb-1">Your Review:</label>
                            <textarea
                                id="review"
                                value={review}
                                onChange={(e) => setReview(e.target.value)}
                                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Write your review"
                                rows="4"
                            ></textarea>
                        </div>
                        <div className="flex justify-end space-x-2">
                            <button
                                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 focus:outline-none transition-colors duration-200"
                                onClick={() => setShowRatingForm(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-blue-900 text-white px-4 py-2 rounded-md hover:bg-blue-800 focus:outline-none flex items-center justify-center transition-colors duration-200"
                                onClick={submitRating}
                                disabled={rating === 0}
                            >
                                <FaStar className="mr-2" /> Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add to Cart Form Modal */}
            {showCartForm && selectedProduct && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 md:w-1/3">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-blue-900">Add {selectedProduct.name} to Cart</h2>
                            <button 
                                onClick={() => setShowCartForm(false)} 
                                className="text-gray-500 hover:text-gray-700" 
                                aria-label="Close Add to Cart Form"
                            >
                                <FaTimes size={20} />
                            </button>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="cartQuantity">Quantity:</label>
                            <input
                                type="number"
                                id="cartQuantity"
                                value={cartQuantity}
                                onChange={(e) => setCartQuantity(Number(e.target.value))}
                                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                min="1"
                            />
                        </div>
                        <div className="flex justify-end space-x-2">
                            <button
                                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 focus:outline-none transition-colors duration-200"
                                onClick={() => setShowCartForm(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-blue-900 text-white px-4 py-2 rounded-md hover:bg-blue-800 focus:outline-none flex items-center justify-center transition-colors duration-200"
                                onClick={handleAddToCart}
                            >
                                <FaShoppingCart className="mr-2" /> Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

};

export default Products;
