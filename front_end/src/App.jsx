import React from 'react';
import NavBar from './Components/NavBar/NavBar';
import Footer from './Components/Footer/Footer';
import HeroSection from './Components/HomePage/HeroSection';  

function App() {
  return (
    <div>
      <NavBar />
      {/* Main content can go here */}
      <HeroSection />
      <Footer />
      
    </div>
  );
}

export default App;