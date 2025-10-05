import React, { useState } from 'react';
import axios from 'axios';
import { AiFillEye, AiFillEyeInvisible, AiOutlineUser, AiOutlineMail, AiOutlinePhone, AiOutlineLock, AiOutlineUpload } from 'react-icons/ai';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('mobile', mobile);
    formData.append('password', password);
    if (file) formData.append('profileImage', file);

    try {
      const res = await axios.post('https://hiet-crossroads-2025.onrender.com/api/users/signup', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage(`${res.data.message}. Redirecting to OTP verification...`);
      setTimeout(() => navigate('/verify'), 2000); // Redirect to OTP page
    } catch (err) {
      setMessage(err.response?.data?.message || 'Registration failed');
    }
    setLoading(false);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.size > 1024 * 1024) {
      setMessage('Image max 1MB');
      return;
    }
    setFile(selectedFile);
  };

  return (
    <>
      {/* CSS Animations */}
      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(100vh) translateX(0px);
          }
          100% {
            transform: translateY(-100px) translateX(100px);
          }
        }
        
        @keyframes floatReverse {
          0% {
            transform: translateY(-100px) translateX(100px);
          }
          100% {
            transform: translateY(100vh) translateX(-100px);
          }
        }

        .particle {
          pointer-events: none;
          z-index: 1;
        }

        .main-content {
          position: relative;
          z-index: 10;
        }
      `}</style>

      <div className="min-h-screen w-full bg-gradient-to-br from-gray-800 via-gray-900 to-black flex items-center justify-center px-4 py-16 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Moving Background Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          {[...Array(150)].map((_, i) => (
            <div
              key={i}
              className="particle absolute bg-white rounded-full opacity-10"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 4 + 1}px`,
                height: `${Math.random() * 4 + 1}px`,
                animation: `float ${Math.random() * 10 + 10}s linear infinite`,
                animationDelay: `${Math.random() * 10}s`,
              }}
            />
          ))}
          
          {/* Larger moving particles */}
          {[...Array(20)].map((_, i) => (
            <div
              key={`large-${i}`}
              className="particle absolute bg-gradient-to-r from-gray-600 to-gray-700 rounded-full opacity-5"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 20 + 10}px`,
                height: `${Math.random() * 20 + 10}px`,
                animation: `floatReverse ${Math.random() * 15 + 15}s linear infinite`,
                animationDelay: `${Math.random() * 15}s`,
              }}
            />
          ))}
        </div>

        {/* Main Container with extra spacing */}
        <div className="main-content relative w-full max-w-sm sm:max-w-md my-16 sm:my-20 z-10">
          {/* Glassmorphism Card */}
          <div className="relative backdrop-blur-2xl bg-white/5 border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl z-10">
            {/* Gradient Border */}
            <div className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-gray-400/10 via-gray-500/10 to-gray-600/10 -m-px pointer-events-none"></div>
            
            {/* Header */}
            <div className="relative text-center mb-6 sm:mb-8 z-10">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full flex items-center justify-center shadow-lg border border-gray-600/30">
                <AiOutlineUser className="text-white text-2xl sm:text-3xl" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                Create Account
              </h1>
              <p className="text-gray-300 text-sm sm:text-base">Join us today</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 relative z-10">
              {/* Name Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                  <AiOutlineUser className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Enter your name"
                  className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 bg-gray-800/30 border border-gray-600/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500/50 focus:border-gray-500/50 transition-all duration-300 text-sm sm:text-base backdrop-blur-sm relative z-10"
                />
              </div>

              {/* Email Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                  <AiOutlineMail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email"
                  className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 bg-gray-800/30 border border-gray-600/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500/50 focus:border-gray-500/50 transition-all duration-300 text-sm sm:text-base backdrop-blur-sm relative z-10"
                />
              </div>

              {/* Mobile Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                  <AiOutlinePhone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  required
                  placeholder="Enter your mobile"
                  className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 bg-gray-800/30 border border-gray-600/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500/50 focus:border-gray-500/50 transition-all duration-300 text-sm sm:text-base backdrop-blur-sm relative z-10"
                />
              </div>

              {/* Password Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                  <AiOutlineLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                  className="w-full pl-10 sm:pl-12 pr-12 py-3 sm:py-4 bg-gray-800/30 border border-gray-600/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500/50 focus:border-gray-500/50 transition-all duration-300 text-sm sm:text-base backdrop-blur-sm relative z-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center text-gray-400 hover:text-white transition-colors duration-200 z-20 cursor-pointer"
                >
                  {showPassword ? (
                    <AiFillEyeInvisible className="h-5 w-5" />
                  ) : (
                    <AiFillEye className="h-5 w-5" />
                  )}
                </button>
              </div>

              {/* File Upload */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                  <AiOutlineUpload className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 bg-gray-800/30 border border-gray-600/30 rounded-xl text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gray-700 file:text-white hover:file:bg-gray-600 file:cursor-pointer cursor-pointer transition-all duration-300 text-sm sm:text-base backdrop-blur-sm relative z-10"
                />
                {file && (
                  <p className="text-gray-300 text-xs mt-1 pl-3">Selected: {file.name}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 sm:py-4 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white font-semibold rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-500/50 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-lg text-sm sm:text-base border border-gray-600/30 relative z-20 cursor-pointer"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                    Creating Account...
                  </div>
                ) : (
                  'Create Account'
                )}
              </button>

              {/* Success/Error Message */}
              {message && (
                <div className={`${message.includes('failed') || message.includes('max') ? 'bg-red-500/10 border-red-500/20' : 'bg-green-500/10 border-green-500/20'} border rounded-xl p-3 sm:p-4 backdrop-blur-sm relative z-10`}>
                  <p className={`${message.includes('failed') || message.includes('max') ? 'text-red-300' : 'text-green-300'} text-sm text-center`}>{message}</p>
                </div>
              )}

              {/* Divider */}
              <div className="relative my-6 z-10">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-600/30"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gray-900 text-gray-400">or</span>
                </div>
              </div>

              {/* Login Link */}
              <div className="text-center relative z-20">
                <p className="text-gray-400 text-sm sm:text-base">
                  Already have an account?{' '}
                  <Link
                    to="/login"
                    className="text-gray-300 hover:text-white font-medium transition-colors duration-200 hover:underline cursor-pointer relative z-30"
                  >
                    Login Now
                  </Link>
                </p>
              </div>
            </form>
          </div>

          {/* Bottom Glow Effect */}
          <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-3/4 h-8 bg-gradient-to-r from-gray-600/10 to-gray-700/10 rounded-full blur-xl pointer-events-none"></div>
        </div>
      </div>
    </>
  );
};

export default Register;
