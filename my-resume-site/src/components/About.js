import React from 'react';
import './About.css';

const About = () => {
  return (
    <section className="about" id="about">
      <div className="container">
        <h2 className="section-title">About Me</h2>
        <div className="about-content">
          <p>
            I am Matthew Eng, a Software Engineer with expertise in Python, JavaScript/TypeScript, 
            and various web frameworks. Currently pursuing a Bachelor of Science in Computer Science 
            and Mathematics at Rutgers University with an expected graduation in Fall 2025.
          </p>
          <p>
            I have professional experience building AI-powered systems, data extraction pipelines, 
            and enterprise-level web applications. My technical skills include working with 
            Langchain, React, Angular, AWS, Azure, and database technologies.
          </p>
          <p>
            I'm passionate about developing efficient, scalable solutions to complex problems
            and continuously expanding my knowledge in software engineering and AI technologies.
          </p>
          <div className="resume-download">
            <a href="/resume.pdf" download className="download-button">
              Download Resume PDF
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About; 