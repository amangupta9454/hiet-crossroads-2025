import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Calendar, Users, Building2, Trophy, LogOut, Plus, Sparkles } from 'lucide-react';

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [particles, setParticles] = useState([]);
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL || 'https://hiet-crossroads-2025.onrender.com';

  useEffect(() => {
    const particleCount = 30;
    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 5,
    }));
    setParticles(newParticles);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token');
        const [userRes, regRes] = await Promise.all([
          axios.get(`${apiUrl}/api/auth/user`, { headers: { 'x-auth-token': token } }),
          axios.get(`${apiUrl}/api/events/registrations`, { headers: { 'x-auth-token': token } })
        ]);
        setUserData(userRes.data);
        setRegistrations(regRes.data);
      } catch (err) {
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate, apiUrl]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-blue-900 via-slate-800 to-gray-900">
        <div className="relative">
          <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-t-4 border-blue-400"></div>
          <div className="absolute inset-0 animate-ping rounded-full h-20 w-20 border-4 border-blue-400 opacity-20"></div>
        </div>
        <p className="text-white mt-6 text-lg font-medium animate-pulse">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-900 via-slate-800 to-gray-900 overflow-hidden pt-16">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full bg-blue-400 opacity-20"
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
      <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
      <div className="absolute top-40 right-10 w-64 h-64 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-20 left-1/2 w-64 h-64 bg-slate-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
      <div className=" z-0 bg-white/5 backdrop-blur-md border-b border-white/10 sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Dashboard</h1>
                <p className="text-gray-400 text-sm">Welcome back, {userData?.name?.split(' ')[0]}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 rounded-xl transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <LogOut className="w-4 h-4" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>
      <div className="relative z-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {userData && (
          <div className="mb-8 animate-slideInDown">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden hover:shadow-blue-500/20 transition-all duration-500">
              <div className="bg-gradient-to-r from-blue-500 via-cyan-500 to-slate-500 p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
                  <div className="relative">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white/20 backdrop-blur-sm border-4 border-white/40 flex items-center justify-center shadow-2xl">
                      <User className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">{userData.name}</h2>
                  </div>
                </div>
              </div>
              <div className="p-6 sm:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="flex items-start space-x-4 p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 hover:border-blue-400/50 transition-all duration-300 group">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg group-hover:shadow-blue-500/50 transition-all duration-300">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-400 text-xs font-medium mb-1">Email Address</p>
                      <p className="text-white text-sm sm:text-base font-medium truncate">{userData.email}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4 p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 hover:border-cyan-400/50 transition-all duration-300 group">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center shadow-lg group-hover:shadow-cyan-500/50 transition-all duration-300">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-400 text-xs font-medium mb-1">Mobile Number</p>
                      <p className="text-white text-sm sm:text-base font-medium">{userData.mobile}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-blue-400/50 transition-all duration-300 hover:scale-105 group animate-slideInUp">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg group-hover:shadow-blue-500/50 transition-all duration-300">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-white">{registrations.length}</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm font-medium">Total Registrations</p>
          </div>
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-cyan-400/50 transition-all duration-300 hover:scale-105 group animate-slideInUp animation-delay-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center shadow-lg group-hover:shadow-cyan-500/50 transition-all duration-300">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-white">{new Set(registrations.map(r => r.event)).size}</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm font-medium">Unique Events</p>
          </div>
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-slate-400/50 transition-all duration-300 hover:scale-105 group animate-slideInUp animation-delay-400 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-500 to-gray-500 flex items-center justify-center shadow-lg group-hover:shadow-slate-500/50 transition-all duration-300">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-white">{registrations.reduce((sum, r) => sum + r.teamSize, 0)}</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm font-medium">Total Team Members</p>
          </div>
        </div>
        <div className="animate-slideInUp animation-delay-600">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
            <h3 className="text-2xl font-bold text-white flex items-center space-x-3">
              <Calendar className="w-7 h-7 text-blue-400" />
              <span>Event Registrations</span>
            </h3>
            <button
              onClick={() => navigate('/registration')}
              className="flex items-center justify-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <Plus className="w-5 h-5" />
              <span>Register New Event</span>
            </button>
          </div>
          {registrations.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {registrations.map((reg, index) => (
                <div
                  key={reg._id}
                  className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-blue-400/50 transition-all duration-300 hover:scale-105 group"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h4 className="text-lg sm:text-xl font-bold text-white mb-2 capitalize">
                        {reg.event.replace(/-/g, ' ')}
                      </h4>
                      <div className="inline-flex items-center space-x-2 bg-blue-500/20 px-3 py-1 rounded-full border border-blue-400/30">
                        <Trophy className="w-4 h-4 text-blue-400" />
                        <span className="text-blue-400 text-xs font-medium">Registered</span>
                      </div>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg group-hover:shadow-blue-500/50 transition-all duration-300">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-xl border border-white/10">
                      <Users className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-400 text-xs mb-0.5">Team Name</p>
                        <p className="text-white text-sm font-medium truncate">{reg.teamName}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-xl border border-white/10">
                        <Users className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        <div>
                          <p className="text-gray-400 text-xs mb-0.5">Team Size</p>
                          <p className="text-white text-sm font-medium">{reg.teamSize}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-xl border border-white/10">
                        <Building2 className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-gray-400 text-xs mb-0.5">College</p>
                          <p className="text-white text-sm font-medium truncate">{reg.college}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-12 border border-white/20 text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mx-auto mb-6 shadow-2xl">
                <Calendar className="w-10 h-10 text-white" />
              </div>
              <h4 className="text-xl font-bold text-white mb-3">No Registrations Yet</h4>
              <p className="text-gray-400 mb-6 max-w-md mx-auto">
                You haven't registered for any events yet. Start your journey by registering for an exciting event!
              </p>
              <button
                onClick={() => navigate('/registration')}
                className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105 active:scale-95"
              >
                <Plus className="w-5 h-5" />
                <span>Register for an Event</span>
              </button>
            </div>
          )}
        </div>
      </div>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          25% { transform: translateY(-20px) translateX(10px); }
          50% { transform: translateY(-10px) translateX(-10px); }
          75% { transform: translateY(-15px) translateX(5px); }
        }
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -50px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(50px, 10px) scale(1.05); }
        }
        @keyframes slideInDown {
          from { opacity: 0; transform: translateY(-30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        .animation-delay-200 { animation-delay: 0.2s; }
        .animation-delay-400 { animation-delay: 0.4s; }
        .animation-delay-600 { animation-delay: 0.6s; }
        .animate-slideInDown { animation: slideInDown 0.6s ease-out; }
        .animate-slideInUp { animation: slideInUp 0.6s ease-out; }
      `}</style>
    </div>
  );
};

export default Dashboard;