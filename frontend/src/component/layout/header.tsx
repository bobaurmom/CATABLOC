import React from "react";
import logo from "../../assets/logo.svg";
import "../../style/header.css";
import Btn from "../ui/button";
const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="header-left">
        <a href="/">
          <img src={logo} alt="Catabloc Logo" className="header_logo" />
        </a>
        <span className="header_title">CATABLOC</span>
      </div>
      <nav className="header-middle">
        <a href="/dashboard" className="header_text">
          LEARN
        </a>
        <a href="#about" className="header_text">
          ABOUT US
        </a>
        <a href="#help" className="header_text">
          HELP CENTER
        </a>
      </nav>

      <a href="/register">
        <Btn text="Sign Up"></Btn>
      </a>
    </header>
  );
};
export default Header;
