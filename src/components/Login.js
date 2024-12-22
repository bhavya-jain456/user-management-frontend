import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import './Login.css'; // Import the CSS file

const Login = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    password: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/v1/user/login', formData);
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('userDetails', JSON.stringify(response.data.data.user));
      navigate('/profile');
    } catch (error) {
      console.error('Login failed:', error);
      // The error handling is now handled inside axiosInstance
    }
  };

  const handleSignUp = () => {
    navigate('/register');
  };

  return (
    <div className="container">
      <div className="form-container">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <input 
            type="text" 
            name="firstName" 
            placeholder="First Name" 
            onChange={handleChange} 
            required 
          />
          <input 
            type="password" 
            name="password" 
            placeholder="Password" 
            onChange={handleChange} 
            required 
          />
          <button type="submit">Login</button>
        </form>
        <button className="sign-up-btn" onClick={handleSignUp}>
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default Login;
