import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance'; // Use centralized Axios instance
import './Register.css'; // Import the CSS file

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    mobile: '',
    email: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/v1/user/register', formData);
      // Check if the response has status: false (for error handling)
      if (response.data.status === false) {
        // Dispatch custom event to show popup with error message
        const event = new CustomEvent('showPopup', {
          detail: { message: response.data.msg, isError: true }, // Show error message
        });
        window.dispatchEvent(event);
      } else {
        navigate('/login');
      }
    } catch (error) {
      console.error('Registration failed:', error);
      const errorMessage = error.response?.data?.msg || 'Registration failed, please try again.';
      // Dispatch custom event to show popup with error message
      const event = new CustomEvent('showPopup', {
        detail: { message: errorMessage, isError: true }, // Show error message
      });
      window.dispatchEvent(event);
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <input 
            type="text" 
            name="firstName" 
            placeholder="First Name" 
            onChange={handleChange} 
            required 
          />
          <input 
            type="text" 
            name="lastName" 
            placeholder="Last Name" 
            onChange={handleChange} 
            required 
          />
          <input 
            type="text" 
            name="mobile" 
            placeholder="Mobile" 
            onChange={handleChange} 
            required 
          />
          <input 
            type="email" 
            name="email" 
            placeholder="Email" 
            onChange={handleChange} 
            required 
          />
          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
