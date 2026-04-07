import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from './Components/NavBar/NavBar';
import Footer from './Components/Footer/Footer';
import Home from './Components/HomePage/Home';  
import Resources from './Components/ResourceManagement/Resources';
import LoginPage from './userManagement/pages/LoginPage';
import AdminDashboard from './userManagement/pages/AdminDashboard';
import UserDashboard from './userManagement/pages/UserDashboard';

function App() {
  return (
    <div>
      <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Routes>
      <Footer />
      </BrowserRouter>
      
    </div>
  );
}

export default App;