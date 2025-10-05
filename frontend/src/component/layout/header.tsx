import React from 'react';
import logo from '../../assets/logo.svg';
import '../../style/header.css';
const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="header-left">
        <img src={logo} alt="Catabloc Logo" className="header_logo" />
        <span className="header_title">CATABLOC</span>
      </div>
      <nav className="header-middle">
        <a href="#learn" className="header_text">LEARN</a>
        <a href="#about" className="header_text">ABOUT US</a>
        <a href="#help" className="header_text">HELP CENTER</a>
      </nav>
      
      <button className="header-right">
        SIGN IN
      </button>
    </header>
  );
};
export default Header;
