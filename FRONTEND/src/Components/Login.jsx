// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate, Link } from 'react-router-dom';
// import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';

// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const apiUrl = import.meta.env.VITE_API_URL || 'https://hiet-crossroads.onrender.com';
//   console.log('API URL in Login:', apiUrl);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const res = await axios.post(`${apiUrl}/api/auth/login`, { email, password });
//       localStorage.setItem('token', res.data.token);
//       navigate('/dashboard');
//     } catch (err) {
//       console.error('Login error:', err);
//       alert('Login failed: ' + (err.response?.data?.msg || err.response?.data?.error || 'Server error'));
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex justify-center items-center h-screen bg-gray-100">
//       <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
//         <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
//         <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           className="mb-4 p-3 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
//           required
//         />
//         <div className="relative mb-4">
//           <input
//             type={showPassword ? 'text' : 'password'}
//             placeholder="Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             className="p-3 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
//             required
//           />
//           <span
//             className="absolute right-3 top-3 cursor-pointer text-gray-600"
//             onClick={() => setShowPassword(!showPassword)}
//           >
//             {showPassword ? <AiFillEyeInvisible size={24} /> : <AiFillEye size={24} />}
//           </span>
//         </div>
//         <Link to="/register">Register now</Link>
//         <button
//           type="submit"
//           className="bg-blue-500 text-white p-3 rounded w-full hover:bg-blue-600 transition disabled:opacity-50"
//           disabled={loading}
//         >
//           {loading ? (
//             <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mx-auto"></div>
//           ) : (
//             'Login'
//           )}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default Login;

// new login

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { LogIn, Mail, Lock, Sparkles } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [particles, setParticles] = useState([]);
  const navigate = useNavigate();

  const apiUrl = import.meta.env.VITE_API_URL || 'https://hiet-crossroads-2025.onrender.com';
  console.log('API URL in Login:', apiUrl);

  useEffect(() => {
    const particleCount = 50;
    const newParticles = [];
    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 1,
        duration: Math.random() * 20 + 10,
        delay: Math.random() * 5,
      });
    }
    setParticles(newParticles);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${apiUrl}/api/auth/login`, { email, password });
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      alert('Login failed: ' + (err.response?.data?.msg || err.response?.data?.error || 'Server error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 overflow-hidden py-8 px-4 sm:py-12 md:py-16 lg:py-20">
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full bg-teal-400 opacity-20 animate-float"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              animation: `float ${particle.duration}s infinite ease-in-out`,
              animationDelay: `${particle.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Gradient Orbs */}
      <div className="absolute top-20 left-10 w-48 h-48 md:w-72 md:h-72 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-40 right-10 w-48 h-48 md:w-72 md:h-72 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-20 left-1/2 w-48 h-48 md:w-72 md:h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      {/* Main Container */}
      <div className="relative w-full max-w-7xl mx-auto pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          
          {/* Left Side - Branding Section */}
          <div className="hidden lg:flex flex-col justify-center space-y-8 px-8 animate-slideInLeft">
            <div className="space-y-6">
              <div className="inline-flex items-center space-x-3 bg-white/5 backdrop-blur-sm px-6 py-3 rounded-full border border-white/10">
                <Sparkles className="w-5 h-5 text-teal-400 animate-pulse" />
                <span className="text-teal-400 font-semibold text-sm tracking-wide">WELCOME BACK</span>
              </div>
              
              <h1 className="text-5xl xl:text-6xl font-bold text-white leading-tight">
                Continue Your
                <span className="block mt-2 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent animate-shimmerText">
                  Innovation Journey
                </span>
              </h1>
              
              <p className="text-gray-300 text-lg leading-relaxed">
                Access your personalized dashboard, track your registrations, and stay connected with the most exciting technical festival. Your journey continues here.
              </p>
              
              <div className="grid grid-cols-3 gap-4 pt-6">
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 hover:border-teal-400/50 transition-all duration-300 hover:scale-105">
                  <div className="text-3xl font-bold text-teal-400">24/7</div>
                  <div className="text-gray-400 text-sm mt-1">Access</div>
                </div>
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 hover:border-emerald-400/50 transition-all duration-300 hover:scale-105">
                  <div className="text-3xl font-bold text-emerald-400">Live</div>
                  <div className="text-gray-400 text-sm mt-1">Updates</div>
                </div>
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 hover:border-cyan-400/50 transition-all duration-300 hover:scale-105">
                  <div className="text-3xl font-bold text-cyan-400">Fast</div>
                  <div className="text-gray-400 text-sm mt-1">Response</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Form Section */}
          <div className="flex justify-center items-center px-4 sm:px-6 lg:px-8">
            <form 
              onSubmit={handleSubmit} 
              className="relative bg-white/10 backdrop-blur-xl p-6 sm:p-8 lg:p-10 rounded-3xl shadow-2xl w-full max-w-md border border-white/20 transform transition-all duration-500 hover:shadow-teal-500/30 animate-slideInRight"
            >
              {/* Mobile Title */}
              <div className="lg:hidden text-center mb-6">
                <div className="inline-flex items-center space-x-2 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10 mb-4">
                  <Sparkles className="w-4 h-4 text-teal-400 animate-pulse" />
                  <span className="text-teal-400 font-semibold text-xs tracking-wide">WELCOME BACK</span>
                </div>
              </div>

              {/* Form Title */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 mb-4 shadow-lg shadow-teal-500/50 animate-bounce-slow">
                  <LogIn className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2 animate-fadeIn">
                  Welcome Back
                </h2>
                <p className="text-gray-400 text-sm">Sign in to continue</p>
                <div className="h-1 w-24 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 mx-auto rounded-full mt-3 animate-shimmer"></div>
              </div>

              {/* Email Input */}
              <div className="mb-5 group">
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-4 pl-12 bg-white/5 border-2 border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-teal-400 focus:bg-white/10 transition-all duration-300 hover:border-white/30 focus:scale-[1.02] peer"
                    required
                  />
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 peer-focus:text-teal-400 transition-colors duration-300" />
                </div>
                <div className="h-0.5 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 scale-x-0 group-focus-within:scale-x-100 transition-transform duration-500 rounded-full mt-1"></div>
              </div>

              {/* Password Input */}
              <div className="mb-6 group">
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-4 pl-12 pr-12 bg-white/5 border-2 border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-teal-400 focus:bg-white/10 transition-all duration-300 hover:border-white/30 focus:scale-[1.02] peer"
                    required
                  />
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 peer-focus:text-teal-400 transition-colors duration-300" />
                  <span
                    className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-teal-400 transition-all duration-300 hover:scale-110 active:scale-95"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <AiFillEyeInvisible size={22} /> : <AiFillEye size={22} />}
                  </span>
                </div>
                <div className="h-0.5 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 scale-x-0 group-focus-within:scale-x-100 transition-transform duration-500 rounded-full mt-1"></div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="relative w-full p-4 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white font-semibold rounded-xl overflow-hidden group hover:shadow-2xl hover:shadow-teal-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-95 mb-6"
                disabled={loading}
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-20 transition-opacity duration-300">
                  <span className="absolute inset-0 animate-shimmerOverlay bg-gradient-to-r from-transparent via-white to-transparent"></span>
                </span>
                <span className="relative z-10 flex items-center justify-center">
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Signing In...</span>
                    </div>
                  ) : (
                    'Sign In'
                  )}
                </span>
              </button>

              {/* Register Link */}
              <div className="text-center">
                <span className="text-gray-300 text-sm">Don't have an account? </span>
                <Link 
                  to="/register" 
                  className="text-teal-400 hover:text-cyan-400 text-sm font-semibold transition-all duration-300 hover:underline"
                >
                  Register now
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          25% {
            transform: translateY(-20px) translateX(10px);
          }
          50% {
            transform: translateY(-10px) translateX(-10px);
          }
          75% {
            transform: translateY(-15px) translateX(5px);
          }
        }

        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(20px, -50px) scale(1.1);
          }
          50% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          75% {
            transform: translate(50px, 10px) scale(1.05);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes shimmer {
          0% {
            transform: scaleX(0.5);
            opacity: 0.5;
          }
          50% {
            transform: scaleX(1);
            opacity: 1;
          }
          100% {
            transform: scaleX(0.5);
            opacity: 0.5;
          }
        }

        @keyframes shimmerText {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        @keyframes shimmerOverlay {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .animate-fadeIn {
          animation: fadeIn 1s ease-out;
        }

        .animate-shimmer {
          animation: shimmer 2s ease-in-out infinite;
        }

        .animate-shimmerText {
          background-size: 200% 200%;
          animation: shimmerText 3s ease-in-out infinite;
        }

        .animate-shimmerOverlay {
          animation: shimmerOverlay 2s ease-in-out infinite;
        }

        .animate-slideInLeft {
          animation: slideInLeft 0.8s ease-out;
        }

        .animate-slideInRight {
          animation: slideInRight 0.8s ease-out;
        }

        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Login;
