import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const ForgetPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const handleSendOtp = async () => {
    try {
      const response = await axios.post('http://localhost:8000/sendOtp', { email });
      setMessage(response.data.message);
      setStep(2);
    } catch (err) {
      setError(err.response.data.message);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const response = await axios.post('http://localhost:8000/verifyOtp', { email, otp });
      setMessage(response.data.message);
      setStep(3);
    } catch (err) {
      setError(err.response.data.message);
    }
  };

  const handleResetPassword = async () => {
    try {
      const response = await axios.post('http://localhost:8000/resetPassword', { email, newPassword });
      setMessage(response.data.message);
      setStep(4);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.response.data.message);
    }
  };

  return (
    <div className="container py-4 w-50">
      <h1 className="text-center mb-4">Forget Password</h1>
      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      {step === 1 && (
        <div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              id="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button className="btn btn-primary" onClick={handleSendOtp}>Send OTP</button>
          <button className="btn btn-secondary ml-2" onClick={() => navigate('/login')}>Back to Login</button>
        </div>
      )}
      {step === 2 && (
        <div>
          <div className="mb-3">
            <label htmlFor="otp" className="form-label">OTP</label>
            <input
              type="text"
              id="otp"
              className="form-control"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          </div>
          <button className="btn btn-primary" onClick={handleVerifyOtp}>Verify OTP</button>
          <button className="btn btn-secondary ml-2" onClick={() => navigate('/login')}>Back to Login</button>
        </div>
      )}
      {step === 3 && (
        <div>
          <div className="mb-3">
            <label htmlFor="newPassword" className="form-label">New Password</label>
            <input
              type="password"
              id="newPassword"
              className="form-control"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <button className="btn btn-primary" onClick={handleResetPassword}>Reset Password</button>
          <button className="btn btn-secondary ml-2" onClick={() => navigate('/login')}>Back to Login</button>
        </div>
      )}
      {step === 4 && (
        <div>
          <h2 className="text-center">Password Reset Successfully</h2>
        </div>
      )}
    </div>
  );
};

export default ForgetPasswordPage;