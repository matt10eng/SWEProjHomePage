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

function App() {
  return (
    <Router basename={process.env.PUBLIC_URL}>
      <Routes>
        <Route path="/calculator" element={<Calculator />} />
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
