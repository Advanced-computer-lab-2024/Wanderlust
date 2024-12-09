import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../assets/adminstyle.css'
const ViewProducts = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/product/viewAllProducts');
            if (response.status === 200) {
                setProducts(response.data);
            } else {
                alert('Failed to fetch products: ' + response.data.message);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const calculateTotalSales = (sales) => {
        return sales.reduce((total, sale) => total + sale.quantity, 0);
    };

    return (
        <div className="container py-4">
            <div className="mb-4">
                <h1>View Products</h1>
            </div>
            <div className="d-flex flex-wrap gap-3">
                {products.map(product => (
                    <div key={product._id} className="flex-fill border rounded p-4 shadow-sm" style={{ flex: '1 1 calc(33.333% - 20px)' }}>
                        <h2 className="fw-bold">{product.name}</h2>
                        <p><span className="fw-bold">Description:</span> {product.description}</p>
                        <p><span className="fw-bold">Price:</span> ${product.price}</p>
                        <p><span className="fw-bold">Quantity:</span> {product.quantity}</p>
                        <p><span className="fw-bold">Sales:</span> {calculateTotalSales(product.sales)}</p>
                        <p><span className="fw-bold">Seller:</span> {product.seller ? product.seller.username : 'Unknown'}</p>
                        <img src={product.picture} alt={product.name} style={{ maxWidth: '100px', maxHeight: '100px' }} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ViewProducts;