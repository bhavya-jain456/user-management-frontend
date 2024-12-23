import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Profile from './components/Profile';
import Popup from './components/Popup'; // Import Popup
import Users from './components/Users';
import UserVideos from './components/UserVideos';
import './index.css';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('userDetails') && localStorage.getItem('token')
  );

  useEffect(() => {
    const updateAuthStatus = () => {
      setIsAuthenticated(
        localStorage.getItem('userDetails') && localStorage.getItem('token')
      );
    };

    window.addEventListener('storage', updateAuthStatus); // Listen for changes in localStorage
    return () => window.removeEventListener('storage', updateAuthStatus);
  }, []);

  return (
    <>
      <Popup /> {/* Add Popup Component */}
      <Router>
        <Routes>
          {/* Redirect based on authentication */}
          <Route path="/" element={<Navigate to={isAuthenticated ? "/profile" : "/login"} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/users" element={<Users />} />
          {/* Updated the route to match userId */}
          <Route path="/user-videos/:userId" element={<UserVideos />} />
        </Routes>
      </Router>
    </>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
