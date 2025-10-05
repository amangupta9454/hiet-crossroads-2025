import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import emailjs from '@emailjs/browser';

const Registration = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL || 'https://hiet-crossroads.onrender.com';
  const emailjsServiceId = 'service_1l04eud';
  const emailjsTemplateId = 'template_z5vr25f';
  const emailjsPublicKey = 'aISTiwHw6juUInxbl';

  const events = [
    'code-puzzle',
    'project-exhibition',
    'robo-race',
    'cultural-events',
    'rangoli-competition',
    'food-without-fire',
    'nukkad-natak',
    'singing',
    'technical-poster',
    'dance-competition',
    'rock-band',
    'short-film-maker',
    'ad-mad-show',
    'tresure-hunt'
  ];
  const colleges = [
    'ABESIT, Ghaziabad', 'IMS Engineering College, Ghaziabad', 'ABES Engineering College, Ghaziabad',
    'AKGEC, Ghaziabad', 'JSS Noida', 'RKGIT, Ghaziabad', 'GL Bajaj, Noida',
    'HI-TECH Institute of Engineering and Technology, Ghaziabad', 'NIET', 'GNIOT',
    'Galgotias University', 'Galgotias College', 'KIET', 'Bhagwati Institute of Technology',
    'H.R. Group of Institutions', 'INMANTEC Institutions', 'Delhi Public School (DPS), Ghaziabad',
    'Kendriya Vidyalaya, Ghaziabad', 'OTHER'
  ];
  const schoolClasses = ['9', '10', '11', '12'];
  const collegeCourses = ['btech', 'bpharma', 'bca', 'bba', 'bcom', 'bsc', 'polytechnic', 'mtech', 'mpharma', 'mca', 'mba', 'mcom', 'msc', 'bed'];
  const genders = ['male', 'female', 'other'];

  const [formData, setFormData] = useState({
    event: '',
    teamName: '',
    category: '',
    schoolClass: '',
    course: '',
    branch: '',
    year: '',
    teamSize: 0,
    rollno: '',
    gender: '',
    college: '',
    members: []
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token');
        const res = await axios.get(`${apiUrl}/api/auth/user`, { headers: { 'x-auth-token': token } });
        setUser(res.data);
        setFormData(prev => ({ ...prev, teamLeaderName: res.data.name, mobile: res.data.mobile }));
      } catch (err) {
        console.error('Fetch user error:', err);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [navigate, apiUrl]);

  const handleTeamSizeChange = (size) => {
    setFormData(prev => ({
      ...prev,
      teamSize: parseInt(size),
      members: Array.from({ length: parseInt(size) }, (_, i) => ({
        name: prev.members[i]?.name || '',
        email: prev.members[i]?.email || '',
        course: prev.members[i]?.course || '',
        branch: prev.members[i]?.branch || '',
        year: prev.members[i]?.year || '',
        rollno: prev.members[i]?.rollno || ''
      }))
    }));
  };

  const handleMemberChange = (index, field, value) => {
    setFormData(prev => {
      const newMembers = [...prev.members];
      newMembers[index] = { ...newMembers[index], [field]: value };
      return { ...prev, members: newMembers };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const submitData = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === 'members') {
        submitData.append(key, JSON.stringify(formData[key]));
      } else if (key !== 'teamLeaderName' && key !== 'mobile') {
        submitData.append(key, formData[key]);
      }
    });
    if (e.target.clg_id.files[0]) {
      submitData.append('clg_id', e.target.clg_id.files[0]);
    }

    try {
      // Register the event
      await axios.post(`${apiUrl}/api/events/register`, submitData, {
        headers: { 'x-auth-token': localStorage.getItem('token'), 'Content-Type': 'multipart/form-data' },
        timeout: 30000
      });

      // Send confirmation email using EmailJS
      const emailParams = {
        to_email: user.email,
        teamLeaderName: user.name,
        teamName: formData.teamName,
        teamSize: formData.teamSize + 1, // Including team leader
        eventName: formData.event.replace(/-/g, ' ').toUpperCase(),
      };

      await emailjs.send(emailjsServiceId, emailjsTemplateId, emailParams, emailjsPublicKey);

      alert('Registration successful! Check your email.');
      navigate('/dashboard');
    } catch (err) {
      console.error('Submit error:', err);
      alert('Registration failed: ' + (err.response?.data?.msg || 'Server error'));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-black via-gray-900 to-pink-900">
      <div className="relative">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-pink-500 border-r-4 border-r-transparent"></div>
        <div className="absolute inset-0 rounded-full bg-pink-500/20 blur-xl animate-pulse"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-pink-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(236,72,153,0.1),transparent_50%)] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none"></div>
      
      <form onSubmit={handleSubmit} className="max-w-5xl mx-auto relative">
        <div className="bg-gradient-to-br from-gray-900/90 via-black/90 to-gray-900/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-pink-500/20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 via-transparent to-pink-500/5 pointer-events-none"></div>
          
          <div className="relative p-8 sm:p-10 lg:p-12">
            <div className="text-center mb-10">
              <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-pink-500 via-pink-400 to-white bg-clip-text text-transparent mb-3 tracking-tight">
                Event Registration
              </h2>
              <p className="text-gray-400 text-lg">Crossroad 2025</p>
              <div className="h-1 w-24 bg-gradient-to-r from-transparent via-pink-500 to-transparent mx-auto mt-4 rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="group">
                <label className="block mb-2 font-semibold text-gray-300 text-sm tracking-wide">Team Leader Name</label>
                <input 
                  type="text" 
                  value={user?.name || ''} 
                  readOnly 
                  className="p-4 border border-gray-700/50 rounded-xl w-full bg-black/40 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm group-hover:border-pink-500/30" 
                />
              </div>

              <div className="group">
                <label className="block mb-2 font-semibold text-gray-300 text-sm tracking-wide">Team Leader Mobile</label>
                <input 
                  type="tel" 
                  value={user?.mobile || ''} 
                  readOnly 
                  className="p-4 border border-gray-700/50 rounded-xl w-full bg-black/40 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm group-hover:border-pink-500/30" 
                />
              </div>

              <div className="group">
                <label className="block mb-2 font-semibold text-gray-300 text-sm tracking-wide">Select Event</label>
                <select 
                  value={formData.event} 
                  onChange={(e) => setFormData(prev => ({ ...prev, event: e.target.value }))} 
                  className="p-4 border border-gray-700/50 rounded-xl w-full bg-black/40 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm group-hover:border-pink-500/30 cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22rgb(236%2C72%2C153)%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:1.5rem] bg-[right_0.75rem_center] bg-no-repeat pr-12" 
                  required
                >
                  <option value="" className="bg-gray-900 text-white">Choose Event</option>
                  {events.map(ev => <option key={ev} value={ev} className="bg-gray-900 text-white">{ev.replace(/-/g, ' ').toUpperCase()}</option>)}
                </select>
              </div>

              <div className="group">
                <label className="block mb-2 font-semibold text-gray-300 text-sm tracking-wide">Team Name</label>
                <input 
                  type="text" 
                  value={formData.teamName} 
                  onChange={(e) => setFormData(prev => ({ ...prev, teamName: e.target.value }))} 
                  className="p-4 border border-gray-700/50 rounded-xl w-full bg-black/40 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm group-hover:border-pink-500/30" 
                  required 
                  placeholder="Enter team name"
                />
              </div>

              <div className="group">
                <label className="block mb-2 font-semibold text-gray-300 text-sm tracking-wide">Category</label>
                <select 
                  value={formData.category} 
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value, schoolClass: '', course: '', branch: '', year: '' }))} 
                  className="p-4 border border-gray-700/50 rounded-xl w-full bg-black/40 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm group-hover:border-pink-500/30 cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22rgb(236%2C72%2C153)%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:1.5rem] bg-[right_0.75rem_center] bg-no-repeat pr-12" 
                  required
                >
                  <option value="" className="bg-gray-900 text-white">Choose Category</option>
                  <option value="school student" className="bg-gray-900 text-white">School Student</option>
                  <option value="college student" className="bg-gray-900 text-white">College Student</option>
                </select>
              </div>

              {formData.category === 'school student' && (
                <div className="group">
                  <label className="block mb-2 font-semibold text-gray-300 text-sm tracking-wide">Class</label>
                  <select 
                    value={formData.schoolClass} 
                    onChange={(e) => setFormData(prev => ({ ...prev, schoolClass: e.target.value, year: e.target.value }))} 
                    className="p-4 border border-gray-700/50 rounded-xl w-full bg-black/40 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm group-hover:border-pink-500/30 cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22rgb(236%2C72%2C153)%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:1.5rem] bg-[right_0.75rem_center] bg-no-repeat pr-12" 
                    required
                  >
                    <option value="" className="bg-gray-900 text-white">Choose Class</option>
                    {schoolClasses.map(cls => <option key={cls} value={cls} className="bg-gray-900 text-white">Class {cls}</option>)}
                  </select>
                </div>
              )}

              {formData.category === 'college student' && (
                <>
                  <div className="group">
                    <label className="block mb-2 font-semibold text-gray-300 text-sm tracking-wide">Course</label>
                    <select 
                      value={formData.course} 
                      onChange={(e) => setFormData(prev => ({ ...prev, course: e.target.value }))} 
                      className="p-4 border border-gray-700/50 rounded-xl w-full bg-black/40 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm group-hover:border-pink-500/30 cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22rgb(236%2C72%2C153)%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:1.5rem] bg-[right_0.75rem_center] bg-no-repeat pr-12" 
                      required
                    >
                      <option value="" className="bg-gray-900 text-white">Choose Course</option>
                      {collegeCourses.map(crs => <option key={crs} value={crs} className="bg-gray-900 text-white">{crs.toUpperCase()}</option>)}
                    </select>
                  </div>

                  <div className="group">
                    <label className="block mb-2 font-semibold text-gray-300 text-sm tracking-wide">Branch</label>
                    <input 
                      type="text" 
                      value={formData.branch} 
                      onChange={(e) => setFormData(prev => ({ ...prev, branch: e.target.value }))} 
                      className="p-4 border border-gray-700/50 rounded-xl w-full bg-black/40 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm group-hover:border-pink-500/30" 
                      required 
                      placeholder="Enter branch"
                    />
                  </div>

                  <div className="group">
                    <label className="block mb-2 font-semibold text-gray-300 text-sm tracking-wide">Year</label>
                    <input 
                      type="number" 
                      value={formData.year} 
                      onChange={(e) => setFormData(prev => ({ ...prev, year: e.target.value }))} 
                      className="p-4 border border-gray-700/50 rounded-xl w-full bg-black/40 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm group-hover:border-pink-500/30" 
                      required 
                      min="1" 
                      max="12" 
                      placeholder="Enter year"
                    />
                  </div>
                </>
              )}

              <div className="group">
                <label className="block mb-2 font-semibold text-gray-300 text-sm tracking-wide">Team Size (Excluding Leader)</label>
                <select 
                  value={formData.teamSize} 
                  onChange={(e) => handleTeamSizeChange(e.target.value)} 
                  className="p-4 border border-gray-700/50 rounded-xl w-full bg-black/40 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm group-hover:border-pink-500/30 cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22rgb(236%2C72%2C153)%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:1.5rem] bg-[right_0.75rem_center] bg-no-repeat pr-12" 
                  required
                >
                  {[0,1,2,3,4,5,6,7,8,9,10].map(size => <option key={size} value={size} className="bg-gray-900 text-white">{size} Members</option>)}
                </select>
              </div>

              <div className="group">
                <label className="block mb-2 font-semibold text-gray-300 text-sm tracking-wide">Leader Roll No.</label>
                <input 
                  type="text" 
                  value={formData.rollno} 
                  onChange={(e) => setFormData(prev => ({ ...prev, rollno: e.target.value }))} 
                  className="p-4 border border-gray-700/50 rounded-xl w-full bg-black/40 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm group-hover:border-pink-500/30" 
                  required 
                  maxLength="20" 
                  placeholder="Enter roll number"
                />
              </div>

              <div className="group">
                <label className="block mb-2 font-semibold text-gray-300 text-sm tracking-wide">Leader Gender</label>
                <select 
                  value={formData.gender} 
                  onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))} 
                  className="p-4 border border-gray-700/50 rounded-xl w-full bg-black/40 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm group-hover:border-pink-500/30 cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22rgb(236%2C72%2C153)%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:1.5rem] bg-[right_0.75rem_center] bg-no-repeat pr-12" 
                  required
                >
                  <option value="" className="bg-gray-900 text-white">Choose Gender</option>
                  {genders.map(g => <option key={g} value={g} className="bg-gray-900 text-white">{g.charAt(0).toUpperCase() + g.slice(1)}</option>)}
                </select>
              </div>

              <div className="group">
                <label className="block mb-2 font-semibold text-gray-300 text-sm tracking-wide">College/School</label>
                <select 
                  value={formData.college} 
                  onChange={(e) => setFormData(prev => ({ ...prev, college: e.target.value }))} 
                  className="p-4 border border-gray-700/50 rounded-xl w-full bg-black/40 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm group-hover:border-pink-500/30 cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22rgb(236%2C72%2C153)%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:1.5rem] bg-[right_0.75rem_center] bg-no-repeat pr-12" 
                  required
                >
                  <option value="" className="bg-gray-900 text-white">Choose Institution</option>
                  {colleges.map(col => <option key={col} value={col} className="bg-gray-900 text-white">{col}</option>)}
                </select>
              </div>

              <div className="group md:col-span-2">
                <label className="block mb-2 font-semibold text-gray-300 text-sm tracking-wide">Upload College ID (less than 500KB)</label>
                <div className="relative">
                  <input 
                    type="file" 
                    name="clg_id" 
                    accept="image/*" 
                    className="p-4 border border-gray-700/50 rounded-xl w-full bg-black/40 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm group-hover:border-pink-500/30 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-pink-500 file:text-white hover:file:bg-pink-600 file:cursor-pointer file:transition-all file:duration-300" 
                    required 
                  />
                </div>
              </div>
            </div>

            {formData.teamSize > 0 && (
              <div className="mb-8">
                <div className="flex items-center mb-6">
                  <div className="flex-grow h-px bg-gradient-to-r from-transparent via-pink-500 to-transparent"></div>
                  <h3 className="px-6 text-2xl font-bold bg-gradient-to-r from-pink-500 to-white bg-clip-text text-transparent">
                    Team Members
                  </h3>
                  <div className="flex-grow h-px bg-gradient-to-r from-transparent via-pink-500 to-transparent"></div>
                </div>
                
                <div className="space-y-6">
                  {formData.members.map((member, index) => (
                    <div key={index} className="border border-pink-500/20 p-6 rounded-2xl bg-gradient-to-br from-black/60 to-gray-900/60 backdrop-blur-sm hover:border-pink-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/10">
                      <div className="flex items-center mb-4">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center text-white font-bold text-sm">
                          {index + 1}
                        </div>
                        <h4 className="ml-3 text-lg font-semibold text-gray-300">Member {index + 1}</h4>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <input
                          placeholder="Full Name"
                          value={member.name}
                          onChange={(e) => handleMemberChange(index, 'name', e.target.value)}
                          className="p-3 border border-gray-700/50 rounded-xl bg-black/40 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 hover:border-pink-500/30"
                          required
                        />
                        <input
                          type="email"
                          placeholder="Email Address"
                          value={member.email}
                          onChange={(e) => handleMemberChange(index, 'email', e.target.value)}
                          className="p-3 border border-gray-700/50 rounded-xl bg-black/40 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 hover:border-pink-500/30"
                          required
                        />
                        <input
                          placeholder="Course"
                          value={member.course}
                          onChange={(e) => handleMemberChange(index, 'course', e.target.value)}
                          className="p-3 border border-gray-700/50 rounded-xl bg-black/40 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 hover:border-pink-500/30"
                          required
                        />
                        <input
                          placeholder="Branch"
                          value={member.branch}
                          onChange={(e) => handleMemberChange(index, 'branch', e.target.value)}
                          className="p-3 border border-gray-700/50 rounded-xl bg-black/40 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 hover:border-pink-500/30"
                          required
                        />
                        <input
                          type="number"
                          placeholder="Year"
                          value={member.year}
                          onChange={(e) => handleMemberChange(index, 'year', e.target.value)}
                          className="p-3 border border-gray-700/50 rounded-xl bg-black/40 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 hover:border-pink-500/30"
                          required
                          min="1"
                          max="12"
                        />
                        <input
                          placeholder="Roll Number"
                          value={member.rollno}
                          onChange={(e) => handleMemberChange(index, 'rollno', e.target.value)}
                          className="p-3 border border-gray-700/50 rounded-xl bg-black/40 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 hover:border-pink-500/30"
                          required
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-gradient-to-r from-pink-600 via-pink-500 to-pink-600 text-white p-5 rounded-xl font-bold text-lg hover:from-pink-700 hover:via-pink-600 hover:to-pink-700 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-pink-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden group"
            >
              <span className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
              {submitting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-white mr-3"></div>
                  Processing Registration...
                </div>
              ) : (
                <span className="relative z-10">Submit Registration</span>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Registration;
