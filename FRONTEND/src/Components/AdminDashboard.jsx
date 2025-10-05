import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const AdminDashboard = () => {
  const [adminData, setAdminData] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [overallRegistrations, setOverallRegistrations] = useState([]);
  const [eventRegistrations, setEventRegistrations] = useState({});
  const [loading, setLoading] = useState(true);
  const [editModal, setEditModal] = useState(false);
  const [cancelModal, setCancelModal] = useState(false);
  const [selectedReg, setSelectedReg] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [reason, setReason] = useState('');
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL || 'https://hiet-crossroads-2025.onrender.com';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        if (!token) throw new Error('No token');
        const config = { headers: { 'x-auth-token': token } };
        const [adminRes, analyticsRes, usersRes, overallRegsRes, eventRegsRes] = await Promise.all([
          axios.get(`${apiUrl}/api/admin/data`, config),
          axios.get(`${apiUrl}/api/admin/analytics`, config),
          axios.get(`${apiUrl}/api/admin/users`, config),  // New endpoint for users
          axios.get(`${apiUrl}/api/admin/overall-registrations`, config),  // New for overall
          axios.get(`${apiUrl}/api/admin/registrations`, config)  // Event-specific
        ]);
        setAdminData(adminRes.data);
        setAnalytics(analyticsRes.data);
        setUsers(usersRes.data);
        setOverallRegistrations(overallRegsRes.data);

        // Group event registrations by event
        const grouped = {};
        eventRegsRes.data.forEach(reg => {
          if (!grouped[reg.event]) grouped[reg.event] = [];
          grouped[reg.event].push(reg);
        });
        setEventRegistrations(grouped);
      } catch (err) {
        console.error('Dashboard error:', err);
        navigate('/admin-login');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate, apiUrl]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin-login');
  };

  const handleExport = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await axios.get(`${apiUrl}/api/admin/export`, {
        headers: { 'x-auth-token': token },
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'full_data.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('Export failed');
    }
  };

  const openEdit = (reg, event) => {
    setSelectedReg({ ...reg });
    setSelectedEvent(event);
    setEditModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('adminToken');
      const config = { headers: { 'x-auth-token': token } };
      const updatedReg = await axios.put(`${apiUrl}/api/admin/registrations/${selectedReg._id}`, selectedReg, config);
      // Update local state
      setEventRegistrations(prev => ({
        ...prev,
        [selectedEvent]: prev[selectedEvent].map(r => r._id === selectedReg._id ? updatedReg.data : r)
      }));
      setOverallRegistrations(prev => prev.map(r => r._id === selectedReg._id ? updatedReg.data : r));
      setEditModal(false);
    } catch (err) {
      alert('Update failed: ' + (err.response?.data?.msg || 'Server error'));
    }
  };

  const openCancel = (reg, event) => {
    setSelectedReg(reg);
    setSelectedEvent(event);
    setCancelModal(true);
  };

  const handleCancel = async () => {
    if (!reason.trim()) {
      alert('Please enter a reason for cancellation.');
      return;
    }
    try {
      const token = localStorage.getItem('adminToken');
      const config = { headers: { 'x-auth-token': token } };
      await axios.post(`${apiUrl}/api/admin/registrations/${selectedReg._id}/cancel`, { reason }, config);
      const updatedReg = { ...selectedReg, isCanceled: true, cancelReason: reason };
      // Update local state
      setEventRegistrations(prev => ({
        ...prev,
        [selectedEvent]: prev[selectedEvent].map(r => r._id === selectedReg._id ? updatedReg : r)
      }));
      setOverallRegistrations(prev => prev.map(r => r._id === selectedReg._id ? updatedReg : r));
      setCancelModal(false);
      setReason('');
      alert('Registration canceled and email sent.');
    } catch (err) {
      alert('Cancel failed: ' + (err.response?.data?.msg || 'Server error'));
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen bg-gray-900">
      <motion.div 
        className="animate-spin rounded-full h-16 w-16 border-t-4 border-pink-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      ></motion.div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-7xl mx-auto"
      >
        <div className="bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-gray-700/50">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-pink-600 bg-clip-text text-transparent">Admin Dashboard</h2>
            <button 
              onClick={handleLogout} 
              className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Logout
            </button>
          </div>

          {/* Admin Info */}
          {adminData && (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-12 p-6 bg-gray-900/50 rounded-xl border border-gray-700/30"
            >
              <h3 className="text-2xl font-semibold mb-4 text-pink-400">Admin Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <p><strong className="text-gray-400">Name:</strong> <span className="ml-2">{adminData.name}</span></p>
                <p><strong className="text-gray-400">Email:</strong> <span className="ml-2">{adminData.email}</span></p>
                <p><strong className="text-gray-400">Mobile:</strong> <span className="ml-2">{adminData.mobile}</span></p>
                <p><strong className="text-gray-400">Role:</strong> <span className="ml-2">{adminData.role}</span></p>
              </div>
            </motion.div>
          )}

          {/* Analytics */}
          {analytics && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-12 p-6 bg-gray-900/50 rounded-xl border border-gray-700/30"
            >
              <h3 className="text-2xl font-semibold mb-6 text-pink-400">Analytics Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-gray-800 rounded-lg text-center shadow-inner border border-pink-500/20 hover:border-pink-500/40 transition-all duration-300">
                  <p className="text-4xl font-bold text-pink-400 mb-2">{analytics.totalUsers}</p>
                  <p className="text-gray-300">Total Users</p>
                </div>
                <div className="p-6 bg-gray-800 rounded-lg text-center shadow-inner border border-pink-500/20 hover:border-pink-500/40 transition-all duration-300">
                  <p className="text-4xl font-bold text-pink-400 mb-2">{analytics.totalRegistrations}</p>
                  <p className="text-gray-300">Total Registrations</p>
                </div>
                <div className="p-6 bg-gray-800 rounded-lg text-center shadow-inner border border-pink-500/20 hover:border-pink-500/40 transition-all duration-300">
                  <p className="text-4xl font-bold text-red-400 mb-2">{analytics.totalCanceled}</p>
                  <p className="text-gray-300">Total Canceled</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Export Button */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-12 flex justify-end"
          >
            <button 
              onClick={handleExport} 
              className="bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-4 rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-md hover:shadow-lg flex items-center"
            >
              <span className="mr-2">📊</span> Export Full Data as Excel
            </button>
          </motion.div>

          {/* Users Section */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-12"
          >
            <h3 className="text-2xl font-semibold mb-4 text-pink-400">Users</h3>
            <div className="overflow-x-auto rounded-xl border border-gray-700/30">
              <table className="w-full">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="p-4 text-left">Name</th>
                    <th className="p-4 text-left">Email</th>
                    <th className="p-4 text-left">Mobile</th>
                    <th className="p-4 text-left">Verified</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {users.map((user, index) => (
                      <motion.tr 
                        key={user._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-t border-gray-700/50 hover:bg-gray-800/50 transition-colors"
                      >
                        <td className="p-4">{user.name}</td>
                        <td className="p-4">{user.email}</td>
                        <td className="p-4">{user.mobile}</td>
                        <td className="p-4">{user.isVerified ? 'Yes' : 'No'}</td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </motion.section>

          {/* Overall Registrations Section */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mb-12"
          >
            <h3 className="text-2xl font-semibold mb-4 text-pink-400">Overall Registrations</h3>
            <div className="overflow-x-auto rounded-xl border border-gray-700/30">
              <table className="w-full">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="p-4 text-left">Event</th>
                    <th className="p-4 text-left">Team Name</th>
                    <th className="p-4 text-left">Category</th>
                    <th className="p-4 text-left">College</th>
                    <th className="p-4 text-left">Team Size</th>
                    <th className="p-4 text-left">Status</th>
                    <th className="p-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {overallRegistrations.map((reg, index) => (
                      <motion.tr 
                        key={reg._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-t border-gray-700/50 hover:bg-gray-800/50 transition-colors"
                      >
                        <td className="p-4">{reg.event.replace(/-/g, ' ')}</td>
                        <td className="p-4">{reg.teamName}</td>
                        <td className="p-4">{reg.category}</td>
                        <td className="p-4">{reg.college}</td>
                        <td className="p-4">{reg.teamSize}</td>
                        <td className="p-4">
                          <span className={reg.isCanceled ? 'text-red-400' : 'text-green-400'}>
                            {reg.isCanceled ? 'Canceled' : 'Active'}
                          </span>
                        </td>
                        <td className="p-4 flex space-x-2">
                          <button 
                            onClick={() => openEdit(reg, reg.event)} 
                            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                          >
                            Edit
                          </button>
                          {!reg.isCanceled && (
                            <button 
                              onClick={() => openCancel(reg, reg.event)} 
                              className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                            >
                              Cancel
                            </button>
                          )}
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </motion.section>

          {/* Event-Specific Sections */}
          {Object.keys(eventRegistrations).map((event, sectionIndex) => (
            <motion.section 
              key={event}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 + sectionIndex * 0.1 }}
              className="mb-12"
            >
              <h3 className="text-2xl font-semibold mb-4 text-pink-400 capitalize">{event.replace(/-/g, ' ')} Event Details</h3>
              <div className="overflow-x-auto rounded-xl border border-gray-700/30">
                <table className="w-full">
                  <thead className="bg-gray-800">
                    <tr>
                      <th className="p-4 text-left">Team Name</th>
                      <th className="p-4 text-left">Leader Name</th>
                      <th className="p-4 text-left">Email</th>
                      <th className="p-4 text-left">Mobile</th>
                      <th className="p-4 text-left">College</th>
                      <th className="p-4 text-left">Course</th>
                      <th className="p-4 text-left">Branch</th>
                      <th className="p-4 text-left">Year</th>
                      <th className="p-4 text-left">Roll No</th>
                      <th className="p-4 text-left">Gender</th>
                      <th className="p-4 text-left">Team Size</th>
                      <th className="p-4 text-left">Members</th>
                      <th className="p-4 text-left">Status</th>
                      <th className="p-4 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {eventRegistrations[event].map((reg, index) => (
                        <motion.tr 
                          key={reg._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="border-t border-gray-700/50 hover:bg-gray-800/50 transition-colors"
                        >
                          <td className="p-4">{reg.teamName}</td>
                          <td className="p-4">{reg.teamLeaderName}</td>
                          <td className="p-4">{reg.email}</td>
                          <td className="p-4">{reg.mobile}</td>
                          <td className="p-4">{reg.college}</td>
                          <td className="p-4">{reg.course}</td>
                          <td className="p-4">{reg.branch || 'N/A'}</td>
                          <td className="p-4">{reg.year}</td>
                          <td className="p-4">{reg.rollno}</td>
                          <td className="p-4 capitalize">{reg.gender}</td>
                          <td className="p-4">{reg.teamSize}</td>
                          <td className="p-4">
                            {reg.teamMembers?.length > 0 ? (
                              <ul className="list-disc pl-4">
                                {reg.teamMembers.map((member, i) => (
                                  <li key={i} className="text-sm">
                                    {member.name} ({member.email}, {member.course}, {member.branch}, Year {member.year}, Roll {member.rollno})
                                  </li>
                                ))}
                              </ul>
                            ) : 'No members'}
                          </td>
                          <td className="p-4">
                            <span className={reg.isCanceled ? 'text-red-400' : 'text-green-400'}>
                              {reg.isCanceled ? 'Canceled' : 'Active'}
                            </span>
                          </td>
                          <td className="p-4 flex space-x-2">
                            <button 
                              onClick={() => openEdit(reg, event)} 
                              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                            >
                              Edit
                            </button>
                            {!reg.isCanceled && (
                              <button 
                                onClick={() => openCancel(reg, event)} 
                                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                              >
                                Cancel
                              </button>
                            )}
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            </motion.section>
          ))}

          {/* Edit Modal */}
          <AnimatePresence>
            {editModal && selectedReg && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
              >
                <motion.div 
                  initial={{ scale: 0.95, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.95, y: 20 }}
                  className="bg-gray-800 p-8 rounded-2xl w-full max-w-2xl mx-4 border border-gray-700/50"
                >
                  <h3 className="text-2xl font-semibold mb-6 text-pink-400">Edit Registration</h3>
                  <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Team Name</label>
                      <input
                        type="text"
                        value={selectedReg.teamName || ''}
                        onChange={(e) => setSelectedReg({ ...selectedReg, teamName: e.target.value })}
                        className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg focus:border-pink-500 transition"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Leader Name</label>
                      <input
                        type="text"
                        value={selectedReg.teamLeaderName || ''}
                        onChange={(e) => setSelectedReg({ ...selectedReg, teamLeaderName: e.target.value })}
                        className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg focus:border-pink-500 transition"
                      />
                    </div>
                    {/* Add more fields as needed, e.g., college, course, etc. */}
                    <div className="col-span-full flex justify-end space-x-4 mt-6">
                      <button 
                        type="button" 
                        onClick={() => setEditModal(false)} 
                        className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit" 
                        className="px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition"
                      >
                        Update
                      </button>
                    </div>
                  </form>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Cancel Modal */}
          <AnimatePresence>
            {cancelModal && selectedReg && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
              >
                <motion.div 
                  initial={{ scale: 0.95, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.95, y: 20 }}
                  className="bg-gray-800 p-8 rounded-2xl w-full max-w-lg mx-4 border border-gray-700/50"
                >
                  <h3 className="text-2xl font-semibold mb-6 text-pink-400">Cancel Registration</h3>
                  <p className="mb-4 text-gray-300">Enter reason for canceling {selectedReg.teamName} in {selectedReg.event.replace(/-/g, ' ')}:</p>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg focus:border-pink-500 transition mb-6"
                    rows="4"
                    placeholder="Detailed reason..."
                    required
                  />
                  <div className="flex justify-end space-x-4">
                    <button 
                      type="button" 
                      onClick={() => { setCancelModal(false); setReason(''); }} 
                      className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleCancel} 
                      className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                    >
                      Confirm Cancel
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;