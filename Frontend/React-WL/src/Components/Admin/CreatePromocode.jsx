import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CreatePromocode = () => {
  const [code, setCode] = useState('');
  const [discount, setDiscount] = useState('');
  const [promoCodes, setPromoCodes] = useState([]);

  useEffect(() => {
    fetchPromoCodes();
  }, []);

  const fetchPromoCodes = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/admin/promoCodes');
      setPromoCodes(response.data);
    } catch (error) {
      console.error('Error fetching promo codes:', error);
    }
  };

  const handleCreatePromoCode = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/admin/createPromoCode', { code, discount });
      if (response.status === 201) {
        fetchPromoCodes(); // Refresh the list of promo codes
        setCode('');
        setDiscount('');
      }
    } catch (error) {
      console.error('Error creating promo code:', error);
    }
  };

  return (
    <div className="container mt-4">
      <h1>Create Promo Code</h1>
      <form onSubmit={handleCreatePromoCode}>
        <div className="mb-3">
          <label htmlFor="code" className="form-label">Promo Code</label>
          <input
            type="text"
            className="form-control"
            id="code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="discount" className="form-label">Discount (%)</label>
          <input
            type="number"
            className="form-control"
            id="discount"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Create Promo Code</button>
      </form>

      <h2 className="mt-4">Existing Promo Codes</h2>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Code</th>
            <th scope="col">Discount</th>
            <th scope="col">Expiry Date</th>
          </tr>
        </thead>
        <tbody>
          {promoCodes.map((promoCode) => (
            <tr key={promoCode._id}>
              <td>{promoCode.code}</td>
              <td>{promoCode.discount}%</td>
              <td>{new Date(promoCode.expiryDate).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CreatePromocode;