import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No token found. Please log in.');
      navigate('/login');
      return;
    }

    axios
      .get('https://hiet-crossroads-2025.onrender.com/api/users/profile', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUser(res.data))
      .catch((err) => {
        console.error('Profile Fetch Error:', err);
        setError(err.response?.data?.message || 'Failed to load profile');
        localStorage.removeItem('token');
        navigate('/login');
      });
  }, [navigate]);

  if (error) return <div>{error}</div>;
  if (!user) return <div>Loading...</div>;

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', padding: '20px' }}>
      <h1>Welcome, {user.name}</h1>
      {user.profileImage && <img src={user.profileImage} alt="Profile" style={{ maxWidth: '100px' }} />}
      <p>Email: {user.email}</p>
      <p>Mobile: {user.mobile}</p>
    </div>
  );
};

export default Dashboard;


