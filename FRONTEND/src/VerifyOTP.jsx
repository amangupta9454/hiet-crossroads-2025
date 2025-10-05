import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { MdEmail, MdVpnKey } from 'react-icons/md';
import { BiLoaderAlt } from 'react-icons/bi';

const VerifyOtp = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('https://hiet-crossroads-2025.onrender.com/api/users/verify', { email, otp });
      setMessage(res.data.message);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Verification failed');
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.particles}>
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            style={{
              ...styles.particle,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <style>
        {`
          @keyframes pulse {
            0%, 100% {
              opacity: 0.3;
              transform: scale(1);
            }
            50% {
              opacity: 0.8;
              transform: scale(1.5);
            }
          }
        `}
      </style>

      <div style={styles.formCard}>
        <h1 style={styles.title}>Verify OTP</h1>
        <p style={styles.subtitle}>Enter the OTP sent to your email</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <MdEmail style={styles.icon} />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <MdVpnKey style={styles.icon} />
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value.toUpperCase())}
              required
              style={styles.input}
              maxLength={6}
            />
          </div>

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? (
              <BiLoaderAlt style={styles.spinner} />
            ) : (
              'Verify OTP'
            )}
          </button>

          {message && (
            <div style={{
              ...styles.message,
              color: message.includes('failed') ? '#ef4444' : '#10b981'
            }}>
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
    padding: '20px',
    position: 'relative',
    overflow: 'hidden',
  },
  particles: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    pointerEvents: 'none',
  },
  particle: {
    position: 'absolute',
    width: '4px',
    height: '4px',
    background: '#6b7280',
    borderRadius: '50%',
    animation: 'pulse infinite ease-in-out',
  },
  formCard: {
    background: 'rgba(30, 30, 30, 0.95)',
    backdropFilter: 'blur(10px)',
    borderRadius: '16px',
    padding: '40px',
    width: '100%',
    maxWidth: '440px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
    border: '1px solid rgba(107, 114, 128, 0.2)',
    zIndex: 10,
  },
  title: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: '8px',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: '14px',
    color: '#9ca3af',
    marginBottom: '32px',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  inputGroup: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
    position: 'absolute',
    left: '16px',
    fontSize: '20px',
    color: '#6b7280',
    zIndex: 1,
  },
  input: {
    width: '100%',
    padding: '14px 16px 14px 48px',
    fontSize: '16px',
    color: '#ffffff',
    background: 'rgba(55, 55, 55, 0.8)',
    border: '1px solid rgba(107, 114, 128, 0.3)',
    borderRadius: '8px',
    outline: 'none',
    transition: 'all 0.3s ease',
    fontFamily: 'inherit',
  },
  button: {
    width: '100%',
    padding: '14px',
    fontSize: '16px',
    fontWeight: '600',
    color: '#ffffff',
    background: 'linear-gradient(135deg, #4b5563 0%, #6b7280 100%)',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginTop: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinner: {
    fontSize: '24px',
    animation: 'spin 1s linear infinite',
  },
  message: {
    fontSize: '14px',
    textAlign: 'center',
    padding: '12px',
    borderRadius: '8px',
    background: 'rgba(55, 55, 55, 0.5)',
  },
};

export default VerifyOtp;
