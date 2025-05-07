import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './components/global.css';
import Header from './components/Header';
import Navigation from './components/Navigation';
import RutgersLink from './components/RutgersLink';
import About from './components/About';
import Resume from './components/Resume';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';
import DarkModeToggle from './components/DarkModeToggle';
import Calculator from './components/Calculator';
import Ecommerce from './components/Ecommerce';

function App() {
  // The homepage setting in package.json now controls the basename
  // For GitHub Pages, the deploy script sets it to https://matt10eng.github.io/SWEProjHomePage
  // For Vercel, it's set to "."
  // This ensures all assets load from the correct paths
  
  return (
    <Router>
      <Routes>
        <Route path="/calculator" element={<Calculator />} />
        <Route path="/ecommerce/*" element={<Ecommerce />} />
        <Route path="/" element={
          <div className="App">
            <DarkModeToggle />
            <Header />
            <Navigation />
            <RutgersLink />
            <main>
              <About />
              <Projects />
              <Resume />
              <Contact />
            </main>
            <Footer />
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;
