import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './LoginPage.css';
import './styles.css';
import Bubbles from './Bubbles.js';

function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:9000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Store token and user data in localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', data.username);
      localStorage.setItem('role', data.role);

      // Success: Show message and navigate to home
      setSuccess('Login successful! Redirecting to home...');
      setTimeout(() => {
        navigate('./Home');
      }, 2000); // Redirect after 2 seconds
    } catch (err) {
      setError(err.message || 'An error occurred during login');
    }
  };

  return (
    <div className="login-container1">
      <Bubbles />
      <h1>UNISPACE</h1>
      <div className="login-container">
        <div className="login-form">
          <form onSubmit={handleSubmit}>
            <label className="login-username">Username or Email</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter username or email"
              required
            />
            <label className="login-password">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button type="submit">Login</button>
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}
            <p>
              Don't have an account? <Link to="/signup">Sign Up</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;