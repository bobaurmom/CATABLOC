import React from "react";
import "../../style/footer.css";
import logo from "../../assets/logo.svg";
const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <div className="footer-brand">
            <div className="footer-icon">
              <img src={logo} alt="Catabloc Logo" className="footer-logo" />
            </div>
            <span className="footer-title">CATABLOC</span>
          </div>
          <div className="footer-links">
            <a href="#" className="footer-link">
              About
            </a>
            <a href="#" className="footer-link">
              Community
            </a>
            <a href="#" className="footer-link">
              Help Center
            </a>
          </div>
        </div>
        <div className="footer-section">
          <h3 className="footer-heading">Practice</h3>
          <div className="footer-links">
            <a href="#" className="footer-link">
              Challenge
            </a>
            <span className="footer-coming-soon">Coming Soon...</span>
            <span className="footer-coming-soon">Coming Soon...</span>
            <span className="footer-coming-soon">Coming Soon...</span>
          </div>
        </div>
        <div className="footer-section">
          <h3 className="footer-heading">Learn More</h3>
          <div className="footer-links">
            <a
              href="https://www.geeksforgeeks.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
            >
              GeeksforGeeks
            </a>
            <a
              href="https://www.programiz.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
            >
              Programiz
            </a>
            <a
              href="https://www.w3schools.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
            >
              W3Schools
            </a>
            <a
              href="https://www.codedex.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
            >
              Codedex
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
