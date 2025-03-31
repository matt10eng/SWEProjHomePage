import React from 'react';
import './Contact.css';

const Contact = () => {
  return (
    <section className="contact" id="contact">
      <div className="container">
        <h2 className="section-title">Contact Information</h2>
        <div className="contact-content">
          <div className="contact-item">
            <span className="contact-label">Email:</span>
            <a 
              href="mailto:mattheweng10@gmail.com" 
              className="contact-link"
            >
              mattheweng10@gmail.com
            </a>
          </div>
          <div className="contact-item">
            <span className="contact-label">Phone:</span>
            <span className="contact-value">(973) 960-8007</span>
          </div>
          <div className="contact-item">
            <span className="contact-label">LinkedIn:</span>
            <a 
              href="https://www.linkedin.com/in/matthew-eng-56977a280/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="contact-link"
            >
              linkedin.com/in/matthew-eng-56977a280
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact; 