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
  // Determine the basename based on the environment
  // For GitHub Pages, we need '/SWEProjHomePage'
  // For Vercel, we need '/'
  const isVercel = window.location.hostname.includes('vercel.app');
  const basename = isVercel ? '/' : '/SWEProjHomePage';

  return (
    <Router basename={basename}>
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
