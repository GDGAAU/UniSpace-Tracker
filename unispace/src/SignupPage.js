import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './SignupPage.css';
import './styles.css';
import Bubbles from './Bubbles.js';

function SignupPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    name: '',
    password: '',
    role: 'STUDENT' // Default role
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
      const response = await fetch('http://localhost:9000/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Signup failed');
      }

      // Success: Show message and navigate to login
      setSuccess('Signup successful! Redirecting to login...');
      setTimeout(() => {
        navigate('/');
      }, 2000); // Redirect after 2 seconds
    } catch (err) {
      setError(err.message || 'An error occurred during signup');
    }
  };

  return (
    <div className="signup-container1">
      <Bubbles />
      <h1>UNISPACE</h1>
      <div className="signup-container">
        <div className="signup-form">
          <form onSubmit={handleSubmit}>
            <label className="signup-username">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
            <label className="signup-email">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <label className="signup-name">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <label className="signup-role">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="signup-role-select"
              required
            >
              <option value="STUDENT">Student</option>
              <option value="REPRESENTATIVE">Representative</option>
              <option value="TEACHER">Teacher</option>
            </select>
            <label className="signup-password">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button type="submit">Signup</button>
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}
            <p>
              Already have an account? <Link to="/">Login</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;