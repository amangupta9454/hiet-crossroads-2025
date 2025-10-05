import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const apiUrl = import.meta.env.VITE_API_URL || 'https://hiet-crossroads-2025.onrender.com';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${apiUrl}/api/admin/login`, { email, password });
      navigate('/admin-verify-otp', { state: { email } });
    } catch (err) {
      alert('Login failed: ' + (err.response?.data?.msg || 'Server error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-800 text-gray-100">
      {/* Particle Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Particle 1 */}
        <div className="absolute w-2 h-2 bg-pink-400 rounded-full animate-float1"></div>
        {/* Particle 2 */}
        <div className="absolute w-3 h-3 bg-gray-300 rounded-full animate-float2"></div>
        {/* Particle 3 */}
        <div className="absolute w-1 h-1 bg-pink-300 rounded-full animate-float3"></div>
        {/* Particle 4 */}
        <div className="absolute w-4 h-4 bg-gray-400 rounded-full animate-float4"></div>
        {/* Particle 5 */}
        <div className="absolute w-2 h-2 bg-pink-500 rounded-full animate-float5"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex justify-center items-center min-h-screen px-4">
        <form
          onSubmit={handleSubmit}
          className="bg-gray-800/90 backdrop-blur-md p-8 rounded-xl shadow-2xl w-full max-w-md border border-gray-700/50 transform transition-all duration-300 hover:shadow-pink-500/20"
        >
          <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-pink-400 to-pink-600 bg-clip-text text-transparent">
            Admin Login
          </h2>
          <div className="space-y-6">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg focus:border-pink-500 focus:ring-2 focus:ring-pink-500/50 transition-colors placeholder-gray-400"
              required
            />
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg focus:border-pink-500 focus:ring-2 focus:ring-pink-500/50 transition-colors placeholder-gray-400"
                required
              />
              <span
                className="absolute right-3 top-3 cursor-pointer text-gray-400 hover:text-pink-400 transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <AiFillEyeInvisible size={24} /> : <AiFillEye size={24} />}
              </span>
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-pink-600 to-pink-700 text-white p-3 rounded-lg hover:from-pink-700 hover:to-pink-800 transition-all duration-300 transform hover:scale-105 disabled:opacity-70 flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
              ) : (
                'Login'
              )}
            </button>
          </div>
        </form>
      </div>

      {/* CSS for Particle Animation */}
      <style>{`
        @keyframes float1 {
          0% { transform: translate(0, 0) scale(1); opacity: 0.7; }
          50% { transform: translate(20vw, 20vh) scale(1.2); opacity: 0.3; }
          100% { transform: translate(0, 0) scale(1); opacity: 0.7; }
        }
        @keyframes float2 {
          0% { transform: translate(0, 0) scale(1); opacity: 0.6; }
          50% { transform: translate(-30vw, 40vh) scale(1.3); opacity: 0.2; }
          100% { transform: translate(0, 0) scale(1); opacity: 0.6; }
        }
        @keyframes float3 {
          0% { transform: translate(0, 0) scale(1); opacity: 0.8; }
          50% { transform: translate(40vw, -20vh) scale(1.1); opacity: 0.4; }
          100% { transform: translate(0, 0) scale(1); opacity: 0.8; }
        }
        @keyframes float4 {
          0% { transform: translate(0, 0) scale(1); opacity: 0.5; }
          50% { transform: translate(-20vw, -30vh) scale(1.4); opacity: 0.1; }
          100% { transform: translate(0, 0) scale(1); opacity: 0.5; }
        }
        @keyframes float5 {
          0% { transform: translate(0, 0) scale(1); opacity: 0.7; }
          50% { transform: translate(30vw, 10vh) scale(1.2); opacity: 0.3; }
          100% { transform: translate(0, 0) scale(1); opacity: 0.7; }
        }

        .animate-float1 { animation: float1 15s infinite ease-in-out; top: 10%; left: 10%; }
        .animate-float2 { animation: float2 18s infinite ease-in-out; top: 30%; right: 20%; }
        .animate-float3 { animation: float3 12s infinite ease-in-out; bottom: 20%; left: 40%; }
        .animate-float4 { animation: float4 20s infinite ease-in-out; top: 50%; right: 10%; }
        .animate-float5 { animation: float5 14s infinite ease-in-out; bottom: 10%; left: 70%; }
      `}</style>
    </div>
  );
};

export default AdminLogin;