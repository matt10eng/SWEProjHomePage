import React from 'react';
import './Resume.css';

const Resume = () => {
  return (
    <section className="resume" id="resume">
      <div className="container">
        <h2 className="section-title">Resume</h2>
        
        {/* Education Section */}
        <div className="resume-section">
          <h3>Education</h3>
          
          <div className="education-item">
            <div className="education-degree">Bachelor of Science in Computer Science, Mathematics</div>
            <div className="education-school">Rutgers University, Newark</div>
            <div className="education-date">Expected Graduation: Fall 2025</div>
            <p>GPA: 3.5 / 4.00</p>
          </div>
        </div>
        
        {/* Skills Section */}
        <div className="resume-section">
          <h3>Skills</h3>
          
          <div className="skills-category">
            <h4>Languages:</h4>
            <div className="skills-list">
              <div className="skill-tag">Python</div>
              <div className="skill-tag">JavaScript</div>
              <div className="skill-tag">TypeScript</div>
              <div className="skill-tag">HTML/CSS</div>
              <div className="skill-tag">PostgreSQL</div>
            </div>
          </div>
          
          <div className="skills-category">
            <h4>Frameworks/Platforms:</h4>
            <div className="skills-list">
              <div className="skill-tag">Langchain</div>
              <div className="skill-tag">React</div>
              <div className="skill-tag">Angular</div>
              <div className="skill-tag">AWS</div>
              <div className="skill-tag">Azure</div>
              <div className="skill-tag">Git</div>
              <div className="skill-tag">Docker</div>
              <div className="skill-tag">Celery</div>
              <div className="skill-tag">Pandas</div>
              <div className="skill-tag">Numpy</div>
            </div>
          </div>
        </div>
        
        {/* Experience Section */}
        <div className="resume-section">
          <h3>Work Experience</h3>
          
          <div className="experience-item">
            <div className="experience-title">Software Engineer</div>
            <div className="experience-company">Cogwheel Analytics</div>
            <div className="experience-date">November 2023 - Present</div>
            <ul>
              <li>Solely designed and developed the company's core Scorecard system and API, enabling hotel clients to benchmark digital marketing KPIs (e.g., Brand.com %, OTA %, Conversion Rate).</li>
              <li>Built an AI-powered PDF data extraction pipeline using custom RAG techniques (section-based chunking, vision+text alignment) to automate report parsing — reducing costs by 99.9% and processing 500+ PDFs/month for under $1.</li>
              <li>Developed an AI recommendation engine that analyzes KPI performance, identifies underperforming areas via impact scores, and suggests data-driven strategies using domain insights from Airtable.</li>
              <li>Engineered asynchronous Celery pipelines for precomputing KPIs, index scores, and final scores, improving frontend load time and system scalability.</li>
              <li>Created robust scoring logic with logarithmic scaling, outlier filtering, and adaptive weight balancing to handle varied hotel data sets.</li>
              <li>Built key Angular UI components including a multi-month picker, enterprise rollup view, and nested expansion tables for clear performance visualization.</li>
            </ul>
          </div>
        </div>
        
        {/* Projects Section */}
        <div className="resume-section">
          <h3>Projects</h3>
          
          <div className="project-item">
            <div className="project-title">Roblox Archetype Attribute System (Lua)</div>
            <p>Designed a stat-based engine in Roblox allowing players to choose archetypes with dynamic attribute interactions and progression curves for balanced gameplay.</p>
          </div>
          
          <div className="project-item">
            <div className="project-title">Football Discord Bot (Python, MongoDB)</div>
            <p>Built a football-themed Discord bot with collectible cards, team management, cooldown-based commands, and persistent game data stored in MongoDB for scalable user tracking.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Resume; 