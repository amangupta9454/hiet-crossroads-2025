import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Components/Login';
import Register from './Components/Register';
import VerifyOTP from './VerifyOTP'
import Dashboard from './Components/Dashboard';
import Registration from './Components/Registration';
import AdminLogin from './Components/AdminLogin';
import AdminVerifyOTP from './Components/AdminVerifyOTP';
import AdminDashboard from './Components/AdminDashboard';
import NavBar from './Components/NavBar';
import Home from './Components/Home';
import Event from './Components/Event';
import Footer from './Components/Footer';
import Schedule from './Components/Schedule';
import Contact from './Components/Contact';
const App = () => {
  return (
    <div>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/event' element={<Event />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/schedule' element={<Schedule />} />
          <Route path='/login' element={<Login />} />
          <Route path='/registration' element={<Registration />} />
          <Route path='/register' element={<Register />} />
          <Route path='/verify-otp' element={<VerifyOTP />} />
          <Route path='/dashboard' element={<Dashboard />} />
         <Route path='/admin-login' element={<AdminLogin />} />
          <Route path='/admin-verify-otp' element={<AdminVerifyOTP />} />
          <Route path='/admin-dashboard' element={<AdminDashboard />} />
        </Routes>
        <Footer />

      </BrowserRouter>
    </div>
  );
};

export default App;