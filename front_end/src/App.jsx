import React from 'react';
import { Routes, Route } from "react-router-dom";
import NavBar from './Components/NavBar/NavBar';
import Footer from './Components/Footer/Footer';
import Home from './Components/HomePage/Home';  
import Resources from './Components/ResourceManagement/Resources';
import CreateBooking from './Components/BookingManagement/BookingForm';
import BookingForm from './Components/BookingManagement/BookingForm';
import MyBookings from "./Components/BookingManagement/MyBookings";
import AdminBookings from "./Components/BookingManagement/AdminBookings";

function App() {
  return (
    <div>
      <NavBar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/create-booking/:id" element={<BookingForm />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/admin-bookings" element={<AdminBookings />} />
      </Routes>

      <Footer />
    </div>
  );
}

export default App;