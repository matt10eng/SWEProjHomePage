import React from 'react';
import './components/global.css';
import Header from './components/Header';
import RutgersLink from './components/RutgersLink';
import About from './components/About';
import Resume from './components/Resume';
import Contact from './components/Contact';
import Footer from './components/Footer';
import DarkModeToggle from './components/DarkModeToggle';

function App() {
  return (
    <div className="App">
      <DarkModeToggle />
      <Header />
      <RutgersLink />
      <main>
        <About />
        <Resume />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default App;
