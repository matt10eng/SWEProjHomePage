import React from 'react';
import { Link } from 'react-router-dom';
import './Projects.css';

const Projects = () => {
  return (
    <section className="projects" id="projects">
      <div className="container">
        <h2 className="section-title">Projects</h2>
        
        <div className="projects-grid">
          {/* Calculator Project Card */}
          <div className="project-card">
            <div className="project-preview calculator-preview">
              <div className="calc-preview-display">123</div>
              <div className="calc-preview-buttons">
                <div className="calc-btn">7</div>
                <div className="calc-btn">8</div>
                <div className="calc-btn">9</div>
                <div className="calc-btn">÷</div>
                <div className="calc-btn">4</div>
                <div className="calc-btn">5</div>
                <div className="calc-btn">6</div>
                <div className="calc-btn">×</div>
                <div className="calc-btn">1</div>
                <div className="calc-btn">2</div>
                <div className="calc-btn">3</div>
                <div className="calc-btn">-</div>
                <div className="calc-btn">0</div>
                <div className="calc-btn">.</div>
                <div className="calc-btn">=</div>
                <div className="calc-btn">+</div>
              </div>
            </div>
            <div className="project-info">
              <h3>Calculator App</h3>
              <p>A fully functional calculator built with React that handles basic arithmetic operations.</p>
              <Link to="/calculator" className="view-project-btn">
                Try Calculator
              </Link>
            </div>
          </div>
          
          {/* Other Project Cards */}
          <div className="project-card">
            <div className="project-info">
              <h3>Roblox Archetype Attribute System</h3>
              <p>Designed a stat-based engine in Roblox allowing players to choose archetypes with dynamic attribute interactions and progression curves for balanced gameplay.</p>
              <a href="#" className="view-project-btn">Coming Soon</a>
            </div>
          </div>
          
          <div className="project-card">
            <div className="project-info">
              <h3>Football Discord Bot</h3>
              <p>Built a football-themed Discord bot with collectible cards, team management, cooldown-based commands, and persistent game data stored in MongoDB for scalable user tracking.</p>
              <a href="#" className="view-project-btn">Coming Soon</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects; 